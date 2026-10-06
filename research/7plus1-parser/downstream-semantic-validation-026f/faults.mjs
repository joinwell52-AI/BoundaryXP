import {OUT,read,save} from './util.mjs';
import {execute} from './loader.mjs';
const arm=process.argv[2]??'baseline',revision=process.argv[3]??'r001',rows=[];
for(const {id}of read(`${OUT}/FAULT-FREEZE.json`).rows){const prefix=`${OUT}/faults/${arm}-${revision}/${id}`;
 try{const t=await execute(read(`${OUT}/fault-inputs/${id}/input.json`),arm);save(`${prefix}/trace.json`,t);const c=t.compiler_v03;
 const target=c.candidate_semantic_graph.candidate_relations.find(r=>r.relation_type==='PATIENT'),decision=c.gamma_certification.decisions.find(d=>d.relation_id===target.relation_id);
 const condition=c.gamma_certification.expression_decisions.find(d=>c.candidate_semantic_graph.candidate_expressions.find(e=>e.expression_id===d.expression_id)?.expression_type==='condition_expr_nodes');
 const declared=g=>g.candidate_plan_sets.filter(p=>p.condition_expr_id===condition?.expression_id).map(p=>p.predicate_node_id);
 const ok=id==='F03'?condition?.decision!=='CERTIFIED'&&!c.boundary_ir.facts.some(f=>declared(c.candidate_semantic_graph).includes(f.predicate_node_id)&&f.state==='RESOLVED'&&['ACTION','DELIVERABLE'].includes(f.fact_type)):decision?.decision!=='CERTIFIED';
 rows.push({id,status:ok?'PASS':'FAIL',location:id==='F03'?'GAMMA_EXPRESSION':'GAMMA_RELATION',decision,condition});
 }catch(e){save(`${prefix}/error.json`,{error:String(e),stack:e.stack});rows.push({id,status:['F01','F02'].includes(id)?'PASS':'FAIL',location:'EXPLICIT_VALIDATION_ERROR',error:String(e)});}
 console.log(id,rows.at(-1).status);
}
save(`${OUT}/faults/${arm}-${revision}/RESULTS.json`,{rows});
