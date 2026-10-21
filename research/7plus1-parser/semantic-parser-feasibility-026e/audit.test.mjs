import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {OUT,read,sha} from './setup.mjs';
import {alignedSentence} from './c-review.mjs';
test('MRP space offsets map to original Unicode code points, preserving disjoint spans',()=>{
 const source='查😀验 文件',s={status:'GRAPH_SAVED',clause_id:'c0',request:{tokens:['查😀验','文件'],token_source_spans:[{start:0,end:3},{start:4,end:6}]},raw_graph:{input:'查😀验 文件',nodes:[{id:0,label:'查验-01',anchors:[{from:0,to:3}]},{id:1,label:'文件',anchors:[{from:4,to:6}]},{id:2,label:'and',anchors:[]}],edges:[{source:0,target:1,label:'arg1'}],tops:[0]}};
 const g=alignedSentence(s,source);assert.equal(g.nodes[0].fragments[0].text,'查😀验');assert.equal(g.nodes[0].fragments[0].end,3);assert.equal(g.nodes[1].fragments[0].start,4);assert.equal(g.nodes[2].alignment,'UNANCHORED_ABSTRACT');assert.deepEqual(g.nodes[2].fragments,[]);
 const cross=structuredClone(s);cross.request.token_source_spans=[{start:0,end:3},{start:5,end:7}];cross.raw_graph.nodes[0].anchors=[{from:0,to:6}];
 assert.equal(alignedSentence(cross,'查😀验  文件').nodes[0].fragments.length,2);
});
test('Normalization mismatch and dangling edges are rejected rather than guessed',()=>{
 const s={status:'GRAPH_SAVED',clause_id:'c0',request:{tokens:['查'],token_source_spans:[{start:0,end:1}]},raw_graph:{input:'检查',nodes:[{id:0,label:'查',anchors:[{from:0,to:1}]}],edges:[],tops:[0]}};
 assert.throws(()=>alignedSentence(s,'查'),/RAW_GRAPH_INPUT/);s.raw_graph.input='查';s.raw_graph.edges=[{source:0,target:8,label:'arg1'}];assert.throws(()=>alignedSentence(s,'查'),/DANGLING/);
});
test('All 60 frozen sources and all 120 first automatic outputs remain present',()=>{
 const selection=read(`${OUT}/CORPUS-SELECTION.json`);assert.equal(selection.cases.length,60);assert.equal(new Set(selection.cases.map(r=>r.id)).size,60);assert.equal(selection.oracle_ids.length,10);
 for(const r of selection.cases){assert.equal(sha(fs.readFileSync(`${OUT}/sources/${r.id}.md`)),r.source_sha256);for(const a of ['A','B']){const t=read(`${OUT}/arm-${a}/${r.id}/trace.json`),receipt=read(`${OUT}/ARM-${a}-${a==='A'?'SEGMENTED':'FULL-SENTENCE'}.json`).rows.find(x=>x.id===r.id);assert.equal(t.contract_gate_results.status,receipt.contract);assert.ok(['PASS','FAIL'].includes(receipt.contract));assert.equal(t.candidate_graph_gate_results.status,'PASS');for(const k of ['pre_gamma_destructive_retire','pre_gamma_final_relation_reject','pre_gamma_final_relation_resolve','pre_gamma_unresolved_delete'])assert.equal(t.candidate_graph_gate_results.counts[k],0);}}
});
test('Oracle diagnostic keeps G8 FAIL rather than fabricating an automatic-generator receipt',()=>{
 const o=read(`${OUT}/ORACLE-DOWNSTREAM-10.json`);assert.equal(o.correct,7);assert.equal(o.rows.length,10);for(const r of o.rows){const t=read(r.trace);assert.equal(t.candidate_graph_gate_results.gates.G8.status,'FAIL');assert.equal(t.contract_gate_results.status,'PASS');assert.equal(t.compiler_v03.gamma_certification.consumed_graph_id,t.compiler_v03.candidate_semantic_graph.graph_id);}
});
test('C really ran locally with preserved raw graphs and explicit English limitations',()=>{
 const c=read(`${OUT}/ARM-C-SEMANTIC-GRAPH.json`);assert.equal(c.status,'RUN');assert.equal(c.rows.length,60);assert.equal(c.model_receipt.loaded,true);assert.equal(c.model_receipt.parameters,153644745);assert.equal(c.rows.reduce((n,r)=>n+r.errors,0),0);assert.equal(c.rows.filter(r=>r.graphs>0).length,58);for(const r of c.rows){const x=read(r.raw);assert.equal(x.source_sha256,read(`${OUT}/CORPUS-SELECTION.json`).cases.find(y=>y.id===r.id).source_sha256);for(const s of x.sentences)if(s.status==='GRAPH_SAVED')assert.ok(s.raw_graph.edges.length||s.raw_graph.nodes.length);}
});
