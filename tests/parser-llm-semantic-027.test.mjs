import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceDocument} from '../research/7plus1-parser/v0.4-llm-semantic-027/source.mjs';
import {linkQuote} from '../research/7plus1-parser/v0.4-llm-semantic-027/source-linker.mjs';
import {compileProposal} from '../research/7plus1-parser/v0.4-llm-semantic-027/engine.mjs';
import {replay} from '../research/7plus1-parser/v0.4-llm-semantic-027/replay.mjs';
import {certify} from '../research/7plus1-parser/v0.4-llm-semantic-027/gamma-v04.mjs';
import Ajv from 'ajv';
import {proposalSchema,auditSchema} from '../research/7plus1-parser/v0.4-llm-semantic-027/contracts.mjs';
const quote='档案员应检查 records.csv，形成 audit.md，不必审批，不得删除 records.csv；条件成立时停止检查。';
const ref=(q=quote)=>({quote:q,clause_id:'c1',occurrence:0,context_anchor:null});
const node=(id,type,q,extra={})=>({id,type,sources:[ref(q)],semantic_identity:q,entity_kind:'NONE',layer:'MAIN',owner:'TASK',modality:'UNSTATED',polarity:'AFFIRMATIVE',artifact_use:'NONE',predicate_class:'NONE',alternative_group_id:null,...extra});
const relation=(id,type,head,tail,extra={})=>({id,type,head,tail,sources:[ref()],ownership:'LOCAL',role:'NONE',alternative_group_id:null,...extra});
function fixture(){
 const nodes=[node('actor','ENTITY','档案员',{entity_kind:'ROLE'}),node('check','EVENT','检查',{modality:'REQUIRED',predicate_class:'OPERATION'}),node('input','ENTITY','records.csv',{entity_kind:'FILE',artifact_use:'READ_ONLY_INPUT'}),node('produce','EVENT','形成',{modality:'REQUIRED',predicate_class:'PRODUCE'}),node('output','ENTITY','audit.md',{entity_kind:'FILE',artifact_use:'GENERATED_OUTPUT'}),node('approve','EVENT','审批',{modality:'NOT_REQUIRED',predicate_class:'APPROVE'}),node('delete','EVENT','删除',{modality:'FORBIDDEN',predicate_class:'OPERATION'})];
 const relations=[relation('agent','AGENT','check','actor',{role:'PERFORMER'}),relation('patient','PATIENT','check','input'),relation('result','RESULT','produce','output'),relation('negative','PATIENT','delete','input')];
 const p={structure_status:'SINGLE_ROOT',nodes,relations,expressions:[],unresolved:[],coverage:[]};
 return {p};
}
function audit(p,disposition='BOUNDARY_SEMANTIC'){
 const items=[...p.nodes,...p.relations,...p.expressions],coverage=[{region_id:'c1',disposition,candidate_ids:items.map(i=>i.id),reason:'Independently checked'}];p.coverage=structuredClone(coverage);
 return {checks:items.map(i=>({candidate_id:i.id,verdict:'SUPPORT',reason:'Explicit source relation',sources:[ref()]})),findings:[],coverage,additional_candidates:{nodes:[],relations:[],expressions:[],unresolved:[]}};
}
const compile=(p,a=audit(p))=>compileProposal(sourceDocument(quote),p,a);
test('027 source linker uses codepoints and explicit repeated-quote anchors',()=>{
 const s=sourceDocument('😀检查 A\n检查 A');
 assert.equal(linkQuote(s,{quote:'检查',clause_id:null,occurrence:null,context_anchor:null}).status,'AMBIGUOUS_ALIGNMENT');
 assert.equal(linkQuote(s,{quote:'检查',clause_id:'c2',occurrence:0,context_anchor:null}).span.start,6);
 assert.equal(linkQuote(s,{quote:'核验',clause_id:'c1',occurrence:0,context_anchor:null}).status,'INVALID_QUOTE');
 assert.equal(linkQuote(s,{quote:'检查',clause_id:'missing',occurrence:0,context_anchor:null}).status,'INVALID_ANCHOR');
});
test('027 strict provider contract excludes final slots and certified flags',()=>{const {p}=fixture(),a=audit(p),j=new Ajv({strict:true});assert.equal(j.compile(proposalSchema)(p),true);assert.equal(j.compile(auditSchema)(a),true);assert.equal(j.compile(proposalSchema)({...p,I:[]}),false);assert.equal(j.compile(proposalSchema)({...p,nodes:p.nodes.map(n=>({...n,state:'CERTIFIED'}))}),false);});
test('027 NOT_REQUIRED stays distinct from FORBIDDEN; output is not an input',()=>{const {p}=fixture(),t=compile(p),s=t.canonical_7plus1.slots;assert.deepEqual(s.A.entries.map(e=>e.predicate.semantic_identity).sort(),['形成','检查']);assert.equal(s.B.entries[0].predicate.semantic_identity,'删除');assert.equal(s.I.entries.some(e=>e.value.semantic_identity==='audit.md'),false);assert.equal(s.O.entries[0].value.semantic_identity,'audit.md');assert.equal(s.P.entries[0].participant_role,'PERFORMER');assert.equal(t.proof_dag.gap_count,0);});
test('027 quoted/purpose/background events cannot become main business actions',()=>{for(const layer of ['QUOTE','BACKGROUND','OUTPUT_CONTENT','PURPOSE_COMPLEMENT','ATTRIBUTE']){const {p}=fixture();p.nodes.find(n=>n.id==='approve').modality='REQUIRED';p.nodes.find(n=>n.id==='approve').layer=layer;const t=compile(p);assert.equal(t.canonical_7plus1.slots.A.entries.some(e=>e.predicate.node_id==='approve'),false,layer);}});
test('027 independent contradiction prevents incorrect RESOLVED',()=>{const {p}=fixture(),a=audit(p);a.checks.find(c=>c.candidate_id==='patient').verdict='CONTRADICT';const t=compile(p,a);assert.equal(t.boundary_ir.facts.find(f=>f.kind==='TASK_OBJECT').state,'UNRESOLVED');assert.equal(t.canonical_7plus1.slots.I.state,'UNRESOLVED');});
test('027 invalid argument type is rejected and cannot masquerade as ABSENT',()=>{const {p}=fixture();p.relations.find(r=>r.id==='agent').tail='output';const t=compile(p);assert.equal(t.gamma_certification.decisions.find(d=>d.candidate_id==='agent').decision,'REJECTED');assert.equal(t.canonical_7plus1.slots.P.state,'PARSER_COVERAGE_FAILURE');});
test('027 source omissions do not create false absent slots',()=>{const {p}=fixture(),a=audit(p);a.findings.push({id:'miss',kind:'MISSED_SEMANTICS',candidate_ids:['check'],sources:[ref()],reason:'An unrepresented boundary remains'});const t=compile(p,a);assert.equal(t.canonical_7plus1.slots.C.state,'PARSER_COVERAGE_FAILURE');});
test('027 reference alternatives remain unresolved rather than nearest choice',()=>{const {p}=fixture();p.nodes.push(node('ref','UNKNOWN_REFERENT','检查'));p.relations.push(relation('r1','COREFERENCE','ref','input'),relation('r2','COREFERENCE','ref','output'));const t=compile(p);assert.notEqual(t.gamma_certification.decisions.find(d=>d.candidate_id==='r1').decision,'CERTIFIED');assert.notEqual(t.gamma_certification.decisions.find(d=>d.candidate_id==='r2').decision,'CERTIFIED');});
test('027 condition provenance and uncertified guard survive eligibility dependency assembly',()=>{const {p}=fixture();p.nodes.push(node('state','STATE','条件成立',{layer:'CONDITION_ANTECEDENT',predicate_class:'STATE'}));p.expressions.push({id:'cond',kind:'CONDITION',operator:'STATE_REF',operands:['state'],owner:'check',sources:[ref('条件成立')],quantity:null,alternative_group_id:null});p.relations.push(relation('guard','CONDITION_OF','cond','check'));const a=audit(p);a.checks.find(c=>c.candidate_id==='state').verdict='CONTRADICT';const t=compile(p,a),f=t.boundary_ir.facts.find(f=>f.kind==='ACTION'&&f.predicate_id==='check');assert.equal(f.state,'UNRESOLVED');assert.ok(f.dependency_ids.includes('cond'));assert.ok(f.dependency_ids.includes('guard'));});
test('027 NLP contradiction is auxiliary evidence and cannot be ignored',()=>{const {p}=fixture(),t=compile(p),g=certify(t.candidate_semantic_graph,{evidence:[{candidate_id:'patient',signal:'CONTRADICT'}]});assert.notEqual(g.decisions.find(d=>d.candidate_id==='patient').decision,'CERTIFIED');assert.equal(t.candidate_semantic_graph.pre_gamma_final_adjudication.resolve,0);});
test('027 deterministic replay includes recorded NLP evidence and provider receipts',()=>{const {p}=fixture(),t=compile(p);assert.deepEqual(replay(t),t);assert.equal(t.business_decision,null);assert.equal(t.execution_authorization,null);const {nlp_input,...old}=t;assert.throws(()=>replay(old),/NOT_RECORDED/);});
