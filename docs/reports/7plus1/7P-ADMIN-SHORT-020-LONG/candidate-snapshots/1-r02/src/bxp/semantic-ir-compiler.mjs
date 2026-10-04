import { validateSemanticIr } from './semantic-ir.mjs';
import { boundedJson } from './validation.mjs';
import { compileBooleanModelFragment } from './formal-boolean-model.mjs';
import { digest } from './evaluate.mjs';
import { solveBooleanConstraints, canonicalBooleanBoundary } from './boolean-solver.mjs';
import { registeredValidator } from './schema-registry.mjs';
import { intersectValidatedIntervals } from './interval-solver.mjs';
import { solveValidatedPrerequisites } from './dependency-solver.mjs';
import { evaluateValidatedTargetSet } from './target-set-solver.mjs';
import { evaluateValidatedHandoff } from './handoff-solver.mjs';
import { allowedSetIdentity, solveAllowedSets } from './allowed-set-solver.mjs';

import { FORMALIZATION_OPERATOR_SLOTS as allowedSlots } from './formalization-operators.mjs';
const collectionNames = { obligation: 'required', prohibition: 'forbidden', completion: 'completion', constraint: 'constraints' };
const exact = (value, fields) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === fields.length && fields.every(field => Object.hasOwn(value, field));
const validateFormalization = registeredValidator('formalization_input');
const validateFormalModel = registeredValidator('formal_model');

