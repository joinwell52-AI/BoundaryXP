import { compileSemanticIr } from './semantic-ir-compiler.mjs';
import { canonicalBooleanBoundary } from './boolean-solver.mjs';
import { digest } from './evaluate.mjs';
import { boundedJson } from './validation.mjs';
import { intersectValidatedIntervals } from './interval-solver.mjs';
import { solveAllowedSets } from './allowed-set-solver.mjs';

const sortedUnique = values => [...new Map(values.map(value => [JSON.stringify(value), value])).entries()]
  .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, value]) => value);
const pick = (node, fields) => Object.fromEntries(fields.map(field => [field, structuredClone(node[field])]));

export function canonicalizeTypedInterpretation(request) {
  const validEnvelope = boundedJson(request) && request && typeof request === 'object' && !Array.isArray(request)
    && Object.keys(request).length === 2 && Object.hasOwn(request, 'ir') && Object.hasOwn(request, 'formalization');
  const compilation = compileSemanticIr(validEnvelope ? request.ir : undefined, validEnvelope ? request.formalization : undefined);
  const output = (status, canonical = null, diagnostics = []) => ({ format: 'boundx-canonical-interpretation/experimental-v1',
    status, canonical, canonical_digest: canonical === null ? null : digest(canonical), diagnostics,
    interpretation_exhaustiveness: 'not_established', business_decision: null, execution_authorization: null });
  if (compilation.status === 'invalid') return output('invalid', null, compilation.diagnostics);
  const uncertain = request.ir.scopes.some(scope => scope.status !== 'resolved')
    || Object.values(request.ir.elements).some(bucket => bucket.status === 'unresolved' || bucket.coverage !== 'assessed');
  if (compilation.status !== 'mapped' || uncertain) return output('not_comparable', null,
    [{ code: 'INTERPRETATION_NOT_FULLY_FORMALIZED' }, ...compilation.diagnostics]);
  const nodes = compilation.model.nodes;
  const booleanGroups = new Map();
  for (const node of nodes.filter(item => ['obligation', 'prohibition', 'completion', 'constraint'].includes(item.operator))) {
    const key = JSON.stringify([node.scope_id, node.slot, node.operator]);
    if (!booleanGroups.has(key)) booleanGroups.set(key, []);
    booleanGroups.get(key).push(node);
  }
  let predicates;
  try {
    predicates = [...booleanGroups.values()].map(group => ({ scope_id: group[0].scope_id, slot: group[0].slot,
      operator: group[0].operator, predicate: canonicalBooleanBoundary([...new Set(group.flatMap(node => node.variables))].sort(),
        group.map(node => node.effective_formula)) }));
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    return output('not_comparable', null, [{ code: 'INTERPRETATION_CANONICALIZATION_LIMIT' }]);
  }
  const intervalRoles = new Map();
  for (const node of nodes.filter(item => item.operator === 'interval')) {
    if (!intervalRoles.has(node.slot)) intervalRoles.set(node.slot, []);
    intervalRoles.get(node.slot).push(node);
  }
  const targetRoles = new Map();
  for (const node of nodes.filter(item => item.operator === 'target_set')) {
    const identity = pick(node, ['scope_id', 'slot', 'universe', 'effect', 'actor_scope', 'guard_context']);
    const key = JSON.stringify(identity);
    if (!targetRoles.has(key)) targetRoles.set(key, { ...identity, requested: [], forbidden: [] });
    const group = targetRoles.get(key);
    group.requested.push(...node.requested);
    group.forbidden.push(...node.forbidden);
  }
  const canonical = {
    format: 'boundx-canonical-boundary/experimental-v1',
    scope_ids: request.ir.scopes.map(scope => scope.id).sort(),
    predicates: sortedUnique(predicates),
    intervals: sortedUnique(compilation.interval_calculations.map(calculation => pick(calculation,
      ['scope_id', 'subject', 'dimension', 'unit', 'domain', 'lower', 'upper', 'empty']))),
    interval_roles: sortedUnique([...intervalRoles.entries()].flatMap(([slot, roleNodes]) =>
      intersectValidatedIntervals(roleNodes).map(calculation => ({ slot, ...pick(calculation,
        ['scope_id', 'subject', 'dimension', 'unit', 'domain', 'lower', 'upper', 'empty']) })))),
    entities: sortedUnique(nodes.filter(node => node.operator === 'entity').map(node => pick(node,
      ['scope_id', 'slot', 'entity_id', 'entity_type']))),
    relations: sortedUnique(nodes.filter(node => node.operator === 'relation').map(node => pick(node,
      ['scope_id', 'slot', 'relation', 'from_id', 'to_id']))),
    targets: sortedUnique(compilation.target_calculations.map(calculation => pick(calculation,
      ['scope_id', 'universe', 'effect', 'actor_scope', 'guard_context', 'requested', 'forbidden']))),
    allowed: sortedUnique(compilation.allowed_calculations.map(calculation => pick(calculation,
      ['scope_id', 'universe', 'effect', 'actor_scope', 'guard_context', 'allowed']))),
    allowed_roles: sortedUnique(['A', 'B'].flatMap(slot => solveAllowedSets(nodes.filter(node => node.slot === slot))
      .map(calculation => ({ slot, ...pick(calculation,
        ['scope_id', 'universe', 'effect', 'actor_scope', 'guard_context', 'allowed']) })))),
    target_roles: sortedUnique([...targetRoles.values()].map(group => ({
      ...group, requested: [...new Set(group.requested)].sort(), forbidden: [...new Set(group.forbidden)].sort(),
    }))),
    handoffs: sortedUnique(nodes.filter(node => node.operator === 'handoff').map(node => ({
      ...pick(node, ['scope_id', 'slot', 'producer_stage', 'consumer_stage', 'artifact_type', 'supply_status']),
      declared_outputs: [...node.declared_outputs].sort(), external_inputs: [...node.external_inputs].sort(),
      required_inputs: [...node.required_inputs].sort(),
    }))),
    artifacts: sortedUnique(nodes.filter(node => node.operator === 'artifact_state').map(node => pick(node,
      ['scope_id', 'slot', 'artifact', 'presence']))),
  };
  return output('canonicalized', canonical);
}

