import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {graphApi,length} from './graph-api.mjs';
import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {predicateEnclosure} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
export function closeRoleDeclarations(f){const {nm,edge,retire}=graphApi(f);f.semantic_decoding.participant_role_ir=[];
 for(const a of f.analyses){const raw=a.cl.span.quote;
  if(!boundaryDomain(a.discourse))continue;
  const receive=/^(.+?)\s*(?:仅|只)?(?:作为|是)(?:报告)?接收(?:人|者)$/u.exec(raw);
  const negativeMatch=/(?:不负责|不具有).*?(?:审批|批准).*?(?:职责)?$/u.exec(raw);
  const negative=!!negativeMatch&&!predicateEnclosure({start:a.cl.span.start,quote:raw},a.cl.span.start+length(raw.slice(0,negativeMatch.index))).length;
  if(!receive&&!negative)continue;
  const prior=f.analyses.filter(x=>x.cl.sentence_id===a.cl.sentence_id&&x.cl.span.end<a.cl.span.start);
  const identities=[...new Map(prior.flatMap(x=>f.relations.filter(r=>r.clause_id===x.cl.id&&r.state==='RESOLVED'&&r.relation_type==='AGENT').map(r=>nm(r.tail_node_id))).filter(n=>n.metadata.participant_eligibility?.eligible).map(n=>[n.metadata.identity_name??n.surface,n])).values()];
  retire(a,'EXPLICIT_ROLE_DECLARATION_IS_NOT_EXECUTION');
  const state=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:receive?'PARTICIPANT_ROLE':'ROLE_NOT_ASSIGNED',owner:a.cl.id,discourse:a.discourse,polarity:negative?'NEGATIVE':'POSITIVE',role:receive?'RECIPIENT':'APPROVER'});a.state=state;
  let person=null;
  if(receive){const start=a.cl.span.start+length(raw.slice(0,raw.indexOf(receive[1])));person=f.tools.node(a.cl,'ENTITY',start,start+length(receive[1].trim()),{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',owner:a.cl.id,discourse:a.discourse});person.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_ROLE_USE_SITE',source_span_ids:[a.sid,...person.source_span_ids]};const roles=uniq([...(f.admin_explicit_roles.get(person.node_id)??[]),'RECIPIENT']);person.metadata.participant_roles=roles;f.admin_explicit_roles.set(person.node_id,roles);edge(a,'AGENT',state,person);}
  else if(identities.length===1)person=identities[0];
  if(person&&negative){const roles=(f.admin_explicit_roles.get(person.node_id)??person.metadata.participant_roles??[]).filter(x=>x!=='APPROVER');f.admin_explicit_roles.set(person.node_id,roles);person.metadata.participant_roles=roles;person.metadata.negative_roles=uniq([...(person.metadata.negative_roles??[]),'APPROVER']);edge(a,'AGENT',state,person);}
  f.semantic_decoding.participant_role_ir.push({state_node_id:state.node_id,participant_node_id:person?.node_id??null,role:receive?'RECIPIENT':'APPROVER',polarity:negative?'NEGATIVE':'POSITIVE',source_span_ids:[a.sid,...state.source_span_ids],rule:'EXPLICIT_ROLE_DECLARATION'});
 }
 for(const n of f.semantic_nodes.filter(n=>n.metadata.participant_eligibility?.eligible&&!n.metadata.identity_name)){const domain=f.semantic_nodes.filter(p=>p.metadata.participant_eligibility?.eligible&&p.metadata.identity_name===n.surface&&p.surface!==n.surface);const names=uniq(domain.map(p=>p.metadata.identity_name));if(names.length!==1||!domain.length)continue;const target=domain.find(p=>p.metadata.qualified_identity_evidence)??domain[0],a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id);n.metadata.identity_name=names[0];n.metadata.referent_node_id=target.node_id;const r=edge(a,'COREFERENCE',n,target,uniq([...n.source_span_ids,...target.source_span_ids]));f.semantic_decoding.participant_role_ir.push({rule:'UNIQUE_SOURCE_TYPED_PARTICIPANT_ALIAS',participant_node_id:n.node_id,referent_node_id:target.node_id,relation_ids:[r.relation_id],source_span_ids:uniq([...n.source_span_ids,...target.source_span_ids])});}
 f.tools.attachContext();buildSemanticOwnership(f,'ADMIN_ROOT_019_ROLES');return f;
}
