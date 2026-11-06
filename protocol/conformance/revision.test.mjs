import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';
import { baseline } from './hardening-cases.mjs';
import { evaluateTask, digest, PROTOCOL_VERSION } from '../../src/bxp/evaluate.mjs';
import { validateResultSchema, taskSchema, resultSchema, suiteSchema } from '../../src/bxp/validation.mjs';

const suite = JSON.parse(readFileSync(new URL('./bxp-calc-v1.0.json', import.meta.url), 'utf8'));
const resultFor = suffix => evaluateTask(structuredClone(suite.cases.find(item => item.id === `BXP-C${suffix}`).task));
const probes = [
  ['invalid axes', '0001', result => {
    result.evaluation.validation = 'invalid';
    result.applied_profile = null; result.resolved_elements = []; result.deficit = [];
    for (const key of Object.keys(result.calculations)) result.calculations[key] = [];
  }],
  ['invalid calculations', '0001', result => {
    result.evaluation = { validation: 'invalid', completeness: 'undetermined', consistency: 'undetermined' };
    result.applied_profile = null; result.resolved_elements = []; result.deficit = [];
  }],
  ['UNSAT witness', '0012', result => { result.calculations.logic[0].witness = { approval: true }; }],
  ['SAT null witness', '0013', result => { result.calculations.logic[0].witness = null; }],
  ['unknown logic witness', '0013', result => { result.calculations.logic[0].result = 'undetermined'; }],
  ['disjoint overlap', '0005', result => { result.calculations.target_sets[0].result = 'disjoint'; }],
  ['empty overlap', '0005', result => { result.calculations.target_sets[0].overlap = []; }],
  ['unknown overlap', '0005', result => { result.calculations.target_sets[0].result = 'undetermined'; }],
  ['satisfied missing', '0007', result => { result.calculations.handoffs[0].result = 'satisfied'; }],
  ['empty deficit', '0007', result => { result.calculations.handoffs[0].missing = []; }],
  ['unknown missing', '0007', result => { result.calculations.handoffs[0].result = 'undetermined'; }],
  ['unknown available', '0008', result => { result.calculations.handoffs[0].result = 'undetermined'; }],
  ['complete deficit', '0001', result => { result.deficit = [{ element: 'I', status: 'absent' }]; }],
  ['incomplete empty deficit', '0002', result => { result.deficit = []; }],
  ['unresolved absent-only deficit', '0002', result => { result.evaluation.completeness = 'unresolved'; }],
  ['valid null profile', '0001', result => { result.applied_profile = null; }],
  ['wrong digest algorithm', '0001', result => { result.input_digest_algorithm = 'sha-256:custom'; }],
];

for (const [name, suffix, mutate] of probes) {
  test(`result schema rejects ${name}`, () => {
    const result = resultFor(suffix);
    assert.ok(validateResultSchema(result));
    mutate(result);
    assert.equal(validateResultSchema(result), false, name);
  });
}

test('invalid results never imply an applied profile or resolved evidence', () => {
  const result = evaluateTask(null);
  assert.equal(result.applied_profile, null);
  assert.deepEqual(result.resolved_elements, []);
  assert.deepEqual(result.deficit, []);
  for (const field of ['applied_profile', 'resolved_elements', 'deficit']) {
    const changed = structuredClone(result);
    changed[field] = field === 'applied_profile' ? baseline().profile
      : field === 'resolved_elements' ? ['I'] : [{ element: 'I', status: 'absent' }];
    assert.equal(validateResultSchema(changed), false, field);
  }
});

test('profile projection reports actual requirements, optional resolutions and unknown deficits', () => {
  const task = baseline();
  assert.equal(evaluateTask(task).evaluation.completeness, 'complete');
  assert.deepEqual(evaluateTask(task).applied_profile, task.profile);
  task.profile.required_elements = ['B', 'P', 'O'];
  task.elements.P = { status: 'unresolved', entries: [{ id: 'participant', kind: 'actor', text: '界痕x',
    evidence: task.elements.I.entries[0].evidence }], reason_codes: ['BXP.IDENTITY.MULTIPLE_CANDIDATES'] };
  const result = evaluateTask(task);
  assert.equal(result.evaluation.validation, 'valid');
  assert.equal(result.evaluation.completeness, 'unresolved');
  assert.deepEqual(result.applied_profile, { id: task.profile.id, required_elements: ['O', 'P', 'B'] });
  assert.deepEqual(result.resolved_elements, ['I']);
  assert.deepEqual(result.deficit, [
    { element: 'O', status: 'absent' }, { element: 'P', status: 'unresolved' }, { element: 'B', status: 'absent' },
  ]);
  result.applied_profile.required_elements.push('I');
  assert.deepEqual(task.profile.required_elements, ['B', 'P', 'O']);
});

