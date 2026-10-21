import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {FACT_SLOTS} from '../v0.3-7p-composition-014/coverage-locality.mjs';

const live=r=>r.state!=='REJECTED';
const audit=f=>(f.semantic_decoding??=f.nlp_signals?.semantic_decoding??{}).anchor_contracts??={identity:[],subjects:[],completion:[],coverage:[]};
const owner=n=>n.metadata.semantic_ownership?.semantic_owner_id??n.metadata.discourse?.owner_structure_id;
const sameOwner=(a,b)=>Boolean(owner(a)&&owner(a)===owner(b));
const spanOf=(f,n)=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);

export function normalizeParticipantIdentity(f){
 const log=audit(f).identity,{node,relation}=f.tools,points=[...f.source.raw_text];
 // A qualified identity is proved by a PERSON/name token plus an explicit
 // nominal apposition/title dependency, never by substring containment.
 for(const a of f.analyses){const ts=a.cl.tokens;
  for(const n of [...f.semantic_nodes].filter(n=>n.metadata.participant_eligibility?.eligible&&n.metadata.clause_id===a.cl.id)){
   if(n.metadata.identity_name)continue;
   const s=spanOf(f,n),names=ts.filter(t=>t.start>=s.start&&t.end<=s.end&&/^(NR|PROPN)$/u.test(t.pos??''));if(!names.length)continue;
   const ner=a.cl.entities?.find(e=>e.label==='PERSON'&&e.span?.start>=s.start&&e.span?.end<=s.end),nameStart=ner?.span.start??Math.min(...names.map(t=>t.start)),nameEnd=ner?.span.end??Math.max(...names.map(t=>t.end));
   const nameTokens=names.filter(t=>t.start>=nameStart&&t.end<=nameEnd);
   const titles=ts.filter(t=>t.end<=nameStart&&(/appos|compound/u.test(t.dep??'')&&nameTokens.includes(ts[t.head])||/appos/u.test(nameTokens[0]?.dep??'')&&ts[nameTokens[0].head]===t));
   if(titles.length!==1)continue;const title=titles[0];if(!/^(?:NN|NOUN|PROPN)$/u.test(title.pos??''))continue;
   const preceding=ts.filter(t=>t.head===ts.indexOf(title)&&/compound|amod/u.test(t.dep??'')),start=Math.min(title.start,...preceding.map(t=>t.start));
   const qualified=f.semantic_nodes.find(q=>q.node_type==='ENTITY'&&spanOf(f,q).start===start&&spanOf(f,q).end===nameEnd&&q.metadata.participant_eligibility?.eligible)??node(a.cl,'ENTITY',start,nameEnd,{literal_tag:'PERSON',identity_name:points.slice(nameStart,nameEnd).join(''),participant_roles:[...(n.metadata.participant_roles??[])],participant_eligibility:n.metadata.participant_eligibility,discourse:a.discourse,owner:a.cl.id});
   qualified.metadata.identity_name=points.slice(nameStart,nameEnd).join('');
   qualified.metadata.semantic_ownership=n.metadata.semantic_ownership;
   qualified.metadata.qualified_identity_evidence={name_token_ids:names.map(t=>t.id),title_token_ids:[title.id,...preceding.map(t=>t.id)],source_span_ids:qualified.source_span_ids};
  }
 }
 const people=f.semantic_nodes.filter(n=>n.node_type==='ENTITY'&&n.metadata.participant_eligibility?.eligible);
 const full=people.filter(n=>n.metadata.identity_name&&n.surface!==n.metadata.identity_name);
 for(const n of people){if(full.includes(n))continue;
  const candidates=full.filter(q=>sameOwner(q,n)&&(q.metadata.identity_name===n.surface||q.metadata.identity_name===n.metadata.identity_name));
  const domains=uniq(candidates.map(q=>q.surface));if(domains.length!==1){if(candidates.length)log.push({node_id:n.node_id,status:'UNRESOLVED_IDENTITY',candidate_ids:candidates.map(q=>q.node_id),reason:'Non-unique qualified identity'});continue;}
  const target=candidates.sort((a,b)=>spanOf(f,a).start-spanOf(f,b).start)[0];
  const a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id);if(!a)continue;
  n.metadata.referent_node_id=target.node_id;
  const coref=relation(a.cl,'COREFERENCE',n,target,uniq([...n.source_span_ids,...target.source_span_ids]));if(coref){coref.state='RESOLVED';coref.evidence_tier='HARD';coref.rule_refs=uniq([...coref.rule_refs,'QUALIFIED_PERSON_EXACT_NAME_UNIQUE_OWNER']);}
  const changed=[];for(const r of f.relations.filter(r=>live(r)&&r.tail_node_id===n.node_id&&['AGENT','RECIPIENT'].includes(r.relation_type))){r.tail_node_id=target.node_id;r.evidence_span_ids=uniq([...r.evidence_span_ids,...n.source_span_ids,...target.source_span_ids]);r.rule_refs=uniq([...r.rule_refs,'QUALIFIED_PERSON_EXACT_NAME_UNIQUE_OWNER']);changed.push(r.relation_id);}
  if(n.metadata.current_task_assignment)target.metadata.current_task_assignment=true;
  target.metadata.source_aliases=uniq([...(target.metadata.source_aliases??[]),n.surface]);
  target.source_span_ids=uniq([...target.source_span_ids,...n.source_span_ids]);
  target.span_candidate_ids=uniq([...target.span_candidate_ids,...n.span_candidate_ids]);
  log.push({node_id:n.node_id,canonical_node_id:target.node_id,status:'RESOLVED',name:target.metadata.identity_name,source_span_ids:uniq([...n.source_span_ids,...target.source_span_ids]),relation_ids:changed,coreference_relation_id:coref?.relation_id,owner:owner(target)});
 }
 return f;
}

