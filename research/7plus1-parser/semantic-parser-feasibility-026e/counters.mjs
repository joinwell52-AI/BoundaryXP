import {OUT,read,save} from './setup.mjs';
const selection=read(`${OUT}/CORPUS-SELECTION.json`),rows=[];
for(const arm of ['A','B'])for(const r of selection.cases){const t=read(`${OUT}/arm-${arm}/${r.id}/trace.json`);rows.push({arm,id:r.id,counts:t.candidate_graph_gate_results.counts,contract:t.contract_gate_results.status,architecture:t.candidate_graph_gate_results.status});}
for(const r of read(`${OUT}/ORACLE-DOWNSTREAM-10.json`).rows){const t=read(r.trace);rows.push({arm:'ORACLE',id:r.id,counts:t.candidate_graph_gate_results.counts,contract:t.contract_gate_results.status,architecture:t.candidate_graph_gate_results.status,expected_gate_failure:'G8 automatic generator absent; preserved'});}
const keys=['pre_gamma_destructive_retire','pre_gamma_final_relation_reject','pre_gamma_final_relation_resolve','pre_gamma_unresolved_delete'],totals=Object.fromEntries(keys.map(k=>[k,rows.reduce((n,r)=>n+r.counts[k],0)]));
if(Object.values(totals).some(n=>n!==0))throw Error('PRE_GAMMA_DESTRUCTIVE_VIOLATION');
save(`${OUT}/PRE-GAMMA-AUDIT.json`,{method:'Actual per-trace candidate_graph_gate_results.counts, not assumed constants',totals,rows});
console.log(JSON.stringify(totals));
