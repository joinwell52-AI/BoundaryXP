import {id,uniq} from './util.mjs';
import {linkQuote} from './source-linker.mjs';
export function candidateGraph(source,proposal,audit){
 const spans=new Map(),alignments=[],objects=[];
 for(const [origin,set]of [['LLM_PRIMARY',proposal],['LLM_COVERAGE_AUDIT',audit.additional_candidates]])for(const [family,list]of Object.entries(set).filter(([k])=>['nodes','relations','expressions','unresolved'].includes(k)))for(const item of list){
  const links=item.sources.map(ref=>{const r=linkQuote(source,ref);alignments.push({candidate_id:item.id,origin,reference:ref,...r});if(r.span)spans.set(r.span.span_id,r.span);return r;});
  objects.push({...structuredClone(item),family,origin,candidate_status:'PROPOSED',source_span_ids:uniq(links.filter(r=>r.span).map(r=>r.span.span_id)),alignment_errors:links.filter(r=>r.status!=='ALIGNED'),empty_source:links.length===0});
 }
 const findings=audit.findings.map(f=>({...f,source_links:f.sources.map(r=>linkQuote(source,r))}));
 const checks=audit.checks.map(c=>({...c,source_links:c.sources.map(r=>linkQuote(source,r))}));
 const root={id:'TASK',type:'TASK',semantic_identity:'ADMIN_SOURCE_ROOT',family:'nodes',origin:'DETERMINISTIC_SOURCE_RULE',candidate_status:'PROPOSED',source_span_ids:[],alignment_errors:[],empty_source:false,layer:'MAIN',modality:'UNSTATED'};
 return {graph_id:id(source.sha256,'candidate-graph'),source_sha256:source.sha256,source,structure_status:proposal.structure_status,nodes:[root,...objects.filter(o=>o.family==='nodes')],relations:objects.filter(o=>o.family==='relations'),expressions:objects.filter(o=>o.family==='expressions'),unresolved:objects.filter(o=>o.family==='unresolved'),source_spans:[...spans.values()],parser_coverage:proposal.coverage,auditor_coverage:audit.coverage,auditor_checks:checks,auditor_findings:findings,source_alignments:alignments,pre_gamma_final_adjudication:{retire:0,reject:0,resolve:0,unresolved_delete:0}};
}
