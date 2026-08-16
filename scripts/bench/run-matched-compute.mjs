#!/usr/bin/env node
import { access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  appendJsonl,
  asPositiveInt,
  clampText,
  parseArgs,
  readJsonl,
  scoreTask,
  sha256File,
  summarizeTrials,
  usageSum,
  writeJson,
} from './lib.mjs';
import { normalizeAnswerForComparison } from './preservation-gate.mjs';
import {
  createUraiCouncilHarness,
  createUraiCouncilHarnessV1,
  providerRegistry,
} from './providers.mjs';

const args = parseArgs(process.argv.slice(2));
const runId = String(args['run-id'] ?? 'ci-preservation-gate-v2');
const suitePath = path.resolve(process.cwd(), String(args.suite ?? 'bench/suites/urai-long-horizon-v2.jsonl'));
const resultsDir = path.resolve(process.cwd(), String(args['results-dir'] ?? path.join('bench', 'results', runId)));
const maxOutputTokens = asPositiveInt(args['max-output-tokens'], 1200);
const repeats = asPositiveInt(args.repeats, 1);
const baseProviderId = String(args['base-provider'] ?? 'openai');
try {
  await access(resultsDir);
  throw new Error(`Results directory already exists; choose a new --run-id or --results-dir: ${resultsDir}`);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}
const tasks = await readJsonl(suitePath);
const suiteSha256 = await sha256File(suitePath);

function stagePrompt({ task, instruction, prior = '' }) {
  return [
    'Solve the user task carefully. Do not mention this evaluation process.',
    instruction,
    '',
    'Original task:',
    task.prompt,
    prior ? `\nPrior working state:\n${prior}` : '',
  ].join('\n');
}

function createSelfRefineHarness(baseProvider) {
  return {
    id: `${baseProvider.id}+selfrefine`,
    model: `${baseProvider.model} + generic four-pass self-refine`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens: budget }) {
      const totalBudget = Math.max(128, Number(budget ?? 1024));
      const stageBudgets = {
        requirements: Math.max(64, Math.floor(totalBudget * 0.18)),
        draft: Math.max(64, Math.floor(totalBudget * 0.37)),
        critique: Math.max(64, Math.floor(totalBudget * 0.17)),
      };
      stageBudgets.final = Math.max(64, totalBudget - stageBudgets.requirements - stageBudgets.draft - stageBudgets.critique);
      const syntheticTask = { ...task, prompt };

      const requirements = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.requirements,
        prompt: stagePrompt({
          task: syntheticTask,
          instruction: 'Extract the important facts, requirements, constraints, dependencies, and required output format. Do not solve the task yet. Keep the notes compact.',
        }),
      });
      const draft = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.draft,
        prompt: stagePrompt({
          task: syntheticTask,
          instruction: 'Use the requirement notes to solve the task completely. Produce a candidate answer in the requested format.',
          prior: `REQUIREMENT NOTES:\n${requirements.text}`,
        }),
      });
      const critique = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.critique,
        prompt: stagePrompt({
          task: syntheticTask,
          instruction: 'Critique the candidate against the original task and requirement notes. Identify concrete factual, logical, arithmetic, constraint, dependency, or formatting errors. Be terse.',
          prior: `REQUIREMENT NOTES:\n${requirements.text}\n\nCANDIDATE:\n${draft.text}`,
        }),
      });
      const final = await baseProvider.complete({
        task: syntheticTask,
        maxOutputTokens: stageBudgets.final,
        prompt: stagePrompt({
          task: syntheticTask,
          instruction: 'Produce the final answer. Resolve every valid critique and output only what the original task requested. Do not include analysis or process commentary.',
          prior: `REQUIREMENT NOTES:\n${requirements.text}\n\nCANDIDATE:\n${draft.text}\n\nCRITIQUE:\n${critique.text}`,
        }),
      });

      return {
        text: final.text,
        model: `${baseProvider.model} + generic four-pass self-refine`,
        usage: usageSum(requirements.usage, draft.usage, critique.usage, final.usage),
        attempts: Number(requirements.attempts ?? 1) + Number(draft.attempts ?? 1) + Number(critique.attempts ?? 1) + Number(final.attempts ?? 1),
        metadata: { harness: 'generic-self-refine-v1', base_provider: baseProvider.id },
        raw: {
          stage_budgets: stageBudgets,
          stages: {
            requirements: { text: requirements.text, usage: requirements.usage },
            draft: { text: draft.text, usage: draft.usage },
            critique: { text: critique.text, usage: critique.usage },
            final: { text: final.text, usage: final.usage },
          },
        },
      };
    },
  };
}

