export class KernelError extends Error {
 constructor(code,node=null,path=null,layer='BIND',details={}){super(code);this.diagnostic={layer,code,node_id:node,path,depends_on:[],...details};}
}
export const fail=(...args)=>{throw new KernelError(...args);};
export const diagnostic=e=>e.diagnostic??{layer:'RUNTIME',code:'INTERNAL_ERROR',message:e.message};
export const resultABI={ir_status:['VALID','INVALID','SEMANTIC_REVIEW_REQUIRED'],compile_status:['SUPPORTED','UNSUPPORTED','RESOURCE_LIMIT','FAILED'],result:['SAT','UNSAT','VIOLATED','SATISFIED','UNKNOWN','NOT_RUN'],verification:['MODEL_CHECKED','CERTIFICATE_CHECKED','BACKEND_RESULT','FAILED','NOT_RUN']};
