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
  writeJson,
} from '../lib.mjs';
import { providerRegistry } from '../providers.mjs';
import {
  createBuilderCanonicalHarness,
  createBuilderPreservationHarnessV3,
  createSelfRefineCanonicalHarness,
} from './harnesses.mjs';

const args = parseArgs(process.argv.slice(2));
const runId = String(args['run-id'] ?? 'ci-v3-freeze-validation');
const suitePath = path.resolve(process.cwd(), String(args.suite ?? 'bench/suites/urai-long-horizon-v2.jsonl'));
const resultsDir = path.resolve(process.cwd(), String(args['results-dir'] ?? path.join('bench', 'results', runId)));
const maxOutputTokens = asPositiveInt(args['max-output-tokens'], 1200);
const repeats = asPositiveInt(args.repeats, 2);
const baseProviderId = String(args['base-provider'] ?? 'openai');

try {
  await access(resultsDir);
  throw new Error(`Results directory already exists; choose a new --run-id or --results-dir: ${resultsDir}`);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const tasks = await readJsonl(suitePath);
const suiteSha256 = await sha256File(suitePath);
const base = providerRegistry(process.env)[baseProviderId];
if (!base || baseProviderId.includes('+')) throw new Error(`Unknown base provider: ${baseProviderId}`);
if (!base.availability?.available) throw new Error(base.availability?.reason ?? `${baseProviderId} unavailable`);

const selfRefine = createSelfRefineCanonicalHarness(base);
const builder = createBuilderCanonicalHarness(base);
const v3 = createBuilderPreservationHarnessV3(base);
const providers = [selfRefine, builder, v3];
const allTrials = [];

const requiredComplexityMargin = 2 * repeats;
const selectionRule = {
  status: 'frozen_before_model_calls',
  purpose: 'Final development-only stochastic freeze validation before untouched holdout construction.',
  primary: 'Aggregate exact task accuracy over fresh stochastic repeats.',
  repeats,
  safety_veto: 'Reject v3 if aggregate gate value is negative OR if any individual repeat has negative gate value relative to its own canonicalized Builder stage.',
  complexity_rule: `If v3 passes safety, require at least ${requiredComplexityMargin} more correct task outcomes than Builder across ${tasks.length * repeats} paired outcomes, equivalent to an average +2 tasks per 60-task repeat, to justify two extra calls.`,
  baseline_rule: 'Report generic four-pass self-refinement with the identical deterministic output canonicalizer. Do not tune after observing this run.',
  freeze_rule: 'If v3 clears safety and complexity, freeze the safe-typed v3 architecture, prompts, 0.95 confidence threshold, canonicalizer, token split, provider/model label, and scoring protocol before holdout authoring.',
  holdout_rule: 'Do not create, inspect, or run URAI-HOLDOUT-v1 in this workflow.',
};

await writeJson(path.join(resultsDir, 'manifest.json'), {
  schema_version: 4,
  run_id: runId,
  benchmark: 'urai-council-v3-freeze-validation',
  created_at: new Date().toISOString(),
  suite_path: path.relative(process.cwd(), suitePath),
  suite_sha256: suiteSha256,
  task_count: tasks.length,
  repeats,
  paired_outcomes_per_provider: tasks.length * repeats,
  max_output_tokens_per_task: maxOutputTokens,
  providers: providers.map((provider) => ({ id: provider.id, model: provider.model })),
  git: {
    sha: process.env.GITHUB_SHA ?? null,
    ref: process.env.GITHUB_REF ?? null,
    workflow: process.env.GITHUB_WORKFLOW ?? null,
    run_id: process.env.GITHUB_RUN_ID ?? null,
    run_attempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
  },
  selection_rule: selectionRule,
  development_only: true,
});

for (let repeat = 1; repeat <= repeats; repeat += 1) {
  for (const task of tasks) {
    for (const provider of providers) {
      const started = performance.now();
      try {
        const result = await provider.complete({ task, prompt: task.prompt, maxOutputTokens });
        const scored = scoreTask(task, result.text);
        let builderStage = null;
        if (provider.id === v3.id) {
          const builderAnswer = result.raw?.builder_canonical?.answer ?? result.raw?.stages?.builder?.text ?? '';
          const builderScored = scoreTask(task, builderAnswer);
          builderStage = {
            output: clampText(builderAnswer),
            score: builderScored.score,
            passed: builderScored.passed,
            score_detail: builderScored.detail,
          };
        }
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
          builder_stage: builderStage,
          raw: result.raw,
        };
        allTrials.push(trial);
        await appendJsonl(path.join(resultsDir, 'trials.jsonl'), trial);
        console.log(`[${trial.passed ? 'PASS' : 'FAIL'}] repeat=${repeat} ${provider.id} ${task.id} family=${trial.family}`);
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
        console.log(`[ERROR] repeat=${repeat} ${provider.id} ${task.id}: ${error.message}`);
      }
    }
  }
}

