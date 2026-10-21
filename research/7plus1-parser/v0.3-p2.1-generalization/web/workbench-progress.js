const ms=(a,b)=>Math.max(0,Date.parse(b)-Date.parse(a));
export function requestStats(job,entry=null,now=new Date().toISOString()){
 const calls=entry?.calls??(job?.entries??[]).flatMap(e=>e.calls??[]);
 const timeline=(job?.timeline??[]).filter(e=>!entry||(e.node_id===entry.node_id&&e.at>=entry.started_at&&(!entry.ended_at||e.at<=entry.ended_at)));
 const finished=calls.filter(c=>c.status!=='RECEIPT_MISSING');
 const received=finished.reduce((s,c)=>s+(c.count??1),0);
 const started=timeline.filter(e=>e.signal==='REQUEST_STARTED');
 const sent=Math.max(calls.reduce((s,c)=>s+(c.count??1),0),started.length,entry?0:job?.request_count??0);
 const phases={};
 for(const [phase,stage]of [['GENERATE','PARSING'],['AUDIT','AUDITING'],['LOCAL_PARSE','LOCAL_PARSE']]){
  const records=finished.filter(c=>c.phase===phase),events=timeline.filter(e=>e.stage===stage),starts=events.filter(e=>e.signal==='REQUEST_STARTED');
  let total=records.reduce((s,c)=>s+(c.elapsed_ms??0),0);
  // For older jobs receipts were persisted only after a node completed. Use the
  // event interval for those calls, then switch to authoritative receipts.
  if(starts.length>records.reduce((s,c)=>s+(c.count??1),0)){
   total=0;for(let i=0;i<starts.length;i++){
    const start=starts[i],next=starts[i+1];
    const end=events.find(e=>e.at>=start.at&&(!next||e.at<next.at)&&e.signal==='REPORT_SAVED');
    total+=ms(start.at,end?.at??next?.at??entry?.ended_at??job?.ended_at??now);
   }
  }
  phases[phase]={count:Math.max(starts.length,calls.filter(c=>c.phase===phase).reduce((s,c)=>s+(c.count??1),0)),elapsed_ms:total};
 }
 return {sent,received,phases,timeline};
}
export function sameSettings(a,b){return !!a&&!!b&&a.model===b.model&&a.reasoning===b.reasoning&&a.parse_method===b.parse_method&&['l2','l3'].every(k=>(a.dictionaries?.[k]??null)===(b.dictionaries?.[k]??null));}
