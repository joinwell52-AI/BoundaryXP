import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Readable} from 'node:stream';
import {spawn} from 'node:child_process';
import vm from 'node:vm';
import {dictionaryCatalog,selectDictionaries,dictionaryIdentity,lookupDictionary,dictionaryInstructions,scanDictionaries,dictionaryScanInstructions} from '../research/7plus1-parser/llm-first-028/dictionaries.mjs';
import {handleDictionaryRPC} from '../research/7plus1-parser/llm-first-028/dictionary-mcp.mjs';
import {parse7Plus1} from '../research/7plus1-parser/llm-first-028/engine.mjs';
import {callCodex,allowedDictionaryEvent} from '../research/7plus1-parser/llm-first-028/provider.mjs';
import {createServer} from '../research/7plus1-parser/llm-first-028/service.mjs';
const selection={l2:'software-ai@0.2.0',l3:'tenant-a@0.2.0'};
const probe={binary:'OFFLINE_TEST_NO_MODEL',version:'fixture',outputs:{features:{stdout:'shell_tool stable true\napps stable true\ncode_mode_host stable true'}}};
const temp=t=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-dictionary-test-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;};
test('lexical scan preserves Unicode evidence, ambiguity, repeated hits and selected-package isolation',()=>{
 const s=selectDictionaries({l3:'enterprise-a-boundary-test@0.1.0-test'}),text='😀客户镜像，预发区，客户镜像；CRM-RO；crm-ro-backup；客户库离线包。';
 const scan=scanDictionaries(s,text);assert.equal(scan.matches.length,5);
 for(const m of scan.matches)assert.equal(Array.from(text).slice(...m.span).join(''),m.text);
 assert.deepEqual(scan.matches[0].span,[1,5]);
 assert.equal(scan.matches.find(m=>m.text==='预发区').entry_refs.length,2);
 const offline=scan.matches.find(m=>m.text==='客户库离线包');assert.deepEqual(offline.entry_refs.map(i=>scan.entries[i].entry_id),['data.customer-export']);
 assert.equal(scan.entries.some(e=>Object.hasOwn(e,'value')),false);
 assert.equal(scanDictionaries(selectDictionaries(),text).matches.length,0);
 assert.equal(scanDictionaries(s,'客户镜像备份').matches.length,1); // Chinese substring is only a candidate hint.
 assert.equal(scanDictionaries(s,'').matches.length,0);
 const hints=dictionaryScanInstructions(scan);assert.ok(hints.includes('db.customer-mirror'));assert.ok(!hints.includes('online_read_replica'));assert.ok(!hints.includes('production'));
 assert.equal((hints.match(/"term":"客户镜像"/g)??[]).length,1);
 assert.equal(scan.semantic_resolution,'NOT_PERFORMED');
 const people=scanDictionaries(selectDictionaries({l3:'tenant-a@0.2.0'}),'白鹭核对');assert.equal(people.matches[0].entry_refs.length,2);
 const l2=scanDictionaries(selectDictionaries({l2:'software-ai@0.2.0'}),'inspect repo；审查仓库');assert.ok(l2.matches.some(m=>m.text==='inspect repo'));assert.ok(l2.matches.some(m=>m.text==='审查仓库'));
});
test('overlapping explicit aliases remain separate candidates without scanning definition prose',()=>{
 const s={sha256:'test',packs:[{id:'test',layer:'L3',version:'1',sha256:'p',files:[{path:'fixture',sha256:'f',data:{entries:[{id:'x',terms:['客户','客户镜像'],definition:'禁止修改生产数据库'},{id:'y',terms:['镜像']} ]}}]}]};
 const scan=scanDictionaries(s,'客户镜像；禁止修改生产数据库');assert.deepEqual(scan.matches.map(m=>m.text),['客户镜像','客户','镜像']);
 assert.equal(scan.entries.length,2);
});
test('browser marker preserves literal source and exposes every overlapping candidate without HTML execution',()=>{
 const code=fs.readFileSync('research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js','utf8');
 class Element{constructor(tag,text=''){this.tag=tag;this.textContent=text;this.children=[];}append(...x){this.children.push(...x);}replaceChildren(...x){this.children=x;}setAttribute(k,v){this[k]=v;}}
 const content=e=>e.textContent+e.children.map(content).join('');
 const context={el:(tag,text)=>new Element(tag,text),document:{createTextNode:text=>new Element('#text',text)}};vm.createContext(context);
 vm.runInContext(code.slice(code.indexOf('function renderDictionaryScan('),code.indexOf('function scheduleDictionaryScan(')),context);
 const text='😀客户镜像<script>bad()</script>',target=new Element('div'),scan={matches:[{span:[1,3],entry_refs:[0]},{span:[1,5],entry_refs:[1]}],entries:[{layer:'L2',pack_id:'a',entry_id:'x',path:'a.json',pointer:'/entries/0'},{layer:'L3',pack_id:'b',entry_id:'y',path:'b.json',pointer:'/entries/0'}]};
 context.renderDictionaryScan(target,text,scan);
 const preview=target.children[1];assert.equal(content(preview),text);assert.ok(preview.children.every(e=>['#text','button'].includes(e.tag)));
 preview.children.find(e=>e.tag==='button').onclick();assert.ok(content(target.children[2]).includes('L2'));assert.ok(content(target.children[2]).includes('L3'));
});
test('only selected packages; shared aliases preserved; missing names never assigned',()=>{
 assert.equal(dictionaryCatalog().length,17);
 const a=selectDictionaries(selection),b=selectDictionaries({l3:'tenant-b@0.1.0'});
 assert.deepEqual(lookupDictionary(a,{query:'白鹭'}).entries.map(r=>r.value.employee_id),['A009','A010']);
 assert.equal(lookupDictionary(a,{query:'小王'}).total,0);
 assert.equal(lookupDictionary(b,{query:'白鹭'}).total,0);
 assert.deepEqual(lookupDictionary(b,{query:'小王'}).entries.map(r=>r.value.employee_id),['b101']);
 assert.equal(lookupDictionary(a,{query:'不存在的客户库'}).total,0);
 assert.equal(lookupDictionary(selectDictionaries(),{query:'小王'}).total,0);
 assert.throws(()=>lookupDictionary(a,{query:'小王',pack_id:'tenant-b@0.1.0'}),/NOT_SELECTED/);
 for(const bad of [{l2:'../secret'}, {l3:'software-ai@0.2.0'}, {path:'anything'}, [],'a'])assert.throws(()=>selectDictionaries(bad),/INVALID/);
 const entries=lookupDictionary(a,{query:'release.deploy'}).entries;assert.ok(entries.some(r=>r.value.id==='release.deploy'));
 for(const entry of entries){assert.match(entry.file_sha256,/^[a-f0-9]{64}$/);assert.ok(entry.pointer.startsWith('/'));}
 const alias=lookupDictionary(selectDictionaries({l3:'example-software-team@0.1.0'}),{query:'上灰度'});assert.equal(alias.entries[0].value.mapsTo,'release.deploy');
 const broad=lookupDictionary(a,{query:'e'});assert.ok(broad.total>6);assert.equal(broad.next_offset,6);assert.notDeepEqual(broad.entries,lookupDictionary(a,{query:'e',offset:6}).entries);
 assert.ok(!dictionaryInstructions(a).includes('林溪'));assert.ok(dictionaryInstructions(a).length<1800);
});
test('every registered industry is packaged, searchable and isolated from unselected industries',()=>{
 const industries=dictionaryCatalog().filter(p=>p.layer==='L2'&&!p.test_only);
 assert.equal(industries.length,12);
 const available=fs.readdirSync('domain-packs/l2',{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name).sort();
 assert.deepEqual(industries.map(p=>p.id.split('@')[0]).sort(),available);
 for(const industry of industries){
  const snapshot=selectDictionaries({l2:industry.id}),pack=snapshot.packs[0];
  assert.equal(pack.files.length,7);
  const action=pack.files.find(f=>f.path.endsWith('/actions.json')).data.frames[0];
  const result=lookupDictionary(snapshot,{query:action.id});
  assert.ok(result.entries.some(row=>row.value.id===action.id),industry.id);
  assert.ok(result.entries.every(row=>row.pack_id===industry.id));
  const other=industries.find(p=>p.id!==industry.id);
  assert.throws(()=>lookupDictionary(snapshot,{query:action.id,pack_id:other.id}),/NOT_SELECTED/);
 }
});
test('MCP exposes a single read-only lookup and returns explicit errors',()=>{
 const s=selectDictionaries(selection),logs=[];
 assert.equal(handleDictionaryRPC({id:1,method:'tools/list'},s).result.tools.length,1);
 const call=(name,args)=>handleDictionaryRPC({id:2,method:'tools/call',params:{name,arguments:args}},s,x=>logs.push(x));
 assert.equal(call('lookup',{query:'小王'}).result.isError,false);
 assert.equal(call('write',{path:'x'}).result.isError,true);
 assert.equal(call('lookup',{query:'',path:'x'}).result.isError,true);assert.equal(logs.length,3);
 assert.equal(allowedDictionaryEvent({item:{type:'command_execution'}}),false);
 assert.equal(allowedDictionaryEvent({item:{type:'mcp_tool_call',server:'other',tool:'lookup'}}),false);
});
test('actual stdio server handshake and lookup without listening port or model',async t=>{
 const root=temp(t),snapshot=path.join(root,'snapshot.json'),log=path.join(root,'lookup.jsonl');fs.writeFileSync(snapshot,JSON.stringify(selectDictionaries(selection)));
 const child=spawn(process.execPath,['research/7plus1-parser/llm-first-028/dictionary-mcp.mjs',snapshot,log],{stdio:['pipe','pipe','pipe'],windowsHide:true});
 t.after(()=>child.kill());let out='',err='';child.stdout.on('data',b=>out+=b);child.stderr.on('data',b=>err+=b);
 child.stdin.end([{id:1,method:'initialize',params:{protocolVersion:'2024-11-05'}},{method:'notifications/initialized'},{id:2,method:'tools/list'},{id:3,method:'tools/call',params:{name:'lookup',arguments:{query:'白鹭'}}}].map(m=>JSON.stringify({jsonrpc:'2.0',...m})).join('\n')+'\n');
 const exit=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve);});assert.equal(exit,0,err);
 const replies=out.trim().split('\n').map(JSON.parse);assert.equal(replies.length,3);assert.equal(JSON.parse(replies[2].result.content[0].text).total,2);assert.equal(JSON.parse(fs.readFileSync(log,'utf8')).result.total,2);
});
test('generation and independent review use same snapshot; content stays out of prompts; calls preserved',async t=>{
 const root=temp(t),seen=[];
 const call=args=>callCodex({...args,execute:async(_binary,argv,options)=>{
  assert.ok(options.input.includes('SELECTED_DICTIONARIES'));assert.ok(options.input.includes('DICTIONARY_LEXICAL_HINTS'));assert.ok(options.input.includes('"term":"白鹭"'));assert.ok(!options.input.includes('林溪'));assert.ok(argv.includes('features.shell_tool=false'));assert.ok(argv.some(a=>a.startsWith('mcp_servers.boundx_dictionary.command=')));
  assert.ok(argv.includes('features.code_mode_host=true'));assert.ok(!argv.includes('features.code_mode_host=false'));
  const payload=JSON.parse(argv.find(a=>a.startsWith('mcp_servers.boundx_dictionary.args=')).split('=').slice(1).join('='));
  const snapshot=JSON.parse(fs.readFileSync(payload[1]));seen.push(snapshot.sha256);
  const result=lookupDictionary(snapshot,{query:'白鹭'});fs.appendFileSync(payload[2],JSON.stringify({arguments:{query:'白鹭'},result})+'\n');
  fs.writeFileSync(argv[argv.indexOf('--output-last-message')+1],args.bundle.phase==='parse'?'I：输入未明确。P：“白鹭”有两个候选，待明确。':'已查字典，保留同名疑点。');
  return {exit_code:0,elapsed_ms:5,timed_out:false,stderr:'',stdout:[{type:'thread.started',thread_id:args.bundle.phase},{type:'item.completed',item:{type:'mcp_tool_call',server:'boundx_dictionary',tool:'lookup'}},{type:'turn.completed'}].map(JSON.stringify).join('\n')};
 }});
 const r=await parse7Plus1(Buffer.from('白鹭核对报告。'),{output:root,probe,call,dictionaries:{...selection,l2:'auto-rental@1.0.0'},maxModelRequests:2,productSnapshot:{contract:'candidate-ir/2.0'}});
 assert.equal(r.dictionaries.packs.find(p=>p.layer==='L2').id,'auto-rental@1.0.0');
 assert.equal(r.dictionary_scan.matches[0].text,'白鹭');assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'dictionary-scan.json'))),r.dictionary_scan);
 assert.equal(seen.length,2);assert.equal(seen[0],seen[1]);assert.equal(r.dictionary_lookups.parse.length,1);assert.equal(r.dictionary_lookups.audit.length,1);assert.equal(r.dictionaries.sha256,seen[0]);assert.match(r.chinese,/生成实际查询 1 次/);assert.equal(r.technical.semantic_completeness,'NOT_PROGRAM_VERIFIED');
});
// Exercise the real HTTP handler in memory: no additional port, credentials or model.
async function request(server,url,{body,headers={}}={}){
 const req=Readable.from(body?[Buffer.from(JSON.stringify(body))]:[]);Object.assign(req,{method:body?'POST':'GET',url,headers:{host:'127.0.0.1:58618',...(body?{'content-type':'application/json'}:{}),...headers},socket:{localPort:58618}});
 const result=new Promise(resolve=>{let status=200,responseHeaders={};server.emit('request',req,{setHeader(k,v){responseHeaders[k]=v;},writeHead(s){status=s;},end(b){resolve({status,headers:responseHeaders,data:JSON.parse(b)});}});});
 return result;
}
test('HTTP selection reaches engine, rejects invalid IDs, and binds idempotency',async t=>{
 const root=temp(t);let received,finish;
 const server=createServer({dataRoot:root,legacyRoot:path.join(root,'empty'),productSnapshot:{contract:'candidate-ir/2.0'},catalog:{default_model:'test',default_reasoning:'medium',sha256:'offline',models:[{id:'test',reasoning:['medium']}]},parse:async(bytes,args)=>{received=args;await new Promise(resolve=>finish=resolve);throw Error('OFFLINE_TEST_DONE');}});
 const session=await request(server,'/api/session');assert.equal(session.data.dictionary_catalog.length,17);
 const headers={cookie:'boundx_session='+session.data.token,'x-boundx-session':session.data.token};
 assert.equal((await request(server,'/api/dictionaries/scan',{body:{text:'小王',dictionaries:selection}})).status,403);
 const scan=await request(server,'/api/dictionaries/scan',{body:{text:'白鹭',dictionaries:selection},headers});assert.equal(scan.status,200);assert.equal(scan.data.matches[0].entry_refs.length,2);assert.equal(received,undefined);assert.equal(server.records.size,0);
 assert.equal((await request(server,'/api/dictionaries/scan',{body:{text:'x',dictionaries:{l3:'bad'}},headers})).status,400);
 assert.equal((await request(server,'/api/dictionaries/scan',{body:{text:'a'.repeat(1024*1024+1)},headers})).status,413);
 const body={text:'任务',request_id:'10000000-0000-4000-8000-000000000102',model:'test',reasoning:'medium',parse_method:'SKILL',dictionaries:selection};
 assert.equal((await request(server,'/api/parse',{body:{...body,dictionaries:{l3:'bad'}},headers})).status,400);
 const first=await request(server,'/api/parse',{body,headers});assert.equal(first.status,202,JSON.stringify(first.data));assert.deepEqual(first.data.dictionaries,dictionaryIdentity(selectDictionaries(selection)));
 await new Promise(r=>setImmediate(r));assert.deepEqual(received.dictionaries,selection);
 assert.equal((await request(server,'/api/parse',{body,headers})).status,200);
 assert.equal((await request(server,'/api/parse',{body:{...body,dictionaries:{}},headers})).status,409);
 finish();await new Promise(r=>setImmediate(r));assert.equal(server.listening,false);
});
