import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { createReviewDraft, checkReviewDraft } from '../product/review-draft.mjs';
import { loadAcceptancePlan, atomicRecord } from '../../scripts/run-admin-acceptance.mjs';
import { createCaseScenario } from '../../fixtures/admin-text/scenarios.mjs';
import { prepareReviewWorkspace, checkReviewWorkspaceCase } from '../../scripts/prepare-admin-review.mjs';
import { scoreDraftFile } from '../../scripts/score-admin-draft.mjs';

const plan = loadAcceptancePlan();
function answerFor(draft) {
  const elements = Object.fromEntries(CORE_ELEMENTS.map(element => [element, { status: 'absent', entries: [] }]));
  elements.I = { status: 'resolved', entries: [{ id: 'fixture-only', kind: 'input', text: draft.binding.source.text,
    evidence: [{ source_id: 'task', quote: draft.binding.source.text }] }] };
  return { schema: 'boundx-extraction-candidate/v1', prepare_id: draft.binding.prepare_id, source_digest: draft.binding.source_digest,
    context_digest: draft.binding.context_digest, elements, constraints: { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [] },
    producer: { producer_kind: 'structured-replay', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] };
}

for (const setup of ['default', 'tenant-b', 'with-policy', 'changed-after-prepare']) test(`review draft preserves original ${setup} context without generating gold`, () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-review-'));
  try {
    const seed = plan.runs.find(run => run.seed.setup === setup).seed;
    const scenario = createCaseScenario(root, seed);
    const prepared = scenario.host.service.prepare(scenario.input);
    const draft = createReviewDraft(prepared, seed, scenario.snapshot_time);
    assert.equal(draft.allowed_answers, null);
    assert.equal(draft.binding.source.text, seed.task_text);
    assert.deepEqual(draft.binding.pack_lock, prepared.packs);
    assert.deepEqual(draft.binding.checkpoints, seed.checkpoints);
    scenario.afterPrepare();
    const empty = checkReviewDraft(scenario.host, draft, seed, scenario.snapshot_time);
    assert.equal(empty.candidate_count, 0);
    assert.equal(empty.all_candidates_structurally_valid, false);
    draft.allowed_answers = [answerFor(draft)];
    const checked = checkReviewDraft(scenario.host, draft, seed, scenario.snapshot_time);
    assert.equal(checked.all_candidates_structurally_valid, true);
    assert.equal(checked.independent_review_verified, false);
    assert.equal(checked.precision, null);
    assert.equal(checked.status, 'PENDING_GOLD_REVIEW');
    assert.equal(draft.review_status, 'PENDING');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('draft checker refuses source drift, self-certification, duplicate alternatives and forged evidence', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-review-reject-'));
  try {
    const seed = plan.runs[0].seed;
    const scenario = createCaseScenario(root, seed);
    const draft = createReviewDraft(scenario.host.service.prepare(scenario.input), seed, scenario.snapshot_time);
    const check = value => checkReviewDraft(scenario.host, value, seed, scenario.snapshot_time);
    assert.throws(() => check({ ...draft, review_status: 'APPROVED' }), { code: 'REVIEW_CONTRACT' });
    assert.throws(() => check({ ...draft, independent_review_verified: true }), { code: 'REVIEW_CONTRACT' });
    assert.throws(() => check({ ...draft, binding: { ...draft.binding, setup: 'tenant-b' } }), { code: 'REVIEW_BINDING' });
    assert.throws(() => check({ ...draft, allowed_answers: [] }), { code: 'REVIEW_ANSWERS' });
    const answer = answerFor(draft);
    assert.throws(() => check({ ...draft, allowed_answers: [answer, answer] }), { code: 'REVIEW_DUPLICATE' });
    answer.elements.I.entries[0].evidence[0].quote = 'not in original';
    const invalid = check({ ...draft, allowed_answers: [answer] });
    assert.equal(invalid.all_candidates_structurally_valid, false);
    assert.equal(invalid.candidate_checks[0].diagnostics[0].code, 'QUOTE_NOT_FOUND');
    answer.prepare_id = '0'.repeat(64);
    assert.equal(check({ ...draft, allowed_answers: [answer] }).candidate_checks[0].diagnostics[0].code, 'REVIEW_BINDING');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('offline review workspace builds all 120 original cases, checks edits and rejects tampered context', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-review-all-'));
  try {
    const result = prepareReviewWorkspace({ base: root });
    assert.equal(result.status, 'DRAFTS_CREATED');
    assert.equal(result.cases.length, 120);
    assert.equal(result.model_calls, 0);
    assert.equal(new Set(result.cases.map(item => item.case_id)).size, 120);
    for (const item of result.cases) {
      const draft = JSON.parse(readFileSync(join(result.output, item.case_id, 'draft.json'), 'utf8'));
      assert.equal(draft.binding.source.text, plan.runs.find(run => run.case_id === item.case_id).seed.task_text);
      assert.equal(draft.allowed_answers, null);
    }
    assert.equal(checkReviewWorkspaceCase(result.output, 'T001').all_candidates_structurally_valid, false);
    const path = join(result.output, 'T001', 'draft.json');
    const draft = JSON.parse(readFileSync(path, 'utf8'));
    draft.allowed_answers = [answerFor(draft)];
    atomicRecord(path, draft);
    assert.equal(checkReviewWorkspaceCase(result.output, 'T001').all_candidates_structurally_valid, true);
    const candidatePath = join(result.output, 'T001', 'candidate.json');
    atomicRecord(candidatePath, draft.allowed_answers[0]);
    assert.equal(scoreDraftFile(result.output, 'T001', candidatePath).provisional_alternatives[0].exact_match, true);
    assert.equal(scoreDraftFile(result.output, 'T001', '--missing').provisional_alternatives[0].totals.false_negative, 1);
    assert.throws(() => checkReviewWorkspaceCase(result.output, '../escape'));
    const preparedPath = join(result.output, 'T001', 'prepared.json');
    const prepared = JSON.parse(readFileSync(preparedPath, 'utf8'));
    prepared.source.text += 'changed';
    atomicRecord(preparedPath, prepared);
    assert.throws(() => checkReviewWorkspaceCase(result.output, 'T001'), /context was modified/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('pre-cancelled workspace is incomplete, never a set of reviewed cases', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-review-cancel-'));
  try {
    const signal = AbortSignal.abort();
    const result = prepareReviewWorkspace({ base: root, signal });
    assert.equal(result.status, 'CANCELLED');
    assert.deepEqual(result.cases, []);
    assert.equal(result.independent_review_verified, false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
