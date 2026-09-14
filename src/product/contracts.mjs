import { readFileSync } from 'node:fs';
import Ajv from 'ajv';
import Ajv2020 from 'ajv/dist/2020.js';
import { taskSchema, parseStrictJson, digest } from '../bxp/index.mjs';
import { boundedJson } from '../bxp/validation.mjs';

export const LIMITS = Object.freeze({ archive: 10 * 1024 * 1024, expanded: 10 * 1024 * 1024,
  file: 2 * 1024 * 1024, descriptor: 256 * 1024, files: 64, employees: 2000,
  name: 128, aliases: 16, depth: 32, nodes: 100000, context: 64 * 1024 });
export const IDS = Object.freeze({ pack: 'urn:boundx:product:semantic-data-package:v1',
  employee: 'urn:boundx:product:employee-directory:v1', candidate: 'urn:boundx:product:extraction-candidate:v1', prepare: 'urn:boundx:product:prepare-input:v1' });
const text = (maxLength = 256) => ({ type: 'string', minLength: 1, maxLength });
const list = (items, maxItems = 128) => ({ type: 'array', maxItems, items });
const object = (properties, required = Object.keys(properties)) => ({ type: 'object', additionalProperties: false, required, properties });
const hash = { type: 'string', pattern: '^[a-f0-9]{64}$' };
const name = { type: 'string', pattern: '^[a-z0-9]+(?:[._-][a-z0-9]+)*$', maxLength: 128 };
const version = { type: 'string', pattern: '^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[a-z0-9.-]+)?$', maxLength: 64 };
export const packReference = object({ scope: name, pack_id: name, version, digest: hash });
export const ENTRY_KINDS = ['operation', 'modality', 'action', 'entity', 'role', 'resource', 'reference', 'completion', 'risk', 'employee'];
const entryReference = object({ ...packReference.properties, entry_id: text(), kind: { enum: ENTRY_KINDS } }, [...Object.keys(packReference.properties), 'entry_id']);
export const locatorSchema = object({ source_id: text(), quote: text(10000),
  prefix: { type: 'string', maxLength: 10000 }, suffix: { type: 'string', maxLength: 10000 } }, ['source_id', 'quote']);
const extension = { type: 'object', maxProperties: 16, propertyNames: { pattern: '^[a-z0-9-]+:[a-z0-9-]+$' },
  additionalProperties: { type: 'string', maxLength: 1024 } };
const resource = object({ name, path: text(), format: { enum: ['json', 'md'] }, encoding: { const: 'utf-8' },
  bytes: { type: 'integer', minimum: 0, maximum: LIMITS.file }, hash: { type: 'string', pattern: '^sha256:[a-f0-9]{64}$' },
  boundx: object({ kind: { enum: ['ontology', 'actions', 'entities', 'roles', 'resources', 'references', 'completions', 'boundaries', 'employee-directory', 'readme'] }, payload_schema: text() }) });
export const packSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#', $id: IDS.pack,
  ...object({ $schema: { const: IDS.pack }, name, version,
    id: { type: 'string', pattern: '^urn:uuid:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' },
    resources: { ...list(resource, LIMITS.files), minItems: 1 },
    boundx: object({ scope: name, layer: { enum: ['L1', 'L2', 'L3'] }, dependencies: list(packReference, 2),
      semantic_contract: { const: 'boundx-semantic-contract/v1' }, tenant_id: name,
      coverage: object(Object.fromEntries(['actions', 'entities', 'roles', 'resources', 'references', 'completions', 'boundaries'].map(key => [key, { type: 'integer', minimum: 0 }]))),
      allowed_ambiguous_triggers: list(object({ trigger: text(), frame_ids: { ...list(text(), 32), minItems: 2, uniqueItems: true } }), 128),
      origin: object({ source: text(1024), version: text(), digest: hash, migration: text(2048) }), extensions: extension },
    ['scope', 'layer', 'dependencies', 'semantic_contract', 'origin']) }, ['$schema', 'name', 'version', 'resources', 'boundx']),
  allOf: [{ if: { properties: { boundx: { properties: { layer: { const: 'L3' } } } } },
    then: { properties: { boundx: { required: ['tenant_id'] } } },
    else: { properties: { boundx: { not: { required: ['tenant_id'] } } } } }],
};
export const employeeSchema = { $schema: taskSchema.$schema, $id: IDS.employee,
  ...object({ schema: { const: 'boundx-employee-directory/v1' }, employees: list(object({
    employee_id: text(128), display_name: text(128), aliases: list(text(128), LIMITS.aliases),
    subject_type: { enum: ['human', 'agent'] }, job_title: text(128), status: { enum: ['active', 'inactive'] },
    role_ref: { anyOf: [entryReference, { type: 'null' }] }, department: text(128),
  }, ['employee_id', 'display_name', 'aliases', 'subject_type', 'job_title', 'status']), LIMITS.employees) }) };

