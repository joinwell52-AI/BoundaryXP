import {uniq} from './util.mjs';
export function coverageAudit(graph,gamma){
 const keys=new Set([...graph.nodes,...graph.relations,...graph.expressions,...graph.unresolved].map(c=>c.id)),decision=new Map(gamma.decisions.map(d=>[d.candidate_id,d.decision]));
 const rows=graph.source.regions.map(region=>{
  const a=graph.parser_coverage.filter(c=>c.region_id===region.id),b=graph.auditor_coverage.filter(c=>c.region_id===region.id),issues=[];
  if(a.length!==1||b.length!==1)issues.push('REGION_NOT_ACCOUNTED_EXACTLY_ONCE');
  const ids=uniq([...a,...b].flatMap(c=>c.candidate_ids));if(ids.some(i=>!keys.has(i)))issues.push('COVERAGE_DANGLING_CANDIDATE');
  if([...a,...b].some(c=>c.disposition==='UNPARSED'))issues.push('SOURCE_PARSER_COVERAGE_GAP');
  if(a[0]?.disposition!==b[0]?.disposition)issues.push('PARSER_AUDITOR_DISPOSITION_CONFLICT');
  if([...a,...b].some(c=>c.disposition==='BOUNDARY_SEMANTIC')&&!ids.length)issues.push('EMPTY_BOUNDARY_REGION');
  const relevant=graph.auditor_findings.filter(f=>f.source_links.some(l=>l.span&&l.span.start>=region.span.start&&l.span.end<=region.span.end));
  if(relevant.some(f=>['MISSED_SEMANTICS','COVERAGE_GAP'].includes(f.kind)))issues.push('AUDITOR_CLEAR_SEMANTIC_MISS');
  if(ids.some(i=>decision.get(i)==='REJECTED'))issues.push('REJECTED_SOURCE_SEMANTICS_NOT_ACCOUNTED');
  const unknown=ids.filter(i=>decision.get(i)==='TYPED_UNRESOLVED'||graph.unresolved.some(u=>u.id===i));
  return {region_id:region.id,source_span:region.span,parser:a,auditor:b,candidate_ids:ids,disposition:issues.length?'PARSER_COVERAGE_FAILURE':unknown.length||a[0]?.disposition==='AMBIGUOUS'?'TYPED_UNRESOLVED':a[0]?.disposition,issues,unresolved_ids:unknown,findings:relevant};
 });
 const whitespace=[...graph.source.raw_text].map((c,i)=>({c,i})).filter(({c,i})=>!graph.source.regions.some(r=>i>=r.span.start&&i<r.span.end)&&!/\s/u.test(c));
 return {rows,gap_count:rows.filter(r=>r.issues.length).length,unaccounted_non_whitespace:whitespace,source_accountable:whitespace.length===0,non_boundary_regions:rows.filter(r=>r.disposition==='NON_BOUNDARY_CONTEXT').length};
}
