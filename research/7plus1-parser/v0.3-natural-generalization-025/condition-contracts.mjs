import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';

export function conditionContracts(f){
 const {nm,edge}=graphApi(f),log=[];f.semantic_decoding.condition_operator_contract_ir=log;
 for(const r of [...f.relations].filter(r=>r.state==='SUPPORTED'&&['CONDITION_OF','COMPLETION_OF'].includes(r.relation_type))){
  const h=nm(r.head_node_id),t=nm(r.tail_node_id),a=f.analyses.find(a=>a.cl.id===r.clause_id);
  if(!a)continue;
  const markers=a.cl.tokens.filter(q=>/^(只有|才|即可|即|only)$/iu.test(q.text)),points=[...a.cl.span.quote];
  const completion=r.relation_type==='COMPLETION_OF',necessary=completion&&(markers.some(q=>['只有','才','only'].includes(q.text))||/任务才/u.test(points.join(''))),sufficient=completion&&!necessary&&/(?:即可|即)完成/u.test(points.join(''));
  const kind=necessary?'NECESSARY':sufficient?'SUFFICIENT':'SOURCE_CONDITION';
  t.metadata.condition_operator_contracts??=[];
  const contract={relation_id:r.relation_id,condition_kind:kind,antecedent_node_id:h.node_id,consequent_node_id:t.node_id,source_span_ids:uniq([a.sid,...h.source_span_ids,...t.source_span_ids,...markers.map(q=>f.tools.span(q.start,q.end))]),rule:'EXPLICIT_CONDITION_OPERATOR'};
  t.metadata.condition_operator_contracts.push(contract);log.push(contract);
  const witnesses=f.relations.filter(x=>x.state==='SUPPORTED'&&x.relation_id!==r.relation_id&&(x.head_node_id===h.node_id||h.metadata.event_node_id&&x.head_node_id===h.metadata.event_node_id)&&['AGENT','PATIENT','THEME','CONJUNCTION'].includes(x.relation_type));
  r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),...witnesses.map(x=>x.relation_id)]);
  if(h.metadata.sense==='APPROVAL_GRANTED'&&h.metadata.polarity==='POSITIVE'){
   const approval=edge(a,'APPROVAL_OF',h,t,contract.source_span_ids);
   approval.dependency_relation_ids=uniq([r.relation_id,...f.relations.filter(x=>x.state==='SUPPORTED'&&x.head_node_id===h.node_id&&x.relation_type==='AGENT').map(x=>x.relation_id)]);
  }
 }
 return f;
}
