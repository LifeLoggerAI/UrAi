import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalizeOutputContract, OUTPUT_CANONICALIZER_VERSION } from './canonicalizer.mjs';

test('canonicalizer v2 version is explicit', () => {
  assert.equal(OUTPUT_CANONICALIZER_VERSION, 'prompt-contract-canonicalizer-v2');
});

test('projects id plus score into requested selected plus score', () => {
  const prompt = 'Return only JSON with exactly keys selected and score. Pick exactly one option with highest score.';
  const result = canonicalizeOutputContract(prompt, '{"id":"N3","score":89}');
  assert.equal(result.answer, '{"selected":"N3","score":89}');
  assert.equal(result.reason, 'deterministic_requested_key_projection');
});

test('drops unrequested candidate metadata without changing winner or score', () => {
  const prompt = 'Return only JSON with exactly keys selected and score. Choose the highest-scoring eligible candidate.';
  const result = canonicalizeOutputContract(prompt, '{"id":"N3","cost":56,"risk":2,"score":89}');
  assert.equal(result.answer, '{"selected":"N3","score":89}');
});

test('projects the first id from an explicitly requested ranking winner', () => {
  const prompt = 'Return only JSON with exactly key selected. Rank candidates lexicographically by highest priority, then quality.';
  const result = canonicalizeOutputContract(prompt, '[{"id":"B1"},{"id":"A1"}]');
  assert.equal(result.answer, '{"selected":"B1"}');
  assert.equal(result.reason, 'deterministic_ranked_winner_projection');
});

test('projects the first scalar from a ranking list', () => {
  const prompt = 'Return only JSON with exactly key selected. Rank candidates and select the winner.';
  const result = canonicalizeOutputContract(prompt, '["B1","A1"]');
  assert.equal(result.answer, '{"selected":"B1"}');
});

test('projects selected ranking list to its already-chosen first candidate', () => {
  const prompt = 'Return only JSON with exactly key selected. Rank candidates lexicographically and select the winner.';
  const result = canonicalizeOutputContract(prompt, '{"selected":[{"id":"B1","priority":4},{"id":"A1","priority":4}]}');
  assert.equal(result.answer, '{"selected":"B1"}');
});

test('does not alter a wrong first-ranked winner', () => {
  const prompt = 'Return only JSON with exactly key selected. Rank candidates and select the winner.';
  const result = canonicalizeOutputContract(prompt, '["E5","B5","A5"]');
  assert.equal(result.answer, '{"selected":"E5"}');
});

test('does not collapse arbitrary arrays when winner intent is absent', () => {
  const prompt = 'Return only JSON with exactly key selected. Preserve the supplied structure.';
  const original = '["B1","A1"]';
  const result = canonicalizeOutputContract(prompt, original);
  assert.equal(result.answer, original);
  assert.equal(result.changed, false);
});
