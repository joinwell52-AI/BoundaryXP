import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceDocument} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/p0-semantic-repair-r02/source.mjs";
import {prepareCandidates,freezeCandidateGraph} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/v0.3-candidate-parsing-026/candidates.mjs";
import {certifyCandidateGraph} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/v0.3-candidate-parsing-026/gamma.mjs";
import {compileNative} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/v0.3-candidate-parsing-026/downstream-core.mjs";

// Non-Gold syntax fixtures, frozen before the r050 corpus replay. These test
// source ownership, not real NLP model accuracy. No benchmark IDs or answers.
function fixture(groups){
 let text='',offset=0;const clauses=[],literals=[];
 for(const [index,items]of groups.entries()){
  const start=offset,tokens=[];
  for(const [i,[word,pos,dep,head]]of items.entries()){
   if(i){text+=' ';offset++;}
   const from=offset;text+=word;offset+=[...word].length;
   const token={id:'clause:'+index+':token:'+i,text:word,lemma:word.toLowerCase(),pos,dep,head,start:from,end:offset};tokens.push(token);
   if(/\.(?:csv|json|md)$/u.test(word))literals.push({id:'literal:'+literals.length,type:'FILE',span:{start:from,end:offset,quote:word}});
  }
  clauses.push({id:'clause:'+index,sentence_id:0,span:{start,end:offset,quote:[...text].slice(start,offset).join('')},delimiter:index===groups.length-1?'。':'，',model:'NON_GOLD_SYNTHETIC_OWNERSHIP_CONTRAST',tokens,entities:[],srl:[]});
  text+=index===groups.length-1?'。':'，';offset++;
 }
 const signals={status:'AVAILABLE',models:[],clauses,literals};
 const graph=freezeCandidateGraph(prepareCandidates(sourceDocument(text),signals));
 const original=JSON.stringify(graph),gamma=certifyCandidateGraph(graph);
 assert.equal(JSON.stringify(graph),original,'Γ must not rewrite Gc');
 assert.ok(Object.values(graph.runtime_observation.counts).every(n=>n===0));
 const nodeMap=new Map(graph.semantic_nodes.map(n=>[n.node_id,n]));
 const decisions=gamma.decisions.map(d=>({d,r:graph.candidate_relations.find(r=>r.candidate_relation_id===d.candidate_relation_id)}));
 return {graph,gamma,nodeMap,decisions,compile:()=>compileNative(sourceDocument(text),signals)};
}
const directive=[['请','VV','root',0],['PM','NR','nsubj',2],['组织','VV','ccomp',0],['读取','VV','ccomp',2],['ledger.csv','NN','dobj',3]];

test('context retains a real local action and its local object with exact governor provenance',()=>{
 const x=fixture([directive,[['QA','NR','nsubj',1],['核查','VV','root',1],['settings.json','NN','dobj',1]]]);
 const candidates=x.graph.semantic_nodes.filter(n=>n.metadata.context_modal_candidate&&n.surface==='核查');assert.ok(candidates.length);
 const accepted=candidates.filter(n=>x.gamma.node_decisions.find(d=>d.node_id===n.node_id).decision==='CERTIFIED');assert.ok(accepted.length);
 assert.ok(accepted.every(n=>n.metadata.context_modal_candidate.source_span_ids.length>=2));
 assert.ok(x.decisions.some(({d,r})=>d.decision==='CERTIFIED'&&accepted.some(n=>n.node_id===r.head_node_id)&&x.nodeMap.get(r.tail_node_id).surface==='settings.json'));
 assert.ok(!x.decisions.some(({d,r})=>d.decision==='CERTIFIED'&&accepted.some(n=>n.node_id===r.head_node_id)&&['PATIENT','THEME'].includes(r.relation_type)&&x.nodeMap.get(r.tail_node_id).surface==='ledger.csv'));
});

