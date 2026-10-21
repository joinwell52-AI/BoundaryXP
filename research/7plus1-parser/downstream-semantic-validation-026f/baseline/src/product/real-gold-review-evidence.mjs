import { sourceDigest } from '../bxp/evaluate.mjs';

function uniqueQuoteCodePointSpan(source, quote) {
  if (typeof quote !== 'string' || !quote) return null;
  const first = source.indexOf(quote);
  if (first < 0 || source.indexOf(quote, first + 1) >= 0) return null;
  const start = [...source.slice(0, first)].length;
  return { start, end: start + [...quote].length };
}

export function suggestRealGoldEvidenceSpans(source, entries, sourceSha256) {
  if (typeof source !== 'string' || !Array.isArray(entries) || sourceDigest(source) !== sourceSha256) return [];
  const points = [...source];
  const seen = new Set();
  const suggestions = [];
  for (const item of entries) {
    if (typeof item?.evidence_id !== 'string' || !item.evidence_id || seen.has(item.evidence_id)
      || item.source_id !== 'SOURCE_TASK' || item.origin !== 'SOURCE'
      || !Number.isSafeInteger(item.start) || !Number.isSafeInteger(item.end)
      || typeof item.quote !== 'string' || !item.quote) continue;
    seen.add(item.evidence_id);
    if (points.slice(item.start, item.end).join('') === item.quote) continue;
    const span = uniqueQuoteCodePointSpan(source, item.quote);
    if (span === null) continue;
    suggestions.push({ evidence_id: item.evidence_id, source_sha256: sourceSha256,
      quote_sha256: sourceDigest(item.quote), submitted_span: { start: item.start, end: item.end },
      suggested_span: span, status: 'PROPOSAL_NOT_APPLIED' });
  }
  return suggestions;
}

export function validateRealGoldReviewEvidence(source, entries) {
  if (typeof source !== 'string' || !Array.isArray(entries)) return ['EVIDENCE_COLLECTION_INVALID'];
  const points = [...source], ids = new Set(), issues = [];
  for (const item of entries) {
    if (!item || typeof item !== 'object' || Array.isArray(item)
      || typeof item.evidence_id !== 'string' || !item.evidence_id
      || ids.has(item.evidence_id) || item.source_id !== 'SOURCE_TASK'
      || !Number.isSafeInteger(item.start) || !Number.isSafeInteger(item.end)
      || item.start < 0 || item.end <= item.start || item.end > points.length
      || typeof item.quote !== 'string' || points.slice(item.start, item.end).join('') !== item.quote) {
      const span = uniqueQuoteCodePointSpan(source, item?.quote);
      const location = span === null ? '' : `:UNIQUE_QUOTE_CODEPOINT_SPAN:[${span.start},${span.end})`;
      issues.push(`EVIDENCE_SPAN_INVALID:${item?.evidence_id ?? 'unknown'}${location}`);
    }
    if (typeof item?.evidence_id === 'string') ids.add(item.evidence_id);
  }
  return issues;
}

export function validateRealGoldEvidenceRecord(source, record, caseId, sourceSha256) {
  const issues = validateRealGoldReviewEvidence(source, record?.evidence);
  if (record?.case_id !== caseId || record?.source_sha256 !== sourceSha256
    || record?.status !== 'EVIDENCE_VERIFIED' || issues.length) {
    issues.push('EVIDENCE_SOURCE_OR_STATUS_MISMATCH');
  }
  return issues;
}

export function validateRealGoldEvidenceReferences(slots, entries) {
  if (!slots || typeof slots !== 'object' || Array.isArray(slots) || !Array.isArray(entries)) {
    return ['GOLD_EVIDENCE_REFERENCES_INVALID'];
  }
  const known = new Set(entries.filter(item => typeof item?.evidence_id === 'string').map(item => item.evidence_id));
  const issues = [];
  for (const slot of ['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B']) {
    const references = slots[slot]?.evidence;
    if (!Array.isArray(references)) {
      issues.push(`GOLD_SLOT_EVIDENCE_INVALID:${slot}`);
      continue;
    }
    for (const id of references) if (typeof id !== 'string' || !known.has(id)) {
      issues.push(`GOLD_EVIDENCE_REFERENCE_UNKNOWN:${slot}:${String(id)}`);
    }
  }
  return issues;
}
