import {graphApi,length} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
// Units alone never establish a resource. The explicit budget operator and
// unique local execution predicate are both required.
export function executionBudgetContracts(f){const {edge,expr,sp}=graphApi(f),log=[];f.semantic_decoding.execution_budget_contract_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;const raw=a.cl.span.quote;
  const upper=/\b(?:at most|no more than)\s+(\d+)\s+(attempts?|times?)\b/iu.exec(raw);if(!upper)continue;
  const local=a.events.filter(e=>['retry','probe','query','call','run'].includes(e.metadata.sense)&&['REQUIRED','PERMITTED'].includes(e.metadata.modality)),target=local.length===1?local[0]:null;if(!target)continue;
  const lower=/\bat least\s+(\d+)\s+times?\b/iu.exec(raw),start=a.cl.span.start+length(raw.slice(0,upper.index))+length(upper[0].slice(0,upper[0].indexOf(upper[1]))),n=f.tools.node(a.cl,'VALUE',start,start+length(upper[1]),{sense:'SCALAR',owner:target.node_id,discourse:a.discourse,comparator:'LTE'}),r=edge(a,'LIMIT',target,n),values=[n];let lowerBound;
  if(lower){const at=a.cl.span.start+length(raw.slice(0,lower.index))+length(lower[0].slice(0,lower[0].indexOf(lower[1]))),v=f.tools.node(a.cl,'VALUE',at,at+length(lower[1]),{sense:'SCALAR',owner:target.node_id,discourse:a.discourse,comparator:'GTE'});values.push(v);lowerBound={inclusive:true,value:Number(lower[1])};}
  const q=expr(f.expressions.quantity_expr_nodes,{metric:'COUNT',target_node_ids:[target.node_id],upper_bound:{inclusive:true,value:Number(upper[1])},...(lowerBound?{lower_bound:lowerBound}:{}),unit:upper[2],value_node_ids:values.map(n=>n.node_id),relation_ids:[r.relation_id],source_span_ids:uniq([a.sid,...values.flatMap(n=>n.source_span_ids),...target.source_span_ids])});
  for(const prior of f.relations.filter(x=>x!==r&&x.head_node_id===target.node_id&&x.relation_type==='LIMIT'&&x.state==='SUPPORTED')){prior.state='REJECTED';prior.rejection_reason='COMPLETE_LOCAL_BOUNDED_EXECUTION_QUANTITY';}
  for(const v of values)v.metadata.quantity_classification={resource_eligible:true,category:'EXECUTION_RESOURCE',resource_kind:'RETRY_COUNT'};
  f.expression_plans.set(target.node_id,{...f.expression_plans.get(target.node_id),quantity_expr_id:q});const cert={rule:'EXPLICIT_LOCAL_EXECUTION_COUNT_BUDGET',category:'RETRY_COUNT',metric:'COUNT',comparator:'LTE',value:Number(upper[1]),unit:upper[2],target_node_id:target.node_id,value_node_id:n.node_id,quantity_expr_id:q,relation_id:r.relation_id,source_span_ids:uniq([a.sid,...values.flatMap(n=>n.source_span_ids)]),proof_refs:[]};f.semantic_decoding.resource_target_ir.certificates.push(cert);log.push({...cert,lower_bound:lowerBound??null,execution_span_id:target.source_span_ids[0],operator_span_id:f.tools.span(a.cl.span.start+length(raw.slice(0,upper.index)),a.cl.span.start+length(raw.slice(0,upper.index+upper[0].length)))});
 }
 return f;
}
