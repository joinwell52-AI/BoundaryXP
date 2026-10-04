import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {graphApi,length} from './graph-api.mjs';

// An uncertainty on a local argument is a dependency of its containing fact.
// Candidate order is only a visibility bound; it is never a ranking rule.
export function closeReferenceFrontier(f){
 const {nm,sp}=graphApi(f),records=[];f.semantic_decoding.reference_certification_frontier=records;
 const identity=n=>n.metadata.artifact_identity??n.surface;
 const unique=ns=>[...new Map(ns.filter(Boolean).map(n=>[identity(n),n])).values()];
 const atom=n=>n.surface.replace(/^[“「"']|[”」"']$/gu,'').trim();
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;
  for(const event of a.events){
   const local=f.relations.filter(r=>r.state!=='REJECTED'&&r.head_node_id===event.node_id&&['PATIENT','THEME','RESULT','FORBIDS','RESTRICTS'].includes(r.relation_type));
   for(const relation of local){const object=nm(relation.tail_node_id),text=atom(object);
    if(!/^(?:该报告|该文档|上述报告|其中一个|其中一份|其|它|it|the report|the document|原始数据|原始材料)$/iu.test(text))continue;
    const report=/报告|文档|report|document/iu.test(text);
    const candidates=unique(f.relations.filter(r=>r.state==='RESOLVED'&&(report?r.relation_type==='RESULT':['RESULT','SCOPE_MEMBER'].includes(r.relation_type))&&sp(nm(r.tail_node_id)).start<sp(object).start&&boundaryDomain(nm(r.tail_node_id).metadata.discourse??a.discourse)).map(r=>nm(r.tail_node_id))).filter(n=>n.node_id!==object.node_id&&(!report||/报告|文档|\.(?:md|txt|docx)$/iu.test(n.surface)));
    const aliases=f.relations.filter(r=>r.state==='RESOLVED'&&r.relation_type==='COREFERENCE'&&r.head_node_id===object.node_id);
    const ambiguity=f.unresolved.find(u=>/COREFERENCE|SCOPE/u.test(u.kind)&&u.related_node_ids.includes(object.node_id));
    if(candidates.length===1&&!ambiguity&&aliases.some(r=>r.tail_node_id===candidates[0].node_id))continue;
    // A generic unresolved argument must never be certified as a concrete
    // new task object, even if another pass emitted a lexical local frame.
    if(candidates.length!==1||ambiguity){
     const uid=ambiguity?.unresolved_id??f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE','Reference argument does not have one certified structurally bounded compatible antecedent',[object.node_id,...candidates.map(n=>n.node_id)]);
     object.state='UNRESOLVED';object.unresolved_ref=uid;event.state='UNRESOLVED';event.unresolved_ref=uid;
     relation.state='UNRESOLVED';relation.unresolved_ref=uid;
     f.expression_plans.set(event.node_id,{...f.expression_plans.get(event.node_id),unresolved_ref:uid});
     for(const r of f.relations.filter(r=>r.tail_node_id===object.node_id&&r.relation_type==='SCOPE_MEMBER')){r.state='UNRESOLVED';r.unresolved_ref=uid;}
     records.push({event_node_id:event.node_id,reference_node_id:object.node_id,candidate_node_ids:candidates.map(n=>n.node_id),unresolved_ref:uid,source_span_ids:uniq([a.sid,...object.source_span_ids,...candidates.flatMap(n=>n.source_span_ids)]),rule:'UNCERTAIN_ARGUMENT_BLOCKS_DEPENDENT_FACT'});
    }
   }
  }
 }
 return f;
}

// Source-defined exclusions of a responsibility are states, not executions.
// In particular, "does not approve" must not create REQUIRED approval.
export function closeNegativeRoleDeclarations(f){
 const {nm,edge,retire}=graphApi(f),log=[];f.semantic_decoding.negative_role_declarations=log;
 const rules=[['APPROVER',/(?:审批|批准|\bapprov(?:e|er|al)\b)/iu],['REVIEWER',/(?:复核|审核|\breview(?:er)?\b)/iu],['SUBMITTER',/(?:提交|\bsubmit(?:ter)?\b)/iu],['PERFORMER',/(?:检查|执行|\bperform(?:er)?\b|\binspect\b)/iu]];
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;const raw=a.cl.span.quote;
  const match=/^(.+?)\s*(?:不负责|不参与|不具有)\s*(.+)$/u.exec(raw)??/^(.+?)\s+(?:does\s+not|is\s+not\s+(?:an?\s+)?)\s*(.+)$/iu.exec(raw);
  if(!match)continue;const name=match[1].trim(),roles=rules.filter(([,pattern])=>pattern.test(match[2])).map(([role])=>role);if(!roles.length)continue;
  const candidates=[...new Map(f.semantic_nodes.filter(n=>n.metadata.participant_eligibility?.eligible&&(n.surface===name||n.metadata.identity_name===name)).map(n=>[n.metadata.identity_name??n.surface,n])).values()];
  retire(a,'NEGATIVE_ROLE_DECLARATION_NOT_CURRENT_ACTION');
  const state=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'ROLE_NOT_ASSIGNED',owner:a.cl.id,discourse:a.discourse,polarity:'NEGATIVE',negative_roles:roles,explicit_subject_text:name,scope_owner_node_id:f.tools.task.node_id});a.state=state;
  if(candidates.length!==1){state.state='UNRESOLVED';state.unresolved_ref=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE','Negative role subject has no unique existing typed participant',[state.node_id,...candidates.map(n=>n.node_id)]);}
  else {const person=candidates[0];person.metadata.negative_roles=uniq([...(person.metadata.negative_roles??[]),...roles]);edge(a,'AGENT',state,person);}
  log.push({state_node_id:state.node_id,subject_node_id:candidates.length===1?candidates[0].node_id:null,candidate_node_ids:candidates.map(n=>n.node_id),negative_roles:roles,source_span_ids:uniq([a.sid,...state.source_span_ids,...candidates.flatMap(n=>n.source_span_ids)]),rule:'EXPLICIT_NEGATIVE_RESPONSIBILITY_STATE'});
 }
 return f;
}
