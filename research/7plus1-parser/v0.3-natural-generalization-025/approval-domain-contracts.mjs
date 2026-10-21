import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Shared approval predicates retain each explicitly named actor. Source-stated
// ANY/ALL doubt records competing expressions; it is not an approval selection.
export function approvalDomainContracts(f){const {sp,edge,expr}=graphApi(f),log=[];f.semantic_decoding.approval_domain_ir=log;f.uncertain_expression_ids??=new Set();
 for(const a of f.analyses){const ts=a.cl.tokens,p=ts.find(t=>/^(批准|approve|approves|approved)$/iu.test(t.lemma??t.text)&&/^(VV|VERB)$/u.test(t.pos??'')),marker=p&&ts.find(t=>t.head===ts.indexOf(p)&&/^(后|after)$/iu.test(t.text));if(!p||!marker)continue;
  const actors=ts.filter(t=>t.end<=p.start&&/^(NR|PROPN)$/u.test(t.pos??'')&&(t.head===ts.indexOf(p)||/conj/u.test(t.dep??''))),connector=ts.find(t=>t.start>=actors[0]?.end&&t.end<=actors.at(-1)?.start&&/^(或|和|与|or|and)$/iu.test(t.text));
  if(actors.length<2||!connector||!ts.some(t=>t.start>=marker.end&&/^(允许|may|permit|permits)$/iu.test(t.text)))continue;
  const consequent=a.events.filter(e=>sp(e).start>marker.end&&['read','generate','send','review'].includes(e.metadata.sense));if(!consequent.length)continue;
  const states=actors.map(actor=>{
   const person=f.tools.node(a.cl,'ENTITY',actor.start,actor.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:actor.id,owner:a.cl.id,discourse:a.discourse});person.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_NAMED_SHARED_APPROVAL_SUBJECT',source_span_ids:[a.sid,...person.source_span_ids],authority_inferred:false};person.metadata.participant_roles=uniq([...(person.metadata.participant_roles??[]),'APPROVER']);f.admin_explicit_roles.set(person.node_id,person.metadata.participant_roles);
   const state=f.tools.node(a.cl,'STATE',actor.start,p.end,{sense:'APPROVAL_GRANTED',owner:person.node_id,discourse:a.discourse,polarity:'POSITIVE',syntactic_layer:'CONDITION_ANTECEDENT',syntax_token_ids:[actor.id,p.id]});const agent=edge(a,'AGENT',state,person);return {state,person,expr_id:expr(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:state.node_id,relation_ids:[agent.relation_id],source_span_ids:[a.sid,...state.source_span_ids]})};
  });
  for(const e of a.events.filter(e=>sp(e).start<=marker.end)){e.metadata.retired_reason='APPROVAL_ANTECEDENT_IS_NOT_CURRENT_EXECUTION';for(const r of f.relations.filter(r=>r.head_node_id===e.node_id))r.state='REJECTED';}a.events=a.events.filter(e=>!e.metadata.retired_reason);
  const ambiguous=f.analyses.some(b=>b.parent_structure_id===a.parent_structure_id&&/没有说明|未说明/u.test(b.cl.span.quote)&&/任一|any/iu.test(b.cl.span.quote)&&/共同|both|all/iu.test(b.cl.span.quote));
  const primary=/或|or/iu.test(connector.text)?'OR':'AND',options=(ambiguous?['OR','AND']:[primary]).map(op=>expr(f.expressions.condition_expr_nodes,{op,operand_expr_ids:states.map(s=>s.expr_id),relation_ids:[],source_span_ids:[a.sid]})),condition=options[0];
  if(ambiguous){for(const i of options)f.uncertain_expression_ids.add(i);const base=f.tools.node(a.cl,'ENTITY',actors[0].start,actors.at(-1).end,{sense:'EXPLICIT_APPROVAL_ACTOR_DOMAIN',owner:a.cl.id,discourse:a.discourse});for(const kind of ['ANY','ALL'])expr(f.expressions.set_expr_nodes,{kind,base_entity_node_id:base.node_id,relation_ids:[],source_span_ids:[a.sid,...base.source_span_ids]});}
  for(const e of consequent){for(const s of states)edge(a,'CONDITION_OF',s.state,e);f.expression_plans.set(e.node_id,{...f.expression_plans.get(e.node_id),condition_expr_id:condition});}
  log.push({clause_id:a.cl.id,actor_node_ids:states.map(s=>s.person.node_id),condition_expr_ids:options,selected_condition_expr_id:ambiguous?null:condition,status:ambiguous?'SOURCE_AMBIGUITY':'EXPLICIT_OPERATOR',source_span_ids:[a.sid]});
 }
 return f;
}