const definitions = structuredClone(taskSchema.$defs);
definitions.span = locatorSchema;
delete definitions.entry.properties.normalized;
definitions.entry.properties.semantic_refs = list(entryReference, 16);
definitions.entry.properties.candidate_ids = { ...list(text(), 32), uniqueItems: true };
definitions.entry.properties.interpretation = text(2048);
const properties = taskSchema.properties;
export const prepareSchema = { $schema: taskSchema.$schema, $id: IDS.prepare,
  ...object({ source: structuredClone(properties.source), sources: structuredClone(properties.sources),
    profile: structuredClone(properties.profile), packs: { ...list(packReference, 3), minItems: 1, uniqueItems: true } }, ['source', 'profile', 'packs']),
  $defs: structuredClone(taskSchema.$defs),
};
export const candidateSchema = { $schema: taskSchema.$schema, $id: IDS.candidate,
  ...object({ schema: { const: 'boundx-extraction-candidate/v1' }, prepare_id: hash,
    source_digest: hash, context_digest: hash,
    elements: structuredClone(properties.elements), constraints: structuredClone(properties.constraints),
    scopes: structuredClone(properties.scopes),
    producer: object({ producer_kind: { enum: ['host-ai', 'structured-replay', 'labels-replay'] },
      adapter_version: version, model_id: text() }), clarifications: list(text(2048), 128),
  }, ['schema', 'prepare_id', 'source_digest', 'context_digest', 'elements', 'constraints', 'producer', 'clarifications']),
  $defs: definitions,
};

export class ProductError extends Error {
  constructor(code, message, details = []) { super(message); this.name = 'ProductError'; this.code = code; this.details = details; }
}
export function assert(condition, code, message) { if (!condition) throw new ProductError(code, message); }
export function parseProductJson(raw, byteLimit = LIMITS.file) {
  assert(typeof raw === 'string' || raw instanceof Uint8Array, 'JSON_INPUT', 'Expected UTF-8 bytes or JSON text.');
  const bytes = typeof raw === 'string' ? Buffer.byteLength(raw, 'utf8') : raw.byteLength;
  assert(bytes <= byteLimit, 'INPUT_LIMIT', 'Input exceeds the product limit.');
  let value;
  try { value = parseStrictJson(raw); } catch { throw new ProductError('STRICT_JSON', 'Invalid UTF-8, JSON, duplicate key, precision or structure.'); }
  const pending = [[value, 0]];
  let nodes = 0;
  while (pending.length) {
    const [current, depth] = pending.pop();
    assert(++nodes <= LIMITS.nodes && depth <= LIMITS.depth, 'STRUCTURE_LIMIT', 'Product JSON structure exceeds the limit.');
    if (current && typeof current === 'object') for (const child of Object.values(current)) pending.push([child, depth + 1]);
  }
  return value;
}
const options = { strict: false, allErrors: false, coerceTypes: false, useDefaults: false, removeAdditional: false, validateFormats: false };
const draft7 = new Ajv(options);
const draft2020 = new Ajv2020(options);
const upstream = JSON.parse(readFileSync(new URL('../../vendor/datapackage-2.0/datapackage.json', import.meta.url), 'utf8'));
const validateUpstream = draft7.compile(upstream);
const validators = new Map([[IDS.pack, draft7.compile(packSchema)], [IDS.employee, draft2020.compile(employeeSchema)],
  [IDS.candidate, draft2020.compile(candidateSchema)], [IDS.prepare, draft2020.compile(prepareSchema)]]);
export function validateProduct(id, input) {
  assert(boundedJson(input), 'JSON_INPUT', 'Expected bounded plain JSON data without accessors or non-finite values.');
  const value = parseProductJson(JSON.stringify(input), id === IDS.pack ? LIMITS.descriptor : LIMITS.file);
  const validator = validators.get(id);
  assert(validator, 'UNKNOWN_SCHEMA', 'Schema is not in the offline product registry.');
  if (!validator(value)) throw new ProductError('PRODUCT_SCHEMA', 'Product structure does not match its contract.', structuredClone(validator.errors));
  if (id === IDS.pack) {
    assert(validateUpstream(value), 'DATA_PACKAGE_SCHEMA', 'Descriptor violates the pinned Data Package 2.0 profile.');
    const paths = value.resources.map(item => item.path);
    assert(new Set(paths.map(item => item.toLowerCase())).size === paths.length, 'DUPLICATE_PATH', 'Resource paths must be unique, including case.');
    assert(paths.every((path, index) => !index || paths[index - 1] < path), 'RESOURCE_ORDER', 'Resource paths must be POSIX-sorted.');
    assert(new Set(value.resources.map(item => item.name)).size === paths.length, 'DUPLICATE_ID', 'Resource names must be unique.');
  }
  if (id === IDS.employee) {
    const ids = value.employees.map(item => item.employee_id);
    assert(new Set(ids).size === ids.length, 'DUPLICATE_ID', 'Employee IDs must be unique.');
    for (const employee of value.employees) {
      for (const item of [employee.employee_id, employee.display_name, employee.job_title, ...employee.aliases]) {
        assert(item.trim().length > 0, 'EMPTY_NAME', 'Names and aliases cannot be whitespace only.');
      }
    }
  }
  return value;
}
export function contractDigests() {
  return Object.fromEntries([packSchema, employeeSchema, candidateSchema, prepareSchema].map(schema => [schema.$id, digest(schema)]));
}
