import fs from 'node:fs';import path from 'node:path';
import {prepareSource,sha256} from './source.mjs';import {callCodex,probeCodex} from './provider.mjs';import {modelSignal} from './observability.mjs';
import {directIRBundle} from './direct-ir-bundle.mjs';import {acceptCandidateIR} from './direct-ir-accept.mjs';import {projectDirectIR} from './direct-ir-view.mjs';import {calculateDirectIR} from './direct-ir-calculate.mjs';
const write=(dir,name,value)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(value,null,2)+'\n');
export async function parseDirectIR(bytes,{output,probe,model='gpt-6.1-sol',reasoning='medium',signal,onProgress=()=>{},timeoutMs=null,call=callCodex,maxModelRequests=2,resourceGuard=()=>{},productSnapshot=null}={}){
 if(!output)throw Error('OUTPUT_DIRECTORY_REQUIRED');if(!Number.isSafeInteger(maxModelRequests)||maxModelRequests<2)throw Error('MODEL_REQUEST_BUDGET_EXHAUSTED');
 fs.mkdirSync(output,{recursive:true});if(fs.existsSync(path.join(output,'source.txt')))throw Error('OUTPUT_ALREADY_EXISTS');
 resourceGuard();signal?.throwIfAborted();const source=prepareSource(bytes);fs.writeFileSync(path.join(output,'source.txt'),bytes);write(output,'source.json',source);
 onProgress({stage:'PREPARING',revision:0});probe??=probeCodex();write(output,'environment.json',probe);
 const parse=directIRBundle('parse'),audit=directIRBundle('audit'),fingerprint=sha256(parse.sha256+audit.sha256),requestBudget={remaining:maxModelRequests};
 write(output,'selected-resources.json',{parse_method:'SKILL',request_profile:'DIRECT_CANDIDATE_IR_R01',resources:{parse:parse.resources.map(({text,...r})=>r),audit:audit.resources.map(({text,...r})=>r)},sha256:fingerprint});
 const dir=path.join(output,'revision-0');fs.mkdirSync(dir);
 const telemetry=phase=>({onEvent:event=>{const s=modelSignal(event);if(s)onProgress({stage:phase==='parse'?'PARSING':'AUDITING',phase,revision:0,...s});},onActivity:p=>onProgress({stage:phase==='parse'?'PARSING':'AUDITING',phase,revision:0,...p})});
 onProgress({stage:'PARSING',revision:0});const parsed=await call({bundle:parse,source,directory:path.join(dir,'parse-call'),probe,model,reasoning,signal,timeoutMs,requestBudget,...telemetry('parse')});
 write(dir,'proposal.json',parsed.value);write(dir,'candidate-ir.json',parsed.value);onProgress({stage:'PARSING',revision:0,kind:'PARSE_READY',signal:'PARSE_READY'});
 resourceGuard();signal?.throwIfAborted();onProgress({stage:'AUDITING',revision:0});const reviewed=await call({bundle:audit,source,candidate:parsed.value,directory:path.join(dir,'audit-call'),probe,model,reasoning,signal,timeoutMs,requestBudget,...telemetry('audit')});
 if(!parsed.receipt.thread_id||!reviewed.receipt.thread_id||parsed.receipt.thread_id===reviewed.receipt.thread_id)throw Error('AUDIT_SESSION_NOT_INDEPENDENT');
 write(dir,'audit.json',reviewed.value);onProgress({stage:'AUDITING',revision:0,kind:'AUDIT_READY',signal:'AUDIT_READY'});resourceGuard();
 if(sha256(directIRBundle('parse').sha256+directIRBundle('audit').sha256)!==fingerprint)throw Error('METHOD_CHANGED_DURING_RUN');
 onProgress({stage:'VALIDATING',revision:0});const technical=acceptCandidateIR(parsed.value,reviewed.value,source);write(dir,'technical-validation.json',technical);onProgress({stage:'VALIDATING',revision:0,kind:'TECHNICAL_READY',signal:'TECHNICAL_READY'});
 if(!technical.technical_ok)throw Error('DIRECT_IR_TECHNICAL_REJECTED');
 onProgress({stage:'COMPILING',revision:0});const {canonical,chinese}=projectDirectIR(parsed.value,technical);write(dir,'7plus1.json',canonical);write(dir,'boundary-ir.json',parsed.value);onProgress({stage:'COMPILING',revision:0,kind:'COMPILE_READY',signal:'COMPILE_READY'});
 onProgress({stage:'CALCULATING',revision:0});const boundary_calculations=calculateDirectIR(parsed.value,technical);onProgress({stage:'CALCULATING',revision:0,kind:'CALCULATION_READY',signal:'CALCULATION_READY'});
 const final={format:'boundx-direct-ir-trace/1',pipeline:'LLM_DIRECT_CANDIDATE_IR',product_snapshot:productSnapshot,source,proposal:parsed.value,ir:parsed.value,audit:reviewed.value,technical,canonical,chinese:chinese+'\n## 边界计算\n\n'+boundary_calculations.status+'；联合求解：'+boundary_calculations.joint.base.result+'。\n',boundary_calculations,model_calls:{parse:parsed.attempts,audit:reviewed.attempts},revision:0,parse_method:'SKILL',request_profile:'DIRECT_CANDIDATE_IR_R01',ir_origin:'LLM_RESPONSE_UNCHANGED',input_ir_sha256:sha256(JSON.stringify(parsed.value)),business_decision:null,execution_authorization:null};
 for(const [name,value]of Object.entries({'trace.json':final,'7plus1.json':canonical,'boundary-calculations.json':boundary_calculations,'candidate-ir.json':parsed.value}))write(output,name,value);
 fs.writeFileSync(path.join(output,'7plus1.zh.md'),final.chinese);
 write(output,'run-summary.json',{real_calls:parsed.attempts.length+reviewed.attempts.length,requested_model:model,actual_model:null,requested_reasoning:reasoning,revision_count:0,pipeline:final.pipeline,source_sha256:source.sha256,slot_status:Object.fromEntries(Object.entries(canonical.slots).map(([k,v])=>[k,v.status])),semantic_acceptance_is_not_proven:true});return final;
}
