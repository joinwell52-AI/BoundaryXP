import assert from 'node:assert/strict';import {out,read,write,digest} from './common.mjs';
const rev=process.argv[2],referents=[],conditions=[];
for(const x of read(out+'replay-'+rev+'/INDEX.json')){
 const t=read(x.trace_path),c=t.compiler_v03,sm=new Map(t.source_spans.map(s=>[s.span_id,s])),ns=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),b=c.nlp_signals.semantic_decoding.source_binding;
 const source=ids=>ids.map(i=>{const s=sm.get(i);assert(s);assert.equal([...c.source.raw_text].slice(s.start,s.end).join(''),s.text);return s;});
 for(const a of b.referents){const mention=ns.get(a.mention_node_id),facts=c.boundary_ir.facts.filter(f=>f.object_node_ids.includes(a.mention_node_id)||a.collection_node_id&&f.object_node_ids.includes(a.collection_node_id));let scope;
  if(a.status==='CERTIFIED_REFERENT_SET'){const n=ns.get(a.collection_node_id);scope=c.boundary_ir.set_expr_nodes.find(s=>s.expr_id===a.scope_expr_id);assert(scope&&scope.base_entity_node_id===n.node_id&&['ANY','ALL'].includes(scope.kind));assert.equal(n.metadata.cardinality,a.selected_member_node_ids.length);assert(a.selected_member_node_ids.length>0&&a.candidate_sets.length===1);assert.deepEqual(n.metadata.member_node_ids,a.selected_member_node_ids);}
  if(a.status==='UNRESOLVED_REFERENT_SET')assert(!facts.some(f=>f.state==='RESOLVED'));
  referents.push({case_id:x.case_id,trace_path:x.trace_path,trace_sha256:digest(x.trace_path),certificate:a,mention,source:source(a.source_span_ids),facts,scope,selected_members:(a.selected_member_node_ids??[]).map(i=>ns.get(i))});
 }
 for(const a of b.conditions){const facts=c.boundary_ir.facts.filter(f=>f.predicate_node_id===a.predicate_node_id);if(a.status==='CERTIFIED_CONDITIONAL')assert(facts.filter(f=>f.state==='RESOLVED').every(f=>f.condition_expr_id===a.condition_expr_id));if(a.status==='UNRESOLVED_CONDITION_BINDING')assert(!facts.some(f=>f.state==='RESOLVED'));
  conditions.push({case_id:x.case_id,trace_path:x.trace_path,trace_sha256:digest(x.trace_path),certificate:a,predicate:ns.get(a.predicate_node_id),source:source(a.source_span_ids),facts,condition_expr:a.condition_expr_id?c.boundary_ir.condition_expr_nodes.find(e=>e.expr_id===a.condition_expr_id):null});
 }
}
write(out+'R1-REFERENT-SET-AUDIT-'+rev+'.json',{task:'7P-COMPOSITION-013',stage:'R1',not_a_Gold_comparison:true,rows:referents});write(out+'R1-CONDITION-BINDING-AUDIT-'+rev+'.json',{task:'7P-COMPOSITION-013',stage:'R1',not_a_Gold_comparison:true,rows:conditions});console.log(JSON.stringify({referents:referents.length,conditions:conditions.length}));
