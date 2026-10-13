// Explicit, caller-reported observations of the same typed candidate IR.
// Identity is a typed reference, never a label or a filename comparison.
import {taskMembership} from './direct-ir-input-policy.mjs';
import {isProhibitionPattern} from './direct-ir-pattern-scope.mjs';
import {combineFiniteSets} from './direct-ir-sets.mjs';
import {resolveEventTerm} from './direct-ir-event-identity.mjs';
import {operators} from './contracts/candidate-ir-v1/schema.mjs';
import {addDecimals,compareDecimal} from '../../../src/bxp/decimal.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const all=xs=>xs.includes(false)?false:xs.includes(null)?null:true;
const any=xs=>xs.includes(true)?true:xs.includes(null)?null:false;
const implies=(a,b)=>a===false||b===true?true:a===true&&b===false?false:null;
const not=x=>x===null?null:!x;
const result=x=>x===true?'SATISFIED':x===false?'VIOLATED':'UNKNOWN';
const identity=x=>object(x)&&['ENTITY','EVENT'].includes(x.kind)&&typeof x.id==='string'&&x.id.length>0;
const same=(a,b)=>identity(a)&&identity(b)?a.kind===b.kind&&a.id===b.id:null;
const knownOperations=new Set(['READ','WRITE','CREATE','DELIVER','REVIEW','ORGANIZE','STOP','CONTINUE','ACCESS','REPORT','SELECT']);
 const time=x=>typeof x==='number'&&Number.isFinite(x)?x:null;
