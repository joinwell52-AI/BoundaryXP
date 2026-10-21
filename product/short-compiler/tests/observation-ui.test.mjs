import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDX_INPUT_TEST_ROOT??'.boundx/local-condition-repair-r02/work');
const trace=JSON.parse(fs.readFileSync('docs/reports/7plus1/LOCAL-CONDITION-REPAIR-r01/live-V01-attempt-01/trace.json'));
class Element{constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.value='';}append(...xs){this.children.push(...xs);}replaceChildren(...xs){this.children=xs;}set textContent(x){this.text=x;}get textContent(){return this.text??'';}}
const walk=e=>[e,...(e.children??[]).filter(x=>typeof x==='object').flatMap(walk)];
test('Existing calculation UI sends exact typed observations, supports unknown, and renders returned result separately',async()=>{
 const old=globalThis.document;globalThis.document={createElement:tag=>new Element(tag),createTextNode:text=>({text})};
 try{const {renderBoundaryCalculations}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/v0.3-p2.1-generalization/web/calculation-view.js')));const container=new Element('section');container.dataset.runId='test-run';let input=null;
 renderBoundaryCalculations(container,trace,()=>{},async x=>{input=x;return {observation_id:'observed-test',calculation:trace.boundary_calculations,model_calls:0};});
 const form=walk(container).find(e=>e.tag==='form');assert.ok(form);await form.onsubmit({preventDefault(){}});assert.deepEqual(input,{states:{},outcomes:{},quantities:{}});
 const selectors=walk(form).filter(e=>e.tag==='select');assert.ok(selectors.length>4);selectors[0].value='false';const inputs=walk(form).filter(e=>e.tag==='input');assert.ok(inputs.length);inputs[0].value='31';await form.onsubmit({preventDefault(){}});
 assert.ok(Object.values(input.states).includes(false));const q=Object.values(input.quantities)[0];assert.equal(q.value,31);assert.ok(q.target_id&&q.unit&&q.count_scope);assert.equal(walk(form).filter(e=>e.tag==='form').length,1);assert.ok(walk(form).some(e=>e.download==='observed-test.json'));
 }finally{globalThis.document=old;}
});
