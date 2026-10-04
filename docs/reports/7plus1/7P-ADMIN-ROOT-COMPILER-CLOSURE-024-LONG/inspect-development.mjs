import {read,OUT} from './audit-tools.mjs';
const revision=process.argv[2],indices=process.argv.slice(3).map(Number),result=read(OUT+'/development/'+revision+'/RESULTS.json');
for(const [index,row] of result.rows.entries()){
 if(indices.length&&!indices.includes(index+1))continue;
 if(!row.trace){console.log(JSON.stringify(row));continue;}
 const c=read(OUT+'/'+row.trace).compiler_v03,nm=i=>c.semantic_nodes.find(n=>n.node_id===i);
 if(process.env.COMPACT_REVIEW==='1'){console.log(JSON.stringify({id:row.id,source:c.source.raw_text,slots:Object.fromEntries(Object.entries(c.canonical_7plus1).filter(([k])=>k.length===1).map(([k,v])=>[k,{status:v.status,entries:v.entries.map(e=>e.display_value)}])),unresolved:c.unresolved.map(u=>u.reason)}));continue;}
 console.log(JSON.stringify({id:row.id,source:c.source.raw_text,slots:Object.fromEntries(Object.entries(c.canonical_7plus1).filter(([k])=>k.length===1)),events:c.semantic_nodes.filter(n=>n.node_type==='EVENT'&&!n.metadata.retired_by_admin_root).map(n=>({id:n.node_id,text:n.surface,modality:n.metadata.modality,sense:n.metadata.sense})),unresolved:c.unresolved.map(u=>({kind:u.kind,reason:u.reason,clauses:u.related_clause_ids,nodes:u.related_node_ids.map(i=>nm(i)?.surface)})),gamma_fail:c.gamma_certification.decisions.filter(d=>d.decision!=='CERTIFIED'&&d.checks.GRAPH_CONSISTENCY.reason!=='WITHDRAWN_SOURCE_HYPOTHESIS').map(d=>({type:c.candidate_semantic_graph.candidate_relations.find(r=>r.relation_id===d.relation_id)?.relation_type,reasons:Object.entries(d.checks).filter(([,r])=>r.status==='FAIL').map(([check,r])=>({check,reason:r.reason}))}))},null,2));
}
