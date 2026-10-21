import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(process.env.BOUNDARYXP_COMPACT_TEST_ROOT??'.boundx/compact-interface-ui16-work');
const core='research/7plus1-parser/llm-first-028/';
const load=p=>import(pathToFileURL(path.join(root,core+p)).href);
const {encodeProposal,decodeProposal,encodeAudit,decodeAudit,validateWire}=await load('compact-wire.mjs');
const {prepareSource}=await load('source.mjs');
const {technicalValidate,validateSchema,graphItems}=await load('validate.mjs');
const {compileBoundary}=await load('compile.mjs');
const {parse7Plus1}=await load('engine.mjs');
const {buildBundle}=await load('bundle.mjs');
const {buildPrompt}=await load('provider.mjs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const copy=structuredClone;
const src=prepareSource(Buffer.from('甲检查材料；乙复核结果。通过后交付；限二分钟。甲检查材料。😀'));
const evidence=[{quote:'甲检查材料',occurrence:1}];
const event=id=>({id,predicate:'检查',kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',modality:'REQUIRED',polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:[],requires:[],sources:evidence});
const claim=(id,kind='ROLE')=>({id,kind,event_id:'e1',entity_id:'n1',role:'OBJECT',expression_id:null,direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:'e1',requires:[],sources:evidence,note:''});
function fixture(){return {contract_version:'031-r1.1',entities:[{id:'n1',label:'材料',type:'OTHER',mentions:evidence,alternatives:[]}],events:[event('e1'),event('e2')],claims:[claim('r1')],expressions:[],issues:[],coverage:[{sources:evidence,claim_ids:['r1'],status:'EXPRESSED',affected_views:['A']}]};}
const audit=g=>({contract_version:'031-r1.1',reviews:graphItems(g).map(n=>({subject_id:n.id,field_path:'',verdict:'SUPPORT',context_refs:[],sources:n.sources??n.mentions,reason:'No-model fixture, not a real model review'})),issues:[],omissions:[]});
const make=(g,a)=>{const technical=technicalValidate(src,g,a);return {technical,...compileBoundary(src,g,a,technical)};};
const semantic=x=>JSON.parse(JSON.stringify(x));
test('Internal Schema, source linking, validators, revision and projection remain byte-identical',()=>{
 const base=path.resolve('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.15');
 for(const f of ['contracts/schema.mjs','contracts/proposal.schema.json','contracts/audit.schema.json','contracts/semantic-contract.md','contracts/comparison/semantic-contract.md','compile.mjs','validate.mjs','revision.mjs','source.mjs']){
  assert.deepEqual(fs.readFileSync(path.join(root,core+f)),fs.readFileSync(path.join(base,core+f)),f);
 }
});
test('Candidate and independent review round trip preserve canonical semantics and computed outputs',()=>{
 const g=fixture(),a=audit(g),w=encodeProposal(g),d=decodeProposal(w),aw=encodeAudit(a,w),ad=decodeAudit(aw,w);
 assert.deepEqual(d.value,g);assert.deepEqual(ad.value,a);assert.deepEqual(make(d.value,ad.value),make(g,a));
 assert.equal(w.source_table.length,1);assert.equal(aw.additional_sources.length,0);
 assert.equal(d.evidence.semantic_choices_inferred,0);assert.equal(ad.evidence.default_support_verdicts,0);
});
for(const kind of ['ROLE','CONDITION','TEMPORAL','QUANTITY','COMPLETION','STOP','SCOPE','ARTIFACT_USE'])test('Kind '+kind+' keeps applicable semantics, omits only contract constants',()=>{
 const g=fixture(),c=claim('test',kind);g.claims=[c];
 if(['CONDITION','TEMPORAL'].includes(kind)){Object.assign(c,{entity_id:null,role:null,expression_id:'x',direction:kind==='TEMPORAL'?'ORDER':'NECESSARY',temporal:'AFTER'});g.events[0].constraint_ids=['test'];}
 if(kind==='QUANTITY'){Object.assign(c,{entity_id:null,role:null,quantity:{metric:'duration',target_id:'e1',comparator:'LTE',value:2,unit:'minute',use:'EXECUTION_LIMIT',count_scope:'ROOT'}});g.events[0].constraint_ids=['test'];}
 if(['COMPLETION','STOP'].includes(kind))Object.assign(c,{event_id:null,role:null,expression_id:'x',direction:'SUFFICIENT',temporal:'AFTER',scope_id:'ROOT'});
 if(kind==='SCOPE')Object.assign(c,{role:null,expression_id:'x',direction:'NECESSARY',temporal:'BEFORE'});
 if(kind==='ARTIFACT_USE')Object.assign(c,{role:null,artifact_use:{producer_result_id:'r',consumer_role_id:'c',availability:'USED_PORTION'}});
 const w=encodeProposal(g),back=decodeProposal(w).value;assert.deepEqual(back,g);
 assert.equal(w.claims[0].binding.kind,kind);assert.ok(Object.keys(w.claims[0].binding).length<11);
 assert.ok(validateSchema('proposal',back).ok);
});
test('STATE and set/logic expressions preserve exact arguments, ownership references and operands',()=>{
 const g=fixture();g.expressions=[{id:'state',op:'STATE',operands:[],state:{predicate:'通过',event_id:'e1',args:['n1'],polarity:'NEGATIVE'},sources:evidence},{id:'set',op:'ITEM',operands:['n1'],state:null,sources:evidence},{id:'logic',op:'NOT',operands:['state'],state:null,sources:evidence}];
 const w=encodeProposal(g);assert.ok(!('operands' in w.expressions[0]));assert.ok(!('state' in w.expressions[1]));assert.deepEqual(decodeProposal(w).value,g);
});
test('Inverse indexes are derived only from explicit CONDITION/TEMPORAL/QUANTITY target declarations',()=>{
 const w=encodeProposal(fixture());w.claims.push({id:'q',scope_id:'e2',requires:[],note:'',source_refs:['s1'],binding:{kind:'QUANTITY',event_id:'e2',quantity:{metric:'time',target_id:'e2',comparator:'LTE',value:2,unit:'minute',use:'EXECUTION_LIMIT',count_scope:'ROOT'}}});
 w.claims.push({id:'s',scope_id:'e2',requires:[],note:'',source_refs:['s1'],binding:{kind:'SCOPE',event_id:'e2',entity_id:null,expression_id:'missing',direction:null,temporal:null}});
 const d=decodeProposal(w);assert.deepEqual(d.value.events[0].constraint_ids,[]);assert.deepEqual(d.value.events[1].constraint_ids,['q']);
 assert.equal(d.evidence.derivations.find(x=>x.kind==='INVERSE_CONSTRAINT_INDEX'&&x.event_id==='e2').declared_claims[0].event_id,'e2');
});
test('Wrong quantity/event target is NOT repaired or rebound by normalization',()=>{
 const w=encodeProposal(fixture());w.claims.push({id:'q',scope_id:'e1',requires:[],note:'',source_refs:['s1'],binding:{kind:'QUANTITY',event_id:'e1',quantity:{metric:'duration',target_id:'e2',comparator:'LTE',value:2,unit:'minute',use:'EXECUTION_LIMIT',count_scope:'ROOT'}}});
 const g=decodeProposal(w).value;assert.equal(g.claims[1].quantity.target_id,'e2');assert.equal(make(g,audit(g)).technical.rows.find(x=>x.id==='q').status,'REJECTED');
});
test('Unknown referents, ambiguity, modality and nonempty required dependencies are not erased',()=>{
 const g=fixture();g.entities[0].type='REFERENT';g.entities[0].alternatives=['n2','n3'];g.events[0].modality='NOT_REQUIRED';g.events[0].layer='CONDITION';g.events[0].requires=['e2'];
 g.issues=[{id:'u',kind:'AMBIGUITY',subject_ids:['n1'],field_path:'identity',alternatives:['n2','n3'],affected_views:['I'],sources:evidence,note:'真实多候选'}];
 assert.deepEqual(decodeProposal(encodeProposal(g)).value,g);
});
test('Repeated text occurrences and supplementary Unicode keep exact sources and linked spans',()=>{
 const g=fixture();g.entities[0].mentions=[{quote:'甲检查材料',occurrence:2},{quote:'😀',occurrence:1}];
 const w=encodeProposal(g);assert.equal(w.source_table.length,3);const d=decodeProposal(w).value;
 assert.deepEqual(d.entities[0].mentions,g.entities[0].mentions);
 assert.deepEqual(make(d,audit(d)).technical.linked_sources,make(g,audit(g)).technical.linked_sources);
});
test('Duplicate or dangling source IDs fail explicitly; no proximity/source borrowing fallback',()=>{
 let w=encodeProposal(fixture());w.source_table.push(copy(w.source_table[0]));assert.throws(()=>decodeProposal(w),/WIRE_DUPLICATE_SOURCE_ID/);
 w=encodeProposal(fixture());w.events[0].source_refs=['unknown'];assert.throws(()=>decodeProposal(w),/WIRE_DANGLING_SOURCE_REF/);
});
test('Duplicate source references are rejected locally, including independent audit reviews',()=>{
 const w=encodeProposal(fixture());w.events[0].source_refs=['s1','s1'];
 assert.equal(validateWire('proposal',w).ok,false);assert.throws(()=>decodeProposal(w),/WIRE_SCHEMA_INVALID/);
 const good=encodeProposal(fixture()),a=encodeAudit(audit(fixture()),good);a.reviews[0].source_refs=['s1','s1'];
 assert.equal(validateWire('audit',a).ok,false);assert.throws(()=>decodeAudit(a,good),/WIRE_SCHEMA_INVALID/);
});
test('Missing semantic fields and unexpected legacy/backlink fields fail wire Schema',()=>{
 for(const mutate of [w=>delete w.events[0].modality,w=>delete w.events[0].owner_id,w=>delete w.claims[0].binding.entity_id,w=>{w.events[0].constraint_ids=['r1'];},w=>{w.claims[0].binding.artifact_use=null;}]){
  const w=encodeProposal(fixture());mutate(w);assert.equal(validateWire('proposal',w).ok,false);
 }
});
test('Codec cannot discard a nonconstant field or silently correct an old invalid reverse index',()=>{
 const g=fixture();g.claims[0].expression_id='extra';assert.throws(()=>encodeProposal(g),/NON_CONSTANT_CANONICAL_FIELD/);
 g.claims[0].expression_id=null;g.events[0].constraint_ids=['r1'];assert.throws(()=>encodeProposal(g),/CANONICAL_INVERSE_INDEX_MISMATCH/);
});
test('Missing review never becomes SUPPORT and preserves technical unresolved result',()=>{
 const g=fixture(),w=encodeProposal(g),a=audit(g);a.reviews=a.reviews.filter(x=>x.subject_id!=='e1');
 const d=decodeAudit(encodeAudit(a,w),w);assert.ok(!d.value.reviews.some(x=>x.subject_id==='e1'));assert.notEqual(make(g,d.value).technical.rows.find(x=>x.id==='e1').status,'ACCEPTED');
});
test('Audit omissions can add exact new evidence; conflicting IDs fail and no issue is dropped',()=>{
 const g=fixture(),w=encodeProposal(g),a=audit(g);a.omissions=[{id:'omit',sources:[{quote:'乙复核结果',occurrence:1}],affected_views:['A'],reason:'缺少复核'}];
 const aw=encodeAudit(a,w);assert.equal(aw.additional_sources.length,1);assert.deepEqual(decodeAudit(aw,w).value,a);
 aw.additional_sources[0].id='s1';assert.throws(()=>decodeAudit(aw,w),/WIRE_DUPLICATE_SOURCE_ID/);
});
test('Prompt preserves original source and transports complete candidate, not final 7+1 or answers',()=>{
 const g=fixture(),b=buildBundle('audit',{parseMethod:'SKILL'}),p=buildPrompt({bundle:b,source:src,candidate:g});
 const extract=tag=>JSON.parse(p.match(new RegExp('<'+tag+'>\\n([\\s\\S]*?)\\n</'+tag+'>'))[1]);
 assert.equal(extract('SOURCE_DATA').text,src.text);assert.deepEqual(decodeProposal(extract('CANDIDATE_DATA')).value,g);
 assert.equal(b.request_profile,'COMPACT_SEMANTIC_WIRE_R01');assert.ok(p.includes('source_table'));assert.ok(p.includes('--output-schema'));
});
for(const rel of ['.boundx/exports/SKILL-MD-COMPACT-COMPARISON-r02/SKILL/revision-1/trace.json','.boundx/exports/SKILL-EFFICIENCY-OPTIMIZATION-r01/SKILL/revision-1/trace.json'])test('Saved real response '+rel+' roundtrips to identical technical/IR/7+1/Chinese',()=>{
 const t=read(rel),w=encodeProposal(t.proposal),g=decodeProposal(w).value,a=decodeAudit(encodeAudit(t.audit,w),w).value;
 assert.deepEqual(semantic(g),semantic(t.proposal));assert.deepEqual(a,t.audit);
 const checks=technicalValidate(t.source,g,a),out=compileBoundary(t.source,g,a,checks);
 assert.deepEqual(checks,t.technical);assert.deepEqual(out.ir,t.ir);assert.deepEqual(out.canonical,t.canonical);assert.equal(out.chinese,t.chinese);
});
test('Independent sessions still required and semantic omissions still require bounded full revision',async()=>{
 const t=read('.boundx/exports/SKILL-MD-COMPACT-COMPARISON-r02/SKILL/trace.json');let i=0;const phases=[];
 const result=await parse7Plus1(Buffer.from(t.source.text),{output:fs.mkdtempSync(path.join(os.tmpdir(),'boundx-wire-test-')),parseMethod:'SKILL',probe:{version:'unit-only'},call:async o=>{
  phases.push(o.bundle.phase);const revision=Math.floor(i/2),kind=o.bundle.phase==='parse'?'proposal':'audit';
  const value=read('.boundx/exports/SKILL-MD-COMPACT-COMPARISON-r02/SKILL/revision-'+revision+'/'+kind+'.json');const receipt={thread_id:'unit-'+i++};return {value,receipt,attempts:[receipt]};
 }});
 assert.deepEqual(phases,['parse','audit','parse','audit']);assert.deepEqual(result.canonical,t.canonical);
 await assert.rejects(()=>parse7Plus1(Buffer.from(t.source.text),{output:fs.mkdtempSync(path.join(os.tmpdir(),'boundx-wire-test-')),probe:{version:'unit-only'},call:async o=>({value:o.bundle.phase==='parse'?t.proposal:t.audit,receipt:{thread_id:'same'},attempts:[]})}),/AUDIT_SESSION_NOT_INDEPENDENT/);
});
