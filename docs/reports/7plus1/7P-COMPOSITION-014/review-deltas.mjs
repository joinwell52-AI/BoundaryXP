import {out,contract,read,write,digest} from './common.mjs';
const rev=process.argv[2],base=read(contract+'OFFLINE-REEVALUATION.json'),rows=[];
for(const x of base.cases){const old=read(x.trace_path).compiler_v03,t=read(out+'replay-'+rev+'/'+x.sample_id+'/trace.json'),c=t.compiler_v03,of=new Map(old.boundary_ir.facts.map(f=>[f.boundary_fact_id,f])),nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),sm=new Map(t.source_spans.map(s=>[s.span_id,s]));
 const facts=c.boundary_ir.facts.filter(f=>!of.has(f.boundary_fact_id)||JSON.stringify(of.get(f.boundary_fact_id))!==JSON.stringify(f));
 const evidence=f=>({fact:f,predicate:nm.get(f.predicate_node_id),objects:f.object_node_ids?.map(i=>nm.get(i)),relations:f.relation_ids.map(i=>c.relations.find(r=>r.relation_id===i)),spans:f.source_span_ids.map(i=>sm.get(i)),owner_decisions:c.nlp_signals.semantic_decoding.semantic_ownership.decisions.filter(d=>f.predicate_node_id?d.candidate_node_ids.includes(f.predicate_node_id):d.owner_record_node_ids.some(i=>f.node_ids.includes(i))),canonical_entries:['I','O','A','P','R','V','C','B'].flatMap(k=>c.canonical_7plus1[k].entries).filter(e=>e.boundary_fact_ids.includes(f.boundary_fact_id))});
 const row={case_id:x.sample_id,trace_sha256:digest(out+'replay-'+rev+'/'+x.sample_id+'/trace.json'),changed_or_new:facts.map(evidence),removed:old.boundary_ir.facts.filter(f=>!c.boundary_ir.facts.some(n=>n.boundary_fact_id===f.boundary_fact_id))};rows.push(row);
 for(const e of row.changed_or_new)console.log(JSON.stringify({case_id:x.sample_id,fact:e.fact,canonical:e.canonical_entries,spans:e.spans,predicate:e.predicate?.surface,object:e.objects?.map(o=>o?.surface),relations:e.relations.map(r=>({type:r.relation_type,state:r.state}))}));
}
write(out+'DELTA-EVIDENCE-'+rev+'.json',rows);
