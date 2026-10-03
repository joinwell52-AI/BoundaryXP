import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileNative} from '../research/7plus1-parser/v0.3-7p-composition-014/engine.mjs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {predicateEnclosure} from '../research/7plus1-parser/v0.3-7p-composition-014/semantic-ownership.mjs';
import {checks} from '../docs/reports/7plus1/7P-COMPOSITION-014/binding-checks.mjs';
const dir='docs/reports/7plus1/7P-COMPOSITION-014/',read=p=>JSON.parse(fs.readFileSync(p));
for(const x of read(dir+'NON-GOLD-FROZEN-INPUTS.json').cases.filter(c=>c.stage==='R1'))test('012 frozen independent ownership '+x.id,()=>{
 const r=compileNative(sourceDocument(x.text),read(dir+'non-gold-signals/'+x.id+'.json').signals);assert.equal(r.contract_gate_results.status,'PASS');for(const check of checks(x,r))assert(check.pass,check.check);
 const a=compileNative(sourceDocument(x.text),read(dir+'non-gold-signals/'+x.id+'.json').signals);for(const k of ['semantic_nodes','relations','eligibility_decisions','boundary_ir','canonical_7plus1','proof_dag'])assert.deepEqual(r.compiler_v03[k],a.compiler_v03[k]);
});
for(const [text,target,expected] of [
 ['报告的"差异说明"\n  需给出建议','给出',[]],
 ["don't delete history","delete",[]],
 ['禁止删除（它保存历史记录）','保存',['（']],
 ['禁止删除（仅允许保存归档）','保存',['（']],
 ['调用 `collect(rows)` 后生成摘要','生成',[]],
 ['要求“停止清理”作为正文内容','停止',['“']],
 ['禁止删除（说明“引用”）并保存记录','保存',[]]
])test('011 delimiter layers preserve ownership: '+text,()=>{const start=17,at=start+[...text.slice(0,text.indexOf(target))].length;assert.deepEqual(predicateEnclosure({start,quote:text},at).map(x=>x.open),expected);});
