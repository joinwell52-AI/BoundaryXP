export const allowedSetIdentity = node => JSON.stringify([
  node.scope_id, node.universe, node.effect, node.actor_scope, node.guard_context,
]);

export function solveAllowedSets(nodes) {
  const groups = new Map();
  for (const node of nodes.filter(item => item.operator === 'allowed_set')) {
    const key = allowedSetIdentity(node);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(node);
  }
  return [...groups.entries()].map(([key, group]) => {
    const requests = nodes.filter(node => node.operator === 'target_set' && allowedSetIdentity(node) === key);
    const first = group[0];
    const allowed = first.allowed.filter(target => group.every(node => node.allowed.includes(target))).sort();
    const requested = [...new Set(requests.flatMap(node => node.requested))].sort();
    const outside = requested.filter(target => !allowed.includes(target));
    const resolved = [...group, ...requests].every(node => node.identity_status === 'resolved');
    return { scope_id: first.scope_id, universe: first.universe, effect: first.effect,
      actor_scope: first.actor_scope, guard_context: first.guard_context,
      allowed, requested, outside,
      result: !resolved ? 'undetermined' : outside.length ? 'outside_allowed_set' : 'within_allowed_set',
      node_ids: [...group, ...requests].map(node => node.id).sort(),
      evidence: [...group, ...requests].flatMap(node => structuredClone(node.evidence)),
      operator_profile: 'boundx.closed-allowed-set/experimental-v1',
      coverage: 'explicit_closed_allowlists_only_not_execution_authority' };
  });
}
