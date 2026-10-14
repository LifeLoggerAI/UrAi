import assert from 'node:assert/strict';
import test from 'node:test';
import { createExtendedSelfRefineCanonicalHarness, EXTENDED_SELF_REFINE_VERSION } from './extended-self-refine.mjs';

const task = {
  id: 'workers',
  prompt: 'Three workers complete 60 tasks each. Respond ONLY JSON object with exactly key tasks.',
  scorer: { type: 'json_equals', value: { tasks: 180 }, canary: 'DO_NOT_SEND_TO_PROVIDER_4321' },
};

function fakeProvider(outputs) {
  const calls = [];
  return {
    id: 'fixture',
    model: 'fixture-model',
    availability: { available: true },
    calls,
    async complete(input) {
      calls.push(input);
      if (!outputs.length) throw new Error('UNEXPECTED_PROVIDER_CALL');
      const output = outputs.shift();
      if (output instanceof Error) throw output;
      return { text: output, attempts: 1, usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 } };
    },
  };
}

test('six-call self-refinement corrects on a concrete final revision', async () => {
  const provider = fakeProvider([
    'The tasks total 180.',
    '{"tasks":150}',
    'The arithmetic may be wrong.',
    '{"tasks":150}',
    'Three times 60 is 180.',
    '{"tasks":180}',
  ]);
  const result = await createExtendedSelfRefineCanonicalHarness(provider).complete({ task, prompt: task.prompt, maxOutputTokens: 900 });
  assert.deepEqual(JSON.parse(result.text), { tasks: 180 });
  assert.equal(result.metadata.harness, EXTENDED_SELF_REFINE_VERSION);
  assert.equal(result.attempts, 6);
  assert.equal(result.usage.total_tokens, 90);
  assert.equal(provider.calls.length, 6);
  assert.equal(provider.calls[4].maxOutputTokens, 225);
  assert.equal(provider.calls[5].maxOutputTokens, 225);
  assert.equal(provider.calls.some(x => x.prompt.includes('DO_NOT_SEND_TO_PROVIDER_4321')), false);
});

test('six-call self-refinement can preserve a correct answer', async () => {
  const provider = fakeProvider(['requirements', '{"tasks":180}', 'no defects', '{"tasks":180}', 'no defects', '{"tasks":180}']);
  const result = await createExtendedSelfRefineCanonicalHarness(provider).complete({ task, prompt: task.prompt, maxOutputTokens: 900 });
  assert.equal(result.text, '{"tasks":180}');
  assert.equal(result.raw.self_refinement_prior.text, '{"tasks":180}');
});

test('provider failure does not disguise an incomplete comparison', async () => {
  const provider = fakeProvider(['requirements', '{"tasks":180}', 'no defects', '{"tasks":180}', new Error('PROVIDER_UNAVAILABLE')]);
  await assert.rejects(
    createExtendedSelfRefineCanonicalHarness(provider).complete({ task, prompt: task.prompt, maxOutputTokens: 900 }),
    /PROVIDER_UNAVAILABLE/,
  );
});

test('invalid budgets do not send any requests', () => {
  const provider = fakeProvider([]);
  assert.rejects(
    createExtendedSelfRefineCanonicalHarness(provider).complete({ task, prompt: task.prompt, maxOutputTokens: 100 }),
    /INVALID_TOTAL_BUDGET/,
  );
  assert.equal(provider.calls.length, 0);
});
