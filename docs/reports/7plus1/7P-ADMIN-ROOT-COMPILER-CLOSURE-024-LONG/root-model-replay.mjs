import fs from 'node:fs';
import {write,read,sha,walk,RUNTIME} from './audit-tools.mjs';
import {parse7Plus1} from '../../../../research/7plus1-parser/v0.3-admin-root-024/engine.mjs';
import {closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
const revision=process.argv[2];if(!/^r\d{2}$/u.test(revision))throw Error('REVISION_REQUIRED');
const implementation=walk(RUNTIME).map(path=>({path,sha256:sha(fs.readFileSync(path))})),rows=[];
write('root-model/'+revision+'/IMPLEMENTATION.json',{implementation,actual_nlp:true,actual_semantic_models:true,purpose:'DEVELOPMENT_SOURCE_AUDIT_NOT_HOLDOUT'});
try{
 for(const row of read('docs/reports/7plus1/7P-CANDIDATE-SEMANTIC-GRAPH-023/ADMIN-FIRST-OUTPUTS-r05.json').rows.filter(r=>r.corpus==='root-standard-050')){
  const previous=read('docs/reports/7plus1/7P-CANDIDATE-SEMANTIC-GRAPH-023/'+row.trace),text=previous.compiler_v03.source.raw_text,base='root-model/'+revision+'/'+row.id+'/';write(base+'source.md',text);
  try{const result=await parse7Plus1(text);write(base+'trace.json',result);const c=result.compiler_v03;const r={id:row.id,status:'OUTPUT_SAVED',trace:base+'trace.json',source_sha256:sha(text),gate:result.candidate_graph_gate_results.status,contract:result.contract_gate_results.status,unknown:c.unresolved.length,model_diagnostics:c.nlp_signals.semantic_model_signals.diagnostics,actual_models:c.nlp_signals.semantic_model_signals.models.map(m=>m.resource)};rows.push(r);console.log(JSON.stringify(r));}
  catch(e){write(base+'error.json',{message:e.message,stack:e.stack});const r={id:row.id,status:'ERROR_SAVED',error:base+'error.json'};rows.push(r);console.log(JSON.stringify(r));}
 }
}finally{await closeNlp();}
const drift=implementation.filter(({path,sha256})=>sha(fs.readFileSync(path))!==sha256);write('root-model/'+revision+'/RESULTS.json',{total:rows.length,outputs:rows.filter(r=>r.status==='OUTPUT_SAVED').length,errors:rows.filter(r=>r.status==='ERROR_SAVED').length,implementation_drift:drift,rows});
