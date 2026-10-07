// Offline only. These historical, already-exposed source obligations are never
// imported by the SemanticParserPort or copied into its temporary directories.
import fs from 'node:fs';
import {REPORT,read,save,sha} from './util.mjs';
import {intents} from '../../../docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG/source-intents.mjs';
import {obligations} from '../../../docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG/natural-source-obligations-r02.mjs';
import {replay} from './replay.mjs';
const framePath='docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG/BLIND-200-FRAMES.json';
const frames=read(framePath).cases;
const normalize=s=>String(s??'').toLowerCase().replace(/\b([a-z]+)(?:ed|ing|s)\b/gu,'$1').replace(/[\s\p{P}\p{S}]+/gu,'');
const aliases=[['形成','生成','produce','deliver','produced','created','creation'],['检查','核查','核验','检查','check','inspection','inspect','verify'],['审阅','复核','review'],['提交','交付','send','sent','submit','deliver'],['重试','retry','retried'],['读取','read'],['停止','stop'],['通知','notify','notified'],['恢复','resume'],['汇报','report'],['不必','NOT_REQUIRED'],['改动','修改','change','edit','modified','changed','edited']];
// Equivalence vocabulary is an evaluation convention, not a runtime rule.
const forms=w=>[w,...aliases.filter(g=>g.some(s=>normalize(s)===normalize(w))).flat()];
const contains=(text,w)=>forms(w).some(f=>normalize(text).includes(normalize(f)));
const objectMatch=(n,w)=>n&&(normalize(n.semantic_identity).includes(normalize(w))||(n.sources??[]).some(s=>normalize(s.quote).includes(normalize(w))&&[...s.quote].length<Math.max(40,[...String(w)].length+15)));
const predicateMatch=(n,w)=>n&&['EVENT','STATE'].includes(n.type)&&(contains(n.semantic_identity,w)||n.sources.some(s=>[...s.quote].length<35&&contains(s.quote,w)));
const targetStrings=v=>Array.isArray(v)?v.flatMap(targetStrings):v==='task'?['TASK']:[String(v)];
export function review(row,trace){
 const checks=[],add=(kind,claim,ok,evidence=[],stage='Canonical 7+1')=>checks.push({kind,claim,status:ok?'PASS':'FAIL',evidence,first_divergence:ok?null:stage});
 if(!trace)return {id:row.id,corpus:row.corpus,status:'RUN_ERROR',closure_status:'OPEN',checks:[{kind:'RUN_ERROR',claim:row.error,status:'FAIL',first_divergence:'SemanticParserPort'}]};
 const g=trace.candidate_semantic_graph,gamma=new Map(trace.gamma_certification.decisions.map(d=>[d.candidate_id,d])),nm=i=>g.nodes.find(n=>n.id===i),em=i=>g.expressions.find(e=>e.id===i),items=[...g.nodes,...g.relations,...g.expressions],slots=trace.canonical_7plus1.slots;
 const cert=id=>gamma.get(id)?.decision==='CERTIFIED',candidates=w=>g.nodes.filter(n=>objectMatch(n,w)),predicates=w=>g.nodes.filter(n=>predicateMatch(n,w));
 const entryMatch=(e,w)=>objectMatch(nm(e.value?.node_id),w)||predicateMatch(nm(e.predicate?.node_id),w)||e.arguments.some(a=>objectMatch(nm(a?.node_id),w));
 const has=(slot,w,resolved=true)=>slots[slot].entries.filter(e=>(!resolved||e.state==='RESOLVED')&&entryMatch(e,w));
 const relations=(type,head,tail)=>g.relations.filter(r=>r.type===type&&(!head||head.includes(r.head))&&(!tail||objectMatch(nm(r.tail),tail)));
 const stageFor=(nodeIds,relIds=[],slot=null)=>!nodeIds.length?'Candidate Node':relIds===null?'Generic Relation Candidate Generation':nodeIds.concat(relIds).some(id=>!cert(id))?'Γ Certification':slot?'Eligibility / Projection':'Candidate Expression';
 add('SOURCE_GROUNDING','Exact original text and SHA-256',trace.source.sha256===row.source_sha256,[trace.source.sha256],'Source Preservation');
 add('SOURCE_GROUNDING','No invented or invalid source span',trace.source_grounding_audit.invented_source_quote===0&&trace.source_grounding_audit.invalid_source_span===0,[trace.source_grounding_audit],'Source Linker');
 add('SOURCE_GROUNDING','No silent ambiguous source alignment',trace.source_grounding_audit.silent_ambiguous_alignment===0,[trace.source_grounding_audit],'Source Linker');
 const auditAlignments=[...g.auditor_checks.flatMap(c=>c.source_links),...g.auditor_findings.flatMap(f=>f.source_links)];
 add('SOURCE_GROUNDING','Independent audit citations are exact and uniquely aligned',auditAlignments.every(a=>a.status==='ALIGNED'),auditAlignments.filter(a=>a.status!=='ALIGNED'),'Source Linker');
 add('COVERAGE','Source accountability and no parser coverage gap',trace.coverage.source_accountable&&trace.coverage.gap_count===0,[...trace.coverage.rows.filter(r=>r.issues.length).map(r=>({id:r.region_id,issues:r.issues}))],'Coverage');
 add('PROOF','Every resolved Boundary Fact reaches certification/source/provider evidence',trace.proof_dag.gap_count===0,[trace.proof_dag.gap_count],'Proof');
 add('ARCHITECTURE','No pre-Γ final adjudication',Object.values(g.pre_gamma_final_adjudication).every(n=>n===0),[g.pre_gamma_final_adjudication],'Candidate Graph');
 add('AUTHORITY','No business decision or execution authorization',trace.business_decision===null&&trace.execution_authorization===null,[],'Boundary IR');
 const falsePromotion=trace.boundary_ir.facts.filter(f=>f.state==='RESOLVED'&&f.kind==='ACTION'&&!['MAIN','CONDITION_CONSEQUENT','ACCEPTANCE'].includes(nm(f.predicate_id)?.layer)&&!(nm(f.predicate_id)?.layer==='COMPLEMENT'&&trace.eligibility_decisions.find(d=>d.eligibility_id===f.eligibility_id)?.task_use_attachment_path?.length));
 add('FALSE_PROMOTION','No non-business discourse layer promoted as current action',!falsePromotion.length,falsePromotion.map(f=>f.boundary_fact_id),'Eligibility');
 const resolvedDependencies=trace.boundary_ir.facts.filter(f=>f.state==='RESOLVED').flatMap(f=>f.dependency_ids.filter(id=>!cert(id)));
 add('UNSUPPORTED_RESOLVED','All resolved facts depend only on certified candidates',!resolvedDependencies.length,resolvedDependencies,'Eligibility');
 function expectedSlot(slot,w){const ns=candidates(w),p=predicates(w),found=has(slot,w);add('MISSING_CLEAR_BOUNDARY',`${slot} expected reference ${w}`,found.length>0,found.map(e=>e.entry_id),stageFor([...ns,...p].map(n=>n.id),[],slot));}
 function negativeSlot(slot,w){const found=has(slot,w);add('WRONG_RESOLVED_SLOT',`${slot} must not include ${w}`,found.length===0,found.map(e=>e.entry_id),'Eligibility / Projection');}
 function qty(value,operator=null,use=null){const es=g.expressions.filter(e=>e.kind==='QUANTITY'&&e.quantity?.value===Number(value)&&(!operator||e.operator===operator)&&(!use||e.quantity.use===use));add('QUANTITY',`Quantity ${operator??'*'} ${value}, use ${use??'*'}`,es.some(e=>cert(e.id)),es.map(e=>e.id),es.length?'Γ Certification':'Candidate Expression');return es;}
 function distinction(d){const [kind,...args]=d.split(':'),v=args.join(':');
  if(['noAction','noForbid','noOutput','noI'].includes(kind)){negativeSlot({noAction:'A',noForbid:'B',noOutput:'O',noI:'I'}[kind],v);return;}
  if(['required','permitted','notRequired','forbidModal'].includes(kind)){const modal={required:'REQUIRED',permitted:'PERMITTED',notRequired:'NOT_REQUIRED',forbidModal:'FORBIDDEN'}[kind],ns=predicates(v).filter(n=>n.modality===modal);add('MODALITY',`${v} ${modal}`,ns.some(n=>cert(n.id)),ns.map(n=>n.id),stageFor(ns.map(n=>n.id)));return;}
  if(kind==='resource'){qty(args[0],null,'EXECUTION_LIMIT');return;}
  if(['lower','completionLower','quantityEq','inputCount','contentQuantity','contentRestriction','classify'].includes(kind)){qty(args[0],kind==='quantityEq'?'EQ':['lower','completionLower'].includes(kind)?'GTE':null,kind.startsWith('content')?'OUTPUT_COUNT':null);return;}
  if(kind==='notResource'){const es=g.expressions.filter(e=>e.kind==='QUANTITY'&&e.quantity?.value===Number(v)&&e.quantity.use==='EXECUTION_LIMIT'),bad=trace.boundary_ir.facts.filter(f=>f.state==='RESOLVED'&&f.kind==='RESOURCE'&&es.some(e=>e.id===f.quantity_ref));add('QUANTITY',`Output/observation count ${v} is not execution resource`,!bad.length,bad.map(f=>f.boundary_fact_id));return;}
  if(['guard','guardForbid','unconditional'].includes(kind)){const ns=predicates(v),facts=trace.boundary_ir.facts.filter(f=>ns.some(n=>n.id===f.predicate_id)&&f.state==='RESOLVED'&&(kind!=='guardForbid'||f.kind==='FORBIDDEN_OPERATION'));add('CONDITION',`${kind} ${v}`,facts.some(f=>kind==='unconditional'?!f.condition_refs.length:f.condition_refs.length>0),facts.map(f=>f.boundary_fact_id),ns.length?'Candidate Expression':'Candidate Node');return;}
  if(['condition','complete'].includes(kind)){const es=g.expressions.filter(e=>e.kind==='CONDITION'&&(v==='EXISTS'?e.operands.some(i=>nm(i)?.type==='STATE'):e.operator===v));add('CONDITION',`${kind} ${v}`,es.some(e=>cert(e.id)),es.map(e=>e.id),es.length?'Γ Certification':'Candidate Expression');return;}
  if(kind==='negativeRole'){const [identity,role]=args;add('PARTICIPANT',`No ${role} invented for ${identity}`,!slots.P.entries.some(e=>e.state==='RESOLVED'&&e.participant_role===role&&entryMatch(e,identity)),[], 'Eligibility');return;}
  if(kind==='object'){const [verb,obj]=v.split('>'),ns=predicates(verb),rs=relations('PATIENT',ns.map(n=>n.id),obj).concat(relations('THEME',ns.map(n=>n.id),obj),relations('RESULT',ns.map(n=>n.id),obj));add('ARGUMENT_BINDING',`${verb} bound to ${obj}`,rs.some(r=>cert(r.id)),rs.map(r=>r.id),!ns.length?'Candidate Node':!rs.length?'Generic Relation Candidate Generation':'Γ Certification');return;}
  if(kind==='basis'){const [basis,version]=v.split('@');expectedSlot('V',basis);if(version)add('BASIS',`${version} retained in basis context`,g.nodes.some(n=>objectMatch(n,version)),[],'Candidate Node');return;}
  if(kind.startsWith('ambiguity')||kind==='noResolvedReferent'){add('AMBIGUITY',`${d} retains competing interpretations`,g.unresolved.length>0||trace.gamma_certification.unresolved.length>0,g.unresolved.map(u=>u.id),'Γ Certification');return;}
  if(kind==='noCurrentStop'){add('FALSE_PROMOTION','Quoted stop is not current completion',slots.C.entries.filter(e=>e.state==='RESOLVED').length===0,[],'Eligibility');return;}
  if(kind==='noApproval'){add('PARTICIPANT','No invented approver',!slots.P.entries.some(e=>e.state==='RESOLVED'&&e.participant_role==='APPROVER'),[],'Eligibility');return;}
  if(kind.startsWith('content')){const ns=g.nodes.filter(n=>['OUTPUT_CONTENT','QUOTE','ATTRIBUTE','COMPLEMENT'].includes(n.layer)&&objectMatch(n,v));add('OUTPUT_CONTENT',d,ns.length>0,ns.map(n=>n.id),'Candidate Node');return;}
  // Source distinctions without a stable complete v0.4 comparison adapter are
  // explicitly unverified. They must not silently become passes.
  checks.push({kind:'REVIEW_REQUIRED',claim:d,status:'NOT_VERIFIED',first_divergence:null,evidence:[]});
 }
 if(row.corpus==='natural'){
  const exp=obligations.find(o=>o.case_id===row.id);for(const k of ['I','O','A','B'])for(const w of exp[k])expectedSlot(k,w);
  for(const p of exp.P){const found=slots.P.entries.filter(e=>e.state==='RESOLVED'&&entryMatch(e,p.identity)&&e.participant_role===p.role);add('PARTICIPANT',`${p.identity} ${p.role}`,found.length>0,found.map(e=>e.entry_id),'Eligibility / Projection');}
  for(const d of exp.distinctions)distinction(d);
 }else if(row.corpus==='root'){
  const exp=intents.find(o=>o.case_id===row.id),files=s=>[...s.matchAll(/[\w.-]+\.(?:md|csv|json|ya?ml|xlsx|sql|log|txt)/gu)].map(m=>m[0]);
  for(const file of files(exp.input))expectedSlot('I',file);
  if(!/不据此额外授权|只陈述/u.test(exp.output))for(const file of files(exp.output))expectedSlot('O',file);
  else for(const file of files(exp.output))negativeSlot('O',file);
  if(exp.resources.includes('<=')||exp.resources.includes('≤'))for(const m of exp.resources.matchAll(/(?:<=|≤)(\d+)/gu))qty(m[1],'LTE','EXECUTION_LIMIT');
  if(!exp.conditions.startsWith('无')&&!exp.conditions.includes('不属于本次C'))add('CONDITION',exp.conditions,g.expressions.some(e=>e.kind==='CONDITION')||g.relations.some(r=>['CONDITION_OF','COMPLETION_OF','STOP_OF'].includes(r.type)),[],'Candidate Expression');
  if(exp.forbidden.startsWith('无额外'))add('FORBIDDEN','No source prohibition invented',slots.B.entries.filter(e=>e.state==='RESOLVED').length===0,[],'Eligibility');else add('FORBIDDEN',exp.forbidden,slots.B.entries.some(e=>e.state==='RESOLVED'),[],'Eligibility / Projection');
  // The descriptive root intent is not a machine-complete Gold. Preserve its
  // complete text for ADMIN review rather than inventing a new expected graph.
  checks.push({kind:'REVIEW_REQUIRED',claim:'Full descriptive source intent (all actions, scopes, output requirements and roles)',status:'NOT_VERIFIED',evidence:[exp],first_divergence:null});
 }else{
  const exp=frames.find(o=>o.id===row.id).expected,keys=new Map();
  for(const ev of exp.events){const ns=g.nodes.filter(n=>ev.predicate.some(w=>predicateMatch(n,w))&&n.modality===ev.modality);keys.set(ev.key,ns.map(n=>n.id));add('PREDICATE_MODALITY',`${ev.key} ${ev.modality}`,ns.length>0,ns.map(n=>n.id),'Candidate Node');
   for(const [role,val]of Object.entries(ev.args??{})){if(role==='target'&&val==='task')continue;const relTypes={actor:['AGENT'],object:['PATIENT','THEME','RESULT'],objects:['PATIENT','THEME'],recipient:['RECIPIENT'],location:['LOCATION']}[role];if(!relTypes)continue;
    for(const w of targetStrings(val)){if(w==='UNKNOWN_REFERENT'){add('AMBIGUITY',`${ev.key} has unresolved referent`,ns.some(n=>g.relations.some(r=>r.head===n.id&&nm(r.tail)?.type==='UNKNOWN_REFERENT')),[],'Candidate Node');continue;}
     const rs=g.relations.filter(r=>ns.some(n=>n.id===r.head)&&relTypes.includes(r.type)&&objectMatch(nm(r.tail),w));add('ARGUMENT_BINDING',`${ev.key} ${role} ${w}`,rs.some(r=>cert(r.id)),rs.map(r=>r.id),!ns.length?'Candidate Node':!rs.length?'Generic Relation Candidate Generation':'Γ Certification');
    }
   }
   if(ev.condition)add('CONDITION',`${ev.key} condition`,g.relations.some(r=>r.type==='CONDITION_OF'&&ns.some(n=>n.id===r.tail)&&cert(r.id)),[],'Candidate Expression');
   if(ev.modality==='NOT_REQUIRED')for(const n of ns)add('MODALITY','NOT_REQUIRED not current A/B',!trace.boundary_ir.facts.some(f=>f.state==='RESOLVED'&&['ACTION','FORBIDDEN_OPERATION'].includes(f.kind)&&f.predicate_id===n.id),[],'Eligibility');
  }
  for(const ex of exp.expressions){if(ex.value!==undefined){const es=qty(ex.value,ex.operator??null),targets=ex.target==='task'?['TASK']:keys.get(ex.target);if(targets)add('QUANTITY_TARGET',`${ex.key} binds ${ex.target}`,es.some(e=>targets.includes(e.quantity?.target)&&cert(e.id)),es.map(e=>({id:e.id,target:e.quantity?.target})),es.length?'Γ Certification':'Candidate Expression');}else if(['AND','OR','NOT'].includes(ex.kind))distinction('condition:'+ex.kind);else checks.push({kind:'REVIEW_REQUIRED',claim:'Expression '+JSON.stringify(ex),status:'NOT_VERIFIED',evidence:[],first_divergence:null});}
  for(const rel of exp.relations){if(rel.type==='NEGATIVE_ROLE'){add('PARTICIPANT',`No ${rel.tail} role invented for ${rel.head}`,!slots.P.entries.some(e=>e.state==='RESOLVED'&&entryMatch(e,rel.head)&&e.participant_role===rel.tail),[],'Eligibility');continue;}if(rel.head==='task'&&rel.type==='BASIS'){expectedSlot('V',rel.tail);continue;}if(['LIMIT','COMPLETION_OF'].includes(rel.type)){add('BOUNDARY_USE',rel.type,g.relations.some(r=>r.type===rel.type&&cert(r.id)),[],'Generic Relation Candidate Generation');continue;}const rs=g.relations.filter(r=>r.type===rel.type&&keys.get(rel.head)?.includes(r.head)&&(keys.has(rel.tail)?keys.get(rel.tail).includes(r.tail):objectMatch(nm(r.tail),rel.tail))&&(!rel.role||r.role===rel.role));add('RELATION',`${rel.type} ${rel.head} -> ${rel.tail}`,rs.some(r=>cert(r.id)),rs.map(r=>r.id),!keys.get(rel.head)?.length?'Candidate Node':!rs.length?'Generic Relation Candidate Generation':'Γ Certification');}
  if(exp.ambiguity)distinction('ambiguity:'+exp.ambiguity.type);
 }
 const fail=checks.filter(c=>c.status==='FAIL'),unverified=checks.filter(c=>c.status==='NOT_VERIFIED');
 const stageOrder=['Source Preservation','SemanticParserPort','Source Linker','Candidate Node','Generic Relation Candidate Generation','Candidate Expression','Γ Certification','Eligibility','Eligibility / Projection','Canonical 7+1','Proof','Coverage'];
 const first=fail.map(c=>c.first_divergence).sort((a,b)=>stageOrder.indexOf(a)-stageOrder.indexOf(b))[0]??null;
 return {id:row.id,corpus:row.corpus,source_sha256:row.source_sha256,status:trace.status,trace:row.trace,canonical:row.canonical,reference_checks_pass:fail.length===0,closure_status:fail.length?'OPEN':unverified.length?'REFERENCE_CHECKS_PASS_REVIEW_PENDING':'REFERENCE_CHECKS_PASS',semantically_closed_confirmed:false,checks,first_divergence:first,source_graph:{nodes:g.nodes.length-1,relations:g.relations.length,expressions:g.expressions.length,unresolved:g.unresolved.length,auditor_suspicions:g.auditor_findings.map(f=>({kind:f.kind,ids:f.candidate_ids,reason:f.reason}))},boundary:{certified:trace.gamma_certification.certified_ids.length,typed_unresolved:trace.gamma_certification.unresolved.length,rejected:trace.gamma_certification.rejected.length,resolved_facts:trace.boundary_ir.facts.filter(f=>f.state==='RESOLVED').length},canonical_states:Object.fromEntries(Object.entries(slots).map(([k,v])=>[k,v.state])),unverified_semantic_checks:unverified.length};
}
if(process.argv[1]?.endsWith('evaluator.mjs')){
 const [split='development',revision='v1']=process.argv.slice(2),result=read(`${REPORT}/runs/${split}-${revision}/RESULTS.json`),rows=result.rows.map(row=>review(row,row.trace?read(row.trace):null));
 save(`${REPORT}/evaluations/${split}-${revision}.json`,{split,revision,total:rows.length,rows,reference_checks_pass:rows.filter(r=>r.reference_checks_pass).length,confirmed_semantic_closure:0,comparison_authority:'Existing source-derived obligations and exposed frames; incomplete references are explicitly NOT_VERIFIED. No new Gold or expected graph was generated.',semantic_precision:null,semantic_recall:null,precision_recall_reason:'References do not enumerate all permissible nodes/relations; match scores must not be advertised as full semantic precision/recall.'});
 console.log(JSON.stringify({split,total:rows.length,reference_pass:rows.filter(r=>r.reference_checks_pass).length,confirmed_semantic_closure:0}));
}
