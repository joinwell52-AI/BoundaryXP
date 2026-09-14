import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PackRegistry } from '../product/registry.mjs';
test('registry imports immutable directories without implicitly activating and isolates tenants', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-registry-'));
  try {
    const registry = new PackRegistry(root, 'tenant-a');
    const l1 = registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology/', import.meta.url)));
    assert.equal(registry.active().length, 0);
    assert.deepEqual(registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology/', import.meta.url))), l1);
    registry.activate(l1);
    const l3 = registry.importDirectory(fileURLToPath(new URL('../../examples/semantic-packs/tenant-a/0.1.0/', import.meta.url)));
    registry.activate(l3);
    assert.equal(registry.active().length, 2);
    assert.throws(() => registry.deactivate(l1), { code: 'DEPENDENCY' });
    assert.equal(registry.active().length, 2);
    const tenantB = new PackRegistry(root, 'tenant-b');
    assert.throws(() => tenantB.load(l3), { code: 'TENANT' });
    assert.equal(tenantB.list().length, 1);
    registry.deactivate(l3); registry.deactivate(l1);
    assert.equal(registry.active().length, 0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