function createMajorityVoteHarness(baseProvider, sampleCount = 4) {
  return {
    id: `${baseProvider.id}+vote${sampleCount}`,
    model: `${baseProvider.model} + ${sampleCount}-sample normalized plurality vote`,
    availability: baseProvider.availability,
    async complete({ task, prompt, maxOutputTokens: budget }) {
      const perSampleBudget = Math.max(64, Math.floor(Number(budget ?? 1024) / sampleCount));
      const samples = [];
      for (let index = 0; index < sampleCount; index += 1) {
        samples.push(await baseProvider.complete({ task, prompt, maxOutputTokens: perSampleBudget }));
      }
      const counts = new Map();
      for (const [index, sample] of samples.entries()) {
        const normalized = normalizeAnswerForComparison(sample.text);
        const record = counts.get(normalized) ?? { count: 0, firstIndex: index, answer: sample.text };
        record.count += 1;
        counts.set(normalized, record);
      }
      const winner = [...counts.values()].sort((left, right) => right.count - left.count || left.firstIndex - right.firstIndex)[0];
      return {
        text: winner.answer,
        model: `${baseProvider.model} + ${sampleCount}-sample normalized plurality vote`,
        usage: usageSum(...samples.map((sample) => sample.usage)),
        attempts: samples.reduce((sum, sample) => sum + Number(sample.attempts ?? 1), 0),
        metadata: {
          harness: `normalized-plurality-vote-${sampleCount}`,
          base_provider: baseProvider.id,
          winning_votes: winner.count,
          unique_answers: counts.size,
        },
        raw: {
          per_sample_budget: perSampleBudget,
          samples: samples.map((sample) => ({ text: sample.text, usage: sample.usage })),
        },
      };
    },
  };
}

function exactMcNemar(leftOnly, rightOnly) {
  const n = leftOnly + rightOnly;
  if (!n) return 1;
  const k = Math.min(leftOnly, rightOnly);
  let probability = Math.pow(0.5, n);
  let cumulative = probability;
  for (let i = 1; i <= k; i += 1) {
    probability *= (n - i + 1) / i;
    cumulative += probability;
  }
  return Math.min(1, 2 * cumulative);
}

function pairedStats(allTrials, leftId, rightId) {
  const left = new Map(allTrials.filter((t) => t.provider === leftId && t.status === 'completed').map((t) => [`${t.task_id}::${t.repeat}`, t]));
  const right = new Map(allTrials.filter((t) => t.provider === rightId && t.status === 'completed').map((t) => [`${t.task_id}::${t.repeat}`, t]));
  let bothPass = 0;
  let leftOnly = 0;
  let rightOnly = 0;
  let bothFail = 0;
  for (const [pairId, l] of left) {
    const r = right.get(pairId);
    if (!r) continue;
    if (l.passed && r.passed) bothPass += 1;
    else if (l.passed) leftOnly += 1;
    else if (r.passed) rightOnly += 1;
    else bothFail += 1;
  }
  const pairs = bothPass + leftOnly + rightOnly + bothFail;
  const leftPassRate = pairs ? (bothPass + leftOnly) / pairs : null;
  const rightPassRate = pairs ? (bothPass + rightOnly) / pairs : null;
  return {
    left: leftId,
    right: rightId,
    pairs,
    both_pass: bothPass,
    left_only: leftOnly,
    right_only: rightOnly,
    both_fail: bothFail,
    left_pass_rate: leftPassRate,
    right_pass_rate: rightPassRate,
    absolute_right_minus_left: leftPassRate == null ? null : rightPassRate - leftPassRate,
    mcnemar_exact_two_sided_p: exactMcNemar(leftOnly, rightOnly),
  };
}

const base = providerRegistry(process.env)[baseProviderId];
if (!base || baseProviderId.includes('+')) throw new Error(`Unknown base provider: ${baseProviderId}`);
if (!base.availability?.available) throw new Error(base.availability?.reason ?? `${baseProviderId} unavailable`);
const selfRefine = createSelfRefineHarness(base);
const majorityVote = createMajorityVoteHarness(base);
const uraiV1 = createUraiCouncilHarnessV1(base);
const urai = createUraiCouncilHarness(base);
uraiV1.id = `${base.id}+urai-v1`;
const providers = [base, selfRefine, majorityVote, uraiV1, urai];
const allTrials = [];

