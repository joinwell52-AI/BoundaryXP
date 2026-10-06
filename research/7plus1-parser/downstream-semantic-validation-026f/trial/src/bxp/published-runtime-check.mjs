import { boundedJson } from './validation.mjs';
import { digest, sourceDigest } from './evaluate.mjs';
import { compareDecimal, decimalText } from './decimal.mjs';
import { evaluateBooleanAssignment, solveBooleanConstraints } from './boolean-solver.mjs';
import { evaluateValidatedHandoff } from './handoff-solver.mjs';
import { verifyPublishedComputedBoundary } from './published-computed-boundary.mjs';

const phases = new Set(['pre_execution', 'tool_call', 'diff_artifact', 'final_delivery']);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const denseArray = value => Array.isArray(value)
  && Array.from({ length: value.length }, (_, index) => Object.hasOwn(value, index)).every(Boolean);
const exact = (value, keys) => record(value) && Object.keys(value).length === keys.length
  && keys.every(key => Object.hasOwn(value, key));
const fields = ['format', 'task_id', 'task_revision', 'binding_digest', 'computed_boundary_digest',
  'task_node_id', 'phase', 'sources', 'sets', 'resources', 'dependencies', 'completion', 'artifacts'];
const contextKey = value => JSON.stringify([value.universe, value.effect, value.actor_scope, value.guard_context]);
const resourceKey = value => JSON.stringify([value.subject, value.dimension, value.unit]);
const sha256 = value => typeof value === 'string' && /^[a-f0-9]{64}$/u.test(value);

function response(outcome, findings, boundary = null, observations = null) {
  return { format: 'boundx-published-runtime-check/experimental-v1', outcome, findings,
    boundary_digest: boundary === null ? null : digest(boundary),
    observations: observations === null ? null : structuredClone(observations),
    observation_basis: 'submitted_evidence_assertions_not_external_verification',
    business_decision: null, execution_authorization: null };
}

