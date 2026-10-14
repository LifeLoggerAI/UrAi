import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { verifyHardDevelopmentEvidence } from './hard-development-integrity.mjs';

const families = [
  'temporal-corrections', 'multi-generation-relationships', 'consent-revocation',
  'provenance-and-unknowns', 'ledger-reconstruction', 'critical-path-timelines',
  'revised-memory-graph', 'multi-constraint-decisions',
];
const methods = [
  'direct', 'self_refinement', 'historical_council_v3',
  'historical_council_v3_plus_refinement', 'self_refinement_six_call',
];
const jsonl = rows => rows.map(row => JSON.stringify(row)).join('\n') + '\n';
const clone = obj => structuredClone(obj);
const trialCost = 0.0000045;
function example() {
  const suite = families.flatMap(family => [1, 2].map(n => ({
    id: `hard-v1-${family}-${String(n).padStart(3, '0')}`, family,
    prompt: `Fictional source-only case ${family} ${n}`,
    scorer: { type: 'json_equals', value: { answer: n } },
  })));
  const rows = suite.flatMap(task => methods.map(method => ({
    case_id: task.id, family: task.family, method,
    model: 'gpt-4o-mini-2024-07-18', status: 'completed',
    passed: true, score: 1, latency_ms: 100,
    usage: { input_tokens: 10, output_tokens: 5, calls: 1, estimated_cost_usd: trialCost },
    refinement_transition: null, output: JSON.stringify(task.scorer.value),
  })));
  const suiteRaw = jsonl(suite), trialsRaw = jsonl(rows);
  return {
    manifest: {
      git_sha: 'a'.repeat(40), suite_sha256: createHash('sha256').update(suiteRaw).digest('hex'),
      task_count: 16, model: 'gpt-4o-mini-2024-07-18',
      suite_generator: 'synthetic-life-evidence-hard-v1',
      suite_seed: 'development-only-seed-hard-20261014-v1',
      current_urai_council: false, development_only: true, confirmatory: false,
      hard_development_suite: true, method_ids: methods,
      cap_usd: 0.30, model_rate_usd_per_million: { input: 0.15, output: 0.60 },
    },
    summary: {
      status: 'COMPLETE', fail_code: null, uncertain_billing: false,
      total_trials: 80, expected_trials: 80, hard_local_cap_usd: 0.30,
      model_calls: 80, input_tokens: 800, output_tokens: 400,
      estimated_spend_usd: 0.00036,
      methods: Object.fromEntries(methods.map(method => [method, {
        completed: 16, correct: 16, accuracy: 1, mean_latency_ms: 100,
        p95_latency_ms: 100, model_calls: 16,
        refinement_helped: 0, refinement_harmed: 0, refinement_changed: 0,
        estimated_cost_usd: 0.000072,
      }])),
    },
    suiteRaw, trialsRaw,
  };
}
function mutateTrial(bundle, mutator) {
  const rows = bundle.trialsRaw.trimEnd().split('\n').map(JSON.parse);
  mutator(rows); bundle.trialsRaw = jsonl(rows);
}
test('complete synthetic evidence verifies, with no production claim', () => {
  const result = verifyHardDevelopmentEvidence(example());
  assert.equal(result.status, 'PASS');
  assert.equal(result.productionCouncilCertified, false);
  assert.equal(result.trial_count, 80);
});
test('rejects tampered per-case model output and incorrect score flags', () => {
  const x = example(); mutateTrial(x, rows => { rows[0].output = '{"answer":987}'; });
  assert.throws(() => verifyHardDevelopmentEvidence(x), /TRIAL_SCORE_MISMATCH/);
});
test('rejects duplicate case-method trials even if total count is preserved', () => {
  const x = example(); mutateTrial(x, rows => { rows[1] = clone(rows[0]); });
  assert.throws(() => verifyHardDevelopmentEvidence(x), /DUPLICATE_TRIAL/);
});
test('rejects changed source suite even if total number of tasks stays constant', () => {
  const x = example(); const suite = x.suiteRaw.trimEnd().split('\n').map(JSON.parse);
  suite[0].prompt = 'altered evidence'; x.suiteRaw = jsonl(suite);
  assert.throws(() => verifyHardDevelopmentEvidence(x), /SUITE_DIGEST_MISMATCH/);
});
test('rejects manipulated cost without touching model token accounting', () => {
  const x = example(); mutateTrial(x, rows => { rows[0].usage.estimated_cost_usd += 0.0002; });
  assert.throws(() => verifyHardDevelopmentEvidence(x), /TRIAL_COST_MISMATCH/);
});
test('rejects edited benchmark summary despite untouched trials', () => {
  const x = example(); x.summary.methods.direct.correct = 15;
  assert.throws(() => verifyHardDevelopmentEvidence(x), /METHOD_direct_correct_MISMATCH/);
});
test('rejects false production labels and lowered spend cap', () => {
  const x = example(); x.manifest.confirmatory = true;
  assert.throws(() => verifyHardDevelopmentEvidence(x), /EXPOSED_DEVELOPMENT_LABEL_MISSING/);
  const y = example(); y.manifest.cap_usd = 1.0;
  assert.throws(() => verifyHardDevelopmentEvidence(y), /SPENDING_CAP_INVALID/);
});
test('rejects invented refinement benefits and post-hoc mismatched scores', () => {
  const x = example(); mutateTrial(x, rows => {
    rows[0].refinement_transition = { baseline_passed: true, refined_passed: true,
      helped: true, harmed: false, selected_changed: false };
  });
  assert.throws(() => verifyHardDevelopmentEvidence(x), /REFINEMENT_TRANSITION_INVALID/);
});
