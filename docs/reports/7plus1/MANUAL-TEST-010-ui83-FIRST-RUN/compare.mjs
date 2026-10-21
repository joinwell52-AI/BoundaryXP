import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {compileCore} from 'file:///D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/src/bxp/ir-kernel/index.mjs';
import {evaluateCore} from 'file:///D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/src/bxp/ir-kernel/evaluate.mjs';
import {queryCore} from 'file:///D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/src/bxp/ir-kernel/queries.mjs';

const runId='95ac87f2-0bcf-4504-86ee-6191cbd78afa';
const run='D:/boundx/.boundx/short-compiler-031-r1/data/runs/'+runId;
const out=path.dirname(fileURLToPath(import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(path.join(run,f),'utf8'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const files=['source.txt','candidate-ir.json','core.json','trace.json','selected-resources.json','boundary-calculations.json','revision-0/audit.json','revision-1/patch.json','revision-1/revision-outcome.json'];
const before=Object.fromEntries(files.map(f=>[f,hash(path.join(run,f))]));
const ir=read('candidate-ir.json'),trace=read('trace.json'),record=read('run.json'),bc=read('boundary-calculations.json'),compiled=compileCore(ir);
const evalExpr=(id,context={})=>evaluateCore(compiled.core,{kind:'EXPRESSION',id},context);
const checks=[];
const check=(name,actual,expected,scope='LOCAL_EXPRESSION')=>checks.push({name,scope,actual,expected,matched:JSON.stringify(actual)===JSON.stringify(expected)});
check('input-domain-three',evalExpr('inputs'),{set:[{object:'x'},{object:'y'},{object:'z'}]});
check('duration-closed-seconds',evalExpr('duration_domain'),{interval:['300','600']});
check('same-file-two-reads-not-distinct',evalExpr('distinct',{variables:{a:{object:'x'},b:{object:'x'}}}),false);
check('different-files-distinct',evalExpr('distinct',{variables:{a:{object:'x'},b:{object:'y'}}}),true);
check('ADMIN-result-receipt',evalExpr('admin_received',{receipts:[{receiver:'admin',artifact:'result',delivery:'deliver',complete:true}]}),true);

// Instantiate the universal read ban only on the two source-required read events.
// This is an explicit diagnostic subset; it does not pretend the original task
// domain is closed. The domains of a,b and all original IR nodes stay unchanged.
const requiredReads=ir.events.filter(e=>['read_a','read_b'].includes(e.id)).map(e=>({id:e.id,task_id:'task',operation:'READ',occurred:true,completed:true,start:'0',end:'1',unit:'second'}));
const requirements=['r_distinct','r_read_a','r_read_b','r_read_ban'];
const query={kind:'SAT',requirements,plan:{events:requiredReads,completeness:{kind:'EXACT_SNAPSHOT',task_id:'task',basis:'EXPLICIT_DIAGNOSTIC_REQUIRED_READ_PROJECTION_NOT_SOURCE_CLOSURE'}}};
const conflict=await queryCore(compiled,query,{timeoutMs:10000});
const withoutDistinct=await queryCore(compiled,{...query,requirements:requirements.filter(id=>id!=='r_distinct')},{timeoutMs:10000});
const withoutBan=await queryCore(compiled,{...query,requirements:requirements.filter(id=>id!=='r_read_ban')},{timeoutMs:10000});
const duration=await queryCore(compiled,{kind:'SAT',requirements:['r_duration']},{timeoutMs:10000});
const assignments=[];
for(const a of evalExpr('inputs').set)for(const b of evalExpr('inputs').set){
 const context={plan:query.plan,variables:{a,b}};
 const distinct=evalExpr('distinct',context),ban=evalExpr('read_ban',context);
 assignments.push({a:a.object,b:b.object,distinct,ban,satisfied:distinct===true&&ban===true});
}

// Hypothetical, unperformed third read must not violate an occurrence prohibition.
const unused={id:'unused_third',task_id:'task',operation:'READ',occurred:false,completed:false,start:'0',end:'1',unit:'second',roles:[{role:'PERFORMER',value:{kind:'ENTITY',id:'dev'}},{role:'OBJECT',value:{kind:'ENTITY',id:'z'}}]};
const unusedPlan={events:[unused],completeness:{kind:'EXACT_SNAPSHOT',task_id:'task',basis:'LOCAL_NONOCCURRENCE_DIAGNOSTIC'}};
check('unperformed-third-read-should-not-violate',evalExpr('no_third',{plan:unusedPlan,variables:{a:{object:'x'},b:{object:'y'}}}),true,'OCCURRENCE_GUARD_DEFECT_CHECK');

const concise=r=>({result:r.result,compile_status:r.compile_status,verification:r.verification,diagnostics:r.diagnostics??[],conflict_core:r.conflict_core??[],smtlib:r.smtlib??null,assertion_map:r.assertion_map??null,model:r.model??null,model_check:r.model_check??null,problem:r.problem??null});
const calls=Object.entries(trace.model_calls).flatMap(([phase,a])=>a.map((c,index)=>({phase,index,elapsed_ms:c.elapsed_ms,thread_id:c.thread_id,schema_ok:c.schema_check?.ok,observed_internal_retries:c.observed_internal_retries,usage:c.usage,actual_model:c.actual_model})));
const total=Date.parse(record.ended_at)-Date.parse(record.created_at);
const after=Object.fromEntries(files.map(f=>[f,hash(path.join(run,f))]));
const submittedSchema=read('revision-0/audit-call/output-schema-0.json');
const evidence={format:'boundx-case-comparison-evidence/1',run_id:runId,created_at:new Date().toISOString(),new_model_calls:0,source_matches_standard:hash(path.join(run,'source.txt'))===hash('D:/boundx/docs/testing/7plus1/MANUAL-TEST-010.txt'),original_run_unchanged:JSON.stringify(before)===JSON.stringify(after),hashes:before,standard:{txt_sha256:hash('D:/boundx/docs/testing/7plus1/MANUAL-TEST-010.txt'),md_sha256:hash('D:/boundx/docs/testing/7plus1/MANUAL-TEST-010.md')},version:trace.product_snapshot.product_version,contract:ir.contract_version,calls,timing:{total_ms:total,parse_and_patch_ms:calls.filter(x=>x.phase==='parse').reduce((n,x)=>n+x.elapsed_ms,0),audit_ms:calls.filter(x=>x.phase==='audit').reduce((n,x)=>n+x.elapsed_ms,0),local_residual_ms:total-calls.reduce((n,x)=>n+x.elapsed_ms,0)},audit:trace.audit,submitted_audit_schema:{format:submittedSchema.properties.format,required:submittedSchema.required,server_schema_visibility:'NOT_DISCLOSED'},revision:trace.revision_outcome,technical:{ok:trace.technical.technical_ok,errors:trace.technical.errors,row_count:trace.technical.rows.length},production_result:{status:bc.status,result:bc.result,calculation_performed:bc.calculation_performed,diagnostics:bc.diagnostics.filter(x=>x.layer==='CAPABILITY')},checks,required_read_conflict:{query,result:concise(conflict),scope:'SOURCE_REQUIRED_READ_INSTANCES_ONLY',assignments,satisfying_assignment_count:assignments.filter(a=>a.satisfied).length,proof_limit:'Not a global minimal conflict core, not a declaration that the original domain is finite. All actor-general read-ban instances beyond these two remain unqueried.'},controls:{without_distinct:concise(withoutDistinct),without_ban:concise(withoutBan)},duration_requirement:concise(duration),limitations:['No model requests or original artifact changes.','Removing requirements is diagnostic only; it does not amend source text or overwrite production scoring.','The original runtime is PARTIAL/NOT_RUN even if a necessary subset yields UNSAT.','Expected finite set conflict is not the same as a generally unsupported query.']};
fs.writeFileSync(path.join(out,'EVIDENCE.json'),JSON.stringify(evidence,null,2)+'\n','utf8');
console.log(JSON.stringify({output:path.join(out,'EVIDENCE.json'),new_model_calls:0,original_run_unchanged:evidence.original_run_unchanged,source_matches_standard:evidence.source_matches_standard,timing:evidence.timing,required_read_conflict:{result:conflict.result,verification:conflict.verification,conflict_core:conflict.conflict_core,satisfying_assignments:assignments.filter(a=>a.satisfied).length},control_results:{without_distinct:withoutDistinct.result,without_ban:withoutBan.result},duration:{result:duration.result,diagnostics:duration.diagnostics},mismatches:checks.filter(x=>!x.matched)}));
