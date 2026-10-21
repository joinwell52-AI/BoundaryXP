// Historical display is deliberately separate from current calculator input.
// No formal constraints, verdicts or resource compatibility are promoted here.
export function savedDisplay(node, prior, snapshots) {
  if (!prior?.boundary || !Array.isArray(prior.boundary.clauses)) return null;
  const snapshot = [...snapshots].sort((a,b)=>a.revision-b.revision).find(p=>
    p.nodes?.some(n=>n.id===node.id && n.result_key===node.result_key));
  const source = snapshot?.nodes.find(n=>n.id===node.id);
  if (!source || typeof source.text !== 'string') return null;
  const {clauses, unstated_axes=[], issues=[], uncertainties=[]} = prior.boundary;
  return JSON.parse(JSON.stringify({
    mode:'HISTORICAL_DISPLAY_ONLY', result_key:node.result_key,
    snapshot_revision:snapshot.revision,
    source:{id:source.id,label:source.label,version:source.version,text:source.text},
    boundary:{clauses,unstated_axes,issues,uncertainties}, review:prior.review??null
  }));
}
