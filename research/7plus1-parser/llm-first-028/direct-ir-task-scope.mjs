// Task identity comes exclusively from typed TASK nodes and owner links.
// ROOT is a scope sentinel, not an invented event or a name-matching heuristic.
export function taskScope(ir) {
 const tasks=new Map(ir.events.filter(e=>e.kind==='TASK').map(e=>[e.id,e]));
 const roots=[...tasks.values()].filter(e=>e.owner_id===e.id||e.owner_id==='ROOT');
 const resolve=id=>tasks.has(id)?id:id==='ROOT'&&roots.length===1?roots[0].id:null;
 const ancestry=id=>{
  let current=resolve(id);const path=[],seen=new Set();
  if(current===null)return {path,complete:false,reason:'TASK_IDENTITY_UNRESOLVED'};
  while(current!==null){
   if(seen.has(current))return {path,complete:false,reason:'TASK_OWNERSHIP_CYCLE'};
   seen.add(current);path.push(current);const task=tasks.get(current);
   if(task.owner_id===current||task.owner_id==='ROOT'&&!tasks.has('ROOT'))return {path,complete:true,reason:null};
   current=resolve(task.owner_id);
  }
  return {path,complete:false,reason:'TASK_OWNER_UNRESOLVED'};
 };
 const member=(owner,target)=>{
  const id=resolve(target),chain=ancestry(owner);
  if(id===null||!chain.complete)return null;
  return chain.path.includes(id);
 };
 return {resolve,ancestry,member};
}
