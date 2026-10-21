import { documentSemanticUnits } from './nlp-document-units.mjs';

const sameSpan = (left, right) => left?.source_id === right?.source_id
  && left?.start === right?.start && left?.end === right?.end && left?.quote === right?.quote;

export function deriveDocumentCoverageGaps(text, units, document = documentSemanticUnits(text)) {
  const sourceBlocks = [
    ...(document?.diagnostics ?? []).filter(item => item.code === 'DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED')
      .map(item => ({ evidence: item.evidence[0], reason: 'DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED' })),
    ...(document?.diagnostics ?? []).filter(item => item.code === 'DOCUMENT_OUTPUT_CONTENT_MISSING')
      .map(item => ({ evidence: item.evidence[0], reason: 'DOCUMENT_OUTPUT_CONTENT_MISSING' })),
    ...(document?.diagnostics ?? []).filter(item => item.code === 'DOCUMENT_CONDITION_INTRODUCTION'
      && !(document?.units ?? []).some(unit => unit.evidence.some(span => sameSpan(span, item.evidence[0]))))
      .map(item => ({ evidence: item.evidence[0], reason: 'DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED' })),
    ...(document?.units ?? []).map(item => {
      const requiredEvidence = item.evidence.filter((span, index) => index === 0
        || !sameSpan(span, item.scope?.evidence?.[0]));
      return { evidence: item.evidence[0], reason: 'DOCUMENT_CANDIDATE_NOT_MAPPED',
        candidate_slot: item.slot,
        ...(requiredEvidence.length > 1 ? { candidate_evidence: requiredEvidence } : {}) };
    }),
    ...(!document ? [{ evidence: { source_id: 'task', start: 0, end: [...text].length, quote: text },
      reason: 'SOURCE_COVERAGE_NOT_ESTABLISHED' }] : []),
  ];
  const uniqueBlocks = new Map();
  for (const block of sourceBlocks) {
    const key = `${block.evidence.source_id}:${block.evidence.start}:${block.evidence.end}:${block.candidate_slot ?? ''}`
      + `:${block.reason}:${JSON.stringify(block.candidate_evidence ?? [])}`;
    if (!uniqueBlocks.has(key)) uniqueBlocks.set(key, block);
  }
  return [...uniqueBlocks.values()]
    .filter(block => ['DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED', 'DOCUMENT_OUTPUT_CONTENT_MISSING'].includes(block.reason)
      || !units.some(unit => ['resolved', 'unresolved'].includes(unit.status)
        && (block.candidate_slot === undefined || unit.slot === block.candidate_slot)
        && (block.candidate_evidence ?? [block.evidence]).every(required => unit.evidence?.some(span =>
          sameSpan(span, required)))));
}
