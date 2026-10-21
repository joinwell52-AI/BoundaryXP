import {compileCore} from './index.mjs';
import {projectCore} from './projection.mjs';
import {unknown} from './values.mjs';
// Boundary establishment is not a satisfiability query. Preserve symbols/open domains.
export function declareBoundary(ir){
 const compiled=compileCore(ir,{collectFrameErrors:true}),view=projectCore(compiled);
 const closedOps=new Set(['BOOLEAN','NUMBER','SYMBOL','SET','GROUP_MEMBERS','UNION','INTERSECTION','DIFFERENCE','CARDINALITY','INTEGER_RANGE','REAL_INTERVAL','EQ','LT','LTE','GT','GTE','ADD','AND','OR','NOT','IMPLIES','IFF','MEMBER','SUBSET']);
 const memo=new Map(),closed=id=>{if(memo.has(id))return memo.get(id);memo.set(id,false);const n=compiled.core.nodes[id];const ok=n?.category==='ENTITY'||n?.category==='EXPRESSION'&&closedOps.has(n.operator)&&n.arguments.every(r=>closed(r.id));memo.set(id,ok);return ok;};
 const static_values=view.summary.values.filter(v=>closed(v.id)&&!v.diagnostic&&!unknown(v.value)&&!v.value?.open);
 return {...view,compiled,static_values,query_status:'AWAITING_PLAN_OR_EVIDENCE',witness_generated:false,business_decision:null,execution_authorization:null};
}
