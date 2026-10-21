// Delivery verification only; invokes the frozen CLI without changing method.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {ROOT,REPORT,read,save,sha} from './util.mjs';
const freeze=read(REPORT+'/METHOD-FREEZE.json');
const run=read(REPORT+'/runs/'+(freeze.selected_policy==='policy-v2'?'development-policy-v2':'development-v1-recovered')+'/RESULTS.json');
const rows=[];
for(const corpus of ['root','natural','exposed200']){
 const first=run.rows.find(r=>r.corpus===corpus&&r.trace);
 const target=REPORT+'/cli-verification/'+corpus+'-replay.json';
 const start=Date.now();
 execFileSync(process.execPath,[ROOT+'/cli-selected.mjs','parse-boundary',first.trace,'--provider','replay','--json',target],{windowsHide:true,stdio:'pipe'});
 const original=read(first.trace),actual=read(target);
 rows.push({corpus,id:first.id,input_trace:first.trace,output_trace:target,input_sha256:sha(fs.readFileSync(first.trace)),output_sha256:sha(fs.readFileSync(target)),exit_code:0,elapsed_ms:Date.now()-start,complete_trace_identical:JSON.stringify(original)===JSON.stringify(actual),canonical_identical:JSON.stringify(original.canonical_7plus1)===JSON.stringify(actual.canonical_7plus1),source_sha256_identical:original.source.sha256===actual.source.sha256,new_model_calls:0});
}
save(REPORT+'/CLI-VERIFICATION.json',{status:rows.every(r=>r.complete_trace_identical&&r.canonical_identical&&r.source_sha256_identical)?'PASS':'FAIL',selected_policy:freeze.selected_policy,rows,provider_live_execution_proof:'Actual two-call provider receipts from development and locked batch use the same parseBoundary implementation. This verification measures deterministic recorded-output replay, not fresh model-output reproducibility.'});
console.log(JSON.stringify({status:rows.every(r=>r.complete_trace_identical)?'PASS':'FAIL',rows:rows.length}));
if(rows.some(r=>!r.complete_trace_identical))process.exitCode=1;
