// Execution telemetry only. Never expose model reasoning, raw errors or partial JSON.
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
 // Deliberately omit reasoning items and agent text. Only complete schema output is meaningful.
 if(event?.type==='item.completed'&&event.item?.type==='agent_message')return {signal:'RESPONSE_RECEIVED'};
 return null;
}
export function publicProgress(p){
 const out={stage:p.stage,revision:Number.isSafeInteger(p.revision)?p.revision:0};
 if(typeof p.kind==='string'&&/^[A-Z_]{1,50}$/.test(p.kind))out.kind=p.kind;
 if(['parse','audit'].includes(p.phase))out.phase=p.phase;
 const s=modelSignal(p.event);if(s)Object.assign(out,s);
 if(p.signal&&['REQUEST_STARTED','SESSION_STARTED','TURN_STARTED','TURN_COMPLETED','MODEL_ERROR_REPORTED','RESPONSE_RECEIVED','TRANSPORT_RETRY','RESPONSE_VALIDATED','PARSE_READY','AUDIT_READY','TECHNICAL_READY','COMPILE_READY','REVISION_REQUIRED'].includes(p.signal))out.signal=p.signal;
 if(typeof p.thread_id==='string'&&/^[a-zA-Z0-9-]{1,100}$/.test(p.thread_id))out.thread_id=p.thread_id;
 if(Number.isSafeInteger(p.attempt)&&p.attempt>=0)out.attempt=p.attempt;
 if(Number.isSafeInteger(p.retry_count)&&p.retry_count>=0)out.retry_count=p.retry_count;
 return out;
}
export function partialArtifacts(folder,record){
 const read=name=>{try{return JSON.parse(fs.readFileSync(path.join(folder,`revision-${record.revision??0}`,name),'utf8'));}catch{return null;}};
 const proposal=read('proposal.json'),audit=read('audit.json'),technical=read('technical-validation.json'),ir=read('boundary-ir.json');
 // No canonical result here: an intermediate revision is never a final result.
 const calls={parse:[],audit:[]};
 for(const phase of ['parse','audit'])for(let attempt=0;attempt<3;attempt++){
  try{const receipt=JSON.parse(fs.readFileSync(path.join(folder,`revision-${record.revision??0}`,phase+'-call',`receipt-${attempt}.json`),'utf8'));
   calls[phase].push({thread_id:receipt.thread_id,elapsed_ms:receipt.elapsed_ms,exit_code:receipt.exit_code,usage:receipt.usage,skill_mode:receipt.skill_mode,actual_model:receipt.actual_model,schema_check:receipt.schema_check});
  }catch{}
 }
 return {revision:record.revision??0,proposal,audit,technical,ir,model_calls:calls,provisional:true};
}
