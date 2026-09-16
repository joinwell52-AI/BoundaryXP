import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assert, parseProductJson, LIMITS } from './contracts.mjs';
import { parseEmployeeCsv } from './employees.mjs';
import { buildEmployeeDirectory } from './employee-builder.mjs';
import { encodeArchive, withArchiveBytes } from './archive.mjs';

export function employeeUiAction(registry, input) {
  const value = parseProductJson(JSON.stringify(input));
  const allowed = { preview: ['operation', 'csv'], build: ['operation', 'csv', 'name', 'version', 'l1', 'l2', 'roles_json'],
    import: ['operation', 'archive'], activate: ['operation', 'reference'] };
  assert(value && allowed[value.operation] && Object.keys(value).every(key => allowed[value.operation].includes(key)),
    'UI_INPUT', 'Invalid employee directory operation.');
  if (['preview', 'build'].includes(value.operation)) assert(typeof value.csv === 'string', 'UI_INPUT', 'CSV text is required.');
  if (value.operation === 'preview') return { directory: parseEmployeeCsv(value.csv), imported: false, activated: false };
  if (value.operation === 'activate') {
    assert(registry.load(value.reference).descriptor.boundx.layer === 'L3', 'UI_INPUT', 'This panel activates employee directories only.');
    registry.activate(value.reference);
    return { active: registry.active() };
  }
  if (value.operation === 'import') {
    assert(typeof value.archive === 'string' && value.archive.length <= Math.ceil(LIMITS.archive / 3) * 4,
      'ZIP_LIMIT', 'Invalid archive input.');
    const bytes = Buffer.from(value.archive, 'base64');
    assert(bytes.toString('base64') === value.archive, 'UI_INPUT', 'Archive must use canonical base64.');
    const reference = withArchiveBytes(bytes, directory => {
      const descriptor = parseProductJson(readFileSync(join(directory, 'datapackage.json')));
      assert(descriptor.boundx?.layer === 'L3', 'UI_INPUT', 'Import only an employee package in this panel.');
      return registry.importDirectory(directory);
    });
    return { reference, activated: false };
  }
  const temporary = mkdtempSync(join(tmpdir(), 'boundx-employee-ui-'));
  try {
    const built = buildEmployeeDirectory(registry, { csv: value.csv, name: value.name, version: value.version, l1: value.l1,
      ...(value.l2 ? { l2: value.l2 } : {}), roles: value.roles_json ? parseProductJson(value.roles_json) : {} }, join(temporary, 'package'));
    const archive = encodeArchive(new Map(['datapackage.json', 'employees.json'].map(path => [path, readFileSync(join(built.created, path))])));
    return { reference: built.reference, employees: built.employees, imported: false, activated: false, archive: archive.toString('base64') };
  } finally { rmSync(temporary, { recursive: true, force: true }); }
}
