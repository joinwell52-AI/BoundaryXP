import {pointSlice} from './codepoints.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {originalBoundary,withEngineAdvice} from './admin-boundary.mjs';
import {calculateWithLibraries} from '../admin-python.mjs';
test('original task has eight source dimensions, never a completeness certificate',()=>{
 const text='检查FCoP落地情况，检查MCP工具情况，检查SKILLS分配和使用，检查各角色权限和职责，检查轨机运行情况；请PM分解任务，团队协作完成；最后形成报告向ADMIN汇报！';
 const result=originalBoundary(text);
 assert.deepEqual(result.fields.map(f=>f.id),['I','O','A','P','R','V','C','B']);
 assert.deepEqual(result.summary.unmapped,['R','V','B']);
 assert.equal(result.confirmation,null);assert.equal(result.businessDecision,null);
 for(const f of result.fields)for(const s of f.evidence)assert.equal(pointSlice(text,s.start,s.end),s.quote);
 assert.deepEqual(result,originalBoundary(text));
});
test('explicit source labels and placeholders cannot auto-confirm a baseline',()=>{
 for(const text of ['I: 订单；O: CSV；A: 读取；P: PM；R: 30分钟；V: 版本1；C: 提交后停止；B: 禁止修改',
  'I: orders; O: CSV; A: read; P: PM; R: 30 minutes; V: version 1; C: stop after submission; B: must not modify']){
  const r=originalBoundary(text);assert.equal(r.summary.mapped.length,8);assert(r.fields.every(f=>f.confirmed===false));
 }
 assert(originalBoundary('R: 【时长】').summary.unmapped.includes('R'));
});
test('real library adapter runs all three checks without a model',async()=>{
 for(const text of ['对象范围：{甲,乙}；禁止对象：{乙}','target set: {a,b}; forbidden targets: {b}'])assert.deepEqual(originalBoundary(text).summary.mapped,['I','B']);
 const r=await calculateWithLibraries('对象范围：{甲,乙}；禁止对象：{乙}；必须修改配置；不得修改配置；甲完成后才能开始乙；乙完成后才能开始甲');
 assert.deepEqual(r.engines.map(e=>e.name),['sets','logic','graph']);assert(r.engines.every(e=>e.findings.length===1));
 assert(r.versions.portion&&r.versions['z3-solver']&&r.versions.networkx);
 assert(withEngineAdvice('draft',r,r.text).includes('对象清单与禁止对象重叠'));
 assert(withEngineAdvice('draft',r,r.text,'en').includes('Targets overlap'));
 assert.equal(withEngineAdvice('draft',r,'new source'),'draft');
});
test('conditional approval mentions are symbolic, not granted permissions',async()=>{
 const r=await calculateWithLibraries('经 A 授权，必须修改配置；未经 A 授权，不得修改配置。');
 assert.equal(r.engines[1].findings.length,0);
 assert.equal(r.engines[1].calculations[0].guardOverlap,'unsat');
 assert.equal(r.businessDecision,null);
 const overlapping=await calculateWithLibraries('经 A 授权，必须修改配置；经 A 授权，不得修改配置。');
 assert.equal(overlapping.engines[1].findings.length,1);
 assert.deepEqual(overlapping.engines[1].findings[0].witness,{A:true});
});
test('missing runtime, cancellation and source limits never return success',async()=>{
 await assert.rejects(calculateWithLibraries('任务',{python:'boundx-missing-python'}));
 const controller=new AbortController();controller.abort();await assert.rejects(calculateWithLibraries('任务',{signal:controller.signal}),{name:'AbortError'});
 await assert.rejects(calculateWithLibraries('x'.repeat(100001)));
 await assert.rejects(calculateWithLibraries('必须修改配置',{timeoutMs:1}),/超时/);
 const active=new AbortController();const promise=calculateWithLibraries('必须修改配置',{signal:active.signal});active.abort();
 await assert.rejects(promise,{name:'AbortError'});
});
