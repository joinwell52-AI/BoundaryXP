import { digest, sourceDigest } from '../bxp/index.mjs';
import { assert, parseProductJson } from './contracts.mjs';
import { replayStructured } from './replay.mjs';

function bindingFor(prepared, seed, snapshotTime) {
  assert(seed.id && prepared.source.text === seed.task_text && prepared.source.language === seed.language
    && prepared.source_digest === sourceDigest(seed.task_text), 'REVIEW_SOURCE', 'Review source must match the original seed exactly.');
  return { case_id: seed.id, language: seed.language, category: seed.category, setup: seed.setup,
    snapshot_time: snapshotTime, source: prepared.source, sources: prepared.sources, source_digest: prepared.source_digest,
    prepare_id: prepared.prepare_id, context_digest: prepared.context_digest, pack_lock: prepared.packs, profile: prepared.profile,
    checkpoints: seed.checkpoints, rules: prepared.rules, candidate_schema_digest: prepared.candidate_schema_digest };
}

export function createReviewDraft(prepared, seed, snapshotTime) {
  const binding = bindingFor(prepared, seed, snapshotTime);
  return structuredClone({ schema: 'boundx-gold-draft/v1', binding, binding_digest: digest(binding),
    allowed_answers: null, author_notes: '', review_status: 'PENDING', independent_review_verified: false });
}

export function checkReviewDraft(host, input, seed, snapshotTime) {
  const draft = parseProductJson(JSON.stringify(input));
  assert(draft && Object.keys(draft).length === 7 && Object.keys(draft).every(key =>
    ['schema', 'binding', 'binding_digest', 'allowed_answers', 'author_notes', 'review_status', 'independent_review_verified'].includes(key))
    && draft.schema === 'boundx-gold-draft/v1' && draft.review_status === 'PENDING' && draft.independent_review_verified === false,
  'REVIEW_CONTRACT', 'Draft validation cannot certify independent review.');
  const prepared = host.service.load(draft.binding?.prepare_id);
  const expected = bindingFor(prepared, seed, snapshotTime);
  assert(digest(draft.binding) === digest(expected) && draft.binding_digest === digest(expected), 'REVIEW_BINDING', 'Source, package lock or review context changed.');
  assert(typeof draft.author_notes === 'string' && Array.from(draft.author_notes).length <= 10000, 'REVIEW_NOTES', 'Notes must be bounded text.');
  assert(draft.allowed_answers === null || (Array.isArray(draft.allowed_answers) && draft.allowed_answers.length >= 1 && draft.allowed_answers.length <= 16),
    'REVIEW_ANSWERS', 'Provide null or one to sixteen explicit candidate alternatives.');
  const seen = new Set();
  const checks = (draft.allowed_answers ?? []).map((answer, index) => {
    const answerDigest = digest(answer);
    assert(!seen.has(answerDigest), 'REVIEW_DUPLICATE', 'Duplicate answer alternatives are not additional reviewed interpretations.');
    seen.add(answerDigest);
    try {
      const candidate = replayStructured(answer);
      assert(candidate.prepare_id === prepared.prepare_id && candidate.source_digest === prepared.source_digest
        && candidate.context_digest === prepared.context_digest, 'REVIEW_BINDING', 'Answer belongs to a different review snapshot.');
      const result = host.invoke('bx_evaluate_admin_candidate', { candidate, historical: true });
      return { index, answer_digest: answerDigest, structurally_valid: result.computed,
        diagnostics: result.diagnostics.map(item => ({ code: item.code })) };
    } catch (error) { return { index, answer_digest: answerDigest, structurally_valid: false, diagnostics: [{ code: error.code ?? 'REVIEW_ANSWER' }] }; }
  });
  return { schema: 'boundx-gold-draft-check/v1', case_id: seed.id, draft_digest: digest(draft),
    binding_digest: draft.binding_digest, candidate_checks: checks, candidate_count: checks.length,
    all_candidates_structurally_valid: checks.length > 0 && checks.every(check => check.structurally_valid),
    status: 'PENDING_GOLD_REVIEW', independent_review_verified: false, precision: null, recall: null };
}
