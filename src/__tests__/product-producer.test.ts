import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PackRegistry } from '../product/registry.mjs';
import { ProducerService } from '../product/producer.mjs';
import { CORE_ELEMENTS } from '../bxp/index.mjs';

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
