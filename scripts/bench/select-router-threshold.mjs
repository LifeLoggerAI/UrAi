#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import { parseArgs, readJsonl, writeJson } from './lib.mjs';
import { promptComplexityFeatures, SELECTIVE_ROUTER_VERSION } from './selective-router.mjs';

const args = parseArgs(process.argv.slice(2));
const suitePath = path.resolve(process.cwd(), String(args.suite ?? 'bench/suites/urai-long-horizon-v2.jsonl'));
const trialsPath = path.resolve(process.cwd(), String(args.trials ?? 'bench/results/ci-dev-candidates-v3/trials.jsonl'));
const outputPath = path.resolve(process.cwd(), String(args.output ?? 'bench/results/ci-dev-candidates-v3/router-selection.json'));
const directId = String(args.direct ?? 'openai');
const reducedId = String(args.reduced ?? 'openai+builder2');
const callPenalty = Number(args['call-penalty'] ?? 0.01);

const tasks = await readJsonl(suitePath);
const trials = await readJsonl(trialsPath);
const taskMap = new Map(tasks.map((task) => [task.id, task]));
const direct = new Map(trials.filter((trial) => trial.provider === directId && trial.status === 'completed').map((trial) => [trial.task_id, trial]));
const reduced = new Map(trials.filter((trial) => trial.provider === reducedId && trial.status === 'completed').map((trial) => [trial.task_id, trial]));

const rows = [];
for (const [taskId, directTrial] of direct) {
  const reducedTrial = reduced.get(taskId);
  const task = taskMap.get(taskId);
  if (!reducedTrial || !task) continue;
  const features = promptComplexityFeatures(task.prompt);
  rows.push({
    task_id: taskId,
    family: task.family ?? 'uncategorized',
    feature_score: Object.values(features).filter(Boolean).length,
    features,
    direct_passed: directTrial.passed === true,
    reduced_passed: reducedTrial.passed === true,
  });
}

if (!rows.length) throw new Error('No paired direct/reduced development trials found.');

const thresholds = [1, 2, 3, 4, 5, 6];

function evaluate(values, threshold) {
  let correct = 0;
  let calls = 0;
  let escalated = 0;
  for (const row of values) {
    const useReduced = row.feature_score >= threshold;
    if (useReduced) {
      escalated += 1;
      calls += 2;
      if (row.reduced_passed) correct += 1;
    } else {
      calls += 1;
      if (row.direct_passed) correct += 1;
    }
  }
  const accuracy = values.length ? correct / values.length : null;
  const meanCalls = values.length ? calls / values.length : null;
  const utility = accuracy == null ? null : accuracy - callPenalty * meanCalls;
  return { threshold, tasks: values.length, correct, accuracy, calls, mean_calls: meanCalls, escalated, utility };
}

function chooseThreshold(values) {
  return thresholds
    .map((threshold) => evaluate(values, threshold))
    .sort((left, right) =>
      right.utility - left.utility ||
      right.accuracy - left.accuracy ||
      left.mean_calls - right.mean_calls ||
      right.threshold - left.threshold,
    )[0];
}

const families = [...new Set(rows.map((row) => row.family))].sort();
const folds = [];
for (const family of families) {
  const train = rows.filter((row) => row.family !== family);
  const test = rows.filter((row) => row.family === family);
  const selected = chooseThreshold(train);
  const heldOut = evaluate(test, selected.threshold);
  folds.push({ held_out_family: family, selected_on_training: selected, held_out: heldOut });
}

const cvCorrect = folds.reduce((sum, fold) => sum + fold.held_out.correct, 0);
const cvTasks = folds.reduce((sum, fold) => sum + fold.held_out.tasks, 0);
const cvCalls = folds.reduce((sum, fold) => sum + fold.held_out.calls, 0);
const fullSelection = chooseThreshold(rows);
const directOnly = evaluate(rows, 6);
const reducedOnly = evaluate(rows, 1);

const report = {
  schema_version: 1,
  router_version: SELECTIVE_ROUTER_VERSION,
  development_only: true,
  source: {
    suite: path.relative(process.cwd(), suitePath),
    trials: path.relative(process.cwd(), trialsPath),
    direct_provider: directId,
    reduced_provider: reducedId,
  },
  declared_utility: `accuracy - ${callPenalty} * mean_nominal_model_calls`,
  thresholds_considered: thresholds,
  leave_one_family_out: {
    folds,
    tasks: cvTasks,
    correct: cvCorrect,
    accuracy: cvTasks ? cvCorrect / cvTasks : null,
    calls: cvCalls,
    mean_calls: cvTasks ? cvCalls / cvTasks : null,
  },
  full_development_fit_for_freeze_candidate: fullSelection,
  reference: {
    direct_only: directOnly,
    reduced_only: reducedOnly,
  },
  note: 'The leave-one-family-out estimate is the anti-overfitting diagnostic. The full-development threshold is only a candidate to freeze after reviewing fold stability and negative family effects. No holdout result was used.',
};

await writeJson(outputPath, report);
console.log(`router=${SELECTIVE_ROUTER_VERSION} cv_accuracy=${(report.leave_one_family_out.accuracy * 100).toFixed(1)}% cv_mean_calls=${report.leave_one_family_out.mean_calls.toFixed(2)}`);
console.log(`candidate_threshold=${fullSelection.threshold} candidate_accuracy=${(fullSelection.accuracy * 100).toFixed(1)}% candidate_mean_calls=${fullSelection.mean_calls.toFixed(2)}`);
console.log(`output=${outputPath}`);