function validateObservations(input) {
  if (!boundedJson(input) || !record(input) || Object.keys(input).length !== fields.length
      + (Object.hasOwn(input, 'booleans') ? 1 : 0) + (Object.hasOwn(input, 'handoffs') ? 1 : 0)
      + (Object.hasOwn(input, 'relations') ? 1 : 0)
    || fields.some(field => !Object.hasOwn(input, field))
    || input.format !== 'boundx-published-runtime-observations/experimental-v1'
    || !['task_id', 'task_revision', 'binding_digest', 'computed_boundary_digest', 'task_node_id'].every(key =>
      typeof input[key] === 'string' && input[key].length > 0)
    || !phases.has(input.phase) || !['sources', 'sets', 'resources', 'dependencies', 'completion', 'artifacts']
      .every(key => denseArray(input[key]) && input[key].length <= 256)) return false;
  const sources = new Map();
  for (const source of input.sources) {
    if (!exact(source, ['id', 'text', 'sha256']) || typeof source.id !== 'string' || !source.id || typeof source.text !== 'string'
      || !sha256(source.sha256) || sourceDigest(source.text) !== source.sha256 || sources.has(source.id)) return false;
    sources.set(source.id, [...source.text]);
  }
  const evidenceValid = item => denseArray(item.evidence) && item.evidence.length > 0
    && item.evidence.every(span => exact(span, ['source_id', 'start', 'end', 'quote']) && typeof span.source_id === 'string'
      && Number.isInteger(span.start) && Number.isInteger(span.end) && span.start >= 0 && span.end > span.start
      && span.end <= (sources.get(span.source_id)?.length ?? -1)
      && sources.get(span.source_id).slice(span.start, span.end).join('') === span.quote);
  const strings = (item, keys) => keys.every(key => typeof item[key] === 'string' && item[key].length > 0);
  if (input.sets.some(item => !exact(item, ['universe', 'effect', 'actor_scope', 'guard_context', 'targets', 'complete', 'evidence'])
    || !strings(item, ['universe', 'effect', 'actor_scope', 'guard_context'])
    || !denseArray(item.targets) || item.targets.some(target => typeof target !== 'string' || !target)
    || new Set(item.targets).size !== item.targets.length || typeof item.complete !== 'boolean' || !evidenceValid(item))) return false;
  if (input.resources.some(item => !exact(item, ['subject', 'dimension', 'unit', 'value', 'evidence'])
    || !strings(item, ['subject', 'dimension', 'unit'])
    || typeof item.value !== 'string' || item.value.length > 128 || !evidenceValid(item))) return false;
  if (input.dependencies.some(item => !exact(item, ['node_id', 'from_completed_at', 'to_started_at', 'evidence'])
    || !strings(item, ['node_id'])
    || ![null, 'number'].includes(item.from_completed_at === null ? null : typeof item.from_completed_at)
    || ![null, 'number'].includes(item.to_started_at === null ? null : typeof item.to_started_at)
    || item.from_completed_at !== null && !Number.isSafeInteger(item.from_completed_at)
    || item.to_started_at !== null && !Number.isSafeInteger(item.to_started_at)
    || !evidenceValid(item))) return false;
  if (input.completion.some(item => !exact(item, ['node_id', 'satisfied', 'evidence']) || !strings(item, ['node_id'])
    || typeof item.satisfied !== 'boolean' || !evidenceValid(item))) return false;
  if (input.artifacts.some(item => !exact(item, ['artifact', 'present', 'evidence']) || !strings(item, ['artifact'])
    || typeof item.present !== 'boolean' || !evidenceValid(item))) return false;
  if (Object.hasOwn(input, 'handoffs') && (!denseArray(input.handoffs) || input.handoffs.length > 256
    || input.handoffs.some(item => !exact(item, ['node_id', 'delivered', 'external_inputs', 'complete', 'evidence'])
      || !strings(item, ['node_id']) || typeof item.complete !== 'boolean'
      || ![item.delivered, item.external_inputs].every(values => denseArray(values) && values.length <= 256
        && values.every(value => typeof value === 'string' && value.length > 0)
        && new Set(values).size === values.length)
      || !evidenceValid(item)))) return false;
  if (Object.hasOwn(input, 'booleans') && (!denseArray(input.booleans) || input.booleans.length > 256
    || input.booleans.some(item => !exact(item, ['node_id', 'values', 'evidence']) || !strings(item, ['node_id'])
      || !record(item.values) || Object.keys(item.values).length > 12
      || Object.entries(item.values).some(([name, value]) => !name || name.length > 128 || typeof value !== 'boolean')
      || !evidenceValid(item)))) return false;
  if (Object.hasOwn(input, 'relations') && (!denseArray(input.relations) || input.relations.length > 256
    || input.relations.some(item => !exact(item, ['node_id', 'relation', 'from_id', 'to_id', 'evidence'])
      || !strings(item, ['node_id', 'relation', 'from_id', 'to_id']) || !evidenceValid(item)))) return false;
  return [input.sets.map(contextKey), input.resources.map(resourceKey), input.dependencies.map(item => item.node_id),
    input.completion.map(item => item.node_id), input.artifacts.map(item => item.artifact),
    (input.booleans ?? []).map(item => item.node_id), (input.handoffs ?? []).map(item => item.node_id),
    (input.relations ?? []).map(item => item.node_id)]
    .every(keys => new Set(keys).size === keys.length);
}

