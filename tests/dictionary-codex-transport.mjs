// Explicit non-model integration probe. Never calls turn/start or sends task text.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {spawn} from 'node:child_process';
import {discoverCodex,dictionaryMcpFlags} from '../research/7plus1-parser/llm-first-028/provider.mjs';
import {selectDictionaries} from '../research/7plus1-parser/llm-first-028/dictionaries.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-dictionary-codex-'));
const snapshot=path.join(root,'snapshot.json'),log=path.join(root,'lookups.jsonl');fs.writeFileSync(snapshot,JSON.stringify(selectDictionaries({l3:'tenant-a@0.2.0'})));
const child=spawn(discoverCodex(),['app-server','--stdio','-c','mcp_servers={}','-c','project_doc_max_bytes=0','-c','features.skip_host_skill_discovery=true','-c','features.apps=false','-c','features.plugins=false',...dictionaryMcpFlags(snapshot,log)],{windowsHide:true,stdio:['pipe','pipe','pipe']});
let sequence=0,buffer='',stderr='';const pending=new Map();
child.stdout.on('data',b=>{buffer+=b;let end;while((end=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,end);buffer=buffer.slice(end+1);try{const msg=JSON.parse(line);if(pending.has(msg.id)){const {resolve,reject,timer}=pending.get(msg.id);clearTimeout(timer);pending.delete(msg.id);msg.error?reject(Error(JSON.stringify(msg.error))):resolve(msg.result);}}catch{}}});
child.stderr.on('data',b=>stderr+=b);child.on('error',e=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(e);}});child.on('exit',code=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('CODEX_EXIT:'+code));}});
const rpc=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(Error('RPC_TIMEOUT:'+method));},25000);pending.set(id,{resolve,reject,timer});child.stdin.write(JSON.stringify({id,method,params})+'\n');});
try{
 await rpc('initialize',{clientInfo:{name:'boundx_dictionary_check',version:'1.0.0'},capabilities:{experimentalApi:true}});
 child.stdin.write(JSON.stringify({method:'initialized',params:{}})+'\n');
 const status=await rpc('mcpServerStatus/list',{serverName:'boundx_dictionary'});
 console.log(JSON.stringify({stage:'mcp_status',status,model_calls:0}));
}finally{child.stdin.end();child.kill();for(const p of pending.values())clearTimeout(p.timer);fs.rmSync(root,{recursive:true,force:true});}
