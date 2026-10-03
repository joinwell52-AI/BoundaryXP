import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {compileNative} from '../research/7plus1-parser/v0.3-7p-short-direct-016-r2/engine.mjs';
import {contractGates} from '../research/7plus1-parser/v0.3-7p-short-direct-016-r2/contract-gates.mjs';
import {normalizeParticipantIdentity} from '../research/7plus1-parser/v0.3-7p-short-direct-016-r2/anchor-contracts.mjs';
import {checks,coverageFixture} from '../docs/reports/7plus1/7P-SHORT-016-R2/non-gold-checks.mjs';
const base='docs/reports/7plus1/7P-SHORT-016-R2/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const inputs=read(base+'NON-GOLD-FROZEN-INPUTS.json').inputs;
for(const x of inputs)test(x.id+' frozen '+x.group+' contract',()=>{const rows=x.group==='coverage'?coverageFixture(x).assertions:checks(x,compileNative(sourceDocument(x.text),read(base+'non-gold-baseline/'+x.id+'/signals.json')));assert.deepEqual(rows.filter(r=>!r.pass),[]);});
test('coverage verifier rejects tampered removal of an actual affected slot',()=>{const x=inputs.find(x=>x.id==='I01'),r=compileNative(sourceDocument(x.text),read(base+'non-gold-baseline/I01/signals.json'));assert.equal(r.contract_gate_results.status,'PASS');const co=r.compiler_v03.coverage.find(co=>co.affected_slots.length);assert.ok(co);co.affected_slots=[];const g=contractGates(r.compiler_v03,{spans:r.source_spans,availability:r.stage_availability});assert.equal(g.gates.G16.status,'FAIL');assert.ok(g.gates.G16.errors.some(e=>e.startsWith('INVALID_SLOT_IMPACT')));});
test('ambiguous qualified same-name identities and partial family names never merge',()=>{
 const make=(node_id,surface,identity_name)=>({node_id,node_type:'ENTITY',surface,state:'RESOLVED',source_span_ids:[node_id],span_candidate_ids:[node_id],metadata:{identity_name,clause_id:'c',participant_eligibility:{eligible:true},semantic_ownership:{semantic_owner_id:'task'}}});
 const a=make('a','Editor Sam Lee','Sam Lee'),b=make('b','Reviewer Sam Lee','Sam Lee'),c=make('c','Sam Lee'),d=make('d','Lee');
 const f={source:{raw_text:'Editor Sam Lee Reviewer Sam Lee Sam Lee Lee'},source_spans:[a,b,c,d].map((n,i)=>({span_id:n.node_id,start:i*3,end:i*3+2})),semantic_decoding:{},semantic_nodes:[a,b,c,d],relations:[],analyses:[{cl:{id:'c',tokens:[]}}],tools:{node(){throw Error('No syntactic title');},relation(){throw Error('Must not merge');}}};
 normalizeParticipantIdentity(f);assert.equal(c.metadata.referent_node_id,undefined);assert.equal(d.metadata.referent_node_id,undefined);assert.ok(f.semantic_decoding.anchor_contracts.identity.some(x=>x.node_id==='c'&&x.status==='UNRESOLVED_IDENTITY'));
});
test('runtime cannot read case identities, Gold answers or source-specific names',()=>{for(const p of ['engine.mjs','anchor-contracts.mjs','contract-gates.mjs']){const s=fs.readFileSync('research/7plus1-parser/v0.3-7p-short-direct-016-r2/'+p,'utf8');assert.ok(!/REF-001|D0[1-8]|沈悦|唐宁|meeting-notes|minutes-final|expected-7plus1|readFile|FROZEN-CASES/u.test(s));}});
