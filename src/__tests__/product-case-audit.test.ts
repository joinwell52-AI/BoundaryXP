import test from 'node:test';
import assert from 'node:assert/strict';
import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { auditIndustryCases } from '../product/case-audit.mjs';

const entry = (id, text) => ({ id, pack_id: 'test-domain', layer1_evidence: { task_text: text, language: 'zh-CN' },
  layer2_extracted_7plus1: Object.fromEntries(CORE_ELEMENTS.map(field => [field, []])), layer3_expected_evaluation: { status: 'PASS' } });
const collection = cases => JSON.stringify({ packId: 'test-domain', count: cases.length, review_status: 'PENDING_REVIEW', cases });
test('case inventory counts exact duplicates without certifying supplied PASS labels', () => {
  const report = auditIndustryCases(collection([entry('one', '读取报告。'), entry('two', '读取报告。')]), { expectedCount: 2 });
  assert.equal(report.records, 2); assert.equal(report.unique_source_texts, 1); assert.equal(report.repeated_records, 1);
  assert.equal(report.inventory_passed, false); assert.equal(report.gold_review_verified, false); assert.equal(report.model_runs_verified, 0);
  assert.deepEqual(report.duplicate_sources[0].ids, ['one', 'two']);
});
test('distinct Unicode and CRLF originals are not normalized for deduplication', () => {
  const report = auditIndustryCases(collection([entry('one', 'café\r\n🧪'), entry('two', 'café\n🧪')]), { expectedCount: 2 });
  assert.equal(report.unique_source_texts, 2); assert.equal(report.inventory_passed, true);
  assert.equal(report.gold_review_verified, false);
});
test('wrong counts and duplicate IDs fail inventory independently of source duplicates', () => {
  const raw = collection([entry('same', 'one'), entry('same', 'two')]);
  const report = auditIndustryCases(raw, { expectedCount: 1000 });
  assert.equal(report.inventory_passed, false); assert.equal(report.duplicate_ids.length, 1);
  const malformed = entry('bad', 'text'); malformed.pack_id = 'other';
  assert.equal(auditIndustryCases(collection([malformed]), { expectedCount: 1 }).invalid_records.length, 1);
});
