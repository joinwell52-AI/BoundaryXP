export function evaluateValidatedTargetSet(item) {
  if (item.identity_status === 'unresolved') return {
    id: item.id, scope_id: item.scope_id, result: 'undetermined', overlap: [],
  };
  const blocked = new Set(item.forbidden);
  const overlap = item.requested.filter(value => blocked.has(value)).sort();
  return { id: item.id, scope_id: item.scope_id, result: overlap.length ? 'overlap' : 'disjoint', overlap };
}
