import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PackRegistry } from '../product/registry.mjs';
import { industrySelection } from '../product/selection-ui.mjs';
import { sha256 } from '../product/packages.mjs';

test('industry switch validates installed L2 identity, keeps one active L2 and grants no authority', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-industry-'));
  try {
    const repository = fileURLToPath(new URL('../../', import.meta.url));
    const registry = new PackRegistry(join(root, 'registry'), 'tenant-a');
    const l1 = registry.importDirectory(join(repository, 'domain-packs/l1/core-ontology'));
    registry.activate(l1);
    const first = registry.importDirectory(join(repository, 'domain-packs/l2/software-ai/0.2.0'));
    const original = join(repository, 'domain-packs/l2/software-ai/0.2.0');
    const alternate = join(root, 'synthetic-industry'); mkdirSync(alternate);
    const descriptor = JSON.parse(readFileSync(join(original, 'datapackage.json'), 'utf8')); descriptor.name = 'synthetic-industry';
    for (const resource of descriptor.resources) {
      const payload = JSON.parse(readFileSync(join(original, resource.path), 'utf8')); payload.packId = descriptor.name;
      const bytes = Buffer.from(JSON.stringify(payload));
      resource.bytes = bytes.length; resource.hash = 'sha256:' + sha256(bytes);
      writeFileSync(join(alternate, resource.path), bytes);
    }
    writeFileSync(join(alternate, 'datapackage.json'), JSON.stringify(descriptor));
    const second = registry.importDirectory(alternate);
    assert.deepEqual(registry.active(), [l1]);
    industrySelection(registry, { operation: 'activate', reference: first });
    const result = industrySelection(registry, { operation: 'activate', reference: second });
    assert.deepEqual(result.active, [l1, second]);
    assert.equal(result.business_decision, null); assert.equal(result.execution_authorization, null);
    assert.throws(() => industrySelection(registry, { operation: 'activate', reference: l1 }), { code: 'SELECTION_LAYER' });
    assert.throws(() => industrySelection(registry, { operation: 'activate', reference: first, allow: true }), { code: 'SELECTION_INPUT' });
    assert.deepEqual(registry.active(), [l1, second]);
    assert.deepEqual(industrySelection(registry, { operation: 'deactivate', reference: second }).active, [l1]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
