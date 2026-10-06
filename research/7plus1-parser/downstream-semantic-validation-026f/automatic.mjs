import {OUT as TASK_OUT,BASE,read,save,sha} from './util.mjs';
const OUT=process.argv[2]?`${TASK_OUT}/${process.argv[2]}`:TASK_OUT;
import {sourceDocument} from './baseline/research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {prepareCandidates,freezeCandidateGraph} from './baseline/research/7plus1-parser/v0.3-candidate-parsing-026/candidates.mjs';
import {compileCandidates as originalCompile} from './baseline/research/7plus1-parser/v0.3-candidate-parsing-026/engine.mjs';
import {pack} from './pack.mjs';
import {execute} from './loader.mjs';
const fields=['gamma_certification','boundary_ir','canonical_7plus1','proof_dag','candidate_proof','unresolved','coverage','eligibility_decisions'],rows=[],manifests={baseline:{},trial:{}};
for(const corpus of ['root','natural','exposed200']){
 manifests.baseline[corpus]=[];manifests.trial[corpus]=[];
 for(const row of read(`${BASE}/development/r050/${corpus}/RESULTS.json`).rows){const key=corpus+'/'+row.id,old=read(`${BASE}/${row.trace}`),c=old.compiler_v03;
  try{
   const doc=sourceDocument(c.source.raw_text),f=prepareCandidates(doc,c.nlp_signals),g=freezeCandidateGraph(f,c.nlp_signals.semantic_model_signals);
   const unequal=Object.keys(g).filter(k=>JSON.stringify(g[k])!==JSON.stringify(c.candidate_semantic_graph[k]));
   if(unequal.length)throw Error('FROZEN_GC_REHYDRATION_MISMATCH '+unequal.join(','));
   const input=pack(f,c.candidate_semantic_graph),original=originalCompile(prepareCandidates(doc,c.nlp_signals),c.nlp_signals.semantic_model_signals,{run_id:'026F-FROZEN-DOWNSTREAM',created_at:'2026-10-06T00:00:00.000Z'});
   const baseline=await execute(input,'baseline','AUTOMATIC'),trial=await execute(input,'trial','AUTOMATIC');
   const equal=Object.fromEntries(fields.map(k=>[k,JSON.stringify(original.compiler_v03[k])===JSON.stringify(baseline.compiler_v03[k])]));
   const changed=fields.filter(k=>JSON.stringify(baseline.compiler_v03[k])!==JSON.stringify(trial.compiler_v03[k]));
   const beforeIds=new Set(baseline.compiler_v03.unresolved.map(u=>u.unresolved_id)),lost=baseline.compiler_v03.unresolved.filter(u=>!trial.compiler_v03.unresolved.some(v=>v.unresolved_id===u.unresolved_id));
   for(const [arm,trace]of [['baseline',baseline],['trial',trial]]){const path=`${OUT}/automatic/${arm}/${key}/trace.json`;save(path,trace);save(`${OUT}/automatic/${arm}/${key}/canonical.json`,trace.compiler_v03.canonical_7plus1);manifests[arm][corpus].push({id:row.id,source_sha256:c.source.sha256,trace:path,trace_sha256:sha(Buffer.from(JSON.stringify(trace,null,2)+'\n'))});}
   rows.push({id:row.id,corpus,status:'OUTPUT_SAVED',frozen_graph_exact:true,extraction_equality:equal,changed_fields:changed,lost_unresolved:lost,baseline_contract:baseline.contract_gate_results.status,trial_contract:trial.contract_gate_results.status,baseline_gates:baseline.candidate_graph_gate_results,trial_gates:trial.candidate_graph_gate_results});
  }catch(e){save(`${OUT}/automatic/errors/${key}.json`,{error:String(e),stack:e.stack});rows.push({id:row.id,corpus,status:'ERROR',error:String(e)});}
 }
 console.log(corpus,rows.filter(r=>r.corpus===corpus).length,'errors',rows.filter(r=>r.corpus===corpus&&r.status==='ERROR').length);
}
for(const arm of ['baseline','trial'])for(const corpus of ['root','natural','exposed200'])save(`${OUT}/automatic/${arm}/${corpus}-RESULTS.json`,{rows:manifests[arm][corpus]});
save(`${OUT}/AUTOMATIC-MATRIX.json`,{not_new_model_calls:true,rows,extraction_all_equal:rows.every(r=>r.status!=='ERROR'&&Object.values(r.extraction_equality).every(Boolean)),total:rows.length});
