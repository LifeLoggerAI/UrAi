import assert from 'node:assert/strict';
import test from 'node:test';
import { generateHardTasks, HARD_FAMILIES, HARD_GENERATOR_VERSION } from './hard-case-generator.mjs';

const a = generateHardTasks('pre-registered-synthetic-seed-A-20261014');
const b = generateHardTasks('pre-registered-synthetic-seed-B-20261014');
test('generator identity is versioned', () => assert.equal(HARD_GENERATOR_VERSION, 'synthetic-life-evidence-hard-v1'));
test('240 distinct tasks in balanced eight families', () => {
  assert.equal(a.length, 240);
  assert.equal(new Set(a.map(t => t.id)).size, a.length);
  for (const family of HARD_FAMILIES) assert.equal(a.filter(t => t.family === family).length, 30);
});
test('same seed is byte-identical and different seeds yield different test contents', () => {
  assert.deepEqual(generateHardTasks('pre-registered-synthetic-seed-A-20261014'), a);
  assert.notDeepEqual(a.map(t => t.scorer.value), b.map(t => t.scorer.value));
});
test('all tasks use an exact deterministic JSON answer contract and substantial context', () => {
  for (const item of a) {
    assert.equal(item.scorer.type, 'json_equals');
    assert.ok(item.prompt.length >= 450 && item.prompt.length <= 12000, item.id);
    assert.ok(item.prompt.includes('FICTIONAL LIFE-RECORD'));
    assert.ok(item.prompt.includes('Return ONLY'));
    assert.ok(item.scorer.value !== undefined);
    assert.ok(item.id.includes(item.family));
  }
});
test('permission IDs are always known source artifacts and no unexplained sharing occurs', () => {
  for (const item of a.filter(t => t.family === 'consent-revocation')) {
    const truth = item.scorer.value;
    assert.ok(['public','therapist'].includes(truth.purpose));
    assert.equal(truth.allowed_ids.length + truth.denied_count, 8);
    assert.deepEqual([...truth.allowed_ids].sort(), truth.allowed_ids);
    for (const id of truth.allowed_ids) assert.ok(item.prompt.includes(id));
  }
});
test('provenance unresolved cases explicitly abstain', () => {
  const cases = a.filter(t => t.family === 'provenance-and-unknowns');
  assert.equal(cases.filter(t => t.scorer.value.resolved === false).length, 15);
  assert.equal(cases.filter(t => t.scorer.value.resolved === true).length, 15);
  for (const c of cases.filter(t => !t.scorer.value.resolved)) {
    assert.equal(c.scorer.value.arrival_month, 'unknown');
    assert.equal(c.scorer.value.supporting_source_id, null);
  }
});
test('independent baseline oracle spot-checks graph paths and ledger invariants', () => {
  for (const c of a.filter(t => t.family === 'revised-memory-graph')) {
    assert.equal(c.scorer.value.path.length, 7);
    assert.equal(c.scorer.value.hops, 6);
    assert.equal(new Set(c.scorer.value.path).size, 7);
  }
  for (const c of a.filter(t => t.family === 'ledger-reconstruction')) {
    assert.equal(c.scorer.value.applied_entries, 6);
    assert.ok(Number.isInteger(c.scorer.value.final_balance));
  }
});
test('generator refuses invalid seed/count before producing data', () => {
  assert.throws(() => generateHardTasks('short'), /INVALID_SEED/);
  assert.throws(() => generateHardTasks('valid-seed-long-enough', { perFamily: 31 }), /INVALID_PER_FAMILY/);
});
