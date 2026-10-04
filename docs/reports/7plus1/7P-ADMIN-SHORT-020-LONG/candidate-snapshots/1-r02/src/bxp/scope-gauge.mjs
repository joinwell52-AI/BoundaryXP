import { digest } from './evaluate.mjs';
import { boundedJson } from './validation.mjs';
import { evaluateTypedBoundary } from './typed-boundary.mjs';
import { buildTypedEvidenceArtifacts } from '../product/typed-evidence-artifacts.mjs';
import { projectAllTaskNodeSemantics } from '../product/evidence-graph.mjs';
import { evaluateTaskNodeCalculations } from './task-node-calculations.mjs';
import { solveBooleanConstraints } from './boolean-solver.mjs';

const stateMap = Object.freeze({ invalid: 'invalid', inconsistent: 'conflict', underdetermined: 'uncertain', determined: 'determined' });

function clone(value) {
  return structuredClone(value);
}

function contingentActivation(node) {
  const guards = [node.when, node.unless === undefined ? undefined : { not: node.unless }]
    .filter(value => value !== undefined);
  if (!guards.length) return false;
  const activation = guards.length === 1 ? guards[0] : { all: guards };
  try {
    return solveBooleanConstraints(node.variables, [activation]).result === 'satisfiable'
      && solveBooleanConstraints(node.variables, [{ not: activation }]).result === 'satisfiable';
  } catch { return false; }
}

function reviewedConditionalEntries(graph, model, interpretationStatus) {
  const reviewed = new Set();
  if (interpretationStatus !== 'selected_canonical_boundary' || !model) return reviewed;
  const byUnit = new Map();
  for (const gap of graph.section_applicability_gaps) {
    if (!byUnit.has(gap.unit_id)) byUnit.set(gap.unit_id, []);
    byUnit.get(gap.unit_id).push(gap.section_role);
  }
  for (const [unitId, roles] of byUnit) {
    if (!roles.every(role => ['condition', 'exception'].includes(role))) continue;
    const unitGaps = graph.section_applicability_gaps.filter(gap => gap.unit_id === unitId);
    if (unitGaps.some(gap => !gap.evidence && ['condition', 'exception'].includes(gap.section_role)
      && !unitGaps.some(candidate => candidate.section_role === gap.section_role
        && candidate.reason === 'DOCUMENT_APPLICABILITY_NOT_ESTABLISHED' && candidate.evidence))) continue;
    const conditionSpans = unitGaps.filter(gap => ['condition', 'exception'].includes(gap.section_role)
      && gap.evidence).map(gap => gap.evidence);
    const cited = graph.edges.filter(edge => edge.type === 'supports' && edge.to === `semantic:${unitId}`)
      .flatMap(edge => edge.evidence);
    if (conditionSpans.some(condition => !cited.some(span => span.source_id === condition.source_id
      && span.start === condition.start && span.end === condition.end && span.quote === condition.quote))) continue;
    const semantic = graph.nodes.find(node => node.id === `semantic:${unitId}`);
    const formal = model.nodes.filter(node => node.entry_id === unitId);
    if (semantic?.status !== 'resolved' || !formal.length) continue;
    if (formal.every(node => ['obligation', 'prohibition', 'completion', 'constraint'].includes(node.operator)
      && contingentActivation(node)
      && roles.every(role => Object.hasOwn(node, role === 'condition' ? 'when' : 'unless')))) reviewed.add(unitId);
  }
  return reviewed;
}

function evidenceGraphProblems(request, graph, taskNodes) {
  if (!Array.isArray(taskNodes) || !boundedJson(taskNodes)) return [{ code: 'TASK_NODES_INVALID' }];
  if (graph === null || graph === undefined) return [{ code: 'EVIDENCE_GRAPH_MISSING' }];
  if (!boundedJson(graph) || !graph || typeof graph !== 'object'
    || graph.format !== 'boundx-evidence-graph/experimental-v1'
    || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges) || typeof graph.digest !== 'string') return [{ code: 'EVIDENCE_GRAPH_INVALID' }];
  const rehydrated = { ...graph };
  delete rehydrated.digest;
  if (digest(rehydrated) !== graph.digest) return [{ code: 'EVIDENCE_GRAPH_DIGEST_MISMATCH' }];
  try {
    const canonical = buildTypedEvidenceArtifacts(request, graph.producer);
    const problems = [];
    if (digest(taskNodes) !== digest(canonical.task_nodes)) problems.push({ code: 'TASK_NODES_REQUEST_MISMATCH' });
    if (graph.digest !== canonical.evidence_graph.digest) problems.push({ code: 'EVIDENCE_GRAPH_REQUEST_MISMATCH' });
    return problems;
  } catch {
    return [{ code: 'EVIDENCE_GRAPH_REQUEST_INVALID' }];
  }
}

