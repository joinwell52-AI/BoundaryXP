import { createHash } from 'node:crypto';
import { boundedJson } from '../bxp/validation.mjs';
import { buildTaskNodes, conditionalHeadingContexts, locateTaskNodeForSpan, locateUnitTaskNode,
  sectionApplicabilityUnresolved } from './task-nodes.mjs';
import { documentLiteralBlockSpans, documentStructureSpans } from './nlp-syntax.mjs';
import { documentSemanticUnits } from './nlp-document-units.mjs';
import { deriveDocumentCoverageGaps } from './document-coverage.mjs';

const slots = new Set(['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B']);
const statuses = new Set(['resolved', 'unresolved', 'absent']);
const kinds = Object.freeze({ I: 'entity', O: 'artifact', A: 'action', P: 'role', R: 'constraint', V: 'reference', C: 'completion', B: 'prohibition' });
const semanticTypes = new Set(Object.values(kinds));
const nodeTypes = new Set(['task_node', 'evidence', 'unclassified_source_block', 'semantic_binding',
  'condition', 'exception', ...semanticTypes]);
const edgeTypes = new Set(['contains', 'supports', 'scoped_to', 'requires_mapping',
  'requires_classification', 'binds_to', 'guards', 'excepts', 'depends_on', 'conditions']);

const clone = value => structuredClone(value);
const codePoints = value => [...value];
const assertion = (value, code) => { if (!value) throw Error(code); };

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function graphDigest(value) {
  return createHash('sha256').update(stable(value)).digest('hex');
}

function verifiedGraph(graph) {
  assertion(boundedJson(graph) && graph?.format === 'boundx-evidence-graph/experimental-v1'
    && Array.isArray(graph.nodes) && Array.isArray(graph.edges)
    && typeof graph.digest === 'string'
    && graph.producer && typeof graph.producer === 'object' && !Array.isArray(graph.producer)
    && boundedJson(graph.producer)
    && graph.source_digests && typeof graph.source_digests === 'object'
    && Object.entries(graph.source_digests).every(([id, sha256]) => id.length > 0
      && typeof sha256 === 'string' && /^[a-f0-9]{64}$/u.test(sha256))
    && typeof graph.source_digests.task === 'string', 'EVIDENCE_GRAPH_DIFF_INPUT_INVALID');
  const body = { ...graph };
  delete body.digest;
  assertion(graphDigest(body) === graph.digest, 'EVIDENCE_GRAPH_DIFF_DIGEST_MISMATCH');
  const nodes = new Map();
  for (const node of graph.nodes) {
    assertion(node && typeof node.id === 'string' && node.id.length > 0 && !nodes.has(node.id)
      && nodeTypes.has(node.type), 'EVIDENCE_GRAPH_DIFF_NODE_INVALID');
    assertion(node.id.startsWith('semantic:')
      ? slots.has(node.slot) && node.type === kinds[node.slot] && node.id.length > 'semantic:'.length
        && statuses.has(node.status)
      : !slots.has(node.slot) && !semanticTypes.has(node.type),
    'EVIDENCE_GRAPH_DIFF_NODE_INVALID');
    if (node.type === 'evidence') assertion(Object.hasOwn(graph.source_digests, node.source_id),
      'EVIDENCE_GRAPH_DIFF_SOURCE_UNKNOWN');
    nodes.set(node.id, node);
  }
  for (const edge of graph.edges) assertion(edgeTypes.has(edge?.type)
    && nodes.has(edge?.from) && nodes.has(edge?.to),
    'EVIDENCE_GRAPH_DIFF_EDGE_INVALID');
  assertion(!hasDependencyCycle(graph.edges), 'EVIDENCE_GRAPH_DIFF_DEPENDENCY_CYCLE');
  for (const node of nodes.values()) if (node.type === 'evidence') {
    const links = graph.edges.filter(edge => edge.from === node.id);
    assertion(links.length === 1
      && ['supports', 'requires_mapping', 'requires_classification', 'conditions', 'excepts'].includes(links[0].type)
      && (links[0].type === 'supports' || ['conditions', 'excepts'].includes(links[0].type)
        ? slots.has(nodes.get(links[0].to)?.slot)
        : nodes.get(links[0].to)?.type === 'unclassified_source_block'),
    'EVIDENCE_GRAPH_DIFF_EVIDENCE_ORPHAN');
  }
  return nodes;
}

function edgeCounts(edges) {
  const counts = new Map();
  for (const edge of edges) {
    const key = stable(edge);
    counts.set(key, { edge, count: (counts.get(key)?.count ?? 0) + 1 });
  }
  return counts;
}

