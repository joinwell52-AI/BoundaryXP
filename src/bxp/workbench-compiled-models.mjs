// Evaluate source-bound mathematical models with the existing Core only.
import {calculateComparison} from './workbench-calculators.mjs';
import {AXES} from './workbench-model.mjs';
const allowed=new Set(['boolean_implication','set_subset','interval_subset','dependency','mathematical_expression']);
const forbidden=new Set(['status','verdict','result','findings','business_decision','execution_authorization']);
// A request for more detail is not an additional boundary. Resolve it only
// when every referenced operand already has a deterministic interpretation.
// Do not match words in the note, guess missing values or waive source gaps.
function representedNote(item,comparison,boundaries,calculations){
 if(item.constraint_ids?.length||!item.source_refs?.length)return null;
 const overlaps=refs=>refs?.some(r=>item.source_refs.some(x=>x.node_id===r.node_id&&x.clause_id===r.clause_id));
 if(comparison.findings.some(f=>f.status==='UNRESOLVED'&&overlaps([...f.parent_refs,...f.child_refs]))
  ||calculations.some(c=>c.result.status==='UNRESOLVED'&&overlaps(c.model.source_refs)))return null;
 const witnesses=[];
 for(const ref of item.source_refs){
  const b=boundaries[ref.node_id]?.boundary,f=b?.formal,rows=f?.coverage?.filter(c=>c.clause_id===ref.clause_id)??[];
  if(!b?.clauses?.some(c=>c.id===ref.clause_id&&c.source_valid)||rows.length!==1||rows[0].kind!=='STRUCTURED'||rows[0].unresolved?.length||!rows[0].constraint_ids?.length)return null;
  for(const id of rows[0].constraint_ids){
   const c=f.constraints.find(c=>c.id===id&&c.clause_ids.includes(ref.clause_id));
   const proof=comparison.constraint_evaluations?.find(p=>p.node_id===ref.node_id&&p.constraint_id===id);
   if(!c||c.type==='unknown'||!proof||!['SOURCE_FACT','VERIFIED','VIOLATED','INHERITED','LOCAL_DECLARATION','NO_RESTRICTION'].includes(proof.status))return null;
   witnesses.push({...proof,...(proof.status==='SOURCE_FACT'?{given_values:c.values}:{} )});
  }
 }
 return witnesses;
}
function noVerdicts(value){if(!value||typeof value!=='object')return;for(const [key,x]of Object.entries(value)){if(forbidden.has(key))throw Error('MATH_MODEL_VERDICT_FORBIDDEN:'+key);noVerdicts(x);}}
export function validateCompiledModels(data,{plan,boundaries}){
 noVerdicts(data);if(!data||Object.keys(data).some(k=>!['models','unresolved'].includes(k))||!Array.isArray(data.models)||!Array.isArray(data.unresolved)||data.models.length>100)throw Error('MATH_MODELS_FORMAT');
 const validRef=ref=>ref&&typeof ref.node_id==='string'&&typeof ref.clause_id==='string'&&plan.nodes.some(n=>n.id===ref.node_id)&&boundaries[ref.node_id]?.boundary?.clauses?.some(c=>c.id===ref.clause_id&&c.source_valid);
 for(const model of data.models){if(typeof model.formula!=='string'||!model.formula.trim()||!Array.isArray(model.axes)||!model.axes.length||model.axes.some(a=>!AXES.includes(a))||!model.source_refs?.length||!model.source_refs.every(validRef)||!allowed.has(model.expression?.kind))throw Error('MATH_MODEL_SOURCE_OR_TYPE');}
 for(const item of data.unresolved)if(typeof item.reason!=='string'||!item.reason.trim()||!item.source_refs?.length||!item.source_refs.every(validRef))throw Error('MATH_MODEL_UNRESOLVED_SOURCE');
 return data;
}
export function appendCompiledModels(comparison,{plan,boundaries}){
 const records=plan.nodes.flatMap(n=>boundaries[n.id]?.boundary?.formal?.compiled_math_models?[{owner:n.id,data:boundaries[n.id].boundary.formal.compiled_math_models}]:[]);if(!records.length)return comparison;
 const out=structuredClone(comparison),priority=['VIOLATED','UNRESOLVED','VERIFIED','INHERITED'];
 for(const record of records){
  let data;try{data=validateCompiledModels(record.data,{plan,boundaries});}catch(error){out.findings.push({id:'FM'+(out.findings.length+1),status:'UNRESOLVED',basis:'PROGRAM_INPUT_CHECK',axes:[],parent_refs:[],child_refs:[],reason:error.message,reason_zh:error.message,failure_layer:'GENERATION_OR_INTERFACE'});continue;}
  const calculations=data.models.map(model=>{
   const parent_refs=model.source_refs.filter(r=>r.node_id===record.owner),child_refs=model.source_refs.filter(r=>r.node_id!==record.owner),parentAxes=new Set(parent_refs.flatMap(r=>boundaries[r.node_id].boundary.clauses.find(c=>c.id===r.clause_id).axes));
   const result=calculateComparison(model.expression,{plan,boundaries});
   if(model.proof_mode==='NECESSARY_CONDITION'&&result.status==='VERIFIED')Object.assign(result,{status:'UNRESOLVED',reason:'NECESSARY_CONDITION_SATISFIED_NOT_SUFFICIENT'});
   return {model,parent_refs,child_refs,axes:model.axes.filter(a=>parentAxes.has(a)),result};
  });
  for(const status of ['VIOLATED','UNRESOLVED','VERIFIED']){
   const rows=calculations.filter(x=>x.result.status===status);if(!rows.length)continue;
   const primary=rows[0],unique=refs=>[...new Map(refs.map(r=>[r.node_id+':'+r.clause_id,r])).values()],parent_refs=unique(rows.flatMap(r=>r.parent_refs)),child_refs=unique(rows.flatMap(r=>r.child_refs));
   const reason=status==='VIOLATED'?'完整7+1数学表达经Core计算，子事实不满足父约束。':status==='VERIFIED'?'完整7+1数学表达经Core计算满足父约束。':'完整7+1数学表达暂不能由Core求值。';
   out.findings.push({id:'FM'+(out.findings.length+1),status,basis:status==='UNRESOLVED'?'PROGRAM_INPUT_CHECK':'PROGRAM',axes:[...new Set(rows.flatMap(r=>r.axes))],parent_refs,child_refs,scope:'COMBINATION',target_node_ids:[...new Set(child_refs.map(r=>r.node_id))],constraint_type:'compiled_mathematical_model',reason,reason_zh:reason,formula:primary.model.formula,operands:primary.model.expression,operand_calculation:primary.result,...(rows.length>1?{additional_proofs:rows.slice(1).map(r=>({formula:r.model.formula,parent_refs:r.parent_refs,child_refs:r.child_refs,operands:r.model.expression,result:r.result}))}:{}),...(status==='UNRESOLVED'?{failure_layer:'CALCULATOR_COVERAGE'}:{})});
  }
  for(const item of data.unresolved){const parent_refs=item.source_refs.filter(r=>r.node_id===record.owner),child_refs=item.source_refs.filter(r=>r.node_id!==record.owner),axes=[...new Set(parent_refs.flatMap(r=>boundaries[r.node_id].boundary.clauses.find(c=>c.id===r.clause_id).axes))];
   const witnesses=representedNote(item,comparison,boundaries,calculations);
   if(witnesses){out.diagnostics.push({reason:'DETAIL_NOT_REQUIRED_BY_BOUNDARY_COMPARISON',reason_zh:item.reason,parent_refs,child_refs,constraint_evidence:witnesses,comparison_effect:'GIVEN_RELATIONS_AND_PARENT_BOUNDARIES_PRESERVED'});continue;}
   out.findings.push({id:'FM'+(out.findings.length+1),status:'UNRESOLVED',basis:'PROGRAM_INPUT_CHECK',axes,parent_refs,child_refs,reason:item.reason,reason_zh:item.reason,failure_layer:'GENERATION_OR_INTERFACE'});}
 }
 out.axes=Object.fromEntries(AXES.map(a=>[a,priority.find(s=>out.findings.some(f=>f.axes.includes(a)&&f.status===s))??'NOT_RUN']));out.status=priority.find(s=>out.findings.some(f=>f.status===s))??'NOT_RUN';return out;
}
