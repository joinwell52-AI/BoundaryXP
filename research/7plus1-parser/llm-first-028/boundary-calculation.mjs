// Check saved model calculations. Never extract missing semantics from text.
import Ajv from 'ajv';
import {boundaryCalculationSchema,calculationTargets} from './boundary-calculation-schema.mjs';
import {prepareKernel,runKernel} from '../../../src/bxp/ir-kernel/service.mjs';
import {evaluateCore} from '../../../src/bxp/ir-kernel/evaluate.mjs';
import {stable,rational,compare,unknown} from '../../../src/bxp/ir-kernel/values.mjs';
import {sha256} from './source.mjs';
const check=new Ajv({strict:false,allErrors:true}).compile(boundaryCalculationSchema);
const identity=r=>r.kind+':'+r.id;
function acyclic(g){const edges=new Map(g.nodes.map(n=>[identity(n),[]]));for(const e of g.edges){if(!edges.has(identity(e.from))||!edges.has(identity(e.to)))throw Error('GRAPH_ENDPOINT_MISSING');edges.get(identity(e.from)).push(identity(e.to));}const visiting=new Set(),done=new Set();function walk(n){if(visiting.has(n))return false;if(done.has(n))return true;visiting.add(n);for(const t of edges.get(n))if(!walk(t))return false;visiting.delete(n);done.add(n);return true;}return [...edges.keys()].every(walk);}
function finiteTruth(ir,item){
 const table=item.evidence.truth_table;if(table.bindings.length>12)return {status:'UNVERIFIED',reason:'TRUTH_TABLE_CAPACITY'};
 const names=table.bindings.map(b=>b.name),keys=table.rows.map(r=>JSON.stringify(r.values));
 if(new Set(names).size!==names.length||new Set(keys).size!==keys.length||table.rows.length!==2**names.length||table.rows.some(r=>r.values.length!==names.length))return {status:'MISMATCH',reason:'TRUTH_TABLE_NOT_EXHAUSTIVE'};
 const trueCount=table.rows.filter(r=>r.result).length;if(trueCount!==table.true_count||table.rows.length-trueCount!==table.false_count)return {status:'MISMATCH',reason:'TRUTH_TABLE_COUNT'};
 const ref=item.input_refs.find(r=>r.kind==='EXPRESSION');if(!ref||table.bindings.some(b=>!b.reference))return {status:'PARTIAL',reason:'COUNTS_CHECKED_FORMULA_BINDING_NOT_GIVEN'};
 const compiled=prepareKernel(ir);let unverified=false;
 for(const row of table.rows){const context={variables:{},states:{}};for(let i=0;i<row.values.length;i++){const b=table.bindings[i].reference,n=compiled.core.nodes[b.id];if(b.kind==='STATE'){const subject=n.subject?.kind==='EVENT'?n.subject.id:null;context.states[stable([n.id,subject])]={value:row.values[i]};}else if(b.kind==='VARIABLE'&&n.type==='BOOLEAN')context.variables[n.id]=row.values[i];else return {status:'UNVERIFIED',reason:'TRUTH_BINDING_NOT_BOOLEAN'};}const value=evaluateCore(compiled.core,ref,context);if(unknown(value))unverified=true;else if(value!==row.result)return {status:'MISMATCH',reason:'TRUTH_TABLE_FORMULA'};}
 return unverified?{status:'PARTIAL',reason:'COUNTS_CHECKED_FORMULA_UNKNOWN'}:{status:'VERIFIED',reason:'ALL_BOOLEAN_ASSIGNMENTS_RECOMPUTED'};
}
function checkItem(ir,item){
 const e=item.evidence,results=[];
 if(e.set_members!==null){const size=new Set(e.set_members.map(identity)).size;results.push({status:e.cardinality===size?'VERIFIED':'MISMATCH',reason:'SET_IDENTITY_CARDINALITY',value:size});}
 if(e.interval!==null){const x=e.interval;if(x.lower!==null)rational(x.lower);if(x.upper!==null)rational(x.upper);const c=x.lower!==null&&x.upper!==null?compare(x.lower,x.upper):null;const empty=c!==null&&(c>0||c===0&&(!x.lower_inclusive||!x.upper_inclusive));results.push({status:empty===x.empty?'VERIFIED':'MISMATCH',reason:'EXACT_INTERVAL_EMPTINESS',value:empty});}
 if(e.truth_table!==null)results.push(finiteTruth(ir,item));
 if(e.graph!==null)results.push({status:acyclic(e.graph)===e.graph.acyclic?'VERIFIED':'MISMATCH',reason:'DECLARED_GRAPH_CYCLE_CHECK'});
 // Arithmetic agreement does not prove the operands or formula match source.
 return {id:item.id,status:results.some(r=>r.status==='MISMATCH')?'MISMATCH':results.length&&results.every(r=>r.status==='VERIFIED')?'VERIFIED':results.length?'PARTIAL':'UNVERIFIED',checks:results,scope:'DECLARED_OPERANDS_ONLY_NOT_SOURCE_SEMANTICS'};
}
export async function checkLLMBoundary(ir,proposal,audit,technical){
 const findings=[],checks=[],reviews=audit.calculation_reviews??[],raw=proposal;
 if(!check(proposal))return {format:'boundx-llm-boundary-result/1',status:'PARTIAL',result:'UNKNOWN',verification:'UNVERIFIED',proposal:raw,checks,findings:[{code:'LLM_CALCULATION_SCHEMA',details:structuredClone(check.errors)}],calculation_performed:false,business_decision:null,execution_authorization:null};
 const sources=new Set(ir.source_table.map(s=>s.id)),nodes=new Map(Object.entries({entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'}).flatMap(([k,kind])=>ir[k].map(n=>[n.id,kind])));
 const targets=calculationTargets(proposal),ids=targets.slice(2);if(new Set(ids).size!==ids.length||ids.some(id=>['joint','coverage'].includes(id)))findings.push({code:'LLM_CALCULATION_ID_COLLISION'});
 const sourceRefs=x=>{for(const id of x.source_refs??[])if(!sources.has(id))findings.push({code:'LLM_CALCULATION_SOURCE_REFERENCE',id});};
 const refs=x=>{if(Array.isArray(x)){x.forEach(refs);return;}if(x&&typeof x==='object'){if(x.kind&&x.id&&Object.keys(x).length===2&&nodes.get(x.id)!==x.kind)findings.push({code:'LLM_CALCULATION_REFERENCE',id:x.id});Object.values(x).forEach(refs);}};refs(proposal);
 for(const x of [...proposal.constraints,...proposal.calculations,...proposal.unresolved])sourceRefs(x);
 const constraintIds=new Set(proposal.constraints.map(x=>x.id));for(const id of proposal.joint.constraint_ids)if(!constraintIds.has(id))findings.push({code:'LLM_JOINT_CONSTRAINT_REFERENCE',id});
 for(const id of constraintIds)if(!proposal.joint.constraint_ids.includes(id))findings.push({code:'LLM_JOINT_OMITS_CONSTRAINT',id});
 for(const c of proposal.constraints)if(c.requirement_refs.some(r=>r.kind!=='REQUIREMENT'))findings.push({code:'LLM_CONSTRAINT_REQUIREMENT_TYPE',id:c.id});
 if(new Set(proposal.coverage.map(x=>x.source_ref)).size!==proposal.coverage.length)findings.push({code:'LLM_CALCULATION_DUPLICATE_COVERAGE'});
 for(const c of proposal.coverage){if(!sources.has(c.source_ref)||c.constraint_ids.some(id=>!constraintIds.has(id)))findings.push({code:'LLM_CALCULATION_COVERAGE_REFERENCE',id:c.source_ref});if(c.status==='GAP')findings.push({code:'LLM_CALCULATION_COVERAGE_GAP',id:c.source_ref,reason:c.reason});}
 for(const id of sources)if(!proposal.coverage.some(x=>x.source_ref===id))findings.push({code:'LLM_CALCULATION_SOURCE_UNACCOUNTED',id});
 const auditSources=new Set((audit.source_table??[]).map(s=>s.id));for(const r of reviews){if(!targets.includes(r.target)||r.source_refs.some(id=>!auditSources.has(id)))findings.push({code:'LLM_CALCULATION_AUDIT_REFERENCE',id:r.target});}
 for(const target of targets){const rows=reviews.filter(r=>r.target===target);if(!rows.length||rows.some(r=>r.verdict!=='SUPPORT'))findings.push({code:'LLM_CALCULATION_REVIEW_REQUIRED',id:target,reason:rows.map(r=>r.reason).join('；')||'没有独立计算审阅'});}
 for(const item of proposal.calculations){try{checks.push(checkItem(ir,item));}catch(e){checks.push({id:item.id,status:'UNVERIFIED',checks:[],reason:e.message});}}
 for(const c of checks)if(c.status==='MISMATCH')findings.push({code:'LLM_CALCULATION_MISMATCH',id:c.id,reason:c.checks.filter(x=>x.status==='MISMATCH').map(x=>x.reason).join('；')});
 let witnessCheck=null;
 if(proposal.joint.witness_query_json!==null){try{const query=JSON.parse(proposal.joint.witness_query_json);if(!query||typeof query!=='object'||Array.isArray(query)||query.requirements||query.additional_assertions||!query.plan?.completeness||query.plan.completeness.kind!=='EXACT_SNAPSHOT')throw Error('WITNESS_COMPLETE_QUERY_REQUIRED');witnessCheck=(await runKernel(ir,{...query,kind:'EVALUATE'})).calculation;if(witnessCheck.result!=='SATISFIED')findings.push({code:'LLM_WITNESS_NOT_VERIFIED',reason:witnessCheck.result});}catch(e){findings.push({code:'LLM_WITNESS_INVALID',reason:e.message});}}
 if(proposal.joint.result==='SAT'&&!witnessCheck)findings.push({code:'LLM_SAT_WITHOUT_CHECKABLE_WITNESS'});
 if(proposal.joint.result==='UNSAT')findings.push({code:'LLM_UNSAT_PROOF_REQUIRES_VERIFICATION',reason:'模型的冲突推导已保存，尚未得到程序冲突证明。'});
 const allReviewed=targets.every(t=>reviews.some(r=>r.target===t&&r.verdict==='SUPPORT')&&!reviews.some(r=>r.target===t&&r.verdict!=='SUPPORT'));
 return {format:'boundx-llm-boundary-result/1',origin:'LLM_CALCULATION_IN_PARSE_RESPONSE',method_version:proposal.method_version,status:findings.length||proposal.unresolved.length||!technical.technical_ok||technical.rows.some(r=>r.status!=='ACCEPTED')?'PARTIAL':'MODEL_REVIEWED',result:proposal.joint.result,verification:'LLM_REVIEWED_CANDIDATE_NOT_MATHEMATICAL_CERTIFICATION',calculation_performed:true,proposal,calculation_reviews:reviews,checks,witness_check:witnessCheck,findings,independent_review_complete:allReviewed,ir_sha256:sha256(JSON.stringify(ir)),proposal_sha256:sha256(JSON.stringify(proposal)),source_semantics_proven:false,business_decision:null,execution_authorization:null};
}
export function renderLLMBoundary(result){
 const p=result.proposal;if(!p)return '\n\n## LLM边界计算\n\n没有模型计算结果。';
 return '\n\n## LLM完整边界计算候选\n\n模型联合结论：'+p.joint.result+'；作用域：'+p.joint.domain+'。独立审阅与程序复核分开；未认证为完整数学证明。\n\n完整边界公式：\n\n'+p.joint.formula+'\n\n'+p.calculations.map(x=>'### '+x.title+'\n\n方法：'+x.method+'\n\n公式：'+x.formula+'\n\n结果：'+x.result+'\n\n'+x.steps.map(s=>'- '+s).join('\n')).join('\n\n')+'\n\n### 程序复核\n\n'+result.checks.map(x=>'- '+x.id+'：'+x.status+'（'+x.scope+'）').join('\n')+'\n\n'+result.findings.map(x=>'- '+x.code+'：'+(x.reason??x.id??'')).join('\n');
}
export async function attachLLMCalculation(completed,ir,proposal,audit){
 const checked=await checkLLMBoundary(ir,proposal,audit,completed.technical);
 completed.program_boundary_calculations=completed.boundary_calculations;checked.program_recheck=completed.boundary_calculations;
 checked.gaps=[...(completed.boundary_calculations.gaps??[]),...checked.findings];if(checked.gaps.length)checked.status='PARTIAL';
 completed.boundary_calculations=checked;completed.chinese+=renderLLMBoundary(checked);
 completed.problem_report.findings.push(...checked.findings.map(f=>({...f,problem:f.reason??f.code,suggestion:'核对模型计算的操作数、公式、来源及独立审阅；原结论保留，不由程序补答案。'})));
 if(checked.findings.length)completed.problem_report.status='REVIEW_REQUIRED';return completed;
}
