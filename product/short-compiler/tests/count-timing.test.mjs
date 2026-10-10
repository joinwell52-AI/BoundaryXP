import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceLength,timingView} from '../../../research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js';
test('display count preserves Unicode source coordinates including supplementary characters',()=>{
 assert.equal(sourceLength('中A 😀\n').count,5);
 assert.equal(sourceLength('e\u0301').count,2);
 assert.equal(sourceLength('👩‍💻').count,3);
 assert.equal(sourceLength('x'.repeat(301)).count,301);
 assert.equal(sourceLength('检查').label,'原文长度：2 / 300 字符');
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
