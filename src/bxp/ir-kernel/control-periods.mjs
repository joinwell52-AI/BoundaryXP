// Temporal state evidence is explicit. A terminal boolean is not a state history.
import {UNKNOWN,toBase,compare} from './values.mjs';
import {fail} from './diagnostics.mjs';
export function controlPeriods(entry,rootTask){
 const p=entry?.periods;
 if(!p||p.completeness!=='EXACT_FOR_TASK_HORIZON'||p.task_id!==rootTask)return UNKNOWN;
 if(!Array.isArray(p.intervals))fail('CONTROL_PERIODS_REQUIRED',null,null,'QUERY');
 const out=[];
 for(const x of p.intervals){
  if(x.start==null||x.end==null)return UNKNOWN;
  if(typeof x.start_inclusive!=='boolean'||typeof x.end_inclusive!=='boolean')fail('CONTROL_ENDPOINTS_REQUIRED',null,null,'QUERY');
  const start=toBase(x.start,x.unit??'second'),end=toBase(x.end,x.unit??'second');
  if(compare(start,end)>0)fail('CONTROL_INTERVAL_REVERSED',null,null,'QUERY');
  if(compare(start,end)===0&&!(x.start_inclusive&&x.end_inclusive))continue;
  out.push({...x,start,end,unit:'second'});
 }
 return out;
}
export function activeWhile(record,periods){
 if(record?.occurred===false)return false;
 if(record?.occurred!==true||periods?.unknown||!record||record.start==null||record.end==null)return UNKNOWN;
 const start=toBase(record.start,record.unit??'second'),end=toBase(record.end,record.unit??'second');
 if(compare(start,end)>0)fail('EVENT_INTERVAL_REVERSED',record.id,null,'QUERY');
 // Event occupation is [start,end); a zero-duration event occupies its point.
 return periods.some(p=>{
  const point=compare(start,end)===0;
  const left=compare(point?start:end,p.start),right=compare(start,p.end);
  return (left>0||point&&left===0&&p.start_inclusive)&&(right<0||right===0&&p.end_inclusive);
 });
}