export function boundSubjectInheritance(f){
 const log=audit(f).subjects,ns=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 const assignments=f.semantic_nodes.filter(n=>n.metadata.current_task_assignment||n.metadata.assignment).map(n=>ns.get(n.metadata.referent_node_id)??n);
 const unique=[...new Map(assignments.map(n=>[n.node_id,n])).values()];
 for(const a of f.analyses)for(const e of a.events){
  const ts=a.cl.tokens,token=ts.find(t=>t.id===e.metadata.token_id)||ts.find(t=>t.start===spanOf(f,e).start),agents=f.relations.filter(r=>live(r)&&r.head_node_id===e.node_id&&r.relation_type==='AGENT');
  const subjects=token?ts.filter(t=>t.head===ts.indexOf(token)&&/^nsubj/u.test(t.dep??'')):[];
  const explicitPeople=subjects.filter(t=>/^(NR|PROPN)$/u.test(t.pos??'')||a.cl.entities?.some(x=>/PERSON|PER/u.test(x.label)&&x.span?.start<=t.start&&x.span?.end>=t.end));
  const artifactState=Boolean(e.metadata.conformance_target_node_ids?.length)||/^(?:conform|conforms|comply|符合)$/iu.test(e.metadata.sense??e.surface);
  const forbidden=e.metadata.modality==='FORBIDDEN',isCompletion=e.metadata.completion||e.metadata.stop;
  const eligible=boundaryDomain(a.discourse)&&!isCompletion&&!artifactState&&!e.metadata.retired_by_short_direct&&!['STATE','CONDITION'].includes(e.node_type);
  for(const r of agents){const actor=ns.get(r.tail_node_id),name=actor.metadata.identity_name??actor.surface;
   const matches=t=>name===t.text||actor.metadata.qualified_identity_evidence?.name_token_ids.includes(t.id)||actor.source_span_ids.some(sid=>{const s=f.source_spans.find(s=>s.span_id===sid);return s.start<=t.start&&s.end>=t.end&&s.end<=a.cl.span.end&&s.start>=a.cl.span.start;});
   const path=[];let ptoken=token;const visited=new Set();while(ptoken&&!visited.has(ptoken.id)&&/^(ccomp|xcomp|conj)$/u.test(ptoken.dep??'')){visited.add(ptoken.id);path.push(ptoken.id);ptoken=ts[ptoken.head];}
   const governed=ptoken&&/^(负责|responsible)$/iu.test(ptoken.text)&&ts.some(t=>t.head===ts.indexOf(ptoken)&&/^nsubj/u.test(t.dep??'')&&matches(t));
   const explicit=explicitPeople.some(matches)||governed;
   const actorAnalysis=f.analyses.find(x=>x.cl.id===actor.metadata.clause_id),prior=actorAnalysis&&actorAnalysis.cl.span.start<a.cl.span.start;
   const localMentions=f.analyses.filter(x=>x.parent_structure_id===a.parent_structure_id&&x.cl.span.start<a.cl.span.start).filter(x=>x.cl.tokens.some(t=>/^nsubj/u.test(t.dep??'')&&f.semantic_nodes.some(n=>n.metadata.clause_id===x.cl.id&&n.metadata.participant_eligibility?.eligible&&(n.metadata.referent_node_id??n.node_id)===actor.node_id&&(n.surface===t.text||n.metadata.identity_name===t.text))));
   const localAssignment=actorAnalysis?.parent_structure_id===a.parent_structure_id&&prior||localMentions.length>0;
   const competing=explicitPeople.length>0&&!explicit;
   // Explicit actors survive; inherited actors require local task ownership and
   // execution semantics. A source-wide assignment cannot rewrite earlier B.
   const keep=eligible&&!competing&&(explicit||prior&&sameOwner(e,actor)&&(!forbidden||localAssignment));
   if(!keep){r.state='REJECTED';r.rule_refs=uniq([...r.rule_refs,'BOUNDED_SUBJECT_INHERITANCE_REJECTED']);}
   log.push({event_node_id:e.node_id,actor_node_id:actor.node_id,relation_id:r.relation_id,explicit,decision:keep?'KEEP':'REJECT',reason:isCompletion?'COMPLETION_NOT_EXECUTION':artifactState?'ARTIFACT_CONFORMANCE_NOT_PERSON':competing?'EXPLICIT_CONFLICTING_SUBJECT':!prior&&!explicit?'NO_PRECEDING_ASSIGNMENT':forbidden&&!localAssignment&&!explicit?'ACTOR_UNSPECIFIED_TASK_PROHIBITION':'LOCAL_EXECUTION_OWNER',source_span_ids:uniq([a.sid,...actor.source_span_ids,...localMentions.map(x=>x.sid)]),local_actor_clause_ids:localMentions.map(x=>x.cl.id),structural_path:a.discourse?.structural_path});
  }
  if(!eligible||forbidden||explicitPeople.length||f.relations.some(r=>live(r)&&r.head_node_id===e.node_id&&r.relation_type==='AGENT'))continue;
  const domain=unique.filter(n=>sameOwner(e,n)&&spanOf(f,n).start<a.cl.span.start);if(domain.length!==1)continue;
  if(!['REQUIRED','PERMITTED'].includes(e.metadata.modality))continue;
  const r=f.tools.relation(a.cl,'AGENT',e,domain[0],[a.sid,...domain[0].source_span_ids]);if(r){r.state='RESOLVED';r.evidence_tier='HARD';r.rule_refs=uniq([...r.rule_refs,'BOUNDED_UNIQUE_TASK_EXECUTION_SUBJECT']);log.push({event_node_id:e.node_id,actor_node_id:domain[0].node_id,relation_id:r.relation_id,decision:'INHERIT',reason:'UNIQUE_PRIOR_TASK_EXECUTION_OWNER',source_span_ids:r.evidence_span_ids});}
 }
 return f;
}

