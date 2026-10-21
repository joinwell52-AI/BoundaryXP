import { createHash } from 'node:crypto';
import { assert } from './contracts.mjs';

const identifier = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/;
const utcInstant = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function fields(value, required, optional = []) {
  assert(value && typeof value === 'object' && !Array.isArray(value)
    && required.every(key => Object.hasOwn(value, key))
    && Object.keys(value).every(key => required.includes(key) || optional.includes(key)),
  'ENTERPRISE_L3_SCHEMA', 'Enterprise L3 fields are invalid.');
}

function id(value) {
  assert(typeof value === 'string' && identifier.test(value), 'ENTERPRISE_L3_SCHEMA', 'Enterprise L3 identifier is invalid.');
}

function instant(value) {
  assert(typeof value === 'string' && utcInstant.test(value) && Number.isFinite(Date.parse(value))
    && new Date(Date.parse(value)).toISOString().startsWith(value.slice(0, 19)),
  'ENTERPRISE_L3_SCHEMA', 'Enterprise L3 instant must be UTC.');
}

function interval(value) {
  fields(value, ['from', 'until']);
  instant(value.from);
  instant(value.until);
  assert(Date.parse(value.from) < Date.parse(value.until), 'ENTERPRISE_L3_SCHEMA', 'Enterprise L3 interval is empty.');
}

function uniqueEntries(entries, kind) {
  assert(Array.isArray(entries) && entries.length <= 2000, 'ENTERPRISE_L3_SCHEMA', `${kind} must be bounded.`);
  const seen = new Set();
  for (const entry of entries) {
    id(entry.id);
    assert(!seen.has(entry.id), 'ENTERPRISE_L3_DUPLICATE', `Duplicate ${kind} identity.`);
    seen.add(entry.id);
  }
}

function nonOverlapping(entries, identity) {
  const byIdentity = new Map();
  for (const entry of entries) {
    const key = identity(entry);
    if (!byIdentity.has(key)) byIdentity.set(key, []);
    byIdentity.get(key).push(entry);
  }
  for (const group of byIdentity.values()) {
    group.sort((left, right) => Date.parse(left.validity.from) - Date.parse(right.validity.from));
    for (let index = 1; index < group.length; index++) assert(
      Date.parse(group[index - 1].validity.until) <= Date.parse(group[index].validity.from),
      'ENTERPRISE_L3_CONFLICT', 'Overlapping enterprise authority assertions require explicit adjudication.');
  }
}

