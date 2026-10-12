// Pure identity transport. No text, label, note, predicate or role interpretation.
import {createHash} from 'node:crypto';
const groups=['entities','events','claims','expressions','issues'];
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
export function identityInventory(graph){
 const byId=new Map();
 for(const collection of groups)for(const [index,node] of (graph[collection]??[]).entries()){
  const list=byId.get(node.id)??[];list.push({collection,index,id:node.id,path:`/${collection}/${index}`});byId.set(node.id,list);
 }
 return byId;
}
export function normalizeIdentity(graph){
 const value=structuredClone(graph),index=identityInventory(graph),renames=[],references=[],unresolved=[];
 const used=new Set(index.keys());
 if(index.has('ROOT'))throw Object.assign(Error('IDENTITY_RESERVED_ID'),{code:'IDENTITY_RESERVED_ID'});
 const targets=new Map();
 for(const [id,entries] of index){
  if(entries.length<2)continue;
  const choices=entries.map(entry=>{
   let newId=`bx:${entry.collection}:${encodeURIComponent(id)}:${entry.index}`,suffix=0;
   while(used.has(newId))newId=`bx:${entry.collection}:${encodeURIComponent(id)}:${entry.index}:${++suffix}`;
   used.add(newId);value[entry.collection][entry.index].id=newId;
   const change={...entry,old_id:id,new_id:newId,node_sha256:digest(graph[entry.collection][entry.index])};
   renames.push(change);return change;
  });targets.set(id,choices);
 }
 const bind=(parent,key,path,collection=null)=>{
  const id=parent[key];if(id===null||id===undefined||id==='ROOT'||!targets.has(id))return;
  const all=targets.get(id),choices=collection?all.filter(x=>x.collection===collection):all;
  if(choices.length===1){parent[key]=choices[0].new_id;references.push({path,old_id:id,new_id:parent[key],required_collection:collection});}
  else unresolved.push({code:'AMBIGUOUS_ID_REFERENCE',path,original_id:id,required_collection:collection,candidates:choices.map(x=>({collection:x.collection,id:x.new_id,path:x.path})),status:'EXPLICIT_BINDING_REQUIRED'});
 };
 const many=(node,key,path,collection=null)=>{for(const [i] of (node[key]??[]).entries())bind(node[key],i,`${path}/${key}/${i}`,collection);};
 for(const collection of groups)for(const [i,node] of value[collection].entries()){
  const p=`/${collection}/${i}`;many(node,'requires',p);
  if(collection==='entities'){many(node,'alternatives',p,'entities');many(node,'members',p,'entities');}
  if(collection==='events'){bind(node,'owner_id',p+'/owner_id','events');bind(node,'specifies_result_id',p+'/specifies_result_id','claims');many(node,'constraint_ids',p,'claims');}
  if(collection==='claims'){
   bind(node,'event_id',p+'/event_id','events');bind(node,'entity_id',p+'/entity_id','entities');bind(node,'expression_id',p+'/expression_id','expressions');bind(node,'scope_id',p+'/scope_id');
   if(node.quantity){bind(node.quantity,'target_id',p+'/quantity/target_id',['EXECUTION_LIMIT','WORK_PLAN'].includes(node.quantity.use)?'events':node.quantity.use==='OUTPUT_CONTENT'?'entities':null);bind(node.quantity,'count_scope',p+'/quantity/count_scope');if(node.quantity.distribution)bind(node.quantity.distribution,'domain_id',p+'/quantity/distribution/domain_id','expressions');}
   if(node.artifact_use)for(const k of ['producer_result_id','consumer_role_id'])bind(node.artifact_use,k,p+'/artifact_use/'+k,'claims');
  }
  if(collection==='expressions'){
   many(node,'operands',p,node.op==='ITEM'?'entities':'expressions');
   if(node.state){bind(node.state,'event_id',p+'/state/event_id','events');many(node.state,'args',p+'/state');}
   if(node.test){bind(node.test,'event_id',p+'/test/event_id','events');bind(node.test,'target_id',p+'/test/target_id');}
  }
  if(collection==='issues'){many(node,'subject_ids',p);many(node,'alternatives',p);}
  // A qualified field path explicitly identifies a collection. Unqualified prose is untouched.
  if(typeof node.field_path==='string')for(const collectionName of groups)for(const [oldId,choices] of targets){
   const compatible=choices.filter(x=>x.collection===collectionName),prefix=`${collectionName}[${oldId}]`;
   if(compatible.length===1&&(node.field_path===prefix||node.field_path.startsWith(prefix+'.')))node.field_path=collectionName+'['+compatible[0].new_id+']'+node.field_path.slice(prefix.length);
  }
 }
 // The frozen coverage contract permits references to every graph item, not only claims.
 for(const [i,node] of value.coverage.entries())many(node,'claim_ids',`/coverage/${i}`);
 const ids=[...identityInventory(value).keys()];
 if([...identityInventory(value).values()].some(x=>x.length!==1)||ids.includes('ROOT'))throw Error('IDENTITY_NORMALIZATION_NOT_UNIQUE');
 return {value,evidence:{policy:'TYPED_IDENTITY_NORMALIZATION_R01',input_sha256:digest(graph),output_sha256:digest(value),renames,references,unresolved,semantic_choices_inferred:0,source_bytes_changed:false,node_counts_preserved:true}};
}
