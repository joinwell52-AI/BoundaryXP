import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const evidence = [{ quote: '界痕x', start: 0, end: 3 }];
const bound = (value, inclusive = true) => ({ value, inclusive });
const interval = (id, lower, upper, extra = {}) => ({
  id, subject: 'budget', dimension: 'count', unit: 'item', lower, upper, evidence, ...extra,
});
const logic = (id, formula, extra = {}) => ({ id, variables: ['x'], formula, evidence, ...extra });
const scope = (id, identity_status = 'resolved') => ({ id, description: id, identity_status, evidence });

export function baseline() {
  return structuredClone({
    schema: 'boundx-task/v1', protocol_version: '0.3.0-draft.2', task_id: 'hardening',
    source: { language: 'zh-CN', text: '界痕x' },
    profile: { id: 'org.boundx.hardening', required_elements: ['I'] },
    elements: Object.fromEntries(['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B'].map(key => [key,
      key === 'I' ? { status: 'resolved', entries: [{ id: 'input', kind: 'input', text: '界痕x', evidence }] }
        : { status: 'absent', entries: [] }])),
    constraints: { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [] }, extensions: {},
  });
}

const valid = { validation: 'valid', completeness: 'complete', consistency: 'consistent' };
const invalid = { validation: 'invalid', completeness: 'undetermined', consistency: 'undetermined' };
const conflict = { ...valid, consistency: 'inconsistent' };
const unknown = { ...valid, consistency: 'undetermined' };
const definitions = [];
function add(name, change, evaluation, verify = () => {}) {
  const task = baseline();
  change(task);
  definitions.push({ name, task, evaluation, verify });
}

add('unsafe numeric bound is invalid', task => {
  task.constraints.intervals = [interval('large', bound(9007199254740992), null)];
}, invalid);
add('exact decimal contradiction', task => {
  task.constraints.intervals = [interval('decimal', bound('0.10000000000000001'), bound('0.1'))];
}, conflict, result => assert.equal(result.calculations.intervals[0].lower.value, '0.10000000000000001'));
add('large string integers remain distinct', task => {
  task.constraints.intervals = [interval('large', bound('9007199254740993'), bound('9007199254740992'))];
}, conflict);
add('integer open interval has no integer', task => {
  task.constraints.intervals = [interval('integer', bound('0', false), bound('1', false), { domain: 'integer' })];
}, conflict, result => assert.deepEqual(result.calculations.intervals[0].lower, bound('1')));
add('real open interval is nonempty', task => {
  task.constraints.intervals = [interval('real', bound('0', false), bound('1', false))];
}, valid);
add('Unicode offsets are code points', task => {
  task.source.text = '界🧭痕';
  task.elements.I.entries[0].evidence = [{ quote: '🧭', start: 1, end: 2 }];
}, valid);
add('evidence end cannot exceed source', task => {
  task.elements.I.entries[0].evidence[0].end = 100;
}, invalid);
add('unknown evidence source is invalid', task => {
  task.elements.I.entries[0].evidence[0].source_id = 'missing';
}, invalid);
function policy(task) {
  task.sources = [{ id: 'policy', kind: 'policy', version: '1', language: 'zh-CN', text: '不删除',
    digest: createHash('sha256').update('不删除', 'utf8').digest('hex') }];
  task.elements.I.entries[0].evidence = [{ source_id: 'policy', quote: '不删除', start: 0, end: 3 }];
}
add('versioned secondary source evidence', policy, valid);
add('secondary source digest mismatch', task => { policy(task); task.sources[0].digest = '0'.repeat(64); }, invalid);
add('primary source ID cannot be redefined', task => { policy(task); task.sources[0].id = 'task'; }, invalid);
add('duplicate scope IDs are invalid', task => { task.scopes = [scope('stage'), scope('stage')]; }, invalid);
add('undeclared scope is invalid', task => {
  task.constraints.intervals = [interval('scoped', bound('1'), null, { scope_id: 'missing' })];
}, invalid);
add('unresolved scope calculations are skipped', task => {
  task.scopes = [scope('stage', 'unresolved')];
  task.constraints.intervals = [interval('scoped', bound('2'), bound('1'), { scope_id: 'stage' })];
}, unknown, result => assert.deepEqual(result.calculations.intervals, []));
add('different scopes do not intersect', task => {
  task.scopes = [scope('stage')];
  task.constraints.intervals = [interval('first', bound('2'), null), interval('second', null, bound('1'), { scope_id: 'stage' })];
}, valid, result => assert.equal(result.calculations.intervals.length, 2));
add('same-scope Boolean formulas are conjoined', task => {
  task.constraints.logic = [logic('positive', { var: 'x' }), logic('negative', { not: { var: 'x' } })];
}, conflict, result => assert.deepEqual(result.calculations.logic[0].constraint_ids, ['negative', 'positive']));
add('different-scope Boolean variables are independent', task => {
  task.scopes = [scope('stage')];
  task.constraints.logic = [logic('positive', { var: 'x' }), logic('negative', { not: { var: 'x' } }, { scope_id: 'stage' })];
}, valid, result => assert.equal(result.calculations.logic.length, 2));
add('identity_status is mandatory', task => {
  task.constraints.target_sets = [{ id: 'targets', universe: 'files', effect: 'delete', actor_scope: 'owner',
    guard_context: 'always', requested: ['file'], forbidden: ['file'], evidence }];
}, invalid);
add('unknown source properties are rejected', task => { task.source.extra = true; }, invalid);
add('empty all operator is rejected', task => { task.constraints.logic = [logic('empty', { all: [] })]; }, invalid);
add('unsupported protocol version uses valid error envelope', task => { task.protocol_version = '9.9.9'; }, invalid,
  result => assert.equal(result.protocol_version, '0.3.0-draft.2'));