export function composeNecessaryCompletion(f){
 const log=audit(f).completion,{node,relation}=f.tools,points=[...f.source.raw_text];
 const make=body=>{const x={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.condition_expr_nodes.some(q=>q.expr_id===x.expr_id))f.expressions.condition_expr_nodes.push(x);return x.expr_id;};
 for(const sentenceId of uniq(f.analyses.map(a=>a.cl.sentence_id))){
  const group=f.analyses.filter(a=>a.cl.sentence_id===sentenceId),tokens=group.flatMap(a=>a.cl.tokens),start=tokens.find(t=>/^(只有|only)$/iu.test(t.text));
  if(!start)continue;const completionToken=[...tokens].reverse().find(t=>/^(完成|complete|completed)$/iu.test(t.text));if(!completionToken)continue;
  const a=group.find(a=>a.cl.tokens.includes(completionToken));if(!boundaryDomain(a.discourse))continue;
  const text=points.slice(group[0].cl.span.start,group.at(-1).cl.span.end).join('');
  if(!/(?:才|\bonly\s+when\b)/iu.test(text))continue;
  const joins=tokens.filter(t=>t.start>start.end&&t.end<completionToken.start&&/^(并且|且|and)$/iu.test(t.text));
  if(!joins.length||tokens.some(t=>t.start>start.end&&t.end<completionToken.start&&/^(或者|或|or)$/iu.test(t.text)))continue;
  // The final Chinese clause or English inverted main clause marks the end of
  // the antecedent. A lexical negative inside an operand is never lifted out.
  const english=/^only$/iu.test(start.text);let end;
  if(english){const boundary=tokens.find((t,i)=>t.start>joins.at(-1).end&&/^(is|becomes)$/iu.test(t.text)&&/^(the|this)$/iu.test(tokens[i+1]?.text??'')&&/^(task|work)$/iu.test(tokens[i+2]?.text??''));if(!boundary)continue;end=boundary.start;}
  else {if(a.cl.span.start<=joins.at(-1).end)continue;end=a.cl.span.start;}
  const segments=[{start:start.start,end:joins[0].start},...joins.map((t,i)=>({start:t.start,end:joins[i+1]?.start??end}))].map(s=>{while(s.end>s.start&&/[\s,，]/u.test(points[s.end-1]))s.end--;return s;});
  if(segments.some(s=>s.end<=s.start))continue;
  const predicateEvidence=segments.map(s=>tokens.filter(t=>t.start>=s.start&&t.end<=s.end&&/^(VV|VA|VERB|AUX|ADJ)$/u.test(t.pos??'')));
  if(predicateEvidence.some(p=>!p.length))continue;
  let event=a.events.find(e=>e.metadata.completion&&spanOf(f,e).start===completionToken.start)??a.events.find(e=>e.metadata.completion);
  if(!event){event=node(a.cl,'EVENT',completionToken.start,completionToken.end,{sense:'complete',modality:'REQUIRED',completion:true,token_id:completionToken.id,owner:a.cl.id,discourse:a.discourse});a.events.push(event);}
  event.metadata.completion=true;event.metadata.modality='REQUIRED';event.metadata.condition_strength='NECESSARY_ONLY';event.state='RESOLVED';a.handled=true;
  const operands=[],witnesses=[];
  for(const [i,s] of segments.entries()){const cl=group.find(a=>a.cl.span.start<=s.start&&a.cl.span.end>s.start)??a,raw=points.slice(s.start,s.end).join('');
   const state=node(cl.cl,'STATE',s.start,s.end,{sense:'SOURCE_STATE',owner:cl.cl.id,discourse:cl.discourse,polarity:'POSITIVE',condition_strength:'NECESSARY_ONLY',necessary_condition:true,universal_scope:/(?:所有|全部|每|\ball\b|\bevery\b)/iu.test(raw),syntactic_layer_id:id(f.source.sha256,'necessary-operand',sentenceId,i),predicate_token_ids:predicateEvidence[i].map(t=>t.id)});
   state.state='RESOLVED';cl.handled=true;cl.local_condition_states=uniq([...(cl.local_condition_states??[]),state]);
   const r=relation(a.cl,'COMPLETION_OF',state,event,[...state.source_span_ids,a.sid]);if(!r)continue;r.state='RESOLVED';r.evidence_tier='HARD';r.rule_refs=uniq([...r.rule_refs,'EXPLICIT_NECESSARY_SENTENCE_CONJUNCTION']);witnesses.push(r);
   operands.push(make({op:'STATE_REF',state_node_id:state.node_id,source_span_ids:state.source_span_ids,relation_ids:[r.relation_id]}));
   // Retire only lexical action frames inside the proved condition layer.
   for(const info of group)for(const nested of [...info.events])if(nested!==event&&spanOf(f,nested).start>=s.start&&spanOf(f,nested).end<=s.end){info.events=info.events.filter(x=>x!==nested);nested.metadata.frame_certification={state:'CERTIFIED',boundary_role:'SUBORDINATE',frame_id:id(nested.node_id,'condition-operand'),source_span_ids:state.source_span_ids};for(const rr of f.relations.filter(r=>r.head_node_id===nested.node_id))rr.state='REJECTED';}
  }
  if(operands.length!==segments.length)continue;
  for(const r of f.relations.filter(r=>live(r)&&r.tail_node_id===event.node_id&&['CONDITION_OF','COMPLETION_OF'].includes(r.relation_type)&&!witnesses.includes(r)))r.state='REJECTED';
  const p=f.expression_plans.get(event.node_id)??{},previous=p.condition_expr_id;
  p.condition_expr_id=make({op:'AND',operand_expr_ids:operands,source_span_ids:uniq(witnesses.flatMap(r=>r.evidence_span_ids)),relation_ids:witnesses.map(r=>r.relation_id)});delete p.unresolved_ref;delete event.metadata.modality_unresolved;f.expression_plans.set(event.node_id,p);
  const removed=f.unresolved.filter(u=>u.related_node_ids.length&&u.related_node_ids.every(n=>n===event.node_id));f.unresolved=f.unresolved.filter(u=>!removed.includes(u));delete event.unresolved_ref;
  log.push({event_node_id:event.node_id,previous_condition_expr_id:previous,condition_expr_id:p.condition_expr_id,operands,source_segments:segments,relation_ids:witnesses.map(r=>r.relation_id),strength:'NECESSARY_ONLY',retired_unresolved_ids:removed.map(u=>u.unresolved_id)});
 }
 return f;
}

