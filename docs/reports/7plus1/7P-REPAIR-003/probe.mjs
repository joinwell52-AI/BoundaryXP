import fs from 'node:fs';import {compileNative}from '../../../../research/7plus1-parser/v0.3-7p-repair-003/engine.mjs';import {sourceDocument}from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
const dir='docs/reports/7plus1/7P-REPAIR-003/development';fs.mkdirSync(dir,{recursive:true});
for(const sample of ['REF-001',...Array.from({length:10},(_,i)=>'SWAI-'+String(i+1).padStart(3,'0')).filter(s=>s!=='SWAI-005')]){
const p='docs/reports/7plus1/7P-REPAIR-002/final-candidate/replay/'+sample+'/trace.json',old=JSON.parse(fs.readFileSync(p)),c=old.compiler_v03;
try{const r=compileNative(sourceDocument(c.source.raw_text),c.nlp_signals,{run_id:'development-cached-signals'});fs.writeFileSync(dir+'/'+sample+'.json',JSON.stringify(r));console.log(sample,r.contract_gate_results.status,r.compiler_v03.nlp_signals.semantic_decoding.graph_closure.object_bundles.length,r.contract_gate_results.failures??'');}catch(e){console.log(sample,e.stack);}}
