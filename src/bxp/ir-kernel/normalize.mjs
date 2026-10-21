import {collections,registry} from './contract-registry.mjs';import {stable} from './values.mjs';import {digest} from './load.mjs';
export function normalize(bound){
 const sourceMap=Object.create(null),annotations=Object.create(null),nodes=Object.create(null);
 const clean=x=>{if(Array.isArray(x))return x.map(clean);if(x&&typeof x==='object'){if(Object.keys(x).length===2&&x.kind&&x.id)return bound.ref(x);return Object.fromEntries(Object.entries(x).filter(([k])=>!['label','note','reason','quote','source_refs'].includes(k)).map(([k,v])=>[k,clean(v)]));}return x;};
 for(const [collection,kind]of Object.entries(collections))for(const n of bound.raw[collection]){
  const node=clean(n);if(node.owner_id==='ROOT')node.owner_id=bound.root;if(node.scope_id==='ROOT')node.scope_id=bound.root;
  if(node.roles)node.roles.sort((a,b)=>stable(a).localeCompare(stable(b)));
  if(node.operator==='SET')node.arguments=[...new Map(node.arguments.map(a=>[stable(a),a])).values()].sort((a,b)=>stable(a).localeCompare(stable(b)));
  nodes[n.id]={...node,category:kind,value_type:bound.types.get(n.id)};
  sourceMap[n.id]={source_refs:n.source_refs,collection,fields:Object.fromEntries(Object.keys(node).map(k=>[k,{path:collection+'.'+n.id+'.'+k,source_refs:n.source_refs}])),rule:node.operator?registry[node.operator].rule:'IDENTITY_PRESERVING',root_alias:bound.root!=='ROOT'?'ROOT_TO_UNIQUE_TASK':null};
  if(n.roles)sourceMap[n.id].role_sources=n.roles.map(r=>({role:r.role,value:clean(r.value),source_refs:r.source_refs}));
  annotations[n.id]={label:n.label??null,note:n.note??null};
 }
 const core={format:'boundx-ir-core/1',semantic_version:'kernel/1.0',input_contract:bound.raw.contract_version,root_task:bound.root,nodes:Object.fromEntries(Object.entries(nodes).sort(([a],[b])=>a.localeCompare(b))),requirements:bound.raw.requirements.map(r=>r.id).sort(),sequences:clean(bound.raw.sequences??[])};
 return {core,core_sha256:digest(stable(core)),source_map:sourceMap,annotations,raw_sha256:bound.raw_sha256,frame_errors:bound.frame_errors??[],semantic_gaps:[...bound.raw.coverage.filter(c=>c.status==='GAP'||c.status==='AMBIGUOUS').map(c=>({code:'SOURCE_COVERAGE_GAP',source_refs:c.source_refs,status:c.status})),...bound.raw.issues.filter(i=>i.kind!=='UNSPECIFIED').map(i=>({code:'DECLARED_SEMANTIC_ISSUE',id:i.id,source_refs:i.source_refs}))]};
}
