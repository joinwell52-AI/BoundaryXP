import { boundedJson } from './validation.mjs';
import { digest } from './evaluate.mjs';
import { classifyBoundaryAssessment } from './boundary-assessment.mjs';
import { checkAdmissionBinding } from './admission-binding.mjs';

export const ADMISSION_ASSESSMENT_FORMAT = 'boundx-admission-assessment/experimental-v1';
const fields = ['protocol_valid', 'boundary_assessment', 'release_conditions', 'snapshot', 'stored_binding'];

function record(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function exactFields(value, names) {
  return record(value) && Object.keys(value).length === names.length
    && names.every(name => Object.hasOwn(value, name));
}

function conditionIds(value) {
  return Array.isArray(value) && value.length <= 256
    && value.every(id => typeof id === 'string' && id.trim().length > 0)
    && new Set(value).size === value.length;
}

export function evaluateReleaseConditions(snapshot, observations) {
  const required = snapshot.profile?.content?.release_conditions;
  if (!conditionIds(required)) return ['RELEASE_PROFILE_NOT_ESTABLISHED'];
  if (!Array.isArray(observations) || observations.length > 256
    || observations.some(item => !exactFields(item, ['id', 'satisfied'])
      || typeof item.id !== 'string' || ![true, false, null].includes(item.satisfied))
    || new Set(observations.map(item => item.id)).size !== observations.length) {
    return ['RELEASE_OBSERVATIONS_INVALID'];
  }
  const observed = new Map(observations.map(item => [item.id, item.satisfied]));
  const reasons = observations.filter(item => !required.includes(item.id))
    .map(item => `RELEASE_CONDITION_UNDECLARED:${item.id}`);
  for (const id of required) {
    if (observed.get(id) !== true) reasons.push(`RELEASE_CONDITION_NOT_SATISFIED:${id}`);
  }
  return reasons;
}

export function assessAdmission(input) {
  const response = (reasons, boundaryState = null, binding = null) => ({
    format: ADMISSION_ASSESSMENT_FORMAT,
    status: reasons.length ? 'blocked' : 'admitted', reasons,
    boundary_state: boundaryState, binding,
    business_decision: null, execution_authorization: null,
  });
  if (!boundedJson(input) || !exactFields(input, fields)
    || ![true, false, null].includes(input.protocol_valid) || !record(input.snapshot)) {
    return response(['ADMISSION_ASSESSMENT_INVALID']);
  }
  const reasons = input.protocol_valid === true ? [] : ['PROTOCOL_VALIDITY_NOT_ESTABLISHED'];
  const boundary = classifyBoundaryAssessment(input.boundary_assessment);
  if (boundary.state !== 'determined') reasons.push(`BOUNDARY_${boundary.state.toUpperCase()}`);
  else if (!record(input.snapshot.boundary)
    || digest(input.snapshot.boundary) !== boundary.canonical_boundary_digest) {
    reasons.push('ASSESSED_BOUNDARY_BINDING_MISMATCH');
  }
  if (input.snapshot.computed_boundary?.state !== 'determined') reasons.push('COMPUTED_BOUNDARY_NOT_DETERMINED');
  reasons.push(...evaluateReleaseConditions(input.snapshot, input.release_conditions));
  const binding = checkAdmissionBinding(input.stored_binding, input.snapshot);
  if (binding.status !== 'matched') reasons.push(`VERSION_BINDING_${binding.status.toUpperCase()}`);
  return response(reasons, boundary.state, binding);
}
