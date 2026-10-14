import fs from 'node:fs';
import path from 'node:path';
import {prepareSource,sha256} from './source.mjs';
import {buildBundle} from './bundle.mjs';
import {bundleEvidence} from './comparison-bundle.mjs';
import {probeCodex,callCodex} from './provider.mjs';
import {technicalValidate} from './validate.mjs';
import {compileBoundary} from './compile.mjs';
import {calculateBoundary,renderCalculations} from './calculus.mjs';
import {implementationInventory,runtimeInventory} from './evidence.mjs';
import {technicalRevisionFeedback,auditBindingRevisionFeedback} from './revision.mjs';
import {modelSignal} from './observability.mjs';
import {parseDirectIR} from './direct-ir-engine.mjs';
import {finishDirectIR} from './direct-ir-result.mjs';
import {acceptCandidateIR} from './direct-ir-accept.mjs';
import {calculateDirectIR} from './direct-ir-calculate.mjs';
import {projectDirectIR} from './direct-ir-view.mjs';
import {directIRBundle} from './direct-ir-bundle.mjs';
import {renderDirectCalculations} from './direct-ir-render-results.mjs';
import {attachLLMCalculation} from './boundary-calculation.mjs';
export const writeJSON=(file,data)=>fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
export const compilerRevision='llm-boundary-r03-test';
export function replay7Plus1(bytes,{output,replayFrom,resourceGuard=()=>{},productSnapshot=null,allowPriorModelResources=false}){
 resourceGuard();
 const source=prepareSource(bytes),tracePath=path.join(replayFrom,fs.existsSync(path.join(replayFrom,'trace.json'))?'trace.json':'TRACE.json');
 const prior=JSON.parse(fs.readFileSync(tracePath,'utf8'));
 if(prior.source.sha256!==source.sha256)throw Error('REPLAY_SOURCE_DIGEST_MISMATCH');
 if(prior.ir?.contract_version==='candidate-ir/2.0')return replayKernelIR(prior,source,bytes,{output,tracePath,resourceGuard,productSnapshot,allowPriorModelResources});
 if(prior.ir?.format==='boundx-candidate-ir/1'){
  const frozen=new Map((prior.model_resource_digests??prior.product_snapshot?.files??[]).map(f=>[f.path,f.sha256]));
  const prefix='research/7plus1-parser/llm-first-028/';
  const resources=[...directIRBundle('parse',{parseMethod:prior.parse_method??'SKILL'}).resources,...directIRBundle('audit',{parseMethod:prior.parse_method??'SKILL'}).resources];
  const modelResourceChanges=[];
  for(const resource of resources){const original=frozen.get(prefix+resource.path)??frozen.get(resource.path);if(!original)throw Error('REPLAY_RESOURCE_EVIDENCE_MISSING:'+resource.path);if(original!==resource.sha256){if(!allowPriorModelResources||!(resource.path.startsWith('skills/')||resource.path.startsWith('skill-profiles/')||resource.path.endsWith('/CONTRACT.md')||resource.path.endsWith('/operator-registry.json')))throw Error('REPLAY_SKILL_BUNDLE_CHANGED:'+resource.path);modelResourceChanges.push({path:resource.path,original_sha256:original,current_sha256:resource.sha256});}}
  for(const name of ['schema.mjs','candidate-ir.schema.json','candidate-ir-audit.schema.json']){const file='contracts/candidate-ir-v1/'+name;if((frozen.get(prefix+file)??frozen.get(file))!==sha256(fs.readFileSync(new URL(file,import.meta.url))))throw Error('REPLAY_SCHEMA_CHANGED:'+file);}
  const completed=finishDirectIR(prior.ir,acceptCandidateIR(prior.ir,prior.audit,source),prior.revision_outcome);
  const {technical,boundary_calculations:calculation,problem_report}=completed,projected=completed;
  fs.mkdirSync(output,{recursive:true});if(fs.existsSync(path.join(output,'source.txt')))throw Error('OUTPUT_ALREADY_EXISTS');
  fs.writeFileSync(path.join(output,'source.txt'),bytes,{flag:'wx'});
  const replay={...prior,product_snapshot:productSnapshot,model_origin_product_snapshot:prior.product_snapshot??null,consumer_revision:compilerRevision,technical,canonical:projected.canonical,chinese:projected.chinese,problem_report,boundary_calculations:calculation,execution_mode:'FROZEN_RESPONSE_REPLAY',origin_trace:{sha256:sha256(fs.readFileSync(tracePath))},real_calls_in_this_replay:0,not_new_model_validation:true,model_resource_changes:modelResourceChanges,model_validation_scope:modelResourceChanges.length?'PRIOR_MODEL_RESOURCES_RESPONSES_CURRENT_CONSUMER_ONLY':'UNCHANGED_MODEL_RESOURCES_RESPONSES_CURRENT_CONSUMER_ONLY'};
  writeJSON(path.join(output,'problem-report.json'),problem_report);
  for(const [file,data]of Object.entries({'trace.json':replay,'candidate-ir.json':prior.ir,'audit.json':prior.audit,'technical-validation.json':technical,'7plus1.json':projected.canonical,'boundary-calculations.json':calculation,'run-summary.json':{execution_mode:replay.execution_mode,real_calls:0,consumer_revision:compilerRevision,source_sha256:source.sha256}}))writeJSON(path.join(output,file),data);
  fs.writeFileSync(path.join(output,'7plus1.zh.md'),replay.chinese);resourceGuard();return replay;
 }
 for(const phase of ['parse','audit']){
  const request=JSON.parse(fs.readFileSync(path.join(replayFrom,`revision-${prior.revision}`,`${phase}-call`,'request-0.json'),'utf8'));
  const bundle=buildBundle(phase,{parseMethod:prior.parse_method??null});
  if(request.bundle_sha256!==bundle.sha256)throw Error('REPLAY_SKILL_BUNDLE_CHANGED');
 }
 fs.mkdirSync(output,{recursive:true});
 if(fs.existsSync(path.join(output,'source.txt')))throw Error('OUTPUT_ALREADY_EXISTS');
 fs.writeFileSync(path.join(output,'source.txt'),bytes);writeJSON(path.join(output,'source.json'),source);writeJSON(path.join(output,'implementation.json'),implementationInventory());
 const technical=technicalValidate(source,prior.proposal,prior.audit,{requireSourceAudit:true});
 const compiled=compileBoundary(source,prior.proposal,prior.audit,technical);
 const boundary_calculations=calculateBoundary(compiled.ir),chinese=compiled.chinese+renderCalculations(boundary_calculations);
 const replay={...(prior.parse_method?{parse_method:prior.parse_method}:{}),product_snapshot:productSnapshot,model_origin_product_snapshot:prior.product_snapshot??null,consumer_revision:compilerRevision,source,proposal:prior.proposal,audit:prior.audit,technical,...compiled,chinese,boundary_calculations,model_calls:prior.model_calls,revision:prior.revision,execution_mode:'FROZEN_RESPONSE_REPLAY',origin_trace:{path:path.resolve(tracePath),sha256:sha256(fs.readFileSync(tracePath))},real_calls_in_this_replay:0};
 for(const [file,data] of Object.entries({'proposal.json':replay.proposal,'audit.json':replay.audit,'technical-validation.json':technical,'boundary-ir.json':compiled.ir,'7plus1.json':compiled.canonical,'boundary-calculations.json':boundary_calculations,'trace.json':replay}))writeJSON(path.join(output,file),data);
 fs.writeFileSync(path.join(output,'7plus1.zh.md'),chinese);
 writeJSON(path.join(output,'run-summary.json'),{execution_mode:replay.execution_mode,real_calls:0,replays:1,origin_trace:replay.origin_trace,slot_status:Object.fromEntries(Object.entries(compiled.canonical.slots).map(([k,v])=>[k,v.status]))});
 resourceGuard();return replay;
}
async function replayKernelIR(prior,source,bytes,{output,tracePath,resourceGuard,productSnapshot,allowPriorModelResources}){
 const frozen=new Map((prior.model_resource_digests??[]).map(r=>[r.path,r.sha256]));
 const current=[...directIRBundle('parse',{parseMethod:prior.parse_method??'SKILL',contractVersion:'candidate-ir/2.0'}).resources,...directIRBundle('audit',{parseMethod:prior.parse_method??'SKILL',contractVersion:'candidate-ir/2.0'}).resources];
 const changes=[];
 for(const r of current){const matching=frozen.has(r.path)?r.path:r.path.includes('SKILL.md#')?[...frozen.keys()].find(p=>p.startsWith(r.path.split('#')[0]+'#')):r.path.endsWith('/CONTRACT.md')?[...frozen.keys()].find(p=>p.endsWith('/CONTRACT.md')||p.endsWith('/SEMANTICS.md')):null;const previous=matching?frozen.get(matching):null;
  if(previous!==r.sha256){if(!allowPriorModelResources)throw Error('REPLAY_SKILL_BUNDLE_CHANGED:'+r.path);changes.push({path:r.path,original_path:matching,original_sha256:previous,current_sha256:r.sha256});}
 }
 const technical=acceptCandidateIR(prior.ir,prior.audit,source),completed=await finishDirectIR(prior.ir,technical,prior.revision_outcome);
 if(prior.llm_boundary_calculation)await attachLLMCalculation(completed,prior.ir,prior.llm_boundary_calculation,prior.audit,{requireWire:prior.request_profile==='LLM_BOUNDARY_CALCULATION_R02'});
 const replay={...prior,...completed,product_snapshot:productSnapshot,model_origin_product_snapshot:prior.product_snapshot??null,consumer_revision:compilerRevision,execution_mode:'FROZEN_RESPONSE_REPLAY',origin_trace:{sha256:sha256(fs.readFileSync(tracePath))},real_calls_in_this_replay:0,not_new_model_validation:true,model_resource_changes:changes,model_validation_scope:'PRIOR_MODEL_RESOURCES_RESPONSES_CURRENT_CONSUMER_ONLY'};
 fs.mkdirSync(output,{recursive:true});if(fs.existsSync(path.join(output,'source.txt')))throw Error('OUTPUT_ALREADY_EXISTS');fs.writeFileSync(path.join(output,'source.txt'),bytes,{flag:'wx'});
 for(const [file,value]of Object.entries({'trace.json':replay,'candidate-ir.json':prior.ir,'audit.json':prior.audit,'technical-validation.json':completed.technical,'7plus1.json':completed.canonical,'boundary-calculations.json':completed.boundary_calculations,'problem-report.json':completed.problem_report}))writeJSON(path.join(output,file),value);
 fs.writeFileSync(path.join(output,'7plus1.zh.md'),replay.chinese);resourceGuard();return replay;
}
export async function parse7Plus1(bytes,{output,probe,model='gpt-6.1-sol',reasoning='medium',parseMethod=null,semanticRevision=true,signal,onProgress=()=>{},timeoutMs=null,call=callCodex,maxModelRequests,resourceGuard=()=>{},productSnapshot=null}={}){
 return parseDirectIR(bytes,{output,probe,model,reasoning,parseMethod,signal,onProgress,timeoutMs,call,maxModelRequests,resourceGuard,productSnapshot});
}
// Historical frozen-response route only. Not a runtime fallback.
export async function parseLegacy7Plus1(bytes,{output,probe,model='gpt-6.1-sol',reasoning='medium',parseMethod=null,semanticRevision=true,signal,onProgress=()=>{},timeoutMs=null,call=callCodex,maxModelRequests,resourceGuard=()=>{},productSnapshot=null}={}){
 if(parseMethod==='MD')throw Error('MD_COMPARISON_STOPPED');
 if(!output)throw Error('OUTPUT_DIRECTORY_REQUIRED');
 fs.mkdirSync(output,{recursive:true});
 if(fs.existsSync(path.join(output,'source.txt')))throw Error('OUTPUT_ALREADY_EXISTS: first results are never overwritten');
 resourceGuard();const source=prepareSource(bytes);signal?.throwIfAborted();
 if(maxModelRequests!==undefined&&(!Number.isSafeInteger(maxModelRequests)||maxModelRequests<0))throw Error('INVALID_MODEL_REQUEST_BUDGET');
 const requestBudget=maxModelRequests===undefined?null:{remaining:maxModelRequests};
 onProgress({stage:'PREPARING'});probe??=probeCodex();
 fs.writeFileSync(path.join(output,'source.txt'),bytes);writeJSON(path.join(output,'source.json'),source);writeJSON(path.join(output,'environment.json'),probe);writeJSON(path.join(output,'implementation.json'),implementationInventory());
 const parse=buildBundle('parse',{parseMethod}),auditBundle=buildBundle('audit',{parseMethod});
 const methodEvidence={parse_method:'SKILL',resource_profile:parse.resource_profile,request_profile:parse.request_profile,transport_version:parse.transport_version,selected_resources:{parse:bundleEvidence(parse),audit:bundleEvidence(auditBundle)}};
 writeJSON(path.join(output,'selected-resources.json'),methodEvidence);
 const lockedRuntime=JSON.stringify(runtimeInventory());
 const passes=[];
 const revisionAttempts=[];
 let previous=null,issues=null;
 for(let revision=0;revision<(semanticRevision?2:1);revision++){
  const directory=path.join(output,`revision-${revision}`);fs.mkdirSync(directory);
  signal?.throwIfAborted();onProgress({stage:'PARSING',revision});
  const telemetry=phase=>({onEvent:event=>{const s=modelSignal(event);if(s)onProgress({stage:phase==='parse'?'PARSING':'AUDITING',revision,phase,...s});},onActivity:p=>onProgress({stage:phase==='parse'?'PARSING':'AUDITING',revision,phase,...p})});
  resourceGuard();const parsed=await call({bundle:parse,source,candidate:previous,revisionIssues:issues,directory:path.join(directory,'parse-call'),probe,model,reasoning,signal,timeoutMs,requestBudget,...telemetry('parse')});
  if(parsed.patch_value){writeJSON(path.join(directory,'revision.patch.json'),parsed.patch_value);revisionAttempts.push({revision,receipt:parsed.receipt,attempts:parsed.attempts,no_change:parsed.no_change});}
  if(parsed.no_change){
   if(!previous||JSON.stringify(parsed.value)!==JSON.stringify(previous)||!passes.length)throw Error('REVISION_NO_CHANGE_IDENTITY_MISMATCH');
   writeJSON(path.join(directory,'revision-no-change.json'),{status:'NO_SAFE_CHANGE',original_revision:passes.at(-1).revision,audit_reused_from_original_unchanged_candidate:true,original_parse_thread:passes.at(-1).model_calls.parse[0].thread_id,original_audit_thread:passes.at(-1).model_calls.audit[0].thread_id,normalization:parsed.normalization,semantic_acceptance_unchanged:true});
   onProgress({stage:'COMPILING',revision,signal:'REVISION_NO_CHANGE',kind:'REVISION_NO_CHANGE'});break;
  }
  writeJSON(path.join(directory,'proposal.json'),parsed.value);
  if(parsed.normalization?.identity?.renames.length)onProgress({stage:'PARSING',revision,kind:'IDENTITY_NORMALIZED',signal:'IDENTITY_NORMALIZED',renamed_nodes:parsed.normalization.identity.renames.length,ambiguous_references:parsed.normalization.identity.unresolved.length});
  if(parsed.wire_value){writeJSON(path.join(directory,'proposal.wire.json'),parsed.wire_value);writeJSON(path.join(directory,'proposal-mechanical-expansion.json'),parsed.normalization);}
  onProgress({stage:'PARSING',revision,kind:'PARSE_READY',signal:'PARSE_READY'});
  signal?.throwIfAborted();onProgress({stage:'AUDITING',revision});
  resourceGuard();const reviewed=await call({bundle:auditBundle,source,candidate:parsed.value,candidateIdentity:parsed.normalization?.identity??null,directory:path.join(directory,'audit-call'),probe,model,reasoning,signal,timeoutMs,requestBudget,...telemetry('audit')});
  resourceGuard();if(JSON.stringify(runtimeInventory())!==lockedRuntime)throw Error('METHOD_CHANGED_DURING_RUN');
  if(parsed.receipt.thread_id===reviewed.receipt.thread_id)throw Error('AUDIT_SESSION_NOT_INDEPENDENT');
  writeJSON(path.join(directory,'audit.json'),reviewed.value);
  if(reviewed.wire_value){writeJSON(path.join(directory,'audit.wire.json'),reviewed.wire_value);writeJSON(path.join(directory,'audit-mechanical-expansion.json'),reviewed.normalization);}
  onProgress({stage:'AUDITING',revision,kind:'AUDIT_READY',signal:'AUDIT_READY'});
  signal?.throwIfAborted();onProgress({stage:'VALIDATING',revision});
  const technical=technicalValidate(source,parsed.value,reviewed.value,{requireSourceAudit:true});writeJSON(path.join(directory,'technical-validation.json'),technical);
  onProgress({stage:'VALIDATING',revision,kind:'TECHNICAL_READY',signal:'TECHNICAL_READY'});
  onProgress({stage:'COMPILING',revision});
  const compiled=compileBoundary(source,parsed.value,reviewed.value,technical);writeJSON(path.join(directory,'boundary-ir.json'),compiled.ir);writeJSON(path.join(directory,'7plus1.json'),compiled.canonical);fs.writeFileSync(path.join(directory,'7plus1.zh.md'),compiled.chinese);
  onProgress({stage:'COMPILING',revision,kind:'COMPILE_READY',signal:'COMPILE_READY'});
  const trace={product_snapshot:productSnapshot,...methodEvidence,source,proposal:parsed.value,audit:reviewed.value,technical,...compiled,...(parsed.normalization?.identity?.renames.length?{identity:parsed.normalization.identity}:{}),model_calls:{parse:parsed.attempts,audit:reviewed.attempts},revision,revision_of:revision?0:null};writeJSON(path.join(directory,'trace.json'),trace);passes.push(trace);
  const contradictory=reviewed.value.reviews.filter(r=>r.verdict==='CONTRADICT');
  const technicalIssues=technicalRevisionFeedback(technical,parsed.value,parsed.normalization?.identity);
  const bindingIssues=auditBindingRevisionFeedback(technical,parsed.value,reviewed.value);
  if(!semanticRevision||revision===1||(!contradictory.length&&!reviewed.value.omissions.length&&!technicalIssues.length&&!bindingIssues.length))break;
  onProgress({stage:'COMPILING',revision,kind:'REVISION_REQUIRED',signal:'REVISION_REQUIRED'});
  previous=parsed.value;issues={reviews:contradictory,issues:reviewed.value.issues,omissions:reviewed.value.omissions,technical_errors:technicalIssues,mechanical_identity:parsed.normalization?.identity??null,binding_errors:bindingIssues,budget:{semantic_revisions_remaining:1,shared_with_audit:true}};writeJSON(path.join(directory,'revision-request.json'),issues);
 }
 onProgress({stage:'CALCULATING',revision:passes.at(-1).revision});
 const final={...passes.at(-1),...(revisionAttempts.length?{revision_attempts:revisionAttempts}:{})};
 final.boundary_calculations=calculateBoundary(final.ir);final.chinese+=renderCalculations(final.boundary_calculations);
 writeJSON(path.join(output,'boundary-calculations.json'),final.boundary_calculations);
 writeJSON(path.join(output,'mathematical-results.json'),final.boundary_calculations.mathematical_results);
 onProgress({stage:'CALCULATING',revision:final.revision,kind:'CALCULATION_READY',signal:'CALCULATION_READY'});
 writeJSON(path.join(output,'trace.json'),final);writeJSON(path.join(output,'7plus1.json'),final.canonical);fs.writeFileSync(path.join(output,'7plus1.zh.md'),final.chinese);
 const summary={...methodEvidence,source_sha256:source.sha256,revision:final.revision,real_calls:passes.reduce((n,p)=>n+p.model_calls.parse.length+p.model_calls.audit.length,0)+revisionAttempts.filter(r=>r.no_change).reduce((n,r)=>n+r.attempts.length,0),revision_count:passes.length-1,revision_attempt_count:revisionAttempts.length,no_change_revision_count:revisionAttempts.filter(r=>r.no_change).length,skill_mode:'INLINE_BUNDLE',native_skill_loading:'NOT_VERIFIED',actual_model:null,requested_model:model,requested_reasoning:reasoning,slot_status:Object.fromEntries(Object.entries(final.canonical.slots).map(([k,v])=>[k,v.status])),technical_acceptance_is_semantic_proof:false};writeJSON(path.join(output,'run-summary.json'),summary);
 return final;
}




