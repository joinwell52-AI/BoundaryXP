// Adapter only: consume the accepted typed IR, never source text or notes.
// The solvers stay in src/bxp; this file adds no protocol or business authority.
import {solveBooleanConstraints} from '../../../src/bxp/boolean-solver.mjs';
import {intersectValidatedIntervals} from '../../../src/bxp/interval-solver.mjs';
import {solveValidatedPrerequisites} from '../../../src/bxp/dependency-solver.mjs';
import {evaluateValidatedTargetSet} from '../../../src/bxp/target-set-solver.mjs';
import {evaluateExpression,evaluateCondition,evaluateQuantity} from './compile.mjs';
import {evaluateArtifactAvailability} from './artifacts.mjs';
import {sha256} from './source.mjs';
import {evaluateDistributedQuantity,setDomain,isSetDomain} from './quantity-domain.mjs';
import {assessConditionalObservation} from './condition-assessment.mjs';
import {mathematicalResults,renderMathematicalResults} from './calculation-results.mjs';
const digest=x=>sha256(JSON.stringify(x));
const distinct=xs=>[...new Set(xs)];

export function calculateBoundary(ir,observations={}){
 if(!ir?.format?.startsWith('boundx-boundary-ir/'))throw Error('CALCULUS_REQUIRES_NATIVE_BOUNDARY_IR');
 const expressions=ir.expressions??[],index=new Map(expressions.map(x=>[x.id,x]));
 const accepted=(ir.facts??[]).filter(f=>f.status==='ACCEPTED');
 const events=new Map(accepted.filter(f=>f.kind==='EVENT').map(f=>[f.event.id,f.event]));
 const eventFacts=new Map(accepted.filter(f=>f.kind==='EVENT').map(f=>[f.event.id,f]));
 const declaredEventFacts=new Map((ir.facts??[]).filter(f=>f.kind==='EVENT').map(f=>[f.event.id,f]));
 const conditions=[],quantities=[],ranges=[],availability=[],unsupported=[],formulas=[],atoms=new Map(),intervals=[],edges=[];
 const provenance=f=>({fact_id:f.id,claim_ids:f.claim_ids??[],source_sha256:ir.source_sha256,sources:f.sources??[]});
 // owner is a structural container, never an execution or ordering edge.
 // Only a closed, accepted, unconditional current-task ownership path is
 // supported here. Ancestor conditions/permissions are not silently copied.
 const scopeCache=new Map();
 const eventScope=event=>{
  if(!event)return {supported:false,reason:'EVENT_NOT_ACCEPTED',path:[]};
  if(scopeCache.has(event.id))return scopeCache.get(event.id);
  const path=[],facts=[],seen=new Set();let current=event,reason=null;
  while(current){
   if(seen.has(current.id)){reason='OWNER_CYCLE';break;}seen.add(current.id);path.push(current.id);
   const fact=eventFacts.get(current.id);
   if(!fact){reason='OWNER_NOT_ACCEPTED';break;}facts.push(fact);
   if(current.use!=='CURRENT_TASK'||current.layer!=='MAIN'||current.polarity!=='POSITIVE'){reason='OWNER_LAYER_NOT_CURRENT_MAIN';break;}
   if(current.id!==event.id){
    if(!(fact.sources??[]).some(s=>s.source_sha256===ir.source_sha256&&Array.isArray(s.span)&&s.span.length===2&&typeof s.quote==='string'&&s.quote.length)){reason='OWNER_PROVENANCE_MISSING';break;}
    if(current.kind!=='ACTION'||current.modality!=='REQUIRED'){reason='OWNER_ACTIVATION_NOT_UNCONDITIONAL_REQUIRED';break;}
    const constraints=[...(fact.constraints??[]),...accepted.filter(f=>f.claim?.event_id===current.id).map(f=>f.claim)];
    if(constraints.some(c=>['CONDITION','TEMPORAL'].includes(c.kind))){reason='OWNER_GUARDED_ACTIVATION_NOT_SUPPORTED';break;}
   }
   if(current.owner_id==='ROOT'){path.push('ROOT');break;}
   current=events.get(current.owner_id);
   if(!current){reason='OWNER_NOT_ACCEPTED';break;}
  }
  const result={supported:!reason&&path.at(-1)==='ROOT',reason,path,
   evidence:facts.map(f=>({event_id:f.event.id,...provenance(f)}))};
  scopeCache.set(event.id,result);return result;
 };
 const ownershipProof=ids=>distinct(ids.filter(Boolean)).map(id=>({event_id:id,...eventScope(events.get(id))}));
 // Ordering certifies a relation, not execution or activation of either endpoint.
 // The independent relation carries reviewed endpoint references and technical proof.
 const orderEndpointProof=(id,relation)=>{
  const fact=declaredEventFacts.get(id),event=fact?.event;
  const row=relation.proof?.checks?.find(x=>x.id===id);
  if(!event||fact.status==='REJECTED'||!row||row.errors?.length||row.status==='REJECTED')throw Error('ORDER_ENDPOINT_INVALID');
  const referenceOnly=event.use==='MENTION_ONLY'&&event.layer==='CONDITION'&&event.modality==='UNSTATED';
  if(event.polarity!=='POSITIVE'||!(referenceOnly||event.use==='CURRENT_TASK'&&event.layer==='MAIN'))throw Error('ORDER_ENDPOINT_LAYER_NOT_CURRENT_MAIN');
  let referenceState=null;
  if(referenceOnly){
   if(row.status!=='ACCEPTED')throw Error('ORDER_REFERENCE_ENDPOINT_NOT_CERTIFIED');
   const leaves=(id,seen=new Set())=>{if(seen.has(id))throw Error('EXPRESSION_CYCLE');const x=index.get(id);if(x?.op==='STATE')return [x];if(['AND','ALL'].includes(x?.op))return x.operands.flatMap(k=>leaves(k,new Set([...seen,id])));throw Error('ORDER_ENDPOINT_NOT_UNIQUE_CONJUNCTIVE_EVENT');};
   const states=leaves(relation.claim.expression_id).filter(x=>x.state.event_id===event.id&&x.state.polarity==='POSITIVE');
   if(states.length!==1||!event.semantic_signature?.state_links?.some(l=>l.expression_id===states[0].id&&l.aspect==='COMPLETION'&&l.relation==='IFF')||!relation.proof.checks.some(r=>r.id===states[0].id&&r.status==='ACCEPTED'))throw Error('ORDER_REFERENCE_STATE_NOT_CERTIFIED');
   referenceState=states[0].id;
  }
  if(!(row.sources??[]).some(s=>s.source_sha256===ir.source_sha256&&Array.isArray(s.span)&&s.quote))throw Error('ORDER_ENDPOINT_PROVENANCE_MISSING');
  const parent=eventFacts.get(event.owner_id);
  if(event.owner_id!=='ROOT'&&(!parent||parent.event.modality!=='REQUIRED'||parent.event.kind!=='ACTION'||(parent.constraints??[]).some(c=>['CONDITION','TEMPORAL'].includes(c.kind))))throw Error('ORDER_ENDPOINT_ACTIVATION_SCOPE_NOT_SUPPORTED');
  const owner=event.owner_id==='ROOT'?{supported:true,path:['ROOT'],evidence:[]}:eventScope(events.get(event.owner_id));
  if(!owner.supported)throw Error('ORDER_ENDPOINT_ACTIVATION_SCOPE_NOT_SUPPORTED');
  return {event_id:id,supported:true,path:[id,...owner.path],endpoint_status:fact.status,reference_only:referenceOnly,reference_state_id:referenceState,evidence:[provenance(fact),...(owner.evidence??[])],relation_fact_id:relation.id,ordering_is_not_execution_authorization:true};
 };
 const atom=(key,meaning)=>{const id='v:'+digest(key).slice(0,24);atoms.set(id,{id,meaning});return {var:id};};
 const expressionFormula=(id,ancestors=[])=>{
  if(ancestors.includes(id))throw Error('EXPRESSION_CYCLE');const e=index.get(id);if(!e)throw Error('MISSING_EXPRESSION');
  if(e.op==='STATE'&&e.state){const base=atom(['STATE',e.state.predicate,e.state.event_id,e.state.args],{kind:'STATE',predicate:e.state.predicate,event_id:e.state.event_id,args:e.state.args});return e.state.polarity==='NEGATIVE'?{not:base}:base;}
  if(e.op==='TEST'&&e.test)return atom(['PROPERTY_TEST',e.test],{kind:'PROPERTY_TEST',test:e.test});
  if(e.op==='NOT')return {not:expressionFormula(e.operands[0],[...ancestors,id])};
  if(['AND','ALL','OR','ANY'].includes(e.op))return {[['AND','ALL'].includes(e.op)?'all':'any']:e.operands.map(x=>expressionFormula(x,[...ancestors,id]))};
  throw Error('NOT_A_BOOLEAN_EXPRESSION');
 };
 const declaredStateEvents=(id,ancestors=[])=>{
  if(ancestors.includes(id))throw Error('EXPRESSION_CYCLE');const e=index.get(id);if(!e)throw Error('MISSING_EXPRESSION');
  // OR alternatives and negative states must not become unconditional edges.
  if(e.op==='STATE'&&e.state?.polarity==='POSITIVE'&&e.state.event_id)return [e.state.event_id];
  if(['AND','ALL'].includes(e.op))return distinct(e.operands.flatMap(x=>declaredStateEvents(x,[...ancestors,id])));
  throw Error('ORDER_ENDPOINT_NOT_UNIQUE_CONJUNCTIVE_EVENT');
 };
 const addFormula=(formula,f,rule)=>formulas.push({formula,rule,...provenance(f),ownership_paths:ownershipProof([f.event?.id,f.claim?.event_id])});
 for(const f of ir.facts??[]){
  if(f.status!=='ACCEPTED'){unsupported.push({...provenance(f),reason:'IR_FACT_NOT_ACCEPTED',status:f.status});continue;}
  const c=f.claim;
  if(['CONDITION','TEMPORAL','COMPLETION','STOP'].includes(f.kind)&&c){
   const evaluation=evaluateCondition(c,expressions,observations.states??{},observations.tests??{});
   const targetSupported=!c.event_id||!!f.output_specification||eventScope(events.get(c.event_id)).supported;
   const assessment=assessConditionalObservation(f,evaluation.condition_value,observations.outcomes?.[c.id],targetSupported);
   conditions.push({...provenance(f),kind:f.kind,claim_id:c.id,expression_id:c.expression_id,...evaluation,assessment,...(f.output_specification?{output_specification:f.output_specification}: {})});
   try{
    const event=events.get(c.event_id),spec=f.output_specification;
    const currentTarget=!!spec&&event?.polarity==='POSITIVE'&&['REQUIRED','PERMITTED','FORBIDDEN'].includes(event.modality)||!c.event_id||(eventScope(event).supported&&['REQUIRED','PERMITTED','FORBIDDEN'].includes(event.modality));
    if(c.direction!=='ORDER'&&currentTarget){
     const antecedent=expressionFormula(c.expression_id);
     const target=spec?atom(['OUTPUT_BEHAVIOR',spec.artifact_id,c.event_id],{kind:'OUTPUT_BEHAVIOR',artifact_id:spec.artifact_id,event_id:c.event_id,producer_result_id:spec.producer_result_id}):atom([f.kind==='COMPLETION'?'TASK_COMPLETE':f.kind==='STOP'?'TASK_STOP':'EVENT_EXECUTED',c.event_id??c.scope_id],{kind:f.kind==='COMPLETION'?'TASK_COMPLETE':f.kind==='STOP'?'TASK_STOP':'EVENT_EXECUTED',event_id:c.event_id??null});
     if(event?.modality==='FORBIDDEN'){
      if(c.direction!=='SUFFICIENT')throw Error('CONDITIONAL_PROHIBITION_DIRECTION_NOT_SUPPORTED');
      addFormula({implies:[antecedent,{not:target}]},f,'EXPLICIT_SUFFICIENT_PROHIBITION');
     }else{
      if(['NECESSARY','IFF'].includes(c.direction))addFormula({implies:[target,antecedent]},f,'EXPLICIT_NECESSARY_CONDITION');
      if(['SUFFICIENT','IFF'].includes(c.direction)){
       if(event?.modality==='PERMITTED')throw Error('PERMISSION_IS_NOT_REQUIRED_EXECUTION');
       addFormula({implies:[antecedent,target]},f,'EXPLICIT_SUFFICIENT_TRANSITION');
      }
     }
    }
   }catch(e){unsupported.push({...provenance(f),reason:e.message});}
   if(c.temporal){
    try{
     const previous=declaredStateEvents(c.expression_id);
     if(c.direction==='ORDER'&&f.relation_acceptance_is_not_event_acceptance){
      if(!c.event_id)throw Error('ORDER_ENDPOINT_INVALID');
      const proofs=new Map(distinct([...previous,c.event_id]).map(id=>[id,orderEndpointProof(id,f)]));
      for(const before of previous)edges.push({id:c.id+':'+before,kind:'prerequisite',from:c.temporal==='AFTER'?before:c.event_id,to:c.temporal==='AFTER'?c.event_id:before,guard_context:digest([c.direction,c.expression_id]),direction:c.direction,expression_id:c.expression_id,ownership_paths:[proofs.get(before),proofs.get(c.event_id)],ordering_is_not_execution_authorization:true,...provenance(f)});
     }else{
      if(!c.event_id||!events.has(c.event_id)||previous.some(x=>!events.has(x)))throw Error('ORDER_ENDPOINT_NOT_ACCEPTED_EVENT');
      if(!eventScope(events.get(c.event_id)).supported||previous.some(x=>!eventScope(events.get(x)).supported))throw Error('ORDER_ENDPOINT_ACTIVATION_SCOPE_NOT_SUPPORTED');
      for(const before of previous)edges.push({id:c.id+':'+before,kind:'prerequisite',from:c.temporal==='AFTER'?before:c.event_id,to:c.temporal==='AFTER'?c.event_id:before,guard_context:digest([c.direction,c.expression_id]),direction:c.direction,expression_id:c.expression_id,ownership_paths:ownershipProof([before,c.event_id]),...provenance(f)});
     }
    }catch(e){unsupported.push({...provenance(f),reason:e.message});}
   }
  }
  if(f.kind==='EVENT'){
   const e=f.event,cs=f.constraints??[];
   if(f.output_specification){
    if(e.polarity!=='POSITIVE')continue;
    const conditional=cs.filter(x=>x.kind==='CONDITION');
    const target=atom(['OUTPUT_BEHAVIOR',f.output_specification.artifact_id,e.id],{kind:'OUTPUT_BEHAVIOR',artifact_id:f.output_specification.artifact_id,event_id:e.id,producer_result_id:f.output_specification.producer_result_id});
    if(e.modality==='REQUIRED'&&!conditional.some(x=>['SUFFICIENT','IFF'].includes(x.direction)))addFormula(target,f,'REQUIRED_OUTPUT_BEHAVIOR_NOT_TASK_EXECUTION');
    if(e.modality==='FORBIDDEN'&&!conditional.length)addFormula({not:target},f,'FORBIDDEN_OUTPUT_BEHAVIOR_NOT_TASK_PROHIBITION');
    continue;
   }
   if(e.use!=='CURRENT_TASK'||e.layer!=='MAIN'||e.polarity!=='POSITIVE')continue;
   const scope=eventScope(e);
   if(!scope.supported){unsupported.push({...provenance(f),reason:'OWNED_EVENT_ACTIVATION_SCOPE_NOT_SUPPORTED',detail:scope.reason,ownership_path:scope.path});continue;}
   const conditional=cs.filter(x=>x.kind==='CONDITION');
   const target=atom(['EVENT_EXECUTED',e.id],{kind:'EVENT_EXECUTED',event_id:e.id,predicate:e.predicate});
   if(e.modality==='REQUIRED'&&!conditional.some(x=>['SUFFICIENT','IFF'].includes(x.direction)))addFormula(target,f,'REQUIRED_CURRENT_MAIN_EVENT');
   if(e.modality==='FORBIDDEN'&&!conditional.length)addFormula({not:target},f,'UNCONDITIONAL_PROHIBITION');
  }
  if(f.kind==='QUANTITY'&&c?.quantity){
   const q=c.quantity,seen=observations.quantities?.[c.id];
   const evaluation=evaluateDistributedQuantity(q,expressions,ir.entities??[],seen,observations.memberships??{},evaluateQuantity);
   quantities.push({...provenance(f),claim_id:c.id,quantity:q,observed:seen??null,...evaluation,structurally_expressed:true,evaluation_is_execution_proof:false});
   if(typeof q.value!=='number'||!Number.isFinite(q.value)||!['EQ','LT','LTE','GT','GTE'].includes(q.comparator)){unsupported.push({...provenance(f),reason:'QUANTITY_NOT_EXACT_DECIMAL_COMPARATOR'});continue;}
   const value=String(q.value);if(!/^-?\d+(?:\.\d+)?$/.test(value)){unsupported.push({...provenance(f),reason:'DECIMAL_EXPONENT_NOT_SUPPORTED'});continue;}
   // Guard contexts are separate: mutually exclusive branches cannot be
   // intersected as unconditional quantities. No inferred unit conversion.
   const context=(f.constraints??[]).filter(x=>['CONDITION','TEMPORAL'].includes(x.kind)).map(x=>[x.kind,x.expression_id,x.direction,x.temporal]);
   const bound={value,inclusive:['EQ','LTE','GTE'].includes(q.comparator)};
   const domain=q.distribution?.mode==='EACH'?setDomain(expressions,ir.entities??[],q.distribution.domain_id,observations.memberships??{}):null;
   if(domain&&!domain.complete){unsupported.push({...provenance(f),reason:'MEMBERSHIP_REQUIRED_FOR_INTERVAL_EXPANSION',domain_id:q.distribution.domain_id,structurally_expressed:true,missing_input:'membership observation, not an inferred source binding'});continue;}
   for(const subject of domain?domain.members:[q.target_id])intervals.push({id:domain?c.id+':'+subject:c.id,scope_id:digest([q.count_scope,q.use,q.distribution?.mode??null,q.distribution?.domain_id??null,f.event?.owner_id,context]),subject,dimension:q.metric,unit:q.unit,domain:'real',lower:['EQ','GT','GTE'].includes(q.comparator)?bound:null,upper:['EQ','LT','LTE'].includes(q.comparator)?bound:null,...provenance(f),...(domain?{quantified_claim_id:c.id,domain_id:q.distribution.domain_id,member_id:subject,domain_provenance_ids:domain.provenance_ids??[]}:{})});
  }
  if(f.kind==='SCOPE'&&c){
   const domain=isSetDomain(expressions,ir.entities??[],c.expression_id)?setDomain(expressions,ir.entities??[],c.expression_id,observations.memberships??{}):null;
   const booleanScope=(id,seen=new Set())=>{if(seen.has(id))return false;const x=index.get(id);if(!x)return false;if(x.op==='STATE')return !!x.state;if(x.op==='TEST')return !!x.test;return ['NOT','AND','ALL','OR','ANY'].includes(x.op)&&x.operands.every(k=>booleanScope(k,new Set([...seen,id])));};
   const booleanQualifier=!domain&&booleanScope(c.expression_id);
   const value=domain?domain.complete?new Set(domain.members):'UNKNOWN':evaluateExpression(expressions,c.expression_id,observations.states??{},observations.tests??{});
   const suppliedQueries=observations.range_queries?.[c.id];
   const membership_queries=(Array.isArray(suppliedQueries)?suppliedQueries:[]).map(query=>{
    const entity=ir.entities?.find(e=>e.id===query.target_id);
    const known=domain?.complete===true&&query.identity_known===true&&!!entity&&entity.type!=='REFERENT'&&!(entity.alternatives??[]).length;
    const evaluated=evaluateValidatedTargetSet({id:query.id??null,scope_id:c.scope_id,forbidden:domain?.members??[],requested:known?[entity.id]:[],identity_status:known?'resolved':'unresolved'});
    return {query_id:query.id??null,target_id:query.target_id??null,result:evaluated.result==='overlap'?'TRUE':evaluated.result==='disjoint'?'FALSE':'UNKNOWN',core_result:evaluated.result,...provenance(f),execution_authorization:null};
   });
   ranges.push({...provenance(f),expression_id:c.expression_id,target_id:c.scope_id,scope_fragment:domain?'ENTITY_SET':booleanQualifier?'BOOLEAN_QUALIFIER':'UNSUPPORTED',result:value instanceof Set?'FINITE_SET':typeof value==='string'?value:'UNKNOWN',members:value instanceof Set?[...value].sort():null,membership_queries,...(domain?{membership_complete:domain.complete,domain_provenance_ids:domain.provenance_ids??[],reason:domain.reason??null}:{}),structurally_expressed:!!domain||booleanQualifier,evaluation_is_execution_proof:false,execution_authorization:null});
   if(!domain&&!booleanQualifier)unsupported.push({...provenance(f),reason:'SCOPE_EXPRESSION_NOT_SUPPORTED'});
   const hasTests=(id,seen=new Set())=>{if(seen.has(id))return false;seen.add(id);const x=index.get(id);return x?.op==='TEST'||(x?.operands??[]).some(k=>hasTests(k,seen));};
   if(hasTests(c.expression_id)&&booleanQualifier&&f.event?.polarity==='POSITIVE'&&(f.event?.use==='CURRENT_TASK'&&['REQUIRED','PERMITTED'].includes(f.event.modality)||f.output_specification&&['REQUIRED','PERMITTED'].includes(f.event?.modality))){
    // Event-local method constraints apply when this action/behavior occurs;
    // they do not demand execution of a permitted or conditional action.
    const event=f.event,target=f.output_specification?atom(['OUTPUT_BEHAVIOR',f.output_specification.artifact_id,event.id],{kind:'OUTPUT_BEHAVIOR',artifact_id:f.output_specification.artifact_id,event_id:event.id}):atom(['EVENT_EXECUTED',event.id],{kind:'EVENT_EXECUTED',event_id:event.id});
    addFormula({implies:[target,expressionFormula(c.expression_id)]},f,'EXPLICIT_PROPERTY_SCOPE_WHEN_EVENT_OCCURS');
   }else if(hasTests(c.expression_id)&&booleanQualifier&&c.event_id===null&&c.scope_id==='ROOT'&&c.entity_id){
    addFormula(expressionFormula(c.expression_id),f,'EXPLICIT_ROOT_OBJECT_PROPERTY_SCOPE');
   }
  }
 }
 for(const relation of ir.artifact_dependencies??[])availability.push({relation_id:relation.id,relation_status:relation.status,eligible:relation.eligible,input_claim_ids:relation.input_claim_ids,sources:relation.sources,artifact_id:relation.artifact_id,producer_event_id:relation.producer_event_id,consumer_event_id:relation.consumer_event_id,availability:relation.availability,result:evaluateArtifactAvailability(relation,observations.artifacts?.[relation.id]),implies_event_order:false});
 // Independent Boolean components may be solved separately without changing
 // the existing solver's limits; a large connected component stays unsupported.
 const variablesOf=expression=>typeof expression==='boolean'?[]:expression.var?[expression.var]:expression.not?variablesOf(expression.not):Object.values(expression)[0].flatMap(variablesOf);
 const problems=[];
 for(const f of formulas){const vars=new Set(variablesOf(f.formula)),joined=problems.filter(p=>[...vars].some(v=>p.variables.has(v)));const problem={variables:vars,formulas:[f]};for(const p of joined){for(const v of p.variables)vars.add(v);problem.formulas.push(...p.formulas);problems.splice(problems.indexOf(p),1);}problems.push(problem);}
 let boolean;
 if(!formulas.length)boolean={status:'NOT_APPLICABLE',result:null};
 else{
  const components=problems.map(p=>{const variables=[...p.variables];try{return {status:'CALCULATED',variables,fact_ids:distinct(p.formulas.map(f=>f.fact_id)),...solveBooleanConstraints(variables,p.formulas.map(f=>f.formula))};}catch(e){return {status:'UNSUPPORTED',variables,fact_ids:distinct(p.formulas.map(f=>f.fact_id)),result:null,reason:e.message};}});
  const unsupported=components.some(x=>x.status==='UNSUPPORTED'),unsat=components.some(x=>x.result==='unsatisfiable');
  boolean={status:unsupported?'PARTIAL':'CALCULATED',result:unsat?'unsatisfiable':unsupported?null:'satisfiable',components,witness:unsupported||unsat?null:Object.assign({},...components.map(x=>x.witness)),scope:'explicit accepted event obligations and condition/transition formulas only',business_observations_proven:false};
 }
 const intervalResults=intersectValidatedIntervals(intervals).map(x=>({...x,input_constraints:intervals.filter(n=>x.constraint_ids.includes(n.id))}));
 // Only explicit ORDER / necessary temporal edges share unconditional graph.
 // Sufficient-trigger temporal edges retain separate contexts, not flattened.
 const unconditional=edges.filter(x=>['ORDER','NECESSARY','IFF'].includes(x.direction));
 const dependency={status:unconditional.length?'CALCULATED':'NOT_APPLICABLE',...solveValidatedPrerequisites(unconditional),edges:unconditional,conditional_edges:edges.filter(x=>!unconditional.includes(x)),availability_not_order:true};
 const conflicts=[...(boolean.result==='unsatisfiable'?[{kind:'BOOLEAN_UNSAT',fact_ids:formulas.map(x=>x.fact_id)}]:[]),...intervalResults.filter(x=>x.empty).map(x=>({kind:'EMPTY_QUANTITY_INTERVAL',constraint_ids:x.constraint_ids})),...dependency.cycles.map(x=>({kind:'TEMPORAL_CYCLE',...x}))];
 const gaps=ir.gaps??[],unresolved=(ir.facts??[]).filter(x=>x.status!=='ACCEPTED');
 const result={format:'boundx-calculation-trace/experimental-v1',adapter_version:'native-ir-to-existing-core-r04',input_ir_sha256:digest(ir),source_sha256:ir.source_sha256,status:conflicts.length?'CONFLICT':unsupported.length||gaps.length||unresolved.length||boolean.status==='PARTIAL'?'PARTIAL':'CALCULATED_FRAGMENT',boolean:{...boolean,atoms:[...atoms.values()].filter(a=>formulas.some(f=>variablesOf(f.formula).includes(a.id))),formulas},conditions,quantities,ranges,availability,intervals:intervalResults,dependency,conflicts,unsupported,coverage:{ir_facts:(ir.facts??[]).length,accepted_facts:accepted.length,unresolved_facts:unresolved.length,source_gaps:gaps.length,source_semantic_completeness:'NOT_PROVEN',full_bxp_conformance:'NOT_PROVEN'},observations_supplied:Object.keys(observations).length>0,business_decision:null,execution_authorization:null};
 result.mathematical_results=mathematicalResults(ir,result);
 if(result.mathematical_results.conflicts.length>conflicts.length)result.status='CONFLICT';
 if(result.mathematical_results.status==='PARTIAL'&&result.status!=='CONFLICT')result.status='PARTIAL';
 return result;
}

