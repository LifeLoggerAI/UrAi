#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import { appendJsonl, asPositiveInt, csv, nowIsoCompact, parseArgs, readJsonl, scoreTask, sha256File, summarizeTrials, writeJson, clampText } from './lib.mjs';
import { providerRegistry } from './providers.mjs';

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const suitePath = path.resolve(root, String(args.suite ?? 'bench/suites/urai-long-horizon-v2.jsonl'));
const providerIds = csv(args.providers, ['openai', 'openai+urai']);
const repeats = asPositiveInt(args.repeats, 1);
const maxOutputTokens = asPositiveInt(args['max-output-tokens'], 1200);
const runId = String(args['run-id'] ?? nowIsoCompact());
const resultsDir = path.resolve(root, String(args['results-dir'] ?? path.join('bench', 'results', runId)));
const dryRun = Boolean(args['dry-run']);
const failOnErrors = Boolean(args['fail-on-errors']);

const tasks = await readJsonl(suitePath);
if (!tasks.length) throw new Error(`Suite is empty: ${suitePath}`);
for (const task of tasks) {
  if (!task.id || !task.prompt) throw new Error('Each task requires id and prompt.');
}
const ids = new Set(tasks.map((task) => task.id));
if (ids.size !== tasks.length) throw new Error('Task IDs must be unique.');

const suiteSha256 = await sha256File(suitePath);
const registry = providerRegistry(process.env);
const unknown = providerIds.filter((id) => !registry[id]);
if (unknown.length) throw new Error(`Unknown providers: ${unknown.join(', ')}`);

const families = Object.fromEntries([...new Set(tasks.map((task) => task.family ?? 'uncategorized'))].sort().map((family) => [family, tasks.filter((task) => (task.family ?? 'uncategorized') === family).length]));
const manifest = {
  schema_version: 2,
  run_id: runId,
  created_at: new Date().toISOString(),
  suite_path: path.relative(root, suitePath),
  suite_sha256: suiteSha256,
  task_count: tasks.length,
  task_families: families,
  repeats,
  max_output_tokens_per_task: maxOutputTokens,
  providers: providerIds.map((id) => ({ id, model: registry[id].model, availability: registry[id].availability })),
  node: process.version,
  dry_run: dryRun,
};
await writeJson(path.join(resultsDir, 'manifest.json'), manifest);

console.log(`URAI frontier benchmark ${runId}`);
console.log(`suite=${manifest.suite_path} sha256=${suiteSha256}`);
console.log(`providers=${providerIds.join(', ')} tasks=${tasks.length} families=${Object.keys(families).length} repeats=${repeats} maxOutputTokens=${maxOutputTokens}`);
if (dryRun) {
  console.log(`dry-run complete; manifest written to ${resultsDir}`);
  process.exit(0);
}

