import fs from 'node:fs';
const [rev,num]=process.argv.slice(2),r=JSON.parse(fs.readFileSync('docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG/development/'+rev+'/natural/NROOT-'+num.padStart(3,'0')+'/trace.json')),c=r.compiler_v03;
console.log(JSON.stringify(r.contract_gate_results,null,2));
console.log('GU',JSON.stringify(c.unresolved,null,2));
const nm=i=>c.semantic_nodes.find(n=>n.node_id===i);for(const f of c.boundary_ir.facts)if(f.scope_expr_id)console.log(f.fact_type,f.state,nm(f.predicate_node_id)?.surface,f.object_node_ids.map(i=>nm(i)?.surface),JSON.stringify(c.boundary_ir.set_expr_nodes.find(e=>e.expr_id===f.scope_expr_id)));
