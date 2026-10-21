import fs from 'node:fs';import assert from 'node:assert/strict';
import {OUT,read,write,sha} from './audit-tools.mjs';
import {parse7Plus1} from '../../../../research/7plus1-parser/v0.3-admin-root-024/engine.mjs';
import {closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
import {createServer} from '../../../../research/7plus1-parser/v0.3-admin-root-024/server.mjs';
const rows=[],signature=r=>({canonical:r.compiler_v03.canonical_7plus1,ir:r.compiler_v03.boundary_ir,relations:r.compiler_v03.relations,gamma:r.compiler_v03.gamma_certification.decisions.map(d=>({candidate:d.candidate_relation_id,decision:d.decision})),proof:r.compiler_v03.candidate_proof});
try{
 for(const id of ['ROOT-001','ROOT-018','ROOT-038','ROOT-045','ROOT-046','ROOT-049']){const previous=read(OUT+'/root-model/r04/'+id+'/trace.json'),r=await parse7Plus1(previous.compiler_v03.source.raw_text);write('repeat/r01/'+id+'.json',r);const expected=sha(JSON.stringify(signature(previous))),actual=sha(JSON.stringify(signature(r)));rows.push({case_id:id,status:expected===actual?'PASS':'FAIL',expected,actual,actual_model_calls:r.compiler_v03.nlp_signals.semantic_model_signals.models.map(m=>m.resource)});}
 write('REPEATABILITY.json',{status:rows.every(r=>r.status==='PASS')?'PASS':'FAIL',rows,excluded_fields:['run_id','created_at','performance','floating_score_diagnostics'],semantic_graph_and_proof_compared:true});
 let calls=0;const server=createServer({storeRoot:OUT+'/channel/history',parse:async text=>{calls++;return parse7Plus1(text);}});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(58618,'127.0.0.1',resolve);});
 try{const source='请 LEAD 组织检查隔离舱温度并形成 quartz.md。QA 必须复核报告，不得修改传感器参数。';
  const request=await fetch('http://127.0.0.1:58618/api/parse',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:source})});assert.equal(request.status,200);const parsed=await request.json();write('channel/parse.json',parsed);
  const snapshots={};for(const ext of ['json','md','html']){const response=await fetch('http://127.0.0.1:58618/api/runs/'+parsed.run_id+'/trace.'+ext);assert.equal(response.status,200);const text=await response.text();write('channel/trace.'+ext,text);snapshots[ext]=sha(text);if(ext==='json')assert.deepEqual(JSON.parse(text),parsed.result);else for(const section of ['candidate_semantic_graph','gamma_certification','boundary_ir','canonical_7plus1','candidate_proof'])assert.ok(text.includes(section));}
  write('CHANNEL-58618.json',{status:'PASS',port:58618,temporary_isolated_adapter:true,production_entry_changed:false,actual_parse_calls:calls,exports_triggered_reparse:calls!==1,run_id:parsed.run_id,snapshots,source_sha256:sha(source),contract:parsed.result.contract_gate_results.status,gates:parsed.result.candidate_graph_gate_results.status,actually_called:parsed.result.compiler_v03.nlp_signals.semantic_model_signals.models.map(m=>m.resource)});
 }finally{await new Promise(resolve=>server.close(resolve));}
}finally{await closeNlp();}
console.log(JSON.stringify({repeat:rows.map(r=>r.status),channel:'CLOSED_AFTER_CHECK'}));
