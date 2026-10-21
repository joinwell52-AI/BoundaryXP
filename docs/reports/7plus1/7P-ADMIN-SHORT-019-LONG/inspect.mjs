import {OUT,read} from './common.mjs';
const rev=process.argv[2];
for(const id of process.argv.slice(3)){
 const r=read(OUT+'attempts/'+rev+'/'+id+'/trace.json'),g=r.compiler_v03,n=new Map(g.semantic_nodes.map(x=>[x.node_id,x]));
 const report={
 missing:read(OUT+'attempts/'+rev+'/'+id+'/review.json').rows.filter(x=>!x.boundary_fact_ids.length).map(x=>x.expected),
 facts:g.boundary_ir.facts.map(f=>({type:f.fact_type,pred:n.get(f.predicate_node_id)?.surface,sub:f.subject_node_ids.map(x=>n.get(x)?.surface),obj:f.object_node_ids.map(x=>n.get(x)?.surface),scope:f.scope_expr_id,condition:f.condition_expr_id})),
 unresolved:g.unresolved.map(u=>({reason:u.reason,clauses:u.related_clause_ids})),clauses:g.nlp_signals.clauses.map(c=>({id:c.id,text:c.span.quote}))};
 console.log(id,JSON.stringify(report));
}
