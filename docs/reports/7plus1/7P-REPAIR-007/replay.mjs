import fs from 'node:fs';import {createHash,randomUUID} from 'node:crypto';
import {parse7Plus1} from '../../../../research/7plus1-parser/v0.3-7p-repair-007/engine.mjs';
import {closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-repair-007/linguistic.mjs';
import {traceMarkdown} from '../../../../research/7plus1-parser/v0.3-7p-repair-007/export.mjs';
import {meetingAssertions} from '../7P-REPAIR-001/test-support/meeting-assertions.mjs';
const dir='docs/reports/7plus1/7P-REPAIR-007',read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),put=(p,o)=>fs.writeFileSync(p,typeof o==='string'?o:JSON.stringify(o,null,2)+'\n',{flag:'wx'}),freeze=read(dir+'/IMPLEMENTATION-FROZEN.json');
for(const[p,h]of Object.entries(freeze.files))if(hash(p)!==h)throw Error('IMPLEMENTATION_CHANGED '+p);
const pointer=read('fixtures/7plus1/standard/ACTIVE-ADJUDICATION.json');console.log(pointer);
const active=read('fixtures/7plus1/standard/adjudications/r02/manifest.json'),inputs=[{sample_id:'REF-001',source_path:'fixtures/7plus1/golden/REF-001/source.txt'},...active.cases.filter(c=>c.denominator_included)],rows=[];
try{for(const x of inputs){const out=dir+'/replay/'+x.sample_id;fs.mkdirSync(out,{recursive:true});const run_id=randomUUID(),start=Date.now();put(out+'/ATTEMPTED.json',{run_id,source_path:x.source_path,source_sha256:hash(x.source_path),started:new Date().toISOString(),engine:freeze.engine,implementation_manifest_sha256:hash(dir+'/IMPLEMENTATION-FROZEN.json')});
 try{const r=await parse7Plus1(fs.readFileSync(x.source_path),{run_id,filename:'source.md'}),c=r.compiler_v03;put(out+'/trace.json',r);put(out+'/trace.md',traceMarkdown(r));put(out+'/actual-7plus1.json',c.canonical_7plus1);
 const row={sample_id:x.sample_id,run_id,status:'COMPLETE',parser_status:r.parser_status,contract_gates:r.contract_gate_results.status,source_sha256:c.source.sha256,engine:freeze.engine,duration_ms:Date.now()-start,actual_path:out+'/actual-7plus1.json',trace_path:out+'/trace.json',trace_sha256:hash(out+'/trace.json'),model_signals:c.nlp_signals.semantic_model_signals.models,model_diagnostics:c.nlp_signals.semantic_model_signals.diagnostics,ref_assertions:x.sample_id==='REF-001'?meetingAssertions(r):null};put(out+'/RUN.json',row);rows.push(row);console.log(JSON.stringify({sample:x.sample_id,gates:row.contract_gates,seconds:row.duration_ms/1000,ref_failed:row.ref_assertions?.filter(a=>!a.pass)}));
 }catch(e){const row={sample_id:x.sample_id,run_id,status:'FAILED',duration_ms:Date.now()-start,error:{message:e.message,stack:e.stack}};put(out+'/ERROR.json',row);rows.push(row);console.log(JSON.stringify(row));}
}}finally{closeNlp();}
for(const[p,h]of Object.entries(freeze.files))if(hash(p)!==h)throw Error('IMPLEMENTATION_CHANGED '+p);
put(dir+'/RUNS.json',rows);
