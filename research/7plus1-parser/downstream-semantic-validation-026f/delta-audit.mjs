import {OUT,read,save} from './util.mjs';
const prefix=process.argv[2]?`${OUT}/${process.argv[2]}`:OUT,rows=[],lost=[];
for(const row of read(`${prefix}/AUTOMATIC-MATRIX.json`).rows.filter(r=>r.status==='OUTPUT_SAVED')){
 const b=read(`${prefix}/automatic/baseline/${row.corpus}/${row.id}/trace.json`).compiler_v03,t=read(`${prefix}/automatic/trial/${row.corpus}/${row.id}/trace.json`).compiler_v03,g=t.candidate_semantic_graph;
 for(const d of t.gamma_certification.decisions.filter(d=>d.decision==='CERTIFIED'&&b.gamma_certification.decisions.find(x=>x.relation_id===d.relation_id)?.decision!=='CERTIFIED')){
  const r=g.candidate_relations.find(r=>r.relation_id===d.relation_id),h=g.semantic_nodes.find(n=>n.node_id===r.head_node_id),a=g.semantic_nodes.find(n=>n.node_id===r.tail_node_id),before=b.gamma_certification.decisions.find(x=>x.relation_id===d.relation_id);
  rows.push({id:row.id,corpus:row.corpus,source:g.source_text,relation:r,predicate:h,argument:a,before_failed_checks:Object.fromEntries(Object.entries(before.checks).filter(([k,v])=>v.status==='FAIL')),after:d,source_spans:r.source_span_ids.map(i=>g.source_spans.find(s=>s.span_id===i)),resolved_fact_ids:t.boundary_ir.facts.filter(f=>f.state==='RESOLVED'&&f.relation_ids.includes(r.relation_id)).map(f=>f.boundary_fact_id)});
 }
 lost.push(...row.lost_unresolved.map(u=>({id:row.id,corpus:row.corpus,unresolved:u,all_related_nodes:t.gamma_certification.node_decisions.filter(n=>u.related_node_ids.includes(n.node_id)),all_related_relations:t.gamma_certification.decisions.filter(r=>u.related_relation_ids.includes(r.relation_id))})));
}
save(`${prefix}/NEW-CERTIFICATION-AUDIT.json`,{reviewer:'CODEX_PENDING_ADMIN',rows,lost_unresolved:lost,natural_language_truth_not_proven_by_gate:true});
console.log(JSON.stringify(rows.map(r=>({id:r.id,type:r.relation.relation_type,h:r.predicate.surface,a:r.argument.surface,prior:r.before_failed_checks,live:r.resolved_fact_ids.length})),null,2));