export function replayEvidenceGraph(graph, sources) {
  const nodes = verifiedGraph(graph);
  assertion(sources && typeof sources === 'object' && !Array.isArray(sources)
    && Object.keys(sources).length === Object.keys(graph.source_digests).length
    && Object.keys(sources).every(id => Object.hasOwn(graph.source_digests, id)),
  'EVIDENCE_GRAPH_REPLAY_SOURCES_INVALID');
  for (const [id, value] of Object.entries(sources)) assertion(typeof value === 'string'
    && createHash('sha256').update(value, 'utf8').digest('hex') === graph.source_digests[id],
  'EVIDENCE_GRAPH_REPLAY_SOURCE_MISMATCH');
  const sourceTaskNodes = buildTaskNodes(sources.task);
  const taskNodes = sourceTaskNodes;
  assertion([...nodes.values()].filter(node => node.type === 'task_node').length === sourceTaskNodes.length,
    'EVIDENCE_GRAPH_REPLAY_TASK_TREE_INVALID');
  for (const sourceNode of sourceTaskNodes) {
    const graphNode = nodes.get(`task:${sourceNode.id}`);
    const parentEdges = graph.edges.filter(edge => edge.type === 'contains' && edge.to === graphNode?.id);
    assertion(graphNode?.type === 'task_node'
      && stable(graphNode.span) === stable(sourceNode.span)
      && graphNode.parent_id === sourceNode.parent_id
      && graphNode.kind === sourceNode.kind
      && graphNode.section_role === sourceNode.section_role
      && graphNode.context_role === sourceNode.context_role
      && graphNode.number_hierarchy_status === sourceNode.number_hierarchy_status
      && (sourceNode.parent_id === null ? parentEdges.length === 0
        : parentEdges.length === 1 && parentEdges[0].from === `task:${sourceNode.parent_id}`
          && stable(parentEdges[0].evidence) === stable(sourceNode.heading_evidence)),
    'EVIDENCE_GRAPH_REPLAY_TASK_TREE_INVALID');
  }
  for (const node of nodes.values()) {
    if (node.type === 'evidence') verifyEvidence(sources, node);
    if (node.type === 'task_node') assertion(Number.isSafeInteger(node.span?.start)
      && Number.isSafeInteger(node.span?.end) && node.span.start >= 0
      && node.span.end > node.span.start && node.span.end <= codePoints(sources.task).length,
    'EVIDENCE_GRAPH_REPLAY_TASK_SPAN_INVALID');
  }
  for (const edge of graph.edges) {
    assertion(statuses.has(edge.status) && Array.isArray(edge.evidence)
      && edge.producer && typeof edge.producer === 'object' && !Array.isArray(edge.producer)
      && boundedJson(edge.producer)
      && Object.hasOwn(edge, 'rule_version')
      && (edge.rule_version === null || typeof edge.rule_version === 'string' && edge.rule_version.length > 0)
      && Object.hasOwn(edge, 'confidence')
      && (edge.confidence === null || typeof edge.confidence === 'number'
        && Number.isFinite(edge.confidence) && edge.confidence >= 0 && edge.confidence <= 1),
    'EVIDENCE_GRAPH_REPLAY_EDGE_INVALID');
    const deterministicProducer = edge.type === 'contains'
      ? { kind: 'deterministic-task-node-parser', version: 'experimental-v1' }
      : ['conditions', 'excepts'].includes(edge.type) && nodes.get(edge.from)?.type === 'evidence'
        ? { kind: 'deterministic-document-parser', version: 'experimental-v1' } : null;
    assertion(stable(edge.producer) === stable(deterministicProducer ?? graph.producer),
      'EVIDENCE_GRAPH_REPLAY_PRODUCER_MISMATCH');
    for (const item of edge.evidence) verifyEvidence(sources, item);
    if (edge.type === 'supports') {
      const evidence = nodes.get(edge.from), semantic = nodes.get(edge.to);
      assertion(evidence?.type === 'evidence' && semantic?.slot && edge.status === semantic.status
        && edge.evidence.length === 1 && stable(edge.evidence[0]) === stable({ source_id: evidence.source_id,
          start: evidence.start, end: evidence.end, quote: evidence.quote }),
      'EVIDENCE_GRAPH_REPLAY_SUPPORT_INVALID');
    }
    if (edge.type === 'scoped_to') {
      const target = nodes.get(edge.to), origin = nodes.get(edge.from);
      assertion(target?.type === 'task_node' && edge.task_node_id === target.task_node_id
        && (origin?.slot || origin?.type === 'unclassified_source_block')
        && edge.status === origin.status
        && edge.evidence.length === 1 && edge.evidence[0].source_id === 'task'
        && (origin?.type === 'unclassified_source_block' || graph.edges.some(support => support.type === 'supports'
          && support.to === origin?.id && stable(support.evidence) === stable(edge.evidence)))
        && locateTaskNodeForSpan(taskNodes, edge.evidence[0])?.id === target.task_node_id,
      'EVIDENCE_GRAPH_REPLAY_SCOPE_INVALID');
    }
    if (edge.type === 'contains') {
      const parent = nodes.get(edge.from), child = nodes.get(edge.to);
      assertion(parent?.type === 'task_node' && child?.type === 'task_node'
        && child.parent_id === parent.task_node_id
        && edge.status === (child.number_hierarchy_status === 'parent_unresolved' ? 'unresolved' : 'resolved')
        && parent.span.start <= child.span.start && parent.span.end >= child.span.end
        && edge.evidence.every(item => item.source_id === 'task'
          && item.start >= child.span.start && item.end <= child.span.end),
      'EVIDENCE_GRAPH_REPLAY_PARENT_INVALID');
    }
    if (edge.type === 'depends_on') {
      const origin = nodes.get(edge.from), target = nodes.get(edge.to);
      const evidence = graph.edges.filter(item => item.type === 'supports' && item.to === edge.from)
        .map(item => item.evidence[0]);
      assertion(slots.has(origin?.slot) && slots.has(target?.slot)
        && edge.status === 'unresolved' && edge.rule_version === 'producer_declared_dependency/experimental-v1'
        && stable(edge.evidence) === stable(evidence),
      'EVIDENCE_GRAPH_REPLAY_DEPENDENCY_INVALID');
    }
  }
  assertion(graph.task_node_projections && typeof graph.task_node_projections === 'object'
    && !Array.isArray(graph.task_node_projections)
    && Object.keys(graph.task_node_projections).length === taskNodes.length,
  'EVIDENCE_GRAPH_REPLAY_PROJECTION_INVALID');
  const supports = new Map();
  for (const edge of graph.edges.filter(item => item.type === 'supports')) {
    if (!supports.has(edge.to)) supports.set(edge.to, []);
    supports.get(edge.to).push(edge.evidence[0]);
  }
  for (const semantic of graph.nodes.filter(node => slots.has(node.slot) && node.status === 'resolved')) {
    assertion((supports.get(semantic.id)?.length ?? 0) > 0, 'EVIDENCE_GRAPH_REPLAY_SUPPORT_REQUIRED');
  }
  for (const binding of graph.nodes.filter(node => node.type === 'semantic_binding')) {
    const links = graph.edges.filter(edge => edge.type === 'binds_to' && edge.to === binding.id);
    const link = links[0];
    const semantic = nodes.get(link?.from);
    assertion(links.length === 1 && semantic && slots.has(semantic.slot)
      && binding.id.startsWith(`binding:${semantic.id.slice('semantic:'.length)}:`)
      && (binding.binding_id === null || binding.id === `binding:${semantic.id.slice('semantic:'.length)}:${binding.binding_id}`)
      && binding.status === link.status && binding.rule_version === link.rule_version
      && binding.confidence === link.confidence
      && stable(binding.model_resource) === stable(link.model_resource)
      && (binding.status !== 'resolved' || semantic.status === 'resolved')
      && stable(link.evidence) === stable(supports.get(semantic.id) ?? []),
    'EVIDENCE_GRAPH_REPLAY_BINDING_INVALID');
  }
  for (const edge of graph.edges.filter(item => item.type === 'binds_to')) assertion(
    nodes.get(edge.to)?.type === 'semantic_binding' && slots.has(nodes.get(edge.from)?.slot),
    'EVIDENCE_GRAPH_REPLAY_BINDING_INVALID');
  for (const guard of graph.nodes.filter(node => ['condition', 'exception'].includes(node.type))) {
    const type = guard.type === 'condition' ? 'guards' : 'excepts';
    const links = graph.edges.filter(edge => edge.type === type && edge.from === guard.id);
    const link = links[0];
    const binding = nodes.get(link?.to);
    const source = graph.edges.find(edge => edge.type === 'binds_to' && edge.to === binding?.id);
    assertion(links.length === 1 && binding?.type === 'semantic_binding'
      && guard.id === `${binding.id}:${guard.type === 'condition' ? 'when' : 'unless'}`
      && guard.status === 'unresolved' && link.status === 'unresolved'
      && link.rule_version === binding.rule_version
      && stable(link.evidence) === stable(source?.evidence),
    'EVIDENCE_GRAPH_REPLAY_GUARD_INVALID');
  }
  for (const edge of graph.edges.filter(item => ['guards', 'excepts'].includes(item.type))) assertion(
    (nodes.get(edge.from)?.type === (edge.type === 'guards' ? 'condition' : 'exception')
      && nodes.get(edge.to)?.type === 'semantic_binding')
      || (edge.type === 'excepts' && nodes.get(edge.from)?.type === 'evidence'
        && slots.has(nodes.get(edge.to)?.slot)),
    'EVIDENCE_GRAPH_REPLAY_GUARD_INVALID');
  for (const edge of graph.edges.filter(item => item.type === 'conditions'
    || item.type === 'excepts' && nodes.get(item.from)?.type === 'evidence')) {
    const evidence = nodes.get(edge.from);
    assertion(evidence?.type === 'evidence' && slots.has(nodes.get(edge.to)?.slot)
      && edge.status === 'unresolved' && edge.rule_version === 'document_applicability/experimental-v1'
      && edge.producer?.kind === 'deterministic-document-parser'
      && edge.evidence.length === 1
      && stable(edge.evidence[0]) === stable({ source_id: evidence.source_id,
        start: evidence.start, end: evidence.end, quote: evidence.quote }),
    'EVIDENCE_GRAPH_REPLAY_APPLICABILITY_INVALID');
  }
  const expectedProjections = Object.fromEntries(taskNodes.map(node => [node.id,
    Object.fromEntries([...slots].map(slot => [slot, []]))]));
  for (const semantic of graph.nodes.filter(node => slots.has(node.slot))) {
    const projected = locateUnitTaskNode(taskNodes, supports.get(semantic.id) ?? []);
    if (projected) expectedProjections[projected.id][semantic.slot].push(semantic.id.slice('semantic:'.length));
  }
  for (const [taskNodeId, projection] of Object.entries(graph.task_node_projections)) {
    assertion(nodes.get(`task:${taskNodeId}`)?.type === 'task_node' && projection
      && typeof projection === 'object' && !Array.isArray(projection)
      && Object.keys(projection).length === slots.size,
    'EVIDENCE_GRAPH_REPLAY_PROJECTION_INVALID');
    for (const slot of slots) {
      const entries = projection[slot];
      assertion(Array.isArray(entries) && new Set(entries).size === entries.length
        && entries.every(id => nodes.get(`semantic:${id}`)?.slot === slot
          && graph.edges.some(edge => edge.type === 'scoped_to'
            && edge.from === `semantic:${id}` && edge.to === `task:${taskNodeId}`))
        && stable([...entries].sort()) === stable(expectedProjections[taskNodeId][slot].sort()),
      'EVIDENCE_GRAPH_REPLAY_PROJECTION_INVALID');
    }
  }
  const expectedProjectionGaps = [];
  const expectedFormalGaps = [];
  for (const semantic of graph.nodes.filter(node => slots.has(node.slot))) {
    const evidence = supports.get(semantic.id) ?? [];
    if (!locateUnitTaskNode(taskNodes, evidence) && evidence.length) {
      expectedProjectionGaps.push({ unit_id: semantic.id.slice('semantic:'.length), slot: semantic.slot,
        reason: 'TASK_NODE_PROJECTION_UNRESOLVED', task_node_ids: [...new Set(evidence
          .map(span => locateTaskNodeForSpan(taskNodes, span)?.id ?? null))].filter(Boolean).sort() });
    }
    if (semantic.status !== 'absent' && semantic.formal_status !== 'compiled') {
      expectedFormalGaps.push({ unit_id: semantic.id.slice('semantic:'.length), slot: semantic.slot,
        reason: 'FORMALIZATION_NOT_COMPILED' });
    }
  }
  assertion(stable(graph.task_node_projection_gaps) === stable(expectedProjectionGaps),
    'EVIDENCE_GRAPH_REPLAY_PROJECTION_GAP_INVALID');
  assertion(stable(graph.formal_coverage_gap) === stable(expectedFormalGaps),
    'EVIDENCE_GRAPH_REPLAY_FORMAL_GAP_INVALID');
  const unmapped = graph.nodes.filter(node => node.type === 'unclassified_source_block');
  assertion(Array.isArray(graph.source_coverage_gaps)
    && graph.source_coverage_gaps.length === unmapped.length,
  'EVIDENCE_GRAPH_REPLAY_SOURCE_GAP_INVALID');
  for (const [index, gap] of graph.source_coverage_gaps.entries()) {
    verifyEvidence(sources, gap.evidence);
    if (gap.candidate_evidence !== undefined) {
      assertion(gap.candidate_slot !== undefined && Array.isArray(gap.candidate_evidence)
        && gap.candidate_evidence.length > 0
        && stable(gap.candidate_evidence[0]) === stable(gap.evidence),
      'EVIDENCE_GRAPH_REPLAY_SOURCE_GAP_INVALID');
      for (const item of gap.candidate_evidence) verifyEvidence(sources, item);
    }
    const origin = nodes.get(`unmapped-evidence:${index}`);
    const link = graph.edges.filter(edge => edge.from === origin?.id && edge.to === gap.id);
    assertion(gap.id === `unmapped:${index}` && nodes.get(gap.id)?.type === 'unclassified_source_block'
      && ['DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED', 'DOCUMENT_OUTPUT_CONTENT_MISSING', 'DOCUMENT_CANDIDATE_NOT_MAPPED',
        'SOURCE_COVERAGE_NOT_ESTABLISHED'].includes(gap.reason)
      && (gap.candidate_slot === undefined || gap.reason === 'DOCUMENT_CANDIDATE_NOT_MAPPED'
        && slots.has(gap.candidate_slot))
      && gap.candidate_slot === nodes.get(gap.id)?.candidate_slot
      && origin?.type === 'evidence' && stable(gap.evidence) === stable({ source_id: origin.source_id,
        start: origin.start, end: origin.end, quote: origin.quote })
      && gap.task_node_id === (locateTaskNodeForSpan(taskNodes, gap.evidence)?.id ?? null)
      && link.length === 1 && link[0].type === (gap.reason === 'DOCUMENT_CANDIDATE_NOT_MAPPED'
        ? 'requires_mapping' : 'requires_classification')
      && link[0].status === 'unresolved' && stable(link[0].evidence) === stable([gap.evidence]),
    'EVIDENCE_GRAPH_REPLAY_SOURCE_GAP_INVALID');
  }
  const expectedOutputGaps = (documentSemanticUnits(sources.task)?.diagnostics ?? [])
    .filter(item => item.code === 'DOCUMENT_OUTPUT_CONTENT_MISSING')
    .map(item => stable(item.evidence[0])).sort();
  const submittedOutputGaps = graph.source_coverage_gaps
    .filter(item => item.reason === 'DOCUMENT_OUTPUT_CONTENT_MISSING')
    .map(item => stable(item.evidence)).sort();
  assertion(stable(submittedOutputGaps) === stable(expectedOutputGaps),
    'EVIDENCE_GRAPH_REPLAY_SOURCE_GAP_INVALID');
  if (graph.producer.producer_kind === 'local-nlp') {
    const sourceUnits = graph.nodes.filter(node => slots.has(node.slot)).map(node => ({ slot: node.slot,
      status: node.status,
      evidence: supports.get(node.id) ?? [] }));
    const expectedCoverage = deriveDocumentCoverageGaps(sources.task, sourceUnits);
    const submittedCoverage = graph.source_coverage_gaps.map(gap => ({ evidence: gap.evidence,
      reason: gap.reason,
      ...(gap.candidate_slot === undefined ? {} : { candidate_slot: gap.candidate_slot }),
      ...(gap.candidate_evidence === undefined ? {} : { candidate_evidence: gap.candidate_evidence }) }));
    assertion(stable(submittedCoverage) === stable(expectedCoverage),
      'EVIDENCE_GRAPH_REPLAY_SOURCE_GAP_INVALID');
  }
  assertion(Array.isArray(graph.section_applicability_gaps), 'EVIDENCE_GRAPH_REPLAY_APPLICABILITY_GAP_INVALID');
  const protectedSpans = [...documentStructureSpans(sources.task).filter(span => span.kind === 'frontmatter')
    .map(span => ({ ...span, role: 'metadata' })), ...documentLiteralBlockSpans(sources.task)
    .map(span => ({ ...span, role: 'literal' }))];
  const seenApplicabilityGaps = new Set();
  for (const gap of graph.section_applicability_gaps) {
    if (gap.evidence) verifyEvidence(sources, gap.evidence);
    const semantic = nodes.get(`semantic:${gap.unit_id}`);
    const evidence = supports.get(semantic?.id) ?? [];
    const projected = locateUnitTaskNode(taskNodes, evidence);
    const section = taskNodes.find(node => node.id === gap.task_node_id);
    const sectionApplies = section && sectionApplicabilityUnresolved(section.context_role)
      && (projected?.id === section.id || !projected && evidence.some(span =>
        locateTaskNodeForSpan(taskNodes, span)?.id === section.id))
      && (['condition', 'exception'].includes(section.context_role)
        ? (conditionalHeadingContexts(taskNodes, section).length
          ? conditionalHeadingContexts(taskNodes, section)
          : [{ role: section.context_role, evidence: null }]).some(context =>
          gap.section_role === context.role && stable(gap.evidence ?? null) === stable(context.evidence))
        : gap.section_role === section.context_role && !gap.evidence);
    const protectedApplies = gap.evidence && evidence.some(span => stable(span) === stable(gap.evidence))
      && gap.evidence.source_id === 'task'
      && locateTaskNodeForSpan(taskNodes, gap.evidence)?.id === gap.task_node_id
      && protectedSpans.some(span => span.role === gap.section_role
        && gap.evidence.start < span.end && gap.evidence.end > span.start);
    const documentApplies = gap.evidence && ['condition', 'exception'].includes(gap.section_role)
      && graph.edges.some(edge =>
      edge.type === (gap.section_role === 'condition' ? 'conditions' : 'excepts')
        && edge.to === semantic?.id && nodes.get(edge.from)?.type === 'evidence'
        && stable(edge.evidence) === stable([gap.evidence]))
      && locateTaskNodeForSpan(taskNodes, evidence[0] ?? {})?.id === gap.task_node_id;
    const justified = gap.reason === 'DOCUMENT_APPLICABILITY_NOT_ESTABLISHED'
      ? documentApplies : ['metadata', 'literal'].includes(gap.section_role)
        ? protectedApplies : sectionApplies;
    const gapKey = stable(gap);
    assertion(slots.has(gap.slot) && nodes.get(`semantic:${gap.unit_id}`)?.slot === gap.slot
      && nodes.get(`task:${gap.task_node_id}`)?.type === 'task_node'
      && ['SECTION_APPLICABILITY_NOT_ESTABLISHED', 'DOCUMENT_APPLICABILITY_NOT_ESTABLISHED'].includes(gap.reason)
      && ['background', 'example', 'out_of_scope', 'condition', 'exception', 'metadata', 'literal'].includes(gap.section_role)
      && (!['metadata', 'literal'].includes(gap.section_role) || gap.evidence
        && gap.evidence.source_id === 'task' && protectedSpans.some(span => span.role === gap.section_role
          && gap.evidence.start < span.end && gap.evidence.end > span.start)
        && gap.reason === 'SECTION_APPLICABILITY_NOT_ESTABLISHED'
        && gap.task_node_id === locateTaskNodeForSpan(taskNodes, gap.evidence)?.id)
      && justified && !seenApplicabilityGaps.has(gapKey),
    'EVIDENCE_GRAPH_REPLAY_APPLICABILITY_GAP_INVALID');
    seenApplicabilityGaps.add(gapKey);
  }
  for (const semantic of graph.nodes.filter(node => slots.has(node.slot) && node.status !== 'absent')) {
    const evidence = supports.get(semantic.id) ?? [];
    for (const span of evidence.filter(item => item.source_id === 'task')) {
      const roles = new Set(protectedSpans.filter(protectedSpan => span.start < protectedSpan.end
        && span.end > protectedSpan.start).map(protectedSpan => protectedSpan.role));
      for (const role of roles) assertion(graph.section_applicability_gaps.some(gap =>
        gap.unit_id === semantic.id.slice('semantic:'.length) && gap.slot === semantic.slot
        && gap.section_role === role && stable(gap.evidence) === stable(span)),
      'EVIDENCE_GRAPH_REPLAY_APPLICABILITY_GAP_INVALID');
    }
    const projected = locateUnitTaskNode(taskNodes, evidence);
    const applicable = projected && sectionApplicabilityUnresolved(projected.context_role)
      ? [projected] : projected ? [] : evidence.map(span => locateTaskNodeForSpan(taskNodes, span))
        .filter(node => node && sectionApplicabilityUnresolved(node.context_role));
    for (const section of applicable) {
      const contexts = ['condition', 'exception'].includes(section.context_role)
        ? conditionalHeadingContexts(taskNodes, section) : [];
      for (const context of contexts.length ? contexts : [{ role: section.context_role, evidence: null }]) assertion(
        graph.section_applicability_gaps.some(gap => gap.unit_id === semantic.id.slice('semantic:'.length)
          && gap.slot === semantic.slot && gap.task_node_id === section.id
          && gap.section_role === context.role && gap.reason === 'SECTION_APPLICABILITY_NOT_ESTABLISHED'
          && stable(gap.evidence ?? null) === stable(context.evidence)),
      'EVIDENCE_GRAPH_REPLAY_APPLICABILITY_GAP_INVALID');
    }
  }
  for (const edge of graph.edges.filter(item => item.type === 'conditions'
    || item.type === 'excepts' && nodes.get(item.from)?.type === 'evidence')) {
    const evidence = supports.get(edge.to)?.[0];
    const section = locateTaskNodeForSpan(taskNodes, evidence ?? {});
    assertion(section && graph.section_applicability_gaps.some(gap =>
      gap.unit_id === edge.to.slice('semantic:'.length) && gap.slot === nodes.get(edge.to)?.slot
      && gap.task_node_id === section.id
      && gap.section_role === (edge.type === 'conditions' ? 'condition' : 'exception')
      && stable(gap.evidence) === stable(edge.evidence[0])),
    'EVIDENCE_GRAPH_REPLAY_APPLICABILITY_GAP_INVALID');
  }
  assertion(!hasDependencyCycle(graph.edges), 'EVIDENCE_GRAPH_REPLAY_DEPENDENCY_CYCLE');
  return { integrity: 'verified', graph_digest: graph.digest, source_digests: clone(graph.source_digests) };
}

