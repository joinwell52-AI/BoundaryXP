import fs from 'node:fs';import path from 'node:path';import {performance} from 'node:perf_hooks';
import {OUT,RUNTIME,read,write,sha} from './audit-tools.mjs';
import {materialize} from './blind-generator.mjs';
import {parse7Plus1} from '../../../../research/7plus1-parser/v0.3-natural-generalization-025/engine.mjs';
import {closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
const frozen=read(OUT+'/IMPLEMENTATION-FREEZE.json');
function verifyRuntime(){for(const f of frozen.files)if(sha(fs.readFileSync(f.path))!==f.sha256)throw Error('FROZEN_RUNTIME_CHANGED '+f.path);if(sha(fs.readFileSync(OUT+'/blind-generator.mjs'))!==frozen.generator_sha256)throw Error('FROZEN_GENERATOR_CHANGED');}
verifyRuntime();const batch=materialize(frozen.implementation_freeze_sha256,frozen.generator_sha256);
write('BLIND-200-SEED.json',{seed:batch.seed,formula:'SHA256("BOUNDX-025-BLIND-200" + implementation_freeze_sha256 + generator_sha256)',implementation_freeze_sha256:frozen.implementation_freeze_sha256,generator_sha256:frozen.generator_sha256,materialized_at:new Date().toISOString()});
write('BLIND-200-SOURCE.json',{cases:batch.cases.map(c=>({id:c.id,source:c.source,sha256:sha(c.source),language:c.frame.language}))});
write('BLIND-200-FRAMES.json',{cases:batch.cases.map(c=>({id:c.id,frame:c.frame,expected:c.expected}))});
const inputSeal={sealed_at:new Date().toISOString(),files:['BLIND-200-SEED.json','BLIND-200-SOURCE.json','BLIND-200-FRAMES.json'].map(p=>({path:p,sha256:sha(fs.readFileSync(OUT+'/'+p))})),cases:200};write('BLIND-200-INPUT-SEAL.json',inputSeal);
write('BLIND-200-RUN-START.json',{started_at:new Date().toISOString(),input_seal_sha256:sha(JSON.stringify(inputSeal)),entry:RUNTIME+'/engine.mjs',retries_allowed:false});
const rows=[];try{for(const c of batch.cases){const started=performance.now(),dir='blind-first/'+c.id;write(dir+'/source.md',c.source);try{const r=await parse7Plus1(c.source);write(dir+'/trace.json',r);write(dir+'/canonical-7plus1.json',r.compiler_v03.canonical_7plus1);rows.push({id:c.id,status:'OUTPUT_SAVED',trace:dir+'/trace.json',trace_sha256:sha(fs.readFileSync(OUT+'/'+dir+'/trace.json')),source_sha256:sha(c.source),elapsed_ms:performance.now()-started,contract:r.contract_gate_results.status,architecture:r.candidate_graph_gate_results.status,unresolved:r.compiler_v03.unresolved.length});}catch(e){write(dir+'/error.json',{message:e.message,stack:e.stack,elapsed_ms:performance.now()-started});rows.push({id:c.id,status:'ERROR_SAVED',error:dir+'/error.json',elapsed_ms:performance.now()-started});}console.log(JSON.stringify(rows.at(-1)));}}finally{await closeNlp();}
verifyRuntime();write('BLIND-200-FIRST-RUN.json',{completed_at:new Date().toISOString(),rows,total:rows.length,outputs:rows.filter(r=>r.trace).length,runtime_errors:rows.filter(r=>r.error).length,raw_outputs_sealed_before_evaluation:true});
write('BLIND-200-OUTPUT-SEAL.json',{sealed_at:new Date().toISOString(),files:rows.map(r=>r.trace??r.error).concat('BLIND-200-FIRST-RUN.json').map(p=>({path:p,sha256:sha(fs.readFileSync(OUT+'/'+p))})),runtime_unchanged:true});
