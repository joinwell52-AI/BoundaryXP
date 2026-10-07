import {signatures} from './contracts.mjs';
import {id,uniq} from './util.mjs';
const outside=new Set(['BACKGROUND','QUOTE','CODE','OUTPUT_CONTENT','ATTRIBUTE','PURPOSE_COMPLEMENT','COMPLEMENT']);
export function certify(graph,nlp,{require_auditor_support=true}={}){
 const all=[...graph.nodes,...graph.relations,...graph.expressions],map=new Map(all.map(c=>[c.id,c])),decisions=[],byId=new Map(),stack=new Set();
 const duplicates=all.filter((c,i)=>all.findIndex(v=>v.id===c.id)!==i).map(c=>c.id);
 const findings=graph.auditor_findings;
 const altGroups=new Map();for(const c of all)if(c.alternative_group_id){if(!altGroups.has(c.alternative_group_id))altGroups.set(c.alternative_group_id,[]);altGroups.get(c.alternative_group_id).push(c.id);}
 function decide(c){
  if(byId.has(c.id))return byId.get(c.id);
  if(stack.has(c.id))return {decision:'TYPED_UNRESOLVED',reason:'CYCLIC_DEPENDENCY'};
  stack.add(c.id);const failures=[];
  const fail=(rule,kind='TYPED_UNRESOLVED')=>failures.push({rule,kind});
  if(duplicates.includes(c.id))fail('UNIQUE_GRAPH_ID','REJECTED');
  if(c.empty_source||c.alignment_errors.length)fail('EXACT_SOURCE_GROUNDING',c.alignment_errors.some(e=>e.status==='AMBIGUOUS_ALIGNMENT')?'TYPED_UNRESOLVED':'REJECTED');
  const checks=graph.auditor_checks.filter(x=>x.candidate_id===c.id);
  if(checks.some(x=>x.verdict==='CONTRADICT'))fail('INDEPENDENT_AUDITOR_CONTRADICTION');
  if(findings.some(f=>f.candidate_ids.includes(c.id)&&f.kind!=='MISSED_SEMANTICS'))fail('UNRESOLVED_BOUNDARY_CHANGING_AUDIT_FINDING');
  if(nlp.evidence.some(e=>e.candidate_id===c.id&&e.signal==='CONTRADICT'))fail('NLP_STRONG_CONTRADICTION');
  if(require_auditor_support&&c.id!=='TASK'&&!checks.some(x=>x.verdict==='SUPPORT'&&x.source_links.length&&x.source_links.every(s=>s.status==='ALIGNED'))&&!nlp.evidence.some(e=>e.candidate_id===c.id&&e.signal==='SUPPORT'))fail('NO_INDEPENDENT_SEMANTIC_SUPPORT');
  if(c.alternative_group_id&&(altGroups.get(c.alternative_group_id)?.length??0)>1)fail('UNCLOSED_COMPETITION');
  if(graph.unresolved.some(u=>u.alternatives.includes(c.id)))fail('DECLARED_SOURCE_AMBIGUITY');
  const depend=ref=>{const target=map.get(ref);if(!target){fail('DANGLING_GRAPH_ENDPOINT','REJECTED');return null;}if(decide(target).decision!=='CERTIFIED')fail('UNCERTIFIED_DEPENDENCY');return target;};
  if(c.family==='nodes'){
   if(c.type==='UNKNOWN_REFERENT')fail('UNKNOWN_REFERENT');
   if(c.owner&&c.owner!=='TASK')depend(c.owner);
   if(c.type==='EVENT'&&c.modality!=='UNSTATED'&&outside.has(c.layer)){
    // Preserve the mentioned event as certified auxiliary semantics; eligibility
    // refuses to promote it. No predicate/word parsing happens here.
   }
  }else if(c.family==='relations'){
   const h=depend(c.head),t=depend(c.tail),typeOf=o=>o?.family==='expressions'?(o.kind==='CONDITION'?'CONDITION_EXPR':o.kind):o?.type,sig=signatures[c.type];
   if(!sig||!sig[0].includes(typeOf(h))||!sig[1].includes(typeOf(t)))fail('FINITE_RELATION_TYPE_SIGNATURE','REJECTED');
   if(c.ownership==='UNRESOLVED')fail('ARGUMENT_OWNERSHIP_UNRESOLVED');
   if(['AGENT','RECIPIENT'].includes(c.type)&&!['PERSON','ROLE','GROUP'].includes(t?.entity_kind))fail('PARTICIPANT_TYPE_ELIGIBILITY','REJECTED');
   if(c.type==='AGENT'&&c.role==='NONE')fail('SOURCE_DEFINED_PARTICIPANT_ROLE_MISSING');
   if(c.type==='RESULT'&&!['GENERATED_OUTPUT','UPDATED_OUTPUT','CONDITIONAL_OUTPUT'].includes(t?.artifact_use))fail('OUTPUT_ARTIFACT_ROLE_UNPROVEN');
   if(['PATIENT','THEME'].includes(c.type)&&['REFERENCE_ONLY','GENERATED_OUTPUT','CONDITIONAL_OUTPUT'].includes(t?.artifact_use))fail('AFFECTED_MATERIAL_ROLE_CONFLICT');
   if(c.type==='COREFERENCE'){
    const candidates=graph.relations.filter(r=>r.type==='COREFERENCE'&&r.head===c.head);if(uniq(candidates.map(r=>r.tail)).length!==1)fail('COREFERENCE_NOT_UNIQUE');
   }
   if(c.type==='CONDITION_OF'&&t?.family==='nodes'&&['BACKGROUND','QUOTE','OUTPUT_CONTENT'].includes(t.layer))fail('CONDITION_DOMAIN_MISMATCH');
   const witness=ref=>map.get(ref)?.source_span_ids??[];
   if(c.head!=='TASK'&&!witness(c.head).length||c.tail!=='TASK'&&!witness(c.tail).length)fail('CROSS_ENDPOINT_SOURCE_PROVENANCE','REJECTED');
  }else if(c.family==='expressions'){
   const owner=depend(c.owner);
   for(const ref of c.operands)depend(ref);
   if(!c.operands.length&&c.kind!=='QUANTITY')fail('EMPTY_EXPRESSION_OPERANDS');
   const allowed={SCOPE:['ITEM','ALL','ANY','UNION','INTERSECTION','EXCEPT'],CONDITION:['STATE_REF','RELATION_REF','AND','OR','NOT'],QUANTITY:['EQ','LT','LTE','GT','GTE'],COREFERENCE:['REFERENCE_SET']};
   if(!allowed[c.kind]?.includes(c.operator))fail('EXPRESSION_OPERATOR_SIGNATURE','REJECTED');
   if(c.quantity){if(c.kind!=='QUANTITY')fail('QUANTITY_KIND_MISMATCH','REJECTED');depend(c.quantity.target);const numbers=c.source_span_ids.flatMap(sid=>{const s=graph.source_spans.find(s=>s.span_id===sid);return graph.source.typed_spans.filter(l=>l.type==='NUMBER'&&l.span.start>=s.start&&l.span.end<=s.end).map(l=>l.normalized);});if(!numbers.includes(c.quantity.value))fail('QUANTITY_LITERAL_NOT_GROUNDED');}
   if(c.kind==='CONDITION'&&owner?.id!=='TASK'&&!graph.relations.some(r=>r.type==='CONDITION_OF'&&r.head===c.id&&r.tail===c.owner))fail('CONDITION_OWNER_RELATION_MISSING');
  }
  stack.delete(c.id);const decision=failures.some(f=>f.kind==='REJECTED')?'REJECTED':failures.length?'TYPED_UNRESOLVED':'CERTIFIED';
  const d={decision_id:id(graph.graph_id,'gamma',c.id),candidate_id:c.id,decision,reason:decision==='CERTIFIED'?'FINITE_SOURCE_TYPE_OWNERSHIP_COMPETITION_EVIDENCE_CONTRACT':failures.map(f=>f.rule).join(';'),failures,source_span_ids:c.source_span_ids,independent_support_checks:checks.map(x=>({verdict:x.verdict,reason:x.reason}))};
  byId.set(c.id,d);decisions.push(d);return d;
 }
 for(const c of all)decide(c);
 return {policy_version:'v0.4-027-p1',graph_id:graph.graph_id,decisions,certified_ids:decisions.filter(d=>d.decision==='CERTIFIED').map(d=>d.candidate_id),unresolved:decisions.filter(d=>d.decision==='TYPED_UNRESOLVED'),rejected:decisions.filter(d=>d.decision==='REJECTED'),invariants:[{name:'SOURCE_GROUNDING',purpose:'Validate exact origin, not interpret language'},{name:'FINITE_TYPE_OWNERSHIP',purpose:'Check already proposed typed endpoints/owners, no new source assertions'},{name:'COMPETITION_AND_EVIDENCE',purpose:'Prevent confidence-only selection; retain unresolved alternatives'}]};
}
