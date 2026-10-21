import { compileSemanticIr } from './semantic-ir-compiler.mjs';
import { boundedJson } from './validation.mjs';
import { digest } from './evaluate.mjs';
import { registeredValidator } from './schema-registry.mjs';
import { parseStrictJson } from './raw-json.mjs';
import { canonicalizeTypedInterpretation } from './typed-interpretations.mjs';

const validateProfile = registeredValidator('boundary_profile');
const validateBoundarySchema = registeredValidator('typed_boundary');
const validateSelection = registeredValidator('interpretation_selection');

export function validateTypedBoundaryStructure(boundary) {
  if (!boundedJson(boundary) || !validateBoundarySchema(boundary)) return false;
  if (boundary.state === 'invalid') return boundary.provenance === null;
  if (boundary.provenance === null) return false;
  const { boundary_profile: profile, boundary_profile_digest: profileDigest } = boundary.provenance;
  if (profile === null ? profileDigest !== null : digest(profile) !== profileDigest) return false;
  if (boundary.state === 'inconsistent') return boundary.conflicts.length > 0;
  if (boundary.conflicts.length) return false;
  return boundary.state !== 'determined' || (boundary.gaps.length === 0 && profile !== null
    && boundary.interpretation_resolution?.status === 'selected_canonical_boundary'
    && digest(boundary.interpretation_resolution.canonical_boundary) === boundary.interpretation_resolution.canonical_digest);
}

export function parseAndEvaluateTypedBoundary(raw, profile = null) {
  let input;
  try { input = parseStrictJson(raw); } catch { return evaluateTypedBoundary(undefined, profile); }
  return evaluateTypedBoundary(input, profile);
}

export function createTypedBoundaryEvaluator(profile = null, trustedSelection = null, observePhase = null) {
  if (observePhase !== null && typeof observePhase !== 'function') throw new TypeError('Invalid phase observer');
  if (profile !== null && (!boundedJson(profile) || !validateProfile(profile))) {
    throw new TypeError('Invalid trusted boundary profile');
  }
  const pinnedProfile = profile === null ? null : structuredClone(profile);
  if (trustedSelection !== null && (!boundedJson(trustedSelection) || !validateSelection(trustedSelection))) {
    throw new TypeError('Invalid trusted interpretation selection');
  }
  const pinnedSelection = trustedSelection === null ? null : structuredClone(trustedSelection);
  return request => evaluateTypedBoundary(request, pinnedProfile, pinnedSelection, observePhase);
}

