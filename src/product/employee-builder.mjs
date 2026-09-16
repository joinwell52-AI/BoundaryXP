import { existsSync, mkdirSync, mkdtempSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { IDS, assert, validateProduct, parseProductJson } from './contracts.mjs';
import { parseEmployeeCsv } from './employees.mjs';
import { sha256, validateDirectory } from './packages.mjs';
import { referenceOf } from './registry.mjs';

export function buildEmployeeDirectory(registry, input, output) {
  const value = parseProductJson(JSON.stringify(input));
  assert(value && Object.keys(value).every(key => ['csv', 'directory', 'name', 'version', 'l1', 'l2', 'roles'].includes(key))
    && (typeof value.csv === 'string') !== Object.hasOwn(value, 'directory'), 'EMPLOYEE_BUILD', 'Provide CSV or employee JSON, not both.');
  const directory = typeof value.csv === 'string' ? parseEmployeeCsv(value.csv) : validateProduct(IDS.employee, value.directory);
  const dependencies = [registry.load(value.l1), ...(value.l2 ? [registry.load(value.l2)] : [])];
  assert(dependencies[0].descriptor.boundx.layer === 'L1' && (!dependencies[1] || dependencies[1].descriptor.boundx.layer === 'L2'),
    'DEPENDENCY', 'Choose a local L1 and optional local L2.');
  assert(!dependencies[1] || dependencies[1].descriptor.boundx.dependencies.every(reference => reference.digest === dependencies[0].digest),
    'DEPENDENCY', 'Selected industry and L1 must share the same locked dependency.');
  const mappings = value.roles ?? {};
  assert(mappings && typeof mappings === 'object' && !Array.isArray(mappings), 'ROLE_REFERENCE', 'Role mapping must be employee ID to role ID or null.');
  for (const [employee_id, role_id] of Object.entries(mappings)) {
    const employee = directory.employees.find(item => item.employee_id === employee_id);
    assert(employee && (role_id === null || typeof role_id === 'string'), 'ROLE_REFERENCE', 'Unknown employee or invalid role mapping.');
    if (role_id === null) employee.role_ref = null;
    else {
      assert(dependencies[1]?.payloads.roles.roles.some(role => role.id === role_id), 'ROLE_REFERENCE', 'Role ID is not in the selected industry package.');
      employee.role_ref = { ...referenceOf(dependencies[1]), entry_id: role_id };
    }
  }
  validateProduct(IDS.employee, directory);
  const payload = Buffer.from(JSON.stringify(directory, null, 2) + '\n', 'utf8');
  const descriptor = validateProduct(IDS.pack, { $schema: IDS.pack, name: value.name, version: value.version,
    resources: [{ name: 'employees', path: 'employees.json', format: 'json', encoding: 'utf-8', bytes: payload.length,
      hash: 'sha256:' + sha256(payload), boundx: { kind: 'employee-directory', payload_schema: IDS.employee } }],
    boundx: { scope: registry.tenant, tenant_id: registry.tenant, layer: 'L3', dependencies: dependencies.map(referenceOf),
      semantic_contract: 'boundx-semantic-contract/v1', origin: { source: 'local customer input', version: value.version,
        digest: sha256(payload), migration: 'Explicit local employee-directory build; no inferred roles or authority.' } } });
  const destination = resolve(output);
  assert(!existsSync(destination), 'OUTPUT_EXISTS', 'Directory already exists; choose a new version/output.');
  mkdirSync(dirname(destination), { recursive: true });
  const temporary = mkdtempSync(join(dirname(destination), '.boundx-employees-'));
  try {
    writeFileSync(join(temporary, 'employees.json'), payload, { flag: 'wx' });
    writeFileSync(join(temporary, 'datapackage.json'), JSON.stringify(descriptor, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
    const pack = validateDirectory(temporary, dependencies);
    assert(!existsSync(destination), 'OUTPUT_EXISTS', 'Output was created concurrently.');
    renameSync(temporary, destination);
    return { created: destination, reference: referenceOf(pack), employees: directory.employees.length, imported: false, activated: false };
  } finally { if (existsSync(temporary)) rmSync(temporary, { recursive: true, force: true }); }
}
