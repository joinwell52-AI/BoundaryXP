// Host interpretation revisions. Saved producer outputs and source clauses stay immutable.
import {stable} from '../../../src/bxp/ir-kernel/values.mjs';
const fail=code=>{throw Error(code);};
export function applySemanticRevisions(plan,boundaries,revisions=[]){
 if(!Array.isArray(revisions)||revisions.length>400)fail('SEMANTIC_REVISIONS_FORMAT');
 const out=structuredClone(boundaries),seen=new Set();
 const validRef=r=>r&&plan.nodes.some(n=>n.id===r.node_id)&&out[r.node_id]?.boundary?.clauses?.some(c=>c.id===r.clause_id&&c.source_valid);
 for(const r of revisions){
  if(!r||Object.keys(r).some(k=>!['node_id','constraint_id','reason','source_refs','replacement_constraints'].includes(k))||typeof r.reason!=='string'||!r.reason.trim()||!Array.isArray(r.source_refs)||!r.source_refs.length||!r.source_refs.every(validRef)||!Array.isArray(r.replacement_constraints))fail('SEMANTIC_REVISION_SOURCE_OR_FORMAT');
  const row=out[r.node_id],formal=row?.boundary?.formal,old=formal?.constraints?.find(c=>c.id===r.constraint_id),identity=stable([r.node_id,r.constraint_id]);
  if(!old||seen.has(identity))fail('SEMANTIC_REVISION_TARGET');seen.add(identity);
  if(!old.clause_ids.every(id=>r.source_refs.some(x=>x.node_id===r.node_id&&x.clause_id===id)))fail('SEMANTIC_REVISION_OLD_SOURCE_MISSING');
  const allowed=new Set(r.source_refs.filter(x=>x.node_id===r.node_id).map(x=>x.clause_id)),kept=formal.constraints.filter(c=>c!==old),ids=new Set(kept.map(c=>c.id));
  for(const c of r.replacement_constraints){if(!c||ids.has(c.id)||!c.clause_ids?.length||c.clause_ids.some(id=>!allowed.has(id)))fail('SEMANTIC_REVISION_REPLACEMENT_SOURCE');ids.add(c.id);}
  const snapshot=structuredClone(old);
  formal.constraints=[...kept,...structuredClone(r.replacement_constraints)];
  for(const cv of formal.coverage){
   cv.constraint_ids=[...new Set([...cv.constraint_ids.filter(id=>id!==old.id),...r.replacement_constraints.filter(c=>c.clause_ids.includes(cv.clause_id)).map(c=>c.id)])];
  }
  // Coverage, bindings and expressions belong to the same parse transaction.
  // Inspect their final state after all patches; this intermediate revision
  // cannot decide whether a later patch supplies an operand or coverage link.
  formal.semantic_revisions??=[];formal.semantic_revisions.push({constraint_id:r.constraint_id,before:snapshot,after:structuredClone(r.replacement_constraints),reason:r.reason,source_refs:structuredClone(r.source_refs)});
 }
 return out;
}

// Apply accepted one-to-one replacements to references in the same transaction.
// IDs are local to each node. Definitions, source evidence and the original
// response remain unchanged; a split/deletion has no implicit replacement ID.
export function synchronizeRevisionReferences(boundaries,input,patch){
 const revisions=patch.semantic_revisions??[],updates=new Map();
 const resolve=(node,id)=>{
  if(typeof id!=='string'||!node)return id;
  let current=id;
  for(const r of revisions){
   if(r.node_id!==node||r.constraint_id!==current)continue;
   if(r.replacement_constraints.length!==1)return id;
   current=r.replacement_constraints[0].id;
  }
  if(current===id||!boundaries[node]?.boundary?.formal?.constraints.some(c=>c.id===current))return id;
  updates.set(stable([node,id,current]),{node_id:node,from_constraint_id:id,to_constraint_id:current});
  return current;
 };
 const scalarRefs=new Set(['constraint_id','target_constraint_id']);
 const listRefs=new Set(['constraint_ids','locked_constraint_ids','semantic_revisable_constraint_ids']);
 const rewrite=(value,node)=>{
  if(Array.isArray(value))return value.map(v=>rewrite(v,node));
  if(!value||typeof value!=='object')return value;
  const owner=value.node_id??node,out={};
  for(const [key,v] of Object.entries(value)){
   // Preserve the before/after audit trail, including its retired IDs.
   if(key==='semantic_revisions')out[key]=structuredClone(v);
   else if(scalarRefs.has(key))out[key]=resolve(owner,v);
   else if(listRefs.has(key)&&Array.isArray(v))out[key]=v.map(id=>resolve(owner,id));
   else out[key]=rewrite(v,owner);
  }
  return out;
 };
 const result=Object.fromEntries(Object.entries(boundaries).map(([node,row])=>[node,rewrite(row,node)]));
 const normalizedInput=rewrite(input),normalizedPatch=rewrite(patch);
 for(const row of updates.values()){
  const formal=result[row.node_id].boundary.formal;
  formal.constraint_reference_updates??=[];
  const {node_id,...record}=row;
  if(!formal.constraint_reference_updates.some(v=>stable(v)===stable(record)))formal.constraint_reference_updates.push(record);
 }
 return {boundaries:result,input:normalizedInput,patch:normalizedPatch};
}
