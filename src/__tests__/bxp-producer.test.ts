import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { evaluateBxpTask, validateBxpResult, parseAndEvaluateBxpTask } from '../bxp/index.mjs';

const expected = { complete: ['complete','consistent'], 'b-absent': ['incomplete','consistent'], unresolved: ['unresolved','undetermined'],
  'multi-source': ['complete','consistent'], 'unresolved-scope': ['complete','undetermined'], conflict: ['complete','inconsistent'] };
for (const language of ['zh-CN','en']) for (const [variant, axes] of Object.entries(expected)) {
  test(`producer example ${language}/${variant}`, () => {
    const raw = readFileSync(new URL(`../../examples/bxp/${language}-${variant}.json`, import.meta.url));
    const task = JSON.parse(raw.toString('utf8'));
    const result = parseAndEvaluateBxpTask(raw);
    assert.equal(result.evaluation.validation, 'valid');
    assert.deepEqual([result.evaluation.completeness,result.evaluation.consistency], axes);
    assert.ok(validateBxpResult(result));
    assert.deepEqual(result,evaluateBxpTask(task));
    task.source.text = '!' + task.source.text.slice(1);
    assert.equal(evaluateBxpTask(task).evaluation.validation,'invalid');
  });
}
