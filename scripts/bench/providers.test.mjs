import assert from 'node:assert/strict';
import test from 'node:test';
import { createUraiCouncilHarness } from './providers.mjs';

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
      const text = outputs[index];
      index += 1;
      if (text == null) throw new Error('No scripted output for call');
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

function gateStage({ decision = 'replace', candidate = '{"value":8}', confidence = 0.98 } = {}) {
  return JSON.stringify({
    decision,
    defect_verified: decision === 'replace',
    defect_type: decision === 'replace' ? 'arithmetic_error' : 'none',
    defect_claim: decision === 'replace' ? 'The base arithmetic result is 7, but the verified result is 8.' : 'No concrete defect was verified.',
    evidence: decision === 'replace' ? ['Four plus four equals eight.'] : ['The base answer satisfies the task.'],
    candidate_answer: candidate,
    confidence,
  });
}

test('Council v2 makes four calls and returns a preserved base verbatim', async () => {
  const base = '```json\n{"value":7}\n```';
  const provider = scriptedProvider([
    base,
    gateStage({ decision: 'preserve', candidate: base }),
    gateStage({ decision: 'preserve', candidate: base }),
    gateStage({ decision: 'preserve', candidate: base }),
  ]);
  const harness = createUraiCouncilHarness(provider);
  const result = await harness.complete({
    task: { id: 'preserve', prompt: 'Return ONLY a JSON object with key value.' },
    prompt: 'Return ONLY a JSON object with key value.',
    maxOutputTokens: 1200,
  });
  assert.equal(provider.calls.length, 4);
  assert.equal(result.text, base);
  assert.equal(result.metadata.gate_decision, 'preserve');
  assert.equal(Object.values(result.raw.stage_budgets).reduce((sum, value) => sum + value, 0), 1200);
});

test('Council v2 returns the verified candidate without regenerating it', async () => {
  const candidate = '{"value":8}';
  const provider = scriptedProvider([
    '{"value":7}',
    gateStage({ candidate }),
    gateStage({ candidate }),
    gateStage({ candidate }),
  ]);
  const harness = createUraiCouncilHarness(provider);
  const result = await harness.complete({
    task: { id: 'replace', prompt: 'Return ONLY a JSON object with key value.' },
    prompt: 'Return ONLY a JSON object with key value.',
    maxOutputTokens: 1200,
  });
  assert.equal(result.text, candidate);
  assert.equal(result.metadata.gate_decision, 'replace');
  assert.equal(result.metadata.gate_reason, 'unanimous_verified_defect');
});

test('Council v2 preserves when verifier and arbiter candidates differ', async () => {
  const base = '{"value":7}';
  const provider = scriptedProvider([
    base,
    gateStage({ candidate: '{"value":8}' }),
    gateStage({ candidate: '{"value":9}' }),
    gateStage({ candidate: '{"value":8}' }),
  ]);
  const harness = createUraiCouncilHarness(provider);
  const result = await harness.complete({
    task: { id: 'disagree', prompt: 'Return ONLY a JSON object with key value.' },
    prompt: 'Return ONLY a JSON object with key value.',
    maxOutputTokens: 1200,
  });
  assert.equal(result.text, base);
  assert.equal(result.metadata.gate_decision, 'preserve');
  assert.equal(result.metadata.gate_reason, 'candidate_disagreement');
});
