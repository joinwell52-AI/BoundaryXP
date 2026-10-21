// Host observations are separate from the immutable semantic trace.
import {calculateBoundary,renderCalculations} from './calculus.mjs';
import {calculateDirectIR} from './direct-ir-calculate.mjs';
import {renderDirectCalculations} from './direct-ir-render-results.mjs';
export function recalculateObservedTrace(trace,input){
 if(trace?.ir?.format==='boundx-candidate-ir/1'){
  const calculation=calculateDirectIR(trace.ir,trace.technical,{observations:input});
  return {source_sha256:trace.source.sha256,observation_kind:'USER_REPORTED_NOT_INDEPENDENTLY_VERIFIED',observations:input,calculation,chinese:renderDirectCalculations(calculation),model_calls:0,business_decision:null,execution_authorization:null};
 }
 const fail=()=>{throw Error('INVALID_OBSERVATIONS');};
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 if(!object(input)||Object.keys(input).some(k=>!['states','outcomes','quantities'].includes(k)))fail();
 if(!trace?.ir?.format?.startsWith('boundx-boundary-ir/'))throw Error('NATIVE_IR_REQUIRED');
 const ir=trace.ir,accepted=ir.facts.filter(f=>f.status==='ACCEPTED');
 const states=new Map(ir.expressions.filter(x=>x.op==='STATE').map(x=>[x.id,x]));
 const conditions=new Map(accepted.filter(f=>['CONDITION','COMPLETION','STOP'].includes(f.kind)&&f.claim).map(f=>[f.claim.id,f]));
 const quantities=new Map(accepted.filter(f=>f.kind==='QUANTITY').map(f=>[f.claim.id,f.claim.quantity]));
 const observations={states:Object.create(null),outcomes:Object.create(null),quantities:Object.create(null)};
 for(const key of Object.keys(observations)){const data=Object.hasOwn(input,key)?input[key]:{};if(!object(data)||Object.keys(data).length>10000)fail();}
 for(const [id,value] of Object.entries(input.states??{})){if(!states.has(id)||typeof value!=='boolean')fail();observations.states[id]=value;}
 for(const [id,value] of Object.entries(input.outcomes??{})){
  const f=conditions.get(id);if(!f||!object(value)||Object.keys(value).some(k=>!['target_id','kind','known','value'].includes(k)))fail();
  const kind=f.output_specification?'OUTPUT_BEHAVIOR':f.kind==='COMPLETION'?'TASK_COMPLETE':f.kind==='STOP'?'TASK_STOP':f.event?.kind==='STATE'?'EVENT_STATE':'EVENT_EXECUTED';
  if(value.target_id!==(f.claim.event_id??f.claim.scope_id)||value.kind!==kind||value.known!==true||typeof value.value!=='boolean')fail();
  observations.outcomes[id]={target_id:value.target_id,kind,known:true,value:value.value};
 }
 for(const [id,value] of Object.entries(input.quantities??{})){
  const q=quantities.get(id);if(!q||!object(value)||Object.keys(value).some(k=>!['target_id','count_scope','unit','value'].includes(k)))fail();
  if(q.distribution?.mode==='EACH'||value.target_id!==q.target_id||value.count_scope!==q.count_scope||value.unit!==q.unit||typeof value.value!=='number'||!Number.isFinite(value.value))fail();
  observations.quantities[id]={target_id:q.target_id,count_scope:q.count_scope,unit:q.unit,value:value.value};
 }
 const calculation=calculateBoundary(ir,observations);
 return {source_sha256:ir.source_sha256,observation_kind:'USER_REPORTED_NOT_INDEPENDENTLY_VERIFIED',observations,calculation,chinese:renderCalculations(calculation),model_calls:0,business_decision:null,execution_authorization:null};
}