const allTrials = [];
for (const providerId of providerIds) {
  const provider = registry[providerId];
  for (let repeat = 1; repeat <= repeats; repeat += 1) {
    for (const task of tasks) {
      const trialBase = {
        run_id: runId,
        suite_sha256: suiteSha256,
        provider: providerId,
        model: provider.model,
        task_id: task.id,
        family: task.family ?? 'uncategorized',
        repeat,
        started_at: new Date().toISOString(),
      };
      if (!provider.availability?.available) {
        const trial = { ...trialBase, status: 'unavailable', reason: provider.availability?.reason ?? 'provider unavailable' };
        allTrials.push(trial);
        await appendJsonl(path.join(resultsDir, 'trials.jsonl'), trial);
        console.log(`[SKIP] ${providerId} ${task.id}: ${trial.reason}`);
        continue;
      }
      const started = performance.now();
      try {
        const result = await provider.complete({ task, prompt: task.prompt, maxOutputTokens });
        const scored = scoreTask(task, result.text);
        const trial = {
          ...trialBase,
          status: 'completed',
          finished_at: new Date().toISOString(),
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
        console.log(`[${trial.passed ? 'PASS' : 'FAIL'}] ${providerId} ${task.id} family=${trial.family} score=${trial.score.toFixed(3)} latency=${trial.latency_ms}ms`);
      } catch (error) {
        const trial = {
          ...trialBase,
          status: 'error',
          finished_at: new Date().toISOString(),
          latency_ms: Math.round(performance.now() - started),
          error: String(error?.stack ?? error),
        };
        allTrials.push(trial);
        await appendJsonl(path.join(resultsDir, 'trials.jsonl'), trial);
        console.log(`[ERROR] ${providerId} ${task.id}: ${error.message}`);
      }
    }
  }
}

const byProvider = {};
const byFamily = {};
for (const providerId of providerIds) {
  const providerTrials = allTrials.filter((trial) => trial.provider === providerId);
  byProvider[providerId] = summarizeTrials(providerTrials);
  byFamily[providerId] = {};
  for (const family of Object.keys(families)) {
    byFamily[providerId][family] = summarizeTrials(providerTrials.filter((trial) => trial.family === family));
  }
}

function exactMcNemar(baseOnly, uraiOnly) {
  const n = baseOnly + uraiOnly;
  if (!n) return 1;
  const k = Math.min(baseOnly, uraiOnly);
  let probability = Math.pow(0.5, n);
  let cumulative = probability;
  for (let i = 1; i <= k; i += 1) {
    probability *= (n - i + 1) / i;
    cumulative += probability;
  }
  return Math.min(1, 2 * cumulative);
}

function pairedStats(baseId, harnessId) {
  const baseMap = new Map(allTrials.filter((t) => t.provider === baseId && t.status === 'completed').map((t) => [`${t.task_id}::${t.repeat}`, t]));
  const harnessMap = new Map(allTrials.filter((t) => t.provider === harnessId && t.status === 'completed').map((t) => [`${t.task_id}::${t.repeat}`, t]));
  let bothPass = 0, baseOnly = 0, uraiOnly = 0, bothFail = 0;
  const perFamily = {};
  for (const [key, base] of baseMap) {
    const harness = harnessMap.get(key);
    if (!harness) continue;
    const family = base.family ?? 'uncategorized';
    perFamily[family] ??= { pairs: 0, both_pass: 0, base_only: 0, urai_only: 0, both_fail: 0 };
    perFamily[family].pairs += 1;
    if (base.passed && harness.passed) { bothPass += 1; perFamily[family].both_pass += 1; }
    else if (base.passed) { baseOnly += 1; perFamily[family].base_only += 1; }
    else if (harness.passed) { uraiOnly += 1; perFamily[family].urai_only += 1; }
    else { bothFail += 1; perFamily[family].both_fail += 1; }
  }
  const pairs = bothPass + baseOnly + uraiOnly + bothFail;
  const basePassRate = pairs ? (bothPass + baseOnly) / pairs : null;
  const uraiPassRate = pairs ? (bothPass + uraiOnly) / pairs : null;
  return {
    pairs,
    both_pass: bothPass,
    base_only: baseOnly,
    urai_only: uraiOnly,
    both_fail: bothFail,
    base_pass_rate: basePassRate,
    urai_pass_rate: uraiPassRate,
    absolute_pass_rate_lift: basePassRate == null ? null : uraiPassRate - basePassRate,
    discordant_pairs: baseOnly + uraiOnly,
    mcnemar_exact_two_sided_p: exactMcNemar(baseOnly, uraiOnly),
    by_family: perFamily,
  };
}

const lift = {};
const paired = {};
for (const baseId of ['gemini', 'fable', 'mythos', 'openai', 'mock']) {
  const harnessId = `${baseId}+urai`;
  if (!byProvider[baseId] || !byProvider[harnessId]) continue;
  const base = byProvider[baseId];
  const harness = byProvider[harnessId];
  lift[baseId] = {
    base_pass_rate: base.pass_rate,
    urai_pass_rate: harness.pass_rate,
    absolute_pass_rate_lift: base.pass_rate == null || harness.pass_rate == null ? null : harness.pass_rate - base.pass_rate,
    base_mean_score: base.mean_score,
    urai_mean_score: harness.mean_score,
    absolute_mean_score_lift: base.mean_score == null || harness.mean_score == null ? null : harness.mean_score - base.mean_score,
    base_total_tokens: base.usage.total_tokens,
    urai_total_tokens: harness.usage.total_tokens,
    token_ratio: base.usage.total_tokens ? harness.usage.total_tokens / base.usage.total_tokens : null,
    base_mean_latency_ms: base.mean_latency_ms,
    urai_mean_latency_ms: harness.mean_latency_ms,
  };
  paired[baseId] = pairedStats(baseId, harnessId);
}

const summary = { ...manifest, completed_at: new Date().toISOString(), by_provider: byProvider, by_family: byFamily, harness_lift: lift, paired_comparison: paired };
await writeJson(path.join(resultsDir, 'summary.json'), summary);
console.log('\nSummary');
for (const [providerId, stats] of Object.entries(byProvider)) {
  console.log(`${providerId}: completed=${stats.completed} pass_rate=${stats.pass_rate == null ? 'n/a' : (stats.pass_rate * 100).toFixed(1) + '%'} mean_score=${stats.mean_score == null ? 'n/a' : stats.mean_score.toFixed(3)} tokens=${stats.usage.total_tokens} latency=${stats.mean_latency_ms == null ? 'n/a' : Math.round(stats.mean_latency_ms) + 'ms'}`);
}
for (const [baseId, stats] of Object.entries(paired)) {
  console.log(`paired ${baseId}: n=${stats.pairs} base_only=${stats.base_only} urai_only=${stats.urai_only} lift=${stats.absolute_pass_rate_lift == null ? 'n/a' : (stats.absolute_pass_rate_lift * 100).toFixed(1) + 'pp'} McNemar_p=${stats.mcnemar_exact_two_sided_p.toFixed(4)}`);
}
console.log(`results=${resultsDir}`);

if (failOnErrors && allTrials.some((trial) => trial.status === 'error')) process.exitCode = 2;
