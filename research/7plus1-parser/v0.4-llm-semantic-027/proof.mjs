import {id,uniq} from './util.mjs';
export function proofDAG(graph,gamma,eligibility,ir,providerReceipts){
 const nodes=[],edges=[];
 const add=(key,kind,data={})=>{if(!nodes.some(n=>n.id===key))nodes.push({id:key,kind,...data});return key;};
 const edge=(a,b)=>{if(!edges.some(e=>e.from===a&&e.to===b))edges.push({from:a,to:b});};
 for(const [pass,r]of Object.entries(providerReceipts))add('provider:'+pass,'PROVIDER_RECEIPT',{pass,request_sha256:r.request_sha256??null,response_sha256:r.response_sha256??null,provider:r.provider});
 for(const s of graph.source_spans)add(s.span_id,'SOURCE_SPAN',s);
 for(const c of [...graph.nodes,...graph.relations,...graph.expressions]){add(c.id,'CANDIDATE',{origin:c.origin,source_span_ids:c.source_span_ids,ownership:c.owner??c.ownership??null});for(const sid of c.source_span_ids)edge(c.id,sid);if(c.id!=='TASK')edge(c.id,c.origin==='LLM_PRIMARY'?'provider:parser':'provider:auditor');}
 for(const d of gamma.decisions){add(d.decision_id,'GAMMA_DECISION',d);edge(d.decision_id,d.candidate_id);
  for(const [index,check] of graph.auditor_checks.entries())if(check.candidate_id===d.candidate_id){const key=id(graph.graph_id,'audit-evidence',index);add(key,'INDEPENDENT_AUDIT_EVIDENCE',{verdict:check.verdict,reason:check.reason});edge(d.decision_id,key);edge(key,'provider:auditor');for(const link of check.source_links)if(link.span){add(link.span.span_id,'SOURCE_SPAN',link.span);edge(key,link.span.span_id);}}
 }
 for(const e of eligibility){add(e.eligibility_id,'ELIGIBILITY_DECISION',{decision:e.decision});for(const ref of e.dependency_ids){const d=gamma.decisions.find(d=>d.candidate_id===ref);if(d)edge(e.eligibility_id,d.decision_id);}}
 for(const f of ir.facts){add(f.boundary_fact_id,'BOUNDARY_FACT',{state:f.state});edge(f.boundary_fact_id,f.eligibility_id);}
 const audit=[];
 for(const fact of ir.facts.filter(f=>f.state==='RESOLVED')){
  const seen=new Set(),queue=[fact.boundary_fact_id];while(queue.length){const n=queue.pop();if(seen.has(n))continue;seen.add(n);queue.push(...edges.filter(e=>e.from===n).map(e=>e.to));}
  const gaps=[];for(const ref of fact.dependency_ids){const d=gamma.decisions.find(d=>d.candidate_id===ref);if(!d||d.decision!=='CERTIFIED'||!seen.has(d.decision_id))gaps.push('UNCERTIFIED_OR_UNREACHABLE_DEPENDENCY '+ref);}
  for(const sid of fact.source_span_ids)if(!seen.has(sid))gaps.push('UNREACHABLE_SOURCE '+sid);
  if(!fact.source_span_ids.length)gaps.push('EMPTY_FACT_SOURCE');
  audit.push({boundary_fact_id:fact.boundary_fact_id,reachable_ids:[...seen],gaps});
 }
 return {nodes,edges,audit,gap_count:audit.reduce((n,a)=>n+a.gaps.length,0),claim:'Actual provenance reachability, not proof of natural-language semantic truth'};
}
