import fs from'node:fs';import{performance}from'node:perf_hooks';import{createHash}from'node:crypto';
import{compileNative}from'../../../../../research/7plus1-parser/v0.3-7p-closure-008/engine.mjs';
import{sourceDocument}from'../../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
const cluster=process.argv[2];if(!/^[A-Z0-9-]+$/u.test(cluster??''))throw Error('CLUSTER_REQUIRED');
const custom=process.argv[3],base=custom??'docs/reports/7plus1/7P-REPAIR-007/replay',dir='docs/reports/7plus1/7P-CLOSURE-008/phase-b/'+cluster;fs.mkdirSync(dir,{recursive:true});
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),rows=[];
for(const sample of ['REF-001','SWAI-001','SWAI-002','SWAI-003','SWAI-004','SWAI-006','SWAI-007','SWAI-008','SWAI-009','SWAI-010']){
 const source=sample==='REF-001'?'fixtures/7plus1/golden/REF-001/source.txt':'fixtures/7plus1/standard/'+sample+'/source.md',signalPath=base+'/'+sample+(custom?'.json':'/trace.json'),old=read(signalPath),start=performance.now();let result,error;
 try{const doc=sourceDocument(fs.readFileSync(source,'utf8'));if(doc.source.sha256!==old.compiler_v03.source.sha256)throw Error('SOURCE_CHANGED');result=compileNative(doc,structuredClone(old.compiler_v03.nlp_signals));fs.writeFileSync(dir+'/'+sample+'.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});}catch(e){error=String(e);fs.writeFileSync(dir+'/'+sample+'-ERROR.json',JSON.stringify({sample,error,source_sha256:sha(source)},null,2)+'\n',{flag:'wx'});}
 const c=result?.compiler_v03;rows.push({sample,source_sha256:sha(source),saved_signal_trace:signalPath,independent_models_rerun:false,status:error?'ERROR':result.contract_gate_results.status,error,trace_path:dir+'/'+sample+'.json',elapsed_ms:performance.now()-start,declared_behavior:c?.nlp_signals.semantic_decoding.declared_behavior,counts:c?Object.fromEntries(['I','O','A','P','R','V','C','B'].map(k=>[k,{status:c.canonical_7plus1[k].status,resolved:c.canonical_7plus1[k].entries.filter(e=>e.state==='RESOLVED').length}])):null});console.log(sample+' '+rows.at(-1).status);
}
fs.writeFileSync(dir+'/RUNS.json',JSON.stringify({cluster,method:'Current candidate executes every compiler stage using sealed 007 model signals; not independent model execution.',rows},null,2)+'\n',{flag:'wx'});if(rows.some(r=>r.status!=='PASS'))process.exitCode=1;
