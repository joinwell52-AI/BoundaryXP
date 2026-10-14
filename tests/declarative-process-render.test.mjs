import test from 'node:test';
import assert from 'node:assert/strict';
import {renderCompilerProcess} from '../research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js';
class Element {
 constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.textContent='';}
 append(...children){for(const child of children){if(child&&typeof child==='object')child.parentElement=this;this.children.push(child);}}
 replaceChildren(...children){this.children=[];this.append(...children);}
 setAttribute(key,value){this[key]=value;}
 querySelectorAll(){return [];}
 querySelector(){return null;}
 addEventListener(){}
}
const text=e=>[e.textContent,...e.children.map(x=>typeof x==='string'?x:text(x))].join(' ');
test('idle page uses installed profile and separates LLM, program and not-yet-submitted PM plan',()=>{
 const previous=globalThis.document;globalThis.document={createElement:tag=>new Element(tag)};
 try{const target=new Element('root');renderCompilerProcess(target,{},{session:{request_profile:'DECLARATIVE_BOUNDARY_R01'}});const shown=text(target);
 assert.match(shown,/LLM负责：提取边界与独立审阅/);assert.match(shown,/程序负责：校验、转换与展示/);assert.match(shown,/未提交PM规划，尚未核验/);assert.doesNotMatch(shown,/生成Boundary IR/);
 }finally{globalThis.document=previous;}
});
test('compact candidate in flight never enters legacy semantic renderer',()=>{
 const previous=globalThis.document;globalThis.document={createElement:tag=>new Element(tag)};
 try {
  const target=new Element('root');
  const run={run_id:'example',status:'RUNNING',stage:'AUDITING',request_profile:'DECLARATIVE_BOUNDARY_R01',stages:[],progress:{proposal:{format:'boundx-boundary/1',entities:[{id:'actor',label:'执行人'}],events:[],expressions:[]}}};
  assert.doesNotThrow(()=>renderCompilerProcess(target,run));
  assert.match(text(target),/查看处理过程、模型记录与技术详情/);
  assert.doesNotMatch(text(target),/LLM识别的对象与参与者/);
  const details=target.children.find(x=>x.className==='process-details');assert.equal(details.open,false);
 }finally{globalThis.document=previous;}
});
