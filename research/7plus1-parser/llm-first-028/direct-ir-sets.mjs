// Typed, finite set operations shared by calculation and its consumers.
// No source text, label, note, model invocation or inferred permission.
export function combineFiniteSets(operator, sets) {
 if (!sets.length || (operator === 'DIFFERENCE' && sets.length !== 2)) throw Error('SET_ARITY');
 const first = [...new Set(sets[0])];
 if (operator === 'UNION') return [...new Set(sets.flat())];
 if (operator === 'INTERSECTION') return first.filter(value => sets.every(set => set.includes(value)));
 if (operator === 'DIFFERENCE') return first.filter(value => !sets[1].includes(value));
 throw Error('SET_OPERATOR_NOT_IMPLEMENTED:' + operator);
}

export function typedInputDomains(ir, acceptance) {
 const nodes = new Map(['entities','events','expressions','requirements'].flatMap(key => (ir[key] ?? []).map(node => [node.id, node])));
 const rows = new Map((acceptance?.rows ?? []).map(row => [row.id, row.status]));
 const accepted = id => !acceptance || rows.get(id) === 'ACCEPTED';
 function finite(ref, path = new Set()) {
  if (!ref || path.has(ref.id)) throw Error('SET_REFERENCE_CYCLE_OR_MISSING');
  const node = nodes.get(ref.id);
  if (!node) throw Error('SET_REFERENCE_MISSING:' + ref.id);
  if (!accepted(ref.id)) throw Error('SET_REFERENCE_NOT_ACCEPTED:' + ref.id);
  if (ref.kind === 'ENTITY') return [ref.id];
  if (ref.kind !== 'EXPRESSION') throw Error('FINITE_ENTITY_SET_REQUIRED:' + ref.kind);
  const next = new Set([...path, ref.id]);
  if (node.operator === 'SET') {
   if (!node.arguments.every(a => a.kind === 'ENTITY')) throw Error('FINITE_ENTITY_SET_REQUIRED');
   return [...new Set(node.arguments.flatMap(a => finite(a, next)))];
  }
  if (node.operator === 'GROUP_MEMBERS') {
   const group = nodes.get(node.arguments[0]?.id);
   if (group?.kind !== 'GROUP' || !accepted(group.id)) throw Error('GROUP_MISSING_OR_NOT_ACCEPTED');
   return [...new Set(group.members.flatMap(a => finite(a, next)))];
  }
  if (['UNION','INTERSECTION','DIFFERENCE'].includes(node.operator)) return combineFiniteSets(node.operator, node.arguments.map(a => finite(a, next)));
  throw Error('FINITE_ENTITY_SET_NOT_IMPLEMENTED:' + node.operator);
 }
 const policies = [];
 // Only conjunction preserves each input bound unconditionally. Do not lift
 // a bound out of OR, NOT, IMPLIES, quantification or an applicability guard.
 function bounds(ref, path = [], verified = true) {
  const node = ref?.kind === 'EXPRESSION' && nodes.get(ref.id);
  if (!node || path.includes(node.id)) return [];
  const current = [...path, node.id], ok = verified && accepted(node.id);
  if (node.operator === 'AND') return node.arguments.flatMap(a => bounds(a, current, ok));
  const projection = nodes.get(node.arguments?.[0]?.id);
  return node.operator === 'SUBSET' && projection?.operator === 'TASK_EXTERNAL_INPUTS'
   ? [{node, projection, expression_path: current, verified: ok && accepted(projection.id)}] : [];
 }
 for (const requirement of ir.requirements ?? []) for (const b of bounds(requirement.body)) {
  const task = b.projection.arguments[0]?.id, diagnostics = [];
  let allowed = null;
  try { allowed = finite(b.node.arguments[1]); } catch (error) { diagnostics.push(error.message); }
  const verified = accepted(requirement.id) && b.verified && accepted(task);
  const unconditional = requirement.kind === 'CONSTRAINT' && requirement.modality === 'REQUIRED' && !requirement.applicability;
  if (!verified) diagnostics.push('INPUT_BOUND_NOT_ACCEPTED');
  if (!unconditional) diagnostics.push('INPUT_BOUND_ACTIVATION_UNRESOLVED');
  policies.push({requirement_id: requirement.id, expression_id: b.node.id, expression_path: b.expression_path, task_id: task, operator:'SUBSET', allowed, verified, unconditional, diagnostics, source_refs: requirement.source_refs});
 }
 const tasks = (ir.events ?? []).filter(e => e.kind === 'TASK');
 const task_domains = tasks.map(task => {
  const constraints = policies.filter(p => p.task_id === task.id);
  const active = constraints.filter(p => p.unconditional);
  const known = active.length > 0 && active.every(p => p.verified && p.allowed !== null);
  return {task_id:task.id, status:known ? 'KNOWN' : 'UNKNOWN', allowed:known ? combineFiniteSets('INTERSECTION', active.map(p => p.allowed)) : null,
   requirement_ids:active.map(p => p.requirement_id), constraints};
 });
 const roots = task_domains.filter(t => { const n = nodes.get(t.task_id); return !n.owner_id || n.owner_id === n.id || !tasks.some(p => p.id === n.owner_id); });
 const known = roots.length > 0 && roots.every(t => t.status === 'KNOWN');
 return {status:known ? 'KNOWN' : 'UNKNOWN', allowed:known ? [...new Set(roots.flatMap(t => t.allowed))] : null,
  task_domains, policies, basis:'EXPLICIT_TASK_EXTERNAL_INPUTS_SUBSET', not_actual_use:true, not_execution_permission:true};
}
