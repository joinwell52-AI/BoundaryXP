import { evaluateTypedBoundary, validateTypedBoundaryStructure } from './typed-boundary.mjs';
import { boundedJson } from './validation.mjs';
import { digest } from './evaluate.mjs';

export function verifyTypedBoundaryReplay(input, profile = null, trustedSelection = null) {
  const output = (status, reason, details = {}) => ({ format: 'boundx-typed-replay/experimental-v1', status, reason,
    verified_scope: 'deterministic_replay_only', admission: null,
    business_decision: null, execution_authorization: null, ...details });
  if (!boundedJson(input) || !input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).length !== 2 || !Object.hasOwn(input, 'request') || !Object.hasOwn(input, 'claimed_analysis')) {
    return output('invalid', 'REPLAY_INPUT_INVALID');
  }
  const current = evaluateTypedBoundary(input.request, profile, trustedSelection);
  if (current.boundary_result.state === 'invalid') return output('invalid', 'CURRENT_INPUT_INVALID');
  const claimed = input.claimed_analysis;
  if (!claimed || typeof claimed !== 'object' || Array.isArray(claimed)
    || claimed.format !== current.format || typeof claimed.boundary_digest !== 'string'
    || !/^[a-f0-9]{64}$/.test(claimed.boundary_digest) || !validateTypedBoundaryStructure(claimed.boundary_result)
    || claimed.boundary_digest !== digest(claimed.boundary_result)) {
    return output('invalid', 'CLAIMED_RESULT_INTEGRITY_INVALID');
  }
  const keys = [...new Set([...Object.keys(current), ...Object.keys(claimed)])].sort();
  const changed = keys.filter(key => !Object.hasOwn(current, key) || !Object.hasOwn(claimed, key)
    || digest(current[key]) !== digest(claimed[key]));
  if (changed.length) return output('mismatch', 'RECOMPUTED_ANALYSIS_DIFFERS', {
    changed_components: changed, current_boundary_digest: current.boundary_digest,
    current_boundary_state: current.boundary_result.state });
  return output('verified', 'EXACT_REPLAY_MATCH', { current_boundary_digest: current.boundary_digest,
    current_boundary_state: current.boundary_result.state });
}
