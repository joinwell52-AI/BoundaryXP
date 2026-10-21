import test from 'node:test';import assert from 'node:assert/strict';
import {versionView,renderVersionInfo} from 'file:///D:/boundx/.boundx/owned-event-calculus-r01/work/research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js';
test('page version is runtime identity while saved result retains its own generating version',()=>{
 const session={product_snapshot:{product_version:'ui-new',compiler_revision:'core-fixed',contract:'contract-fixed',product_acceptance:'PARTIAL / REVIEW_REQUIRED'}};
 const view=versionView({run_id:'historic',product_snapshot:{product_version:'ui-old'}},session);assert.equal(view.runtime_version,'ui-new');assert.equal(view.record_version,'ui-old');assert.equal(view.compiler,'core-fixed');assert.equal(view.contract,'contract-fixed');assert.match(view.acceptance,/人工验收/);
});
test('missing runtime identity is never invented from a historical record',()=>{
 const view=versionView({run_id:'historic',product_snapshot:{product_version:'ui-old'}});assert.equal(view.runtime_version,'未提供安装版本');assert.equal(view.record_version,'ui-old');assert.match(versionView({run_id:'historic'}).record_version,/未保存/);assert.equal(versionView().record_version,null);
});
test('runtime version and historical identity are visible text, without interpreting HTML',()=>{
 class E{constructor(tag){this.tag=tag;this.children=[];}append(...xs){this.children.push(...xs);}replaceChildren(){this.children=[];}}
 const previous=globalThis.document;globalThis.document={createElement:tag=>new E(tag)};
 try{const root=new E('section');renderVersionInfo(root,{run_id:'historic',product_snapshot:{product_version:'ui-old'}},{product_snapshot:{product_version:'<new>',compiler_revision:'core',contract:'c'}});assert.equal(root.children[0].textContent,'当前页面版本：<new>');assert.match(root.children[2].textContent,/ui-old/);assert.ok(!root.children.some(x=>x.tag==='new'));}finally{globalThis.document=previous;}
});
