import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Budget domains are existing typed execution use-sites in the structural
// block. Memory comparators and retired hypotheses are not executable targets.
export function retryDomains(f){
 const {nm,sp,edge,expr}=graphApi(f),log=[];f.semantic_decoding.retry_domain_ir=log;
 for(const cert of f.semantic_decoding.resource_target_ir.certificates.filter(c=>c.category==='RETRY_COUNT')){
  const retry=nm(cert.target_node_id),a=f.analyses.find(a=>a.cl.id===retry.metadata.clause_id),local=/单次(?:查询|请求|调用|检查)|per\s+(?:query|request|call|check)/iu.exec(a.cl.span.quote);let domain=[];
  if(local){const at=a.cl.span.start+[...a.cl.span.quote.slice(0,local.index)].length;domain=[{object:f.tools.node(a.cl,'ENTITY',at,at+[...local[0]].length,{sense:'EXECUTION_BUDGET_DOMAIN',owner:retry.node_id,discourse:a.discourse}),event:null}];}
  else for(const b of f.analyses.filter(b=>b.parent_structure_id===a.parent_structure_id&&b.cl.span.end<a.cl.span.start))for(const e of b.events.filter(e=>['run','call'].includes(e.metadata.sense)&&['REQUIRED','PERMITTED'].includes(e.metadata.modality)))for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&r.relation_type==='PATIENT'))domain.push({event:e,object:nm(r.tail_node_id)});
  domain=[...new Map(domain.map(d=>[d.object.node_id,d])).values()];
  if(!domain.length)continue;for(const r of f.relations.filter(r=>r.head_node_id===retry.node_id&&r.state==='SUPPORTED'&&r.relation_type==='PATIENT')){r.state='REJECTED';r.rejection_reason='REBUILD_TYPED_RETRY_DOMAIN';}
  if(domain.length!==1){const u=f.tools.unknown(a.cl,'UNRESOLVED_QUANTIFICATION','Retry has competing explicit execution domains',domain.map(d=>d.object.node_id));f.expression_plans.set(retry.node_id,{...f.expression_plans.get(retry.node_id),unresolved_ref:u});continue;}
  const d=domain[0],r=edge(a,'PATIENT',retry,d.object),binding=d.event?edge(a,'CONJUNCTION',retry,d.event):null,scope=expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:d.object.node_id,relation_ids:[r.relation_id],source_span_ids:uniq([a.sid,...d.object.source_span_ids])});
  const q=f.expressions.quantity_expr_nodes.find(q=>q.expr_id===cert.quantity_expr_id),{expr_id:originalExprId,...body}=q,newExprId=expr(f.expressions.quantity_expr_nodes,{...body,relation_ids:uniq([...q.relation_ids,r.relation_id,binding?.relation_id]),source_span_ids:uniq([...q.source_span_ids,...d.object.source_span_ids,...d.event?.source_span_ids??[]])});cert.original_quantity_expr_id=originalExprId;cert.quantity_expr_id=newExprId;f.expression_plans.set(retry.node_id,{...f.expression_plans.get(retry.node_id),scope_expr_id:scope,quantity_expr_id:newExprId});
  cert.execution_object_id=d.object.node_id;cert.execution_node_id=d.event?.node_id??null;log.push({rule:local?'EXPLICIT_PER_EXECUTION_BUDGET':'UNIQUE_TYPED_EXECUTION_BUDGET',retry_node_id:retry.node_id,domain_node_id:d.object.node_id,candidate_domain_ids:domain.map(d=>d.object.node_id),relation_ids:uniq([r.relation_id,binding?.relation_id]),source_span_ids:uniq([a.sid,...d.object.source_span_ids])});
 }
 return f;
}
