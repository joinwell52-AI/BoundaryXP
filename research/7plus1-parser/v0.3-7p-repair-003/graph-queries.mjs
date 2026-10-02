// Q only consumes certified graph records. Candidate production belongs upstream.
export const QUERY_TYPES=Object.freeze({I:['TASK_OBJECT'],O:['DELIVERABLE'],A:['ACTION'],P:['PARTICIPANT'],R:['RESOURCE'],V:['BASELINE'],C:['COMPLETION','STOP'],B:['FORBID','RESTRICT']});
export function queryGraph(slot,ir,nodes){
 const nm=new Map(nodes.map(n=>[n.node_id,n]));
 return ir.facts.filter(f=>QUERY_TYPES[slot].includes(f.fact_type)).filter(f=>{
  if(slot==='A')return ['REQUIRED','PERMITTED'].includes(nm.get(f.predicate_node_id)?.metadata.modality);
  if(slot==='P')return f.participant_node_ids.every(i=>nm.get(i)?.metadata.participant_roles?.some(r=>['PERFORMER','APPROVER','REVIEWER','RECIPIENT','COLLABORATOR'].includes(r)));
  return true;
 });
}
export const QI=(ir,n)=>queryGraph('I',ir,n),QO=(ir,n)=>queryGraph('O',ir,n),QA=(ir,n)=>queryGraph('A',ir,n),QP=(ir,n)=>queryGraph('P',ir,n),QR=(ir,n)=>queryGraph('R',ir,n),QV=(ir,n)=>queryGraph('V',ir,n),QC=(ir,n)=>queryGraph('C',ir,n),QB=(ir,n)=>queryGraph('B',ir,n);
