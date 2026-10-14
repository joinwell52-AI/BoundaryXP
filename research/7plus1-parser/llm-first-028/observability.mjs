// Public CLI telemetry only. Hidden/raw reasoning, raw errors and partial candidate JSON stay private.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
export const defaultModel='gpt-6.1-sol';
export const defaultReasoning='medium';
export function modelCatalog(file=path.join(process.env.CODEX_HOME??path.join(os.homedir(),'.codex'),'models_cache.json')){
 let raw=null,data=null;try{raw=fs.readFileSync(file);data=JSON.parse(raw);}catch{}
 const models=(data?.models??[]).filter(m=>m.visibility==='list'&&m.supported_in_api!==false&&/^[a-z0-9][a-z0-9.-]{0,99}$/.test(m.slug)).map(m=>({id:m.slug,label:m.display_name??m.slug,reasoning:(m.supported_reasoning_levels??[]).map(r=>r.effort).filter(x=>['low','medium','high','xhigh','max'].includes(x))})).filter(m=>m.reasoning.length);
 if(!models.some(m=>m.id===defaultModel))models.unshift({id:defaultModel,label:defaultModel,reasoning:['low','medium','high']});
 return {models,default_model:defaultModel,default_reasoning:defaultReasoning,source:raw?'LOCAL_CODEX_CATALOG':'FIXED_DEFAULT_ONLY',fetched_at:data?.fetched_at??null,sha256:raw?createHash('sha256').update(raw).digest('hex'):null,availability:'CATALOG_NOT_LIVE_ACCOUNT_VERIFICATION'};
}
export function requestSettings(input,catalog){
 const model=input.model??defaultModel,reasoning=input.reasoning??defaultReasoning,entry=catalog.models.find(m=>m.id===model);
 if(!entry)throw Error('MODEL_SELECTION_NOT_AVAILABLE');
 if(!entry.reasoning.includes(reasoning))throw Error('REASONING_SELECTION_NOT_AVAILABLE');
 return {model,reasoning};
}
export function modelSignal(event){
 if(event?.type==='thread.started'&&typeof event.thread_id==='string'&&/^[a-zA-Z0-9-]{1,100}$/.test(event.thread_id))return {signal:'SESSION_STARTED',thread_id:event.thread_id};
 if(event?.type==='turn.started')return {signal:'TURN_STARTED'};
 if(event?.type==='turn.completed')return {signal:'TURN_COMPLETED'};
 if(event?.type==='turn.failed'||event?.type==='error')return {signal:'MODEL_ERROR_REPORTED'};
 // `reasoning.text` is the public summary emitted by codex exec --json, not raw model reasoning.
 // Never traverse unknown fields (raw_reasoning, encrypted_content, provider internals, etc.).
 const item=event?.item;
 const itemID=typeof item?.id==='string'&&/^[a-zA-Z0-9_.:-]{1,100}$/.test(item.id)?item.id:null;
 if(['item.started','item.updated','item.completed'].includes(event?.type)&&itemID){
  if(item.type==='reasoning'&&typeof item.text==='string'&&item.text.trim())return {signal:'PUBLIC_REASONING_SUMMARY',item_id:itemID,item_kind:'reasoning',item_status:event.type.slice(5),summary:publicSummary(item.text)};
  if(item.type==='error')return {signal:'SESSION_DIAGNOSTIC',item_id:itemID,item_kind:'error',item_status:event.type.slice(5)};
  if(['command_execution','mcp_tool_call','web_search','file_change','plan','todo_list'].includes(item.type))return {signal:'TOOL_ACTIVITY',item_id:itemID,item_kind:item.type,item_status:event.type.slice(5)};
 }
 // Agent text may be incomplete candidate JSON. Only the existing validated artifact is displayed.
 if(event?.type==='item.completed'&&event.item?.type==='agent_message')return {signal:'RESPONSE_RECEIVED'};
 return null;
}
function publicSummary(text){
 return text.slice(0,12000).replace(/\b(?:sk-[a-zA-Z0-9_-]{12,}|Bearer\s+[a-zA-Z0-9._-]{12,})/g,'[凭据已遮盖]');
}
export function publicProgress(p){
 const out={stage:p.stage,revision:Number.isSafeInteger(p.revision)?p.revision:0};
 if(typeof p.kind==='string'&&/^[A-Z_]{1,50}$/.test(p.kind))out.kind=p.kind;
 if(['parse','audit'].includes(p.phase))out.phase=p.phase;
 const s=modelSignal(p.event);if(s)Object.assign(out,s);
 if(p.signal&&['REQUEST_STARTED','SESSION_STARTED','TURN_STARTED','TURN_COMPLETED','MODEL_ERROR_REPORTED','RESPONSE_RECEIVED','TRANSPORT_RETRY','RESPONSE_VALIDATED','PARSE_READY','AUDIT_READY','TECHNICAL_READY','COMPILE_READY','REVISION_REQUIRED','REVISION_NOT_APPLIED','PUBLIC_REASONING_SUMMARY','SESSION_DIAGNOSTIC','TOOL_ACTIVITY'].includes(p.signal))out.signal=p.signal;
 if(typeof p.item_id==='string'&&/^[a-zA-Z0-9_.:-]{1,100}$/.test(p.item_id))out.item_id=p.item_id;
 if(['reasoning','error','command_execution','mcp_tool_call','web_search','file_change','plan','todo_list'].includes(p.item_kind))out.item_kind=p.item_kind;
 if(['started','updated','completed'].includes(p.item_status))out.item_status=p.item_status;
 if(out.signal==='PUBLIC_REASONING_SUMMARY'&&out.item_id&&typeof p.summary==='string')out.summary=publicSummary(p.summary);
 if(typeof p.thread_id==='string'&&/^[a-zA-Z0-9-]{1,100}$/.test(p.thread_id))out.thread_id=p.thread_id;
 if(Number.isSafeInteger(p.attempt)&&p.attempt>=0)out.attempt=p.attempt;
 if(Number.isSafeInteger(p.retry_count)&&p.retry_count>=0)out.retry_count=p.retry_count;
 if(p.kind==='IDENTITY_NORMALIZED'){out.signal='IDENTITY_NORMALIZED';for(const k of ['renamed_nodes','ambiguous_references'])if(Number.isSafeInteger(p[k])&&p[k]>=0)out[k]=p[k];}
 return out;
}
export function partialArtifacts(folder,record){
 const current=record.revision??0;
 const available=fs.existsSync(folder)?fs.readdirSync(folder).filter(x=>/^revision-\d+$/.test(x)).map(x=>Number(x.slice(9))).filter(n=>n<=current&&fs.existsSync(path.join(folder,`revision-${n}`,'proposal.json'))).sort((a,b)=>b-a):[];
 const artifactRevision=['FAILED','CANCELLED','INTERRUPTED'].includes(record.status)?available[0]??current:current;
 const read=name=>{try{return JSON.parse(fs.readFileSync(path.join(folder,`revision-${artifactRevision}`,name),'utf8'));}catch{return null;}};
 const proposal=read('proposal.json'),audit=read('audit.json'),technical=read('technical-validation.json'),ir=read('candidate-ir.json')??read('boundary-ir.json');
 // No canonical result here: an intermediate revision is never a final result.
 const calls={parse:[],audit:[]};
 for(const phase of ['parse','audit'])for(let attempt=0;attempt<3;attempt++){
  try{const receipt=JSON.parse(fs.readFileSync(path.join(folder,`revision-${record.revision??0}`,phase+'-call',`receipt-${attempt}.json`),'utf8'));
   calls[phase].push({thread_id:receipt.thread_id,elapsed_ms:receipt.elapsed_ms,exit_code:receipt.exit_code,usage:receipt.usage,skill_mode:receipt.skill_mode,actual_model:receipt.actual_model,schema_check:receipt.schema_check});
  }catch{}
 }
 return {revision:current,artifact_revision:artifactRevision,proposal,audit,technical,technical_precheck:read('technical-precheck.json'),ir,identity:read('proposal-mechanical-expansion.json')?.identity??null,model_calls:calls,provisional:true};
}
export function savedCallHistory(folder){
 const rows=[];
 if(!fs.existsSync(folder))return rows;
 for(const revisionName of fs.readdirSync(folder).filter(x=>/^revision-\d+$/.test(x)).sort((a,b)=>Number(a.slice(9))-Number(b.slice(9)))){
  for(const call_kind of ['parse','patch','audit']){
   const phase=call_kind==='patch'?'parse':call_kind;
   const calls=path.join(folder,revisionName,call_kind+'-call');if(!fs.existsSync(calls))continue;
   for(const name of fs.readdirSync(calls).filter(x=>/^receipt-\d+\.json$/.test(x)).sort((a,b)=>Number(a.slice(8,-5))-Number(b.slice(8,-5)))){
    try{const {thread_id,elapsed_ms,exit_code,usage,skill_mode,actual_model,schema_check}=JSON.parse(fs.readFileSync(path.join(calls,name),'utf8'));
     rows.push({revision:Number(revisionName.slice(9)),phase,call_kind,attempt:Number(name.slice(8,-5)),thread_id,elapsed_ms,exit_code,usage,skill_mode,actual_model,schema_check});
    }catch{}
   }
  }
 }
 return rows;
}
