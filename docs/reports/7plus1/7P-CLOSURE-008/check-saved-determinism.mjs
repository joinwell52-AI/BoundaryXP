// Read-only deterministic compiler replay. No NLP/model is executed by this check.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {compileNative} from '../../../../research/7plus1-parser/v0.3-7p-closure-008/engine.mjs';
import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
const dir='docs/reports/7plus1/7P-CLOSURE-008',read=p=>JSON.parse(fs.readFileSync(p));
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const fields=['structure','span_lattice','semantic_nodes','relations','relation_bundles','unresolved','eligibility_decisions','coverage','boundary_ir','canonical_7plus1','proof_dag','diagnostics'];
const rows=[];
for(const run of read(dir+'/RUNS-r03.json')){
 const original=read(run.trace_path),doc=sourceDocument(original.compiler_v03.source.raw_text),options={run_id:original.compiler_v03.metadata.run_id,created_at:original.compiler_v03.metadata.created_at};
 const a=compileNative(doc,structuredClone(original.compiler_v03.nlp_signals),options),b=compileNative(doc,structuredClone(original.compiler_v03.nlp_signals),options);
 const hashes=fields.map(field=>({field,original:digest(original.compiler_v03[field]),first:digest(a.compiler_v03[field]),second:digest(b.compiler_v03[field])}));
 const row={sample_id:run.sample_id,source_sha256:run.source_sha256,saved_trace:run.trace_path,source_unchanged:doc.source.sha256===run.source_sha256,hashes,same_saved_signal_twice:hashes.every(h=>h.first===h.second),matches_frozen_original:hashes.every(h=>h.first===h.original),contract_gates:[a.contract_gate_results.status,b.contract_gate_results.status],model_execution:false};rows.push(row);console.log(run.sample_id+' '+row.same_saved_signal_twice+' original='+row.matches_frozen_original);
}
fs.writeFileSync(dir+'/DETERMINISM.json',JSON.stringify({status:rows.every(r=>r.same_saved_signal_twice&&r.matches_frozen_original&&r.source_unchanged)?'PASS_SAVED_SIGNALS':'FAIL',rows,compared_fields:fields,excluded:['run timing','model runtime metadata','signal caches; retained original model signals are not recomputed'],independent_model_repeat_after_final_freeze:'NOT_RUN_PHASE_D_GATE_NOT_MET',phase_d_certification:'NOT_PERFORMED',limits:'Byte equality of captured graph/IR/proof does not establish semantic correctness.'},null,2)+'\n',{flag:'wx'});
if(rows.some(r=>!r.same_saved_signal_twice||!r.matches_frozen_original))process.exitCode=1;
