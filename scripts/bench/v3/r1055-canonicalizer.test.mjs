import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalizeOutputContract } from './canonicalizer.mjs';

test('canonicalizer respects singular result key and type annotation', () => {
  const r=canonicalizeOutputContract('Return only JSON with key result, an integer.','{"result":-3527}');
  assert.deepEqual(JSON.parse(r.answer),{result:-3527});
});
test('canonicalizer keeps explicit plural keys', () => {
  const r=canonicalizeOutputContract('Return only JSON with keys a, b, and c.','{"a":1,"b":2,"c":3}');
  assert.deepEqual(JSON.parse(r.answer),{a:1,b:2,c:3});
});