export function evaluateScopeGauge(input, profile = null, trustedSelection = null, observePhase = null) {
  const validEnvelope = input !== null && typeof input === 'object' && !Array.isArray(input)
    && [Object.prototype, null].includes(Object.getPrototypeOf(input))
    && Object.hasOwn(input, 'request')
    && Reflect.ownKeys(input).every(key => typeof key === 'string'
      && ['request', 'evidence_graph', 'task_nodes'].includes(key)
      && Object.getOwnPropertyDescriptor(input, key).enumerable
      && Object.hasOwn(Object.getOwnPropertyDescriptor(input, key), 'value'));
  const { request, evidence_graph = null, task_nodes = [] } = validEnvelope ? input : {};
  observePhase?.('scope_gauge');
  const typed = evaluateTypedBoundary(request, profile, trustedSelection, observePhase);
  const graphProblems = validEnvelope ? evidenceGraphProblems(request, evidence_graph, task_nodes)
    : [{ code: 'SCOPE_GAUGE_INPUT_INVALID' }];
  const typedBoundary = typed.boundary_result;
  const graphVerified = graphProblems.length === 0;
  const state = typedBoundary.state === 'invalid' ? 'invalid'
    : !graphVerified ? 'insufficient' : stateMap[typedBoundary.state] ?? 'invalid';
  let coverage = [];
  let sourceCoverage = [];
  let applicability = [];
  let projectionGaps = [];
  let reviewedConditional = new Set();
  if (graphVerified) {
    coverage = evidence_graph.formal_coverage_gap;
    sourceCoverage = evidence_graph.source_coverage_gaps ?? [];
    reviewedConditional = reviewedConditionalEntries(evidence_graph, typed.compilation.model,
      typedBoundary.interpretation_resolution?.status);
    applicability = evidence_graph.section_applicability_gaps.filter(item => !reviewedConditional.has(item.unit_id));
    projectionGaps = evidence_graph.task_node_projection_gaps;
  }
  const taskNodeCalculations = graphVerified
    ? evaluateTaskNodeCalculations(task_nodes, evidence_graph, typed.compilation.model, reviewedConditional) : [];
  const nodeConflicts = taskNodeCalculations.flatMap(item => item.conflicts.map(conflict => ({ ...clone(conflict), task_node_id: item.task_node_id })));
  const nodeGaps = taskNodeCalculations.flatMap(item => item.gaps.map(gap => ({ ...clone(gap), task_node_id: item.task_node_id })));
  const applicableNodeIds = new Set(taskNodeCalculations.filter(item => item.effective_boundary)
    .flatMap(item => item.effective_boundary.source_bindings.map(binding => binding.formal_node_id)));
  const applicable = entries => graphVerified ? clone(entries.filter(entry => applicableNodeIds.has(entry.id))) : [];
  const computedState = state === 'invalid' || state === 'insufficient' ? state
    : nodeConflicts.length ? 'conflict'
    : applicability.length || coverage.length || sourceCoverage.length || projectionGaps.length ? 'uncertain'
    : state === 'conflict' ? 'uncertain'
    : nodeGaps.length && state === 'determined' ? 'uncertain' : state;
  const gaps = [...clone(typedBoundary.gaps), ...graphProblems,
    ...clone(coverage).map(item => ({ code: 'FORMAL_COVERAGE_GAP', ...item })),
    ...clone(sourceCoverage).map(item => ({ code: item.reason === 'DOCUMENT_CANDIDATE_NOT_MAPPED'
      ? 'SOURCE_BLOCK_NOT_MAPPED' : 'SOURCE_BLOCK_NOT_CLASSIFIED', ...item })),
    ...clone(applicability).map(item => ({ code: 'SECTION_APPLICABILITY_UNRESOLVED', ...item })),
    ...clone(projectionGaps).map(item => ({ code: 'TASK_NODE_PROJECTION_UNRESOLVED', ...item })), ...nodeGaps,
    ...(graphVerified && state === 'conflict' && !nodeConflicts.length
      ? [{ code: 'TYPED_CONFLICT_NOT_CONFIRMED_IN_TASK_SCOPE' }] : [])];
  const computed_boundary = {
    format: 'boundx-computed-boundary/experimental-v1',
    protocol_target: '0.4.0-draft.1',
    state: computedState,
    boundary_unique: computedState === 'determined',
    execution_path_unique: null,
    execution_path_uniqueness: 'not_evaluated',
    task_node_count: graphVerified ? task_nodes.length : 0,
    required: applicable(typedBoundary.required), allowed: applicable(typedBoundary.allowed),
    forbidden: applicable(typedBoundary.forbidden), limits: applicable(typedBoundary.limits),
    completion: applicable(typedBoundary.completion), relations: applicable(typedBoundary.relations),
    dependencies: applicable(typedBoundary.dependencies),
    conflicts: graphVerified ? nodeConflicts : [], gaps,
    formal_coverage_gap: clone(coverage),
    source_coverage_gaps: clone(sourceCoverage),
    section_applicability_gaps: clone(applicability),
    task_node_projection_gaps: clone(projectionGaps),
    uncompiled_entries: clone(typed.compilation.model?.uncompiled_entries ?? []),
    interpretation_space: {
      status: graphVerified ? typedBoundary.interpretation_resolution?.status ?? 'not_established' : 'not_established',
      canonical_digest: graphVerified ? typedBoundary.interpretation_resolution?.canonical_digest ?? null : null,
      alternatives_evaluated: false,
    },
    task_node_calculations: clone(taskNodeCalculations),
    task_node_semantics: graphVerified ? projectAllTaskNodeSemantics(evidence_graph) : [],
    evaluation_basis: graphVerified ? typedBoundary.evaluation_basis : 'evidence_graph_unverified',
    source_interpretation_correctness: 'not_proven',
    business_decision: null, execution_authorization: null,
  };
  const admissionReason = computedState === 'invalid' ? 'INPUT_INVALID'
    : computedState === 'conflict' ? 'MODEL_INCONSISTENT'
    : computedState === 'insufficient' ? 'BOUNDARY_INSUFFICIENT'
    : computedState === 'uncertain' ? 'BOUNDARY_UNDERDETERMINED' : 'RELEASE_PROFILE_MISSING';
  return { format: 'boundx-scope-gauge-analysis/experimental-v1', typed_analysis: typed,
    evidence_graph_digest: graphVerified ? evidence_graph.digest : null,
    task_nodes_digest: graphVerified ? digest(task_nodes) : null,
    computed_boundary, computed_boundary_digest: digest(computed_boundary),
    admission: { ...clone(typed.admission), reason: admissionReason }, business_decision: null, execution_authorization: null };
}
