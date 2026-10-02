import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir='docs/reports/7plus1/7P-REPAIR-004';
const read=p=>JSON.parse(fs.readFileSync(p));
const records=[];
for(const run of read(dir+'/PARSER-RUNS.json')){
 const c=read(run.trace_path).compiler_v03, audit=c.nlp_signals.semantic_decoding.structured_recovery;
 const nodes=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 const relations=new Map(c.relations.map(r=>[r.relation_id,r]));
 for(const f of c.boundary_ir.facts){
  const tableNodes=f.node_ids.map(i=>nodes.get(i)).filter(n=>n?.metadata.discourse?.kind==='TABLE');
  if(!tableNodes.length)continue;
  const rowProof=f.fact_type==='BASELINE'&&f.relation_ids.length>0&&f.relation_ids.every(id=>audit.references.some(x=>x.relation_id===id&&x.structural_proof?.kind==='TABLE_ROW_PROPOSITION'&&x.structural_proof.source_span_ids.length>=3));
  const event=nodes.get(f.predicate_node_id);
  const proof=audit.completion.find(x=>x.event_node_id===event?.node_id&&x.condition_expr_id===f.condition_expr_id);
  const completionProof=f.fact_type==='COMPLETION'&&event?.metadata.sense==='ACCEPTANCE_COMPLETION'&&event.metadata.discourse?.kind==='ACCEPTANCE'&&proof?.structural_path?.length>0&&tableNodes.every(n=>n.metadata.sense==='ACCEPTANCE_CRITERION'&&n.metadata.owner===event.metadata.owner&&proof.criterion_node_ids.includes(n.node_id)&&n.metadata.table_provenance?.header_source_span_ids?.length>0&&n.metadata.discourse.cells.some(cell=>cell.cell_id===n.metadata.table_provenance.cell_id&&cell.column_id===n.metadata.table_provenance.column_id))&&f.relation_ids.length===proof.criterion_node_ids.length&&f.relation_ids.every(id=>{const r=relations.get(id);return r?.relation_type==='COMPLETION_OF'&&r.tail_node_id===event.node_id&&proof.criterion_node_ids.includes(r.head_node_id)&&r.evidence_span_ids.length>=2;});
  records.push({sample_id:run.sample_id,boundary_fact_id:f.boundary_fact_id,fact_type:f.fact_type,table_node_ids:tableNodes.map(n=>n.node_id),proof_kind:rowProof?'TABLE_ROW_PROPOSITION':completionProof?'STRUCTURED_ACCEPTANCE_COMPLETION':'UNSUPPORTED',direct_cell_promotion:!(rowProof||completionProof),evidence:rowProof?audit.references.filter(x=>f.relation_ids.includes(x.relation_id)):proof});
 }
}
assert(records.some(r=>r.sample_id==='SWAI-003'&&r.proof_kind==='TABLE_ROW_PROPOSITION'));
const result={status:records.every(r=>!r.direct_cell_promotion)?'PASS':'FAIL',records,rule:'Table-origin nodes require complete row proposition or acceptance aggregation proof, including owner, criterion, header/cell, relation and condition provenance. Mere table-cell presence cannot justify a Boundary Fact.'};
fs.writeFileSync(dir+'/TABLE-PROMOTION-AUDIT.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(result.status,records.map(r=>[r.sample_id,r.proof_kind]));
