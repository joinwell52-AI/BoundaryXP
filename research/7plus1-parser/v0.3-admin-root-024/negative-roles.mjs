import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {predicateEnclosure} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {graphApi} from './migration/graph-api.mjs';

// Explicit negative responsibilities are source states. They neither grant
// Authority nor prohibit an action by themselves. Quoted declarations are data.
export function negativeRoles(f){
 const {edge,retire}=graphApi(f),log=[];f.semantic_decoding.negative_role_declarations=log;
 const rules=[['APPROVER',/审批|批准|\bapprov(?:e|er|al)\b/iu],['REVIEWER',/复核|审核|\breview(?:er)?\b/iu],['SUBMITTER',/提交|\bsubmit(?:ter)?\b/iu],['PERFORMER',/检查|执行|\bperform(?:er)?\b|\binspect\b/iu]];
 for(const a of f.analyses){
  if(!boundaryDomain(a.discourse))continue;const raw=a.cl.span.quote;
  const m=/^(.+?)\s*(?:不负责|不参与|不具有)\s*(.+)$/u.exec(raw)??/^(.+?)\s+(?:does\s+not|is\s+not\s+(?:an?\s+)?)\s*(.+)$/iu.exec(raw);if(!m||predicateEnclosure({start:a.cl.span.start,quote:raw},a.cl.span.start+[...m[1]].length).length)continue;
  const roles=rules.filter(([,r])=>r.test(m[2])).map(([r])=>r);if(!roles.length)continue;
  const name=m[1].trim(),task=/^(本任务|this task|the task)$/iu.test(name),domain=[...new Map(f.semantic_nodes.filter(n=>n.metadata.participant_eligibility?.eligible&&(n.surface===name||n.metadata.identity_name===name)).map(n=>[n.metadata.identity_name??n.surface,n])).values()];
  retire(a,'NEGATIVE_RESPONSIBILITY_STATE');const state=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'ROLE_NOT_ASSIGNED',owner:a.cl.id,discourse:a.discourse,polarity:'NEGATIVE',negative_roles:roles,explicit_subject_text:name,scope_owner_node_id:f.tools.task.node_id});a.state=state;
  if(task)edge(a,'CONJUNCTION',state,f.tools.task);
  else if(domain.length===1){const who=domain[0];who.metadata.negative_roles=uniq([...(who.metadata.negative_roles??[]),...roles]);who.metadata.participant_roles=(who.metadata.participant_roles??[]).filter(r=>!roles.includes(r));f.admin_explicit_roles.set(who.node_id,who.metadata.participant_roles);edge(a,'AGENT',state,who);}
  else{const u=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE','Negative responsibility lacks one source-typed subject',domain.map(n=>n.node_id));state.state='UNRESOLVED';state.unresolved_ref=u;}
  log.push({state_node_id:state.node_id,subject_node_id:task?f.tools.task.node_id:domain.length===1?domain[0].node_id:null,candidate_node_ids:domain.map(n=>n.node_id),negative_roles:roles,source_span_ids:[a.sid],rule:'EXPLICIT_NEGATIVE_RESPONSIBILITY_STATE'});
 }
 return f;
}
