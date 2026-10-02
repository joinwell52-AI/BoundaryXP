import {id,uniq} from './identity.mjs';
import {boundaryDomain} from './discourse.mjs';
import {edgeReferenceDomain} from './coreference.mjs';

const family=e=>/^(?:修|修改|修订|更新|更改|改动|修复|modify|update|revise|repair)$/iu.test(e.surface)?'MODIFY':/^(?:新建|创建|生成|编写|撰写|写出|写|产出|输出|交付|create|generate|write|produce|deliver)$/iu.test(e.surface)?'CREATE':/^(?:读取|检查|核查|比较|扫描|审计|读|看|read|inspect|check|compare|scan|audit)$/iu.test(e.surface)?'READ':/^(?:发送|提交|send|submit|归档|archive)$/iu.test(e.surface)?'TRANSFER':null;
const connector=/^[\s`]*(?:[、,，]|以及|和|与|及|并|and|or)[\s`]*$/iu;
const actionConnector=/^[\s]*(?:并且|并|和|与|及|and)[\s]*$/iu;
const continuation=/^\s*(?:以及|并且|并|然后|随后|接着|最后|and\b|then\b|finally\b)/iu;
const argumentRoles=['PATIENT','THEME','RESULT','FORBIDS','RESTRICTS'];
export function closeEdges(f){
 const {node,relation,span,unknown}=f.tools,points=[...f.source.raw_text],slice=(s,e)=>points.slice(s,e).join(''),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const audit={version:'7P-REPAIR-004',evidence_order:['DEPENDENCY_SRL','PROTECTED_OPERAND','EXPLICIT_COORDINATION','STRUCTURAL_CHILD','SENTENCE_CONTINUATION','UNIQUE_COREFERENCE','TYPED_UNRESOLVED'],edges:[],decisions:[]};f.semantic_decoding.edge_closure=audit;
 const seen=new Set(),touched=new Set(),nm=()=>new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 const eligible=a=>!a.condition&&!a.basis&&!a.scope&&!a.state&&(boundaryDomain(a.discourse)||a.discourse.kind==='OUTPUT_CONTENT');
 const usable=e=>!e.metadata.completion&&!e.metadata.stop&&!e.metadata.purpose_only&&e.metadata.candidate_disposition!=='REJECTED';
 const owner=n=>f.analyses.find(a=>a.cl.id===n.metadata.clause_id);
 const same=(a,b)=>a.discourse.kind===b.discourse.kind&&a.discourse.owner_structure_id===b.discourse.owner_structure_id;
 const args=e=>f.relations.filter(r=>r.head_node_id===e.node_id&&r.state==='RESOLVED'&&argumentRoles.includes(r.relation_type));
 function record(r,operator,a,e,target,evidence,kind,candidates=[],reason=null){
  const key=r.relation_id+':'+r.state+':'+operator;if(seen.has(key))return;seen.add(key);
  const targetOwner=owner(target);audit.edges.push({relation_id:r.relation_id,operator,head_node_id:e.node_id,tail_node_id:target.node_id,relation_type:r.relation_type,source_span_ids:uniq([...r.evidence_span_ids,...evidence]),structural_path:uniq([...(a.discourse.structural_path??[]),a.discourse.structure_id,a.cl.id,e.node_id,...(targetOwner?.discourse.structural_path??[]),targetOwner?.discourse.structure_id,targetOwner?.cl.id,target.node_id]),evidence_kind:kind,competing_candidates:candidates,rejected_alternative_reason:reason,resolution_state:r.state});
 }
 function reject(r,operator,a,e,target,evidence,reason){r.state='REJECTED';delete r.unresolved_ref;record(r,operator,a,e,target,evidence,'STRONGER_TYPED_OWNERSHIP',[],reason);touched.add(e.node_id);}
 function add(a,e,target,type,operator,evidence,kind,candidates=[]){
  const prior=f.relations.find(r=>r.head_node_id===e.node_id&&r.tail_node_id===target.node_id&&r.relation_type===type&&r.state==='RESOLVED');if(prior)return prior;
  const r=relation(a.cl,type,e,target,evidence);if(!r)return null;
  r.state='RESOLVED';delete r.unresolved_ref;r.rule_refs=uniq([...r.rule_refs,'EDGE_CLOSURE_'+operator]);record(r,operator,a,e,target,evidence,kind,candidates);touched.add(e.node_id);return r;
 }
 function unresolved(a,e,operator,reason,candidates=[],kind='UNRESOLVED_RELATION'){
  const uid=unknown(a.cl,kind,reason,uniq([e.node_id,...candidates]));audit.decisions.push({operator,event_node_id:e.node_id,resolution_state:'UNRESOLVED',unresolved_id:uid,competing_candidates:candidates,reason,source_span_ids:[a.sid,...e.source_span_ids],structural_path:[...(a.discourse.structural_path??[]),a.cl.id]});return uid;
 }
 function set(body){const n={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.set_expr_nodes.some(x=>x.expr_id===n.expr_id))f.expressions.set_expr_nodes.push(n);return n.expr_id;}
 const item=(n,r)=>set({kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[r.relation_id]});
 function promote(a,e,evidence){
  if(e.metadata.modality!=='UNSTATED')return;
  e.metadata.modality='REQUIRED';e.metadata.edge_modality_evidence=evidence;
  const uid=e.metadata.modality_unresolved;if(uid)f.unresolved=f.unresolved.filter(u=>u.unresolved_id!==uid);delete e.metadata.modality_unresolved;
 }
 function bind(a,e,objects,operator,evidence,kind,{imperative=false,replace=false}={}){
  const mode=family(e);if(!mode||!objects.length)return false;
  if(e.metadata.modality==='UNSTATED'&&!imperative)return false;
  if(imperative)promote(a,e,evidence);
  const negative=e.metadata.modality==='FORBIDDEN'||e.metadata.restrict,role=negative?e.metadata.restrict?'RESTRICTS':'FORBIDS':mode==='CREATE'?'RESULT':mode==='TRANSFER'?'THEME':'PATIENT';
  if(replace)for(const r of f.relations.filter(r=>r.head_node_id===e.node_id&&r.state==='RESOLVED'&&[...argumentRoles,'SCOPE_MEMBER'].includes(r.relation_type))){const old=nm().get(r.tail_node_id);if(!objects.some(n=>n.node_id===old.node_id)&&(objects.some(n=>sp(old).start>=sp(n).start&&sp(old).end<=sp(n).end)||objects.length>1&&sp(old).start<=sp(objects[0]).start&&sp(old).end>=sp(objects.at(-1)).end))reject(r,operator,a,e,old,evidence,'SUPERSEDED_PARTIAL_OR_AGGREGATE_OPERAND');}
  for(const n of objects){
   add(a,e,n,role,operator,evidence,kind,objects.map(n=>n.node_id));
   if(!negative&&['REQUIRED','PERMITTED'].includes(e.metadata.modality)){
    n.metadata.artifact_roles=uniq([...(n.metadata.artifact_roles??[]),...(mode==='MODIFY'?['MODIFICATION_TARGET','UPDATED_OUTPUT']:mode==='CREATE'?['GENERATED_OUTPUT']:['READ_ONLY_INPUT'])]);
    if(mode==='MODIFY'){n.metadata.role_transition={before:'EXISTING_INPUT',after:'UPDATED_OUTPUT',same_artifact:true};add(a,e,n,'RESULT',operator,evidence,kind);}
    if(mode!=='CREATE'){const r=add(a,e,n,'SCOPE_MEMBER',operator,evidence,kind);f.relation_scope_plans.set(r.relation_id,item(n,r));}
   }
  }
  a.handled=true;return true;
 }
 function nominalOperands(a,start,end){
  while(start<end&&/[\s。；;]/u.test(points[start]))start++;while(end>start&&/[\s。；;]/u.test(points[end-1]))end--;
  if(start>=end)return [];
  const literals=f.nlp_signals.literals.filter(l=>['FILE','PATH','IDENTIFIER'].includes(l.type)&&l.span.start>=start&&l.span.end<=end).map(l=>({start:l.span.start,end:l.span.end,tag:l.type}));
  const text=slice(start,end);for(const m of text.matchAll(/`([^`\n]+)`/gu)){const s=start+[...text.slice(0,m.index+1)].length;literals.push({start:s,end:s+[...m[1]].length,tag:'PROTECTED'});}
  const ranges=[...new Map(literals.map(l=>[l.start+':'+l.end,l])).values()].filter(l=>!literals.some(x=>x.start<=l.start&&x.end>=l.end&&(x.start<l.start||x.end>l.end))).sort((x,y)=>x.start-y.start);
  if(!ranges.length)return [];
  if(!/^[\s`]*$/u.test(slice(start,ranges[0].start))||!/^[\s`]*$/u.test(slice(ranges.at(-1).end,end))||ranges.slice(1).some((r,i)=>!connector.test(slice(ranges[i].end,r.start))))return [];
  return ranges.map(r=>{
   const n=f.semantic_nodes.filter(n=>n.node_type==='ENTITY'&&sp(n).start===r.start&&sp(n).end===r.end&&!n.metadata.participant_roles?.length).sort((x,y)=>Number(!!y.metadata.artifact_identity)-Number(!!x.metadata.artifact_identity))[0]??node(a.cl,'ENTITY',r.start,r.end,{sense:'EDGE_TYPED_OPERAND',discourse:a.discourse,owner:a.cl.id});
   n.metadata.artifact_identity??=id(f.source.sha256,'artifact',n.surface);n.metadata.technical_type??=r.tag==='FILE'?'FILE':'SYMBOL';return n;
  });
 }
 // Strong explicit basis evidence shields exactly the same source operand, never
 // an arbitrary neighboring prepositional phrase or every mention of that name.
 for(const rr of [...f.relations].filter(r=>r.state==='RESOLVED'&&['BASIS','CONFORMS_TO'].includes(r.relation_type))){
  const ref=nm().get(rr.tail_node_id),rs=sp(ref),a=owner(ref);if(!a||ref.node_type!=='REFERENCE')continue;
  ref.metadata.artifact_roles=uniq([...(ref.metadata.artifact_roles??[]),'REFERENCE_ONLY']);
  for(const r of [...f.relations].filter(r=>r.state!=='REJECTED'&&['PATIENT','THEME','SCOPE_MEMBER'].includes(r.relation_type))){const target=nm().get(r.tail_node_id),ts=sp(target),e=nm().get(r.head_node_id);if(ts.start!==rs.start||ts.end!==rs.end)continue;target.metadata.artifact_roles=['REFERENCE_ONLY'];reject(r,'BASIS_SHIELD',owner(e)??a,e,target,rr.evidence_span_ids,'EXPLICIT_BASIS_OWNS_OPERAND');}
 }
 // Reuse the already-proven document-list contract. Audit the cross-clause edges
 // only when the child carries the explicit open-complement attachment proof.
 for(const n of f.semantic_nodes.filter(n=>n.metadata.open_complement_attachment)){
  const p=n.metadata.open_complement_attachment,a=f.analyses.find(a=>a.cl.id===p.parent_clause_id),child=owner(n);if(!a||!child||a.discourse.kind!==child.discourse.kind)continue;
  for(const r of f.relations.filter(r=>r.tail_node_id===n.node_id&&r.state==='RESOLVED'&&argumentRoles.includes(r.relation_type))){const e=nm().get(r.head_node_id);if(e.metadata.clause_id!==p.parent_clause_id)continue;record(r,'CONTINUATION',a,e,n,p.source_span_ids,'EXPLICIT_OPEN_LIST_COMPLEMENT');}
 }
 // An embedded predicate not present in Gc is a candidate-generation gap, not
 // permission for this edge-only stage to invent a synonym or collapse layers.
 for(const a of f.analyses.filter(eligible))for(const t of a.cl.tokens.filter(t=>/^(?:ccomp|xcomp)$/iu.test(t.dep??'')&&/^(?:VV|VERB)$/u.test(t.pos??''))){
  if(!a.events.some(e=>sp(e).start===t.start&&sp(e).end===t.end)){
   const e=a.events.find(e=>sp(e).start===a.cl.tokens[t.head]?.start);if(e&&e.metadata.modality==='UNSTATED'&&/^(?:使|让|make|cause)$/iu.test(e.surface))unresolved(a,e,'CONTINUATION','Embedded predicate endpoint unavailable; cross-layer continuation is not licensed',[e.node_id]);
  }
 }
 for(const a of f.analyses.filter(eligible)){
  const events=a.events.filter(usable).sort((x,y)=>sp(x).start-sp(y).start);
  for(let i=0;i<events.length-1;i++){
   const left=events[i],right=events[i+1],segment=slice(sp(left).end,sp(right).start),match=/(?:并且|并|and)\s*$/iu.exec(segment);
   if(!match||!family(left)||!family(right))continue;
   const end=sp(left).end+[...segment.slice(0,match.index)].length,local=nominalOperands(a,sp(left).end,end),other=nominalOperands(a,sp(right).end,events[i+2]?sp(events[i+2]).start:a.cl.span.end);
   if(!local.length||!other.length)continue;
   for(const r of f.relations.filter(r=>r.state==='RESOLVED'&&r.head_node_id===left.node_id&&[...argumentRoles,'SCOPE_MEMBER'].includes(r.relation_type))){const n=nm().get(r.tail_node_id);if(other.some(x=>sp(x).start===sp(n).start&&sp(x).end===sp(n).end))reject(r,'FANOUT',a,left,n,[a.sid],'EXCLUSIVE_LOCAL_OBJECT_PARTITION');}
   bind(a,left,local,'FANOUT',[a.sid],'PARTITIONED_LOCAL_COMPLEMENT',{replace:true});
  }
  // Genuine sharing requires an unpartitioned verb-conjunction group. Any lexical
  // object between the predicates partitions ownership and prevents fan-out.
  const grouped=new Set();
  for(let i=0;i<events.length-1;i++){
   const left=events[i],right=events[i+1],between=slice(sp(left).end,sp(right).start);
   if(!family(left)||!family(right)||!actionConnector.test(between)||left.metadata.modality!==right.metadata.modality)continue;
   const objects=nominalOperands(a,sp(right).end,events[i+2]?sp(events[i+2]).start:a.cl.span.end);
   if(!objects.length)continue;
   const exclusive=args(left).concat(args(right)).map(r=>nm().get(r.tail_node_id)).filter(n=>sp(n).end<=sp(right).start);
   if(exclusive.length){unresolved(a,left,'FANOUT','Exclusive local object partitions coordinated actions',exclusive.map(n=>n.node_id));continue;}
   const evidence=[span(sp(left).end,sp(right).start),a.sid,...objects.flatMap(n=>n.source_span_ids)];
   for(const e of [left,right]){bind(a,e,objects,'FANOUT',evidence,'EXPLICIT_SHARED_COMPLEMENT',{replace:true});grouped.add(e.node_id);}
   add(a,left,right,'CONJUNCTION','FANOUT',evidence,'EXPLICIT_ACTION_COORDINATION');
  }
  for(let i=0;i<events.length;i++){
   const e=events[i];if(!family(e)||grouped.has(e.node_id))continue;
   const next=events[i+1],objects=nominalOperands(a,sp(e).end,next?sp(next).start:a.cl.span.end);
   if(objects.length)bind(a,e,objects,'FANOUT',[a.sid,...objects.flatMap(n=>n.source_span_ids)],'LOCAL_TYPED_OPERAND_SET',{replace:true});
   // BA/passive are only admitted with explicit case/voice tokens and attachment.
   const token=a.cl.tokens.find(t=>t.start===sp(e).start&&t.end===sp(e).end),ti=a.cl.tokens.indexOf(token);
   const voice=a.cl.tokens.filter(t=>t.head===ti&&(/aux:ba|auxpass|aux:pass/iu.test(t.dep??'')));
   if(token&&voice.length){const marks=voice.map(t=>t.text),ba=marks.some(x=>['将','把'].includes(x)),start=ba?voice.find(t=>['将','把'].includes(t.text)).end:a.cl.span.start,end=ba?sp(e).start:Math.min(...a.cl.tokens.filter(t=>/aux/iu.test(t.dep??'')&&t.head===ti).map(t=>t.start));
    const ns=nominalOperands(a,start,end);if(ns.length){for(const r of f.relations.filter(r=>r.head_node_id===e.node_id&&r.relation_type==='AGENT'&&r.state==='RESOLVED'&&ns.some(n=>sp(n).start===sp(nm().get(r.tail_node_id)).start)))reject(r,'FANOUT',a,e,nm().get(r.tail_node_id),[a.sid],'PASSIVE_PATIENT_NOT_PERFORMER');bind(a,e,ns,'FANOUT',[a.sid,...voice.map(t=>span(t.start,t.end))],'EXPLICIT_BA_PASSIVE',{imperative:ba,replace:true});}
   }
  }
  // Nominal-only coordinated continuation never borrows an arbitrary prior verb.
  if(!events.length&&/^\s*(?:以及|和|与|and\b)/iu.test(a.cl.span.quote)){
   const marker=/^\s*(?:以及|和|与|and\b)\s*/iu.exec(a.cl.span.quote),ns=nominalOperands(a,a.cl.span.start+[...marker[0]].length,a.cl.span.end);
   if(ns.length){const prior=f.analyses.filter(p=>eligible(p)&&same(p,a)&&p.cl.sentence_id===a.cl.sentence_id&&p.cl.span.end<a.cl.span.start).flatMap(p=>p.events).filter(e=>usable(e)&&family(e)&&['REQUIRED','PERMITTED','FORBIDDEN'].includes(e.metadata.modality));
    const owned=ns.filter(n=>f.relations.some(r=>r.state==='RESOLVED'&&r.tail_node_id===n.node_id&&argumentRoles.includes(r.relation_type)));
    if(prior.length===1&&!owned.length)bind(owner(prior[0]),prior[0],ns,'CONTINUATION',[a.sid,...prior[0].source_span_ids],'SAME_SENTENCE_NOMINAL_CONJUNCTION');
    else unresolved(a,ns[0],'CONTINUATION','Continuation lacks one uniquely compatible active predicate',prior.map(e=>e.node_id));
   }
  }
 }
 // Reuse existing coreference machinery after typed result creation. No result
 // reuse crosses domains/sections, and no ambiguity is ranked away by distance.
 for(const a of f.analyses.filter(eligible))for(const e of a.events.filter(e=>usable(e)&&family(e))){
  for(const r of args(e)){
   const old=nm().get(r.tail_node_id),s=sp(old),det=a.cl.tokens.find(t=>t.start===s.start&&/^(?:该|这|其|它|this|that|it)$/iu.test(t.text)&&/^(?:DT|PN|PRON|DET)$/iu.test(t.pos??''));
   if(!det||old.node_type!=='ENTITY'||old.metadata.resolution?.selected_node_ids?.length)continue;
   const ref=node(a.cl,'UNKNOWN_REFERENT',s.start,s.end,{owner:e.node_id,discourse:a.discourse,retain_ambiguity:old.metadata.retain_ambiguity});
   reject(r,'RESULT_REUSE',a,e,old,[a.sid],'EXPLICIT_REFERENT_IS_NOT_AN_INDEPENDENT_ENTITY');relation(a.cl,r.relation_type,e,ref,[a.sid]);a.bindings.push({event:e.node_id,role:r.relation_type,target:ref.node_id,kind:'ANAPHORA'});
  }
  const pronouns=a.cl.tokens.filter(t=>/^(?:其|它|该报告|it|that)$/iu.test(t.text)&&!f.semantic_nodes.some(n=>sp(n).start<=t.start&&sp(n).end>=t.end&&n.metadata.retain_ambiguity));
  for(const t of pronouns){if(!a.bindings.some(b=>b.event===e.node_id&&sp(nm().get(b.target)).start===t.start)&&t.head===a.cl.tokens.findIndex(v=>v.start===sp(e).start)){
   const n=node(a.cl,'UNKNOWN_REFERENT',t.start,t.end,{owner:e.node_id,discourse:a.discourse});a.bindings.push({event:e.node_id,role:family(e)==='TRANSFER'?'THEME':'PATIENT',target:n.node_id,kind:'ANAPHORA'});
  }}
  const refs=a.bindings.filter(b=>b.event===e.node_id&&['PATIENT','THEME','FORBIDS','RESTRICTS'].includes(b.role));
  const explicit=continuation.test(a.cl.span.quote)&&f.analyses.some(p=>same(p,a)&&p.cl.sentence_id===a.cl.sentence_id&&p.cl.span.end<a.cl.span.start);
  const pending=refs.filter(b=>nm().get(b.target)?.state==='UNRESOLVED'||e.metadata.modality==='UNSTATED'&&explicit);
  if(!pending.length&&(!explicit||args(e).length||family(e)!=='TRANSFER'))continue;
  for(const binding of pending.length?pending:[null]){
   const ref=binding?nm().get(binding.target):null,domain=edgeReferenceDomain(f,{event:e,referent:ref,analysis:a});
   if(!domain.selected.length){unresolved(a,e,'RESULT_REUSE',domain.reason,domain.candidates.map(n=>n.node_id),'UNRESOLVED_COREFERENCE');continue;}
   if(e.metadata.modality==='UNSTATED'&&!explicit)continue;
   const evidence=uniq([a.sid,...domain.source_span_ids]);
   if(ref){for(const r of f.relations.filter(r=>r.head_node_id===e.node_id&&r.tail_node_id===ref.node_id&&r.state!=='REJECTED'))reject(r,'RESULT_REUSE',a,e,ref,evidence,'REDIRECT_TO_UNIQUE_ARTIFACT');for(const n of domain.selected)add(a,ref,n,'COREFERENCE','RESULT_REUSE',evidence,'UNIQUE_TYPED_STRUCTURAL_DOMAIN',domain.candidates.map(n=>n.node_id));const uid=ref.unresolved_ref;ref.state='RESOLVED';delete ref.unresolved_ref;ref.metadata.resolution={rule:'EDGE_UNIQUE_TYPED_RESULT',candidate_node_ids:domain.candidates.map(n=>n.node_id),selected_node_ids:domain.selected.map(n=>n.node_id),source_span_ids:evidence};f.unresolved=f.unresolved.filter(u=>u.unresolved_id!==uid);}
   bind(a,e,domain.selected,'RESULT_REUSE',evidence,'UNIQUE_TYPED_STRUCTURAL_DOMAIN',{imperative:explicit});
   const p=f.expression_plans.get(e.node_id),u=f.unresolved.find(u=>u.unresolved_id===p?.unresolved_ref);if(u&&u.reason==='Transfer object lacks one explicit coordinated result'){f.unresolved=f.unresolved.filter(x=>x!==u);delete p.unresolved_ref;}
  }
 }
 // Rebuild only touched predicate scopes from their accepted local arguments. The
 // same graph identities supply edges and Set AST; stale rejected edges cannot survive.
 for(const eid of touched){const e=nm().get(eid);if(e?.node_type!=='EVENT')continue;const rs=args(e),objects=uniq(rs.map(r=>r.tail_node_id));if(!objects.length)continue;
  const leaves=objects.map(oid=>{const n=nm().get(oid),r=rs.find(r=>r.tail_node_id===oid);return n.metadata.technical_type==='FILE_CLASS'?set({kind:'ALL',base_entity_node_id:oid,source_span_ids:n.source_span_ids,relation_ids:[r.relation_id]}):item(n,r);}),scope=leaves.length===1?leaves[0]:set({kind:'UNION',operand_expr_ids:leaves,source_span_ids:uniq(rs.flatMap(r=>r.evidence_span_ids)),relation_ids:rs.map(r=>r.relation_id)});
  const p=f.expression_plans.get(eid)??{};p.scope_expr_id=scope;f.expression_plans.set(eid,p);
 }
 // Preserve newly closed content edges inside the existing output-owned subgraph.
 for(const req of f.semantic_decoding.discourse.output_content_requirements){if(req.kind==='SECTION_CONTENT_REQUIREMENT')continue;req.relation_ids=uniq([...req.relation_ids??[],...f.relations.filter(r=>r.clause_id===req.clause_id&&r.state!=='REJECTED').map(r=>r.relation_id)]);}
 for(const b of f.relation_bundles){b.unresolved_refs=b.unresolved_refs.filter(i=>f.unresolved.some(u=>u.unresolved_id===i));if(!b.unresolved_refs.length)b.bundle_state='RESOLVED';}
 return f;
}
