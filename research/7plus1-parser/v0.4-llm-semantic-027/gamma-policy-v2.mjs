import {certify as baseCertify} from './gamma-v04.mjs';
// Additional finite cross-field checks. No words, case IDs or model names are
// inspected, and no new semantic candidate is generated here.
export function certify(graph,evidence){
 const result=baseCertify(graph,evidence),items=new Map([...graph.nodes,...graph.relations,...graph.expressions].map(c=>[c.id,c])),byId=new Map(result.decisions.map(d=>[d.candidate_id,d]));
 function flag(id,rule,kind='TYPED_UNRESOLVED'){const d=byId.get(id);if(!d||d.failures.some(f=>f.rule===rule))return;d.failures.push({rule,kind});d.decision=d.failures.some(f=>f.kind==='REJECTED')?'REJECTED':'TYPED_UNRESOLVED';d.reason=d.failures.map(f=>f.rule).join(';');}
 const ancestors=i=>{const seen=new Set();while(i&&!seen.has(i)){seen.add(i);i=items.get(i)?.owner;}return seen;};
 for(const r of graph.relations){const tail=items.get(r.tail);if(['SCOPE_MEMBER','LIMIT','RESTRICTS'].includes(r.type)&&tail?.family==='expressions'&&!ancestors(r.head).has(tail.owner)&&!ancestors(tail.owner).has(r.head))flag(r.id,'RELATION_EXPRESSION_OWNER_CONSISTENCY');}
 for(const e of graph.expressions){const target=items.get(e.quantity?.target);if(e.quantity?.use==='EXECUTION_LIMIT'&&target?.type==='EVENT'&&['SUPPORT','DECLARATION'].includes(target.predicate_class))flag(e.id,'RESOURCE_TARGET_IS_NOT_A_BUSINESS_OPERATION');}
 const deps=c=>c.family==='nodes'?[c.owner].filter(Boolean):c.family==='relations'?[c.head,c.tail]:[c.owner,...c.operands,...(c.quantity?[c.quantity.target]:[])];
 let changed=true;while(changed){changed=false;for(const d of result.decisions)if(d.decision==='CERTIFIED'&&deps(items.get(d.candidate_id)).some(i=>byId.get(i)?.decision!=='CERTIFIED')){flag(d.candidate_id,'UNCERTIFIED_TRANSITIVE_CONTRACT_DEPENDENCY');changed=true;}}
 return {...result,policy_version:'v0.4-027-p2',certified_ids:result.decisions.filter(d=>d.decision==='CERTIFIED').map(d=>d.candidate_id),unresolved:result.decisions.filter(d=>d.decision==='TYPED_UNRESOLVED'),rejected:result.decisions.filter(d=>d.decision==='REJECTED')};
}