test('interval provenance includes redundant contributors and is stable under reordering', () => {
  const task = baseline();
  const evidence = task.elements.I.entries[0].evidence;
  task.constraints.intervals = ['z', 'a'].map((id, index) => ({ id, subject: 'items', dimension: 'count', unit: 'item',
    lower: { value: String(index + 1), inclusive: true }, upper: null, evidence }));
  const result = evaluateTask(task);
  assert.deepEqual(result.calculations.intervals[0].constraint_ids, ['a', 'z']);
  task.constraints.intervals.reverse();
  assert.deepEqual(evaluateTask(task).calculations, result.calculations);
});

test('dependency IDs are required and unique across scopes and kinds', () => {
  const task = baseline();
  const evidence = task.elements.I.entries[0].evidence;
  task.constraints.dependencies = [{ from: 'a', to: 'b', kind: 'reference', evidence }];
  assert.equal(evaluateTask(task).evaluation.validation, 'invalid');
  task.constraints.dependencies[0].id = 'same';
  task.scopes = [{ id: 'other', description: 'other', identity_status: 'resolved', evidence }];
  task.constraints.dependencies.push({ id: 'same', scope_id: 'other', from: 'b', to: 'c', kind: 'prerequisite', evidence });
  const result = evaluateTask(task);
  assert.equal(result.evaluation.validation, 'invalid');
  assert.equal(result.findings[0].code, 'BXP.IR.DUPLICATE_ID');
});

test('parallel edges and self-loops yield deterministic evidence-linked witnesses', () => {
  const task = baseline();
  const evidence = task.elements.I.entries[0].evidence;
  task.constraints.dependencies = [
    { id: 'z', from: 'a', to: 'b', kind: 'prerequisite', evidence },
    { id: 'a', from: 'a', to: 'b', kind: 'prerequisite', evidence },
    { id: 'back', from: 'b', to: 'a', kind: 'prerequisite', evidence },
    { id: 'self', from: 'c', to: 'c', kind: 'prerequisite', evidence },
    { id: 'ignored', from: 'a', to: 'a', kind: 'reference', evidence },
  ];
  const result = evaluateTask(task);
  assert.deepEqual(result.calculations.dependencies[0], { scope_id: 'task', prerequisite_edges: 4,
    cycles: [{ nodes: ['a', 'b', 'a'], edge_ids: ['a', 'back'] }, { nodes: ['c', 'c'], edge_ids: ['self'] }] });
  task.constraints.dependencies.reverse();
  assert.deepEqual(evaluateTask(task).calculations, result.calculations);
  for (const graph of result.calculations.dependencies) {
    for (const cycle of graph.cycles) {
      assert.equal(cycle.nodes.length, cycle.edge_ids.length + 1);
      cycle.edge_ids.forEach((id, index) => {
        const edge = task.constraints.dependencies.find(item => item.id === id);
        assert.equal(edge.from, cycle.nodes[index]);
        assert.equal(edge.to, cycle.nodes[index + 1]);
        assert.equal(edge.kind, 'prerequisite');
      });
    }
  }
});

test('dependency witnesses never join edges from different scopes', () => {
  const task = baseline();
  const evidence = task.elements.I.entries[0].evidence;
  task.scopes = [{ id: 'other', description: 'other', identity_status: 'resolved', evidence }];
  task.constraints.dependencies = [
    { id: 'ab', from: 'a', to: 'b', kind: 'prerequisite', evidence },
    { id: 'ba', scope_id: 'other', from: 'b', to: 'a', kind: 'prerequisite', evidence },
  ];
  const result = evaluateTask(task);
  assert.equal(result.evaluation.consistency, 'consistent');
  assert.deepEqual(result.calculations.dependencies, [
    { scope_id: 'task', prerequisite_edges: 1, cycles: [] },
    { scope_id: 'other', prerequisite_edges: 1, cycles: [] },
  ]);
});