export function compileSemanticIr(input, formalization, observePhase = null) {
  observePhase?.('compilation');
  const review = validateSemanticIr(input);
  const diagnostics = [...review.diagnostics];
  const output = (status, model = null) => ({ format: 'boundx-ir-compilation/experimental-v1', status,
    model, model_digest: model === null ? null : digest(model), diagnostics,
    boundary_result: null, admission: null, business_decision: null, execution_authorization: null });
  if (!review.valid) return output('invalid');
  if (!boundedJson(formalization) || !validateFormalization(formalization)) {
    diagnostics.push({ code: 'FORMALIZATION_INPUT_INVALID', path: '/formalization' });
    return output('invalid');
  }
  const entries = new Map(Object.entries(input.elements).flatMap(([slot, bucket]) =>
    bucket.entries.map(entry => [entry.id, { slot, entry }])));
  const scopes = new Map(input.scopes.map(scope => [scope.id, scope]));
  const sources = new Map(input.sources.map(source => [source.id, source]));
  const compiled = new Set();
  const bindingIds = new Set();
  const nodes = [];
  formalization.bindings.forEach((binding, index) => {
    const path = `/formalization/bindings/${index}`;
    const fail = (code, details = {}) => diagnostics.push({ code, path, ...details });
    const booleanBinding = Object.hasOwn(collectionNames, binding.operator);
    const bindingShape = booleanBinding ? Object.fromEntries(Object.entries(binding).filter(([key]) => !['when', 'unless'].includes(key))) : binding;
    if (!exact(bindingShape, binding.operator === 'allowed_set'
      ? ['id', 'entry_id', 'operator', 'universe', 'effect', 'actor_scope', 'guard_context', 'identity_status', 'allowed']
      : binding.operator === 'artifact_state'
      ? ['id', 'entry_id', 'operator', 'artifact', 'presence', 'identity_status', 'mapping_coverage']
      : binding.operator === 'handoff'
      ? ['id', 'entry_id', 'operator', 'producer_stage', 'consumer_stage', 'artifact_type', 'identity_status', 'supply_status', 'declared_outputs', 'external_inputs', 'required_inputs']
      : binding.operator === 'target_set'
      ? ['id', 'entry_id', 'operator', 'universe', 'effect', 'actor_scope', 'guard_context', 'identity_status', 'requested', 'forbidden']
      : binding.operator === 'entity'
      ? ['id', 'entry_id', 'operator', 'entity_id', 'entity_type', 'identity_status']
      : binding.operator === 'relation' ? ['id', 'entry_id', 'operator', 'relation', 'from_id', 'to_id']
      : binding.operator === 'interval'
      ? ['id', 'entry_id', 'operator', 'subject', 'dimension', 'unit', 'domain', 'lower', 'upper']
      : ['id', 'entry_id', 'operator', 'variables', 'formula'])
      || typeof binding.id !== 'string' || !binding.id.trim() || binding.id.length > 128
      || typeof binding.entry_id !== 'string' || typeof binding.operator !== 'string'
      || !Object.hasOwn(allowedSlots, binding.operator)
      || bindingIds.has(binding.id)) return fail('BINDING_INVALID');
    bindingIds.add(binding.id);
    const claim = entries.get(binding.entry_id);
    if (!claim) return fail('BINDING_ENTRY_UNKNOWN');
    if (!allowedSlots[binding.operator].includes(claim.slot)) return fail('BINDING_SLOT_MISMATCH');
    const scope = scopes.get(claim.entry.scope_id);
    if (['interval', 'entity', 'relation', 'target_set', 'allowed_set', 'handoff', 'artifact_state'].includes(binding.operator)) {
      if (scope.status !== 'resolved' || claim.entry.status !== 'resolved') return fail('BINDING_SEMANTICS_UNRESOLVED');
      if (binding.mapping_coverage === 'partial') diagnostics.push({ code: 'PARTIAL_ENTRY_FORMALIZATION', entry_id: claim.entry.id });
      else compiled.add(claim.entry.id);
      nodes.push({ ...structuredClone(binding), slot: claim.slot, scope_id: scope.id,
        evidence: structuredClone(claim.entry.evidence), semantic_equivalence: 'producer_asserted_not_proven' });
      return;
    }
    const evidenceSources = new Set([...scope.evidence, ...claim.entry.evidence].map(span => span.source_id));
    if (evidenceSources.size !== 1) return fail('CROSS_SOURCE_BOOLEAN_MAPPING_UNSUPPORTED');
    const source = sources.get([...evidenceSources][0]);
    const expressions = [binding.formula, binding.when, binding.unless];
    const undeclared = new Set();
    while (expressions.length) {
      const expression = expressions.pop();
      if (!expression || typeof expression !== 'object') continue;
      if (Object.hasOwn(expression, 'var') && !binding.variables.includes(expression.var)) undeclared.add(expression.var);
      for (const value of Object.values(expression)) {
        if (Array.isArray(value)) expressions.push(...value);
        else if (value && typeof value === 'object') expressions.push(value);
      }
    }
    if (undeclared.size) return fail('BINDING_FORMULA_INVALID', { reason: 'UNDECLARED_BOOLEAN_VARIABLES',
      variables: [...undeclared].sort(), entry_id: claim.entry.id, evidence: structuredClone(claim.entry.evidence) });
    const stripSource = evidence => evidence.map(({ start, end, quote }) => ({ start, end, quote }));
    const guards = [binding.when, binding.unless === undefined ? undefined : { not: binding.unless }].filter(value => value !== undefined);
    const activation = guards.length === 1 ? guards[0] : { all: guards };
    const formula = !guards.length ? binding.formula : binding.operator === 'prohibition'
      ? { all: [activation, binding.formula] } : { implies: [activation, binding.formula] };
    const clause = { id: binding.id, status: claim.entry.status, formula,
      evidence: stripSource(claim.entry.evidence) };
    const fragmentInput = { source: { text: source.text, language: source.language },
      scope: { id: scope.id, status: scope.status, evidence: stripSource(scope.evidence) },
      variables: binding.variables, required: [], forbidden: [], completion: [], constraints: [] };
    fragmentInput[collectionNames[binding.operator]].push(clause);
    const fragment = compileBooleanModelFragment(fragmentInput);
    if (fragment.status === 'invalid') return fail('BINDING_FORMULA_INVALID');
    if (fragment.status === 'unresolved') {
      diagnostics.push({ code: 'BINDING_SEMANTICS_UNRESOLVED', path });
      return;
    }
    compiled.add(claim.entry.id);
    nodes.push({ id: binding.id, entry_id: claim.entry.id, slot: claim.slot, scope_id: scope.id,
      operator: binding.operator, variables: structuredClone(binding.variables).sort(),
      formula: structuredClone(binding.formula),
      ...(binding.when === undefined ? {} : { when: structuredClone(binding.when) }),
      ...(binding.unless === undefined ? {} : { unless: structuredClone(binding.unless) }),
      effective_formula: structuredClone(fragment.compilation[0].effective_formula),
      evidence: structuredClone(claim.entry.evidence),
      semantic_equivalence: 'producer_asserted_not_proven' });
  });
  const invalidCodes = new Set(['BINDING_INVALID', 'BINDING_ENTRY_UNKNOWN', 'BINDING_SLOT_MISMATCH', 'BINDING_FORMULA_INVALID']);
  if (diagnostics.some(item => invalidCodes.has(item.code))) return output('invalid');
  const identities = new Map();
  for (const node of nodes.filter(item => item.operator === 'entity')) {
    const key = JSON.stringify([node.scope_id, node.entity_id]);
    if (identities.has(key)) {
      diagnostics.push({ code: 'ENTITY_ID_DUPLICATE', entry_id: node.entry_id });
      return output('invalid');
    }
    identities.set(key, node);
    if (node.identity_status === 'unresolved') {
      diagnostics.push({ code: 'ENTITY_IDENTITY_UNRESOLVED', entry_id: node.entry_id });
    }
  }
  for (const node of nodes.filter(item => item.operator === 'relation')) {
    const from = identities.get(JSON.stringify([node.scope_id, node.from_id]));
    const to = identities.get(JSON.stringify([node.scope_id, node.to_id]));
    if (!from || !to) {
      diagnostics.push({ code: 'RELATION_ENDPOINT_UNRESOLVED', entry_id: node.entry_id });
      node.relation_status = 'unresolved';
      continue;
    }
    const types = { assigned_role: ['actor', 'role'], has_grade: ['actor', 'grade'], reports_to: ['actor', 'actor'] }[node.relation];
    if (types && (from.entity_type !== types[0] || to.entity_type !== types[1])) {
      diagnostics.push({ code: 'RELATION_ENDPOINT_TYPE_INVALID', entry_id: node.entry_id });
      return output('invalid');
    }
    node.relation_status = from.identity_status === 'resolved' && to.identity_status === 'resolved' ? 'resolved' : 'unresolved';
    if (node.relation_status === 'unresolved') diagnostics.push({ code: 'RELATION_IDENTITY_UNRESOLVED', entry_id: node.entry_id });
  }
  const uncompiled = [...entries.values()].filter(({ entry }) => !compiled.has(entry.id))
    .map(({ slot, entry }) => ({ slot, entry_id: entry.id, scope_id: entry.scope_id,
      reason: entry.status === 'unresolved' ? 'SEMANTICS_UNRESOLVED' : 'TYPED_MAPPING_NOT_COMPILED',
      evidence: structuredClone(entry.evidence) }));
  observePhase?.('evaluation');
  const calculations = [...scopes.values()].map(scope => {
    const scopedNodes = nodes.filter(node => node.scope_id === scope.id && Object.hasOwn(collectionNames, node.operator)).sort((left, right) =>
      left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
    const variables = [...new Set(scopedNodes.flatMap(node => node.variables))].sort();
    const base = { scope_id: scope.id, operator_profile: 'boundx.boolean-conjunction/experimental-v1',
      node_ids: scopedNodes.map(node => node.id), variables,
      formulas: scopedNodes.map(node => structuredClone(node.effective_formula)),
      coverage: 'compiled_boolean_nodes_only',
      uncompiled_entry_ids: uncompiled.filter(entry => entry.scope_id === scope.id).map(entry => entry.entry_id),
      evidence: scopedNodes.flatMap(node => structuredClone(node.evidence)) };
    if (scope.status !== 'resolved' || scopedNodes.length === 0) return { ...base, status: 'not_evaluated',
      reason: scope.status !== 'resolved' ? 'SCOPE_UNRESOLVED' : 'NO_COMPILED_BOOLEAN_NODES', result: null };
    if (variables.length > 12) {
      diagnostics.push({ code: 'SCOPED_BOOLEAN_VARIABLE_LIMIT', scope_id: scope.id });
      return { ...base, status: 'not_evaluated', reason: 'SCOPED_BOOLEAN_VARIABLE_LIMIT', result: null };
    }
    let canonicalPredicate = null;
    try { canonicalPredicate = canonicalBooleanBoundary(variables, base.formulas); }
    catch (error) {
      if (!(error instanceof RangeError)) throw error;
      diagnostics.push({ code: 'BOOLEAN_CANONICALIZATION_WORK_LIMIT', scope_id: scope.id });
    }
    return { ...base, status: 'evaluated', reason: null,
      result: solveBooleanConstraints(variables, base.formulas),
      canonical_predicate: canonicalPredicate };
  });
  const intervalNodes = nodes.filter(node => node.operator === 'interval');
  const domains = new Map();
  const units = new Map();
  for (const node of intervalNodes) {
    const subjectKey = JSON.stringify([node.scope_id, node.subject, node.dimension]);
    const domainKey = JSON.stringify([node.scope_id, node.subject, node.dimension, node.unit]);
    if (domains.has(domainKey) && domains.get(domainKey) !== node.domain) {
      diagnostics.push({ code: 'INTERVAL_DOMAIN_MISMATCH', entry_id: node.entry_id });
      return output('invalid');
    }
    domains.set(domainKey, node.domain);
    if (!units.has(subjectKey)) units.set(subjectKey, new Set());
    units.get(subjectKey).add(node.unit);
  }
  for (const [subjectKey, declaredUnits] of units) {
    if (declaredUnits.size > 1) diagnostics.push({ code: 'INTERVAL_UNIT_RELATION_UNRESOLVED',
      scope_subject_dimension: JSON.parse(subjectKey), units: [...declaredUnits].sort() });
  }
  const intervalCalculations = intersectValidatedIntervals(intervalNodes).map(calculation => ({
    ...calculation, operator_profile: 'boundx.interval-intersection/experimental-v1',
    coverage: 'compiled_interval_nodes_only',
    evidence: intervalNodes.filter(node => calculation.constraint_ids.includes(node.id)).flatMap(node => structuredClone(node.evidence)) }));
  const dependencyCalculations = [...scopes.values()].map(scope => {
    const relations = nodes.filter(node => node.scope_id === scope.id && node.operator === 'relation'
      && ['depends_on', 'prerequisite'].includes(node.relation));
    const required = relations.filter(node => node.relation === 'prerequisite' && node.relation_status === 'resolved');
    const omitted = relations.filter(node => !required.includes(node));
    if (relations.some(node => node.relation === 'depends_on')) diagnostics.push({
      code: 'DEPENDENCY_MODALITY_UNRESOLVED', scope_id: scope.id });
    return { scope_id: scope.id, operator_profile: 'boundx.prerequisite-graph/experimental-v1',
      status: required.length ? 'evaluated' : 'not_evaluated', coverage: 'resolved_explicit_prerequisites_only',
      node_ids: required.map(node => node.id).sort(),
      omitted_node_ids: omitted.map(node => node.id).sort(),
      result: required.length ? solveValidatedPrerequisites(required.map(node => ({ id: node.id,
        kind: 'prerequisite', from: node.from_id, to: node.to_id }))) : null,
      evidence: required.flatMap(node => structuredClone(node.evidence)) };
  });
  const model = { format: 'boundx-typed-ir-model/experimental-v1',
    ir_digest: digest(input), formalization_inputs_digest: digest(formalization),
    semantic_ir: structuredClone(input), nodes, uncompiled_entries: uncompiled,
    compilation_trace: [...entries.values()].map(({ slot, entry }) => {
      const targets = nodes.filter(node => node.entry_id === entry.id);
      return { slot, entry_id: entry.id, scope_id: entry.scope_id,
        status: compiled.has(entry.id) ? 'mapped' : targets.length ? 'partial' : 'uncompiled',
        node_ids: targets.map(node => node.id),
        rule_versions: [...new Set(targets.flatMap(node => [`boundx.ir-to-${node.operator}/experimental-v1`,
          ...(Object.hasOwn(node, 'when') || Object.hasOwn(node, 'unless') ? ['boundx.conditional-activation/experimental-v1'] : [])]))],
        evidence: structuredClone(entry.evidence) };
    }),
    coverage: { submitted_entries: entries.size, mapped_entries: compiled.size,
      source_semantic_completeness: 'not_established', formalization_equivalence: 'not_established' } };
  const targetGroups = new Map();
  for (const node of nodes.filter(item => item.operator === 'target_set')) {
    const key = JSON.stringify([node.scope_id, node.universe, node.effect, node.actor_scope, node.guard_context]);
    if (!targetGroups.has(key)) targetGroups.set(key, []);
    targetGroups.get(key).push(node);
  }
  const targetCalculations = [...targetGroups.values()].map(group => {
    const ids = group.map(node => node.id).sort();
    const first = group[0];
    const uncertain = group.filter(node => node.identity_status !== 'resolved');
    for (const node of uncertain) diagnostics.push({ code: 'TARGET_IDENTITY_UNRESOLVED', entry_id: node.entry_id });
    const combined = { ...first, id: ids[0], identity_status: uncertain.length ? 'unresolved' : 'resolved',
      requested: [...new Set(group.flatMap(node => node.requested))].sort(),
      forbidden: [...new Set(group.flatMap(node => node.forbidden))].sort() };
    const resolved = group.filter(node => node.identity_status === 'resolved');
    const requested = new Set(resolved.flatMap(node => node.requested));
    const forbidden = new Set(resolved.flatMap(node => node.forbidden));
    const confirmed_overlap = [...requested].filter(target => forbidden.has(target)).sort();
    const confirmedNodes = resolved.filter(node => confirmed_overlap.some(target =>
      node.requested.includes(target) || node.forbidden.includes(target)));
    return { ...evaluateValidatedTargetSet(combined), node_ids: ids,
      confirmed_overlap, confirmed_node_ids: confirmedNodes.map(node => node.id).sort(),
      confirmed_evidence: confirmedNodes.flatMap(node => structuredClone(node.evidence)),
      operator_profile: 'boundx.typed-target-overlap/experimental-v1',
      universe: first.universe, effect: first.effect, actor_scope: first.actor_scope, guard_context: first.guard_context,
      requested: combined.requested, forbidden: combined.forbidden,
      coverage: 'submitted_target_sets_only', evidence: group.flatMap(node => structuredClone(node.evidence)) };
  });
  const handoffCalculations = nodes.filter(node => node.operator === 'handoff').map(node => {
    const calculation = evaluateValidatedHandoff(node);
    if (node.identity_status !== 'resolved') diagnostics.push({ code: 'HANDOFF_IDENTITY_UNRESOLVED', entry_id: node.entry_id });
    if (node.supply_status === 'partial') {
      diagnostics.push({ code: 'HANDOFF_SUPPLY_INCOMPLETE', entry_id: node.entry_id });
      calculation.result = 'undetermined';
    }
    return { ...calculation, producer_stage: node.producer_stage, consumer_stage: node.consumer_stage,
      artifact_type: node.artifact_type, supply_status: node.supply_status,
      operator_profile: 'boundx.handoff-deficit/experimental-v1', coverage: 'submitted_handoff_only',
      node_ids: [node.id], evidence: structuredClone(node.evidence) };
  });
  const artifactGroups = new Map();
  for (const node of nodes.filter(item => item.operator === 'artifact_state')) {
    const key = JSON.stringify([node.scope_id, node.artifact]);
    if (!artifactGroups.has(key)) artifactGroups.set(key, []);
    artifactGroups.get(key).push(node);
    if (node.identity_status === 'unresolved') diagnostics.push({ code: 'ARTIFACT_IDENTITY_UNRESOLVED', entry_id: node.entry_id });
  }
  const artifactCalculations = [...artifactGroups.values()].map(group => {
    const first = group[0];
    const requested = group.some(node => node.presence === 'present') ? [first.artifact] : [];
    const forbidden = group.some(node => node.presence === 'absent') ? [first.artifact] : [];
    const identity = group.every(node => node.identity_status === 'resolved') ? 'resolved' : 'unresolved';
    const resolved = group.filter(node => node.identity_status === 'resolved');
    const confirmed_conflict = resolved.some(node => node.presence === 'present')
      && resolved.some(node => node.presence === 'absent');
    return { ...evaluateValidatedTargetSet({ id: first.id, scope_id: first.scope_id, identity_status: identity, requested, forbidden }),
      artifact: first.artifact, requested, forbidden, node_ids: group.map(node => node.id).sort(),
      confirmed_conflict, confirmed_node_ids: confirmed_conflict ? resolved.map(node => node.id).sort() : [],
      confirmed_evidence: confirmed_conflict ? resolved.flatMap(node => structuredClone(node.evidence)) : [],
      operator_profile: 'boundx.artifact-presence/experimental-v1', coverage: 'submitted_artifact_presence_only',
      evidence: group.flatMap(node => structuredClone(node.evidence)) };
  });
  const resolvedSets = nodes.filter(node => ['allowed_set', 'target_set'].includes(node.operator)
    && node.identity_status === 'resolved');
  const confirmedAllowed = new Map(solveAllowedSets(resolvedSets).map(item => [allowedSetIdentity(item), item]));
  const allowedCalculations = solveAllowedSets(nodes).map(item => {
    const confirmed = confirmedAllowed.get(allowedSetIdentity(item));
    const confirmed_outside = confirmed?.result === 'outside_allowed_set' ? confirmed.outside : [];
    const confirmedNodes = confirmed_outside.length ? resolvedSets.filter(node =>
      allowedSetIdentity(node) === allowedSetIdentity(item) && (node.operator === 'allowed_set'
        || node.operator === 'target_set' && node.requested.some(target => confirmed_outside.includes(target)))) : [];
    return { ...item, confirmed_outside, confirmed_node_ids: confirmedNodes.map(node => node.id).sort(),
      confirmed_evidence: confirmedNodes.flatMap(node => structuredClone(node.evidence)) };
  });
  for (const calculation of allowedCalculations) if (calculation.result === 'undetermined') {
    diagnostics.push({ code: 'ALLOWED_SET_IDENTITY_UNRESOLVED', scope_id: calculation.scope_id });
  }
  if (!validateFormalModel(model)) {
    diagnostics.push({ code: 'COMPILED_MODEL_CONTRACT_INVALID', path: '/model' });
    return output('invalid');
  }
  return { ...output(uncompiled.length || diagnostics.length ? 'partial' : 'mapped', model), calculations,
    allowed_calculations: allowedCalculations,
    interval_calculations: intervalCalculations, dependency_calculations: dependencyCalculations,
    target_calculations: targetCalculations, handoff_calculations: handoffCalculations, artifact_calculations: artifactCalculations };
}
