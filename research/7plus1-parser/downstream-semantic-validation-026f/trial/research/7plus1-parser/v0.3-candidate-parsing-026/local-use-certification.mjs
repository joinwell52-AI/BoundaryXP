// Pure evidence checks over already-proposed Gc. No candidate generation,
// source-word whitelist, model call, BoundaryFact or projection in this file.
export function sourceLocalTaskUse(g,n){
 const license=n.metadata.local_task_use_evidence;
 if(!license||license.use!=='CURRENT_TASK_ASSERTION'||license.owning_clause_id!==n.metadata.clause_id||license.predicate_token_id!==n.metadata.token_id||n.metadata.discourse?.kind!=='CURRENT_TASK'||n.metadata.syntactic_layer!=='MAIN'||!['REQUIRED','PERMITTED'].includes(n.metadata.modality))return null;
 const spans=new Map(g.source_spans.map(s=>[s.span_id,s])),points=[...g.source_text],clause=g.structure.clauses.find(c=>c.clause_id===license.owning_clause_id),structure=g.structure.nodes.find(s=>s.structure_node_id===clause?.structure_node_id);
 if(!structure||license.structural_path?.at(-1)!==clause.clause_id||!license.structural_path.includes(structure.parent_id))return null;
 const evidence=g.evidence.filter(e=>e.channel==='SYNTAX'&&e.clause_id===clause.clause_id),tokens=[...new Map(evidence.flatMap(e=>e.tokens).map(t=>[t.id,t])).values()],predicate=tokens.find(t=>t.id===license.predicate_token_id);
 if(!predicate||predicate.dep!=='root'||!['VV','VERB'].includes(predicate.pos)||points.slice(predicate.start,predicate.end).join('')!==predicate.text)return null;
 const domains=license.source_span_ids?.map(i=>spans.get(i));
 if(!domains?.length||domains.some(s=>!s||points.slice(s.start,s.end).join('')!==s.text||s.start>predicate.start||s.end<predicate.end))return null;
 const localRoles=g.candidate_relations.filter(r=>r.head_node_id===n.node_id&&['AGENT','PATIENT','THEME','RESULT'].includes(r.relation_type));
 const witnessed=localRoles.filter(r=>{const t=g.semantic_nodes.find(x=>x.node_id===r.tail_node_id),s=spans.get(t?.source_span_ids[0]);return s&&domains.some(d=>s.start>=d.start&&s.end<=d.end)&&evidence.some(e=>{const index=e.tokens.findIndex(t=>t.id===predicate.id);return index>=0&&e.tokens.some(q=>q.start>=s.start&&q.end<=s.end&&q.head===index&&/^(nsubj|dobj|obj|nsubjpass|nsubj:pass)$/u.test(q.dep));});});
 if(!witnessed.some(r=>r.relation_type==='AGENT')||!witnessed.some(r=>['PATIENT','THEME','RESULT'].includes(r.relation_type)))return null;
 return {rule:'LOCAL_TASK_ASSERTION_WITH_SOURCE_OWNED_FRAME',source_span_ids:license.source_span_ids,relation_ids:witnessed.map(r=>r.relation_id),predicate_token_id:predicate.id,structural_path:license.structural_path};
}
export function hasCaseEnvelope(g,predicate,target){
 const spans=new Map(g.source_spans.map(s=>[s.span_id,s])),s=spans.get(target.source_span_ids[0]);
 // A complete nominal token beginning with a case-like character is still a
 // nominal. Reject only a separate syntactic case token inside the argument.
 return g.evidence.filter(e=>e.channel==='SYNTAX'&&e.clause_id===predicate.metadata.clause_id).some(e=>e.tokens.some(t=>t.start===s.start&&t.end<s.end&&(t.dep==='case'||['P','ADP'].includes(t.pos))));
}
export function reviewedArgumentOwnership(g,r){
 if(!r.generic_evidence?.some(e=>e.rule==='MANUAL_REVIEWED_SOURCE_RELATION'))return true;
 const h=g.semantic_nodes.find(n=>n.node_id===r.head_node_id),t=g.semantic_nodes.find(n=>n.node_id===r.tail_node_id),s=g.source_spans.find(s=>s.span_id===t?.source_span_ids[0]);
 if(h?.node_type!=='EVENT'||!['PATIENT','THEME','RESULT','FORBIDS'].includes(r.relation_type))return true;
 if(!s)return false;
 // Validate a declared local ownership witness. Cross-clause references and
 // reused coordinated arguments retain the existing reference/competition
 // checks; this check is not a substitute for their different contracts.
 if(t.metadata.owner!==h.node_id||t.metadata.clause_id!==h.metadata.clause_id)return true;
 return g.evidence.filter(e=>e.channel==='SYNTAX'&&e.clause_id===h.metadata.clause_id).some(e=>{const index=e.tokens.findIndex(t=>t.id===h.metadata.token_id);return index>=0&&e.tokens.some(t=>{
  if(t.start<s.start||t.end>s.end||!/^(dobj|obj|nsubjpass|nsubj:pass)$/u.test(t.dep))return false;
  if(t.head===index)return true;
  const other=e.tokens[t.head],current=e.tokens[index];
  if(!other||!g.candidate_relations.some(edge=>edge.tail_node_id===r.tail_node_id&&g.semantic_nodes.find(n=>n.node_id===edge.head_node_id)?.metadata.token_id===other.id))return false;
  const left=current.start<other.start?current:other,right=left===current?other:current;
  const chain=e.tokens.filter(tok=>tok.start>=left.start&&tok.end<=right.end&&g.candidate_relations.some(edge=>edge.tail_node_id===r.tail_node_id&&g.semantic_nodes.find(n=>n.node_id===edge.head_node_id)?.metadata.token_id===tok.id)).sort((a,b)=>a.start-b.start);
  const points=[...g.source_text];
  return chain.length>1&&chain.every((tok,i)=>{
   if(!i)return tok.id===left.id;
   let gap=points.slice(chain[i-1].end,tok.start).join('');
   const qualifiers=g.semantic_nodes.filter(n=>n.node_type==='STATE'&&n.metadata.argument_role==='METHOD'&&g.semantic_nodes.find(owner=>owner.node_id===n.metadata.owner)?.metadata.token_id===tok.id).map(n=>g.source_spans.find(s=>s.span_id===n.source_span_ids[0])).filter(s=>s&&s.start>=chain[i-1].end&&s.end<=tok.start);
   for(const s of qualifiers.sort((a,b)=>b.start-a.start))gap=[...gap].slice(0,s.start-chain[i-1].end).join('')+[...gap].slice(s.end-chain[i-1].end).join('');
   return /^(?:\s|、|和|或|and\b|or\b)+$/iu.test(gap);
  })&&chain.at(-1).id===right.id;
 });});
}
export function conditionDependenciesClosed(g,expression){
 if(expression.expression_type!=='condition_expr_nodes'||expression.expression.op!=='STATE_REF')return true;
 const plans=g.candidate_plan_sets.filter(p=>p.condition_expr_id===expression.expression_id);
 // STATE_REF is also used for nominal qualifiers and completion members.
 // Only an explicit executable condition use requires CONDITION_OF closure.
 const governed=plans.filter(p=>g.candidate_relations.some(r=>r.relation_type==='CONDITION_OF'&&r.head_node_id===expression.expression.state_node_id&&r.tail_node_id===p.predicate_node_id));
 return governed.every(p=>expression.relation_ids.some(id=>g.candidate_relations.some(r=>r.relation_id===id&&r.relation_type==='CONDITION_OF'&&r.head_node_id===expression.expression.state_node_id&&r.tail_node_id===p.predicate_node_id)));
}
