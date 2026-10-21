import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Interval alternatives are materialized, rather than represented by a list
// whose members have already been selected. Protected denotes identity only.
export function completeSpanLattice(f){
 const rows=f.span_lattice.candidates,spans=new Map(f.source_spans.map(s=>[s.span_id,s])),edges=[];
 const add=(start,end,type,provider,metadata={})=>{if(end<=start)return;const sid=f.tools.span(start,end),key=id(f.source.sha256,'lattice',start,end,type,provider);if(!rows.some(r=>r.span_candidate_id===key))rows.push({span_candidate_id:key,source_span_id:sid,candidate_type:type,status:'PROPOSED',provider_refs:[provider],evidence_tier:'STRONG',diagnostic_refs:[],...metadata});};
 for(const cl of f.nlp_signals.clauses){for(const t of cl.tokens)add(t.start,t.end,/^(VV|VERB)$/u.test(t.pos??'')?'EVENT':'ENTITY',cl.model??'NLP_TOKEN',{syntax_token_ids:[t.id]});for(const fr of cl.srl??[])for(const r of fr){const part=cl.tokens.slice(r[2],r[3]);if(part.length)add(part[0].start,part.at(-1).end,r[1]==='PRED'?'EVENT':'ENTITY','NLP_SRL',{syntax_token_ids:part.map(t=>t.id),srl_role:r[1]});}}
 for(const l of f.nlp_signals.literals)add(l.span.start,l.span.end,'TYPED_LITERAL','TYPED_RECOGNIZER',{status:'PROTECTED_EXACT_SPAN',literal_id:l.id,literal_type:l.type,semantic_role_not_selected:true});
 for(const r of rows){if(r.status==='SELECTED')throw Error('PRE_GAMMA_SPAN_SELECTED');r.source_span=spans.get(r.source_span_id)??f.source_spans.find(s=>s.span_id===r.source_span_id);r.candidate_type_hypotheses=[r.candidate_type];}
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const a=rows[i],b=rows[j],x=a.source_span,y=b.source_span;if(!x||!y||x.end<=y.start||y.end<=x.start)continue;
  const type=x.start===y.start&&x.end===y.end?'COEXTENSIVE':x.start<=y.start&&x.end>=y.end?'CONTAINS':y.start<=x.start&&y.end>=x.end?'CONTAINED_BY':'OVERLAPS';
  edges.push({edge_id:id(f.source.sha256,'lattice-edge',a.span_candidate_id,b.span_candidate_id,type),from_candidate_id:a.span_candidate_id,to_candidate_id:b.span_candidate_id,type,source_span_ids:uniq([a.source_span_id,b.source_span_id]),provider_evidence:uniq([...a.provider_refs,...b.provider_refs])});
  if(a.status==='PROPOSED')a.status='COMPETING';if(b.status==='PROPOSED')b.status='COMPETING';
 }
 // A semantic phrase records its source-token composition separately from
 // interval containment. No role is inferred from this syntactic relation.
 for(const n of f.semantic_nodes)for(const t of f.nlp_signals.clauses.flatMap(c=>c.tokens).filter(t=>n.metadata.syntax_token_ids?.includes(t.id))){const child=rows.find(r=>r.syntax_token_ids?.length===1&&r.syntax_token_ids[0]===t.id),parent=rows.find(r=>n.span_candidate_ids.includes(r.span_candidate_id));if(parent&&child&&parent!==child&&parent.source_span.start<=child.source_span.start&&parent.source_span.end>=child.source_span.end)edges.push({edge_id:id(parent.span_candidate_id,child.span_candidate_id,'COMPOSED_OF'),type:'COMPOSED_OF',from_candidate_id:parent.span_candidate_id,to_candidate_id:child.span_candidate_id,source_span_ids:uniq([parent.source_span_id,child.source_span_id]),provider_evidence:['EXPLICIT_SYNTAX_TOKEN_MEMBERSHIP']});}
 f.span_lattice.edges=[...new Map(edges.map(e=>[e.edge_id,e])).values()];return f;
}