function trialKey(trial) { return `${trial.task_id}::${trial.repeat}`; }
function pairedStats(leftId, rightId) {
  const left = new Map(allTrials.filter((trial) => trial.provider === leftId && trial.status === 'completed').map((trial) => [trialKey(trial), trial]));
  const right = new Map(allTrials.filter((trial) => trial.provider === rightId && trial.status === 'completed').map((trial) => [trialKey(trial), trial]));
  let bothPass = 0;
  let leftOnly = 0;
  let rightOnly = 0;
  let bothFail = 0;
  for (const [key, l] of left) {
    const r = right.get(key);
    if (!r) continue;
    if (l.passed && r.passed) bothPass += 1;
    else if (l.passed) leftOnly += 1;
    else if (r.passed) rightOnly += 1;
    else bothFail += 1;
  }
  return {
    pairs: bothPass + leftOnly + rightOnly + bothFail,
    both_pass: bothPass,
    left_only: leftOnly,
    right_only: rightOnly,
    both_fail: bothFail,
    right_minus_left_tasks: rightOnly - leftOnly,
  };
}
function passCount(stats) {
  const completed = Number(stats?.completed ?? 0);
  const passRate = Number(stats?.pass_rate ?? 0);
  return Math.round(completed * passRate);
}
function gateStats(trials) {
  let preservedCorrect = 0;
  let harmfulReplacement = 0;
  let usefulReplacement = 0;
  let persistentFailure = 0;
  let replacements = 0;
  let futileReplacement = 0;
  for (const trial of trials) {
    const basePass = trial.builder_stage?.passed === true;
    const finalPass = trial.passed === true;
    const replaced = trial.metadata?.gate_decision === 'replace';
    if (replaced) replacements += 1;
    if (basePass && finalPass) preservedCorrect += 1;
    else if (basePass && !finalPass) harmfulReplacement += 1;
    else if (!basePass && finalPass) usefulReplacement += 1;
    else persistentFailure += 1;
    if (replaced && !basePass && !finalPass) futileReplacement += 1;
  }
  return {
    replacements,
    preserved_correct: preservedCorrect,
    harmful_replacements: harmfulReplacement,
    useful_replacements: usefulReplacement,
    futile_replacements: futileReplacement,
    persistent_failures: persistentFailure,
    net_gate_value: usefulReplacement - harmfulReplacement,
  };
}

const byProvider = Object.fromEntries(providers.map((provider) => [provider.id, summarizeTrials(allTrials.filter((trial) => trial.provider === provider.id))]));
const repeatSummaries = [];
for (let repeat = 1; repeat <= repeats; repeat += 1) {
  const repeatTrials = allTrials.filter((trial) => trial.repeat === repeat);
  const providerStats = Object.fromEntries(providers.map((provider) => [provider.id, summarizeTrials(repeatTrials.filter((trial) => trial.provider === provider.id))]));
  const repeatV3 = repeatTrials.filter((trial) => trial.provider === v3.id && trial.status === 'completed');
  repeatSummaries.push({
    repeat,
    by_provider: providerStats,
    v3_gate: gateStats(repeatV3),
    builder_vs_v3: (() => {
      const left = new Map(repeatTrials.filter((t) => t.provider === builder.id && t.status === 'completed').map((t) => [t.task_id, t]));
      const right = new Map(repeatTrials.filter((t) => t.provider === v3.id && t.status === 'completed').map((t) => [t.task_id, t]));
      let leftOnly = 0; let rightOnly = 0; let bothPass = 0; let bothFail = 0;
      for (const [id, l] of left) {
        const r = right.get(id); if (!r) continue;
        if (l.passed && r.passed) bothPass += 1;
        else if (l.passed) leftOnly += 1;
        else if (r.passed) rightOnly += 1;
        else bothFail += 1;
      }
      return { both_pass: bothPass, left_only: leftOnly, right_only: rightOnly, both_fail: bothFail, right_minus_left_tasks: rightOnly - leftOnly };
    })(),
  });
}

