import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PackRegistry } from '../product/registry.mjs';
import { ProducerService } from '../product/producer.mjs';
import { evaluateCandidate, renderThreeLayers } from '../product/assembler.mjs';
import { locateEvidence } from '../product/evidence.mjs';

test('evidence preserves Unicode, CRLF and repeated quote disambiguation', () => {
  const sources = { task: '🧪café\r\ncafé\r\nread read' };
  assert.equal(locateEvidence(sources, { source_id: 'task', quote: 'café' }).start, 1);
  assert.throws(() => locateEvidence(sources, { source_id: 'task', quote: 'read' }), { code: 'QUOTE_AMBIGUOUS' });
  assert.equal(locateEvidence(sources, { source_id: 'task', quote: 'read', prefix: 'read ' }).end, Array.from(sources.task).length);
});
test('frozen candidate replay calls one Core and retains separate authority fields', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-assembler-'));
  try {
    const registry = new PackRegistry(root, 'tenant-a');
    const l1 = registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology/', import.meta.url)));
    registry.activate(l1);
    const service = new ProducerService(registry);
    const task = JSON.parse(readFileSync(new URL('../../examples/bxp/en-complete.json', import.meta.url), 'utf8'));
    const prepare = service.prepare({ source: task.source, profile: task.profile, packs: [l1] });
    const convert = value => {
      if (Array.isArray(value)) return value.map(convert);
      if (value && typeof value === 'object') {
        if (Object.hasOwn(value, 'quote')) return { source_id: value.source_id ?? 'task', quote: value.quote };
        return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'normalized').map(([key, child]) => [key, convert(child)]));
      }
      return value;
    };
    const candidate = { schema: 'boundx-extraction-candidate/v1', prepare_id: prepare.prepare_id, source_digest: prepare.source_digest,
      context_digest: prepare.context_digest, elements: convert(task.elements), constraints: convert(task.constraints),
      producer: { producer_kind: 'structured-replay', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] };
    const result = evaluateCandidate(service, candidate);
    assert.equal(result.computed, true, JSON.stringify(result.diagnostics));
    assert.equal(result.result.business_decision, null);
    assert.equal(result.result.execution_authorization, null);
    assert.deepEqual(evaluateCandidate(service, candidate), result);
    assert.ok(renderThreeLayers(task.source.text, result).includes('【Layer 3：计算结果与建议】'));
    assert.equal(evaluateCandidate(service, { ...candidate, source_digest: '0'.repeat(64) }).computed, false);
    const bad = structuredClone(candidate); bad.elements.I.entries[0].evidence[0].quote = 'forged';
    assert.equal(evaluateCandidate(service, bad).computed, false);
    registry.deactivate(l1);
    assert.equal(evaluateCandidate(service, candidate).diagnostics[0].code, 'STALE_PREPARE');
    assert.equal(evaluateCandidate(service, candidate, { historical: true }).historical, true);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
