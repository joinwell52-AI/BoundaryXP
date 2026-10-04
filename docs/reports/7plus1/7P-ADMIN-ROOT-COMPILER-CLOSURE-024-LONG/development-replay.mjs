import fs from 'node:fs';import {OUT,RUNTIME,read,write,sha,walk} from './audit-tools.mjs';
import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {compileNative} from '../../../../research/7plus1-parser/v0.3-admin-root-024/engine.mjs';
const iteration=process.argv[2];if(!/^r\d{2}$/u.test(iteration))throw Error('REVISION_REQUIRED');
const baseline='docs/reports/7plus1/7P-CANDIDATE-SEMANTIC-GRAPH-023',rows=[];
write('development/'+iteration+'/IMPLEMENTATION.json',{files:walk(RUNTIME).map(path=>({path,sha256:sha(fs.readFileSync(path))})),test:sha(fs.readFileSync('tests/parser-admin-root-024.test.mjs')),nlp:'Frozen 023 actual NLP signals reused for fast deterministic mechanism debugging; not a fresh-model final acceptance replay.'});
for(const p of read(baseline+'/ADMIN-FIRST-OUTPUTS-r05.json').rows.filter(p=>p.corpus==='root-standard-050')){
 const previous=read(baseline+'/'+p.trace),source=previous.compiler_v03.source.raw_text,base='development/'+iteration+'/'+p.id+'/';write(base+'source.md',source);
 try{const r=compileNative(sourceDocument(source),structuredClone(previous.compiler_v03.nlp_signals));write(base+'trace.json',r);const c=r.compiler_v03;rows.push({id:p.id,source_sha256:sha(source),status:'OUTPUT_SAVED',trace:base+'trace.json',gate:r.candidate_graph_gate_results.status,contract:r.contract_gate_results.status,unknown:c.unresolved.length,semantic_accuracy:'NOT_SCORED',source_spans:r.source_spans.length,candidate_nodes:c.candidate_semantic_graph.semantic_nodes.length});}
 catch(e){write(base+'error.json',{message:e.message,stack:e.stack});rows.push({id:p.id,status:'ERROR_SAVED',error:base+'error.json'});}
}
write('development/'+iteration+'/RESULTS.json',{iteration,total:rows.length,outputs:rows.filter(r=>r.status==='OUTPUT_SAVED').length,errors:rows.filter(r=>r.status==='ERROR_SAVED').length,cached_nlp:true,actual_semantic_models_used:false,not_final_acceptance:true,rows});console.log(JSON.stringify({iteration,total:rows.length,errors:rows.filter(r=>r.status==='ERROR_SAVED').length}));
