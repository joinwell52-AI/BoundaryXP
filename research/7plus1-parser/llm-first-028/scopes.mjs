// Typed ranges only. No source/note/label scanning and no business authorization.
export const rangeOps=['ITEM','ENUM','CATEGORY','UNION','INTERSECTION','EXCEPT'];
export function expressionType(expressions,id,entities=[],path=[]){
 const x=expressions.find(x=>x.id===id);if(!x||path.includes(id))return 'INVALID';
 const children=()=>x.operands.map(k=>expressionType(expressions,k,entities,[...path,id]));
 if(x.op==='STATE')return x.state&&x.operands.length===0?'BOOLEAN':'INVALID';
 if(['ITEM','ENUM','CATEGORY'].includes(x.op)){
  const refs=x.operands.map(k=>entities.find(e=>e.id===k));
  if(x.state!==null||refs.some(e=>!e)||new Set(x.operands).size!==x.operands.length)return 'INVALID';
  if(x.op==='CATEGORY')return [1,2].includes(refs.length)&&refs[0].type==='CLASS'&&(refs.length===1||refs[1].type!=='CLASS')?'SET':'INVALID';
  return refs.length>0&&(x.op==='ENUM'||refs.length===1)&&refs.every(e=>e.type!=='CLASS')?'SET':'INVALID';
 }
 const types=children();
 if(x.state!==null)return 'INVALID';
 if(x.op==='FORALL')return types.length===1&&types[0]==='SET'?'UNIVERSAL_SCOPE':'INVALID';
 if(['AND','OR','ALL','ANY','NOT'].includes(x.op))return (x.op==='NOT'?types.length===1:types.length>=2)&&types.every(t=>t==='BOOLEAN')?'BOOLEAN':'INVALID';
 if(['UNION','INTERSECTION','EXCEPT'].includes(x.op))return (x.op==='EXCEPT'?types.length===2:types.length>=2)&&types.every(t=>t==='SET')?'SET':'INVALID';
 return 'INVALID';
}
export function scopeEntityRefs(expressions,id,seen=new Set()){
 if(seen.has(id))return [];seen.add(id);const x=expressions.find(e=>e.id===id);if(!x)return [];
 return x.op==='CATEGORY'?x.operands.slice(0,1):['ITEM','ENUM'].includes(x.op)?x.operands:x.operands.flatMap(k=>scopeEntityRefs(expressions,k,seen));
}
const and=vs=>vs.includes('FALSE')?'FALSE':vs.every(v=>v==='TRUE')?'TRUE':'UNKNOWN';
const or=vs=>vs.includes('TRUE')?'TRUE':vs.every(v=>v==='FALSE')?'FALSE':'UNKNOWN';
const not=v=>v==='TRUE'?'FALSE':v==='FALSE'?'TRUE':'UNKNOWN';
export function evaluateScope(expressions,id,memberId,{entities=[],memberships=[]}={}){
 const type=expressionType(expressions,id,entities),index=new Map(expressions.map(e=>[e.id,e]));
 const run=(key,path=[])=>{
  const x=index.get(key);if(!x||path.includes(key))return 'UNKNOWN';
  if(x.op==='FORALL')return run(x.operands[0],[...path,key]);
  if(x.op==='ITEM'||x.op==='ENUM'){
   // Competing referents are not concrete enumerable identities.
   if(!memberId||entities.find(e=>e.id===memberId)?.alternatives?.length)return 'UNKNOWN';
   const uncertain=x.operands.some(k=>entities.find(e=>e.id===k)?.alternatives?.length);
   if(x.operands.includes(memberId))return uncertain?'UNKNOWN':'TRUE';
   return uncertain?'UNKNOWN':'FALSE';
  }
  if(x.op==='CATEGORY'){
   const values=memberships.filter(m=>m.member_id===memberId&&m.category_id===x.operands[0]&&(m.within_id??null)===(x.operands[1]??null)).map(m=>m.value);
   return values.length&&values.every(v=>v===values[0])&&['TRUE','FALSE'].includes(values[0])?values[0]:'UNKNOWN';
  }
  const vs=x.operands.map(k=>run(k,[...path,key]));
  if(x.op==='UNION')return or(vs);if(x.op==='INTERSECTION')return and(vs);
  if(x.op==='EXCEPT')return and([vs[0],not(vs[1])]);return 'UNKNOWN';
 };
 return {expression_id:id,member_id:memberId,quantifier:type==='UNIVERSAL_SCOPE'?'FORALL':null,
  scope_value:['SET','UNIVERSAL_SCOPE'].includes(type)?run(id):'UNKNOWN',
  scope_membership_only:true,not_matching_is_not_permission:true,business_decision:null,execution_authorization:null};
}