test('transported shared argument cannot override the predicate explicit local result',()=>{
 for(const input of ['telemetry.csv','permissions.json']){
  const x=fixture([directive,[['核查','VV','root',0],[input,'NN','dobj',0],['并','CC','cc',0],['形成','VV','conj',0],['findings.md','NN','dobj',3]]]);
  const shared=x.decisions.filter(({r})=>x.nodeMap.get(r.head_node_id)?.surface==='形成'&&x.nodeMap.get(r.tail_node_id)?.surface===input&&['PATIENT','THEME'].includes(r.relation_type));
  assert.ok(shared.length,'invalid alternative must persist in Gc');
  assert.ok(shared.every(({d})=>d.decision!=='CERTIFIED'));
  assert.ok(x.decisions.some(({d,r})=>d.decision==='CERTIFIED'&&r.relation_type==='RESULT'&&x.nodeMap.get(r.head_node_id).surface==='形成'&&x.nodeMap.get(r.tail_node_id).surface==='findings.md'));
 }
});

test('a final coordinated object cannot displace the first predicate source-owned nominal domain',()=>{
 const x=fixture([directive,[['核查','VV','root',0],['设备','NN','compound:nn',2],['状态','VV','ccomp',0],['并','CC','cc',0],['形成','VV','conj',0],['findings.md','NN','dobj',4]]]);
 const borrowed=x.decisions.filter(({r})=>x.nodeMap.get(r.head_node_id)?.surface==='核查'&&x.nodeMap.get(r.tail_node_id)?.surface==='findings.md'&&r.relation_type==='PATIENT');
 assert.ok(borrowed.length,'final-object sharing remains an open hypothesis');
 assert.ok(borrowed.every(({d})=>d.decision==='REJECTED'));
 assert.ok(x.decisions.some(({d,r})=>d.decision==='CERTIFIED'&&r.relation_type==='PATIENT'&&x.nodeMap.get(r.head_node_id).surface==='核查'&&x.nodeMap.get(r.tail_node_id).surface==='设备 状态'));
});

test('shared final material remains allowed when the earlier conjunct has no local argument',()=>{
 for(const marker of ['并','且']){
  const x=fixture([directive,[['核查','VV','root',0],[marker,'CC','cc',0],['审阅','VV','conj',0],['telemetry.csv','NN','dobj',2]]]);
  assert.ok(x.decisions.some(({d,r})=>d.decision==='CERTIFIED'&&r.relation_type==='PATIENT'&&x.nodeMap.get(r.head_node_id).surface==='核查'&&x.nodeMap.get(r.tail_node_id).surface==='telemetry.csv'),marker);
 }
});

test('task modality alone does not certify an unknown support predicate',()=>{
 const x=fixture([directive,[['QA','NR','nsubj',1],['做','VV','root',1],['独立','AD','advmod',3],['复核','NN','dobj',1]]]);
 const proposals=x.graph.semantic_nodes.filter(n=>n.surface==='做'&&n.metadata.context_modal_candidate);assert.ok(proposals.length);
 assert.ok(proposals.every(n=>x.gamma.node_decisions.find(d=>d.node_id===n.node_id).decision==='REJECTED'));
 assert.ok(proposals.every(n=>x.graph.semantic_nodes.some(original=>original.node_id!==n.node_id&&original.surface===n.surface&&original.metadata.modality==='UNSTATED')),'source uncertainty stays available');
});

test('without an explicit task governor, a named-subject clause does not gain context modality',()=>{
 const x=fixture([[['QA','NR','nsubj',1],['核查','VV','root',1],['settings.json','NN','dobj',1]]]);
 assert.ok(!x.graph.semantic_nodes.some(n=>n.metadata.context_modal_candidate));
});

function reachable(dag,kind,id){
 const root=dag.nodes.find(n=>n.kind===kind&&(n.object_id===id||n.boundary_fact_id===id)),adj=new Map();assert.ok(root);
 for(const e of dag.edges){if(!adj.has(e.from_id))adj.set(e.from_id,[]);adj.get(e.from_id).push(e.to_id);}
 const seen=new Set([root.id]),queue=[root.id];for(let i=0;i<queue.length;i++)for(const child of adj.get(queue[i])??[])if(!seen.has(child)){seen.add(child);queue.push(child);}
 return dag.nodes.filter(n=>seen.has(n.id));
}

