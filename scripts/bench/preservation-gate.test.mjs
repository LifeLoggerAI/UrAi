import assert from 'node:assert/strict';
import test from 'node:test';
import {
  answersEquivalent,
  decideAnswerPreservation,
  validateOutputContract,
} from './preservation-gate.mjs';

const taskPrompt = 'Return ONLY a JSON object with keys value and status.';
const baseAnswer = '{"value":7,"status":"ready"}';
const candidateAnswer = '{"value":8,"status":"ready"}';

function stage(overrides = {}) {
  return JSON.stringify({
    decision: 'replace',
    defect_verified: true,
    defect_type: 'arithmetic_error',
    defect_claim: 'The base answer uses 7, but the verified arithmetic result is 8.',
    evidence: ['4 + 4 evaluates to 8, not 7.'],
    candidate_answer: candidateAnswer,
    confidence: 0.98,
    ...overrides,
  });
}

test('normalizes equivalent JSON independent of key order and fences', () => {
  assert.equal(answersEquivalent(baseAnswer, '```json\n{"status":"ready","value":7}\n```'), true);
});

test('recognizes a JSON output contract without using scorer answers', () => {
  assert.deepEqual(validateOutputContract(taskPrompt, baseAnswer), { valid: true, reasons: [] });
  assert.equal(validateOutputContract(taskPrompt, 'value=7').valid, false);
});

test('preserves when a gate stage is malformed', () => {
  const result = decideAnswerPreservation({
    taskPrompt,
    baseAnswer,
    challengeText: '{bad json',
    verificationText: stage(),
    arbiterText: stage(),
  });
  assert.equal(result.decision, 'preserve');
  assert.equal(result.selected_answer, baseAnswer);
});

test('preserves unless replacement is unanimous', () => {
  const result = decideAnswerPreservation({
    taskPrompt,
    baseAnswer,
    challengeText: stage({ decision: 'preserve' }),
    verificationText: stage(),
    arbiterText: stage(),
  });
  assert.equal(result.reason, 'replacement_not_unanimous');
});

test('preserves below the confidence threshold', () => {
  const result = decideAnswerPreservation({
    taskPrompt,
    baseAnswer,
    challengeText: stage({ confidence: 0.7 }),
    verificationText: stage(),
    arbiterText: stage(),
  });
  assert.equal(result.reason, 'confidence_below_threshold');
});

test('preserves when candidate answers disagree', () => {
  const result = decideAnswerPreservation({
    taskPrompt,
    baseAnswer,
    challengeText: stage(),
    verificationText: stage({ candidate_answer: '{"value":9,"status":"ready"}' }),
    arbiterText: stage(),
  });
  assert.equal(result.reason, 'candidate_disagreement');
});

test('preserves when stages disagree on defect type', () => {
  const result = decideAnswerPreservation({
    taskPrompt,
    baseAnswer,
    challengeText: stage(),
    verificationText: stage({ defect_type: 'constraint_violation' }),
    arbiterText: stage(),
  });
  assert.equal(result.reason, 'defect_type_disagreement');
});

test('preserves a valid base against a format-only rewrite', () => {
  const formatStage = stage({
    defect_type: 'format_error',
    defect_claim: 'The base answer allegedly has an output formatting defect.',
    evidence: ['The challenger prefers a different JSON presentation.'],
  });
  const result = decideAnswerPreservation({
    taskPrompt,
    baseAnswer,
    challengeText: formatStage,
    verificationText: formatStage,
    arbiterText: formatStage,
  });
  assert.equal(result.reason, 'unsupported_format_only_rewrite');
});

test('replaces only after unanimous, concrete, high-confidence verification', () => {
  const result = decideAnswerPreservation({
    taskPrompt,
    baseAnswer,
    challengeText: stage(),
    verificationText: stage(),
    arbiterText: stage(),
  });
  assert.equal(result.decision, 'replace');
  assert.equal(result.selected_answer, candidateAnswer);
  assert.equal(result.reason, 'unanimous_verified_defect');
});

test('returns the base answer verbatim when preserving', () => {
  const fencedBase = '```json\n{"status":"ready","value":7}\n```';
  const result = decideAnswerPreservation({
    taskPrompt,
    baseAnswer: fencedBase,
    challengeText: stage({ decision: 'preserve' }),
    verificationText: stage(),
    arbiterText: stage(),
  });
  assert.equal(result.selected_answer, fencedBase);
});
