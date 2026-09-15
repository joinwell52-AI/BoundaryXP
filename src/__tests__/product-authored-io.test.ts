import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadAcceptancePlan } from '../../scripts/run-admin-acceptance.mjs';
import { createCaseScenario } from '../../fixtures/admin-text/scenarios.mjs';
import { authorIoReviewDraft, IO_DRAFT_CASE_IDS } from '../../fixtures/admin-text/authored-io-drafts.mjs';
import { createReviewDraft, checkReviewDraft } from '../product/review-draft.mjs';

const plan = loadAcceptancePlan();
for (const caseId of IO_DRAFT_CASE_IDS) test(`${caseId} authored draft is source-bound and structurally checkable, not reviewed gold`, () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-authored-io-'));
  try {
    const seed = plan.runs.find(run => run.case_id === caseId).seed;
    const scenario = createCaseScenario(root, seed);
    const blank = createReviewDraft(scenario.host.service.prepare(scenario.input), seed, scenario.snapshot_time);
    const authored = authorIoReviewDraft(blank);
    assert.equal(blank.allowed_answers, null);
    assert.deepEqual(authored.binding, blank.binding);
    const result = checkReviewDraft(scenario.host, authored, seed, scenario.snapshot_time);
    assert.equal(result.all_candidates_structurally_valid, true, JSON.stringify(result.candidate_checks));
    assert.equal(result.independent_review_verified, false);
    assert.equal(authored.review_status, 'PENDING');
    for (const field of ['R', 'V', 'C']) assert.equal(authored.allowed_answers[0].elements[field].status, 'absent');
    assert.throws(() => authorIoReviewDraft(authored), { code: 'AUTHOR_EXISTING' });
    assert.throws(() => authorIoReviewDraft({ ...blank, author_notes: 'existing reviewer notes' }), { code: 'AUTHOR_EXISTING' });
    assert.throws(() => authorIoReviewDraft({ ...blank, binding: { ...blank.binding, source: { ...blank.binding.source, text: seed.task_text + ' ' } } }), { code: 'AUTHOR_SOURCE' });
  } finally { rmSync(root, { recursive: true, force: true }); }
});
