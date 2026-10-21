import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
import {replay7Plus1} from '../../../../research/7plus1-parser/llm-first-028/engine.mjs';
import {compileCore} from '../../../../src/bxp/ir-kernel/index.mjs';import {queryCore} from '../../../../src/bxp/ir-kernel/queries.mjs';
import {directIRKernelBundle} from '../../../../research/7plus1-parser/llm-first-028/direct-ir-kernel-resources.mjs';
const out=path.dirname(fileURLToPath(import.meta.url)),runtime='D:/boundx/.boundx/short-compiler-031-r1/data/runs';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),rows=[];
for(const [caseId,runId]of [['006','969d1b6c-2d57-465a-90d3-37854fd3ca96'],['008','8491302a-1c65-4774-b691-19159ad459a4'],['010','95ac87f2-0bcf-4504-86ee-6191cbd78afa']]){
 const dir=path.join(runtime,runId),before=Object.fromEntries(['source.txt','candidate-ir.json','trace.json'].map(f=>[f,hash(path.join(dir,f))]));
 const result=await replay7Plus1(fs.readFileSync(path.join(dir,'source.txt')),{output:path.join(out,'replays',caseId),replayFrom:dir,allowPriorModelResources:true});
 const c=result.boundary_calculations;rows.push({case_id:caseId,run_id:runId,original_hashes:before,original_unchanged:Object.entries(before).every(([f,h])=>hash(path.join(dir,f))===h),candidate_ir_unchanged:hash(path.join(dir,'candidate-ir.json'))===hash(path.join(out,'replays',caseId,'candidate-ir.json')),real_model_calls:0,technical_ok:result.technical.technical_ok,technical_errors:result.technical.errors,audit_status:result.technical.audit_status,result:c.result,status:c.status,calculation_performed:c.calculation_performed,full_query:c.full_query,parts:(c.parts??[]).map(p=>({result:p.result,verification:p.verification,requirements:p.query_scope.requirements,conflict_core:p.conflict_core,scope:p.query_scope})),model_validation_scope:result.model_validation_scope});
}
const original=JSON.parse(fs.readFileSync(path.join(out,'../MANUAL-TEST-006-ui83-FIRST-RUN/EVIDENCE.json'),'utf8'));
const query=original.finite_diagnostics.find(x=>x.name==='QA-reviews-other-branch-file').query;
const raw=JSON.parse(fs.readFileSync(path.join(runtime,'969d1b6c-2d57-465a-90d3-37854fd3ca96/candidate-ir.json'),'utf8'));
const fixed=await queryCore(compileCore(raw),query);
const resourceComparison=['parse','audit'].map(phase=>{const old=JSON.parse(fs.readFileSync(path.join(runtime,'95ac87f2-0bcf-4504-86ee-6191cbd78afa/revision-0',phase+'-call/request-0.json'),'utf8'));const current=directIRKernelBundle(phase);return {phase,current_bundle_sha256:current.sha256,current_inline_characters:[...current.text].length,prior_request_prompt_characters:old.prompt_characters,current_resources:current.resources.map(({text,...x})=>x)};});
const evidence={format:'boundx-ir-kernel-repair-replay/1',date:'2026-10-13',real_model_calls:0,rows,role_binding_counterexample:{prior:'SAT',current:fixed.result,verification:fixed.verification,diagnostics:fixed.diagnostics,conflict_core:fixed.conflict_core},resourceComparison,new_resources_live_validation:'NOT_RUN'};
fs.writeFileSync(path.join(out,'REPLAY-RESULTS.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify({rows:rows.map(r=>({case:r.case_id,technical_ok:r.technical_ok,errors:r.technical_errors.map(e=>e.code),result:r.result,parts:r.parts.map(p=>p.result),unchanged:r.original_unchanged&&r.candidate_ir_unchanged})),role_binding_counterexample:evidence.role_binding_counterexample,new_model_calls:0}));
