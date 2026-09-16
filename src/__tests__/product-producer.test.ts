import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PackRegistry } from '../product/registry.mjs';
import { ProducerService } from '../product/producer.mjs';
import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { createCaseScenario } from '../../fixtures/admin-text/scenarios.mjs';

for (const [source, ids, computed] of [
  ['QA-01读取DEV-01生成的report.json。', ['qa-01', 'dev-01'], true],
  ['QA-01 reads the report from DEV-01.', ['qa-01', 'dev-01'], true],
  ['qa-01 reads the report from dev-01.', ['qa-01', 'dev-01'], true],
  ['王明把报告交给王岚。', ['e101', 'e102'], true],
  ['小王检查DEV-01的报告。', ['e101'], false],
  ['Xiao Wang checks the report from DEV-01.', ['e102'], false],
] as const) test(`identity evidence separates multiple mentions from shared aliases: ${source}`, () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-multiple-identities-'));
  try {
    const scenario = createCaseScenario(root, { setup: 'default', task_text: source, language: 'mixed' });
    const prepared = scenario.host.service.prepare(scenario.input);
    const elements = Object.fromEntries(CORE_ELEMENTS.map(field => [field, { status: 'absent', entries: [] }]));
    elements.P = { status: 'resolved', entries: ids.map(id => ({ id: 'person-' + id, kind: 'actor', text: id,
      evidence: [{ source_id: 'task', quote: source }], semantic_refs: [prepared.entries.find(entry => entry.kind === 'employee' && entry.entry.employee_id === id).reference] })) };
    const result = scenario.host.invoke('bx_evaluate_admin_candidate', { candidate: {
      schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id, source_digest: prepared.source_digest,
      context_digest: prepared.context_digest, elements, constraints: { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [] },
      producer: { producer_kind: 'host-ai', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] } });
    assert.equal(result.computed, computed, JSON.stringify(result.diagnostics));
    if (computed) {
      assert.equal(result.result.business_decision, null);
      assert.equal(result.result.execution_authorization, null);
      assert.equal(result.task.elements.P.entries.length, ids.length);
    } else assert.equal(result.diagnostics[0].code, 'IDENTITY_AMBIGUOUS');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('prepare freezes exact source and minimal selected directory entries with host-controlled disclosure', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-prepare-'));
  try {
    const registry = new PackRegistry(root, 'tenant-a');
    const l1 = registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology/', import.meta.url)));
    registry.activate(l1);
    const l3 = registry.importDirectory(fileURLToPath(new URL('../../examples/semantic-packs/tenant-a/0.1.0/', import.meta.url)));
    registry.activate(l3);
    const input = { source: { text: ' 🧪小王读取报告。\r\n', language: 'zh-CN' }, profile: { id: 'org.boundx.admin', required_elements: [...CORE_ELEMENTS] }, packs: [l1, l3] };
    const denied = new ProducerService(registry).prepare(input);
    assert.equal(denied.entries.filter(item => item.kind === 'employee').length, 0);
    const producer = new ProducerService(registry, { allowDirectoryDisclosure: true });
    const prepared = producer.prepare(input);
    assert.equal(prepared.entries.filter(item => item.kind === 'employee').length, 2);
    assert.equal(JSON.stringify(prepared).includes('李研'), false);
    assert.equal(prepared.source.text, input.source.text);
    registry.deactivate(l3);
    assert.equal(producer.load(prepared.prepare_id).context_digest, prepared.context_digest);
    assert.throws(() => producer.prepare(input), { code: 'PACK_INACTIVE' });
  } finally { rmSync(root, { recursive: true, force: true }); }
});
