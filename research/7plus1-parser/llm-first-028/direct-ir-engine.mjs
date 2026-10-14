import fs from 'node:fs';import path from 'node:path';
import {isDeepStrictEqual} from 'node:util';
import {prepareSource,sha256} from './source.mjs';import {callCodex,probeCodex} from './provider.mjs';import {modelSignal} from './observability.mjs';
import {directIRBundle} from './direct-ir-bundle.mjs';import {acceptCandidateIR} from './direct-ir-accept.mjs';import {projectDirectIR} from './direct-ir-view.mjs';import {calculateDirectIR} from './direct-ir-calculate.mjs';
import {revisionBundle,applyIRPatch,revisionPermissions,explanationOnlyPatch} from './direct-ir-revision.mjs';
import {finishDirectIR} from './direct-ir-result.mjs';
import {renderDirectCalculations} from './direct-ir-render-results.mjs';
import {affectedAuditTargets,targetedAuditBundle,mergeIndependentAudit} from './direct-ir-audit-merge.mjs';
import {repairableFrameCodes} from '../../../src/bxp/ir-kernel/frames.mjs';
import {irOnly,calculationTargets,calculationAuditBundle} from './boundary-calculation-schema.mjs';
import {attachLLMCalculation,checkLLMBoundary} from './boundary-calculation.mjs';
import {expandCompactBoundary,compactBoundaryCandidate} from './compact-boundary.mjs';
const write=(dir,name,value)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(value,null,2)+'\n');
export async function parseDirectIR(bytes,{output,probe,model='gpt-6.1-sol',reasoning='medium',parseMethod='SKILL',signal,onProgress=()=>{},timeoutMs=null,call=callCodex,maxModelRequests=2,resourceGuard=()=>{},productSnapshot=null}={}){
 if(!output)throw Error('OUTPUT_DIRECTORY_REQUIRED');if(!Number.isSafeInteger(maxModelRequests)||maxModelRequests<2)throw Error('MODEL_REQUEST_BUDGET_EXHAUSTED');
 const rawCall=call;call=async args=>{const response=await rawCall(args);return {...response,value:expandCompactBoundary(response.value,args.candidate)};};
 fs.mkdirSync(output,{recursive:true});if(fs.existsSync(path.join(output,'source.txt')))throw Error('OUTPUT_ALREADY_EXISTS');
 resourceGuard();signal?.throwIfAborted();const source=prepareSource(bytes);fs.writeFileSync(path.join(output,'source.txt'),bytes);write(output,'source.json',source);
 onProgress({stage:'PREPARING',revision:0});probe??=probeCodex();write(output,'environment.json',probe);
 const contractVersion=productSnapshot?.contract??'candidate-ir/1.4',selectedBundle=phase=>directIRBundle(phase,{parseMethod,contractVersion});
 const parse=selectedBundle('parse'),audit=selectedBundle('audit'),fingerprint=sha256(parse.sha256+audit.sha256),requestBudget={remaining:maxModelRequests};parseMethod=parse.parse_method;
 write(output,'selected-resources.json',{parse_method:parseMethod,resource_profile:parse.resource_profile,request_profile:parse.request_profile,resources:{parse:parse.resources.map(({text,...r})=>r),audit:audit.resources.map(({text,...r})=>r)},sha256:fingerprint});
 let dir=path.join(output,'revision-0');fs.mkdirSync(dir);let revision=0,revisionOutcome=null;const incompleteModelRequests=[];
 const telemetry=phase=>({onEvent:event=>{const s=modelSignal(event);if(s)onProgress({stage:phase==='parse'?'PARSING':'AUDITING',phase,revision,...s});},onActivity:p=>onProgress({stage:phase==='parse'?'PARSING':'AUDITING',phase,revision,...p})});
 onProgress({stage:'PARSING',revision:0});let parsed=await call({bundle:parse,source,directory:path.join(dir,'parse-call'),probe,model,reasoning,signal,timeoutMs,requestBudget,...telemetry('parse')});
 write(dir,'proposal.json',parsed.value);let llmCalculation=parsed.value.boundary_calculation??null;parsed={...parsed,value:irOnly(parsed.value)};
 const reviewInput=()=>llmCalculation?(parse.request_profile==='LLM_BOUNDARY_CALCULATION_R03'?compactBoundaryCandidate({...parsed.value,boundary_calculation:llmCalculation}):{...parsed.value,boundary_calculation:llmCalculation}):parsed.value;
 if(llmCalculation)write(dir,'llm-boundary-calculation.json',llmCalculation);
 write(dir,'candidate-ir.json',parsed.value);onProgress({stage:'PARSING',revision:0,kind:'PARSE_READY',signal:'PARSE_READY'});
 resourceGuard();signal?.throwIfAborted();onProgress({stage:'AUDITING',revision:0});let reviewed=await call({bundle:calculationAuditBundle(audit,llmCalculation),source,candidate:reviewInput(),directory:path.join(dir,'audit-call'),probe,model,reasoning,signal,timeoutMs,requestBudget,...telemetry('audit')});
 if(!parsed.receipt.thread_id||!reviewed.receipt.thread_id||parsed.receipt.thread_id===reviewed.receipt.thread_id)throw Error('AUDIT_SESSION_NOT_INDEPENDENT');
 write(dir,'audit.json',reviewed.value);onProgress({stage:'AUDITING',revision:0,kind:'AUDIT_READY',signal:'AUDIT_READY'});resourceGuard();
 if(sha256(selectedBundle('parse').sha256+selectedBundle('audit').sha256)!==fingerprint)throw Error('METHOD_CHANGED_DURING_RUN');
 onProgress({stage:'VALIDATING',revision:0});let technical=acceptCandidateIR(parsed.value,reviewed.value,source);write(dir,'technical-validation.json',technical);onProgress({stage:'VALIDATING',revision:0,kind:'TECHNICAL_READY',signal:'TECHNICAL_READY'});
 const repairableTechnical=technical.schemas.proposal.ok&&technical.schemas.audit.ok&&technical.errors.every(e=>repairableFrameCodes.has(e.code)||['DATA_CONSUMER_EVENT','DATA_CONSUMER_OBJECT_BINDING','DATA_PRODUCER_OBJECT_BINDING','EXTERNAL_DATA_HAS_TASK_PRODUCER','BOOLEAN_TYPE','MEMBERSHIP_TYPE','START_STATE_TYPE','IMMEDIATE_STATE_EVENT_TYPE'].includes(e.code));
 const evidenceOptions={requireWire:['LLM_BOUNDARY_CALCULATION_R02','LLM_BOUNDARY_CALCULATION_R03'].includes(parse.request_profile)};
 const initialCalculation=llmCalculation?await checkLLMBoundary(parsed.value,llmCalculation,reviewed.value,technical,evidenceOptions):null;
 const repairableCalculationCodes=new Set(['LLM_CALCULATION_EVIDENCE_REQUIRED','LLM_CALCULATION_MISMATCH','LLM_SAT_WITHOUT_CHECKABLE_WITNESS','LLM_WITNESS_INVALID','LLM_WITNESS_NOT_VERIFIED','LLM_CALCULATION_AUDIT_REFERENCE','LLM_CALCULATION_REVIEW_REQUIRED']);
 const calculationProblems=(initialCalculation?.findings??[]).filter(x=>repairableCalculationCodes.has(x.code));
 const calculationFeedback=(reviewed.value.calculation_reviews??[]).some(r=>r.verdict!=='SUPPORT')||calculationProblems.length>0;
 const repairableOmissions=(reviewed.value.omissions??[]).filter(o=>!['CONTRACT_UNSUPPORTED','CLARIFICATION_REQUIRED'].includes(o.repairability));
 const semanticFeedback=repairableOmissions.length||(reviewed.value.reviews??[]).some(r=>r.verdict!=='SUPPORT')||technical.diagnostics.some(d=>d.code==='COVERAGE_REVIEW_ISSUE')||calculationFeedback;
 if(!semanticFeedback&&reviewed.value.omissions?.length)revisionOutcome={status:'NOT_APPLIED',reason:'SKIPPED_NON_REPAIRABLE_OMISSION',retained_revision:0,requires_review:false};
 const needsRepair=contractVersion==='candidate-ir/2.0'?technical.audit_status==='PERFORMED'&&(technical.errors.length||semanticFeedback):((reviewed.value.omissions??[]).length||technical.rows.some(r=>r.status!=='ACCEPTED')||technical.diagnostics.some(d=>d.code==='COVERAGE_REVIEW_ISSUE'));
 if(contractVersion==='candidate-ir/2.0'&&technical.audit_status==='NOT_PERFORMED')revisionOutcome={status:'NOT_APPLIED',reason:'AUDIT_NOT_PERFORMED',retained_revision:0,requires_review:true};
 if((technical.technical_ok||repairableTechnical)&&requestBudget.remaining>=2&&needsRepair){
  revision=1;dir=path.join(output,'revision-1');fs.mkdirSync(dir);const base=parsed.value;
  const {replacements,removals,coverage_indices}=revisionPermissions(base,reviewed.value,technical);
  const problems={base_ir_sha256:sha256(JSON.stringify(base)),omissions:reviewed.value.omissions,issues:reviewed.value.issues,technical_errors:technical.errors,removable_node_ids:[...reviewed.value.reviews.filter(r=>r.verdict==='CONTRADICT'&&!r.field_path).map(r=>r.target.id),...technical.errors.filter(e=>e.code==='DATA_CONSUMER_EVENT').map(e=>e.id)],missing_review_fields:technical.rows.filter(r=>r.missing_review_fields?.length).map(r=>({id:r.id,fields:r.missing_review_fields}))};
  problems.allowed_replacement_ids=replacements;problems.removable_node_ids=removals;problems.allowed_coverage_indices=coverage_indices;
  problems.calculation_findings=calculationProblems;
  if(llmCalculation)problems.calculation_reviews=reviewed.value.calculation_reviews??[];
  write(dir,'revision-request.json',problems);onProgress({stage:'PARSING',revision:1});
  let patched;
  try{patched=await call({bundle:revisionBundle(parse),source,candidate:reviewInput(),revisionIssues:problems,directory:path.join(dir,'patch-call'),probe,model,reasoning,signal,timeoutMs,requestBudget,...telemetry('parse')});}
  catch(error){
   revisionOutcome={status:'NOT_APPLIED',reason:error.message,retained_revision:0,retained_ir_sha256:sha256(JSON.stringify(base)),requires_review:true,cancelled:signal?.aborted===true};
   incompleteModelRequests.push({phase:'revision-parse',revision:1,call_invoked:true,server_request_count_unknown:true,reason:error.message});
   technical={...technical,diagnostics:[...technical.diagnostics,{code:'REVISION_NOT_APPLIED',reason:error.message}]};write(dir,'revision-outcome.json',revisionOutcome);write(dir,'retained-candidate-ir.json',base);write(dir,'retained-audit.json',reviewed.value);
  }
  if(patched){
  write(dir,'patch.json',patched.value);let applied;
  parsed={...parsed,attempts:[...parsed.attempts,...patched.attempts]};
  try{applied=applyIRPatch(base,patched.value,{allowed_replacements:replacements,allowed_removals:removals,allowed_coverage_indices:coverage_indices,allowed_coverage_targets:reviewed.value.issues.filter(i=>i.field_path==='coverage').flatMap(i=>i.targets.map(t=>t.id))});}
  catch(error){
   if(!/^PATCH_[A-Z_]+(?::|$)/.test(error.message))throw error;
   revisionOutcome={status:'NOT_APPLIED',reason:error.message,retained_revision:0,retained_ir_sha256:sha256(JSON.stringify(base)),patch_sha256:sha256(JSON.stringify(patched.value)),requires_review:true};
   technical={...technical,diagnostics:[...technical.diagnostics,{code:'REVISION_NOT_APPLIED',reason:'局部修订未应用，保留首轮IR与审阅；'+error.message}]};
   write(dir,'revision-outcome.json',revisionOutcome);write(dir,'candidate-ir.json',base);write(dir,'audit.json',reviewed.value);write(dir,'technical-validation.json',technical);
   onProgress({stage:'VALIDATING',revision:1,signal:'REVISION_NOT_APPLIED'});
  }
  const calculationChanged=patched.value.boundary_calculation!=null&&!isDeepStrictEqual(patched.value.boundary_calculation,llmCalculation);
  if(applied&&calculationChanged&&!calculationFeedback&&(isDeepStrictEqual(applied.ir,base)||explanationOnlyPatch(base,applied.ir))){revisionOutcome={status:'NOT_APPLIED',reason:'PATCH_UNRELATED_CALCULATION',retained_revision:0,requires_review:true};write(dir,'revision-outcome.json',revisionOutcome);applied=null;}
  if(applied&&!calculationChanged&&(isDeepStrictEqual(applied.ir,base)||contractVersion==='candidate-ir/2.0'&&explanationOnlyPatch(base,applied.ir))){
   const explanationOnly=!isDeepStrictEqual(applied.ir,base);
   revisionOutcome={status:'NOT_APPLIED',reason:explanationOnly?'PATCH_EXPLANATION_ONLY':'PATCH_NO_CHANGE',retained_revision:0,retained_ir_sha256:sha256(JSON.stringify(base)),patch_sha256:sha256(JSON.stringify(patched.value)),requires_review:explanationOnly,explanation_proposal_saved:explanationOnly};
   write(dir,'patch-changes.json',[]);write(dir,'revision-outcome.json',revisionOutcome);write(dir,'proposal.json',base);write(dir,'candidate-ir.json',base);write(dir,'audit.json',reviewed.value);write(dir,'technical-validation.json',technical);
   write(dir,'audit-targets.json',{targets:[],mode:explanationOnly?'SKIPPED_EXPLANATION_ONLY_RETAIN_AUDITED_IR':'SKIPPED_UNCHANGED_IR'});onProgress({stage:'VALIDATING',revision:1,signal:'REVISION_NOT_APPLIED'});applied=null;
  }
  if(applied){
  const retained={parsed,reviewed,technical,llmCalculation};let nextAuditResponse;
  try{
  write(dir,'patch-changes.json',applied.changed);
  if(llmCalculation&&!explanationOnlyPatch(base,applied.ir)&&!isDeepStrictEqual(applied.ir,base)&&patched.value.boundary_calculation==null)throw Error('PATCH_CALCULATION_NOT_UPDATED');
  parsed={...parsed,value:applied.ir};if(patched.value.boundary_calculation!=null)llmCalculation=patched.value.boundary_calculation;
  write(dir,'proposal.json',reviewInput());write(dir,'candidate-ir.json',parsed.value);if(llmCalculation)write(dir,'llm-boundary-calculation.json',llmCalculation);onProgress({stage:'PARSING',revision:1,kind:'PARSE_READY',signal:'PARSE_READY'});
  const targets=affectedAuditTargets(parsed.value,applied.changed,reviewed.value).filter(id=>['entities','variables','events','states','expressions','requirements'].some(k=>parsed.value[k].some(n=>n.id===id))),targeted=!llmCalculation&&!reviewed.value.omissions?.length&&!removals.length&&!applied.changed.some(c=>['issues','coverage','sequences'].includes(c.collection));write(dir,'audit-targets.json',{targets,mode:targeted?'CHANGED_AND_DEPENDENT':'FULL_IR_AND_CALCULATION_REVIEW'});
  const next=nextAuditResponse=await call({bundle:calculationAuditBundle(targeted?targetedAuditBundle(audit,targets):audit,llmCalculation),source,candidate:reviewInput(),directory:path.join(dir,'audit-call'),probe,model,reasoning,signal,timeoutMs,requestBudget,...telemetry('audit')});
  if(!next.receipt.thread_id||[parsed.receipt.thread_id,patched.receipt.thread_id,reviewed.receipt.thread_id].includes(next.receipt.thread_id))throw Error('AUDIT_SESSION_NOT_INDEPENDENT');
  write(dir,'independent-audit.json',next.value);
  if(contractVersion==='candidate-ir/2.0'&&(!(next.value.reviews??[]).length||targets.some(id=>!next.value.reviews.some(r=>r.target.id===id))))throw Error('REVISION_AUDIT_INCOMPLETE');
  if(llmCalculation&&calculationTargets(llmCalculation).some(id=>!(next.value.calculation_reviews??[]).some(r=>r.target===id)))throw Error('REVISION_CALCULATION_AUDIT_INCOMPLETE');
  reviewed={...next,value:targeted?mergeIndependentAudit(reviewed.value,next.value,targets):next.value,attempts:[...reviewed.attempts,...next.attempts]};write(dir,'audit.json',reviewed.value);technical=acceptCandidateIR(parsed.value,reviewed.value,source);write(dir,'technical-validation.json',technical);if(!technical.technical_ok)throw Error('REVISION_TECHNICAL_REJECTED');onProgress({stage:'VALIDATING',revision:1,kind:'TECHNICAL_READY',signal:'TECHNICAL_READY'});
  revisionOutcome={status:'APPLIED_AND_REVIEWED',retained_revision:1};write(dir,'revision-outcome.json',revisionOutcome);
  }catch(error){
   if(!nextAuditResponse)incompleteModelRequests.push({phase:'revision-audit',revision:1,call_invoked:true,server_request_count_unknown:true,reason:error.message});
   parsed=retained.parsed;llmCalculation=retained.llmCalculation;reviewed={...retained.reviewed,attempts:[...retained.reviewed.attempts,...(nextAuditResponse?.attempts??[])]};technical={...retained.technical,diagnostics:[...retained.technical.diagnostics,{code:'REVISION_NOT_APPLIED',reason:error.message}]};
   revisionOutcome={status:'NOT_APPLIED',reason:error.message,retained_revision:0,retained_ir_sha256:sha256(JSON.stringify(parsed.value)),requires_review:true,cancelled:signal?.aborted===true};
   write(dir,'revision-outcome.json',revisionOutcome);write(dir,'retained-candidate-ir.json',parsed.value);write(dir,'retained-audit.json',reviewed.value);
   onProgress({stage:'VALIDATING',revision:1,signal:'REVISION_NOT_APPLIED'});
  }
  }
 }
 }
 resourceGuard();if(sha256(selectedBundle('parse').sha256+selectedBundle('audit').sha256)!==fingerprint)throw Error('METHOD_CHANGED_DURING_RUN');
 onProgress({stage:'COMPILING',revision});
 const completed=await finishDirectIR(parsed.value,technical,revisionOutcome);
 if(llmCalculation){
  await attachLLMCalculation(completed,parsed.value,llmCalculation,reviewed.value,evidenceOptions);
  write(output,'llm-boundary-calculation.json',llmCalculation);write(output,'calculation-verification.json',completed.boundary_calculations);write(output,'program-boundary-calculations.json',completed.program_boundary_calculations);
 }
 write(output,'final-audit-binding.json',{ir_sha256:sha256(JSON.stringify(parsed.value)),audit_sha256:sha256(JSON.stringify(reviewed.value)),parse_session:parsed.receipt.thread_id,audit_session:reviewed.receipt.thread_id,revision_outcome:revisionOutcome});
 const {canonical,chinese,boundary_calculations,problem_report}=completed;technical=completed.technical;
 write(dir,'7plus1.json',canonical);write(dir,'boundary-ir.json',parsed.value);onProgress({stage:'COMPILING',revision,kind:'COMPILE_READY',signal:'COMPILE_READY'});
 onProgress({stage:'CALCULATING',revision});onProgress({stage:'CALCULATING',revision,kind:'CALCULATION_READY',signal:'CALCULATION_READY'});
 const model_resource_digests=[...new Map([...parse.resources,...audit.resources].map(r=>[r.path,{path:r.path,sha256:r.sha256}])).values(),{path:'contracts/candidate-ir-v1/schema.mjs',sha256:sha256(fs.readFileSync(new URL('./contracts/candidate-ir-v1/schema.mjs',import.meta.url)))}];
 const final={format:'boundx-direct-ir-trace/1',pipeline:llmCalculation?'LLM_IR_AND_BOUNDARY_CALCULATION':'LLM_DIRECT_CANDIDATE_IR',product_snapshot:productSnapshot,model_resource_digests,source,proposal:parsed.value,ir:parsed.value,audit:reviewed.value,technical,canonical,chinese,boundary_calculations,problem_report,...(llmCalculation?{llm_boundary_calculation:llmCalculation,program_boundary_calculations:completed.program_boundary_calculations}:{}),...(completed.kernel_core?{kernel_core:completed.kernel_core}:{}),model_calls:{parse:parsed.attempts,audit:reviewed.attempts},revision,revision_outcome:revisionOutcome,parse_method:parseMethod,resource_profile:parse.resource_profile,request_profile:parse.request_profile,ir_origin:revisionOutcome?.status==='APPLIED_AND_REVIEWED'?'LLM_BOUNDED_PATCH_PRESERVING_FIRST_RESPONSE':'LLM_RESPONSE_UNCHANGED',input_ir_sha256:sha256(JSON.stringify(parsed.value)),business_decision:null,execution_authorization:null};
 if(completed.kernel_core){write(output,'core.json',completed.kernel_core.core);write(output,'source-map.json',completed.kernel_core.source_map);}
 write(output,'problem-report.json',problem_report);
 final.incomplete_model_requests=incompleteModelRequests;write(output,'incomplete-model-requests.json',incompleteModelRequests);
 for(const [name,value]of Object.entries({'trace.json':final,'7plus1.json':canonical,'boundary-calculations.json':boundary_calculations,'candidate-ir.json':parsed.value}))write(output,name,value);
 fs.writeFileSync(path.join(output,'7plus1.zh.md'),final.chinese);
 write(output,'run-summary.json',{parse_method:parseMethod,resource_profile:parse.resource_profile,real_calls:parsed.attempts.length+reviewed.attempts.length,requested_model:model,actual_model:null,requested_reasoning:reasoning,revision_count:revision,pipeline:final.pipeline,source_sha256:source.sha256,slot_status:Object.fromEntries(Object.entries(canonical.slots).map(([k,v])=>[k,v.status])),semantic_acceptance_is_not_proven:true});return final;
}
