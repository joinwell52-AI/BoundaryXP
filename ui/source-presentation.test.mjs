import {pointSlice} from './codepoints.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateWithLibraries} from '../admin-python.mjs';
import {sourcePresentation} from './source-advice.mjs';
import {readFile} from 'node:fs/promises';
const originals=JSON.parse(await readFile(new URL('../python/regression_cases_016.json',import.meta.url),'utf8'));
const text='对商户批量执行退款操作 `batch_refund`。未经 Finance_Director 电子签名授权，严禁调用该退款接口；但若系统收到来自风控系统的高危欺诈拦截指令，必须立即执行 `batch_refund` 原路退回资金；调用耗时须在 60 秒内结束。';
test('real result separates actors from inputs and presents computed conflict',async()=>{
 const r=await calculateWithLibraries(text),p=sourcePresentation(r,text);
 assert(p.elements.P.some(x=>x.text['zh-CN'].includes('Finance_Director')));
 assert(!p.elements.I.some(x=>x.text['zh-CN'].includes('Finance_Director')));
 assert(p.elements.R.some(x=>x.text['zh-CN'].includes('≤ 60 秒')));
 assert(p.elements.B.some(x=>x.text['zh-CN'].includes('未获Finance_Director授权时')));
 assert(p.elements.A.some(x=>x.text['zh-CN'].includes('高危欺诈拦截指令')));
 const f=p.findings.find(x=>x.code==='guard_modal_conflict');assert(f);
 assert.equal(f.proof.guardOverlap,'sat');assert.equal(f.proof.jointActionConstraints,'unsat');
 assert(f.scenario.en);assert.equal(f.decision,null);
 for(const field of Object.values(p.elements))for(const v of field)for(const s of v.sources)assert.equal(pointSlice(text,s.start,s.end),s.quote);
});
test('unresolved work-package conditions remain visible in the presentation',async()=>{
 const input='## WP1 Prepare\n等待 WP2 完成后调用接口\n## WP2 Finish\n等待 WP1 完成后调用接口';
 const r=await calculateWithLibraries(input),p=sourcePresentation(r,input);
 assert.equal(r.sourceAnalysis,null);
 assert(p.findings.some(f=>f.code==='cross_wp_scope_unresolved'));
});
test('ambiguous action produces a specific unresolved message',async()=>{
 const input=text.replace('。未经','，还有操作 `refund_check`。未经');
 const p=sourcePresentation(await calculateWithLibraries(input),input);
 assert(p.findings.some(x=>x.code==='guard_binding_unresolved'));
 assert(!p.findings.some(x=>x.code==='guard_modal_conflict'));
});
test('ADMIN receives independent B and populated source-backed elements',async()=>{
 const raw=originals.prohibition,r=await calculateWithLibraries(raw),p=sourcePresentation(r,raw);
 assert.equal(p.elements.B.length,2);assert(!p.findings.some(f=>f.code==='guard_binding_unresolved'));
 for(const k of ['I','O','A','R','V','C'])assert(p.elements[k].length,k);
 assert.equal(p.elements.P.length,0);assert(p.elements.B.some(v=>v.text['zh-CN'].includes('未授权押金')));
 for(const values of Object.values(p.elements))for(const v of values)for(const s of v.sources)assert.equal(pointSlice(raw,s.start,s.end),s.quote);
});
test('amount and set findings provide concrete main-page results and bilingual advice',async()=>{
 for(const [i,code] of [[0,'interval_empty'],[1,'target_forbidden_overlap']]){
  const raw=originals.additional[i],p=sourcePresentation(await calculateWithLibraries(raw),raw),f=p.findings.find(x=>x.code===code);
  assert(f);assert(f.title.en);assert(f.scenario.en);assert(f.suggestion.en);assert.equal(f.decision,null);
  assert.equal(f.severity,'conflict');assert(f.proof);
 }
});
test('branch and actuation outputs retain conditions without invented execution decisions',async()=>{
 for(const [i,code] of [[2,'dangling_conditional_branch'],[3,'modal_logical_conflict']]){
  const raw=originals.additional[i],r=await calculateWithLibraries(raw),p=sourcePresentation(r,raw);
  const f=p.findings.find(x=>x.code===code);assert(f);assert.equal(r.businessDecision,null);
  assert(p.elements.B.length);assert(p.elements.A.length);assert(f.scenario['zh-CN']);
 }
});
