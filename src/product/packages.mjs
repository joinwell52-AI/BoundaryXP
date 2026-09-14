import { readFileSync, readdirSync, lstatSync, realpathSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { digest } from '../bxp/index.mjs';
import { assert, IDS, LIMITS, parseProductJson, validateProduct } from './contracts.mjs';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function safeResourcePath(path) {
  assert(typeof path === 'string' && path.length > 0 && !/[\\:\x00-\x1f\x7f]/.test(path), 'UNSAFE_PATH', 'Unsafe resource path.');
  const parts = path.split('/');
  assert(parts.every(part => part && part !== '.' && part !== '..' && !/[. ]$/.test(part)
    && !/^(?:con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/i.test(part)), 'UNSAFE_PATH', 'Non-portable resource path.');
  return path;
}
function plainKeys(value, keys) {
  assert(value && !Array.isArray(value) && typeof value === 'object' && Object.keys(value).every(key => keys.includes(key)), 'PAYLOAD_SCHEMA', 'Unexpected payload fields.');
}
export function validateOntology(value) {
  plainKeys(value, ['schema', 'packId', 'version', 'operations', 'modalities', 'entityMetaTypes', 'roleMetaModel']);
  assert(value.schema === 'boundx-ontology/v1' && value.packId === 'core-ontology', 'PAYLOAD_SCHEMA', 'Invalid ontology identity.');
  assert(value.operations && value.modalities && Array.isArray(value.entityMetaTypes), 'PAYLOAD_SCHEMA', 'Missing ontology data.');
  for (const [operation, definition] of Object.entries(value.operations)) {
    assert(/^[A-Z_]+$/.test(operation), 'PAYLOAD_SCHEMA', 'Invalid operation ID.');
    plainKeys(definition, ['role', 'zh', 'en']);
    assert(typeof definition.role === 'string' && definition.role.length > 0, 'PAYLOAD_SCHEMA', 'Missing operation role.');
    for (const language of ['zh', 'en']) assert(Array.isArray(definition[language]) && definition[language].every(word => typeof word === 'string' && word.length > 0), 'PAYLOAD_SCHEMA', 'Invalid lexical aliases.');
  }
  for (const words of Object.values(value.modalities)) assert(Array.isArray(words) && words.every(word => typeof word === 'string' && word.length > 0), 'PAYLOAD_SCHEMA', 'Invalid modality aliases.');
  return value;
}
export function validateDirectory(directory) {
  assert(!lstatSync(directory).isSymbolicLink(), 'UNSAFE_PATH', 'Package root cannot be a link.');
  const root = realpathSync(directory);
  const files = new Map();
  let total = 0;
  function visit(folder, prefix = '') {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const path = prefix + entry.name;
      safeResourcePath(path);
      const absolute = resolve(folder, entry.name);
      const stat = lstatSync(absolute);
      assert(!stat.isSymbolicLink(), 'UNSAFE_PATH', 'Links are not package data.');
      if (stat.isDirectory()) { visit(absolute, path + '/'); continue; }
      assert(stat.isFile() && stat.nlink === 1, 'UNSAFE_PATH', 'Only ordinary unlinked files are supported.');
      assert(!relative(root, realpathSync(absolute)).startsWith('..' + sep), 'UNSAFE_PATH', 'Resource escaped package root.');
      assert(stat.size <= (path === 'datapackage.json' ? LIMITS.descriptor : LIMITS.file), 'INPUT_LIMIT', 'Resource exceeds size limit.');
      total += stat.size;
      assert(total <= LIMITS.expanded && files.size <= LIMITS.files, 'INPUT_LIMIT', 'Package exceeds aggregate limits.');
      assert(![...files.keys()].some(name => name.toLowerCase() === path.toLowerCase()), 'DUPLICATE_PATH', 'Case-insensitive path collision.');
      files.set(path, readFileSync(absolute));
    }
  }
  visit(root);
  assert(files.has('datapackage.json'), 'MISSING_DESCRIPTOR', 'Package root must contain datapackage.json.');
  const descriptor = validateProduct(IDS.pack, parseProductJson(files.get('datapackage.json'), LIMITS.descriptor));
  assert(files.size === descriptor.resources.length + 1, 'UNDECLARED_RESOURCE', 'All package files must be declared.');
  const payloads = {};
  for (const resource of descriptor.resources) {
    safeResourcePath(resource.path);
    assert(resource.path !== 'datapackage.json', 'SELF_REFERENCE', 'Descriptor cannot list itself.');
    const bytes = files.get(resource.path);
    assert(bytes && bytes.length === resource.bytes && 'sha256:' + sha256(bytes) === resource.hash, 'RESOURCE_DIGEST', 'Missing or modified resource.');
    const { kind, payload_schema: schema } = resource.boundx;
    if (kind === 'readme') {
      assert(resource.path === 'README.md' && resource.format === 'md' && schema === 'text/markdown', 'PAYLOAD_SCHEMA', 'Only declared README.md text is supported.');
      new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      continue;
    }
    assert(resource.path.endsWith('.json') && resource.format === 'json', 'PAYLOAD_SCHEMA', 'Semantic resources must be JSON.');
    const payload = parseProductJson(bytes);
    if (kind === 'ontology') {
      assert(schema === 'urn:boundx:product:ontology:v1' && descriptor.boundx.layer === 'L1', 'PAYLOAD_SCHEMA', 'Ontology resource identity mismatch.');
      validateOntology(payload);
    } else if (kind === 'employee-directory') {
      assert(schema === IDS.employee && descriptor.boundx.layer === 'L3', 'PAYLOAD_SCHEMA', 'Employee directory identity mismatch.');
      validateProduct(IDS.employee, payload);
    } else {
      assert(descriptor.boundx.layer === 'L2' && schema === `urn:boundx:product:domain-${kind}:v1`, 'UNKNOWN_SCHEMA', 'Unknown offline payload schema.');
      assert(payload.schema === `boundx-domain-${kind}/v1`, 'PAYLOAD_SCHEMA', 'Payload schema discriminator mismatch.');
    }
    if (kind !== 'employee-directory') assert(payload.packId === descriptor.name && payload.version === descriptor.version, 'PAYLOAD_IDENTITY', 'Payload and descriptor identity differ.');
    assert(!Object.hasOwn(payloads, kind), 'DUPLICATE_ID', 'Only one resource per semantic kind is supported.');
    payloads[kind] = payload;
  }
  if (descriptor.boundx.layer === 'L1') assert(payloads.ontology && descriptor.boundx.dependencies.length === 0, 'DEPENDENCY', 'L1 must be independent.');
  if (descriptor.boundx.layer === 'L3') assert(payloads['employee-directory'], 'PAYLOAD_SCHEMA', 'L3 requires its employee directory.');
  return { descriptor, digest: digest(descriptor), payloads };
}
