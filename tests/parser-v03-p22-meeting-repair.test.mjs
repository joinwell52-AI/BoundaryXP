import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {compileNative} from '../research/7plus1-parser/v0.3-p2.2-meeting-repair/engine.mjs';
import {meetingAssertions} from '../research/7plus1-parser/v0.3-p2.2-meeting-repair/meeting-assertions.mjs';
import {assertions} from '../research/7plus1-parser/v0.3-p2.2-meeting-repair/verify-semantics.mjs';
import {nativeFrontend} from '../research/7plus1-parser/v0.3-p2.2-semantic-decoding/frontend.mjs';
import {decodeCandidates} from '../research/7plus1-parser/v0.3-p2.2-semantic-decoding/semantic-decoder.mjs';
import {resolveExpressions} from '../research/7plus1-parser/v0.3-p2.2-semantic-decoding/expressions.mjs';
import {produceEligibility,produceBoundaryIR} from '../research/7plus1-parser/v0.3-p2.2-meeting-repair/eligibility.mjs';
import {semanticSoundness} from '../research/7plus1-parser/v0.3-p2.2-meeting-repair/semantic-soundness.mjs';
const base=new URL('../research/7plus1-parser/v0.3-p2.2-meeting-repair/',import.meta.url),old=new URL('../research/7plus1-parser/v0.3-p2.2-semantic-decoding/',import.meta.url),read=u=>JSON.parse(fs.readFileSync(u,'utf8'));
const text=fs.readFileSync(new URL('MEETING-INPUT.txt',base),'utf8'),result=compileNative(sourceDocument(text),read(new URL('BASELINE-NLP.json',base)));
for(const row of meetingAssertions(result))test('meeting semantic: '+row.name,()=>assert.equal(row.pass,true));
test('baseline fails semantic assertions despite contract PASS',()=>{const old=read(new URL('BASELINE.json',base));assert.equal(old.contract_gate_results.status,'PASS');assert.ok(meetingAssertions(old).filter(x=>!x.pass).length>20);});
for(const code of ['PREDICATE_LAYER_OWNERSHIP_VIOLATION','INVALID_QUANTITY_TARGET','NORMATIVE_REFERENCE_IN_TASK_SCOPE'])test('runtime content gate blocks '+code,()=>{const f=semanticSoundness(resolveExpressions(decodeCandidates(nativeFrontend(sourceDocument(text),read(new URL('BASELINE-NLP.json',base))))));assert.ok(f.semantic_decoding.soundness.errors.some(e=>e.code===code));produceEligibility(f);produceBoundaryIR(f);for(const e of f.semantic_decoding.soundness.errors.filter(e=>e.code===code))assert.ok(f.boundary_ir.facts.filter(f=>f.node_ids.includes(e.node_id)).every(f=>f.state!=='RESOLVED'));});
for(const c of read(new URL('FIXED-INPUTS.json',base)).cases){const sig=read(new URL(c.id+'-NLP.json',old)).signals;const r=compileNative(sourceDocument(c.text),sig);for(const row of assertions(r,c.id,c.text))test(c.id+' '+row.name,()=>assert.equal(row.pass,true));}
for(const c of read(new URL('MUTATION-INPUTS.json',base)).cases)test(c.id+' preserved semantic checks on unchanged frozen signals',()=>{const prior=read(new URL('mutation/'+c.id+'.json',old));const r=compileNative(sourceDocument(c.text),prior.signals);assert.deepEqual(assertions(r,c.base_id,c.text).filter(x=>!x.pass),[]);});
for(const x of read(new URL('CONSTRUCTION-RESULTS.json',base)))test('independent construction '+x.input.id,()=>{
 const r=compileNative(sourceDocument(x.input.text),x.signals),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));assert.equal(r.contract_gate_results.status,'PASS');assert.equal(c.unresolved.length,0);
 if(x.input.kind==='quote'){assert.ok(c.semantic_nodes.some(n=>n.metadata.quoted));assert.ok(c.semantic_nodes.filter(n=>n.node_type==='EVENT').every(n=>!['签署','删除','批准'].includes(n.surface)));if(x.input.id==='QUOTE-NORMAL')assert.equal(c.canonical_7plus1.B.entries.length,0);}
 if(x.input.kind==='norm'){assert.equal(r.relation_type_audit.status,'PASS');assert.equal(c.canonical_7plus1.I.entries.length,0);assert.equal(c.canonical_7plus1.V.entries.length,1);assert.ok(c.relations.some(r=>r.relation_type==='CONFORMS_TO'&&r.state==='RESOLVED'));}
 if(x.input.kind==='quantity'){assert.equal(c.canonical_7plus1.R.entries.length,1);assert.ok(c.boundary_ir.quantity_expr_nodes.every(q=>q.target_node_ids.every(i=>nm.get(i).node_type==='DISCOURSE')));assert.ok(!c.semantic_nodes.some(n=>n.node_type==='EVENT'&&n.surface==='得'));}
 if(x.input.kind==='declaration')assert.equal(c.canonical_7plus1.I.entries.length,2);
 if(x.input.kind==='passive')assert.ok(c.boundary_ir.set_expr_nodes.some(s=>s.kind==='ALL'));
 if(x.input.kind==='assignment'){assert.equal(c.canonical_7plus1.A.entries.length,2);assert.ok(!c.canonical_7plus1.A.entries.some(e=>e.display_value.includes('工作')));}
});
