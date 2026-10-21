import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditProviderSource,auditActiveProviders,auditCandidateCallGraph} from "file:///D:/boundx/research/7plus1-parser/v0.3-candidate-parsing-026/architecture-audit.mjs";
import {observeCandidateRuntime} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/v0.3-candidate-parsing-026/runtime-observer.mjs";
import {prepareCandidates,freezeCandidateGraph} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/v0.3-candidate-parsing-026/candidates.mjs";
import {sourceDocument} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/p0-semantic-repair-r02/source.mjs";
import {certifyCandidateGraph} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/v0.3-candidate-parsing-026/gamma.mjs";
import {quantityCandidates} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/v0.3-candidate-parsing-026/quantity-candidates.mjs";
import {createHash} from 'node:crypto';

test('pre-Γ call graph traverses shared functions and reexports',()=>{
 const result=auditCandidateCallGraph('research/7plus1-parser/v0.3-candidate-parsing-026');assert.equal(result.status,'PASS');assert.ok(result.reachable_functions.length>100);assert.equal(result.unbound_imported_calls.length,0);assert.ok(result.edges.some(e=>e.callee.includes('v0.3-7p-composition-014')));assert.ok(result.entry_points.length===3);
});

// This is a source-operator unit test, not a model invocation or full corpus
// evaluation. It checks boundary values and comparator polarity directly.
test('quantity operators retain inclusive/exclusive polarity in both languages',()=>{
 const cases=[['不超过','upper_bound',true],['不得超过','upper_bound',true],['不能超过','upper_bound',true],['至多','upper_bound',true],['最多','upper_bound',true],['不足','upper_bound',false],['低于','upper_bound',false],['超过','lower_bound',false],['至少','lower_bound',true],['不少于','lower_bound',true],['at most','upper_bound',true],['no more than','upper_bound',true],['less than','upper_bound',false],['more than','lower_bound',false],['at least','lower_bound',true]];
 for(const [marker,side,inclusive] of cases){const en=/[a-z]/iu.test(marker),text=en?'whole task '+marker+' 17 minutes':'整个任务'+marker+' 17 分钟',cl={id:'syntax-only',span:{start:0,end:[...text].length,quote:text}},spans=[{span_id:'clause-span',start:0,end:[...text].length,text}],task={node_id:'task',node_type:'TASK',source_span_ids:['clause-span'],metadata:{}},nodes=[task],relations=[],f={source:{raw_text:text,sha256:createHash('sha256').update(text).digest('hex')},analyses:[{cl,sid:'clause-span',events:[],parent_structure_id:'root'}],semantic_nodes:nodes,source_spans:spans,expressions:{quantity_expr_nodes:[]},candidate_plan_sets:[],proposals:{record(){}},tools:{task,node(cl,type,start,end,metadata){const n={node_id:'value-'+start,node_type:type,source_span_ids:['value-span'],metadata};nodes.push(n);spans.push({span_id:'value-span',start,end,text:[...text].slice(start,end).join('')});return n;},relation(cl,type,head,tail,evidence_span_ids){const r={relation_id:'limit',relation_type:type,head_node_id:head.node_id,tail_node_id:tail.node_id,evidence_span_ids};relations.push(r);return r;}}};
  quantityCandidates(f);assert.equal(f.expressions.quantity_expr_nodes.length,1,text);const q=f.expressions.quantity_expr_nodes[0];assert.equal(q[side]?.value,17,text);assert.equal(q[side]?.inclusive,inclusive,text);assert.equal(q[side==='upper_bound'?'lower_bound':'upper_bound'],undefined,text);assert.deepEqual(q.target_node_ids,['task']);
 }
});
test('AST audit detects final writes, computed-field writes and direct slot bypasses',()=>{
 for(const source of ["r.state='REJECTED';","n['state']='RESOLVED';","f.events=[];","f.unresolved=f.unresolved.filter(x=>x);","f.canonical_7plus1.I=[];","retire(a);","const n={state:'RESOLVED'};"]){assert.equal(auditProviderSource(source).status,'FAIL',source);}
 assert.equal(auditProviderSource("const n={state:'PROPOSED'}; if (r.state==='REJECTED') { evidence.push(r); }").status,'PASS');
 assert.equal(auditActiveProviders('research/7plus1-parser/v0.3-candidate-parsing-026').status,'PASS');
});
test('runtime observer measures transient certification and every removal form',()=>{
 for(const remove of [f=>f.semantic_nodes.pop(),f=>f.semantic_nodes.shift(),f=>f.semantic_nodes.splice(0,1),f=>{f.semantic_nodes.length=0;},f=>{f.semantic_nodes=[];}]){
  const node={node_id:'candidate-x',state:'PROPOSED',candidate_node_state:'PROPOSED'},f={semantic_nodes:[node],relations:[],unresolved:[],analyses:[{events:[node]}]};observeCandidateRuntime(f);node.state='RESOLVED';node.state='PROPOSED';remove(f);const audit=f.candidate_runtime_observer.finish();assert.equal(audit.counts.pre_gamma_final_node_resolution,1);assert.equal(audit.counts.pre_gamma_candidate_drop_without_provenance,1);
 }
});
test('Γ alone rejects bad hypotheses while Gc retains all rejected alternatives',()=>{
 const source='Inspect ledger.csv. Do not modify ledger.csv.',doc=sourceDocument(source),tokens=(text,start)=>({text,start,end:start+text.length,pos:text==='Inspect'||text==='modify'?'VERB':'NOUN',dep:text==='Inspect'||text==='modify'?'root':'obj',head:0,lemma:text.toLowerCase(),id:'tok:'+start}),signals={status:'AVAILABLE',models:[],literals:[{id:'literal:1',type:'FILE',span:{start:8,end:18,quote:'ledger.csv'}},{id:'literal:2',type:'FILE',span:{start:34,end:44,quote:'ledger.csv'}}],clauses:[{id:'clause:0',span:{start:0,end:18,quote:source.slice(0,18)},sentence_id:0,delimiter:'.',model:'TEST_SYNTAX',tokens:[tokens('Inspect',0),tokens('ledger.csv',8)],entities:[],srl:[]},{id:'clause:1',span:{start:20,end:44,quote:source.slice(20,44)},sentence_id:1,delimiter:'.',model:'TEST_SYNTAX',tokens:[tokens('Do',20),{...tokens('not',23),pos:'PART',dep:'neg',head:2},tokens('modify',27),tokens('ledger.csv',34)],entities:[],srl:[]}]};
 const f=prepareCandidates(doc,signals),g=freezeCandidateGraph(f),before=JSON.stringify(g),G=certifyCandidateGraph(g);assert.equal(JSON.stringify(g),before);assert.equal(JSON.stringify(G),JSON.stringify(certifyCandidateGraph(g)));assert.ok(G.rejected_relation_ids.length);assert.ok(G.decisions.every(d=>g.candidate_relations.some(r=>r.candidate_relation_id===d.candidate_relation_id)));assert.ok(Object.values(g.runtime_observation.counts).every(n=>n===0));assert.ok(g.span_lattice.edges.length);assert.ok(g.semantic_nodes.every(n=>['PROPOSED','COMPETING','INSUFFICIENT','CONTRADICTED'].includes(n.state)));
});
