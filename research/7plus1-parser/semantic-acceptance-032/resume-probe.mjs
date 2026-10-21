// One bounded same-source compilation after a changed connectivity observation.
// It is a new evidence directory, never a replacement of the first failure.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';
import {report,write} from './prepare.mjs';import {sha256} from '../llm-first-028/source.mjs';import {requestLedger,classifyRunFailure} from './transport-ledger.mjs';
const budget=JSON.parse(fs.readFileSync(path.join(report,'CALL-BUDGET-FINAL.json')));
assert.ok(budget.remaining_conservative>=158,'REMAINING_WORK_RESERVE');
const root=path.resolve('.boundx/experiments/032/packages/consumer-c2'),manifestBytes=fs.readFileSync(path.join(root,'PRODUCT-MANIFEST.json')),manifest=JSON.parse(manifestBytes);
for(const f of manifest.files)assert.equal(sha256(fs.readFileSync(path.join(root,f.path))),f.sha256);
const env=JSON.parse(fs.readFileSync(path.join(report,'ENVIRONMENT.json'))),input=path.join(report,'inputs/Q04.txt'),source=fs.readFileSync(input);
const expected=JSON.parse(fs.readFileSync(path.join(report,'SOURCE-EXPECTATIONS.json'))).cases.find(c=>c.id==='Q04');assert.equal(sha256(source),expected.sha256);
const dir=path.join(report,'runs/connectivity-recheck-c2/Q04');fs.mkdirSync(dir,{recursive:false});
write('CONNECTIVITY-RECHECK.json',{at:'2026-10-09T05:00:08.3903076Z',method:'HEAD https://chatgpt.com/ with normal TLS verification',http_status:403,elapsed_ms:854.4918,model_call:false,does_not_prove_codex_route_or_account_state:true,previous_tls_error_preserved:'TRANSPORT-PAUSE.json',bounded_real_compilation_allocation:4,first_failure_preserved:true});
const launch={at:new Date().toISOString(),version:manifest.version,package_sha256:sha256(manifestBytes),id:'Q04',source_sha256:expected.sha256,max_conservative_requests:4,minimum_remaining_if_failed:154,score_replaces_first:false,model_input_contains_test_id_or_expected:false};
fs.writeFileSync(path.join(dir,'launch.json'),JSON.stringify(launch,null,2)+'\n',{flag:'wx'});
const started=Date.now(),child=spawn(process.execPath,[path.join(root,'product/short-compiler/cli.mjs'),'--input',input,'--output',path.join(dir,'run'),'--request-budget','4'],{cwd:root,windowsHide:true,env:{...process.env,BOUNDX_CODEX_EXE:env.binary},stdio:['ignore','pipe','pipe']});let stdout='',stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);
console.log(JSON.stringify({started:true,pid:child.pid,allocation:4,version:manifest.version}));
const exit=await new Promise(r=>{child.on('error',e=>r({exit_code:null,error:e.message}));child.on('close',code=>r({exit_code:code}));});
fs.writeFileSync(path.join(dir,'stdout.md'),stdout,{flag:'wx'});fs.writeFileSync(path.join(dir,'stderr.txt'),stderr,{flag:'wx'});
const ledger=requestLedger(dir),result={...launch,...exit,elapsed_ms:Date.now()-started,ledger,underlying_failure:exit.exit_code===0?null:classifyRunFailure(dir),models_requested:true,new_first_result:false};
fs.writeFileSync(path.join(dir,'execution.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
write('BOUNDED-RECHECK-RESULT.json',result);console.log(JSON.stringify(result));
