import {compileQuery} from './compile.mjs';import {diagnostic} from './diagnostics.mjs';
export function inferQueryCapability(core,query={}){
 try{const problem=compileQuery(core,query);return {status:'SUPPORTED',profile:'FINITE_PLAN_QF_LIRA_V1',problem,scope:problem.query_scope};}
 catch(e){const d=diagnostic(e);return {status:d.layer==='RESOURCE'?'RESOURCE_LIMIT':d.layer==='CAPABILITY'?'UNSUPPORTED':'FAILED',diagnostics:[d]};}
}