test('facts for roles added after context proposal retain local, propagation and owner proof',()=>{
 const x=fixture([directive,[['QA','NR','nsubj',1],['审阅','VV','root',1],['findings.md','NN','dobj',1],['后','LC','mark',1],['PM','NR','nsubj',5],['汇报','VV','conj',1],['report.md','NN','dobj',5]]]);
 const run=x.compile(),c=run.compiler_v03,g=c.candidate_semantic_graph;
 assert.equal(run.contract_gate_results.status,'PASS');assert.equal(run.candidate_graph_gate_results.status,'PASS');
 const context=g.semantic_nodes.filter(n=>n.metadata.context_modal_candidate&&c.gamma_certification.node_decisions.find(d=>d.node_id===n.node_id)?.decision==='CERTIFIED'),nm=new Map(g.semantic_nodes.map(n=>[n.node_id,n]));
 const facts=c.boundary_ir.facts.filter(f=>f.state==='RESOLVED'&&f.node_ids.some(i=>context.some(n=>n.node_id===i)));
 assert.ok(facts.length);assert.ok(facts.some(f=>f.fact_type==='PARTICIPANT'),'participant facts must be exercised');
 for(const f of facts)for(const n of context.filter(n=>f.node_ids.includes(n.node_id))){
  const ctx=n.metadata.context_modal_candidate,owner=nm.get(ctx.governor_node_id),prop=g.candidate_relations.find(r=>r.relation_type==='CONJUNCTION'&&r.head_node_id===owner.node_id&&r.tail_node_id===n.node_id&&r.generic_evidence.some(e=>e.rule==='EXPLICIT_DIRECTIVE_CONTAINER_INHERITANCE'));
  assert.ok(f.relation_ids.includes(prop.relation_id));
  const nodes=reachable(c.candidate_proof,'BOUNDARY_FACT',f.boundary_fact_id);
  assert.ok(nodes.some(p=>p.kind==='CANDIDATE_RELATION'&&p.object_id===prop.candidate_relation_id));
  assert.ok(nodes.some(p=>p.kind==='SOURCE_SPAN'&&p.object_id===owner.source_span_ids[0]));
  assert.ok(nodes.some(p=>p.kind==='SOURCE_SPAN'&&p.object_id===n.source_span_ids[0]));
  const native=reachable(c.proof_dag,'BOUNDARY_FACT',f.boundary_fact_id);
  assert.ok(native.some(p=>p.kind==='SOURCE_SPAN'&&p.source_span_id===owner.source_span_ids[0]));
 }
});

test('a nominal predicate-position proposal is verified locally rather than licensed by inherited modality',()=>{
 for(const count of ['4','7']){
  const x=fixture([directive,[['至少','AD','advmod',3],[count,'CD','dep',3],['个','M','mark:clf',1],['完成','VV','root',3],['复核','NN','dobj',3],['且','CC','cc',3],['overview.md','NN','dep',3],['已','AD','advmod',8],['生成','VV','advcl:loc',11],['时','LC','case',8],['任务','NN','nsubj',11],['完成','VV','dep',3]]]);
  const candidates=x.graph.semantic_nodes.filter(n=>n.surface==='复核'&&n.metadata.context_modal_candidate);assert.ok(candidates.length);
  assert.ok(candidates.every(n=>x.gamma.node_decisions.find(d=>d.node_id===n.node_id).decision==='REJECTED'));
  assert.ok(candidates.every(n=>x.gamma.node_decisions.find(d=>d.node_id===n.node_id).reason==='CONTEXT_MODALITY_CANNOT_ESTABLISH_NOMINAL_PREDICATE_POSITION'));
 }
});

test('a real locally governed action nominal retains its source-owned argument',()=>{
 const x=fixture([directive,[['QA','NR','nsubj',3],['对','P','case',2],['settings.json','NN','nmod:prep',3],['进行','VV','root',3],['核查','NN','dobj',3]]]);
 const candidates=x.graph.semantic_nodes.filter(n=>n.surface==='核查'&&n.metadata.context_modal_candidate);assert.ok(candidates.length);
 assert.ok(candidates.some(n=>x.gamma.node_decisions.find(d=>d.node_id===n.node_id).decision==='CERTIFIED'));
});
