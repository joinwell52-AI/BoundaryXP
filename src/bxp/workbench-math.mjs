// Deterministic finite calculation for explicit mathematical notation already
// present in reviewed workbench clauses. It never infers missing source semantics.
const powerset=items=>Array.from({length:2**items.length},(_,mask)=>items.filter((_,i)=>mask&(1<<i)));
const same=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
const intersection=(a,b)=>a.filter(x=>b.includes(x));
const union=(a,b)=>[...new Set([...a,...b])];
const clean=s=>s.trim().replace(/[，、]/g,',').replace(/\s+/g,'');
function explicitSetProblem(text){
 const universeMatch=text.match(/([A-Za-z]\w*)\s*=\s*\{([^}]+)\}/);if(!universeMatch)return null;
 const universeId=universeMatch[1],universe=universeMatch[2].split(/[,，、]/).map(x=>x.trim()).filter(Boolean);
 if(!universe.length||universe.length>12||new Set(universe).size!==universe.length)return null;
 const subset=[...text.matchAll(/([A-Za-z]\w*)\s*⊆\s*([A-Za-z]\w*)/g)].filter(x=>x[2]===universeId).map(x=>x[1]);
 const variables=[...new Set(subset)];if(variables.length!==2)return null;const [left,right]=variables;
 const sizes={};for(const m of text.matchAll(/\|\s*([A-Za-z]\w*)\s*\|\s*=\s*(\d+)/g))sizes[m[1]]=Number(m[2]);
 for(const m of text.matchAll(/\|\s*([A-Za-z]\w*)\s*\|\s*=\s*\|\s*([A-Za-z]\w*)\s*\|\s*=\s*(\d+)/g)){sizes[m[1]]=Number(m[3]);sizes[m[2]]=Number(m[3]);}
 const overlap=text.match(new RegExp(`\\|\\s*${left}\\s*∩\\s*${right}\\s*\\|\\s*=\\s*(\\d+)`))??text.match(new RegExp(`\\|\\s*${right}\\s*∩\\s*${left}\\s*\\|\\s*=\\s*(\\d+)`));
 const covers=new RegExp(`${left}\\s*∪\\s*${right}\\s*=\\s*${universeId}`).test(text)||new RegExp(`${right}\\s*∪\\s*${left}\\s*=\\s*${universeId}`).test(text);
 if(!Number.isSafeInteger(sizes[left])||!Number.isSafeInteger(sizes[right])||!overlap||!covers)return null;
 return {universe_id:universeId,universe,variables:[left,right],sizes,overlap:Number(overlap[1]),covers};
}
function solveSet(problem){
 const [left,right]=problem.variables,sets=powerset(problem.universe),solutions=[];
 for(const a of sets)for(const b of sets){if(a.length!==problem.sizes[left]||b.length!==problem.sizes[right])continue;if(intersection(a,b).length!==problem.overlap)continue;if(!same(union(a,b),problem.universe))continue;solutions.push({[left]:a,[right]:b,intersection:intersection(a,b),union:union(a,b)});}
 return {result:solutions.length?'SAT':'UNSAT',solution_count:solutions.length,solutions,witness:solutions[0]??null,verification:'FINITE_ENUMERATION',checked_assignments:sets.length**2};
}
function intervalOf(text){const m=text.match(/(-?\d+(?:\.\d+)?)\s*<\s*([A-Za-z]\w*)\s*≤\s*(-?\d+(?:\.\d+)?)\s*(分钟|小时|秒|天)?/);return m?{variable:m[2],lower:Number(m[1]),lower_inclusive:false,upper:Number(m[3]),upper_inclusive:true,unit:m[4]??''}:null;}
function exactCount(text){const m=text.match(/(?:共恰|总数恰为|共计|共)\s*(\d+)\s*份/);return m?Number(m[1]):null;}
function structuralSummary(clauses){
 const has=(c,re)=>re.test(c.text??''),required=/必须|须|要求|需要|需先|仅允许|只允许/,forbidden=/禁止|不得|不能|不可|不允许/,dependency=/先|之后|再|前置|开始时|提交后|等待|承接/,unresolved=/未明示|未指定|未提供|未知|待核对|不得.*推断/;
 return {clause_count:clauses.length,required_count:clauses.filter(c=>has(c,required)).length,forbidden_count:clauses.filter(c=>has(c,forbidden)).length,dependency_count:clauses.filter(c=>has(c,dependency)).length,unresolved_count:clauses.filter(c=>has(c,unresolved)).length,axes_covered:[...new Set(clauses.flatMap(c=>c.axes??[]))].sort()};
}
export function calculateWorkbenchMath(clauses=[]){
 const text=clauses.map(c=>c.text??'').join('\n'),problem=explicitSetProblem(text),set_result=problem?solveSet(problem):null,interval=intervalOf(text),record_count=exactCount(text),completion=clauses.find(c=>/当且仅当/.test(c.text??''))?.text??null,structural=structuralSummary(clauses);
 const performed=clauses.length>0,consistency=set_result?.result==='UNSAT'?'FAIL':set_result?.result==='SAT'?'PASS':'NOT_EVALUATED',joint_result=set_result?.result??(clauses.length?'SYMBOLIC':'NO_CONSTRAINTS');
 return {format:'boundx-workbench-math/2',method_version:'finite-explicit-notation/2',calculation_performed:performed,joint_result,source_scope:'MODEL_NORMALIZED_REVIEWED_CLAUSES_NOT_RAW_SOURCE_SEMANTICS',structural,set_problem:problem,set_result,interval,record_count,completion_formula:completion,
  determinations:{
   required_gap:{formula:'Missing_task = Required_task \\ Specified_task',result:'NOT_EVALUATED',reason:'REQUIRED_TASK_SET_NOT_STRUCTURED'},
   forbidden_conflict:{formula:'ForbiddenConflict = A_planned ∩ F_forbidden',result:'NOT_EVALUATED',reason:'PLANNED_ACTION_SET_NOT_PROVIDED'},
   consistency:{formula:'Consistency',result:consistency,scope:set_result?'EXPLICIT_FINITE_SET_FRAGMENT':'NO_SUPPORTED_JOINT_FRAGMENT'},
   decidability:{formula:'Decidable(K)',result:completion?'PARTIAL':'NOT_EVALUATED',reason:completion?'COMPLETION_FORMULA_RECORDED_RUNTIME_FACTS_UNOBSERVED':'COMPLETION_FORMULA_NOT_STRUCTURED'},
   solution_space:{formula:'Ω_B = {x ∈ X_Σ | Q(x) ∧ ¬F(x) ∧ K(x) ∧ Φ(x)}',result:set_result?.result==='SAT'?'NONEMPTY':set_result?.result==='UNSAT'?'EMPTY':clauses.length?'SYMBOLIC_NOT_ENUMERATED':'NOT_EVALUATED',cardinality:set_result?.solution_count??null,scope:set_result?'EXPLICIT_FINITE_SET_FRAGMENT':'SYMBOLIC_CLAUSE_SYSTEM'},
   boundary_uniqueness:{formula:'BoundaryUnique ≠ ExecutionPathUnique',result:'NOT_EVALUATED',reason:'CANONICAL_BOUNDARY_CANDIDATE_SET_NOT_PRODUCED'},
   boundary_state:{formula:'BoundaryState',result:set_result?.result==='SAT'?'PARTIALLY_DETERMINED':clauses.length?'STRUCTURED_NOT_SOLVED':'UNDETERMINED'},
   policy:{formula:'PolicyEvaluation',result:'NOT_EVALUATED_NO_OPERATOR_PROFILE'},
   admission:{formula:'Admission',result:'NOT_EVALUATED_PROFILE_MISSING'}
  },business_decision:null,execution_authorization:null};
}
