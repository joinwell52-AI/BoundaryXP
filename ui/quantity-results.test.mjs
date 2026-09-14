import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateWithLibraries} from '../admin-python.mjs';
import {sourcePresentation} from './source-advice.mjs';
import {renderAdminResult} from './source-render.mjs';

test('a non-empty pressure intersection is visible alongside unresolved roles',async()=>{
 const text='质检员检查设备。主蒸汽包表压严格小于2.5兆帕，且表压至少为1.8兆帕。';
 const result=await calculateWithLibraries(text),view=sourcePresentation(result,text);
 assert(view.findings.some(f=>f.code==='context_kept_as_unresolved_guard'));
 const note=view.calculationNotes.find(n=>n.combined);
 assert(note.formula.includes('[1800000,2500000)'));assert(note.formula.includes('∩'));assert(note.assumption);
 const element=(tag,text)=>({tag,text,children:[],dataset:{},append(...children){this.children.push(...children);}});
 const host=element('main');
 renderAdminResult(host,result,{element,localized:(el,zh)=>Object.assign(el,{text:zh}),attribute:()=>{},editable:()=>{},button:()=>element('button'),action:f=>f});
 const flatten=n=>[n.text??'',...n.children.flatMap(flatten)];
 const visible=flatten(host).join('\n');
 assert(visible.includes('上下界交集非空'));assert(visible.includes(note.localizedFormula['zh-CN']));assert(visible.includes('请明确这段前缀的作用'));
});

test('USD empty interval and percent are presented as calculated values',async()=>{
 const text='单件包裹残值评估至少80美元，但根据协议，残值评估上限严格小于50美元；比例不超过35%。';
 const view=sourcePresentation(await calculateWithLibraries(text),text),f=view.findings.find(f=>f.code==='interval_empty');
 assert.equal(f.proof.unit,'USD');assert.equal(f.proof.readableResult,'∅');
 assert(view.elements.R.some(v=>v.text['zh-CN'].includes('35 %')));
 assert(f.suggestion['zh-CN']);assert(f.suggestion.en);assert.equal(f.decision,null);
});

test('English explicit rate and completion reach the real isolated Python service',async()=>{
 const text='Analyst reads orders.csv and generates summary.json. Calls per second shall not exceed 5. Generating summary.json is the completion condition.';
 const r=await calculateWithLibraries(text),view=sourcePresentation(r,text);
 assert.equal(r.sourceAnalysis.numbers[0].unit,'calls_per_second');
 assert(view.elements.C.some(v=>v.text.en.includes('summary.json')));
 assert(!view.findings.some(f=>f.code==='numeric_unit_unresolved'));
 for(const values of Object.values(view.elements))for(const v of values)for(const s of v.sources)assert.equal(text.slice(s.start,s.end),s.quote);
});

test('unbound flow names produce a conditional calculation, not a proved conflict',async()=>{
 const text='夹套急冷水注入流量至少每小时80立方米，但根据规程，瞬时注水流量上限严格小于每小时50立方米。';
 const result=await calculateWithLibraries(text),view=sourcePresentation(result,text);
 const f=view.findings.find(f=>f.code==='metric_identity_unresolved');
 assert(f);assert.equal(f.proof.bindingEstablished,false);assert.equal(f.proof.emptyUnderHypothesis,true);
 assert(f.formula['zh-CN'].endsWith('立方米/小时'));assert(f.formula.en.endsWith('m³/h'));
 assert(!view.findings.some(f=>f.code==='interval_empty'));
 const element=(tag,text)=>({tag,text,children:[],dataset:{},append(...children){this.children.push(...children);}});
 const host=element('main');
 renderAdminResult(host,result,{element,localized:(el,zh)=>Object.assign(el,{text:zh}),attribute:()=>{},editable:()=>{},button:()=>element('button'),action:f=>f});
 const flatten=n=>[n.text??'',...n.children.flatMap(flatten)];
 const visible=flatten(host).join('\n');
 assert(visible.includes('∅'));assert(visible.includes('∩'));assert(visible.includes('同一'));
});
