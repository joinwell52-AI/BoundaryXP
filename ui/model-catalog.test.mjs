import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function harness(request){
 const nodes=new Map();
 const element=tag=>({tag,value:'',hidden:false,disabled:false,children:[],setAttribute(){},append(...children){this.children.push(...children);if(this.tag==='select'&&children.length&&!this.value)this.value=children[0].value;},replaceChildren(){this.children=[];this.value='';},closest(){return this.parent??=element('label');},click(){return this.onclick();}});
 const get=id=>{if(!nodes.has(id))nodes.set(id,element('input'));return nodes.get(id);};
 const providerSelect={value:'api'};
 let invalidations=0;
 const source=readFileSync(new URL('./app.js',import.meta.url),'utf8');
 const block=source.slice(source.indexOf('const cursorCatalog='),source.indexOf('function connectionDisplay('));
 const result=runInNewContext(block+'\n({cursorCatalog,loadCursorModels,catalogStatus});',{
  $,element,providerSelect,api:request,action:handler=>handler,
  button:(_text,handler)=>Object.assign(element('button'),{onclick:handler}),localized:()=>{},setText:(node,text)=>{node.textContent=text;},invalidateConnection:()=>{invalidations++;}
 });
 function $(id){return get(id);}
 return {...result,get,providerSelect,invalidations:()=>invalidations};
}

test('hosted model selector sits beside model input, hides manual entry and auto-loads Codex',async()=>{
 const calls=[];
 const view=harness(async(route,data)=>{calls.push({route,data});return {models:[{id:'available-model',name:'Available model'}]};});
 view.providerSelect.value='codex';view.providerSelect.onchange();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(calls[0].route,'codex-models');assert.deepEqual(Object.keys(calls[0].data),[]);
 assert.equal(view.get('model').hidden,true);
 assert.ok(view.get('model').closest().children.includes(view.cursorCatalog));
 assert.equal(view.cursorCatalog.disabled,false);assert.equal(view.get('model').value,'available-model');
 const before=view.invalidations();view.cursorCatalog.value='another-model';view.cursorCatalog.onchange();
 assert.equal(view.get('model').value,'another-model');assert.ok(view.invalidations()>before);
 view.providerSelect.value='api';view.providerSelect.onchange();
 assert.equal(view.get('model').hidden,false);assert.equal(view.cursorCatalog.hidden,true);assert.equal(view.get('model').value,'');
});

test('empty catalog leaves no model selected and offers a visible retry',async()=>{
 const view=harness(async()=>({models:[]}));view.providerSelect.value='cursor';view.providerSelect.onchange();
 await assert.rejects(view.loadCursorModels.click(),/No models available/);
 assert.equal(view.get('model').value,'');assert.equal(view.cursorCatalog.disabled,true);
 assert.match(view.catalogStatus.textContent,/No models available/);assert.equal(view.loadCursorModels.hidden,false);
});

test('late catalog response cannot overwrite a different provider',async()=>{
 let finish;
 const view=harness(()=>new Promise(resolve=>{finish=resolve;}));
 view.providerSelect.value='cursor';view.providerSelect.onchange();const pending=view.loadCursorModels.click();
 view.providerSelect.value='api';view.providerSelect.onchange();view.get('model').value='custom-id';
 finish({models:[{id:'stale-model',name:'Stale'}]});await pending;
 assert.equal(view.get('model').value,'custom-id');assert.equal(view.cursorCatalog.children.length,0);
});
