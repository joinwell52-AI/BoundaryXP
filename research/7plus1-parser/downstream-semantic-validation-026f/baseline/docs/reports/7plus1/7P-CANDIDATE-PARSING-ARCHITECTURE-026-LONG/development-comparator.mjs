// Offline frame comparator. It is never imported by the Parser and never repairs output.
// Written before materialization/observation of the holdout. All failures retain original traces.
import fs from 'node:fs';import {OUT,OLD,read,write,sha} from './audit-tools.mjs';
let TRACE_ROOT=OLD;
const aliases={organize:['组织','organize','coordinate','arrange'],check:['核查','核验','检查','审阅','inspect','verify','check','review'],compare:['比较','compare'],read:['读取','read'],inspect:['查看','inspect'],produce:['形成','生成','deliver','create'],exemption:['形成','生成','deliver','create'],review:['复核','review'],send:['提交','send'],modify:['修改','modification','modify'],restore:['恢复','recovery','recover'],content:['包含','contain']};
const text=x=>String(x??'').toLowerCase(),contains=(x,y)=>text(x).includes(text(y));
export function audit(item,row){
 const frame=item.frame,checks=[],error=(claim,ok,evidence=[],category='missing_clear_candidates')=>checks.push({claim,status:ok?'PASS':'FAIL',category,evidence});
 if(!row.trace){error('Real parser output saved',false,[row.error],'runtime_errors');return {id:item.id,language:frame.language,ambiguity:!!frame.ambiguity,closed:false,checks,first_divergence:{stage:'RUNTIME',reason:row.error}};}
 const run=read(TRACE_ROOT+'/'+row.trace),c=run.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),g=c.candidate_semantic_graph,sp=new Map(run.source_spans.map(s=>[s.span_id,s])),facts=c.boundary_ir.facts;
 const surface=i=>nm.get(i)?.surface??'',objects=f=>f.object_node_ids.map(surface),pred=f=>surface(f.predicate_node_id),args=r=>surface(r.tail_node_id),resolved=f=>f.state==='RESOLVED';
 const active=n=>n.node_type==='EVENT'&&!n.metadata.retired_reason&&g.candidate_relations.some(r=>r.head_node_id===n.node_id&&r.candidate_state!=='REJECTED'&&r.state!=='REJECTED');
 const lex=(event,value)=>[...aliases[event.key]??[],...event.predicate].some(a=>contains(value,a));
 const value=v=>Array.isArray(v)?v.filter(x=>typeof x==='string'):v?[v]:[];
 const actualFacts=e=>facts.filter(f=>['ACTION','FORBID','RESTRICT','DELIVERABLE'].includes(f.fact_type)&&lex(e,pred(f)));
 const expectedObject=e=>{const raw=e.args.object??e.args.objects;if(Array.isArray(raw)&&JSON.stringify(raw)===JSON.stringify(frame.entities.noun))return [frame.entities.noun[frame.language==='en'?1:0]];const objects=value(raw);return e.key==='content'&&frame.language==='en'?objects.map(o=>({'风险':'Risks','验证步骤':'Verification steps'})[o]??o):objects;};
 const matchesObject=(s,o)=>o==='UNKNOWN_REFERENT'?c.semantic_nodes.some(n=>n.node_type==='UNKNOWN_REFERENT'&&n.surface===s):contains(s,o)||o===frame.entities.noun[0]&&contains(s,frame.entities.noun[1]);
 error('G1–G12 candidate-only architecture',run.candidate_graph_gate_results.status==='PASS',[run.candidate_graph_gate_results],'architecture_failure');
 error('Object/relation/scope contract',run.contract_gate_results.status==='PASS'&&c.nlp_signals.semantic_decoding.scope_consistency.status==='PASS',[run.contract_gate_results],'wrong_binding');
 error('No omitted-accountability coverage',!c.coverage.some(x=>x.disposition==='COVERAGE_FAILURE'),c.coverage.filter(x=>x.disposition==='COVERAGE_FAILURE'),'coverage_gap');
 error('All resolved facts have certified candidate lineage',facts.filter(resolved).every(f=>c.boundary_certification.some(x=>x.boundary_fact_id===f.boundary_fact_id&&x.status==='CERTIFIED')&&f.relation_ids.every(i=>c.gamma_certification.decisions.some(d=>d.relation_id===i&&d.decision==='CERTIFIED'))),[],'proof_gap');
 error('No support/operator becomes business action',!facts.some(f=>f.fact_type==='ACTION'&&/^(组织|负责|请|要求|organize|coordinate|arrange|must|should|只有|if|when)$/iu.test(pred(f))),[],'operator_false_business_action');
 error('Explicit organizational actor has participant identity',c.canonical_7plus1.P.entries.some(e=>contains(e.display_value,frame.entities.actor)&&e.state==='RESOLVED'),c.canonical_7plus1.P.entries,'missing_clear_semantic_nodes');
 const recalls={semantic_nodes:{required:0,found:0},candidate_relations:{required:0,found:0},candidate_expressions:{required:0,found:0}};
 for(const e of frame.events.filter(e=>e.key!=='organize')){
  const contentRequirements=(c.nlp_signals.semantic_decoding.output_content_ir?.requirements??[]).filter(r=>r.ownership_status==='UNIQUE_OUTPUT'&&r.content_modality===e.modality&&r.owner_output_ids.some(i=>surface(i)===frame.entities.output)&&r.member_node_ids?.length===2);
  const ns=c.semantic_nodes.filter(n=>(e.key==='content'?contentRequirements.some(r=>r.semantic_node_ids.includes(n.node_id))&&n.node_type==='STATE':e.key==='exemption'?n.node_type==='EVENT':active(n))&&lex(e,n.surface));recalls.semantic_nodes.required++;if(ns.length)recalls.semantic_nodes.found++;
  error('Semantic event '+e.key,ns.length>0,ns.map(n=>n.node_id),'missing_clear_semantic_nodes');
  const eo=expectedObject(e),ff=actualFacts(e),rr=g.candidate_relations.filter(r=>ns.some(n=>n.node_id===r.head_node_id)&&['PATIENT','THEME','RESULT','RECIPIENT','FORBIDS','PART_OF'].includes(r.relation_type)&&r.state!=='REJECTED'&&r.candidate_state!=='REJECTED');
  for(const o of eo){recalls.candidate_relations.required++;const found=rr.some(r=>matchesObject(args(r),o))||e.key==='content'&&contentRequirements.some(r=>r.member_node_ids.some(i=>matchesObject(surface(i),o)));if(found)recalls.candidate_relations.found++;
   error('Candidate argument '+e.key+' → '+o,found,rr,'missing_clear_candidates');
   if(e.key!=='content'&&e.key!=='exemption')error('Boundary argument '+e.key+' → '+o,ff.some(f=>objects(f).some(s=>matchesObject(s,o))),ff,'missing_clear_candidates');
  }
  const eventMatch=n=>e.key==='content'&&contentRequirements.some(r=>r.semantic_node_ids.includes(n.node_id))||e.key==='exemption'&&n.metadata.modality==='NOT_REQUIRED'||eo.length===0||eo.some(o=>g.candidate_relations.some(r=>r.head_node_id===n.node_id&&r.state!=='REJECTED'&&matchesObject(args(r),o)));
  const modalNodes=ns.filter(eventMatch),correctModal=modalNodes.filter(n=>n.metadata.modality===e.modality||e.key==='content'&&contentRequirements.some(r=>r.semantic_node_ids.includes(n.node_id)&&r.content_modality===e.modality));
  error('Modality '+e.key+' = '+e.modality,correctModal.length>0,modalNodes.map(n=>({node_id:n.node_id,modality:n.metadata.modality})),'unsupported_RESOLVED');
  if(e.modality==='NOT_REQUIRED')error('Exemption is not a positive obligation or prohibition',!facts.some(f=>['ACTION','FORBID'].includes(f.fact_type)&&correctModal.some(n=>n.node_id===f.predicate_node_id)&&resolved(f)),ff,'unsupported_RESOLVED');
  else if(e.key!=='content')error('Boundary modality and state '+e.key,ff.some(f=>correctModal.some(n=>n.node_id===f.predicate_node_id)&&(e.modality==='FORBIDDEN'?f.fact_type==='FORBID':f.fact_type==='ACTION'||f.fact_type==='DELIVERABLE')&&(frame.ambiguity&&e.condition==='UNRESOLVED_APPROVAL'||eo.includes('UNKNOWN_REFERENT')?!resolved(f):resolved(f))),ff,'clear_source_unresolved');
  if(e.condition&&e.key!=='exemption'){
   const cf=ff.filter(f=>correctModal.some(n=>n.node_id===f.predicate_node_id));error('Consequent retains condition '+e.key,cf.some(f=>!!f.condition_expr_id),cf,'missing_clear_candidates');
   const ce=cf.map(f=>c.boundary_ir.condition_expr_nodes.find(x=>x.expr_id===f.condition_expr_id)).filter(Boolean);
   const conditionText=ce.map(x=>JSON.stringify(x)+x.source_span_ids.map(i=>sp.get(i)?.text??'').join(' ')).join(' ');
   if(e.condition==='approval')error('Approval condition bound to explicit reviewer',contains(conditionText,frame.entities.reviewer)||ce.some(x=>c.semantic_nodes.some(n=>contains(n.surface,frame.entities.reviewer)&&JSON.stringify(x).includes(n.node_id))),ce,'wrong_binding');
  }
  if(e.args.recipient)error('Recipient '+e.key+' → '+e.args.recipient,c.relations.some(r=>r.relation_type==='RECIPIENT'&&ns.some(n=>n.node_id===r.head_node_id)&&contains(args(r),e.args.recipient)&&r.state==='RESOLVED'),[],'wrong_binding');
 }
 for(const e of frame.expressions){recalls.candidate_expressions.required++;let ok=false,evidence=[];
  if(e.kind==='QUANTITY'||e.kind==='QUANTIFIED_STATE'){
   const q=c.boundary_ir.quantity_expr_nodes.filter(q=>e.operator==='LTE'?q.upper_bound?.value===e.value:q.lower_bound?.value===e.value);evidence=q;
   ok=q.some(q=>e.metric==='duration'?/分钟|minute/iu.test(q.unit):/次|time|attempt|count|check/iu.test(q.unit));
   if(ok&&e.metric==='duration')error('Whole-task duration is resource with exact upper bound',facts.some(f=>f.fact_type==='RESOURCE'&&q.some(x=>x.expr_id===f.quantity_expr_id)&&resolved(f)),q,'wrong_binding');
  }else if(e.kind==='AND'||e.kind==='NOT'){evidence=c.boundary_ir.condition_expr_nodes.filter(x=>x.op===e.kind);ok=evidence.length>0;}
  else if(e.kind==='STATE'||e.kind==='APPROVAL'){evidence=c.boundary_ir.condition_expr_nodes;ok=evidence.length>0;}
  else if(e.kind==='EXCEPT'){evidence=c.boundary_ir.set_expr_nodes.filter(x=>x.kind==='EXCEPT');ok=evidence.length>0;}
  if(ok)recalls.candidate_expressions.found++;error('Frame expression '+e.key+' '+e.kind,ok,evidence,'missing_candidate_expressions');
 }
 if(frame.events.some(e=>e.key==='produce'))error('Canonical explicit deliverable retained',c.canonical_7plus1.O.entries.some(e=>contains(e.display_value,frame.entities.output)),c.canonical_7plus1.O,'false_ABSENT');
 if(frame.family===5){const sd=c.nlp_signals.semantic_decoding.output_content_ir,parts=c.relations.filter(r=>r.relation_type==='PART_OF');error('Content sections owned by produced output',parts.some(r=>contains(surface(r.tail_node_id),frame.entities.output))&&JSON.stringify(sd).match(/风险|Risks/iu)&&JSON.stringify(sd).match(/验证步骤|Verification steps/iu),parts,'wrong_binding');}
 if(frame.family===6)error('Recipient is not inferred approver',!c.canonical_7plus1.P.entries.some(e=>contains(e.display_value,frame.entities.recipient)&&/APPROVER/u.test(e.display_value)),c.canonical_7plus1.P,'unsupported_RESOLVED');
 if(frame.family===8)for(const key of ['modify','restore'])error('Canonical prohibition '+key,c.canonical_7plus1.B.entries.some(e=>e.state==='RESOLVED'&&aliases[key].some(a=>contains(e.display_value,a))),c.canonical_7plus1.B,'false_ABSENT');
 if(!frame.ambiguity)error('Clear source has no unresolved semantic boundary',c.unresolved.length===0&&facts.every(resolved),c.unresolved,'clear_source_unresolved');
 else{
  const a=frame.ambiguity,u=c.unresolved,alt=JSON.stringify(g.candidate_expressions.filter(x=>x.candidate_state==='COMPETING'||x.expression_type==='coreference_candidates'));
  let ok=u.some(x=>x.kind===a.type||x.unresolved_type===a.type||x.type===a.type)&&u.every(x=>x.reason);
  if(a.referent==='report'){ok=ok&&a.alternatives.every(x=>c.semantic_nodes.some(n=>contains(n.surface,x)&&alt.includes(n.node_id)))&&facts.some(f=>f.state!=='RESOLVED'&&aliases.review.some(x=>contains(pred(f),x)));}
  if(a.referent==='basis_version')ok=ok&&a.alternatives.every(v=>JSON.stringify(g).includes(v))&&!facts.some(f=>f.fact_type==='BASELINE'&&resolved(f));
  if(a.referent==='approval_connector')ok=ok&&/ANY/u.test(alt)&&/ALL/u.test(alt)&&facts.some(f=>f.condition_expr_id&&!resolved(f)&&aliases.read.some(x=>contains(pred(f),x)));
  error('Typed ambiguity with all alternatives and no selected interpretation',ok,u,'ambiguity_failure');
 }
 const failures=checks.filter(x=>x.status==='FAIL'),first=failures[0];return {id:item.id,language:frame.language,family:frame.family,source:c.source.raw_text,source_sha256:c.source.sha256,trace:row.trace,trace_sha256:row.trace_sha256,ambiguity:!!frame.ambiguity,closed:!failures.length,semantic_node_recall:recalls.semantic_nodes,candidate_relation_recall:recalls.candidate_relations,candidate_expression_recall:recalls.candidate_expressions,Boundary_IR_equivalence:failures.length?'FAILED':'PASS_FOR_DECLARED_FRAME',Canonical_7plus1_equivalence:failures.length?'FAILED':'PASS_FOR_DECLARED_FRAME',checks,first_divergence:first?{stage:first.category.startsWith('missing_')?'CANDIDATE_GENERATION':first.category==='wrong_binding'?'ARGUMENT_OR_EXPRESSION_BINDING':first.category==='unsupported_RESOLVED'?'MODALITY_OR_GAMMA':'SOURCE_SEMANTIC_CLOSURE',reason:first.claim,evidence:first.evidence}:null,raw_first_divergence:run.first_divergence};
}

