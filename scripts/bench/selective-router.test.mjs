import assert from 'node:assert/strict';
import test from 'node:test';
import { promptComplexityFeatures, routePrompt, createSelectiveRouterHarness } from './selective-router.mjs';

test('router escalates multi-constraint candidate selection without using family labels', () => {
  const prompt = 'Choose exactly one candidate with cost <= 47 and risk <= 2. Among valid candidates choose highest score; ties go to lower cost.';
  const route = routePrompt(prompt);
  assert.equal(route.action, 'reduced_council');
  assert.equal(route.features.multi_constraint, true);
  assert.equal(route.features.competing_records, true);
});

test('router leaves a simple stable-version task direct', () => {
  const route = routePrompt('Return only JSON with key selected. Choose the highest stable release. Pre-release labels are not stable.');
  assert.equal(route.action, 'direct');
});

test('feature extraction is deterministic', () => {
  assert.deepEqual(
    promptComplexityFeatures('Start balance=10. Entry 1 adds 2. A historical duplicate later repeats Entry 1.'),
    {
      state_revision: true,
      multi_constraint: false,
      dependency_reasoning: false,
      reconciliation: true,
      competing_records: false,
    },
  );
});

test('router executes only the selected path', async () => {
  let directCalls = 0;
  let reducedCalls = 0;
  const base = {
    id: 'scripted',
    model: 'scripted-v1',
    availability: { available: true },
    async complete() {
      directCalls += 1;
      return { text: '{"ok":true}', model: 'scripted-v1', usage: {}, attempts: 1, raw: {} };
    },
  };
  const reduced = {
    async complete() {
      reducedCalls += 1;
      return { text: '{"ok":true}', model: 'scripted-v1', usage: {}, attempts: 2, metadata: {}, raw: {} };
    },
  };
  const harness = createSelectiveRouterHarness(base, reduced);
  await harness.complete({ task: {}, prompt: 'Return only JSON with key selected. Choose the highest stable release.', maxOutputTokens: 1200 });
  assert.equal(directCalls, 1);
  assert.equal(reducedCalls, 0);
});
