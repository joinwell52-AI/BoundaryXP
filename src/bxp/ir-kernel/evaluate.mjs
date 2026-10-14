import {UNKNOWN,unknown,and,or,not,unique,identity,compare,add,toBase,stable} from './values.mjs';import {fail} from './diagnostics.mjs';import {resolveInstance,instanceDefinition} from './instances.mjs';
import {planEvent,taskContains} from './events.mjs';
import {controlPeriods,activeWhile} from './control-periods.mjs';
export function evaluateCore(core,reference,context={},bindings={}){
 const nodes=core.nodes,plan=context.plan??{},records=plan.events??[],budget={steps:0,max:context.maxSteps??100000};
 const find=(r,env)=>r.kind==='VARIABLE'?(Object.hasOwn(env,r.id)?env[r.id]:Object.hasOwn(context.variables??{},r.id)?context.variables[r.id]:UNKNOWN):r.kind==='EVENT'?{event:r.id}:r.kind==='ENTITY'?{object:r.id}:null;
 const record=e=>planEvent(core,context,e.event),eventDef=e=>nodes[record(e)?.template_id??e.event]??instanceDefinition(core,e.event)??null;
 const visit=(r,env,depth=0)=>{
  if(++budget.steps>budget.max||depth>128)fail('EVALUATION_LIMIT',r.id,null,'RESOURCE');
  if(r.kind==='ENTITY'||r.kind==='EVENT'||r.kind==='VARIABLE')return find(r,env);
  if(r.kind==='STATE'){const s=nodes[r.id],subject=s.subject?visit(s.subject,env,depth+1):null;return {state:stable([r.id,subject?.event??null]),fallback:subject?.event?null:r.id};}
  const n=nodes[r.id];if(!n)fail('CORE_REF_MISSING',r.id);
  const go=x=>visit(x,env,depth+1),op=n.operator,ar=n.arguments;
  if(['FORALL','EXISTS','SELECT_EVENTS'].includes(op)){
   const domain=go(ar[0]);if(unknown(domain))return UNKNOWN;
   const values=domain?.set;if(!values)fail('FINITE_DOMAIN_REQUIRED',n.id);
   const evaluated=values.map(v=>visit(ar[1],{...env,[n.bound_variable.id]:v},depth+1));
   if(op==='SELECT_EVENTS'){if(evaluated.some(unknown))return UNKNOWN;return {set:values.filter((_,i)=>evaluated[i]),...(domain.open?{open:true}:{})};}
   return op==='FORALL'?and([...evaluated,...(domain.open?[UNKNOWN]:[])]):or([...evaluated,...(domain.open?[UNKNOWN]:[])]);
  }
  if(op==='AND'||op==='OR'){const values=[];for(const r of ar){const v=go(r);if(v===(op==='OR'))return v;values.push(v);}return op==='AND'?and(values):or(values);}
  if(op==='IMPLIES'){const a=go(ar[0]);return a===false?true:or([not(a),go(ar[1])]);}
  const a=ar.map(go);if(op==='BOOLEAN')return n.literal;if(op==='NUMBER')return {number:toBase(n.literal,n.unit)};
  if(op==='SYMBOL')return {symbol:n.literal};
  if(op==='SET')return a.some(unknown)?UNKNOWN:{set:unique(a)};
  if(op==='GROUP_MEMBERS')return {set:unique(nodes[ar[0].id].members.map(go))};
  if(op==='TASK_EVENTS'){
   const task=a[0].event,open=plan.completeness?.kind!=='EXACT_SNAPSHOT'||plan.completeness.task_id!==core.root_task;
   const belongs=id=>taskContains(core,id,task);
   return {set:records.filter(e=>nodes[e.template_id??e.id]?.kind!=='TASK'&&(n.literal===false?e.task_id===task:belongs(e.task_id))).map(e=>({event:e.id})),...(open?{open:true}:{})};
  }
  if(op==='TASK_EXTERNAL_INPUTS')return Object.hasOwn(plan.external_inputs??{},a[0].event)?{set:unique(plan.external_inputs[a[0].event].map(id=>({object:id})))}:UNKNOWN;
  if(op==='ACTIVE_WHILE'){
   if(a.some(unknown))return UNKNOWN;
   if(record(a[0])?.occurred===false)return false;
   const entry=context.states?.[a[1].state]??(a[1].fallback?context.states?.[a[1].fallback]:null);
   return activeWhile(record(a[0]),controlPeriods(entry,core.root_task));
  }
  if(op==='ACTIVITY_CLASSES_OF'){
   const roles=record(a[0])?.roles??eventDef(a[0])?.roles,classes=roles?.filter(r=>r.role==='ACTIVITY_CLASS');
   return classes?.length?{set:unique(classes.map(r=>go(r.value)))}:UNKNOWN;
  }
  if(a.some(unknown))return UNKNOWN;
  if(a.some(x=>x?.open)&&['UNION','INTERSECTION','DIFFERENCE','EQ','CARDINALITY','COUNT_STARTED'].includes(op))return UNKNOWN;
  const num=x=>x.number??fail('NUMERIC_VALUE_REQUIRED',n.id);
  if(op==='INTEGER_RANGE'){const lo=BigInt(num(a[0])),hi=BigInt(num(a[1]));if(hi-lo>10000n)fail('INSTANCE_LIMIT',n.id,null,'RESOURCE');return {set:Array.from({length:Number(hi>=lo?hi-lo+1n:0n)},(_,i)=>({number:String(lo+BigInt(i))}))};}
  if(op==='REAL_INTERVAL')return {interval:[num(a[0]),num(a[1])]};
  if(['UNION','INTERSECTION','DIFFERENCE'].includes(op)){const sets=a.map(v=>v.set);if(sets.some(x=>!x))return UNKNOWN;let values=op==='UNION'?sets.flat():sets[0].filter(x=>op==='INTERSECTION'?sets.every(s=>s.some(y=>identity(x)===identity(y))):!sets[1].some(y=>identity(x)===identity(y)));return {set:unique(values)};}
  if(op==='MEMBER')return a[1].set?(a[1].set.some(x=>identity(x)===identity(a[0]))?true:a[1].open?UNKNOWN:false):a[1].interval?compare(num(a[0]),a[1].interval[0])>=0&&compare(num(a[0]),a[1].interval[1])<=0:UNKNOWN;
  if(op==='SUBSET')return and([...a[0].set.map(x=>a[1].set.some(y=>identity(x)===identity(y))?true:a[1].open?UNKNOWN:false),...(a[0].open?[UNKNOWN]:[])]);
  if(op==='CARDINALITY')return {number:String(a[0].set.length)};
  if(op==='EQ')return a[0].number!==undefined&&a[1].number!==undefined?compare(num(a[0]),num(a[1]))===0:a[0].set&&a[1].set?identity([...a[0].set.map(identity)].sort())===identity([...a[1].set.map(identity)].sort()):identity(a[0])===identity(a[1]);
  if(op==='ADD')return {number:a.map(num).reduce(add,'0')};
  if(['LT','LTE','GT','GTE','BEFORE'].includes(op)){const c=compare(num(a[0]),num(a[1]));return ({LT:c<0,LTE:c<=0,GT:c>0,GTE:c>=0,BEFORE:c<0})[op];}
  if(op==='NOT')return not(a[0]);if(op==='IFF')return a[0]===a[1];
  if(op==='EVENT_INSTANCE'||op==='PREVIOUS_INSTANCE')return resolveInstance(core,r,x=>num(go(x)),env);
  if(['EVENT_OCCURRED','EVENT_COMPLETED','EVENT_SUCCEEDED','EVENT_START','EVENT_END'].includes(op)){const e=record(a[0]);if(!e)return UNKNOWN;const field={EVENT_OCCURRED:'occurred',EVENT_COMPLETED:'completed',EVENT_SUCCEEDED:'succeeded',EVENT_START:'start',EVENT_END:'end'}[op];return e[field]==null?UNKNOWN:field==='start'||field==='end'?{number:toBase(e[field],e.unit??'second')}:e[field];}
  if(['ACTORS_OF','TARGETS_OF','RECIPIENTS_OF','OBJECT_OF','RECIPIENT_OF','ENVIRONMENT_OF','OPERATION_OF'].includes(op)){
   const rec=record(a[0]),def=eventDef(a[0]),roles=rec?.roles??def?.roles;
   if(op==='OPERATION_OF')return (rec?.operation??(def?.operation_extent==='EXACT'&&def?.operation))?{symbol:rec?.operation??def.operation}:UNKNOWN;
   if(!roles)return UNKNOWN;const names={ACTORS_OF:['PERFORMER'],TARGETS_OF:['OBJECT','INPUT_OBJECT','RESULT','DELIVERABLE'],RECIPIENTS_OF:['RECIPIENT'],OBJECT_OF:['OBJECT','INPUT_OBJECT','RESULT','DELIVERABLE'],RECIPIENT_OF:['RECIPIENT'],ENVIRONMENT_OF:['ENVIRONMENT']}[op];
   const vals=unique(roles.filter(x=>names.includes(x.role)).map(x=>go(x.value)));
   if(!vals.length||vals.some(unknown))return UNKNOWN;
   return op.endsWith('S_OF')?{set:vals}:vals.length===1?vals[0]:UNKNOWN;
  }
  if(op==='COUNT_STARTED'){const vals=a[0].set.map(e=>record(e)?.occurred);return vals.some(x=>x==null)?UNKNOWN:{number:String(vals.filter(Boolean).length)};}
  if(op==='STATE_VALUE'||op==='STATE_ESTABLISHED'){const s=context.states?.[a[0].state]??(a[0].fallback?context.states?.[a[0].fallback]:null);return s==null?UNKNOWN:op==='STATE_VALUE'?(typeof s==='boolean'?s:s.value??UNKNOWN):s.established_at==null?UNKNOWN:{number:toBase(s.established_at,s.unit??'second')};}
  if(op==='TRUE_AT_START'){const s=context.states?.[a[0].state]??(a[0].fallback?context.states?.[a[0].fallback]:null),e=record(a[1]);if(s===false||s?.value===false)return false;return !s||!e||s.value==null||s.established_at==null||e.start==null?UNKNOWN:s.value&&compare(toBase(s.established_at,s.unit??'second'),toBase(e.start,e.unit??'second'))<=0;}
  if(op==='RECEIVED_ANY'||op==='RECEIVED_COMPLETE'){const receipt=(context.receipts??[]).find(x=>x.receiver===a[0].object&&x.artifact===a[1].object&&(a[2]===undefined||x.delivery===a[2].event));return !receipt?UNKNOWN:op==='RECEIVED_COMPLETE'?receipt.complete??UNKNOWN:receipt.any??(receipt.complete===true?true:UNKNOWN);}
  if(op==='ACTIVE_DURING'){const e=record(a[0]);return !e||e.start==null||e.end==null?UNKNOWN:e.occurred===false?false:compare(toBase(e.start,e.unit??'second'),num(a[2]))<0&&compare(toBase(e.end,e.unit??'second'),num(a[1]))>0;}
  if(op==='ACTIVE_SINCE'){const e=record(a[0]);return !e||e.end==null?UNKNOWN:e.occurred===false?false:compare(toBase(e.end,e.unit??'second'),num(a[1]))>0;}
  if(op==='IMMEDIATE_AFTER')return UNKNOWN;
  fail('EVALUATOR_NOT_IMPLEMENTED',n.id,null,'CAPABILITY',{operator:op});
 };
 return visit(reference,bindings);
}