export function evaluateTypedBoundary(request, profile = null, trustedSelection = null, observePhase = null) {
  const validRequest = boundedJson(request) && request && typeof request === 'object' && !Array.isArray(request)
    && Object.keys(request).length === 2 && Object.hasOwn(request, 'ir') && Object.hasOwn(request, 'formalization');
  const compilation = compileSemanticIr(validRequest ? request.ir : undefined, validRequest ? request.formalization : undefined, observePhase);
  observePhase?.('boundary_result');
  const profileValid = profile === null || (boundedJson(profile) && validateProfile(profile));
  const valid = compilation.status !== 'invalid' && profileValid;
  const requiredElements = profileValid && profile ? new Set(profile.required_elements) : null;
  const conflicts = [];
  const conflict = (code, calculation, nodeIds) => conflicts.push({ code, scope_id: calculation.scope_id,
    node_ids: [...nodeIds], evidence: structuredClone(calculation.evidence), calculation: structuredClone(calculation) });
  if (valid) {
    for (const calculation of compilation.calculations) {
      if (calculation.status === 'evaluated' && calculation.result.result === 'unsatisfiable') {
        conflict('BOOLEAN_CONJUNCTION_UNSATISFIABLE', calculation, calculation.node_ids);
      }
    }
    for (const calculation of compilation.interval_calculations) {
      if (calculation.empty) conflict('INTERVAL_INTERSECTION_EMPTY', calculation, calculation.constraint_ids);
    }
    for (const calculation of compilation.dependency_calculations) {
      if (calculation.status === 'evaluated' && calculation.result.cycles.length) {
        conflict('MANDATORY_PREREQUISITE_CYCLE', calculation, calculation.node_ids);
      }
    }
    for (const calculation of compilation.target_calculations) {
      if (calculation.confirmed_overlap.length) conflict('FORBIDDEN_TARGET_OVERLAP',
        { ...calculation, evidence: calculation.confirmed_evidence }, calculation.confirmed_node_ids);
    }
    for (const calculation of compilation.allowed_calculations) {
      if (calculation.confirmed_outside.length) conflict('REQUEST_OUTSIDE_ALLOWED_SET',
        { ...calculation, evidence: calculation.confirmed_evidence }, calculation.confirmed_node_ids);
    }
    for (const calculation of compilation.handoff_calculations) {
      if (calculation.result === 'deficit') conflict('HANDOFF_INPUT_DEFICIT', calculation, calculation.node_ids);
    }
    for (const calculation of compilation.artifact_calculations) {
      if (calculation.confirmed_conflict) conflict('ARTIFACT_PRESENCE_CONFLICT',
        { ...calculation, evidence: calculation.confirmed_evidence }, calculation.confirmed_node_ids);
    }
  }
  const nodes = compilation.model?.nodes ?? [];
  const select = operators => structuredClone(nodes.filter(node => operators.includes(node.operator)));
  const canonical = valid && trustedSelection !== null ? canonicalizeTypedInterpretation(request) : null;
  const selectionValid = trustedSelection !== null && boundedJson(trustedSelection) && validateSelection(trustedSelection);
  const selected = selectionValid && canonical?.status === 'canonicalized'
    && trustedSelection.task_id === request.ir.task_id && trustedSelection.task_revision === request.ir.task_revision
    && trustedSelection.ir_digest === compilation.model.ir_digest
    && trustedSelection.formalization_inputs_digest === compilation.model.formalization_inputs_digest
    && trustedSelection.canonical_boundary_digest === canonical.canonical_digest;
  const gaps = valid ? [
    ...Object.entries(request.ir.elements).filter(([slot, bucket]) => bucket.coverage !== 'assessed'
      || bucket.status === 'unresolved' || (bucket.status === 'absent' && (!requiredElements || requiredElements.has(slot))))
      .map(([slot, bucket]) => ({ code: 'SLOT_DETERMINATION_NOT_ESTABLISHED', slot, status: bucket.status, coverage: bucket.coverage })),
    ...request.ir.scopes.filter(scope => scope.status !== 'resolved').map(scope => ({ code: 'SCOPE_UNRESOLVED', scope_id: scope.id })),
    ...compilation.model.uncompiled_entries.map(entry => ({ code: 'ENTRY_NOT_COMPILED', ...structuredClone(entry) })),
    ...structuredClone(compilation.diagnostics),
    ...(!selected ? [{ code: trustedSelection === null ? 'BOUNDARY_INTERPRETATION_UNIQUENESS_NOT_ESTABLISHED'
      : 'INTERPRETATION_SELECTION_NOT_APPLICABLE' }] : []),
    ...(profile === null ? [{ code: 'ACTIVE_BOUNDARY_PROFILE_MISSING' }] : []),
  ] : [...structuredClone(compilation.diagnostics), ...(!profileValid ? [{ code: 'BOUNDARY_PROFILE_INVALID' }] : [])];
  const boundary = {
    format: 'boundx-typed-boundary/experimental-v1', protocol_target: '0.4.0-draft.1',
    state: !valid ? 'invalid' : conflicts.length ? 'inconsistent' : gaps.length ? 'underdetermined' : 'determined',
    evaluation_basis: 'submitted_explicit_formalization_only',
    required: [...select(['obligation']), ...structuredClone(nodes.filter(node => node.operator === 'artifact_state' && node.presence === 'present'))],
    allowed: select(['allowed_set']),
    forbidden: [...select(['prohibition', 'target_set']), ...structuredClone(nodes.filter(node => node.operator === 'artifact_state' && node.presence === 'absent'))],
    limits: select(['interval', 'constraint']), completion: [...select(['completion']), ...structuredClone(nodes.filter(node => node.operator === 'artifact_state' && node.slot === 'C'))],
    relations: select(['entity', 'relation']),
    dependencies: structuredClone(nodes.filter(node => node.operator === 'handoff' || (node.operator === 'relation'
      && ['depends_on', 'prerequisite', 'references'].includes(node.relation)))),
    conflicts, gaps,
    provenance: valid ? { task_id: request.ir.task_id, task_revision: request.ir.task_revision,
      source_digests: request.ir.sources.map(source => ({ id: source.id, sha256: source.sha256 })),
      ir_digest: compilation.model.ir_digest, model_digest: compilation.model_digest,
      formalization_inputs_digest: compilation.model.formalization_inputs_digest,
      boundary_profile: profile === null ? null : structuredClone(profile),
      boundary_profile_digest: profile === null ? null : digest(profile),
      compiler: 'boundx.typed-ir-compiler/experimental-v1' } : null,
    source_interpretation_correctness: 'not_proven',
    ...(trustedSelection !== null ? { interpretation_resolution: {
      status: selected ? 'selected_canonical_boundary' : 'not_established',
      selection_digest: selectionValid ? digest(trustedSelection) : null,
      canonical_digest: selected ? canonical.canonical_digest : null,
      canonical_boundary: selected ? canonical.canonical : null,
      authority_basis: 'trusted_host_selection_not_client_claim',
    } } : {}),
    business_decision: null, execution_authorization: null,
  };
  return { format: 'boundx-typed-analysis/experimental-v1', compilation,
    boundary_result: boundary, boundary_digest: digest(boundary),
    admission: { status: 'blocked', reason: !valid ? 'INPUT_INVALID' : conflicts.length ? 'MODEL_INCONSISTENT'
      : boundary.state === 'determined' ? 'RELEASE_PROFILE_MISSING' : 'BOUNDARY_UNDERDETERMINED',
      profile_evaluation: 'not_evaluated_profile_missing',
      boundary_profile_status: !profileValid ? 'invalid' : profile === null ? 'missing' : 'validated',
      business_decision: null, execution_authorization: null },
    business_decision: null, execution_authorization: null };
}
