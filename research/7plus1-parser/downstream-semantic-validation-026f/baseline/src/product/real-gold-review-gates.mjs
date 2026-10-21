const gateNames = Object.freeze(Array.from({ length: 10 }, (_, index) => `G${index + 1}`));

export function validateRealGoldReviewGates(review) {
  if (!review || typeof review !== 'object' || Array.isArray(review)
    || review.admin_gold_frozen !== false
    || !['GOLD_REVIEW_PASSED', 'DRAFT_FOR_REVIEW'].includes(review.final_status)) {
    return 'REVIEW_STATUS_INVALID';
  }
  for (const gate of gateNames) {
    if (!['PASS', 'FAIL', 'PENDING'].includes(review.gates?.[gate]?.status)) {
      return `REVIEW_GATE_INVALID:${gate}`;
    }
    if (review.final_status === 'GOLD_REVIEW_PASSED' && review.gates[gate].status !== 'PASS') {
      return `REVIEW_PASS_WITHOUT_GATE_PASS:${gate}`;
    }
  }
  return null;
}
