import fs from'node:fs';
const d='docs/reports/7plus1/7P-REPAIR-006',old='docs/reports/7plus1/7P-REPAIR-005',read=p=>JSON.parse(fs.readFileSync(p));
const active=read('fixtures/7plus1/standard/adjudications/r02/manifest.json');
for(const x of active.cases.filter(x=>x.denominator_included)){
 if(!fs.existsSync(d+'/replay/'+x.sample_id+'/trace.json'))continue;
 const c=read(d+'/replay/'+x.sample_id+'/trace.json').compiler_v03,p=read(old+'/replay/'+x.sample_id+'/trace.json').compiler_v03,exp=read(x.expected_path);
 console.log('\nCASE '+x.sample_id);
 for(const k of 'IOAPRVCB')for(const e of c.canonical_7plus1[k].entries.filter(e=>e.state==='RESOLVED')){const prev=p.canonical_7plus1[k].entries.find(q=>q.canonical_entry_id===e.canonical_entry_id),facts=c.boundary_ir.facts.filter(f=>e.boundary_fact_ids.includes(f.boundary_fact_id)),before=p.boundary_ir.facts.filter(f=>prev?.boundary_fact_ids.includes(f.boundary_fact_id));if(JSON.stringify(e)===JSON.stringify(prev)&&JSON.stringify(facts)===JSON.stringify(before))continue;console.log(JSON.stringify({slot:k,id:e.canonical_entry_id,value:e.display_value,facts:facts.map(f=>({type:f.fact_type,predicate:c.semantic_nodes.find(n=>n.node_id===f.predicate_node_id),objects:f.object_node_ids.map(i=>c.semantic_nodes.find(n=>n.node_id===i)),scope:f.scope_expr_id,condition:f.condition_expr_id})),expected:exp.slots[k].entries}));}
 console.log('FRAMES '+JSON.stringify(Object.fromEntries(['controlled','call_sites','code_ownership','test_insertions'].map(k=>[k,c.nlp_signals.semantic_decoding.frame_certification[k]]))));
}
