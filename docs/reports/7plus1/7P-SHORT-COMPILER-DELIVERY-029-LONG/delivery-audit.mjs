import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const report=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(report,'../../../..');
const rel=p=>path.relative(repo,p).replaceAll('\\','/');
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(name,v)=>fs.writeFileSync(path.join(report,name),JSON.stringify(v,null,2)+'\n');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const ids=[...Array.from({length:13},(_,i)=>'S'+String(i).padStart(2,'0')),...Array.from({length:10},(_,i)=>'T'+String(i+1).padStart(2,'0'))];
const all=read(path.join(report,'delivery-final/RESULTS.json'));
assert.equal(all.length,23);assert(all.every(x=>x.end_to_end));
const rows=ids.map(id=>{
 const final=path.join(report,'delivery-final',id),raw=path.join(report,'final',id,'run');
 const canonical=read(path.join(final,'7plus1.json')),trace=read(path.join(final,'trace.json'));
 const source=fs.readFileSync(path.join(report,'inputs',id+'.txt'));
 assert.equal(hash(source),trace.source.sha256);assert(source.equals(fs.readFileSync(path.join(raw,'source.txt'))));assert(source.equals(fs.readFileSync(path.join(final,'source.txt'))));
 const original=read(path.join(raw,'trace.json'));assert.deepEqual(trace.proposal,original.proposal);assert.deepEqual(trace.audit,original.audit);
 assert.equal(canonical.business_decision,null);assert.equal(canonical.execution_authorization,null);
 const result=all.find(x=>x.id===id);
 return {id,source_sha256:trace.source.sha256,codepoints:trace.source.codepoints,semantic_acceptance:result.end_to_end,slot_status:Object.fromEntries(Object.entries(canonical.slots).map(([k,v])=>[k,v.status])),unresolved_count:canonical.unresolved.length,gap_count:canonical.gaps.length,
  source:rel(path.join(report,'inputs',id+'.txt')),raw_run:rel(raw),raw_candidate:rel(path.join(raw,'revision-0/proposal.json')),raw_audit:rel(path.join(raw,'revision-0/audit.json')),final_candidate:rel(path.join(final,'proposal.json')),final_audit:rel(path.join(final,'audit.json')),technical:rel(path.join(final,'technical-validation.json')),ir:rel(path.join(final,'boundary-ir.json')),canonical:rel(path.join(final,'7plus1.json')),chinese:rel(path.join(final,'7plus1.zh.md')),full_trace:rel(path.join(final,'trace.json')),assertions:rel(path.join(final,'evaluation.json'))};
});
write('CASE-RESULTS.json',{scope:'23 predeclared visible short sources; not blind accuracy',contract:'028-r02.3',compiler_revision:'029-c4',total:23,pass:23,rows});
fs.writeFileSync(path.join(report,'CASE-MATRIX.md'),'# Final short-source matrix\n\nAll rows passed source-declared semantic assertions; unresolved is not failure by itself.\n\n| Case | I | O | A | P | R | V | C | B | Assertion |\n|---|---|---|---|---|---|---|---|---|---|\n'+rows.map(r=>'| '+[r.id,...['I','O','A','P','R','V','C','B'].map(k=>r.slot_status[k]),'PASS'].join(' | ')+' |').join('\n')+'\n');
const real=[{phase:'first',id:'S00',dir:path.join(report,'browser/S00/run')},...Array.from({length:10},(_,i)=>({phase:'first',id:'T'+String(i+1).padStart(2,'0'),dir:path.join(report,'first','T'+String(i+1).padStart(2,'0'),'run')})),...ids.map(id=>({phase:'final',id,dir:path.join(report,'final',id,'run')})),...['repeat-1','repeat-2'].flatMap(phase=>['S00','T05','T09'].map(id=>({phase,id,dir:path.join(report,phase,id,'run')}))),{phase:'cancelled-excluded',id:null,dir:path.join(report,'actual-cancel')}];
const calls=[],runs=[],threads=new Set();
for(const run of real){
 const receipts=walk(run.dir).filter(p=>/receipt-\d+\.json$/.test(p));let elapsed=0;
 for(const p of receipts){const r=read(p),request=read(p.replace(/receipt-(\d+)\.json$/,'request-$1.json'));
  if(r.thread_id){assert(!threads.has(r.thread_id),'duplicate actual session');threads.add(r.thread_id);}
  assert.equal(r.exit_confirmed,true);assert.equal(r.tool_events?.length??0,0);assert.equal(request.skill_mode,'INLINE_BUNDLE');assert.equal(r.skill_content_delivered,true);
  elapsed+=r.elapsed_ms;
  calls.push({phase:run.phase,id:run.id,receipt:rel(p),request:rel(p.replace(/receipt-(\d+)\.json$/,'request-$1.json')),thread_id:r.thread_id??null,exit_code:r.exit_code,cancelled:r.cancelled,exit_confirmed:r.exit_confirmed,elapsed_ms:r.elapsed_ms,usage:r.usage??null,tool_events:r.tool_events,requested_model:request.requested_model,requested_reasoning:request.requested_reasoning,actual_model:r.actual_model??null,cli_version:request.cli_version,binary_sha256:request.binary_sha256,bundle_sha256:request.bundle_sha256,resources:request.resources});
 }
 runs.push({phase:run.phase,id:run.id,path:rel(run.dir),calls:receipts.length,model_elapsed_ms:elapsed});
}
const completed=runs.filter(r=>r.phase!=='cancelled-excluded'),times=completed.map(r=>r.model_elapsed_ms).sort((a,b)=>a-b);
const usage={};for(const c of calls)for(const [k,v] of Object.entries(c.usage??{}))usage[k]=(usage[k]??0)+v;
write('CALL-PERFORMANCE-AUDIT.json',{started_calls:calls.length,completed_success_calls:calls.filter(c=>c.exit_code===0).length,cancelled_calls:calls.filter(c=>c.cancelled).length,completed_runs:completed.length,all_started_calls_counted:true,replay_calls:0,native_skill_loading:'NOT_VERIFIED',actual_model:null,cost:null,cancellation_cloud_billing_stop:null,reported_usage_total:usage,small_sample_model_time_seconds:{min:times[0]/1000,median:times[Math.floor(times.length/2)]/1000,max:times.at(-1)/1000},runs,calls});
const snapshot=read(path.join(repo,'.boundx/experiments/029/pre-sync/snapshot.json'));
const protectedRows=snapshot.tracked.map(x=>({...x,current_exists:fs.existsSync(path.join(repo,x.file)),current_sha256:fs.existsSync(path.join(repo,x.file))?hash(fs.readFileSync(path.join(repo,x.file))):null}));
assert(protectedRows.every(x=>x.exists===x.current_exists&&x.sha256===x.current_sha256));
write('LOCAL-PRESERVATION.json',{base_head:snapshot.head,protected_tracked_count:protectedRows.length,unchanged:true,rows:protectedRows});
write('LOCAL-REGRESSION-SOURCES.json',{existing_untracked_sources_not_modified_or_submitted:['tests/local-task-entrypoints.test.mjs','tests/ui-module-routes.test.mjs'].map(p=>({path:p,sha256:hash(fs.readFileSync(path.join(repo,p)))})),reason:'Original local product entrypoint tests used read-only; their stdout and results are included, not unrelated pre-existing source files.'});
const frozen=read(path.join(report,'METHOD-FROZEN-FULL.json'));
assert(frozen.resources.every(x=>hash(fs.readFileSync(path.join(repo,'research/7plus1-parser/llm-first-028',x.path)))===x.sha256));
const coreLog=fs.readFileSync(path.join(report,'engineering-delivery/core-delivery.txt'),'utf8'),entryLog=fs.readFileSync(path.join(report,'engineering-delivery/unaffected-product-entrypoints.txt'),'utf8');
const counts=t=>({tests:Number(t.match(/(?:#|ℹ) tests (\d+)/)?.[1]),pass:Number(t.match(/(?:#|ℹ) pass (\d+)/)?.[1]),fail:Number(t.match(/(?:#|ℹ) fail (\d+)/)?.[1])});
const engineering={core:counts(coreLog),shared_entrypoints:counts(entryLog),groups:read(path.join(report,'engineering-delivery/RESULTS.json')),shared_consumer:read(path.join(report,'shared-consumer/RESULTS.json'))};
assert.equal(engineering.core.fail+engineering.shared_entrypoints.fail,0);assert(engineering.groups.every(g=>g.exit_code===0));
write('TESTS.json',{SHORT_COMPILER_029:'PASS',LOCAL_SHORT_COMPILER_READY:true,BUSINESS_EXECUTION_ENABLED:false,PRODUCTION_READY:false,WAITING_ADMIN_REVIEW:true,semantic:{distinct_sources:23,pass:23,fail:0,mode:'REAL_CODEX_CANDIDATES_WITH_STRICT_SAME_BUNDLE_DETERMINISTIC_RECOMPILATION'},repeatability:read(path.join(report,'REPEATABILITY.json')),engineering,strict_source_and_bundle_gates_enabled:true,protected_local_changes:protectedRows.length,method_runtime_digest_unchanged:true});
console.log(JSON.stringify({cases:rows.length,started_calls:calls.length,successful_calls:calls.filter(c=>c.exit_code===0).length,cancelled:calls.filter(c=>c.cancelled).length,engineering,model_seconds:{min:times[0]/1000,median:times[Math.floor(times.length/2)]/1000,max:times.at(-1)/1000},protected:protectedRows.length}));
