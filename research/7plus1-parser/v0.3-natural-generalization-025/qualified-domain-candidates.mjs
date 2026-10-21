import {graphApi,length} from './migration/graph-api.mjs';
import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';

// Qualified domains are candidate objects. Their immediate container and
// argument ownership must still pass Γ; this module does not certify edges.
export function qualifiedDomainCandidates(f){
 const {nm,sp,edge,expr}=graphApi(f),log={domains:[],qualifiers:[],identity:[],unresolved:[],candidate_provider:'SOURCE_SYNTAX_024'};
 f.semantic_decoding.qualified_domain_ir=log;
 const local=(a,text,start,sense,owner)=>f.tools.node(a.cl,'ENTITY',start,start+length(text),{sense,owner,discourse:a.discourse});
 const record=(a,endpoint,base,member,property,relations,owner,scope)=>{
  const body={domain_id:id(endpoint.node_id,'qualified-domain',owner),endpoint_node_id:endpoint.node_id,base_entity_ids:base.map(n=>n.node_id),member_selector:member?{node_id:member.node_id,surface:member.surface}:null,property_selector:property?{node_id:property.node_id,surface:property.surface}:null,quantifier:'ALL',owner_node_id:owner,scope_expr_id:scope??null,source_span_ids:uniq([a.sid,...endpoint.source_span_ids,...base.flatMap(n=>n.source_span_ids),...member?.source_span_ids??[],...property?.source_span_ids??[]]),relation_ids:relations.map(r=>r.relation_id)};
  endpoint.metadata.qualified_domain_id=body.domain_id;log.domains.push(body);return body;
 };
 for(const a of f.analyses){
  if(a.discourse.kind!=='CURRENT_TASK')continue;
  for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.clause_id===a.cl.id&&r.relation_type==='PATIENT')){
   const n=nm(r.tail_node_id),match=/^其中(所有|全部|每个|每项)(.+?)(?:的(.+))?$/u.exec(n.surface),container=n.metadata.local_reference?.referent_node_id;
   if(!match||!container)continue;
   const at=sp(n).start,member=local(a,match[2],at+length(n.surface.slice(0,n.surface.indexOf(match[2]))),'MEMBER_SELECTOR',n.node_id),property=match[3]?local(a,match[3],at+length(n.surface.slice(0,n.surface.lastIndexOf(match[3]))),'PROPERTY_SELECTOR',n.node_id):null;
   const relations=[r,...f.relations.filter(q=>q.state==='SUPPORTED'&&q.head_node_id===n.node_id&&q.relation_type==='PART_OF')];
   relations.push(edge(a,'CONJUNCTION',n,member));if(property)relations.push(edge(a,'CONJUNCTION',n,property));
   const scope=expr(f.expressions.set_expr_nodes,{kind:'ALL',base_entity_node_id:n.node_id,source_span_ids:uniq([a.sid,...n.source_span_ids,...nm(container).source_span_ids]),relation_ids:[r.relation_id]});
   f.expression_plans.set(r.head_node_id,{...f.expression_plans.get(r.head_node_id),scope_expr_id:scope});r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),...relations.filter(q=>q!==r).map(q=>q.relation_id)]);
   record(a,n,[nm(container)],member,property,relations,r.head_node_id,scope);
  }
  for(const st of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id&&n.metadata.sense==='ATTESTED_PROPOSITION_CONTENT')){
   const match=/^(两份|两类|全部|所有)(报告|文档)的(全部|所有)(.+?)(?:得到|都|均)?(保留|记录)$/u.exec(st.surface);
   if(!match)continue;
   const base=[...new Map(f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='PATIENT'&&nm(r.head_node_id)?.metadata.sense==='read'&&nm(r.tail_node_id)?.metadata.literal_tag==='FILEPATH'&&sp(nm(r.tail_node_id)).start<sp(st).start&&f.analyses.find(b=>b.cl.id===r.clause_id)?.parent_structure_id===a.parent_structure_id&&f.analyses.find(b=>b.cl.id===r.clause_id)?.cl.sentence_id===a.cl.sentence_id).map(r=>{const n=nm(r.tail_node_id);return [n.metadata.artifact_identity??n.surface,n];})).values()];
   const requiredCount=/^两/u.test(match[1])?2:null;
   if(!base.length||requiredCount!==null&&base.length!==requiredCount){const u=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE','Quantified proposition report set lacks a unique explicit same-sentence input domain',base.map(n=>n.node_id));st.state='UNRESOLVED';st.unresolved_ref=u;log.unresolved.push({state_node_id:st.node_id,candidate_ids:base.map(n=>n.node_id),unresolved_id:u});continue;}
   const at=sp(st).start,memberText=match[4].replace(/(?:得到|都|均)$/u,''),member=local(a,memberText,at+length(st.surface.slice(0,st.surface.indexOf(memberText))),'MEMBER_SELECTOR',st.node_id),rs=base.map(n=>edge(a,'CONJUNCTION',st,n));rs.push(edge(a,'CONJUNCTION',st,member));
   const domain=record(a,st,base,member,null,rs,st.metadata.owner,null);st.metadata.required_content={predicate:match[5]==='保留'?'PRESERVE':'RECORD',quantifier:'ALL',domain_id:domain.domain_id,base_entity_ids:base.map(n=>n.node_id),member_selector_id:member.node_id,domain_relation_ids:rs.map(r=>r.relation_id),source_span_ids:domain.source_span_ids};
   for(const owns of f.relations.filter(r=>r.state==='SUPPORTED'&&r.tail_node_id===st.node_id&&r.relation_type==='CONJUNCTION'))owns.dependency_relation_ids=uniq([...(owns.dependency_relation_ids??[]),...rs.map(r=>r.relation_id)]);
  }
 }
 return f;
}
