import {evaluateCore} from './evaluate.mjs';import {preparePlan,planEvent,taskContains} from './events.mjs';import {UNKNOWN,unknown,not,or,and,compare,add,toBase,stable} from './values.mjs';
export function evaluateRequirements(core,query={}){
 const context={...query,plan:preparePlan(core,query.plan)},rows=[];
 for(const id of query.requirements??core.requirements){
  const r=core.nodes[id],app=r.applicability?evaluateCore(core,r.applicability,context):true;
  let value=app===false?true:evaluateCore(core,r.body,context);
  const event=ref=>{const v=evaluateCore(core,ref,context);return planEvent(core,context,v.event);};
  if(app!==false&&['EVENT_NORM','STOP'].includes(r.kind))value=and([event(r.subject)?.occurred??UNKNOWN,value]);
  if(app!==false&&r.kind==='CONSTRAINT'&&r.subject?.kind==='EVENT'&&core.nodes[r.subject.id]?.kind!=='TASK')value=or([not(event(r.subject)?.occurred??UNKNOWN),value]);
  if(app!==false&&r.kind==='TOTAL_DURATION'){
   const duration=evaluateCore(core,r.subject,context),task=context.plan.events.find(e=>e.id===r.scope_id)??context.event_values?.[r.scope_id];
   const valid=task?.start!=null&&task?.end!=null&&!unknown(duration)?compare(task.end,add(task.start,duration.number))===0&&compare(duration.number,'0')>=0:UNKNOWN;
   const all=[...context.plan.events,...Object.values(context.event_values??{})],horizon=all.filter(e=>e.id!==r.scope_id&&taskContains(core,e.task_id??core.nodes[e.id]?.owner_id,r.scope_id)).map(e=>e.occurred===false?true:e.start!=null&&e.end!=null&&task?.start!=null&&task?.end!=null?compare(e.start,task.start)>=0&&compare(e.end,task.end)<=0:UNKNOWN);
   value=and([value,valid,...horizon]);
  }
  if(app!==false&&r.kind==='DATA_USE'){
   const use=r.data_use,consumer=event(use.consumer);let available=UNKNOWN;
   if(use.producer&&use.availability==='COMPLETE_RESULT'){const producer=event(use.producer);available=producer?.occurred!=null&&producer?.completed!=null&&producer?.end!=null&&consumer?.start!=null?producer.occurred&&producer.completed&&compare(producer.end,consumer.start)<=0:UNKNOWN;}
   else{const key=stable({object:evaluateCore(core,use.object,context),producer:use.producer?evaluateCore(core,use.producer,context):null}),entry=context.availability?.[key];if(entry&&consumer?.start!=null){const point=toBase(entry.at,entry.unit??'second');available=compare(point,consumer.start)<=0;if(use.producer){const producer=event(use.producer);available=and([available,producer?.occurred??UNKNOWN,producer?.start!=null&&producer?.end!=null?compare(producer.start,point)<=0&&compare(point,producer.end)<=0:UNKNOWN]);}}}
   value=and([value,or([not(consumer?.occurred??UNKNOWN),available])]);
  }
  if(r.modality==='FORBIDDEN'&&app!==false)value=not(value);
  if(unknown(app))value=or([not(app),value]);
  rows.push({id,modality:r.modality,value,constraining:!['PERMITTED','NOT_REQUIRED','UNSTATED'].includes(r.modality)});
 }
 return {rows,result:rows.some(r=>r.constraining&&r.value===false)?'VIOLATED':rows.some(r=>r.constraining&&unknown(r.value))?'UNKNOWN':'SATISFIED',business_decision:null,execution_authorization:null};
}