export function compareEvidenceGraphs(before, after, { beforeSources, afterSources } = {}) {
  assertion((beforeSources === undefined) === (afterSources === undefined), 'EVIDENCE_GRAPH_DIFF_REPLAY_PAIR_REQUIRED');
  if (beforeSources !== undefined) {
    replayEvidenceGraph(before, beforeSources);
    replayEvidenceGraph(after, afterSources);
  }
  const previousNodes = verifiedGraph(before);
  const currentNodes = verifiedGraph(after);
  const ids = [...new Set([...previousNodes.keys(), ...currentNodes.keys()])].sort();
  const previousEdges = edgeCounts(before.edges);
  const currentEdges = edgeCounts(after.edges);
  const edgeKeys = [...new Set([...previousEdges.keys(), ...currentEdges.keys()])].sort();
  const changedSections = ['source_id', 'producer', 'task_node_projections', 'task_node_projection_gaps',
    'formal_coverage_gap', 'section_applicability_gaps', 'source_coverage_gaps', 'source_digests']
    .filter(key => stable(before[key]) !== stable(after[key]));
  return { format: 'boundx-evidence-graph-diff/experimental-v1',
    before_digest: before.digest, after_digest: after.digest,
    changed: before.digest !== after.digest,
    added_node_ids: ids.filter(id => !previousNodes.has(id)),
    removed_node_ids: ids.filter(id => !currentNodes.has(id)),
    changed_nodes: ids.filter(id => previousNodes.has(id) && currentNodes.has(id)
      && stable(previousNodes.get(id)) !== stable(currentNodes.get(id))).map(id => ({ id,
      before_digest: graphDigest(previousNodes.get(id)), after_digest: graphDigest(currentNodes.get(id)) })),
    added_edges: edgeKeys.flatMap(key => Array.from({ length: Math.max(0,
      (currentEdges.get(key)?.count ?? 0) - (previousEdges.get(key)?.count ?? 0)) },
    () => clone(currentEdges.get(key).edge))),
    removed_edges: edgeKeys.flatMap(key => Array.from({ length: Math.max(0,
      (previousEdges.get(key)?.count ?? 0) - (currentEdges.get(key)?.count ?? 0)) },
    () => clone(previousEdges.get(key).edge))),
    changed_sections: changedSections,
    source_replay: beforeSources === undefined ? 'not_evaluated_compare_only' : 'verified',
  };
}

