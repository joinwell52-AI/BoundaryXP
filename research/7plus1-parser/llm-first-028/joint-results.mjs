import {solveJointBoundary} from '../../../src/bxp/joint-boundary-solver.mjs';
import {sha256} from './source.mjs';
import {buildScopeDomains} from './scope-results.mjs';
import {checkIRBindings} from '../../../src/bxp/ir-binding-consistency.mjs';
const key=x=>'v:'+sha256(JSON.stringify(x)).slice(0,24),variable=id=>({var:id});
const vars=f=>typeof f==='boolean'?[]:f.var?[f.var]:'not' in f?vars(f.not):Object.values(f)[0].flatMap(vars);
export function buildJointResults(ir,c,{atoms,comparisons}){
 atoms=atoms.filter(a=>['REQUIRED','PERMITTED','FORBIDDEN'].includes(a.mode));
 if(!Array.isArray(c.boolean?.formulas)||!Array.isArray(c.boolean?.atoms))return {status:'PARTIAL',gaps:[{reason:'JOINT_FORMULA_LEDGER_REQUIRED'}],base:{result:'unknown',witness:null},completion:[],trigger_branches:[],business_decision:null,execution_authorization:null};
 const gaps=[],constraints=c.boolean.formulas.map((f,i)=>({id:'declared:'+i,formula:f.formula,rule:f.rule,fact_ids:[f.fact_id],sources:f.sources})),orders=[];
 const events=new Map((ir.facts??[]).filter(f=>f.kind==='EVENT'&&f.status==='ACCEPTED').map(f=>[f.event.id,f]));
 const exprs=new Map(ir.expressions.map(x=>[x.id,x]));
 const performed=id=>variable(key(['EVENT_EXECUTED',id])),activated=id=>variable(key(['EVENT_ACTIVATED',id]));
 const add=(id,formula,rule,refs,sources)=>constraints.push({id,formula,rule,fact_ids:refs,sources});
 const expression=(id,path=[])=>{if(path.includes(id))throw Error('JOINT_EXPRESSION_CYCLE');const x=exprs.get(id);if(!x)throw Error('JOINT_EXPRESSION_MISSING');if(x.op==='STATE'){const v=variable(key(['STATE',x.state.predicate,x.state.event_id,x.state.args]));return x.state.polarity==='NEGATIVE'?{not:v}:v;}if(x.op==='TEST')return variable(key(['PROPERTY_TEST',x.test]));if(x.op==='NOT')return {not:expression(x.operands[0],[...path,id])};if(['AND','ALL','OR','ANY'].includes(x.op))return {[['AND','ALL'].includes(x.op)?'all':'any']:x.operands.map(k=>expression(k,[...path,id]))};throw Error('JOINT_NON_BOOLEAN_EXPRESSION');};
 const usedStates=new Set(c.boolean.atoms.filter(a=>a.meaning.kind==='STATE'&&events.get(a.meaning.event_id)?.event.use==='CURRENT_TASK'&&events.get(a.meaning.event_id)?.event.layer==='MAIN').map(a=>a.id));
 const linked=new Set(),phaseStates=new Map(),state_checks=[];
 for(const a of atoms){const f=events.get(a.event_id),signature=a.semantic_signature;
  if(!signature||signature.extent!=='EXACT'||signature.effects.includes('OTHER'))gaps.push({fact_id:a.fact_id,reason:'REVIEWED_OPERATION_SIGNATURE_REQUIRED'});
  for(const link of signature?.state_links??[]){const x=exprs.get(link.expression_id),accepted=f.proof?.checks?.some(r=>r.id===link.expression_id&&r.status==='ACCEPTED');
   if(!accepted||x?.op!=='STATE'||x.state?.event_id!==a.event_id||x.state.polarity!=='POSITIVE'){gaps.push({fact_id:a.fact_id,reason:'STATE_LINK_NOT_CERTIFIED'});continue;}
   const state=expression(x.id),event=performed(a.event_id);linked.add(state.var);
   if(['COMPLETION','SUCCESS'].includes(link.aspect)){const point='state:'+state.var;phaseStates.set(state.var,{point,event_id:a.event_id,expression_id:x.id});orders.push({id:'state-after-start:'+x.id,from:a.event_id+':start',to:point,relation:'LTE',guard:state,rule:'REVIEWED_TERMINAL_STATE_WITHIN_OWN_EVENT',sources:x.sources},{id:'state-before-end:'+x.id,from:point,to:a.event_id+':end',relation:'LTE',guard:state,rule:'REVIEWED_TERMINAL_STATE_WITHIN_OWN_EVENT',sources:x.sources});}
   if(link.relation==='IFF'||link.relation==='STATE_IMPLIES_EVENT')add('state-to-event:'+x.id,{implies:[state,event]},'REVIEWED_STATE_EVENT_RELATION',[a.fact_id,x.id],x.sources);
   if(link.relation==='IFF'||link.relation==='EVENT_IMPLIES_STATE')add('event-to-state:'+x.id,{implies:[event,state]},'REVIEWED_EVENT_STATE_RELATION',[a.fact_id,x.id],x.sources);
  }
  add('realized-activation:'+a.event_id,{implies:[performed(a.event_id),activated(a.event_id)]},'REALIZATION_REQUIRES_ACTIVATION',[a.fact_id],a.sources);
  if(a.mode==='FORBIDDEN'&&!a.conditions.length)add('forbidden-activation:'+a.event_id,{not:activated(a.event_id)},'UNCONDITIONAL_FORBIDDEN_ACTIVATION',[a.fact_id],a.sources);
  for(const q of a.conditions.filter(x=>x.kind==='CONDITION')){const p=expression(q.expression_id);
   if(a.mode==='FORBIDDEN'&&q.direction==='SUFFICIENT')add('forbidden-activation:'+q.claim_id,{implies:[p,{not:activated(a.event_id)}]},'CONDITIONAL_FORBIDDEN_ACTIVATION',[a.fact_id,q.claim_id],a.sources);
   // Necessary preconditions are attached below at the activation time.
   // Final terminal truth cannot replace truth at the event start.
  }
 }
 const atStart=(id,eventId,condition,path=[])=>{if(path.includes(id))throw Error('JOINT_EXPRESSION_CYCLE');const x=exprs.get(id);if(x?.op==='STATE'){const global=variable(key(['STATE',x.state.predicate,x.state.event_id,x.state.args])),phase=phaseStates.get(global.var);if(!phase)return expression(id);
   const local=variable(key(['STATE_AT_EVENT_START',global.var,eventId])),guard=activated(eventId),checkId=condition.claim_id+':'+id;
   add('local-implies-terminal:'+checkId,{implies:[local,global]},'STATE_AT_START_REQUIRES_TERMINAL_STATE',[condition.claim_id,id],x.sources);
   orders.push({id:'state-before-activation:'+checkId,from:phase.point,to:eventId+':start',relation:'LTE',guard:{all:[guard,local]},rule:'NECESSARY_STATE_ALREADY_TRUE_AT_EVENT_START',sources:x.sources},{id:'state-not-yet-true:'+checkId,from:eventId+':start',to:phase.point,guard:{all:[guard,global,{not:local}]},rule:'FALSE_AT_START_TERMINAL_STATE_OCCURS_LATER',sources:x.sources});
   state_checks.push({id:checkId,global_variable:global.var,local_variable:local.var,state_point:phase.point,event_start:eventId+':start',guard,sources:x.sources});return x.state.polarity==='NEGATIVE'?{not:local}:local;
  }if(x?.op==='TEST')return expression(id);if(x?.op==='NOT')return {not:atStart(x.operands[0],eventId,condition,[...path,id])};if(['AND','ALL','OR','ANY'].includes(x?.op))return {[['AND','ALL'].includes(x.op)?'all':'any']:x.operands.map(v=>atStart(v,eventId,condition,[...path,id]))};throw Error('NECESSARY_START_EXPRESSION_NOT_SUPPORTED');};
 for(const a of atoms.filter(a=>['REQUIRED','PERMITTED'].includes(a.mode)))for(const condition of a.conditions.filter(q=>q.kind==='CONDITION'&&['NECESSARY','IFF'].includes(q.direction))){const timed=atStart(condition.expression_id,a.event_id,condition);add('timed-activation-gate:'+condition.claim_id,{implies:[activated(a.event_id),timed]},'NECESSARY_CONDITION_CHECKED_AT_EVENT_START',[a.fact_id,condition.claim_id],a.sources);
  const fact=ir.facts.find(f=>f.kind==='CONDITION'&&f.claim?.id===condition.claim_id);for(const existing of constraints.filter(c=>c.rule==='EXPLICIT_NECESSARY_CONDITION'&&c.fact_ids.includes(fact?.id))){existing.original_formula=existing.formula;existing.formula={implies:[performed(a.event_id),timed]};existing.rule='EXPLICIT_NECESSARY_CONDITION_AT_EVENT_START';}
 }
 for(const id of usedStates)if(!linked.has(id))gaps.push({variable:id,reason:'REFERENCED_STATE_EVENT_RELATION_REQUIRED'});
 for(const r of comparisons)if(r.result==='UNKNOWN')gaps.push({fact_ids:[r.left_atom,r.right_atom],reason:r.reason});
 for(const r of comparisons)if(r.result==='CONFLICT')add('norm-conflict:'+r.left_atom+':'+r.right_atom,false,'PROVEN_NORMATIVE_CONFLICT',[r.left_atom,r.right_atom],r.proof?.sources??[]);
 for(const r of c.availability){const producer=events.get(r.producer_event_id),consumer=events.get(r.consumer_event_id);if(!producer||!consumer||!['REQUIRED','PERMITTED'].includes(producer.event.modality)||!['REQUIRED','PERMITTED'].includes(consumer.event.modality)||r.relation_status!=='ACCEPTED'||r.eligible!==true){gaps.push({relation_id:r.relation_id,reason:'ARTIFACT_CERTIFIED_POSITIVE_ENDPOINT_REQUIRED'});continue;}
  const ready=variable(key(['ARTIFACT_READY_AT_USE',r.relation_id]));
  add('artifact-use:'+r.relation_id,{implies:[performed(r.consumer_event_id),ready]},'DECLARED_RESULT_AVAILABLE_AT_USE',[r.relation_id,...r.input_claim_ids],r.sources);
  add('artifact-producer:'+r.relation_id,{implies:[ready,activated(r.producer_event_id)]},'DECLARED_CURRENT_RESULT_HAS_ACTIVE_PRODUCER',[r.relation_id,...r.input_claim_ids],r.sources);
  const guard=ready,mid='result:'+r.relation_id+':'+r.availability;
  orders.push({id:'production:'+r.relation_id,from:r.producer_event_id+':start',to:mid,guard,rule:'RESULT_READINESS_MILESTONE_NOT_WHOLE_PRODUCER_COMPLETION',sources:r.sources},{id:'use:'+r.relation_id,from:mid,to:r.consumer_event_id+':use',guard,rule:'DECLARED_USE_REQUIRES_READINESS',sources:r.sources});
 }
 for(const edge of c.dependency.edges){
  const endpoint=id=>edge.ownership_paths?.find(p=>p.event_id===id);
  const from=endpoint(edge.from),to=endpoint(edge.to),reference=from?.reference_only;
  if(to?.reference_only){gaps.push({fact_id:edge.fact_id,reason:'REFERENCE_DESTINATION_ORDER_NOT_SUPPORTED'});continue;}
  const guard=reference?{all:[performed(edge.to),expression(edge.expression_id)]}:{all:[performed(edge.from),performed(edge.to),expression(edge.expression_id)]};
  if(reference)add('reference-before:'+edge.id,{implies:[performed(edge.to),expression(edge.expression_id)]},'DECLARED_REFERENCE_COMPLETION_REQUIRED_BEFORE_TARGET',[edge.fact_id,from.reference_state_id],edge.sources);
  orders.push({...edge,from:reference?'reference-state:'+from.reference_state_id:edge.from+':end',to:edge.to+':start',guard,rule:reference?'EXPLICIT_REFERENCE_COMPLETION_BEFORE_TARGET_NO_ACTIVATION':'EXPLICIT_ORDER_WITH_DECLARED_STATE_GUARD'});
 }
 for(const a of atoms){orders.push({id:'lifecycle:'+a.event_id,from:a.event_id+':start',to:a.event_id+':use',guard:activated(a.event_id),rule:'ABSTRACT_EVENT_MILESTONE_ORDER'},{id:'lifecycle-end:'+a.event_id,from:a.event_id+':use',to:a.event_id+':end',guard:performed(a.event_id),rule:'ABSTRACT_EVENT_MILESTONE_ORDER'});}
 for(const a of atoms.filter(a=>a.mode==='FORBIDDEN'&&a.semantic_signature?.effects.includes('CONTINUE'))){
  const targets=a.semantic_signature.continuation_targets;
  if(!targets?.length){gaps.push({fact_id:a.fact_id,reason:'CONTINUATION_SCOPE_TARGETS_REQUIRED'});continue;}
  const leaves=(id,seen=new Set())=>{if(seen.has(id))return [];seen.add(id);const x=exprs.get(id);return x?.op==='STATE'?[x]:(x?.operands??[]).flatMap(v=>leaves(v,seen));};
  let matched=false;
  for(const condition of a.conditions.filter(q=>q.direction==='SUFFICIENT'))for(const state of leaves(condition.expression_id)){
   const stop=atoms.find(s=>s.semantic_signature?.effects.includes('STOP')&&s.semantic_signature.state_links.some(l=>l.expression_id===state.id&&l.aspect==='CONTROL_EFFECT'));
   if(!stop)continue;matched=true;
   for(const target of targets){if(!events.has(target)||!events.get(a.event_id)?.proof?.checks?.some(x=>x.id===target&&x.status==='ACCEPTED')){gaps.push({fact_id:a.fact_id,target,reason:'CONTINUATION_TARGET_NOT_CERTIFIED'});continue;}
    orders.push({id:'stop-scope:'+a.event_id+':'+target,from:target+':end',to:stop.event_id+':start',guard:{all:[performed(target),performed(stop.event_id),expression(condition.expression_id)]},rule:'COMPLETED_WORK_NOT_CONTINUED_DURING_DECLARED_STOP_PHASE',sources:a.sources});
   }
  }
  if(!matched)gaps.push({fact_id:a.fact_id,reason:'STOP_PHASE_BINDING_REQUIRED'});
 }
 for(const q of c.quantities)if(events.get(q.quantity.target_id)?.constraints?.some(x=>['CONDITION','TEMPORAL'].includes(x.kind)))gaps.push({claim_id:q.claim_id,reason:'GUARDED_NUMERIC_JOIN_NOT_SUPPORTED'});
 const intervals=c.intervals.map((x,i)=>({...x,id:'interval:'+i}));
 const scope=buildScopeDomains(ir,atoms,activated);gaps.push(...scope.gaps);constraints.push(...scope.constraints);
 const binding=checkIRBindings(ir);for(const x of binding.checks)if(!x.pass)gaps.push({fact_id:x.id,reason:x.rule});
 if(c.unsupported.length||c.coverage.source_gaps||c.coverage.unresolved_facts)gaps.push({reason:'UPSTREAM_COVERAGE_OR_COMPUTATION_GAP'});
 const declaredVariables=[...new Set([...constraints.flatMap(x=>vars(x.formula)),...orders.flatMap(x=>x.guard?vars(x.guard):[])])].sort();
 const meanings=Object.fromEntries(c.boolean.atoms.map(a=>[a.id,a.meaning]));
 for(const s of state_checks)meanings[s.local_variable]={...meanings[s.global_variable],kind:'STATE_AT_EVENT_START',checked_event_id:s.event_start.slice(0,-6)};
 for(const a of atoms)meanings[activated(a.event_id).var]={kind:'EVENT_ACTIVATED',event_id:a.event_id,predicate:a.operation};
 for(const r of c.availability)meanings[key(['ARTIFACT_READY_AT_USE',r.relation_id])]={kind:'ARTIFACT_READY_AT_USE',artifact_id:r.artifact_id,consumer_event_id:r.consumer_event_id,producer_event_id:r.producer_event_id,availability:r.availability};
 // Recognize only declared quantity units, never source text or metric words.
 const timeUnits=new Set(['分钟','分钟以内','秒','小时','minute','minutes','min','second','seconds','s','hour','hours','h']);
 const temporal_horizons=intervals.filter(x=>x.subject==='ROOT'&&timeUnits.has(x.unit)).map(x=>({interval_id:x.id,unit:x.unit,source_constraint_ids:x.constraint_ids}));
 const problem={variables:declaredVariables,constraints,intervals,orders,domains:scope.domains,scope_bindings:scope.bindings,binding_checks:binding.checks,state_checks,variable_meanings:meanings,temporal_horizons};
 const run=extra=>{const p={...problem,constraints:[...constraints,...extra]},v=[...new Set([...p.variables,...extra.flatMap(x=>vars(x.formula))])];try{return {...solveJointBoundary({...p,variables:v}),query_constraints:extra};}catch(e){return {result:'unknown',reason:e.message,witness:null};}};
 // A missing contract does not silently become a weaker proof.
 if(gaps.length)return {status:'PARTIAL',gaps,constraint_count:constraints.length,problem,base:{result:'unknown',reason:'SEMANTIC_OR_COMPUTATION_GAP',witness:null},completion:[],trigger_branches:[],business_decision:null,execution_authorization:null};
 const base=run([]),completion=c.conditions.filter(x=>x.kind==='COMPLETION').map(x=>{const v=variable(key(['TASK_COMPLETE',x.target_id]));return {claim_id:x.claim_id,...run([{id:'query-completed:'+x.claim_id,formula:v,rule:'QUERY_GOAL_NOT_SOURCE_OBLIGATION',fact_ids:[x.fact_id],sources:x.sources}])};});
 const trigger_branches=atoms.filter(a=>a.semantic_signature?.effects.includes('STOP')).flatMap(a=>a.conditions.filter(x=>x.kind==='CONDITION'&&x.direction==='SUFFICIENT').map(q=>({event_id:a.event_id,expression_id:q.expression_id,...run([{id:'query-trigger:'+q.claim_id,formula:expression(q.expression_id),rule:'QUERY_TRIGGER_NOT_SOURCE_OBLIGATION',fact_ids:[a.fact_id,q.claim_id],sources:a.sources}])})));
 return {status:base.result==='unknown'?'PARTIAL':base.result==='unsatisfiable'?'UNSAT':'PROVEN',gaps,problem,base,completion,trigger_branches,proof_scope:'DECLARED_FINITE_ABSTRACT_CONSTRAINTS; logical milestones, not physical duration forecasts or observed execution',business_decision:null,execution_authorization:null};
}
