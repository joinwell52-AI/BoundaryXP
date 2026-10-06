// Research-only replay. It never replaces the production entry point.
// Unpack EVIDENCE-*.zip at repository root before running this command.
import fs from 'node:fs';
import {OUT,read,save,sha} from './util.mjs';
import {execute} from './loader.mjs';
import {compare} from './compare.mjs';
import {pack} from './pack.mjs';
import {sourceDocument} from './baseline/research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {prepareCandidates,freezeCandidateGraph} from './baseline/research/7plus1-parser/v0.3-candidate-parsing-026/candidates.mjs';
const revision=process.argv[2];
if(!revision||!/^[a-zA-Z0-9-]+$/u.test(revision))throw Error('Provide a NEW output revision name; existing results are never overwritten.');
const limit=process.argv[3]?Number(process.argv[3]):Infinity;
const base=`${OUT}/replays/${revision}`;
if(fs.existsSync(base))throw Error('REPLAY_DIRECTORY_EXISTS');
const result={diagnostic:[],automatic:[],new_model_calls:0};
for(const row of read(`${OUT}/INPUT-FREEZE.json`).rows.slice(0,limit)){
 const trace=await execute(read(`${OUT}/inputs/${row.id}/input.json`),'trial');
 const review=compare(trace,read(`${OUT}/inputs/${row.id}/expected.json`));
 save(`${base}/diagnostic/${row.id}/trace.json`,trace);
 save(`${base}/diagnostic/${row.id}/canonical.json`,trace.compiler_v03.canonical_7plus1);
 result.diagnostic.push({id:row.id,review});
}
const fields=['gamma_certification','boundary_ir','canonical_7plus1','proof_dag','candidate_proof','unresolved','coverage','eligibility_decisions'];
for(const row of read(`${OUT}/compatibility-r002/AUTOMATIC-MATRIX.json`).rows.slice(0,limit)){
 const c=read(`${OUT}/compatibility-r002/automatic/baseline/${row.corpus}/${row.id}/trace.json`).compiler_v03;
 const f=prepareCandidates(sourceDocument(c.source.raw_text),c.nlp_signals);
 const graph=freezeCandidateGraph(f,c.nlp_signals.semantic_model_signals);
 if(JSON.stringify(graph)!==JSON.stringify(c.candidate_semantic_graph))throw Error('FROZEN_GC_MISMATCH '+row.id);
 const input=pack(f,c.candidate_semantic_graph);
 for(const arm of ['baseline','trial']){
  const actual=await execute(input,arm,'AUTOMATIC');
  const expected=read(`${OUT}/compatibility-r002/automatic/${arm}/${row.corpus}/${row.id}/trace.json`);
  const equal=Object.fromEntries(fields.map(k=>[k,JSON.stringify(actual.compiler_v03[k])===JSON.stringify(expected.compiler_v03[k])]));
  save(`${base}/automatic/${arm}/${row.corpus}/${row.id}/trace.json`,actual);
  result.automatic.push({id:row.id,arm,source_sha256:sha(Buffer.from(c.source.raw_text)),equal,G8:actual.candidate_graph_gate_results.gates.G8.status});
 }
}
save(`${base}/RESULT.json`,result);
console.log(JSON.stringify({diagnostic:result.diagnostic.length,automatic:result.automatic.length,all_automatic_equal:result.automatic.every(r=>Object.values(r.equal).every(Boolean))}));