export function evaluateBatch(frameFile,manifestFile,traceRoot=OLD){TRACE_ROOT=traceRoot;const batch=read(frameFile),first=read(manifestFile);return batch.cases.filter(c=>first.rows.some(r=>r.id===c.id)).map(c=>audit(c,first.rows.find(r=>r.id===c.id)));}
if(['baseline','baseline-r02'].includes(process.argv[2])){
 const rows=evaluateBatch(OLD+'/BLIND-200-FRAMES.json',OLD+'/BLIND-200-FIRST-RUN.json');
 write(process.argv[2]==='baseline-r02'?'BLIND-200-COMPARATOR-CORRECTION-r02.json':'BLIND-200-COMPARATOR-CORRECTION.json',{purpose:'Offline representation contract correction; all frozen first traces preserved; not parser repair',corrections:['STATE output-content with explicit output owner/modality/member lineage','Source-language bilingual noun identity','UNKNOWN_REFERENT node type instead of literal surface','NOT_REQUIRED preserved event does not require a positive live candidate','EXCEPT set expression uses canonical kind field','Bilingual object-list equality compares JSON values rather than object identity','English quoted content is compared to its source-language wording, not the Chinese frame label'],rows,aggregate:{total:rows.length,assertion_closed:rows.filter(r=>r.closed).length,clear_closed:rows.filter(r=>!r.ambiguity&&r.closed).length,ambiguity_closed:rows.filter(r=>r.ambiguity&&r.closed).length}});
 console.log(JSON.stringify({total:rows.length,closed:rows.filter(r=>r.closed).length}));
}

