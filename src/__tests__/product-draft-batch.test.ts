import test from 'node:test';
import assert from 'node:assert/strict';
import { digest } from '../bxp/index.mjs';
import { DRAFT_MATCHER } from '../product/draft-score.mjs';
import { summarizeDraftBatch } from '../product/draft-batch.mjs';
import { loadAcceptancePlan } from '../../scripts/run-admin-acceptance.mjs';

const plan = loadAcceptancePlan();
function rows() {
  return plan.runs.map(run => ({ run_id: run.run_id, case_id: run.case_id, language: run.seed.language, category: run.seed.category,
    observation_status: 'MISSING', input_status: 'MISSING', independent_review_verified: false, acceptance_passed: false,
    matcher_digest: digest(DRAFT_MATCHER), provisional_alternatives: [{ exact_match: false }] }));
}

test('fixed batch retains 150 runs and all language/category denominators', () => {
  const records = rows();
  const result = summarizeDraftBatch(plan, records);
  assert.equal(result.planned_runs, 150);
  assert.equal(result.distinct_sources, 120);
  assert.equal(result.observation_counts.MISSING, 150);
  assert.equal(result.input_counts.MISSING, 150);
  assert.equal(Object.values(result.by_language).reduce((sum, group) => sum + group.planned_runs, 0), 150);
  assert.equal(Object.keys(result.by_category).length, 12);
  assert.equal(Object.values(result.by_category).reduce((sum, group) => sum + group.planned_runs, 0), 150);
  assert.equal(result.precision, null);
  assert.equal(result.acceptance_passed, false);
});

test('unknown review denominators and input errors remain separate, never dropped', () => {
  const records = rows();
  records[0].observation_status = 'REVIEW_UNAVAILABLE'; records[0].provisional_alternatives = [];
  records[1].observation_status = 'INPUT_ERROR'; records[1].provisional_alternatives = [];
  records[2].observation_status = 'COMPUTED'; records[2].provisional_alternatives = [{ exact_match: false }, { exact_match: true }];
  records[1].input_status = 'UNREADABLE'; records[2].input_status = 'PRESENT';
  const result = summarizeDraftBatch(plan, records);
  assert.equal(result.unknown_expected_denominator_runs, 2);
  assert.equal(result.comparable_runs, 148);
  assert.equal(result.multiple_alternative_runs, 1);
  assert.equal(result.whole_alternative_matches, 1);
  assert.equal(result.observation_counts.REVIEW_UNAVAILABLE, 1);
  assert.equal(result.observation_counts.INPUT_ERROR, 1);
  assert.equal(result.input_counts.MISSING, 148);
});

test('batch rejects omitted, duplicated, foreign or falsely approved records and mixed matchers', () => {
  assert.throws(() => summarizeDraftBatch(plan, rows().slice(1)), { code: 'DRAFT_BATCH_COVERAGE' });
  for (const change of [
    records => { records[0] = records[1]; },
    records => { records[0].language = 'foreign'; },
    records => { records[0].independent_review_verified = true; },
    records => { records[0].matcher_digest = '0'.repeat(64); },
    records => { records[0].provisional_alternatives = [{ exact_match: 'true' }]; },
  ]) {
    const records = rows(); change(records);
    assert.throws(() => summarizeDraftBatch(plan, records));
  }
});
