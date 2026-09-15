import { authorIoReviewDraft, IO_DRAFT_CASE_IDS } from './authored-io-drafts.mjs';
import { authorModalityReviewDraft, MODALITY_DRAFT_CASE_IDS } from './authored-modality-drafts.mjs';
import { authorDomainReviewDraft, DOMAIN_DRAFT_CASE_IDS } from './authored-domain-drafts.mjs';
import { authorBoundaryReviewDraft, BOUNDARY_DRAFT_CASE_IDS } from './authored-boundary-drafts.mjs';
import { authorSafetyReviewDraft, SAFETY_DRAFT_CASE_IDS } from './authored-safety-drafts.mjs';
import { assert } from '../../src/product/contracts.mjs';
import { addAuthoredRelations } from './authored-relations.mjs';

const identityAnswers = {
  T025: [['e104']], T031: [['dev-01']], T032: [['e101', 'e102']], T033: [['e101']],
  T034: [['e103']], T036: [['qa-01']], T037: [['e101', 'e102']], T038: [['e103']], T039: [['e104']],
  T040: [['dev-01'], ['e101', 'e102']], T102: [['b101']], T104: [['e104']], T108: [['b101']], T110: [['qa-01']]
};

const authors = new Map();
for (const [ids, author] of [[IO_DRAFT_CASE_IDS, authorIoReviewDraft], [MODALITY_DRAFT_CASE_IDS, authorModalityReviewDraft],
  [DOMAIN_DRAFT_CASE_IDS, authorDomainReviewDraft], [BOUNDARY_DRAFT_CASE_IDS, authorBoundaryReviewDraft], [SAFETY_DRAFT_CASE_IDS, authorSafetyReviewDraft]]) {
  for (const id of ids) {
    if (authors.has(id)) throw Error('Duplicate authored case ID.');
    authors.set(id, author);
  }
}
export const INITIAL_DRAFT_CASE_IDS = Object.freeze([...authors.keys()]);
export function authorInitialReviewDraft(input, prepared) {
  const author = authors.get(input.binding?.case_id);
  if (!author) throw Error('No authored draft for this case.');
  const draft = author(input);
  const identities = identityAnswers[draft.binding.case_id];
  if (identities) {
    assert(prepared?.prepare_id === draft.binding.prepare_id && prepared.context_digest === draft.binding.context_digest,
      'AUTHOR_CONTEXT', 'Identity annotations require their original prepared context.');
    for (const [index, ids] of identities.entries()) {
      const entry = draft.allowed_answers[0].elements.P.entries[index];
      entry.semantic_refs = ids.map(id => {
        const matches = prepared.entries.filter(item => item.kind === 'employee' && item.entry.employee_id === id);
        assert(matches.length === 1, 'AUTHOR_IDENTITY', 'Expected authored identity is unavailable in this snapshot.');
        return structuredClone(matches[0].reference);
      });
      if (ids.length > 1) entry.candidate_ids = [...ids];
    }
    draft.author_notes += ' 本例职员引用来自指定快照；共享别名保留全部已标候选。 This case binds employee references from the supplied snapshot and retains all authored alias alternatives.';
  }
  return addAuthoredRelations(draft);
}
