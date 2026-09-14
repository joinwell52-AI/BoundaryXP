import { CORE_ELEMENTS, digest } from '../bxp/index.mjs';
import { IDS, assert, parseProductJson, validateProduct } from './contracts.mjs';
import { checkReviewDraft } from './review-draft.mjs';

export const DRAFT_MATCHER = Object.freeze({ id: 'boundx-draft-exact-entry', version: '0.1.0', status: 'NOT_FROZEN_FOR_ACCEPTANCE',
  entry_identity: 'bucket-status + entry-without-id + interpretation-and-references',
  alternative_policy: 'report-every-complete-alternative-separately-never-combine',
  relation_policy: 'exact-constraints-and-scopes-including-identifiers' });

function entryKeys(task, field) {
  const provenance = task.extensions['org.boundx.producer'].provenance;
  return task.elements[field].entries.map(entry => {
    const { id, ...content } = entry;
    const origin = provenance.find(item => item.element === field && item.entry_id === id);
    const { entry_id, element, ...interpretation } = origin;
    return digest({ status: task.elements[field].status, content, interpretation });
  });
}

function counts(expectedKeys, observedKeys, predicted) {
  const remaining = new Map();
  for (const key of expectedKeys) remaining.set(key, (remaining.get(key) ?? 0) + 1);
  let matched = 0;
  for (const key of observedKeys) if ((remaining.get(key) ?? 0) > 0) {
    matched++;
    remaining.set(key, remaining.get(key) - 1);
  }
  return { matched, expected: expectedKeys.length, predicted, false_negative: expectedKeys.length - matched,
    false_positive: predicted === null ? null : predicted - matched,
    precision: predicted ? matched / predicted : null, recall: expectedKeys.length ? matched / expectedKeys.length : null };
}

export function scoreReviewDraft(host, draft, seed, snapshotTime, observation) {
  draft = parseProductJson(JSON.stringify(draft));
  const checked = checkReviewDraft(host, draft, seed, snapshotTime);
  const base = { schema: 'boundx-draft-score/v1', case_id: seed.id, language: seed.language, category: seed.category,
    draft_digest: checked.draft_digest, matcher: DRAFT_MATCHER, matcher_digest: digest(DRAFT_MATCHER),
    status: 'PENDING_GOLD_REVIEW', independent_review_verified: false, acceptance_passed: false,
    precision: null, recall: null, model_calls: 0 };
  if (!checked.all_candidates_structurally_valid) return { ...base, observation_status: 'NOT_SCORED',
    diagnostics: checked.candidate_checks, provisional_alternatives: [] };
  let candidate = null;
  let observed = null;
  let observationStatus = observation === null ? 'MISSING' : 'REJECTED';
  const diagnostics = [];
  if (observation !== null) {
    try {
      candidate = validateProduct(IDS.candidate, parseProductJson(typeof observation === 'string' || observation instanceof Uint8Array ? observation : JSON.stringify(observation)));
      assert(candidate.prepare_id === draft.binding.prepare_id && candidate.source_digest === draft.binding.source_digest
        && candidate.context_digest === draft.binding.context_digest, 'REVIEW_BINDING', 'Observation belongs to a different snapshot.');
      const evaluated = host.invoke('bx_evaluate_admin_candidate', { candidate, historical: true });
      if (evaluated.computed) { observed = evaluated.task; observationStatus = 'COMPUTED'; }
      else diagnostics.push(...evaluated.diagnostics.map(item => ({ code: item.code })));
    } catch (error) { diagnostics.push({ code: error.code ?? 'SCORE_OBSERVATION' }); }
  }
  const alternatives = draft.allowed_answers.map((answer, index) => {
    const expected = host.invoke('bx_evaluate_admin_candidate', { candidate: answer, historical: true }).task;
    const fields = Object.fromEntries(CORE_ELEMENTS.map(field => {
      const predicted = observed ? observed.elements[field].entries.length : observation === null ? 0 : candidate ? candidate.elements[field].entries.length : null;
      return [field, { ...counts(entryKeys(expected, field), observed ? entryKeys(observed, field) : [], predicted),
        state_correct: observed !== null && expected.elements[field].status === observed.elements[field].status,
        reasons_exact: observed !== null && digest(expected.elements[field].reason_codes ?? []) === digest(observed.elements[field].reason_codes ?? []) }];
    }));
    const rows = Object.values(fields);
    const totals = { matched: rows.reduce((sum, row) => sum + row.matched, 0), expected: rows.reduce((sum, row) => sum + row.expected, 0),
      predicted: rows.some(row => row.predicted === null) ? null : rows.reduce((sum, row) => sum + row.predicted, 0),
      false_negative: rows.reduce((sum, row) => sum + row.false_negative, 0),
      false_positive: rows.some(row => row.false_positive === null) ? null : rows.reduce((sum, row) => sum + row.false_positive, 0) };
    const relationsExact = observed !== null && digest({ constraints: expected.constraints, scopes: expected.scopes ?? [] })
      === digest({ constraints: observed.constraints, scopes: observed.scopes ?? [] });
    return { index, answer_digest: digest(answer), fields, totals, relations_exact: relationsExact,
      exact_match: observed !== null && rows.every(row => row.false_negative === 0 && row.false_positive === 0 && row.state_correct && row.reasons_exact) && relationsExact,
      explicit_B_recalled: fields.B.expected ? fields.B.false_negative === 0 : null };
  });
  return { ...base, observation_status: observationStatus, diagnostics, provisional_alternatives: alternatives };
}
