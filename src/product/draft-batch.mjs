import { digest } from '../bxp/index.mjs';
import { assert } from './contracts.mjs';
import { DRAFT_MATCHER } from './draft-score.mjs';

export function summarizeDraftBatch(plan, records) {
  assert(plan.schema === 'boundx-acceptance-plan/v1' && Array.isArray(plan.runs) && plan.runs.length === 150
    && new Set(plan.runs.map(run => run.run_id)).size === 150 && records.length === 150,
  'DRAFT_BATCH_COVERAGE', 'Every planned initial run must have one record, including missing or unavailable results.');
  const statuses = ['COMPUTED', 'MISSING', 'REJECTED', 'NOT_SCORED', 'INPUT_ERROR', 'REVIEW_UNAVAILABLE'];
  const inputStatuses = ['PRESENT', 'MISSING', 'UNREADABLE', 'NOT_INSPECTED'];
  for (const [index, record] of records.entries()) {
    const run = plan.runs[index];
    assert(record.run_id === run.run_id && record.case_id === run.case_id && record.language === run.seed.language
      && record.category === run.seed.category && statuses.includes(record.observation_status)
      && inputStatuses.includes(record.input_status)
      && record.independent_review_verified === false && record.acceptance_passed === false,
    'DRAFT_BATCH_IDENTITY', 'Report identity, order or review state differs from the fixed plan.');
    assert(record.matcher_digest === digest(DRAFT_MATCHER), 'DRAFT_MATCHER', 'Mixed matcher versions cannot be aggregated.');
    assert(Array.isArray(record.provisional_alternatives) && record.provisional_alternatives.length <= 16
      && record.provisional_alternatives.every(answer => typeof answer.exact_match === 'boolean'),
    'DRAFT_BATCH_RESULT', 'Invalid whole-alternative result.');
  }
  const count = rows => ({ planned_runs: rows.length,
    input_counts: Object.fromEntries(inputStatuses.map(status => [status, rows.filter(row => row.input_status === status).length])),
    observation_counts: Object.fromEntries(statuses.map(status => [status, rows.filter(row => row.observation_status === status).length])),
    comparable_runs: rows.filter(row => row.provisional_alternatives.length > 0).length,
    whole_alternative_matches: rows.filter(row => row.observation_status === 'COMPUTED' && row.provisional_alternatives.some(answer => answer.exact_match)).length,
    multiple_alternative_runs: rows.filter(row => row.provisional_alternatives.length > 1).length,
    unknown_expected_denominator_runs: rows.filter(row => row.provisional_alternatives.length === 0).length,
    precision: null, recall: null });
  const group = key => Object.fromEntries([...new Set(records.map(record => record[key]))].map(value => [value, count(records.filter(record => record[key] === value))]));
  return { schema: 'boundx-draft-batch/v1', plan_digest: digest(plan), matcher: DRAFT_MATCHER, matcher_digest: digest(DRAFT_MATCHER),
    distinct_sources: new Set(records.map(record => record.case_id)).size, ...count(records), by_language: group('language'), by_category: group('category'),
    status: 'PENDING_GOLD_REVIEW', independent_review_verified: false, acceptance_passed: false, model_calls: 0,
    limitations: ['Categories are taskbook test categories, not industry coverage.', 'Whole-alternative matches are draft comparisons, not reviewed accuracy.',
      'Unavailable annotations have unknown denominators and are never omitted.', 'Per-alternative entry counts remain in individual reports; alternatives are not pooled.'] };
}
