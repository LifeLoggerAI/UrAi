import test from 'node:test';
import assert from 'node:assert/strict';
import { validateOutputContract } from './gate.mjs';

test('singular result key ignores following type annotations', () => {
  const prompt='Compute (26 * 18) + (-82 * 49) - (26 - 49). Return only JSON with key result, an integer.';
  assert.deepEqual(validateOutputContract(prompt,'{"result":-3527}'),{valid:true,reasons:[]});
  assert.deepEqual(validateOutputContract(prompt,'{"result":-3527,"an":1}'),{valid:false,reasons:['expected_exact_keys:result']});
});
test('explicit plural key lists remain exactly enforced', () => {
  const prompt='Return only JSON with keys balance, entries_applied, and retries.';
  assert.deepEqual(validateOutputContract(prompt,'{"balance":1,"entries_applied":2,"retries":3}'),{valid:true,reasons:[]});
  assert.deepEqual(validateOutputContract(prompt,'{"balance":1,"entries_applied":2}'),{valid:false,reasons:['expected_exact_keys:balance,entries_applied,retries']});
});
test('plural key literally named an is retained', () => {
  const prompt='Return only JSON with keys a, an, and status.';
  assert.deepEqual(validateOutputContract(prompt,'{"a":1,"an":2,"status":"ok"}'),{valid:true,reasons:[]});
  assert.deepEqual(validateOutputContract(prompt,'{"a":1,"status":"ok"}'),{valid:false,reasons:['expected_exact_keys:a,an,status']});
});
test('malformed JSON still fails closed', () => {
  assert.deepEqual(validateOutputContract('Return only JSON with key result.','{broken'),{valid:false,reasons:['invalid_json']});
});