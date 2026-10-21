export function evaluateValidatedHandoff(item) {
  if (item.identity_status === 'unresolved') return {
    id: item.id, scope_id: item.scope_id, result: 'undetermined', available: [], missing: [],
  };
  const available = [...new Set([...item.declared_outputs, ...item.external_inputs])].sort();
  const supplied = new Set(available);
  const missing = item.required_inputs.filter(value => !supplied.has(value)).sort();
  return { id: item.id, scope_id: item.scope_id, result: missing.length ? 'deficit' : 'satisfied', available, missing };
}
