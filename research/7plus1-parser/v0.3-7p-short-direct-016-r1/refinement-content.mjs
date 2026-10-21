import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {modifierPhrase} from '../v0.3-7p-composition-014/syntax-mechanisms.mjs';

// Finite syntactic and graph constraints over the existing source graph.
// No fixture identity, answer input or display-layer projection is consumed.
export function closeRefinementAndContent(f){
 const {node,relation,span,task}=f.tools,cp=[...f.source.raw_text];
 const audit={version:'SHORT_DIRECT_REFINEMENT_CONTENT_R1',refinements:[],content:[],completion:[],refusals:[]};
 f.semantic_decoding.short_refinement_content=audit;
 const nm=()=>new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 const s=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const outputs=()=>[...new Map(f.relations.filter(r=>r.relation_type==='RESULT'&&r.state==='RESOLVED'&&['REQUIRED','PERMITTED'].includes(nm().get(r.head_node_id)?.metadata.modality)&&boundaryDomain(nm().get(r.head_node_id)?.metadata.discourse)).map(r=>[nm().get(r.tail_node_id)?.metadata.artifact_identity??nm().get(r.tail_node_id)?.surface,nm().get(r.tail_node_id)])).values()].filter(Boolean);
 const artifactMentions=a=>f.semantic_nodes.filter(n=>n.node_type==='ENTITY'&&n.metadata.clause_id===a.cl.id&&outputs().some(o=>o.surface===n.surface)&&a.cl.tokens.some(t=>t.start===s(n).start&&t.end===s(n).end&&/^(?:nsubj|advmod)$/iu.test(t.dep??'')));
 const clearNodes=ids=>{f.unresolved=f.unresolved.filter(u=>!u.related_node_ids.length||!u.related_node_ids.every(i=>ids.includes(i)));};
 function edge(a,k,h,t,source=[]){const r=relation(a.cl,k,h,t,uniq([a.sid,...source]));if(r){r.state='RESOLVED';delete r.unresolved_ref;r.rule_refs=uniq([...r.rule_refs,'SHORT_REFINEMENT_CONTENT_SYNTAX']);}return r;}
 function expr(body){const x={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.condition_expr_nodes.some(e=>e.expr_id===x.expr_id))f.expressions.condition_expr_nodes.push(x);return x.expr_id;}
 function refuseCompletion(a,reason,candidates=[]){audit.refusals.push({rule:reason,clause_id:a.cl.id,candidates});const e=a.events.find(e=>e.metadata.completion);if(e){const p=f.expression_plans.get(e.node_id)??{};p.unresolved_ref=f.tools.unknown(a.cl,'UNRESOLVED_SCOPE',reason,[e.node_id,...candidates]);f.expression_plans.set(e.node_id,p);}}
 function witness(a,type,start,end,owner,member,evidence=[]){
  const n=node(a.cl,'STATE',start,end,{sense:type,owner:member?id(a.cl.id,'content-state',owner.node_id,member.node_id):a.cl.id,discourse:a.discourse,object_node_ids:[owner.node_id],...(member?{content_node_id:member.node_id,content_identity:member.surface}:{}),polarity:'POSITIVE'});
  if(member){n.source_span_ids=uniq([...n.source_span_ids,...member.source_span_ids,...owner.source_span_ids]);n.span_candidate_ids=uniq([...n.span_candidate_ids,...member.span_candidate_ids,...owner.span_candidate_ids]);}
  const r=edge(a,'CONJUNCTION',n,member??owner,evidence);r.rule_refs=uniq([...r.rule_refs,member?'OWNED_SECTION_PRESENT':'OUTPUT_EXISTS_WITNESS']);
  return {n,r};
 }
 const requirements=[];
 for(const a of f.analyses){
  if(!boundaryDomain(a.discourse))continue;
  const ts=a.cl.tokens,pred=ts.find(t=>/^(?:包含|含有|contain|contains|include|includes)$/iu.test(t.lemma??t.text));
  if(!pred||!ts.some(t=>/^(?:必须|须|应|must|shall)$/iu.test(t.text)&&t.end<=pred.start))continue;
  const files=[...new Map([...a.locals.filter(n=>n.metadata.literal_tag==='FILEPATH'),...artifactMentions(a)].filter(n=>s(n).end<=pred.start).map(n=>[n.surface,n])).values()];
  if(files.length!==1)continue;
  const owners=outputs().filter(n=>n.surface===files[0].surface);if(owners.length!==1){audit.refusals.push({rule:'CONTENT_UNIQUE_OUTPUT',clause_id:a.cl.id,candidate_output_ids:owners.map(n=>n.node_id)});continue;}
  const owner=owners[0],quoted=f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id&&n.metadata.sense==='QUOTED_VALUE'&&s(n).start>=pred.end);
  let members=[];
  const roots=ts.filter(t=>/^(?:部分|章节|sections?|parts?)$/iu.test(t.lemma??t.text)&&/^(?:dobj|obj|conj)$/iu.test(t.dep??''));
  if(quoted.length&&roots.length&&ts.some(t=>/^(?:和|与|and)$/iu.test(t.text)))members=quoted;
  else if(roots.length>0){
   for(const head of roots){const [from,end]=modifierPhrase(a.cl,head);let start=from;
    const title=ts.filter(t=>t.start>=start&&t.end<=head.start&&!/^(?:DET|DT)$/u.test(t.pos??'')&&!/^[“”"'`]$/u.test(t.text));
    if(!title.length){members=[];break;}start=title[0].start;
    members.push(node(a.cl,'ENTITY',start,head.start>start?title.at(-1).end:end,{sense:'OUTPUT_SECTION',owner:a.cl.id,discourse:a.discourse}));
   }
  }
  if(!members.length||members.length>1&&!ts.some(t=>/^(?:和|与|and)$/iu.test(t.text)))continue;
  const d={...a.discourse,kind:'OUTPUT_CONTENT',domain_id:id(f.source.sha256,'domain','OUTPUT_CONTENT',owner.node_id),content_marker_span:{start:pred.start,end:pred.end}};
  a.discourse=d;a.handled=true;
  for(const n of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id))n.metadata.discourse=d;
  const partEdges=members.map(m=>{m.metadata.output_content_owner_ids=[owner.node_id];m.metadata.content_role='SECTION';const r=edge(a,'CONJUNCTION',m,owner,[...owner.source_span_ids,...m.source_span_ids]);r.rule_refs=uniq([...r.rule_refs,'OUTPUT_PART_OF']);return r;});
  const record={requirement_id:id(f.source.sha256,'output-content',a.cl.id),scope:'OUTPUT_CONTENT',clause_id:a.cl.id,structural_path:d.structural_path,owner_output_ids:[owner.node_id],owning_output_candidates:[owner.node_id],ownership_status:'UNIQUE_OUTPUT',semantic_node_ids:f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id).map(n=>n.node_id),content_node_ids:members.map(n=>n.node_id),source_span_ids:uniq([a.sid,...owner.source_span_ids,...members.flatMap(n=>n.source_span_ids)]),relation_ids:f.relations.filter(r=>r.clause_id===a.cl.id).map(r=>r.relation_id),ownership_evidence_relation_ids:partEdges.map(r=>r.relation_id),content_parsing_status:'TYPED_CONTENT'};
  const records=f.semantic_decoding.discourse.output_content_requirements??=[];const previous=records.findIndex(r=>r.clause_id===a.cl.id);if(previous>=0)records[previous]=record;else records.push(record);
  requirements.push({a,owner,members,partEdges,record});audit.content.push(record);
 }
 // Macro refinement needs both an explicit responsibility complement and a
 // complete same-owner read-to-authored-output workflow, not proximity alone.
 for(const a of f.analyses){
  const marker=a.cl.tokens.find(t=>/^(?:负责|responsible)$/iu.test(t.text));if(!marker||!boundaryDomain(a.discourse))continue;
  const goal=a.events.filter(e=>e.metadata.sense==='SOURCE_EVENT'&&s(e).start>marker.end-1);
  if(goal.length!==1)continue;const g=goal[0],token=a.cl.tokens.find(t=>t.id===g.metadata.token_id)||a.cl.tokens.find(t=>t.start===s(g).start);
  if(!token||!['ccomp','xcomp'].includes((token.dep??'').toLowerCase())||! /^(?:整理|编写|撰写|起草|prepare|draft|write|summarize)$/iu.test(token.lemma??token.text))continue;
  const objects=f.relations.filter(r=>r.head_node_id===g.node_id&&r.state==='RESOLVED'&&['PATIENT','THEME'].includes(r.relation_type)).map(r=>nm().get(r.tail_node_id));
  if(objects.length!==1||objects[0].metadata.literal_tag||! /^(?:说明|文档|报告|手册|指南|document|documentation|report|guide|notes?)$/iu.test(objects[0].surface))continue;
  const ownerKey=a.discourse.owner_structure_id,workflow=f.analyses.filter(x=>x.cl.span.start>a.cl.span.end&&x.discourse.owner_structure_id===ownerKey&&boundaryDomain(x.discourse)).flatMap(x=>x.events.filter(e=>!e.metadata.completion&&['REQUIRED','PERMITTED'].includes(e.metadata.modality)&&['read','generate'].includes(e.metadata.sense)));
  const reads=workflow.filter(e=>e.metadata.sense==='read'),generates=workflow.filter(e=>e.metadata.sense==='generate');
  const actor=f.semantic_decoding.short_direct.assignments.filter(x=>x.target_node_id===task.node_id);
  if(reads.length!==1||generates.length!==1||actor.length!==1||!requirements.some(q=>f.relations.some(r=>r.head_node_id===generates[0].node_id&&r.relation_type==='RESULT'&&r.tail_node_id===q.owner.node_id)))continue;
  if(workflow.some(e=>!f.relations.some(r=>r.head_node_id===e.node_id&&r.relation_type==='AGENT'&&r.state==='RESOLVED'&&nm().get(r.tail_node_id)?.surface===nm().get(actor[0].actor_node_id)?.surface)))continue;
  const refs=workflow.map(e=>{const r=edge(a,'CONJUNCTION',g,e,[...e.source_span_ids]);r.rule_refs=uniq([...r.rule_refs,'GOAL_REFINED_BY']);return r;});
  g.metadata.macro_goal={status:'REFINED',workflow_node_ids:workflow.map(e=>e.node_id),relation_ids:refs.map(r=>r.relation_id),source_span_ids:uniq([a.sid,...workflow.flatMap(e=>e.source_span_ids)]),target_object_node_id:objects[0].node_id};
  g.metadata.frame_certification={state:'CERTIFIED',boundary_role:'SUBORDINATE',frame_id:id(g.node_id,'macro-refinement'),source_span_ids:g.metadata.macro_goal.source_span_ids,structural_path:a.discourse.structural_path};
  for(const r of f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER'&&r.tail_node_id===objects[0].node_id)){r.state='REJECTED';r.rule_refs=uniq([...r.rule_refs,'MACRO_GOAL_OBJECT_NOT_EXTERNAL_INPUT']);}
  audit.refinements.push({goal_node_id:g.node_id,object_node_id:objects[0].node_id,...g.metadata.macro_goal,reason:'EXPLICIT_RESPONSIBILITY_COMPLEMENT_FULLY_REFINED_BY_SINGLE_AUTHORED_WORKFLOW'});
 }
 // A completion sentence has its own bounded antecedent domain. A definite
 // file referent must identify a unique produced output; all/both section
 // references must identify one existing owned content set for that output.
 for(const a of f.analyses){
  const complete=a.cl.tokens.find(t=>/^(?:完成|complete)$/iu.test(t.text));
  if(!complete||!a.cl.tokens.some(t=>/^(?:任务|task)$/iu.test(t.text)))continue;
  const sentence=f.analyses.filter(x=>x.cl.sentence_id===a.cl.sentence_id),ts=sentence.flatMap(x=>x.cl.tokens);
  if(!ts.some(t=>/^(?:后|when|after)$/iu.test(t.text)))continue;
  const sectionSubject=ts.find(t=>/^(?:部分|章节|sections?|parts?)$/iu.test(t.lemma??t.text)&&/^nsubj$/iu.test(t.dep??''));
  const sectionPredicate=ts.find(t=>/^(?:存在|present|exist|exists)$/iu.test(t.lemma??t.text)&&t.start>= (sectionSubject?.end??Infinity));
  if(!sectionSubject||!sectionPredicate||!ts.some(t=>/^(?:都|全部|所有|both|all)$/iu.test(t.text)))continue;
  const fileMentions=[...new Map(sentence.flatMap(x=>[...f.semantic_nodes.filter(n=>n.metadata.literal_tag==='FILEPATH'&&n.metadata.clause_id===x.cl.id),...artifactMentions(x)]).map(n=>[n.surface,n])).values()];
  const definiteFile=ts.find(t=>/^(?:file|output|文件|产物)$/iu.test(t.text)&&/^nsubj$/iu.test(t.dep??''));
  const compatible=outputs().filter(o=>fileMentions.length?fileMentions.some(m=>m.surface===o.surface):!!definiteFile&&o.metadata.discourse?.owner_structure_id===a.discourse.owner_structure_id);
  if(compatible.length!==1){refuseCompletion(a,'COMPLETION_OUTPUT_DOMAIN',compatible.map(n=>n.node_id));continue;}
  const owner=compatible[0],sets=requirements.filter(q=>q.owner.node_id===owner.node_id&&q.a.cl.span.start<a.cl.span.start);
  const cardinalTokens=ts.filter(t=>t.end<=sectionSubject.start&&t.start>=sectionSubject.start-12&&/^(?:CD|NUM)$/u.test(t.pos??'')),cardinals=cardinalTokens.map(t=>/^[0-9]+$/u.test(t.text)?Number(t.text):({一:1,二:2,两:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9,十:10})[t.text]).filter(Number.isFinite);
  if(sets.length!==1||ts.some(t=>t.text.toLowerCase()==='both')&&sets[0].members.length!==2||cardinals.some(n=>n!==sets[0]?.members.length)){refuseCompletion(a,'CONTENT_SET_DOMAIN',sets.flatMap(q=>q.members.map(n=>n.node_id)));continue;}
  const q=sets[0],parent=sentence.find(x=>x.cl.tokens.includes(sectionPredicate));
  let exists=f.semantic_nodes.find(n=>n.node_type==='STATE'&&n.metadata.sense==='OUTPUT_EXISTS'&&sentence.some(x=>x.cl.id===n.metadata.clause_id)&&n.metadata.object_node_ids?.includes(owner.node_id));
  let existenceRelation;
  if(!exists){
   const pred=ts.find(t=>t.end<=sectionSubject.start&&(/^(?:exist|exists)$/iu.test(t.lemma??t.text)||/^(?:生成|产生|generated|created|produced)$/iu.test(t.text)&&ts.some(q=>q.end<=t.start&&/^(?:已|已经|has|have|been)$/iu.test(q.text))));
   const mention=fileMentions.filter(m=>m.surface===owner.surface&&s(m).end<= (pred?.start??-1));
   if(!pred||!definiteFile&&mention.length!==1)continue;
   const local=sentence.find(x=>x.cl.tokens.includes(pred)),ref=definiteFile?node(local.cl,'ENTITY',definiteFile.start,definiteFile.end,{sense:'DEFINITE_OUTPUT_REFERENCE',owner:local.cl.id,discourse:local.discourse,referent_node_id:owner.node_id}):mention[0];
   const coref=edge(local,'COREFERENCE',ref,owner,owner.source_span_ids);const w=witness(local,'OUTPUT_EXISTS',s(ref).start,pred.end,owner,null,owner.source_span_ids);w.n.metadata.coreference_relation_id=coref.relation_id;exists=w.n;existenceRelation=w.r;
   for(const ev of [...local.events])if(s(ev).start===pred.start){local.events=local.events.filter(n=>n!==ev);ev.metadata.retired_by_short_direct='OUTPUT_EXISTENCE_STATE_NOT_EXECUTION';for(const r of f.relations.filter(r=>r.head_node_id===ev.node_id))r.state='REJECTED';clearNodes([ev.node_id]);}
  }else existenceRelation=f.relations.find(r=>r.head_node_id===exists.node_id&&r.relation_type==='CONJUNCTION'&&r.state==='RESOLVED');
  if(!ts.some(t=>/^(?:且|并且|and)$/iu.test(t.text))||ts.some(t=>/^(?:或|或者|or)$/iu.test(t.text))||!existenceRelation){refuseCompletion(a,'COMPLETION_CONJUNCTION_NOT_UNIQUE');continue;}
  const ws=q.members.map(m=>witness(parent,'SECTION_PRESENT',sectionSubject.start,sectionPredicate.end,owner,m,q.record.source_span_ids));
  let e=a.events.find(e=>e.metadata.completion);
  if(!e){e=node(a.cl,'EVENT',complete.start,complete.end,{sense:'complete',modality:'REQUIRED',completion:true,owner:a.cl.id,discourse:a.discourse});a.events.push(e);}
  for(const r of f.relations.filter(r=>r.relation_type==='COMPLETION_OF'&&r.tail_node_id===e.node_id))r.state='REJECTED';
  const terms=[{n:exists,r:existenceRelation},...ws];
  const operands=terms.map(w=>{const cr=edge(a,'COMPLETION_OF',w.n,e,uniq([...w.n.source_span_ids,...q.record.source_span_ids]));return expr({op:'STATE_REF',state_node_id:w.n.node_id,source_span_ids:uniq([...w.n.source_span_ids,a.sid]),relation_ids:[w.r.relation_id,cr.relation_id]});});
  const conjunction=expr({op:'AND',operand_expr_ids:operands,source_span_ids:uniq([a.sid,parent.sid,...q.record.source_span_ids,...exists.source_span_ids]),relation_ids:[]});
  const plan=f.expression_plans.get(e.node_id)??{};plan.condition_expr_id=conjunction;delete plan.unresolved_ref;f.expression_plans.set(e.node_id,plan);
  e.metadata.modality='REQUIRED';delete e.metadata.modality_unresolved;clearNodes([e.node_id]);a.handled=true;
  for(const local of sentence){local.handled=true;for(const ev of [...local.events])if(ev!==e&&s(ev).start===sectionPredicate.start){local.events=local.events.filter(n=>n!==ev);ev.metadata.retired_by_short_direct='CONTENT_EXISTENCE_STATE_NOT_EXECUTION';for(const r of f.relations.filter(r=>r.head_node_id===ev.node_id))r.state='REJECTED';clearNodes([ev.node_id]);}}
  parent.local_condition_states=uniq([...(parent.local_condition_states??[]),...ws.map(w=>w.n)]);parent.state??=exists;
  audit.completion.push({event_node_id:e.node_id,condition_expr_id:conjunction,operand_expr_ids:operands,owner_output_id:owner.node_id,content_requirement_id:q.record.requirement_id,content_node_ids:q.members.map(n=>n.node_id),source_span_ids:uniq([a.sid,parent.sid,...q.record.source_span_ids]),rule:'SAME_SENTENCE_EXISTENCE_AND_ALL_OWNED_SECTIONS'});
 }
 const unresolvedIds=new Set(f.unresolved.map(u=>u.unresolved_id));
 for(const b of f.relation_bundles){b.unresolved_refs=b.unresolved_refs.filter(i=>unresolvedIds.has(i));b.relation_ids=uniq(f.relations.filter(r=>b.clause_ids.includes(r.clause_id)).map(r=>r.relation_id));b.bundle_state=b.unresolved_refs.length?'PARTIALLY_RESOLVED':'RESOLVED';}
 return f;
}
