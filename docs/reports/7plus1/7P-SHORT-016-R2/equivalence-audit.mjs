// Offline, task-scoped ADMIN adjudication. Never imported by the parser.
import {isDeepStrictEqual as equal} from 'node:util';
import {signatures} from './signatures.mjs';
const authority='docs/tasks/7plus1/7P-SHORT-016-R2-REF001-ADMIN-ADJUDICATION.md';
export function assessEntry(actual,expected,proof){
 const a=structuredClone(actual),e=structuredClone(expected);
 if(equal(a,e))return {accepted:true,classification:'EXACT_SEMANTIC_MATCH'};
 if(a.facts.length!==1||e.facts.length!==1||!proof?.same_owner)return {accepted:false};
 const x=a.facts[0],y=e.facts[0];
 if(x.type==='ACTION'&&y.type==='ACTION'&&y.scope===null&&x.scope?.kind==='ITEM'&&x.objects.length===1&&x.scope.entity===x.objects[0]&&proof.item_same_object_relation){
  const scope=x.scope;x.scope=null;
  if(equal(a,e))return {accepted:true,classification:'EQUIVALENT_ENRICHMENT',kind:'ITEM_SAME_OBJECT',scope,authority:authority+' §D'};
 }
 if(x.type==='COMPLETION'&&y.type==='COMPLETION'&&x.subjects.length===0&&y.subjects.length===1&&proof.rejected_inherited_completion_actor&&proof.completion_source_no_person&&x.condition?.kind==='AND'&&x.condition.operands.length>=2&&x.predicate.condition_strength==='NECESSARY_ONLY'&&x.condition.operands.some(o=>o.state?.condition_strength==='NECESSARY_ONLY')){
  // This is an explicit ADMIN contract override, NOT identity equivalence.
  // Keep the frozen Gold discrepancy visible in the report.
  const removed=y.subjects;y.subjects=[];delete x.predicate.condition_strength;
  if(equal(a,e))return {accepted:true,classification:'ADMIN_ADJUDICATED_NON_EXECUTION_SUBJECT',removed_legacy_subject:removed,necessary_annotation:'Same necessary strength already retained in the identical condition operand',authority:authority+' §B/§C',raw_gold_match:false};
 }
 return {accepted:false,classification:'GENUINE_SEMANTIC_MISMATCH'};
}
export function auditEquivalence(trace,expected,control){
 const c=trace.compiler_v03,as=signatures(c),es=signatures(expected),ns=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 const surf=i=>ns.get(ns.get(i)?.metadata.referent_node_id??i)?.surface;
 const rows=[];
 for(const slot of ['I','O','A','P','R','V','C','B']){
  const remaining=es[slot].entries.map(JSON.parse),entries=[];
  for(const [index,entry] of c.canonical_7plus1[slot].entries.entries()){
   // Signatures are sorted; identify the signature via this entry's facts in
   // an isolated view, preserving the exact fact IDs separately as evidence.
   const view={...c,canonical_7plus1:{...c.canonical_7plus1,[slot]:{...c.canonical_7plus1[slot],entries:[entry]}}};
   const a=JSON.parse(signatures(view)[slot].entries[0]),facts=entry.boundary_fact_ids.map(id=>c.boundary_ir.facts.find(f=>f.boundary_fact_id===id)),f=facts[0],n=ns.get(f?.predicate_node_id),scope=c.boundary_ir.set_expr_nodes.find(x=>x.expr_id===f?.scope_expr_id),old=control.semantic_nodes.find(x=>x.node_id===n?.node_id),cl=c.nlp_signals.clauses.find(x=>x.id===n?.metadata.clause_id);
   const rejects=c.nlp_signals.semantic_decoding.anchor_contracts.subjects.filter(s=>s.event_node_id===n?.node_id&&s.decision==='REJECT'&&s.reason==='COMPLETION_NOT_EXECUTION'&&!s.explicit);
   const proof={same_owner:Boolean(n?.metadata.semantic_ownership?.semantic_owner_id&&n.metadata.semantic_ownership.semantic_owner_id===old?.metadata.semantic_ownership?.semantic_owner_id),item_same_object_relation:Boolean(n&&scope?.kind==='ITEM'&&f.object_node_ids.length===1&&scope.entity_node_id===f.object_node_ids[0]&&scope.relation_ids.some(id=>c.relations.some(r=>r.relation_id===id&&r.head_node_id===n.node_id&&r.tail_node_id===scope.entity_node_id&&r.state==='RESOLVED'&&['PATIENT','RESULT','THEME'].includes(r.relation_type)))),rejected_inherited_completion_actor:rejects.length===1&&!c.relations.some(r=>r.head_node_id===n?.node_id&&r.relation_type==='AGENT'&&r.state!=='REJECTED'),completion_source_no_person:Boolean(cl&&cl.entities.every(e=>!['PERSON','PER'].includes(e.label))&&!cl.tokens.some(t=>['NR','PROPN'].includes(t.pos))),owner:n?.metadata.semantic_ownership,control_owner:old?.metadata.semantic_ownership,scope,source_clause:cl,subject_rejection:rejects,fact_ids:entry.boundary_fact_ids,source_spans:trace.source_spans.filter(s=>f?.source_span_ids.includes(s.span_id))};
   let match=-1,decision;
   // Exact match first, then narrowly proved enrichment/adjudication.
   match=remaining.findIndex(e=>equal(a,e));
   if(match>=0)decision=assessEntry(a,remaining[match],proof);
   else for(let i=0;i<remaining.length;i++){const d=assessEntry(a,remaining[i],proof);if(d.accepted){match=i;decision=d;break;}}
   const e=match>=0?remaining.splice(match,1)[0]:null;
   entries.push({index,entry_id:entry.entry_id,actual:a,expected:e,decision:decision??{accepted:false,classification:'UNMATCHED_ACTUAL'},evidence:decision?.classification==='EXACT_SEMANTIC_MATCH'?{fact_ids:entry.boundary_fact_ids}:proof});
  }
  rows.push({slot,raw_match:equal(as[slot],es[slot]),status_match:as[slot].status===es[slot].status,actual_status:as[slot].status,expected_status:es[slot].status,entries,missing:remaining,pass:as[slot].status===es[slot].status&&entries.every(e=>e.decision.accepted)&&remaining.length===0});
 }
 return {authority,scope:'Offline REF-001 adjudication only; original comparator, Source and Gold unchanged',raw_gold_match:rows.every(r=>r.raw_match),status:rows.every(r=>r.pass)?'CLOSED_UNDER_R2_ADMIN_ADJUDICATION':'NOT_CLOSED',representation_enrichments:rows.flatMap(r=>r.entries.filter(e=>e.decision.classification==='EQUIVALENT_ENRICHMENT')),explicit_admin_contract_overrides:rows.flatMap(r=>r.entries.filter(e=>e.decision.classification==='ADMIN_ADJUDICATED_NON_EXECUTION_SUBJECT')),slots:rows};
}
