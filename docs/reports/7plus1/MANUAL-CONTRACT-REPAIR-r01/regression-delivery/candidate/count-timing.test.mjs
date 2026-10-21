import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceLength,timingView,modelView} from 'file:///D:/boundx/.boundx/products/0.1.0-candidate.031-r1.2-ui.36/research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js';
test('display count preserves Unicode source coordinates including supplementary characters',()=>{
 assert.equal(sourceLength('中A 😀\n').count,5);
 assert.equal(sourceLength('e\u0301').count,2);
 assert.equal(sourceLength('👩‍💻').count,3);
 assert.equal(sourceLength('x'.repeat(301)).count,301);
 assert.equal(sourceLength('检查').label,'原文长度：2 / 300 字符');
});
test('all revision receipts count once instead of assigning the earlier round to program time',()=>{
 const run={...completed(),revision:1,real_calls:4,created_at:'2026-10-10T03:22:59.456Z',ended_at:'2026-10-10T03:33:43.540Z',result:{model_calls:{parse:[{elapsed_ms:177755}],audit:[{elapsed_ms:138156}]}},model_activity:{calls:[
  {revision:0,phase:'parse',attempt:0,elapsed_ms:174079,thread_id:'parse-0'},
  {revision:0,phase:'audit',attempt:0,elapsed_ms:152658,thread_id:'audit-0'},
  {revision:1,phase:'parse',attempt:0,elapsed_ms:177755,thread_id:'parse-1'},
  {revision:1,phase:'audit',attempt:0,elapsed_ms:138156,thread_id:'audit-1'}
 ]}};
 const view=timingView(run);assert.equal(view.total_ms,644084);assert.equal(view.model_ms,642648);assert.equal(view.other_ms,1436);assert.equal(view.round_count,2);assert.deepEqual(view.phases.map(p=>p.ms),[351834,290814]);
 assert.equal(modelView(run).calls.length,4);assert.deepEqual(modelView(run).calls.map(c=>c.revision),[1,1,2,2]);assert.equal(modelView(run).independent,true);
 delete run.model_activity;assert.equal(timingView(run).other_ms,null);
 run.revision=0;assert.equal(timingView(run).other_ms,null,'real_calls mismatch is incomplete telemetry');
});
test('partial activity receipts cannot turn unmeasured model time into local processing',()=>{
 const run={...completed(),real_calls:2,model_activity:{calls:[{revision:0,phase:'parse',attempt:0,elapsed_ms:101872},{revision:0,phase:'audit',attempt:0,elapsed_ms:null}]}};
 assert.equal(timingView(run).other_ms,null);assert.equal(timingView(run).phases[1].ms,null);
});
const completed=()=>({status:'COMPLETED',created_at:'2026-10-10T02:48:57.917Z',ended_at:'2026-10-10T02:51:52.338Z',result:{model_calls:{parse:[{elapsed_ms:101872}],audit:[{elapsed_ms:71516}]}}});
test('completed timing uses fixed run timestamps and both serial model receipts',()=>{
 const view=timingView(completed());
 assert.equal(view.total_ms,174421);assert.equal(view.other_ms,1033);
 assert.deepEqual(view.phases.map(p=>p.ms),[101872,71516]);
});
test('all recorded attempts count; missing or inconsistent telemetry is not invented',()=>{
 const run=completed();run.result.model_calls.parse.push({elapsed_ms:400});
 assert.equal(timingView(run).phases[0].count,2);assert.equal(timingView(run).other_ms,633);
 run.result.model_calls.audit=[{}];assert.equal(timingView(run).other_ms,null);
 run.result.model_calls.audit=[{elapsed_ms:999999}];assert.equal(timingView(run).other_ms,null);
 delete run.ended_at;assert.equal(timingView(run),null);
 assert.equal(timingView({status:'RUNNING'}),null);
});
