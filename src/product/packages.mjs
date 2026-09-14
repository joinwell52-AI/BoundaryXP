import { readFileSync, readdirSync, lstatSync, realpathSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';
import { digest } from '../bxp/index.mjs';
import { assert, IDS, LIMITS, parseProductJson, validateProduct } from './contracts.mjs';
import { containsLexicalTerm } from './lexical.mjs';
import { validateDomainPayload } from './domain-payloads.mjs';

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
const actionValidator = new Ajv2020({ strict: true }).compile(JSON.parse(readFileSync(new URL('../../domain-packs/action-frame.schema.json', import.meta.url), 'utf8')));
export function validateDirectory(directory, dependencies = []) {
  assert(!lstatSync(directory).isSymbolicLink(), 'UNSAFE_PATH', 'Package root cannot be a link.');
  const root = realpathSync(directory);
  const files = new Map();
  let total = 0;
  let directories = 0;
  function visit(folder, prefix = '') {
    assert(++directories <= LIMITS.files && prefix.split('/').length <= LIMITS.depth, 'INPUT_LIMIT', 'Directory structure exceeds limits.');
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
      if (kind !== 'actions') validateDomainPayload(kind, payload);
    }
    if (kind !== 'employee-directory') assert(payload.packId === descriptor.name && payload.version === descriptor.version, 'PAYLOAD_IDENTITY', 'Payload and descriptor identity differ.');
    assert(!Object.hasOwn(payloads, kind), 'DUPLICATE_ID', 'Only one resource per semantic kind is supported.');
    payloads[kind] = payload;
  }
  if (descriptor.boundx.layer === 'L1') assert(payloads.ontology && descriptor.boundx.dependencies.length === 0, 'DEPENDENCY', 'L1 must be independent.');
  if (descriptor.boundx.layer === 'L3') assert(payloads['employee-directory'], 'PAYLOAD_SCHEMA', 'L3 requires its employee directory.');
  const result = { descriptor, digest: digest(descriptor), payloads };
  for (const reference of descriptor.boundx.dependencies) {
    assert(dependencies.some(pack => pack.descriptor.boundx.scope === reference.scope && pack.descriptor.name === reference.pack_id
      && pack.descriptor.version === reference.version && pack.digest === reference.digest && digest(pack.descriptor) === pack.digest), 'DEPENDENCY', 'Missing exact dependency snapshot.');
  }
  if (descriptor.boundx.layer === 'L3') {
    assert(descriptor.boundx.scope === descriptor.boundx.tenant_id, 'TENANT', 'Customer namespace must match its tenant.');
    const declared = dependencies.filter(pack => descriptor.boundx.dependencies.some(reference => reference.digest === pack.digest));
    assert(declared.filter(pack => pack.descriptor.boundx.layer === 'L1').length === 1
      && declared.every(pack => ['L1', 'L2'].includes(pack.descriptor.boundx.layer)), 'DEPENDENCY', 'Employee directory requires one L1 and optional L2.');
    for (const employee of payloads['employee-directory'].employees) if (employee.role_ref) {
      assert(!employee.role_ref.kind || employee.role_ref.kind === 'role', 'ROLE_REFERENCE', 'Employee role reference must identify a role.');
      const { entry_id, ...reference } = employee.role_ref;
      const industry = declared.find(pack => pack.descriptor.boundx.layer === 'L2'
        && pack.descriptor.boundx.scope === reference.scope && pack.descriptor.name === reference.pack_id
        && pack.descriptor.version === reference.version && pack.digest === reference.digest);
      assert(industry?.payloads.roles.roles.some(role => role.id === entry_id), 'ROLE_REFERENCE', 'Employee role must reference a locked declared L2 role.');
    }
  }
  if (descriptor.boundx.layer === 'L2') validateDomain(result, dependencies);
  return result;
}

function validateDomain(pack, dependencies) {
  const { descriptor, payloads } = pack;
  const ontology = dependencies.find(item => item.descriptor.boundx.layer === 'L1')?.payloads.ontology;
  assert(ontology && descriptor.boundx.dependencies.length === 1, 'DEPENDENCY', 'L2 requires exactly one L1.');
  assert(actionValidator(payloads.actions), 'PAYLOAD_SCHEMA', 'Invalid action frame structure.');
  const arrays = { actions: payloads.actions.frames, entities: payloads.entities?.entities, roles: payloads.roles?.roles,
    resources: payloads.resources?.resources, references: payloads.references?.references,
    completions: payloads.completions?.completions, boundaries: payloads.boundaries?.risks };
  for (const [kind, values] of Object.entries(arrays)) {
    assert(Array.isArray(values) && values.every(item => item && typeof item.id === 'string'), 'PAYLOAD_SCHEMA', `Missing ${kind} entries.`);
    assert(new Set(values.map(item => item.id)).size === values.length, 'DUPLICATE_ID', `Duplicate ${kind} ID.`);
    assert(descriptor.boundx.coverage?.[kind] === values.length, 'COVERAGE', `Stale ${kind} count.`);
  }
  const entityIds = new Set(arrays.entities.map(item => item.id));
  for (const entity of arrays.entities) assert(ontology.entityMetaTypes.includes(entity.coreType), 'UNKNOWN_REFERENCE', 'Unknown entity meta-type.');
  for (const frame of arrays.actions) {
    const operation = ontology.operations[frame.operation];
    const role = payloads.actions.roleContracts[frame.roleContract];
    const projection = payloads.actions.projectionContracts[frame.projectionContract];
    assert(operation && role?.operation === frame.operation && role.primaryRole === operation.role && projection?.operation === frame.operation, 'UNKNOWN_REFERENCE', 'Frame operation/role/projection mismatch.');
    assert(frame.entityTypes.every(id => entityIds.has(id)), 'UNKNOWN_REFERENCE', 'Unknown frame entity type.');
  }
  const frameIds = new Set(arrays.actions.map(item => item.id));
  for (const completion of arrays.completions) if (completion.actionId) assert(frameIds.has(completion.actionId), 'UNKNOWN_REFERENCE', 'Unknown completion action.');
  for (const risk of arrays.boundaries) assert(risk.decision === null && risk.becomesBOnlyWhen === 'explicit_FORBID_or_effective_policy_binding'
    && risk.frameIds.every(id => frameIds.has(id)), 'RISK_BOUNDARY', 'Risk cannot grant authority or invent B.');
  const triggers = new Map();
  for (const frame of arrays.actions) for (const trigger of [...frame.triggers.zh, ...frame.triggers.en]) {
    const normalized = trigger.trim().replace(/[A-Z]/g, char => char.toLowerCase());
    if (!triggers.has(normalized)) triggers.set(normalized, new Set());
    triggers.get(normalized).add(frame.id);
  }
  for (const [trigger, ids] of triggers) if (ids.size > 1) {
    const allowed = descriptor.boundx.allowed_ambiguous_triggers?.find(item => item.trigger === trigger);
    assert(allowed && allowed.frame_ids.length === ids.size && allowed.frame_ids.every(id => ids.has(id)), 'AMBIGUOUS_TRIGGER', 'Trigger collision is not explicitly declared.');
  }
}

export function matchActionCandidates(text, pack) {
  return pack.payloads.actions.frames.filter(frame => [...frame.triggers.zh, ...frame.triggers.en]
    .some(trigger => containsLexicalTerm(text, trigger))).map(frame => frame.id);
}
