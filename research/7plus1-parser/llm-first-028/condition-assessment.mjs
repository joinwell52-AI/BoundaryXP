// Typed observation consumer. Never read task text, labels or model notes.
import {solveBooleanConstraints} from '../../../src/bxp/boolean-solver.mjs';

export function assessConditionalObservation(fact,premise,observation,targetSupported=true){
 const claim=fact.claim,event=fact.event;
 const rootTransition=['COMPLETION','STOP'].includes(fact.kind);
 const kind=fact.output_specification?'OUTPUT_BEHAVIOR':fact.kind==='COMPLETION'?'TASK_COMPLETE':fact.kind==='STOP'?'TASK_STOP':event?.kind==='STATE'?'EVENT_STATE':'EVENT_EXECUTED';
 const target_id=claim.event_id??claim.scope_id;
 const bound=observation?.known===true&&observation.target_id===target_id&&observation.kind===kind&&typeof observation.value==='boolean';
 const actual=bound?observation.value:null;
 const result={status:'CHECKED',target_id,outcome_kind:kind,observed_outcome:actual===null?'UNKNOWN':actual?'TRUE':'FALSE',
  logical_result:'UNKNOWN',temporal_result:claim.temporal?'UNKNOWN':'NOT_APPLICABLE',
  direction:claim.direction,premise_value:premise,observation_bound:bound,
  constraint_satisfied_is_execution_evidence:false,business_decision:null,execution_authorization:null};
 const skip=reason=>({...result,status:'NOT_APPLICABLE',reason});
 if(!['SUFFICIENT','NECESSARY','IFF'].includes(claim.direction))return skip('NOT_A_LOGICAL_CONDITION_DIRECTION');
 if(!targetSupported)return skip('TARGET_ACTIVATION_SCOPE_NOT_SUPPORTED');
 if(!rootTransition&&(!event||event.polarity!=='POSITIVE'))return skip('TARGET_NOT_A_SUPPORTED_POSITIVE_EVENT');
 const forbidden=!rootTransition&&event.modality==='FORBIDDEN';
 if(forbidden&&claim.direction!=='SUFFICIENT')return skip('CONDITIONAL_PROHIBITION_DIRECTION_NOT_SUPPORTED');
 if(!rootTransition&&event.modality==='PERMITTED'&&claim.direction!=='NECESSARY')return skip('PERMISSION_IS_NOT_EXECUTION_OBLIGATION');
 if(!rootTransition&&!['REQUIRED','FORBIDDEN','PERMITTED'].includes(event.modality))return skip('NO_EXECUTION_OR_STATE_OBLIGATION');
 const a={var:'premise'},b={var:'outcome'},effect=forbidden?{not:b}:b;
 const formula=claim.direction==='SUFFICIENT'?{implies:[a,effect]}:claim.direction==='NECESSARY'?{implies:[effect,a]}:{all:[{implies:[a,effect]},{implies:[effect,a]}]};
 const constraints=[];
 if(['TRUE','FALSE'].includes(premise))constraints.push(premise==='TRUE'?a:{not:a});
 if(actual!==null)constraints.push(actual?b:{not:b});
 // Two satisfiability checks use the existing unique Core and preserve the
 // difference between unknown observations and known false observations.
 const mayHold=solveBooleanConstraints(['premise','outcome'],[...constraints,formula]).result==='satisfiable';
 const mayFail=solveBooleanConstraints(['premise','outcome'],[...constraints,{not:formula}]).result==='satisfiable';
 result.logical_result=mayHold&&!mayFail?'TRUE':!mayHold&&mayFail?'FALSE':'UNKNOWN';
 result.effect_polarity=forbidden?'NONOCCURRENCE':'OCCURRENCE_OR_STATE';
 result.formula=formula;
 return result;
}
