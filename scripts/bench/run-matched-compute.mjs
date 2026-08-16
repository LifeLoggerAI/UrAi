#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import {
  appendJsonl,
  clampText,
  readJsonl,
  scoreTask,
  sha256File,
  summarizeTrials,
  usageSum,
  writeJson,
} from './lib.mjs';
import { createOpenAIProvider, createUraiCouncilHarness } from './providers.mjs';

const suitePath = path.resolve(process.cwd(), 'bench/suites/urai-long-horizon-v2.jsonl');
const resultsDir = path.resolve(process.cwd(), 'bench/results/ci-matched-compute-v1');
const maxOutputTokens = 1200;
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
  const left = new Map(allTrials.filter((t) => t.provider === leftId && t.status === 'completed').map((t) => [t.task_id, t]));
  const right = new Map(allTrials.filter((t) => t.provider === rightId && t.status === 'completed').map((t) => [t.task_id, t]));
  let bothPass = 0;
  let leftOnly = 0;
  let rightOnly = 0;
  let bothFail = 0;
  for (const [taskId, l] of left) {
    const r = right.get(taskId);
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

const base = createOpenAIProvider(process.env);
if (!base.availability?.available) throw new Error(base.availability?.reason ?? 'OpenAI unavailable');
const selfRefine = createSelfRefineHarness(base);
const urai = createUraiCouncilHarness(base);
const providers = [base, selfRefine, urai];
const allTrials = [];

await writeJson(path.join(resultsDir, 'manifest.json'), {
  schema_version: 1,
  benchmark: 'matched-call-output-budget-control',
  created_at: new Date().toISOString(),
  suite_path: path.relative(process.cwd(), suitePath),
  suite_sha256: suiteSha256,
  task_count: tasks.length,
  max_output_tokens_per_task: maxOutputTokens,
  providers: providers.map((p) => ({ id: p.id, model: p.model })),
  control_note: 'Self-refine and URAI each use four calls and the same per-task aggregate maximum output-token budget. Input-token usage is measured rather than forced equal.',
});

console.log(`URAI matched-compute control suite=${path.relative(process.cwd(), suitePath)} sha256=${suiteSha256}`);
console.log(`tasks=${tasks.length} maxOutputTokens=${maxOutputTokens}`);
for (const task of tasks) {
  for (const provider of providers) {
    const started = performance.now();
    try {
      const result = await provider.complete({ task, prompt: task.prompt, maxOutputTokens });
      const scored = scoreTask(task, result.text);
      const trial = {
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
      console.log(`[${trial.passed ? 'PASS' : 'FAIL'}] ${provider.id} ${task.id} family=${trial.family} latency=${trial.latency_ms}ms`);
    } catch (error) {
      const trial = {
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
      console.log(`[ERROR] ${provider.id} ${task.id}: ${error.message}`);
    }
  }
}

const byProvider = Object.fromEntries(providers.map((p) => [p.id, summarizeTrials(allTrials.filter((t) => t.provider === p.id))]));
const comparisons = {
  direct_vs_selfrefine: pairedStats(allTrials, base.id, selfRefine.id),
  direct_vs_urai: pairedStats(allTrials, base.id, urai.id),
  selfrefine_vs_urai: pairedStats(allTrials, selfRefine.id, urai.id),
};
const summary = {
  completed_at: new Date().toISOString(),
  suite_sha256: suiteSha256,
  by_provider: byProvider,
  paired_comparisons: comparisons,
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
