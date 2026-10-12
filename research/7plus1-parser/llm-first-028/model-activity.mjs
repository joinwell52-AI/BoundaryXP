// Read-only projection of the public codex exec JSONL stream. Never reconstruct internal thinking.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {modelSignal} from './observability.mjs';
const terminals=new Set(['COMPLETED','COMPLETED_WITH_UNRESOLVED','FAILED','CANCELLED','INTERRUPTED']);
const maxLogBytes=8*1024*1024;
export function sessionActivity(folder,record){
 const calls=new Map();
 const get=(revision,phase,attempt)=>{
  const key=`${revision}:${phase}:${attempt}`;
  if(!calls.has(key))calls.set(key,{id:key,revision,phase,attempt,thread_id:null,status:'STARTED',events:[],summaries:[],log:null});
  return calls.get(key);
 };
 const append=(call,event,at=null,origin='LIVE_CALLBACK',sequence=null)=>{
  const existing=call.events.find(x=>event.item_id?x.item_id===event.item_id&&x.signal===event.signal:x.signal===event.signal);
  const row={...event,at,origin,sequence};
  if(existing){Object.assign(existing,row,{at:existing.at??at});}else call.events.push(row);
  if(event.thread_id)call.thread_id=event.thread_id;
  if(event.signal==='TURN_COMPLETED')call.status='COMPLETED';
  if(event.signal==='MODEL_ERROR_REPORTED')call.status='FAILED';
 };
 // Callbacks are timestamped when received; old JSONL without timestamps must not acquire invented times.
 const attempts=new Map();
 for(const p of record.stages??[]){
  if(!['parse','audit'].includes(p.phase)||!Number.isSafeInteger(p.revision??0))continue;
  const revision=p.revision??0,phaseKey=`${revision}:${p.phase}`;
  if(p.signal==='REQUEST_STARTED')attempts.set(phaseKey,p.attempt??0);
  const attempt=p.attempt??attempts.get(phaseKey)??0;
  const signal=['REQUEST_STARTED','SESSION_STARTED','TURN_STARTED','TURN_COMPLETED','MODEL_ERROR_REPORTED','RESPONSE_RECEIVED','TRANSPORT_RETRY','RESPONSE_VALIDATED','PUBLIC_REASONING_SUMMARY','SESSION_DIAGNOSTIC','TOOL_ACTIVITY'].includes(p.signal)?p.signal:null;
  if(!signal)continue;
  // Revalidate stored public fields rather than returning arbitrary stage payloads.
  let event;
  if(signal==='PUBLIC_REASONING_SUMMARY')event=modelSignal({type:'item.'+(p.item_status??'completed'),item:{id:p.item_id,type:'reasoning',text:p.summary}});
  else if(signal==='SESSION_DIAGNOSTIC'||signal==='TOOL_ACTIVITY')event=modelSignal({type:'item.'+(p.item_status??'completed'),item:{id:p.item_id,type:p.item_kind}});
  else event=modelSignal({type:{SESSION_STARTED:'thread.started',TURN_STARTED:'turn.started',TURN_COMPLETED:'turn.completed',MODEL_ERROR_REPORTED:'turn.failed',RESPONSE_RECEIVED:'item.completed'}[signal],thread_id:p.thread_id,item:{type:'agent_message'}})??{signal};
  if(event)append(get(revision,p.phase,attempt),event,p.at??null);
 }
 // Exact recorded files only: no neighbor text, global sessions, raw stderr or prompt content.
 const revision=Number.isSafeInteger(record.revision)&&record.revision>=0?Math.min(record.revision,10):0;
 for(let r=0;r<=revision;r++)for(const phase of ['parse','audit'])for(let attempt=0;attempt<3;attempt++){
  const rel=`revision-${r}/${phase}-call/events-${attempt}.jsonl`,file=path.join(folder,rel);
  if(!fs.existsSync(file))continue;
  const call=get(r,phase,attempt),size=fs.statSync(file).size;
  if(size>maxLogBytes){call.log={path:rel,read_status:'TOO_LARGE',bytes:size};continue;}
  const bytes=fs.readFileSync(file),lines=bytes.toString('utf8').split('\n');
  let parsed=0,malformed=0,partial=0;
  for(let i=0;i<lines.length;i++){
   if(!lines[i].trim())continue;
   let event;try{event=JSON.parse(lines[i]);parsed++;}catch{if(i===lines.length-1&&!terminals.has(record.status))partial++;else malformed++;continue;}
   const signal=modelSignal(event);if(signal)append(call,signal,null,'SAVED_CODEX_JSONL',i+1);
  }
  call.log={path:rel,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:size,parsed_events:parsed,malformed_lines:malformed,incomplete_lines:partial,read_status:malformed?'PARTIAL_READ':'READ'};
 }
 const ordered=[...calls.values()].sort((a,b)=>a.revision-b.revision||(a.phase==='parse'?0:1)-(b.phase==='parse'?0:1)||a.attempt-b.attempt);
 for(const c of ordered){
  c.summaries=c.events.filter(e=>e.signal==='PUBLIC_REASONING_SUMMARY').map(e=>({item_id:e.item_id,text:e.summary,at:e.at,status:e.item_status,origin:e.origin,sequence:e.sequence}));
  c.diagnostic_count=c.events.filter(e=>e.signal==='SESSION_DIAGNOSTIC').length;
  if(c.status==='STARTED'&&terminals.has(record.status))c.status=record.status.startsWith('COMPLETED')?'ENDED':'STOPPED';
  const completed=['COMPLETED','ENDED','STOPPED','FAILED'].includes(c.status);
  c.summary_status=c.summaries.length?'AVAILABLE':!completed?'NOT_YET_RETURNED':!c.log?'NOT_RECORDED':c.log.read_status==='READ'?'NOT_RETURNED':'UNVERIFIABLE';
 }
 return {kind:'PUBLIC_CODEX_SESSION_ACTIVITY',hidden_reasoning_included:false,semantic_evidence:false,provisional:!terminals.has(record.status),calls:ordered};
}
