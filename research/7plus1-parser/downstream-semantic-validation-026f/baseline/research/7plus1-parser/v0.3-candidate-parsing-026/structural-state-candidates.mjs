import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {expressionCandidate as expr,expressionPlanCandidate as plan} from './expression-api.mjs';
const length=s=>[...s].length;
// State alternatives for explicit nominal declarations. No prior candidate is
// retired, no relation state is assigned and no antecedent is selected here.
export function structuralStateCandidates(f){
 f.proposals.provider='STRUCTURAL_STATE_ALTERNATIVES';
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]),ledger=[];
 f.semantic_decoding.structural_state_alternatives=ledger;
 for(const a of f.analyses){
  const raw=a.cl.span.quote,budget=/^(.*?)\s*(?:最多|至多|不超过|at most|no more than)\s*(?:尝试|重试|attempts?|retries?)?\s*\d+\s*(?:次|times?|attempts?)/iu.exec(raw),negative=/^(.+?)\s*(?:不负责|不参与|does not|is not)\s*(.+)$/iu.exec(raw),unspecified=/(?:没有|未)(?:规定|说明|指定)|(?:explicitly\s+)?unspecified|not\s+(?:specified|defined|stated)/iu.test(raw),connectorDoubt=unspecified&&/任一|individual|\bany\b/iu.test(raw)&&/共同|joint|\ball\b|\bboth\b/iu.test(raw),correspondence=connectorDoubt||/(?:原文|来源|文本|source|text).*(?:没有|未|不|not).*(?:指定|说明|指向|specified|referent)|未指定(?:采用|最终)|no unique referent/iu.test(raw),scopeHeader=/^(?:范围|输入|inputs?|scope)\s*(?:包括|包含|为|:|：|include|includes|is|are)/iu.exec(raw);
  if(budget||negative||correspondence){
   const n=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:budget?'EXECUTION_BUDGET_DECLARATION':negative?'NEGATIVE_RESPONSIBILITY_DECLARATION':'SOURCE_CORRESPONDENCE_UNSPECIFIED',owner:a.cl.id,discourse:a.discourse,syntax_marker_evidence:{source_span_ids:[a.sid],marker:budget?.[0]??negative?.[0]??raw},syntactic_layer:'DECLARATION',source_ambiguity:correspondence,negative_roles:negative?(/审批|批准|approv/iu.test(negative[2])?['APPROVER']:[]):[]});
   ledger.push({clause_id:a.cl.id,state_node_id:n.node_id,range:{start:a.cl.span.start,end:a.cl.span.end},kind:n.metadata.sense,source_span_ids:[a.sid]});
   if(connectorDoubt)n.metadata.unspecified_connector_domain={alternatives:['ANY','ALL'],source_span_ids:[a.sid],structural_path:[a.parent_structure_id,a.cl.id]};
   const r=f.tools.relation(a.cl,'CONJUNCTION',n,f.tools.task,[a.sid]);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_NOMINAL_DECLARATION',source_span_ids:[a.sid]});
   if(negative){const subjectText=negative[1].trim(),at=a.cl.span.start+length(raw.slice(0,raw.indexOf(subjectText))),subject=f.tools.node(a.cl,'ENTITY',at,at+length(subjectText),{sense:'EXPLICIT_ROLE_DECLARATION_SUBJECT',owner:n.node_id,discourse:a.discourse,authority_inferred:false});n.metadata.negative_role_subject_id=subject.node_id;const link=f.tools.relation(a.cl,'CONJUNCTION',n,subject,[a.sid]);link.generic_evidence??=[];link.generic_evidence.push({rule:'NEGATIVE_ROLE_DECLARATION_SUBJECT',source_span_ids:[a.sid,...subject.source_span_ids]});}
   if(budget){const domain=f.semantic_nodes.filter(e=>e.node_type==='EVENT'&&e.metadata.sense==='review'&&['REQUIRED','PERMITTED'].includes(e.metadata.modality)&&sp(e).end<a.cl.span.start&&f.analyses.find(b=>b.cl.id===e.metadata.clause_id)?.parent_structure_id===a.parent_structure_id);n.metadata.quantity_target_candidates=uniq(domain.map(e=>e.node_id));}
  }
  const scopeMarker=scopeHeader??/^(?:重点\s*)?覆盖/u.exec(raw);
  if(scopeMarker){const n=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'EXPLICIT_SCOPE_DECLARATION',owner:a.cl.id,discourse:a.discourse,syntactic_layer:'DECLARATION',marker_span_id:f.tools.span(a.cl.span.start,a.cl.span.start+length(scopeMarker[0]))});ledger.push({clause_id:a.cl.id,state_node_id:n.node_id,range:{start:a.cl.span.start,end:a.cl.span.end},kind:n.metadata.sense,source_span_ids:[a.sid]});}
  const include=a.cl.tokens.find(t=>/^(包含|包括|contain|contains|include|includes)$/iu.test(t.text)),quotes=[...raw.matchAll(/[“"]([^”"]+)[”"]/gu)];
  if(include&&quotes.length&&/(章节|部分|sections?|parts?)/iu.test(raw)){
   const s=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'OUTPUT_CONTENT_REQUIREMENT',owner:a.cl.id,discourse:a.discourse,syntactic_layer:'OUTPUT_CONTENT',source_predicate_span_id:f.tools.span(include.start,include.end),content_modality:/不得|禁止|must not/iu.test(raw)?'FORBIDDEN':/必须|须|must|shall/iu.test(raw)?'REQUIRED':'UNSTATED'});
   const members=quotes.map(m=>{const start=a.cl.span.start+length(raw.slice(0,m.index+1));return f.tools.node(a.cl,'ENTITY',start,start+length(m[1]),{sense:'OUTPUT_SECTION',owner:s.node_id,discourse:a.discourse,argument_role:'CONTENT_MEMBER'});});
   const domain=[...new Map(f.relations.filter(r=>r.relation_type==='RESULT'&&sp(nm(r.tail_node_id)).end<a.cl.span.start&&f.analyses.find(b=>b.cl.id===r.clause_id)?.parent_structure_id===a.parent_structure_id).map(r=>[r.tail_node_id,nm(r.tail_node_id)])).values()];
   const alternatives=[];
   for(const target of domain)for(const member of members){const r=f.tools.relation(a.cl,'PART_OF',member,target,[a.sid,...s.source_span_ids,...target.source_span_ids]);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_OUTPUT_SECTION_OWNERSHIP_CANDIDATE',state_node_id:s.node_id,candidate_owner_ids:domain.map(n=>n.node_id),source_span_ids:[a.sid,...s.source_span_ids,...target.source_span_ids],structural_path:[a.parent_structure_id,a.cl.id,target.metadata.clause_id]});r.immediate_container_candidate={rule:'EXPLICIT_OUTPUT_SECTION_OWNERSHIP',candidate_ids:domain.map(n=>n.node_id),source_span_ids:r.evidence_span_ids,attachment_path:[a.parent_structure_id,a.cl.id,target.metadata.clause_id]};alternatives.push(r.relation_id);}
   ledger.push({clause_id:a.cl.id,state_node_id:s.node_id,range:{start:a.cl.span.start,end:a.cl.span.end},kind:s.metadata.sense,source_span_ids:[a.sid],candidate_owner_ids:domain.map(n=>n.node_id),member_node_ids:members.map(n=>n.node_id),relation_ids:alternatives});
  }
 }
 return f;
}
