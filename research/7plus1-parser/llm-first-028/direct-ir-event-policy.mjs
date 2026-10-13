// A per-event query uses the same typed expression interpreter as observations.
// No second, smaller operator grammar; no source-text or label interpretation.
import {taskScope} from './direct-ir-task-scope.mjs';
import {evaluateKernel} from '../../../src/bxp/ir-kernel/service.mjs';
import {evaluateDirectObservations} from './direct-ir-observations.mjs';

export function evaluateDirectEventPolicies(ir,acceptance,eventRecord,context={}){
 if(ir.contract_version==='candidate-ir/2.0')return evaluateKernel(ir,{...context,plan:{...context.plan,events:[...(context.plan?.events??[]).filter(e=>e.id!==eventRecord.id),eventRecord]}});
 const expressions=new Map(ir.expressions.map(x=>[x.id,x])),accepted=new Map(acceptance.rows.map(x=>[x.id,x.status]));
 const expr=r=>r?.kind==='EXPRESSION'?expressions.get(r.id):null,membership=taskScope(ir).member,results=[];
 // A counterfactual query assumes this event occurs. It does not certify execution.
 const record={...eventRecord,event_id:eventRecord.event_id??eventRecord.id??'@anonymous-policy-query',identity_unknown:!eventRecord.event_id&&!eventRecord.id,occurred:eventRecord.occurred??true};
 const input={...context,events:[...(context.events??[]).filter(e=>e.event_id!==record.event_id),record]};
 const evaluate=(ref,bindings)=>evaluateDirectObservations(ir,acceptance,input,{ref,bindings});
 for(const r of ir.requirements){
  const q=expr(r.body),d=expr(q?.arguments?.[0]);if(q?.operator!=='FORALL'||d?.operator!=='TASK_EVENTS')continue;
  const inScope=membership(record.owner_id,d.arguments[0].id),ready=accepted.get(r.id)==='ACCEPTED';
  let verdict='UNKNOWN',gaps=[];
  if(!ready)verdict='NOT_ACCEPTED';
  else if(inScope===false||record.occurred===false||['PERMITTED','NOT_REQUIRED','UNSTATED'].includes(r.modality))verdict='NOT_APPLICABLE';
  else if(inScope===true){
   const active=r.applicability?evaluate(r.applicability,{}):{result:'SATISFIED',gaps:[]};gaps.push(...active.gaps);
   if(active.result==='VIOLATED')verdict='NOT_APPLICABLE';
   else if(r.modality!=='REQUIRED')gaps.push({node_id:r.id,reason:'NEGATED_UNIVERSAL_REQUIRES_WHOLE_TRACE'});
   else {
    const body=evaluate(q.arguments[1],{record,[q.bound_variable.id]:record});gaps.push(...body.gaps);
    verdict=body.result==='SATISFIED'?'SATISFIED':active.result==='SATISFIED'?body.result:'UNKNOWN';
   }
  }
  results.push({requirement_id:r.id,scope:inScope===true?'IN_SCOPE':inScope===false?'OUT_OF_SCOPE':'UNKNOWN',result:verdict,source_refs:r.source_refs,...(gaps.length?{gaps}: {})});
 }
 return {format:'boundx-direct-event-policy-result/1',results,execution_authorization:null,business_decision:null,not_applicable_is_not_permission:true};
}
