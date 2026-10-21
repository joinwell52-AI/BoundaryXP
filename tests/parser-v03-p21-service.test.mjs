import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {prepareSource} from '../research/7plus1-parser/llm-first-028/source.mjs';
import {technicalValidate} from '../research/7plus1-parser/llm-first-028/validate.mjs';
import {compileBoundary} from '../research/7plus1-parser/llm-first-028/compile.mjs';
import {contractVersion} from '../research/7plus1-parser/llm-first-028/contracts/schema.mjs';
import {once} from 'node:events';
import {HistoryStore} from '../research/7plus1-parser/v0.3-p2.1-generalization/history.mjs';
import {createServer} from '../research/7plus1-parser/v0.3-p2.1-generalization/server.mjs';
import {compileNative} from '../research/7plus1-parser/v0.3-p2.1-generalization/engine.mjs';
import {traceMarkdown,traceHTML} from '../research/7plus1-parser/v0.3-p2.1-generalization/export.mjs';
const base=new URL('../research/7plus1-parser/v0.3-p2-semantic-coverage/',import.meta.url);
const real=JSON.parse(fs.readFileSync(new URL('UNSEEN-NLP.json',base))),doc=real.doc;
test('Current wrapper contract: authenticated short compilation, retained history and exports',async()=>{
 const parent=path.resolve('.boundx'),tmp=fs.mkdtempSync(path.join(parent,'p21-contract-test-'));let calls=0;
 const server=createServer({dataRoot:path.join(tmp,'data'),legacyRoot:path.join(tmp,'legacy'),parse:async(input,options)=>{
  calls++;const source=prepareSource(input),g={contract_version:contractVersion,entities:[],events:[],claims:[],expressions:[],issues:[],coverage:[]},audit={contract_version:contractVersion,reviews:[],issues:[],omissions:[]},technical=technicalValidate(source,g,audit);
  const trace={source,proposal:g,audit,technical,...compileBoundary(source,g,audit,technical),execution_mode:'TRANSPORT_TEST_PROVIDER',model_calls:{}};
  fs.writeFileSync(path.join(options.output,'trace.json'),JSON.stringify(trace));fs.writeFileSync(path.join(options.output,'run-summary.json'),JSON.stringify({real_calls:0}));return trace;
 }});
 try{server.listen(0,'127.0.0.1');await once(server,'listening');const url='http://127.0.0.1:'+server.address().port;
  const body=JSON.stringify({text:'测试短任务',request_id:randomUUID()});
  assert.equal((await fetch(url+'/api/parse',{method:'POST',headers:{'content-type':'application/json'},body})).status,403);assert.equal(calls,0);
  const response=await fetch(url+'/api/session'),session=await response.json(),cookie=response.headers.get('set-cookie').split(';')[0],headers={'content-type':'application/json','x-boundx-session':session.token,cookie,origin:url};
  assert.equal(response.status,200);assert.equal(session.business_execution_enabled,false);assert.ok(!JSON.stringify(session).includes(doc.source.raw_text));
  assert.equal((await fetch(url+'/api/parse',{method:'POST',headers:{...headers,origin:'https://foreign.invalid'},body})).status,403);
  // Original 340-codepoint NLP source is retained; the current short product rejects it, never truncates.
  const overlong=await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify({text:doc.source.raw_text,request_id:randomUUID()})});assert.equal(overlong.status,400);assert.equal((await overlong.json()).error,'SHORT_TEXT_SCOPE_EXCEEDED');assert.equal(calls,0);
  const submit=()=>fetch(url+'/api/parse',{method:'POST',headers,body}),submitted=await submit();assert.equal(submitted.status,202);const first=await submitted.json(),duplicate=await(await submit()).json();assert.equal(first.run_id,duplicate.run_id);
  let run;for(let i=0;i<100;i++){run=await(await fetch(url+'/api/runs/'+first.run_id)).json();if(run.result)break;await new Promise(r=>setTimeout(r,10));}assert.ok(run.result);assert.equal(calls,1);
  const file=path.join(tmp,'data/runs',run.run_id,'trace.json'),before=fs.readFileSync(file);
  for(const ext of ['json','md','html']){const exported=await fetch(url+'/api/runs/'+run.run_id+'/trace.'+ext);assert.equal(exported.status,200);assert.ok((await exported.text()).includes('TRANSPORT_TEST_PROVIDER'));}
  assert.deepEqual((await(await fetch(url+'/api/runs/'+run.run_id)).json()).result.canonical,run.result.canonical);assert.equal(calls,1);assert.deepEqual(fs.readFileSync(file),before);
  assert.ok((await(await fetch(url+'/api/runs')).json()).some(x=>x.run_id===run.run_id));
  assert.equal((await fetch(url+'/api/runs',{method:'DELETE',headers,body:JSON.stringify({confirmation:'DELETE_ALL_HISTORY'})})).status,409);assert.ok(fs.existsSync(file));
  const js=await(await fetch(url+'/app.js')).text();assert.ok(js.includes('render('));assert.ok(!js.includes('legacy_frames'));
 }finally{await new Promise(resolve=>server.close(resolve));server.closeAllConnections();if(tmp.startsWith(parent+path.sep))fs.rmSync(tmp,{recursive:true,force:true});}
});
test('Recorded native evidence retains its own legacy exports without entering current runtime',()=>{
 const r=compileNative(doc,real.signals,{run_id:'legacy-read-only'});assert.match(traceMarkdown(r),/eligibility/iu);assert.match(traceHTML(r),/eligibility/iu);
});
test('P21 history tampering rejects; stored snapshot does not mutate on export',()=>{
 const parent=path.resolve('.boundx'),tmp=fs.mkdtempSync(path.join(parent,'p21-history-test-'));try{const store=new HistoryStore(tmp),r=compileNative(doc,real.signals,{run_id:'tamper-test'});store.save(r);const file=store.file('tamper-test'),data=JSON.parse(fs.readFileSync(file));data.payload.source_text='tampered';fs.writeFileSync(file,JSON.stringify(data));assert.throws(()=>store.get('tamper-test'),/HISTORY_INTEGRITY/);}finally{if(tmp.startsWith(parent+path.sep))fs.rmSync(tmp,{recursive:true,force:true});}
});


