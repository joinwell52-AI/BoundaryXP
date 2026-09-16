import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { PackRegistry } from '../product/registry.mjs';
import { buildEmployeeDirectory } from '../product/employee-builder.mjs';
import { employeeTemplate } from '../product/employees.mjs';

const repository = fileURLToPath(new URL('../../', import.meta.url));
const directory = { schema: 'boundx-employee-directory/v1', employees: [{ employee_id: 'custom-01', display_name: 'Local One', aliases: [],
  subject_type: 'human', job_title: 'Custom research position', status: 'inactive', role_ref: null }] };

test('employee builder preserves custom jobs and maps only explicitly selected locked roles', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-employees-'));
  try {
    const registry = new PackRegistry(join(root, 'registry'), 'tenant-a');
    const l1 = registry.importDirectory(join(repository, 'domain-packs/l1/core-ontology'));
    const l2 = registry.importDirectory(join(repository, 'domain-packs/l2/software-ai/0.2.0'));
    const base = { directory, name: 'my-team', version: '0.1.0', l1 };
    const result = buildEmployeeDirectory(registry, base, join(root, 'unmapped'));
    assert.equal(result.imported, false); assert.equal(result.activated, false);
    const unmapped = JSON.parse(readFileSync(join(result.created, 'employees.json'), 'utf8'));
    assert.deepEqual(unmapped, directory);
    assert.throws(() => buildEmployeeDirectory(registry, base, result.created), { code: 'OUTPUT_EXISTS' });
    const mapped = buildEmployeeDirectory(registry, { ...base, version: '0.2.0', l2, roles: { 'custom-01': 'software-engineer' } }, join(root, 'mapped'));
    const reference = registry.importDirectory(mapped.created);
    const employee = registry.load(reference).payloads['employee-directory'].employees[0];
    assert.equal(employee.role_ref.digest, l2.digest);
    assert.equal(employee.job_title, directory.employees[0].job_title);
    assert.equal(employee.status, 'inactive');
    assert.deepEqual(registry.active(), []);
    const bad = join(root, 'bad');
    assert.throws(() => buildEmployeeDirectory(registry, { ...base, l2, roles: { 'custom-01': 'invented-role' } }, bad), { code: 'ROLE_REFERENCE' });
    assert.equal(existsSync(bad), false);
    const forged = structuredClone(directory);
    forged.employees[0].role_ref = { ...l2, entry_id: 'invented-role' };
    assert.throws(() => buildEmployeeDirectory(registry, { ...base, l2, directory: forged }, bad), { code: 'ROLE_REFERENCE' });
    assert.equal(existsSync(bad), false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('CLI creates a new employee package from CSV without requiring typed digests or Python', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-employee-cli-'));
  try {
    const registry = new PackRegistry(join(root, 'registry'), 'tenant-a');
    registry.importDirectory(join(repository, 'domain-packs/l1/core-ontology'));
    const input = join(root, 'employees.csv');
    writeFileSync(input, employeeTemplate() + 'staff-01,Example,[],human,Custom,active,\r\n');
    const child = spawnSync(process.execPath, [join(repository, 'cli.mjs'), 'pack', 'create-employees', input, '--name', 'my-team',
      '--version', '0.1.0', '--l1', 'boundx/core-ontology@1.1.0', '--output', join(root, 'team')],
    { encoding: 'utf8', env: { ...process.env, BOUNDX_DATA_DIR: registry.root, BOUNDX_TENANT: 'tenant-a' } });
    assert.equal(child.status, 0, child.stderr);
    assert.equal(JSON.parse(child.stdout).employees, 1);
    assert.deepEqual(registry.active(), []);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
