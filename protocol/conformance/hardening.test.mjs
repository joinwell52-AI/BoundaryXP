import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { evaluateTask, digest } from './evaluate.mjs';
import { validateResultSchema } from './validation.mjs';
import { baseline, hardeningCases, verifyHardening } from './hardening-cases.mjs';
import { compareDecimal, normalizeBound } from './decimal.mjs';

for (const item of hardeningCases) {
  test(item.name, () => {
    const before = structuredClone(item.task);
    const result = evaluateTask(item.task);
    verifyHardening(item, result);
    assert.ok(validateResultSchema(result));
    assert.deepEqual(item.task, before);
    assert.deepEqual(evaluateTask(structuredClone(item.task)), result);
  });
}

test('input digest binds profiles, sources, extensions and key-order independent JSON', () => {
  const task = baseline();
  const original = evaluateTask(task);
  assert.equal(original.input_digest, digest(task));
  assert.deepEqual(evaluateTask(Object.fromEntries(Object.entries(task).reverse())), original);
  task.extensions = { 'org.example.context': { pack: 'l2@1', rule: 'rule-1' } };
  const changed = evaluateTask(task);
  assert.equal(changed.source_digest, original.source_digest);
  assert.notEqual(changed.input_digest, original.input_digest);
  assert.deepEqual(changed.extensions, {});
  task.profile.id = 'org.example.profile';
  assert.notEqual(evaluateTask(task).input_digest, changed.input_digest);
  const policyTask = structuredClone(hardeningCases.find(item => item.name === 'versioned secondary source evidence').task);
  const firstPolicy = evaluateTask(policyTask);
  policyTask.sources[0].version = '2';
  const nextPolicy = evaluateTask(policyTask);
  assert.equal(nextPolicy.source_digest, firstPolicy.source_digest);
  assert.notEqual(nextPolicy.input_digest, firstPolicy.input_digest);
});

test('non-JSON, ill-formed Unicode and boundedness failures return valid error envelopes', () => {
  const cycle = {}; cycle.self = cycle;
  const long = baseline(); long.source.text = 'x'.repeat(100001);
  const huge = baseline(); huge.extensions = { 'org.example.large': 'x'.repeat(2000001) };
  const legacy = baseline(); legacy.protocol_version = '0.2.0-draft.1';
  const malformedDecimal = baseline();
  malformedDecimal.constraints.intervals = [{ id: 'newline', subject: 'items', dimension: 'count', unit: 'item',
    lower: { value: '1\n', inclusive: true }, upper: null, evidence: malformedDecimal.elements.I.entries[0].evidence }];
  for (const task of [undefined, null, NaN, Infinity, cycle, long, huge, legacy, malformedDecimal, { task_id: '\uD800' }]) {
    const result = evaluateTask(task);
    assert.equal(result.evaluation.validation, 'invalid');
    assert.ok(validateResultSchema(result));
  }
});

test('integer normalization agrees with independent floor and ceiling for signed tenths', () => {
  for (let numerator = -100; numerator <= 100; numerator += 1) {
    const value = (numerator / 10).toFixed(1);
    for (const inclusive of [true, false]) {
      const lower = normalizeBound({ value, inclusive }, 'integer', true);
      const upper = normalizeBound({ value, inclusive }, 'integer', false);
      assert.equal(lower.value, String(inclusive ? Math.ceil(numerator / 10) : Math.floor(numerator / 10) + 1));
      assert.equal(upper.value, String(inclusive ? Math.floor(numerator / 10) : Math.ceil(numerator / 10) - 1));
    }
  }
  assert.equal(compareDecimal('-0.000', '0'), 0);
  assert.equal(compareDecimal('0.1000', '0.1'), 0);
  assert.equal(compareDecimal('-9007199254740993', '-9007199254740992'), -1);
});

test('dependency witnesses are stable under edge reordering and only prerequisite edges count', () => {
  const task = baseline();
  const evidence = task.elements.I.entries[0].evidence;
  task.constraints.dependencies = [
    { id: 'ba', from: 'b', to: 'a', kind: 'prerequisite', evidence },
    { id: 'ab', from: 'a', to: 'b', kind: 'prerequisite', evidence },
    { id: 'bc', from: 'b', to: 'c', kind: 'reference', evidence },
  ];
  const first = evaluateTask(task);
  assert.deepEqual(first.calculations.dependencies, [{ scope_id: 'task', prerequisite_edges: 2,
    cycles: [{ nodes: ['a', 'b', 'a'], edge_ids: ['ab', 'ba'] }] }]);
  task.constraints.dependencies.reverse();
  assert.deepEqual(evaluateTask(task).calculations, first.calculations);
});

