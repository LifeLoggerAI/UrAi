import test from 'node:test';
import assert from 'node:assert/strict';
import {
  exactTwoSidedMcNemar,
  hierarchicalPairedBootstrap,
  macroFamilyAccuracyDelta,
  pairedAccuracyStats,
} from './paired-stats.mjs';

test('exact McNemar handles no discordant pairs', () => {
  assert.equal(exactTwoSidedMcNemar(0, 0), 1);
});

test('paired stats preserve task pairing', () => {
  const left = [
    { task_id: 'a', family: 'f1', passed: true },
    { task_id: 'b', family: 'f1', passed: false },
    { task_id: 'c', family: 'f2', passed: false },
  ];
  const right = [
    { task_id: 'a', family: 'f1', passed: true },
    { task_id: 'b', family: 'f1', passed: true },
    { task_id: 'c', family: 'f2', passed: false },
  ];
  const stats = pairedAccuracyStats(left, right);
  assert.equal(stats.pairs, 3);
  assert.equal(stats.both_pass, 1);
  assert.equal(stats.right_only, 1);
  assert.equal(stats.left_only, 0);
  assert.equal(stats.right_minus_left_accuracy, 1 / 3);
});

test('macro family delta weights families equally', () => {
  const rows = [
    { family: 'large', delta: 1 },
    { family: 'large', delta: 1 },
    { family: 'large', delta: 1 },
    { family: 'small', delta: -1 },
  ];
  const result = macroFamilyAccuracyDelta(rows);
  assert.equal(result.macro_delta, 0);
  assert.equal(result.families_positive, 1);
  assert.equal(result.families_negative, 1);
});

test('hierarchical bootstrap is deterministic for a frozen seed', () => {
  const rows = [];
  for (const family of ['f1', 'f2', 'f3']) {
    for (let i = 0; i < 10; i += 1) rows.push({ family, delta: i < 8 ? 1 : 0 });
  }
  const first = hierarchicalPairedBootstrap(rows, { replicates: 2000, seed: 123 });
  const second = hierarchicalPairedBootstrap(rows, { replicates: 2000, seed: 123 });
  assert.deepEqual(first, second);
  assert.ok(first.micro_accuracy_delta_ci95[0] > 0);
  assert.ok(first.macro_family_accuracy_delta_ci95[0] > 0);
});

test('bootstrap rejects underspecified replicate counts', () => {
  assert.throws(() => hierarchicalPairedBootstrap([{ family: 'f', delta: 1 }], { replicates: 100 }), /replicates/);
});
