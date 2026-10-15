import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Readable} from 'node:stream';
import {spawn} from 'node:child_process';
import {dictionaryCatalog,selectDictionaries,dictionaryIdentity,lookupDictionary,dictionaryInstructions} from '../research/7plus1-parser/llm-first-028/dictionaries.mjs';
import {handleDictionaryRPC} from '../research/7plus1-parser/llm-first-028/dictionary-mcp.mjs';
import {parse7Plus1} from '../research/7plus1-parser/llm-first-028/engine.mjs';
import {callCodex,allowedDictionaryEvent} from '../research/7plus1-parser/llm-first-028/provider.mjs';
import {createServer} from '../research/7plus1-parser/llm-first-028/service.mjs';
const selection={l2:'software-ai@0.2.0',l3:'tenant-a@0.2.0'};
const probe={binary:'OFFLINE_TEST_NO_MODEL',version:'fixture',outputs:{features:{stdout:'shell_tool stable true\napps stable true\ncode_mode_host stable true'}}};
const temp=t=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-dictionary-test-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;};
test('only selected packages; shared aliases preserved; missing names never assigned',()=>{
 assert.equal(dictionaryCatalog().length,17);
 const a=selectDictionaries(selection),b=selectDictionaries({l3:'tenant-b@0.1.0'});
 assert.equal(lookupDictionary(a,{query:'小王'}).total,2);
 assert.deepEqual(lookupDictionary(b,{query:'小王'}).entries.map(r=>r.value.employee_id),['b101']);
 assert.equal(lookupDictionary(a,{query:'不存在的客户库'}).total,0);
 assert.equal(lookupDictionary(selectDictionaries(),{query:'小王'}).total,0);
 assert.throws(()=>lookupDictionary(a,{query:'小王',pack_id:'tenant-b@0.1.0'}),/NOT_SELECTED/);
 for(const bad of [{l2:'../secret'}, {l3:'software-ai@0.2.0'}, {path:'anything'}, [],'a'])assert.throws(()=>selectDictionaries(bad),/INVALID/);
 const entries=lookupDictionary(a,{query:'release.deploy'}).entries;assert.ok(entries.some(r=>r.value.id==='release.deploy'));
 for(const entry of entries){assert.match(entry.file_sha256,/^[a-f0-9]{64}$/);assert.ok(entry.pointer.startsWith('/'));}
 const alias=lookupDictionary(selectDictionaries({l3:'example-software-team@0.1.0'}),{query:'上灰度'});assert.equal(alias.entries[0].value.mapsTo,'release.deploy');
 const broad=lookupDictionary(a,{query:'e'});assert.ok(broad.total>6);assert.equal(broad.next_offset,6);assert.notDeepEqual(broad.entries,lookupDictionary(a,{query:'e',offset:6}).entries);
 assert.ok(!dictionaryInstructions(a).includes('王明'));assert.ok(dictionaryInstructions(a).length<1800);
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
 child.stdin.end([{id:1,method:'initialize',params:{protocolVersion:'2024-11-05'}},{method:'notifications/initialized'},{id:2,method:'tools/list'},{id:3,method:'tools/call',params:{name:'lookup',arguments:{query:'小王'}}}].map(m=>JSON.stringify({jsonrpc:'2.0',...m})).join('\n')+'\n');
 const exit=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve);});assert.equal(exit,0,err);
 const replies=out.trim().split('\n').map(JSON.parse);assert.equal(replies.length,3);assert.equal(JSON.parse(replies[2].result.content[0].text).total,2);assert.equal(JSON.parse(fs.readFileSync(log,'utf8')).result.total,2);
});
test('generation and independent review use same snapshot; content stays out of prompts; calls preserved',async t=>{
 const root=temp(t),seen=[];
 const call=args=>callCodex({...args,execute:async(_binary,argv,options)=>{
  assert.ok(options.input.includes('SELECTED_DICTIONARIES'));assert.ok(!options.input.includes('王明'));assert.ok(argv.includes('features.shell_tool=false'));assert.ok(argv.some(a=>a.startsWith('mcp_servers.boundx_dictionary.command=')));
  assert.ok(argv.includes('features.code_mode_host=true'));assert.ok(!argv.includes('features.code_mode_host=false'));
  const payload=JSON.parse(argv.find(a=>a.startsWith('mcp_servers.boundx_dictionary.args=')).split('=').slice(1).join('='));
  const snapshot=JSON.parse(fs.readFileSync(payload[1]));seen.push(snapshot.sha256);
  const result=lookupDictionary(snapshot,{query:'小王'});fs.appendFileSync(payload[2],JSON.stringify({arguments:{query:'小王'},result})+'\n');
  fs.writeFileSync(argv[argv.indexOf('--output-last-message')+1],args.bundle.phase==='parse'?'I：输入未明确。P：“小王”有两个候选，待明确。':'已查字典，保留同名疑点。');
  return {exit_code:0,elapsed_ms:5,timed_out:false,stderr:'',stdout:[{type:'thread.started',thread_id:args.bundle.phase},{type:'item.completed',item:{type:'mcp_tool_call',server:'boundx_dictionary',tool:'lookup'}},{type:'turn.completed'}].map(JSON.stringify).join('\n')};
 }});
 const r=await parse7Plus1(Buffer.from('小王核对报告。'),{output:root,probe,call,dictionaries:{...selection,l2:'auto-rental@1.0.0'},maxModelRequests:2,productSnapshot:{contract:'candidate-ir/2.0'}});
 assert.equal(r.dictionaries.packs.find(p=>p.layer==='L2').id,'auto-rental@1.0.0');
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
 const body={text:'任务',request_id:'10000000-0000-4000-8000-000000000102',model:'test',reasoning:'medium',parse_method:'SKILL',dictionaries:selection};
 assert.equal((await request(server,'/api/parse',{body:{...body,dictionaries:{l3:'bad'}},headers})).status,400);
 const first=await request(server,'/api/parse',{body,headers});assert.equal(first.status,202,JSON.stringify(first.data));assert.deepEqual(first.data.dictionaries,dictionaryIdentity(selectDictionaries(selection)));
 await new Promise(r=>setImmediate(r));assert.deepEqual(received.dictionaries,selection);
 assert.equal((await request(server,'/api/parse',{body,headers})).status,200);
 assert.equal((await request(server,'/api/parse',{body:{...body,dictionaries:{}},headers})).status,409);
 finish();await new Promise(r=>setImmediate(r));assert.equal(server.listening,false);
});
