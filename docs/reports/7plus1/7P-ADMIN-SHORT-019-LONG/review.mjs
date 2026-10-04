import {OUT,read,write} from './common.mjs';
const norm=s=>String(s??'').replace(/^the\s+/iu,'').replace(/\s|[`“”"']/gu,'').toLowerCase();
export function review(oracle,r){
 const g=r.compiler_v03,ir=g.boundary_ir,nodes=new Map(g.semantic_nodes.map(n=>[n.node_id,n])),relations=g.relations.filter(x=>x.state==='RESOLVED');
 const canonical=g.canonical_7plus1, type={I:'TASK_OBJECT',O:'DELIVERABLE',A:'ACTION',P:'PARTICIPANT',R:'RESOURCE',V:'BASELINE',B:['FORBID','RESTRICT'],C:['COMPLETION','STOP']};
 const surfaces=ids=>ids.map(x=>nodes.get(x)?.surface??'').join('、');
 const equivalent=(actual,expected)=>norm(actual)===norm(expected);
 const components=s=>String(s??'').split(/\s*(?:和|与|及|、|以及|\band\b)\s*/iu).map(norm).filter(Boolean).sort();
 const sameComponents=(actual,expected)=>JSON.stringify(components(actual))===JSON.stringify(components(expected));
 const alias=(ids,expected)=>ids.some(x=>{const n=nodes.get(x);if(equivalent(n?.surface,expected))return true;return relations.some(t=>t.relation_type==='COREFERENCE'&&(t.head_node_id===x||t.tail_node_id===x)&&equivalent(nodes.get(t.head_node_id===x?t.tail_node_id:t.head_node_id)?.surface,expected));})||g.semantic_nodes.some(n=>equivalent(n.surface,expected)&&n.metadata.set_members?.length===ids.length&&n.metadata.set_members.every(i=>ids.includes(i)));
 const rows=oracle.facts.map(e=>{
  const candidates=ir.facts.filter(f=>[].concat(type[e.slot]).includes(f.fact_type));let matches=[];
  for(const f of candidates){const pred=nodes.get(f.predicate_node_id),objects=f.object_node_ids??[],subjects=f.subject_node_ids??[];
   let ok=false;
   if(['I','O'].includes(e.slot))ok=alias(objects,e.value)||objects.some(x=>norm(nodes.get(x)?.surface).includes(norm(e.value)));
   if(['A','B'].includes(e.slot)){
    const recipients=relations.filter(r=>r.head_node_id===pred?.node_id&&r.relation_type==='RECIPIENT').map(r=>r.tail_node_id);
    const flow=g.nlp_signals.semantic_decoding.participant_flow_ir?.certificates?.find(c=>c.review_event_id===pred?.node_id||c.transfer_event_id===pred?.node_id);
    const domain=g.nlp_signals.semantic_decoding.argument_domain_certificates?.find(c=>c.clause_id===pred?.metadata.clause_id&&c.selected_object_ids.length===objects.length&&c.selected_object_ids.every(i=>objects.includes(i)));
    const pluralFlow=g.nlp_signals.semantic_decoding.team_flow_ir?.flows.find(c=>c.event_node_id===pred?.node_id&&c.object_node_ids.length===2&&c.object_node_ids.every(i=>objects.includes(i))&&/两份报告/u.test(e.object));
    const implicitReport=/^(?:报告|文档|report|it)$/iu.test(e.object)&&(flow?.object_node_ids?.some(x=>objects.includes(x))||domain);
    const parts=String(e.object??'').split(e.slot==='B'?/\s*(?:和|与|及|、|以及|或|\band\b|\bor\b)\s*/iu:/\s*(?:和|与|及|、|以及|\band\b)\s*/iu).filter(Boolean);const composed=parts.length===objects.length&&parts.every(p=>alias(objects,p));
    ok=equivalent(pred?.surface,e.predicate)&&(alias(objects,e.object)||sameComponents(surfaces(objects),e.object)||composed||alias(recipients,e.object)||implicitReport||pluralFlow)&&(!e.subject||e.subject==='UNSTATED'||alias(subjects,e.subject))&&(e.slot==='B'||pred?.metadata.modality===e.modality);
   }
   if(e.slot==='P')ok=(f.participant_node_ids??[]).some(x=>equivalent(nodes.get(x)?.surface,e.subject)&&e.roles.every(role=>nodes.get(x)?.metadata.participant_roles?.includes(role)));
   if(e.slot==='V')ok=objects.some(x=>{const n=nodes.get(x);return norm(n?.surface).includes(norm(e.identifier))&&(!e.version||norm(n?.surface).includes(norm(e.version))||equivalent(n?.metadata.basis_version,e.version));});
   if(e.slot==='R'){const q=ir.quantity_expr_nodes.find(x=>x.expr_id===f.quantity_expr_id);ok=q?.metric===e.metric&&[q?.upper_bound?.value,q?.lower_bound?.value,q?.exact_value].includes(e.value)&&q.target_node_ids.length>0;}
   if(e.slot==='C'){
    const c=ir.condition_expr_nodes.find(x=>x.expr_id===f.condition_expr_id);const spans=[];const visit=q=>{if(!q)return;spans.push(...q.source_span_ids);for(const key of q.operand_expr_ids??[])visit(ir.condition_expr_nodes.find(x=>x.expr_id===key));};visit(c);
    const evidence=spans.map(key=>r.source_spans.find(s=>s.span_id===key)?.text??'');
    const kind=e.operator==='STOP'?f.fact_type==='STOP':e.operator==='COMPLETE'?f.fact_type==='COMPLETION':c?.op===e.operator;
    ok=!!c&&kind&&evidence.some(text=>norm(text).includes(norm(e.condition)));
   }
   if(ok)matches.push(f.boundary_fact_id);
  }
  return {expected:e,status:matches.length?'CANDIDATE_MATCH_REQUIRES_EVIDENCE_REVIEW':'MISSING_OR_DIFFERENT',boundary_fact_ids:matches};
 });
 return {id:oracle.id,contract:r.contract_gate_results.status,oracle_fact_count:rows.length,candidate_matches:rows.filter(x=>x.boundary_fact_ids.length).length,missing_or_different:rows.filter(x=>!x.boundary_fact_ids.length).length,rows,unresolved:g.unresolved,auxiliary_review_required:oracle.auxiliary,semantic_closure:'NOT_ESTABLISHED',note:'Candidate matcher is an inventory aid. It does not certify quantities, composed domains, condition ownership, output content or unsupported facts by substring.'};
}
if(process.argv[2]==='baseline'){
 const reviews=read(OUT+'ADMIN-SHORT-050-ORACLE.json').cases.map(o=>review(o,read(OUT+'baseline-50/'+o.id+'/trace.json')));write(OUT+'BASELINE-50-SEMANTIC-REVIEW.json',{reviews,semantic_closed:0});
 const classes={I:'I_ROLE_AND_SCOPE',O:'OUTPUT_IDENTITY',A:'PREDICATE_ARGUMENT_MODALITY',P:'PARTICIPANT_ROLE',R:'QUANTITY_TARGET',V:'BASIS_REFERENCE',C:'CONDITION_COMPLETION',B:'NEGATION_SCOPE'};
 const inventory=Object.values(classes).map(mechanism=>({mechanism,missing_or_different:reviews.flatMap(x=>x.rows.filter(r=>!r.boundary_fact_ids.length&&classes[r.expected.slot]===mechanism).map(r=>({id:x.id,expected:r.expected})))}));
 write(OUT+'SEMANTIC-GAP-INVENTORY.json',{origin:'Frozen oracle vs fresh sealed R1 graph',inventory,architecture_order:['STRUCTURE','OWNERSHIP','PREDICATE_ARGUMENT','IDENTITY_SCOPE','MODALITY_CONDITION_QUANTITY','ELIGIBILITY','PROJECTION'],auxiliary_classes:['OUTPUT_CONTENT','REVIEW_TRANSFER_FLOW','QUANTIFIER','CONDITIONAL_OUTPUT','SOURCE_ALIAS'],must_inspect_wrong_resolved:true});console.log(reviews.map(x=>`${x.id} ${x.candidate_matches}/${x.oracle_fact_count}`).join('\n'));
}
