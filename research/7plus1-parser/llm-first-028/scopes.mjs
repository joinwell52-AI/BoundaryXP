// Typed ranges only. No source/note/label scanning and no business authorization.
export const rangeOps=['ITEM','ENUM','CATEGORY','DOMAIN_CHOICE','UNRESOLVED_DOMAIN','UNION','INTERSECTION','EXCEPT'];
export function expressionType(expressions,id,entities=[],path=[]){
 const x=expressions.find(x=>x.id===id);if(!x||path.includes(id))return 'INVALID';
 const children=()=>x.operands.map(k=>expressionType(expressions,k,entities,[...path,id]));
 if(x.op==='STATE')return x.state&&x.operands.length===0?'BOOLEAN':'INVALID';
 if(['ITEM','ENUM','CATEGORY','UNRESOLVED_DOMAIN'].includes(x.op)){
  const refs=x.operands.map(k=>entities.find(e=>e.id===k));
  if(x.state!==null||refs.some(e=>!e)||new Set(x.operands).size!==x.operands.length)return 'INVALID';
  if(x.op==='CATEGORY')return [1,2].includes(refs.length)&&refs[0].type==='CLASS'&&(refs.length===1||refs[1].type!=='CLASS')?'SET':'INVALID';
  if(x.op==='UNRESOLVED_DOMAIN')return refs.length===1&&refs[0].type==='CLASS'?'SET':'INVALID';
  return refs.length>0&&(x.op==='ENUM'||refs.length===1)&&refs.every(e=>e.type!=='CLASS')?'SET':'INVALID';
 }
 const types=children();
 if(x.state!==null)return 'INVALID';
 if(x.op==='FORALL')return types.length===1&&types[0]==='SET'?'UNIVERSAL_SCOPE':'INVALID';
 if(['AND','OR','ALL','ANY','NOT'].includes(x.op))return (x.op==='NOT'?types.length===1:types.length>=2)&&types.every(t=>t==='BOOLEAN')?'BOOLEAN':'INVALID';
 if(['UNION','INTERSECTION','EXCEPT','DOMAIN_CHOICE'].includes(x.op))return (x.op==='EXCEPT'?types.length===2:types.length>=2)&&types.every(t=>t==='SET')&&new Set(x.operands).size===x.operands.length?'SET':'INVALID';
 return 'INVALID';
}
export function scopeEntityRefs(expressions,id,seen=new Set()){
 if(seen.has(id))return [];seen.add(id);const x=expressions.find(e=>e.id===id);if(!x)return [];
 return ['CATEGORY','UNRESOLVED_DOMAIN'].includes(x.op)?x.operands.slice(0,1):['ITEM','ENUM'].includes(x.op)?x.operands:x.operands.flatMap(k=>scopeEntityRefs(expressions,k,seen));
}
export function scopeDomainState(expressions,id,entities=[],seen=new Set()){
 if(seen.has(id))return 'INVALID';seen.add(id);const x=expressions.find(e=>e.id===id);if(!x)return 'INVALID';
 if(x.op==='UNRESOLVED_DOMAIN')return 'UNPARSED';if(x.op==='DOMAIN_CHOICE')return 'COMPETING';
 if(x.op==='CATEGORY'&&x.operands.some(k=>entities.find(e=>e.id===k)?.alternatives?.length))return 'COMPETING';
 if(x.op==='CATEGORY')return x.operands.length===1?'TASK_CATEGORY_UNRESTRICTED':'DETERMINED';
 if(['ITEM','ENUM','STATE'].includes(x.op))return 'DETERMINED';
 const children=x.operands.map(k=>scopeDomainState(expressions,k,entities,new Set(seen)));
 return children.includes('INVALID')?'INVALID':children.includes('UNPARSED')?'UNPARSED':children.includes('COMPETING')?'COMPETING':children.includes('TASK_CATEGORY_UNRESTRICTED')?'TASK_CATEGORY_UNRESTRICTED':'DETERMINED';
}
const and=vs=>vs.includes('FALSE')?'FALSE':vs.every(v=>v==='TRUE')?'TRUE':'UNKNOWN';
const or=vs=>vs.includes('TRUE')?'TRUE':vs.every(v=>v==='FALSE')?'FALSE':'UNKNOWN';
const not=v=>v==='TRUE'?'FALSE':v==='FALSE'?'TRUE':'UNKNOWN';
export function evaluateScope(expressions,id,memberId,{entities=[],memberships=[]}={}){
 const type=expressionType(expressions,id,entities),index=new Map(expressions.map(e=>[e.id,e]));
 const run=(key,path=[],interpretation=new Map())=>{
  const x=index.get(key);if(!x||path.includes(key))return 'UNKNOWN';
  if(x.op==='FORALL')return run(x.operands[0],[...path,key],interpretation);
  if(x.op==='UNRESOLVED_DOMAIN')return 'UNKNOWN';
  if(x.op==='DOMAIN_CHOICE')return interpretation.has(key)?run(interpretation.get(key),[...path,key],interpretation):'UNKNOWN';
  if(x.op==='ITEM'||x.op==='ENUM'){
   // Competing referents are not concrete enumerable identities.
   if(!memberId||entities.find(e=>e.id===memberId)?.alternatives?.length)return 'UNKNOWN';
   const uncertain=x.operands.some(k=>entities.find(e=>e.id===k)?.alternatives?.length);
   if(x.operands.includes(memberId))return uncertain?'UNKNOWN':'TRUE';
   return uncertain?'UNKNOWN':'FALSE';
  }
  if(x.op==='CATEGORY'){
   if(x.operands.some(k=>entities.find(e=>e.id===k)?.alternatives?.length))return 'UNKNOWN';
   const values=memberships.filter(m=>m.member_id===memberId&&m.category_id===x.operands[0]&&(m.within_id??null)===(x.operands[1]??null)).map(m=>m.value);
   return values.length&&values.every(v=>v===values[0])&&['TRUE','FALSE'].includes(values[0])?values[0]:'UNKNOWN';
  }
  const vs=x.operands.map(k=>run(k,[...path,key],interpretation));
  if(x.op==='UNION')return or(vs);if(x.op==='INTERSECTION')return and(vs);
  if(x.op==='EXCEPT')return and([vs[0],not(vs[1])]);return 'UNKNOWN';
 };
 const domain_state=scopeDomainState(expressions,id,entities),choices=[];
 const collect=(key,seen=new Set())=>{if(seen.has(key))return;seen.add(key);const x=index.get(key);if(x?.op==='DOMAIN_CHOICE')choices.push(x);else if(x&&!['ITEM','ENUM','CATEGORY','UNRESOLVED_DOMAIN','STATE'].includes(x.op))for(const k of x.operands)collect(k,seen);};collect(id);
 // Alternative results refer to the whole scope (including its exceptions). Multiple
 // choices remain unknown; do not invent a Cartesian-product business decision.
 const alternative_results=['SET','UNIVERSAL_SCOPE'].includes(type)&&choices.length===1?choices[0].operands.map(k=>({choice_id:choices[0].id,alternative_id:k,scope_value:run(id,[],new Map([[choices[0].id,k]])),interpretation_only:true,is_final_boundary:false})):[];
 return {expression_id:id,member_id:memberId,quantifier:type==='UNIVERSAL_SCOPE'?'FORALL':null,domain_state,
  scope_value:['SET','UNIVERSAL_SCOPE'].includes(type)&&!['COMPETING','UNPARSED','INVALID'].includes(domain_state)?run(id):'UNKNOWN',alternative_results,
  scope_membership_only:true,not_matching_is_not_permission:true,business_decision:null,execution_authorization:null};
}
