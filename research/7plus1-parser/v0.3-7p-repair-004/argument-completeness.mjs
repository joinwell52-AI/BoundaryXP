// Closed function words cannot independently identify an action's affected object.
const functions=new Set(['在','做','写','本','该','这','那','其','的','任何','所有','to','at','in','of','the','this','that']);
export function incompleteTarget(f,event,relations){
 const args=relations.filter(r=>['FORBIDS','PATIENT','THEME','RESULT','RESTRICTS'].includes(r.relation_type)).map(r=>f.semantic_nodes.find(n=>n.node_id===r.tail_node_id));
 return args.length>0&&args.every(n=>functions.has(n?.surface.trim().toLowerCase()));
}
