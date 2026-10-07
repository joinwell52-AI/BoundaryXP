import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn,spawnSync,execFileSync} from 'node:child_process';
import {save,sha} from '../util.mjs';
export function executable(){
 let detected=[];try{detected=execFileSync('where.exe',['codex'],{encoding:'utf8'}).split(/\r?\n/u).filter(p=>p.endsWith('.exe'));}catch{}
 const candidates=[process.env.BOUNDX_CODEX_EXECUTABLE,...detected,path.join(process.env.APPDATA??'', 'npm/node_modules/@openai/codex/node_modules/@openai/codex-win32-x64/vendor/x86_64-pc-windows-msvc/bin/codex.exe')].filter(Boolean);
 const found=candidates.find(p=>path.isAbsolute(p)&&p.endsWith('.exe')&&fs.existsSync(p));
 if(!found)throw Error('CODEX_EXECUTABLE_UNAVAILABLE');return found;
}
const features=['shell_tool','multi_agent','hooks','apps','plugins','remote_plugin','memories','tool_suggest','browser_use','browser_use_external','browser_use_full_cdp_access','computer_use','image_generation','skill_search'];
const redact=s=>s.replace(/\bsk-[A-Za-z0-9_-]{12,}\b/gu,'[REDACTED_CREDENTIAL]').replace(/Bearer\s+[A-Za-z0-9_.-]{20,}/giu,'Bearer [REDACTED_CREDENTIAL]');
export class CodexProvider{
 constructor({model='gpt-6.1-sol',reasoning='medium',timeout_ms=240000}={}){this.name='codex-local';this.model=model;this.reasoning=reasoning;this.timeout_ms=timeout_ms;this.exe=executable();}
 async call(prompt,schema,receipt){
  if(fs.existsSync(receipt))throw Error('PROVIDER_RECEIPT_EXISTS');
  const work=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-027-'));
  const schemaFile=path.join(work,'schema.json'),last=path.join(work,'response.json');
  fs.writeFileSync(schemaFile,JSON.stringify(schema),{encoding:'utf8',flag:'wx'});
  // This temporary directory contains only the request/contract/schema; no repository,
  // assertions, case identifiers, prior output or model answer is copied into it.
  fs.writeFileSync(path.join(work,'request.txt'),prompt,{encoding:'utf8',flag:'wx'});
  const args=['exec','--ignore-user-config','--ignore-rules','--ephemeral','--skip-git-repo-check','--sandbox','read-only','--json','--color','never','--output-schema',schemaFile,'--output-last-message',last,'--cd',work,'--model',this.model,'-c',`model_reasoning_effort=${JSON.stringify(this.reasoning)}`,'-c','project_doc_max_bytes=0','-c','web_search="disabled"',...features.flatMap(f=>['-c',`features.${f}=false`]),'-'];
  save(`${receipt}/request.txt`,prompt);save(`${receipt}/schema.json`,schema);
  const version=spawnSync(this.exe,['--version'],{encoding:'utf8',windowsHide:true}).stdout?.trim();
  const started=Date.now(),p=spawn(this.exe,args,{cwd:work,windowsHide:true,stdio:['pipe','pipe','pipe']});
  let stdout='',stderr='',timeout=false,spawnError=null;
  p.stdout.on('data',b=>stdout+=b.toString('utf8'));p.stderr.on('data',b=>stderr+=b.toString('utf8'));p.on('error',e=>spawnError=String(e));
  p.stdin.on('error',()=>{});p.stdin.end(prompt);
  const timer=setTimeout(()=>{timeout=true;p.kill();},this.timeout_ms);
  const exit=await new Promise(resolve=>p.on('close',(code,signal)=>resolve({code,signal})));clearTimeout(timer);
  save(`${receipt}/stdout.jsonl`,redact(stdout));save(`${receipt}/stderr.txt`,redact(stderr));
  const events=stdout.trim().split('\n').flatMap(l=>{try{return [JSON.parse(l)];}catch{return [];}});
  const forbidden=events.filter(e=>['item.started','item.completed'].includes(e.type)&&e.item&&!['agent_message','reasoning','user_message'].includes(e.item.type));
  const response=fs.existsSync(last)?fs.readFileSync(last,'utf8'):null;
  if(response!==null)save(`${receipt}/response.json`,redact(response));
  const manifest={provider:this.name,mode:'AUTOMATIC_CODEX_EXEC',executable:this.exe,executable_sha256:sha(fs.readFileSync(this.exe)),version,model_configuration:{requested_model:this.model,reasoning:this.reasoning,user_config_loaded:false,tools_enabled:false},command:{executable:this.exe,args,cwd:work,stdin:'request.txt'},request_sha256:sha(Buffer.from(prompt)),schema_sha256:sha(Buffer.from(JSON.stringify(schema))),exit_code:exit.code,signal:exit.signal,timeout,spawn_error:spawnError,elapsed_ms:Date.now()-started,forbidden_tool_events:forbidden,events:events.map(e=>({type:e.type,usage:e.usage??null,error:e.error??null})),temporary_directory_preserved:true,response_sha256:response===null?null:sha(Buffer.from(response))};
  save(`${receipt}/RECEIPT.json`,manifest);
  if(exit.code!==0||timeout||spawnError||forbidden.length||response===null){const e=Error('CODEX_AUTOMATIC_CALL_FAILED');e.receipt=manifest;throw e;}
  try{return {value:JSON.parse(response),receipt:manifest};}catch{throw Error('CODEX_RESPONSE_NOT_JSON');}
 }
}
