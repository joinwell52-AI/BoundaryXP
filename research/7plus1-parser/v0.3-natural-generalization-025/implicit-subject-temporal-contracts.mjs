import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Same-sentence coordination can inherit a directive without inventing an actor.
export function implicitSubjectTemporalContracts(f){const {cp,edge,expr,retire}=graphApi(f),log=[];f.semantic_decoding.implicit_subject_temporal_ir=log;
 for(const a of f.analyses){const ts=a.cl.tokens;
  if(!/^(?:并|且|and\b)/iu.test(a.cl.span.quote))continue;
  const prior=f.analyses.filter(b=>b.cl.sentence_id===a.cl.sentence_id&&b.cl.span.end<a.cl.span.start&&b.events.some(e=>e.metadata.modality==='REQUIRED')).at(-1);if(!prior)continue;
  const marker=ts.find(t=>/^(后|after)$/iu.test(t.text)&&/case|mark/u.test(t.dep??''));if(!marker)continue;
  const first=ts[marker.head],next=ts.filter(t=>t.start>=marker.end&&/^(VV|VERB)$/u.test(t.pos??'')&&/^(形成|生成|create|generate)$/iu.test(t.lemma??t.text));
  if(!first||!/^(检查|核查|复核|check|inspect|review)$/iu.test(first.text)||next.length!==1)continue;
  const object=ts.find(t=>t.head===marker.head&&/^(dobj|obj)$/u.test(t.dep??'')&&t.end<marker.start);if(!object)continue;
  const modifiers=ts.filter(t=>t.head===ts.indexOf(object)&&/amod|det|compound/u.test(t.dep??'')),start=Math.min(object.start,...modifiers.map(t=>t.start)),end=object.end,files=a.locals.filter(n=>n.metadata.literal_tag==='FILEPATH'&&f.source_spans.find(s=>s.span_id===n.source_span_ids[0]).start>=next[0].end);if(files.length!==1)continue;
  retire(a,'DIRECTIVE_INHERITED_IN_EXPLICIT_TEMPORAL_COORDINATION');
  const event=(t,sense)=>f.tools.node(a.cl,'EVENT',t.start,t.end,{sense,token_id:t.id,owner:a.cl.id,discourse:a.discourse,modality:'REQUIRED',modality_rule:'EXPLICIT_COORDINATED_TEMPORAL_DIRECTIVE',attachment_path:[prior.cl.id,a.cl.id,t.id],modality_source_span_ids:prior.events.flatMap(e=>e.metadata.modality_source_span_ids??[])});
  const before=event(first,'review'),after=event(next[0],'generate');for(const e of [before,after]){e.metadata.modality='REQUIRED';delete e.metadata.retired_by_admin_root;delete e.metadata.modality_unresolved;delete e.unresolved_ref;}a.events=[before,after];
  const arg=f.tools.node(a.cl,'ENTITY',start,end,{sense:'LOCAL_TEMPORAL_ARGUMENT',owner:before.node_id,discourse:a.discourse}),patient=edge(a,'PATIENT',before,arg),result=edge(a,'RESULT',after,files[0]);
  const state=f.tools.node(a.cl,'STATE',first.start,marker.start,{sense:'EVENT_COMPLETED',event_node_id:before.node_id,object_node_ids:[arg.node_id],owner:a.cl.id,discourse:a.discourse}),dep=edge(a,'CONJUNCTION',state,before),guard=edge(a,'CONDITION_OF',state,after);dep.dependency_relation_ids=[patient.relation_id];
  const condition=expr(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:state.node_id,source_span_ids:[a.sid,...state.source_span_ids],relation_ids:[guard.relation_id,dep.relation_id]});f.expression_plans.set(after.node_id,{condition_expr_id:condition,scope_expr_id:expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:files[0].node_id,relation_ids:[result.relation_id],source_span_ids:uniq([a.sid,...files[0].source_span_ids])})});
  log.push({clause_id:a.cl.id,prior_clause_id:prior.cl.id,antecedent_event_id:before.node_id,consequent_event_id:after.node_id,condition_expr_id:condition,marker_token_id:marker.id,source_span_ids:[prior.sid,a.sid]});
 }
 return f;
}
