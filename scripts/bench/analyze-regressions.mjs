#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  ensureDir,
  parseArgs,
  readJsonl,
  scoreTask,
  writeJson,
} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const suitePath = path.resolve(process.cwd(), String(args.suite ?? 'bench/suites/urai-long-horizon-v2.jsonl'));
const trialsPath = path.resolve(process.cwd(), String(args.trials ?? 'bench/results/ci-matched-compute-v1/trials.jsonl'));
const outputDir = path.resolve(process.cwd(), String(args['output-dir'] ?? 'bench/results/forensics'));
const directId = String(args.direct ?? 'openai');
const councilId = String(args.council ?? 'openai+urai');
const selfRefineId = String(args.selfrefine ?? 'openai+selfrefine');

const tasks = await readJsonl(suitePath);
const trials = await readJsonl(trialsPath);
const taskMap = new Map(tasks.map((task) => [task.id, task]));
const repeats = [...new Set(trials.map((trial) => Number(trial.repeat ?? 1)))].sort((a, b) => a - b);

function findTrial(provider, taskId, repeat) {
  return trials.find((trial) => trial.provider === provider && trial.task_id === taskId && Number(trial.repeat ?? 1) === repeat);
}

function transition(direct, council) {
  if (!direct || !council || direct.status !== 'completed' || council.status !== 'completed') return 'missing_or_error';
  if (direct.passed && council.passed) return 'preservation';
  if (direct.passed && !council.passed) return 'regression';
  if (!direct.passed && council.passed) return 'recovery';
  return 'persistent_failure';
}

function scoreStage(task, text) {
  if (typeof text !== 'string') return null;
  return scoreTask(task, text);
}

function answerStageDiagnostics(task, council) {
  const stages = council?.raw?.stages ?? {};
  if (stages.builder) {
    const builder = scoreStage(task, stages.builder.text);
    const final = scoreStage(task, stages.final?.text ?? council.output);
    return {
      harness_version: 'v1',
      builder_passed: builder?.passed ?? null,
      builder_detail: builder?.detail ?? null,
      final_passed: final?.passed ?? null,
      earliest_answer_failure: builder?.passed === false ? 'archivist_or_builder' : (builder?.passed && final?.passed === false ? 'mirror_or_guardian' : null),
    };
  }
  if (stages.base) {
    const base = scoreStage(task, stages.base.text);
    const final = scoreStage(task, council.output);
    return {
      harness_version: 'v2',
      base_passed: base?.passed ?? null,
      final_passed: final?.passed ?? null,
      gate_decision: council.metadata?.gate_decision ?? council.raw?.gate?.decision ?? null,
      gate_reason: council.metadata?.gate_reason ?? council.raw?.gate?.reason ?? null,
      earliest_answer_failure: base?.passed && final?.passed === false ? 'preservation_gate' : (base?.passed === false ? 'base' : null),
    };
  }
  return { harness_version: 'unknown', earliest_answer_failure: null };
}

const matrix = [];
for (const repeat of repeats) {
  for (const task of tasks) {
    const direct = findTrial(directId, task.id, repeat);
    const selfRefine = findTrial(selfRefineId, task.id, repeat);
    const council = findTrial(councilId, task.id, repeat);
    matrix.push({
      task_id: task.id,
      family: task.family ?? 'uncategorized',
      repeat,
      scorer: task.scorer,
      transition: transition(direct, council),
      direct: direct ? {
        passed: direct.passed,
        output: direct.output,
        score_detail: direct.score_detail,
        usage: direct.usage,
        latency_ms: direct.latency_ms,
      } : null,
      self_refine: selfRefine ? {
        passed: selfRefine.passed,
        output: selfRefine.output,
        score_detail: selfRefine.score_detail,
        usage: selfRefine.usage,
        latency_ms: selfRefine.latency_ms,
      } : null,
      council: council ? {
        passed: council.passed,
        output: council.output,
        score_detail: council.score_detail,
        usage: council.usage,
        latency_ms: council.latency_ms,
        diagnostics: answerStageDiagnostics(task, council),
      } : null,
    });
  }
}

const counts = Object.fromEntries(['preservation', 'regression', 'recovery', 'persistent_failure', 'missing_or_error']
  .map((name) => [name, matrix.filter((row) => row.transition === name).length]));
const summaryByFamily = Object.fromEntries([...new Set(matrix.map((row) => row.family))].sort().map((family) => {
  const rows = matrix.filter((row) => row.family === family);
  return [family, {
    tasks: rows.length,
    preservation: rows.filter((row) => row.transition === 'preservation').length,
    regression: rows.filter((row) => row.transition === 'regression').length,
    recovery: rows.filter((row) => row.transition === 'recovery').length,
    persistent_failure: rows.filter((row) => row.transition === 'persistent_failure').length,
  }];
}));

const regressions = matrix.filter((row) => row.transition === 'regression');
const recoveries = matrix.filter((row) => row.transition === 'recovery');
const report = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  source: {
    suite: path.relative(process.cwd(), suitePath),
    trials: path.relative(process.cwd(), trialsPath),
    direct_provider: directId,
    self_refine_provider: selfRefineId,
    council_provider: councilId,
  },
  counts,
  net_council_value: counts.recovery - counts.regression,
  by_family: summaryByFamily,
};

await ensureDir(outputDir);
await writeJson(path.join(outputDir, 'summary.json'), report);
await writeJson(path.join(outputDir, 'task-matrix.json'), matrix);
await writeJson(path.join(outputDir, 'regressions.json'), regressions);
await writeJson(path.join(outputDir, 'recoveries.json'), recoveries);

const lines = [
  '# Council regression and recovery analysis',
  '',
  `- Direct provider: \`${directId}\``,
  `- Council provider: \`${councilId}\``,
  `- Pairs: ${matrix.length}`,
  `- Regressions: ${counts.regression}`,
  `- Recoveries: ${counts.recovery}`,
  `- Net Council value: ${report.net_council_value}`,
  '',
  '## Family matrix',
  '',
  '| Family | Pairs | Preserved | Regressed | Recovered | Both failed |',
  '| --- | ---: | ---: | ---: | ---: | ---: |',
  ...Object.entries(summaryByFamily).map(([family, value]) => `| ${family} | ${value.tasks} | ${value.preservation} | ${value.regression} | ${value.recovery} | ${value.persistent_failure} |`),
  '',
  '## Regressions',
  '',
  '| Task | Family | Earliest answer failure | Direct output | Council output |',
  '| --- | --- | --- | --- | --- |',
  ...regressions.map((row) => `| ${row.task_id} | ${row.family} | ${row.council.diagnostics.earliest_answer_failure ?? 'unknown'} | ${JSON.stringify(row.direct.output)} | ${JSON.stringify(row.council.output)} |`),
  '',
  '## Recoveries',
  '',
  '| Task | Family | Direct output | Council output |',
  '| --- | --- | --- | --- |',
  ...recoveries.map((row) => `| ${row.task_id} | ${row.family} | ${JSON.stringify(row.direct.output)} | ${JSON.stringify(row.council.output)} |`),
  '',
];
await writeFile(path.join(outputDir, 'report.md'), `${lines.join('\n')}\n`, 'utf8');

console.log(`pairs=${matrix.length} regressions=${counts.regression} recoveries=${counts.recovery} net=${report.net_council_value}`);
console.log(`results=${outputDir}`);
