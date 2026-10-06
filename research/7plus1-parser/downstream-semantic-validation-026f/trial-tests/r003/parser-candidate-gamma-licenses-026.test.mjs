import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceDocument} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/p0-semantic-repair-r02/source.mjs";
import {prepareCandidates,freezeCandidateGraph} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/v0.3-candidate-parsing-026/candidates.mjs";
import {certifyCandidateGraph} from "file:///D:/boundx/research/7plus1-parser/downstream-semantic-validation-026f/trial/research/7plus1-parser/v0.3-candidate-parsing-026/gamma.mjs";

// Predeclared non-corpus syntax contrasts. Synthetic tokens isolate Γ's
// licenses from model quality; they do not claim an actual NLP/model run.
function fixture(words,properties,literalWords=[]){
 const text=words.join(' '),tokens=[];let cursor=0;
 for(let i=0;i<words.length;i++){const word=words[i],start=cursor;cursor+=[...word].length;tokens.push({id:'clause:0:token:'+i,text:word,lemma:word.toLowerCase(),start,end:cursor,...properties[i]});cursor++;}
 const clause={id:'clause:0',sentence_id:0,span:{start:0,end:[...text].length,quote:text},delimiter:'.',model:'PREDECLARED_SYNTAX_CONTRAST',tokens,entities:[],srl:[]};
 const signals={status:'AVAILABLE',models:[],clauses:[clause],literals:tokens.filter(t=>literalWords.includes(t.text)).map((t,i)=>({id:'literal:'+i,type:'FILE',span:{start:t.start,end:t.end,quote:t.text}}))};
 const graph=freezeCandidateGraph(prepareCandidates(sourceDocument(text),signals)),before=JSON.stringify(graph),decision=certifyCandidateGraph(graph);
 assert.equal(JSON.stringify(graph),before,'Γ must not mutate Gc');assert.ok(Object.values(graph.runtime_observation.counts).every(x=>x===0));
 return {graph,decision};
}
test('source-local permission licenses a mistagged nominal predicate, with provenance',()=>{
 for(const marker of ['才允许','可以']){
  const {graph,decision}=fixture([marker,'检查','ledger.csv'],[{pos:'VV',dep:'root',head:0},{pos:'NN',dep:'compound:nn',head:2},{pos:'NN',dep:'dobj',head:0}],['ledger.csv']);
  const predicates=graph.semantic_nodes.filter(n=>n.node_type==='EVENT'&&n.surface==='检查'&&n.metadata.source_predicate_license?.rule==='EXPLICIT_IMPERATIVE_CLAUSE_HEAD_WITH_TYPED_ARGUMENT');
  assert.ok(predicates.length,'source position must yield a candidate');
  assert.ok(predicates.some(n=>decision.node_decisions.some(d=>d.node_id===n.node_id&&d.decision==='CERTIFIED'&&d.metadata_overrides.predicate_position_contract)),marker);
 }
});
test('a nominal modifier inside the affected object is not promoted by an outer prohibition',()=>{
 const {graph,decision}=fixture(['禁止','修改','被','检查','服务'],[{pos:'VV',dep:'root',head:0},{pos:'VV',dep:'ccomp',head:0},{pos:'AD',dep:'mark',head:3},{pos:'VV',dep:'acl',head:4},{pos:'NN',dep:'dobj',head:1}]);
 const candidates=graph.semantic_nodes.filter(n=>n.node_type==='EVENT'&&n.surface==='检查');assert.ok(candidates.length);
 assert.ok(candidates.every(n=>decision.node_decisions.find(d=>d.node_id===n.node_id).decision!=='CERTIFIED'));
});
test('Only after keeps its condition scope; legacy restrict cannot license an argument role',()=>{
 const {graph,decision}=fixture(['Only','after','Morgan','approves','request','may','inspect','ledger.csv','begin'],[{pos:'ADV',dep:'advmod',head:3},{pos:'SCONJ',dep:'mark',head:3},{pos:'PROPN',dep:'nsubj',head:3},{pos:'VERB',dep:'advcl',head:6},{pos:'NOUN',dep:'obj',head:3},{pos:'AUX',dep:'aux',head:6},{pos:'VERB',dep:'root',head:6},{pos:'NOUN',dep:'obj',head:6},{pos:'VERB',dep:'conj',head:6}],['ledger.csv']);
 const restrictions=graph.candidate_relations.filter(r=>r.relation_type==='RESTRICTS');assert.ok(restrictions.length,'retain even the invalid proposed role');
 assert.ok(restrictions.every(r=>decision.decisions.find(d=>d.candidate_relation_id===r.candidate_relation_id).decision==='REJECTED'));
 assert.ok(graph.semantic_nodes.filter(n=>n.node_type==='EVENT'&&n.surface==='inspect').every(n=>decision.node_decisions.find(d=>d.node_id===n.node_id).metadata_overrides.restrict===false));
});
test('predicate-local and object-local only restrictions retain source-backed PATIENT plus RESTRICTS',()=>{
 for(const postposed of [false,true]){
  const words=postposed?['Read','only','ledger.csv']:['Only','read','ledger.csv'];
  const properties=postposed?[{pos:'VERB',dep:'root',head:0},{pos:'ADV',dep:'advmod',head:0},{pos:'NOUN',dep:'obj',head:0}]:[{pos:'ADV',dep:'advmod',head:1},{pos:'VERB',dep:'root',head:1},{pos:'NOUN',dep:'obj',head:1}];
  const {graph,decision}=fixture(words,properties,['ledger.csv']);
  const accepted=decision.decisions.filter(d=>d.decision==='CERTIFIED').map(d=>graph.candidate_relations.find(r=>r.candidate_relation_id===d.candidate_relation_id));
  assert.ok(accepted.some(r=>r.relation_type==='RESTRICTS'&&r.generic_evidence.some(e=>e.rule==='EXPLICIT_ARGUMENT_ONLY_RESTRICTION')),words.join(' '));
  assert.ok(accepted.some(r=>r.relation_type==='PATIENT'),words.join(' '));
 }
});
test('subject-only restriction cannot spread to the patient',()=>{
 const {graph,decision}=fixture(['Only','Morgan','may','inspect','ledger.csv'],[{pos:'ADV',dep:'advmod',head:1},{pos:'PROPN',dep:'nsubj',head:3},{pos:'AUX',dep:'aux',head:3},{pos:'VERB',dep:'root',head:3},{pos:'NOUN',dep:'obj',head:3}],['ledger.csv']);
 assert.ok(!decision.decisions.some(d=>d.decision==='CERTIFIED'&&graph.candidate_relations.find(r=>r.candidate_relation_id===d.candidate_relation_id).relation_type==='RESTRICTS'));
});
