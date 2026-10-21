import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {pathToFileURL} from 'node:url';
const stage=path.resolve(process.env.BOUNDX_TIMING_TEST_ROOT??'.boundx/comparison-timing-ui14-work');
const core=path.join(stage,'research/7plus1-parser/llm-first-028'),web=path.join(stage,'research/7plus1-parser/v0.3-p2.1-generalization/web');
const {savedCallHistory}=await import(pathToFileURL(path.join(core,'observability.mjs'))),{timingView,modelView}=await import(pathToFileURL(path.join(web,'process-view.js')));
const root=path.resolve('.boundx/exports/SKILL-MD-COMPACT-COMPARISON-r01/SKILL');
test('all revisions counted; no previous model work labeled local program time',()=>{
 const run=JSON.parse(fs.readFileSync(path.join(root,'run.json'),'utf8'));run.call_history=savedCallHistory(root);
 const timing=timingView(run);assert.equal(run.call_history.length,4);assert.equal(timing.complete,true);
 assert.equal(timing.first_parse_ms,182715);assert.equal(timing.first_audit_ms,123202);
 assert.equal(timing.phases.find(x=>x.phase==='parse').ms,295470);assert.equal(timing.phases.find(x=>x.phase==='audit').ms,240060);assert.equal(timing.other_ms,1431);
 assert.equal(modelView(run).calls.length,4);assert.equal(modelView(run).independent,true);
});
test('incomplete receipts never produce fake residual program duration',()=>{
 const run=JSON.parse(fs.readFileSync(path.join(root,'run.json'),'utf8'));run.call_history=savedCallHistory(root).slice(2);
 assert.equal(timingView(run).complete,false);assert.equal(timingView(run).other_ms,null);assert.equal(timingView({...run,status:'RUNNING'}),null);
});
test('legacy last-revision-only payload does not relabel earlier model calls',()=>{
 const run=JSON.parse(fs.readFileSync(path.join(root,'run.json'),'utf8'));const all=savedCallHistory(root);
 run.result={model_calls:{parse:[all[2]],audit:[all[3]]}};assert.equal(timingView(run).other_ms,null);
});
test('safe receipt history exposes metadata only, and supports more than fixed attempt indexes',()=>{
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-receipt-metadata-'));
 const call=path.join(folder,'revision-10/parse-call');fs.mkdirSync(call,{recursive:true});
 fs.writeFileSync(path.join(call,'receipt-5.json'),JSON.stringify({thread_id:'safe-session',elapsed_ms:10,exit_code:0,usage:{output_tokens:1},secret:'NEVER_EXPOSE',stderr:'NEVER_EXPOSE'}));
 const rows=savedCallHistory(folder);assert.equal(rows[0].revision,10);assert.equal(rows[0].attempt,5);assert.equal(JSON.stringify(rows).includes('NEVER_EXPOSE'),false);
 fs.rmSync(folder,{recursive:true,force:true});
});
test('viewed run method and next-run selectors explicitly distinguished',()=>{
 const code=fs.readFileSync(path.join(web,'native-app.js'),'utf8');assert.ok(code.includes('当前查看记录实际使用：'));assert.ok(code.includes('下一次编译设置'));assert.ok(code.includes('下方选择只影响下一次编译，不改变此记录。'));
});