test('Chinese and English projections share calculations without translating evidence', () => {
  const results = [];
  for (const [language, text] of [['zh-CN', '数量至少2个，最多1个。'], ['en', 'At least 2 items and at most 1 item.']]) {
    const task = baseline();
    task.source = { language, text };
    const evidence = [{ quote: text, start: 0, end: Array.from(text).length }];
    task.elements.I.entries[0].text = text;
    task.elements.I.entries[0].evidence = evidence;
    task.constraints.intervals = [{ id: 'quantity', subject: 'items', dimension: 'count', unit: 'item',
      lower: { value: '2', inclusive: true }, upper: { value: '1', inclusive: true }, evidence }];
    const result = evaluateTask(task);
    assert.equal(result.evaluation.consistency, 'inconsistent');
    assert.equal(result.findings[0].evidence[0].quote, text);
    results.push(result);
  }
  assert.deepEqual(results[0].calculations, results[1].calculations);
  assert.deepEqual(results[0].evaluation, results[1].evaluation);
  assert.notEqual(results[0].source_digest, results[1].source_digest);
});

test('English and Chinese documents share section numbers and valid envelope examples', () => {
  const headings = [];
  for (const filename of ['BXP-0001.md', 'BXP-0001.zh-CN.md']) {
    const document = readFileSync(new URL(`../${filename}`, import.meta.url), 'utf8');
    assert.match(document, /version: 0\.3\.0-draft\.2/);
    headings.push([...document.matchAll(/^#{2,3} (\d+(?:\.\d+)?)\.? /gm)].map(match => match[1]));
    const example = JSON.parse(document.match(/```json\r?\n([\s\S]*?)```/)[1]);
    assert.equal(evaluateTask(example).evaluation.validation, 'valid');
    assert.equal(evaluateTask(example).evaluation.completeness, 'incomplete');
  }
  assert.deepEqual(headings[0], headings[1]);
});

test('integer endpoint carries remain valid at the decimal input length limit', () => {
  for (const value of ['9'.repeat(256), '-' + '9'.repeat(255)]) {
    const task = baseline();
    task.constraints.intervals = [{ id: 'edge', subject: 'items', dimension: 'count', unit: 'item', domain: 'integer',
      lower: value.startsWith('-') ? null : { value, inclusive: false },
      upper: value.startsWith('-') ? { value, inclusive: false } : null,
      evidence: task.elements.I.entries[0].evidence }];
    const result = evaluateTask(task);
    const bound = result.calculations.intervals[0][value.startsWith('-') ? 'upper' : 'lower'];
    assert.equal(bound.value, value.startsWith('-') ? '-' + '1' + '0'.repeat(255) : '1' + '0'.repeat(256));
    assert.ok(validateResultSchema(result));
  }
});

test('AST depth and aggregate node limits reject without partial calculations', () => {
  const task = baseline();
  task.constraints.logic = [{ id: 'depth', variables: [], formula: true, evidence: task.elements.I.entries[0].evidence }];
  for (let depth = 0; depth < 16; depth += 1) task.constraints.logic[0].formula = { not: task.constraints.logic[0].formula };
  assert.equal(evaluateTask(task).evaluation.validation, 'valid');
  task.constraints.logic[0].formula = { not: task.constraints.logic[0].formula };
  assert.equal(evaluateTask(task).evaluation.validation, 'invalid');
  task.constraints.logic[0].formula = { all: Array.from({ length: 64 }, () => ({ all: Array(64).fill(true) })) };
  const result = evaluateTask(task);
  assert.equal(result.evaluation.validation, 'invalid');
  assert.equal(result.findings[0].code, 'BXP.IR.LOGIC_NODE_LIMIT');
  assert.deepEqual(result.calculations.logic, []);
});

test('canonical digest sorts numeric-looking keys lexically and preserves array order', () => {
  const expected = createHash('sha256').update('{"10":true,"2":false,"a":[2,1]}', 'utf8').digest('hex');
  assert.equal(digest({ 2: false, 10: true, a: [2, 1] }), expected);
  assert.notEqual(digest({ a: [1, 2] }), digest({ a: [2, 1] }));
});

test('semantic error selection is independent of constraint object insertion order', () => {
  const task = baseline();
  task.constraints.logic = [{ id: 'bad', variables: [], formula: { var: 'missing' }, evidence: task.elements.I.entries[0].evidence }];
  task.constraints.intervals = [{ id: 'bad', subject: 'items', dimension: 'count', unit: 'item', lower: { value: 1, inclusive: true },
    upper: null, scope_id: 'missing', evidence: task.elements.I.entries[0].evidence }];
  const first = evaluateTask(task);
  task.constraints = Object.fromEntries(Object.entries(task.constraints).reverse());
  assert.deepEqual(evaluateTask(task), first);
});

test('default suite maintenance verifies without rewriting frozen expectations', () => {
  const suitePath = new URL('./bxp-calc-v1.0.json', import.meta.url);
  const before = readFileSync(suitePath);
  execFileSync(process.execPath, [fileURLToPath(new URL('./build-suite.mjs', import.meta.url))]);
  assert.deepEqual(readFileSync(suitePath), before);
});
