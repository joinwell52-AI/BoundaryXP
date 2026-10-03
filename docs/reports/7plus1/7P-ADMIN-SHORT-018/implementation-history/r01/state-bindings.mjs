import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';

// Object identity is selected from typed use-sites in the same root, not from
// the nearest text or an arbitrary noun. Qualifiers never migrate to siblings.
export function closeRootStateBindings(f){
 const {node,relation,span}=f.tools,log=f.semantic_decoding.admin_root,cp=[...f.source.raw_text];
 const sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i);
 function domain(before,type){return [...new Map(f.relations.filter(r=>r.state==='RESOLVED'&&r.relation_type===type&&sp(nm(r.tail_node_id)).start<before).map(r=>{const n=nm(r.tail_node_id);return [n.metadata.artifact_identity??n.surface,n];})).values()];}
 const output=before=>domain(before,'RESULT').filter(n=>n.metadata.literal_tag==='FILEPATH');
 const input=before=>domain(before,'SCOPE_MEMBER').filter(n=>n.metadata.literal_tag==='FILEPATH');
 const edge=(a,type,h,t)=>{const r=relation(a.cl,type,h,t,[a.sid,...h.source_span_ids,...t.source_span_ids]);if(r){r.state='RESOLVED';delete r.unresolved_ref;r.rule_refs=uniq([...r.rule_refs,'ADMIN_ROOT_UNIQUE_TYPED_STATE_OBJECT']);}return r;};
 const make=body=>{const expr={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.condition_expr_nodes.some(e=>e.expr_id===expr.expr_id))f.expressions.condition_expr_nodes.push(expr);return expr.expr_id;};
 for(const expr of f.expressions.condition_expr_nodes.filter(e=>e.op==='STATE_REF')){
  const st=nm(expr.state_node_id),a=f.analyses.find(a=>a.cl.id===st?.metadata.clause_id);if(!a||!boundaryDomain(a.discourse)||st.metadata.object_node_ids?.length)continue;
  let objects=[],sense=null,quantifier=null;
  if(/(?:报告|文档|report|document).*(?:已生成|has been generated)/iu.test(st.surface)){objects=output(sp(st).start);sense='OUTPUT_EXISTS';}
  else if(/(?:全部|所有|每|all|every).*(?:记录|项|record|item).*(?:检查完|检查完成|checked)/iu.test(st.surface)){objects=input(sp(st).start);sense='ALL_CHECKED';quantifier='ALL';}
  if(!sense)continue;
  if(objects.length!==1){log.unhandled.push({rule:'TYPED_STATE_ARGUMENT_DOMAIN',state_node_id:st.node_id,candidate_ids:objects.map(n=>n.node_id),reason:'NOT_UNIQUE_COMPATIBLE_OBJECT',source_span_ids:st.source_span_ids});continue;}
  Object.assign(st.metadata,{sense,object_node_ids:[objects[0].node_id],...(quantifier?{quantifier,universal_scope:true}:{}),object_binding:{rule:'UNIQUE_PRIOR_TYPED_USE_SITE_IN_ROOT',candidate_ids:objects.map(n=>n.node_id),source_span_ids:uniq([...st.source_span_ids,...objects[0].source_span_ids])}});
  const r=edge(a,'CONJUNCTION',st,objects[0]);expr.relation_ids=uniq([...expr.relation_ids,r.relation_id]);expr.source_span_ids=uniq([...expr.source_span_ids,...r.evidence_span_ids]);
  log.rules.push({rule:'TYPED_STATE_ARGUMENT_DOMAIN',state_node_id:st.node_id,object_node_ids:st.metadata.object_node_ids,condition_expr_id:expr.expr_id,relation_ids:[r.relation_id],source_span_ids:expr.source_span_ids});
 }
 // Confirmation is a state guard only with explicit temporal continuation.
 // A retained quote or an unrelated confirmation cannot license a transfer.
 for(const a of f.analyses){const raw=a.cl.span.quote,marker=a.cl.tokens.find(t=>/^(?:确认|confirm|confirms)$/iu.test(t.text));if(!marker||!/后\s*$/u.test(raw)||!boundaryDomain(a.discourse))continue;
  const actors=a.cl.tokens.filter(t=>t.end<=marker.start&&(/^(NR|PROPN)$/u.test(t.pos??'')||/^[A-Z][A-Z0-9_-]{1,15}$/u.test(t.text)));
  const precedingOutputs=output(a.cl.span.start),next=f.analyses.filter(n=>n.cl.sentence_id===a.cl.sentence_id&&n.cl.span.start>a.cl.span.end);
  const transfers=next.flatMap(n=>n.events.filter(e=>e.metadata.sense==='send').map(e=>({a:n,e})));
  if(actors.length!==1||precedingOutputs.length!==1||!transfers.length)continue;
  const all=/(?:每一项|每个|全部|所有|每项|\ball\b|\bevery\b)/iu.test(raw),body=cp.slice(marker.end,a.cl.span.end-1).join('');
  if(!/(?:报告.*覆盖|都已记录|均已记录)/u.test(body))continue;
  const actor=node(a.cl,'ENTITY',actors[0].start,actors[0].end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',owner:a.cl.id,discourse:a.discourse});actor.metadata.participant_roles=['REVIEWER'];actor.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_CONFIRMATION_REVIEWER',source_span_ids:[a.sid,...actor.source_span_ids]};f.admin_explicit_roles.set(actor.node_id,['REVIEWER']);
  const oldIds=a.events.map(e=>e.node_id),removed=f.unresolved.filter(u=>u.related_clause_ids.length===1&&u.related_clause_ids[0]===a.cl.id);
  log.retired_diagnostics.push(...removed.map(u=>({...structuredClone(u),replacement_evidence_span_ids:[a.sid],reason:'EXPLICIT_CONFIRMATION_STATE_GUARD'})));f.unresolved=f.unresolved.filter(u=>!removed.includes(u));
  for(const r of f.relations.filter(r=>r.clause_id===a.cl.id)){r.state='REJECTED';delete r.unresolved_ref;}for(const e of a.events){f.expression_plans.delete(e.node_id);e.metadata.retired_by_admin_root='CONFIRMATION_ANTECEDENT_NOT_EXECUTION';}a.events=[];
  const st=node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'REVIEW_CONFIRMED',owner:a.cl.id,discourse:a.discourse,reviewer_node_id:actor.node_id,object_node_ids:[precedingOutputs[0].node_id],required_content:{predicate:/覆盖/u.test(body)?'COVERS':'RECORDS',quantifier:all?'ALL':'UNSTATED',object:body,source_span_ids:[span(marker.end,a.cl.span.end-1)]},polarity:'POSITIVE',syntactic_layer:'CONDITION_ANTECEDENT'});Object.assign(st.metadata,{sense:'REVIEW_CONFIRMED',reviewer_node_id:actor.node_id,object_node_ids:[precedingOutputs[0].node_id],required_content:{predicate:/覆盖/u.test(body)?'COVERS':'RECORDS',quantifier:all?'ALL':'UNSTATED',object:body,source_span_ids:[span(marker.end,a.cl.span.end-1)]}});a.state=st;a.handled=true;
  edge(a,'AGENT',st,actor);edge(a,'CONJUNCTION',st,precedingOutputs[0]);
  for(const {a:next,e} of transfers){const rel=edge(next,'CONDITION_OF',st,e),expr=make({op:'STATE_REF',state_node_id:st.node_id,source_span_ids:uniq([a.sid,next.sid,...precedingOutputs[0].source_span_ids]),relation_ids:[rel.relation_id]});f.expression_plans.set(e.node_id,{...f.expression_plans.get(e.node_id),condition_expr_id:expr});log.rules.push({rule:'EXPLICIT_CONFIRMATION_STATE_GUARD',clause_id:a.cl.id,state_node_id:st.node_id,governed_event_node_id:e.node_id,condition_expr_id:expr,object_node_ids:st.metadata.object_node_ids,reviewer_node_id:actor.node_id,retired_event_ids:oldIds,source_span_ids:[a.sid,next.sid],relation_ids:[rel.relation_id]});}
 }
 // Resolve "其中" only inside its explicit sentence with one read artifact.
 for(const n of f.semantic_nodes.filter(n=>n.node_type==='ENTITY'&&/^其中/u.test(n.surface))){const a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id);if(!a)continue;const refs=f.relations.filter(r=>r.state==='RESOLVED'&&r.relation_type==='PATIENT'&&nm(r.head_node_id)?.metadata.sense==='read'&&f.analyses.find(x=>x.cl.id===r.clause_id)?.cl.sentence_id===a.cl.sentence_id&&sp(nm(r.tail_node_id)).start<sp(n).start).map(r=>nm(r.tail_node_id));const unique=[...new Map(refs.map(n=>[n.metadata.artifact_identity??n.surface,n])).values()];if(unique.length!==1)continue;n.metadata.local_reference={referent_node_id:unique[0].node_id,quantifier:/所有|全部/u.test(n.surface)?'ALL':'UNSTATED',qualifier:n.surface,source_span_ids:uniq([...n.source_span_ids,...unique[0].source_span_ids])};edge(a,'PART_OF',n,unique[0]);log.rules.push({rule:'EXPLICIT_SENTENCE_MEMBER_REFERENCE',node_id:n.node_id,referent_node_id:unique[0].node_id,source_span_ids:n.metadata.local_reference.source_span_ids});}
 f.tools.attachContext();buildSemanticOwnership(f,'ADMIN_ROOT_STATE_BOUND_FINAL');return f;
}
