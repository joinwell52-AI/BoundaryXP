import {eligibility as baseEligibility} from './eligibility.mjs';
import {id,uniq} from './util.mjs';
// Finite task-use closure over already proposed owners and PART_OF edges.
// This does not parse words, infer omitted performers, or rewrite Gc.
export function eligibility(graph,gamma){
 const states=new Map(gamma.decisions.map(d=>[d.candidate_id,d.decision])),map=new Map(graph.nodes.map(n=>[n.id,n]));
 const structuralPaths=new Map();
 function path(n,seen=new Set()){
  if(!n||seen.has(n.id))return null;
  if(['MAIN','CONDITION_CONSEQUENT'].includes(n.layer))return [];
  if(n.layer!=='COMPLEMENT')return null;
  const owner=map.get(n.owner),links=graph.relations.filter(r=>r.type==='PART_OF'&&r.head===n.id&&r.tail===owner?.id&&['LOCAL','STRUCTURAL','SHARED_EXPLICIT'].includes(r.ownership));
  if(owner?.type!=='EVENT'||owner.predicate_class!=='ORGANIZE'||!['REQUIRED','PERMITTED'].includes(owner.modality)||links.length!==1)return null;
  const parent=path(owner,new Set([...seen,n.id]));return parent===null?null:[...parent,owner.id,links[0].id];
 }
 const view=structuredClone(graph);
 for(const n of view.nodes){const p=path(n);if(p?.length){structuralPaths.set(n.id,p);n.layer='MAIN';if(n.modality==='UNSTATED')n.modality=map.get(n.owner).modality;}}
 let decisions=baseEligibility(view,gamma);
 // Negative recipients/negative role declarations do not define positive task
 // participants. Their semantic relation remains visible in Gc and Gamma.
 decisions=decisions.filter(d=>d.kind!=='PARTICIPANT'||d.relation_ids.some(i=>{const r=graph.relations.find(r=>r.id===i);if(!r||!['AGENT','RECIPIENT'].includes(r.type))return false;const head=map.get(r.head);return head?.polarity!=='NEGATED'&&(r.type==='AGENT'||!['FORBIDDEN','NOT_REQUIRED'].includes(head?.modality));}));
 for(const d of decisions){const paths=uniq(d.node_ids.flatMap(i=>structuralPaths.get(i)??[]));if(!paths.length)continue;
  const owners=paths.filter(i=>map.has(i)),guards=graph.relations.filter(r=>r.type==='CONDITION_OF'&&owners.includes(r.tail)),scopes=graph.relations.filter(r=>r.type==='SCOPE_MEMBER'&&owners.includes(r.head)&&graph.expressions.some(e=>e.id===r.tail&&e.kind==='SCOPE'));
  const inherited=uniq([...paths,...guards.flatMap(r=>[r.id,r.head]),...scopes.flatMap(r=>[r.id,r.tail])]);
  d.task_use_attachment_path=paths;d.governing_owner_ids=owners;d.task_use_modality_origin=map.get(d.predicate_id)?.modality==='UNSTATED'?'EXPLICIT_GOVERNING_DIRECTIVE_WITH_LOCAL_CERTIFIED_COMPLEMENT':'LOCAL_SOURCE_MODALITY';d.dependency_ids=uniq([...d.dependency_ids,...inherited]);d.unresolved_ids=d.dependency_ids.filter(i=>states.get(i)!=='CERTIFIED');
  d.relation_ids=uniq([...d.relation_ids,...guards.map(r=>r.id),...scopes.map(r=>r.id)]);d.condition_refs=uniq([...d.condition_refs,...guards.map(r=>r.head)]);d.scope_refs=uniq([...d.scope_refs,...scopes.map(r=>r.tail)]);
  d.source_span_ids=uniq([...d.source_span_ids,...inherited.flatMap(i=>map.get(i)?.source_span_ids??graph.relations.find(r=>r.id===i)?.source_span_ids??graph.expressions.find(e=>e.id===i)?.source_span_ids??[])]);
  if(d.decision!=='AUXILIARY'){d.decision=d.unresolved_ids.length?'UNRESOLVED':'BOUNDARY';d.reason=d.unresolved_ids.length?'UNCERTIFIED_BOUNDARY_DEPENDENCY':'EXPLICIT_TASK_USE_OWNER_PATH';}
 }
 return decisions;
}
