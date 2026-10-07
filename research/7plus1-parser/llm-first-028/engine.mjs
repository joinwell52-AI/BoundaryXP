import fs from 'node:fs';
import path from 'node:path';
import {prepareSource,sha256} from './source.mjs';
import {buildBundle} from './bundle.mjs';
import {probeCodex,callCodex} from './provider.mjs';
import {technicalValidate} from './validate.mjs';
import {compileBoundary} from './compile.mjs';
import {implementationInventory,runtimeInventory} from './evidence.mjs';
import {technicalRevisionFeedback,auditBindingRevisionFeedback} from './revision.mjs';
export const writeJSON=(file,data)=>fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
export const compilerRevision='031-r1-c3';
export function replay7Plus1(bytes,{output,replayFrom}){
 const source=prepareSource(bytes),tracePath=path.join(replayFrom,'trace.json');
 const prior=JSON.parse(fs.readFileSync(tracePath,'utf8'));
 if(prior.source.sha256!==source.sha256)throw Error('REPLAY_SOURCE_DIGEST_MISMATCH');
 for(const phase of ['parse','audit']){
  const request=JSON.parse(fs.readFileSync(path.join(replayFrom,`revision-${prior.revision}`,`${phase}-call`,'request-0.json'),'utf8'));
  const bundle=buildBundle(phase);
  if(request.bundle_sha256!==bundle.sha256)throw Error('REPLAY_SKILL_BUNDLE_CHANGED');
 }
 fs.mkdirSync(output,{recursive:true});
 if(fs.existsSync(path.join(output,'source.txt')))throw Error('OUTPUT_ALREADY_EXISTS');
 fs.writeFileSync(path.join(output,'source.txt'),bytes);writeJSON(path.join(output,'source.json'),source);writeJSON(path.join(output,'implementation.json'),implementationInventory());
 const technical=technicalValidate(source,prior.proposal,prior.audit);
 const compiled=compileBoundary(source,prior.proposal,prior.audit,technical);
 const replay={source,proposal:prior.proposal,audit:prior.audit,technical,...compiled,model_calls:prior.model_calls,revision:prior.revision,execution_mode:'FROZEN_RESPONSE_REPLAY',origin_trace:{path:path.resolve(tracePath),sha256:sha256(fs.readFileSync(tracePath))},real_calls_in_this_replay:0};
 for(const [file,data] of Object.entries({'proposal.json':replay.proposal,'audit.json':replay.audit,'technical-validation.json':technical,'boundary-ir.json':compiled.ir,'7plus1.json':compiled.canonical,'trace.json':replay}))writeJSON(path.join(output,file),data);
 fs.writeFileSync(path.join(output,'7plus1.zh.md'),compiled.chinese);
 writeJSON(path.join(output,'run-summary.json'),{execution_mode:replay.execution_mode,real_calls:0,replays:1,origin_trace:replay.origin_trace,slot_status:Object.fromEntries(Object.entries(compiled.canonical.slots).map(([k,v])=>[k,v.status]))});
 return replay;
}
export async function parse7Plus1(bytes,{output,probe,model='gpt-6.1-sol',reasoning='medium',semanticRevision=true,signal,onProgress=()=>{},timeoutMs=300000,call=callCodex,maxModelRequests,resourceGuard=()=>{},productSnapshot=null}={}){
 if(!output)throw Error('OUTPUT_DIRECTORY_REQUIRED');
 fs.mkdirSync(output,{recursive:true});
 if(fs.existsSync(path.join(output,'source.txt')))throw Error('OUTPUT_ALREADY_EXISTS: first results are never overwritten');
 resourceGuard();const source=prepareSource(bytes);signal?.throwIfAborted();
 if(maxModelRequests!==undefined&&(!Number.isSafeInteger(maxModelRequests)||maxModelRequests<0))throw Error('INVALID_MODEL_REQUEST_BUDGET');
 const requestBudget=maxModelRequests===undefined?null:{remaining:maxModelRequests};
 onProgress({stage:'PREPARING'});probe??=probeCodex();
 fs.writeFileSync(path.join(output,'source.txt'),bytes);writeJSON(path.join(output,'source.json'),source);writeJSON(path.join(output,'environment.json'),probe);writeJSON(path.join(output,'implementation.json'),implementationInventory());
 const parse=buildBundle('parse'),auditBundle=buildBundle('audit');
 const lockedRuntime=JSON.stringify(runtimeInventory());
 const passes=[];
 let previous=null,issues=null;
 for(let revision=0;revision<(semanticRevision?2:1);revision++){
  const directory=path.join(output,`revision-${revision}`);fs.mkdirSync(directory);
  signal?.throwIfAborted();onProgress({stage:'PARSING',revision});
  resourceGuard();const parsed=await call({bundle:parse,source,candidate:previous,revisionIssues:issues,directory:path.join(directory,'parse-call'),probe,model,reasoning,signal,timeoutMs,requestBudget});
  writeJSON(path.join(directory,'proposal.json'),parsed.value);
  signal?.throwIfAborted();onProgress({stage:'AUDITING',revision});
  resourceGuard();const reviewed=await call({bundle:auditBundle,source,candidate:parsed.value,directory:path.join(directory,'audit-call'),probe,model,reasoning,signal,timeoutMs,requestBudget});
  resourceGuard();if(JSON.stringify(runtimeInventory())!==lockedRuntime)throw Error('METHOD_CHANGED_DURING_RUN');
  if(parsed.receipt.thread_id===reviewed.receipt.thread_id)throw Error('AUDIT_SESSION_NOT_INDEPENDENT');
  writeJSON(path.join(directory,'audit.json'),reviewed.value);
  signal?.throwIfAborted();onProgress({stage:'VALIDATING',revision});
  const technical=technicalValidate(source,parsed.value,reviewed.value);writeJSON(path.join(directory,'technical-validation.json'),technical);
  onProgress({stage:'COMPILING',revision});
  const compiled=compileBoundary(source,parsed.value,reviewed.value,technical);writeJSON(path.join(directory,'boundary-ir.json'),compiled.ir);writeJSON(path.join(directory,'7plus1.json'),compiled.canonical);fs.writeFileSync(path.join(directory,'7plus1.zh.md'),compiled.chinese);
  const trace={product_snapshot:productSnapshot,source,proposal:parsed.value,audit:reviewed.value,technical,...compiled,model_calls:{parse:parsed.attempts,audit:reviewed.attempts},revision,revision_of:revision?0:null};writeJSON(path.join(directory,'trace.json'),trace);passes.push(trace);
  const contradictory=reviewed.value.reviews.filter(r=>r.verdict==='CONTRADICT');
  const technicalIssues=technicalRevisionFeedback(technical,parsed.value);
  const bindingIssues=auditBindingRevisionFeedback(technical,parsed.value,reviewed.value);
  if(!semanticRevision||revision===1||(!contradictory.length&&!reviewed.value.omissions.length&&!technicalIssues.length&&!bindingIssues.length))break;
  previous=parsed.value;issues={reviews:contradictory,issues:reviewed.value.issues,omissions:reviewed.value.omissions,technical_errors:technicalIssues,binding_errors:bindingIssues,budget:{semantic_revisions_remaining:1,shared_with_audit:true}};writeJSON(path.join(directory,'revision-request.json'),issues);
 }
 const final=passes.at(-1);writeJSON(path.join(output,'trace.json'),final);writeJSON(path.join(output,'7plus1.json'),final.canonical);fs.writeFileSync(path.join(output,'7plus1.zh.md'),final.chinese);
 const summary={source_sha256:source.sha256,revision:final.revision,real_calls:passes.reduce((n,p)=>n+p.model_calls.parse.length+p.model_calls.audit.length,0),revision_count:passes.length-1,skill_mode:'INLINE_BUNDLE',native_skill_loading:'NOT_VERIFIED',actual_model:null,requested_model:model,slot_status:Object.fromEntries(Object.entries(final.canonical.slots).map(([k,v])=>[k,v.status])),technical_acceptance_is_semantic_proof:false};writeJSON(path.join(output,'run-summary.json'),summary);
 return final;
}




