import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileNative} from '../research/7plus1-parser/v0.3-7p-repair-001/engine.mjs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {meetingAssertions} from '../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/meeting-assertions.mjs';
import {assertions} from '../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/verify-semantics.mjs';
import {cases} from '../docs/reports/7plus1/7P-REPAIR-001/non-gold-inputs.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),root='research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/',old='research/7plus1-parser/v0.3-p2.2-semantic-decoding/';
for(const x of cases)test('7P general mechanism '+x.id+' '+x.check,()=>{
 const evidence=read('docs/reports/7plus1/7P-REPAIR-001/non-gold/'+x.id+'.json');assert.equal(evidence.text,x.text);
 const r=compileNative(sourceDocument(x.text),evidence.signals),c=r.compiler_v03,s=c.canonical_7plus1,d=c.nlp_signals.semantic_decoding.discourse;
 assert.equal(r.contract_gate_results.status,'PASS',JSON.stringify(r.contract_gate_results));
 for(const span of r.source_spans)assert.equal([...x.text].slice(span.start,span.end).join(''),span.text);
 if(x.check==='NO_P')assert.equal(s.P.entries.length,0,JSON.stringify(s.P));
 if(x.check==='NO_R')assert.equal(s.R.entries.length,0,JSON.stringify(s.R));
 if(x.check==='HAS_P')assert.ok(s.P.entries.some(e=>e.state==='RESOLVED'));
 if(x.check==='FRONTMATTER')assert.deepEqual(s.P.entries.map(e=>e.display_value),['QA [PERFORMER]']);
 if(x.check==='NO_CURRENT'||x.check==='TABLE')for(const k of 'APB')assert.equal(s[k].entries.length,0,k);
 if(x.check==='BACKGROUND')assert.equal(s.P.entries.length,0);
 if(x.check==='TABLE'){const rows=d.annotations.filter(a=>a.kind==='TABLE'&&a.cells?.length);assert.equal(rows.length,2);assert.equal(rows[0].table_id,rows[1].table_id);assert.equal(rows[1].cells[0].header_cell_id,rows[0].cells[0].cell_id);}
 if(x.check==='THRESHOLD'){assert.equal(s.R.entries.length,1);const f=c.boundary_ir.facts.find(f=>f.fact_type==='RESOURCE'),q=c.boundary_ir.quantity_expr_nodes.find(q=>q.expr_id===f.quantity_expr_id);assert.equal(q.unit,'天');assert.deepEqual(q.lower_bound,{inclusive:true,value:x.value});assert.equal(c.semantic_nodes.find(n=>n.node_id===q.target_node_ids[0]).metadata.quantity_class,'THRESHOLD');}
 if(x.check==='DURATION')assert.equal(s.R.entries.length,1);
 if(x.check.startsWith('META')){assert.ok(d.output_content_requirements.length);for(const k of 'APB')for(const entry of s[k].entries)for(const fid of entry.boundary_fact_ids){const fact=c.boundary_ir.facts.find(f=>f.boundary_fact_id===fid);for(const n of fact.node_ids.map(i=>c.semantic_nodes.find(n=>n.node_id===i)))assert.notEqual(n.metadata.discourse?.kind,'OUTPUT_CONTENT');}
  if(x.check==='META')assert.ok(s.O.entries.length,'current authored output');
  if(x.check==='META_SCOPE'||x.check==='META_LIST')assert.ok(s.B.entries.some(e=>e.state==='RESOLVED'),'current exclusion retained');
 }
 if(x.check==='NEGATIVE'){assert.ok(s.B.entries.length);assert.equal(s.A.entries.filter(e=>e.state==='RESOLVED').length,0);}
});
const regression=[{id:'REF-001',text:fs.readFileSync('fixtures/7plus1/golden/REF-001/source.txt','utf8'),signals:read(root+'BASELINE-NLP.json')},...read(root+'FIXED-INPUTS.json').cases.map(c=>({...c,signals:read(old+c.id+'-NLP.json').signals})),...read(root+'MUTATION-INPUTS.json').cases.map(c=>({...c,signals:read(old+'mutation/'+c.id+'.json').signals}))];
for(const x of regression)test('7P existing semantic regression '+x.id,()=>{const r=compileNative(sourceDocument(x.text),x.signals);assert.equal(r.contract_gate_results.status,'PASS');assert.deepEqual((x.id==='REF-001'?meetingAssertions(r):assertions(r,x.base_id??x.id,x.text)).filter(v=>!v.pass),[]);});
