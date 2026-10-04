import { digest, sourceDigest } from './evaluate.mjs';
import { boundedJson } from './validation.mjs';

const format = 'boundx-admission-binding/experimental-v1';
const protocol = '0.4.0-draft.1';
const fields = ['protocol_version', 'profile', 'source', 'ir', 'formalization_inputs', 'formal_model',
  'formalizer', 'operator_profile', 'boundary', 'computed_boundary', 'selection', 'semantic_packs'];

function record(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function identity(value) {
  return record(value) && typeof value.id === 'string' && value.id.trim().length > 0
    && typeof value.version === 'string' && value.version.trim().length > 0;
}

function exactFields(value, names) {
  return record(value) && Object.keys(value).length === names.length
    && names.every(name => Object.hasOwn(value, name));
}

function sha256(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

function boundComponent(value) {
  return exactFields(value, ['id', 'version', 'digest']) && identity(value) && sha256(value.digest);
}

function validComponents(value) {
  const digests = ['source_digest', 'source_text_digest', 'ir_digest', 'formal_model_digest', 'boundary_digest',
    'computed_boundary_digest', 'selection_digest'];
  const identities = ['profile', 'formalizer', 'operator_profile'];
  return exactFields(value, ['protocol_version', ...digests, ...identities, 'semantic_packs'])
    && value.protocol_version === protocol
    && digests.every(field => sha256(value[field]))
    && identities.every(field => boundComponent(value[field]))
    && exactFields(value.semantic_packs, ['l1', 'l2', 'l3'])
    && boundComponent(value.semantic_packs.l1)
    && ['l2', 'l3'].every(layer => value.semantic_packs[layer] === null || boundComponent(value.semantic_packs[layer]));
}

function component(value) {
  if (!identity(value) || !Object.hasOwn(value, 'content') || value.content === null) {
    throw Error('Binding component requires identity, version and exact content');
  }
  return { id: value.id, version: value.version, digest: digest(value) };
}

export function createAdmissionBinding(snapshot) {
  if (!boundedJson(snapshot) || !record(snapshot) || Object.keys(snapshot).length !== fields.length
    || fields.some(field => !Object.hasOwn(snapshot, field))) throw Error('Incomplete binding snapshot');
  if (snapshot.protocol_version !== protocol) throw Error('Unsupported binding protocol; no implicit upgrade');
  if (!record(snapshot.source) || typeof snapshot.source.text !== 'string' || !snapshot.source.text.trim()
    || typeof snapshot.source.language !== 'string' || !snapshot.source.language) throw Error('Invalid binding source');
  for (const field of ['ir', 'formalization_inputs', 'formal_model', 'boundary', 'computed_boundary', 'selection']) {
    if (!record(snapshot[field])) throw Error(`Invalid binding ${field}`);
  }
  const packs = snapshot.semantic_packs;
  if (!record(packs) || Object.keys(packs).length !== 3
    || ['l1', 'l2', 'l3'].some(layer => !Object.hasOwn(packs, layer))) throw Error('Explicit L1/L2/L3 binding required');
  const components = {
    protocol_version: snapshot.protocol_version,
    profile: component(snapshot.profile),
    source_digest: digest(snapshot.source),
    source_text_digest: sourceDigest(snapshot.source.text),
    ir_digest: digest({ ir: snapshot.ir, formalization_inputs: snapshot.formalization_inputs }),
    formal_model_digest: digest(snapshot.formal_model),
    formalizer: component(snapshot.formalizer),
    operator_profile: component(snapshot.operator_profile),
    boundary_digest: digest(snapshot.boundary),
    computed_boundary_digest: digest(snapshot.computed_boundary),
    selection_digest: digest(snapshot.selection),
    semantic_packs: Object.fromEntries(['l1', 'l2', 'l3'].map(layer => [layer,
      packs[layer] === null && layer !== 'l1' ? null : component(packs[layer])])),
  };
  return { format, components, binding_digest: digest({ format, components }) };
}

export function checkAdmissionBinding(stored, currentSnapshot) {
  const result = (status, reason, changed_components = []) => ({ status, reason, changed_components,
    admission: null, business_decision: null, execution_authorization: null });
  if (stored == null) return result('missing', 'NO_STORED_BINDING');
  if (!boundedJson(stored) || !record(stored) || Object.keys(stored).length !== 3
    || stored.format !== format || !validComponents(stored.components)
    || stored.binding_digest !== digest({ format: stored.format, components: stored.components })) {
    return result('invalid', 'STORED_BINDING_INVALID');
  }
  let current;
  try { current = createAdmissionBinding(currentSnapshot); }
  catch { return result('invalid', 'CURRENT_SNAPSHOT_INVALID'); }
  if (current.binding_digest === stored.binding_digest) return result('matched', 'EXACT_BINDING_MATCH_ONLY');
  const changed = Object.keys(current.components).filter(key => !Object.hasOwn(stored.components, key)
    || digest(current.components[key]) !== digest(stored.components[key]));
  return result('stale', 'BINDING_MISMATCH', changed);
}
