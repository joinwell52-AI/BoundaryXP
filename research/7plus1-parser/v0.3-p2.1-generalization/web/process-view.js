// Presentation only: read the saved trace. Never infer semantics from source text.
const words = {
 'PARTIAL / REVIEW_REQUIRED':'部分完成，等待人工验收', REQUIRED:'必须', ALLOWED:'允许', PERMITTED:'允许', FORBIDDEN:'禁止', NOT_REQUIRED:'无需执行', RESTRICTED:'受限', UNSTATED:'原文未明确', UNKNOWN:'未知',
 PERFORMER:'执行者', ORGANIZER:'组织者', REVIEWER:'复核者', RECEIVER:'接收者', RECIPIENT:'接收者', COLLABORATOR:'协作者',
 INPUT_OBJECT:'输入 / 受检对象', OBJECT:'对象', RESULT:'产生的结果', DELIVERABLE:'交付产物', CONTENT:'内容', BASIS:'依据', LIMIT:'限制',
 MAIN:'主任务', CONDITION:'条件', CONDITION_REFERENCE:'条件参照', CURRENT_TASK:'本次任务', BACKGROUND:'背景', QUOTATION:'引文', QUOTED:'引文', MODIFIER:'修饰层', PURPOSE:'目的层', CONTENT:'内容层', MENTION_ONLY:'仅被提及，不新增义务', OUTPUT_CONTENT:'输出内容',
 ACCEPTED:'技术接受', UNRESOLVED:'尚未确定', REJECTED:'技术拒绝', UNSUPPORTED:'不支持', DEFERRED:'暂缓', UNSPECIFIED:'原文未指定',
 RESOLVED:'已确定', ABSENT:'原文未明确', PARSER_COVERAGE_FAILURE:'覆盖不足', SUPPORT:'审阅支持', REFUTE:'审阅反对', CONTRADICT:'审阅反对', UNCERTAIN:'审阅不确定',
 ROLE:'角色 / 对象关系', EVENT:'事件', SCOPE:'适用范围', TEMPORAL:'时序', QUANTITY:'数量限制', COMPLETION:'完成条件', STOP:'停止条件',
 POSITIVE:'肯定', NEGATIVE:'否定', BEFORE:'之前', AFTER:'之后', ONLY_IF:'仅当', IF:'如果', WHEN:'当', GE:'至少', GTE:'至少', LE:'至多', LTE:'至多', EQ:'等于', GT:'多于', LT:'少于',
 NECESSARY:'必要条件（仅当）', SUFFICIENT:'充分条件（如果则）', IFF:'当且仅当', ORDER:'先后约束', EXECUTION_LIMIT:'执行资源限制', COMPLETION_THRESHOLD:'完成阈值', CLASSIFICATION_THRESHOLD:'分类阈值'
};
export const readable = value => words[value] ?? (value == null || value === '' ? '未记录' : String(value));
const array = value => Array.isArray(value) ? value : [];
const validID = id => typeof id === 'string' && id.trim().length > 0;
const indexed = rows => new Map(array(rows).filter(x=>validID(x.id)).map(x=>[x.id,x]));
const text = value => value == null ? '未记录' : String(value);
function context(trace){
 const p=trace?.proposal??{}, ir=trace?.ir??{};
 const sources=[...array(trace?.technical?.rows),...array(trace?.technical?.audit_sources),...array(trace?.technical?.issue_sources)].flatMap(r=>array(r.sources)).filter(s=>typeof s.quote==='string'&&Number.isInteger(s.occurrence)&&Array.isArray(s.span)&&s.source_sha256===trace?.source?.sha256);
 return {entities:indexed(p.entities??ir.entities),events:indexed(p.events),claims:indexed(p.claims),expressions:indexed(p.expressions??ir.expressions),rows:indexed(trace?.technical?.rows),sources};
}
function entityLabel(id,ctx){return validID(id)?ctx.entities.get(id)?.label??'未找到对象引用（'+id+'）':'对象未明确';}
export function expressionText(value,ctx,visited=new Set()){
 const x=typeof value==='string'?ctx.expressions.get(value):value;
 if(!x)return '表达式未记录';
 if(validID(x.id)&&visited.has(x.id))return '循环引用，无法展开';
 const next=new Set(visited);if(validID(x.id))next.add(x.id);
 const children=array(x.children).length?x.children:array(x.operands).map(id=>ctx.expressions.get(id)??{id,op:'MISSING'});
 const parts=children.map(child=>expressionText(child,ctx,next));
 if(x.op==='ITEM')return entityLabel(x.entity_id??x.item_id??x.operands?.[0],ctx);
 if(x.op==='STATE'){
  const s=x.state??{},args=array(s.args).map(id=>entityLabel(id,ctx));
  return (s.polarity==='NEGATIVE'?'不成立：':'')+(s.predicate??'未记录状态')+(args.length?'（'+args.join('、')+'）':'');
 }
 if(x.op==='AND'||x.op==='ALL')return '同时满足：'+parts.join('；');
 if(x.op==='OR'||x.op==='ANY')return '满足其一：'+parts.join('；');
 if(x.op==='UNION'||x.op==='ENUM')return '范围包括：'+parts.join('、');
 if(x.op==='NOT')return '不满足：'+parts.join('、');
 if(x.op==='EXCEPT')return '范围：'+(parts[0]??'未记录')+'；排除：'+parts.slice(1).join('、');
 if(x.op==='FORALL')return '该范围中的每个成员：'+parts.join('、');
 if(x.op==='CLASS'||x.op==='CATEGORY')return '类别范围：'+parts.join('、');
 return readable(x.op)+(parts.length?'：'+parts.join('、'):'（表达式详情见原始记录）');
}
function claimText(c,ctx){
 if(!c)return '关系未记录';
 if(c.kind==='ROLE')return (c.role==='CONTENT'?'内容':readable(c.role))+'：'+entityLabel(c.entity_id,ctx);
 if(c.kind==='QUANTITY'){
  const q=c.quantity??{};return '数量限制：'+readable(q.comparator??q.operator)+' '+text(q.value)+' '+text(q.unit)+'；指标：'+text(q.metric)+'；用途：'+readable(q.use)+(q.target_id?'；目标：'+subjectText(q.target_id,ctx):'')+(q.count_scope?'；计数范围：'+q.count_scope:'');
 }
 if(c.expression_id)return readable(c.kind)+'：'+(c.direction?readable(c.direction)+'；':'')+(c.temporal?readable(c.temporal)+' ':'')+expressionText(c.expression_id,ctx);
 return readable(c.kind)+(c.entity_id?'：'+entityLabel(c.entity_id,ctx):'')+(c.note?'；'+c.note:'');
}
function eventDescription(e,ctx,claims){
 const attached=claims??array([...ctx.claims.values()]).filter(c=>validID(e.id)&&c.event_id===e.id);
 const roles=attached.filter(c=>c.kind==='ROLE').map(c=>claimText(c,ctx));
 const constraints=attached.filter(c=>c.kind!=='ROLE').map(c=>claimText(c,ctx));
 return {name:e.predicate??'未记录事件',modality:readable(e.modality)+(e.polarity==='NEGATIVE'?'（否定命题）':''),layer:readable(e.layer)+' / '+readable(e.use),roles,constraints};
}
function subjectText(id,ctx){
 if(!validID(id))return '审阅目标未记录';
 const entity=ctx.entities.get(id);if(entity)return '对象：'+entity.label;
 const event=ctx.events.get(id);if(event)return '事件：'+event.predicate;
 const claim=ctx.claims.get(id);if(claim)return (ctx.events.get(claim.event_id)?.predicate??'事件未记录')+' → '+claimText(claim,ctx);
 const expr=ctx.expressions.get(id);if(expr)return expressionText(expr,ctx);
 return '目标引用：'+id;
}
const tally=(rows,key)=>array(rows).reduce((a,r)=>{const k=r[key]??'NOT_RECORDED';a[k]=(a[k]??0)+1;return a;},{});
const tallyText=(rows,key)=>Object.entries(tally(rows,key)).map(([s,n])=>readable(s)+' '+n+'项').join('，')||'尚无结果';
export function factText(f,trace){
 const ctx=context(trace);
 if(f.kind==='EVENT'){
  const e=eventDescription(f.event??{},ctx,array(f.roles).map(r=>r.claim??r));
  const constraints=array(f.constraints).map(c=>claimText(c.claim??c,ctx));
  return [e.modality+'：'+e.name,...e.roles,...constraints].join('；');
 }
 const event=f.event?.predicate??ctx.events.get(f.claim?.event_id)?.predicate;
 return (event?event+' → ':'')+claimText(f.claim??f,ctx);
}
export function modelView(run={},session={}){
 const calls=run.result?.model_calls??run.progress?.model_calls??{}, parse=array(calls.parse),audit=array(calls.audit);
 const parseIDs=parse.map(x=>x.thread_id).filter(validID),auditIDs=audit.map(x=>x.thread_id).filter(validID);
 const independent=parseIDs.length&&auditIDs.length?auditIDs.every(id=>!parseIDs.includes(id))?true:false:null;
 return {requested:run.requested_model??session.requested_model??'未记录',actual:run.actual_model??session.actual_model??'服务端未披露，不能凭请求名断言',
  mode:run.skill_mode??session.skill_mode??'未记录',independent,
  calls:[['解析',parse],['审阅',audit]].flatMap(([phase,xs])=>xs.map((x,i)=>({phase,attempt:i+1,seconds:Number.isFinite(x.elapsed_ms)?(x.elapsed_ms/1000).toFixed(1):'未记录',success:x.exit_code===0,thread:x.thread_id??'未记录',actual:x.actual_model??'未披露',usage:x.usage??null}))),
  reasoning:run.requested_reasoning??session.requested_reasoning??'medium',callCount:run.real_calls??null,version:run.product_snapshot?.product_version??session.product_snapshot?.product_version??'未记录'};
}
function duration(run,stage){
 const xs=array(run.stages).filter(x=>(x.revision??0)===(run.revision??0)),first=xs.findIndex(x=>x.stage===stage);if(first<0)return null;
 const end=xs.slice(first+1).find(x=>x.stage!==stage)?.at;if(!end)return null;
 const ms=Date.parse(end)-Date.parse(xs[first].at);return Number.isFinite(ms)&&ms>=0?(ms/1000).toFixed(1)+'秒':null;
}
function evidence(row,ctx){return array(ctx.rows.get(row.id)?.sources).length?ctx.rows.get(row.id).sources:array(row.sources??row.mentions);}
function sourceEvidence(sources,ctx){return array(sources).map(s=>ctx.sources.find(v=>v.quote===s.quote&&Number.isInteger(s.occurrence)&&v.occurrence===s.occurrence)??s);}
export function processView(run){
 const trace=run.result??{...run.progress,source:{text:run.source_text,sha256:run.source_sha256}},ctx=context(trace),p=trace?.proposal,t=trace?.technical,a=trace?.audit,ir=trace?.ir,c=trace?.canonical;
 const has=x=>x!=null;
 const stages=[
  {id:'parse',title:'1. 解析原文：形成语义候选',actor:'Codex + boundx-semantic-parse',input:'这次提交的原文、解析Skill、共享语义合同和Schema。',work:'识别对象和参与者、事件、必须/允许/无需/禁止、条件、范围和未明确项。这里生成候选，不直接证明正确。',
   outcome:p?`${array(p.events).length}个事件、${array(p.entities).length}个对象/参与者、${array(p.claims).length}项关系、${array(p.expressions).length}个条件/范围表达式。`:'尚无解析结果。',time:duration(run,'PARSING'),ready:has(p),
   headers:['事件','要求与语义层','角色与对象','条件 / 范围 / 数量'],rows:array(p?.events).map(e=>{const d=eventDescription(e,ctx);return {cells:[d.name,d.modality+'；'+d.layer,d.roles.join('；')||'未明确 / 未建立角色关系',d.constraints.join('；')||'无已记录约束'],sources:evidence(e,ctx)};}),
   notes:array(p?.issues).map(i=>readable(i.kind)+'：'+i.note),raw:p},
  {id:'audit',title:'2. 独立审阅：核对候选是否忠于原文',actor:'新会话Codex + boundx-semantic-audit',input:'同一原文、上一步的完整候选、审阅Skill和共享合同。',work:'逐项对照原文，记录支持、反对、不确定及遗漏。模型审阅是证据，不是人工验收结论。',
   outcome:a?`${array(a.reviews).length}项审阅：${tallyText(a.reviews,'verdict')}；记录遗漏${array(a.omissions).length}项。`:'尚无独立审阅结果。',time:duration(run,'AUDITING'),ready:has(a),
   headers:['核对的内容','审阅结论','理由'],rows:array(a?.reviews).map(r=>({cells:[subjectText(r.subject_id,ctx),readable(r.verdict),r.reason??'未记录理由'],sources:sourceEvidence(r.sources,ctx)})),
   notes:[...array(a?.issues).map(i=>i.reason??i.note??'审阅问题（见原始记录）'),...array(a?.omissions).map(i=>'遗漏：'+(i.reason??i.note??i.quote??'见原始记录'))],raw:a},
  {id:'technical',title:'3. 技术校验：检查结构、来源与引用',actor:'程序，零模型调用',input:'候选、独立审阅结果和冻结的技术合同。',work:'检查Schema、原文引文及精确span、ID引用、依赖和约束结构。程序不重新猜原文是什么意思。',
   outcome:t?`候选Schema${t.schemas?.proposal?.ok===true?'通过':t.schemas?.proposal?.ok===false?'失败':'未记录'}；审阅Schema${t.schemas?.audit?.ok===true?'通过':t.schemas?.audit?.ok===false?'失败':'未记录'}。${tallyText(t.rows,'status')}；技术诊断${array(t.diagnostics).length}项。`:'尚无技术校验结果。',time:duration(run,'VALIDATING'),ready:has(t),
   headers:['检查目标','技术状态','错误 / 未确定项'],rows:array(t?.rows).map(r=>({cells:[subjectText(r.id,ctx),readable(r.status),[...array(r.errors),...array(r.uncertain)].map(e=>typeof e==='string'?readable(e):e.message??e.reason??e.code??'详见诊断').join('；')||'未记录结构错误'],sources:r.sources??[]})),
   notes:array(t?.diagnostics).map(i=>i.message??i.reason??i.code??'技术诊断（见原始记录）'),raw:t},
  {id:'ir',title:'4. 生成Boundary IR：保留事实与约束',actor:'确定性编译器，零模型调用',input:'经过技术校验的结构、审阅状态和来源证据。',work:'把事件、对象、角色、条件和范围编译成可引用的边界事实，保留未决、覆盖缺口和证明链；不增加执行授权。',
   outcome:ir?`${array(ir.facts).length}条边界事实；未明确项${array(ir.issues).length}项，审阅待确认${array(ir.audit_issues).length}项，覆盖缺口${array(ir.gaps).length}项。`:'尚无Boundary IR。',time:duration(run,'COMPILING'),ready:has(ir),
   headers:['边界事实内容','状态','最终使用位置'],rows:array(ir?.facts).map(f=>{const destinations=Object.entries(c?.slots??{}).filter(([,s])=>array(s.entries).some(e=>validID(f.id)&&e.id===f.id)).map(([slot])=>slot);return {cells:[factText(f,trace),readable(f.status),destinations.length?destinations.join('、'):'保留为约束 / 上下文；未独立归槽'],sources:f.sources??[]};}),
   notes:[...array(ir?.issues).map(i=>readable(i.kind)+'：'+i.note),...array(ir?.audit_issues).map(i=>'审阅待确认：'+i.reason),...array(ir?.gaps).map(i=>'覆盖缺口：'+(i.reason??i.note??i.code??'见详情'))],raw:ir},
  {id:'canonical',title:'5. 固定生成7+1：从同一IR投影',actor:'确定性投影，零模型调用',input:'上一步的Boundary IR，不再次请求模型解释原文。',work:'按固定合同形成I/O/A/P/R/V/C/B，并由同一结果生成中文和JSON。未明确、未决、覆盖不足分别保留。',
   outcome:c?'8个维度见下表；中文、JSON和导出使用同一份编译结果。':'尚无最终7+1。',time:null,ready:has(c),
   headers:['维度','状态','条目数'],rows:Object.entries(c?.slots??{}).map(([slot,s])=>({cells:[slot,readable(s.status),String(array(s.entries).length)],sources:[]})),notes:['单次流程完成、模型审阅支持、技术接受，都不等于语义已人工验收。'],raw:c}
 ];
 return {stages,ctx};
}
function node(tag,value,cls){const n=document.createElement(tag);if(value!=null)n.textContent=value;if(cls)n.className=cls;return n;}
const phaseNames={QUEUED:'原文已接收，等待编译',PREPARING:'核对版本与准备Skill',PARSING:'解析Skill：等待模型语义候选',AUDITING:'审阅Skill：新会话核对候选',VALIDATING:'程序检查来源、Schema与引用',COMPILING:'程序生成IR与固定7+1',COMPLETED:'本次编译完成',COMPLETED_WITH_UNRESOLVED:'本次编译完成，含待确认项',FAILED:'本次运行失败',CANCELLING:'正在取消本地调用',CANCELLED:'本次已取消',INTERRUPTED:'服务中断'};
const signals={REQUEST_STARTED:'已启动Codex请求，正在等待返回',SESSION_STARTED:'Codex会话已建立',TURN_STARTED:'模型请求已开始处理',RESPONSE_RECEIVED:'收到模型响应，等待Schema验证',TURN_COMPLETED:'模型本次响应已完成',MODEL_ERROR_REPORTED:'模型调用报告错误',TRANSPORT_RETRY:'连接发生重试',RESPONSE_VALIDATED:'模型响应通过Schema检查',PARSE_READY:'语义候选已保存，可立即展开查看',AUDIT_READY:'独立审阅已保存，可立即展开查看',TECHNICAL_READY:'技术校验已完成并保存',COMPILE_READY:'IR及7+1投影已生成，正在确认本轮结束',REVISION_REQUIRED:'发现需修订项，进入既有有界修订'};
export function decisionView(run){
 const trace=run.result??{...run.progress,source:{sha256:run.source_sha256}},ctx=context(trace),p=trace.proposal??{},facts=array(trace.ir?.facts),slots=trace.canonical?.slots??{};
 return [...array(p.events),...array(p.claims)].map(item=>{
  const checks=ctx.rows.get(item.id),reviews=array(trace.audit?.reviews).filter(r=>validID(item.id)&&r.subject_id===item.id);
  const related=facts.filter(f=>validID(item.id)&&array(f.claim_ids).includes(item.id));
  const direct=related.filter(f=>f.event?.id===item.id&&f.kind==='EVENT'||f.claim?.id===item.id);
  const destinations=related.flatMap(f=>Object.entries(slots).filter(([,s])=>array(s.entries).some(e=>e.id===f.id)).map(([slot])=>slot+(direct.includes(f)?'（直接）':'（作为依赖）')));
  const reasons=[...array(checks?.errors),...array(checks?.uncertain)].map(e=>typeof e==='string'?readable(e):e.message??e.reason??e.code??'技术检查未确定');
  for(const f of related)for(const check of array(f.proof?.checks).filter(x=>x.status!=='ACCEPTED'))reasons.push(subjectText(check.id,ctx)+'：'+readable(check.status));
  return {id:item.id,cells:[subjectText(item.id,ctx),reviews.length?reviews.map(r=>readable(r.verdict)+'：'+(r.reason??'未记录理由')).join('；'):'等待独立审阅',checks?readable(checks.status)+(reasons.length?'；'+[...new Set(reasons)].join('；'):'；来源/结构检查未记录错误'):'等待技术校验',related.length?[...new Set(related.map(f=>readable(f.status)))].join('、'):'尚无对应IR事实',trace.canonical?destinations.length?[...new Set(destinations)].join('、'):related.length?'保留为上下文 / 未独立归槽':'没有进入最终事实':'等待最终投影'],sources:evidence(item,ctx)};
 });
}
function renderDecision(target,run,onEvidence){
 const rows=decisionView(run);if(!rows.length)return;
 const section=node('details',null,'decision-map');section.append(node('summary','LLM候选怎样成为最终结果：逐项对照（'+rows.length+'项）'),node('p','候选不是最终结论。下面逐项展示模型审阅、技术状态和真实IR/槽位去向；程序依据已有结构和固定合同编译，不凭原文关键词补答案。','muted'));
 section.append(table(['LLM提出的内容','独立审阅与理由','程序技术检查','IR状态','最终去向'],rows,onEvidence));
 section.append(node('p','“已确定”表示本次编译记录满足固定接纳条件；不等于人工证明语义正确。未决、拒绝、遗漏和未归槽分别保留。','process-notice'));target.append(section);
}
export function liveView(run,now=Date.now()){
 const entries=array(run.stages),revision=run.revision??0,xs=entries.filter(x=>(x.revision??0)===revision),first=xs.find(x=>x.stage===run.stage),last=xs.at(-1),busy=['QUEUED','RUNNING','CANCELLING'].includes(run.status),failure=['FAILED','CANCELLED','INTERRUPTED'].includes(run.status);
 const {stages}=processView(run),active={PARSING:'parse',AUDITING:'audit',VALIDATING:'technical',COMPILING:'ir'}[failure?xs.findLast(x=>['PARSING','AUDITING','VALIDATING','COMPILING'].includes(x.stage))?.stage:run.stage];
 const status=s=>s.ready?'DONE':active===s.id?(failure?'STOPPED':busy?'RUNNING':'WAITING'):'WAITING';
 return {busy,revision,phase:phaseNames[run.stage]??'等待输入',elapsed:Math.max(0,Math.round((now-Date.parse(first?.at??run.created_at))/1000))||0,lastSignal:last?.at??null,
  steps:[{id:'source',title:'原文',state:run.source_sha256?'DONE':'WAITING'},...stages.map(s=>({id:s.id,title:s.title.slice(3).split('：')[0],state:status(s)}))],
  timeline:entries.map(x=>({at:x.at,revision:x.revision??0,label:signals[x.signal??x.kind]??phaseNames[x.stage]??x.stage,thread:x.thread_id??null,retries:x.retry_count??null,phase:x.phase??null})),failure:run.error?.code??null};
}
function renderLive(target,run){
 target.replaceChildren();const view=liveView(run),labels={DONE:'已完成',RUNNING:'进行中',WAITING:'等待上一步',STOPPED:'已停止'};
 target.append(node('h3',view.phase),node('p',view.busy?'当前阶段已用 '+view.elapsed+' 秒。模型尚未返回完整结构时，不会虚构语义内容。':'本次运行阶段记录；完成不等于语义已人工验收。','muted'));
 const steps=node('ol',null,'live-steps');for(const s of view.steps){const li=node('li',null,'live-step '+s.state.toLowerCase());li.append(node('strong',s.title),node('span',labels[s.state]));steps.append(li);}target.append(steps);
 if(view.lastSignal)target.append(node('p','最近收到阶段信号：'+new Date(view.lastSignal).toLocaleTimeString('zh-CN')+'；第'+(view.revision+1)+'轮。','muted'));
 if(view.failure)target.append(node('p','停止原因：'+view.failure+'。未完成步骤没有最终结果。','process-notice'));
 const log=node('details',null,'live-log');log.open=view.busy;log.append(node('summary','实时执行记录（'+view.timeline.length+'条）'));
 const list=node('ol');for(const e of view.timeline){const li=node('li',new Date(e.at).toLocaleTimeString('zh-CN')+' · 第'+(e.revision+1)+'轮 · '+(e.phase==='parse'?'解析：':e.phase==='audit'?'审阅：':'')+e.label+(e.retries!==null?'（累计'+e.retries+'次重试）':''));if(e.thread)li.append(node('small',' 会话 '+e.thread));list.append(li);}log.append(list);target.append(log);
}
function rawDetails(title,value){const d=node('details',null,'developer-details');d.append(node('summary',title));if(value!=null)d.append(node('pre',JSON.stringify(value,null,2)));else d.append(node('p','尚无记录。'));return d;}
function table(headers,rows,onEvidence){
 const wrap=node('div',null,'process-table-wrap'),t=node('table'),head=node('thead'),h=node('tr');
 for(const label of [...headers,'原文证据'])h.append(node('th',label));head.append(h);t.append(head);const body=node('tbody');
 for(const row of rows){const tr=node('tr');for(const cell of row.cells)tr.append(node('td',cell));const td=node('td');if(row.sources?.length){const b=node('button','查看原文','evidence-button');b.onclick=()=>onEvidence(row.sources);td.append(b);}else td.textContent='无独立来源 / 见上游';tr.append(td);body.append(tr);}t.append(body);wrap.append(t);return wrap;
}
export function renderModelInfo(target,run={},session={}){
 target.replaceChildren();const view=modelView(run,session);target.append(node('h3','模型与两次Skill调用'),node('p','请求模型：'+view.requested+'；实际服务模型：'+view.actual));
 target.append(node('p','本次推理设置：'+view.reasoning+'。解析和独立审阅使用本次选定的同一请求模型，分别启动会话。新任务可在左侧“本次编译设置”选择；历史记录不会随选择改变。','muted'));
 target.append(node('p','Skill内容以 '+view.mode+' 方式送入请求；本机原生Skill发现/自动加载未被验证，不冒称已经验证。','muted'));
 if(view.calls.length)target.append(table(['环节','耗时','调用退出','会话'],view.calls.map(c=>({cells:[c.phase+'第'+c.attempt+'次',c.seconds+'秒',c.success?'正常退出（不等于语义正确）':'非正常退出',c.thread],sources:[]})),()=>{}));
 const independent=view.independent===true?'解析与审阅会话ID不同，独立会话已记录。':view.independent===false?'警告：会话ID存在重用。':'会话独立性暂无完整记录。';target.append(node('p',independent));
}
export function renderCompilerProcess(target,run,{onEvidence=()=>{},session={}}={}){
 const key=JSON.stringify([run.run_id,run.status,run.stage,run.revision,run.stages,run.result,run.progress]);
 if(target._processKey===key&&target.querySelector('.runtime-progress')){renderLive(target.querySelector('.runtime-progress'),run);return;}
 const sameRun=target._processRunId===run.run_id;
 const openState=new Map(sameRun?[...target.querySelectorAll('details[data-stage]')].map(d=>[d.dataset.stage,d.open]):[]);
 const previousStage=sameRun?target._processStage:null;
 target._processRunId=run.run_id;target._processStage=run.stage;
 target._processKey=key;target.replaceChildren();const {stages}=processView(run);
 target.append(node('h2','从原文到7+1：实时编译过程'),node('p','步骤实时更新，已生成的候选和审阅立即可查看；最后统一展示7+1结果。以下只读取本次实际产物，不重新解释原文。','muted'));
 const live=node('section',null,'runtime-progress');live.setAttribute('aria-label','实时编译进度');renderLive(live,run);target.append(live);
 const settings=node('details',null,'model-panel');settings.append(node('summary','模型、两个Skill与独立会话记录'));const modelBody=node('div');renderModelInfo(modelBody,run,session);settings.append(modelBody);target.append(settings);
 for(const s of stages){const section=node('details',null,'process-stage');section.dataset.stage=s.id;
  section.open=stageDisclosure(run,s.id,{previousStage,previousOpen:openState.get(s.id)});
  const summary=node('summary');summary.append(node('span',s.title,'stage-title'),node('span',s.outcome,'stage-outcome'));section.append(summary,node('p',s.actor+(s.time?' · '+s.time:''),'stage-actor'));
  const dl=node('dl',null,'stage-explanation');for(const [title,value] of [['收到什么',s.input],['做了什么',s.work],['得到什么',s.outcome]])dl.append(node('dt',title),node('dd',value));section.append(dl);
  if(s.rows.length)section.append(table(s.headers,s.rows,onEvidence));else section.append(node('p',s.ready?'本环节没有记录条目。':'未完成 / 尚无输出，不能当作通过。','muted'));
  if(s.id==='parse'&&s.raw){const ctx=processView(run).ctx;
   section.append(node('h3','LLM识别的对象与参与者'),table(['名称','候选类型'],array(s.raw.entities).map(e=>({cells:[e.label,readable(e.type)],sources:evidence(e,ctx)})),onEvidence));
   section.append(node('h3','LLM识别的条件与范围'),table(['表达式内容','结构算子'],array(s.raw.expressions).map(e=>({cells:[expressionText(e,ctx),e.op],sources:evidence(e,ctx)})),onEvidence));
  }
  for(const note of s.notes)section.append(node('p',note,'process-notice'));
  section.append(rawDetails('开发详情：本环节原始JSON',s.raw));target.append(section);
 }
 renderDecision(target,run,onEvidence);
}
export function stageDisclosure(run,id,{previousStage=null,previousOpen}={}){
 const active={PARSING:'parse',AUDITING:'audit',VALIDATING:'technical',COMPILING:'ir'}[run.stage];
 if(['QUEUED','RUNNING','CANCELLING'].includes(run.status)&&active===id&&previousStage!==run.stage)return true;
 return previousOpen??false;
}
