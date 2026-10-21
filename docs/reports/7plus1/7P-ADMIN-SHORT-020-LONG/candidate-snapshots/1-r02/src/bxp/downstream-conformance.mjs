import { registeredValidator } from './schema-registry.mjs';
import { boundedJson } from './validation.mjs';
import { digest, sourceDigest } from './evaluate.mjs';
import { compileSemanticIr } from './semantic-ir-compiler.mjs';
import { evaluateBooleanAssignment } from './boolean-solver.mjs';
import { intersectValidatedIntervals } from './interval-solver.mjs';
import { decimalText } from './decimal.mjs';
import { evaluateValidatedTargetSet } from './target-set-solver.mjs';
import { evaluateValidatedHandoff } from './handoff-solver.mjs';
import { verifyPublishedComputedBoundary } from './published-computed-boundary.mjs';

const validateObservations = registeredValidator('downstream_observations');
const booleanOperators = new Set(['obligation', 'prohibition', 'completion', 'constraint']);
const targetIdentity = node => JSON.stringify([node.scope_id, node.universe, node.effect, node.actor_scope, node.guard_context]);

export function evaluateDownstreamConformance(published, input) {
  const response = (status, diagnostics, checks = []) => ({ format: 'boundx-downstream-conformance/experimental-v1',
    status, diagnostics, checks, observation_basis: 'submitted_evidence_assertions_not_external_verification',
    business_decision: null, execution_authorization: null });
  const fail = code => response('invalid', [{ code }]);
  if (!boundedJson(input) || !validateObservations(input)) return fail('DOWNSTREAM_INPUT_INVALID');
  const verified = verifyPublishedComputedBoundary(published);
  if (verified.status !== 'verified') return fail(verified.reason);
  const { record, release } = published;
  const { snapshot } = record;
  if (input.task_id !== snapshot.ir.task_id || input.task_revision !== record.revision
    || input.binding_digest !== record.stored_binding.binding_digest) return response('stale', [{ code: 'DOWNSTREAM_VERSION_BINDING_MISMATCH' }]);
  const compilation = compileSemanticIr(snapshot.ir, snapshot.formalization_inputs);
  if (compilation.status !== 'mapped' || digest(compilation.model) !== digest(snapshot.formal_model)) return fail('PUBLISHED_MODEL_REPLAY_MISMATCH');
  const sources = new Map();
  const taskSources = snapshot.ir.sources.map(source => source.text);
  const taskSourceDigests = new Set(snapshot.ir.sources.map(source => source.sha256));
  for (const source of input.sources) {
    if (sources.has(source.id) || sourceDigest(source.text) !== source.sha256) return fail('OBSERVATION_SOURCE_INVALID');
    if (taskSourceDigests.has(source.sha256)) return fail('OBSERVATION_SOURCE_REUSES_TASK_CONTEXT');
    sources.set(source.id, [...source.text]);
  }
  const nodes = new Map(compilation.model.nodes.map(node => [node.id, node]));
  const observations = new Map(), assignments = new Map(), measurements = new Map(), states = new Map();
  const targetGroups = new Map();
  for (const observation of input.observations) {
    const node = nodes.get(observation.node_id);
    if (!node || node.scope_id !== observation.scope_id || observations.has(observation.node_id)) return fail('OBSERVATION_NODE_IDENTITY_INVALID');
    for (const span of observation.evidence) {
      const points = sources.get(span.source_id);
      if (!points || span.end <= span.start || span.end > points.length
        || points.slice(span.start, span.end).join('') !== span.quote) return fail('OBSERVATION_EVIDENCE_INVALID');
      if (taskSources.some(text => text.includes(span.quote))) return fail('OBSERVATION_EVIDENCE_REUSES_TASK_CONTEXT');
    }
    if (booleanOperators.has(node.operator)) {
      try { evaluateBooleanAssignment(node.variables, node.effective_formula, observation.value.booleans); }
      catch { return fail('BOOLEAN_OBSERVATION_INVALID'); }
      for (const [name, value] of Object.entries(observation.value.booleans)) {
        const key = JSON.stringify([node.scope_id, name]);
        if (assignments.has(key) && assignments.get(key) !== value) return fail('OBSERVATION_ASSIGNMENT_CONFLICT');
        assignments.set(key, value);
      }
    }
    if (node.operator === 'interval' && Object.hasOwn(observation.value, 'numeric')) {
      const key = JSON.stringify([node.scope_id, node.subject, node.dimension, observation.value.unit]);
      const value = decimalText(observation.value.numeric);
      if (measurements.has(key) && measurements.get(key) !== value) return fail('OBSERVATION_MEASUREMENT_CONFLICT');
      measurements.set(key, value);
    }
    if (node.operator === 'artifact_state') {
      if (typeof observation.value.present !== 'boolean') return fail('ARTIFACT_OBSERVATION_INVALID');
      const key = JSON.stringify([node.scope_id, node.artifact]);
      if (states.has(key) && states.get(key) !== observation.value.present) return fail('OBSERVATION_ARTIFACT_CONFLICT');
      states.set(key, observation.value.present);
    }
    if (['target_set', 'allowed_set'].includes(node.operator)) {
      if (!Array.isArray(observation.value.targets)) return fail('TARGET_OBSERVATION_INVALID');
      const key = targetIdentity(node);
      if (!targetGroups.has(key)) targetGroups.set(key, { targets: new Set(), complete: null, evidence: [] });
      const group = targetGroups.get(key);
      for (const target of observation.value.targets) group.targets.add(target);
      if (observation.value.complete) {
        const complete = [...observation.value.targets].sort();
        if (group.complete && JSON.stringify(group.complete) !== JSON.stringify(complete)) return fail('OBSERVATION_TARGET_CONFLICT');
        group.complete = complete;
      }
      group.evidence.push(...observation.evidence);
    }
    observations.set(node.id, observation);
  }
  for (const group of targetGroups.values()) {
    if (group.complete && [...group.targets].some(target => !group.complete.includes(target))) return fail('OBSERVATION_TARGET_CONFLICT');
  }
  const checks = [];
  for (const node of nodes.values()) {
    const group = ['target_set', 'allowed_set'].includes(node.operator) ? targetGroups.get(targetIdentity(node)) : null;
    const observation = group ? { value: { targets: [...group.targets], complete: group.complete !== null }, evidence: group.evidence }
      : observations.get(node.id);
    let status = 'insufficient', reason = observation ? 'OPERATOR_OBSERVATION_UNSUPPORTED' : 'OBSERVATION_MISSING';
    if (observation && booleanOperators.has(node.operator)) {
      status = evaluateBooleanAssignment(node.variables, node.effective_formula, observation.value.booleans) ? 'conformant' : 'violated';
      reason = 'BOOLEAN_PREDICATE_EVALUATED';
    } else if (observation && node.operator === 'interval') {
      if (!Object.hasOwn(observation.value, 'numeric')) return fail('NUMERIC_OBSERVATION_INVALID');
      if (observation.value.unit !== node.unit) reason = 'OBSERVATION_UNIT_MISMATCH';
      else if (node.domain === 'integer' && !/^-?(?:0|[1-9]\d*)$/u.test(decimalText(observation.value.numeric))) {
        reason = 'INTEGER_OBSERVATION_DOMAIN_INVALID';
      }
      else {
        const exact = { value: observation.value.numeric, inclusive: true };
        const result = intersectValidatedIntervals([node, { ...node, id: `${node.id}-observed`, lower: exact, upper: exact }])[0];
        status = result.empty ? 'violated' : 'conformant'; reason = 'NUMERIC_BOUND_EVALUATED';
      }
    } else if (observation && node.operator === 'artifact_state') {
      if (typeof observation.value.present !== 'boolean') return fail('ARTIFACT_OBSERVATION_INVALID');
      status = observation.value.present === (node.presence === 'present') ? 'conformant' : 'violated';
      reason = 'ARTIFACT_PRESENCE_EVALUATED';
    } else if (observation && node.operator === 'entity') {
      if (!Object.hasOwn(observation.value, 'entity_id')) return fail('ENTITY_OBSERVATION_INVALID');
      if (node.identity_status !== 'resolved') reason = 'ENTITY_IDENTITY_UNRESOLVED';
      else {
        status = observation.value.entity_id === node.entity_id && observation.value.entity_type === node.entity_type ? 'conformant' : 'violated';
        reason = 'EXPLICIT_ENTITY_IDENTITY_EVALUATED';
      }
    } else if (observation && node.operator === 'relation') {
      if (!Object.hasOwn(observation.value, 'relation')) return fail('RELATION_OBSERVATION_INVALID');
      if (node.relation_status !== 'resolved') reason = 'RELATION_IDENTITY_UNRESOLVED';
      else if (['prerequisite', 'depends_on'].includes(node.relation)) reason = 'RELATION_EXECUTION_ORDER_EVIDENCE_REQUIRED';
      else {
        status = ['relation', 'from_id', 'to_id'].every(field => observation.value[field] === node[field]) ? 'conformant' : 'violated';
        reason = 'EXPLICIT_RELATION_EVALUATED_NO_AUTHORITY_INFERENCE';
      }
    } else if (observation && node.operator === 'allowed_set') {
      if (!Array.isArray(observation.value.targets)) return fail('TARGET_OBSERVATION_INVALID');
      if (node.identity_status !== 'resolved') reason = 'ALLOWED_SET_IDENTITY_UNRESOLVED';
      else if (observation.value.targets.some(target => !node.allowed.includes(target))) {
        status = 'violated'; reason = 'OBSERVED_TARGET_OUTSIDE_ALLOWED_SET';
      } else if (!observation.value.complete) reason = 'TARGET_OBSERVATION_INCOMPLETE';
      else { status = 'conformant'; reason = 'OBSERVED_TARGETS_WITHIN_ALLOWED_SET'; }
    } else if (observation && node.operator === 'target_set') {
      if (!Array.isArray(observation.value.targets)) return fail('TARGET_OBSERVATION_INVALID');
      const result = evaluateValidatedTargetSet({ ...node, requested: observation.value.targets });
      if (result.result === 'overlap') { status = 'violated'; reason = 'OBSERVED_FORBIDDEN_TARGET'; }
      else if (result.result === 'undetermined') reason = 'TARGET_IDENTITY_UNRESOLVED';
      else if (!observation.value.complete) reason = 'TARGET_OBSERVATION_INCOMPLETE';
      else { status = 'conformant'; reason = 'OBSERVED_TARGETS_DISJOINT_FROM_FORBIDDEN'; }
    } else if (observation && node.operator === 'handoff') {
      if (!Array.isArray(observation.value.delivered) || !Array.isArray(observation.value.external_inputs)) return fail('HANDOFF_OBSERVATION_INVALID');
      if (observation.value.delivered.some(value => !node.declared_outputs.includes(value))) {
        status = 'violated'; reason = 'UNDECLARED_HANDOFF_OUTPUT';
      } else if (observation.value.external_inputs.some(value => !node.external_inputs.includes(value))) {
        status = 'violated'; reason = 'UNDECLARED_EXTERNAL_HANDOFF_INPUT';
      } else {
        const result = evaluateValidatedHandoff({ ...node, declared_outputs: observation.value.delivered,
          external_inputs: observation.value.external_inputs });
        if (result.result === 'undetermined') reason = 'HANDOFF_IDENTITY_UNRESOLVED';
        else if (!observation.value.complete) reason = 'HANDOFF_OBSERVATION_INCOMPLETE';
        else { status = result.result === 'deficit' ? 'violated' : 'conformant'; reason = 'OBSERVED_HANDOFF_INPUTS_EVALUATED'; }
      }
    }
    checks.push({ node_id: node.id, scope_id: node.scope_id, operator: node.operator, status, reason,
      boundary_evidence: structuredClone(node.evidence), observation_evidence: structuredClone(observation?.evidence ?? []) });
  }
  return response(checks.some(check => check.status === 'violated') ? 'violated'
    : !checks.length || checks.some(check => check.status === 'insufficient') ? 'insufficient' : 'conformant', [], checks);
}
