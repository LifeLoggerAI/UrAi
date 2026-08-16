#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
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
} from './lib.mjs';
import { providerRegistry } from './providers.mjs';
import {
  createCanonicalizedDirectProvider,
  createSelfRefineCanonicalHarness,
  createBuilderPreservationHarnessV3,
} from './v3/harnesses.mjs';

const args = parseArgs(process.argv.slice(2));
const protocolPath = path.resolve(process.cwd(), String(args.protocol ?? 'bench/protocols/urai-holdout-v1-lock.json'));
const suitePath = path.resolve(process.cwd(), String(args.suite ?? 'bench/holdout/urai-holdout-v1.jsonl'));
const runId = String(args['run-id'] ?? 'ci-urai-holdout-v1');
const resultsDir = path.resolve(process.cwd(), String(args['results-dir'] ?? path.join('bench', 'results', runId)));

try {
  await access(resultsDir);
  throw new Error(`Results directory already exists: ${resultsDir}`);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const protocol = JSON.parse(await readFile(protocolPath, 'utf8'));
if (protocol.status !== 'frozen_before_holdout_generation') throw new Error(`Protocol is not frozen: ${protocol.status}`);
if (protocol.protocol !== 'URAI-HOLDOUT-v1') throw new Error(`Unexpected protocol: ${protocol.protocol}`);

for (const [file, expectedBlob] of Object.entries(protocol.locked_git_blobs ?? {})) {
  const actualBlob = execFileSync('git', ['hash-object', file], { encoding: 'utf8' }).trim();
  if (actualBlob !== expectedBlob) throw new Error(`LOCK DRIFT ${file}: expected blob ${expectedBlob}, got ${actualBlob}`);
}

const tasks = await readJsonl(suitePath);
if (tasks.length !== protocol.task_count) throw new Error(`Holdout task count mismatch: expected ${protocol.task_count}, got ${tasks.length}`);
const families = new Set(tasks.map((task) => task.family));
if (families.size !== protocol.families) throw new Error(`Holdout family count mismatch: expected ${protocol.families}, got ${families.size}`);
const suiteSha256 = await sha256File(suitePath);
const maxOutputTokens = asPositiveInt(args['max-output-tokens'], protocol.max_output_tokens);
if (maxOutputTokens !== protocol.max_output_tokens) throw new Error(`Token budget drift: protocol=${protocol.max_output_tokens}, requested=${maxOutputTokens}`);

const base = providerRegistry(process.env).openai;
if (!base?.availability?.available) throw new Error(base?.availability?.reason ?? 'OpenAI unavailable');
if (base.model !== protocol.model) throw new Error(`Model drift: protocol=${protocol.model}, provider=${base.model}`);

const direct = createCanonicalizedDirectProvider(base);
const selfRefine = createSelfRefineCanonicalHarness(base);
const v3 = createBuilderPreservationHarnessV3(base, { minimumConfidence: protocol.minimum_gate_confidence });
const providers = [direct, selfRefine, v3];
const allTrials = [];

await writeJson(path.join(resultsDir, 'manifest.json'), {
  schema_version: 1,
  protocol: protocol.protocol,
  run_id: runId,
  created_at: new Date().toISOString(),
  one_shot_holdout: true,
  suite_path: path.relative(process.cwd(), suitePath),
  suite_sha256: suiteSha256,
  task_count: tasks.length,
  families: [...families].sort(),
  max_output_tokens: maxOutputTokens,
  model: base.model,
  architecture: protocol.architecture,
  minimum_gate_confidence: protocol.minimum_gate_confidence,
  frozen_from_commit: protocol.frozen_from_commit,
  freeze_validation_run: protocol.freeze_validation_run,
  locked_git_blobs: protocol.locked_git_blobs,
  primary_comparison: protocol.primary_comparison,
  primary_endpoint: protocol.primary_endpoint,
  claim_rule: protocol.claim_rule,
  post_holdout_rule: protocol.post_holdout_rule,
  git: {
    sha: process.env.GITHUB_SHA ?? null,
    ref: process.env.GITHUB_REF ?? null,
    workflow: process.env.GITHUB_WORKFLOW ?? null,
    run_id: process.env.GITHUB_RUN_ID ?? null,
    run_attempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
  },
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
        family: task.family,
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
      console.log(`[${trial.passed ? 'PASS' : 'FAIL'}] ${provider.id} ${task.id} family=${task.family}`);
    } catch (error) {
      const trial = {
        run_id: runId,
        provider: provider.id,
        model: provider.model,
        task_id: task.id,
        family: task.family,
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

function exactTwoSidedMcNemar(leftOnly, rightOnly) {
  const n = leftOnly + rightOnly;
  if (n === 0) return 1;
  const k = Math.min(leftOnly, rightOnly);
  function choose(nValue, kValue) {
    const kk = Math.min(kValue, nValue - kValue);
    let value = 1;
    for (let i = 1; i <= kk; i += 1) value = value * (nValue - kk + i) / i;
    return value;
  }
  let lower = 0;
  for (let i = 0; i <= k; i += 1) lower += choose(n, i) * (0.5 ** n);
  return Math.min(1, 2 * lower);
}

function pairedStats(leftId, rightId) {
  const left = new Map(allTrials.filter((t) => t.provider === leftId && t.status === 'completed').map((t) => [t.task_id, t]));
  const right = new Map(allTrials.filter((t) => t.provider === rightId && t.status === 'completed').map((t) => [t.task_id, t]));
  let bothPass = 0; let leftOnly = 0; let rightOnly = 0; let bothFail = 0;
  for (const [id, l] of left) {
    const r = right.get(id);
    if (!r) continue;
    if (l.passed && r.passed) bothPass += 1;
    else if (l.passed) leftOnly += 1;
    else if (r.passed) rightOnly += 1;
    else bothFail += 1;
  }
  const pairs = bothPass + leftOnly + rightOnly + bothFail;
  return {
    pairs,
    both_pass: bothPass,
    left_only: leftOnly,
    right_only: rightOnly,
    both_fail: bothFail,
    right_minus_left_tasks: rightOnly - leftOnly,
    right_minus_left_accuracy: pairs ? (rightOnly - leftOnly) / pairs : null,
    mcnemar_exact_two_sided_p: exactTwoSidedMcNemar(leftOnly, rightOnly),
  };
}

function gateStats(v3Trials) {
  let preservedCorrect = 0;
  let harmfulReplacement = 0;
  let usefulReplacement = 0;
  let persistentFailure = 0;
  let replacements = 0;
  let futileReplacement = 0;
  for (const trial of v3Trials) {
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
const primary = pairedStats(selfRefine.id, v3.id);
const directVsV3 = pairedStats(direct.id, v3.id);
const v3Gate = gateStats(allTrials.filter((trial) => trial.provider === v3.id && trial.status === 'completed'));
const safetyPass = v3Gate.harmful_replacements <= 1 && v3Gate.useful_replacements > v3Gate.harmful_replacements;
const accuracyDelta = primary.right_minus_left_accuracy ?? 0;
let claimStatus;
if (!safetyPass || accuracyDelta <= 0) claimStatus = 'not_supported';
else if (accuracyDelta >= 0.05 && primary.mcnemar_exact_two_sided_p <= 0.05) claimStatus = 'strongly_supported';
else claimStatus = 'directionally_supported';

const familySummary = {};
for (const family of [...families].sort()) {
  familySummary[family] = {};
  for (const provider of providers) {
    const trials = allTrials.filter((t) => t.family === family && t.provider === provider.id);
    familySummary[family][provider.id] = summarizeTrials(trials);
  }
}

const summary = {
  completed_at: new Date().toISOString(),
  protocol: protocol.protocol,
  suite_sha256: suiteSha256,
  one_shot_holdout: true,
  by_provider: byProvider,
  family_summary: familySummary,
  paired: {
    primary_self_refine_vs_v3: primary,
    secondary_direct_vs_v3: directVsV3,
  },
  v3_gate: v3Gate,
  predeclared_claim_evaluation: {
    status: claimStatus,
    safety_pass: safetyPass,
    v3_minus_self_refine_accuracy: accuracyDelta,
    mcnemar_exact_two_sided_p: primary.mcnemar_exact_two_sided_p,
    rule: protocol.claim_rule,
  },
  post_holdout_rule: protocol.post_holdout_rule,
};
await writeJson(path.join(resultsDir, 'summary.json'), summary);

console.log('\nURAI-HOLDOUT-v1 one-shot summary');
for (const [id, stats] of Object.entries(byProvider)) {
  const correct = Math.round((stats.pass_rate ?? 0) * stats.completed);
  console.log(`${id}: correct=${correct}/${stats.completed} pass_rate=${stats.pass_rate == null ? 'n/a' : (100 * stats.pass_rate).toFixed(1) + '%'} tokens=${stats.usage.total_tokens}`);
}
console.log(`primary selfrefine->v3 delta=${(100 * accuracyDelta).toFixed(1)}pp left_only=${primary.left_only} right_only=${primary.right_only} McNemar_p=${primary.mcnemar_exact_two_sided_p.toFixed(6)}`);
console.log(`gate useful=${v3Gate.useful_replacements} harmful=${v3Gate.harmful_replacements} futile=${v3Gate.futile_replacements} net=${v3Gate.net_gate_value}`);
console.log(`PREDECLARED_CLAIM_STATUS=${claimStatus}`);
console.log(`results=${resultsDir}`);
if (allTrials.some((trial) => trial.status === 'error')) process.exitCode = 2;