export function localizeTypedUnresolved(f){
 const log=audit(f).coverage,ns=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 for(const co of f.coverage.filter(c=>c.clause_id&&c.unresolved_refs.length)){
  const proof=[];for(const uid of co.unresolved_refs){
   const u=f.unresolved.find(u=>u.unresolved_id===uid);if(!u)continue;
   // Related candidate antecedents are alternatives, not use sites. Follow the
   // unresolved node/relation and facts carrying this exact diagnostic only.
   const facts=f.boundary_ir.facts.filter(x=>x.unresolved_ref===uid),ds=f.eligibility_decisions.filter(x=>x.unresolved_ref===uid);
   const unresolvedNodes=f.semantic_nodes.filter(n=>n.unresolved_ref===uid),unresolvedRelations=f.relations.filter(r=>live(r)&&r.unresolved_ref===uid);
   const slots=uniq([...facts.map(x=>FACT_SLOTS[x.fact_type]),...ds.map(x=>FACT_SLOTS[x.proposed_fact_type])]);
   for(const n of unresolvedNodes){for(const r of f.relations.filter(r=>live(r)&&r.tail_node_id===n.node_id)){
    const event=ns.get(r.head_node_id);if(r.relation_type==='RECIPIENT')slots.push('P');
    for(const fact of f.boundary_ir.facts.filter(fact=>fact.predicate_node_id===event?.node_id))slots.push(FACT_SLOTS[fact.fact_type]);
   }}
   if(slots.length)proof.push({unresolved_id:uid,slots:uniq(slots),fact_ids:facts.map(x=>x.boundary_fact_id),decision_ids:ds.map(x=>x.eligibility_decision_id),unresolved_node_ids:unresolvedNodes.map(n=>n.node_id),unresolved_relation_ids:unresolvedRelations.map(r=>r.relation_id)});
  }
  if(proof.length!==co.unresolved_refs.length)continue;
  const before=co.affected_slots,typed=uniq(proof.flatMap(p=>p.slots));
  // Genuine untyped coverage failures must keep their conservative impact.
  const failures=f.eligibility_decisions.filter(d=>co.eligibility_decision_ids.includes(d.eligibility_decision_id)&&d.disposition==='COVERAGE_FAILURE');if(failures.length)continue;
  co.affected_slots=typed;co.impact_evidence.typed_use_site_proof=proof;log.push({coverage_record_id:co.coverage_record_id,before,after:typed,proof});
 }
 for(const co of f.coverage.filter(c=>!c.clause_id)){const children=f.coverage.filter(c=>c.clause_id&&f.structure.nodes.find(n=>n.structure_node_id===c.structure_node_id)?.parent_id===co.structure_node_id&&['UNRESOLVED','COVERAGE_FAILURE'].includes(c.disposition));if(children.length){co.affected_slots=uniq(children.flatMap(c=>c.affected_slots));co.impact_evidence.child_coverage_ids=children.map(c=>c.coverage_record_id);}}
 return f;
}

export function closeAnchorContracts(f){normalizeParticipantIdentity(f);composeNecessaryCompletion(f);boundSubjectInheritance(f);const ids=new Set(f.unresolved.map(u=>u.unresolved_id));for(const b of f.relation_bundles){b.unresolved_refs=b.unresolved_refs.filter(i=>ids.has(i));b.relation_ids=uniq(f.relations.filter(r=>b.clause_ids.includes(r.clause_id)).map(r=>r.relation_id));b.bundle_state=b.unresolved_refs.length?'PARTIALLY_RESOLVED':'RESOLVED';}return f;}
