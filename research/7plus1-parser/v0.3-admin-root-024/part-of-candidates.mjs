import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';

// Migrate the immediate-container invariant from 018 into candidate evidence.
// Unlike the old wrapper, this function never certifies a relation itself.
export function partOfCandidates(f){
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]),log={certificates:[],rejected:[]};
 f.semantic_decoding.part_of_contract=log;
 for(const r of f.relations.filter(r=>r.relation_type==='PART_OF')){
  const h=nm(r.head_node_id),t=nm(r.tail_node_id),a=f.analyses.find(a=>a.cl.id===r.clause_id),section=h?.metadata.output_section_certificate;
  const output=section?.explicit_syntax&&section.owner_output_id===t?.node_id&&f.relations.some(x=>x.state==='SUPPORTED'&&x.relation_type==='RESULT'&&x.tail_node_id===t.node_id);
  const readDomain=[...new Map(f.relations.filter(x=>x.state==='SUPPORTED'&&x.relation_type==='PATIENT'&&nm(x.head_node_id)?.metadata.sense==='read'&&f.analyses.find(b=>b.cl.id===x.clause_id)?.cl.sentence_id===a?.cl.sentence_id&&nm(x.tail_node_id)?.metadata.literal_tag==='FILEPATH'&&sp(nm(x.tail_node_id)).start<sp(h).start).map(x=>{const n=nm(x.tail_node_id);return [n.metadata.artifact_identity??n.surface,n.node_id];})).values()];
  const local=h?.metadata.local_reference?.referent_node_id===t?.node_id&&/^(其中|all\b|every\b)/iu.test(h.surface)&&readDomain.length===1&&readDomain[0]===t.node_id;
  const certificate={certificate_id:id(r.relation_id,'candidate-container'),relation_id:r.relation_id,candidate_ids:output?[t.node_id]:readDomain,rule:output?'EXPLICIT_OUTPUT_SECTION_OWNERSHIP':local?'EXPLICIT_SAME_SENTENCE_UNIQUE_READ_CONTAINER':'NO_EXPLICIT_IMMEDIATE_COMPOSITION_CERTIFICATE',attachment_path:[...(a?.discourse.structural_path??[]),r.clause_id,h.node_id,t.node_id],source_span_ids:uniq([...r.evidence_span_ids,...h.source_span_ids,...t.source_span_ids]),status:output||local?'SUPPORTED':'INSUFFICIENT'};
  r.immediate_container_candidate=certificate;log[output||local?'certificates':'rejected'].push(certificate);
 }
 return f;
}
