// Preserve already-composed typed structures, never a previous Canonical
// result. Membership is established by semantic evidence, not fixture IDs.
export function markRetainedContracts(f){
 const nodes=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),exprs=new Map(f.expressions.condition_expr_nodes.map(e=>[e.expr_id,e]));
 const clauses=new Set(),records=[];
 for(const frame of f.semantic_decoding.whole_composition?.frames??[]){const n=nodes.get(frame.predicate_node_id);if(frame.distribution||n?.metadata.qualified_member_certificate||n?.metadata.distribution){clauses.add(n.metadata.clause_id);records.push({event_node_id:n.node_id,rule:'RETAIN_TYPED_DISTRIBUTIVE_OR_QUALIFIED_FRAME',certificate_id:frame.certificate_id});}}
 for(const refusal of f.semantic_decoding.short_refinement_content?.refusals??[]){clauses.add(refusal.clause_id);const a=f.analyses.find(a=>a.cl.id===refusal.clause_id);for(const parent of f.analyses.filter(p=>p.cl.sentence_id===a?.cl.sentence_id))clauses.add(parent.cl.id);records.push({clause_id:refusal.clause_id,rule:'RETAIN_TYPED_CONTENT_COMPLETION_REFUSAL',reason:refusal.rule});}
 for(const r of f.relations.filter(r=>r.state==='RESOLVED'&&r.relation_type==='BASIS'&&nodes.get(r.tail_node_id)?.metadata.source_locator)){clauses.add(r.clause_id);records.push({clause_id:r.clause_id,reference_node_id:r.tail_node_id,rule:'RETAIN_EXPLICIT_REFERENCE_LOCATOR'});}
 const leaves=id=>{const e=exprs.get(id);return !e?[]:e.op==='STATE_REF'?[nodes.get(e.state_node_id)]:e.op==='NOT'?leaves(e.operand_expr_id):(e.operand_expr_ids??[]).flatMap(leaves);};
 for(const a of f.analyses)for(const event of a.events){
  const p=f.expression_plans.get(event.node_id),states=leaves(p?.condition_expr_id).filter(Boolean);
  const typed=states.length&&states.every(n=>['OUTPUT_EXISTS','SECTION_PRESENT','ALL_RECORDED','REVIEW_CONFIRMED'].includes(n.metadata.sense));
  const necessary=event.metadata.completion&&event.metadata.condition_strength==='NECESSARY_ONLY'&&exprs.get(p?.condition_expr_id)?.op==='AND'&&states.length>1&&states.every(n=>f.analyses.find(a=>a.cl.id===n.metadata.clause_id)?.cl.tokens.some(t=>/^(VV|VA|VERB|AUX|ADJ)$/u.test(t.pos??'')));
  if(event.metadata.completion&&(typed||necessary)){clauses.add(a.cl.id);for(const n of states)clauses.add(n.metadata.clause_id);records.push({event_node_id:event.node_id,condition_expr_id:p.condition_expr_id,state_node_ids:states.map(n=>n.node_id),rule:'RETAIN_TYPED_COMPLETION_COMPOSITION'});}
  const qualified=event.metadata.local_argument_qualifiers?.length||event.metadata.conformance_target_node_ids?.length;
  const quoted=event.metadata.quoted_value_span_ids?.length===2&&event.metadata.modality==='FORBIDDEN';
  const unresolvedDestination=f.unresolved.find(u=>u.unresolved_id===p?.unresolved_ref)?.kind==='UNRESOLVED_COREFERENCE'&&f.semantic_nodes.some(n=>n.metadata.clause_id===a.cl.id&&n.metadata.retain_ambiguity&&n.metadata.competing_material_domains?.length>1)&&f.relations.some(r=>r.head_node_id===event.node_id&&r.state==='RESOLVED'&&['RECIPIENT','LOCATION'].includes(r.relation_type));
  if(qualified||quoted||unresolvedDestination){clauses.add(a.cl.id);records.push({event_node_id:event.node_id,rule:qualified?'RETAIN_ARGUMENT_LOCAL_QUALIFIER':quoted?'RETAIN_QUOTED_VALUE_TRANSFORMATION':'RETAIN_UNRESOLVED_OBJECT_WITH_EXPLICIT_DESTINATION'});}
  if(states.length===1&&states[0].metadata.sense==='EXISTENCE'&&states[0].metadata.object_node_ids?.length===1){clauses.add(a.cl.id);clauses.add(states[0].metadata.clause_id);records.push({event_node_id:event.node_id,condition_expr_id:p.condition_expr_id,rule:'RETAIN_EXPLICIT_TYPED_EXISTENCE_GUARD'});}
 }
 f.retained_typed_clause_ids=clauses;f.semantic_decoding.retained_typed_contracts=records;return f;
}
