import {OUT,OLD,read,save} from './util.mjs';
import {oracleGraph} from './reviewed-builder.mjs';
import {fixtures} from './baseline/research/7plus1-parser/semantic-parser-feasibility-026e/oracle-fixtures.mjs';
import {pack} from './pack.mjs';
import {execute} from './loader.mjs';
const selection=read(`${OLD}/CORPUS-SELECTION.json`),expected=read(`${OLD}/ORACLE-DOWNSTREAM-10.json`),rows=[];
for(const id of selection.oracle_ids){const row=selection.cases.find(x=>x.id===id),spec=fixtures.find(x=>x.id===id),old=read(`${OLD}/oracle/r006/${id}/trace.json`),f=oracleGraph(row,spec),input=pack(f,old.compiler_v03.candidate_semantic_graph);
 const t=await execute(input),c=t.compiler_v03;
 const fields=['gamma_certification','boundary_ir','canonical_7plus1','proof_dag','candidate_proof','unresolved','coverage','eligibility_decisions'];
 const equality=Object.fromEntries(fields.map(k=>[k,JSON.stringify(c[k])===JSON.stringify(old.compiler_v03[k])]));
 save(`${OUT}/old-reproduction/${id}/input.json`,input);save(`${OUT}/old-reproduction/${id}/trace.json`,t);
 rows.push({id,semantic_old:expected.rows.find(x=>x.id===id).correct_for_reviewed_fixture,exact_output_fields:equality,old_raw_G8:old.candidate_graph_gate_results.gates.G8,new_diagnostic_G8:t.candidate_graph_gate_results.gates.G8});
}
save(`${OUT}/OLD-REPRODUCTION.json`,{rows,old_raw_entry:0,old_diagnostic_semantic:7,entry_refactor_field_equality:rows.every(r=>Object.values(r.exact_output_fields).every(Boolean))});
console.log(JSON.stringify(rows.map(r=>({id:r.id,equality:r.exact_output_fields}))));