export function validateEnterpriseL3Profile(ontology, facts, descriptor) {
  fields(ontology, ['schema', 'packId', 'version', 'actions', 'scopes'], ['terms']);
  fields(facts, ['schema', 'packId', 'version', 'subjects', 'sources', 'evidence', 'authority_bindings', 'delegations']);
  assert(ontology.schema === 'boundx-enterprise-ontology/experimental-v1'
    && facts.schema === 'boundx-enterprise-facts/experimental-v1'
    && ontology.packId === descriptor.name && facts.packId === descriptor.name
    && ontology.version === descriptor.version && facts.version === descriptor.version,
  'ENTERPRISE_L3_IDENTITY', 'Enterprise L3 ontology and facts must share the package identity.');
  uniqueEntries(ontology.actions, 'action');
  uniqueEntries(ontology.scopes, 'scope');
  if (ontology.terms !== undefined) {
    uniqueEntries(ontology.terms, 'term');
    for (const term of ontology.terms) {
      fields(term, ['id', 'kind', 'description', 'evidence_id'], ['overrides']);
      assert(['actions', 'entities', 'roles', 'resources', 'references', 'completions', 'boundaries'].includes(term.kind)
        && typeof term.description === 'string' && term.description.trim().length > 0
        && term.description.length <= 4096,
      'ENTERPRISE_L3_SCHEMA', 'Enterprise L3 term is invalid.');
      if (term.overrides !== undefined) {
        fields(term.overrides, ['scope', 'pack_id', 'version', 'digest']);
        for (const key of ['scope', 'pack_id', 'version']) id(term.overrides[key]);
        assert(typeof term.overrides.digest === 'string' && /^[a-f0-9]{64}$/.test(term.overrides.digest),
          'ENTERPRISE_L3_SCHEMA', 'Enterprise L3 override reference is invalid.');
      }
    }
  }
  uniqueEntries(facts.subjects, 'subject');
  uniqueEntries(facts.sources, 'source');
  uniqueEntries(facts.evidence, 'evidence');
  uniqueEntries(facts.authority_bindings, 'authority binding');
  uniqueEntries(facts.delegations, 'delegation');
  const actions = new Set(ontology.actions.map(item => item.id));
  const scopes = new Set(ontology.scopes.map(item => item.id));
  const subjects = new Set(facts.subjects.map(item => item.id));
  const sources = new Map();
  for (const source of facts.sources) {
    fields(source, ['id', 'text', 'sha256']);
    assert(typeof source.text === 'string' && Buffer.byteLength(source.text, 'utf8') <= 1024 * 1024
      && typeof source.sha256 === 'string'
      && createHash('sha256').update(source.text, 'utf8').digest('hex') === source.sha256,
    'ENTERPRISE_L3_EVIDENCE', 'Enterprise L3 source bytes do not match the declared digest.');
    sources.set(source.id, source);
  }
  const evidence = new Set(facts.evidence.map(item => item.id));
  for (const term of ontology.terms ?? []) assert(evidence.has(term.evidence_id),
    'ENTERPRISE_L3_EVIDENCE', 'Enterprise L3 term lacks source evidence.');
  for (const source of facts.evidence) {
    fields(source, ['id', 'source_id', 'source_sha256', 'start', 'end', 'quote']);
    id(source.source_id);
    const original = sources.get(source.source_id);
    assert(original && source.source_sha256 === original.sha256
      && Number.isSafeInteger(source.start) && source.start >= 0
      && Number.isSafeInteger(source.end) && source.end > source.start
      && source.end <= [...original.text].length
      && typeof source.quote === 'string'
      && [...original.text].slice(source.start, source.end).join('') === source.quote,
    'ENTERPRISE_L3_EVIDENCE', 'Enterprise L3 evidence locator is invalid.');
  }
  for (const item of ontology.actions) fields(item, ['id']);
  for (const item of ontology.scopes) fields(item, ['id']);
  for (const subject of facts.subjects) {
    fields(subject, ['id'], ['job_title', 'grade', 'manager_id']);
    for (const key of ['job_title', 'grade', 'manager_id']) if (Object.hasOwn(subject, key)) id(subject[key]);
  }
  for (const subject of facts.subjects) if (subject.manager_id) assert(subjects.has(subject.manager_id),
    'ENTERPRISE_L3_REFERENCE', 'Unknown manager identity.');
  for (const binding of facts.authority_bindings) {
    fields(binding, ['id', 'subject_id', 'action_id', 'scope_id', 'validity', 'evidence_id']);
    assert(subjects.has(binding.subject_id) && actions.has(binding.action_id) && scopes.has(binding.scope_id),
      'ENTERPRISE_L3_REFERENCE', 'Authority binding references an unknown identity.');
    assert(evidence.has(binding.evidence_id), 'ENTERPRISE_L3_EVIDENCE', 'Authority binding lacks declared evidence.');
    interval(binding.validity);
  }
  for (const delegation of facts.delegations) {
    fields(delegation, ['id', 'from_subject_id', 'to_subject_id', 'action_id', 'scope_id', 'validity', 'evidence_id']);
    assert(subjects.has(delegation.from_subject_id) && subjects.has(delegation.to_subject_id)
      && actions.has(delegation.action_id) && scopes.has(delegation.scope_id)
      && delegation.from_subject_id !== delegation.to_subject_id,
    'ENTERPRISE_L3_REFERENCE', 'Delegation references an unknown or identical identity.');
    assert(evidence.has(delegation.evidence_id), 'ENTERPRISE_L3_EVIDENCE', 'Delegation lacks declared evidence.');
    interval(delegation.validity);
  }
  nonOverlapping(facts.authority_bindings, item => `${item.subject_id}\0${item.action_id}\0${item.scope_id}`);
  nonOverlapping(facts.delegations, item => `${item.to_subject_id}\0${item.action_id}\0${item.scope_id}`);
  return { ontology, facts };
}

export function resolveEnterpriseAuthority(profile, { subject_id, action_id, scope_id, at }) {
  const { ontology, facts } = profile;
  validateEnterpriseL3Profile(ontology, facts, profile.descriptor);
  id(subject_id); id(action_id); id(scope_id); instant(at);
  const within = validity => Date.parse(validity.from) <= Date.parse(at) && Date.parse(at) < Date.parse(validity.until);
  const binding = facts.authority_bindings.find(item => item.subject_id === subject_id
    && item.action_id === action_id && item.scope_id === scope_id && within(item.validity));
  if (binding) return { status: 'bound', source: 'explicit_authority_binding', binding_id: binding.id,
    evidence_id: binding.evidence_id, evidence: facts.evidence.find(item => item.id === binding.evidence_id) };
  const delegation = facts.delegations.find(item => item.to_subject_id === subject_id
    && item.action_id === action_id && item.scope_id === scope_id && within(item.validity)
    && facts.authority_bindings.some(grant => grant.subject_id === item.from_subject_id
      && grant.action_id === action_id && grant.scope_id === scope_id
      && Date.parse(grant.validity.from) <= Date.parse(item.validity.from)
      && Date.parse(grant.validity.until) >= Date.parse(item.validity.until)
      && within(grant.validity)));
  if (delegation) {
    const grant = facts.authority_bindings.find(item => item.subject_id === delegation.from_subject_id
      && item.action_id === action_id && item.scope_id === scope_id
      && Date.parse(item.validity.from) <= Date.parse(delegation.validity.from)
      && Date.parse(item.validity.until) >= Date.parse(delegation.validity.until));
    return { status: 'bound', source: 'valid_delegation', binding_id: grant.id,
      delegation_id: delegation.id, evidence_id: delegation.evidence_id,
      evidence: facts.evidence.find(item => item.id === delegation.evidence_id),
      binding_evidence: facts.evidence.find(item => item.id === grant.evidence_id) };
  }
  return { status: 'unavailable', reason: 'NO_EXPLICIT_AUTHORITY_BINDING_OR_VALID_DELEGATION' };
}
