import Ajv2020 from 'ajv/dist/2020.js';
import { assert } from './contracts.mjs';

const text = { type: 'string', minLength: 1, maxLength: 4096 };
const words = { type: 'array', maxItems: 2048, items: text };
const aliases = { anyOf: [words, { type: 'object', additionalProperties: false, required: ['zh', 'en'], properties: { zh: words, en: words } }] };
const label = { anyOf: [text, { type: 'object', additionalProperties: false, required: ['zh-CN', 'en'], properties: { 'zh-CN': text, en: text } }] };
const shapes = {
  entities: { aliases, extensions: words, coreType: text },
  roles: { aliases, coreType: text, allowedCategories: words, applicableActionCategories: words,
    nonAuthorityDeclaration: { const: 'A role profile is not an authorization grant.' }, authoritySemantics: { const: 'candidate_only_policy_evidence_required' } },
  resources: { aliases, valueKind: text, valueType: { enum: ['number', 'integer', 'string', 'boolean'] }, unit: text, units: words, field: { const: 'R' }, evidenceRule: { const: 'explicit_metric_and_bound_required' } },
  references: { aliases, category: text, identifiers: words, field: { const: 'V' }, evidenceRule: { const: 'explicit_reference_and_identifier_required' },
    validity: { const: 'mention_does_not_establish_authenticity_or_effective_status' } },
  completions: { assertions: words, actionId: text, assertionType: { const: 'explicit_evidence' }, evidenceTypes: words, field: { const: 'C' }, evidenceRule: { const: 'explicit_completion_binding_required' },
    caveat: { const: 'state_mention_is_not_whole_task_completion_without_scope_binding' } },
  boundaries: { frameIds: words, category: text, severity: { enum: ['low', 'medium', 'high', 'critical'] }, field: { const: 'B' },
    becomesBOnlyWhen: { const: 'explicit_FORBID_or_effective_policy_binding' }, fallback: { const: 'risk_candidate_needs_human_review' }, decision: { type: 'null' } },
};
const ajv = new Ajv2020({ strict: true });
const requiredFields = {
  entities: [['aliases', 'coreType']],
  roles: [['aliases', 'coreType', 'allowedCategories', 'authoritySemantics'], ['aliases', 'applicableActionCategories', 'nonAuthorityDeclaration']],
  resources: [['aliases', 'valueKind', 'units', 'field', 'evidenceRule'], ['valueType', 'unit']],
  references: [['aliases', 'identifiers', 'field', 'evidenceRule', 'validity'], ['category']],
  completions: [['assertions', 'evidenceTypes', 'field', 'evidenceRule', 'caveat'], ['actionId', 'assertionType']],
  boundaries: [['frameIds', 'decision', 'becomesBOnlyWhen']],
};
const validators = new Map(Object.entries(shapes).map(([kind, fields]) => {
  const array = kind === 'boundaries' ? 'risks' : kind;
  const properties = { id: text, label, ...fields };
  return [kind, ajv.compile({ type: 'object', additionalProperties: false, required: ['schema', 'packId', 'version', array],
    properties: { schema: { const: `boundx-domain-${kind}/v1` }, packId: text, version: text,
      [array]: { type: 'array', maxItems: 10000, items: { type: 'object', additionalProperties: false, required: ['id', 'label'], properties,
        anyOf: requiredFields[kind].map(required => ({ required, properties: Object.fromEntries(required.map(field => [field, fields[field]])) })) } } } })];
}));

export function validateDomainPayload(kind, value) {
  const validate = validators.get(kind);
  assert(validate?.(value), 'PAYLOAD_SCHEMA', `Invalid ${kind} payload structure.`);
  return value;
}
