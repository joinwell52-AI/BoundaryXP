import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {compileNative} from '../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/engine.mjs';
import {scopeEvidence,assertScopeConsistency} from '../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/scope-consistency.mjs';
import {produceEligibility,produceBoundaryIR} from '../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/eligibility.mjs';
import {meetingAssertions} from '../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/meeting-assertions.mjs';
import {assertions} from '../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/verify-semantics.mjs';
import {traceMarkdown,traceHTML,SECTIONS} from '../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/export.mjs';
const base=new URL('../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/',import.meta.url),old=new URL('../research/7plus1-parser/v0.3-p2.2-semantic-decoding/',import.meta.url),sealed=new URL('../research/7plus1-parser/v0.3-p2.2-meeting-repair/',import.meta.url),read=u=>JSON.parse(fs.readFileSync(u));
const before=read(new URL('BEFORE-MEETING.json',base));
test('sealed real trace exposes semantic scope failure despite contract PASS',()=>{const c=before.compiler_v03;assert.equal(before.contract_gate_results.status,'PASS');assert.equal(scopeEvidence(c.boundary_ir,c.semantic_nodes,c.relations).filter(x=>!x.pass).length,1);assert.throws(()=>assertScopeConsistency(c.boundary_ir,c.semantic_nodes,c.relations),/BOUNDARY_SCOPE_INCONSISTENT/);});
const cases=[{id:'MEETING',text:fs.readFileSync(new URL('MEETING-INPUT.txt',base),'utf8'),signals:read(new URL('BASELINE-NLP.json',base))},...read(new URL('FIXED-INPUTS.json',base)).cases.map(c=>({...c,signals:read(new URL(c.id+'-NLP.json',old)).signals})),...read(new URL('MUTATION-INPUTS.json',base)).cases.map(c=>({...c,signals:read(new URL('mutation/'+c.id+'.json',old)).signals}))];
for(const x of cases)test(x.id+' object/relation/scope/projection/proof consistency and previous semantic acceptance',()=>{
 const r=compileNative(sourceDocument(x.text),x.signals),c=r.compiler_v03;
 assert.equal(r.contract_gate_results.status,'PASS');assert.equal(r.relation_type_audit.status,'PASS');
 const rows=assertScopeConsistency(c.boundary_ir,c.semantic_nodes,c.relations);
 assert.ok(rows.length>=scopeEvidence(read(new URL('replay-r03/'+x.id+'.json',sealed)).compiler_v03.boundary_ir,c.semantic_nodes,c.relations).length);
 for(const f of c.boundary_ir.facts.filter(f=>['TASK_OBJECT','DELIVERABLE'].includes(f.fact_type)))assert.ok(f.scope_expr_id);
 for(const entry of Object.values(c.canonical_7plus1).filter(v=>Array.isArray(v?.entries)).flatMap(v=>v.entries))for(const fid of entry.boundary_fact_ids){const f=c.boundary_ir.facts.find(f=>f.boundary_fact_id===fid);assert.equal(entry.scope_expr_id,f.scope_expr_id);}
 assert.deepEqual((x.id==='MEETING'?meetingAssertions(r):assertions(r,x.base_id??x.id,x.text)).filter(v=>!v.pass),[]);
 const prev=read(new URL('replay-r03/'+x.id+'.json',sealed)).compiler_v03;
 assert.deepEqual(c.unresolved,prev.unresolved);assert.deepEqual(c.boundary_ir.facts.map(f=>[f.boundary_fact_id,f.state,f.object_node_ids,f.condition_expr_id,f.quantity_expr_id]),prev.boundary_ir.facts.map(f=>[f.boundary_fact_id,f.state,f.object_node_ids,f.condition_expr_id,f.quantity_expr_id]));
 for(const row of rows){const corrupted=structuredClone(c.boundary_ir),expr=corrupted.set_expr_nodes.find(e=>e.expr_id===row.scope_expr_id);expr.relation_ids=['MISSING_RELATION'];assert.throws(()=>assertScopeConsistency(corrupted,c.semantic_nodes,c.relations),/BOUNDARY_SCOPE_INCONSISTENT/);}
});
test('result scopes bind each result relation instead of inheriting a patient scope or sibling result',()=>{
 const ns=['task','action','source','out-a','out-b'].map((n,i)=>({node_id:n,node_type:i===1?'EVENT':'ENTITY',surface:n,source_span_ids:['s'+i],metadata:{modality:'REQUIRED'}})),rs=[{relation_id:'p',relation_type:'PATIENT',head_node_id:'action',tail_node_id:'source',state:'RESOLVED'},{relation_id:'a',relation_type:'RESULT',head_node_id:'action',tail_node_id:'out-a',state:'RESOLVED'},{relation_id:'b',relation_type:'RESULT',head_node_id:'action',tail_node_id:'out-b',state:'RESOLVED'}];
 const f={source:{sha256:'unit-domain'},semantic_nodes:ns,relations:rs,expression_plans:new Map([['action',{scope_expr_id:'patient'}]]),relation_scope_plans:new Map(),expressions:{set_expr_nodes:[{expr_id:'patient',kind:'ALL',base_entity_node_id:'source',source_span_ids:['s2'],relation_ids:['p']}],condition_expr_nodes:[],quantity_expr_nodes:[]},analyses:[],unresolved:[],semantic_decoding:{}};
 produceEligibility(f);produceBoundaryIR(f);assert.equal(f.boundary_ir.facts.length,2);
 for(const row of assertScopeConsistency(f.boundary_ir,ns,rs)){assert.equal(row.scope_objects.length,1);assert.equal(row.scope_objects[0].node_id,row.objects[0].node_id);assert.equal(row.structural_path[0].relation_ids.length,1);}
});
test('same object with a different predicate owner is rejected independently of ID existence',()=>{
 const c=structuredClone(before.compiler_v03),fact=c.boundary_ir.facts.find(f=>f.predicate_node_id&&f.scope_expr_id),expr=c.boundary_ir.set_expr_nodes.find(e=>e.expr_id===fact.scope_expr_id),rid=expr.relation_ids[0],r=c.relations.find(r=>r.relation_id===rid);r.head_node_id='another-predicate';assert.throws(()=>assertScopeConsistency(c.boundary_ir,c.semantic_nodes,c.relations),/SCOPE_RELATION_ENDPOINT_MISMATCH/);
});
for(const kind of ['ALL','ANY'])test('result role rebinding preserves explicit '+kind+' quantifier and governing condition',()=>{
 const nodes=[{node_id:'event',node_type:'EVENT',surface:'produce',source_span_ids:['s0'],metadata:{modality:'REQUIRED'}},{node_id:'object',node_type:'ENTITY',surface:'reports',source_span_ids:['s1'],metadata:{}}],relations=[{relation_id:'patient',relation_type:'PATIENT',head_node_id:'event',tail_node_id:'object',state:'RESOLVED'},{relation_id:'result',relation_type:'RESULT',head_node_id:'event',tail_node_id:'object',state:'RESOLVED'}],f={source:{sha256:'quantified'},semantic_nodes:nodes,relations,expression_plans:new Map([['event',{scope_expr_id:'old',condition_expr_id:'condition'}]]),relation_scope_plans:new Map(),expressions:{set_expr_nodes:[{expr_id:'old',kind,base_entity_node_id:'object',source_span_ids:['s0','s1'],relation_ids:['patient']}],condition_expr_nodes:[],quantity_expr_nodes:[]},analyses:[],unresolved:[],semantic_decoding:{}};
 produceEligibility(f);produceBoundaryIR(f);const fact=f.boundary_ir.facts[0],expr=f.boundary_ir.set_expr_nodes.find(e=>e.expr_id===fact.scope_expr_id);assert.equal(expr.kind,kind);assert.deepEqual(expr.relation_ids,['result']);assert.equal(fact.condition_expr_id,'condition');
});
test('removing the scope is not an accepted repair',()=>{const c=structuredClone(before.compiler_v03),f=c.boundary_ir.facts.find(f=>f.fact_type==='TASK_OBJECT');delete f.scope_expr_id;assert.throws(()=>assertScopeConsistency(c.boundary_ir,c.semantic_nodes,c.relations),/MISSING_REQUIRED_OBJECT_SCOPE/);});
test('new revision exports full native structure and preserves prior sealed trace display',()=>{
 const r=compileNative(sourceDocument(cases[0].text),cases[0].signals),md=traceMarkdown(r),html=traceHTML(r);
 for(const section of SECTIONS){assert.ok(md.includes('## '+section));assert.ok(html.includes(section));}
 assert.equal(traceMarkdown(before),fs.readFileSync(new URL('BEFORE-MEETING.md',base),'utf8'));
 assert.equal(traceHTML(before),fs.readFileSync(new URL('BEFORE-MEETING.html',base),'utf8'));
});
