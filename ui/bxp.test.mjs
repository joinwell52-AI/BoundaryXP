import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createApp} from '../ui-server.mjs';
import {evaluateBxpTask, parseAndEvaluateBxpTask, protocolInfo} from '../src/bxp/index.mjs';
import {renderBxpResult} from './bxp-view.mjs';

async function setup(context){
  const app=createApp({fetchImpl:()=>{throw Error('BXP must not call a model');}});
  await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
  context.after(()=>new Promise(resolve=>{app.close(resolve);app.closeAllConnections();}));
  const origin='http://127.0.0.1:'+app.address().port;
  const html=await(await fetch(origin)).text();
  const token=html.match(/name="session-token" content="([a-f0-9]+)"/)[1];
  return {origin,html,post:(raw,route='/api/bxp/evaluate',extra={})=>fetch(origin+route,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-BoundX-Token':token,...extra},body:raw})};
}
const example=(locale,variant)=>JSON.parse(readFileSync(new URL(`../examples/bxp/${locale}-${variant}.json`,import.meta.url),'utf8'));
for(const locale of ['zh-CN','en'])for(const variant of ['complete','b-absent','unresolved','multi-source','unresolved-scope','conflict'])test(`UI HTTP/core parity ${locale}/${variant}`,async context=>{
  const {post}=await setup(context),task=example(locale,variant);
  const response=await post(JSON.stringify(task));assert.equal(response.status,200);
  assert.deepEqual(await response.json(),evaluateBxpTask(task));
});
test('UI mixed/emoji code points match CLI and MCP without model calls',async context=>{
  const {post}=await setup(context),task=example('zh-CN','complete');
  task.source.text='😀𠮷 English 中文\n'+task.source.text;
  const shift=Array.from('😀𠮷 English 中文\n').length;
  const visit=value=>{if(!value||typeof value!=='object')return;if(typeof value.quote==='string'){value.start+=shift;value.end+=shift;}for(const child of Object.values(value))visit(child);};
  visit(task.elements);visit(task.constraints);
  const raw=JSON.stringify(task),expected=evaluateBxpTask(task);
  assert.equal(expected.evaluation.validation,'valid');
  assert.deepEqual(await(await post(raw)).json(),expected);
  const mcp=spawnSync(process.execPath,['mcp.mjs'],{encoding:'utf8',input:JSON.stringify({id:1,method:'tools/call',params:{name:'bx_evaluate_task_json',arguments:{raw_json:raw}}})+'\n'});
  assert.equal(mcp.status,0,mcp.stderr);assert.deepEqual(JSON.parse(JSON.parse(mcp.stdout).result.content[0].text),expected);
  const invalid=structuredClone(task);invalid.elements.I.entries[0].evidence[0].start++;
  assert.equal((await(await post(JSON.stringify(invalid))).json()).evaluation.validation,'invalid');
});
test('UI strict bytes, legacy negatives, asset routing and origin protection',async context=>{
  const {origin,html,post}=await setup(context);
  assert.match(html,/bxp.mjs/);assert.doesNotMatch(html,/src="\/app.js"/);
  assert.deepEqual(await(await fetch(origin+'/api/protocol-info')).json(),protocolInfo());
  for(const path of ['/bxp.mjs','/bxp-view.mjs','/bxp.css','/codepoints.mjs'])assert.equal((await fetch(origin+path)).status,200);
  for(const raw of ['{}','{"x":1,"x":2}','{"x":1.0000000000000001}',' '.repeat(2_000_001),Buffer.from([0xc3,0x28]),readFileSync(new URL('../examples/task.json',import.meta.url))]){
    const response=await post(raw);assert.equal(response.status,200);assert.deepEqual(await response.json(),parseAndEvaluateBxpTask(raw));
  }
  assert.equal((await post('{}','/api/bxp/evaluate',{Origin:'https://evil.invalid'})).status,403);
  assert.equal((await post('{}','/api/review')).status,404);
  assert.match(await(await fetch(origin+'/legacy')).text(),/Deprecated research interface/);
});
class ViewNode {
  constructor(ownerDocument,tag){this.ownerDocument=ownerDocument;this.tag=tag;this.dataset={};this.children=[];this.textContent='';}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  get text(){return this.textContent+this.children.map(node=>node.text).join('\n');}
  all(){return [this,...this.children.flatMap(node=>node.all())];}
}
test('UI view renders distinct states, all axes/evidence/calculations and never HTML-injects source',()=>{
  const document={createElement:tag=>new ViewNode(document,tag)},host=new ViewNode(document,'section');
  for(const variant of ['complete','b-absent','unresolved','multi-source','unresolved-scope','conflict']){
    const task=example('en',variant),result=evaluateBxpTask(task);renderBxpResult(host,task,result,protocolInfo());
    assert.deepEqual(host.all().filter(node=>node.dataset.element).map(node=>node.dataset.element),protocolInfo().core_elements);
    for(const [key,value] of Object.entries(result.evaluation))assert.ok(host.text.includes(`${key}: ${value}`));
    for(const kind of Object.keys(result.calculations))assert.ok(host.text.includes(kind));
    if(variant==='b-absent')assert.match(host.text,/Absent: supply evidence/);
    if(variant==='unresolved')assert.match(host.text,/Unresolved: clarify interpretation/);
    if(variant==='multi-source')assert.match(host.text,/source_id=policy/);
    assert.match(host.text,/business_decision.*null/s);assert.match(host.text,/execution_authorization.*null/s);
  }
  const task=example('en','complete');task.elements.I.entries[0].text='<img src=x onerror=alert(1)>';
  renderBxpResult(host,task,evaluateBxpTask(task),protocolInfo());assert.ok(host.text.includes('<img'));assert.ok(!host.all().some(node=>node.tag==='img'));
  renderBxpResult(host,null,evaluateBxpTask({}),protocolInfo());assert.ok(!host.all().some(node=>node.dataset.element));assert.match(host.text,/Invalid input/);
});
