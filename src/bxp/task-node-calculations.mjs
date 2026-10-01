import { solveBooleanConstraints } from './boolean-solver.mjs';
import { intersectValidatedIntervals } from './interval-solver.mjs';
import { compareDecimal } from './decimal.mjs';
import { allowedSetIdentity, solveAllowedSets } from './allowed-set-solver.mjs';
import { evaluateValidatedTargetSet } from './target-set-solver.mjs';
import { solveValidatedPrerequisites } from './dependency-solver.mjs';
import { evaluateValidatedHandoff } from './handoff-solver.mjs';
import { locateTaskNodeForSpan, sectionApplicabilityUnresolved } from '../product/task-nodes.mjs';

const booleanOperators = new Set(['obligation', 'prohibition', 'completion', 'constraint']);
const evaluatedOperators = new Set([...booleanOperators, 'interval', 'allowed_set', 'target_set', 'handoff', 'artifact_state', 'entity']);
const inheritedOperators = new Set(['prohibition', 'constraint', 'interval', 'allowed_set', 'target_set', 'artifact_state']);
const supportedNode = node => evaluatedOperators.has(node.operator)
  || node.operator === 'relation' && node.relation_status === 'resolved'
    && node.relation !== 'depends_on';

export function evaluateTaskNodeCalculations(taskNodes, evidenceGraph, formalModel, reviewedConditional = new Set()) {
  if (!formalModel) return [];
  const byId = new Map(taskNodes.map(node => [node.id, node]));
  const irScopes = new Map((formalModel.semantic_ir?.scopes ?? []).map(scope => [scope.id, scope]));
  const scopeTaskNodeId = id => {
    const scope = irScopes.get(id);
    if (!scope) return formalModel.semantic_ir === undefined && byId.has(id) ? id : null;
    const match = byId.get(id);
    const contains = node => node?.span && scope.evidence.length > 0 && scope.evidence.every(span => span.source_id === 'task'
      && span.start >= node.span.start && span.end <= node.span.end);
    if (match) {
      if (!contains(match) || scope.evidence.some(span => {
        const located = locateTaskNodeForSpan(taskNodes, span);
        return located !== null && located.id !== id;
      })) return null;
      return id;
    }
    const located = scope.evidence.map(span => locateTaskNodeForSpan(taskNodes, span)?.id
      ?? taskNodes.filter(node => node.span && span.source_id === 'task'
        && span.start >= node.span.start && span.end <= node.span.end)
        .sort((left, right) => left.span.end - left.span.start - (right.span.end - right.span.start))[0]?.id ?? null);
    return located.length && located[0] !== null && located.every(nodeId => nodeId === located[0]) ? located[0] : null;
  };
  const formalByEntry = new Map();
  for (const node of formalModel.nodes) {
    if (!formalByEntry.has(node.entry_id)) formalByEntry.set(node.entry_id, []);
    formalByEntry.get(node.entry_id).push(node);
  }
  const projected = evidenceGraph.task_node_projections;
  const unresolvedApplicabilityIds = new Set((evidenceGraph.section_applicability_gaps ?? [])
    .map(item => item.unit_id));
  return taskNodes.map(taskNode => {
    const ancestors = [];
    let parentUnresolved = taskNode.number_hierarchy_status === 'parent_unresolved';
    let unresolvedParent = parentUnresolved ? taskNode : null;
    let parent = taskNode.parent_id;
    const visitedParents = new Set([taskNode.id]);
    while (parent && !parentUnresolved) {
      if (visitedParents.has(parent) || !byId.has(parent)) {
        parentUnresolved = true;
        unresolvedParent = { parent_resolution_reason: visitedParents.has(parent)
          ? 'ancestry_cycle' : 'parent_missing' };
        ancestors.length = 0;
        break;
      }
      visitedParents.add(parent);
      ancestors.push(parent);
      if (byId.get(parent)?.number_hierarchy_status === 'parent_unresolved') {
        parentUnresolved = true;
        unresolvedParent = byId.get(parent);
      }
      parent = byId.get(parent)?.parent_id ?? null;
    }
    const allLocalIds = Object.values(projected[taskNode.id]).flat();
    const localIds = allLocalIds.filter(id => !unresolvedApplicabilityIds.has(id) || reviewedConditional.has(id));
    const inheritedOwners = new Map();
    const inheritedIds = ancestors.flatMap(id => {
      const role = byId.get(id)?.context_role;
      if (sectionApplicabilityUnresolved(role) && !['condition', 'exception'].includes(role)) return [];
      return Object.entries(projected[id]).flatMap(([slot, entries]) => entries.filter(entryId =>
        (!unresolvedApplicabilityIds.has(entryId) || reviewedConditional.has(entryId))
        &&
        (!['condition', 'exception'].includes(role) || reviewedConditional.has(entryId))
        && (['B', 'R'].includes(slot) || (formalByEntry.get(entryId) ?? []).some(node =>
          ['constraint', 'interval', 'allowed_set'].includes(node.operator))
          || slot === 'P' && (formalByEntry.get(entryId) ?? []).some(node => node.operator === 'relation' && node.relation === 'prerequisite')))
        .map(entryId => {
          if (!inheritedOwners.has(entryId)) inheritedOwners.set(entryId, id);
          return entryId;
        }));
    });
    const gaps = [];
    for (const entryId of allLocalIds.filter(id => !localIds.includes(id))) {
      gaps.push({ code: 'TASK_NODE_APPLICABILITY_UNRESOLVED', entry_id: entryId });
    }
    const conflicts = [];
    if (parentUnresolved)
      gaps.push({ code: unresolvedParent?.parent_resolution_reason === 'ancestry_cycle'
        ? 'TASK_NODE_ANCESTRY_CYCLE'
        : unresolvedParent?.parent_resolution_reason === 'parent_missing'
          ? 'TASK_NODE_PARENT_MISSING'
          : unresolvedParent?.parent_resolution_reason === 'named_parent_missing'
        ? 'TASK_NODE_NAMED_PARENT_UNRESOLVED'
        : ['numbered_path_duplicate', 'numbered_parent_ambiguous'].includes(unresolvedParent?.parent_resolution_reason)
          ? 'TASK_NODE_NUMBERING_AMBIGUOUS' : 'TASK_NODE_NUMBERED_PARENT_UNRESOLVED',
      task_node_id: taskNode.id });
    const localSet = new Set(localIds);
    const formalNodes = [...new Set([...localIds, ...inheritedIds])].flatMap(entryId => {
      const nodes = formalByEntry.get(entryId) ?? [];
      if (!nodes.length) gaps.push({ code: 'TASK_NODE_ENTRY_NOT_COMPILED', entry_id: entryId });
      return nodes.filter(node => {
        if (node.operator === 'relation' && node.relation === 'prerequisite' && !localSet.has(entryId)) {
          gaps.push({ code: 'TASK_NODE_DEPENDENCY_IDENTITY_UNRESOLVED', entry_id: entryId,
            source_scope_id: node.scope_id, target_scope_id: taskNode.id });
          return false;
        }
        if (localSet.has(entryId) || inheritedOperators.has(node.operator)) return true;
        gaps.push({ code: 'TASK_NODE_INHERITED_OPERATOR_UNRESOLVED', entry_id: entryId, operator: node.operator });
        return false;
      });
    });
    for (const node of formalNodes) if (!supportedNode(node)) gaps.push({
      code: 'TASK_NODE_OPERATOR_NOT_EVALUATED', node_id: node.id, operator: node.operator });
    for (const node of formalNodes.filter(item => item.operator === 'entity' && item.identity_status !== 'resolved')) {
      gaps.push({ code: 'TASK_NODE_ENTITY_IDENTITY_UNRESOLVED', node_id: node.id });
    }
    const sourceScopes = [...new Set(formalNodes.map(node => node.scope_id))].sort();
    if (sourceScopes.some(id => ![taskNode.id, ...ancestors].includes(scopeTaskNodeId(id)))) {
      gaps.push({ code: 'TASK_NODE_SCOPE_RELATION_UNESTABLISHED', source_scope_ids: sourceScopes });
    }
    const broaderLocalScopes = [...new Set(formalNodes.filter(node => localSet.has(node.entry_id)
      && scopeTaskNodeId(node.scope_id) !== taskNode.id).map(node => node.scope_id))].sort();
    if (broaderLocalScopes.length) gaps.push({ code: 'TASK_NODE_LOCAL_SCOPE_BROADER_THAN_EVIDENCE',
      source_scope_ids: broaderLocalScopes });
    const applicabilityUnresolved = allLocalIds.some(id => unresolvedApplicabilityIds.has(id) && !reviewedConditional.has(id))
      || (['condition', 'exception'].includes(taskNode.context_role)
        ? allLocalIds.some(id => !reviewedConditional.has(id)) : sectionApplicabilityUnresolved(taskNode.context_role));
    if (applicabilityUnresolved && formalNodes.length) gaps.push({ code: 'TASK_NODE_APPLICABILITY_UNRESOLVED' });
    const calculations = { boolean: null, intervals: [], allowed_sets: [], target_sets: [],
      artifact_states: [], dependencies: null, handoffs: [] };
    if (!applicabilityUnresolved && !gaps.some(item => [
      'TASK_NODE_SCOPE_RELATION_UNESTABLISHED',
      'TASK_NODE_LOCAL_SCOPE_BROADER_THAN_EVIDENCE',
    ].includes(item.code))) {
      const effective = formalNodes.filter(supportedNode)
        .map(node => ({ ...node, scope_id: taskNode.id }));
      const booleans = effective.filter(node => booleanOperators.has(node.operator));
      if (booleans.length) {
        const variables = [...new Set(booleans.flatMap(node => node.variables))].sort();
        try {
          calculations.boolean = { node_ids: booleans.map(node => node.id).sort(),
            ...solveBooleanConstraints(variables, booleans.map(node => node.effective_formula)) };
          if (calculations.boolean.result === 'unsatisfiable') conflicts.push({ code: 'TASK_NODE_BOOLEAN_CONFLICT',
            formal_node_ids: calculations.boolean.node_ids });
        } catch { gaps.push({ code: 'TASK_NODE_BOOLEAN_EVALUATION_LIMIT' }); }
      }
      const intervals = effective.filter(node => node.operator === 'interval');
      if (intervals.length) {
        calculations.intervals = intersectValidatedIntervals(intervals);
        for (const item of calculations.intervals.filter(item => item.empty)) conflicts.push({
          code: 'TASK_NODE_INTERVAL_CONFLICT', formal_node_ids: item.constraint_ids });
        const intervalKey = item => JSON.stringify([item.subject, item.dimension, item.unit, item.domain]);
        const inheritedIntervals = new Map(intersectValidatedIntervals(intervals.filter(item =>
          !localSet.has(item.entry_id))).map(item => [intervalKey(item), item]));
        const effectiveIntervals = new Map(calculations.intervals.map(item => [intervalKey(item), item]));
        for (const local of intersectValidatedIntervals(intervals.filter(item => localSet.has(item.entry_id)))) {
          const inherited = inheritedIntervals.get(intervalKey(local));
          if (!inherited || inherited.empty || local.empty || effectiveIntervals.get(intervalKey(local))?.empty) continue;
          const relaxedBounds = [];
          if (inherited.lower && local.lower && (compareDecimal(local.lower.value, inherited.lower.value) < 0
            || compareDecimal(local.lower.value, inherited.lower.value) === 0
              && local.lower.inclusive && !inherited.lower.inclusive)) relaxedBounds.push('lower');
          if (inherited.upper && local.upper && (compareDecimal(local.upper.value, inherited.upper.value) > 0
            || compareDecimal(local.upper.value, inherited.upper.value) === 0
              && local.upper.inclusive && !inherited.upper.inclusive)) relaxedBounds.push('upper');
          if (relaxedBounds.length) gaps.push({ code: 'TASK_NODE_INTERVAL_EXPANSION_UNSUPPORTED',
            formal_node_ids: [...inherited.constraint_ids, ...local.constraint_ids].sort(),
            relaxed_bounds: relaxedBounds });
        }
        const units = new Map();
        for (const item of intervals) {
          const key = JSON.stringify([item.subject, item.dimension]);
          if (!units.has(key)) units.set(key, new Set());
          units.get(key).add(JSON.stringify([item.unit, item.domain]));
        }
        if ([...units.values()].some(values => values.size > 1)) gaps.push({ code: 'TASK_NODE_INTERVAL_UNIT_RELATION_UNRESOLVED' });
      }
      const sets = effective.filter(node => ['allowed_set', 'target_set'].includes(node.operator));
      if (sets.length) {
        const inheritedAllow = new Map(solveAllowedSets(sets.filter(item => item.operator === 'allowed_set'
          && !localSet.has(item.entry_id))).map(item => [allowedSetIdentity(item), item]));
        for (const local of solveAllowedSets(sets.filter(item => item.operator === 'allowed_set'
          && localSet.has(item.entry_id)))) {
          const parent = inheritedAllow.get(allowedSetIdentity(local));
          if (!parent || local.result === 'undetermined' || parent.result === 'undetermined') continue;
          const outside = local.allowed.filter(target => !parent.allowed.includes(target)).sort();
          if (outside.length) gaps.push({ code: 'TASK_NODE_ALLOWLIST_EXPANSION_UNSUPPORTED',
            formal_node_ids: [...parent.node_ids, ...local.node_ids].sort(), outside });
        }
        const targetGroups = new Map();
        for (const node of sets.filter(item => item.operator === 'target_set')) {
          const key = allowedSetIdentity(node);
          if (!targetGroups.has(key)) targetGroups.set(key, []);
          targetGroups.get(key).push(node);
        }
        calculations.target_sets = [...targetGroups.values()].map(group => {
          const combined = { ...group[0], identity_status: group.every(node => node.identity_status === 'resolved') ? 'resolved' : 'unresolved',
            requested: [...new Set(group.flatMap(node => node.requested))].sort(),
            forbidden: [...new Set(group.flatMap(node => node.forbidden))].sort() };
          const resolvedNodes = group.filter(node => node.identity_status === 'resolved');
          const resolvedRequested = new Set(resolvedNodes.flatMap(node => node.requested));
          const resolvedForbidden = new Set(resolvedNodes.flatMap(node => node.forbidden));
          const confirmed_overlap = [...resolvedRequested].filter(target => resolvedForbidden.has(target)).sort();
          return { ...evaluateValidatedTargetSet(combined), formal_node_ids: group.map(node => node.id).sort(),
            requested: combined.requested, forbidden: combined.forbidden, confirmed_overlap,
            confirmed_formal_node_ids: resolvedNodes.filter(node => confirmed_overlap.some(target =>
              node.requested.includes(target) || node.forbidden.includes(target))).map(node => node.id).sort() };
        });
        for (const item of calculations.target_sets) {
          if (item.confirmed_overlap.length) conflicts.push({ code: 'TASK_NODE_FORBIDDEN_TARGET_CONFLICT',
            formal_node_ids: item.confirmed_formal_node_ids, overlap: item.confirmed_overlap });
          if (item.result === 'undetermined') gaps.push({ code: 'TASK_NODE_TARGET_IDENTITY_UNRESOLVED', formal_node_ids: item.formal_node_ids });
        }
        const resolvedSets = sets.filter(node => node.identity_status === 'resolved');
        const confirmedAllowed = new Map(solveAllowedSets(resolvedSets).map(item => [allowedSetIdentity(item), item]));
        calculations.allowed_sets = solveAllowedSets(sets).map(item => {
          const confirmed = confirmedAllowed.get(allowedSetIdentity(item));
          const confirmed_outside = confirmed?.result === 'outside_allowed_set' ? confirmed.outside : [];
          const confirmed_formal_node_ids = confirmed_outside.length ? resolvedSets.filter(node =>
            allowedSetIdentity(node) === allowedSetIdentity(item) && (node.operator === 'allowed_set'
              || node.operator === 'target_set' && node.requested.some(target => confirmed_outside.includes(target))))
            .map(node => node.id).sort() : [];
          return { ...item, confirmed_outside, confirmed_formal_node_ids };
        });
        for (const item of calculations.allowed_sets) {
          if (item.confirmed_outside.length) conflicts.push({ code: 'TASK_NODE_ALLOWED_SET_CONFLICT',
            formal_node_ids: item.confirmed_formal_node_ids, outside: item.confirmed_outside });
          if (item.result === 'undetermined') gaps.push({ code: 'TASK_NODE_ALLOWED_SET_UNRESOLVED', formal_node_ids: item.node_ids });
        }
        for (const allowed of solveAllowedSets(sets.filter(item => item.operator === 'allowed_set'
          && localSet.has(item.entry_id)))) {
          if (allowed.result === 'undetermined') continue;
          const inheritedBans = sets.filter(item => item.operator === 'target_set'
            && !localSet.has(item.entry_id) && item.identity_status === 'resolved'
            && allowedSetIdentity(item) === allowedSetIdentity(allowed));
          const overlap = [...new Set(inheritedBans.flatMap(item => item.forbidden))]
            .filter(target => allowed.allowed.includes(target)).sort();
          if (overlap.length) conflicts.push({ code: 'TASK_NODE_INHERITED_PROHIBITION_OVERRIDE_CONFLICT',
            formal_node_ids: [...allowed.node_ids, ...inheritedBans.filter(item =>
              item.forbidden.some(target => overlap.includes(target))).map(item => item.id)].sort(), overlap });
        }
      }
      const artifacts = new Map();
      for (const node of effective.filter(item => item.operator === 'artifact_state')) {
        if (!artifacts.has(node.artifact)) artifacts.set(node.artifact, []);
        artifacts.get(node.artifact).push(node);
      }
      calculations.artifact_states = [...artifacts].map(([artifact, group]) => {
        const identity_status = group.every(node => node.identity_status === 'resolved') ? 'resolved' : 'unresolved';
        const requested = group.some(node => node.presence === 'present') ? [artifact] : [];
        const forbidden = group.some(node => node.presence === 'absent') ? [artifact] : [];
        const resolvedNodes = group.filter(node => node.identity_status === 'resolved');
        const confirmed_conflict = resolvedNodes.some(node => node.presence === 'present')
          && resolvedNodes.some(node => node.presence === 'absent');
        return { ...evaluateValidatedTargetSet({ id: group[0].id, scope_id: taskNode.id,
          identity_status, requested, forbidden }), artifact,
          formal_node_ids: group.map(node => node.id).sort(), confirmed_conflict,
          confirmed_formal_node_ids: confirmed_conflict ? resolvedNodes.filter(node =>
            ['present', 'absent'].includes(node.presence)).map(node => node.id).sort() : [] };
      });
      for (const item of calculations.artifact_states) {
        if (item.confirmed_conflict) conflicts.push({ code: 'TASK_NODE_ARTIFACT_PRESENCE_CONFLICT',
          formal_node_ids: item.confirmed_formal_node_ids, artifact: item.artifact });
        if (item.result === 'undetermined') gaps.push({ code: 'TASK_NODE_ARTIFACT_IDENTITY_UNRESOLVED',
          formal_node_ids: item.formal_node_ids });
      }
      const prerequisites = effective.filter(node => node.operator === 'relation' && node.relation === 'prerequisite');
      if (prerequisites.length) {
        calculations.dependencies = solveValidatedPrerequisites(prerequisites.map(node => ({
          id: node.id, kind: 'prerequisite', from: node.from_id, to: node.to_id,
        })));
        for (const cycle of calculations.dependencies.cycles) conflicts.push({
          code: 'TASK_NODE_PREREQUISITE_CYCLE', formal_node_ids: cycle.edge_ids, cycle: cycle.nodes });
      }
      calculations.handoffs = effective.filter(node => node.operator === 'handoff').map(node => node.supply_status === 'partial'
        ? { ...evaluateValidatedHandoff(node), result: 'undetermined' } : evaluateValidatedHandoff(node));
      for (const item of calculations.handoffs) {
        if (item.result === 'deficit') conflicts.push({ code: 'TASK_NODE_HANDOFF_INPUT_DEFICIT', formal_node_ids: [item.id], missing: item.missing });
        if (item.result === 'undetermined') gaps.push({ code: 'TASK_NODE_HANDOFF_IDENTITY_UNRESOLVED', formal_node_ids: [item.id] });
      }
    }
    const scopeEstablished = !gaps.some(item => [
      'TASK_NODE_SCOPE_RELATION_UNESTABLISHED', 'TASK_NODE_LOCAL_SCOPE_BROADER_THAN_EVIDENCE',
    ].includes(item.code));
    const effectiveBoundary = scopeEstablished && !applicabilityUnresolved && !parentUnresolved ? {
      required: formalNodes.filter(node => node.operator === 'obligation').map(node => node.id).sort(),
      allowed: calculations.allowed_sets,
      forbidden: formalNodes.filter(node => ['prohibition', 'target_set'].includes(node.operator)).map(node => node.id).sort(),
      limits: calculations.intervals,
      completion: formalNodes.filter(node => node.operator === 'completion').map(node => node.id).sort(),
      entities: formalNodes.filter(node => node.operator === 'entity').map(node => node.id).sort(),
      relations: formalNodes.filter(node => node.operator === 'relation').map(node => node.id).sort(),
      dependencies: calculations.dependencies,
      handoffs: calculations.handoffs,
      artifact_states: calculations.artifact_states,
      source_bindings: formalNodes.map(node => ({ formal_node_id: node.id, entry_id: node.entry_id,
        source_scope_id: node.scope_id, inherited_from: localSet.has(node.entry_id)
          ? null : inheritedOwners.get(node.entry_id) ?? null })).sort((left, right) => left.formal_node_id.localeCompare(right.formal_node_id)),
      authorization: null,
    } : null;
    return { task_node_id: taskNode.id, parent_id: taskNode.parent_id,
      local_entry_ids: [...new Set(localIds)].sort(), inherited_entry_ids: [...new Set(inheritedIds)].sort(),
      formal_node_ids: formalNodes.map(node => node.id).sort(), source_scope_ids: sourceScopes,
      status: applicabilityUnresolved ? 'applicability_unresolved'
        : conflicts.length ? 'conflict' : gaps.length ? 'uncertain' : formalNodes.length ? 'evaluated' : 'empty',
      calculations, effective_boundary: effectiveBoundary, conflicts, gaps,
    };
  });
}
