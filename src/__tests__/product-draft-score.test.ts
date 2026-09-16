import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { createProductHost } from '../product/host.mjs';
import { createReviewDraft } from '../product/review-draft.mjs';
import { scoreReviewDraft } from '../product/draft-score.mjs';

const root = mkdtempSync(join(tmpdir(), 'boundx-draft-score-'));
after(() => rmSync(root, { recursive: true, force: true }));
const host = createProductHost({ root });
const seed = { id: 'T001', task_text: '🧪读取 alpha.txt。禁止修改 alpha.txt。', language: 'zh-CN', category: 'fixture-only', setup: 'default', checkpoints: [] };
const snapshot = '2026-09-14T00:00:00Z';
const prepared = host.service.prepare({ source: { text: seed.task_text, language: seed.language },
  profile: { id: 'org.boundx.admin', required_elements: [...CORE_ELEMENTS] }, packs: host.registry.active() });
function entry(id, kind, text) { return { id, kind, text, evidence: [{ source_id: 'task', quote: text }] }; }
function candidate() {
  const elements = Object.fromEntries(CORE_ELEMENTS.map(field => [field, { status: 'absent', entries: [] }]));
  elements.A = { status: 'resolved', entries: [entry('read', 'action', '读取 alpha.txt。')] };
  elements.B = { status: 'resolved', entries: [entry('no-write', 'prohibition', '禁止修改 alpha.txt。')] };
  return { schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id, source_digest: prepared.source_digest,
    context_digest: prepared.context_digest, elements, constraints: { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [] },
    producer: { producer_kind: 'structured-replay', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] };
}
function score(observation, answers = [candidate()]) {
  const draft = createReviewDraft(prepared, seed, snapshot);
  draft.allowed_answers = answers;
  return scoreReviewDraft(host, draft, seed, snapshot, observation);
}

function constrainedCandidate() {
  const result = candidate();
  const evidence = [{ source_id: 'task', quote: '读取 alpha.txt。' }];
  result.constraints = {
    intervals: [{ id: 'interval', subject: 'task', dimension: 'fixture', unit: 'unit', lower: { value: '1', inclusive: true }, upper: null, evidence }],
    target_sets: [{ id: 'target', universe: 'files', effect: 'read', actor_scope: 'task', guard_context: 'fixture', identity_status: 'resolved', requested: ['alpha.txt'], forbidden: [], evidence }],
    handoffs: [{ id: 'handoff', producer_stage: 'first', consumer_stage: 'second', artifact_type: 'file', identity_status: 'resolved', declared_outputs: ['alpha.txt'], required_inputs: ['alpha.txt'], external_inputs: [], evidence }],
    dependencies: [{ id: 'dependency', from: 'first', to: 'second', kind: 'prerequisite', evidence }],
    logic: [{ id: 'logic', variables: ['ready'], formula: { var: 'ready' }, evidence }]
  };
  return result;
}

test('all registered constraint families retain separate counts and parent-bound evidence', () => {
  const expected = constrainedCandidate();
  const report = score(expected, [expected]);
  assert.equal(report.observation_status, 'COMPUTED', JSON.stringify(report.diagnostics));
  const result = report.provisional_alternatives[0];
  assert.equal(result.exact_match, true);
  assert.equal(result.scopes_exact, true);
  assert.deepEqual(Object.keys(result.constraints), Object.keys(expected.constraints));
  for (const row of Object.values(result.constraints)) {
    assert.equal(row.matched, 1);
    assert.equal(row.expected, 1);
    assert.equal(row.evidence.matched, 1);
  }
});

test('changed constraint IDs cannot reuse evidence matches from another parent', () => {
  const expected = constrainedCandidate();
  const observation = structuredClone(expected);
  for (const items of Object.values(observation.constraints)) items[0].id += '-changed';
  const result = score(observation, [expected]).provisional_alternatives[0];
  assert.equal(result.totals.matched, 2);
  assert.equal(result.relations_exact, false);
  for (const row of Object.values(result.constraints)) {
    assert.equal(row.matched, 0);
    assert.equal(row.false_negative, 1);
    assert.equal(row.false_positive, 1);
    assert.equal(row.evidence.matched, 0);
  }
});

test('changed dependency direction keeps citation diagnostics but fails relation matching', () => {
  const expected = constrainedCandidate();
  const observation = structuredClone(expected);
  Object.assign(observation.constraints.dependencies[0], { from: 'second', to: 'first' });
  const result = score(observation, [expected]).provisional_alternatives[0];
  assert.equal(result.constraints.dependencies.evidence.matched, 1);
  assert.equal(result.constraints.dependencies.matched, 0);
  assert.equal(result.exact_match, false);
});

test('missing and malformed constraint predictions preserve all expected denominators', () => {
  const expected = constrainedCandidate();
  for (const input of [null, '{']) {
    const result = score(input, [expected]).provisional_alternatives[0];
    for (const row of Object.values(result.constraints)) {
      assert.equal(row.false_negative, 1);
      assert.equal(row.evidence.false_negative, 1);
      assert.equal(row.predicted, input === null ? 0 : null);
      assert.equal(row.evidence.predicted, input === null ? 0 : null);
    }
  }
});

