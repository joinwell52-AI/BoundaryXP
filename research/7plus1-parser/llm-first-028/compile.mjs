import {views,contractVersion} from './contracts/schema.mjs';
import {sha256} from './source.mjs';
import {artifactRelations} from './artifacts.mjs';
export {evaluateScope} from './scopes.mjs';
import {expressionType} from './scopes.mjs';
export function compileBoundary(source,g,audit,checks){
 const rows=new Map(checks.rows.map(r=>[r.id,r]));
 const linked=x=>({...x,...(x.mentions?{mentions:rows.get(x.id)?.sources??x.mentions}:{sources:rows.get(x.id)?.sources??x.sources})});
 const index=new Map([...g.entities,...g.events,...g.claims,...g.expressions].map(x=>[x.id,linked(x)]));
 const effective=id=>{const row=rows.get(id);return row?.collection==='entities'?row.identity_status??row.status:row?.status;};
 const status=ids=>ids.some(id=>effective(id)==='REJECTED')?'REJECTED':ids.some(id=>effective(id)!=='ACCEPTED')?'UNRESOLVED':'ACCEPTED';
 const facts=[];
 const artifacts=artifactRelations(g,checks);
 const make=(kind,ids,data,slots)=>{
  const unique=[...new Set(ids.filter(Boolean))], digest=sha256(JSON.stringify(data));
  const provenanceIds=new Set();
  const collect=id=>{if(provenanceIds.has(id)||!rows.has(id))return;provenanceIds.add(id);const row=rows.get(id);for(const next of [...row.structural_refs,...row.required_dependencies,...(index.get(id)?.operands??[]),...(index.get(id)?.state?.args??[])])collect(next);};
  for(const id of unique)collect(id);
  const provenance=[...provenanceIds];const sources=provenance.flatMap(id=>rows.get(id)?.sources??[]);
  const fact={id:'bf:'+digest.slice(0,20),kind,status:status(unique),claim_ids:unique,...data,sources,slots,proof:{source_sha256:source.sha256,claim_ids:unique,provenance_refs:provenance,technical_policy:checks.policy,checks:provenance.map(id=>rows.get(id)),audit:provenance.flatMap(id=>audit.reviews.filter(r=>r.subject_id===id)),context_references_are_not_required_dependencies:true}};
  facts.push(fact);return fact;
 };
 const expression=id=>{
  if(id===null)return null;
  const build=(k,path=[])=>{if(path.includes(k))return {id:k,invalid_cycle:true};const x=index.get(k);if(!x)return {id:k,missing:true};return {...x,children:['STATE','ITEM','ENUM','CATEGORY'].includes(x.op)?[]:x.operands.map(child=>build(child,[...path,k]))};};return build(id);
 };
 const constraints=e=>g.claims.filter(c=>e.constraint_ids.includes(c.id)).map(c=>({...linked(c),expression:expression(c.expression_id)}));
 const objectScopes=(eventId,entityId=null)=>g.claims.filter(c=>c.kind==='SCOPE'&&c.event_id===eventId&&(entityId===null||c.scope_id===entityId)).map(c=>({...linked(c),expression:expression(c.expression_id)}));
 const current=e=>e.use==='CURRENT_TASK';
 const positive=e=>current(e)&&['REQUIRED','PERMITTED'].includes(e.modality);
 // A condition can name a participant without commanding that participant's event.
 // Preserve explicit roles reachable from typed governing expressions; never infer a duty.
 const governingConditions=new Map();
 const conditionEvents=(id,seen=new Set())=>{if(seen.has(id))return [];seen.add(id);const x=index.get(id);if(!x)return [];return x.op==='STATE'?[x.state?.event_id,...(x.state?.args??[]).filter(k=>index.get(k)?.kind==='ACTION'||index.get(k)?.kind==='STATE')].filter(Boolean):(x.operands??[]).flatMap(k=>conditionEvents(k,seen));};
 for(const c of g.claims.filter(c=>
  (['CONDITION','TEMPORAL'].includes(c.kind)&&current(index.get(c.event_id)??{}))||
  (['COMPLETION','STOP'].includes(c.kind)&&(c.scope_id==='ROOT'||current(index.get(c.event_id)??{})))
 ))for(const id of conditionEvents(c.expression_id)){governingConditions.set(id,[...(governingConditions.get(id)??[]),c.id]);}
 for(const raw of g.events){
  const e=linked(raw);
  const roles=g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===e.id).map(c=>({...linked(c),entity:index.get(c.entity_id),status:status([c.id,c.entity_id])}));
  const scopes=objectScopes(e.id);
  const payload={event:e,roles,constraints:constraints(e),object_scopes:scopes,artifact_dependencies:artifacts.availability.filter(x=>x.consumer_event_id===e.id)};
  make('EVENT',[e.id,...roles.map(c=>c.id),...e.constraint_ids,...scopes.map(c=>c.id)],payload,positive(e)?['A']:current(e)&&e.modality==='FORBIDDEN'?['B']:[]);
 }
 for(const raw of g.claims){
  const c=linked(raw);
  const e=index.get(c.event_id),entity=index.get(c.entity_id);let slots=[],projectionInputs=[];
  if(c.kind==='ROLE'&&positive(e??{}))slots=c.role==='INPUT_OBJECT'?['I']:['RESULT','DELIVERABLE'].includes(c.role)?['O']:c.role==='BASIS'?['V']:['PERFORMER','ORGANIZER','REVIEWER','APPROVER','RECIPIENT','COLLABORATOR'].includes(c.role)?['P']:[];
  if(c.kind==='ROLE'&&['PERFORMER','ORGANIZER','REVIEWER','APPROVER','RECIPIENT','COLLABORATOR'].includes(c.role)&&e?.layer==='CONDITION'&&e.use==='MENTION_ONLY'&&governingConditions.has(e.id)){slots=['P'];projectionInputs=governingConditions.get(e.id);}
  if(c.kind==='QUANTITY'&&positive(e??{}))slots=c.quantity.use==='EXECUTION_LIMIT'?['R']:[];
  if(['COMPLETION','STOP'].includes(c.kind))slots=['C'];
  if(c.kind==='SCOPE'){
   // Scope target/use already expressed by LLM through typed relation and mandatory result binding.
   // An output's content restriction is not external input scope. Never inspect action strings.
   const result=g.claims.filter(r=>r.kind==='ROLE'&&['RESULT','DELIVERABLE'].includes(r.role)&&r.entity_id===c.scope_id&&r.event_id===c.event_id);
   if(result.length){slots=['O'];projectionInputs=result.map(r=>r.id);}
   else if(e?.modality==='FORBIDDEN'&&current(e))slots=['B'];
   else if(c.scope_id==='ROOT'||c.scope_id===c.event_id||g.claims.some(r=>r.kind==='ROLE'&&r.role==='INPUT_OBJECT'&&r.entity_id===c.scope_id&&r.event_id===c.event_id))slots=['I'];
  }
  const ids=[c.id,c.entity_id,c.expression_id,c.event_id,...(e?.constraint_ids??[]),...projectionInputs];
  const quantities=c.kind==='ROLE'&&['RESULT','DELIVERABLE'].includes(c.role)?g.claims.filter(q=>q.kind==='QUANTITY'&&q.quantity?.use==='OUTPUT_CONTENT'&&q.quantity.target_id===c.entity_id&&q.event_id===c.event_id).map(linked):[];
  const contentScopes=c.kind==='ROLE'&&['RESULT','DELIVERABLE'].includes(c.role)?g.claims.filter(q=>q.kind==='SCOPE'&&q.scope_id===c.entity_id&&q.event_id===c.event_id).map(q=>({...linked(q),expression:expression(q.expression_id)})):[];
  const scopes=c.kind==='ROLE'?objectScopes(c.event_id,c.entity_id):[];
  make(c.kind,[...ids,...quantities.map(q=>q.id),...contentScopes.map(q=>q.id),...scopes.map(q=>q.id)],{claim:c,event:e??null,entity:entity??null,expression:expression(c.expression_id),constraints:e?constraints(e):[],object_scopes:scopes,content_quantities:quantities,content_scopes:contentScopes},slots);
 }
 for(const a of artifacts.availability.filter(x=>x.eligible)){
  const {id,...data}=a;make('ARTIFACT_AVAILABILITY',a.provenance_refs,{...data,relation_id:id,event:null,claim:null,constraints:[]},[]);
 }
 const unresolved=facts.filter(f=>f.status!=='ACCEPTED'), gaps=[...g.issues.filter(i=>i.kind==='COVERAGE_GAP'),...audit.omissions,...checks.coverage.filter(c=>c.status==='GAP')];
 const ir={format:'boundx-boundary-ir/'+contractVersion,source_sha256:source.sha256,facts,artifact_associations:artifacts.associations,artifact_dependencies:artifacts.availability,entities:g.entities.map(linked),expressions:g.expressions.map(linked),issues:g.issues.map(i=>({...i,sources:checks.issue_sources?.find(x=>x.id===i.id)?.sources??i.sources})),audit_issues:audit.issues,gaps,technical_diagnostics:checks.diagnostics,business_decision:null,execution_authorization:null};
 const slots=Object.fromEntries(views.map(slot=>{const entries=facts.filter(f=>f.slots.includes(slot));const coverageGap=gaps.some(g=>g.affected_views?.includes(slot))||!checks.schemas.proposal.ok||!checks.schemas.audit.ok;return [slot,{status:coverageGap?'PARSER_COVERAGE_FAILURE':entries.some(f=>f.status!=='ACCEPTED')?'UNRESOLVED':entries.length?'RESOLVED':'ABSENT',openness:entries.length?'CONSTRAINED':'OPEN',entries}];}));
 const canonical={format:'boundx-canonical-7plus1/'+contractVersion,source_sha256:source.sha256,artifact_associations:ir.artifact_associations,artifact_dependencies:ir.artifact_dependencies,entities:ir.entities,expressions:ir.expressions,slots,unresolved,retained_nonprojected:facts.filter(f=>f.slots.length===0),issues:g.issues,gaps,business_decision:null,execution_authorization:null};
 return {ir,canonical,chinese:renderChinese(canonical)};
}
const modality={REQUIRED:'必须',PERMITTED:'允许',FORBIDDEN:'禁止',NOT_REQUIRED:'无需',UNSTATED:'未陈述模态'};
function exprText(x,name=id=>id,eventText=id=>id){if(!x)return '';if(x.op==='STATE')return `${x.state?.predicate}(${(x.state?.args??[]).map(name).join(',')})${x.state?.event_id?`；所指事件=${eventText(x.state.event_id)}`:''} [${x.state?.polarity};运行值UNKNOWN]`;if(x.op==='ITEM')return `具体对象(${x.operands.map(name).join(',')})`;if(x.op==='ENUM')return `有限枚举{${x.operands.map(name).join(',')}}`;if(x.op==='CATEGORY')return `类别范围(${name(x.operands[0])}；适用范围=${x.operands[1]?name(x.operands[1]):'未限定容器'})`;const op={FORALL:'全称适用：范围内所有成员',ALL:'布尔全部成立',ANY:'布尔至少一项成立',EXCEPT:'范围排除'}[x.op]??x.op;return `${op}(${(x.children??[]).map(child=>exprText(child,name,eventText)).join(',')})`;}
export function renderChinese(c){
 const names={I:'输入与作用域',O:'交付与结果',A:'正向动作',P:'参与关系',R:'执行量化限制',V:'版本与依据',C:'完成与停止',B:'禁止与限制'};
 const roleNames={PERFORMER:'执行者',ORGANIZER:'组织者',REVIEWER:'复核者',APPROVER:'批准者',RECIPIENT:'接收者',COLLABORATOR:'协作者',INPUT_OBJECT:'输入/受检对象',OBJECT:'对象',RESULT:'产生结果',DELIVERABLE:'交付产物',BASIS:'依据',CONTENT:'内容'};
 const directionNames={NECESSARY:'必要前提',SUFFICIENT:'充分触发',IFF:'充要条件',ORDER:'时间先后'},opNames={EQ:'=',LT:'<',LTE:'≤',GT:'>',GTE:'≥'};
 const allFacts=[...Object.values(c.slots).flatMap(v=>v.entries),...c.retained_nonprojected],labels=new Map([['ROOT','根任务']]);
 for(const e of c.entities??[])labels.set(e.id,e.label);
 for(const f of allFacts){if(f.event)labels.set(f.event.id,f.event.predicate);if(f.entity)labels.set(f.entity.id,f.entity.label);for(const r of f.roles??[])if(r.entity)labels.set(r.entity.id,r.entity.label);}
 const name=id=>labels.get(id)??id;
 const events=new Map(allFacts.filter(f=>f.kind==='EVENT').map(f=>[f.event.id,f]));
 const eventText=id=>{const f=events.get(id);return f?`${f.event.predicate} [${id}]；${f.roles.map(r=>`${roleNames[r.role]??r.role}=${r.entity?.label??r.entity_id}`).join('；')}`:`未提供事件名称 [${id}]`;};
 const expressionText=x=>exprText(x,name,eventText);
 const quantityText=q=>`${q.metric} ${opNames[q.comparator]} ${q.value} ${q.unit}；目标=${name(q.target_id)}；计数范围=${name(q.count_scope)}`;
 const lines=['# BoundX 7+1（有限技术接受，不是业务授权）'];
 for(const [slot,v] of Object.entries(c.slots)){
  lines.push(`\n## ${slot} ${names[slot]} — ${v.status}`);
  for(const f of v.entries){
   const e=f.event,cl=f.claim;let t='';
   if(f.kind==='EVENT')t=`${modality[e.modality]} ${e.predicate}；${f.roles.map(r=>`${roleNames[r.role]}=${r.entity?.label}`).join('；')}`;
   else if(f.kind==='ROLE')t=`${e?.predicate}：${roleNames[cl.role]}=${f.entity?.label}；${modality[e?.modality]}${e?.use==='MENTION_ONLY'?'；条件引用，不新增执行义务':''}`;
   else if(f.kind==='QUANTITY')t=`${e?.predicate}：${quantityText(cl.quantity)}`;
   else t=`${({COMPLETION:'任务完成',STOP:'任务停止/升级',SCOPE:'作用域'})[f.kind]??f.kind} ${directionNames[cl?.direction]??''} ${expressionText(f.expression)}；目标=${name(cl?.scope_id)}`;
   const cond=f.constraints.map(x=>x.kind==='QUANTITY'?quantityText(x.quantity):`${directionNames[x.direction]??x.kind} ${x.temporal==='AFTER'?'之后':x.temporal==='BEFORE'?'之前':''} ${expressionText(x.expression)}`).join('；');
   const content=f.content_quantities?.map(x=>`${x.quantity.metric} ${opNames[x.quantity.comparator]} ${x.quantity.value} ${x.quantity.unit}；目标=${name(x.quantity.target_id)}；计数范围=${name(x.quantity.count_scope)}`).join('；');
   const scopes=(f.object_scopes??[]).map(s=>`对象范围=${expressionText(s.expression)}`).join('；');
   lines.push(`- [${f.status}] ${t}${cond?'；'+cond:''}${content?'；产物内容数量='+content:''}${scopes?'；'+scopes:''}（${f.id}）`);
  }
 }
 lines.push('\n## 产物关联与可用性依赖（不等于事件强顺序）');
 for(const a of c.artifact_associations??[])lines.push(`- [${a.status}] 同身份产物 ${name(a.artifact_id)}：${eventText(a.producer_event_id)} → ${eventText(a.consumer_event_id)}；仅关联，不推出版本可用或先后（${a.id}）`);
 for(const a of c.artifact_dependencies??[])lines.push(`- [${a.status}] 产物可用性 ${name(a.artifact_id)}：本次${eventText(a.producer_event_id)}结果 → ${eventText(a.consumer_event_id)}用途；${a.availability==='COMPLETE_RESULT'?'完整结果可用':'所使用部分可用'}；保留生产=${modality[a.producer_modality]} / 使用=${modality[a.consumer_modality]}；实际可用UNKNOWN，不推出整项生产完成或审批（${a.id}）`);
 lines.push('\n## 未指定 / 歧义 / 未投影语义');
 for(const i of c.issues)lines.push(`- ${i.kind} ${i.note}；影响=${i.subject_ids.join(',')}`);
 for(const f of c.retained_nonprojected.filter(f=>f.kind==='EVENT')){
  const constraints=f.constraints.map(x=>x.kind==='QUANTITY'?quantityText(x.quantity):`${directionNames[x.direction]??x.kind} ${x.temporal??''} ${expressionText(x.expression)}`).join('；');
  lines.push(`- [${f.status}] ${modality[f.event.modality]} ${eventText(f.event.id)}；层级=${f.event.layer}；用途=${f.event.use}${constraints?'；'+constraints:''}${f.event.modality==='NOT_REQUIRED'?'（不等于禁止，也不新增许可）':''}（${f.id}）`);
 }
 for(const f of c.retained_nonprojected.filter(f=>f.kind!=='EVENT'))lines.push(`- [${f.status}] ${f.kind}；事件=${f.event?eventText(f.event.id):'根任务'}${f.claim?.role?'；'+(roleNames[f.claim.role]??f.claim.role)+'='+name(f.claim.entity_id):''}${f.expression?'；'+expressionText(f.expression):''}${f.claim?.quantity?'；'+quantityText(f.claim.quantity):''}${(f.object_scopes??[]).map(s=>'；对象范围='+expressionText(s.expression)).join('')}（${f.id}）`);
 for(const g of c.gaps)lines.push(`- 覆盖缺口：${g.note??g.reason??g.id}`);
 return lines.join('\n')+'\n';
}
export function evaluateExpression(expressions,id,observations={}){
 const index=new Map(expressions.map(e=>[e.id,e]));
 // Reject ill-typed Boolean trees even when one FALSE could otherwise mask a set operand.
 const entities=[...new Set(expressions.filter(e=>['ITEM','ENUM','CATEGORY'].includes(e.op)).flatMap(e=>e.operands))].map(id=>({id,type:'OTHER'}));
 if(expressionType(expressions,id,entities)==='INVALID')return 'UNKNOWN';
 const atom=x=>JSON.stringify([x.state.predicate,x.state.event_id,x.state.args]);
 const known=new Map(),reachable=new Map();let conflict=false;
 const collect=(key,path=[])=>{const x=index.get(key);if(!x||path.includes(key))return;if(x.op==='STATE'&&x.state)reachable.set(atom(x),x);else for(const child of x.operands??[])collect(child,[...path,key]);};collect(id);
 for(const x of expressions)if(x.op==='STATE'&&x.state&&reachable.has(atom(x))&&typeof observations[x.id]==='boolean'){const value=x.state.polarity==='NEGATIVE'?!observations[x.id]:observations[x.id],k=atom(x);if(known.has(k)&&known.get(k)!==value)conflict=true;known.set(k,value);}
 if(conflict)return 'UNKNOWN';
 const run=(key,assigned=known,path=[])=>{const x=index.get(key);if(!x||path.includes(key))return 'UNKNOWN';if(x.op==='STATE'){if(!x.state||!assigned.has(atom(x)))return 'UNKNOWN';const value=assigned.get(atom(x));return (x.state.polarity==='NEGATIVE'?!value:value)?'TRUE':'FALSE';}if(['ITEM','ENUM'].includes(x.op))return new Set(x.operands);if(['CATEGORY','FORALL'].includes(x.op))return 'UNKNOWN';const values=x.operands.map(k=>run(k,assigned,[...path,key]));if(x.op==='NOT')return values[0]==='TRUE'?'FALSE':values[0]==='FALSE'?'TRUE':'UNKNOWN';if(['AND','ALL'].includes(x.op))return values.includes('FALSE')?'FALSE':values.every(v=>v==='TRUE')?'TRUE':'UNKNOWN';if(['OR','ANY'].includes(x.op))return values.includes('TRUE')?'TRUE':values.every(v=>v==='FALSE')?'FALSE':'UNKNOWN';if(!values.every(v=>v instanceof Set))return 'UNKNOWN';if(x.op==='UNION')return new Set(values.flatMap(v=>[...v]));if(x.op==='INTERSECTION')return new Set([...values[0]].filter(v=>values.every(s=>s.has(v))));if(x.op==='EXCEPT')return new Set([...values[0]].filter(v=>!values[1].has(v)));return 'UNKNOWN';};
 const result=run(id);if(result!=='UNKNOWN')return result;
 // Finite Boolean fragment only; no inferred business observations or unbounded solver.
 const unknown=[...reachable.keys()].filter(k=>!known.has(k));if(unknown.length>10)return 'UNKNOWN';let invariant=null;
 for(let n=0;n<2**unknown.length;n++){const assignment=new Map(known);unknown.forEach((k,i)=>assignment.set(k,!!(n&(1<<i))));const value=run(id,assignment);if(value==='UNKNOWN'||value instanceof Set)return 'UNKNOWN';if(invariant!==null&&invariant!==value)return 'UNKNOWN';invariant=value;}
 return invariant??'UNKNOWN';
}
export function evaluateQuantity(q,observed){
 if(typeof observed==='object'&&observed!==null){
  if(observed.unit!==q.unit||observed.target_id!==q.target_id||observed.count_scope!==q.count_scope)return 'UNKNOWN';
  observed=observed.value;
 }
 if(typeof observed!=='number'||!Number.isFinite(observed))return 'UNKNOWN';
 const compare={EQ:()=>observed===q.value,LT:()=>observed<q.value,LTE:()=>observed<=q.value,GT:()=>observed>q.value,GTE:()=>observed>=q.value}[q.comparator];
 return compare?(compare()?'TRUE':'FALSE'):'UNKNOWN';
}
export function evaluateCondition(claim,expressions,observations={}){
 const value=evaluateExpression(expressions,claim.expression_id,observations);
 return {target_id:claim.event_id??claim.scope_id,direction:claim.direction,temporal:claim.temporal,condition_value:value,
  necessary_precondition:claim.direction==='NECESSARY'||claim.direction==='IFF'?value:null,
  sufficient_trigger:claim.direction==='SUFFICIENT'||claim.direction==='IFF'?value:null,
  order_only:claim.direction==='ORDER',business_decision:null,execution_authorization:null};
}
