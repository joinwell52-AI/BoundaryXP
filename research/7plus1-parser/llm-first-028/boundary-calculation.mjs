// Check saved model calculations. Never extract missing semantics from text.
import Ajv from 'ajv';
import {savedCalculationSchema,calculationTargets} from './boundary-calculation-schema.mjs';
import {evidenceQuery} from '../../../src/bxp/ir-kernel/evidence-query.mjs';
import {projectCore} from '../../../src/bxp/ir-kernel/projection.mjs';
import {prepareKernel,runKernel} from '../../../src/bxp/ir-kernel/service.mjs';
import {evaluateCore} from '../../../src/bxp/ir-kernel/evaluate.mjs';
import {stable,rational,compare,unknown} from '../../../src/bxp/ir-kernel/values.mjs';
import {sha256} from './source.mjs';
const check=new Ajv({strict:false,allErrors:true}).compile(savedCalculationSchema);
const identity=r=>r.kind+':'+r.id;
function acyclic(g){const edges=new Map(g.nodes.map(n=>[identity(n),[]]));for(const e of g.edges){if(!edges.has(identity(e.from))||!edges.has(identity(e.to)))throw Error('GRAPH_ENDPOINT_MISSING');edges.get(identity(e.from)).push(identity(e.to));}const visiting=new Set(),done=new Set();function walk(n){if(visiting.has(n))return false;if(done.has(n))return true;visiting.add(n);for(const t of edges.get(n))if(!walk(t))return false;visiting.delete(n);done.add(n);return true;}return [...edges.keys()].every(walk);}
function finiteTruth(ir,item,{compareCounts=true}={}){
 const table=item.evidence.truth_table;if(table.bindings.length>12)return {status:'UNVERIFIED',reason:'TRUTH_TABLE_CAPACITY'};
 const generated=table.rows.length===0,names=table.bindings.map(b=>b.name),rows=generated?Array.from({length:2**names.length},(_,i)=>({values:names.map((_,j)=>Boolean(i&2**j)),result:null})):table.rows,keys=rows.map(r=>JSON.stringify(r.values));
 if(new Set(names).size!==names.length||new Set(keys).size!==keys.length||rows.length!==2**names.length||rows.some(r=>r.values.length!==names.length))return {status:'MISMATCH',reason:'TRUTH_TABLE_NOT_EXHAUSTIVE'};
 const trueCount=rows.filter(r=>r.result).length;if(!generated&&(trueCount!==table.true_count||rows.length-trueCount!==table.false_count))return {status:'MISMATCH',reason:'TRUTH_TABLE_COUNT'};
 const ref=table.formula_ref??item.input_refs.find(r=>r.kind==='EXPRESSION');if(!ref||!item.input_refs.some(x=>x.kind===ref.kind&&x.id===ref.id)||table.bindings.some(b=>!b.reference))return {status:'PARTIAL',reason:'COUNTS_CHECKED_FORMULA_BINDING_NOT_GIVEN'};
 const compiled=prepareKernel(ir);let unverified=false;const recomputed=[];
 for(const row of rows){
  const context={variables:{},states:{},event_values:{}};
  for(let i=0;i<row.values.length;i++){
   let b=table.bindings[i].reference,n=compiled.core.nodes[b.id];const value=row.values[i];
   if(b.kind==='EXPRESSION'&&n.operator==='STATE_VALUE'){b=n.arguments[0];n=compiled.core.nodes[b.id];}
   if(b.kind==='STATE'){const subject=n.subject?.kind==='EVENT'?n.subject.id:null;context.states[stable([n.id,subject])]={value};}
   else if(b.kind==='VARIABLE'&&n.type==='BOOLEAN')context.variables[n.id]=value;
   else if(b.kind==='EXPRESSION'&&['EVENT_OCCURRED','EVENT_COMPLETED','EVENT_SUCCEEDED'].includes(n.operator)&&n.arguments[0]?.kind==='EVENT'){
    const id=n.arguments[0].id,key={EVENT_OCCURRED:'occurred',EVENT_COMPLETED:'completed',EVENT_SUCCEEDED:'succeeded'}[n.operator];
    context.event_values[id]={...(context.event_values[id]??{}),id,[key]:value};
   }else return {status:'UNVERIFIED',reason:'TRUTH_BINDING_NOT_BOOLEAN'};
  }
  const value=evaluateCore(compiled.core,ref,context);if(unknown(value))unverified=true;else if(!generated&&value!==row.result)return {status:'MISMATCH',reason:'TRUTH_TABLE_FORMULA'};
  recomputed.push({values:row.values,result:unknown(value)?'UNKNOWN':value});
 }
 const actualTrue=recomputed.filter(r=>r.result===true).length;
 if(compareCounts&&!unverified&&(actualTrue!==table.true_count||recomputed.length-actualTrue!==table.false_count))return {status:'MISMATCH',reason:'TRUTH_TABLE_COUNT',true_count:actualTrue,false_count:recomputed.length-actualTrue};
 return unverified?{status:'PARTIAL',reason:'COUNTS_CHECKED_FORMULA_UNKNOWN'}:{status:'VERIFIED',reason:'ALL_BOOLEAN_ASSIGNMENTS_RECOMPUTED',generated_rows:generated,rows:recomputed,true_count:actualTrue,false_count:recomputed.length-actualTrue};
}
function derivedTruth(ir,item){
 const table=item.evidence.truth_table;if(!table)return [];
 const nodes=new Map([...ir.expressions,...ir.states,...ir.variables].map(n=>[n.id,n])),root=table.formula_ref??item.input_refs.find(r=>r.kind==='EXPRESSION'),out=[];
 const atom=r=>{if(!r)return null;const n=nodes.get(r.id);if(r.kind==='STATE'||r.kind==='VARIABLE')return identity(r);if(n?.operator==='STATE_VALUE')return atom(n.arguments[0]);if(['EVENT_OCCURRED','EVENT_COMPLETED','EVENT_SUCCEEDED'].includes(n?.operator))return n.operator+':'+identity(n.arguments[0]);return null;};
 const visited=new Set();function walk(r){if(r.kind!=='EXPRESSION'||visited.has(r.id))return;visited.add(r.id);const n=nodes.get(r.id);if(!n)return;for(const a of n.arguments??[])walk(a);if(r.id===root?.id||!['AND','OR','NOT','IMPLIES','IFF'].includes(n.operator))return;
  const atoms=new Set(),seen=new Set();function collect(x){const key=atom(x);if(key)atoms.add(key);if(x.kind!=='EXPRESSION'||seen.has(x.id))return;seen.add(x.id);for(const a of nodes.get(x.id)?.arguments??[])collect(a);}collect(r);
  const bindings=table.bindings.filter(b=>atoms.has(atom(b.reference)));if(!bindings.length)return;
  const t=finiteTruth(ir,{input_refs:[r],evidence:{truth_table:{formula_ref:r,bindings,rows:[],true_count:0,false_count:0}}},{compareCounts:false});
  out.push({origin:'PROGRAM_DERIVED_FROM_BOUND_IR_SUBFORMULA',operator:n.operator,formula_ref:r,bindings,...t});
 }if(root)walk(root);return out;
}
function checkItem(ir,item,{requireWire=false}={}){
 const e=item.evidence,results=[];
 if(e.set_members!==null){const size=new Set(e.set_members.map(identity)).size;results.push({status:e.cardinality===size?'VERIFIED':'MISMATCH',reason:'SET_IDENTITY_CARDINALITY',value:size});}
 if(e.interval!==null){const x=e.interval;if(x.lower!==null)rational(x.lower);if(x.upper!==null)rational(x.upper);const c=x.lower!==null&&x.upper!==null?compare(x.lower,x.upper):null;const empty=c!==null&&(c>0||c===0&&(!x.lower_inclusive||!x.upper_inclusive));results.push({status:empty===x.empty?'VERIFIED':'MISMATCH',reason:'EXACT_INTERVAL_EMPTINESS',value:empty});}
 if(e.truth_table!==null)results.push({...finiteTruth(ir,item),derived_subformulas:derivedTruth(ir,item)});
 if(e.graph!==null)results.push({status:acyclic(e.graph)===e.graph.acyclic?'VERIFIED':'MISMATCH',reason:'DECLARED_GRAPH_CYCLE_CHECK'});
 for(const c of e.expression_cases??[]){
  if(!item.input_refs.some(r=>r.kind===c.input_ref.kind&&r.id===c.input_ref.id)||c.input_ref.kind!=='EXPRESSION')throw Error('CASE_FORMULA_NOT_BOUND');
  const compiled=prepareKernel(ir),context=evidenceQuery(ir,JSON.parse(c.context_json),{requireWire,scope:'LOCAL_EXPRESSION'}),value=evaluateCore(compiled.core,c.input_ref,context),expected=c.expected==='UNKNOWN'?unknown(value):value===c.expected;
  results.push({status:expected?'VERIFIED':'MISMATCH',reason:'BOUND_FORMULA_CASE',input_ref:c.input_ref,value:unknown(value)?'UNKNOWN':value,expected:c.expected});
 }
 // Arithmetic agreement does not prove the operands or formula match source.
 return {id:item.id,status:results.some(r=>r.status==='MISMATCH')?'MISMATCH':results.length&&results.every(r=>r.status==='VERIFIED')?'VERIFIED':results.length?'PARTIAL':'UNVERIFIED',checks:results,scope:'DECLARED_OPERANDS_ONLY_NOT_SOURCE_SEMANTICS'};
}
export async function checkLLMBoundary(ir,proposal,audit,technical,{requireWire=false}={}){
 const findings=[],checks=[],reviews=audit.calculation_reviews??[],raw=proposal;
 if(!check(proposal))return {format:'boundx-llm-boundary-result/1',status:'PARTIAL',result:'UNKNOWN',verification:'UNVERIFIED',proposal:raw,checks,findings:[{code:'LLM_CALCULATION_SCHEMA',details:structuredClone(check.errors)}],calculation_performed:false,business_decision:null,execution_authorization:null};
 const sources=new Set(ir.source_table.map(s=>s.id)),nodes=new Map(Object.entries({entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'}).flatMap(([k,kind])=>ir[k].map(n=>[n.id,kind])));
 const targets=calculationTargets(proposal);if(new Set(targets).size!==targets.length) findings.push({code:'LLM_CALCULATION_ID_COLLISION'});
 const sourceRefs=x=>{for(const id of x.source_refs??[])if(!sources.has(id))findings.push({code:'LLM_CALCULATION_SOURCE_REFERENCE',id});};
 const refs=x=>{if(Array.isArray(x)){x.forEach(refs);return;}if(x&&typeof x==='object'){if(x.kind&&x.id&&Object.keys(x).length===2&&nodes.get(x.id)!==x.kind)findings.push({code:'LLM_CALCULATION_REFERENCE',id:x.id});Object.values(x).forEach(refs);}};refs(proposal);
 for(const x of [...proposal.constraints,...proposal.calculations,...proposal.unresolved])sourceRefs(x);
 const constraintIds=new Set(proposal.constraints.map(x=>x.id));for(const id of proposal.joint.constraint_ids)if(!constraintIds.has(id))findings.push({code:'LLM_JOINT_CONSTRAINT_REFERENCE',id});
 for(const id of constraintIds)if(!proposal.joint.constraint_ids.includes(id))findings.push({code:'LLM_JOINT_OMITS_CONSTRAINT',id});
 // The delivered Schema permits typed declaration references here (e.g. a BASIS
 // role and its document). Preserve them as declarations; only REQUIREMENT refs
 // count toward mathematical requirement coverage. No formula text is parsed.
 const constraintBindings=proposal.constraints.map(c=>({id:c.id,requirement_refs:c.requirement_refs.filter(r=>r.kind==='REQUIREMENT'),declaration_refs:c.requirement_refs.filter(r=>r.kind!=='REQUIREMENT')}));
 const mapped=new Set(constraintBindings.flatMap(c=>c.requirement_refs.map(r=>r.id)));
 for(const r of ir.requirements)if(!['PERMITTED','NOT_REQUIRED','UNSTATED'].includes(r.modality)&&!mapped.has(r.id))findings.push({code:'LLM_JOINT_OMITS_IR_REQUIREMENT',id:r.id});
 if(new Set(proposal.coverage.map(x=>x.source_ref)).size!==proposal.coverage.length)findings.push({code:'LLM_CALCULATION_DUPLICATE_COVERAGE'});
 for(const c of proposal.coverage){if(!sources.has(c.source_ref)||c.constraint_ids.some(id=>!constraintIds.has(id)))findings.push({code:'LLM_CALCULATION_COVERAGE_REFERENCE',id:c.source_ref});if(c.status==='GAP')findings.push({code:'LLM_CALCULATION_COVERAGE_GAP',id:c.source_ref,reason:c.reason});}
 for(const id of sources)if(!proposal.coverage.some(x=>x.source_ref===id))findings.push({code:'LLM_CALCULATION_SOURCE_UNACCOUNTED',id});
 const auditSources=new Set((audit.source_table??[]).map(s=>s.id));for(const r of reviews){if(!targets.includes(r.target)||r.source_refs.some(id=>!auditSources.has(id)))findings.push({code:'LLM_CALCULATION_AUDIT_REFERENCE',id:r.target});}
 for(const target of targets){const rows=reviews.filter(r=>r.target===target);if(!rows.length||rows.some(r=>r.verdict!=='SUPPORT'))findings.push({code:'LLM_CALCULATION_REVIEW_REQUIRED',id:target,reason:rows.map(r=>r.reason).join('；')||'没有独立计算审阅'});}
 for(const item of proposal.calculations){try{checks.push(checkItem(ir,item,{requireWire}));}catch(e){checks.push({id:item.id,status:'UNVERIFIED',checks:[],reason:e.message});}}
 for(const c of checks)if(c.status==='MISMATCH')findings.push({code:'LLM_CALCULATION_MISMATCH',id:c.id,reason:c.checks.filter(x=>x.status==='MISMATCH').map(x=>x.reason).join('；')});
 let witnessCheck=null;
 if(proposal.joint.witness_query_json!==null){try{const raw=JSON.parse(proposal.joint.witness_query_json);if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.requirements||raw.additional_assertions||!raw.plan?.completeness||raw.plan.completeness.kind!=='EXACT_SNAPSHOT')throw Error('WITNESS_COMPLETE_QUERY_REQUIRED');const query=evidenceQuery(ir,raw,{requireWire});witnessCheck=(await runKernel(ir,{...query,kind:'EVALUATE'})).calculation;if(witnessCheck.result!=='SATISFIED')findings.push({code:'LLM_WITNESS_NOT_VERIFIED',reason:witnessCheck.result});}catch(e){findings.push({code:'LLM_WITNESS_INVALID',reason:e.message});}}
 if(proposal.joint.result==='SAT'&&!witnessCheck)findings.push({code:'LLM_SAT_WITHOUT_CHECKABLE_WITNESS'});
 for(const c of checks){
  const item=proposal.calculations.find(x=>x.id===c.id);
  if(item.method==='JOINT'&&witnessCheck?.result==='SATISFIED'){c.status='VERIFIED';c.checks.push({status:'VERIFIED',reason:'ALL_DECLARED_IR_REQUIREMENTS_WITNESS_CHECKED',requirement_count:witnessCheck.rows.length});}
  else if(c.status==='UNVERIFIED')findings.push({code:'LLM_CALCULATION_EVIDENCE_REQUIRED',id:c.id,reason:'Provide typed operands, a bound truth table, formula cases, or a complete finite witness.'});
 }
 if(proposal.joint.result==='UNSAT')findings.push({code:'LLM_UNSAT_PROOF_REQUIRES_VERIFICATION',reason:'模型的冲突推导已保存，尚未得到程序冲突证明。'});
 const allReviewed=targets.every(t=>reviews.some(r=>r.target===t&&r.verdict==='SUPPORT')&&!reviews.some(r=>r.target===t&&r.verdict!=='SUPPORT'));
 return {format:'boundx-llm-boundary-result/1',origin:'LLM_CALCULATION_IN_PARSE_RESPONSE',method_version:proposal.method_version,status:findings.length||proposal.unresolved.length||!technical.technical_ok||technical.rows.some(r=>r.status!=='ACCEPTED')?'PARTIAL':'MODEL_REVIEWED',result:proposal.joint.result,verification:'LLM_REVIEWED_CANDIDATE_NOT_MATHEMATICAL_CERTIFICATION',calculation_performed:true,proposal,calculation_reviews:reviews,checks,constraint_bindings:constraintBindings,witness_check:witnessCheck,findings,independent_review_complete:allReviewed,ir_sha256:sha256(JSON.stringify(ir)),proposal_sha256:sha256(JSON.stringify(proposal)),source_semantics_proven:false,business_decision:null,execution_authorization:null};
}
export function renderLLMBoundary(result){
 const p=result.proposal;if(!p)return '\n\n## LLM边界计算\n\n没有模型计算结果。';
 const sub=result.checks.flatMap(x=>x.checks.flatMap(y=>y.derived_subformulas??[])).map(x=>'- '+x.operator+'子公式 '+x.formula_ref.id+'：真 '+x.true_count+'，假 '+x.false_count+'；程序从同一IR机械穷举。').join('\n');
 return '\n\n## LLM完整边界计算候选\n\n模型联合结论：'+p.joint.result+'；作用域：'+p.joint.domain+'。独立审阅与程序复核分开；未认证为完整数学证明。\n\n完整边界公式：\n\n'+p.joint.formula+'\n\n'+p.calculations.map(x=>'### '+x.title+'\n\n方法：'+x.method+'\n\n公式：'+x.formula+'\n\n结果：'+x.result+'\n\n'+x.steps.map(s=>'- '+s).join('\n')).join('\n\n')+'\n\n### 程序复核\n\n'+result.checks.map(x=>'- '+x.id+'：'+x.status+'（'+x.scope+'）').join('\n')+(sub?'\n\n### 程序计算IR子公式\n\n'+sub:'')+'\n\n'+result.findings.map(x=>'- '+x.code+'：'+(x.reason??x.id??'')).join('\n');
}
export async function attachLLMCalculation(completed,ir,proposal,audit,options={}){
 const checked=await checkLLMBoundary(ir,proposal,audit,completed.technical,options);
 completed.program_boundary_calculations=completed.boundary_calculations;checked.program_recheck=completed.boundary_calculations;
 const semantic=[...ir.coverage.filter(x=>['GAP','AMBIGUOUS'].includes(x.status)).map(x=>({code:'SOURCE_COVERAGE_GAP',...x})),...ir.issues.filter(x=>x.kind!=='UNSPECIFIED').map(x=>({code:'DECLARED_SEMANTIC_ISSUE',...x})),...(audit.omissions??[]).map(x=>({code:'AUDIT_OMISSION',...x})),...completed.technical.diagnostics,...completed.technical.errors,...completed.technical.rows.filter(x=>x.status!=='ACCEPTED').map(x=>({code:'NODE_REVIEW_REQUIRED',id:x.id}))];
 const witnessed=checked.witness_check?.result==='SATISFIED';
 const relevantUnresolved=proposal.unresolved.filter(x=>!['NORMAL_UNSPECIFIED','QUERY_SUPPORT'].includes(x.kind)||x.kind==='QUERY_SUPPORT'&&!witnessed);
 const incompleteChecks=checked.checks.filter(x=>x.status!=='VERIFIED').map(x=>({code:'LLM_CALCULATION_RECHECK_INCOMPLETE',id:x.id,reason:x.reason??x.checks?.map(y=>y.reason).join('；')??'计算证据尚不能完整复核'}));
 checked.gaps=[...semantic,...incompleteChecks,...relevantUnresolved.map(x=>({code:'LLM_UNRESOLVED',...x})),...(!witnessed?(completed.boundary_calculations.gaps??[]):[]),...checked.findings];
 checked.status=checked.gaps.length?'PARTIAL':'MODEL_REVIEWED';
 if(checked.gaps.length)checked.status='PARTIAL';
 if(witnessed&&!checked.gaps.length&&checked.independent_review_complete&&checked.checks.every(x=>x.status==='VERIFIED')){
  checked.verification='CORE_WITNESS_CHECKED_FOR_DECLARED_IR';checked.proof_scope={kind:'FINITE_CONSTRUCTED_MODEL',requirements:checked.witness_check.rows.map(x=>x.id),source_semantics_proven:false};
 }
 checked.pre_query_diagnostics=completed.boundary_calculations.gaps??[];
 completed.boundary_calculations=checked;completed.canonical.gaps=checked.gaps;
 const sourceView=completed.kernel_core?projectCore(completed.kernel_core).chinese:completed.chinese;
 completed.pre_query_chinese=completed.chinese;
 completed.chinese=sourceView+renderLLMBoundary(checked)+'\n\n## 程序完整见证复核\n\n'+(witnessed?'本次构造见证已逐项核对全部'+checked.witness_check.rows.length+'条IR要求；结果SATISFIED。':'未获得满足全部IR要求的可检查见证。')+'\n\n证明范围：'+checked.verification+'。这是本次声明IR及有限数学赋值的计算结果，不是实际业务完成或执行授权；原文解释仍需逐来源核对。查询前探索结果及诊断独立保留在program_boundary_calculations。';
 completed.problem_report.findings=checked.gaps.map(f=>({...f,problem:f.reason??f.code,suggestion:'核对实际模型证据、绑定和来源；原答与查询前诊断保留。'}));
 completed.problem_report.status=checked.gaps.length?'REVIEW_REQUIRED':'NO_RECORDED_GAPS';return completed;
}
