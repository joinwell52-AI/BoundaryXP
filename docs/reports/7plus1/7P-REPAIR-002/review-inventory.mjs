import fs from'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p)),active=read('fixtures/7plus1/standard/adjudications/r02/manifest.json'),prior=read('docs/reports/7plus1/7P-REPAIR-001/COMPARISON.json');
for(const x of active.cases.filter(x=>x.denominator_included)){
 const file='docs/reports/7plus1/7P-REPAIR-002/replay/'+x.sample_id+'/trace.json';if(!fs.existsSync(file))continue;
 const r=read(file),c=r.compiler_v03,old=prior.cases.find(p=>p.sample_id===x.sample_id),expected=read(x.expected_path);
 console.log('\n'+x.sample_id);
 for(const slot of 'IOAPRVCB')for(const e of c.canonical_7plus1[slot].entries.filter(e=>e.state==='RESOLVED'&&!old.slots[slot].actual_reviews.some(o=>o.canonical_entry_id===e.canonical_entry_id&&o.state===e.state))){
  console.log(slot,e.canonical_entry_id,e.display_value);
  if(slot==='V'){const fact=c.boundary_ir.facts.find(f=>f.boundary_fact_id===e.boundary_fact_ids[0]);console.log('basis',c.nlp_signals.semantic_decoding.structured_recovery.references.filter(a=>fact.relation_ids.includes(a.relation_id)).map(a=>({type:a.relation_type,subject:c.semantic_nodes.find(n=>n.node_id===a.head_node_id)?.surface.slice(0,150),proof:a.structural_proof?.kind})));}
 }
 console.log('expected',JSON.stringify(Object.fromEntries('IOVC'.split('').map(s=>[s,expected.slots[s].entries.map((e,i)=>({ref:s+i,...e}))]))));
 console.log('C',c.nlp_signals.semantic_decoding.structured_recovery.completion.map(x=>({event:x.event_node_id,atoms:x.criterion_node_ids?.map(i=>c.semantic_nodes.find(n=>n.node_id===i)?.surface)})));
}
