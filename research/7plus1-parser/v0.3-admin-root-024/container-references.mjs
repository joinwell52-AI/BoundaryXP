import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';

// "Within it" selects a read container only inside the same sentence.
// Proposition references use a typed, structurally bounded read/result domain.
export function containerReferences(f){
 const {nm,sp,edge}=graphApi(f),log=[];f.semantic_decoding.container_reference_ir=log;
 const domain=(a,start,kind,sameSentence=false)=>[...new Map(f.relations.filter(r=>r.state==='SUPPORTED'&&(kind==='RESULT'?r.relation_type==='RESULT':r.relation_type==='PATIENT'&&nm(r.head_node_id)?.metadata.sense==='read')&&nm(r.tail_node_id)?.metadata.literal_tag==='FILEPATH'&&sp(nm(r.tail_node_id)).start<start&&f.analyses.find(b=>b.cl.id===r.clause_id)?.parent_structure_id===a.parent_structure_id&&(!sameSentence||f.analyses.find(b=>b.cl.id===r.clause_id)?.cl.sentence_id===a.cl.sentence_id)).map(r=>{const n=nm(r.tail_node_id);return [n.metadata.artifact_identity??n.surface,n];})).values()];
 for(const a of f.analyses){
  if(a.discourse.kind!=='CURRENT_TASK')continue;
  for(const r of [...f.relations].filter(r=>r.state==='SUPPORTED'&&r.clause_id===a.cl.id&&['PATIENT','THEME'].includes(r.relation_type))){
   const ref=nm(r.tail_node_id);if(!/^其中/u.test(ref.surface))continue;
   const candidates=domain(a,sp(ref).start,'READ',true);
   if(candidates.length!==1){const u=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE','Within-container reference requires one same-sentence read container',[ref.node_id,...candidates.map(n=>n.node_id)]);f.expression_plans.set(r.head_node_id,{...f.expression_plans.get(r.head_node_id),unresolved_ref:u});log.push({reference_node_id:ref.node_id,candidate_ids:candidates.map(n=>n.node_id),status:'UNRESOLVED',unresolved_id:u});continue;}
   ref.metadata.local_reference={referent_node_id:candidates[0].node_id,candidate_ids:candidates.map(n=>n.node_id),rule:'EXPLICIT_SAME_SENTENCE_READ_CONTAINER',source_span_ids:uniq([a.sid,...ref.source_span_ids,...candidates[0].source_span_ids])};
   const part=edge(a,'PART_OF',ref,candidates[0],ref.metadata.local_reference.source_span_ids);r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),part.relation_id]);
   log.push({reference_node_id:ref.node_id,selected_container_id:candidates[0].node_id,candidate_ids:candidates.map(n=>n.node_id),relation_id:part.relation_id,status:'UNIQUE',source_span_ids:ref.metadata.local_reference.source_span_ids});
  }
  const propositions=f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id&&n.node_type==='STATE'&&['ATTESTED_PROPOSITION_CONTENT','EVENT_COMPLETED'].includes(n.metadata.sense));
  for(const state of propositions){
   const s=sp(state),tokens=a.cl.tokens.filter(t=>t.start>=s.start&&t.end<=s.end);
   if(!tokens.some(t=>t.text==='覆盖'))continue;
   for(const token of tokens.filter(t=>/^(报告|文档|清单)$/u.test(t.text))){
    const kind=token.text==='清单'?'READ':'RESULT',candidates=domain(a,token.start,kind).filter(n=>kind==='RESULT'||/\.(?:csv|tsv|xlsx?)$/iu.test(n.surface));
    const ref=f.tools.node(a.cl,'ENTITY',token.start,token.end,{sense:'PROPOSITION_ARTIFACT_REFERENCE',token_id:token.id,owner:state.node_id,discourse:a.discourse});
    if(candidates.length!==1){const u=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE','Proposition artifact reference lacks one typed structural domain',[ref.node_id,...candidates.map(n=>n.node_id)]);state.unresolved_ref=u;state.state='UNRESOLVED';log.push({reference_node_id:ref.node_id,candidate_ids:candidates.map(n=>n.node_id),status:'UNRESOLVED',unresolved_id:u});continue;}
    ref.metadata.resolution={rule:'UNIQUE_TYPED_PROPOSITION_ARTIFACT_DOMAIN',candidate_node_ids:candidates.map(n=>n.node_id),selected_node_ids:[candidates[0].node_id],structural_path:[a.parent_structure_id,a.cl.id,state.node_id,token.id],source_span_ids:uniq([a.sid,...ref.source_span_ids,...candidates[0].source_span_ids])};
    const coref=edge(a,'COREFERENCE',ref,candidates[0],ref.metadata.resolution.source_span_ids),owns=edge(a,'CONJUNCTION',state,ref,ref.metadata.resolution.source_span_ids);owns.dependency_relation_ids=[coref.relation_id];
    state.metadata.object_node_ids=uniq([...(state.metadata.object_node_ids??[]),candidates[0].node_id]);
    state.metadata.coverage_requirement={predicate:'COVER',quantifier:/每|全部|所有/u.test(state.surface)?'ALL':'UNSTATED',references:[...(state.metadata.coverage_requirement?.references??[]),{kind,reference_node_id:ref.node_id,object_node_id:candidates[0].node_id}]};
    for(const parent of f.relations.filter(r=>r.state==='SUPPORTED'&&(r.head_node_id===state.node_id&&r.relation_type==='CONDITION_OF'||r.tail_node_id===state.node_id&&r.relation_type==='CONJUNCTION')))parent.dependency_relation_ids=uniq([...(parent.dependency_relation_ids??[]),owns.relation_id]);
    log.push({reference_node_id:ref.node_id,selected_container_id:candidates[0].node_id,candidate_ids:candidates.map(n=>n.node_id),relation_ids:[coref.relation_id,owns.relation_id],status:'UNIQUE',source_span_ids:ref.metadata.resolution.source_span_ids});
   }
  }
 }
 return f;
}
