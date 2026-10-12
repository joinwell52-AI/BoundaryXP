// Typed graph/observation operations only. Never inspect source text, labels or notes.
export function setDomain(expressions,entities,id,memberships={},ancestors=[]){
 const index=new Map(expressions.map(x=>[x.id,x])),items=new Map(entities.map(x=>[x.id,x]));
 const run=(key,path=ancestors)=>{
  if(path.includes(key))return {complete:false,members:[],reason:'DOMAIN_CYCLE'};
  const x=index.get(key);if(!x)return {complete:false,members:[],reason:'DOMAIN_MISSING'};
  if(x.op==='ITEM')return {complete:true,members:[...x.operands],provenance_ids:[key,...x.operands]};
  if(x.op==='MEMBERS'){
   const item=index.get(x.operands[0]),group=items.get(item?.op==='ITEM'?item.operands[0]:null);
   if(!group||group.type!=='GROUP')return {complete:false,members:[],reason:'MEMBERS_REQUIRES_GROUP_ITEM'};
   const observed=memberships[group.id],declared=Array.isArray(group.members)?group.members:null;
   const supplied=observed&&Array.isArray(observed.members)&&observed.members.every(k=>typeof k==='string'&&k.length>0)&&new Set(observed.members).size===observed.members.length;
   return {complete:declared!==null||!!(supplied&&observed.complete===true),members:declared??(supplied?observed.members:[]),group_id:group.id,provenance_ids:[key,item.id,group.id,...(declared??[])],membership_source:declared!==null?'EXPLICIT_SOURCE_GROUP':'EXTERNAL_OBSERVATION',reason:declared===null&&!supplied?'MEMBERSHIP_UNKNOWN':null};
  }
  if(!['UNION','INTERSECTION','EXCEPT'].includes(x.op))return {complete:false,members:[],reason:'NOT_A_SET_DOMAIN'};
  const children=x.operands.map(k=>run(k,[...path,key]));
  if(children.some(c=>!c.complete))return {complete:false,members:[],reason:'DOMAIN_NOT_COMPLETE'};
  const sets=children.map(c=>new Set(c.members));
  const members=x.op==='UNION'?[...new Set(children.flatMap(c=>c.members))]:x.op==='INTERSECTION'?[...sets[0]].filter(k=>sets.every(s=>s.has(k))):[...sets[0]].filter(k=>!sets[1].has(k));
  return {complete:true,members,provenance_ids:[key,...children.flatMap(c=>c.provenance_ids??[])]};
 };
 return run(id);
}
export function isSetDomain(expressions,entities,id,ancestors=[]){
 if(ancestors.includes(id))return false;
 const x=expressions.find(e=>e.id===id);if(!x)return false;
 if(x.op==='ITEM')return x.operands.length===1&&entities.some(e=>e.id===x.operands[0]);
 if(x.op==='MEMBERS'){
  const item=expressions.find(e=>e.id===x.operands[0]);
  return x.operands.length===1&&item?.op==='ITEM'&&item.operands.length===1&&entities.some(e=>e.id===item.operands[0]&&e.type==='GROUP');
 }
 return ['UNION','INTERSECTION','EXCEPT'].includes(x.op)&&x.operands.length>0&&x.operands.every(k=>isSetDomain(expressions,entities,k,[...ancestors,id]));
}
export function evaluateDistributedQuantity(quantity,expressions,entities,observed,memberships,evaluateAtomic){
 const distribution=quantity.distribution;
 if(distribution?.mode!=='EACH')return {result:evaluateAtomic(quantity,observed),distribution:distribution?.mode??'LEGACY_SINGLE_TARGET',members:[],membership_complete:null};
 const domain=setDomain(expressions,entities,distribution.domain_id,memberships);
 const values=observed&&typeof observed==='object'&&observed.members&&typeof observed.members==='object'?observed.members:{};
 const members=domain.members.map(member_id=>({member_id,quantity:{...quantity,target_id:member_id},observed:values[member_id]??null,result:evaluateAtomic({...quantity,target_id:member_id},values[member_id])}));
 const result=members.some(x=>x.result==='FALSE')?'FALSE':domain.complete&&members.every(x=>x.result==='TRUE')?'TRUE':'UNKNOWN';
 return {result,distribution:'EACH',domain_id:distribution.domain_id,target_id:quantity.target_id,membership_complete:domain.complete,members,reason:domain.reason??null,provenance_ids:domain.provenance_ids??[],out_of_domain_observation_ids:Object.keys(values).filter(k=>!domain.members.includes(k)),execution_authorization:null};
}
