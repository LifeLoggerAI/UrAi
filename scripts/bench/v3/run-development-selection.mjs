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
  createCanonicalizedDirectProvider,
  createSelfRefineCanonicalHarness,
} from './harnesses.mjs';

const args = parseArgs(process.argv.slice(2));
const runId = String(args['run-id'] ?? 'ci-council-v3-dev-selection');
const suitePath = path.resolve(process.cwd(), String(args.suite ?? 'bench/suites/urai-long-horizon-v2.jsonl'));
const resultsDir = path.resolve(process.cwd(), String(args['results-dir'] ?? path.join('bench', 'results', runId)));
const maxOutputTokens = asPositiveInt(args['max-output-tokens'], 1200);
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

const direct = createCanonicalizedDirectProvider(base);
const selfRefine = createSelfRefineCanonicalHarness(base);
const builder = createBuilderCanonicalHarness(base);
const v3 = createBuilderPreservationHarnessV3(base);
const providers = [direct, selfRefine, builder, v3];
const allTrials = [];

const selectionRule = {
  status: 'frozen_before_model_calls',
  primary: 'development task accuracy',
  safety_veto: 'Reject v3 if correct->wrong gate replacements exceed wrong->correct gate repairs relative to its canonicalized Builder stage.',
  complexity_rule: 'If v3 is not vetoed, it must beat Builder+canonicalizer by at least 2 of 60 tasks to justify two extra model calls; otherwise prefer Builder+canonicalizer.',
  baseline_rule: 'Report self-refine+the same canonicalizer as the strongest generic control. No superiority claim is permitted from this development suite.',
  holdout_rule: 'Do not create, inspect, or run URAI-HOLDOUT-v1 during this workflow.',
};

await writeJson(path.join(resultsDir, 'manifest.json'), {
  schema_version: 3,
  run_id: runId,
  benchmark: 'urai-council-v3-development-selection',
  created_at: new Date().toISOString(),
  suite_path: path.relative(process.cwd(), suitePath),
  suite_sha256: suiteSha256,
  task_count: tasks.length,
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
      console.log(`[${trial.passed ? 'PASS' : 'FAIL'}] ${provider.id} ${task.id} family=${trial.family}`);
    } catch (error) {
      const trial = {
        run_id: runId,
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

function pairedStats(leftId, rightId) {
  const left = new Map(allTrials.filter((trial) => trial.provider === leftId && trial.status === 'completed').map((trial) => [trial.task_id, trial]));
  const right = new Map(allTrials.filter((trial) => trial.provider === rightId && trial.status === 'completed').map((trial) => [trial.task_id, trial]));
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
  return { both_pass: bothPass, left_only: leftOnly, right_only: rightOnly, both_fail: bothFail, right_minus_left_tasks: rightOnly - leftOnly };
}

const byProvider = Object.fromEntries(providers.map((provider) => [provider.id, summarizeTrials(allTrials.filter((trial) => trial.provider === provider.id))]));
const v3Trials = allTrials.filter((trial) => trial.provider === v3.id && trial.status === 'completed');
let preservedCorrect = 0;
let harmfulReplacement = 0;
let usefulReplacement = 0;
let persistentFailure = 0;
let replacements = 0;
for (const trial of v3Trials) {
  const basePass = trial.builder_stage?.passed === true;
  const finalPass = trial.passed === true;
  if (trial.metadata?.gate_decision === 'replace') replacements += 1;
  if (basePass && finalPass) preservedCorrect += 1;
  else if (basePass && !finalPass) harmfulReplacement += 1;
  else if (!basePass && finalPass) usefulReplacement += 1;
  else persistentFailure += 1;
}
const v3Gate = {
  replacements,
  preserved_correct: preservedCorrect,
  harmful_replacements: harmfulReplacement,
  useful_replacements: usefulReplacement,
  persistent_failures: persistentFailure,
  net_gate_value: usefulReplacement - harmfulReplacement,
};
const builderPasses = Number(byProvider[builder.id]?.passed ?? 0);
const v3Passes = Number(byProvider[v3.id]?.passed ?? 0);
const selfRefinePasses = Number(byProvider[selfRefine.id]?.passed ?? 0);
let selectedArchitecture;
let selectionReason;
if (v3Gate.net_gate_value < 0) {
  selectedArchitecture = builder.id;
  selectionReason = 'v3_safety_veto_negative_gate_value';
} else if (v3Passes >= builderPasses + 2) {
  selectedArchitecture = v3.id;
  selectionReason = 'v3_clears_two_task_complexity_margin';
} else {
  selectedArchitecture = builder.id;
  selectionReason = 'builder_preferred_under_frozen_complexity_rule';
}

const summary = {
  completed_at: new Date().toISOString(),
  suite_sha256: suiteSha256,
  development_only: true,
  by_provider: byProvider,
  paired: {
    builder_vs_v3: pairedStats(builder.id, v3.id),
    self_refine_vs_builder: pairedStats(selfRefine.id, builder.id),
    self_refine_vs_v3: pairedStats(selfRefine.id, v3.id),
  },
  v3_gate: v3Gate,
  selection: {
    selected_architecture: selectedArchitecture,
    reason: selectionReason,
    builder_passes: builderPasses,
    v3_passes: v3Passes,
    self_refine_passes: selfRefinePasses,
    frozen_rule: selectionRule,
  },
};
await writeJson(path.join(resultsDir, 'summary.json'), summary);
console.log('\nDevelopment selection summary');
for (const [id, stats] of Object.entries(byProvider)) {
  console.log(`${id}: pass_rate=${stats.pass_rate == null ? 'n/a' : (stats.pass_rate * 100).toFixed(1) + '%'} total_tokens=${stats.usage.total_tokens}`);
}
console.log(`v3 gate: useful=${v3Gate.useful_replacements} harmful=${v3Gate.harmful_replacements} net=${v3Gate.net_gate_value}`);
console.log(`SELECTED=${selectedArchitecture} reason=${selectionReason}`);
console.log(`results=${resultsDir}`);
if (allTrials.some((trial) => trial.status === 'error')) process.exitCode = 2;
