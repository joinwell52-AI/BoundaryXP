import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {executable} from './providers/codex.mjs';
import {REPORT,save} from './util.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-027-catalog-'));
const revision=process.argv[2]??'r002',prefix=`${REPORT}/environment/catalog-${revision}`;
const p=spawn(executable(),['app-server','--stdio','-c','features.hooks=false','-c','features.plugins=false','-c','features.apps=false','-c','features.shell_tool=false','-c','features.multi_agent=false'],{cwd:dir,windowsHide:true});
let next=0,buffer='',stderr='';const pending=new Map();
p.stderr.on('data',b=>stderr+=b.toString());
p.stdout.on('data',b=>{buffer+=b.toString();let end;while((end=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,end);buffer=buffer.slice(end+1);try{const r=JSON.parse(line);const q=pending.get(r.id);if(q){pending.delete(r.id);r.error?q.reject(Error(JSON.stringify(r.error))):q.resolve(r.result);}}catch{}}});
const request=(method,params)=>new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});p.stdin.write(JSON.stringify({id,method,params})+'\n');});
const timer=setTimeout(()=>{for(const q of pending.values())q.reject(Error('CATALOG_TIMEOUT'));p.kill();},30000);
try{
 await request('initialize',{clientInfo:{name:'boundx-027-read-only-discovery',version:'0.4.0'},capabilities:{experimentalApi:true}});p.stdin.write(JSON.stringify({method:'initialized'})+'\n');
 const catalog=await request('model/list',{});
 // Only public model capability fields; never account identifiers/auth tokens.
 save(`${prefix}/MODEL-CATALOG.json`,{executable:executable(),models:catalog.data?.map(m=>({model:m.model,display_name:m.displayName,is_default:m.isDefault,default_reasoning:m.defaultReasoningEffort,supported_reasoning:m.supportedReasoningEfforts})),next_cursor:catalog.nextCursor??null});
 console.log(JSON.stringify(catalog.data?.map(m=>({model:m.model,is_default:m.isDefault}))));
}catch(e){save(`${prefix}/MODEL-CATALOG-ERROR.json`,{error:String(e)});console.log(String(e));process.exitCode=1;}
finally{clearTimeout(timer);p.kill();save(`${prefix}/stderr.txt`,stderr);}