test('constraint multiset diagnostics do not relax the exact relation ordering contract', () => {
  const expected = constrainedCandidate();
  expected.constraints.intervals.push({ ...structuredClone(expected.constraints.intervals[0]), id: 'second-interval' });
  const observation = structuredClone(expected);
  observation.constraints.intervals.reverse();
  const result = score(observation, [expected]).provisional_alternatives[0];
  assert.equal(result.constraints.intervals.matched, 2);
  assert.equal(result.constraints.intervals.evidence.matched, 2);
  assert.equal(result.relations_exact, false);
  assert.equal(result.exact_match, false);
});

test('extra constraints remain false positives even when they cite the same text', () => {
  const expected = constrainedCandidate();
  const observation = structuredClone(expected);
  observation.constraints.intervals.push({ ...structuredClone(observation.constraints.intervals[0]), id: 'extra-interval' });
  const result = score(observation, [expected]).provisional_alternatives[0];
  assert.equal(result.constraints.intervals.matched, 1);
  assert.equal(result.constraints.intervals.false_positive, 1);
  assert.equal(result.constraints.intervals.evidence.false_positive, 1);
  assert.equal(result.exact_match, false);
});

test('forged constraint evidence is rejected without losing readable prediction counts', () => {
  const expected = constrainedCandidate();
  const observation = structuredClone(expected);
  observation.constraints.intervals[0].evidence = [{ source_id: 'task', quote: 'invented evidence' }];
  const report = score(observation, [expected]);
  assert.equal(report.observation_status, 'REJECTED');
  for (const row of Object.values(report.provisional_alternatives[0].constraints)) {
    assert.equal(row.matched, 0);
    assert.equal(row.predicted, 1);
    assert.equal(row.false_negative, 1);
    assert.equal(row.evidence.predicted, 1);
    assert.equal(row.evidence.false_positive, 1);
  }
});

test('exact draft entry matching ignores local entry IDs but never grants reviewed status', () => {
  const observation = candidate();
  observation.elements.A.entries[0].id = 'renamed';
  const result = score(observation);
  assert.equal(result.provisional_alternatives[0].exact_match, true);
  assert.deepEqual(result.provisional_alternatives[0].totals, { matched: 2, expected: 2, predicted: 2, false_negative: 0, false_positive: 0 });
  assert.equal(result.independent_review_verified, false);
  assert.equal(result.acceptance_passed, false);
  assert.equal(result.precision, null);
  assert.equal(result.recall, null);
});

test('missing output stays in the expected denominator and cannot match absent buckets', () => {
  const result = score(null).provisional_alternatives[0];
  assert.equal(result.totals.expected, 2);
  assert.equal(result.totals.false_negative, 2);
  assert.equal(result.totals.matched, 0);
  assert.equal(result.fields.I.state_correct, false);
  assert.equal(result.explicit_B_recalled, false);
  assert.equal(result.fields.B.recall, 0);
});

test('all-unknown output and duplicate predictions cannot inflate matches', () => {
  const observation = candidate();
  for (const field of ['A', 'B']) {
    observation.elements[field].status = 'unresolved';
    observation.elements[field].reason_codes = ['UNSPECIFIED'];
  }
  assert.equal(score(observation).provisional_alternatives[0].totals.false_negative, 2);
  const duplicate = candidate();
  duplicate.elements.A.entries.push({ ...structuredClone(duplicate.elements.A.entries[0]), id: 'duplicate' });
  const result = score(duplicate).provisional_alternatives[0];
  assert.equal(result.fields.A.matched, 1);
  assert.equal(result.fields.A.false_positive, 1);
  assert.equal(result.exact_match, false);
});

test('malformed JSON, wrong snapshot and fabricated evidence remain rejected with false negatives', () => {
  const forged = candidate();
  forged.elements.A.entries[0].evidence[0].quote = 'invented';
  const stale = candidate(); stale.context_digest = '0'.repeat(64);
  for (const input of ['{"schema":1,"schema":2}', Buffer.from([0xff]), forged, stale]) {
    const result = score(input);
    assert.equal(result.observation_status, 'REJECTED');
    assert.equal(result.provisional_alternatives[0].totals.false_negative, 2);
    assert.equal(result.provisional_alternatives[0].totals.matched, 0);
    assert.ok(result.diagnostics.length > 0);
  }
});

test('alternatives are never merged into a hybrid answer or chosen by a favorable denominator', () => {
  const first = candidate();
  first.elements.B = { status: 'absent', entries: [] };
  const second = candidate();
  second.elements.A = { status: 'absent', entries: [] };
  const result = score(candidate(), [first, second]);
  assert.equal(result.provisional_alternatives.length, 2);
  for (const alternative of result.provisional_alternatives) {
    assert.equal(alternative.exact_match, false);
    assert.equal(alternative.totals.false_positive, 1);
  }
});

