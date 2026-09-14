import { mkdirSync, writeFileSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { parseProductJson, assert } from './contracts.mjs';
import { validateDirectory, sha256 } from './packages.mjs';
import { employeeTemplate } from './employees.mjs';
import { createProductHost } from './host.mjs';
import { readBoundedFile } from './files.mjs';
import { encodeArchive, withArchive } from './archive.mjs';
import { buildEmployeeDirectory } from './employee-builder.mjs';

export function productCommand(args) {
  const host = createProductHost({ initializeDefaults: args[0] !== 'pack' });
  if (args[0] === 'pack') {
    if (args[1] === 'create-employees' && args.length >= 11) {
      const options = {};
      for (let index = 3; index < args.length; index += 2) {
        const key = args[index];
        assert(['--name', '--version', '--l1', '--l2', '--roles', '--output'].includes(key)
          && !Object.hasOwn(options, key) && typeof args[index + 1] === 'string', 'CLI_ARGUMENTS', 'Invalid or repeated employee build option.');
        options[key] = args[index + 1];
      }
      assert(['--name', '--version', '--l1', '--output'].every(key => options[key]), 'CLI_ARGUMENTS', 'Name, version, L1 and output are required.');
      const select = name => {
        const installed = host.registry.list().find(item => `${item.scope}/${item.pack_id}@${item.version}` === name);
        assert(installed, 'DEPENDENCY', 'Install the selected dependency first.');
        const { layer, ...reference } = installed; return reference;
      };
      const raw = readBoundedFile(args[2]);
      const input = args[2].toLowerCase().endsWith('.csv')
        ? { csv: new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(raw) } : { directory: parseProductJson(raw) };
      return buildEmployeeDirectory(host.registry, { ...input, name: options['--name'], version: options['--version'], l1: select(options['--l1']),
        ...(options['--l2'] ? { l2: select(options['--l2']) } : {}),
        ...(options['--roles'] ? { roles: parseProductJson(readBoundedFile(options['--roles'])) } : {}) }, options['--output']);
    }
    if (args[1] === 'list' && args.length === 2) return host.invoke('bx_list_semantic_packs');
    if (args[1] === 'template' && args[2] === 'employee-directory' && args.length === 4) {
      mkdirSync(args[3], { recursive: true });
      writeFileSync(join(args[3], 'employees.csv'), employeeTemplate(), { flag: 'wx', encoding: 'utf8' });
      return { created: join(args[3], 'employees.csv') };
    }
    if (args[1] === 'build' && args.length === 5 && args[3] === '--output') {
      const descriptor = parseProductJson(readBoundedFile(join(args[2], 'datapackage.json')));
      const pack = validateDirectory(args[2], descriptor.boundx.dependencies.map(reference => host.registry.load(reference)));
      const files = new Map([['datapackage.json', Buffer.from(JSON.stringify(pack.descriptor), 'utf8')]]);
      for (const resource of pack.descriptor.resources) {
        const bytes = readBoundedFile(join(args[2], resource.path));
        assert(bytes.length === resource.bytes && 'sha256:' + sha256(bytes) === resource.hash, 'RESOURCE_DIGEST', 'Resource changed during build.');
        files.set(resource.path, bytes);
      }
      const archive = encodeArchive(files);
      writeFileSync(args[4], archive, { flag: 'wx' });
      return { created: args[4], digest: pack.digest };
    }
    if (args[1] === 'import' && args.length === 3) return lstatSync(args[2]).isDirectory()
      ? host.registry.importDirectory(args[2]) : withArchive(args[2], directory => host.registry.importDirectory(directory));
    if (args[1] === 'validate' && args.length === 3) {
      const validate = directory => {
        const descriptor = parseProductJson(readBoundedFile(join(directory, 'datapackage.json')));
        const pack = validateDirectory(directory, descriptor.boundx.dependencies.map(reference => host.registry.load(reference)));
        return { valid: true, digest: pack.digest };
      };
      return lstatSync(args[2]).isDirectory() ? validate(args[2]) : withArchive(args[2], validate);
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
  throw new Error('Product usage: bx pack list|import|validate|activate|deactivate | bx pack build <dir> --output <file.zip> | bx pack template employee-directory <dir> | bx prepare <task.txt> --packs <scope/id@version,...> | bx evaluate-candidate <prepare.json> <candidate.json>.');
}
