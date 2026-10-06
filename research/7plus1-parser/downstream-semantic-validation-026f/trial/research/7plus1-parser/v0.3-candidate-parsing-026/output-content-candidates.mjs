import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
const length=s=>[...s].length;
// Output clauses are predicates over an authored artifact, not instructions
// to execute the described predicates. Ownership is a candidate domain.
export function outputContentCandidates(f){
 f.proposals.provider='OUTPUT_CONTENT_OWNER_CANDIDATES';
 const sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]),nm=i=>f.semantic_nodes.find(n=>n.node_id===i);
 const ledger=f.semantic_decoding.structural_state_alternatives;
 for(const a of f.analyses){const raw=a.cl.span.quote;
  if(ledger.some(d=>d.clause_id===a.cl.id&&d.kind==='OUTPUT_CONTENT_REQUIREMENT'))continue;
  const declaration=/^(?:该|此|最终|the\s+)?(?:报告|文档|说明书|report|document)\s*(?:必须|应|须|需要|must|shall)?\s*(?:列出|包含|包括|说明|记录|写明|标记|contain|include|state|list|record)/iu.exec(raw);
  const locative=/(?:在|于)(?:该|此)?(?:报告|文档)(?:中|内)/u.exec(raw),classification=/(?:标记|记录|注明)(?:为|成)?\s*(?:[“"]|待确认|未证实|不足|缺失)|(?:应|须|必须)\s*列入(?:该|此)?报告/u.exec(raw),domain=a.discourse.kind==='OUTPUT_CONTENT'||a.discourse.kind==='QUOTE'&&f.discourse.authoring_document;
  if(!declaration&&!locative&&!domain&&!classification)continue;
  const marker=declaration??locative??classification,textBefore=marker?raw.slice(0,marker.index+marker[0].length):raw.slice(0,Math.max(0,raw.search(/[“"]/u)));
  const state=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'OUTPUT_CONTENT_REQUIREMENT',owner:a.cl.id,discourse:a.discourse,syntactic_layer:'OUTPUT_CONTENT',content_modality:/不得|禁止|must not/iu.test(textBefore)?'FORBIDDEN':/必须|应|须|must|shall/iu.test(textBefore)?'REQUIRED':'UNSTATED',content_marker_evidence:{rule:declaration?'EXPLICIT_OUTPUT_SUBJECT_CONTENT_PREDICATE':locative?'EXPLICIT_DOCUMENT_LOCATIVE_CONTENT':'INHERITED_DOCUMENT_CONTENT_DOMAIN',source_span_ids:[a.sid],structural_path:a.discourse.structural_path}});
  const quotes=[...raw.matchAll(/[“"]([^”"]+)[”"]/gu)],ranges=quotes.length?quotes.map(m=>({start:a.cl.span.start+length(raw.slice(0,m.index+1)),end:a.cl.span.start+length(raw.slice(0,m.index+1+m[1].length))})):[{start:a.cl.span.start,end:a.cl.span.end}];
  const members=ranges.map(s=>f.tools.node(a.cl,'ENTITY',s.start,s.end,{sense:'OUTPUT_CONTENT_MEMBER',owner:state.node_id,discourse:a.discourse,argument_role:'CONTENT_MEMBER'}));
  const resultDomain=f.relations.filter(r=>r.relation_type==='RESULT'&&sp(nm(r.tail_node_id)).end<a.cl.span.start&&f.analyses.find(b=>b.cl.id===r.clause_id)?.discourse.owner_structure_id===a.discourse.owner_structure_id);
  const outputs=[...new Map(resultDomain.map(r=>[nm(r.tail_node_id).metadata.artifact_identity??nm(r.tail_node_id).surface,nm(r.tail_node_id)])).values()],relationIds=[];
  for(const output of outputs)for(const member of members){const r=f.tools.relation(a.cl,'PART_OF',member,output,[a.sid,...state.source_span_ids,...output.source_span_ids]);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_OUTPUT_SECTION_OWNERSHIP_CANDIDATE',state_node_id:state.node_id,candidate_owner_ids:outputs.map(n=>n.node_id),source_span_ids:r.evidence_span_ids,structural_path:[a.discourse.owner_structure_id,a.cl.id,output.metadata.clause_id]});r.immediate_container_candidate={rule:'EXPLICIT_OUTPUT_CONTENT_OWNERSHIP',candidate_ids:outputs.map(n=>n.node_id),source_span_ids:r.evidence_span_ids,attachment_path:[a.discourse.owner_structure_id,a.cl.id,output.metadata.clause_id]};relationIds.push(r.relation_id);}
  ledger.push({clause_id:a.cl.id,state_node_id:state.node_id,range:{start:a.cl.span.start,end:a.cl.span.end},kind:'OUTPUT_CONTENT_REQUIREMENT',source_span_ids:uniq([a.sid,...state.source_span_ids]),candidate_owner_ids:outputs.map(n=>n.node_id),member_node_ids:members.map(n=>n.node_id),relation_ids:relationIds});
 }
 return f;
}
