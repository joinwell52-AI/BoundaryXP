import test from 'node:test';
import assert from 'node:assert/strict';
import { baseline } from './hardening-cases.mjs';
import { parseStrictJson, parseAndEvaluateBxpTask, evaluateBxpTask, validateBxpTask, validateBxpResult, protocolInfo } from '../../src/bxp/index.mjs';

for (const raw of ['{"x":1,"x":2}', '{"x":1,"\\u0078":2}', '{"nested":{"x":1,"x":2}}',
  '9007199254740993', '1.0000000000000001', '1e400', '1e-400', '0.100000000000000001',
  '{"x":1,}', '[1,]', '"\\uD800"', 'null true', '\ufeff{}', ' '.repeat(2000001), '['.repeat(66) + '0' + ']'.repeat(66)]) {
  test(`strict JSON rejects ${raw.length > 80 ? `oversize/deep ${raw.length}` : raw}`, () => {
    assert.throws(() => parseStrictJson(raw));
    const result = parseAndEvaluateBxpTask(raw);
    assert.equal(result.evaluation.validation, 'invalid');
    assert.equal(result.evaluation.consistency, 'undetermined');
    assert.ok(validateBxpResult(result));
    assert.ok(Object.values(result.calculations).every(items => !items.length));
  });
}
test('strict JSON preserves supported finite numbers, strings, prototype keys and byte decoding', () => {
  assert.deepEqual(parseStrictJson('{"a":1e3,"b":0.4,"c":-0,"big":"9007199254740993"}'), { a: 1000, b: 0.4, c: -0, big: '9007199254740993' });
  assert.equal(Object.hasOwn(parseStrictJson('{"__proto__":1}'), '__proto__'), true);
  assert.throws(() => parseStrictJson(Buffer.from([0xff])));
  assert.deepEqual(parseAndEvaluateBxpTask(Buffer.from(JSON.stringify(baseline()))), evaluateBxpTask(baseline()));
});
test('production API has explicit validation and shared registry versions', () => {
  assert.equal(validateBxpTask(baseline()).valid, true);
  assert.equal(validateBxpTask({}).valid, false);
  assert.equal(validateBxpResult({}), false);
  assert.deepEqual(protocolInfo().core_elements, ['I','O','A','P','R','V','C','B']);
});
test('raw path rejects numeric precision loss inside an otherwise valid envelope', () => {
  const task = baseline(); task.extensions = { 'org.example.number': 1 };
  const raw = JSON.stringify(task).replace('"org.example.number":1', '"org.example.number":1.0000000000000001');
  assert.equal(parseAndEvaluateBxpTask(raw).evaluation.validation, 'invalid');
});
