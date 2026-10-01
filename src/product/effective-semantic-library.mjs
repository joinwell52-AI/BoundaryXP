import { createHash } from 'node:crypto';
import { assert } from './contracts.mjs';
import { digest } from '../bxp/evaluate.mjs';
import { validateEnterpriseL3Profile, resolveEnterpriseAuthority } from './enterprise-l3-profile.mjs';

const stableDigest = value => digest(value);
const profileDigest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const itemCollections = Object.freeze({
  actions: pack => pack.payloads.actions?.frames ?? [],
  entities: pack => pack.payloads.entities?.entities ?? [],
  roles: pack => pack.payloads.roles?.roles ?? [],
  resources: pack => pack.payloads.resources?.resources ?? [],
  references: pack => pack.payloads.references?.references ?? [],
  completions: pack => pack.payloads.completions?.completions ?? [],
  boundaries: pack => pack.payloads.boundaries?.risks ?? [],
});

function retrievalText(item) {
  const terms = [];
  const collect = value => {
    if (typeof value === 'string' && value.trim()) terms.push(value.trim());
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  for (const field of ['id', 'label', 'title', 'description', 'aliases', 'triggers', 'assertions']) collect(item[field]);
  return [...new Set(terms)].join(' · ');
}

function layer(pack) {
  return pack?.descriptor?.boundx?.layer;
}

function descriptorIdentity(pack) {
  return {
    scope: pack.descriptor.boundx.scope,
    pack_id: pack.descriptor.name,
    version: pack.descriptor.version,
    digest: pack.digest,
  };
}

function ontologyEntries(pack) {
  const ontology = pack.payloads.ontology;
  if (!ontology) return [];
  const result = [];
  const add = (kind, id, definition, terms) => result.push({ kind, id, layer: 'L1',
    pack: descriptorIdentity(pack), digest: stableDigest(definition),
    retrieval_text: [...new Set([id, ...terms].filter(term => typeof term === 'string' && term.trim()))].join(' · ') });
  for (const [id, definition] of Object.entries(ontology.operations)) {
    add('ontology_operation', id, definition, [definition.role, ...definition.zh, ...definition.en]);
  }
  for (const [id, terms] of Object.entries(ontology.modalities)) add('ontology_modality', id, terms, terms);
  for (const id of ontology.entityMetaTypes) add('ontology_entity_type', id, id, []);
  for (const id of ontology.roleMetaModel.roleKinds) add('ontology_role_kind', id, id, []);
  for (const id of ontology.roleMetaModel.constraintAttributes) add('ontology_constraint_attribute', id, id, []);
  return result;
}

function exactDependency(pack, identity) {
  return pack.descriptor.boundx.dependencies?.some(dependency => dependency.scope === identity.scope
    && dependency.pack_id === identity.pack_id && dependency.version === identity.version && dependency.digest === identity.digest);
}

function exactSelectedDependencies(pack, identities) {
  const declared = pack.descriptor.boundx.dependencies;
  if (!Array.isArray(declared) || declared.length !== identities.length) return false;
  const selected = new Set(identities.map(stableDigest));
  const declaredDigests = declared.map(stableDigest);
  return new Set(declaredDigests).size === declaredDigests.length
    && declaredDigests.every(dependency => selected.has(dependency));
}

function validatedPack(pack, expectedLayer) {
  assert(pack && typeof pack === 'object' && typeof pack.digest === 'string' && pack.payloads && pack.descriptor,
    'SEMANTIC_LIBRARY_PACK_INVALID', 'Effective semantic library requires validated package results.');
  assert(layer(pack) === expectedLayer, 'SEMANTIC_LIBRARY_LAYER_INVALID', `Expected ${expectedLayer} package.`);
  return pack;
}

export function assembleEffectiveSemanticLibrary({ l1, l2 = [], l3 = null } = {}) {
  validatedPack(l1, 'L1');
  assert(Array.isArray(l2), 'SEMANTIC_LIBRARY_L2_INVALID', 'Selected L2 packages must be an array.');
  const selectedL2 = l2.map(pack => validatedPack(pack, 'L2'));
  const l1Identity = descriptorIdentity(l1);
  const identities = new Set();
  const selectedPackIds = new Set();
  for (const pack of selectedL2) {
    const identity = descriptorIdentity(pack);
    const key = JSON.stringify(identity);
    assert(!identities.has(key), 'SEMANTIC_LIBRARY_DUPLICATE_L2', 'Selected L2 package is duplicated.');
    identities.add(key);
    const packId = JSON.stringify([identity.scope, identity.pack_id]);
    assert(!selectedPackIds.has(packId), 'SEMANTIC_LIBRARY_L2_VERSION_CONFLICT',
      'Only one version and digest of each L2 package may be selected.');
    selectedPackIds.add(packId);
    assert(exactDependency(pack, l1Identity), 'SEMANTIC_LIBRARY_L1_BINDING_MISSING', 'L2 package is not bound to the effective L1 package.');
  }
  if (l3 !== null) {
    validatedPack(l3, 'L3');
    assert(exactDependency(l3, l1Identity), 'SEMANTIC_LIBRARY_L3_BINDING_MISSING', 'L3 package is not bound to effective L1.');
    for (const pack of selectedL2) assert(exactDependency(l3, descriptorIdentity(pack)),
      'SEMANTIC_LIBRARY_L3_BINDING_MISSING', 'L3 package is not bound to a selected L2 package.');
    assert(exactSelectedDependencies(l3, [l1Identity, ...selectedL2.map(descriptorIdentity)]),
    'SEMANTIC_LIBRARY_L3_BINDING_UNSELECTED', 'L3 package declares an unselected or duplicate dependency.');
    if (l3.payloads['enterprise-ontology'] || l3.payloads['enterprise-facts'])
      validateEnterpriseL3Profile(l3.payloads['enterprise-ontology'], l3.payloads['enterprise-facts'], l3.descriptor);
  }
  const entries = [], collisions = [], shadowed = [];
  const seen = new Map();
  entries.push(...ontologyEntries(l1));
  for (const pack of [l1, ...selectedL2, ...(l3 === null ? [] : [l3])]) for (const [kind, collect] of Object.entries(itemCollections)) for (const item of collect(pack)) {
    const entry = { kind, id: item.id, layer: layer(pack), pack: descriptorIdentity(pack), digest: stableDigest(item),
      retrieval_text: retrievalText(item) };
    const key = `${kind}:${item.id}`;
    const earlier = seen.get(key) ?? [];
    for (const previous of earlier) if (previous.digest !== entry.digest) {
      collisions.push({ kind, id: item.id, packs: [previous.pack, entry.pack] });
    }
    earlier.push(entry);
    seen.set(key, earlier);
    entries.push(entry);
  }
  for (const term of l3?.payloads['enterprise-ontology']?.terms ?? []) {
    const sourceEvidence = l3.payloads['enterprise-facts'].evidence.find(item => item.id === term.evidence_id);
    const entry = { kind: term.kind, id: term.id, layer: 'L3', pack: descriptorIdentity(l3),
      digest: stableDigest(term), retrieval_text: retrievalText(term), evidence_id: term.evidence_id,
      source: { source_id: sourceEvidence.source_id, source_sha256: sourceEvidence.source_sha256,
        start: sourceEvidence.start, end: sourceEvidence.end } };
    const sameIdentity = entries.filter(item => item.kind === term.kind && item.id === term.id);
    if (term.overrides) {
      assert(sameIdentity.length === 1 && digest(sameIdentity[0].pack) === digest(term.overrides),
        'SEMANTIC_LIBRARY_OVERRIDE_UNBOUND', 'Explicit L3 override must name exactly one selected source entry.');
      shadowed.push({ kind: term.kind, id: term.id, pack: sameIdentity[0].pack, replaced_by: entry.pack });
    } else if (sameIdentity.length) {
      for (const previous of sameIdentity) {
        collisions.push({ kind: term.kind, id: term.id, packs: [previous.pack, entry.pack] });
      }
    }
    entries.push(entry);
  }
  const library = {
    format: 'boundx-effective-semantic-library/experimental-v1',
    status: collisions.length ? 'conflicted' : 'assembled',
    l1: descriptorIdentity(l1),
    selected_l2: selectedL2.map(descriptorIdentity),
    l3: l3 === null ? null : descriptorIdentity(l3),
    entries: entries.filter(entry => !shadowed.some(item => item.kind === entry.kind && item.id === entry.id
      && digest(item.pack) === digest(entry.pack))),
    collisions,
    shadowed,
    authority: l3 === null
      ? { status: 'unavailable', reason: 'L3_NOT_SELECTED' }
      : l3.payloads['enterprise-ontology']
        ? { status: 'explicit_only', binding_count: l3.payloads['enterprise-facts'].authority_bindings.length,
          delegation_count: l3.payloads['enterprise-facts'].delegations.length, pack: descriptorIdentity(l3),
          ontology_digest: profileDigest(l3.payloads['enterprise-ontology']),
          facts_digest: profileDigest(l3.payloads['enterprise-facts']) }
        : { status: 'unavailable', reason: 'EXPLICIT_AUTHORITY_BINDINGS_NOT_IMPLEMENTED' },
    non_inference: ['Identity != JobTitle != Grade != Authority', 'No authority is inferred from role, grade, reporting line or package selection.'],
  };
  return { ...library, assembly_digest: digest(library) };
}

export function verifyEffectiveSemanticLibrary(library) {
  if (!library || typeof library !== 'object' || Array.isArray(library)
    || typeof library.assembly_digest !== 'string' || !/^[a-f0-9]{64}$/u.test(library.assembly_digest)) return false;
  const { assembly_digest, ...snapshot } = library;
  try { return assembly_digest === digest(snapshot); }
  catch { return false; }
}

export function assembleActiveSemanticLibrary(registry) {
  assert(registry && typeof registry.active === 'function' && typeof registry.load === 'function',
    'SEMANTIC_LIBRARY_REGISTRY_INVALID', 'A PackRegistry is required.');
  const active = registry.active();
  assert(Array.isArray(active), 'SEMANTIC_LIBRARY_SELECTION_INVALID', 'Active package references must be an array.');
  const core = active.filter(reference => layer(registry.load(reference)) === 'L1');
  return assembleSelectedSemanticLibrary(registry, core);
}

export function resolveEffectiveAuthority(library, selectedL3, query) {
  assert(library?.format === 'boundx-effective-semantic-library/experimental-v1'
    && library.status === 'assembled' && verifyEffectiveSemanticLibrary(library)
    && library.authority?.status === 'explicit_only'
    && selectedL3 && layer(selectedL3) === 'L3'
    && selectedL3.payloads?.['enterprise-ontology'] && selectedL3.payloads?.['enterprise-facts']
    && digest(library.l3) === digest(descriptorIdentity(selectedL3))
    && exactDependency(selectedL3, library.l1)
    && Array.isArray(library.selected_l2)
    && library.selected_l2.every(identity => exactDependency(selectedL3, identity))
    && exactSelectedDependencies(selectedL3, [library.l1, ...library.selected_l2])
    && library.authority.ontology_digest === profileDigest(selectedL3.payloads['enterprise-ontology'])
    && library.authority.facts_digest === profileDigest(selectedL3.payloads['enterprise-facts']),
  'SEMANTIC_LIBRARY_AUTHORITY_BINDING_INVALID', 'Authority profile must match the assembled L3 snapshot.');
  return resolveEnterpriseAuthority({ descriptor: selectedL3.descriptor,
    ontology: selectedL3.payloads['enterprise-ontology'], facts: selectedL3.payloads['enterprise-facts'] }, query);
}

export function assembleSelectedSemanticLibrary(registry, references) {
  assert(registry && typeof registry.active === 'function' && typeof registry.load === 'function',
    'SEMANTIC_LIBRARY_REGISTRY_INVALID', 'A PackRegistry is required.');
  assert(Array.isArray(references) && references.length <= 16, 'SEMANTIC_LIBRARY_SELECTION_INVALID',
    'Explicit bounded package references are required.');
  const active = registry.active();
  const selected = new Set();
  const packs = references.map(reference => {
    const identity = digest(reference);
    assert(!selected.has(identity) && active.some(item => digest(item) === identity),
      'SEMANTIC_LIBRARY_SELECTION_INVALID', 'Every selected package must be distinct and active.');
    selected.add(identity);
    const pack = registry.load(reference);
    assert(digest(descriptorIdentity(pack)) === identity, 'SEMANTIC_LIBRARY_SELECTION_INVALID',
      'Loaded package identity differs from the selected reference.');
    return pack;
  });
  const l1 = packs.filter(pack => layer(pack) === 'L1');
  const l2 = packs.filter(pack => layer(pack) === 'L2');
  const l3 = packs.filter(pack => layer(pack) === 'L3');
  assert(l1.length === 1, 'SEMANTIC_LIBRARY_L1_SELECTION_INVALID', 'Exactly one active L1 package is required.');
  assert(l3.length <= 1, 'SEMANTIC_LIBRARY_L3_SELECTION_INVALID', 'At most one active L3 package is supported.');
  return assembleEffectiveSemanticLibrary({ l1: l1[0], l2, l3: l3[0] ?? null });
}
