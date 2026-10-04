import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {graphApi} from './migration/graph-api.mjs';

// An explicit before-marked subordinate predicate, or an event nominal with
// one compatible artifact-bound event, licenses order. Text proximity does not.
export function beforeSequence(f){
 const {nm,sp,edge,expr}=graphApi(f),log=[];
 const active=e=>f.relations.some(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&['PATIENT','THEME','RESULT'].includes(r.relation_type));
 f.semantic_decoding.before_sequence_ir=log;
 for(const a of f.analyses){
  const ts=a.cl.tokens;
  for(const marker of ts.filter(t=>/^before$/iu.test(t.text)&&/^(mark|prep)$/u.test(t.dep??''))){
   const prior=[...new Map(a.events.filter(e=>active(e)&&sp(e).end<=marker.start&&e.metadata.modality==='REQUIRED').map(e=>[e.node_id,e])).values()];
   if(prior.length!==1)continue;
   const antecedent=prior[0],mi=ts.indexOf(marker),token=ts[marker.head];let domain=[];
   if(marker.dep==='mark'&&token?.dep==='advcl'){
    domain=a.events.filter(e=>active(e)&&e.metadata.token_id===token.id);
   }else if(marker.dep==='prep'){
    const nominals=ts.filter(t=>t.head===mi&&t.dep==='pobj'&&/^delivery$/iu.test(t.text));
    const objects=f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===antecedent.node_id&&['PATIENT','THEME'].includes(r.relation_type)).map(r=>r.tail_node_id);
    if(nominals.length===1&&objects.length===1){
     domain=f.semantic_nodes.filter(n=>n.node_type==='EVENT'&&active(n)&&(n.metadata.sense==='send'||/^deliver(?:s|ed)?$/iu.test(n.surface))&&sp(n).start<a.cl.span.start&&f.analyses.find(x=>x.cl.id===n.metadata.clause_id)?.parent_structure_id===a.parent_structure_id&&f.relations.some(r=>r.state==='SUPPORTED'&&r.head_node_id===n.node_id&&['PATIENT','THEME','RESULT'].includes(r.relation_type)&&objects.includes(r.tail_node_id)));
    }
   }
   domain=[...new Map(domain.map(n=>[n.node_id,n])).values()];
   if(domain.length!==1){const unknown=f.tools.unknown(a.cl,'UNRESOLVED_SCOPE','Explicit before marker lacks one artifact-compatible event domain',[antecedent.node_id,...domain.map(n=>n.node_id)]);f.expression_plans.set(antecedent.node_id,{...f.expression_plans.get(antecedent.node_id),unresolved_ref:unknown});log.push({clause_id:a.cl.id,marker_span_id:f.tools.span(marker.start,marker.end),candidate_event_ids:domain.map(n=>n.node_id),unresolved_id:unknown,status:'UNRESOLVED_EVENT_DOMAIN'});continue;}
   const consequent=domain[0],ct=ts.find(t=>t.id===consequent.metadata.token_id),ci=ts.indexOf(ct),markSpan=f.tools.span(marker.start,marker.end);
   const subject=ct?ts.filter(t=>t.start>=marker.end&&t.end<=ct.start&&(/nsubj/u.test(t.dep??'')&&t.head===ci||t.dep==='pobj'&&t.head===mi)&&/^[A-Z][A-Z0-9_-]{1,15}$/u.test(t.text)):[];
   if(subject.length===1){
    const t=subject[0],actor=f.tools.node(a.cl,'ENTITY',t.start,t.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:t.id,owner:consequent.node_id,discourse:a.discourse});
    actor.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_BEFORE_SUBCLAUSE_SUBJECT',source_span_ids:[a.sid,...actor.source_span_ids],authority_inferred:false};actor.metadata.participant_roles=uniq([...(actor.metadata.participant_roles??[]),'PERFORMER']);f.admin_explicit_roles.set(actor.node_id,actor.metadata.participant_roles);
    edge(a,'AGENT',consequent,actor,[markSpan]);
   }
   const state=f.tools.node(a.cl,'STATE',sp(antecedent).start,marker.start,{sense:'EVENT_COMPLETED',event_node_id:antecedent.node_id,owner:a.cl.id,discourse:a.discourse,syntactic_layer:'CONDITION_ANTECEDENT',temporal_marker_span_id:markSpan});
   const condition=edge(a,'CONDITION_OF',state,consequent,[markSpan]),sequence=edge(a,'SEQUENCE',antecedent,consequent,[markSpan]);
   const facts=f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===antecedent.node_id&&['AGENT','PATIENT','THEME'].includes(r.relation_type));
   condition.dependency_relation_ids=uniq([sequence.relation_id,...facts.map(r=>r.relation_id)]);
   const conditionId=expr(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:state.node_id,source_span_ids:uniq([a.sid,markSpan,...state.source_span_ids]),relation_ids:[condition.relation_id]});
   const plan=f.expression_plans.get(consequent.node_id)??{};
   const result=plan.condition_expr_id?expr(f.expressions.condition_expr_nodes,{op:'AND',operand_expr_ids:uniq([plan.condition_expr_id,conditionId]),source_span_ids:[a.sid,markSpan],relation_ids:[condition.relation_id]}):conditionId;
   f.expression_plans.set(consequent.node_id,{...plan,condition_expr_id:result});
   log.push({clause_id:a.cl.id,antecedent_event_id:antecedent.node_id,consequent_event_id:consequent.node_id,candidate_event_ids:domain.map(n=>n.node_id),condition_expr_id:result,structural_path:[a.parent_structure_id,a.cl.id,marker.id,consequent.metadata.token_id],source_span_ids:[a.sid,markSpan],relation_ids:[condition.relation_id,sequence.relation_id],status:'UNIQUE_STRUCTURAL_EVENT_DOMAIN'});
  }
 }
 return f;
}
