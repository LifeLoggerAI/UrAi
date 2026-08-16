import test from 'node:test';
import assert from 'node:assert/strict';
import { extractPreCanonicalSystemOutput, strictWholeJsonScore } from './strict-contract.mjs';

const task = { scorer: { type: 'json_equals', value: { selected: 'B1' } } };

test('strict scorer accepts whole exact JSON', () => {
  const result = strictWholeJsonScore(task, '{"selected":"B1"}');
  assert.equal(result.passed, true);
});

test('strict scorer rejects fenced JSON even when semantically correct', () => {
  const result = strictWholeJsonScore(task, '```json\n{"selected":"B1"}\n```');
  assert.equal(result.passed, false);
});

test('strict scorer rejects extra keys', () => {
  const result = strictWholeJsonScore(task, '{"selected":"B1","score":99}');
  assert.equal(result.passed, false);
});

test('extracts direct pre-canonical model output', () => {
  assert.equal(extractPreCanonicalSystemOutput('direct', { text: 'canon', raw: { pre_canonical_output: 'raw' } }), 'raw');
});

test('extracts self-refine final model stage', () => {
  assert.equal(extractPreCanonicalSystemOutput('self_refine', { text: 'canon', raw: { stages: { final: { text: 'raw-final' } } } }), 'raw-final');
});

test('extracts Council gate-selected answer before final canonicalization', () => {
  assert.equal(extractPreCanonicalSystemOutput('council_v3', { text: 'canon', raw: { gate: { selected_answer: 'gate-answer' } } }), 'gate-answer');
});
