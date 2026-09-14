import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { createProductHost } from '../product/host.mjs';
import { replayStructured, replayLabels, tokenRangeLocator } from '../product/replay.mjs';
import { locateEvidence } from '../product/evidence.mjs';

test('two replay representations share the same prepare and Core calculations without claiming live runs', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-replay-'));
  try {
    const host = createProductHost({ root, tenant: 'tenant-a' });
    const l1 = host.registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology/', import.meta.url)));
    host.registry.activate(l1);
    const task = JSON.parse(readFileSync(new URL('../../examples/bxp/en-complete.json', import.meta.url), 'utf8'));
    const prepared = host.service.prepare({ source: task.source, profile: task.profile, packs: [l1] });
    const convert = value => {
      if (Array.isArray(value)) return value.map(convert);
      if (!value || typeof value !== 'object') return value;
      if (Object.hasOwn(value, 'quote')) return { source_id: value.source_id ?? 'task', quote: value.quote };
      return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'normalized').map(([key, child]) => [key, convert(child)]));
    };
    const candidate = replayStructured({ schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id,
      source_digest: prepared.source_digest, context_digest: prepared.context_digest, elements: convert(task.elements), constraints: convert(task.constraints),
      clarifications: [], producer: { producer_kind: 'structured-replay', adapter_version: '0.1.0', model_id: 'unknown' } });
    const labels = { schema: 'boundx-label-replay/v1', tags: CORE_ELEMENTS.map(element => ({ element, ...candidate.elements[element] })),
      relations: candidate.constraints, clarifications: [] };
    const converted = replayLabels(prepared, labels);
    const first = host.invoke('bx_evaluate_admin_candidate', { candidate });
    const second = host.invoke('bx_evaluate_admin_candidate', { candidate: converted });
    assert.equal(first.computed, true); assert.equal(second.computed, true);
    assert.deepEqual(first.task.elements, second.task.elements);
    assert.deepEqual(first.task.constraints, second.task.constraints);
    assert.deepEqual(first.result.calculations, second.result.calculations);
    assert.deepEqual(first.result.evaluation, second.result.evaluation);
    assert.equal(converted.producer.model_id, 'unknown');
    assert.notEqual(first.task_digest, second.task_digest);
    assert.throws(() => replayStructured({ ...candidate, producer: { ...candidate.producer, producer_kind: 'host-ai' } }), { code: 'ADAPTER_KIND' });
    assert.throws(() => replayLabels(prepared, { ...labels, tags: labels.tags.map(() => labels.tags[0]) }), { code: 'ADAPTER_ELEMENTS' });
    assert.throws(() => replayLabels(prepared, { ...labels, execution_authorization: true }), { code: 'ADAPTER_SCHEMA' });
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('token replay converts exact pieces into verified Unicode code-point evidence', () => {
  const tokens = ['🧪', 'read', '\r\n', 'café', ' ', 'read'];
  const source = tokens.join('');
  const locator = tokenRangeLocator(source, tokens, 5, 6);
  const evidence = locateEvidence({ task: source }, locator);
  assert.equal(evidence.start, [...tokens.slice(0, 5).join('')].length);
  assert.equal(evidence.quote, 'read');
  assert.throws(() => tokenRangeLocator(source, ['🧪read\r\ncafé read'], 0, 1), { code: 'TOKEN_ALIGNMENT' });
  assert.throws(() => tokenRangeLocator(source, tokens, 4, 9), { code: 'TOKEN_RANGE' });
  assert.throws(() => tokenRangeLocator('🧪', ['\ud83e', '\uddea'], 0, 1), { code: 'TOKEN_ALIGNMENT' });
});
