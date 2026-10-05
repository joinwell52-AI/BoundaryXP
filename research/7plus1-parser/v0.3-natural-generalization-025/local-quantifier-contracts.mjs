import {graphApi,length} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Local quantifiers qualify their source argument/state; they do not replace
// a file with a guessed business collection or grant an execution obligation.
export function localQuantifierContracts(f){
 const {cp,sp,expr,edge}=graphApi(f),log=[];f.semantic_decoding.local_quantifier_contract_ir=log;
 for(const owner of [...f.semantic_nodes].filter(n=>['ENTITY','STATE'].includes(n.node_type)&&!n.metadata.retired_by_admin_root)){
  const a=f.analyses.find(a=>a.cl.id===owner.metadata.clause_id),span=sp(owner);if(!a||!span||!f.relations.some(r=>r.state==='SUPPORTED'&&(r.head_node_id===owner.node_id||r.tail_node_id===owner.node_id)))continue;
  const text=cp.slice(span.start,span.end).join(''),matches=[...text.matchAll(/(?:全部|所有|每项|每个|every\b|all\b)\s*(.+?)(?=的|都|均|已|是否|\s+(?:has|have|is|are|must|shall|should)\b|$)/giu)];
  for(const match of matches){const term=match[1].trim();if(!term||/^(?:任务|task)$/iu.test(term)||/[；。]/u.test(term))continue;const start=span.start+length(text.slice(0,match.index))+length(match[0].slice(0,match[0].indexOf(match[1]))),end=start+length(term),tokens=a.cl.tokens.filter(t=>t.start>=start&&t.end<=end);if(!tokens.some(t=>/^(NN|NNS|NOUN|PROPN)$/u.test(t.pos??'')))continue;
   const n=f.tools.node(a.cl,'ENTITY',start,end,{sense:'LOCALLY_QUANTIFIED_DOMAIN',owner:owner.node_id,discourse:owner.metadata.discourse??a.discourse,quantifier:'ALL',syntax_token_ids:tokens.map(t=>t.id)}),r=edge(a,'CONJUNCTION',owner,n),q=expr(f.expressions.set_expr_nodes,{kind:'ALL',base_entity_node_id:n.node_id,relation_ids:[r.relation_id],source_span_ids:uniq([a.sid,...owner.source_span_ids,...n.source_span_ids])});owner.metadata.local_quantifier_scope_expr_ids=uniq([...(owner.metadata.local_quantifier_scope_expr_ids??[]),q]);log.push({rule:'EXPLICIT_QUANTIFIER_WITH_LOCAL_NOMINAL_DOMAIN',owner_node_id:owner.node_id,domain_node_id:n.node_id,scope_expr_id:q,relation_id:r.relation_id,source_span_ids:uniq([a.sid,...owner.source_span_ids,...n.source_span_ids]),attachment_path:[a.cl.id,owner.node_id,n.node_id]});
  }
 }
 return f;
}