export function checkPublishedRuntimeBoundary(published, input) {
  const verified = verifyPublishedComputedBoundary(published);
  if (verified.status !== 'verified') return response('UNDETERMINED', [{ code: verified.reason }]);
  const boundary = verified.computed_boundary;
  if (!validateObservations(input)) return response('UNDETERMINED', [{ code: 'RUNTIME_OBSERVATIONS_INVALID' }], boundary);
  const { record, release } = published;
  if (input.task_id !== release.task_id || input.task_revision !== release.revision
    || input.binding_digest !== record.stored_binding.binding_digest
    || input.computed_boundary_digest !== digest(boundary)) {
    return response('UNDETERMINED', [{ code: 'BOUNDARY_VERSION_STALE',
      expected: { task_id: release.task_id, task_revision: release.revision,
        binding_digest: record.stored_binding.binding_digest, computed_boundary_digest: digest(boundary) },
      observed: { task_id: input.task_id, task_revision: input.task_revision,
        binding_digest: input.binding_digest, computed_boundary_digest: input.computed_boundary_digest } }], boundary, input);
  }
  const taskSourceDigests = new Set(record.snapshot.ir.sources.map(source => source.sha256));
  if (input.sources.some(source => taskSourceDigests.has(source.sha256))) {
    return response('UNDETERMINED', [{ code: 'OBSERVATION_SOURCE_REUSES_TASK_CONTEXT' }], boundary, input);
  }
  const taskSourceIds = new Set(record.snapshot.ir.sources.map(source => source.id));
  if (input.sources.some(source => taskSourceIds.has(source.id))) {
    return response('UNDETERMINED', [{ code: 'OBSERVATION_SOURCE_ID_COLLIDES_WITH_TASK_CONTEXT' }], boundary, input);
  }
  const taskSourceTexts = record.snapshot.ir.sources.map(source => source.text);
  const evidenceBearing = [...input.sets, ...input.resources, ...input.dependencies, ...input.completion,
    ...input.artifacts, ...(input.handoffs ?? []), ...(input.booleans ?? []), ...(input.relations ?? [])];
  if (evidenceBearing.some(item => item.evidence.some(span => taskSourceTexts.some(text => text.includes(span.quote))))) {
    return response('UNDETERMINED', [{ code: 'OBSERVATION_EVIDENCE_REUSES_TASK_CONTEXT' }], boundary, input);
  }
  const scoped = boundary.task_node_calculations.find(item => item.task_node_id === input.task_node_id);
  if (!scoped || !scoped.effective_boundary || !['evaluated', 'empty'].includes(scoped.status)) {
    return response('UNDETERMINED', [{ code: 'TASK_NODE_BOUNDARY_UNAVAILABLE', task_node_id: input.task_node_id }], boundary, input);
  }
  const effective = scoped.effective_boundary;
  const nodes = new Map(record.snapshot.formal_model.nodes.map(node => [node.id, node]));
  const boundaryEvidence = ids => ids.flatMap(id => structuredClone(nodes.get(id)?.evidence ?? []));
  const booleans = new Map((input.booleans ?? []).map(item => [item.node_id, item]));
  const sets = new Map(input.sets.map(item => [contextKey(item), item]));
  const findings = [];
  const conflictingBooleanVariables = new Set();
  if (input.phase !== 'final_delivery' && input.completion.length) findings.push({
    code: 'PHASE_COMPLETION_UNEXPECTED', evidence: input.completion.flatMap(item => item.evidence) });
  if (!['diff_artifact', 'final_delivery'].includes(input.phase) && input.artifacts.length) {
    findings.push({ code: 'PHASE_ARTIFACT_UNEXPECTED', evidence: input.artifacts.flatMap(item => item.evidence) });
  }
  if (input.phase !== 'final_delivery' && input.handoffs?.length) findings.push({
    code: 'PHASE_HANDOFF_UNEXPECTED', evidence: input.handoffs.flatMap(item => item.evidence) });
  const booleanValues = new Map();
  const booleanNodeIds = new Set(effective.source_bindings.filter(item =>
    ['obligation', 'prohibition', 'constraint'].includes(nodes.get(item.formal_node_id)?.operator)
      || input.phase === 'final_delivery' && nodes.get(item.formal_node_id)?.operator === 'completion')
    .map(item => item.formal_node_id));
  const prematureCompletion = input.phase === 'final_delivery' ? [] : (input.booleans ?? []).filter(item =>
    nodes.get(item.node_id)?.operator === 'completion');
  if (prematureCompletion.length) findings.push({ code: 'PHASE_COMPLETION_BOOLEAN_UNEXPECTED',
    evidence: prematureCompletion.flatMap(item => item.evidence) });
  for (const id of booleanNodeIds) {
    const node = nodes.get(id);
    const observed = booleans.get(id);
    if (!observed) { findings.push({ code: 'BOOLEAN_OBSERVATION_MISSING', node_id: id,
      boundary_evidence: boundaryEvidence([id]) }); continue; }
    let satisfies;
    try { satisfies = evaluateBooleanAssignment(node.variables, node.effective_formula, observed.values); }
    catch { findings.push({ code: 'BOOLEAN_OBSERVATION_INVALID', node_id: id,
      boundary_evidence: boundaryEvidence([id]), evidence: observed.evidence }); continue; }
    for (const [name, value] of Object.entries(observed.values)) {
      const previous = booleanValues.get(name);
      if (previous && previous.value !== value) {
        findings.push({ code: 'BOOLEAN_OBSERVATION_CONFLICT', variable: name,
          node_ids: [previous.node_id, id], boundary_evidence: boundaryEvidence([previous.node_id, id]),
          evidence: [...previous.evidence, ...observed.evidence] });
        conflictingBooleanVariables.add(name);
      }
      booleanValues.set(name, { value, node_id: id, evidence: observed.evidence });
    }
    if (!satisfies) findings.push({ code: 'BOOLEAN_BOUNDARY_VIOLATION', node_id: id,
      boundary_evidence: boundaryEvidence([id]), evidence: observed.evidence });
  }
  for (const item of input.booleans ?? []) if (!booleanNodeIds.has(item.node_id)) {
    findings.push({ code: 'BOOLEAN_NODE_OUTSIDE_EFFECTIVE_BOUNDARY', node_id: item.node_id,
      evidence: item.evidence });
  }
  const phaseUniverses = input.phase === 'tool_call' ? new Set(['actions', 'files'])
    : input.phase === 'diff_artifact' ? new Set(['files']) : null;
  if (input.phase === 'tool_call' && !input.sets.some(item => item.universe === 'actions' && item.targets.length > 0)
    || input.phase === 'diff_artifact' && !input.sets.some(item => item.universe === 'files') && input.artifacts.length === 0
    || input.phase === 'pre_execution' && input.sets.length === 0 && input.resources.length === 0
      && input.dependencies.length === 0 && (input.booleans?.length ?? 0) === 0
      && (input.relations?.length ?? 0) === 0
    || input.phase === 'final_delivery' && input.completion.length === 0 && input.artifacts.length === 0
      && (input.handoffs?.length ?? 0) === 0) {
    findings.push({ code: 'PHASE_OBSERVATION_MISSING', phase: input.phase });
  }
  const setRules = new Map();
  for (const allowed of effective.allowed) if (phaseUniverses === null || phaseUniverses.has(allowed.universe)) {
    setRules.set(contextKey(allowed), allowed);
  }
  for (const id of effective.forbidden) {
    const node = nodes.get(id);
    if (node?.operator === 'target_set' && (phaseUniverses === null || phaseUniverses.has(node.universe))) {
      const key = contextKey(node);
      if (!setRules.has(key)) setRules.set(key, null);
    }
  }
  for (const [key, rule] of setRules) {
    const observed = sets.get(key);
    const forbiddenNodes = effective.forbidden.map(id => nodes.get(id)).filter(node => node?.operator === 'target_set'
      && contextKey(node) === key);
    const setEvidence = boundaryEvidence([...new Set([...(rule?.node_ids ?? []),
      ...forbiddenNodes.map(node => node.id)])]);
    if (!observed) {
      findings.push({ code: 'SET_OBSERVATION_MISSING_OR_INCOMPLETE', context: JSON.parse(key),
        boundary_evidence: setEvidence });
      continue;
    }
    if (!observed.complete) findings.push({ code: 'SET_OBSERVATION_MISSING_OR_INCOMPLETE', context: JSON.parse(key),
      boundary_evidence: setEvidence, evidence: observed.evidence });
    if (rule === null && observed.targets.length === 0) {
      findings.push({ code: 'ALLOWED_SET_UNESTABLISHED', context: JSON.parse(key), evidence: observed.evidence });
    }
    for (const target of observed.targets) {
      const prohibitions = forbiddenNodes.filter(node => node.forbidden.includes(target));
      if (prohibitions.length) findings.push({ code: 'FORBIDDEN_TARGET_OBSERVED', target,
        context: JSON.parse(key), boundary_evidence: boundaryEvidence(prohibitions.map(node => node.id)),
        evidence: observed.evidence });
      else if (rule === null) findings.push({ code: 'ALLOWED_SET_UNESTABLISHED', target,
        context: JSON.parse(key), evidence: observed.evidence });
      else if (!rule.allowed.includes(target)) findings.push({ code: 'TARGET_OUTSIDE_ALLOWED_SET', target,
        context: JSON.parse(key), boundary_evidence: boundaryEvidence(rule.node_ids.filter(id =>
          nodes.get(id)?.operator === 'allowed_set')), evidence: observed.evidence });
    }
  }
  for (const [key, observed] of sets) if (!setRules.has(key)) {
    findings.push({ code: phaseUniverses !== null && !phaseUniverses.has(observed.universe)
      ? 'PHASE_SET_CONTEXT_UNEXPECTED' : 'OBSERVED_SET_CONTEXT_UNESTABLISHED',
    context: JSON.parse(key), evidence: observed.evidence });
  }
  const resources = new Map(input.resources.map(item => [resourceKey(item), item]));
  const limitedResources = new Set(effective.limits.map(resourceKey));
  for (const [key, observed] of resources) if (!limitedResources.has(key)) findings.push({
    code: 'RESOURCE_CONTEXT_UNESTABLISHED', context: JSON.parse(key), evidence: observed.evidence });
  for (const limit of effective.limits) {
    const observed = resources.get(resourceKey(limit));
    if (!observed) { findings.push({ code: 'RESOURCE_OBSERVATION_MISSING', constraint_ids: limit.constraint_ids,
      boundary_evidence: boundaryEvidence(limit.constraint_ids) }); continue; }
    let value;
    try { value = decimalText(observed.value); }
    catch { findings.push({ code: 'RESOURCE_OBSERVATION_INVALID', constraint_ids: limit.constraint_ids,
      boundary_evidence: boundaryEvidence(limit.constraint_ids), evidence: observed.evidence }); continue; }
    if (limit.domain === 'integer' && !/^-?(?:0|[1-9]\d*)$/u.test(value)) {
      findings.push({ code: 'RESOURCE_OBSERVATION_DOMAIN_INVALID', constraint_ids: limit.constraint_ids,
        expected_domain: 'integer', observed: value,
        boundary_evidence: boundaryEvidence(limit.constraint_ids), evidence: observed.evidence });
      continue;
    }
    const below = limit.lower && (compareDecimal(value, limit.lower.value) < 0
      || compareDecimal(value, limit.lower.value) === 0 && !limit.lower.inclusive);
    const above = limit.upper && (compareDecimal(value, limit.upper.value) > 0
      || compareDecimal(value, limit.upper.value) === 0 && !limit.upper.inclusive);
    if (below || above) findings.push({ code: 'RESOURCE_LIMIT_EXCEEDED', constraint_ids: limit.constraint_ids,
      observed: value, boundary_evidence: boundaryEvidence(limit.constraint_ids), evidence: observed.evidence });
  }
  const dependencies = new Map(input.dependencies.map(item => [item.node_id, item]));
  const prerequisiteIds = new Set(effective.relations.filter(id => nodes.get(id)?.relation === 'prerequisite'));
  for (const id of dependencies.keys()) if (!prerequisiteIds.has(id)) findings.push({
    code: 'DEPENDENCY_NODE_UNESTABLISHED', node_id: id, evidence: dependencies.get(id).evidence });
  const endpointTimes = new Map();
  const addEndpointTime = (endpoint, phase, time, relationId) => {
    if (!endpointTimes.has(endpoint)) endpointTimes.set(endpoint, { started: new Map(), completed: new Map() });
    const times = endpointTimes.get(endpoint)[phase];
    if (!times.has(time)) times.set(time, []);
    times.get(time).push(relationId);
  };
  for (const id of effective.relations) {
    const relation = nodes.get(id);
    if (relation?.relation !== 'prerequisite') continue;
    const observed = dependencies.get(id);
    if (!observed || observed.from_completed_at === null || observed.to_started_at === null) {
      findings.push({ code: 'DEPENDENCY_OBSERVATION_MISSING', node_id: id,
        boundary_evidence: boundaryEvidence([id]), ...(observed ? { evidence: observed.evidence } : {}) });
    } else if (observed.from_completed_at > observed.to_started_at) {
      findings.push({ code: 'DEPENDENCY_ORDER_VIOLATION', node_id: id,
        boundary_evidence: boundaryEvidence([id]), evidence: observed.evidence });
    }
    if (observed?.from_completed_at !== null && observed?.from_completed_at !== undefined) {
      addEndpointTime(relation.from_id, 'completed', observed.from_completed_at, id);
    }
    if (observed?.to_started_at !== null && observed?.to_started_at !== undefined) {
      addEndpointTime(relation.to_id, 'started', observed.to_started_at, id);
    }
  }
  for (const [endpoint, times] of endpointTimes) {
    if (times.started.size > 1 || times.completed.size > 1
      || times.started.size && times.completed.size
        && [...times.started.keys()][0] > [...times.completed.keys()][0]) {
      const relationIds = [...new Set([...times.started.values(), ...times.completed.values()].flat())];
      findings.push({ code: 'DEPENDENCY_ENDPOINT_TIME_INCONSISTENT', endpoint, relation_ids: relationIds,
        boundary_evidence: boundaryEvidence(relationIds),
        evidence: relationIds.flatMap(id => dependencies.get(id)?.evidence ?? []) });
    }
  }
  if (input.phase === 'final_delivery') {
    const completion = new Map(input.completion.map(item => [item.node_id, item]));
    for (const id of completion.keys()) if (!effective.completion.includes(id)) {
      findings.push({ code: 'COMPLETION_NODE_UNESTABLISHED', node_id: id,
        evidence: completion.get(id).evidence });
    }
    for (const id of effective.completion) {
      const observed = completion.get(id);
      if (!observed) findings.push({ code: 'COMPLETION_EVIDENCE_MISSING', node_id: id,
        boundary_evidence: boundaryEvidence([id]) });
      else if (!observed.satisfied) findings.push({ code: 'COMPLETION_NOT_SATISFIED', node_id: id,
        boundary_evidence: boundaryEvidence([id]), evidence: observed.evidence });
    }
  }
  if (input.phase === 'diff_artifact' || input.phase === 'final_delivery') {
    const artifacts = new Map(input.artifacts.map(item => [item.artifact, item]));
    const expectedArtifacts = new Set(effective.artifact_states.map(item => item.artifact));
    for (const artifact of artifacts.keys()) if (!expectedArtifacts.has(artifact)) {
      findings.push({ code: 'ARTIFACT_CONTEXT_UNESTABLISHED', artifact,
        evidence: artifacts.get(artifact).evidence });
    }
    for (const state of effective.artifact_states) {
      const observed = artifacts.get(state.artifact);
      if (!observed) findings.push({ code: 'ARTIFACT_OBSERVATION_MISSING', artifact: state.artifact,
        boundary_evidence: boundaryEvidence(state.formal_node_ids) });
      else {
        const requiredPresent = state.formal_node_ids.some(id => nodes.get(id)?.presence === 'present');
        if (observed.present !== requiredPresent) findings.push({
          code: requiredPresent && input.phase === 'diff_artifact'
            ? 'ARTIFACT_DELIVERY_PENDING' : 'ARTIFACT_STATE_VIOLATION',
          artifact: state.artifact, boundary_evidence: boundaryEvidence(state.formal_node_ids),
          evidence: observed.evidence,
        });
      }
    }
  }
  if (input.phase === 'final_delivery') {
    const handoffs = new Map((input.handoffs ?? []).map(item => [item.node_id, item]));
    const expected = new Set(effective.handoffs.map(item => item.id));
    for (const id of handoffs.keys()) if (!expected.has(id)) {
      findings.push({ code: 'HANDOFF_NODE_UNESTABLISHED', node_id: id,
        evidence: handoffs.get(id).evidence });
    }
    for (const handoff of effective.handoffs) {
      const observed = handoffs.get(handoff.id);
      const node = nodes.get(handoff.id);
      if (!observed) { findings.push({ code: 'HANDOFF_OBSERVATION_MISSING', node_id: handoff.id,
        boundary_evidence: boundaryEvidence([handoff.id]) }); continue; }
      if (!node || node.identity_status !== 'resolved' || node.supply_status !== 'complete') {
        findings.push({ code: 'HANDOFF_BOUNDARY_UNRESOLVED', node_id: handoff.id,
          boundary_evidence: boundaryEvidence([handoff.id]), evidence: observed.evidence });
        continue;
      }
      if (observed.delivered.some(value => !node.declared_outputs.includes(value))) {
        findings.push({ code: 'UNDECLARED_HANDOFF_OUTPUT', node_id: handoff.id,
          boundary_evidence: boundaryEvidence([handoff.id]), evidence: observed.evidence });
      }
      if (observed.external_inputs.some(value => !node.external_inputs.includes(value))) {
        findings.push({ code: 'UNDECLARED_EXTERNAL_HANDOFF_INPUT', node_id: handoff.id,
          boundary_evidence: boundaryEvidence([handoff.id]), evidence: observed.evidence });
      }
      if (!observed.complete) findings.push({ code: 'HANDOFF_OBSERVATION_INCOMPLETE',
        node_id: handoff.id, boundary_evidence: boundaryEvidence([handoff.id]), evidence: observed.evidence });
      else {
        const missing = node.declared_outputs.filter(value => !observed.delivered.includes(value));
        if (missing.length) findings.push({ code: 'HANDOFF_DECLARED_OUTPUT_MISSING', node_id: handoff.id,
          missing, boundary_evidence: boundaryEvidence([handoff.id]), evidence: observed.evidence });
      }
      if (observed.complete && observed.delivered.every(value => node.declared_outputs.includes(value))
        && observed.external_inputs.every(value => node.external_inputs.includes(value))) {
        const result = evaluateValidatedHandoff({ ...node, declared_outputs: observed.delivered,
          external_inputs: observed.external_inputs });
        if (result.result === 'deficit') findings.push({ code: 'HANDOFF_INPUT_DEFICIT', node_id: handoff.id,
          missing: result.missing, boundary_evidence: boundaryEvidence([handoff.id]), evidence: observed.evidence });
      }
    }
  }
  const relations = new Map((input.relations ?? []).map(item => [item.node_id, item]));
  const structuralIds = new Set(effective.relations.filter(id => nodes.get(id)?.relation !== 'prerequisite'));
  for (const id of relations.keys()) if (!structuralIds.has(id)) {
    findings.push({ code: 'RELATION_NODE_UNESTABLISHED', node_id: id,
      evidence: relations.get(id).evidence });
  }
  for (const id of structuralIds) {
    const node = nodes.get(id);
    if (node?.relation === 'depends_on' || !node) {
      findings.push({ code: 'RELATION_EXECUTION_ORDER_EVIDENCE_REQUIRED', node_id: id,
        boundary_evidence: boundaryEvidence([id]) });
      continue;
    }
    const observed = relations.get(id);
    if (!observed) findings.push({ code: 'RELATION_OBSERVATION_MISSING', node_id: id,
      boundary_evidence: boundaryEvidence([id]) });
    else if (node.relation_status !== 'resolved') findings.push({ code: 'RELATION_IDENTITY_UNRESOLVED',
      node_id: id, boundary_evidence: boundaryEvidence([id]), evidence: observed.evidence });
    else if (['relation', 'from_id', 'to_id'].some(field => observed[field] !== node[field])) {
      findings.push({ code: 'RELATION_IDENTITY_VIOLATION', node_id: id,
        boundary_evidence: boundaryEvidence([id]), evidence: observed.evidence });
    }
  }
  const violations = new Set(['FORBIDDEN_TARGET_OBSERVED', 'TARGET_OUTSIDE_ALLOWED_SET', 'RESOURCE_LIMIT_EXCEEDED',
    'DEPENDENCY_ORDER_VIOLATION', 'COMPLETION_NOT_SATISFIED', 'ARTIFACT_STATE_VIOLATION',
    'BOOLEAN_BOUNDARY_VIOLATION', 'UNDECLARED_HANDOFF_OUTPUT', 'UNDECLARED_EXTERNAL_HANDOFF_INPUT',
    'HANDOFF_INPUT_DEFICIT', 'HANDOFF_DECLARED_OUTPUT_MISSING', 'RELATION_IDENTITY_VIOLATION']);
  const confirmedBooleanViolation = item => {
    const node = nodes.get(item.node_id);
    if (!node?.variables.some(variable => conflictingBooleanVariables.has(variable))) return true;
    const values = booleans.get(item.node_id)?.values;
    if (!values) return false;
    const fixed = node.variables.filter(variable => !conflictingBooleanVariables.has(variable))
      .map(variable => values[variable] ? { var: variable } : { not: { var: variable } });
    try { return solveBooleanConstraints(node.variables, [node.effective_formula, ...fixed]).result === 'unsatisfiable'; }
    catch { return false; }
  };
  const confirmedViolation = findings.some(item => violations.has(item.code)
    && (item.code !== 'BOOLEAN_BOUNDARY_VIOLATION' || confirmedBooleanViolation(item)));
  return response(confirmedViolation ? 'OUT_OF_BOUNDARY'
    : findings.length ? 'UNDETERMINED' : 'IN_BOUNDARY', findings, boundary, input);
}
