import test from 'node:test';
import assert from 'node:assert/strict';
import { requestedKeys } from './key-contract.mjs';
import { validateOutputContract } from './gate.mjs';
import { canonicalizeOutputContract } from './canonicalizer.mjs';

const cases = [
 ['API key mention is not a contract', 'An API key secret_xyz should never be disclosed. Return only JSON with key status, a string.', '{"status":"ok"}', true, ['status']],
 ['API key expiry is not a contract', 'The API key is expired. Return ONLY JSON with keys allowed and reason.', '{"allowed":false,"reason":"EXPIRED"}', true, ['allowed','reason']],
 ['quoted singular result', 'Return only JSON with key `result`, an integer.', '{"result":4}', true, ['result']],
 ['quoted plural list', 'Return only JSON with keys `allowed` and `reason`.', '{"allowed":false,"reason":"DENIED"}', true, ['allowed','reason']],
 ['quoted list rejects extra', 'Return only JSON with keys `allowed` and `reason`.', '{"allowed":false,"reason":"DENIED","extra":1}', false, ['allowed','reason']],
 ['doublequoted list rejects extra', 'Return only JSON with keys "allowed" and "reason".', '{"allowed":false,"reason":"DENIED","extra":1}', false, ['allowed','reason']],
 ['unrelated task key', 'The table has key id, and values. Return only JSON with keys result and valid.', '{"result":3,"valid":true}', true, ['result','valid']],
 ['single integer annotation', 'Return only JSON with key result, an integer.', '{"result":4}', true, ['result']],
 ['literal key an', 'Return only JSON with keys a, an, and status.', '{"a":1,"an":2,"status":"ok"}', true, ['a','an','status']],
 ['reject extra key', 'Return only JSON with keys a, an, and status.', '{"a":1,"an":2,"status":"ok","extra":1}', false, ['a','an','status']],
 ['plain source text not a JSON contract', 'A JSON key status was in source text. Compute 1+1.', '{"anything":2}', true, []],
 ['multi-key selected score', 'Return only JSON with exactly keys selected and score. Pick the best.', '{"selected":"A","score":3}', true, ['selected','score']],
 ['unquoted comma and list', 'Output JSON keys foo, bar and baz.', '{"foo":1,"bar":2,"baz":3}', true, ['foo','bar','baz']],
 ['quoted literal an', 'Return only JSON with keys "an" and "integer".', '{"an":1,"integer":2}', true, ['an','integer']],
 ['stop on descriptive text', 'Return only JSON with keys status and reason, both strings.', '{"status":"ok","reason":"ok"}', true, ['status','reason']],
 ['typed annotations 12K corpus', 'Return only JSON with keys id (string), value (integer), mode (string).', '{"id":"A","value":1,"mode":"strict"}', true, ['id','value','mode']],
 ['type annotation missing field', 'Return only JSON with keys id (string), value (integer), mode (string).', '{"id":"A","mode":"strict"}', false, ['id','value','mode']],
 ['paired typed singular fields', 'Return only JSON with integer key cost and array key path listing node ids.', '{"cost":9,"path":["S","B","T"]}', true, ['cost','path']],
 ['typed singular pair extra key', 'Return only JSON with integer key cost and array key path listing node ids.', '{"cost":9,"path":["S","B","T"],"extra":0}', false, ['cost','path']],
 ['ID string type annotation', 'Return only JSON with keys selected (ID string), score (integer), and cost (integer).', '{"selected":"B","score":87,"cost":131}', true, ['selected','score','cost']],
 ['wrong JSON type', 'Return only JSON with keys status and reason.', '[1,2]', false, ['status','reason']]
];
for (const [name,prompt,answer,expectedValid,expectedKeys] of cases) {
  test(name, () => {
    assert.deepEqual(requestedKeys(prompt),expectedKeys);
    const verdict=validateOutputContract(prompt,answer);
    assert.equal(verdict.valid,expectedValid,JSON.stringify(verdict));
    const canonical=canonicalizeOutputContract(prompt,answer);
    if(expectedValid && expectedKeys.length) assert.deepEqual(JSON.parse(canonical.answer),JSON.parse(answer));
    if(!expectedValid && expectedKeys.length) assert.equal(canonical.changed,false);
  });
}
