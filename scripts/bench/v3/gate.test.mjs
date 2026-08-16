import assert from 'node:assert/strict';
import test from 'node:test';
import { decideIndependentBuilderPreservation } from './gate.mjs';

const taskPrompt = 'Return only JSON with keys balance and entries_applied.';

function critic({ type = 'arithmetic_error', candidate, confidence = 0.95 }) {
  return JSON.stringify({
    decision: 'replace',
    defect_verified: true,
    defect_type: type,
    defect_claim: 'The Builder contains a concrete independently verified defect.',
    evidence: ['Recomputation from the stated source values proves the corrected result.'],
    candidate_answer: candidate,
    confidence,
  });
}

test('treats structured and string candidate answers as semantically equivalent', () => {
  const result = decideIndependentBuilderPreservation({
    taskPrompt,
    builderAnswer: '{"balance":153,"entries_applied":4}',
    criticAText: critic({ candidate: { balance: 158, entries_applied: 4 } }),
    criticBText: critic({ candidate: '{"balance":158,"entries_applied":4}' }),
  });
  assert.equal(result.decision, 'replace');
  assert.deepEqual(JSON.parse(result.selected_answer), { balance: 158, entries_applied: 4 });
});

test('preserves on constraint-violation rewrites even when critics agree', () => {
  const result = decideIndependentBuilderPreservation({
    taskPrompt: 'Return only JSON with keys selected and score.',
    builderAnswer: '{"selected":"P5B","score":85}',
    criticAText: critic({ type: 'constraint_violation', candidate: '{"selected":"P5D","score":88}' }),
    criticBText: critic({ type: 'constraint_violation', candidate: '{"selected":"P5D","score":88}' }),
  });
  assert.equal(result.decision, 'preserve');
  assert.equal(result.reason, 'invalid_or_non_replaceable_defect_type');
});

test('preserves when independently computed candidates disagree', () => {
  const result = decideIndependentBuilderPreservation({
    taskPrompt,
    builderAnswer: '{"balance":153,"entries_applied":4}',
    criticAText: critic({ candidate: '{"balance":158,"entries_applied":4}' }),
    criticBText: critic({ candidate: '{"balance":159,"entries_applied":4}' }),
  });
  assert.equal(result.decision, 'preserve');
  assert.equal(result.reason, 'candidate_disagreement');
});