add('unresolved evidence does not mask a proven conflict', task => {
  task.elements.I.status = 'unresolved'; task.elements.I.reason_codes = ['BXP.IDENTITY.MULTIPLE_CANDIDATES'];
  task.constraints.intervals = [interval('empty', bound('2'), bound('1'))];
}, { ...conflict, completeness: 'unresolved' });
add('aggregated finding retains more than 32 evidence spans', task => {
  task.source.text = 'x'.repeat(33);
  task.elements.I.entries[0].evidence = [{ quote: 'x', start: 0, end: 1 }];
  task.constraints.intervals = Array.from({ length: 33 }, (_, index) => interval(`item-${index}`, bound('2'), bound('1'),
    { evidence: [{ quote: 'x', start: index, end: index + 1 }] }));
}, conflict, result => assert.equal(result.findings.find(item => item.code === 'BXP.INTERVAL.EMPTY').evidence.length, 33));
add('duplicate element IDs are invalid', task => { task.elements.O = structuredClone(task.elements.I); }, invalid);
add('duplicate constraint IDs are invalid', task => {
  task.constraints.intervals = [interval('same', bound('1'), null), interval('same', null, bound('2'))];
}, invalid);
add('same normalized key cannot mix domains', task => {
  task.constraints.intervals = [interval('real', bound('0'), null), interval('integer', null, bound('1'), { domain: 'integer' })];
}, invalid);
add('Boolean variable must be locally declared', task => { task.constraints.logic = [logic('unknown', { var: 'other' })]; }, invalid);
add('Boolean scope variable union is bounded', task => {
  task.constraints.logic = [logic('first', true, { variables: Array.from({ length: 12 }, (_, index) => `v${index}`) }),
    logic('second', true, { variables: ['extra'] })];
}, invalid);
add('missing required element is incomplete not conflicting', task => { task.profile.required_elements.push('O'); },
  { ...valid, completeness: 'incomplete' });
add('optional unresolved element still preserves uncertainty', task => {
  task.elements.O = { status: 'unresolved', entries: [{ id: 'output', kind: 'output', text: '界痕x', evidence }],
    reason_codes: ['BXP.IDENTITY.MULTIPLE_CANDIDATES'] };
}, unknown);
add('SAT witness uses sorted variables and false first', task => {
  task.constraints.logic = [logic('choice', { any: [{ var: 'z' }, { var: 'a' }] }, { variables: ['z', 'a'] })];
}, valid, result => assert.deepEqual(result.calculations.logic[0].witness, { a: false, z: true }));
add('empty primary source is rejected', task => { task.source.text = ''; }, invalid);

export const hardeningCases = definitions;
export function verifyHardening(item, result) {
  assert.deepEqual(result.evaluation, item.evaluation, item.name);
  assert.equal(result.business_decision, null);
  assert.equal(result.execution_authorization, null);
  item.verify(result);
}
