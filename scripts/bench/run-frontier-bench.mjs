#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import { appendJsonl, asPositiveInt, csv, nowIsoCompact, parseArgs, readJsonl, scoreTask, sha256File, summarizeTrials, writeJson, clampText } from './lib.mjs';
import { providerRegistry } from './providers.mjs';

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const suitePath = path.resolve(root, String(args.suite ?? 'bench/suites/urai-long-horizon-v1.jsonl'));
const providerIds = csv(args.providers, ['gemini', 'gemini+urai', 'fable', 'fable+urai', 'mythos']);
const repeats = asPositiveInt(args.repeats, 1);
const maxOutputTokens = asPositiveInt(args['max-output-tokens'], 1200);
const runId = String(args['run-id'] ?? nowIsoCompact());
const resultsDir = path.resolve(root, String(args['results-dir'] ?? path.join('bench', 'results', runId)));
const dryRun = Boolean(args['dry-run']);

const tasks = await readJsonl(suitePath);
if (!tasks.length) throw new Error(`Suite is empty: ${suitePath}`);
for (const task of tasks) {
  if (!task.id || !task.prompt) throw new Error('Each task requires id and prompt.');
}

const suiteSha256 = await sha256File(suitePath);
const registry = providerRegistry(process.env);
const unknown = providerIds.filter((id) => !registry[id]);
if (unknown.length) throw new Error(`Unknown providers: ${unknown.join(', ')}`);

const manifest = {
  schema_version: 1,
  run_id: runId,
  created_at: new Date().toISOString(),
  suite_path: path.relative(root, suitePath),
  suite_sha256: suiteSha256,
  task_count: tasks.length,
  repeats,
  max_output_tokens_per_task: maxOutputTokens,
  providers: providerIds.map((id) => ({ id, model: registry[id].model, availability: registry[id].availability })),
  node: process.version,
  dry_run: dryRun,
};
await writeJson(path.join(resultsDir, 'manifest.json'), manifest);

console.log(`URAI frontier benchmark ${runId}`);
console.log(`suite=${manifest.suite_path} sha256=${suiteSha256}`);
console.log(`providers=${providerIds.join(', ')} tasks=${tasks.length} repeats=${repeats} maxOutputTokens=${maxOutputTokens}`);
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
        console.log(`[${trial.passed ? 'PASS' : 'FAIL'}] ${providerId} ${task.id} score=${trial.score.toFixed(3)} latency=${trial.latency_ms}ms`);
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
for (const providerId of providerIds) {
  byProvider[providerId] = summarizeTrials(allTrials.filter((trial) => trial.provider === providerId));
}

const lift = {};
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
  };
}

const summary = { ...manifest, completed_at: new Date().toISOString(), by_provider: byProvider, harness_lift: lift };
await writeJson(path.join(resultsDir, 'summary.json'), summary);
console.log('\nSummary');
for (const [providerId, stats] of Object.entries(byProvider)) {
  console.log(`${providerId}: completed=${stats.completed} pass_rate=${stats.pass_rate == null ? 'n/a' : (stats.pass_rate * 100).toFixed(1) + '%'} mean_score=${stats.mean_score == null ? 'n/a' : stats.mean_score.toFixed(3)} tokens=${stats.usage.total_tokens}`);
}
console.log(`results=${resultsDir}`);
