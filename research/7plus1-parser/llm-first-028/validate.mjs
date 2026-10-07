import Ajv from 'ajv';
import {proposalSchema,auditSchema,views} from './contracts/schema.mjs';
import {linkSources} from './source.mjs';
const ajv=new Ajv({allErrors:true,strict:false});
const validators={proposal:ajv.compile(proposalSchema),audit:ajv.compile(auditSchema)};
export function validateSchema(kind,value){const v=validators[kind];return {ok:v(value),errors:structuredClone(v.errors??[])};}
export const graphItems=g=>['entities','events','claims','expressions'].flatMap(k=>g[k].map(item=>({collection:k,...item})));
export function normalizedFieldPath(item,path){
 const root=`${item.collection}[${item.id}]`;
 return path===root?'':path.startsWith(root+'.')?path.slice(root.length+1):path;
}
export function technicalValidate(source,g,audit){
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
  }
  if(x.collection==='events'){
   if(!ref(x.owner_id,x.owner_id==='ROOT'?null:'events'))bad('BAD_STRUCTURAL_OWNER');
   for(const id of x.constraint_ids){const c=index.get(id);if(c?.collection!=='claims'||!['CONDITION','QUANTITY','TEMPORAL'].includes(c.kind)||c.event_id!==x.id)bad('CONSTRAINT_BINDING_MISSING',id);}
   if(new Set(x.constraint_ids).size!==x.constraint_ids.length)bad('DUPLICATE_CONSTRAINT');
  }
  if(x.collection==='claims'){
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
   if(x.kind==='QUANTITY'){
    const q=x.quantity;
    if(!q||x.event_id===null||x.entity_id!==null||x.role!==null||x.expression_id!==null||x.direction!==null||x.temporal!==null)bad('QUANTITY_SIGNATURE');
    if(q){
     if(!ref(q.target_id)||!ref(q.count_scope)||q.value<0||!Number.isFinite(q.value))bad('QUANTITY_TARGET_OR_VALUE');
     const ownEvent=index.get(x.event_id);
     const targetOwned=q.target_id===x.event_id||g.claims.some(c=>c.kind==='ROLE'&&c.event_id===x.event_id&&c.entity_id===q.target_id);
     if(!targetOwned||!ownEvent?.constraint_ids?.includes(x.id))bad('QUANTITY_OWNERSHIP');
     if(q.use==='EXECUTION_LIMIT'&&q.target_id!==x.event_id)bad('EXECUTION_QUANTITY_TARGET');
     if(q.use==='OUTPUT_CONTENT'&&!g.claims.some(c=>c.kind==='ROLE'&&['RESULT','DELIVERABLE'].includes(c.role)&&c.event_id===x.event_id&&c.entity_id===q.target_id))bad('CONTENT_QUANTITY_RESULT_TARGET');
    }
   }
  }
  if(x.collection==='expressions'){
   const n=x.operands.length;
   if(x.op==='STATE'){
    if(!x.state||n!==0)bad('STATE_SIGNATURE');
    if(x.state){if(x.state.event_id!==null&&!ref(x.state.event_id,'events'))bad('STATE_EVENT_REFERENCE');for(const id of x.state.args)if(!ref(id))bad('STATE_ARGUMENT_REFERENCE',id);}
   }else{
    if(x.state!==null)bad('NON_STATE_SIGNATURE');
    if(x.op==='ITEM'){if(n!==1||!ref(x.operands[0],'entities'))bad('ITEM_SIGNATURE');}
    else{if((x.op==='NOT'&&n!==1)||(x.op==='EXCEPT'&&n!==2)||(!['NOT','EXCEPT'].includes(x.op)&&n<2))bad('EXPRESSION_ARITY');for(const id of x.operands)if(!ref(id,'expressions'))bad('EXPRESSION_OPERAND',id);}
   }
  }
  const localIssues=g.issues.filter(i=>i.subject_ids.includes(x.id)&&i.kind!=='UNSPECIFIED');
  const auditIssues=audit.issues.filter(i=>i.subject_ids.includes(x.id));
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
  rows.set(x.id,{id:x.id,collection:x.collection,status,...(x.collection==='entities'?{identity_status:typeOnly?'ACCEPTED':status}:{}),errors,uncertain,sources:linked,audit_refs:reviews.map(r=>({subject_id:r.subject_id,field_path:r.field_path,verdict:r.verdict})),required_dependencies:x.requires??[],structural_refs:[],...(typeOnly?{unresolved_properties:['type'],identity_policy:'SOURCE_AND_IDENTITY_SUPPORTED_TYPE_METADATA_ONLY'}:{})});
 }
 // Only real mandatory dependencies and identity/expression inputs propagate. Not owner/context edges.
 const deps=x=>[...(x.requires??[]).map(id=>({id,full:true})),...(x.collection==='claims'&&x.entity_id?[{id:x.entity_id,full:false}]:[]),...(x.collection==='claims'&&x.expression_id?[{id:x.expression_id,full:true}]:[]),...(x.collection==='expressions'?(x.op==='ITEM'?x.operands:x.op==='STATE'?x.state?.args??[]:x.operands).map(id=>({id,full:index.get(id)?.collection!=='entities'})):[])];
 const visit=(id,path=[])=>{
  if(path.includes(id)){for(const k of path.slice(path.indexOf(id))){const r=rows.get(k);r.status='REJECTED';if(!r.errors.some(e=>e.code==='REQUIRED_DEPENDENCY_CYCLE'))r.errors.push({code:'REQUIRED_DEPENDENCY_CYCLE',detail:path});}return;}
  for(const d of deps(index.get(id)??{}))if(index.has(d.id))visit(d.id,[...path,id]);
 };
 for(const x of items)visit(x.id);
 for(let n=0;n<items.length;n++)for(const x of items){const r=rows.get(x.id);if(r.status==='ACCEPTED')for(const d of deps(x)){const dependency=rows.get(d.id);if(d.id!=='ROOT'&&(d.full?dependency?.status:dependency?.identity_status??dependency?.status)!=='ACCEPTED'){r.status='UNRESOLVED';if(r.identity_status)r.identity_status=r.status;r.uncertain.push('REQUIRED_DEPENDENCY:'+d.id);}}}
 for(const x of items){const r=rows.get(x.id);r.structural_refs=[x.owner_id,x.scope_id,x.event_id,x.entity_id,x.expression_id,x.quantity?.target_id,x.quantity?.count_scope,...(x.constraint_ids??[]),...(x.state?.event_id?[x.state.event_id]:[])].filter(Boolean);}
 const coverage=g.coverage.map((c,i)=>{try{for(const id of c.claim_ids)if(!ref(id))throw Error('COVERAGE_REFERENCE:'+id);return {...c,id:`coverage:${i}`,sources:linkSources(source,c.sources)};}catch(e){diagnostics.push({code:'COVERAGE_INVALID',message:e.message});return {...c,id:`coverage:${i}`,status:'GAP'};}});
 for(const issue of g.issues)for(const id of [...issue.subject_ids,...issue.alternatives])if(!ref(id))diagnostics.push({code:'ISSUE_DANGLING_REFERENCE',id});
 for(const issue of g.issues){
  try{issue_sources.push({id:issue.id,sources:linkSources(source,issue.sources)});}
  catch(e){diagnostics.push({code:'ISSUE_SOURCE_INVALID',id:issue.id,message:e.message});}
 }
 return {policy:'028-r02-technical-v2',schemas,rows:[...rows.values()],diagnostics,coverage,audit_sources,issue_sources};
}
