import {id,uniq} from './util.mjs';
const current=n=>n?.type==='EVENT'&&['MAIN','CONDITION_CONSEQUENT','ACCEPTANCE'].includes(n.layer);
export function eligibility(graph,gamma){
 const states=new Map(gamma.decisions.map(d=>[d.candidate_id,d.decision])),nodes=new Map(graph.nodes.map(n=>[n.id,n])),expressions=new Map(graph.expressions.map(e=>[e.id,e])),decisions=[];
 const add=(key,kind,node_ids,relation_ids,extra={})=>{
  const predicate=extra.predicate_id?nodes.get(extra.predicate_id):null;
  const guards=graph.relations.filter(r=>r.type==='CONDITION_OF'&&r.tail===predicate?.id),scopes=graph.relations.filter(r=>r.type==='SCOPE_MEMBER'&&r.head===predicate?.id&&expressions.get(r.tail)?.kind==='SCOPE');
  const deps=uniq([...node_ids,...relation_ids,...guards.flatMap(r=>[r.id,r.head]),...scopes.flatMap(r=>[r.id,r.tail]),...extra.dependency_ids??[]]);
  const unresolved=deps.filter(i=>states.get(i)!=='CERTIFIED');
  const originSpans=uniq(deps.flatMap(i=>nodes.get(i)?.source_span_ids??graph.relations.find(r=>r.id===i)?.source_span_ids??expressions.get(i)?.source_span_ids??[]));
  decisions.push({...extra,eligibility_id:id(graph.graph_id,'eligibility',key,kind),candidate_id:key,kind,decision:unresolved.length?'UNRESOLVED':'BOUNDARY',reason:unresolved.length?'UNCERTIFIED_BOUNDARY_DEPENDENCY':'SOURCE_DEFINED_FINITE_BOUNDARY_USE',node_ids:uniq(node_ids),relation_ids:uniq([...relation_ids,...guards.map(r=>r.id),...scopes.map(r=>r.id)]),dependency_ids:deps,unresolved_ids:unresolved,source_span_ids:originSpans,condition_refs:guards.map(r=>r.head),scope_refs:scopes.map(r=>r.tail)});
 };
 for(const n of graph.nodes.filter(current)){
  const arguments_=graph.relations.filter(r=>r.head===n.id&&['AGENT','PATIENT','THEME','RESULT','RECIPIENT'].includes(r.type));
  const dependents=arguments_.filter(r=>['PATIENT','THEME','RESULT'].includes(r.type));
  if(['REQUIRED','PERMITTED'].includes(n.modality)&&!['STOP','COMPLETE','DECLARATION','SUPPORT'].includes(n.predicate_class))add(n.id,'ACTION',[n.id,...arguments_.map(r=>r.tail)],arguments_.map(r=>r.id),{predicate_id:n.id,modality:n.modality,argument_ids:dependents.map(r=>r.tail)});
  if(n.modality==='FORBIDDEN')add(n.id,'FORBIDDEN_OPERATION',[n.id,...arguments_.map(r=>r.tail)],arguments_.map(r=>r.id),{predicate_id:n.id,modality:'FORBIDDEN',argument_ids:dependents.map(r=>r.tail)});
 }
 for(const r of graph.relations){
  const h=nodes.get(r.head),t=nodes.get(r.tail),e=expressions.get(r.tail),positive=current(h)&&['REQUIRED','PERMITTED'].includes(h.modality),base=[r.head,r.tail].filter(i=>nodes.has(i));
  if(r.type==='SCOPE_MEMBER'&&(r.head==='TASK'||positive))add(r.id,'TASK_OBJECT',base,[r.id],{object_id:r.tail,predicate_id:positive?h.id:null,dependency_ids:e?[e.id]:[]});
  if(['PATIENT','THEME'].includes(r.type)&&positive&&['EXISTING_INPUT','READ_ONLY_INPUT','MODIFICATION_TARGET','UPDATED_OUTPUT','UNKNOWN'].includes(t?.artifact_use)&&!['PERSON','ROLE','GROUP','FORMAT','METHOD'].includes(t?.entity_kind))add(r.id,'TASK_OBJECT',base,[r.id],{object_id:t.id,predicate_id:h.id});
  if(r.type==='RESULT'&&positive)add(r.id,'DELIVERABLE',base,[r.id],{object_id:t.id,predicate_id:h.id});
  if(['AGENT','RECIPIENT'].includes(r.type)&&r.role!=='NONE'&&h&&(['MAIN','CONDITION_ANTECEDENT','CONDITION_CONSEQUENT','ACCEPTANCE','PURPOSE_COMPLEMENT'].includes(h.layer))){
   const active=current(h)||h.type==='STATE'||h.layer==='PURPOSE_COMPLEMENT';
   if(active)add(r.id,'PARTICIPANT',base,[r.id],{object_id:t?.id,predicate_id:h.type==='EVENT'?h.id:null,participant_role:r.role});
  }
  if(['BASIS','CONFORMS_TO'].includes(r.type)&&(r.head==='TASK'||positive))add(r.id,'BASELINE',base,[r.id],{object_id:t?.id,predicate_id:positive?h.id:null});
  if(r.type==='LIMIT'&&e?.kind==='QUANTITY'&&e.quantity?.use==='EXECUTION_LIMIT'&&(r.head==='TASK'||positive))add(r.id,'RESOURCE',base,[r.id],{predicate_id:positive?h.id:null,quantity_ref:e.id,dependency_ids:[e.id,...e.operands]});
  if(r.type==='COMPLETION_OF'&&r.tail==='TASK')add(r.id,'COMPLETION',base,[r.id],{expression_ref:r.head,dependency_ids:expressions.has(r.head)?[r.head]:[]});
  if(r.type==='STOP_OF'&&r.tail==='TASK')add(r.id,'STOP',base,[r.id],{predicate_id:h?.type==='EVENT'?h.id:null,expression_ref:r.head,dependency_ids:expressions.has(r.head)?[r.head]:[]});
  if(r.type==='RESTRICTS'&&(r.head==='TASK'||current(h)))add(r.id,'RESTRICTION',base,[r.id],{object_id:r.tail,predicate_id:h?.type==='EVENT'?h.id:null,dependency_ids:e?[e.id]:[]});
 }
 for(const n of graph.nodes)if(!decisions.some(d=>d.node_ids.includes(n.id)))decisions.push({eligibility_id:id(graph.graph_id,'aux',n.id),candidate_id:n.id,kind:'AUXILIARY',decision:'AUXILIARY',reason:'SEMANTICS_NOT_AN_INDEPENDENT_BOUNDARY_USE',node_ids:[n.id],relation_ids:[],dependency_ids:[n.id],unresolved_ids:[],source_span_ids:n.source_span_ids,condition_refs:[],scope_refs:[]});
 return decisions;
}