const decimalParts=value=>{const [mantissa,exponent='0']=String(value).split('e'),[whole,fraction='']=mantissa.split('.');let coefficient=BigInt(whole+fraction),scale=fraction.length-Number(exponent);if(scale<0){coefficient*=10n**BigInt(-scale);scale=0;}return {coefficient,scale};};
const elapsedEquals=(duration,end,start)=>{const ds=[duration,end,start].map(decimalParts),scale=Math.max(...ds.map(d=>d.scale)),values=ds.map(d=>d.coefficient*10n**BigInt(scale-d.scale));return values[0]===values[1]-values[2];};
export function validateDirectObservations(ir,input){
 const fail=()=>{throw Error('INVALID_DIRECT_IR_OBSERVATIONS');};
 if(!object(input)||Object.keys(input).some(k=>!['events','states','state_instances','quantities','inputs','time_unit','closed_world'].includes(k)))fail();
 if(input.time_unit!==undefined&&(typeof input.time_unit!=='string'||!input.time_unit))fail();
 if(input.closed_world!==undefined&&(!object(input.closed_world)||Object.entries(input.closed_world).some(([k,v])=>!['events','inputs'].includes(k)||typeof v!=='boolean')))fail();
 for(const key of ['events','inputs'])if(input[key]!==undefined&&(!Array.isArray(input[key])||input[key].length>10000))fail();
 const validateRefs=xs=>{if(!Array.isArray(xs)||xs.some(x=>!identity(x)))fail();};
 for(const record of input.inputs??[]){if(!object(record)||typeof record.owner_id!=='string')fail();if(record.external_inputs!==undefined)validateRefs(record.external_inputs);}
 for(const e of input.events??[]){
  if(!object(e)||typeof e.event_id!=='string'||!e.event_id||e.occurred!==undefined&&typeof e.occurred!=='boolean')fail();
  if(e.template_id!==undefined&&e.template_id!==null&&typeof e.template_id!=='string'||e.instance!==undefined&&e.instance!==null&&(!Number.isSafeInteger(e.instance)||e.instance<0))fail();
  for(const k of ['start','end'])if(e[k]!==undefined&&time(e[k])===null)fail();
  if(e.roles!==undefined){if(!object(e.roles))fail();for(const v of Object.values(e.roles)){if(Array.isArray(v))validateRefs(v);else if(!identity(v))fail();}}
  if(e.external_inputs!==undefined)validateRefs(e.external_inputs);
  if(e.uses!==undefined){if(!Array.isArray(e.uses))fail();for(const u of e.uses){if(!object(u))fail();if(u.object!==undefined&&!identity(u.object)||u.producer!==undefined&&u.producer!==null&&!identity(u.producer))fail();for(const k of ['use_at','available_at'])if(u[k]!==undefined&&time(u[k])===null)fail();if(u.available!==undefined&&typeof u.available!=='boolean')fail();}}
 }
 const states=new Set(ir.states.map(s=>s.id)),quantities=new Set(ir.variables.map(v=>v.id));
 for(const key of ['states','quantities'])if(input[key]!==undefined&&(!object(input[key])||Object.keys(input[key]).length>10000))fail();
 for(const [id,s]of Object.entries(input.states??{})){
  if(!states.has(id)||!object(s)||s.value!==undefined&&typeof s.value!=='boolean')fail();
  if(s.established_at!==undefined&&time(s.established_at)===null)fail();
  if(s.subject!==undefined&&!identity(s.subject))fail();
  if(s.periods!==undefined){if(ir.states.find(state=>state.id===id)?.kind!=='CONTROL_EFFECT'||!Array.isArray(s.periods))fail();for(const p of s.periods)if(!object(p)||time(p.start)===null||time(p.end)===null||p.start>=p.end||typeof p.value!=='boolean')fail();}
 }
 if(input.state_instances!==undefined&&(!Array.isArray(input.state_instances)||input.state_instances.length>10000))fail();
 const instanceKeys=new Set();
 for(const s of input.state_instances??[]){
  if(!object(s)||!states.has(s.state_id)||!identity(s.subject)||s.subject.kind!=='EVENT'||s.value!==undefined&&typeof s.value!=='boolean')fail();
  if(s.established_at!==undefined&&time(s.established_at)===null)fail();
  const key=JSON.stringify([s.state_id,s.subject.id]);if(instanceKeys.has(key))fail();instanceKeys.add(key);
  if(s.periods!==undefined){if(ir.states.find(state=>state.id===s.state_id)?.kind!=='CONTROL_EFFECT'||!Array.isArray(s.periods))fail();for(const p of s.periods)if(!object(p)||time(p.start)===null||time(p.end)===null||p.start>=p.end||typeof p.value!=='boolean')fail();}
 }
 for(const [id,q]of Object.entries(input.quantities??{}))if(!quantities.has(id)||!object(q)||time(q.value)===null||typeof q.unit!=='string'||typeof q.target_id!=='string')fail();
 return input;
}
export function evaluateDirectObservations(ir,acceptance,input={},expressionQuery=null){
 const observations=validateDirectObservations(ir,input),records=observations.events??[];
 const nodes=new Map(['entities','variables','events','states','expressions','requirements'].flatMap(k=>ir[k].map(n=>[n.id,n]))),accepted=new Map(acceptance.rows.map(r=>[r.id,r.status]));
 const gaps=[],checks=[],values=new Map(),ex=r=>r?.kind==='EXPRESSION'?nodes.get(r.id):null;
 const recordIdentity=record=>record.template_id?nodes.get(record.template_id)?.kind==='TEMPLATE'&&Number.isSafeInteger(record.instance)?{kind:'EVENT',id:record.template_id+'@'+record.instance}:null:record.identity_unknown?null:{kind:'EVENT',id:record.event_id};
 const add=(id,truth,kind,detail={})=>checks.push({id,result:result(truth),kind,...detail});
 const unknown=(id,reason)=>{if(!gaps.some(g=>g.node_id===id&&g.reason===reason))gaps.push({node_id:id,reason});return null;};
 const expand=(r,seen=new Set())=>{if(r?.kind==='ENTITY'&&nodes.get(r.id)?.kind==='GROUP'){if(seen.has(r.id))return null;const next=new Set([...seen,r.id]),members=nodes.get(r.id).members.map(m=>expand(m,next));return members.some(m=>m===null)?null:members.flat();}return identity(r)?[r]:null;};
 const refsEqual=(expected,actual)=>{
  if(expected?.kind==='VARIABLE')return unknown(expected.id,'OBSERVED_OBJECT_VARIABLE_BINDING_NOT_IMPLEMENTED');
  const a=expand(expected),b=(Array.isArray(actual)?actual:[actual]).flatMap(r=>expand(r)??[null]);
  if(!a||b.includes(null))return null;
  return a.length===b.length&&a.every(x=>b.some(y=>same(x,y)===true))&&b.every(x=>a.some(y=>same(x,y)===true));
 };
 const binding=(event,record,pattern=false)=>{
  if(event.operation_extent!=='EXACT')return unknown(event.id,'OPEN_OPERATION_OBSERVATION_NOT_IMPLEMENTED');
  const fields=[!knownOperations.has(record.operation)?null:record.operation===event.operation,taskMembership(ir,record.owner_id,event.owner_id)];
  for(const role of new Set(event.roles.map(r=>r.role))){
   const expected=event.roles.filter(r=>r.role===role),actual=record.roles?.[role];
   if(actual===undefined){fields.push(null);continue;}
   // Repeated role entries are conjunctive required members, not alternatives.
   if(expected.length===1&&!pattern){fields.push(refsEqual(expected[0].value,actual));continue;}
   const required=expected.flatMap(r=>expand(r.value)??[null]);
   const observed=(Array.isArray(actual)?actual:[actual]).flatMap(r=>expand(r)??[null]);
   fields.push(required.includes(null)||observed.includes(null)?null:(pattern||required.length===observed.length)&&required.every(v=>observed.some(w=>same(v,w)===true)));
  }
  // A task-domain actor carries no extra performer requirement.
  if(event.actor_domain==='UNKNOWN')fields.push(null);
  return all(fields);
 };
 const eventsFor=(r,ctx)=>{
  if(r?.kind==='VARIABLE')return ctx[r.id]?[ctx[r.id]]:[];
  if(r?.kind==='EXPRESSION'){
   try{const e=resolveEventTerm(r,{node:r=>nodes.get(r.id),number:r=>term(r,ctx)?.value,variable:r=>ctx[r.id]});
    return records.filter(record=>record.event_id===e.key||record.template_id===e.event.id&&record.instance===e.index);
   }catch(error){unknown(r.id,error.message);return [];}
  }
  if(r?.kind!=='EVENT'){unknown(r?.id,'OBSERVED_EVENT_INSTANCE_NOT_IMPLEMENTED');return [];}
  if(ctx.pattern_id===r.id&&ctx.record)return [ctx.record];
  if(ctx.record?.event_id===r.id)return [ctx.record];
  return records.filter(e=>e.event_id===r.id);
 };
 const occurrence=(r,ctx={})=>{
  if(!['EVENT','EXPRESSION','VARIABLE'].includes(r?.kind))return unknown(r?.id,'OBSERVED_EVENT_INSTANCE_NOT_IMPLEMENTED');
  let event=r.kind==='EVENT'?nodes.get(r.id):null;
  if(r.kind==='VARIABLE'){const rs=eventsFor(r,ctx);return rs.length?rs[0].occurred??null:null;}
  if(r.kind==='EXPRESSION')try{event=resolveEventTerm(r,{node:r=>nodes.get(r.id),number:r=>term(r,ctx)?.value,variable:r=>ctx[r.id]}).event;}catch(error){return unknown(r.id,error.message);}
  if(event?.kind==='TASK')return null; // Scope is not an execution action.
  if(r.kind==='EVENT'&&event?.kind==='TEMPLATE'||ctx.pattern_id===r.id){
   const rs=ctx.record?[ctx.record]:records;
   const truths=rs.map(e=>e.occurred===false?false:all([e.occurred===true?true:null,binding(event,e,true)]));
   return any([...truths,...(!observations.closed_world?.events?[null]:[])]);
  }
  const rs=eventsFor(r,ctx);if(!rs.length)return observations.closed_world?.events?false:null;
  return any(rs.map(e=>e.occurred===false?false:all([e.occurred===true?true:null,binding(event,e)])));
 };
 const stateRecord=(r,ctx={})=>{
  const definition=nodes.get(r.id);let subject=definition.subject;
  if(subject?.kind==='EXPRESSION'||subject?.kind==='VARIABLE'){
   const resolved=term(subject,ctx)?.value;if(!identity(resolved)||resolved.kind!=='EVENT')return null;
   subject=resolved;
   const local=(observations.state_instances??[]).find(s=>s.state_id===r.id&&same(s.subject,subject)===true);
   if(local)return local;
   const single=observations.states?.[r.id];return single&&same(single.subject,subject)===true?single:null;
  }
  return observations.states?.[r.id]??(observations.state_instances??[]).find(s=>s.state_id===r.id&&same(s.subject,subject)===true)??null;
 };
 const state=(r,ctx={},at=null)=>{
  const definition=nodes.get(r.id),s=stateRecord(r,ctx);if(!s)return null;
  if(s.subject&&definition.subject?.kind!=='EXPRESSION'&&definition.subject?.kind!=='VARIABLE'&&same(s.subject,definition.subject)!==true)return false;
  if(at!==null&&s.periods){const matched=s.periods.filter(p=>p.start<=at&&at<p.end);return matched.length&&matched.every(p=>p.value===matched[0].value)?matched[0].value:null;}
  if(definition.kind==='CONTROL_EFFECT'&&ctx.record){
   const point=time(ctx.record.start);if(point===null||!s.periods)return null;
   return state(r,ctx,point);
  }
  if(s.value===false)return false;
  if(s.value!==true)return null;
  if(at!==null){if(time(s.established_at)===null)return null;return s.established_at<=at;}
  return true;
 };
 const eventTime=(r,key,ctx)=>{const rs=eventsFor(r,ctx);return rs.length===1&&rs[0].occurred===true?time(rs[0][key]):null;};
 const term=(r,ctx={})=>{
  if(identity(r))return {value:r,unit:null};
  if(r?.kind==='VARIABLE'){
   if(Object.hasOwn(ctx,r.id)){const v=nodes.get(r.id),d=ex(v?.domain),value=ctx[r.id];return {value:v?.type==='EVENT'&&value?.event_id?recordIdentity(value):value,unit:d?.unit??null};}
   const v=nodes.get(r.id),q=observations.quantities?.[r.id],domain=ex(v.domain);
   return q&&q.target_id===(v.owner?.id??v.scope_id)&&q.unit===domain?.unit?{value:q.value,unit:q.unit}:null;
  }
  const x=ex(r);if(!x)return null;const args=x.arguments;
  if(['EVENT_INSTANCE','PREVIOUS_INSTANCE'].includes(x.operator)){
   try{const e=resolveEventTerm(r,{node:r=>nodes.get(r.id),number:r=>term(r,ctx)?.value,variable:r=>ctx[r.id]});return {value:{kind:'EVENT',id:e.key},unit:null};}catch(error){return unknown(r.id,error.message);}
  }
  if(['NUMBER','BOOLEAN'].includes(x.operator))return {value:x.literal,unit:x.unit};
  if(x.operator==='EVENT_START'||x.operator==='EVENT_END')return {value:eventTime(args[0],x.operator==='EVENT_START'?'start':'end',ctx),unit:observations.time_unit??null};
  if(x.operator==='STATE_ESTABLISHED'){const s=stateRecord(args[0],ctx);return {value:state(args[0],ctx)===true?time(s?.established_at):null,unit:observations.time_unit??null};}
  if(['OBJECT_OF','RECIPIENT_OF','ENVIRONMENT_OF'].includes(x.operator)){
   const rs=eventsFor(args[0],ctx),roles=x.operator==='OBJECT_OF'?['OBJECT','INPUT_OBJECT','RESULT','DELIVERABLE']:[x.operator==='RECIPIENT_OF'?'RECIPIENT':'ENVIRONMENT'];
   if(rs.length!==1)return null;
   const values=roles.flatMap(role=>rs[0].roles?.[role]??[]),distinct=[...new Map(values.map(v=>[v.kind+':'+v.id,v])).values()];
   return distinct.length===1?{value:distinct[0],unit:null}:unknown(x.id,distinct.length?'SINGLE_ROLE_VALUE_REQUIRED':'ROLE_VALUE_NOT_OBSERVED');
  }
  if(x.operator==='SET'){const ts=args.map(a=>term(a,ctx));return ts.some(t=>!t||t.value===null)?null:{value:ts.map(t=>t.value),unit:null};}
  if(x.operator==='GROUP_MEMBERS'){const g=nodes.get(args[0].id);return g?.kind==='GROUP'?{value:g.members,unit:null}:null;}
  if(['UNION','INTERSECTION','DIFFERENCE'].includes(x.operator)){
   const sets=args.map(a=>term(a,ctx));if(sets.some(s=>!s||!Array.isArray(s.value)||s.unknown))return unknown(x.id,'OBSERVED_SET_MEMBERSHIP_INCOMPLETE');
   const key=v=>JSON.stringify(identity(v)?{kind:v.kind,id:v.id}:v),values=new Map(sets.flatMap(s=>s.value.map(v=>[key(v),v])));
   return {value:combineFiniteSets(x.operator,sets.map(s=>s.value.map(key))).map(k=>values.get(k)),unit:null};
  }
  if(x.operator==='TASK_EXTERNAL_INPUTS'){
   const used=[],uncertain=[];const source=[...(observations.inputs??[]),...records];
   for(const e of source){if(e.occurred===false)continue;const member=taskMembership(ir,e.owner_id,args[0].id);if(member===false)continue;if(member!==true){uncertain.push(true);continue;}
    if(e.event_id&&e.occurred!==true)uncertain.push(true);
    if(Array.isArray(e.external_inputs))used.push(...e.external_inputs);else uncertain.push(true);
    for(const use of e.uses??[]){if(use.origin==='EXTERNAL'&&identity(use.object))used.push(use.object);if(use.origin===undefined||use.origin==='UNSTATED')uncertain.push(true);}
   }
   return {value:used,unit:null,unknown:uncertain.length>0||!source.length&&!observations.closed_world?.inputs};
  }
  if(['REAL_INTERVAL','INTEGER_RANGE'].includes(x.operator)){const ts=args.map(a=>term(a,ctx));return ts.every(t=>t&&typeof t.value==='number')?{value:{lower:ts[0].value,upper:ts[1].value,lower_exact:ts[0].exact??ts[0].value,upper_exact:ts[1].exact??ts[1].value,integer:x.operator==='INTEGER_RANGE'},unit:x.unit}:null;}
  if(x.operator==='CARDINALITY'){const t=term(args[0],ctx);return t&&Array.isArray(t.value)&&!t.unknown?{value:new Set(t.value.map(v=>JSON.stringify(v))).size,unit:null}:null;}
  if(x.operator==='ADD'){const ts=args.map(a=>term(a,ctx));if(!ts.every(t=>t&&typeof t.value==='number'&&t.unit===ts[0].unit))return null;const exact=addDecimals(ts.map(t=>t.exact??t.value));return {value:Number(exact),exact,unit:ts[0].unit};}
  return unknown(x.id,'OBSERVATION_TERM_NOT_IMPLEMENTED:'+x.operator);
 };
 const bool=(r,ctx={})=>{
  if(r?.kind==='VARIABLE'){const v=term(r,ctx)?.value;return typeof v==='boolean'?v:null;}
  const x=ex(r);if(!x)return unknown(r?.id,'OBSERVATION_BOOLEAN_NOT_IMPLEMENTED');const args=x.arguments;
  if(x.operator==='BOOLEAN')return x.literal;
  if(x.operator==='AND')return all(args.map(a=>bool(a,ctx)));
  if(x.operator==='OR')return any(args.map(a=>bool(a,ctx)));
  if(x.operator==='NOT')return not(bool(args[0],ctx));
  if(x.operator==='IMPLIES')return implies(bool(args[0],ctx),bool(args[1],ctx));
  if(x.operator==='IFF'){const a=bool(args[0],ctx),b=bool(args[1],ctx);return a===null||b===null?null:a===b;}
  if(x.operator==='EQ'&&args.every(a=>a.kind==='VARIABLE'?nodes.get(a.id)?.type==='BOOLEAN':a.kind==='EXPRESSION'&&operators[ex(a)?.operator]?.[0]==='BOOLEAN')){const a=bool(args[0],ctx),b=bool(args[1],ctx);return a===null||b===null?null:a===b;}
  if(x.operator==='STATE_VALUE')return state(args[0],ctx);
  if(x.operator==='EVENT_OCCURRED')return occurrence(args[0],ctx);
  if(x.operator==='TRUE_AT_START'){
   const rs=eventsFor(args[1],ctx);if(!rs.length)return null;
   return all(rs.map(e=>{const t=time(e.start);return t===null?null:state(args[0],{...ctx,record:e},t);}));
  }
  if(['EQ','LT','LTE','GT','GTE','BEFORE'].includes(x.operator)){
   const a=term(args[0],ctx),b=term(args[1],ctx);if(!a||!b||a.value===null||b.value===null||a.unit!==b.unit)return null;
   if(x.operator==='EQ'&&identity(a.value)&&identity(b.value))return same(a.value,b.value);
   if(x.operator==='EQ'&&Array.isArray(a.value)&&Array.isArray(b.value))return all([...a.value.map(v=>any(b.value.map(w=>identity(v)?same(v,w):v===w))),...b.value.map(v=>any(a.value.map(w=>identity(v)?same(v,w):v===w))),...(a.unknown||b.unknown?[null]:[])]);
   if(x.operator==='EQ'&&typeof a.value==='boolean'&&typeof b.value==='boolean')return a.value===b.value;
   if(typeof a.value!=='number'||typeof b.value!=='number')return null;
   if(args.some(a=>['EVENT_START','EVENT_END','STATE_ESTABLISHED'].includes(ex(a)?.operator))&&!a.unit)return null;
   const c=compareDecimal(a.exact??a.value,b.exact??b.value);return {EQ:c===0,LT:c<0,BEFORE:c<0,LTE:c<=0,GT:c>0,GTE:c>=0}[x.operator];
  }
  if(x.operator==='SUBSET'||x.operator==='MEMBER'){
   const a=term(args[0],ctx),b=term(args[1],ctx);if(!a||!b)return null;
   if(x.operator==='MEMBER'&&b.value&&typeof b.value.lower==='number')return typeof a.value==='number'&&a.unit===b.unit?compareDecimal(a.exact??a.value,b.value.lower_exact)>=0&&compareDecimal(a.exact??a.value,b.value.upper_exact)<=0&&(!b.value.integer||Number.isSafeInteger(a.value)):null;
   if(!Array.isArray(b.value))return null;const members=x.operator==='SUBSET'?a.value:[a.value];if(!Array.isArray(members))return null;
   return all([...members.map(v=>any(b.value.map(w=>identity(v)||identity(w)?same(v,w):v===null||w===null?null:v===w))),...(a.unknown||b.unknown?[null]:[])]);
  }
  if(x.operator==='FORALL'||x.operator==='EXISTS'){
   const domain=ex(args[0]);if(domain?.operator!=='TASK_EVENTS'){
    const d=term(args[0],ctx);if(!d||d.unknown)return null;let members=d.value;
    if(domain?.operator==='INTEGER_RANGE'){
     if(!Number.isSafeInteger(d.value.lower)||!Number.isSafeInteger(d.value.upper)||d.value.upper-d.value.lower>10000)return unknown(x.id,'OBSERVED_QUANTIFIER_CAPACITY');
     members=Array.from({length:Math.max(0,d.value.upper-d.value.lower+1)},(_,i)=>d.value.lower+i);
    }
    if(!Array.isArray(members))return unknown(x.id,'CONTINUOUS_QUANTIFIER_REQUIRES_SOLVER');
    const vals=members.map(value=>bool(args[1],{...ctx,[x.bound_variable.id]:value}));return x.operator==='FORALL'?all(vals):any(vals);
   }
   const vals=records.map(e=>{if(e.occurred===false)return x.operator==='FORALL';const member=taskMembership(ir,e.owner_id,domain.arguments[0].id);if(member===false)return x.operator==='FORALL';if(member!==true)return null;const occurred=e.occurred===true?true:null,body=bool(args[1],{...ctx,record:e,[x.bound_variable.id]:e});return x.operator==='FORALL'?implies(occurred,body):all([occurred,body]);});
   if(!observations.closed_world?.events)vals.push(null);
   return x.operator==='FORALL'?all(vals):any(vals);
  }
  if(x.operator==='IMMEDIATE_AFTER'){
   const trigger=stateRecord(args[0],ctx),start=eventTime(args[1],'start',ctx);if(!observations.time_unit||state(args[0],ctx)!==true||time(trigger?.established_at)===null||start===null)return null;
   if(start<trigger.established_at)return false;
   const response=nodes.get(args[1].id),target=response.roles.find(r=>r.role==='OBJECT'&&nodes.get(r.value.id)?.kind==='TASK')?.value.id??response.owner_id;
   const intervening=records.filter(e=>e.occurred!==false&&!['STOP','REPORT'].includes(e.operation)&&taskMembership(ir,e.owner_id,target)!==false);
   const vals=intervening.map(e=>time(e.start)===null||e.occurred!==true||!knownOperations.has(e.operation)||taskMembership(ir,e.owner_id,target)!==true?null:!(trigger.established_at<e.start&&e.start<start));
   return all([...vals,...(!observations.closed_world?.events?[null]:[])]);
  }
  return unknown(x.id,'OBSERVATION_OPERATOR_NOT_IMPLEMENTED:'+x.operator);
 };
 // Event-policy queries and whole-trace evaluation share this exact interpreter.
 // A single supplied event does not close the task's domain.
 if(expressionQuery){const truth=bool(expressionQuery.ref,expressionQuery.bindings??{});return {result:result(truth),gaps};}
 const dataUse=(requirement,record)=>{
  const d=requirement.data_use;if(!Array.isArray(record.uses))return null;
  if(d.object.kind==='VARIABLE')return unknown(requirement.id,'OBSERVED_OBJECT_VARIABLE_BINDING_NOT_IMPLEMENTED');
  const uses=record.uses.filter(u=>same(d.object,u.object)===true);if(!uses.length)return record.uses.some(u=>!identity(u.object))?null:false;
  return any(uses.map(u=>{
   const checks=[u.origin===undefined?null:u.origin===d.origin,u.available===false?false:u.available===true?true:null];
   const levels={AT_USE:['AT_USE','USED_PORTION','COMPLETE_RESULT'],USED_PORTION:['USED_PORTION','COMPLETE_RESULT'],COMPLETE_RESULT:['COMPLETE_RESULT']};
   checks.push(u.availability===undefined?null:levels[d.availability].includes(u.availability));
   if(d.producer){checks.push(u.producer===undefined?null:same(d.producer,u.producer));checks.push(occurrence(d.producer));}
   const use=time(u.use_at),ready=time(u.available_at),start=time(record.start),end=time(record.end);
   checks.push(!observations.time_unit||use===null||ready===null?null:ready<=use);
   checks.push(use===null||start===null||end===null?null:start<=use&&use<=end);
   if(d.producer){const produced=eventTime(d.producer,d.availability==='COMPLETE_RESULT'?'end':'start',{});checks.push(produced===null||ready===null?null:produced<=ready);}
   return all(checks);
  }));
 };
 for(const record of records){
  const event=nodes.get(record.event_id);if(event?.kind==='ACTION'&&record.occurred!==false)add('binding:'+record.event_id,binding(event,record),'EVENT_IDENTITY_BINDING',{event_id:record.event_id});
  if(record.occurred===true)add('operation:'+record.event_id,knownOperations.has(record.operation)?true:unknown(record.event_id,'OBSERVED_OPERATION_UNCLASSIFIED'),'TYPED_OPERATION_IDENTITY');
  if(record.occurred===true)add('lifecycle:'+record.event_id,time(record.start)===null||time(record.end)===null?null:record.start<=record.end,'EVENT_LIFECYCLE');
 }
 const requirements=[];
 for(const r of ir.requirements){
  if(accepted.get(r.id)!=='ACCEPTED'){requirements.push({requirement_id:r.id,result:'NOT_ACCEPTED',source_refs:r.source_refs});continue;}
  if(['PERMITTED','NOT_REQUIRED','UNSTATED'].includes(r.modality)){requirements.push({requirement_id:r.id,result:'NOT_APPLICABLE',source_refs:r.source_refs,not_permission:true});continue;}
  const subject=nodes.get(r.subject?.id),local=r.kind==='CONSTRAINT'&&(subject?.kind==='ACTION'||r.subject?.kind==='EXPRESSION');
  const pattern=isProhibitionPattern(r,subject);
  const rs=r.kind==='DATA_USE'?eventsFor(r.data_use.consumer,{}):local?eventsFor(r.subject,{}):pattern?records:[null];
  const evaluate=record=>{
   const ctx=record?{record,...(pattern?{pattern_id:subject.id}:{})}:{};
   if(pattern&&record&&(record.occurred===false||binding(subject,record,true)===false))return true;
   let active=r.applicability?bool(r.applicability,ctx):true;
   if(local||r.kind==='DATA_USE')active=all([active,record?.occurred===false?false:record?.occurred===true?true:occurrence(r.subject,ctx)]);
   if(active===false)return true;
   let body=r.kind==='DATA_USE'?record?all([dataUse(r,record),bool(r.body,ctx)]):null:bool(r.body,ctx);
   if(['EVENT_NORM','STOP'].includes(r.kind))body=all([occurrence(r.subject,ctx),body]);
   return implies(active,r.modality==='FORBIDDEN'?not(body):body);
  };
  const truth=pattern?all([...rs.map(evaluate),...(!observations.closed_world?.events?[null]:[])]):rs.length?all(rs.map(evaluate)):local||r.kind==='DATA_USE'?observations.closed_world?.events?true:null:evaluate(null);
  requirements.push({requirement_id:r.id,result:result(truth),source_refs:r.source_refs});
 }
 for(const expression of ir.expressions){if(accepted.get(expression.id)==='ACCEPTED'&&['BOOLEAN','AND','OR','NOT','IMPLIES','IFF','STATE_VALUE','TRUE_AT_START'].includes(expression.operator))values.set(expression.id,bool({kind:'EXPRESSION',id:expression.id}));}
 for(const s of ir.states){const record=observations.states?.[s.id];if(!record||record.value!==true||!s.subject||nodes.get(s.subject.id)?.kind!=='ACTION')continue;
  add('state-binding:'+s.id,occurrence(s.subject),'STATE_REQUIRES_BOUND_EVENT');
  const established=time(record.established_at),start=eventTime(s.subject,'start',{}),end=eventTime(s.subject,'end',{});
  add('state-time:'+s.id,established===null||start===null||end===null?null:start<=established&&established<=end&&(s.kind!=='COMPLETION'||end===established),'STATE_ESTABLISHMENT_TIME');
 }
 for(const s of observations.state_instances??[]){
  const definition=nodes.get(s.state_id);if(s.value!==true||!['SUCCESS','FAILURE','COMPLETION','CONTROL_EFFECT'].includes(definition.kind))continue;
  const events=records.filter(e=>e.event_id===s.subject.id||e.template_id&&e.template_id+'@'+e.instance===s.subject.id);
  const record=events.length===1?events[0]:null,id=s.state_id+'@'+s.subject.id;
  add('state-binding:'+id,record?.occurred??null,'STATE_REQUIRES_BOUND_EVENT');
  const established=time(s.established_at),start=time(record?.start),end=time(record?.end);
  add('state-time:'+id,established===null||start===null||end===null?null:start<=established&&established<=end&&(definition.kind!=='COMPLETION'||end===established),'STATE_ESTABLISHMENT_TIME');
 }
 for(const r of ir.requirements.filter(r=>r.kind==='TOTAL_DURATION'&&accepted.get(r.id)==='ACCEPTED')){
  const q=observations.quantities?.[r.subject?.id],members=records.filter(e=>e.occurred===true&&taskMembership(ir,e.owner_id,r.scope_id)===true);
  const complete=observations.closed_world?.events&&members.length&&members.every(e=>time(e.start)!==null&&time(e.end)!==null);
  add('elapsed:'+r.id,!complete||!q||q.target_id!==r.scope_id||q.unit!==observations.time_unit?null:elapsedEquals(q.value,Math.max(...members.map(e=>e.end)),Math.min(...members.map(e=>e.start))),'OBSERVED_TOTAL_ELAPSED_TIME');
 }
 const truths=[...checks,...requirements].map(r=>r.result==='SATISFIED'||r.result==='NOT_APPLICABLE'?true:r.result==='VIOLATED'?false:null);
 return {format:'boundx-direct-ir-observation-result/1',observation_kind:'USER_REPORTED_NOT_INDEPENDENTLY_VERIFIED',status:result(all(truths)),checks,requirements,expression_values:Object.fromEntries([...values].map(([id,v])=>[id,v===null?'UNKNOWN':v])),gaps,closed_world:observations.closed_world??{},static_witness_is_not_observation:true,not_applicable_is_not_permission:true,business_decision:null,execution_authorization:null};
}
