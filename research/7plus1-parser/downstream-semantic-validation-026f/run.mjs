import {OUT,read,save} from './util.mjs';
import {execute} from './loader.mjs';
import {compare} from './compare.mjs';
const arm=process.argv[2]??'baseline',revision=process.argv[3]??'r001',rows=[];
for(const row of read(`${OUT}/INPUT-FREEZE.json`).rows){const prefix=`${OUT}/runs/${arm}-${revision}/${row.id}`;
 try{const trace=await execute(read(`${OUT}/inputs/${row.id}/input.json`),arm),review=compare(trace,read(`${OUT}/inputs/${row.id}/expected.json`));save(`${prefix}/trace.json`,trace);save(`${prefix}/canonical.json`,trace.compiler_v03.canonical_7plus1);save(`${prefix}/review.json`,review);rows.push({id:row.id,group:row.group,status:review.status,failures:review.failures.map(x=>x.claim),contract:trace.contract_gate_results.status,gates:trace.candidate_graph_gate_results.status});}
 catch(e){save(`${prefix}/error.json`,{error:String(e),stack:e.stack});rows.push({id:row.id,group:row.group,status:'ERROR',error:String(e)});}
 console.log(JSON.stringify(rows.at(-1)));
}
save(`${OUT}/runs/${arm}-${revision}/RESULTS.json`,{rows});
