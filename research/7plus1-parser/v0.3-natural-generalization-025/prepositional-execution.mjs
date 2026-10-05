import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {graphApi} from './migration/graph-api.mjs';
// A case-marked location followed by an explicit execution support word and
// a nominal check argument may share an NLP noun chunk. Preserve the layers.
export function prepositionalExecution(f){
 const {edge,nm,sp,expr}=graphApi(f),log=[];f.semantic_decoding.prepositional_execution_ir=log;
 for(const a of f.analyses){const ts=a.cl.tokens;
  for(const t of ts.filter(t=>/^(执行|运行|execute|perform)$/iu.test(t.text)&&/^(NN|NOUN|VV|VERB)$/u.test(t.pos??''))){
   const pre=ts.filter(q=>q.start<t.start&&/^(在|in|at)$/iu.test(q.text)&&q.dep==='case'),location=pre.length===1?pre[0]:null;if(!location)continue;
   const connector=ts.find(q=>q.start>=t.end&&/^(并|and)$/iu.test(q.text)&&ts.some(v=>v.start>=q.end&&/^(VV|VERB)$/u.test(v.pos??'')));
   if(!connector||connector.start<=t.end||t.start<=location.end||!ts.some(q=>q.start>=t.end&&q.end<=connector.start&&/^(NN|NR|NOUN|PROPN)$/u.test(q.pos??'')))continue;
   const licensed=ts.some(q=>q.start<location.start&&/^(请|必须|须|please|must)$/iu.test(q.text));if(!licensed)continue;
   for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.clause_id===a.cl.id&&r.relation_type==='SCOPE_MEMBER')){const s=sp(nm(r.tail_node_id));if(s.start<=t.start&&s.end>=connector.start){r.state='REJECTED';r.rejection_reason='LOCATION_EXECUTION_ARGUMENT_LAYERS';}}
   const e=f.tools.node(a.cl,'EVENT',t.start,t.end,{sense:'run',token_id:t.id,owner:a.cl.id,discourse:a.discourse,modality:'REQUIRED',modality_rule:'EXPLICIT_CASE_MARKED_EXECUTION_DIRECTIVE'});
   const existing=f.relations.filter(r=>r.head_node_id===e.node_id&&r.relation_type==='PATIENT'&&r.state==='SUPPORTED').map(r=>nm(r.tail_node_id)).filter(n=>{const s=sp(n);return s.start===t.end&&s.end===connector.start;});
   const o=existing.length===1?existing[0]:f.tools.node(a.cl,'ENTITY',t.end,connector.start,{sense:'EXECUTION_ARGUMENT',owner:e.node_id,discourse:a.discourse,syntax_token_ids:ts.filter(q=>q.start>=t.end&&q.end<=connector.start).map(q=>q.id)}),env=f.tools.node(a.cl,'ENTITY',location.end,t.start,{sense:'EXECUTION_ENVIRONMENT',owner:e.node_id,discourse:a.discourse});
   if(!a.events.some(n=>n.node_id===e.node_id))a.events.push(e);const argument=edge(a,'PATIENT',e,o),scope=edge(a,'SCOPE_MEMBER',f.tools.task,o),place=edge(a,'LOCATION',e,env);
   const org=ts.find(q=>q.end<=location.start&&/^(组织|organize|organise)$/iu.test(q.text)),subjects=org?ts.filter(q=>q.head===ts.indexOf(org)&&q.end<=org.start&&/^[A-Z][A-Z0-9_-]{1,15}$/u.test(q.text)):[];
   if(subjects.length===1){const q=subjects[0],who=f.tools.node(a.cl,'ENTITY',q.start,q.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:q.id,owner:a.cl.id,discourse:a.discourse});who.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_ORGANIZATION_SUBJECT',source_span_ids:[a.sid],authority_inferred:false};who.metadata.participant_roles=uniq([...(who.metadata.participant_roles??[]),'PERFORMER']);f.admin_explicit_roles.set(who.node_id,who.metadata.participant_roles);edge(a,'AGENT',e,who);}
   const only=ts.find(q=>q.end===location.start&&/^(仅|只|only)$/iu.test(q.text));if(only){const st=f.tools.node(a.cl,'STATE',only.start,t.start,{sense:'ONLY_EXECUTION_DOMAIN',operator:'ONLY',owner:e.node_id,discourse:a.discourse,object_node_ids:[env.node_id]}),rels=[edge(a,'CONJUNCTION',st,e),edge(a,'CONJUNCTION',st,env)];place.dependency_relation_ids=rels.map(r=>r.relation_id);scope.dependency_relation_ids=rels.map(r=>r.relation_id);e.metadata.only_domain_state_id=st.node_id;
    const restriction=f.tools.node(a.cl,'EVENT',only.start,t.start,{sense:'scope_only',operator:'ONLY',restrict:true,modality:'REQUIRED',owner:a.cl.id,discourse:a.discourse,restricted_event_node_id:e.node_id,restriction_kind:'EXECUTION_LOCATION_ONLY',attachment_path:[a.cl.id,only.id,location.id,t.id]});
    const limit=edge(a,'RESTRICTS',restriction,env),attachment=edge(a,'CONJUNCTION',restriction,e);limit.dependency_relation_ids=uniq([attachment.relation_id,place.relation_id,...rels.map(r=>r.relation_id)]);
    f.expression_plans.set(restriction.node_id,{scope_expr_id:expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:env.node_id,source_span_ids:uniq([a.sid,...env.source_span_ids]),relation_ids:[limit.relation_id]})});
    if(!a.events.some(n=>n.node_id===restriction.node_id))a.events.push(restriction);
   }
   log.push({event_node_id:e.node_id,object_node_id:o.node_id,location_node_id:env.node_id,relation_ids:[argument.relation_id,scope.relation_id,place.relation_id],source_span_ids:[a.sid],attachment_path:[a.parent_structure_id,a.cl.id,location.id,t.id,connector.id],rule:'CASE_EXECUTION_NOMINAL_ARGUMENT_LAYERS'});
  }
 }
 return f;
}
