import {inferQueryCapability} from './capabilities.mjs';import {solve} from './backends/z3-adapter.mjs';import {verifyModel} from './verify-model.mjs';import {term} from './compile.mjs';import {evaluateRequirements} from './rules.mjs';
import {diagnostic} from './diagnostics.mjs';
export async function queryCore(compiled,query={},budget={}){
 const {core}=compiled,base={ir_status:compiled.semantic_gaps.length?'SEMANTIC_REVIEW_REQUIRED':'VALID',query_kind:query.kind??'SAT',business_decision:null,execution_authorization:null};
 if(compiled.frame_errors?.length){const {affectedFrameErrors}=await import('./analysis.mjs'),errors=affectedFrameErrors(compiled,query.requirements??core.requirements);if(errors.length)return {...base,ir_status:'INVALID',compile_status:'FAILED',result:'NOT_RUN',verification:'NOT_RUN',diagnostics:errors};}
 if(query.kind==='EVALUATE'){try{const evaluated=evaluateRequirements(core,query);return {...base,compile_status:'SUPPORTED',...evaluated,verification:evaluated.result==='UNKNOWN'?'NOT_RUN':'MODEL_CHECKED'};}catch(e){const d=diagnostic(e);return {...base,compile_status:d.layer==='CAPABILITY'?'UNSUPPORTED':d.layer==='RESOURCE'?'RESOURCE_LIMIT':'FAILED',result:'NOT_RUN',verification:'NOT_RUN',diagnostics:[d]};}}
 const cap=inferQueryCapability(core,query);if(cap.status!=='SUPPORTED')return {...base,compile_status:cap.status,result:'NOT_RUN',verification:'NOT_RUN',diagnostics:cap.diagnostics};
 const solved=await solve(cap.problem,budget);const check=solved.result==='SAT'?verifyModel(core,cap.problem,solved.model):null;
 return {...base,compile_status:solved.reason?.includes('RESOURCE_LIMIT')?'RESOURCE_LIMIT':'SUPPORTED',query_scope:cap.scope,...solved,result:check&&!check.valid?'UNKNOWN':solved.result,verification:check?(check.valid?'MODEL_CHECKED':'FAILED'):solved.verification,model_check:check,problem:cap.problem};
}
export async function refinement(compiled,{planRequirements,adminRequirements,...query},budget={}){
 const P=await queryCore(compiled,{...query,requirements:planRequirements},budget);
 if(P.result!=='SAT'||P.verification!=='MODEL_CHECKED')return {query_kind:'REFINEMENT',result:P.result==='UNSAT'?'INFEASIBLE_PLAN':'UNKNOWN',plan_feasibility:P,verification:P.verification,business_decision:null,execution_authorization:null};
 const p=inferQueryCapability(compiled.core,{...query,requirements:planRequirements}),a=inferQueryCapability(compiled.core,{...query,requirements:adminRequirements});
 if(a.status!=='SUPPORTED')return {query_kind:'REFINEMENT',result:'UNKNOWN',plan_feasibility:P,diagnostics:a.diagnostics,business_decision:null,execution_authorization:null};
 // A contributes only semantic definitions and declarations; never its required constraints.
 const problem={...p.problem,declarations:{...p.problem.declarations,...a.problem.declarations},assertions:[...p.problem.assertions,...a.problem.assertions.filter(x=>!x.id.startsWith('req:')),{id:'outside-admin',formula:term('not',[term('and',Object.values(a.problem.formulas))]),source_id:null}]};
 const solved=await solve(problem,budget),check=solved.result==='SAT'?verifyModel(compiled.core,problem,solved.model,{refinement:{adminRequirements}}):null;
 return {query_kind:'REFINEMENT',result:check&&!check.valid?'UNKNOWN':solved.result,meaning:solved.result==='UNSAT'?'PLAN_IMPLIES_ADMIN_WITHIN_SCOPE':solved.result==='SAT'?'COUNTEREXAMPLE':'UNKNOWN',plan_feasibility:P,counterexample:solved,model_check:check,verification:check?(check.valid?'MODEL_CHECKED':'FAILED'):'BACKEND_RESULT',query_scope:p.scope,problem,business_decision:null,execution_authorization:null};
}
