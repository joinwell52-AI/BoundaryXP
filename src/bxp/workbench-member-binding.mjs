// Source-interpreted identity refinements; no arithmetic or verdicts here.
import {ancestors} from './workbench-model.mjs';
// This union is an identity vocabulary only, never an allowed-value domain.
export function domainIdentityView(formal,pc){return {...pc,values:[...new Set((formal?.constraints??[]).filter(c=>c.type==='domain'&&c.key===pc.key).flatMap(c=>c.values??[]))]};}
export function memberIdentityIssues(plan,boundaries,node,c){
 if(c.value_bindings===undefined)return [];
 const failure=reason=>[{code:'INVALID_MEMBER_IDENTITY',constraint_id:c.id,clause_ids:c.clause_ids,axes:c.axes,reason}];
 if(!Array.isArray(c.value_bindings))return failure('集合成员身份映射必须为数组');
 try{
  for(const r of c.value_bindings){
   const p=ancestors(plan,node.id).find(n=>n.id===r.parent_node_id),pc=p&&(boundaries[p.id]?.boundary?.formal?.constraints??[]).find(x=>x.type==='domain'&&x.key===r.parent_key);
   if(!pc)throw Error('集合成员映射的父属性不存在');
   const rows=c.value_bindings.filter(x=>x.parent_node_id===p.id&&x.parent_key===pc.key);
   valueBindingPatch({...c,value_bindings:[]},domainIdentityView(boundaries[p.id].boundary.formal,pc),p,rows);
  }
 }catch(e){return failure(e.message);}
 return [];
}
export function valueBindingPatch(c,pc,parent,rows){
 if(!Array.isArray(rows)||c.type!=='domain'||pc.type!=='domain')throw Error('集合成员绑定只适用于两个集合属性');
 const old=c.value_bindings??[],normalized=[];
 for(const r of rows){
  if(!c.values.includes(r.from)||!pc.values.includes(r.to)||!['SAME_AS','SPECIALIZES','DISTINCT'].includes(r.relation)||typeof r.reason!=='string'||!r.reason.trim())throw Error('集合成员身份绑定的端点或依据无效');
  if(r.from===r.to&&r.relation==='DISTINCT'||r.relation==='SAME_AS'&&pc.values.includes(r.from)&&r.from!==r.to)throw Error('不能合并父集合已有的不同身份');
  const row={...r,parent_node_id:parent.id,parent_key:pc.key,clause_ids:c.clause_ids};
  const peers=[...old,...normalized].filter(x=>x.from===r.from&&x.parent_node_id===parent.id&&x.parent_key===pc.key);
  if(peers.some(x=>x.relation==='SAME_AS'&&r.relation==='SAME_AS'&&x.to!==r.to||x.to===r.to&&(x.relation==='DISTINCT')!==(r.relation==='DISTINCT')))throw Error('集合成员绑定相互矛盾');
  normalized.push(row);
 }
 return ()=>{c.value_bindings=[...old,...normalized];};
}

export function eventBindingPatch(formal,c,pc,parent,rows=[]){
 if(!Array.isArray(rows)||c.type!=='order'||pc.type!=='order')throw Error('事件身份绑定只适用于两个事件图');
 const from=c.events??[],to=pc.events??[],entries=[...rows];
 for(const e of from)if(to.some(p=>p.id===e.id)&&!entries.some(x=>x.from===e.id))entries.push({from:e.id,to:e.id,reason:'已有相同事件身份'});
 const vertices=g=>new Set([...(g.edges??[]),...(g.removed??[]),...(g.forbidden_paths??[])].flatMap(e=>[e.from,e.to]));
 const childVertices=vertices(c),parentVertices=vertices(pc);
 const points=new Map(),events=new Map(),targets=new Set(),parentPoints=new Set([...to.flatMap(e=>[e.id,e.start,e.end]),...parentVertices]);
 const put=(a,b)=>{if(points.has(a)&&points.get(a)!==b||parentPoints.has(a)&&a!==b)throw Error('事件端点身份映射冲突');points.set(a,b);};
 for(const r of entries){
  const a=from.find(e=>e.id===r.from),b=to.find(e=>e.id===r.to);
  if(r.relation==='DISTINCT'){
   if(!a&&!childVertices.has(r.from)||!b&&!parentVertices.has(r.to)||r.from===r.to||typeof r.reason!=='string'||!r.reason.trim())throw Error('图引用不同身份的端点或依据无效');
   continue;
  }
  if(!a&&b&&r.reference==='EVENT'){
   if(!childVertices.has(r.from)||typeof r.reason!=='string'||!r.reason.trim()||events.has(r.from)||targets.has(b.id)||parentPoints.has(r.from)&&r.from!==b.id)throw Error('图节点引用已有执行实体的身份无效');
   events.set(r.from,b.id);targets.add(b.id);continue;
  }
  // A plain prerequisite vertex needs no invented start/end event table.
  // Keep entity-to-entity mapping separate from atomic vertex-to-vertex mapping.
  if(!a&&!b){
   if(!childVertices.has(r.from)||!parentVertices.has(r.to)||typeof r.reason!=='string'||!r.reason.trim()||points.has(r.from)||targets.has(r.to))throw Error('普通图节点身份绑定的端点、唯一性或依据无效');
   targets.add(r.to);put(r.from,r.to);continue;
  }
  if(!a||!b||typeof r.reason!=='string'||!r.reason.trim()||events.has(a.id)||targets.has(b.id)||to.some(e=>e.id===a.id)&&a.id!==b.id)throw Error('事件身份绑定的端点、唯一性或依据无效');
  events.set(a.id,b.id);targets.add(b.id);put(a.start,b.start);put(a.end,b.end);
 }
 for(const r of entries)if(r.relation==='DISTINCT'&&(events.get(r.from)===r.to||points.get(r.from)===r.to))throw Error('事件引用同一与不同身份相互矛盾');
 return ()=>{
  const point=x=>points.get(x)??events.get(x)??x;
  c.events=from.map(e=>({id:events.get(e.id)??e.id,start:point(e.start),end:point(e.end)}));
  for(const field of ['edges','removed',...(c.forbidden_paths?['forbidden_paths']:[])])c[field]=c[field].map(e=>({...e,from:point(e.from),to:point(e.to)}));
  for(const q of formal.constraints)if(q.type==='quantity'&&events.has(q.instance))q.instance=events.get(q.instance);
  c.event_bindings=[...(c.event_bindings??[]),...entries.map(r=>({...r,parent_node_id:parent.id,parent_key:pc.key,clause_ids:c.clause_ids}))];
 };
}

