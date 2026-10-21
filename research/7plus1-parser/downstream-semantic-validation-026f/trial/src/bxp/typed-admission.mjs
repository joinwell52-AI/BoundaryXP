import { boundedJson } from './validation.mjs';
import { registeredValidator } from './schema-registry.mjs';
import { evaluateTypedBoundary } from './typed-boundary.mjs';
import { createAdmissionBinding, checkAdmissionBinding } from './admission-binding.mjs';
import { evaluateReleaseConditions } from './admission-assessment.mjs';
import { evaluateScopeGauge } from './scope-gauge.mjs';
import { buildTypedEvidenceArtifacts } from '../product/typed-evidence-artifacts.mjs';

const validateProfile = registeredValidator('release_profile');
const validateAdmission = registeredValidator('admission_assessment');
const exact = (value, fields) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === fields.length && fields.every(field => Object.hasOwn(value, field));

export function evaluateTypedAdmission(input) {
  const result = (reasons, analysis = null, snapshot = null, bindingCandidate = null, binding = null) => {
    const admission = { format: 'boundx-admission-assessment/experimental-v1', status: reasons.length ? 'blocked' : 'admitted',
      reasons, boundary_state: snapshot?.computed_boundary?.state ?? analysis?.boundary_result.state ?? null, binding,
      business_decision: null, execution_authorization: null };
    if (!validateAdmission(admission)) return {
      format: 'boundx-typed-release-evaluation/experimental-v1', analysis: null, snapshot: null, binding_candidate: null,
      admission: { format: 'boundx-admission-assessment/experimental-v1', status: 'blocked', reasons: ['ADMISSION_RESULT_CONTRACT_INVALID'],
        boundary_state: null, binding: null, business_decision: null, execution_authorization: null },
      release_observations: null,
      business_decision: null, execution_authorization: null,
    };
    return {
      format: 'boundx-typed-release-evaluation/experimental-v1', analysis, snapshot, binding_candidate: bindingCandidate,
      admission, release_observations: boundedJson(input?.release_observations)
        ? structuredClone(input.release_observations) : null,
      business_decision: null, execution_authorization: null,
    };
  };
  if (!boundedJson(input) || !exact(input, ['request', 'context', 'selection', 'release_observations', 'stored_binding'])
    || !exact(input.context, ['profile', 'formalizer', 'operator_profile', 'semantic_packs'])) {
    return result(['TYPED_ADMISSION_INPUT_INVALID']);
  }
  const { context } = input;
  if (!validateProfile(context.profile?.content) || context.profile.id !== context.profile.content.id
    || context.profile.version !== context.profile.content.version) return result(['RELEASE_PROFILE_NOT_ESTABLISHED']);
  const analysis = evaluateTypedBoundary(input.request, context.profile.content.boundary_profile, input.selection);
  if (analysis.boundary_result.state === 'invalid') return result(['PROTOCOL_VALIDITY_NOT_ESTABLISHED'], analysis);
  let scopeGauge;
  try {
    scopeGauge = evaluateScopeGauge({ request: input.request, ...buildTypedEvidenceArtifacts(input.request) },
      context.profile.content.boundary_profile, input.selection);
  } catch { return result(['SCOPE_GAUGE_UNAVAILABLE'], analysis); }
  const taskSource = input.request.ir.sources.find(source => source.role === 'task');
  const snapshot = { protocol_version: '0.4.0-draft.1', profile: structuredClone(context.profile),
    source: { text: taskSource.text, language: taskSource.language,
      context_sources: structuredClone(input.request.ir.sources.filter(source => source.role !== 'task')) },
    ir: structuredClone(input.request.ir), formalization_inputs: structuredClone(input.request.formalization),
    formal_model: structuredClone(analysis.compilation.model), boundary: structuredClone(analysis.boundary_result),
    computed_boundary: structuredClone(scopeGauge.computed_boundary), selection: structuredClone(input.selection),
    formalizer: structuredClone(context.formalizer), operator_profile: structuredClone(context.operator_profile),
    semantic_packs: structuredClone(context.semantic_packs) };
  let bindingCandidate;
  try { bindingCandidate = createAdmissionBinding(snapshot); }
  catch { return result(['RUNTIME_BINDING_CONTEXT_INVALID'], analysis); }
  const reasons = analysis.boundary_result.state === 'determined' ? [] : [`BOUNDARY_${analysis.boundary_result.state.toUpperCase()}`];
  if (scopeGauge.computed_boundary.state !== 'determined') reasons.push(`COMPUTED_BOUNDARY_${scopeGauge.computed_boundary.state.toUpperCase()}`);
  reasons.push(...evaluateReleaseConditions(snapshot, input.release_observations));
  const binding = checkAdmissionBinding(input.stored_binding, snapshot);
  if (binding.status !== 'matched') reasons.push(`VERSION_BINDING_${binding.status.toUpperCase()}`);
  return result(reasons, analysis, snapshot, bindingCandidate, binding);
}
