import { boundedJson } from './validation.mjs';
import { digest } from './evaluate.mjs';
import { evaluateScopeGauge } from './scope-gauge.mjs';
import { buildTypedEvidenceArtifacts } from '../product/typed-evidence-artifacts.mjs';

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function verifyScopeGaugeReplay(input, profile = null, trustedSelection = null) {
  const output = (status, reason, details = {}) => ({ format: 'boundx-scope-gauge-replay/experimental-v1',
    status, reason, verified_scope: 'deterministic_replay_only', admission: null,
    business_decision: null, execution_authorization: null, ...details });
  if (!boundedJson(input) || !record(input) || Object.keys(input).length !== 4
    || !Object.hasOwn(input, 'request') || !Object.hasOwn(input, 'task_nodes')
    || !Object.hasOwn(input, 'evidence_graph') || !Object.hasOwn(input, 'claimed_analysis')
    || !Array.isArray(input.task_nodes) || !record(input.evidence_graph)) {
    return output('invalid', 'REPLAY_INPUT_INVALID');
  }
  let current;
  try {
    const canonical = buildTypedEvidenceArtifacts(input.request, input.evidence_graph.producer);
    if (digest(input.task_nodes) !== digest(canonical.task_nodes)
      || digest(input.evidence_graph) !== digest(canonical.evidence_graph)) {
      return output('invalid', 'REPLAY_EVIDENCE_ARTIFACT_MISMATCH');
    }
    current = evaluateScopeGauge({ request: input.request, task_nodes: input.task_nodes,
      evidence_graph: input.evidence_graph }, profile, trustedSelection);
  } catch { return output('invalid', 'CURRENT_INPUT_INVALID'); }
  if (current.computed_boundary.state === 'invalid') return output('invalid', 'CURRENT_INPUT_INVALID');
  const claimed = input.claimed_analysis;
  if (!record(claimed) || claimed.format !== current.format || !record(claimed.computed_boundary)
    || typeof claimed.computed_boundary_digest !== 'string'
    || !/^[a-f0-9]{64}$/u.test(claimed.computed_boundary_digest)
    || claimed.computed_boundary_digest !== digest(claimed.computed_boundary)) {
    return output('invalid', 'CLAIMED_RESULT_INTEGRITY_INVALID');
  }
  const keys = [...new Set([...Object.keys(current), ...Object.keys(claimed)])].sort();
  const changed = keys.filter(key => !Object.hasOwn(current, key) || !Object.hasOwn(claimed, key)
    || digest(current[key]) !== digest(claimed[key]));
  if (changed.length) return output('mismatch', 'RECOMPUTED_SCOPE_GAUGE_DIFFERS', {
    changed_components: changed, current_computed_boundary_digest: current.computed_boundary_digest,
    current_computed_boundary_state: current.computed_boundary.state });
  return output('verified', 'EXACT_REPLAY_MATCH', {
    current_computed_boundary_digest: current.computed_boundary_digest,
    current_computed_boundary_state: current.computed_boundary.state });
}