export function mappedDomainValues(c,parent,pc){
 const rows=(c.value_bindings??[]).filter(b=>b.parent_node_id===parent.id&&b.parent_key===pc.key&&['SAME_AS','SPECIALIZES'].includes(b.relation));
 return c.values.flatMap(v=>{const matches=rows.filter(r=>r.from===v);return matches.length?matches.map(r=>r.to):[v];});
}

export function selectionBindingPatch(formal,c,pc,parent,rows){
 if(!Array.isArray(rows)||c.type!=='selection'||pc.type!=='selection')throw Error('选择成员映射仅适用于选择组');
 const mapping=new Map(),targets=new Set();
 for(const r of rows){if(!c.members.includes(r.from)||!pc.members.includes(r.to)||typeof r.reason!=='string'||!r.reason.trim()||mapping.has(r.from)||targets.has(r.to)||pc.members.includes(r.from)&&r.from!==r.to)throw Error('选择成员身份映射端点、唯一性或来源无效');mapping.set(r.from,r.to);targets.add(r.to);}
 return ()=>{const prior=[...c.members];c.members=c.members.map(x=>mapping.get(x)??x);
  for(const q of formal.constraints)if(q.type==='quantity'&&mapping.has(q.instance))q.instance=mapping.get(q.instance);
  c.member_bindings=[...(c.member_bindings??[]),...rows.map(r=>({...r,parent_node_id:parent.id,parent_key:pc.key,clause_ids:c.clause_ids}))];
 };
}

export function mixedEventReferenceIssues(plan,boundaries,node,c){
 if(c.type!=='order')return [];
 const issues=[],local=new Set((c.events??[]).flatMap(e=>[e.id,e.start,e.end]));
 const vertices=[...new Set([...(c.edges??[]),...(c.removed??[]),...(c.forbidden_paths??[])].flatMap(e=>[e.from,e.to]))].filter(v=>!local.has(v));
 for(const parent of ancestors(plan,node.id))for(const pc of (boundaries[parent.id]?.boundary?.formal?.constraints??[]).filter(p=>p.type==='order'&&p.key===c.key).slice(0,1).map(p=>orderIdentityView(boundaries[parent.id].boundary.formal,p))){
  const parentVertices=[...new Set([...(pc.edges??[]),...(pc.removed??[]),...(pc.forbidden_paths??[])].flatMap(e=>[e.from,e.to]))];
  const entities=(pc.events??[]).length?pc.events.map(e=>e.id):parentVertices,known=new Set([...(pc.events??[]).flatMap(e=>[e.id,e.start,e.end]),...parentVertices]);
  for(const v of vertices){if(known.has(v))continue;
   const rows=(c.event_bindings??[]).filter(r=>r.parent_node_id===parent.id&&r.parent_key===pc.key&&r.from===v);
   if(entities.every(id=>rows.some(r=>r.to===id&&r.relation==='DISTINCT'&&typeof r.reason==='string'&&r.reason.trim())))continue;
   issues.push({code:'UNBOUND_EVENT_REFERENCE',constraint_id:c.id,clause_ids:c.clause_ids,axes:c.axes,parent_node_id:parent.id,parent_key:pc.key,vertex:v,parent_events:entities,reason:'图节点尚未确认与父图节点的身份关系：'+v+'；需要同一身份或明确不同身份，不能按互不关联直接判通过'});
  }
 }
 return issues;
}

// Identity vocabulary only; callers must not use this as a computed graph.
export function orderIdentityView(formal,pc){
 const peers=(formal?.constraints??[]).filter(c=>c.type==='order'&&c.key===pc.key);
 return {...pc,...Object.fromEntries(['events','edges','removed','forbidden_paths'].map(field=>[field,[...new Map(peers.flatMap(c=>c[field]??[]).map(x=>[JSON.stringify(x),x])).values()]]))};
}
