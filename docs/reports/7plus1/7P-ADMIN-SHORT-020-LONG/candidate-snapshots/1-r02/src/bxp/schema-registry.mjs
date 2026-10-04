import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

const files = {
  task: 'boundx-task-v1.schema.json',
  result: 'boundx-result-v1.schema.json',
  suite: 'boundx-calc-conformance-suite-v1.schema.json',
  semantic_ir: 'boundx-semantic-ir-experimental-v1.schema.json',
  formalization_input: 'boundx-formalization-input-experimental-v1.schema.json',
  formal_model: 'boundx-formal-model-experimental-v1.schema.json',
  boundary_profile: 'boundx-boundary-profile-experimental-v1.schema.json',
  typed_boundary: 'boundx-typed-boundary-experimental-v1.schema.json',
  interpretation_selection: 'boundx-interpretation-selection-experimental-v1.schema.json',
  release_profile: 'boundx-release-profile-experimental-v1.schema.json',
  admission_assessment: 'boundx-admission-assessment-experimental-v1.schema.json',
  downstream_observations: 'boundx-downstream-observations-experimental-v1.schema.json',
  semantic_resource_manifest: 'boundx-semantic-resource-manifest-experimental-v1.schema.json',
};
const schemas = Object.fromEntries(Object.entries(files).map(([name, file]) => [name,
  JSON.parse(readFileSync(new URL(`../../protocol/schemas/${file}`, import.meta.url), 'utf8'))]));
const bindingSchema = schemas.formalization_input;
const absoluteReferences = value => {
  if (Array.isArray(value)) return value.map(absoluteReferences);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
    key === '$ref' && item.startsWith('#') ? `${bindingSchema.$id}${item}` : absoluteReferences(item)]));
};
schemas.compiled_node = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'urn:boundx:implementation:compiled-node:experimental-v1',
  oneOf: bindingSchema.properties.bindings.items.oneOf.map(reference => {
    const branch = absoluteReferences(bindingSchema.$defs[reference.$ref.split('/').at(-1)]);
    Object.assign(branch.properties, {
      slot: { enum: ['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B'] },
      scope_id: { type: 'string', minLength: 1, maxLength: 256 },
      evidence: { $ref: `${schemas.semantic_ir.$id}#/$defs/evidence` },
      semantic_equivalence: { const: 'producer_asserted_not_proven' },
    });
    branch.required.push('slot', 'scope_id', 'evidence', 'semantic_equivalence');
    if (branch.properties.formula) {
      branch.properties.effective_formula = structuredClone(branch.properties.formula);
      branch.required.push('effective_formula');
    }
    if (branch.properties.operator.const === 'relation') {
      branch.properties.relation_status = { enum: ['resolved', 'unresolved'] };
      branch.required.push('relation_status');
    }
    return branch;
  }),
};
const validator = new Ajv2020({ strict: true, allErrors: false, coerceTypes: false, useDefaults: false, removeAdditional: false });
for (const schema of Object.values(schemas)) validator.addSchema(schema);

export function registeredSchema(name) {
  if (!Object.hasOwn(schemas, name)) throw new TypeError('Unknown schema contract');
  return structuredClone(schemas[name]);
}

export function registeredValidator(name) {
  if (!Object.hasOwn(schemas, name)) throw new TypeError('Unknown schema contract');
  return validator.getSchema(schemas[name].$id);
}

export function contractInventory() {
  return Object.entries(schemas).map(([name, schema]) => ({ name, schema_id: schema.$id,
    protocol_version: schema.properties?.protocol_version?.const ?? null,
    protocol_target: schema.properties?.protocol_target?.const ?? null,
    implementation_status: ['task', 'result', 'suite'].includes(name) ? 'existing_wire_contract' : 'experimental_contract',
    bxp_04_conformance: false }));
}
