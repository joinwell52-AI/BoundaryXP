import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {compileCore} from 'file:///D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/src/bxp/ir-kernel/index.mjs';
import {evaluateCore} from 'file:///D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/src/bxp/ir-kernel/evaluate.mjs';
import {queryCore} from 'file:///D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/src/bxp/ir-kernel/queries.mjs';

const runId='8491302a-1c65-4774-b691-19159ad459a4';
const run=path.join('D:/boundx/.boundx/short-compiler-031-r1/data/runs',runId);
const out=path.dirname(fileURLToPath(import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(run,name),'utf8'));
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const files=['source.txt','candidate-ir.json','core.json','trace.json','selected-resources.json','boundary-calculations.json','revision-0/candidate-ir.json','revision-0/audit.json','revision-1/independent-audit.json','revision-1/patch-changes.json'];
const before=Object.fromEntries(files.map(f=>[f,hash(path.join(run,f))]));
const ir=read('candidate-ir.json'),trace=read('trace.json'),runtime=read('boundary-calculations.json');
const compiled=compileCore(ir),checks=[];
function check(name,actual,expected,scope){checks.push({name,scope,actual,expected,matched:JSON.stringify(actual)===JSON.stringify(expected)});}
function evalExpr(id,context={}){return evaluateCore(compiled.core,{kind:'EXPRESSION',id},context);}
const event=(start,end)=>({occurred:true,completed:true,start:String(start),end:String(end),unit:'second'});
const events=(d,o)=>({event_values:{dev_diagnosis:event(...d),ops_diagnosis:event(...o)}});
check('exact-minute-0.5',evalExpr('n05'),{number:'30'},'local-expression');
check('exact-minute-0.75',evalExpr('n075'),{number:'45'},'local-expression');
check('DEV-closed-domain',evalExpr('dev_duration_domain'),{interval:['30','45']},'local-expression');
check('OPS-closed-domain',evalExpr('ops_duration_domain'),{interval:['20','40']},'local-expression');
check('nonoverlap-DEV-first-touching',evalExpr('nonoverlap',events([0,30],[30,50])),true,'synthetic-local-observation');
check('nonoverlap-OPS-first-touching',evalExpr('nonoverlap',events([20,50],[0,20])),true,'synthetic-local-observation');
check('nonoverlap-overlap-rejected',evalExpr('nonoverlap',events([0,30],[20,40])),false,'synthetic-local-observation');
check('execution-sum-upper-included',evalExpr('execution_sum_limit',{variables:{dev_duration:{number:'45'},ops_duration:{number:'25'}}}),true,'synthetic-local-observation');
check('execution-sum-71-rejected',evalExpr('execution_sum_limit',{variables:{dev_duration:{number:'45'},ops_duration:{number:'26'}}}),false,'synthetic-local-observation');
check('total-60-included',evalExpr('total_duration_bounds',{variables:{total_duration:{number:'60'}}}),true,'synthetic-local-observation');
check('total-120-excluded',evalExpr('total_duration_bounds',{variables:{total_duration:{number:'120'}}}),false,'synthetic-local-observation');
check('generation-time-matched',evalExpr('dev_report_generation_time',{event_values:{dev_diagnosis:event(0,30),dev_report_create:event(30,30)}}),true,'synthetic-local-observation');
check('generation-time-mismatch',evalExpr('dev_report_generation_time',{event_values:{dev_diagnosis:event(0,30),dev_report_create:event(30,31)}}),false,'synthetic-local-observation');
const correctReceipts=[{receiver:'admin',artifact:'dev_report',delivery:'deliver',complete:true},{receiver:'admin',artifact:'ops_report',delivery:'deliver',complete:true}];
check('actual-IR-correct-DEV-receipt-does-not-match',evalExpr('received_dev_report',{receipts:correctReceipts}),{unknown:true},'defect-reproduction');
check('actual-IR-correct-OPS-receipt-does-not-match',evalExpr('received_ops_report',{receipts:correctReceipts}),{unknown:true},'defect-reproduction');
check('actual-IR-reversed-DEV-receipt-matches',evalExpr('received_dev_report',{receipts:[{receiver:'dev_report',artifact:'admin',delivery:'deliver',complete:true}]}),true,'defect-reproduction');
check('actual-IR-reversed-OPS-receipt-matches',evalExpr('received_ops_report',{receipts:[{receiver:'ops_report',artifact:'admin',delivery:'deliver',complete:true}]}),true,'defect-reproduction');

