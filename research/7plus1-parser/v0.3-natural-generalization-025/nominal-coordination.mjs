import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';

// Decompose nominal coordination below an existing argument. Keep its outer
// predicate/property intact, so "X and Y's consistency" is not two actions.
export function nominalCoordination(f){
 const {nm,sp,edge,expr}=graphApi(f),log=[];f.semantic_decoding.nominal_coordination_ir=log;
 for(const argument of [...f.relations].filter(r=>r.state==='SUPPORTED'&&['PATIENT','FORBIDS','THEME'].includes(r.relation_type))){
  const n=nm(argument.tail_node_id),a=f.analyses.find(a=>a.cl.id===argument.clause_id);
  if(!a||a.discourse.kind!=='CURRENT_TASK'||n.metadata.sense==='PROPOSITION_ARGUMENT'||n.metadata.nominal_coordination)continue;
  const s=sp(n),ts=a.cl.tokens,inside=t=>t.start>=s.start&&t.end<=s.end,nominal=t=>/^(NN|NR|NT|NOUN|PROPN)$/u.test(t?.pos??''),domains=[];
  for(const base of ts.filter(t=>inside(t)&&nominal(t))){
   const heads=[base,...ts.filter(t=>inside(t)&&nominal(t)&&t.dep==='conj'&&t.head===ts.indexOf(base))];if(heads.length<2)continue;
   let groups=heads.map(h=>{
    const own=[h];for(let k=0;k<own.length;k++)for(const t of ts.filter(t=>inside(t)&&t!==own[k]&&t.head===ts.indexOf(own[k])&&!heads.includes(t)&&/^(compound:nn|compound|nmod:assmod|amod|det|nummod|mark:clf)$/u.test(t.dep??'')))if(!own.includes(t))own.push(t);
    return {head:h,tokens:own,start:Math.min(...own.map(t=>t.start)),end:Math.max(...own.map(t=>t.end))};
   }).sort((x,y)=>x.start-y.start);
   if(groups.some((g,k)=>k&&groups[k-1].end>g.start)){
    // Some dependency models attach a left nominal modifier to the final
    // conjunct. Explicit CC markers partition this already bounded argument;
    // retain the original dependency evidence instead of losing a component.
    const ordered=[...heads].sort((x,y)=>x.start-y.start),markers=ordered.slice(1).map((h,k)=>ts.filter(q=>q.start>=ordered[k].end&&q.end<=h.start&&/^(cc|punct)$/u.test(q.dep??'')&&/^(以及|以|及|和|与|、|and|or|或|或者)$/iu.test(q.text)));
    if(markers.some(xs=>!xs.length))continue;
    const cuts=markers.map(xs=>({start:Math.min(...xs.map(t=>t.start)),end:Math.max(...xs.map(t=>t.end))})),begin=Math.min(...heads.flatMap(h=>ts.filter(t=>inside(t)&&(t===h||t.head===ts.indexOf(h))&&/^(NN|NR|NT|NOUN|PROPN|JJ|ADJ|DT|DET|CD|NUM)$/u.test(t.pos??'')).map(t=>t.start)));
    groups=ordered.map((h,k)=>{const start=k?cuts[k-1].end:begin,end=k<cuts.length?cuts[k].start:h.end,tokens=ts.filter(q=>q.start>=start&&q.end<=end);let x=start,y=end;while(x<y&&/\s/u.test([...f.source.raw_text][x]))x++;while(y>x&&/\s/u.test([...f.source.raw_text][y-1]))y--;return {head:h,tokens,start:x,end:y};});
    if(groups.some(g=>g.end<=g.start||!g.tokens.some(nominal)))continue;
   }
   const markers=groups.slice(1).map((g,k)=>[...f.source.raw_text].slice(groups[k].end,g.start).join(''));
   if(markers.some(x=>!/^\s*(?:以及|和|与|及|、|and|or|或|或者)\s*$/iu.test(x)))continue;
   const kinds=uniq(markers.map(x=>/^(?:或|或者|or)$/iu.test(x.trim())?'OR':'AND'));if(kinds.length!==1)continue;
   domains.push({base,groups,markers,operator:kinds[0]});
  }
  const best=domains.sort((x,y)=>y.groups.length-x.groups.length)[0];if(!best)continue;
  const rs=[],items=[];
  for(const group of best.groups){
   const component=f.tools.node(a.cl,'ENTITY',group.start,group.end,{sense:'COORDINATED_NOMINAL_COMPONENT',owner:n.node_id,discourse:a.discourse,token_id:group.head.id,syntax_token_ids:group.tokens.map(t=>t.id),argument_role:'LOCAL_NOMINAL_COMPONENT',attachment_path:[a.cl.id,n.node_id,group.head.id]});
   const r=edge(a,'CONJUNCTION',n,component);rs.push(r);
   items.push(expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:component.node_id,source_span_ids:component.source_span_ids,relation_ids:[r.relation_id]}));
  }
  // UNION records the member inventory, not an obligation to perform both.
  // The source AND/OR connector remains separately owned by the argument.
  const id=expr(f.expressions.set_expr_nodes,{kind:'UNION',operand_expr_ids:items,source_span_ids:uniq([a.sid,...n.source_span_ids]),relation_ids:rs.map(r=>r.relation_id)});
  n.metadata.nominal_coordination={operator:best.operator,component_node_ids:rs.map(r=>r.tail_node_id),shared_outer_argument_node_id:n.node_id,expression_id:id,marker_spans:best.groups.slice(1).map((g,k)=>f.tools.span(best.groups[k].end,g.start)),source_span_ids:[a.sid,...n.source_span_ids]};
  n.metadata.nominal_component_set_expr_id=id;argument.dependency_relation_ids=uniq([...(argument.dependency_relation_ids??[]),...rs.map(r=>r.relation_id)]);
  log.push({argument_relation_id:argument.relation_id,parent_node_id:n.node_id,...n.metadata.nominal_coordination});
 }
 return f;
}
