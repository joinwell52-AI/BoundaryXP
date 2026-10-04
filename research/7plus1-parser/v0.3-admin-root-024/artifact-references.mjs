import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
// An explicit document-role noun is eligible for the generated-artifact domain.
// Selection needs one structurally contained compatible result, never proximity.
export function artifactReferences(f){
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 for(const r of [...f.relations].filter(r=>r.state==='SUPPORTED'&&['PATIENT','THEME'].includes(r.relation_type))){
  const e=nm(r.head_node_id),ref=nm(r.tail_node_id),a=f.analyses.find(a=>a.cl.id===r.clause_id);
  if(!(['send','report','receive','review'].includes(e.metadata.sense)||e.metadata.sense==='generate'&&e.metadata.modality==='NOT_REQUIRED')||!/^(该|这份|上述|最终|本次)?(报告|文档|report|the report|document|the document)$/iu.test(ref.surface))continue;
  const domain=uniq(f.relations.filter(q=>q.state==='SUPPORTED'&&q.relation_type==='RESULT'&&sp(nm(q.tail_node_id)).end<sp(ref).start&&f.analyses.find(x=>x.cl.id===q.clause_id)?.parent_structure_id===a.parent_structure_id).map(q=>q.tail_node_id)).map(nm).filter(n=>/\.(md|txt|pdf|docx)$/iu.test(n.surface));
  const identities=[...new Map(domain.map(n=>[n.metadata.artifact_identity??n.surface,n])).values()];
  ref.metadata.resolution={rule:'UNIQUE_STRUCTURALLY_OWNED_GENERATED_ARTIFACT',candidate_node_ids:identities.map(n=>n.node_id),selected_node_ids:identities.length===1?identities.map(n=>n.node_id):[],structural_path:[a.parent_structure_id,a.cl.id],source_span_ids:uniq([a.sid,...ref.source_span_ids,...identities.flatMap(n=>n.source_span_ids)])};
  if(identities.length!==1)continue;
  const target=identities[0],alias=f.tools.relation(a.cl,'COREFERENCE',ref,target,ref.metadata.resolution.source_span_ids);
  const replacement=f.tools.relation(a.cl,['send','report','receive'].includes(e.metadata.sense)?'THEME':'PATIENT',e,target,[a.sid,...ref.source_span_ids,...target.source_span_ids]);
  replacement.rule_refs.push('UNIQUE_STRUCTURALLY_OWNED_GENERATED_ARTIFACT',alias.relation_id);replacement.dependency_relation_ids=uniq([...(replacement.dependency_relation_ids??[]),alias.relation_id]);r.state='REJECTED';
  const refSpan=sp(ref);
  for(const scope of f.relations.filter(q=>q.state==='SUPPORTED'&&q.relation_type==='SCOPE_MEMBER')){const n=nm(scope.tail_node_id),s=sp(n);if(s.start===refSpan.start&&s.end===refSpan.end){scope.state='REJECTED';scope.rejection_reason='GENERATED_ARTIFACT_REFERENCE_IS_NOT_EXTERNAL_INPUT';scope.dependency_relation_ids=uniq([...(scope.dependency_relation_ids??[]),alias.relation_id]);}}
  const plan=f.expression_plans.get(e.node_id);
  if(plan?.scope_expr_id){
   const rewrite=i=>{const old=f.expressions.set_expr_nodes.find(x=>x.expr_id===i);if(!old)return i;
    const body={...old};delete body.expr_id;
    if(body.entity_node_id===ref.node_id)body.entity_node_id=target.node_id;
    if(body.base_entity_node_id===ref.node_id)body.base_entity_node_id=target.node_id;
    if(body.operand_expr_ids)body.operand_expr_ids=body.operand_expr_ids.map(rewrite);
    for(const key of ['base_expr_id','excluded_expr_id'])if(body[key])body[key]=rewrite(body[key]);
    body.source_span_ids=uniq([...body.source_span_ids,...ref.metadata.resolution.source_span_ids]);body.relation_ids=uniq([...body.relation_ids.filter(i=>i!==r.relation_id),replacement.relation_id]);
    const expr={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===expr.expr_id))f.expressions.set_expr_nodes.push(expr);return expr.expr_id;
   };plan.scope_expr_id=rewrite(plan.scope_expr_id);
  }
 }
 return f;
}