const aggregateV3Gate = gateStats(allTrials.filter((trial) => trial.provider === v3.id && trial.status === 'completed'));
const builderPasses = passCount(byProvider[builder.id]);
const v3Passes = passCount(byProvider[v3.id]);
const selfRefinePasses = passCount(byProvider[selfRefine.id]);
const anyNegativeRepeat = repeatSummaries.some((item) => item.v3_gate.net_gate_value < 0);
let selectedArchitecture;
let selectionReason;
if (anyNegativeRepeat) {
  selectedArchitecture = builder.id;
  selectionReason = 'v3_safety_veto_negative_repeat_gate_value';
} else if (aggregateV3Gate.net_gate_value < 0) {
  selectedArchitecture = builder.id;
  selectionReason = 'v3_safety_veto_negative_aggregate_gate_value';
} else if (v3Passes >= builderPasses + requiredComplexityMargin) {
  selectedArchitecture = v3.id;
  selectionReason = 'v3_clears_fresh_repeat_safety_and_complexity_rule';
} else {
  selectedArchitecture = builder.id;
  selectionReason = 'builder_preferred_under_frozen_complexity_rule';
}

const summary = {
  completed_at: new Date().toISOString(),
  suite_sha256: suiteSha256,
  development_only: true,
  repeats,
  by_provider: byProvider,
  repeat_summaries: repeatSummaries,
  paired: {
    builder_vs_v3: pairedStats(builder.id, v3.id),
    self_refine_vs_builder: pairedStats(selfRefine.id, builder.id),
    self_refine_vs_v3: pairedStats(selfRefine.id, v3.id),
  },
  v3_gate: aggregateV3Gate,
  selection: {
    selected_architecture: selectedArchitecture,
    reason: selectionReason,
    builder_passes: builderPasses,
    v3_passes: v3Passes,
    self_refine_passes: selfRefinePasses,
    required_complexity_margin: requiredComplexityMargin,
    any_negative_repeat_gate_value: anyNegativeRepeat,
    frozen_rule: selectionRule,
  },
};
await writeJson(path.join(resultsDir, 'summary.json'), summary);

console.log('\nFreeze validation summary');
for (const [id, stats] of Object.entries(byProvider)) {
  console.log(`${id}: pass_rate=${stats.pass_rate == null ? 'n/a' : (stats.pass_rate * 100).toFixed(1) + '%'} correct=${passCount(stats)}/${stats.completed} total_tokens=${stats.usage.total_tokens}`);
}
for (const item of repeatSummaries) {
  console.log(`repeat=${item.repeat} v3_gate useful=${item.v3_gate.useful_replacements} harmful=${item.v3_gate.harmful_replacements} net=${item.v3_gate.net_gate_value} builder_vs_v3_delta=${item.builder_vs_v3.right_minus_left_tasks}`);
}
console.log(`aggregate v3 gate: useful=${aggregateV3Gate.useful_replacements} harmful=${aggregateV3Gate.harmful_replacements} futile=${aggregateV3Gate.futile_replacements} net=${aggregateV3Gate.net_gate_value}`);
console.log(`SELECTED=${selectedArchitecture} reason=${selectionReason}`);
console.log(`results=${resultsDir}`);
if (allTrials.some((trial) => trial.status === 'error')) process.exitCode = 2;
