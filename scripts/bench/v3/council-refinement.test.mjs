import assert from 'node:assert/strict';
import test from 'node:test';
import { createCouncilSelfRefinementHarnessV1, COUNCIL_REFINEMENT_VERSION } from './council-refinement.mjs';

const task = {
  id: 'synthetic-worker',
  prompt: 'Three workers finish 60 tasks each. Respond ONLY JSON object with exactly key tasks.',
  scorer: { type: 'json_equals', value: { tasks: 180 }, secret_canary: 'PRIVATE_ANSWER_KEY_CANARY' },
};

function approval(candidate, confidence = 0.99, type = 'arithmetic_error') {
  return JSON.stringify({
    decision: 'replace',
    defect_verified: true,
    defect_type: type,
    defect_claim: 'Adding the three equal worker contributions changes the stated total.',
    evidence: ['Three contributions of 60 each add to 180, not 150.'],
    candidate_answer: candidate,
    confidence,
  });
}

function preserve() {
  return JSON.stringify({
    decision: 'preserve',
    defect_verified: false,
    defect_type: 'none',
    defect_claim: 'No independently proven defect was located.',
    evidence: [],
    candidate_answer: '{"tasks":150}',
    confidence: 0.2,
  });
}

function fixture(outputs) {
  const calls = [];
  return {
    calls,
    id: 'fixture',
    model: 'fixture-model',
    availability: { available: true },
    async complete(input) {
      calls.push(input);
      if (!outputs.length) throw new Error('MOCK_UNEXPECTED_PROVIDER_CALL');
      const next = outputs.shift();
      if (next instanceof Error) throw next;
      return {
        text: next,
        attempts: 1,
        usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 },
      };
    },
  };
}

function script(builder, refiners) {
  return [
    'Three worker contributions total 180. Preserve specified key.',
    builder,
    preserve(),
    preserve(),
    ...refiners,
  ];
}

test('safeguarded Council self-refinement can correct a verified numeric candidate', async () => {
  const base = fixture(script('{"tasks":150}', [approval({ tasks: 180 }), approval('{"tasks":180}')]));
  const result = await createCouncilSelfRefinementHarnessV1(base).complete({ task, prompt: task.prompt, maxOutputTokens: 900 });
  assert.deepEqual(JSON.parse(result.text), { tasks: 180 });
  assert.equal(result.raw.council.text, '{"tasks":150}');
  assert.equal(result.metadata.harness, COUNCIL_REFINEMENT_VERSION);
  assert.equal(result.metadata.council_gate_decision, 'preserve');
  assert.equal(result.metadata.refinement_gate_decision, 'replace');
  assert.equal(result.attempts, 6);
  assert.equal(result.usage.total_tokens, 90);
  assert.equal(base.calls.length, 6);
  assert.notEqual(base.calls[4].prompt, base.calls[5].prompt);
  assert.equal(base.calls.some((call) => call.prompt.includes('PRIVATE_ANSWER_KEY_CANARY')), false);
});

test('a disagreement between reviewers preserves the initial Council result', async () => {
  const base = fixture(script('{"tasks":150}', [approval('{"tasks":180}'), approval('{"tasks":190}')]));
  const result = await createCouncilSelfRefinementHarnessV1(base).complete({ task, prompt: task.prompt, maxOutputTokens: 900 });
  assert.equal(result.text, '{"tasks":150}');
  assert.equal(result.metadata.refinement_gate_decision, 'preserve');
  assert.equal(result.metadata.refinement_gate_reason, 'candidate_disagreement');
});

test('low-confidence attempted correction does not replace an answer', async () => {
  const base = fixture(script('{"tasks":150}', [approval('{"tasks":180}', 0.7), approval('{"tasks":180}', 0.99)]));
  const result = await createCouncilSelfRefinementHarnessV1(base).complete({ task, prompt: task.prompt, maxOutputTokens: 900 });
  assert.equal(result.text, '{"tasks":150}');
  assert.equal(result.metadata.refinement_gate_reason, 'confidence_below_threshold');
});

test('nonreplaceable defect types remain blocked even with unanimity', async () => {
  const base = fixture(script('{"tasks":150}', [approval('{"tasks":180}', 0.99, 'constraint_violation'), approval('{"tasks":180}', 0.99, 'constraint_violation')]));
  const result = await createCouncilSelfRefinementHarnessV1(base).complete({ task, prompt: task.prompt, maxOutputTokens: 900 });
  assert.equal(result.text, '{"tasks":150}');
  assert.equal(result.metadata.refinement_gate_reason, 'invalid_or_non_replaceable_defect_type');
});

test('malformed reviewer output preserves Council result', async () => {
  const base = fixture(script('{"tasks":150}', ['not JSON', approval('{"tasks":180}')]));
  const result = await createCouncilSelfRefinementHarnessV1(base).complete({ task, prompt: task.prompt, maxOutputTokens: 900 });
  assert.equal(result.text, '{"tasks":150}');
  assert.equal(result.metadata.refinement_gate_reason, 'unparseable_or_missing_critic');
});

test('provider failure stops instead of silently claiming refined output', async () => {
  const base = fixture(script('{"tasks":150}', [approval('{"tasks":180}'), new Error('PROVIDER_UNAVAILABLE')]));
  await assert.rejects(
    createCouncilSelfRefinementHarnessV1(base).complete({ task, prompt: task.prompt, maxOutputTokens: 900 }),
    /PROVIDER_UNAVAILABLE/,
  );
  assert.equal(base.calls.length, 6);
});

test('unsafe confidence relaxation fails before calling any provider', () => {
  const base = fixture([]);
  assert.throws(() => createCouncilSelfRefinementHarnessV1(base, { minimumConfidence: 0.7 }), /REFINEMENT_CONFIDENCE/);
  assert.equal(base.calls.length, 0);
});
