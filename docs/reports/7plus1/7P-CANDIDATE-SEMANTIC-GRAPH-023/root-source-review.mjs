import fs from 'node:fs';import {OUT,read,write} from './audit-tools.mjs';
const first=read(OUT+'/ADMIN-FIRST-OUTPUTS-r05.json');if(!fs.existsSync(OUT+'/FIRST-OUTPUT-SEAL-r05.json'))throw Error('UNSEALED');
const rows=[];
for(const p of first.rows.filter(r=>r.corpus==='root-standard-050')){
 const r=read(OUT+'/'+p.trace),c=r.compiler_v03,source=c.source.raw_text,sm=new Map(r.source_spans.map(s=>[s.span_id,s])),nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),local=[];
 // Independent explicit source scope, not an expected 7+1 fixture or runtime rule.
 for(const cl of c.nlp_signals.clauses){const q=cl.span.quote,m=/(?:范围|输入|对象)(?:包括|包含|为|是|：|:)(.+)$/u.exec(q);if(!m)continue;const content=m[1],parts=content.split(/、|和|与|以及/u).map(s=>s.trim()).filter(Boolean);for(const part of parts){const nodes=c.candidate_semantic_graph.semantic_nodes.filter(n=>['ENTITY','UNKNOWN_REFERENT'].includes(n.node_type)&&n.metadata.clause_id===cl.id&&n.surface.trim()===part),at=source.indexOf(part,cl.span.start),span={start:[...source.slice(0,at)].length,end:[...source.slice(0,at+part.length)].length,text:part};if(!nodes.length)local.push({kind:'MISSING_DECLARED_OBJECT_ENDPOINT',stage:'SEMANTIC_NODE',source_span:span,clause_id:cl.id,nlp_token_ids:cl.tokens.filter(t=>t.start>=span.start&&t.end<=span.end).map(t=>t.id),reason:'Explicit source scope member survives source/NLP but has no typed entity endpoint in Gc; root DISCOURSE raw text does not satisfy this requirement.'});}}
 const inherited=read(OUT+'/semantic-review-r05/root-standard-050/'+p.id+'.json').findings??[];
 const sound=read(OUT+'/soundness-review-r05/root-standard-050/'+p.id+'.json').findings??[];
 local.push(...inherited,...sound);
 const stageOrder=['STRUCTURE','NLP_SIGNAL','SPAN_LATTICE','SEMANTIC_NODE','CANDIDATE_GENERATION','CANDIDATE_EXPRESSION','EVIDENCE_ATTACHMENT','GAMMA_CERTIFICATION','ELIGIBILITY','BOUNDARY_IR','PROJECTION','PROOF','COVERAGE'];
 local.sort((a,b)=>stageOrder.indexOf(a.stage)-stageOrder.indexOf(b.stage));
 rows.push({id:p.id,source_sha256:p.source_sha256,source,confirmed_diagnostics:local,first_confirmed_divergence:local[0]??null,full_root_closure:'NOT_CLAIMED',canonical:c.canonical_7plus1,unknown:c.unresolved,source_only_review:true,not_adjudicated_Gold:true});
}
write('ROOT-SOURCE-REVIEW.json',{total:rows.length,cases_with_confirmed_gaps:rows.filter(r=>r.confirmed_diagnostics.length).length,whole_case_semantic_accuracy:'NOT_ESTABLISHED',first_confirmed_divergence:rows.find(r=>r.first_confirmed_divergence)?.first_confirmed_divergence,rows});
