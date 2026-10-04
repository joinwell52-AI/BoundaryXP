import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Omission can inherit an argument only through an explicit coordination or
// stop/resume construction with a unique typed domain. No nearest-text search.
export function ellipticalArguments(f){
 const {edge,expr}=graphApi(f),log=[];f.semantic_decoding.elliptical_argument_ir=log;
 for(const a of f.analyses)for(const e of a.events.filter(e=>['send','restore'].includes(e.metadata.sense)&&['REQUIRED','PERMITTED'].includes(e.metadata.modality))){
  if(f.relations.some(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&['PATIENT','THEME','RESULT'].includes(r.relation_type)))continue;
  const ts=a.cl.tokens,p=ts.find(t=>t.id===e.metadata.token_id),pi=ts.indexOf(p);let domain=[],rule=null,path=[];
  if(e.metadata.sense==='send'&&p?.dep==='conj'&&ts.some(t=>t.head===pi&&t.dep==='cc'||t.head===pi&&/^(并|and)$/iu.test(t.text))){
   const head=ts[p.head],parents=a.events.filter(n=>n.metadata.token_id===head?.id&&n.metadata.modality===e.metadata.modality);
   domain=parents.flatMap(n=>f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='RESULT'&&r.head_node_id===n.node_id).map(r=>({node:f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),parent:parents[0],relation:r})));
   rule='EXPLICIT_COORDINATED_RESULT_ARGUMENT';path=[a.parent_structure_id,a.cl.id,head?.id,p.id];
  }
  if(e.metadata.sense==='restore'&&a.condition_layer){
   const prior=f.analyses.filter(b=>b.parent_structure_id===a.parent_structure_id&&b.cl.sentence_id===a.cl.sentence_id&&b.cl.span.end<a.cl.span.start);
   domain=prior.flatMap(b=>b.events.filter(n=>n.metadata.stop&&n.metadata.modality==='REQUIRED').flatMap(n=>f.relations.filter(r=>r.head_node_id===n.node_id&&r.state==='SUPPORTED'&&r.relation_type==='PATIENT').map(r=>({node:f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),parent:n,relation:r}))));
   rule='EXPLICIT_APPROVAL_GATED_STOP_RESUME_DOMAIN';path=[a.parent_structure_id,...prior.map(b=>b.cl.id),a.cl.id];
  }
  domain=[...new Map(domain.map(d=>[d.node.node_id,d])).values()];if(!rule||!domain.length)continue;
  if(domain.length!==1){const u=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE','Elliptical action has competing structurally compatible arguments',domain.map(d=>d.node.node_id));f.expression_plans.set(e.node_id,{...f.expression_plans.get(e.node_id),unresolved_ref:u});continue;}
  const d=domain[0],r=edge(a,e.metadata.sense==='send'?'THEME':'PATIENT',e,d.node),continuity=edge(a,'CONJUNCTION',d.parent,e);r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),d.relation.relation_id,continuity.relation_id]);r.argument_inheritance={rule,candidate_node_ids:[d.node.node_id],structural_path:path,source_span_ids:uniq([a.sid,...d.node.source_span_ids,...d.parent.source_span_ids])};
  const plan=f.expression_plans.get(e.node_id)??{};plan.scope_expr_id=expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:d.node.node_id,relation_ids:[r.relation_id],source_span_ids:r.argument_inheritance.source_span_ids});
  const old=f.unresolved.filter(u=>u.related_node_ids.includes(e.node_id)&&/Transfer object|Action target/iu.test(u.reason));const ids=new Set(old.map(u=>u.unresolved_id));f.unresolved=f.unresolved.filter(u=>!ids.has(u.unresolved_id));if(ids.has(plan.unresolved_ref))delete plan.unresolved_ref;f.expression_plans.set(e.node_id,plan);
  log.push({event_node_id:e.node_id,argument_node_id:d.node.node_id,parent_event_node_id:d.parent.node_id,relation_id:r.relation_id,rule,structural_path:path,source_span_ids:r.argument_inheritance.source_span_ids,retired_diagnostics:structuredClone(old)});
 }
 return f;
}