await writeJson(path.join(resultsDir, 'manifest.json'), {
  schema_version: 2,
  run_id: runId,
  benchmark: 'matched-call-output-budget-control',
  created_at: new Date().toISOString(),
  suite_path: path.relative(process.cwd(), suitePath),
  suite_sha256: suiteSha256,
  task_count: tasks.length,
  repeats,
  max_output_tokens_per_task: maxOutputTokens,
  providers: providers.map((p) => ({ id: p.id, model: p.model })),
  git: {
    sha: process.env.GITHUB_SHA ?? null,
    ref: process.env.GITHUB_REF ?? null,
    workflow: process.env.GITHUB_WORKFLOW ?? null,
    run_id: process.env.GITHUB_RUN_ID ?? null,
    run_attempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
  },
  control_note: 'Self-refine, four-sample vote, Council v1, and Council v2 each use four model calls and the same aggregate maximum output-token budget. Input tokens, latency, and actual output usage are measured rather than forced equal.',
});

console.log(`URAI matched-compute control suite=${path.relative(process.cwd(), suitePath)} sha256=${suiteSha256}`);
console.log(`tasks=${tasks.length} repeats=${repeats} maxOutputTokens=${maxOutputTokens}`);
for (let repeat = 1; repeat <= repeats; repeat += 1) {
  for (const task of tasks) {
    for (const provider of providers) {
      const started = performance.now();
      try {
        const result = await provider.complete({ task, prompt: task.prompt, maxOutputTokens });
        const scored = scoreTask(task, result.text);
        const trial = {
          run_id: runId,
          repeat,
          provider: provider.id,
          model: provider.model,
          task_id: task.id,
          family: task.family ?? 'uncategorized',
          status: 'completed',
          latency_ms: Math.round(performance.now() - started),
          score: scored.score,
          passed: scored.passed,
          score_detail: scored.detail,
          attempts: result.attempts,
          usage: result.usage,
          output: clampText(result.text),
          metadata: result.metadata ?? {},
          raw: result.raw,
        };
        allTrials.push(trial);
        await appendJsonl(path.join(resultsDir, 'trials.jsonl'), trial);
        console.log(`[${trial.passed ? 'PASS' : 'FAIL'}] r=${repeat} ${provider.id} ${task.id} family=${trial.family} latency=${trial.latency_ms}ms`);
      } catch (error) {
        const trial = {
          run_id: runId,
          repeat,
          provider: provider.id,
          model: provider.model,
          task_id: task.id,
          family: task.family ?? 'uncategorized',
          status: 'error',
          latency_ms: Math.round(performance.now() - started),
          error: String(error?.stack ?? error),
        };
        allTrials.push(trial);
        await appendJsonl(path.join(resultsDir, 'trials.jsonl'), trial);
        console.log(`[ERROR] r=${repeat} ${provider.id} ${task.id}: ${error.message}`);
      }
    }
  }
}

const byProvider = Object.fromEntries(providers.map((p) => [p.id, summarizeTrials(allTrials.filter((t) => t.provider === p.id))]));
const comparisons = Object.fromEntries([
  [base.id, selfRefine.id],
  [base.id, majorityVote.id],
  [base.id, uraiV1.id],
  [base.id, urai.id],
  [selfRefine.id, urai.id],
  [majorityVote.id, urai.id],
  [uraiV1.id, urai.id],
].map(([left, right]) => [`${left}_vs_${right}`, pairedStats(allTrials, left, right)]));
const gateDecisions = Object.fromEntries(providers.map((provider) => {
  const trials = allTrials.filter((trial) => trial.provider === provider.id && trial.status === 'completed');
  const counts = {};
  for (const trial of trials) {
    const key = trial.metadata?.gate_decision ?? 'not_applicable';
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return [provider.id, counts];
}));
const summary = {
  completed_at: new Date().toISOString(),
  suite_sha256: suiteSha256,
  by_provider: byProvider,
  paired_comparisons: comparisons,
  gate_decisions: gateDecisions,
};
await writeJson(path.join(resultsDir, 'summary.json'), summary);

console.log('\nSummary');
for (const [id, stats] of Object.entries(byProvider)) {
  console.log(`${id}: completed=${stats.completed} pass_rate=${stats.pass_rate == null ? 'n/a' : (stats.pass_rate * 100).toFixed(1) + '%'} tokens=${stats.usage.total_tokens} latency=${stats.mean_latency_ms == null ? 'n/a' : Math.round(stats.mean_latency_ms) + 'ms'}`);
}
for (const [name, stats] of Object.entries(comparisons)) {
  console.log(`${name}: n=${stats.pairs} left_only=${stats.left_only} right_only=${stats.right_only} delta=${stats.absolute_right_minus_left == null ? 'n/a' : (stats.absolute_right_minus_left * 100).toFixed(1) + 'pp'} McNemar_p=${stats.mcnemar_exact_two_sided_p.toFixed(4)}`);
}
console.log(`results=${resultsDir}`);

if (allTrials.some((trial) => trial.status === 'error')) process.exitCode = 2;