function verifyEvidence(sources, evidence) {
  assertion(evidence && typeof evidence === 'object', 'EVIDENCE_GRAPH_EVIDENCE_REQUIRED');
  assertion(typeof evidence.source_id === 'string' && typeof sources[evidence.source_id] === 'string', 'EVIDENCE_GRAPH_SOURCE_UNKNOWN');
  assertion(Number.isSafeInteger(evidence.start) && Number.isSafeInteger(evidence.end)
    && evidence.start >= 0 && evidence.end > evidence.start
    && evidence.end <= codePoints(sources[evidence.source_id]).length,
    'EVIDENCE_GRAPH_SPAN_INVALID');
  assertion(codePoints(sources[evidence.source_id]).slice(evidence.start, evidence.end).join('') === evidence.quote, 'EVIDENCE_GRAPH_QUOTE_MISMATCH');
}

function hasDependencyCycle(edges) {
  const adjacency = new Map();
  const indegree = new Map();
  for (const edge of edges.filter(item => item.type === 'depends_on')) {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
    adjacency.get(edge.from).push(edge.to);
    if (!indegree.has(edge.from)) indegree.set(edge.from, 0);
    indegree.set(edge.to, (indegree.get(edge.to) ?? 0) + 1);
  }
  const ready = [...indegree].filter(([, count]) => count === 0).map(([id]) => id);
  let visited = 0;
  for (let index = 0; index < ready.length; index++) {
    const current = ready[index];
    visited += 1;
    for (const target of adjacency.get(current) ?? []) {
      const count = indegree.get(target) - 1;
      indegree.set(target, count);
      if (count === 0) ready.push(target);
    }
  }
  return visited !== indegree.size;
}

