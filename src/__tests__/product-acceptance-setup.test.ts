import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createAcceptanceSetup } from '../../fixtures/admin-text/setup.mjs';

test('v2 setup freezes explicit role mappings, ambiguous identities and changed directory independently', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-acceptance-'));
  try {
    const initial = createAcceptanceSetup(root);
    const directory = initial.host.registry.load(initial.packs[2]).payloads['employee-directory'];
    const byId = id => directory.employees.find(employee => employee.employee_id === id);
    assert.equal(byId('dev-01').role_ref.entry_id, 'software-engineer');
    assert.equal(byId('qa-01').role_ref.entry_id, 'qa-engineer');
    assert.equal(byId('ops-01').role_ref.entry_id, 'sre');
    assert.equal(byId('pm-01').role_ref, null);
    assert.equal(byId('e103').status, 'inactive');
    const prepared = initial.host.service.prepare({ source: { text: '小王与李研核对报告。', language: 'zh-CN' },
      profile: { id: 'org.boundx.admin', required_elements: ['P'] }, packs: initial.packs });
    assert.equal(prepared.entries.filter(entry => entry.kind === 'employee').length, 3);
    const changed = createAcceptanceSetup(root, { changed: true });
    assert.equal(changed.host.registry.load(changed.packs[2]).payloads['employee-directory'].employees.find(employee => employee.employee_id === 'e104').status, 'inactive');
    assert.equal(initial.host.service.load(prepared.prepare_id).context_digest, prepared.context_digest);
    const other = createAcceptanceSetup(root, { tenant: 'tenant-b' });
    assert.equal(other.host.registry.load(other.packs[2]).payloads['employee-directory'].employees.length, 1);
    assert.throws(() => other.host.registry.load(initial.packs[2]), { code: 'TENANT' });
  } finally { rmSync(root, { recursive: true, force: true }); }
});
