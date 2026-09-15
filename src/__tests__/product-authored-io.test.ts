import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadAcceptancePlan } from '../../scripts/run-admin-acceptance.mjs';
import { createCaseScenario } from '../../fixtures/admin-text/scenarios.mjs';
import { authorInitialReviewDraft, INITIAL_DRAFT_CASE_IDS } from '../../fixtures/admin-text/authored-initial-drafts.mjs';
import { createReviewDraft, checkReviewDraft } from '../product/review-draft.mjs';

const plan = loadAcceptancePlan();
test('authored candidate coverage matches all 120 fixed source IDs without duplicates', () => {
  assert.deepEqual(INITIAL_DRAFT_CASE_IDS, plan.runs.slice(0, 120).map(run => run.case_id));
  assert.equal(new Set(INITIAL_DRAFT_CASE_IDS).size, 120);
});
for (const caseId of INITIAL_DRAFT_CASE_IDS) test(`${caseId} authored draft is source-bound and structurally checkable, not reviewed gold`, () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-authored-io-'));
  try {
    const seed = plan.runs.find(run => run.case_id === caseId).seed;
    const scenario = createCaseScenario(root, seed);
    const prepared = scenario.host.service.prepare(scenario.input);
    const blank = createReviewDraft(prepared, seed, scenario.snapshot_time);
    const author = input => authorInitialReviewDraft(input, prepared);
    const authored = author(blank);
    assert.equal(blank.allowed_answers, null);
    assert.deepEqual(authored.binding, blank.binding);
    const result = checkReviewDraft(scenario.host, authored, seed, scenario.snapshot_time);
    assert.equal(result.all_candidates_structurally_valid, true, JSON.stringify(result.candidate_checks));
    assert.equal(result.independent_review_verified, false);
    assert.equal(authored.review_status, 'PENDING');
    const evaluated = scenario.host.invoke('bx_evaluate_admin_candidate', { candidate: authored.allowed_answers[0], historical: true });
    assert.equal(evaluated.result.business_decision, null);
    assert.equal(evaluated.result.execution_authorization, null);
    if (['T051', 'T054', 'T056', 'T059'].includes(caseId)) assert.equal(evaluated.result.calculations.intervals[0].empty, true);
    if (caseId === 'T057') assert.equal(authored.allowed_answers[0].constraints.intervals[0].upper.value, '0.000000000000000001');
    if (caseId === 'T060') assert.equal(authored.allowed_answers[0].constraints.intervals[0].lower.value, '9007199254740993');
    if (['T064', 'T067'].includes(caseId)) assert.ok(evaluated.result.findings.some(item => item.code === 'BXP.DEPENDENCY.PREREQUISITE_CYCLE'));
    if (caseId === 'T078') assert.ok(evaluated.task.elements.V.entries[0].evidence.some(item => item.source_id === 'POL-1'));
    if (['T093', 'T097'].includes(caseId)) assert.notEqual(evaluated.task.elements.A.entries[0].evidence[0].start, evaluated.task.elements.A.entries[1].evidence[0].start);
    if (['T095', 'T117', 'T120'].includes(caseId)) assert.equal(evaluated.task.elements.B.status, 'absent');
    if (['T032', 'T037'].includes(caseId)) assert.deepEqual(authored.allowed_answers[0].elements.P.entries[0].candidate_ids, ['e101', 'e102']);
    if (['T102', 'T108'].includes(caseId)) assert.equal(authored.allowed_answers[0].elements.P.entries[0].semantic_refs[0].entry_id, 'b101');
    if (['T101', 'T103', 'T105'].includes(caseId)) assert.ok(authored.allowed_answers[0].elements.P.entries.every(entry => !entry.semantic_refs));
    if (caseId === 'T031') {
      assert.throws(() => authorInitialReviewDraft(blank), { code: 'AUTHOR_CONTEXT' });
      assert.throws(() => authorInitialReviewDraft(blank, { ...prepared, entries: [] }), { code: 'AUTHOR_IDENTITY' });
    }
    if (caseId === 'T062') {
      assert.equal(evaluated.result.calculations.handoffs.length, 0);
      assert.ok(evaluated.result.findings.some(item => item.code === 'BXP.SCOPE.UNRESOLVED'));
    }
    if (['T063', 'T112'].includes(caseId)) {
      assert.equal(evaluated.result.calculations.handoffs[0].result, 'satisfied');
      assert.equal(evaluated.task.constraints.dependencies.length, 0);
    }
    if (caseId === 'T065') {
      assert.equal(evaluated.result.calculations.target_sets.length, 2);
      assert.ok(evaluated.result.calculations.target_sets.every(item => item.result === 'disjoint'));
      assert.ok(!evaluated.result.findings.some(item => item.code === 'BXP.TARGET.FORBIDDEN_OVERLAP'));
    }
    if (['T018', 'T043', 'T050', 'T061', 'T066', 'T068', 'T069', 'T086', 'T089', 'T112', 'T119'].includes(caseId)) {
      assert.equal(evaluated.result.calculations.logic[0].result, 'satisfiable');
      assert.ok(authored.allowed_answers[0].constraints.logic.every(item => item.assumptions === undefined));
    }
    if (caseId === 'T043') {
      for (const [approved, publish, expected] of [[true, false, 'satisfiable'], [false, true, 'unsatisfiable']]) {
        const counterfactual = structuredClone(authored.allowed_answers[0]);
        counterfactual.constraints.logic[0].assumptions = { all: [approved ? { var: 'approved' } : { not: { var: 'approved' } }, publish ? { var: 'publish' } : { not: { var: 'publish' } }] };
        const tested = scenario.host.invoke('bx_evaluate_admin_candidate', { candidate: counterfactual, historical: true });
        assert.equal(tested.result.calculations.logic[0].result, expected);
        assert.equal(tested.result.execution_authorization, null);
      }
    }
    if (Number(caseId.slice(1)) <= 50) for (const field of ['R', 'V', 'C']) assert.equal(authored.allowed_answers[0].elements[field].status, 'absent');
    if (['T013', 'T017'].includes(caseId)) assert.equal(authored.allowed_answers[0].elements.B.status, 'absent');
    if (['T014', 'T016'].includes(caseId)) assert.equal(authored.allowed_answers[0].elements.B.entries.length, 2);
    assert.throws(() => author(authored), { code: 'AUTHOR_EXISTING' });
    assert.throws(() => author({ ...blank, author_notes: 'existing reviewer notes' }), { code: 'AUTHOR_EXISTING' });
    assert.throws(() => author({ ...blank, binding: { ...blank.binding, source: { ...blank.binding.source, text: seed.task_text + ' ' } } }), { code: 'AUTHOR_SOURCE' });
  } finally { rmSync(root, { recursive: true, force: true }); }
});
