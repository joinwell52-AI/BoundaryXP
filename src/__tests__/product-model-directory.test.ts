import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createProductHost } from '../product/host.mjs';
import { runAdminModel } from '../product/model-pipeline.mjs';

for (const permitted of [false, true]) test(`model directory disclosure is host controlled: ${permitted}`, async () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-disclosure-'));
  try {
    const host = createProductHost({ root, tenant: 'tenant-a', allowDirectoryDisclosure: permitted });
    const l1 = host.registry.active()[0];
    const l3 = host.registry.importDirectory(fileURLToPath(new URL('../../examples/semantic-packs/tenant-a/0.1.0/', import.meta.url)));
    host.registry.activate(l3);
    let called = false;
    const result = await runAdminModel(host, { consent: true, config: { provider: 'cursor', key: 'test-key', model: 'test' },
      prepare: { source: { text: '小王读取报告。', language: 'zh-CN' }, profile: { id: 'org.boundx.test', required_elements: ['P'] }, packs: [l1, l3] } },
    { sendModel: async (config, messages) => {
      called = true;
      const prepared = JSON.parse(messages[1].content);
      assert.equal(prepared.entries.filter(entry => entry.kind === 'employee').length, 2);
      assert.ok(!messages[1].content.includes('李研'));
      throw Error('simulated provider failure');
    } });
    assert.equal(called, permitted);
    assert.equal(result.computed, false);
    assert.equal(result.result, null);
    if (!permitted) assert.equal(result.diagnostics[0].code, 'DIRECTORY_DISCLOSURE_NOT_AUTHORIZED');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
