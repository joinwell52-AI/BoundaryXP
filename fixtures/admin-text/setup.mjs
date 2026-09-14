import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { createProductHost } from '../../src/product/host.mjs';
import { buildEmployeeDirectory } from '../../src/product/employee-builder.mjs';

export function createAcceptanceSetup(root, { tenant = 'tenant-a', changed = false } = {}) {
  if (!['tenant-a', 'tenant-b'].includes(tenant)) throw Error('Unsupported fixture tenant');
  const host = createProductHost({ root: join(root, 'registry'), tenant, allowDirectoryDisclosure: true });
  const l1 = host.registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology/', import.meta.url)));
  host.registry.activate(l1);
  const l2 = host.registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l2/software-ai/0.2.0/', import.meta.url)));
  host.registry.activate(l2);
  const directory = JSON.parse(readFileSync(new URL('../../examples/semantic-packs/tenant-a/0.1.0/employees.json', import.meta.url), 'utf8'));
  const roles = { 'dev-01': 'software-engineer', 'qa-01': 'qa-engineer', 'pm-01': null, 'ops-01': 'sre',
    e101: 'software-engineer', e102: 'qa-engineer', e103: null, e104: null };
  if (tenant === 'tenant-b') {
    directory.employees = [{ employee_id: 'b101', display_name: '王北', aliases: ['小王', 'Xiao Wang'], subject_type: 'human',
      job_title: '客户自定义岗位', status: 'active', role_ref: null }];
  } else if (changed) directory.employees.find(employee => employee.employee_id === 'e104').status = 'inactive';
  const version = changed ? '0.2.0' : '0.1.0';
  const output = join(root, 'generated', tenant, version);
  buildEmployeeDirectory(host.registry, { directory, roles: tenant === 'tenant-a' ? roles : { b101: null },
    name: 'example-team', version, l1, l2 }, output);
  const l3 = host.registry.importDirectory(output);
  host.registry.activate(l3);
  return { host, packs: [l1, l2, l3], snapshot_time: '2026-09-14T00:00:00Z' };
}
