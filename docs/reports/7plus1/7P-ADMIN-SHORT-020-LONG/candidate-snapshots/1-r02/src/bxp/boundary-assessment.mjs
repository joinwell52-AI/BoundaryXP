import { boundedJson } from './validation.mjs';
import { digest } from './evaluate.mjs';

export const BOUNDARY_ASSESSMENT_FORMAT = 'boundx-boundary-assessment/experimental-v1';
const checks = ['valid', 'required_resolved', 'identity_resolved', 'scope_resolved', 'consistent', 'interpretations_exhaustive'];
const fields = [...checks, 'canonical_boundaries'];
const result = (state, reasons, canonicalBoundary = null) => ({
  format: BOUNDARY_ASSESSMENT_FORMAT, state, reasons,
  canonical_boundary: canonicalBoundary, canonical_boundary_digest: canonicalBoundary === null ? null : digest(canonicalBoundary),
  admission: null, business_decision: null, execution_authorization: null,
});

export function classifyBoundaryAssessment(assessment) {
  if (!boundedJson(assessment) || !assessment || Array.isArray(assessment) || typeof assessment !== 'object'
    || Object.keys(assessment).length !== fields.length || fields.some(field => !Object.hasOwn(assessment, field))
    || checks.some(field => ![true, false, null].includes(assessment[field]))
    || !Array.isArray(assessment.canonical_boundaries) || assessment.canonical_boundaries.length > 256
    || assessment.canonical_boundaries.some(boundary => boundary === null || typeof boundary !== 'object' || Array.isArray(boundary))) {
    return result('invalid', ['ASSESSMENT_INVALID']);
  }
  if (assessment.valid === false) return result('invalid', ['FORMAL_MODEL_INVALID']);
  const unresolved = checks.filter(field => field !== 'consistent' && assessment[field] !== true);
  if (unresolved.length) return result('underdetermined', unresolved.map(field => `${field.toUpperCase()}_NOT_ESTABLISHED`));
  if (assessment.consistent === false) return result('inconsistent', ['FORMAL_CONSTRAINTS_INCONSISTENT']);
  if (assessment.consistent !== true) return result('underdetermined', ['CONSISTENCY_NOT_ESTABLISHED']);
  const distinct = new Map(assessment.canonical_boundaries.map(boundary => [digest(boundary), boundary]));
  if (distinct.size === 0) return result('underdetermined', ['NO_CANONICAL_BOUNDARY']);
  if (distinct.size !== 1) return result('underdetermined', ['MULTIPLE_CANONICAL_BOUNDARIES']);
  return result('determined', [], structuredClone(distinct.values().next().value));
}
