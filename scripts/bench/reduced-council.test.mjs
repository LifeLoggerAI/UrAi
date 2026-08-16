import assert from 'node:assert/strict';
import test from 'node:test';
import { createReducedCouncilHarness, REDUCED_COUNCIL_VERSION } from './reduced-council.mjs';

function scriptedProvider(outputs) {
  let index = 0;
  const calls = [];
  return {
    id: 'scripted',
    model: 'scripted-v1',
    availability: { available: true },
    calls,
    async complete(request) {
      calls.push(request);
      const text = outputs[index++];
      return {
        text,
        model: 'scripted-v1',
        usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 },
        attempts: 1,
        raw: { scripted: true },
      };
    },
  };
}

test('reduced Council makes two calls and returns the Builder output', async () => {
  const provider = scriptedProvider(['ledger facts', '{"selected":"Y"}']);
  const harness = createReducedCouncilHarness(provider);
  const result = await harness.complete({
    task: { id: 'x', prompt: 'Return only JSON with key selected.' },
    prompt: 'Return only JSON with key selected.',
    maxOutputTokens: 1200,
  });

  assert.equal(provider.calls.length, 2);
  assert.equal(result.text, '{"selected":"Y"}');
  assert.equal(result.metadata.harness, REDUCED_COUNCIL_VERSION);
  assert.equal(result.metadata.nominal_model_calls, 2);
  assert.equal(Object.values(result.raw.stage_budgets).reduce((sum, value) => sum + value, 0), 1200);
});
