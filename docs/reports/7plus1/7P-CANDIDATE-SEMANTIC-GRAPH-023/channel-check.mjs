import assert from 'node:assert/strict';import fs from 'node:fs';
import {createServer} from '../../../../research/7plus1-parser/v0.3-candidate-semantic-023/server.mjs';
import {parse7Plus1} from '../../../../research/7plus1-parser/v0.3-candidate-semantic-023/engine.mjs';
import {SECTIONS} from '../../../../research/7plus1-parser/v0.3-candidate-semantic-023/trace.mjs';
import {closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
import {OUT,write,sha} from './audit-tools.mjs';
const suffix=process.argv[2]?'-'+process.argv[2]:'';
let calls=0;const parse=async input=>{calls++;return parse7Plus1(input);},server=createServer({storeRoot:OUT+'/channel-history'+suffix,parse});
try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(58618,'127.0.0.1',resolve);});
 const response=await fetch('http://127.0.0.1:58618/api/parse',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:'由 QA 检查 routes.csv。'})}),run=await response.json();assert.equal(response.status,200);
 const a=await fetch('http://127.0.0.1:58618/api/runs/'+run.run_id+'/trace.json').then(r=>r.json());assert.deepEqual(a,run.result);
 const b=await fetch('http://127.0.0.1:58618/api/runs/'+run.run_id+'/trace.json').then(r=>r.json());assert.deepEqual(b,a);
 const md=await fetch('http://127.0.0.1:58618/api/runs/'+run.run_id+'/trace.md').then(r=>r.text()),html=await fetch('http://127.0.0.1:58618/api/runs/'+run.run_id+'/trace.html').then(r=>r.text());
 assert.ok(SECTIONS.every(k=>md.includes('## '+k)&&html.includes('<summary>'+k+'</summary>')));assert.equal(calls,1);
 write('channel'+suffix+'/trace.md',md);write('channel'+suffix+'/trace.html',html);write('CHANNEL-58618'+suffix+'.json',{status:'PASS',port:58618,parser_invocations:calls,exports_do_not_rerun:true,history_snapshot_identical:true,trace_sections:SECTIONS,run_id:run.run_id,trace_sha256:sha(JSON.stringify(a)),production_entry_changed:false,server_lifecycle:'Temporary isolated candidate inspection server; closed after verification. package scripts unchanged.'});
}catch(e){write('CHANNEL-58618'+suffix+'.json',{status:'FAIL',error:e.message,parser_invocations:calls,production_entry_changed:false});process.exitCode=1;}
finally{await new Promise(resolve=>server.close(resolve));await closeNlp();}
