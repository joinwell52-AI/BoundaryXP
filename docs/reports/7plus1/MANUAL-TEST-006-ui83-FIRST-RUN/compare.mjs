import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {compileCore} from 'file:///D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/src/bxp/ir-kernel/index.mjs';
import {evaluateCore} from 'file:///D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/src/bxp/ir-kernel/evaluate.mjs';
import {queryCore} from 'file:///D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/src/bxp/ir-kernel/queries.mjs';

const runId='969d1b6c-2d57-465a-90d3-37854fd3ca96';
const run='D:/boundx/.boundx/short-compiler-031-r1/data/runs/'+runId;
const out=path.dirname(fileURLToPath(import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(path.join(run,f),'utf8'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const files=['source.txt','candidate-ir.json','core.json','trace.json','selected-resources.json','boundary-calculations.json','revision-0/candidate-ir.json','revision-0/audit.json','revision-1/patch.json','revision-1/revision-outcome.json'];
const before=Object.fromEntries(files.map(f=>[f,hash(path.join(run,f))]));
const ir=read('candidate-ir.json'),trace=read('trace.json'),record=read('run.json'),bc=read('boundary-calculations.json');
const compiled=compileCore(ir),core=compiled.core;
const key=(id,event)=>JSON.stringify([id,event]);
const checks=[];
const evaluate=(id,ctx={})=>evaluateCore(core,{kind:'EXPRESSION',id},ctx);
const push=(name,actual,expected,scope='LOCAL_EXPRESSION')=>checks.push({name,scope,actual,expected,matched:JSON.stringify(actual)===JSON.stringify(expected)});
const unknown={unknown:true};
const value=(v,t)=>({value:v,established_at:String(t),unit:'second'});
function outcomes(d,o){
 const states={};
 for(const [letter,event,result,t] of [['d','check_d',d,120],['o','check_o',o,180]]){
  states[key('formed_'+letter,event)]=result==='UNKNOWN'?{value:false}:value(true,t);
  if(result!=='UNKNOWN'){
   states[key('pass_'+letter,event)]=value(result==='PASS',t);
   states[key('fail_'+letter,event)]=value(result==='FAIL',t);
  }
 }
 return states;
}
const truthRows=[];
for(const d of ['PASS','FAIL','UNKNOWN'])for(const o of ['PASS','FAIL','UNKNOWN']){
 const states=outcomes(d,o),ctx={states};
 const ready=d!=='UNKNOWN'&&o!=='UNKNOWN';
 const expectedAccept=ready&&(d==='PASS'||o==='PASS');
 const expectedReject=ready&&d==='FAIL'&&o==='FAIL';
 truthRows.push({d,o,ready,expected_accept_branch:expectedAccept,expected_reject_branch:expectedReject,actual_accept_applicability:evaluate('any_pass',ctx),actual_reject_applicability:evaluate('both_fail',ctx),note:'Applicability is not an event-start readiness gate; unknown receipt/observation values are not source ambiguity.'});
}
push('inclusive-OR-PASS-PASS',evaluate('any_pass',{states:outcomes('PASS','PASS')}),true);
push('explicit-failure-FAIL-FAIL',evaluate('both_fail',{states:outcomes('FAIL','FAIL')}),true);
push('accept-applicability-PASS-UNKNOWN-not-gated',evaluate('any_pass',{states:outcomes('PASS','UNKNOWN')}),true,'IR_OMISSION_REPRODUCTION');
push('reject-applicability-UNKNOWN-not-fabricated-failure',evaluate('both_fail',{states:outcomes('UNKNOWN','FAIL')}),unknown);
push('duration-closed-seconds',evaluate('duration_domain'),{interval:['0','1080']});
push('duration-zero-included',evaluate('duration_limit',{variables:{duration:{number:'0'}}}),true);
push('duration-18minutes-included',evaluate('duration_limit',{variables:{duration:{number:'1080'}}}),true);
push('duration-over18-rejected',evaluate('duration_limit',{variables:{duration:{number:'1080.6'}}}),false);
push('receipt-ADMIN-same-file',evaluate('received_complete',{variables:{file:{object:'accept'}},receipts:[{receiver:'admin',artifact:'accept',delivery:'deliver',complete:true}]}),true);
push('receipt-other-file-not-accepted',evaluate('received_complete',{variables:{file:{object:'accept'}},receipts:[{receiver:'admin',artifact:'reject',delivery:'deliver',complete:true}]}),unknown);
push('known-false-QA-with-no-established-time',evaluate('review_at_deliver',{states:{[key('review_pass','review')]:{value:false}},event_values:{deliver:{start:'600',end:'720',occurred:true,unit:'second'}}}),false,'CONSUMER_DEFECT_CHECK');

function plan(d='PASS',o='FAIL',file='accept',early=false,incomplete=false,wrongReview=false){
 const windows={organize:[0,0],read_d:[0,60],read_o:[0,60],check_d:[60,120],check_o:[60,180],select:[240,240],generate:early?[60,90]:[240,360],review:[420,540],deliver:[600,720]};
 const events=ir.events.filter(e=>e.kind==='ACTION').map(e=>{
  let roles=structuredClone(e.roles).map(r=>r.value.kind==='VARIABLE'?{...r,value:{kind:'ENTITY',id:file}}:r);
  if(wrongReview&&e.id==='review')roles=roles.map(r=>r.role==='OBJECT'?{...r,value:{kind:'ENTITY',id:file==='accept'?'reject':'accept'}}:r);
  roles.push({role:'ENVIRONMENT',value:{kind:'ENTITY',id:'test'}});
  return {id:e.id,task_id:'task',operation:e.operation,occurred:true,completed:e.id==='generate'&&incomplete?false:true,succeeded:false,start:String(windows[e.id][0]),end:String(windows[e.id][1]),unit:'second',roles};
 });
 events.push({id:'task',task_id:'task',operation:'OTHER',occurred:true,completed:true,succeeded:false,start:'0',end:'720',unit:'second',roles:[...structuredClone(ir.events.find(e=>e.id==='task').roles),{role:'ENVIRONMENT',value:{kind:'ENTITY',id:'test'}}]});
 return {
  kind:'SAT',plan:{events,external_inputs:{task:['data']},completeness:{kind:'EXACT_SNAPSHOT',task_id:'task',basis:'AUTHOR_CONSTRUCTED_FINITE_DIAGNOSTIC_QUERY_NOT_SOURCE_FACT_OR_BUSINESS_OBSERVATION'}},
  variables:{file:{object:file},duration:{number:'720'}},
  states:{...outcomes(d,o),[key('review_pass','review')]:value(true,540),[key('task_complete','task')]:value(true,720)},
  receipts:[{receiver:'admin',artifact:file,delivery:'deliver',complete:true,any:true}]
 };
}
const solver=[];
for(const [name,q,reference,expected] of [
 ['W1-accept-PASS-FAIL',plan(), 'MATCHES_CONSTRUCTED_REFERENCE_ARRANGEMENT','SAT'],
 ['W2-reject-FAIL-FAIL',plan('FAIL','FAIL','reject'), 'MATCHES_CONSTRUCTED_REFERENCE_ARRANGEMENT','SAT'],
 ['early-generation-before-results',plan('PASS','FAIL','accept',true), 'VIOLATES_SOURCE_RESULT_READY_GATE','UNSAT'],
 ['generation-not-completed',plan('PASS','FAIL','accept',false,true), 'GENERATION_COMPLETION_NOT_PROVEN_BY_STARTED_COUNT','UNSAT'],
 ['QA-reviews-other-branch-file',plan('PASS','FAIL','accept',false,false,true), 'VIOLATES_SOURCE_SAME_FILE_AND_TASK_FIXED_ROLE_BINDING','UNSAT_OR_IDENTITY_DIAGNOSTIC']
]){
 const result=await queryCore(compiled,q,{timeoutMs:10000});
 solver.push({name,scope:'EXPLICIT_FINITE_DIAGNOSTIC_QUERY_NOT_PRODUCTION_GLOBAL_RESULT',reference,expected,result:result.result,compile_status:result.compile_status,verification:result.verification,diagnostics:result.diagnostics??[],model_check:result.model_check??null,query:q});
}
const incompletePlan=plan('PASS','FAIL','accept',false,true).plan;
push('started-counter-1-despite-uncompleted-generation',evaluate('branch_create_count',{plan:incompletePlan,variables:{file:{object:'accept'}}}),{number:'1'},'QUANTITY_TARGET_DEFECT_REPRODUCTION');
const calls=Object.entries(trace.model_calls).flatMap(([phase,a])=>a.map((c,index)=>({phase,index,elapsed_ms:c.elapsed_ms,thread_id:c.thread_id,schema_ok:c.schema_check?.ok,observed_internal_retries:c.observed_internal_retries,usage:c.usage,actual_model:c.actual_model})));
const total=Date.parse(record.ended_at)-Date.parse(record.created_at);
const after=Object.fromEntries(files.map(f=>[f,hash(path.join(run,f))]));
const evidence={format:'boundx-case-comparison-evidence/1',run_id:runId,created_at:new Date().toISOString(),new_model_calls:0,source_matches_standard:hash(path.join(run,'source.txt'))===hash('D:/boundx/docs/testing/7plus1/MANUAL-TEST-006.txt'),original_run_unchanged:JSON.stringify(before)===JSON.stringify(after),hashes:before,standard:{txt_sha256:hash('D:/boundx/docs/testing/7plus1/MANUAL-TEST-006.txt'),md_sha256:hash('D:/boundx/docs/testing/7plus1/MANUAL-TEST-006.md')},version:trace.product_snapshot.product_version,contract:ir.contract_version,node_counts:Object.fromEntries(['entities','variables','events','states','expressions','requirements'].map(k=>[k,ir[k].length])),calls,timing:{total_ms:total,parse_and_patch_ms:calls.filter(x=>x.phase==='parse').reduce((n,x)=>n+x.elapsed_ms,0),audit_ms:calls.filter(x=>x.phase==='audit').reduce((n,x)=>n+x.elapsed_ms,0),local_residual_ms:total-calls.reduce((n,x)=>n+x.elapsed_ms,0)},audit:trace.audit,revision:trace.revision_outcome,technical:{ok:trace.technical.technical_ok,errors:trace.technical.errors,reviewed_rows:trace.technical.rows.filter(x=>x.status!=='UNRESOLVED').length,row_count:trace.technical.rows.length},production_result:{status:bc.status,result:bc.result,calculation_performed:bc.calculation_performed,diagnostics:bc.diagnostics.filter(x=>x.layer==='CAPABILITY')},truth_rows:truthRows,checks,finite_diagnostics:solver,limitations:['No model requests or original artifact changes.','Finite query snapshot is an explicit constructed diagnostic assumption, not a closure derived from source text.','Diagnostic SAT does not establish complete source representation; source-violating SAT is a defect witness.','Known false gate test is an additional local consumer check, not the cause of the production OPEN_EVENT_DOMAIN result.']};
fs.writeFileSync(path.join(out,'EVIDENCE.json'),JSON.stringify(evidence,null,2)+'\n','utf8');
console.log(JSON.stringify({output:path.join(out,'EVIDENCE.json'),new_model_calls:0,original_run_unchanged:evidence.original_run_unchanged,source_matches_standard:evidence.source_matches_standard,timing:evidence.timing,checks:checks.length,mismatches:checks.filter(x=>!x.matched),finite_diagnostics:solver.map(s=>({name:s.name,result:s.result,verification:s.verification,expected:s.expected,diagnostics:s.diagnostics}))}));
