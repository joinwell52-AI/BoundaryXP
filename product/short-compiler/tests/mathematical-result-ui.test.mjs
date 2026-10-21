import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDARY_WORK??'.boundx/products/0.1.0-candidate.031-r1.2-ui.45');
class Element{constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.value='';}append(...xs){this.children.push(...xs);}replaceChildren(...xs){this.children=xs;}set textContent(x){this.text=x;}get textContent(){return this.text??'';}}
const walk=e=>[e,...(e.children??[]).filter(x=>typeof x==='object').flatMap(walk)];
test('same saved mathematical result renders explicit computed values and unknown frontier',async()=>{
 const old=globalThis.document;globalThis.document={createElement:tag=>new Element(tag),createTextNode:text=>({text})};
 try{const trace=JSON.parse(fs.readFileSync('docs/reports/7plus1/MATHEMATICAL-RESULT-CLOSURE-r01/live-attempt-01/trace.json'));
 const {calculateBoundary}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/calculus.mjs')));
 trace.boundary_calculations=calculateBoundary(trace.ir);
 const {renderBoundaryCalculations}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/v0.3-p2.1-generalization/web/calculation-view.js')));
 const container=new Element('section');renderBoundaryCalculations(container,trace);const text=walk(container).map(x=>x.text??'').join('\n');
 assert.match(text,/数学计算结果/);assert.match(text,/输入集合 I/);assert.match(text,/产物集合 O/);assert.match(text,/满足 .*违反/);assert.match(text,/禁止域/);assert.match(text,/待定比较/);assert.ok(walk(container).some(x=>x.tag==='table'));
 const math=trace.boundary_calculations.mathematical_results;assert.match(text,new RegExp('基数 '+math.sets.input.cardinality));assert.equal(math.execution_authorization,null);
 }finally{globalThis.document=old;}
});