// This is explicitly a subset diagnostic, not the production whole-case query.
// The original IR and all requirements remain unchanged. No domain is closed.
const subset=['dev_required','ops_required','delivery_required','dev_time','ops_time','execution_sum','slot_nonoverlap','task_total_time','delivery_necessary_gate'];
const solver=[];
for(const [name,variables,expected] of [
 ['numeric-temporal-subset',{},'SAT'],
 ['numeric-temporal-subset-total120',{total_duration:{number:'120'}},'UNSAT'],
 ['numeric-temporal-subset-sum71',{dev_duration:{number:'45'},ops_duration:{number:'26'}},'UNSAT']
]){
 const result=await queryCore(compiled,{kind:'SAT',requirements:subset,variables},{timeoutMs:10000});
 solver.push({name,scope:'EXPLICIT_REQUIREMENT_SUBSET_NOT_WHOLE_CASE',requirements:subset,variables,expected,result:result.result,verification:result.verification,compile_status:result.compile_status,diagnostics:result.diagnostics??[],model_check:result.model_check??null});
}
const firstAudit=read('revision-0/audit.json'),finalAudit=read('revision-1/independent-audit.json');
const calls=Object.entries(trace.model_calls).flatMap(([phase,items])=>items.map((c,index)=>({phase,index,elapsed_ms:c.elapsed_ms,thread_id:c.thread_id,schema_ok:c.schema_check?.ok,observed_internal_retries:c.observed_internal_retries,conservative_request_count:c.conservative_request_count,usage:c.usage,actual_model:c.actual_model})));
const after=Object.fromEntries(files.map(f=>[f,hash(path.join(run,f))]));
const report={format:'boundx-case-comparison-evidence/1',run_id:runId,created_at:new Date().toISOString(),new_model_calls:0,original_run_unchanged:JSON.stringify(before)===JSON.stringify(after),source_matches_standard:hash(path.join(run,'source.txt'))===hash('D:/boundx/docs/testing/7plus1/MANUAL-TEST-008.txt'),hashes:before,standard:{txt_sha256:hash('D:/boundx/docs/testing/7plus1/MANUAL-TEST-008.txt'),md_sha256:hash('D:/boundx/docs/testing/7plus1/MANUAL-TEST-008.md')},version:trace.product_snapshot.product_version,contract:ir.contract_version,node_counts:Object.fromEntries(['entities','variables','events','states','expressions','requirements'].map(k=>[k,ir[k].length])),calls,audits:{first:{review_count:firstAudit.reviews.length,verdicts:[...new Set(firstAudit.reviews.map(r=>r.verdict))],omissions:firstAudit.omissions,issues:firstAudit.issues},final:{review_count:finalAudit.reviews.length,issues:finalAudit.issues}},production_result:{status:runtime.status,result:runtime.result,calculation_performed:runtime.calculation_performed,diagnostics:runtime.diagnostics.filter(d=>d.layer==='CAPABILITY')},checks,subset_solver:solver,limitations:['Synthetic observations are comparison inputs, not business execution evidence.','Local expressions and subset SAT do not prove the original text is fully represented.','The production global query was NOT_RUN; offline subset results do not replace it.','No actual skill/schema/compiler resources or original test artifacts were changed.']};
fs.writeFileSync(path.join(out,'EVIDENCE.json'),JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify({output:path.join(out,'EVIDENCE.json'),source_matches_standard:report.source_matches_standard,original_run_unchanged:report.original_run_unchanged,new_model_calls:0,checks:checks.length,matched:checks.filter(c=>c.matched).length,subset_solver:solver.map(s=>({name:s.name,result:s.result,verification:s.verification,expected:s.expected}))}));
