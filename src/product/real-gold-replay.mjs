import { isVerifiedRealGoldReviewCase, loadRealGoldReviewCases, realGoldReviewInventory } from './real-gold-review-cases.mjs';
import { validateRealGoldReviewGates } from './real-gold-review-gates.mjs';
import { digest } from '../bxp/evaluate.mjs';

export function isRealGoldPresentationComplete(entry) {
  const gaps = entry?.gold?.calculation_explanation_gaps;
  return Boolean(gaps && typeof gaps === 'object' && !Array.isArray(gaps)
    && Object.keys(gaps).length === 2 && ['zh-CN', 'en'].every(language =>
      Array.isArray(gaps[language]) && gaps[language].length === 0));
}

export function realGoldReplayRecords(dataset = loadRealGoldReviewCases(), { partialReview = false } = {}) {
  if (!dataset || dataset.suite_kind !== 'real-gold-review' || dataset.admin_gold_frozen !== false || !Array.isArray(dataset.cases)) {
    throw Error('REAL_GOLD_REVIEW_DATASET_INVALID');
  }
  if (dataset.cases.some(entry => entry.review_status !== 'GOLD_REVIEW_PASSED'
    || validateRealGoldReviewGates({ final_status: entry.review_status, admin_gold_frozen: false,
      gates: entry.gold?.review_gates }) !== null)) throw Error('REAL_GOLD_REVIEW_NOT_PASSED');
  if (dataset.cases.some(entry => !isRealGoldPresentationComplete(entry))) {
    throw Error('REAL_GOLD_REVIEW_PRESENTATION_INCOMPLETE');
  }
  if (dataset.cases.some(entry => !isVerifiedRealGoldReviewCase(entry))) throw Error('REAL_GOLD_REVIEW_ARTIFACT_UNVERIFIED');
  const inventory = realGoldReviewInventory(dataset.cases);
  if (inventory.duplicate_case_ids.length || inventory.unexpected_case_ids.length
    || !partialReview && inventory.missing_case_ids.length) {
    throw Error('REAL_GOLD_REVIEW_INCOMPLETE');
  }
  return dataset.cases.map(entry => ({
    case_id: entry.case_id,
    revision: entry.revision,
    review_snapshot_digest: digest(entry),
    source_sha256: entry.source.sha256,
    source_chars: entry.source.chars,
    layer_digests: {
      ir_7plus1: digest(entry.gold.ir_7plus1),
      formal_boundary_model: digest(entry.gold.formal_boundary_model),
      boundary_result: digest(entry.gold.result),
      admission: digest(entry.gold.admission),
    },
    boundary_state: entry.gold.boundary_result.state,
    policy_evaluation: entry.gold.admission.policy_evaluation,
    admission: entry.gold.admission.status,
    review_status: entry.review_status,
    gates: structuredClone(entry.gold.review_gates),
    replay_status: 'VERIFIED_REVIEW_ARTIFACT_NOT_PRODUCER_SCORE',
    deterministic_calculation_recomputed: false,
    calculation_replay_limitation: 'GOLD_FORMAL_MODEL_IS_SYMBOLIC_TEXT_NOT_TYPED_CORE_INPUT',
    producer_score: null,
    admin_gold_frozen: false,
  }));
}
