import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { digest } from '../bxp/index.mjs';
import { assert, parseProductJson, validateProduct, IDS, LIMITS } from './contracts.mjs';
import { validateDirectory } from './packages.mjs';
import { readBoundedFile } from './files.mjs';

const readDescriptor = path => validateProduct(IDS.pack, parseProductJson(readBoundedFile(path, LIMITS.descriptor), LIMITS.descriptor));

export const referenceOf = pack => ({ scope: pack.descriptor.boundx.scope, pack_id: pack.descriptor.name, version: pack.descriptor.version, digest: pack.digest });
const keyOf = reference => digest({ scope: reference.scope, pack_id: reference.pack_id, version: reference.version });
export class PackRegistry {
  constructor(root, tenant) {
    assert(/^[a-z0-9-]+$/.test(tenant), 'TENANT', 'Explicit local tenant is required.');
    this.root = resolve(root); this.tenant = tenant;
    mkdirSync(this.root, { recursive: true });
    assert(!lstatSync(this.root).isSymbolicLink(), 'UNSAFE_PATH', 'Registry cannot be a symbolic link.');
  }
  load(reference, seen = new Set()) {
    const key = keyOf(reference);
    assert(!seen.has(key), 'DEPENDENCY_CYCLE', 'Dependency cycle.');
    seen = new Set([...seen, key]);
    const directory = join(this.root, key);
    assert(existsSync(directory), 'DEPENDENCY', 'Package is not installed.');
    const descriptor = readDescriptor(join(directory, 'datapackage.json'));
    assert(descriptor.boundx.layer !== 'L3' || descriptor.boundx.tenant_id === this.tenant, 'TENANT', 'Other tenant directory is not accessible.');
    const dependencies = descriptor.boundx.dependencies.map(item => this.load(item, seen));
    const pack = validateDirectory(directory, dependencies);
    assert(keyOf(referenceOf(pack)) === key && pack.digest === reference.digest, 'PACKAGE_DIGEST', 'Installed identity or digest mismatch.');
    return pack;
  }
  importDirectory(directory) {
    const descriptor = readDescriptor(join(directory, 'datapackage.json'));
    assert(descriptor.boundx.layer !== 'L3' || descriptor.boundx.tenant_id === this.tenant, 'TENANT', 'Cannot import another tenant directory.');
    const dependencies = descriptor.boundx.dependencies.map(item => this.load(item));
    const pack = validateDirectory(directory, dependencies);
    const reference = referenceOf(pack);
    const destination = join(this.root, keyOf(reference));
    if (existsSync(destination)) { this.load(reference); return reference; }
    const temporary = join(this.root, '.staging-' + randomUUID());
    try {
      cpSync(directory, temporary, { recursive: true, errorOnExist: true, force: false });
      assert(validateDirectory(temporary, dependencies).digest === reference.digest, 'PACKAGE_DIGEST', 'Package changed during import.');
      renameSync(temporary, destination);
    } finally { if (existsSync(temporary)) rmSync(temporary, { recursive: true, force: true }); }
    return reference;
  }
  list() {
    const references = [];
    for (const entry of readdirSync(this.root, { withFileTypes: true })) {
      if (!/^[a-f0-9]{64}$/.test(entry.name) || !entry.isDirectory()) continue;
      const descriptor = readDescriptor(join(this.root, entry.name, 'datapackage.json'));
      if (descriptor.boundx.layer === 'L3' && descriptor.boundx.tenant_id !== this.tenant) continue;
      const reference = { scope: descriptor.boundx.scope, pack_id: descriptor.name, version: descriptor.version, digest: digest(descriptor) };
      assert(keyOf(reference) === entry.name, 'PACKAGE_DIGEST', 'Registry directory identity mismatch.');
      this.load(reference);
      references.push({ ...reference, layer: descriptor.boundx.layer });
    }
    return references;
  }
  active() {
    const path = join(this.root, `active-${this.tenant}.json`);
    return existsSync(path) ? parseProductJson(readFileSync(path)) : [];
  }
  activate(reference) {
    const pack = this.load(reference);
    const active = this.active();
    const dependencyKeys = new Set(pack.descriptor.boundx.dependencies.map(item => item.digest));
    assert([...dependencyKeys].every(hash => active.some(item => item.digest === hash)), 'DEPENDENCY', 'Dependencies must be explicitly activated first.');
    const next = active.filter(item => this.load(item).descriptor.boundx.layer !== pack.descriptor.boundx.layer);
    next.push(reference);
    for (const item of next) assert(this.load(item).descriptor.boundx.dependencies.every(dependency => next.some(value => value.digest === dependency.digest)), 'DEPENDENCY', 'Activation would invalidate an active dependent.');
    this.writeActive(next);
  }
  deactivate(reference) {
    const next = this.active().filter(item => keyOf(item) !== keyOf(reference));
    for (const item of next) assert(this.load(item).descriptor.boundx.dependencies.every(dependency => next.some(value => value.digest === dependency.digest)), 'DEPENDENCY', 'Deactivate dependents first.');
    this.writeActive(next);
  }
  writeActive(references) {
    const target = join(this.root, `active-${this.tenant}.json`);
    const temporary = join(this.root, '.active-' + randomUUID());
    try { writeFileSync(temporary, JSON.stringify(references), { flag: 'wx', encoding: 'utf8' }); renameSync(temporary, target); }
    finally { if (existsSync(temporary)) rmSync(temporary); }
  }
}
