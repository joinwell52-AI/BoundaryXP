// Scope expressions denote the object domain of their owning fact, not its head's other facts.
export function scopeEvidence(ir,nodes,relations){
 const em=new Map(ir.set_expr_nodes.map(e=>[e.expr_id,e])),nm=new Map(nodes.map(n=>[n.node_id,n])),rm=new Map(relations.map(r=>[r.relation_id,r]));
 function walk(id,path=[]){if(path.includes(id))return {nodes:[],relations:[],errors:['CYCLIC_SCOPE'],path};const e=em.get(id);if(!e)return {nodes:[],relations:[],errors:['MISSING_SCOPE'],path};const children=[...(e.operand_expr_ids??[]),e.base_expr_id,e.excluded_expr_id].filter(Boolean).map(x=>walk(x,[...path,id]));return {nodes:[e.entity_node_id,e.base_entity_node_id,...children.flatMap(c=>c.nodes)].filter(Boolean),relations:[...e.relation_ids,...children.flatMap(c=>c.relations)],errors:children.flatMap(c=>c.errors),path:[{...e},...children.flatMap(c=>c.path)]};}
 return ir.facts.filter(f=>f.scope_expr_id).map(f=>{
  const w=walk(f.scope_expr_id),objects=new Set(f.object_node_ids),errors=[...w.errors];
  for(const n of w.nodes)if(!objects.has(n)||!nm.has(n))errors.push('SCOPE_OBJECT_NOT_IN_FACT '+n);
  if(['TASK_OBJECT','DELIVERABLE'].includes(f.fact_type))for(const n of objects)if(!w.nodes.includes(n))errors.push('FACT_OBJECT_MISSING_FROM_SCOPE '+n);
  const roles=f.fact_type==='TASK_OBJECT'?['SCOPE_MEMBER']:f.fact_type==='DELIVERABLE'?['RESULT']:['PATIENT','THEME','FORBIDS','RESTRICTS','RESULT'];
  for(const rid of new Set(w.relations)){const r=rm.get(rid);if(!r||!f.relation_ids.includes(rid))errors.push('SCOPE_RELATION_NOT_IN_FACT '+rid);else if(!objects.has(r.tail_node_id)||f.predicate_node_id&&r.head_node_id!==f.predicate_node_id||!roles.includes(r.relation_type))errors.push('SCOPE_RELATION_ENDPOINT_MISMATCH '+rid);}
  for(const n of new Set(w.nodes))if(!w.relations.some(rid=>{const r=rm.get(rid);return r&&r.tail_node_id===n&&roles.includes(r.relation_type);}))errors.push('SCOPE_OBJECT_WITHOUT_OWNING_RELATION '+n);
  return {boundary_fact_id:f.boundary_fact_id,fact_type:f.fact_type,state:f.state,objects:f.object_node_ids.map(n=>({node_id:n,text:nm.get(n)?.surface})),relation_ids:f.relation_ids,scope_expr_id:f.scope_expr_id,scope_objects:[...new Set(w.nodes)].map(n=>({node_id:n,text:nm.get(n)?.surface})),structural_path:w.path,errors,pass:errors.length===0};
 });
}
export function assertScopeConsistency(ir,nodes,relations){const rows=scopeEvidence(ir,nodes,relations),bad=rows.filter(r=>!r.pass);for(const f of ir.facts)if(f.state==='RESOLVED'&&['TASK_OBJECT','DELIVERABLE'].includes(f.fact_type)&&!f.scope_expr_id)bad.push({boundary_fact_id:f.boundary_fact_id,errors:['MISSING_REQUIRED_OBJECT_SCOPE']});if(bad.length)throw Error('BOUNDARY_SCOPE_INCONSISTENT '+JSON.stringify(bad));return rows;}
