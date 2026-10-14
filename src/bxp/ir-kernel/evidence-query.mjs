// Mechanical wire-to-Core binding. No text/label interpretation or inferred events.
import Ajv from 'ajv';
import {v2Schema} from './contract-registry.mjs';
import {toBase,stable,compare,identity,unknown} from './values.mjs';
import {controlPeriods,activeWhile} from './control-periods.mjs';
import {compileCore} from './index.mjs';
import {evaluateCore} from './evaluate.mjs';
import {preparePlan} from './events.mjs';
const str={type:'string',minLength:1},nullable=s=>({anyOf:[s,{type:'null'}]}),arr=items=>({type:'array',items});
const obj=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const ref=v2Schema.$defs.ref;
export const evidenceQuerySchema=obj({
 format:{const:'boundx-finite-evidence/1'},
 plan:obj({events:arr(obj({id:str,task_id:str,occurred:{type:'boolean'},completed:{type:'boolean'},succeeded:{type:'boolean'},start:str,end:str,unit:str,roles:nullable(arr(obj({role:str,value:ref})))})),completeness:nullable(obj({kind:{const:'EXACT_SNAPSHOT'},task_id:str,basis:str})),external_inputs:arr(obj({task_id:str,objects:arr(ref)}))}),
 states:arr(obj({id:str,value:nullable({type:'boolean'}),established_at:nullable(str),unit:str,periods:nullable(obj({completeness:{const:'EXACT_FOR_TASK_HORIZON'},task_id:str,intervals:arr(obj({start:nullable(str),end:nullable(str),unit:str,start_inclusive:{type:'boolean'},end_inclusive:{type:'boolean'}}))}))})),
 variables:arr(obj({id:str,value:{anyOf:[{type:'boolean'},str,ref]},unit:nullable(str)})),
 availability:arr(obj({object:ref,producer:nullable(ref),at:str,unit:str})),
 receipts:arr(obj({receiver:ref,artifact:ref,delivery:nullable(ref),any:nullable({type:'boolean'}),complete:nullable({type:'boolean'})}))
});
evidenceQuerySchema.$defs=v2Schema.$defs;
evidenceQuerySchema.properties.plan.properties.events.items.properties.operation={anyOf:[{type:'string',enum:v2Schema.properties.events.items.properties.operation.enum},{type:'null'}]};
// Optional for saved r01 evidence; explicit typed metadata for repeated occurrences.
Object.assign(evidenceQuerySchema.properties.plan.properties.events.items.properties,{template_id:nullable(str),index:nullable({type:'integer',minimum:0})});
evidenceQuerySchema.properties.states.items.properties.bindings=arr(obj({variable_id:str,value:{type:'integer'}}));
const validate=new Ajv({strict:false,allErrors:true}).compile(evidenceQuerySchema);
export function evidenceQuery(ir,raw,{requireWire=false,scope='COMPLETE_WITNESS'}={}){
 if(!['COMPLETE_WITNESS','LOCAL_EXPRESSION'].includes(scope))throw Error('EVIDENCE_QUERY_SCOPE');
 if(requireWire&&raw?.format!=='boundx-finite-evidence/1')throw Error('FINITE_EVIDENCE_WIRE_REQUIRED');
 if(!raw||raw.format!=='boundx-finite-evidence/1')return raw; // Explicit historical Core query, never upgraded.
 if(!validate(raw))throw Error('FINITE_EVIDENCE_SCHEMA:'+JSON.stringify(validate.errors));
 const nodes=new Map(Object.entries({entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE'}).flatMap(([k,kind])=>ir[k].map(n=>[n.id,{...n,category:kind}])));
 const node=(id,kind)=>{const n=nodes.get(id);if(!n||n.category!==kind)throw Error('EVIDENCE_REFERENCE:'+id);return n;};
 const reference=(r,kind)=>{node(r.id,kind);if(r.kind!==kind)throw Error('EVIDENCE_REFERENCE_TYPE:'+r.id);return r.id;};
 const unique=(rows,key)=>{const keys=rows.map(key);if(new Set(keys).size!==keys.length)throw Error('DUPLICATE_EVIDENCE_BINDING');};
 unique(raw.variables,x=>x.id);unique(raw.availability,x=>stable([x.object,x.producer]));unique(raw.plan.external_inputs,x=>x.task_id);
 const states={},variables={},availability={},external_inputs={};
 for(const v of raw.variables){const n=node(v.id,'VARIABLE');if(n.type==='BOOLEAN'){if(typeof v.value!=='boolean')throw Error('EVIDENCE_BOOLEAN:'+v.id);variables[v.id]=v.value;}else if(['INTEGER','REAL'].includes(n.type)){if(typeof v.value!=='string')throw Error('EVIDENCE_NUMBER:'+v.id);variables[v.id]={number:toBase(v.value,v.unit)};}else if(n.type==='OBJECT'){variables[v.id]={object:reference(v.value,'ENTITY')};}else throw Error('EVIDENCE_VARIABLE_TYPE:'+v.id);}
 for(const a of raw.availability){const object={object:reference(a.object,'ENTITY')},producer=a.producer?{event:reference(a.producer,'EVENT')}:null;availability[stable({object,producer})]={at:a.at,unit:a.unit};}
 for(const x of raw.plan.external_inputs){const t=node(x.task_id,'EVENT');if(t.kind!=='TASK')throw Error('EVIDENCE_INPUT_TASK');external_inputs[x.task_id]=x.objects.map(r=>reference(r,'ENTITY'));}
 const core=compileCore(ir).core;
 const events=preparePlan(core,{events:raw.plan.events.map(e=>{node(e.task_id,'EVENT');if(e.roles)for(const r of e.roles)reference(r.value,r.value.kind);if((e.template_id==null)!==(e.index==null))throw Error('EVIDENCE_INSTANCE_METADATA_PAIR');return {...e,...(e.roles?{}:{roles:undefined}),...(e.operation==null?{operation:undefined}:{})};})}).events;
 const context={plan:{events,completeness:raw.plan.completeness,external_inputs},states,variables,availability,receipts:raw.receipts.map(r=>({receiver:reference(r.receiver,'ENTITY'),artifact:reference(r.artifact,'ENTITY'),...(r.delivery?{delivery:reference(r.delivery,'EVENT')}:{ }),any:r.any,complete:r.complete}))};
 const stateSubjects=new Map();
 for(const s of raw.states){
  const n=node(s.id,'STATE'),bindings={};unique(s.bindings??[],b=>b.variable_id);
  for(const b of s.bindings??[]){const v=node(b.variable_id,'VARIABLE');if(v.type!=='INTEGER'||v.binding_mode!=='INSTANCE_LOCAL')throw Error('EVIDENCE_STATE_BINDER_TYPE');const domain=evaluateCore(core,v.domain,context);if(!domain.set?.some(x=>x.number!==undefined&&compare(x.number,String(b.value))===0))throw Error('EVIDENCE_STATE_BINDER_DOMAIN');bindings[b.variable_id]={number:String(b.value)};}
  const subject=n.subject?evaluateCore(core,n.subject,context,bindings):null;
  if(n.subject&&!subject?.event)throw Error('EVIDENCE_STATE_INSTANCE_REQUIRES_BINDING:'+s.id);
  const key=subject?stable([n.id,subject.event]):n.id;if(Object.hasOwn(states,key))throw Error('DUPLICATE_EVIDENCE_BINDING');
  states[key]={value:s.value,established_at:s.established_at,unit:s.unit,...(s.periods?{periods:s.periods}:{})};stateSubjects.set(s,subject?.event);
 }
 for(const e of events){if(e.completed&&!e.occurred||e.succeeded&&!e.completed||compare(toBase(e.start,e.unit),toBase(e.end,e.unit))>0)throw Error('EVIDENCE_EVENT_INVARIANT:'+e.id);}
 for(const r of context.receipts)if(r.complete===true&&r.any===false)throw Error('EVIDENCE_RECEIPT_INVARIANT');
 if(raw.plan.completeness){
  const task=events.find(e=>e.id===core.root_task);if(!task&&scope==='COMPLETE_WITNESS')throw Error('EVIDENCE_ROOT_TASK_REQUIRED');
  for(const v of raw.variables){const domain=evaluateCore(core,nodes.get(v.id).domain,context),value=variables[v.id];if(unknown(domain))throw Error('EVIDENCE_VARIABLE_DOMAIN_UNKNOWN:'+v.id);const member=domain.set?domain.set.some(x=>identity(x)===identity(value)):domain.interval&&value.number!==undefined?compare(value.number,domain.interval[0])>=0&&compare(value.number,domain.interval[1])<=0:false;if(!member)throw Error('EVIDENCE_VARIABLE_DOMAIN:'+v.id);}
  if(scope==='COMPLETE_WITNESS'){
   for(const s of raw.states){const n=nodes.get(s.id);if(s.value!==true||!n.subject)continue;const e=events.find(e=>e.id===stateSubjects.get(s));if(!e||s.established_at==null)throw Error('EVIDENCE_STATE_TIME_REQUIRED:'+s.id);const time=toBase(s.established_at,s.unit),start=toBase(e.start,e.unit),end=toBase(e.end,e.unit);if(compare(time,start)<0||compare(time,end)>0||['SUCCESS','FAILURE','COMPLETION','CONTROL_EFFECT'].includes(n.kind)&&!e.occurred||n.kind==='COMPLETION'&&(compare(time,end)!==0||!e.completed)||n.kind==='FAILURE'&&e.succeeded||n.kind==='SUCCESS'&&!e.succeeded)throw Error('EVIDENCE_STATE_TIME_INVARIANT:'+s.id);}
   for(const s of raw.states){if(!s.periods||s.value==null)continue;const periods=controlPeriods(s,core.root_task);if(unknown(periods))continue;const terminal=activeWhile({id:task.id,occurred:true,start:task.end,end:task.end,unit:task.unit},periods);if(terminal!==s.value)throw Error('EVIDENCE_STATE_PERIOD_MISMATCH:'+s.id);}
  }
 }
 return context;
}
