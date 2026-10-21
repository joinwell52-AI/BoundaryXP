import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';

export function qualifierProvenance(f){
 const {edge,sp,nm}=graphApi(f),log=[];f.semantic_decoding.qualifier_attachment_ir=log;
 for(const a of f.analyses){
  const ts=a.cl.tokens;
  if(a.discourse.kind==='CURRENT_TASK')for(const event of a.events){
   const token=ts.find(t=>event.metadata.token_id===t.id||event.source_span_ids.some(i=>{const s=f.source_spans.find(s=>s.span_id===i);return s?.start===t.start&&s?.end===t.end;})),index=ts.indexOf(token);
   if(index<0)continue;
   for(const modifier of ts.filter(t=>t.head===index&&t.pos==='AD'&&/^advmod/u.test(t.dep??'')&&!/^(不|未|无|已|已经|只|仅|都|均|并|也|且|则|再|必须|应|须|无需|最多|至少|only|not|must|shall|then|also|already)$/iu.test(t.text)&&!event.metadata.modality_token_ids?.includes(t.id))){
    const state=f.tools.node(a.cl,'STATE',modifier.start,modifier.end,{sense:'ACTION_METHOD_QUALIFIER',owner:event.node_id,discourse:a.discourse,syntactic_layer:'LOCAL_QUALIFIER',attachment_path:[a.cl.id,modifier.id,token.id,event.node_id],qualifier_text:modifier.text,qualifier_contract:'EXPLICIT_SYNTACTIC_ADVERB'}),relation=edge(a,'CONJUNCTION',state,event,[a.sid]);
    event.metadata.action_modifier_node_ids=uniq([...(event.metadata.action_modifier_node_ids??[]),state.node_id]);
    for(const r of f.relations.filter(r=>r.head_node_id===event.node_id&&r.state==='SUPPORTED'))r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),relation.relation_id]);
   }
  }
  for(const state of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id&&n.metadata.sense==='NOMINAL_QUALIFIER_PREDICATE')){
   const predicate=ts.find(t=>t.id===state.metadata.token_id),pi=ts.indexOf(predicate),owner=ts.find(t=>t.id===state.metadata.owning_token_id);
   if(!predicate||!owner)continue;
   const roles=f.relations.filter(r=>r.state==='SUPPORTED'&&r.clause_id===a.cl.id&&['PATIENT','THEME','RESULT','CONFORMS_TO','FORBIDS'].includes(r.relation_type)&&sp(nm(r.tail_node_id)).start<=owner.start&&sp(nm(r.tail_node_id)).end>=owner.end);
   const owners=[...new Map(roles.map(r=>[r.tail_node_id,nm(r.tail_node_id)])).values()];
   if(owners.length!==1)continue;
   const markers=ts.filter(t=>t.head===pi&&/^(已|已经|未|不|already|not)$/iu.test(t.text)),frame=(a.cl.srl??[]).find(fr=>fr.some(r=>r[1]==='PRED'&&r[2]===pi)),argument=frame?.find(r=>r[1]==='ARG1');
   state.metadata.aspect=markers.some(t=>/^(已|已经|already)$/iu.test(t.text))?'COMPLETED':'UNSTATED';state.metadata.polarity=markers.some(t=>/^(未|不|not)$/iu.test(t.text))?'NEGATIVE':'POSITIVE';state.metadata.modifier_span_ids=markers.map(t=>f.tools.span(t.start,t.end));
   const attachment=edge(a,'CONJUNCTION',state,owners[0],[...state.metadata.modifier_span_ids]);
   const relationIds=[attachment.relation_id];
   if(argument&&ts[argument[2]]&&ts[argument[3]-1]&&ts[argument[3]-1].end<=owner.start){
    const object=f.tools.node(a.cl,'ENTITY',ts[argument[2]].start,ts[argument[3]-1].end,{sense:'QUALIFIER_ARGUMENT',owner:state.node_id,discourse:a.discourse,argument_role:'NOMINAL_QUALIFIER_OBJECT',attachment_path:[a.cl.id,predicate.id,owner.id]});const rr=edge(a,'CONJUNCTION',state,object,[...state.metadata.modifier_span_ids]);relationIds.push(rr.relation_id);state.metadata.object_node_ids=[object.node_id];
   }
   attachment.dependency_relation_ids=relationIds.filter(i=>i!==attachment.relation_id);
   for(const r of roles)r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),...relationIds]);
   log.push({state_node_id:state.node_id,owner_node_id:owners[0].node_id,relation_ids:relationIds,aspect:state.metadata.aspect,source_span_ids:uniq([a.sid,...state.source_span_ids,...state.metadata.modifier_span_ids]),attachment_path:[a.cl.id,predicate.id,owner.id,owners[0].node_id],rule:'EXPLICIT_NOMINAL_QUALIFIER_OWNERSHIP'});
  }
 }
 for(const relation of f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='CONJUNCTION'&&nm(r.head_node_id)?.metadata.sense==='ACTION_METHOD_QUALIFIER'&&nm(r.tail_node_id)?.node_type==='EVENT')){
  const event=nm(relation.tail_node_id),state=nm(relation.head_node_id);
  if(state.metadata.owner!==event.node_id)continue;
  for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===event.node_id))r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),relation.relation_id]);
  log.push({state_node_id:state.node_id,event_node_id:event.node_id,relation_ids:[relation.relation_id],source_span_ids:uniq([...state.source_span_ids,...event.source_span_ids]),rule:'EXPLICIT_LOCAL_ACTION_METHOD_OWNERSHIP'});
 }
 return f;
}
