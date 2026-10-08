// Read-only HTTP/history and frozen-response verification. Never submits a valid parse request.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {pathToFileURL} from 'node:url';
import {installedPlan} from '../../../product/short-compiler/launch-installed.mjs';
import {report,write} from './prepare.mjs';
const plan=installedPlan(),prep=JSON.parse(fs.readFileSync(path.join(report,'PREPARE.json')));
const digest=b=>createHash('sha256').update(b).digest('hex');
const get=async route=>{const r=await fetch(plan.url+route,{signal:AbortSignal.timeout(10000)});assert.equal(r.status,200,route);return r;};
const staticFiles=[];
for(const [route,name] of [['','index.html'],['app.js','native-app.js'],['style.css','style.css']]){
 const r=await get(route),b=Buffer.from(await r.arrayBuffer()),p=path.join(plan.root,'research/7plus1-parser/v0.3-p2.1-generalization/web',name);
 assert.equal(digest(b),digest(fs.readFileSync(p)));staticFiles.push({route:plan.url+route,sha256:digest(b),matches_installed:true});
}
const sr=await get('api/session'),session=await sr.json(),cookie=sr.headers.get('set-cookie').split(';')[0];
assert.equal(session.product_snapshot.manifest_sha256,plan.snapshot.manifest_sha256);assert.equal(session.compiler_revision,'031-r1-c3');assert.equal(session.contract,'031-r1.1');
const {buildBundle}=await import(pathToFileURL(path.join(plan.root,'research/7plus1-parser/llm-first-028/bundle.mjs')));
const bundles=['parse','audit'].map(phase=>{const b=buildBundle(phase);return{phase,sha256:b.sha256,contract:b.schema.properties.contract_version.const,resources:b.resources.map(({path,sha256})=>({path,sha256}))};});
assert.ok(bundles.every(b=>b.contract===session.contract));
const before=await(await get('api/runs')).json(),current=before.filter(r=>r.status!=='LEGACY_READ_ONLY');assert.equal(current.length,prep.candidate_records);
assert.ok(current.every(r=>['COMPLETED','COMPLETED_WITH_UNRESOLVED','FAILED','CANCELLED','INTERRUPTED'].includes(r.status)));
const authHeaders={'content-type':'application/json','x-boundx-session':session.token,cookie,origin:plan.url.slice(0,-1)};
const gates=[];
for(const [name,headers,body,status,error] of [
 ['missing session',{'content-type':'application/json'},'{}',403,'SESSION_REQUIRED'],
 ['cross origin',{...authHeaders,origin:'https://foreign.invalid'},'{}',403,'SAME_ORIGIN_REQUIRED'],
 ['valid session, unsupported field',authHeaders,'{"output":"forbidden"}',400,'UNSUPPORTED_REQUEST_FIELD'],
 ['valid session, missing request id',authHeaders,'{}',400,'REQUEST_ID_REQUIRED'],
 ['valid session, wrong content type',{...authHeaders,'content-type':'text/plain'},'{}',415,'JSON_REQUIRED']
]){
 const r=await fetch(plan.url+'api/parse',{method:'POST',headers,body,signal:AbortSignal.timeout(10000)});const b=await r.json();assert.equal(r.status,status);assert.equal(b.error,error);gates.push({name,http_status:status,error,valid_parse:false});
}
const id='7228d06c-d9db-49fe-bcbd-44ea235cbeb9',raw=JSON.parse(fs.readFileSync(path.join(plan.config.data_dir,'runs',id,'trace.json')));
const loaded=await(await get('api/runs/'+id)).json();assert.deepEqual(loaded.result.canonical,raw.canonical);assert.equal(loaded.source_text,raw.source.text);
const exported=await(await get('api/runs/'+id+'/json')).json();assert.deepEqual(exported,raw.canonical);
const chinese=await(await get('api/runs/'+id+'/export')).text();assert.equal(chinese,raw.chinese);
const trace=await(await get('api/runs/'+id+'/trace.json')).json();assert.deepEqual(trace.proposal,raw.proposal);assert.deepEqual(trace.canonical,raw.canonical);assert.deepEqual(trace.ir,raw.ir);
const markdown=await(await get('api/runs/'+id+'/trace.md')).text();assert.ok(markdown.includes(raw.chinese)&&markdown.includes(raw.source.text));
const html=await(await get('api/runs/'+id+'/trace.html')).text();assert.ok(html.startsWith('<!doctype html>'));assert.ok(!html.includes('<script>'));
const {compileBoundary}=await import(pathToFileURL(path.join(plan.root,'research/7plus1-parser/llm-first-028/compile.mjs')));
const replay=compileBoundary(raw.source,raw.proposal,raw.audit,raw.technical);assert.deepEqual(replay.canonical,raw.canonical);assert.deepEqual(replay.ir,raw.ir);assert.equal(replay.chinese,raw.chinese);
const legacy=[];
for(const item of prep.archived_short_records){
 const b=await(await get('api/legacy/'+item.run_id)).json();assert.equal(b.status,'LEGACY_READ_ONLY');assert.deepEqual(b.raw,JSON.parse(fs.readFileSync(item.original_file)));
 assert.equal(digest(fs.readFileSync(item.archive_file)),item.sha256);legacy.push({run_id:item.run_id,sha256:item.sha256,mode:b.status,raw_matches_original:true});
}
const after=await(await get('api/runs')).json();assert.deepEqual(after.map(r=>[r.run_id,r.status,r.real_calls]),before.map(r=>[r.run_id,r.status,r.real_calls]));
let preserved=0;
for(const item of prep.backups.filter(x=>['candidate-data','original-58618-data','original-legacy-history'].includes(x.destination)))for(const f of item.files){
 assert.equal(digest(fs.readFileSync(path.join(item.source,f.path))),f.sha256);assert.equal(digest(fs.readFileSync(path.join(item.backup_path,f.path))),f.sha256);preserved++;
}
assert.equal(digest(fs.readFileSync(path.join(plan.home,'current.json'))),digest(fs.readFileSync(path.join(prep.backup,'current.json'))));plan.verify();
write('VERIFICATION.json',{at:new Date().toISOString(),url:plan.url,PORT_58618_RESTORED:true,semantic_acceptance:'PARTIAL / REVIEW_REQUIRED',product_snapshot:plan.snapshot,
 session:{engine:session.engine,compiler_revision:session.compiler_revision,contract:session.contract,runtime_sha256:session.runtime_sha256,requested_model:session.requested_model,actual_model:session.actual_model,limit_codepoints:session.limit_codepoints,skill_mode:session.skill_mode,native_skill_loading:session.native_skill_loading,business_execution_enabled:session.business_execution_enabled},
 static_files:staticFiles,bundles,authentication_gates:gates,current_records:current.map(({run_id,status,compiler_revision})=>({run_id,status,compiler_revision})),
 old_records_readonly:legacy,listed_legacy_records:before.length-current.length,original_legacy_files:prep.original_legacy_files,original_non_uuid_legacy_preserved:true,
 current_history_not_merged:true,exports:{run_id:id,json_matches:true,chinese_matches:true,trace_json_matches:true,trace_markdown:true,trace_html:true},
 frozen_response_replay:{run_id:id,mode:'OFFLINE_EXISTING_RESPONSE',ir_matches:true,canonical_matches:true,chinese_matches:true,model_calls:0,not_new_model_validation:true,not_added_to_history:true},
 immutable_history_and_backup_files_checked:preserved,installed_files_checked:plan.snapshot.files.length,no_new_runs:true,no_inflight_requests:true,model_calls:0});
console.log(JSON.stringify({url:plan.url,version:plan.snapshot.product_version,current:current.length,old_readonly:legacy.length,listed_legacy:before.length-current.length,preserved,installed_files:plan.snapshot.files.length,exports:'PASS',same_response_replay:'PASS',model_calls:0}));