export function renderCalculations(c){
 const labels={PARTIAL:'部分计算，存在缺口',CONFLICT:'发现结构化约束冲突',CALCULATED_FRAGMENT:'已计算受支持的明确约束',satisfiable:'约束存在可行组合',unsatisfiable:'约束不存在可行组合',UNKNOWN:'未知：没有足够运行观测',TRUE:'成立',FALSE:'不成立'};
 const lines=['\n## 程序边界计算',labels[c.status]??c.status,'计算仅消费本次IR，不读取原文补语义；可行组合不是已发生状态，也不是执行授权。'];
 lines.push(`布尔约束：${labels[c.boolean.result]??c.boolean.reason??c.boolean.status}。`);
 for(const q of c.quantities){
  lines.push(`- 数量 ${q.distribution==='EACH'?'逐成员：':q.distribution==='AGGREGATE'?'合计：':''}${q.quantity.metric} ${q.quantity.comparator} ${q.quantity.value} ${q.quantity.unit}；目标=${q.quantity.target_id}${q.domain_id?'；成员域='+q.domain_id:''}${q.quantity.use==='WORK_PLAN'?'；执行计划数量，不是资源配额':''}；当前核验=${labels[q.result]??q.result}。`);
  for(const member of q.members??[])lines.push(`  - 成员 ${member.member_id}：${labels[member.result]??member.result}。`);
 }
 for(const x of c.intervals)lines.push(`- 合并区间：目标=${x.subject}，单位=${x.unit}，下界=${JSON.stringify(x.lower)}，上界=${JSON.stringify(x.upper)}；${x.empty?'空区间：冲突':'区间非空'}。`);
 for(const x of c.conditions)lines.push(`- ${x.kind}：目标=${x.target_id}，方向=${x.direction}，时序=${x.temporal??'无'}，当前前提=${labels[x.condition_value]??x.condition_value}。`);
 lines.push(`显式时序：${c.dependency.prerequisite_edges}条；循环${c.dependency.cycles.length}个；条件时序保留${c.dependency.conditional_edges.length}条。`);
 for(const x of c.ranges){
  lines.push(`- 范围：目标=${x.target_id}；${x.members?JSON.stringify(x.members):labels[x.result]??x.result}。范围外不等于获准执行。`);
  for(const query of x.membership_queries??[])lines.push(`  - 成员核验：对象=${query.target_id}；${labels[query.result]??query.result}；这只是本条范围适用性，不是执行许可。`);
 }
 for(const x of c.availability)lines.push(`- 产物可用性：${x.artifact_id} → ${x.consumer_event_id}；${labels[x.result]??x.result}；不推出整项生产完成。`);
 for(const x of c.unsupported)lines.push(`- 未计算 ${x.fact_id}：${x.reason}。`);
 for(const x of c.conditions)if(x.assessment)lines.push(`- 条件 ${x.claim_id}：前提=${labels[x.condition_value]??x.condition_value}；结果观测=${labels[x.assessment.observed_outcome]??x.assessment.observed_outcome}；逻辑条件核验=${labels[x.assessment.logical_result]??x.assessment.logical_result}${x.temporal?'；实际时序尚需时间观测':''}。条件满足不证明执行，也不构成许可。`);
 return lines.join('\n')+'\n'+(c.mathematical_results?renderMathematicalResults(c.mathematical_results):'');
}