export function buildEvidenceGraph({ text, sources = { task: text }, task_nodes, units, bindings = [], unmappedBlocks = [],
  conditionalEvidence = [], producer = {} }) {
  assertion(typeof text === 'string' && text.length > 0, 'EVIDENCE_GRAPH_SOURCE_REQUIRED');
  assertion(producer && typeof producer === 'object' && !Array.isArray(producer)
    && boundedJson(producer), 'EVIDENCE_GRAPH_PRODUCER_INVALID');
  assertion(sources && typeof sources === 'object' && sources.task === text, 'EVIDENCE_GRAPH_TASK_SOURCE_INVALID');
  const source_digests = Object.fromEntries(Object.entries(sources).map(([id, value]) => {
    assertion(id.length > 0 && typeof value === 'string', 'EVIDENCE_GRAPH_SOURCE_INVALID');
    return [id, createHash('sha256').update(value, 'utf8').digest('hex')];
  }));
  assertion(Array.isArray(task_nodes) && task_nodes.length > 0, 'EVIDENCE_GRAPH_TASK_NODES_REQUIRED');
  assertion(Array.isArray(units), 'EVIDENCE_GRAPH_UNITS_REQUIRED');
  assertion(Array.isArray(unmappedBlocks), 'EVIDENCE_GRAPH_UNMAPPED_BLOCKS_INVALID');
  assertion(Array.isArray(conditionalEvidence), 'EVIDENCE_GRAPH_CONDITIONAL_EVIDENCE_INVALID');
  for (const item of conditionalEvidence) {
    assertion(['condition', 'exception'].includes(item?.role), 'EVIDENCE_GRAPH_CONDITIONAL_EVIDENCE_INVALID');
    verifyEvidence(sources, item.evidence);
    assertion(item.evidence.source_id === 'task', 'EVIDENCE_GRAPH_CONDITIONAL_EVIDENCE_INVALID');
    verifyEvidence(sources, item.applies_to);
    assertion(item.applies_to.source_id === 'task', 'EVIDENCE_GRAPH_CONDITIONAL_EVIDENCE_INVALID');
  }
  const ids = new Set();
  const taskLength = codePoints(text).length;
  const nodes = task_nodes.map(node => {
    assertion(typeof node.id === 'string' && node.id.length > 0 && !ids.has(`task:${node.id}`), 'EVIDENCE_GRAPH_TASK_NODE_INVALID');
    assertion(node.span && Number.isSafeInteger(node.span.start) && Number.isSafeInteger(node.span.end)
      && node.span.start >= 0 && node.span.end > node.span.start && node.span.end <= taskLength,
    'EVIDENCE_GRAPH_TASK_SPAN_INVALID');
    ids.add(`task:${node.id}`);
    return { id: `task:${node.id}`, type: 'task_node', task_node_id: node.id, span: clone(node.span),
      parent_id: node.parent_id ?? null, kind: node.kind ?? null, section_role: node.section_role ?? null,
      context_role: node.context_role ?? null, number_hierarchy_status: node.number_hierarchy_status ?? null };
  });
  const edges = [];
  const provenance = (status, evidence, ruleVersion, confidence = null) => {
    assertion(confidence === null || typeof confidence === 'number' && Number.isFinite(confidence)
      && confidence >= 0 && confidence <= 1, 'EVIDENCE_GRAPH_CONFIDENCE_INVALID');
    return { status, evidence: clone(evidence), producer: clone(producer), rule_version: ruleVersion, confidence };
  };
  const taskNodeIndex = new Map(task_nodes.map(node => [node.id, node]));
  for (const node of task_nodes) if (node.parent_id !== null && node.parent_id !== undefined) {
    const visited = new Set([node.id]);
    let ancestorId = node.parent_id;
    while (ancestorId !== null && ancestorId !== undefined) {
      assertion(!visited.has(ancestorId), 'EVIDENCE_GRAPH_TASK_PARENT_CYCLE');
      visited.add(ancestorId);
      ancestorId = taskNodeIndex.get(ancestorId)?.parent_id;
    }
    const parent = taskNodeIndex.get(node.parent_id);
    assertion(parent && parent !== node && parent.span.start <= node.span.start
      && parent.span.end >= node.span.end, 'EVIDENCE_GRAPH_TASK_PARENT_INVALID');
    const headingEvidence = node.heading_evidence ?? [];
    assertion(Array.isArray(headingEvidence), 'EVIDENCE_GRAPH_TASK_PARENT_INVALID');
    for (const item of headingEvidence) {
      verifyEvidence(sources, item);
      assertion(item.source_id === 'task' && item.start >= node.span.start && item.end <= node.span.end,
        'EVIDENCE_GRAPH_TASK_PARENT_INVALID');
    }
    edges.push({ from: `task:${parent.id}`, to: `task:${node.id}`, type: 'contains',
      ...provenance(node.number_hierarchy_status === 'parent_unresolved' ? 'unresolved' : 'resolved',
        headingEvidence, 'task_node_parent/experimental-v1',
        node.number_hierarchy_status === 'parent_unresolved' ? null : 1),
      producer: { kind: 'deterministic-task-node-parser', version: 'experimental-v1' } });
  }
  const unitIndex = new Map();
  for (const unit of units) {
    assertion(unit && typeof unit === 'object' && typeof unit.id === 'string' && unit.id.length > 0, 'EVIDENCE_GRAPH_UNIT_ID_REQUIRED');
    assertion(slots.has(unit.slot), 'EVIDENCE_GRAPH_SLOT_INVALID');
    assertion(statuses.has(unit.status), 'EVIDENCE_GRAPH_STATUS_INVALID');
    assertion(!unitIndex.has(unit.id), 'EVIDENCE_GRAPH_DUPLICATE_UNIT');
    unitIndex.set(unit.id, unit);
    const semanticId = `semantic:${unit.id}`;
    nodes.push({ id: semanticId, type: kinds[unit.slot], slot: unit.slot, status: unit.status,
      text: unit.text ?? null, formal_status: unit.formal_status ?? 'uncompiled', producer: clone(producer) });
    const evidence = unit.evidence ?? [];
    assertion(Array.isArray(evidence), 'EVIDENCE_GRAPH_EVIDENCE_INVALID');
    if (unit.status === 'resolved') assertion(evidence.length > 0, 'EVIDENCE_GRAPH_RESOLVED_EVIDENCE_REQUIRED');
    const unitTaskNode = locateUnitTaskNode(task_nodes, evidence);
    for (let index = 0; index < evidence.length; index += 1) {
      const item = evidence[index];
      verifyEvidence(sources, item);
      const taskNode = locateTaskNodeForSpan(task_nodes, item);
      const evidenceId = `evidence:${unit.id}:${index}`;
      nodes.push({ id: evidenceId, type: 'evidence', source_id: item.source_id, start: item.start, end: item.end, quote: item.quote });
      edges.push({ from: evidenceId, to: semanticId, type: 'supports',
        ...provenance(unit.status, [item], 'producer_assertion/experimental-v1', unit.confidence ?? null) });
      if (taskNode && (!unitTaskNode || taskNode.id === unitTaskNode.id)) edges.push({ from: semanticId, to: `task:${taskNode.id}`,
        type: 'scoped_to', task_node_id: taskNode.id,
        ...provenance(unit.status, [item], 'source_span_containment/experimental-v1', 1) });
    }
  }
  const source_coverage_gaps = unmappedBlocks.map((block, index) => {
    const evidence = block?.evidence ?? block;
    const reason = block?.reason ?? 'DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED';
    assertion(['DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED', 'DOCUMENT_OUTPUT_CONTENT_MISSING', 'DOCUMENT_CANDIDATE_NOT_MAPPED',
      'SOURCE_COVERAGE_NOT_ESTABLISHED'].includes(reason), 'EVIDENCE_GRAPH_UNMAPPED_REASON_INVALID');
    const candidateSlot = block?.candidate_slot;
    assertion(candidateSlot === undefined || reason === 'DOCUMENT_CANDIDATE_NOT_MAPPED'
      && slots.has(candidateSlot), 'EVIDENCE_GRAPH_UNMAPPED_SLOT_INVALID');
    const candidateEvidence = block?.candidate_evidence;
    assertion(candidateEvidence === undefined || candidateSlot !== undefined
      && Array.isArray(candidateEvidence) && candidateEvidence.length > 0
      && stable(candidateEvidence[0]) === stable(evidence), 'EVIDENCE_GRAPH_UNMAPPED_EVIDENCE_INVALID');
    verifyEvidence(sources, evidence);
    for (const item of candidateEvidence ?? []) verifyEvidence(sources, item);
    assertion(evidence.source_id === 'task', 'EVIDENCE_GRAPH_UNMAPPED_SOURCE_INVALID');
    const id = `unmapped:${index}`;
    const evidenceId = `unmapped-evidence:${index}`;
    const taskNode = locateTaskNodeForSpan(task_nodes, evidence);
    nodes.push({ id, type: 'unclassified_source_block', status: 'unresolved',
      ...(candidateSlot === undefined ? {} : { candidate_slot: candidateSlot }) },
      { id: evidenceId, type: 'evidence', source_id: evidence.source_id,
        start: evidence.start, end: evidence.end, quote: evidence.quote });
    edges.push({ from: evidenceId, to: id, type: reason === 'DOCUMENT_CANDIDATE_NOT_MAPPED' ? 'requires_mapping' : 'requires_classification',
      ...provenance('unresolved', [evidence], 'document_block_mapping/experimental-v1') });
    if (taskNode) edges.push({ from: id, to: `task:${taskNode.id}`, type: 'scoped_to', task_node_id: taskNode.id,
      ...provenance('unresolved', [evidence], 'source_span_containment/experimental-v1', 1) });
    return { id, reason, task_node_id: taskNode?.id ?? null,
      ...(candidateSlot === undefined ? {} : { candidate_slot: candidateSlot }),
      ...(candidateEvidence === undefined ? {} : { candidate_evidence: clone(candidateEvidence) }),
      evidence: clone(evidence) };
  });
  for (const [index, binding] of bindings.entries()) {
    assertion(binding && typeof binding.unit_id === 'string' && typeof binding.semantic_id === 'string', 'EVIDENCE_GRAPH_BINDING_INVALID');
    assertion(unitIndex.has(binding.unit_id), 'EVIDENCE_GRAPH_BINDING_UNIT_UNKNOWN');
    const status = binding.status ?? 'unresolved';
    assertion(statuses.has(status), 'EVIDENCE_GRAPH_BINDING_STATUS_INVALID');
    assertion(status !== 'resolved' || unitIndex.get(binding.unit_id).status === 'resolved',
      'EVIDENCE_GRAPH_BINDING_SOURCE_UNRESOLVED');
    const id = `binding:${binding.unit_id}:${binding.binding_id ?? index}`;
    nodes.push({ id, type: 'semantic_binding', binding_id: binding.binding_id ?? null,
      semantic_id: binding.semantic_id, status,
      rule_version: binding.rule_version ?? null, model_resource: binding.model_resource ?? null, confidence: binding.confidence ?? null });
    edges.push({ from: `semantic:${binding.unit_id}`, to: id, type: 'binds_to',
      ...provenance(status, unitIndex.get(binding.unit_id).evidence ?? [], binding.rule_version ?? null,
        binding.confidence ?? null), model_resource: binding.model_resource ?? null });
    for (const guard of ['when', 'unless']) if (Object.hasOwn(binding, guard)) {
      assertion((typeof binding[guard] === 'boolean'
        || binding[guard] && typeof binding[guard] === 'object' && !Array.isArray(binding[guard]))
        && boundedJson(binding[guard]),
        'EVIDENCE_GRAPH_GUARD_INVALID');
      const guardId = `${id}:${guard}`;
      nodes.push({ id: guardId, type: guard === 'when' ? 'condition' : 'exception',
        expression: clone(binding[guard]), status: 'unresolved' });
      edges.push({ from: guardId, to: id, type: guard === 'when' ? 'guards' : 'excepts',
        ...provenance('unresolved', unitIndex.get(binding.unit_id).evidence ?? [],
          binding.rule_version ?? null, binding.confidence ?? null) });
    }
  }
  for (const dependency of units.filter(unit => Array.isArray(unit.depends_on))) for (const target of dependency.depends_on) {
    assertion(unitIndex.has(target), 'EVIDENCE_GRAPH_DEPENDENCY_UNKNOWN');
    edges.push({ from: `semantic:${dependency.id}`, to: `semantic:${target}`, type: 'depends_on',
      ...provenance('unresolved', dependency.evidence ?? [], 'producer_declared_dependency/experimental-v1') });
  }
  const task_node_projections = Object.fromEntries(task_nodes.map(node => [node.id, Object.fromEntries([...slots].map(slot => [slot, []]))]));
  const task_node_projection_gaps = [];
  for (const unit of units) {
    const projectedNode = locateUnitTaskNode(task_nodes, unit.evidence ?? []);
    if (projectedNode) {
      task_node_projections[projectedNode.id][unit.slot].push(unit.id);
      continue;
    }
    const locations = (unit.evidence ?? []).map(evidence => locateTaskNodeForSpan(task_nodes, evidence)?.id ?? null);
    const uniqueLocations = [...new Set(locations)];
    if (locations.length > 0) {
      task_node_projection_gaps.push({ unit_id: unit.id, slot: unit.slot,
        reason: 'TASK_NODE_PROJECTION_UNRESOLVED', task_node_ids: uniqueLocations.filter(Boolean).sort() });
    }
  }
  const formal_coverage_gap = units.filter(unit => unit.status !== 'absent' && unit.formal_status !== 'compiled')
    .map(unit => ({ unit_id: unit.id, slot: unit.slot, reason: 'FORMALIZATION_NOT_COMPILED' }));
  const section_applicability_gaps = units.filter(unit => unit.status !== 'absent').flatMap(unit => {
    const sections = new Map();
    const projectedNode = locateUnitTaskNode(task_nodes, unit.evidence ?? []);
    if (sectionApplicabilityUnresolved(projectedNode?.context_role)) {
      sections.set(projectedNode.id, projectedNode.context_role);
    } else if (!projectedNode) {
      for (const evidence of unit.evidence ?? []) {
        const section = locateTaskNodeForSpan(task_nodes, evidence);
        if (sectionApplicabilityUnresolved(section?.context_role)) sections.set(section.id, section.context_role);
      }
    }
    return [...sections].flatMap(([task_node_id, section_role]) => {
      const contexts = ['condition', 'exception'].includes(section_role)
        ? conditionalHeadingContexts(task_nodes, taskNodeIndex.get(task_node_id)) : [];
      return (contexts.length ? contexts : [{ role: section_role, evidence: null }]).map(context => ({
        unit_id: unit.id, slot: unit.slot, task_node_id, section_role: context.role,
        reason: 'SECTION_APPLICABILITY_NOT_ESTABLISHED',
        ...(context.evidence ? { evidence: clone(context.evidence) } : {}),
      }));
    });
  });
  const protectedSpans = [...documentStructureSpans(text).filter(span => span.kind === 'frontmatter')
    .map(span => ({ ...span, role: 'metadata' })), ...documentLiteralBlockSpans(text)
    .map(span => ({ ...span, role: 'literal' }))];
  for (const unit of units.filter(item => item.status !== 'absent')) {
    for (const evidence of unit.evidence ?? []) {
      if (evidence.source_id !== 'task') continue;
      const taskNode = locateTaskNodeForSpan(task_nodes, evidence);
      if (!taskNode) continue;
      const roles = new Set(protectedSpans.filter(span => evidence.start < span.end
        && evidence.end > span.start).map(span => span.role));
      for (const role of roles) section_applicability_gaps.push({ unit_id: unit.id, slot: unit.slot,
        task_node_id: taskNode.id, section_role: role,
        reason: 'SECTION_APPLICABILITY_NOT_ESTABLISHED', evidence: clone(evidence) });
    }
  }
  for (const unit of units.filter(item => item.status !== 'absent')) {
    const taskNode = locateTaskNodeForSpan(task_nodes, unit.evidence?.[0] ?? {});
    if (!taskNode) continue;
    for (const [index, conditional] of conditionalEvidence.entries()) {
      if (!unit.evidence?.some(span => span.source_id === conditional.evidence.source_id
        && (span.start === conditional.evidence.start && span.end === conditional.evidence.end
          || span.start >= conditional.applies_to.start && span.end <= conditional.applies_to.end))) continue;
      const evidenceId = `conditional-evidence:${unit.id}:${index}`;
      nodes.push({ id: evidenceId, type: 'evidence', source_id: conditional.evidence.source_id,
        start: conditional.evidence.start, end: conditional.evidence.end, quote: conditional.evidence.quote });
      edges.push({ from: evidenceId, to: `semantic:${unit.id}`,
        type: conditional.role === 'condition' ? 'conditions' : 'excepts',
        ...provenance('unresolved', [conditional.evidence], 'document_applicability/experimental-v1'),
        producer: { kind: 'deterministic-document-parser', version: 'experimental-v1' } });
      if (section_applicability_gaps.some(gap => gap.unit_id === unit.id && gap.task_node_id === taskNode.id
        && gap.section_role === conditional.role
        && gap.evidence?.start === conditional.evidence.start && gap.evidence.end === conditional.evidence.end)) continue;
      section_applicability_gaps.push({ unit_id: unit.id, slot: unit.slot, task_node_id: taskNode.id,
        section_role: conditional.role, reason: 'DOCUMENT_APPLICABILITY_NOT_ESTABLISHED',
        evidence: clone(conditional.evidence) });
    }
  }
  const nodeIds = new Set(nodes.map(node => node.id));
  assertion(nodeIds.size === nodes.length, 'EVIDENCE_GRAPH_DUPLICATE_NODE');
  for (const edge of edges) assertion(nodeIds.has(edge.from) && nodeIds.has(edge.to), 'EVIDENCE_GRAPH_EDGE_ENDPOINT_UNKNOWN');
  assertion(!hasDependencyCycle(edges), 'EVIDENCE_GRAPH_DEPENDENCY_CYCLE');
  const graph = { format: 'boundx-evidence-graph/experimental-v1', source_id: 'task', source_digests,
    producer: clone(producer), nodes, edges,
    task_node_projections, task_node_projection_gaps, formal_coverage_gap, section_applicability_gaps,
    source_coverage_gaps };
  return { ...graph, digest: graphDigest(graph) };
}

