import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { parseProductJson, assert } from './contracts.mjs';
import { validateDirectory } from './packages.mjs';
import { employeeTemplate } from './employees.mjs';
import { createProductHost } from './host.mjs';
import { readBoundedFile } from './files.mjs';

export function productCommand(args) {
  const host = createProductHost();
  if (args[0] === 'pack') {
    if (args[1] === 'list' && args.length === 2) return host.invoke('bx_list_semantic_packs');
    if (args[1] === 'template' && args[2] === 'employee-directory' && args.length === 4) {
      mkdirSync(args[3], { recursive: true });
      writeFileSync(join(args[3], 'employees.csv'), employeeTemplate(), { flag: 'wx', encoding: 'utf8' });
      return { created: join(args[3], 'employees.csv') };
    }
    if (args[1] === 'import' && args.length === 3) return host.registry.importDirectory(args[2]);
    if (args[1] === 'validate' && args.length === 3) {
      const descriptor = parseProductJson(readBoundedFile(join(args[2], 'datapackage.json')));
      const pack = validateDirectory(args[2], descriptor.boundx.dependencies.map(reference => host.registry.load(reference)));
      return { valid: true, digest: pack.digest };
    }
    if (['activate', 'deactivate'].includes(args[1]) && args.length === 3) {
      const reference = host.registry.list().find(item => `${item.scope}/${item.pack_id}@${item.version}` === args[2]);
      assert(reference, 'PACKAGE_MISSING', 'Select an installed scope/id@version.');
      const { layer, ...identity } = reference;
      host.registry[args[1]](identity);
      return { active: host.registry.active() };
    }
  }
  if (args[0] === 'prepare' && args.length === 4 && args[2] === '--packs') {
    const selected = args[3].split(',').map(name => {
      const reference = host.registry.active().find(item => `${item.scope}/${item.pack_id}@${item.version}` === name);
      assert(reference, 'PACK_INACTIVE', 'Pack must be explicitly active.'); return reference;
    });
    const bytes = readBoundedFile(args[1]);
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
    return host.invoke('bx_prepare_admin_task', { source: { text, language: 'mixed' },
      profile: { id: 'org.boundx.admin', required_elements: [...CORE_ELEMENTS] }, packs: selected });
  }
  if (args[0] === 'evaluate-candidate' && args.length === 3) {
    const prepare = parseProductJson(readBoundedFile(args[1]));
    const candidate = parseProductJson(readBoundedFile(args[2]));
    assert(candidate.prepare_id === prepare.prepare_id, 'PREPARE_ID', 'Candidate references another prepare.');
    const output = host.invoke('bx_evaluate_admin_candidate', { candidate });
    if (!output.computed) process.exitCode = 1;
    return output;
  }
  throw new Error('Product usage: bx pack list|import|validate|activate|deactivate | bx pack template employee-directory <dir> | bx prepare <task.txt> --packs <scope/id@version,...> | bx evaluate-candidate <prepare.json> <candidate.json>. ZIP/build are not yet delivered.');
}
