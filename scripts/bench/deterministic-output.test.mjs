import assert from 'node:assert/strict';
import test from 'node:test';
import { extractFinalJsonValue, normalizeRequestedOutput } from './deterministic-output.mjs';

test('extracts the final fenced JSON value from reasoning text', () => {
  const output = 'First I considered {"selected":"X"}.\nFinal:\n```json\n{"selected":"Y"}\n```';
  assert.deepEqual(extractFinalJsonValue(output), {
    found: true,
    value: { selected: 'Y' },
    source: 'final_fenced_json',
  });
});

test('extracts the final balanced JSON value when there is no fence', () => {
  const output = 'Candidate: {"selected":"X"}\nAfter applying the tiebreak, final answer: {"selected":"Y"}';
  const result = extractFinalJsonValue(output);
  assert.equal(result.found, true);
  assert.deepEqual(result.value, { selected: 'Y' });
  assert.equal(result.source, 'final_balanced_json');
});

test('normalizes JSON output when the task requests JSON', () => {
  const result = normalizeRequestedOutput('Return only JSON with key selected.', 'Reasoning...\n{"selected":"Y"}');
  assert.equal(result.text, '{"selected":"Y"}');
  assert.equal(result.changed, true);
});

test('repairs a deterministic nested selected shape', () => {
  const result = normalizeRequestedOutput(
    'Return only JSON with keys selected and score.',
    '{"selected":{"id":"Y","score":91}}',
  );
  assert.equal(result.text, '{"selected":"Y","score":91}');
  assert.match(result.extraction_source, /shape_repair$/);
});

test('repairs id to selected for a single-key contract', () => {
  const result = normalizeRequestedOutput('Return only JSON with key selected.', '{"id":"Y"}');
  assert.equal(result.text, '{"selected":"Y"}');
});

test('does not rewrite non-JSON tasks', () => {
  const raw = 'Answer: Y';
  assert.deepEqual(normalizeRequestedOutput('Return only the candidate letter.', raw), {
    text: raw,
    changed: false,
    extraction_source: 'not_requested',
  });
});
