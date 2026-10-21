// Reconcile generated operands with the existing deterministic clause parser.
// Equal numbers alone never establish identity: both source interpretations
// must map uniquely and the existing parser must prove a common typed key.
import {lowerReviewedPlan} from './workbench-lowering.mjs';
import {ancestors} from './workbench-model.mjs';
import {stable} from './ir-kernel/values.mjs';
export function bindProgramIdentities(plan,boundaries){
 const raw=structuredClone(boundaries);
 for(const r of Object.values(raw))if(r?.boundary)delete r.boundary.formal;
 const local=lowerReviewedPlan({plan,boundaries:raw}),out=structuredClone(boundaries),bindings=[];
 const interpreted=new Map();
 const signature=c=>stable({type:c.type,unit:c.unit,role:c.role,lower:c.lower,upper:c.upper,mode:c.mode,values:c.values?[...c.values].sort():undefined,expression:c.expression});
 for(const n of plan.nodes){
  const f=out[n.id]?.boundary?.formal,lf=local.boundaries[n.id]?.boundary?.formal;
  for(const c of f?.constraints??[]){
   if(!['quantity','domain','condition','permission'].includes(c.type))continue;
   if(!c.clause_ids?.every(id=>f.coverage.some(v=>v.clause_id===id&&v.kind==='STRUCTURED')))continue;
   const matches=(lf?.constraints??[]).filter(x=>signature(x)===signature(c)&&stable([...x.clause_ids].sort())===stable([...c.clause_ids].sort())&&x.clause_ids.every(id=>lf.coverage.some(v=>v.clause_id===id&&v.kind==='STRUCTURED')));
   if(matches.length===1)interpreted.set(n.id+'\0'+c.id,matches[0]);
  }
 }
 for(const n of plan.nodes.filter(n=>n.parent_id))for(const c of out[n.id]?.boundary?.formal?.constraints??[]){
  const lc=interpreted.get(n.id+'\0'+c.id);if(!lc)continue;
  const candidates=ancestors(plan,n.id).flatMap(p=>(out[p.id]?.boundary?.formal?.constraints??[]).map(pc=>({p,pc,lp:interpreted.get(p.id+'\0'+pc.id)}))).filter(x=>x.lp&&x.lp.type===lc.type&&x.lp.key===lc.key);
  // More than one ancestor may retain the same identity; conflicting keys
  // remain a gap instead of selecting the closest spelling.
  const keys=[...new Set(candidates.map(x=>x.pc.key))];if(keys.length!==1||c.key===keys[0])continue;
  const {p,pc}=candidates[0],prior=c.key;
  const f=out[n.id].boundary.formal;f.relations??=[];f.relations.push({type:'SAME_AS',from:c.key,to:pc.key,clause_ids:c.clause_ids});
  c.key=pc.key;if(c.type==='quantity')c.instance=pc.instance;
  const proof={method:'EXISTING_GRAMMAR_TYPED_IDENTITY',from:prior,to:c.key,node_id:n.id,parent_node_id:p.id,constraint_id:c.id,parent_constraint_id:pc.id,clause_ids:c.clause_ids,typed_identity:lc.key,child_source:lc.local_provenance,parent_source:candidates[0].lp.local_provenance};
  c.program_binding=proof;bindings.push(proof);
 }
 return {boundaries:out,bindings};
}
