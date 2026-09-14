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