test('blank or invalid reference answers are not converted into successful empty gold', () => {
  assert.equal(score(candidate(), null).observation_status, 'NOT_SCORED');
  const invalid = candidate(); invalid.elements.A.entries[0].evidence[0].quote = 'invented';
  const result = score(candidate(), [invalid]);
  assert.equal(result.observation_status, 'NOT_SCORED');
  assert.deepEqual(result.provisional_alternatives, []);
});

test('relation changes are reported separately from matching entry counts', () => {
  const observation = candidate();
  observation.constraints.intervals = [{ id: 'extra-bound', subject: 'task', dimension: 'fixture', unit: 'unit',
    lower: { value: '1', inclusive: true }, upper: null, evidence: [{ source_id: 'task', quote: '读取 alpha.txt。' }] }];
  const result = score(observation).provisional_alternatives[0];
  assert.equal(result.totals.matched, 2);
  assert.equal(result.relations_exact, false);
  assert.equal(result.exact_match, false);
});

test('exact evidence is diagnostic only and does not excuse a changed interpretation', () => {
  const observation = candidate();
  observation.elements.A.entries[0].text = 'Delete alpha.txt';
  const result = score(observation).provisional_alternatives[0];
  assert.equal(result.fields.A.evidence.matched, 1);
  assert.equal(result.fields.A.matched, 0);
  assert.equal(result.exact_match, false);
});

test('evidence multiplicity and bucket assignment cannot inflate evidence matches', () => {
  const observation = candidate();
  observation.elements.A.entries.push({ ...structuredClone(observation.elements.A.entries[0]), id: 'duplicate' });
  const duplicate = score(observation).provisional_alternatives[0].fields.A.evidence;
  assert.equal(duplicate.matched, 1);
  assert.equal(duplicate.false_positive, 1);
  const misplaced = candidate();
  misplaced.elements.A.entries[0].evidence = structuredClone(misplaced.elements.B.entries[0].evidence);
  const result = score(misplaced).provisional_alternatives[0];
  assert.equal(result.fields.A.evidence.matched, 0);
  assert.equal(result.fields.B.evidence.matched, 1);
});

test('missing and rejected evidence retain the expected denominator', () => {
  const missing = score(null).provisional_alternatives[0].fields.A.evidence;
  assert.equal(missing.expected, 1);
  assert.equal(missing.false_negative, 1);
  assert.equal(missing.predicted, 0);
  const invalid = score(Buffer.from([0xff])).provisional_alternatives[0].fields.A.evidence;
  assert.equal(invalid.false_negative, 1);
  assert.equal(invalid.predicted, null);
  assert.equal(invalid.false_positive, null);
});

test('evidence uses codepoint offsets after a non-BMP prefix, not UTF-16 positions', () => {
  const located = candidate();
  const quote = located.elements.A.entries[0].evidence[0].quote;
  located.elements.A.entries[0].evidence[0] = { source_id: 'task', quote, prefix: '🧪' };
  const evaluated = host.invoke('bx_evaluate_admin_candidate', { candidate: located, historical: true });
  assert.equal(evaluated.computed, true);
  assert.equal(evaluated.task.elements.A.entries[0].evidence[0].start, 1);
  assert.equal(score(located).provisional_alternatives[0].fields.A.evidence.matched, 1);
  const wrong = structuredClone(located);
  wrong.elements.A.entries[0].evidence[0].start = 2;
  wrong.elements.A.entries[0].evidence[0].end = 2 + [...quote].length;
  const rejected = score(wrong);
  assert.equal(rejected.observation_status, 'REJECTED');
  assert.equal(rejected.provisional_alternatives[0].fields.A.evidence.matched, 0);
});

for (const [language, quote] of [['zh-CN', '读取文件'], ['en', 'Read file']]) {
  test(`repeated ${language} quotes at different source positions are not interchangeable`, () => {
    const localSeed = { ...seed, language, task_text: `🧪${quote}\r\ne\u0301${quote}` };
    const localPrepared = host.service.prepare({ source: { text: localSeed.task_text, language },
      profile: { id: 'org.boundx.admin', required_elements: [...CORE_ELEMENTS] }, packs: host.registry.active() });
    const expected = candidate();
    Object.assign(expected, { prepare_id: localPrepared.prepare_id, source_digest: localPrepared.source_digest,
      context_digest: localPrepared.context_digest });
    expected.elements.B = { status: 'absent', entries: [] };
    expected.elements.A.entries = [{ id: 'read', kind: 'action', text: quote,
      evidence: [{ source_id: 'task', quote, prefix: '🧪' }] }];
    const draft = createReviewDraft(localPrepared, localSeed, snapshot);
    draft.allowed_answers = [expected];
    const observed = structuredClone(expected);
    observed.elements.A.entries[0].evidence[0].prefix = 'e\u0301';
    const result = scoreReviewDraft(host, draft, localSeed, snapshot, observed);
    assert.equal(result.observation_status, 'COMPUTED');
    const evidence = result.provisional_alternatives[0].fields.A.evidence;
    assert.equal(evidence.matched, 0);
    assert.equal(evidence.false_positive, 1);
    assert.equal(evidence.false_negative, 1);
    assert.equal(result.provisional_alternatives[0].exact_match, false);
  });
}
