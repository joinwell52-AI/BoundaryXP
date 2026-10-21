// Candidate-only fork of the frozen generic syntax producer. No certified relation is created here.
import {scalar} from '../v0.3-7p-composition-014/semantic-decoder.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Late graph closure uses this same resolver's candidate policy, after artifact
// recovery has exposed the typed result endpoints. No nearest-result fallback.
export function edgeReferenceDomain(f,{event,referent=null,analysis,resultOnly=true}){
 const spans=new Map(f.source_spans.map(s=>[s.span_id,s])),nodes=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 const start=n=>spans.get(n.source_span_ids[0]).start;
 const scope=n=>f.analyses.find(a=>a.cl.id===n.metadata.clause_id)?.discourse??n.metadata.discourse;
 const d=analysis.discourse,section=x=>(x?.structural_path??[]).filter(i=>f.doc.structure.nodes.find(n=>n.id===i)?.type==='HEADING').join('/');
 const q=referent?.surface??'',plural=/^(?:上述|这些|它们|these|those|both)/iu.test(q),count=/([一二两三四五六七八九十]|\d+)\s*(?:份|个)/u.exec(q),requested=count?scalar(count[1]):null;
 const sources=f.relations.filter(r=>r.state==='SUPPORTED'&&(r.relation_type==='RESULT'||!resultOnly&&r.relation_type==='SCOPE_MEMBER')&&['REQUIRED','PERMITTED'].includes(nodes.get(r.head_node_id)?.metadata.modality)&&(!f.expression_plans.get(r.head_node_id)?.condition_expr_id||f.expression_plans.get(r.head_node_id)?.condition_expr_id===f.expression_plans.get(event.node_id)?.condition_expr_id));
 const candidates=sources.map(r=>nodes.get(r.tail_node_id)).filter(n=>n?.node_type==='ENTITY'&&start(n)<start(referent??event)&&!n.metadata.participant_roles?.length&&scope(n)?.kind===d.kind&&section(scope(n))===section(d)&&scope(n)?.owner_structure_id===d.owner_structure_id&&(!/文件|file/iu.test(q)||n.metadata.literal_tag==='FILEPATH'||['FILE','COMPOSITE_ARTIFACT'].includes(n.metadata.technical_type)));
 const domain=[...new Map(candidates.map(n=>[n.metadata.artifact_identity??n.node_id,n])).values()];
 const uniqueGroup=new Set(sources.filter(r=>domain.some(n=>n.node_id===r.tail_node_id)).map(r=>r.head_node_id)).size===1;
 const valid=!referent?.metadata.retain_ambiguity&&domain.length>0&&(plural?uniqueGroup&&(requested===null||requested===domain.length):domain.length===1);
 return {candidates:domain,selected:valid?domain:[],reason:referent?.metadata.retain_ambiguity?'SOURCE_AMBIGUITY_PRESERVED':valid?'UNIQUE_TYPED_STRUCTURAL_DOMAIN':domain.length?'MULTIPLE_COMPATIBLE_ANTECEDENTS':'NO_COMPATIBLE_ANTECEDENT',cardinality:requested,source_span_ids:uniq([...event.source_span_ids,...(referent?.source_span_ids??[]),...domain.flatMap(n=>n.source_span_ids)])};
}
export function resolveLocalReferences(f){
 const {relation}=f.tools;
 const nmap=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 const start=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]).start;
 const info=n=>f.analyses.find(a=>a.cl.id===n.metadata.clause_id);
 const section=n=>f.doc.structure.nodes.filter(x=>x.type==='HEADING'&&x.source_span.end<=start(n)).at(-1)?.id??'DOCUMENT';
 // Source-declared domains, not nearest-token ranking. Competing compatible declarations stay unknown.
 const scoped=f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER').map(r=>nmap.get(r.tail_node_id));
 for(const a of f.analyses)for(const b of a.bindings){
  const old=nmap.get(b.target),event=nmap.get(b.event),before=n=>start(n)<start(old);
  if(old.metadata.retain_ambiguity||old.metadata.resolution?.selected_node_ids?.length)continue;
  const personRef=b.role==='AGENT'&&/^(她|他|she|he|they)$/iu.test(old.surface),countMatch=old.surface.match(/([一二两三四五六七八九十]|\d+|both|two|three)\s*(?:份|个|files?|材料|$)/iu),requestedCount=countMatch?scalar(countMatch[1]):undefined;
  const resultRef=/报告|结果|产物|^it$|report|result|artifact/iu.test(old.surface),file=/文件|报告|材料|资料|file|report/iu.test(old.surface),service=/服务|service/iu.test(old.surface),environment=/环境|environment/iu.test(old.surface);
  const isResult=n=>f.relations.some(r=>r.tail_node_id===n.node_id&&r.relation_type==='RESULT'&&r.state==='SUPPORTED'&&['REQUIRED','PERMITTED'].includes(nmap.get(r.head_node_id)?.metadata.modality));
  const compatible=n=>personRef?n.metadata.participant_roles?.includes('PERFORMER'):resultRef?isResult(n):file?n.metadata.literal_tag==='FILEPATH':service?n.metadata.literal_tag==='SERVICE':environment?n.normalized==='LOCATION'||n.metadata.literal_tag==='SYSTEM':false;
  const plural=/^(上述|前述|前|这|both\b|these|those)/iu.test(old.surface);
  let domain=personRef?f.semantic_nodes.filter(n=>compatible(n)&&before(n)):plural&&!resultRef?scoped.filter(n=>compatible(n)&&before(n)):f.relations.filter(r=>r.relation_type==='RESULT'&&r.state==='SUPPORTED').map(r=>nmap.get(r.tail_node_id)).filter(n=>compatible(n)&&before(n));
  if(!plural&&!domain.length)domain=scoped.filter(n=>compatible(n)&&before(n));
  // Consolidate exact typed literal identity, preserving all occurrence evidence.
  domain=[...new Map(domain.filter(n=>section(n)===section(old)&&n.metadata.discourse?.kind===old.metadata.discourse?.kind).map(n=>[n.surface,n])).values()];
  const declarationIds=uniq(domain.map(n=>info(n)?.scope_group??n.metadata.clause_id));
  const valid=domain.length>0&&(plural?declarationIds.length===1&&(requestedCount===undefined||requestedCount===domain.length):domain.length===1);
  if(!valid&&requestedCount!==undefined)old.metadata.cardinality_diagnostic={requested:requestedCount,available:domain.length,reason:'No unique cardinality-compatible subset'};
  old.metadata.resolution={rule:resultRef?'UNIQUE_TYPED_DELIVERABLE_DOMAIN':plural?'EXPLICIT_TYPED_DECLARATION_SET':'UNIQUE_TYPED_RESULT_OR_DECLARATION',candidate_node_ids:domain.map(n=>n.node_id),selected_node_ids:valid?domain.map(n=>n.node_id):[],candidate_evidence:domain.map(n=>({node_id:n.node_id,clause_id:n.metadata.clause_id,source_span_ids:n.source_span_ids,result_relation_ids:f.relations.filter(r=>r.tail_node_id===n.node_id&&r.relation_type==='RESULT').map(r=>r.relation_id),same_section:true,precedes:true})),evidence_tier:valid?'STRONG':'AMBIGUOUS',source_span_ids:uniq([a.sid,...old.source_span_ids,...domain.flatMap(n=>n.source_span_ids)])};
  if(!valid)continue;
  const prior=f.relations.find(r=>r.head_node_id===event.node_id&&r.tail_node_id===old.node_id);
  if(prior){prior.state='REJECTED';delete prior.unresolved_ref;}
  for(const target of domain){relation(a.cl,'COREFERENCE',old,target,old.metadata.resolution.source_span_ids);relation(a.cl,b.role,event,target,old.metadata.resolution.source_span_ids);}
  old.state='RESOLVED';const ui=f.unresolved.findIndex(u=>u.unresolved_id===old.unresolved_ref);if(ui>=0)f.unresolved.splice(ui,1);delete old.unresolved_ref;
 }
 for(const a of f.analyses)for(const n of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id&&n.node_type==='ENTITY'&&n.metadata.literal_tag!=='ROLE'&&f.relations.some(r=>r.tail_node_id===n.node_id&&r.relation_type==='AGENT'&&r.state==='SUPPORTED'&&['REQUIRED','PERMITTED'].includes(nmap.get(r.head_node_id)?.metadata.modality)))){
  const domain=f.semantic_nodes.filter(x=>(x.metadata.literal_tag==='ROLE'||x.metadata.participant_roles?.includes('PERFORMER'))&&x.surface.length>n.surface.length&&(x.surface.endsWith(n.surface)||/^\p{Script=Latin}/u.test(n.surface)&&x.surface.split(/\s+/u).includes(n.surface))&&x.node_id!==n.node_id&&start(x)<start(n)&&section(x)===section(n));
  n.metadata.identity_candidate_node_ids=domain.map(x=>x.node_id);
  if(domain.length===1){n.metadata.referent_node_id=domain[0].node_id;n.metadata.participant_roles=uniq([...(n.metadata.participant_roles??[]),'PERFORMER']);relation(a.cl,'COREFERENCE',n,domain[0],[a.sid,...domain[0].source_span_ids]);}
 }
 return f;
}

