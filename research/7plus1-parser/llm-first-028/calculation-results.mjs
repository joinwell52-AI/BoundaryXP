// Deterministic mathematical result adapter. Reads typed IR, never raw text/notes.
// Finite Boolean solving and membership use the same src/bxp Core as CLI/UI.
import {canonicalBooleanBoundary} from '../../../src/bxp/boolean-solver.mjs';
import {evaluateValidatedTargetSet} from '../../../src/bxp/target-set-solver.mjs';
import {sha256} from './source.mjs';
import {buildJointResults} from './joint-results.mjs';
const unique=xs=>[...new Set(xs)].sort();
export function mathematicalResults(ir,c){
 const accepted=(ir.facts??[]).filter(f=>f.status==='ACCEPTED');
 const entities=new Map((ir.entities??[]).map(e=>[e.id,e]));
 const expressions=new Map((ir.expressions??[]).map(e=>[e.id,e]));
 const expand=(id,path=[])=>{
  const e=entities.get(id);if(path.includes(id)||!e||e.type==='REFERENT'||e.alternatives?.length)return {members:[],complete:false};
  if(e.type==='GROUP'||e.members?.length){if(!Array.isArray(e.members))return {members:[],complete:false};const children=e.members.map(k=>expand(k,[...path,id]));return {members:unique(children.flatMap(x=>x.members)),complete:children.every(x=>x.complete)};}
  return {members:[id],complete:true};
 };
 const roleSet=roles=>{
  const facts=accepted.filter(f=>f.kind==='ROLE'&&roles.includes(f.claim?.role)&&(!f.event||(f.event.use==='CURRENT_TASK'&&f.event.layer==='MAIN'&&f.event.polarity==='POSITIVE'&&['REQUIRED','PERMITTED'].includes(f.event.modality))));const domains=facts.map(f=>expand(f.claim.entity_id));
  return {members:unique(domains.flatMap(d=>d.members)),complete:domains.every(d=>d.complete),fact_ids:facts.map(f=>f.id),sources:facts.flatMap(f=>f.sources??[])};
 };
 const inputObjects=roleSet(['INPUT_OBJECT']),output=roleSet(['RESULT','DELIVERABLE']);
 // External allowed input is a declared domain, not every inspected/organized
 // object. Keep the broader role set separately; never erase its facts.
 const externalScopes=accepted.filter(f=>f.kind==='SCOPE'&&f.claim.scope_id==='ROOT'&&f.claim.scope_binding?.domain_kind==='EXTERNAL_INPUT'&&f.claim.scope_binding.subject_mode==='TASK_OPERATIONS');
 const expandSet=(id,seen=[])=>{if(seen.includes(id))return {members:[],complete:false};const x=expressions.get(id);if(!x)return {members:[],complete:false};if(x.op==='ITEM')return x.operands.length===1?expand(x.operands[0]):{members:[],complete:false};if(x.op==='MEMBERS')return x.operands.length===1?expand(x.operands[0]):{members:[],complete:false};if(x.op==='UNION'){const ds=x.operands.map(v=>expandSet(v,[...seen,id]));return {members:unique(ds.flatMap(d=>d.members)),complete:ds.every(d=>d.complete)};}return {members:[],complete:false};};
 const externalDomains=externalScopes.map(f=>expandSet(f.claim.expression_id));
 const input=externalScopes.length?{members:externalDomains.reduce((a,d,i)=>i?a.filter(x=>d.members.includes(x)):d.members,[]),complete:externalDomains.every(d=>d.complete),fact_ids:externalScopes.map(f=>f.id),sources:externalScopes.flatMap(f=>f.sources),meaning:'ALLOWED_EXTERNAL_INPUT_DOMAIN'}:inputObjects;
 const display=ids=>ids.map(id=>({id,label:entities.get(id)?.label??id}));
 const proof=(rule,refs,sources,steps)=>({rule_id:rule,input_refs:refs,steps,sources});
 const formula=(id,atoms,path=[])=>{
  if(path.includes(id))throw Error('EXPRESSION_CYCLE');const x=expressions.get(id);if(!x)throw Error('EXPRESSION_MISSING');
  if(x.op==='STATE'&&x.state){const semantic={predicate:x.state.predicate,event_id:x.state.event_id,args:x.state.args};const key='state:'+sha256(JSON.stringify(semantic)).slice(0,24);atoms.set(key,{id:key,expression_ids:unique([...(atoms.get(key)?.expression_ids??[]),id]),state:semantic,sources:x.sources??[]});return x.state.polarity==='NEGATIVE'?{not:{var:key}}:{var:key};}
  if(x.op==='TEST'&&x.test){const key='test:'+sha256(JSON.stringify(x.test)).slice(0,24);atoms.set(key,{id:key,expression_ids:[id],test:x.test,sources:x.sources??[]});return {var:key};}
  if(x.op==='NOT'&&x.operands.length===1)return {not:formula(x.operands[0],atoms,[...path,id])};
  if(['AND','ALL','OR','ANY'].includes(x.op))return {[['AND','ALL'].includes(x.op)?'all':'any']:x.operands.map(k=>formula(k,atoms,[...path,id]))};
  throw Error('NOT_BOOLEAN_EXPRESSION');
 };
 const completion=c.conditions.filter(x=>x.kind==='COMPLETION').map(condition=>{
  try{
   const atoms=new Map(),premise=formula(condition.expression_id,atoms),variables=[...atoms.keys()];
   const premiseSpace=canonicalBooleanBoundary(variables,[premise]);
   const outcome='outcome:'+condition.claim_id,target={var:outcome};
   const constraints=condition.direction==='IFF'?[{implies:[premise,target]},{implies:[target,premise]}]:condition.direction==='NECESSARY'?[{implies:[target,premise]}]:condition.direction==='SUFFICIENT'?[{implies:[premise,target]}]:null;
   if(!constraints)throw Error('NO_COMPLETION_LOGICAL_DIRECTION');
   const relationSpace=canonicalBooleanBoundary([...variables,outcome],constraints);
   return {status:'CALCULATED',claim_id:condition.claim_id,expression_id:condition.expression_id,direction:condition.direction,target_id:condition.target_id,atoms:[...atoms.values()],formula:premise,
    premise:{...premiseSpace,total_assignments:2**variables.length,false_count:2**variables.length-premiseSpace.solution_count},
    completion_relation:{...relationSpace,total_assignments:2**(variables.length+1),violation_count:2**(variables.length+1)-relationSpace.solution_count,formulas:constraints},
    atom_labels:Object.fromEntries([...atoms.values()].map(a=>[a.id,a.state?a.state.predicate+'('+a.state.args.map(k=>entities.get(k)?.label??k).join(', ')+')':JSON.stringify(a.test)])),
    proof:proof('FINITE_BOOLEAN_SOLUTION_SPACE',[condition.fact_id,condition.expression_id],condition.sources,['Construct typed expression tree','Enumerate exact assignments with src/bxp canonicalBooleanBoundary','Keep premise and normative relation counts separate'])};
  }catch(error){return {status:'UNSUPPORTED',claim_id:condition.claim_id,reason:error.message,proof:proof('COMPLETION_COMPUTATION_LIMIT',[condition.fact_id],condition.sources,[])};}
 });
 const atomFrom=f=>{
  const e=f.event,roles=f.roles??[],objectRoles=roles.filter(r=>['OBJECT','INPUT_OBJECT','RESULT','DELIVERABLE'].includes(r.role));
  const domains=objectRoles.map(r=>expand(r.entity_id));
  return {fact_id:f.id,event_id:e.id,operation:e.predicate,mode:e.modality,owner_id:e.owner_id,layer:e.layer,use:e.use,polarity:e.polarity,semantic_signature:e.semantic_signature??null,
   actors:roles.filter(r=>['PERFORMER','ORGANIZER','REVIEWER','RECIPIENT'].includes(r.role)).map(r=>({role:r.role,entity_id:r.entity_id})),
   operands:display(unique(domains.flatMap(x=>x.members))),operand_identity_complete:domains.every(x=>x.complete),
   conditions:(f.constraints??[]).filter(x=>['CONDITION','TEMPORAL'].includes(x.kind)).map(x=>({claim_id:x.id,kind:x.kind,expression_id:x.expression_id,direction:x.direction,temporal:x.temporal})),
   sources:f.sources??[],proof:proof('CLASSIFY_ACCEPTED_BOUNDARY_ATOM',[f.id],f.sources,['Preserve declared operation, mode, role, ownership and condition; no mode conversion'])};
 };
 const atoms=accepted.filter(f=>f.kind==='EVENT'&&f.event?.use==='CURRENT_TASK'&&f.event.layer==='MAIN'&&f.event.polarity==='POSITIVE').map(atomFrom);
 const negative=atoms.filter(a=>a.mode==='FORBIDDEN'),required=atoms.filter(a=>a.mode==='REQUIRED'),allowed=atoms.filter(a=>a.mode==='PERMITTED');
 const comparisons=[];
 for(const left of [...required,...allowed])for(const right of negative){
  let result='UNKNOWN',reason='OPERATION_RELATION_NOT_PROVEN';let overlap=[];
  if(left.semantic_signature?.extent==='EXACT'&&right.semantic_signature?.extent==='EXACT'&&!left.semantic_signature.effects.includes('OTHER')&&!right.semantic_signature.effects.includes('OTHER')&&!left.semantic_signature.effects.some(e=>right.semantic_signature.effects.includes(e))){result='COMPATIBLE';reason='REVIEWED_EXACT_EFFECT_DOMAINS_DISJOINT';}
  else if(left.operand_identity_complete&&right.operand_identity_complete&&left.operands.length&&right.operands.length){
   const membership=evaluateValidatedTargetSet({id:left.fact_id+':'+right.fact_id,scope_id:'canonical-operand-identity',forbidden:right.operands.map(x=>x.id),requested:left.operands.map(x=>x.id),identity_status:'resolved'});overlap=membership.overlap;
   if(membership.result==='disjoint'){result='COMPATIBLE';reason='PROVEN_CANONICAL_OPERAND_DISJOINT';}
   else if(left.semantic_signature?.extent==='EXACT'&&right.semantic_signature?.extent==='EXACT'&&!left.semantic_signature.effects.includes('OTHER')&&!right.semantic_signature.effects.includes('OTHER')&&!left.semantic_signature.effects.some(e=>right.semantic_signature.effects.includes(e))){result='COMPATIBLE';reason='REVIEWED_EXACT_EFFECT_DOMAINS_DISJOINT';}
   else if(left.operation===right.operation||left.semantic_signature?.extent==='EXACT'&&right.semantic_signature?.extent==='EXACT'&&JSON.stringify([...left.semantic_signature.effects].sort())===JSON.stringify([...right.semantic_signature.effects].sort())){
    const lp=left.actors.filter(x=>x.role==='PERFORMER').map(x=>x.entity_id),rp=right.actors.filter(x=>x.role==='PERFORMER').map(x=>x.entity_id);
    if(lp.length&&rp.length&&!lp.some(x=>rp.includes(x))){reason='PERFORMER_DOMAIN_OVERLAP_NOT_PROVEN';}
    else if(Boolean(lp.length)!==Boolean(rp.length)&&right.semantic_signature?.actor_domain!=='TASK_SCOPE'){reason='PERFORMER_DOMAIN_OVERLAP_NOT_PROVEN';}
    else if(!left.conditions.length&&!right.conditions.length&&left.owner_id===right.owner_id){result='CONFLICT';reason='SAME_OPERATION_OPERAND_SCOPE_UNCONDITIONAL_OPPOSITE_MODE';}
    else{reason='ACTIVE_CONDITION_OR_SCOPE_OVERLAP_NOT_PROVEN';}
   }
  }else reason='OPERAND_IDENTITY_OR_DOMAIN_MISSING';
  comparisons.push({left_atom:left.fact_id,right_atom:right.fact_id,result,reason,overlap,proof:proof('NORMATIVE_ATOM_COMPARISON',[left.fact_id,right.fact_id],[...left.sources,...right.sources],['Compare canonical operand membership','Require operation, owner and active condition overlap before conflict','Missing comparison evidence remains UNKNOWN'])});
 }
 const intersection=input.members.filter(x=>output.members.includes(x));
 const union=unique([...input.members,...output.members]);
 const setStatus=input.complete&&output.complete?'CALCULATED':'PARTIAL';
 const unsupported=[...c.unsupported,...completion.filter(x=>x.status==='UNSUPPORTED').map(x=>({claim_id:x.claim_id,reason:x.reason}))];
 let joint;try{joint=buildJointResults(ir,c,{atoms,comparisons});}catch(error){joint={status:'PARTIAL',gaps:[{reason:error.message}],base:{result:'unknown',witness:null},completion:[],trigger_branches:[]};}
 return {format:'boundx-mathematical-results/v1',source_sha256:ir.source_sha256,calculation_input_ir_sha256:c.input_ir_sha256,
  sets:{input:{...input,members:display(input.members),cardinality:input.members.length},input_objects:{...inputObjects,members:display(inputObjects.members),cardinality:inputObjects.members.length},output:{...output,members:display(output.members),cardinality:output.members.length},
   intersection:{status:setStatus,members:display(intersection),cardinality:intersection.length},union:{status:setStatus,members:display(union),cardinality:union.length},proof:proof('CANONICAL_FINITE_SET_OPERATIONS',[...input.fact_ids,...output.fact_ids],[...input.sources,...output.sources],['Expand explicit finite group members','Deduplicate canonical IDs','Compute union and intersection; no label identity inference'])},
  completion,intervals:c.intervals.map(x=>({...x,proof:proof('SAME_TARGET_SCOPE_UNIT_INTERVAL_INTERSECTION',x.constraint_ids,x.input_constraints.flatMap(v=>v.sources??[]),['Intersect declared lower/upper bounds only','Preserve inclusive endpoints and empty intervals'])})),
  dependency:{edges:c.dependency.edges,conditional_edges:c.dependency.conditional_edges,cycles:c.dependency.cycles,proof:proof('EXPLICIT_DEPENDENCY_CYCLE_CHECK',c.dependency.edges.map(x=>x.id),c.dependency.edges.flatMap(x=>x.sources??[]),['Keep successful-state expression guard','Cycle detection over supported explicit edges; do not add owner/order edges'])},
  boundary_atoms:{required,allowed,negative},negative_sets:{static:negative.filter(x=>!x.conditions.length).flatMap(x=>x.operands.map(o=>({operation:x.operation,effects:x.semantic_signature?.effects??null,object_id:o.id,object_label:o.label,owner_id:x.owner_id,fact_id:x.fact_id,sources:x.sources}))),dynamic:negative.filter(x=>x.conditions.length).map(x=>({operation:x.operation,conditions:x.conditions,objects:x.operands,continuation_targets:x.semantic_signature?.continuation_targets??[],fact_id:x.fact_id,sources:x.sources}))},comparisons,
  conflicts:[...c.conflicts,...comparisons.filter(x=>x.result==='CONFLICT')],
  unknown_frontier:[...comparisons.filter(x=>x.result==='UNKNOWN'),...(ir.facts??[]).filter(f=>f.status!=='ACCEPTED').map(f=>({fact_id:f.id,status:f.status,reason:'UPSTREAM_FACT_NOT_ACCEPTED',sources:f.sources}))],
  boolean:{result:c.boolean.result,scope:c.boolean.scope,components:c.boolean.components},
  coverage:{ir_facts:c.coverage.ir_facts,accepted_facts:c.coverage.accepted_facts,unresolved_facts:c.coverage.unresolved_facts,source_gaps:c.coverage.source_gaps,unsupported_count:unsupported.length},
  status:c.conflicts.length||comparisons.some(x=>x.result==='CONFLICT')?'CONFLICT':!input.complete||!output.complete||unsupported.length||c.coverage.unresolved_facts||c.coverage.source_gaps||c.boolean.status==='PARTIAL'?'PARTIAL':'COMPUTED_WITH_EXPLICIT_FRONTIER',
  proof_scope:'DECLARED_TYPED_IR_ONLY',joint,scope_bindings:joint.problem?.scope_bindings??[],joint_cross_domain_execution_feasibility:joint.base?.result==='satisfiable'&&joint.status==='PROVEN'?'ABSTRACT_DECLARED_CONSTRAINTS_SAT':joint.base?.result==='unsatisfiable'?'ABSTRACT_DECLARED_CONSTRAINTS_UNSAT':'NOT_PROVEN',business_decision:null,execution_authorization:null};
}
export function renderMathematicalResults(r){
 const names=s=>s.members.map(x=>x.label).join(', ')||'∅';
 const interval=x=>`${x.lower?.inclusive?'[':'('}${x.lower?.value??'-∞'},${x.upper?.value??'+∞'}${x.upper?.inclusive?']':')'}`;
 const lines=['\n## 最终边界数学计算结果',`状态：${r.status}；消费同一份IR，不由LLM书写计算答案。`,`I = {${names(r.sets.input)}}；${r.sets.input.complete?'|I|':'已知成员数'}=${r.sets.input.cardinality}`,`O = {${names(r.sets.output)}}；${r.sets.output.complete?'|O|':'已知成员数'}=${r.sets.output.cardinality}`,r.sets.intersection.status==='CALCULATED'?`I∩O = ${r.sets.intersection.cardinality?'{'+names(r.sets.intersection)+'}':'∅'}；|I∪O|=${r.sets.union.cardinality}`:'交集尚未确定；仅列出已知成员，不能证明交集为空。'];
 for(const x of r.intervals)lines.push(`区间交集：${x.subject} = ${interval(x)} ${x.unit}；${x.empty?'空集':'非空'}`);
 for(const x of r.completion)if(x.status==='CALCULATED'){
  const fmt=f=>typeof f==='boolean'?String(f):f.var?(x.atom_labels[f.var]??f.var):f.not?'¬('+fmt(f.not)+')':f.all?'('+f.all.map(fmt).join(' ∧ ')+')':f.any?'('+f.any.map(fmt).join(' ∨ ')+')':'未支持';
  lines.push('K = '+fmt(x.formula),'完成关系：'+({IFF:'C ↔ K',SUFFICIENT:'K ⇒ C',NECESSARY:'C ⇒ K'}[x.direction]??x.direction),`完成前提：${x.premise.total_assignments}种赋值，TRUE=${x.premise.solution_count}，FALSE=${x.premise.false_count}；${x.direction}关系：满足=${x.completion_relation.solution_count}，违反=${x.completion_relation.violation_count}。`);
  lines.push('| '+[...x.premise.variables.map(k=>x.atom_labels[k]),'K'].join(' | ')+' |','| '+[...x.premise.variables,'K'].map(()=> '---').join(' | ')+' |');
  for(let mask=0;mask<x.premise.membership.length;mask++)lines.push('| '+[...x.premise.variables.map((_,bit)=>String((mask>>(x.premise.variables.length-bit-1))&1)),x.premise.membership[mask]].join(' | ')+' |');
 }else lines.push(`完成公式未算：${x.reason}`);
 lines.push(`依赖环集合：${r.dependency.cycles.length?'非空':'∅'}；显式边=${r.dependency.edges.length}`);
 for(const a of r.boundary_atoms.negative)lines.push(`禁止域：${a.operation} × {${a.operands.map(x=>x.label).join(', ')}}；条件=${a.conditions.map(x=>x.expression_id).join(', ')||'无条件'}；作用域=${a.owner_id}`);
 lines.push(`已证明冲突=${r.conflicts.length}；待定比较及事实=${r.unknown_frontier.length}；未支持计算=${r.coverage.unsupported_count}`,'分项布尔结果：'+(r.boolean.result??'未确定'));
 for(const s of r.scope_bindings??[])lines.push(`排他范围：${s.kind}；允许域={${s.allowed.join(', ')}}；逐操作目标=${s.subject_event_ids.join(', ')}；外部消费子集检查=${s.checks.map(x=>x.event_id+':'+x.result).join(', ')||'环境成员约束见联合见证'}。`);
 if(r.joint){lines.push('联合抽象约束：'+r.joint.base.result+'；合同/计算缺口='+r.joint.gaps.length);for(const q of r.joint.completion)lines.push('完成目标查询：'+q.result+'；见证核验='+String(q.verification?.valid??false));for(const q of r.joint.trigger_branches)lines.push('停止触发分支查询：'+q.result+'；见证核验='+String(q.verification?.valid??false));if(r.joint.base.witness)lines.push('联合见证（不是业务执行记录）：\n```json\n'+JSON.stringify(r.joint.base.witness,null,2)+'\n```');}
 lines.push('证明限声明的有限抽象模型；不预测实际工期，不证明业务已发生，不签发执行授权。');return lines.join('\n')+'\n';
}
