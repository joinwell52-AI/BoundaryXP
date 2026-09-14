import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { IDS, LIMITS, candidateSchema, contractDigests, parseProductJson, validateProduct } from '../product/contracts.mjs';
import { CORE_ELEMENTS, taskSchema, digest } from '../bxp/index.mjs';

const employee = () => ({ schema: 'boundx-employee-directory/v1', employees: [{ employee_id: 'pm-01',
  display_name: 'PM-01', aliases: [], subject_type: 'agent', job_title: '项目经理', status: 'inactive', role_ref: null }] });
const pack = () => ({ $schema: IDS.pack, name: 'example-team', version: '0.1.0',
  resources: [{ name: 'employees', path: 'employees.json', format: 'json', encoding: 'utf-8', bytes: 0,
    hash: 'sha256:' + 'a'.repeat(64), boundx: { kind: 'employee-directory', payload_schema: IDS.employee } }],
  boundx: { scope: 'tenant-a', layer: 'L3', tenant_id: 'tenant-a', dependencies: [],
    semantic_contract: 'boundx-semantic-contract/v1', origin: { source: 'synthetic', version: '0.1.0', digest: 'a'.repeat(64), migration: 'test' } } });
test('product contracts preserve the protocol schema and derive buckets and typed constraints', () => {
  const hash = digest(taskSchema);
  assert.equal(candidateSchema.properties.elements.required.length, CORE_ELEMENTS.length);
  assert.deepEqual(candidateSchema.properties.constraints, taskSchema.properties.constraints);
  assert.equal(digest(taskSchema), hash);
  assert.equal(Object.keys(contractDigests()).length, 3);
});
test('employee schema permits custom jobs and inactive identity without role mapping', () => {
  assert.deepEqual(validateProduct(IDS.employee, employee()), employee());
});
test('shared aliases are legal while duplicate employee IDs are rejected', () => {
  const value = employee();
  value.employees[0].aliases = ['小王'];
  value.employees.push({ ...value.employees[0], employee_id: 'pm-02' });
  assert.doesNotThrow(() => validateProduct(IDS.employee, value));
  value.employees[1].employee_id = 'pm-01';
  assert.throws(() => validateProduct(IDS.employee, value), { code: 'DUPLICATE_ID' });
});
for (const field of ['email', 'phone', 'permissions', 'policyBindings', 'extensions', 'effective_from']) {
  test(`employee refuses out-of-scope ${field}`, () => {
    const value = employee();
    value.employees[0][field] = 'not allowed';
    assert.throws(() => validateProduct(IDS.employee, value), { code: 'PRODUCT_SCHEMA' });
  });
}
for (const raw of ['{"id":1,"id":2}', '{"id":9007199254740993}', '\ufeff{}', Buffer.from([0xff]), '{"name":"\\ud800"}']) {
  test(`strict product JSON rejects ${JSON.stringify(raw)}`, () => assert.throws(() => parseProductJson(raw), { code: 'STRICT_JSON' }));
}
test('product JSON enforces its depth and byte limits', () => {
  assert.throws(() => parseProductJson('['.repeat(34) + '0' + ']'.repeat(34)), { code: 'STRUCTURE_LIMIT' });
  assert.throws(() => parseProductJson(' '.repeat(LIMITS.descriptor + 1), LIMITS.descriptor), { code: 'INPUT_LIMIT' });
});
test('descriptor satisfies both local product constraints and unchanged upstream Draft-07', () => {
  assert.doesNotThrow(() => validateProduct(IDS.pack, pack()));
  const value = pack();
  value.resources[0].data = {};
  assert.throws(() => validateProduct(IDS.pack, value), { code: 'PRODUCT_SCHEMA' });
});
test('descriptor rejects missing resource, tenant ID and short global ID', () => {
  for (const change of [value => { value.resources = []; }, value => { delete value.boundx.tenant_id; }, value => { value.id = 'example-team'; }]) {
    const value = pack(); change(value);
    assert.throws(() => validateProduct(IDS.pack, value), { code: 'PRODUCT_SCHEMA' });
  }
});
test('descriptor rejects duplicate case-insensitive paths', () => {
  const value = pack();
  value.resources.push({ ...value.resources[0], name: 'other', path: 'EMPLOYEES.json' });
  assert.throws(() => validateProduct(IDS.pack, value), { code: 'DUPLICATE_PATH' });
});
test('candidate rejects authority and model-generated offsets', () => {
  const task = JSON.parse(readFileSync(new URL('../../examples/bxp/en-complete.json', import.meta.url), 'utf8'));
  const rewrite = value => {
    if (Array.isArray(value)) return value.map(rewrite);
    if (value && typeof value === 'object' && Object.hasOwn(value, 'quote')) return { source_id: value.source_id ?? 'task', quote: value.quote };
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key]) => !['start', 'end', 'normalized'].includes(key)).map(([key, child]) => [key, rewrite(child)]));
    return value;
  };
  const candidate = { schema: 'boundx-extraction-candidate/v1', prepare_id: 'a'.repeat(64), source_digest: 'b'.repeat(64), context_digest: 'c'.repeat(64),
    elements: rewrite(task.elements), constraints: rewrite(task.constraints), producer: { producer_kind: 'structured-replay', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] };
  assert.doesNotThrow(() => validateProduct(IDS.candidate, candidate));
  candidate.elements.I.entries[0].evidence[0].start = 0;
  assert.throws(() => validateProduct(IDS.candidate, candidate), { code: 'PRODUCT_SCHEMA' });
  delete candidate.elements.I.entries[0].evidence[0].start;
  candidate.execution_authorization = true;
  assert.throws(() => validateProduct(IDS.candidate, candidate), { code: 'PRODUCT_SCHEMA' });
});
