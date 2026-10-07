import {views} from './contracts/schema.mjs';
import {sha256} from './source.mjs';
export function compileBoundary(source,g,audit,checks){
 const rows=new Map(checks.rows.map(r=>[r.id,r]));
 const linked=x=>({...x,...(x.mentions?{mentions:rows.get(x.id)?.sources??x.mentions}:{sources:rows.get(x.id)?.sources??x.sources})});
 const index=new Map([...g.entities,...g.events,...g.claims,...g.expressions].map(x=>[x.id,linked(x)]));
 const status=ids=>ids.some(id=>rows.get(id)?.status==='REJECTED')?'REJECTED':ids.some(id=>rows.get(id)?.status!=='ACCEPTED')?'UNRESOLVED':'ACCEPTED';
 const facts=[];
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
  const build=(k,path=[])=>{if(path.includes(k))return {id:k,invalid_cycle:true};const x=index.get(k);if(!x)return {id:k,missing:true};return {...x,children:x.op==='STATE'||x.op==='ITEM'?[]:x.operands.map(child=>build(child,[...path,k]))};};return build(id);
 };
 const constraints=e=>g.claims.filter(c=>e.constraint_ids.includes(c.id)).map(c=>({...linked(c),expression:expression(c.expression_id)}));
 const current=e=>e.use==='CURRENT_TASK';
 const positive=e=>current(e)&&['REQUIRED','PERMITTED'].includes(e.modality);
 // A condition can name a participant without commanding that participant's event.
 // Preserve the explicit role in P, using only graph reachability from a boundary condition.
 const governingConditions=new Map();
 const conditionEvents=(id,seen=new Set())=>{if(seen.has(id))return [];seen.add(id);const x=index.get(id);if(!x)return [];return x.op==='STATE'?[x.state?.event_id,...(x.state?.args??[]).filter(k=>index.get(k)?.kind==='ACTION'||index.get(k)?.kind==='STATE')].filter(Boolean):(x.operands??[]).flatMap(k=>conditionEvents(k,seen));};
 for(const c of g.claims.filter(c=>c.kind==='CONDITION'&&current(index.get(c.event_id)??{})))for(const id of conditionEvents(c.expression_id)){governingConditions.set(id,[...(governingConditions.get(id)??[]),c.id]);}
 for(const raw of g.events){
  const e=linked(raw);
  const roles=g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===e.id).map(c=>({...linked(c),entity:index.get(c.entity_id),status:status([c.id,c.entity_id])}));
  const payload={event:e,roles,constraints:constraints(e)};
  make('EVENT',[e.id,...roles.map(c=>c.id),...e.constraint_ids],payload,positive(e)?['A']:current(e)&&e.modality==='FORBIDDEN'?['B']:[]);
 }
 for(const raw of g.claims){
  const c=linked(raw);
  const e=index.get(c.event_id),entity=index.get(c.entity_id);let slots=[],projectionInputs=[];
  if(c.kind==='ROLE'&&positive(e??{}))slots=c.role==='INPUT_OBJECT'?['I']:c.role==='RESULT'?['O']:c.role==='BASIS'?['V']:['PERFORMER','ORGANIZER','REVIEWER','APPROVER','RECIPIENT','COLLABORATOR'].includes(c.role)?['P']:[];
  if(c.kind==='ROLE'&&['PERFORMER','ORGANIZER','REVIEWER','APPROVER','RECIPIENT','COLLABORATOR'].includes(c.role)&&e?.layer==='CONDITION'&&e.use==='MENTION_ONLY'&&governingConditions.has(e.id)){slots=['P'];projectionInputs=governingConditions.get(e.id);}
  if(c.kind==='QUANTITY'&&positive(e??{}))slots=c.quantity.use==='EXECUTION_LIMIT'?['R']:[];
  if(['COMPLETION','STOP'].includes(c.kind))slots=['C'];
  if(c.kind==='SCOPE'){
   // Scope target/use already expressed by LLM through typed relation and mandatory result binding.
   // An output's content restriction is not external input scope. Never inspect action strings.
   const result=g.claims.filter(r=>r.kind==='ROLE'&&r.role==='RESULT'&&r.entity_id===c.scope_id&&r.event_id===c.event_id);
   if(result.length){slots=['O'];projectionInputs=result.map(r=>r.id);}
   else if(e?.modality==='FORBIDDEN'&&current(e))slots=['B'];
   else if(c.scope_id==='ROOT'||c.scope_id===c.event_id||g.claims.some(r=>r.kind==='ROLE'&&r.role==='INPUT_OBJECT'&&r.entity_id===c.scope_id&&r.event_id===c.event_id))slots=['I'];
  }
  const ids=[c.id,c.entity_id,c.expression_id,c.event_id,...(e?.constraint_ids??[]),...projectionInputs];
  const quantities=c.kind==='ROLE'&&c.role==='RESULT'?g.claims.filter(q=>q.kind==='QUANTITY'&&q.quantity?.use==='OUTPUT_CONTENT'&&q.quantity.target_id===c.entity_id&&q.event_id===c.event_id).map(linked):[];
  const contentScopes=c.kind==='ROLE'&&c.role==='RESULT'?g.claims.filter(q=>q.kind==='SCOPE'&&q.scope_id===c.entity_id&&q.event_id===c.event_id).map(q=>({...linked(q),expression:expression(q.expression_id)})):[];
  make(c.kind,[...ids,...quantities.map(q=>q.id),...contentScopes.map(q=>q.id)],{claim:c,event:e??null,entity:entity??null,expression:expression(c.expression_id),constraints:e?constraints(e):[],content_quantities:quantities,content_scopes:contentScopes},slots);
 }
 const unresolved=facts.filter(f=>f.status!=='ACCEPTED'), gaps=[...g.issues.filter(i=>i.kind==='COVERAGE_GAP'),...audit.omissions,...checks.coverage.filter(c=>c.status==='GAP')];
 const ir={format:'boundx-boundary-ir/028-r02.2',source_sha256:source.sha256,facts,entities:g.entities.map(linked),expressions:g.expressions.map(linked),issues:g.issues.map(i=>({...i,sources:checks.issue_sources?.find(x=>x.id===i.id)?.sources??i.sources})),audit_issues:audit.issues,gaps,technical_diagnostics:checks.diagnostics,business_decision:null,execution_authorization:null};
 const slots=Object.fromEntries(views.map(slot=>{const entries=facts.filter(f=>f.slots.includes(slot));const coverageGap=gaps.some(g=>g.affected_views?.includes(slot))||!checks.schemas.proposal.ok||!checks.schemas.audit.ok;return [slot,{status:coverageGap?'PARSER_COVERAGE_FAILURE':entries.some(f=>f.status!=='ACCEPTED')?'UNRESOLVED':entries.length?'RESOLVED':'ABSENT',openness:entries.length?'CONSTRAINED':'OPEN',entries}];}));
 const canonical={format:'boundx-canonical-7plus1/028-r02.2',source_sha256:source.sha256,slots,unresolved,retained_nonprojected:facts.filter(f=>f.slots.length===0),issues:g.issues,gaps,business_decision:null,execution_authorization:null};
 return {ir,canonical,chinese:renderChinese(canonical)};
}
const modality={REQUIRED:'必须',PERMITTED:'允许',FORBIDDEN:'禁止',NOT_REQUIRED:'无需',UNSTATED:'未陈述模态'};
function exprText(x,name=id=>id){if(!x)return '';if(x.op==='STATE')return `${x.state?.predicate}(${(x.state?.args??[]).map(name).join(',')}) [${x.state?.polarity};运行值UNKNOWN]`;if(x.op==='ITEM')return `ITEM(${x.operands.map(name).join(',')})`;return `${x.op}(${(x.children??[]).map(child=>exprText(child,name)).join(',')})`;}
export function renderChinese(c){
 const names={I:'输入与作用域',O:'交付与结果',A:'正向动作',P:'参与关系',R:'执行量化限制',V:'版本与依据',C:'完成与停止',B:'禁止与限制'};
 const roleNames={PERFORMER:'执行者',ORGANIZER:'组织者',REVIEWER:'复核者',APPROVER:'批准者',RECIPIENT:'接收者',COLLABORATOR:'协作者',INPUT_OBJECT:'输入/受检对象',OBJECT:'对象',RESULT:'结果/交付',BASIS:'依据',CONTENT:'内容'};
 const directionNames={NECESSARY:'必要前提',SUFFICIENT:'充分触发',IFF:'充要条件',ORDER:'时间先后'},opNames={EQ:'=',LT:'<',LTE:'≤',GT:'>',GTE:'≥'};
 const allFacts=[...Object.values(c.slots).flatMap(v=>v.entries),...c.retained_nonprojected],labels=new Map([['ROOT','根任务']]);
 for(const f of allFacts){if(f.event)labels.set(f.event.id,f.event.predicate);if(f.entity)labels.set(f.entity.id,f.entity.label);for(const r of f.roles??[])if(r.entity)labels.set(r.entity.id,r.entity.label);}
 const name=id=>labels.get(id)??id;
 const lines=['# BoundX 7+1（有限技术接受，不是业务授权）'];
 for(const [slot,v] of Object.entries(c.slots)){
  lines.push(`\n## ${slot} ${names[slot]} — ${v.status}`);
  for(const f of v.entries){
   const e=f.event,cl=f.claim;let t='';
   if(f.kind==='EVENT')t=`${modality[e.modality]} ${e.predicate}；${f.roles.map(r=>`${roleNames[r.role]}=${r.entity?.label}`).join('；')}`;
   else if(f.kind==='ROLE')t=`${e?.predicate}：${roleNames[cl.role]}=${f.entity?.label}；${modality[e?.modality]}${e?.use==='MENTION_ONLY'?'；条件引用，不新增执行义务':''}`;
   else if(f.kind==='QUANTITY')t=`${e?.predicate}：${cl.quantity.metric} ${opNames[cl.quantity.comparator]} ${cl.quantity.value} ${cl.quantity.unit}；目标=${name(cl.quantity.target_id)}；计数范围=${name(cl.quantity.count_scope)}`;
   else t=`${({COMPLETION:'任务完成',STOP:'任务停止/升级',SCOPE:'作用域'})[f.kind]??f.kind} ${directionNames[cl?.direction]??''} ${exprText(f.expression,name)}；目标=${name(cl?.scope_id)}`;
   const cond=f.constraints.filter(x=>x.kind==='CONDITION'||x.kind==='TEMPORAL').map(x=>`${directionNames[x.direction]} ${x.temporal==='AFTER'?'之后':x.temporal==='BEFORE'?'之前':''} ${exprText(x.expression,name)}`).join('；');
   const content=f.content_quantities?.map(x=>`${x.quantity.metric} ${opNames[x.quantity.comparator]} ${x.quantity.value} ${x.quantity.unit}；目标=${name(x.quantity.target_id)}；计数范围=${name(x.quantity.count_scope)}`).join('；');
   lines.push(`- [${f.status}] ${t}${cond?'；'+cond:''}${content?'；产物内容数量='+content:''}（${f.id}）`);
  }
 }
 lines.push('\n## 未指定 / 歧义 / 未投影语义');
 for(const i of c.issues)lines.push(`- ${i.kind} ${i.note}；影响=${i.subject_ids.join(',')}`);
 for(const f of c.retained_nonprojected.filter(f=>f.kind==='EVENT'&&f.event.modality==='NOT_REQUIRED'))lines.push(`- 无需 ${f.event.predicate}（不等于禁止）`);
 for(const g of c.gaps)lines.push(`- 覆盖缺口：${g.note??g.reason??g.id}`);
 return lines.join('\n')+'\n';
}
export function evaluateExpression(expressions,id,observations={}){
 const index=new Map(expressions.map(e=>[e.id,e]));
 const run=(key,path=[])=>{const x=index.get(key);if(!x||path.includes(key))return 'UNKNOWN';if(x.op==='STATE')return observations[key]===true?'TRUE':observations[key]===false?'FALSE':'UNKNOWN';if(x.op==='ITEM')return new Set(x.operands);const values=x.operands.map(k=>run(k,[...path,key]));if(x.op==='NOT')return values[0]==='TRUE'?'FALSE':values[0]==='FALSE'?'TRUE':'UNKNOWN';if(['AND','ALL'].includes(x.op))return values.includes('FALSE')?'FALSE':values.every(v=>v==='TRUE')?'TRUE':'UNKNOWN';if(['OR','ANY'].includes(x.op))return values.includes('TRUE')?'TRUE':values.every(v=>v==='FALSE')?'FALSE':'UNKNOWN';if(!values.every(v=>v instanceof Set))return 'UNKNOWN';if(x.op==='UNION')return new Set(values.flatMap(v=>[...v]));if(x.op==='INTERSECTION')return new Set([...values[0]].filter(v=>values.every(s=>s.has(v))));if(x.op==='EXCEPT')return new Set([...values[0]].filter(v=>!values[1].has(v)));return 'UNKNOWN';};return run(id);
}
export function evaluateQuantity(q,observed){if(typeof observed!=='number'||!Number.isFinite(observed))return 'UNKNOWN';return ({EQ:()=>observed===q.value,LT:()=>observed<q.value,LTE:()=>observed<=q.value,GT:()=>observed>q.value,GTE:()=>observed>=q.value}[q.comparator])()?'TRUE':'FALSE';}
