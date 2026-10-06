import {RELATION_CONTRACT as frozen} from '../v0.3-7p-composition-014/relations.mjs';
import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
export const RELATION_CONTRACT=Object.freeze({...frozen,PART_OF:Object.freeze({head_node_types:['ENTITY'],tail_node_types:['ENTITY'],directionality:'HEAD_TO_TAIL',cardinality_hints:'one certified immediate container',allowed_unresolved_states:['UNRESOLVED','REJECTED']})});
export function installPartOf(f){
 const prior=f.tools.relation,nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 f.semantic_decoding.part_of_contract={version:'NORMATIVE_PART_OF_CANDIDATE_R1',certificates:[],rejected:[]};
 f.tools.relation=(cl,type,head,tail,extra=[])=>{
  if(type!=='PART_OF')return prior(cl,type,head,tail,extra);
  const spec=RELATION_CONTRACT.PART_OF,log=f.semantic_decoding.part_of_contract;
  if(!head||!tail||!spec.head_node_types.includes(head.node_type)||!spec.tail_node_types.includes(tail.node_type)||head.node_id===tail.node_id){log.rejected.push({reason:'ILLEGAL_PART_OF_SIGNATURE',head:head?.node_id,tail:tail?.node_id});return;}
  const a=f.analyses.find(a=>a.cl.id===cl.id),reference=head.metadata.local_reference;
  const candidates=[...new Map(f.relations.filter(r=>r.state==='RESOLVED'&&r.relation_type==='PATIENT'&&nm(r.head_node_id)?.metadata.sense==='read'&&f.analyses.find(x=>x.cl.id===r.clause_id)?.cl.sentence_id===a?.cl.sentence_id&&sp(nm(r.tail_node_id)).start<sp(head).start&&nm(r.tail_node_id)?.metadata.literal_tag==='FILEPATH').map(r=>{const n=nm(r.tail_node_id);return [n.metadata.artifact_identity??n.surface,n];})).values()];
  const section=head.metadata.output_section_certificate;
  const local=reference?.referent_node_id===tail.node_id&&candidates.length===1&&candidates[0].node_id===tail.node_id&&/^(?:其中|all\b|every\b)/iu.test(head.surface);
  const output=section?.owner_output_id===tail.node_id&&section.explicit_syntax&&f.relations.some(r=>r.state==='RESOLVED'&&r.relation_type==='RESULT'&&r.tail_node_id===tail.node_id);
  if(!local&&!output){log.rejected.push({reason:'NO_EXPLICIT_IMMEDIATE_COMPOSITION_CERTIFICATE',head:head.node_id,tail:tail.node_id,candidate_ids:candidates.map(n=>n.node_id)});return;}
  const key=id(f.source.sha256,'relation',cl.id,type,head.node_id,tail.node_id),certificate_id=id(key,'certificate'),evidence=uniq([...head.source_span_ids,...tail.source_span_ids,...extra]);
  let r=f.relations.find(r=>r.relation_id===key);if(!r){r={relation_id:key,clause_id:cl.id,relation_type:type,head_node_id:head.node_id,tail_node_id:tail.node_id,evidence_span_ids:evidence,evidence_tier:'HARD',state:'RESOLVED',model_signal_refs:[],rule_refs:['NORMATIVE_PART_OF_EXPLICIT_DOMAIN',certificate_id]};f.relations.push(r);}
  if(!log.certificates.some(c=>c.certificate_id===certificate_id))log.certificates.push({certificate_id,relation_id:key,rule:local?'EXPLICIT_SAME_SENTENCE_UNIQUE_READ_CONTAINER':'EXPLICIT_OUTPUT_SECTION_OWNERSHIP',candidate_ids:local?candidates.map(n=>n.node_id):[tail.node_id],attachment_path:[...(a?.discourse?.structural_path??[]),cl.id,head.node_id,tail.node_id],source_span_ids:evidence});return r;
 };
 return f;
}
export function relationTypeAudit(c){const ns=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),certs=c.nlp_signals.semantic_decoding.part_of_contract.certificates;const invalid=c.relations.filter(r=>{const s=RELATION_CONTRACT[r.relation_type];return !s||!s.head_node_types.includes(ns.get(r.head_node_id)?.node_type)||!s.tail_node_types.includes(ns.get(r.tail_node_id)?.node_type)||r.relation_type==='PART_OF'&&r.state==='RESOLVED'&&!certs.some(x=>x.relation_id===r.relation_id&&x.source_span_ids.length&&x.candidate_ids.length===1);});return {status:invalid.length?'FAIL':'PASS',illegal_relation_type_signatures:invalid.length,invalid,PART_OF_count:c.relations.filter(r=>r.relation_type==='PART_OF'&&r.state==='RESOLVED').length};}