test('exact schema resource IDs support multiple draft registries without collisions', () => {
  const registry = new Ajv2020({ strict: true });
  const oldTask = { $id: 'urn:boundx:schema:task:v1:0.3.0-draft.1', type: 'object',
    properties: { protocol_version: { const: '0.3.0-draft.1' } }, required: ['protocol_version'] };
  registry.addSchema(oldTask);
  for (const schema of [taskSchema, resultSchema, suiteSchema]) registry.addSchema(schema);
  assert.ok(registry.getSchema(oldTask.$id)({ protocol_version: '0.3.0-draft.1' }));
  assert.ok(registry.getSchema(taskSchema.$id)(baseline()));
  assert.ok(registry.getSchema(resultSchema.$id)(evaluateTask(baseline())));
  assert.ok(registry.getSchema(suiteSchema.$id)(suite));
  const old = baseline(); old.protocol_version = '0.3.0-draft.1';
  assert.equal(evaluateTask(old).evaluation.validation, 'invalid');
  assert.equal(evaluateTask(old).protocol_version, PROTOCOL_VERSION);
});

test('JCS vectors cover binary64 serialization, UTF-16 sorting, escaping and no normalization', () => {
  const expectedHash = text => createHash('sha256').update(text, 'utf8').digest('hex');
  const input = { numbers: [333333333.33333329, 1e30, 4.50, 2e-3, 1e-27] };
  assert.equal(digest(input), expectedHash('{"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27]}'));
  assert.equal(digest({ '\uE000': 1, '\u{1F600}': 2, '\r': 3, '1': 4 }),
    expectedHash('{"\\r":3,"1":4,"😀":2,"":1}'));
  assert.equal(digest({ control: '\u000f\n', slash: '/', quote: '"', zero: -0 }),
    expectedHash('{"control":"\\u000f\\n","quote":"\\\"","slash":"/","zero":0}'));
  assert.notEqual(digest('é'), digest('e\u0301'));
  for (const value of [NaN, Infinity, '\uD800', undefined]) assert.throws(() => digest(value), TypeError);
  assert.equal(evaluateTask(baseline()).input_digest_algorithm, 'sha-256:jcs-rfc8785');
});

test('bilingual normative checklist fixes claims, participant roles, provenance and authority', () => {
  const english = readFileSync(new URL('../BXP-0001.md', import.meta.url), 'utf8');
  const chinese = readFileSync(new URL('../BXP-0001.zh-CN.md', import.meta.url), 'utf8');
  const assertions = [
    ['CLAIM', 'exact protocol version, conformance class, and applicable test-suite version', '具体协议版本、符合性等级和适用测试套件版本'],
    ['P', '| P | Participants |', '| P | 责任主体与角色分工 / Participants |'],
    ['EXTRACT', 'Passing claims MUST NOT be made in this draft.', '本草案不得声明通过'],
    ['RELAY', 'This calculator does not claim RELAY.', '本计算器不声明 RELAY'],
    ['PROFILE', 'Applied profile IDs are caller assertions', 'Profile ID 是调用方声明'],
    ['TRACE', 'node count equals edge count plus one', '节点数等于边数加一'],
    ['JCS', 'No Unicode normalization is permitted.', '不得进行 Unicode 归一化'],
    ['AUTHORITY', 'Recording approval relationships never grants execution authority.', '记录审批关系不等于授予执行权'],
  ];
  for (const [id, en, zh] of assertions) {
    assert.ok(english.includes(en), `${id}: en`);
    assert.ok(chinese.includes(zh), `${id}: zh`);
  }
  for (const document of [english, chinese]) {
    assert.ok(document.includes(taskSchema.$id));
    assert.ok(document.includes(resultSchema.$id));
    assert.ok(document.includes(suiteSchema.$id));
    assert.doesNotMatch(document, /\| P \|.*People/);
  }
});

test('JCS preflight rejects sparse arrays, decorated arrays and non-data properties', () => {
  const decorated = [1]; decorated.extra = true;
  const hidden = Object.defineProperty({}, 'hidden', { value: 1 });
  const accessor = Object.defineProperty({}, 'value', { enumerable: true, get() { throw new Error('must not execute'); } });
  const symbolic = { [Symbol('hidden')]: 1 };
  for (const value of [Array(2), decorated, hidden, accessor, symbolic]) {
    assert.throws(() => digest(value), TypeError);
    const task = baseline(); task.extensions = { 'org.example.data': value };
    assert.equal(evaluateTask(task).evaluation.validation, 'invalid');
  }
});
