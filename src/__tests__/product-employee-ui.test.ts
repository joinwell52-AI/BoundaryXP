import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PackRegistry } from '../product/registry.mjs';
import { createApp } from '../../ui-server.mjs';
import { employeeTemplate } from '../product/employees.mjs';

test('guarded UI creates previews and ZIPs then imports and activates only on separate requests', async () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-employee-web-'));
  const registry = new PackRegistry(root, 'tenant-a');
  const server = createApp({ productOptions: { root, tenant: 'tenant-a' } });
  try {
    const l1 = registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology/', import.meta.url)));
    registry.activate(l1);
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    const html = await fetch(origin + '/admin').then(response => response.text());
    const token = html.match(/name="boundx-token" content="([a-f0-9]+)"/)[1];
    const post = (input, authorized = true) => fetch(origin + '/api/employee-directory', { method: 'POST',
      headers: { 'content-type': 'application/json', origin, 'x-boundx-token': authorized ? token : '' }, body: JSON.stringify(input) });
    assert.equal(await fetch(origin + '/api/employee-template').then(response => response.text()), employeeTemplate());
    const csv = employeeTemplate() + 'staff-01,Example,[],human,Custom,active,\r\n';
    const preview = await post({ operation: 'preview', csv }); assert.equal(preview.status, 200);
    assert.equal((await preview.json()).directory.employees.length, 1);
    assert.deepEqual(registry.active(), [l1]);
    assert.equal((await post({ operation: 'preview', csv }, false)).status, 403);
    const build = await post({ operation: 'build', csv, name: 'web-team', version: '0.1.0', l1, roles_json: '{}' });
    assert.equal(build.status, 200, await build.clone().text());
    const built = await build.json();
    assert.equal(registry.list().length, 1);
    const imported = await post({ operation: 'import', archive: built.archive }); assert.equal(imported.status, 200);
    assert.deepEqual(registry.active(), [l1]);
    assert.equal((await post({ operation: 'activate', reference: built.reference })).status, 200);
    assert.equal(registry.active().length, 2);
    assert.equal((await post({ operation: 'build', csv, name: 'bad', version: '0.1.0', l1,
      roles_json: '{"staff-01":null,"staff-01":"sre"}' })).status, 400);
    assert.equal((await post({ operation: 'build', csv, name: 'bad', version: '0.1.0', l1, output: '../escape' })).status, 400);
    assert.equal((await post({ operation: 'import', archive: built.archive + '!' })).status, 400);
    assert.equal(registry.active().length, 2);
  } finally {
    if (server.listening) await new Promise<void>(resolve => server.close(() => resolve()));
    rmSync(root, { recursive: true, force: true });
  }
});
