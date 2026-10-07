import {boundaryIR as baseIR} from './boundary-ir.mjs';
import {id,uniq} from './util.mjs';
// Deterministic lowering of a certified argument role to its own local domain.
// The original input scope stays in Gc and the IR; it cannot silently become a
// generated object's domain merely because both belong to one predicate.
export function boundaryIR(graph,decisions,gamma){
 const ir=baseIR(graph,decisions),nodes=new Map(graph.nodes.map(n=>[n.id,n])),expr=new Map(graph.expressions.map(e=>[e.id,e])),cert=new Map(gamma.decisions.map(d=>[d.candidate_id,d.decision]));
 // The base IR borrows the immutable expression inventory. Derived domains
 // belong to lowering output; appending them must never mutate Gc.
 ir.expressions=[...ir.expressions];
 function members(ref,seen=new Set()){
  if(seen.has(ref))return [];seen.add(ref);const e=expr.get(ref);return e?.kind==='SCOPE'?e.operands.flatMap(i=>members(i,seen)):[ref];
 }
 for(const f of ir.facts){const object=nodes.get(f.object_id);if(!object||!['DELIVERABLE','TASK_OBJECT'].includes(f.kind))continue;
  const inherited=f.scope_refs,applicable=inherited.filter(ref=>members(ref).includes(object.id));
  f.non_applicable_scope_refs=inherited.filter(ref=>!applicable.includes(ref));
  if(applicable.length)f.scope_refs=applicable;
  else{
   const scopeId=id(graph.graph_id,'role-domain',f.eligibility_id,object.id),normalization={id:scopeId,kind:'SCOPE',operator:'ITEM',operands:[object.id],owner:f.predicate_id??'TASK',sources:object.sources,source_span_ids:object.source_span_ids,origin:'DETERMINISTIC_CERTIFIED_ARGUMENT_ROLE',normalization_dependencies:uniq([object.id,...f.relation_ids]),quantity:null,alternative_group_id:null};
   ir.expressions.push(normalization);f.scope_refs=[scopeId];
  }
  const constraints=graph.nodes.filter(n=>['STATE','VALUE'].includes(n.type)&&['OUTPUT_CONTENT','ATTRIBUTE'].includes(n.layer)&&n.owner===object.id&&n.modality==='REQUIRED');
  f.content_constraint_refs=constraints.map(n=>n.id);f.dependency_ids=uniq([...f.dependency_ids,...f.content_constraint_refs]);
  f.source_span_ids=uniq([...f.source_span_ids,...constraints.flatMap(n=>n.source_span_ids)]);
  f.unresolved_ids=f.dependency_ids.filter(i=>cert.get(i)!=='CERTIFIED');if(f.unresolved_ids.length)f.state='UNRESOLVED';
 }
 return ir;
}
