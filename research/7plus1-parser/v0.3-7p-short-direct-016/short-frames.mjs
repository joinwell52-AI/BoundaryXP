import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {modifierPhrase} from '../v0.3-7p-composition-014/syntax-mechanisms.mjs';

// Syntax-to-candidate recovery only. All outputs still pass ownership,
// eligibility, BoundaryIR, the existing eight Q queries and ProofDAG.
export function closeShortFrames(f){
 const {node,relation,span,task}=f.tools,cp=[...f.source.raw_text],audit={version:'SHORT_DIRECT_016',assignments:[],state_bindings:[],arbitration:[]};
 f.semantic_decoding.short_direct=audit;const states=[];
 const sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const make=(list,b)=>{const e={expr_id:id(f.source.sha256,'expr',b),...b};if(!list.some(x=>x.expr_id===e.expr_id))list.push(e);return e.expr_id;};
 const clear=ids=>{f.unresolved=f.unresolved.filter(u=>!(u.related_node_ids.length&&u.related_node_ids.every(i=>ids.includes(i))));};
 function retire(a,e,why){a.events=a.events.filter(n=>n!==e);clear([e.node_id]);delete e.metadata.modality_unresolved;delete e.unresolved_ref;e.metadata.retired_by_short_direct=why;
  const rs=f.relations.filter(r=>r.head_node_id===e.node_id||r.tail_node_id===e.node_id);for(const r of rs){r.state='REJECTED';delete r.unresolved_ref;}
  audit.arbitration.push({event_node_id:e.node_id,relation_ids:rs.map(r=>r.relation_id),reason:why,source_span_ids:e.source_span_ids});
 }
 // Local quantified perfective states retain both the nominal subject and its
 // relative-clause qualifier. They remain states, never imperative actions.
 for(const a of f.analyses){const ts=a.cl.tokens,pred=ts.find(t=>/^(记录|recorded)$/iu.test(t.text));if(!pred||!ts.some(t=>/^(已|already)$/iu.test(t.text))||!ts.some(t=>/^(所有|全部|all)$/iu.test(t.text)))continue;
  const subject=ts.filter(t=>/^nsubj$/iu.test(t.dep??'')&&ts[t.head]===pred);if(subject.length!==1)continue;const ob=node(a.cl,'ENTITY',subject[0].start,subject[0].end,{sense:'STATE_OBJECT',owner:a.cl.id,discourse:a.discourse});
  const st=node(a.cl,'STATE',subject[0].start,pred.end,{sense:'ALL_RECORDED',owner:a.cl.id,discourse:a.discourse,object_node_ids:[ob.node_id],quantifier:'ALL',relative_predicate_token_ids:ts.filter(t=>/^acl$/iu.test(t.dep??'')).map(t=>t.id),polarity:'POSITIVE'});const r=acceptedEdge(a,'CONJUNCTION',st,ob);if(a.state)clear([a.state.node_id]);a.state=st;a.handled=true;states.push({a,st,evidence:r});
  for(const e of [...a.events])retire(a,e,'QUANTIFIED_PERFECTIVE_STATE_NOT_EXECUTION');
 }
 // Explicit reviewer confirmation is a completion-state witness. The local
 // proper-name subject must alias exactly one already typed recipient/role.
 for(const a of f.analyses){const ts=a.cl.tokens,pred=ts.find(t=>/^(确认|confirm|confirms)$/iu.test(t.text));if(!pred||!ts.some(t=>/^(只有|only)$/iu.test(t.text)))continue;
  const subjects=ts.filter(t=>/^nsubj$/iu.test(t.dep??'')&&ts[t.head]===pred&&/^(NR|PROPN)$/u.test(t.pos??'')),files=a.locals.filter(n=>n.metadata.literal_tag==='FILEPATH');if(subjects.length!==1||files.length!==1)continue;
  const people=f.semantic_nodes.filter(n=>n.node_type==='ENTITY'&&n.metadata.participant_eligibility?.eligible&&n.metadata.participant_roles?.includes('RECIPIENT')&&n.surface.endsWith(subjects[0].text));const unique=[...new Map(people.map(n=>[n.surface,n])).values()];if(unique.length!==1)continue;
  const contains=ts.find(t=>/^(包含|contain|contains)$/iu.test(t.text)&&ts[t.head]===pred),args=contains?ts.filter(t=>/^dobj|obj$/iu.test(t.dep??'')&&ts[t.head]===contains):[];if(!contains||args.length!==1)continue;
  const actor=unique[0];actor.metadata.participant_roles=uniq([...actor.metadata.participant_roles,'REVIEWER']);const [start,end]=modifierPhrase(a.cl,args[0]);const file=files[0],st=node(a.cl,'STATE',subjects[0].start,a.cl.span.end,{sense:'REVIEW_CONFIRMED',owner:a.cl.id,discourse:a.discourse,reviewer_node_id:actor.node_id,object_node_ids:[file.node_id],required_content:{predicate:'CONTAINS',quantifier:ts.some(t=>/^(全部|所有|all)$/iu.test(t.text))?'ALL':'UNSTATED',object:cp.slice(start,end).join(''),source_span_ids:[span(contains.start,end)]},polarity:'POSITIVE'});const r=acceptedEdge(a,'CONJUNCTION',st,file);acceptedEdge(a,'AGENT',st,actor,[span(subjects[0].start,subjects[0].end)]);if(a.state)clear([a.state.node_id]);a.state=st;a.handled=true;states.push({a,st,evidence:r});
 }
 function acceptedEdge(a,k,h,t,extra=[]){const r=relation(a.cl,k,h,t,[a.sid,...extra]);if(r){r.state='RESOLVED';delete r.unresolved_ref;r.rule_refs=uniq([...r.rule_refs,'SHORT_DIRECT_SYNTAX']);}return r;}
 function mode(e,m){e.metadata.modality=m;clear([e.node_id]);delete e.metadata.modality_unresolved;}
 const assignments=[];
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;const text=a.cl.span.quote;
  const marker=a.cl.tokens.find(t=>t.text==='负责'||t.text.toLowerCase()==='responsible');
  if(!marker)continue;
  let ner=a.cl.entities.filter(e=>['PERSON','PER'].includes(e.label)&&e.span.end<=marker.start);
  const subjects=a.cl.tokens.filter(t=>t.end<=marker.start&&/^(NR|PROPN)$/u.test(t.pos??'')&&/^nsubj$/iu.test(t.dep??'')&&a.cl.tokens[t.head]===marker);
  if(subjects.length===1&&(!ner.length||ner.every(en=>en.span.start>=subjects[0].start&&en.span.end<=subjects[0].end)))ner=[{label:'PROPER_NAME_SUBJECT',span:{start:subjects[0].start,end:subjects[0].end},token_id:subjects[0].id}];
  const refs=a.cl.tokens.filter(t=>t.start>=marker.end&&/任务|工作|整理|核对|检查|task|work/iu.test(t.text));
  if(ner.length!==1||!refs.length)continue;
  const en=ner[0],actor=node(a.cl,'ENTITY',en.span.start,en.span.end,{literal_tag:'PERSON',owner:a.cl.id,discourse:a.discourse});
  actor.metadata.participant_roles=['PERFORMER'];actor.metadata.current_task_assignment=true;actor.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_TASK_RESPONSIBILITY_AND_NER',source_span_ids:[a.sid,...actor.source_span_ids]};
  const st=node(a.cl,'STATE',marker.start,marker.end,{sense:'TASK_ASSIGNMENT',owner:a.cl.id,discourse:a.discourse,assignment_target_id:task.node_id});
  a.state??=st;acceptedEdge(a,'AGENT',st,actor);assignments.push({a,actor,st});audit.assignments.push({actor_node_id:actor.node_id,state_node_id:st.node_id,target_node_id:task.node_id,source_span_ids:[a.sid],ner_evidence:en,structural_path:a.discourse.structural_path});a.handled=true;
  // An assigned deictic task nominal is a task reference, not another object/action.
  for(const e of [...a.events])if(sp(e).start<=marker.start||/^(?:这|本|此|this\b|the\b)/iu.test(e.surface)&&f.relations.some(r=>r.head_node_id===e.node_id&&r.relation_type==='PATIENT'&&f.semantic_nodes.find(n=>n.node_id===r.tail_node_id)?.metadata.sense==='EVENT_NOMINAL')){
   const nominal=f.relations.filter(r=>r.head_node_id===e.node_id&&['PATIENT','THEME'].includes(r.relation_type)).map(r=>r.tail_node_id);
   retire(a,e,'TASK_REFERENCE_IS_ASSIGNMENT_NOT_EXECUTION');for(const r of f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER'&&nominal.includes(r.tail_node_id))){r.state='REJECTED';audit.arbitration.push({relation_id:r.relation_id,reason:'ASSIGNMENT_TARGET_NOT_INPUT',source_span_ids:r.evidence_span_ids});}
  }
 }
 // A leading basis adjunct has a bounded pre-predicate reference domain.
 // Its object after the predicate cannot be retyped as another basis reference.
 for(const a of f.analyses){const ts=a.cl.tokens,root=ts.find(t=>/核对|检查|check|verify/iu.test(t.text)&&/^(?:VV|VERB)$/u.test(t.pos??'')&&/^root$/iu.test(t.dep??''));
  if(!root||!ts.some(t=>t.end<=root.start&&/^(依据|根据|按照|based|according)$/iu.test(t.text)))continue;
  const refs=a.locals.filter(n=>n.node_type==='REFERENCE'&&sp(n).end<=root.start),versions=refs.filter(n=>n.metadata.literal_tag==='VERSION'),basis=refs.filter(n=>n.metadata.literal_tag!=='VERSION');
  const objects=a.locals.filter(n=>n.metadata.literal_tag==='FILEPATH'&&sp(n).start>=root.end&&ts.some(t=>t.start<=sp(n).start&&t.end>=sp(n).end&&/^dobj|obj$/iu.test(t.dep??'')&&ts[t.head]===root));
  if(basis.length!==1||versions.length>1||objects.length!==1)continue;
  let e=a.events.find(e=>sp(e).start===root.start);if(!e){e=node(a.cl,'EVENT',root.start,root.end,{sense:'review',owner:a.cl.id,discourse:a.discourse,token_id:root.id,modality:'REQUIRED'});a.events.push(e);}e.metadata.sense='review';mode(e,'REQUIRED');a.handled=true;
  for(const r of f.relations.filter(r=>r.clause_id===a.cl.id&&r.relation_type==='BASIS')){r.state='REJECTED';audit.arbitration.push({relation_id:r.relation_id,reason:'BASIS_ARGUMENT_DOMAIN_REFINED_BY_TYPED_LITERAL_AND_PREDICATE',source_span_ids:r.evidence_span_ids});}
  const br=acceptedEdge(a,'BASIS',e,basis[0]);if(versions.length){basis[0].metadata.basis_version=versions[0].surface;basis[0].metadata.basis_version_node_id=versions[0].node_id;acceptedEdge(a,'CONJUNCTION',basis[0],versions[0]);}
  const pr=acceptedEdge(a,'PATIENT',e,objects[0]);const sr=acceptedEdge(a,'SCOPE_MEMBER',task,objects[0]);
  const scope=make(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:objects[0].node_id,source_span_ids:objects[0].source_span_ids,relation_ids:[pr.relation_id]});f.expression_plans.set(e.node_id,{scope_expr_id:scope});f.relation_scope_plans.set(sr.relation_id,make(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:objects[0].node_id,source_span_ids:objects[0].source_span_ids,relation_ids:[sr.relation_id]}));
  audit.state_bindings.push({rule:'BASIS_ADJUNCT_PREDICATE_OBJECT',event_node_id:e.node_id,basis_node_id:basis[0].node_id,version_node_ids:versions.map(n=>n.node_id),object_node_ids:objects.map(n=>n.node_id),relation_ids:[br.relation_id,pr.relation_id,sr.relation_id],source_span_ids:[a.sid]});
 }
 // Polite directive tokens are operators, never independent predicate frames.
 for(const a of f.analyses)for(const e of [...a.events])if(['请','please'].includes(e.surface.toLowerCase())&&a.events.some(q=>q!==e&&q.metadata.modality==='REQUIRED'))retire(a,e,'POLITE_DIRECTIVE_OPERATOR');
 // A unique explicit task assignment governs only current-task executable events.
 if(assignments.length===1){const {actor,a:assigned}=assignments[0];for(const a of f.analyses.filter(a=>boundaryDomain(a.discourse)))for(const e of a.events){if(e.metadata.completion||e.metadata.retired_by_short_direct||!['REQUIRED','PERMITTED','FORBIDDEN'].includes(e.metadata.modality))continue;
   const agents=f.relations.filter(r=>r.head_node_id===e.node_id&&r.relation_type==='AGENT'&&r.state!=='REJECTED');if(!agents.length)acceptedEdge(a,'AGENT',e,actor,[assigned.sid]);
  }}
 // Recover output-existence states from explicit perfective/passive predicates.
 // Conditional directives with a bare lexical predicate inherit imperative
 // modality only from explicit consequent syntax, never from their antecedent.
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;
  for(const e of a.events){if(e.metadata.modality!=='UNSTATED')continue;const ts=a.cl.tokens,ti=ts.findIndex(t=>t.id===e.metadata.token_id),root=ts[ti];
   if(root&&/^root$/iu.test(root.dep??'')&&/^(?:另|再|则|then|also)$/iu.test(ts[0]?.text??'')&&f.expression_plans.get(e.node_id)?.condition_expr_id)mode(e,'REQUIRED');
  }
  if(a.condition&&a.state){const ts=a.cl.tokens,found=ts.find(t=>/^(发现|find|finds)$/iu.test(t.text));if(found){const os=ts.filter(t=>/^dobj|obj$/iu.test(t.dep??'')&&ts[t.head]===found);if(os.length===1){const ob=node(a.cl,'ENTITY',os[0].start,os[0].end,{sense:'STATE_OBJECT',owner:a.cl.id,discourse:a.discourse});a.state.metadata.sense='EXISTENCE';a.state.metadata.object_node_ids=[ob.node_id];a.state.metadata.predicate_token_id=found.id;acceptedEdge(a,'CONJUNCTION',a.state,ob);}}
   const neg=ts.find(t=>/^(没有|不存在|no|absent)$/iu.test(t.text));if(!neg)continue;const objects=ts.filter(t=>t.start>=neg.end&&/^dobj|obj$/iu.test(t.dep??''));if(objects.length!==1)continue;
   const ob=node(a.cl,'ENTITY',objects[0].start,objects[0].end,{sense:'STATE_OBJECT',owner:a.cl.id,discourse:a.discourse});const st=node(a.cl,'STATE',neg.start,a.cl.span.end,{sense:'EXISTENCE',polarity:'POSITIVE',object_node_ids:[ob.node_id],owner:a.cl.id,discourse:a.discourse});const witness=acceptedEdge(a,'CONJUNCTION',st,ob);
   const pos=make(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:st.node_id,source_span_ids:[a.sid],relation_ids:[witness.relation_id]}),no=make(f.expressions.condition_expr_nodes,{op:'NOT',operand_expr_id:pos,source_span_ids:[a.sid],relation_ids:[]});
   clear([a.state.node_id]);for(const next of f.analyses.filter(x=>x.cl.sentence_id===a.cl.sentence_id&&x.cl.span.start>a.cl.span.end))for(const e of next.events){const p=f.expression_plans.get(e.node_id)??{};p.condition_expr_id=no;f.expression_plans.set(e.node_id,p);acceptedEdge(next,'CONDITION_OF',st,e,[a.sid]);}
  }
 }
 // A compound predicate token is not a second object of its own generation.
 for(const a of f.analyses)for(const e of a.events.filter(e=>e.metadata.sense==='generate')){
  const rs=f.relations.filter(r=>r.head_node_id===e.node_id&&r.state!=='REJECTED'&&['PATIENT','THEME','RESULT'].includes(r.relation_type));const results=rs.filter(r=>r.relation_type==='RESULT');if(results.length!==1)continue;
  for(const r of rs){const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id);if(n.metadata.sense==='EVENT_NOMINAL'&&sp(n).start>=sp(e).start&&sp(n).end<=sp(e).end){r.state='REJECTED';audit.arbitration.push({relation_id:r.relation_id,reason:'PREDICATE_NOMINAL_NOT_EXTRA_RESULT_OBJECT',source_span_ids:r.evidence_span_ids});}}
  const object=f.semantic_nodes.find(n=>n.node_id===results[0].tail_node_id);const scope=make(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:object.node_id,source_span_ids:object.source_span_ids,relation_ids:[results[0].relation_id]});const p=f.expression_plans.get(e.node_id)??{};p.scope_expr_id=scope;f.expression_plans.set(e.node_id,p);
 }
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;const ts=a.cl.tokens;
  const completed=ts.find(t=>/^(?:生成|产生|generated|created|produced)$/iu.test(t.text)&&ts.some(q=>q.end<=t.start&&/^(?:已|已经|has|have|been)$/iu.test(q.text)));
  if(!completed)continue;
  const files=a.locals.filter(n=>n.metadata.literal_tag==='FILEPATH'&&sp(n).end<=completed.start);
  if(files.length!==1)continue;const file=files[0],outputs=f.relations.filter(r=>r.relation_type==='RESULT'&&r.state==='RESOLVED').map(r=>f.semantic_nodes.find(n=>n.node_id===r.tail_node_id)).filter(n=>n.surface===file.surface);
  const unique=[...new Map(outputs.map(n=>[n.metadata.artifact_identity??n.surface,n])).values()];if(unique.length!==1)continue;
  const st=node(a.cl,'STATE',sp(file).start,completed.end,{sense:'OUTPUT_EXISTS',owner:a.cl.id,discourse:a.discourse,object_node_ids:[unique[0].node_id],polarity:'POSITIVE',perfective_token_id:completed.id});
  const evidence=acceptedEdge(a,'CONJUNCTION',st,unique[0]);states.push({a,st,evidence});a.state=st;a.handled=true;
  for(const e of [...a.events])if(sp(e).start===completed.start)retire(a,e,'PERFECTIVE_OUTPUT_STATE_NOT_NEW_ACTION');
 }
 // Completion antecedents are confined to the same source sentence, with an
 // explicit when/after marker. Adjacency is not a scope certificate.
 for(const a of f.analyses){const complete=a.cl.tokens.find(t=>/^(?:完成|complete)$/iu.test(t.text));if(!complete||!a.cl.tokens.some(t=>/^(?:任务|task)$/iu.test(t.text)))continue;
  const sentence=f.analyses.filter(x=>x.cl.sentence_id===a.cl.sentence_id),explicit=sentence.some(x=>/后|只有|\bwhen\b/iu.test(x.cl.span.quote));
  const candidates=states.filter(x=>x.a.cl.sentence_id===a.cl.sentence_id&&explicit);
  if(!candidates.length||candidates.length>1&&!sentence.some(x=>/并且|且|\band\b/iu.test(x.cl.span.quote)))continue;
  const {st,evidence}=candidates[0];let e=a.events.find(e=>e.metadata.completion);if(!e){e=node(a.cl,'EVENT',complete.start,complete.end,{sense:'complete',owner:a.cl.id,discourse:a.discourse,modality:'REQUIRED',completion:true});a.events.push(e);}
  mode(e,'REQUIRED');e.metadata.completion=true;a.handled=true;
  const r=acceptedEdge(a,'COMPLETION_OF',st,e,[candidates[0].a.sid]);
  const operands=candidates.map(x=>{const rr=acceptedEdge(a,'COMPLETION_OF',x.st,e,[x.a.sid]);return make(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:x.st.node_id,source_span_ids:uniq([...x.st.source_span_ids,a.sid]),relation_ids:[x.evidence.relation_id,rr.relation_id]});});
  const expr=operands.length===1?operands[0]:make(f.expressions.condition_expr_nodes,{op:'AND',operand_expr_ids:operands,source_span_ids:uniq([a.sid,...candidates.map(x=>x.a.sid)]),relation_ids:[]});
  const plan=f.expression_plans.get(e.node_id)??{};delete plan.unresolved_ref;plan.condition_expr_id=expr;f.expression_plans.set(e.node_id,plan);audit.state_bindings.push({event_node_id:e.node_id,state_node_id:st.node_id,object_node_ids:st.metadata.object_node_ids,condition_expr_id:expr,relation_ids:[evidence.relation_id,r.relation_id],source_span_ids:uniq([a.sid,candidates[0].a.sid]),rule:'EXPLICIT_SENTENCE_COMPLETION_STATE'});
 }
 // Deduplicate only certified object identities, keeping each mention's proof.
 const artifacts=f.semantic_nodes.filter(n=>n.node_type==='ENTITY'&&n.metadata.literal_tag==='FILEPATH');
 for(const n of artifacts)n.metadata.artifact_identity=id('ARTIFACT',n.surface);
 const scopeSeen=new Map(),outputNames=new Set(f.relations.filter(r=>r.relation_type==='RESULT'&&r.state!=='REJECTED').map(r=>f.semantic_nodes.find(n=>n.node_id===r.tail_node_id)?.surface));
 for(const r of f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER'&&r.state!=='REJECTED')){const ob=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),a=f.analyses.find(a=>a.cl.id===r.clause_id);if(!ob?.metadata.artifact_identity)continue;
  if(outputNames.has(ob.surface)&&a.events.some(e=>e.metadata.sense==='send')&&!a.events.some(e=>['read','review'].includes(e.metadata.sense))){r.state='REJECTED';audit.arbitration.push({relation_id:r.relation_id,reason:'TRANSFER_OF_CURRENT_OUTPUT_NOT_EXTERNAL_INPUT',source_span_ids:r.evidence_span_ids});continue;}
  const key=ob.metadata.artifact_identity;const prior=scopeSeen.get(key);if(prior){r.state='REJECTED';prior.evidence_span_ids=uniq([...prior.evidence_span_ids,...r.evidence_span_ids]);audit.arbitration.push({relation_id:r.relation_id,retained_relation_id:prior.relation_id,reason:'SAME_ARTIFACT_TASK_SCOPE_IDENTITY',source_span_ids:r.evidence_span_ids});}else scopeSeen.set(key,r);
 }
 if(assignments.length===1){const {actor,a:assigned}=assignments[0];for(const a of f.analyses.filter(a=>boundaryDomain(a.discourse)))for(const e of a.events){if(e.metadata.completion||!['REQUIRED','PERMITTED','FORBIDDEN'].includes(e.metadata.modality))continue;const agents=f.relations.filter(r=>r.head_node_id===e.node_id&&r.relation_type==='AGENT'&&r.state!=='REJECTED');if(!agents.length)acceptedEdge(a,'AGENT',e,actor,[assigned.sid]);for(const r of agents){const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id);if(n.surface===actor.surface){n.metadata.participant_roles=['PERFORMER'];n.metadata.participant_eligibility=actor.metadata.participant_eligibility;}}}}
 // Registry repair follows actual certified removals, retaining arbitration evidence.
 const unresolvedIds=new Set(f.unresolved.map(u=>u.unresolved_id));
 for(const b of f.relation_bundles){b.unresolved_refs=b.unresolved_refs.filter(i=>unresolvedIds.has(i));b.relation_ids=uniq(f.relations.filter(r=>b.clause_ids.includes(r.clause_id)).map(r=>r.relation_id));b.bundle_state=b.unresolved_refs.length?'PARTIALLY_RESOLVED':'RESOLVED';}
 return f;
}
