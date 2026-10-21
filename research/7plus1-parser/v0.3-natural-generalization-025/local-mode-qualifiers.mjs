import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';

// The mode modifies its syntactic predicate owner. It never supplies a new
// action, silently licenses a sibling, or turns a quoted mode into a mandate.
export function localModeQualifiers(f){
 const {edge}=graphApi(f),log=[];f.semantic_decoding.local_mode_qualifier_ir=log;
 for(const a of f.analyses){
  if(a.discourse.kind!=='CURRENT_TASK')continue;
  const ts=a.cl.tokens;
  for(let i=0;i<ts.length;i++){
   const t=ts[i],read=ts[i+1];let end=t.end,owner=t.head,rule=null;
   if(t.text==='只'&&read?.text==='读'&&t.end===read.start&&t.head===i+1&&/acl|amod|compound:nn/u.test(read.dep??'')){end=read.end;owner=read.head;rule='READ_ONLY_ATTRIBUTIVE_MODE';}
   else if(/^(只读|read-only)$/iu.test(t.text)&&/amod|advmod|acl|compound:nn/u.test(t.dep??''))rule='EXPLICIT_READ_ONLY_MODIFIER';
   else if(/^(只|仅|only)$/iu.test(t.text)&&/advmod/u.test(t.dep??'')&&!/^(需|需要|须|need|needs)$/iu.test(ts[i+1]?.text??'')){rule='EXCLUSIVE_ARGUMENT_MODIFIER';}
   if(!rule)continue;
   const visited=new Set();while(ts[owner]&&!visited.has(owner)&&!a.events.some(e=>e.metadata.token_id===ts[owner].id||e.source_span_ids.some(i=>{const s=f.source_spans.find(s=>s.span_id===i);return s?.start===ts[owner].start&&s?.end===ts[owner].end;}))&&/^(compound|amod)/u.test(ts[owner].dep??'')){visited.add(owner);owner=ts[owner].head;}
   const targets=[...new Map(a.events.filter(e=>(e.metadata.token_id===ts[owner]?.id||e.source_span_ids.some(i=>{const s=f.source_spans.find(s=>s.span_id===i);return s?.start===ts[owner]?.start&&s?.end===ts[owner]?.end;}))&&f.relations.some(r=>r.head_node_id===e.node_id&&r.state==='SUPPORTED'&&['PATIENT','THEME','RESULT'].includes(r.relation_type))).map(e=>[e.node_id,e])).values()];
   if(targets.length!==1)continue;
   const e=targets[0],kind=rule==='EXCLUSIVE_ARGUMENT_MODIFIER'?'ARGUMENT_ONLY':'READ_ONLY',mode=f.tools.node(a.cl,'STATE',t.start,end,{sense:kind==='READ_ONLY'?'READ_ONLY_MODE':'LOCAL_RESTRICTION_MODE',owner:e.node_id,discourse:a.discourse,syntactic_layer:'LOCAL_QUALIFIER',attachment_path:[a.cl.id,t.id,ts[owner].id,e.node_id],owning_proposition_id:a.cl.id,mode:kind}),relation=edge(a,'CONJUNCTION',mode,e,[a.sid]);
   for(const r of f.relations.filter(r=>r.head_node_id===e.node_id&&r.state==='SUPPORTED'))r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),relation.relation_id]);
   e.metadata.local_qualifier_node_ids=uniq([...(e.metadata.local_qualifier_node_ids??[]),mode.node_id]);
   // A positive request and its exclusive restriction are distinct facts.
   // Do not change REQUIRED into FORBIDDEN, or forbid unrelated siblings.
   e.metadata.local_restriction={kind,marker_node_id:mode.node_id,attachment_path:mode.metadata.attachment_path};
   for(const argument of f.relations.filter(r=>r.head_node_id===e.node_id&&r.state==='SUPPORTED'&&['PATIENT','THEME'].includes(r.relation_type))){
    const target=f.semantic_nodes.find(n=>n.node_id===argument.tail_node_id),limit=edge(a,'RESTRICTS',e,target,[...mode.source_span_ids]);
    limit.dependency_relation_ids=uniq([argument.relation_id,relation.relation_id]);
   }
   log.push({event_node_id:e.node_id,mode_node_id:mode.node_id,relation_id:relation.relation_id,source_span_ids:uniq([a.sid,...mode.source_span_ids,...e.source_span_ids]),attachment_path:mode.metadata.attachment_path,rule});
  }
 }
 return f;
}
