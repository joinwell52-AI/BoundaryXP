import { sourceDigest, CORE_ELEMENTS } from '../bxp/index.mjs';
import { assert, parseProductJson } from './contracts.mjs';

export function auditIndustryCases(raw, { expectedCount = 1000 } = {}) {
  const value = parseProductJson(raw);
  assert(value && typeof value.packId === 'string' && Array.isArray(value.cases), 'CASE_SCHEMA', 'Expected an industry case collection.');
  const ids = new Map(), sources = new Map(), languages = Object.create(null), statuses = Object.create(null);
  const invalidRecords = [];
  for (const [index, item] of value.cases.entries()) {
    if (!item || typeof item.id !== 'string' || !item.id || item.pack_id !== value.packId
      || typeof item.layer1_evidence?.task_text !== 'string' || !item.layer1_evidence.task_text.trim()
      || typeof item.layer1_evidence?.language !== 'string'
      || !item.layer2_extracted_7plus1 || !CORE_ELEMENTS.every(field => Array.isArray(item.layer2_extracted_7plus1[field]))) {
      invalidRecords.push({ index, id: item?.id ?? null, code: 'CASE_SCHEMA' }); continue;
    }
    ids.set(item.id, (ids.get(item.id) ?? 0) + 1);
    const hash = sourceDigest(item.layer1_evidence.task_text);
    if (!sources.has(hash)) sources.set(hash, []);
    sources.get(hash).push(item.id);
    const language = item.layer1_evidence.language;
    languages[language] = (languages[language] ?? 0) + 1;
    const status = item.layer3_expected_evaluation?.status ?? 'missing';
    statuses[status] = (statuses[status] ?? 0) + 1;
  }
  const duplicates = [...sources].filter(([, entries]) => entries.length > 1).map(([source_digest, entries]) => ({ source_digest, ids: entries }));
  const duplicate_ids = [...ids].filter(([, count]) => count > 1).map(([id, count]) => ({ id, count }));
  return { schema: 'boundx-case-audit/v1', pack_id: value.packId, file_digest: sourceDigest(typeof raw === 'string' ? raw : new TextDecoder('utf-8', { fatal: true }).decode(raw)),
    declared_count: value.count, records: value.cases.length, expected_count: expectedCount, unique_source_texts: sources.size,
    repeated_records: [...sources.values()].reduce((total, entries) => total + entries.length - 1, 0),
    languages, supplied_status_counts: statuses, supplied_review_status: value.review_status ?? 'unknown',
    invalid_records: invalidRecords, duplicate_ids, duplicate_sources: duplicates,
    inventory_passed: value.count === value.cases.length && value.cases.length === expectedCount && !invalidRecords.length && !duplicate_ids.length && !duplicates.length,
    gold_review_verified: false, model_runs_verified: 0,
    limitations: ['Inventory checks are not semantic or BXP conformance tests.', 'Supplied PASS/FAIL and review labels are not independently verified gold.',
      'Exact-source duplicates are counted once; distinct text does not prove distinct semantic coverage.'] };
}
