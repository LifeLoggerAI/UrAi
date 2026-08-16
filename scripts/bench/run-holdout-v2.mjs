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
import {
  hierarchicalPairedBootstrap,
  macroFamilyAccuracyDelta,
  pairedAccuracyStats,
} from './v3/paired-stats.mjs';

const args = parseArgs(process.argv.slice(2));
const protocolPath = path.resolve(process.cwd(), String(args.protocol ?? 'bench/protocols/urai-holdout-v2-lock.json'));
const suitePath = path.resolve(process.cwd(), String(args.suite ?? 'bench/holdout/urai-holdout-v2.jsonl'));
const runId = String(args['run-id'] ?? 'ci-urai-holdout-v2');
const resultsDir = path.resolve(process.cwd(), String(args['results-dir'] ?? path.join('bench', 'results', runId)));

try {
  await access(resultsDir);
  throw new Error(`Results directory already exists: ${resultsDir}`);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

const protocol = JSON.parse(await readFile(protocolPath, 'utf8'));
if (protocol.status !== 'frozen_before_holdout_generation') throw new Error(`Protocol is not frozen: ${protocol.status}`);
if (protocol.protocol !== 'URAI-HOLDOUT-v2') throw new Error(`Unexpected protocol: ${protocol.protocol}`);

for (const [file, expectedBlob] of Object.entries(protocol.locked_git_blobs ?? {})) {
  const actualBlob = execFileSync('git', ['hash-object', file], { encoding: 'utf8' }).trim();
  if (actualBlob !== expectedBlob) throw new Error(`LOCK DRIFT ${file}: expected blob ${expectedBlob}, got ${actualBlob}`);
}

const tasks = await readJsonl(suitePath);
if (tasks.length !== protocol.task_count) throw new Error(`Holdout task count mismatch: expected ${protocol.task_count}, got ${tasks.length}`);
const families = new Set(tasks.map((task) => task.family));
if (families.size !== protocol.families) throw new Error(`Holdout family count mismatch: expected ${protocol.families}, got ${families.size}`);
for (const family of families) {
  const count = tasks.filter((task) => task.family === family).length;
  if (count !== protocol.tasks_per_family) throw new Error(`Family ${family} count mismatch: expected ${protocol.tasks_per_family}, got ${count}`);
}
const suiteSha256 = await sha256File(suitePath);
const maxOutputTokens = asPositiveInt(args['max-output-tokens'], protocol.max_output_tokens);
if (maxOutputTokens !== protocol.max_output_tokens) throw new Error(`Token budget drift: protocol=${protocol.max_output_tokens}, requested=${maxOutputTokens}`);

const base = providerRegistry(process.env).openai;
if (!base?.availability?.available) throw new Error(base?.availability?.reason ?? 'OpenAI unavailable');
if (base.model !== protocol.model) throw new Error(`Model drift: protocol=${protocol.model}, provider=${base.model}`);

const direct = createCanonicalizedDirectProvider(base);
const selfRefine = createSelfRefineCanonicalHarness(base);
const council = createBuilderPreservationHarnessV3(base, { minimumConfidence: protocol.minimum_gate_confidence });
const providers = [direct, selfRefine, council];
const allTrials = [];

function strictWholeJsonScore(task, rawText) {
  const text = String(rawText ?? '').trim();
  try {
    const value = JSON.parse(text);
    return scoreTask(task, JSON.stringify(value));
  } catch (error) {
    return { score: 0, passed: false, detail: `strict whole-JSON contract failed: ${error.message}` };
  }
}

function preCanonicalOutput(provider, result) {
  if (provider.id === direct.id) return result.raw?.pre_canonical_output ?? result.text;
  if (provider.id === selfRefine.id) return result.raw?.stages?.final?.text ?? result.text;
  if (provider.id === council.id) return result.raw?.gate?.selected_answer ?? result.raw?.builder_canonical?.answer ?? result.text;
  return result.text;
}

function builderStageScore(task, result) {
  const builderAnswer = result.raw?.builder_canonical?.answer ?? result.raw?.stages?.builder?.text ?? '';
  const scored = scoreTask(task, builderAnswer);
  return {
    output: clampText(builderAnswer),
    score: scored.score,
    passed: scored.passed,
    score_detail: scored.detail,
  };
}

await writeJson(path.join(resultsDir, 'manifest.json'), {
  schema_version: 2,
  protocol: protocol.protocol,
  run_id: runId,
  created_at: new Date().toISOString(),
  one_shot_holdout: true,
  suite_path: path.relative(process.cwd(), suitePath),
  suite_sha256: suiteSha256,
  task_count: tasks.length,
  families: [...families].sort(),
  tasks_per_family: protocol.tasks_per_family,
  model: base.model,
  max_output_tokens: maxOutputTokens,
  architecture: protocol.architecture,
  minimum_gate_confidence: protocol.minimum_gate_confidence,
  primary_endpoint: protocol.primary_endpoint,
  secondary_endpoints: protocol.secondary_endpoints,
  primary_comparison: protocol.primary_comparison,
  statistics: protocol.statistics,
  claim_rule: protocol.claim_rule,
  safety_rule: protocol.safety_rule,
  frozen_from_commit: protocol.frozen_from_commit,
  locked_git_blobs: protocol.locked_git_blobs,
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
      const semantic = scoreTask(task, result.text);
      const rawOutput = preCanonicalOutput(provider, result);
      const strict = strictWholeJsonScore(task, rawOutput);
      const builderStage = provider.id === council.id ? builderStageScore(task, result) : null;
      const trial = {
        run_id: runId,
        provider: provider.id,
        model: provider.model,
        task_id: task.id,
        family: task.family,
        status: 'completed',
        latency_ms: Math.round(performance.now() - started),
        score: semantic.score,
        passed: semantic.passed,
        score_detail: semantic.detail,
        strict_raw_score: strict.score,
        strict_raw_passed: strict.passed,
        strict_raw_score_detail: strict.detail,
        raw_pre_canonical_output: clampText(rawOutput),
        attempts: result.attempts,
        usage: result.usage,
        output: clampText(result.text),
        metadata: result.metadata ?? {},
        builder_stage: builderStage,
        raw: result.raw,
      };
      allTrials.push(trial);
      await appendJsonl(path.join(resultsDir, 'trials.jsonl'), trial);
      console.log(`[${trial.passed ? 'PASS' : 'FAIL'}] ${provider.id} ${task.id} family=${task.family} strict=${trial.strict_raw_passed ? 'pass' : 'fail'}`);
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

function completedFor(providerId) {
  return allTrials.filter((trial) => trial.provider === providerId && trial.status === 'completed');
}

function strictSummary(trials) {
  const completed = trials.filter((trial) => trial.status === 'completed');
  const passed = completed.filter((trial) => trial.strict_raw_passed === true).length;
  return { completed: completed.length, passed, pass_rate: completed.length ? passed / completed.length : null };
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
    harmful_replacement_rate_all_tasks: trials.length ? harmfulReplacement / trials.length : null,
    useful_replacements: usefulReplacement,
    futile_replacements: futileReplacement,
    persistent_failures: persistentFailure,
    net_gate_value: usefulReplacement - harmfulReplacement,
  };
}

const byProvider = Object.fromEntries(providers.map((provider) => [provider.id, summarizeTrials(completedFor(provider.id))]));
const strictByProvider = Object.fromEntries(providers.map((provider) => [provider.id, strictSummary(completedFor(provider.id))]));
const primary = pairedAccuracyStats(completedFor(selfRefine.id), completedFor(council.id));
const directVsCouncil = pairedAccuracyStats(completedFor(direct.id), completedFor(council.id));
const macro = macroFamilyAccuracyDelta(primary.pair_rows);
const bootstrap = hierarchicalPairedBootstrap(primary.pair_rows, {
  replicates: protocol.statistics.hierarchical_bootstrap_replicates,
  seed: protocol.statistics.hierarchical_bootstrap_seed,
});
const councilGate = gateStats(completedFor(council.id));
const safetyPass = councilGate.harmful_replacement_rate_all_tasks <= protocol.safety_rule.max_harmful_replacement_rate_all_tasks
  && councilGate.useful_replacements > councilGate.harmful_replacements;
const accuracyDelta = primary.right_minus_left_accuracy ?? 0;
const bootstrapLower = bootstrap.macro_family_accuracy_delta_ci95[0];
const strongSupport = safetyPass
  && accuracyDelta >= protocol.claim_rule.minimum_accuracy_advantage
  && primary.mcnemar_exact_two_sided_p <= protocol.claim_rule.maximum_mcnemar_p
  && bootstrapLower > protocol.claim_rule.minimum_bootstrap_lower_bound;
let claimStatus;
if (!safetyPass || accuracyDelta <= 0) claimStatus = 'not_supported';
else if (strongSupport) claimStatus = 'strongly_supported';
else claimStatus = 'directionally_supported';

const familySummary = {};
for (const family of [...families].sort()) {
  familySummary[family] = {};
  for (const provider of providers) {
    const trials = completedFor(provider.id).filter((trial) => trial.family === family);
    familySummary[family][provider.id] = {
      semantic: summarizeTrials(trials),
      strict_raw: strictSummary(trials),
    };
  }
}

const summary = {
  completed_at: new Date().toISOString(),
  protocol: protocol.protocol,
  suite_sha256: suiteSha256,
  one_shot_holdout: true,
  primary_endpoint: protocol.primary_endpoint,
  by_provider: byProvider,
  strict_raw_by_provider: strictByProvider,
  family_summary: familySummary,
  paired: {
    primary_self_refine_vs_council: { ...primary, pair_rows: undefined },
    secondary_direct_vs_council: { ...directVsCouncil, pair_rows: undefined },
  },
  macro_family_primary: macro,
  hierarchical_bootstrap_primary: bootstrap,
  council_gate: councilGate,
  predeclared_claim_evaluation: {
    status: claimStatus,
    safety_pass: safetyPass,
    council_minus_self_refine_accuracy: accuracyDelta,
    macro_family_accuracy_delta: macro.macro_delta,
    mcnemar_exact_two_sided_p: primary.mcnemar_exact_two_sided_p,
    macro_family_bootstrap_ci95: bootstrap.macro_family_accuracy_delta_ci95,
    rule: protocol.claim_rule,
    safety_rule: protocol.safety_rule,
  },
  post_holdout_rule: protocol.post_holdout_rule,
};
await writeJson(path.join(resultsDir, 'summary.json'), summary);

console.log('\nURAI-HOLDOUT-v2 one-shot summary');
for (const [id, stats] of Object.entries(byProvider)) {
  const correct = Math.round((stats.pass_rate ?? 0) * stats.completed);
  const strict = strictByProvider[id];
  console.log(`${id}: semantic=${correct}/${stats.completed} (${stats.pass_rate == null ? 'n/a' : (100 * stats.pass_rate).toFixed(1) + '%'}) strict=${strict.passed}/${strict.completed} tokens=${stats.usage.total_tokens}`);
}
console.log(`primary selfrefine->Council delta=${(100 * accuracyDelta).toFixed(1)}pp left_only=${primary.left_only} right_only=${primary.right_only} McNemar_p=${primary.mcnemar_exact_two_sided_p.toFixed(6)}`);
console.log(`hierarchical macro CI95=[${bootstrap.macro_family_accuracy_delta_ci95.map((value) => value.toFixed(4)).join(', ')}]`);
console.log(`gate useful=${councilGate.useful_replacements} harmful=${councilGate.harmful_replacements} rate=${councilGate.harmful_replacement_rate_all_tasks.toFixed(4)} net=${councilGate.net_gate_value}`);
console.log(`PREDECLARED_CLAIM_STATUS=${claimStatus}`);
console.log(`results=${resultsDir}`);
if (allTrials.some((trial) => trial.status === 'error')) process.exitCode = 2;
