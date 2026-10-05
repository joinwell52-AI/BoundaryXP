import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
export function roleObjectTypeContracts(f){const {nm,sp,edge,expr}=graphApi(f),log=[];f.semantic_decoding.role_object_type_ir=log;
 for(const n of f.semantic_nodes.filter(n=>n.metadata.participant_roles?.length)){
  if(/^(?:本次|此次|本)?任务$|^(?:the|this) task$/iu.test(n.surface.trim())){
   n.metadata.participant_eligibility={eligible:false,reason:'METALINGUISTIC_TASK_SUBJECT_IS_NOT_A_PARTICIPANT',source_span_ids:n.source_span_ids};n.metadata.participant_roles=[];f.admin_explicit_roles.delete(n.node_id);for(const r of f.relations.filter(r=>r.tail_node_id===n.node_id&&r.relation_type==='AGENT'))r.state='REJECTED';log.push({node_id:n.node_id,rule:n.metadata.participant_eligibility.reason,source_span_ids:n.source_span_ids});continue;
  }
  const a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id),range=sp(n),tokens=a?.cl.tokens.filter(t=>t.start>=range.start&&t.end<=range.end)??[];
  const identities=tokens.filter(t=>/^[A-Z][A-Z0-9_-]{1,15}$/u.test(t.text)||/^(NR|PROPN)$/u.test(t.pos??'')),governors=tokens.filter(t=>/^(组织|负责|organize|organise|coordinate)$/iu.test(t.lemma??t.text));
  if(identities.length!==1||!governors.length||tokens.some(t=>!identities.includes(t)&&!governors.includes(t)&&!/^(请|please|must)$/iu.test(t.text)))continue;
  const t=identities[0],who=f.tools.node(a.cl,'ENTITY',t.start,t.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:t.id,owner:a.cl.id,discourse:a.discourse});who.metadata.participant_roles=uniq([...(who.metadata.participant_roles??[]),...n.metadata.participant_roles]);who.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_ROLE_IDENTITY_SEPARATED_FROM_GOVERNOR',source_span_ids:[a.sid,...who.source_span_ids],authority_inferred:false};f.admin_explicit_roles.set(who.node_id,who.metadata.participant_roles);
  for(const r of f.relations.filter(r=>r.tail_node_id===n.node_id&&r.state!=='REJECTED'&&['AGENT','RECIPIENT'].includes(r.relation_type))){r.state='REJECTED';edge(a,r.relation_type,nm(r.head_node_id),who);}
  n.metadata.participant_roles=[];n.metadata.participant_eligibility={eligible:false,reason:'COMPOSITE_ROLE_PHRASE_REPLACED_BY_EXACT_IDENTITY',source_span_ids:n.source_span_ids};f.admin_explicit_roles.delete(n.node_id);log.push({node_id:n.node_id,identity_node_id:who.node_id,rule:'EXPLICIT_ROLE_IDENTITY_SEPARATED_FROM_GOVERNOR',source_span_ids:[a.sid]});
 }
 for(const a of f.analyses)for(const e of a.events){const es=sp(e),self=f.relations.filter(r=>r.head_node_id===e.node_id&&r.state==='SUPPORTED'&&r.relation_type==='PATIENT'&&(()=>{const s=sp(nm(r.tail_node_id));return s.start===es.start&&s.end===es.end;})());if(!self.length)continue;
  const domain=[...new Map(f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='SCOPE_MEMBER').map(r=>nm(r.tail_node_id)).filter(n=>n.metadata.literal_tag==='FILEPATH'&&sp(n).end<a.cl.span.start&&f.analyses.find(b=>b.cl.id===n.metadata.clause_id)?.parent_structure_id===a.parent_structure_id).map(n=>[n.surface,n])).values()];
  const n=domain.length===1?domain[0]:f.tools.node(a.cl,'UNKNOWN_REFERENT',es.start,es.end,{sense:'OMITTED_SUPPORT_COMPLEMENT',owner:e.node_id,discourse:a.discourse});
  if(domain.length!==1)n.metadata.resolution={rule:'OMITTED_SUPPORT_COMPLEMENT_DOMAIN',candidate_node_ids:domain.map(n=>n.node_id),selected_node_ids:[],source_span_ids:uniq([a.sid,...domain.flatMap(n=>n.source_span_ids)]),structural_path:[a.parent_structure_id,a.cl.id],reason:'Omitted complement has no unique compatible typed input'};
  for(const r of self)r.state='REJECTED';const r=edge(a,'PATIENT',e,n);r.argument_inheritance={rule:domain.length===1?'UNIQUE_TYPED_INPUT_FOR_OMITTED_SUPPORT_COMPLEMENT':'OMITTED_SUPPORT_COMPLEMENT_DOMAIN',candidate_node_ids:domain.map(n=>n.node_id),source_span_ids:uniq([a.sid,...n.source_span_ids]),structural_path:[a.parent_structure_id,n.metadata.clause_id,a.cl.id]};
  for(const constraint of f.relations.filter(q=>q.head_node_id===e.node_id&&q.state==='SUPPORTED'&&['RESTRICTS','FORBIDS','THEME'].includes(q.relation_type)&&self.some(s=>s.tail_node_id===q.tail_node_id))){constraint.state='REJECTED';const replacement=edge(a,constraint.relation_type,e,n);replacement.argument_inheritance={...r.argument_inheritance};}
  const plan={...f.expression_plans.get(e.node_id)};
  if(domain.length===1)plan.scope_expr_id=expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:n.node_id,relation_ids:[r.relation_id],source_span_ids:r.argument_inheritance.source_span_ids});
  else{delete plan.scope_expr_id;plan.unresolved_ref=n.unresolved_ref;f.uncertain_expression_ids??=new Set();e.metadata.scope_candidate_expr_ids=domain.map(operand=>expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:operand.node_id,relation_ids:[],source_span_ids:uniq([a.sid,...operand.source_span_ids])}));for(const id of e.metadata.scope_candidate_expr_ids)f.uncertain_expression_ids.add(id);}
  f.expression_plans.set(e.node_id,plan);
  for(const member of f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='SCOPE_MEMBER'&&self.some(s=>s.tail_node_id===r.tail_node_id))){member.state='REJECTED';f.relation_scope_plans.delete(member.relation_id);}
  log.push({event_node_id:e.node_id,object_node_id:n.node_id,rule:r.argument_inheritance.rule,source_span_ids:r.argument_inheritance.source_span_ids});
 }
 // A support predicate's own span is a nominal operation, not source material.
 for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='SCOPE_MEMBER')){const n=nm(r.tail_node_id),s=sp(n);if(n.metadata.literal_tag==='FILEPATH')continue;if(f.analyses.some(a=>a.events.some(e=>e.metadata.sense!=='SOURCE_EVENT'&&sp(e).start===s.start&&sp(e).end===s.end&&f.relations.some(q=>q.state==='SUPPORTED'&&q.head_node_id===e.node_id)))){r.state='REJECTED';r.rejection_reason='OPERATION_TOKEN_IS_NOT_AN_ARTIFACT_INPUT';f.relation_scope_plans.delete(r.relation_id);}}
 return f;
}
