// Offline review only. No answer file is reachable from the candidate runtime.
export function view(r){
 const g=r.compiler_v03,ir=g.boundary_ir,nm=new Map(g.semantic_nodes.map(n=>[n.node_id,n]));
 const node=i=>nm.get(i),surface=i=>node(node(i)?.metadata.referent_node_id??i)?.surface;
 const facts=k=>g.canonical_7plus1[k].entries.flatMap(e=>e.boundary_fact_ids.map(i=>ir.facts.find(f=>f.boundary_fact_id===i)));
 const objects=f=>f.object_node_ids.map(surface);
 function condition(i){const e=ir.condition_expr_nodes.find(e=>e.expr_id===i);if(!e)return null;return e.op==='STATE_REF'?{op:e.op,node:node(e.state_node_id),objects:(node(e.state_node_id)?.metadata.object_node_ids??[]).map(surface)}:{op:e.op,operands:e.operand_expr_ids?.map(condition)};}
 return {g,ir,node,surface,facts,objects,condition};
}
export function controlChecks(r,d){
 const v=view(r),{g,ir,node,surface,facts,objects,condition}=v,e=d.expect,a=[];
 const add=(name,pass,actual)=>a.push({name,pass:Boolean(pass),actual});
 add('real_contract_gate',r.contract_gate_results.status==='PASS');
 for(const k of ['I','O'])if(e[k]){const actual=[...new Set(facts(k).flatMap(objects))];add(k+'_exact_objects',JSON.stringify(actual.sort())===JSON.stringify([...e[k]].sort()),actual);}
 for(const s of e.absent_input??[])add('not_input_'+s,!facts('I').some(f=>objects(f).includes(s)));
 if(e.P)for(const [name,roles] of Object.entries(e.P)){const actual=facts('P').flatMap(f=>f.participant_node_ids).map(node).filter(n=>n.surface===name).flatMap(n=>n.metadata.participant_roles??[]);add('role_'+name,roles.every(role=>actual.includes(role)),actual);if(roles.includes('REVIEWER')||roles.includes('COLLABORATOR'))add('no_performer_'+name,!actual.includes('PERFORMER'),actual);}
 for(const val of e.A??[]){const [m,s,o]=val.split('|');add('action_'+val,facts('A').some(f=>node(f.predicate_node_id)?.metadata.modality===m&&node(f.predicate_node_id)?.metadata.sense===s&&objects(f).includes(o)));}
 for(const val of e.B??[]){const [s,o]=val.split('|');add('forbid_'+val,facts('B').some(f=>node(f.predicate_node_id)?.metadata.sense===s&&node(f.predicate_node_id)?.metadata.modality==='FORBIDDEN'&&objects(f).includes(o)));}
 if(e.R)add('task_quantity',facts('R').some(f=>{const q=ir.quantity_expr_nodes.find(q=>q.expr_id===f.quantity_expr_id);return q?.metric===e.R.metric&&q.upper_bound?.value===e.R.value&&q.upper_bound.inclusive&&q.unit===e.R.unit&&q.target_node_ids.every(i=>node(i)?.node_type==='DISCOURSE');}));
 if(e.absent_completion)add('no_invented_completion',g.canonical_7plus1.C.status==='ABSENT');
 if(e.C){const cs=facts('C').map(f=>condition(f.condition_expr_id));add('completion_operator',cs.some(c=>c?.op===e.C.op));add('completion_exact_bound_operands',cs.some(c=>e.C.objects.every(o=>c.operands?.some(x=>x.objects?.includes(o)))));add('completion_universal',cs.some(c=>c.operands?.some(x=>x.node?.metadata.quantifier===e.C.quantifier)));}
 if(e.conditioned_transfer){const fs=facts('A').filter(f=>node(f.predicate_node_id)?.metadata.sense==='send'),cs=fs.map(f=>condition(f.condition_expr_id));add('transfer_guard_owner',cs.some(c=>c?.node?.metadata.sense==='REVIEW_CONFIRMED'&&c.objects.includes(e.owner)));add('guard_reviewer',cs.some(c=>surface(c?.node?.metadata.reviewer_node_id)===e.reviewer));add('guard_universal',cs.some(c=>c?.node?.metadata.required_content?.quantifier===e.quantifier));}
 for(const p of e.not_actions??[])add('not_execution_'+p,!facts('A').some(f=>node(f.predicate_node_id)?.surface===p));
 return {id:d.id,status:a.every(x=>x.pass)?'PASS':'FAIL',assertions:a,scope:'Frozen declared mechanism assertions; not full semantic closure certification'};
}