export function compareTypedInterpretations(requests) {
  const result = (status, items, differences = [], diagnostics = []) => ({
    format: 'boundx-interpretation-comparison/experimental-v1', status, interpretations: items, differences, diagnostics,
    interpretation_exhaustiveness: 'not_established', boundary_result: null, admission: null,
    business_decision: null, execution_authorization: null,
  });
  if (!boundedJson(requests) || !Array.isArray(requests) || requests.length < 2 || requests.length > 16) {
    return result('invalid', [], [], [{ code: 'INTERPRETATION_SET_INVALID' }]);
  }
  const items = requests.map(canonicalizeTypedInterpretation);
  if (items.some(item => item.status === 'invalid')) return result('invalid', items);
  const identity = request => digest({ task_id: request.ir.task_id, task_revision: request.ir.task_revision,
    sources: request.ir.sources.map(source => pick(source, ['id', 'role', 'language', 'sha256'])).sort((left, right) => left.id.localeCompare(right.id)) });
  if (new Set(requests.map(identity)).size !== 1) return result('not_comparable', items, [], [{ code: 'INTERPRETATION_SOURCE_BINDING_MISMATCH' }]);
  if (items.some(item => item.status !== 'canonicalized')) return result('not_comparable', items);
  const differences = [];
  for (let index = 1; index < items.length; index++) {
    for (const key of Object.keys(items[0].canonical)) {
      if (digest(items[0].canonical[key]) !== digest(items[index].canonical[key])) differences.push({
        baseline_index: 0, interpretation_index: index, component: key,
        baseline_digest: digest(items[0].canonical[key]), compared_digest: digest(items[index].canonical[key]),
      });
    }
  }
  return result(differences.length ? 'different' : 'equivalent', items, differences);
}
