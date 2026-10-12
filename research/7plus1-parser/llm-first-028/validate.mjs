import Ajv from 'ajv';
import {proposalSchema,auditSchema,views} from './contracts/schema.mjs';
import {linkSources} from './source.mjs';
import {isSetDomain} from './quantity-domain.mjs';
import {propertyTestErrors} from './property-tests.mjs';
const ajv=new Ajv({allErrors:true,strict:false});
const validators={proposal:ajv.compile(proposalSchema),audit:ajv.compile(auditSchema)};
export function validateSchema(kind,value){const v=validators[kind];return {ok:v(value),errors:structuredClone(v.errors??[])};}
export const graphItems=g=>['entities','events','claims','expressions'].flatMap(k=>g[k].map(item=>({collection:k,...item})));
export function normalizedFieldPath(item,path){
 const root=`${item.collection}[${item.id}]`;
 return path===root?'':path.startsWith(root+'.')?path.slice(root.length+1):path;
}
// Qualified paths identify a direct target; other listed IDs remain context.
// Never interpret free-text reasons or source text to choose affected semantics.
export function issueTargetsItem(issue,item,index=null){
 if(!issue.subject_ids?.includes(item.id))return false;
 const qualified=/^(entities|events|claims|expressions)\[([^\]]+)\](?:\.|$)/.exec(issue.field_path??'');
 if(qualified&&index&&(!index.has(qualified[2])||index.get(qualified[2]).collection!==qualified[1]||!issue.subject_ids.includes(qualified[2])))return true;
 return !qualified||(qualified[1]===item.collection&&qualified[2]===item.id);
}
export function technicalValidate(source,g,audit,{requireSourceAudit=false}={}){
 const schemas={proposal:validateSchema('proposal',g),audit:validateSchema('audit',audit)};
 if(!schemas.proposal.ok||!schemas.audit.ok)return {policy:'028-r02-technical-v1',schemas,rows:[],diagnostics:[{code:'SCHEMA_REJECTED',errors:schemas}],coverage:[],audit_sources:[]};
 const items=graphItems(g), index=new Map(items.map(x=>[x.id,x])), duplicates=items.map(x=>x.id).filter((id,i,all)=>all.indexOf(id)!==i);
 const rows=new Map(),diagnostics=[],audit_sources=[],issue_sources=[];
 const ref=(id,collection)=>id==='ROOT'?!collection:index.has(id)&&(!collection||index.get(id).collection===collection);
 const auditBad=new Set(),sourceIssueBad=new Set();
 for(const issue of g.issues){try{linkSources(source,issue.sources);}catch{sourceIssueBad.add(issue.id);}}
 for(const item of [...audit.reviews,...audit.issues,...audit.omissions]){
  try{audit_sources.push({subject_id:item.subject_id??item.id,sources:linkSources(source,item.sources)});}
  catch(e){diagnostics.push({code:'AUDIT_SOURCE_INVALID',id:item.subject_id??item.id,message:e.message});auditBad.add(item.subject_id??item.id);}
  for(const id of [...(item.subject_id?[item.subject_id]:item.subject_ids??[]),...(item.context_refs??[])])if(!ref(id)){diagnostics.push({code:'AUDIT_DANGLING_REFERENCE',id});auditBad.add(item.subject_id??item.id);}
 }
 for(const x of items){
  const errors=[],uncertain=[],linked=[];
  const bad=(code,detail=null)=>errors.push({code,detail});
  if(x.id==='ROOT'||duplicates.includes(x.id))bad('ID_NOT_UNIQUE');
  try{linked.push(...linkSources(source,x.sources??x.mentions));}catch(e){bad('SOURCE_LINK_ERROR',e.message);}
  for(const dep of x.requires??[])if(!ref(dep))bad('DANGLING_REQUIRED_DEPENDENCY',dep);
  if(x.collection==='entities'){
   for(const id of x.alternatives)if(!ref(id,'entities')||id===x.id)bad('BAD_IDENTITY_ALTERNATIVE',id);
   if(x.alternatives.length>1)uncertain.push('COMPETING_IDENTITIES');
   if(x.members!==undefined&&x.members!==null&&
    (x.type!=='GROUP'||new Set(x.members).size!==x.members.length||x.members.some(id=>id===x.id||!ref(id,'entities'))))bad('GROUP_MEMBER_BINDING');
  }
  if(x.collection==='events'){
   if(!ref(x.owner_id,x.owner_id==='ROOT'?null:'events'))bad('BAD_STRUCTURAL_OWNER');
   if(x.semantic_signature){
    const s=x.semantic_signature;
    if(s.external_input_ids&& (new Set(s.external_input_ids).size!==s.external_input_ids.length||s.external_input_ids.some(id=>!ref(id,'entities'))))bad('EXTERNAL_INPUT_IDENTITY_SIGNATURE');
    for(const id of s.external_input_ids??[])if(!g.claims.some(c=>c.kind==='ROLE'&&c.event_id===x.id&&c.entity_id===id&&['INPUT_OBJECT','OBJECT'].includes(c.role)))bad('EXTERNAL_INPUT_ROLE_BINDING',id);
    for(const id of s.external_input_ids??[])if(g.claims.some(c=>c.kind==='ARTIFACT_USE'&&c.event_id===x.id&&c.entity_id===id))bad('INTERNAL_RESULT_NOT_EXTERNAL_INPUT',id);
    if(!s.effects.length||new Set(s.effects).size!==s.effects.length)bad('SEMANTIC_EFFECT_SIGNATURE');
    if(new Set(s.state_links.map(v=>v.expression_id)).size!==s.state_links.length)bad('DUPLICATE_STATE_LINK');
    if(s.continuation_targets?.length&&!s.effects.some(v=>['STOP','CONTINUE'].includes(v)))bad('CONTINUATION_SCOPE_MISPLACED');
    if(new Set(s.continuation_targets??[]).size!==s.continuation_targets?.length)bad('DUPLICATE_CONTINUATION_TARGET');
    for(const id of s.continuation_targets??[])if(id===x.id||!ref(id,'events')||index.get(id).use!=='CURRENT_TASK'||index.get(id).layer!=='MAIN')bad('CONTINUATION_SCOPE_ENDPOINT',id);
    for(const link of s.state_links){const state=index.get(link.expression_id);
     if(state?.collection!=='expressions'||state.op!=='STATE'||state.state?.event_id!==x.id||state.state?.polarity!=='POSITIVE')bad('STATE_LINK_OWNERSHIP',link.expression_id);
     if(link.aspect==='SUCCESS'&&link.relation!=='STATE_IMPLIES_EVENT')bad('SUCCESS_IS_NOT_EVENT_COMPLETION');
     if(link.aspect==='CONTROL_EFFECT'&&(!s.effects.includes('STOP')||link.relation!=='EVENT_IMPLIES_STATE'))bad('CONTROL_EFFECT_SIGNATURE');
    }
   }
   if(x.specifies_result_id!=null){
    const result=index.get(x.specifies_result_id),producer=index.get(result?.event_id);
    if(x.layer!=='CONTENT'||x.use!=='MENTION_ONLY'||result?.kind!=='ROLE'||result.role!=='RESULT'||x.owner_id!==result.event_id||producer?.use!=='CURRENT_TASK'||!['REQUIRED','PERMITTED'].includes(producer.modality))bad('OUTPUT_BEHAVIOR_OWNER_BINDING');
    const covers=(result?.sources??[]).some(s=>{try{return linkSources(source,[s]).some(t=>linked.some(p=>p.span[0]<=t.span[0]&&p.span[1]>=t.span[1]));}catch{return false;}});
    if(!covers)bad('OUTPUT_BEHAVIOR_SOURCE_BINDING');
   }
   for(const id of x.constraint_ids){const c=index.get(id);if(c?.collection!=='claims'||!['CONDITION','QUANTITY','TEMPORAL'].includes(c.kind)||c.event_id!==x.id)bad('CONSTRAINT_BINDING_MISSING',id);}
   if(new Set(x.constraint_ids).size!==x.constraint_ids.length)bad('DUPLICATE_CONSTRAINT');
  }
  if(x.collection==='claims'){
   if(x.kind!=='ARTIFACT_USE'&&x.artifact_use!==null)bad('ARTIFACT_USE_FIELD_MISPLACED');
   if(!ref(x.scope_id))bad('BAD_SCOPE_TARGET');
   if(x.event_id!==null&&!ref(x.event_id,'events'))bad('BAD_EVENT_REFERENCE');
   if(x.entity_id!==null&&!ref(x.entity_id,'entities'))bad('BAD_ENTITY_REFERENCE');
   if(x.expression_id!==null&&!ref(x.expression_id,'expressions'))bad('BAD_EXPRESSION_REFERENCE');
   if(x.kind==='ROLE'&&(x.event_id===null||x.entity_id===null||x.role===null||x.expression_id!==null||x.quantity!==null||x.direction!==null||x.temporal!==null))bad('ROLE_SIGNATURE');
   if(['CONDITION','TEMPORAL'].includes(x.kind)){
    if(x.event_id===null||x.expression_id===null||x.entity_id!==null||x.role!==null||x.quantity!==null)bad('CONDITION_SIGNATURE');
    if(!index.get(x.event_id)?.constraint_ids?.includes(x.id))bad('CONSTRAINT_REVERSE_BINDING_MISSING');
    if(x.kind==='CONDITION'&&!['NECESSARY','SUFFICIENT','IFF'].includes(x.direction))bad('CONDITION_DIRECTION');
    if(x.kind==='TEMPORAL'&&(x.direction!=='ORDER'||x.temporal===null))bad('TEMPORAL_DIRECTION');
   }
   if(['COMPLETION','STOP'].includes(x.kind)&&(x.scope_id!=='ROOT'||x.event_id!==null||x.expression_id===null||!['NECESSARY','SUFFICIENT','IFF'].includes(x.direction)||x.role!==null||x.quantity!==null))bad('ROOT_TRANSITION_SIGNATURE');
   if(x.kind==='SCOPE'&&(x.expression_id===null||x.role!==null||x.quantity!==null))bad('SCOPE_SIGNATURE');
   if(x.scope_binding){const b=x.scope_binding;
    if(x.kind!=='SCOPE')bad('SCOPE_BINDING_MISPLACED');
    if(b.subject_mode==='TASK_OPERATIONS'&&(x.scope_id!=='ROOT'||x.event_id!==null||b.subject_event_ids.length))bad('GLOBAL_SCOPE_BINDING');
    if(b.subject_mode==='EVENTS'&&!b.subject_event_ids.length)bad('EMPTY_SCOPE_SUBJECTS');
    if(new Set(b.subject_event_ids).size!==b.subject_event_ids.length)bad('DUPLICATE_SCOPE_SUBJECT');
    for(const id of b.subject_event_ids)if(!ref(id,'events')||index.get(id).layer!=='MAIN'||index.get(id).use!=='CURRENT_TASK')bad('SCOPE_SUBJECT_ENDPOINT',id);
   }
   if(x.kind==='ARTIFACT_USE'){
    const binding=x.artifact_use,producer=index.get(binding?.producer_result_id),consumer=index.get(binding?.consumer_role_id);
    if(!binding||x.event_id===null||x.entity_id===null||x.scope_id!==x.event_id||x.role!==null||x.expression_id!==null||x.quantity!==null||x.direction!==null||x.temporal!==null)bad('ARTIFACT_USE_SIGNATURE');
    if(producer?.collection!=='claims'||producer.kind!=='ROLE'||producer.role!=='RESULT'||producer.entity_id!==x.entity_id)bad('ARTIFACT_PRODUCER_BINDING');
    if(consumer?.collection!=='claims'||consumer.kind!=='ROLE'||!['OBJECT','INPUT_OBJECT','DELIVERABLE'].includes(consumer.role)||consumer.entity_id!==x.entity_id||consumer.event_id!==x.event_id)bad('ARTIFACT_CONSUMER_BINDING');
    if(producer?.event_id===x.event_id)bad('ARTIFACT_SELF_USE');
    // Check both declared endpoints; do not interpret their source words.
    const covers=refs=>(refs??[]).some(r=>{try{return linkSources(source,[r]).some(t=>linked.some(s=>s.span[0]<=t.span[0]&&s.span[1]>=t.span[1]));}catch{return false;}});
    if(!covers(producer?.sources)||!covers(consumer?.sources))bad('ARTIFACT_USE_SOURCE_ENDPOINTS');
   }
   if(x.kind==='QUANTITY'){
    const q=x.quantity;
    const rootLimit=q?.use==='EXECUTION_LIMIT'&&q.target_id==='ROOT'&&q.count_scope==='ROOT'&&x.scope_id==='ROOT'&&x.event_id===null&&q.distribution?.mode==='AGGREGATE'&&q.distribution.domain_id===null;
    if(!q||x.event_id===null&&!rootLimit||x.entity_id!==null||x.role!==null||x.expression_id!==null||x.direction!==null||x.temporal!==null)bad('QUANTITY_SIGNATURE');
    if(q){
     if(!ref(q.target_id)||!ref(q.count_scope)||q.value<0||!Number.isFinite(q.value))bad('QUANTITY_TARGET_OR_VALUE');
     const ownEvent=index.get(x.event_id);
     const targetOwned=q.target_id===x.event_id||g.claims.some(c=>c.kind==='ROLE'&&c.event_id===x.event_id&&c.entity_id===q.target_id);
     if(!rootLimit&&(!targetOwned||!ownEvent?.constraint_ids?.includes(x.id)))bad('QUANTITY_OWNERSHIP');
     if(q.use==='EXECUTION_LIMIT'&&!rootLimit&&q.target_id!==x.event_id)bad('EXECUTION_QUANTITY_TARGET');
     if(q.use==='WORK_PLAN'&&q.target_id!==x.event_id)bad('PLAN_QUANTITY_TARGET');
     if(q.use==='OUTPUT_CONTENT'&&!g.claims.some(c=>c.kind==='ROLE'&&['RESULT','DELIVERABLE'].includes(c.role)&&c.event_id===x.event_id&&c.entity_id===q.target_id))bad('CONTENT_QUANTITY_RESULT_TARGET');
     if(q.distribution?.mode==='AGGREGATE'&&q.distribution.domain_id!==null)bad('AGGREGATE_QUANTITY_HAS_MEMBER_DOMAIN');
     if(q.distribution?.mode==='EACH'){
      if(!q.distribution.domain_id||!isSetDomain(g.expressions,g.entities,q.distribution.domain_id))bad('EACH_QUANTITY_DOMAIN');
      const targets=new Set([q.target_id,x.event_id]);
      const leaves=(key,seen=new Set())=>{if(seen.has(key))return [];seen.add(key);const e=index.get(key);return e?.op==='ITEM'?e.operands:e?.operands?.flatMap(k=>leaves(k,seen))??[];};
      g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===x.event_id&&['OBJECT','INPUT_OBJECT','RESULT','DELIVERABLE','CONTENT'].includes(c.role)).forEach(c=>targets.add(c.entity_id));
      const contained=(id,seen=new Set())=>{if(seen.has(id))return [];seen.add(id);return [id,...(index.get(id)?.members??[]).flatMap(k=>contained(k,seen))];};
      const owned=new Set([...targets].flatMap(k=>contained(k)));
      if(leaves(q.distribution.domain_id).some(id=>!owned.has(id)))bad('EACH_QUANTITY_DOMAIN_OWNERSHIP');
      if(q.count_scope!=='ROOT'&&!owned.has(q.count_scope))bad('EACH_COUNT_SCOPE_OWNERSHIP');
      const d=index.get(q.distribution.domain_id);
      if(d?.op==='ITEM'&&d.operands[0]===q.target_id&&index.get(q.target_id)?.type==='GROUP')bad('EACH_GROUP_ITEM_NOT_MEMBERS');
     }
    }
   }
  }
  if(x.collection==='expressions'){
   const n=x.operands.length;
   if(x.op!=='TEST'&&x.test!=null)bad('PROPERTY_TEST_MISPLACED');
   if(x.op==='TEST'){
    if(n!==0||x.state!==null||!x.test)bad('PROPERTY_TEST_SIGNATURE');
    const t=x.test;
    if(t){
     for(const code of propertyTestErrors(t))bad(code);
     if(!ref(t.target_id)||t.target_id==='ROOT'||!['entities','events'].includes(index.get(t.target_id)?.collection))bad('PROPERTY_TEST_TARGET');
     if(t.operator==='IMMEDIATE'&&index.get(t.target_id)?.collection!=='events')bad('IMMEDIATE_EVENT_TARGET');
     if(t.event_id!==null){
      if(!ref(t.event_id,'events'))bad('PROPERTY_TEST_EVENT_REFERENCE');
      const owns=t.target_id===t.event_id||g.claims.some(c=>c.kind==='ROLE'&&c.event_id===t.event_id&&c.entity_id===t.target_id);
      if(!owns)bad('PROPERTY_TEST_ARGUMENT_OWNERSHIP');
     }
    }
   }else if(x.op==='STATE'){
    if(!x.state||n!==0)bad('STATE_SIGNATURE');
    if(x.state){
     if(x.state.event_id!==null&&!ref(x.state.event_id,'events'))bad('STATE_EVENT_REFERENCE');
     for(const id of x.state.args)if(!ref(id))bad('STATE_ARGUMENT_REFERENCE',id);
     if(x.state.event_id!==null){
      const expanded=(id,seen=new Set())=>{if(seen.has(id))return [];seen.add(id);return [id,...(index.get(id)?.members??[]).flatMap(k=>expanded(k,seen))];};
      const owned=new Set(g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===x.state.event_id).flatMap(c=>expanded(c.entity_id)));
      // ROOT is a scope sentinel, not a source-backed object/member endpoint.
      if(x.state.args.includes('ROOT'))bad('STATE_EVENT_ARGUMENT_OWNERSHIP','ROOT');
      for(const id of x.state.args.filter(k=>index.get(k)?.collection==='entities')){
       const entity=index.get(id),explicitSubset=entity.type==='GROUP'&&Array.isArray(entity.members)&&entity.members.length>0&&entity.members.every(k=>owned.has(k));
       if(!owned.has(id)&&!explicitSubset)bad('STATE_EVENT_ARGUMENT_OWNERSHIP',id);
      }
     }
    }
   }else{
    if(x.state!==null)bad('NON_STATE_SIGNATURE');
    if(x.op==='ITEM'){if(n!==1||!ref(x.operands[0],'entities'))bad('ITEM_SIGNATURE');}
    else{if((['NOT','MEMBERS'].includes(x.op)&&n!==1)||(x.op==='EXCEPT'&&n!==2)||(!['NOT','MEMBERS','EXCEPT'].includes(x.op)&&n<2))bad('EXPRESSION_ARITY');for(const id of x.operands)if(!ref(id,'expressions'))bad('EXPRESSION_OPERAND',id);if(x.op==='MEMBERS'&&!isSetDomain(g.expressions,g.entities,x.id))bad('MEMBERS_GROUP_SIGNATURE');}
   }
  }
  const localIssues=g.issues.filter(i=>issueTargetsItem(i,x,index)&&i.kind!=='UNSPECIFIED');
  const auditIssues=audit.issues.filter(i=>issueTargetsItem(i,x,index));
  for(const issue of localIssues)uncertain.push(sourceIssueBad.has(issue.id)?'ISSUE_SOURCE_INVALID':issue.kind);
  for(const issue of auditIssues)uncertain.push(auditBad.has(issue.id)?'AUDIT_INVALID':'AUDIT_ISSUE:'+issue.issue_kind);
  const reviews=audit.reviews.filter(r=>r.subject_id===x.id).map(r=>({...r,field_path:normalizedFieldPath(x,r.field_path)}));
  if(!reviews.some(r=>r.field_path===''&&r.verdict==='SUPPORT'))uncertain.push('WHOLE_CLAIM_SUPPORT_MISSING');
  if(reviews.some(r=>r.verdict!=='SUPPORT'))uncertain.push('AUDIT_NOT_SUPPORTED');
  if(auditBad.has(x.id))uncertain.push('AUDIT_INVALID');
  const status=errors.length?'REJECTED':uncertain.length?'UNRESOLVED':'ACCEPTED';
  // Only the declared metadata property is detachable; no free-text reason parsing.
  const typeOnly=x.collection==='entities'&&x.alternatives.length===0&&errors.length===0&&!auditBad.has(x.id)
   &&([...localIssues,...auditIssues].length>0||reviews.some(r=>r.field_path==='type'&&r.verdict!=='SUPPORT'))
   &&[...localIssues,...auditIssues].every(i=>normalizedFieldPath(x,i.field_path)==='type'&&!auditBad.has(i.id)&&!sourceIssueBad.has(i.id))
   &&(reviews.some(r=>r.field_path===''&&r.verdict!=='CONTRADICT')
      ||reviews.some(r=>r.field_path==='label'&&r.verdict==='SUPPORT'))
   &&reviews.every(r=>r.verdict==='SUPPORT'||r.field_path==='type'||r.field_path===''&&r.verdict==='UNCERTAIN');
  rows.set(x.id,{id:x.id,collection:x.collection,status,direct_status:status,...(x.collection==='entities'?{identity_status:typeOnly?'ACCEPTED':status}:{}),errors,uncertain,sources:linked,audit_refs:reviews.map(r=>({subject_id:r.subject_id,field_path:r.field_path,verdict:r.verdict})),required_dependencies:x.requires??[],structural_refs:[],...(typeOnly?{unresolved_properties:['type'],identity_policy:'SOURCE_AND_IDENTITY_SUPPORTED_TYPE_METADATA_ONLY'}:{})});
 }
 const typedTests=(id,seen=new Set())=>{if(seen.has(id))return [];seen.add(id);const e=index.get(id);if(e?.op==='TEST')return rows.get(id)?.errors.length?[]:[id];return (e?.operands??[]).flatMap(k=>typedTests(k,seen));};
 for(const c of g.claims.filter(c=>c.kind==='SCOPE')){
  // An event's own property and its explicitly bound arguments share one ownership contract.
  // ROOT remains a scope sentinel, not a TEST target; unrelated events are not inherited.
  const targets=new Set([c.scope_id,c.event_id,...(c.event_id===null&&c.scope_id==='ROOT'&&c.entity_id?[c.entity_id]:[]),...g.claims.filter(r=>r.kind==='ROLE'&&r.event_id===c.event_id).map(r=>r.entity_id)].filter(Boolean));
  for(const id of typedTests(c.expression_id)){const t=index.get(id).test;if(!targets.has(t.target_id)||t.event_id!==null&&t.event_id!==c.event_id){const row=rows.get(c.id);row.status='REJECTED';row.errors.push({code:'PROPERTY_SCOPE_ARGUMENT_OWNERSHIP',detail:id});}}
 }
 // Only real mandatory dependencies and identity/expression inputs propagate. Not owner/context edges.
 const membersOf=(id,seen=new Set())=>{if(seen.has(id))return [];seen.add(id);return [id,...(index.get(id)?.members??[]).flatMap(k=>membersOf(k,seen))];};
 const bindingRoles=x=>x.op==='TEST'&&x.test?.event_id?g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===x.test.event_id&&c.entity_id===x.test.target_id):x.op==='STATE'&&x.state?.event_id?g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===x.state.event_id&&x.state.args.some(id=>membersOf(id).some(k=>membersOf(c.entity_id).includes(k)))):[];
 const explicitDeps=x=>[...(x.test?[{id:x.test.target_id,full:false}]:[]),...(x.specifies_result_id?[{id:x.specifies_result_id,full:true}]:[]),...(x.semantic_signature?.state_links??[]).map(v=>({id:v.expression_id,full:true})),...(x.semantic_signature?.external_input_ids??[]).map(id=>({id,full:false})),...g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===x.id&&x.semantic_signature?.external_input_ids?.includes(c.entity_id)&&['INPUT_OBJECT','OBJECT'].includes(c.role)).map(c=>({id:c.id,full:true})),...(x.scope_binding?.subject_event_ids??[]).map(id=>({id,full:true}))];
 const deps=x=>[...(x.requires??[]).map(id=>({id,full:true})),...(x.members??[]).map(id=>({id,full:false})),...(x.quantity?.distribution?.domain_id?[{id:x.quantity.distribution.domain_id,full:true}]:[]),...bindingRoles(x).map(c=>({id:c.id,full:true})),...(x.kind==='ARTIFACT_USE'&&x.artifact_use?[x.artifact_use.producer_result_id,x.artifact_use.consumer_role_id].map(id=>({id,full:true})):[]),...(x.collection==='claims'&&x.entity_id?[{id:x.entity_id,full:false}]:[]),...(x.collection==='claims'&&x.expression_id?[{id:x.expression_id,full:true}]:[]),...(x.collection==='expressions'?(x.op==='ITEM'?x.operands:x.op==='STATE'?x.state?.args??[]:x.operands).map(id=>({id,full:index.get(id)?.collection!=='entities'})):[])];
 const visit=(id,path=[])=>{
  if(path.includes(id)){for(const k of path.slice(path.indexOf(id))){const r=rows.get(k);r.status='REJECTED';if(!r.errors.some(e=>e.code==='REQUIRED_DEPENDENCY_CYCLE'))r.errors.push({code:'REQUIRED_DEPENDENCY_CYCLE',detail:path});}return;}
  for(const d of [...deps(index.get(id)??{}),...explicitDeps(index.get(id)??{})])if(index.has(d.id))visit(d.id,[...path,id]);
 };
 for(const x of items)visit(x.id);
 for(let n=0;n<items.length;n++)for(const x of items){const r=rows.get(x.id);if(r.status==='ACCEPTED')for(const d of [...deps(x),...explicitDeps(x)]){const dependency=rows.get(d.id);if(d.id!=='ROOT'&&(d.full?dependency?.status:dependency?.identity_status??dependency?.status)!=='ACCEPTED'){r.status='UNRESOLVED';if(r.identity_status)r.identity_status=r.status;r.uncertain.push('REQUIRED_DEPENDENCY:'+d.id);}}}
 for(const x of items){const r=rows.get(x.id);r.structural_refs=[x.owner_id,x.scope_id,x.event_id,x.entity_id,x.expression_id,x.artifact_use?.producer_result_id,x.artifact_use?.consumer_role_id,x.quantity?.target_id,x.quantity?.count_scope,x.quantity?.distribution?.domain_id,...(x.members??[]),...bindingRoles(x).map(c=>c.id),...(x.constraint_ids??[]),...(x.state?.event_id?[x.state.event_id]:[])].filter(Boolean);}
 // Follow only declared graph bindings. A ROLE can cite its own explicit
 for(const x of items){rows.get(x.id).structural_refs.push(...explicitDeps(x).map(d=>d.id),...(x.semantic_signature?.continuation_targets??[]),...(x.semantic_signature?.external_input_ids??[]),...(x.scope_binding?.subject_event_ids??[]),...(x.test?.event_id?[x.test.event_id]:[]));}
 const behavioralEvent=x=>x?.collection==='events'?x:x?.event_id?index.get(x.event_id):null;
 // prohibition; merely mentioning an object, or quoting another task, cannot.
 const restrictionEvidence=x=>{
  if(!x||rows.get(x.id)?.errors.length)return null;
  if(['SCOPE','CONDITION','STOP','TEMPORAL','COMPLETION'].includes(x.kind))return {path:[x.id],relation:'TYPED_CONSTRAINT'};
  const event=x.collection==='events'?x:x.kind==='ROLE'?index.get(x.event_id):null;
  if(event?.collection!=='events'||event.use!=='CURRENT_TASK'||event.modality!=='FORBIDDEN'||rows.get(event.id)?.errors.length)return null;
  return {path:x.id===event.id?[event.id]:[x.id,event.id],relation:x.id===event.id?'EXPLICIT_PROHIBITION':'ROLE_EVENT_BINDING'};
 };
 const coverageCheck=(c,i,origin)=>{try{
  for(const id of c.claim_ids)if(!ref(id))throw Error('COVERAGE_REFERENCE:'+id);
  if(c.status==='EXPRESSED'){
   const linked=c.claim_ids.map(id=>index.get(id));
   if(c.requirement_kind==='PROPERTY_CONSTRAINT'&&!linked.some(x=>['SCOPE','CONDITION'].includes(x?.kind)&&rows.get(x.id)?.errors.length===0&&(typedTests(x.expression_id).length||x.kind==='SCOPE'&&x.scope_binding)))throw Error('PROPERTY_CONSTRAINT_UNREPRESENTED');
   if(c.requirement_kind==='OUTPUT_BEHAVIOR'&&!linked.some(x=>{const e=behavioralEvent(x);return e?.specifies_result_id!=null&&rows.get(e.id)?.errors.length===0;}))throw Error('OUTPUT_BEHAVIOR_UNREPRESENTED');
   if(c.requirement_kind==='QUANTITY_EACH'&&!linked.some(x=>x?.kind==='QUANTITY'&&rows.get(x.id)?.errors.length===0&&x.quantity?.distribution?.mode==='EACH'&&isSetDomain(g.expressions,g.entities,x.quantity.distribution.domain_id)))throw Error('EACH_REQUIREMENT_UNREPRESENTED');
   if(c.requirement_kind==='QUANTITY_TOTAL'&&!linked.some(x=>x?.kind==='QUANTITY'&&x.quantity?.distribution?.mode==='AGGREGATE'))throw Error('AGGREGATE_REQUIREMENT_UNREPRESENTED');
   if(c.requirement_kind==='WORK_PLAN'&&!linked.some(x=>x?.kind==='QUANTITY'&&x.quantity?.use==='WORK_PLAN'))throw Error('WORK_PLAN_REQUIREMENT_UNREPRESENTED');
   if(c.requirement_kind==='RESTRICTION'&&!linked.some(x=>restrictionEvidence(x)))throw Error('RESTRICTION_REQUIREMENT_UNREPRESENTED');
  }
  const constraint_paths=c.requirement_kind==='RESTRICTION'?c.claim_ids.map(id=>restrictionEvidence(index.get(id))).filter(Boolean).map(p=>({...p,sources:p.path.flatMap(id=>rows.get(id)?.sources??[])})):[];
  return {...c,id:`${origin}:${i}`,origin,sources:linkSources(source,c.sources),...(constraint_paths.length?{constraint_paths}: {})};
 }catch(e){diagnostics.push({code:'COVERAGE_INVALID',message:e.message,origin});return {...c,id:`${origin}:${i}`,origin,status:'GAP',reason:e.message};}};
 const coverage=g.coverage.map((c,i)=>coverageCheck(c,i,'coverage'));
 const source_checks=(audit.source_checks??[]).map((c,i)=>coverageCheck(c,i,'audit-source-check'));
 if(requireSourceAudit&&!source_checks.length){
  diagnostics.push({code:'AUDIT_SOURCE_COVERAGE_MISSING',reason:'Fresh independent audit did not record a source-driven omission check.'});
  source_checks.push({id:'audit-source-check:missing',origin:'audit-source-check',status:'GAP',sources:linkSources(source,[{quote:source.text,occurrence:1}]),claim_ids:[],requirement_kind:'GENERAL',affected_views:views,reason:'Independent source coverage was not recorded; existing candidate SUPPORT verdicts do not establish completeness.'});
 }
 for(const issue of g.issues)for(const id of [...issue.subject_ids,...issue.alternatives])if(!ref(id))diagnostics.push({code:'ISSUE_DANGLING_REFERENCE',id});
 for(const issue of g.issues){
  try{issue_sources.push({id:issue.id,sources:linkSources(source,issue.sources)});}
  catch(e){diagnostics.push({code:'ISSUE_SOURCE_INVALID',id:issue.id,message:e.message});}
 }
 return {policy:'031-r1-semantic-closure-technical-v3',schemas,rows:[...rows.values()],diagnostics,coverage,source_checks,audit_coverage:diagnostics.some(x=>x.code==='AUDIT_SOURCE_COVERAGE_MISSING')?'MISSING_REQUIRED_SOURCE_AUDIT':source_checks.length?'RECORDED_NOT_PROVEN':'NOT_RECORDED_LEGACY_RESPONSE',audit_sources,issue_sources};
}