export function projectAllTaskNodeSemantics(graph) {
  if (!graph?.task_node_projections || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    throw Error('TASK_NODE_PROJECTION_UNAVAILABLE');
  }
  const nodes = verifiedGraph(graph);
  const supports = new Map();
  for (const edge of graph.edges.filter(item => item.type === 'supports')) {
    const evidence = nodes.get(edge.from);
    if (evidence?.type !== 'evidence') throw Error('TASK_NODE_PROJECTION_INVALID');
    if (!supports.has(edge.to)) supports.set(edge.to, []);
    supports.get(edge.to).push({ source_id: evidence.source_id,
      start: evidence.start, end: evidence.end, quote: evidence.quote });
  }
  return Object.entries(graph.task_node_projections).map(([taskNodeId, projection]) => {
    const elements = Object.fromEntries([...slots].map(slot => [slot, {
      assessment: projection[slot]?.length ? 'local_entries_present' : 'no_local_entry_assessment',
      entries: (projection[slot] ?? []).map(entryId => {
        const semantic = nodes.get(`semantic:${entryId}`);
        if (!semantic || semantic.slot !== slot) throw Error('TASK_NODE_PROJECTION_INVALID');
        return { id: entryId, status: semantic.status, text: semantic.text,
          formal_status: semantic.formal_status, evidence: clone(supports.get(semantic.id) ?? []) };
      }),
    }]));
    return { format: 'boundx-task-node-semantics/experimental-v1', task_node_id: taskNodeId,
      scope: 'local_evidence_units_only_not_a_complete_source_interpretation', elements };
  });
}

export function taskNodeLocalSemantics(graph, taskNodeId) {
  const result = projectAllTaskNodeSemantics(graph).find(item => item.task_node_id === taskNodeId);
  if (!result) throw Error('TASK_NODE_PROJECTION_UNAVAILABLE');
  return result;
}
