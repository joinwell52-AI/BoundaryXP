const $=s=>document.querySelector(s),el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const AXES=['I','O','A','P','R','V','C','B'],NAMES=['输入范围','产物交付','动作关系','参与责任','额度时间','版本依据','完成与停止','禁止限制'];
const LABELS={RECORDED:'已记录 · 非核验结论',NOT_RUN:'尚未核验',UNSTATED:'原文未明示',UNRESOLVED:'未决（尚不能判定）',STALE:'版本已变化',NOT_APPLICABLE:'不适用',PENDING_COVERAGE:'待覆盖',VIOLATED:'已确认越界',VERIFIED:'程序复算符合',COMPATIBLE:'模型审阅认为相容',INHERITED:'适用上级限制'};
const BASIS={PROGRAM:'程序复算（操作数由模型映射，独立审阅已核对）',PROGRAM_INPUT_CHECK:'程序接口与来源检查',PROGRAM_COVERAGE:'程序核对比较覆盖记录',LLM_REVIEWED:'模型语义判断 · 独立审阅已核对',INDEPENDENT_REVIEW:'独立审阅发现的问题'};
const RADII={RECORDED:170,NOT_RUN:200,UNSTATED:200,UNRESOLVED:200,STALE:200,NOT_APPLICABLE:200,PENDING_COVERAGE:110,VIOLATED:249,VERIFIED:170,COMPATIBLE:170,INHERITED:175};
const uncertain=s=>['NOT_RUN','UNSTATED','UNRESOLVED','STALE','NOT_APPLICABLE'].includes(s);
const color=(s,c='#3267eb')=>s==='VIOLATED'?'#df4f61':['UNRESOLVED','PENDING_COVERAGE'].includes(s)?'#b88016':uncertain(s)?'#98a8bd':c;
const state={session:null,plan:null,focus:null,axis:'I',visible:{},jobs:[],snapshots:[],historical:false,comparison:false,perf:[]};
const STAGE_LABELS={PREPARING:'文本',PARSING:'LLM',AUDITING:'独立审阅',VALIDATING:'结构核验',COMPILING:'结果',CALCULATING:'数学复算'};
const elapsed=(a,b)=>a&&b?Math.max(0,new Date(b)-new Date(a)):null;
const durationText=ms=>ms==null?'耗时未记录':ms<1?'< 1ms':ms<1000?ms.toFixed(1)+'ms':(ms/1000).toFixed(1)+'s';
function latestJob(){const node=findNode(state.focus),nodes=node?[node]:(state.plan?.nodes??[]),ids=new Set(nodes.map(n=>n.id)),keys=new Set(nodes.flatMap(n=>[n.result_key,n.result?.input_sha256]).filter(Boolean));return [...state.jobs].sort((a,b)=>String(b.started_at).localeCompare(String(a.started_at))).find(j=>(!state.historical&&['QUEUED','RUNNING'].includes(j.status)&&(!node||!j.node_ids?.length||j.node_ids.includes(node.id)))||j.entries?.some(e=>(!node||ids.has(e.node_id))&&(!state.historical||keys.has(e.result_key)||keys.has(e.input_sha256))))??null;}
function renderExecutionLog(job,node,entry,result,timeline){
 let panel=$('#executionPanel');if(!panel){panel=el('section',undefined,'card execution-panel');panel.id='executionPanel';const head=el('div',undefined,'card-head');head.append(el('h2','本次执行'));const config=el('div',undefined,'execution-config');config.id='executionConfig';const title=el('h3','实时执行记录'),log=el('ol',undefined,'execution-log');log.id='executionLog';log.setAttribute('role','log');log.setAttribute('aria-live','polite');panel.append(head,config,title,log);$('#taskSidebar').append(panel);}
 const config=$('#executionConfig'),settings=job?.execution_settings,packs=job?.dictionary_snapshot?.packs??result?.dictionaries?.packs,calls=entry?.calls??[];
 config.replaceChildren();const row=(label,value)=>{const item=el('div');item.append(el('span',label,'execution-label'),el('strong',value));config.append(item);};
 row('任务',node?.label??'规划比较');row('运行',job?new Date(job.started_at).toLocaleString('zh-CN',{hour12:false}):'尚未开始');
 row('生成模型',calls.find(c=>c.phase==='GENERATE')?.requested_model??settings?.model??'未记录');row('审阅模型',calls.find(c=>c.phase==='AUDIT')?.requested_model??settings?.model??'未记录');row('推理强度',settings?.reasoning??'未记录');
 for(const layer of ['L2','L3']){const selected=packs?.filter(p=>p.layer===layer);row(layer+' 字典',selected?.length?selected.map(p=>`${p.label} · ${p.id}`).join('；'):packs?'未启用':settings?.dictionaries?settings.dictionaries[layer.toLowerCase()]||'未启用':'未记录');}
 config.append(el('p','本次请求的模型与字典版本；调整设置仅影响下一次运行。','small'));
 const log=$('#executionLog'),follow=log.scrollHeight-log.scrollTop-log.clientHeight<40;
 const events=job?[{at:entry?.started_at??job.started_at,stage:'PREPARING',signal:'RUN_STARTED'},...timeline]:[];
 if(entry?.ended_at||job?.ended_at)events.push({at:entry?.ended_at??job.ended_at,stage:'COMPILING',signal:entry?.status??job.status,error:entry?.error??job.error});
 const names={RUN_STARTED:'开始处理本次任务',SCAN_READY:'字典扫描完成',REQUEST_STARTED:'发出模型请求',SESSION_STARTED:'会话已建立',TURN_STARTED:'模型开始处理',TURN_COMPLETED:'模型处理结束',RESPONSE_RECEIVED:'收到模型响应',PARSE_READY:'边界生成完成',AUDIT_READY:'独立审阅完成',CALCULATION_READY:'数学复算完成',TECHNICAL_READY:'技术校验完成',COMPILE_READY:'生成记录已保存',REPORT_SAVED:'报告已保存',PUBLIC_REASONING_SUMMARY:'收到模型公开进度摘要',TOOL_ACTIVITY:'模型正在使用工具',TRANSPORT_RETRY:'连接重试',SESSION_DIAGNOSTIC:'会话报告诊断信息',MODEL_ERROR_REPORTED:'模型报告错误',RESPONSE_VALIDATED:'模型响应已接收检查',COMPLETED:'本次结果已保存',FAILED:'运行失败',CANCELLED:'已取消',INTERRUPTED:'运行中断',UNRESOLVED:'结果已保存，含未决项'};
 const signature=JSON.stringify(events);if(log.dataset.signature!==signature){log.dataset.signature=signature;log.replaceChildren();if(!events.length)log.append(el('li','开始编译后显示本次真实执行事件。'));for(const x of events){const item=el('li'),owner=x.stage==='PARSING'?'LLM生成':x.stage==='AUDITING'?'独立审阅':'程序',label=names[x.signal]??(x.signal?x.signal:({SCANNING:'开始字典扫描',PREPARING:'准备原文',PARSING:'开始边界生成',AUDITING:'开始独立审阅',VALIDATING:'技术校验',CALCULATING:'开始数学复算',COMPILING:'保存结果'}[x.stage]??x.stage));item.append(el('time',new Date(x.at).toLocaleTimeString('zh-CN',{hour12:false})),el('b',owner),el('span',label+(Number.isFinite(x.elapsed_ms)?' · '+durationText(x.elapsed_ms):'')));if(x.error)item.append(el('span',x.error,'bad'));log.append(item);}if(follow)log.scrollTop=log.scrollHeight;}
}
function renderProcess(){
 const job=latestJob(),node=findNode(state.focus),entry=node?job?.entries?.find(e=>e.node_id===node.id):job?.entries?.at(-1),running=!!job&&['RUNNING','QUEUED'].includes(job.status),result=(running&&!entry||entry&&!['COMPLETED','UNRESOLVED'].includes(entry.status))?null:node?.result,calls=entry?.calls??[],generate=calls.find(c=>c.phase==='GENERATE'),audit=calls.find(c=>c.phase==='AUDIT'),total=elapsed(job?.started_at,job?.ended_at??(running?new Date().toISOString():null));
 const timeline=(job?.timeline??[]).filter(x=>!entry?.started_at||x.at>=entry.started_at&&(!entry.ended_at||x.at<=entry.ended_at)),stageMs=name=>{const ready=timeline.findLast(x=>x.stage===name&&Number.isFinite(x.elapsed_ms));if(ready)return ready.elapsed_ms;const hit=timeline.findLastIndex(x=>x.stage===name&&(!x.signal||x.signal==='REQUEST_STARTED'));if(hit<0)return null;const start=timeline[hit].at,end=timeline.slice(hit+1).find(x=>x.stage!==name)?.at??entry?.ended_at??job?.ended_at??(running?new Date().toISOString():null);return elapsed(start,end);};
 const scan=result?.dictionary_scan,calc=result?.boundary_calculations,math=result?.workbench_math,programDone=math?.calculation_performed===true;
 const current=running&&entry?.status==='RUNNING'&&(!job.progress?.node_id||job.progress.node_id===node?.id)?job.progress?.stage:null;
 const defs=[
  {key:'PREPARING',name:'文本',done:!!node?.text,meta:node?.text?`${[...node.text].length} 字符已固化`:'等待原文',time:stageMs('PREPARING')},
  {key:'SCANNING',name:'扫描',done:!!scan||timeline.some(x=>x.signal==='SCAN_READY'),meta:scan?`${scan.matches?.length??0} 命中 · ${scan.entries?.length??0} 词条`:timeline.some(x=>x.signal==='SCAN_READY')?'字典扫描已完成':'等待字典扫描',time:scan?.elapsed_ms??stageMs('SCANNING')},
  {key:'PARSING',name:'LLM',done:!!result?.proposal||timeline.some(x=>x.signal==='PARSE_READY'),meta:generate?`${generate.count} 请求 · 边界生成`:timeline.some(x=>x.signal==='PARSE_READY')?'边界生成已完成':'等待语义生成',time:generate?.elapsed_ms??stageMs('PARSING')},
  {key:'AUDITING',name:'独立审阅',done:!!result?.review||timeline.some(x=>x.signal==='AUDIT_READY'),meta:audit?`${audit.count} 请求 · 独立会话`:timeline.some(x=>x.signal==='AUDIT_READY')?'独立审阅已完成':'等待独立审阅',time:audit?.elapsed_ms??stageMs('AUDITING')},
  {key:'CALCULATING',name:'数学复算',done:programDone,warning:!!calc&&!programDone,meta:programDone?`${math.structural?.clause_count??0} 条边界记录${result?.workbench_math_timing_scope==='CURRENT_READ_RECALCULATION'?' · 本次读取复算':''}`:calc?'当前表达不可确定计算':'等待计算结构',time:result?.workbench_math_elapsed_ms??stageMs('CALCULATING')},
  {key:'COMPILING',name:'结果',done:!!result,meta:result?`${result.boundary?.clauses?.length??0} 条边界 · 已保存`:'等待结果',time:stageMs('COMPILING')}
 ];
 renderExecutionLog(job,node,entry,result,timeline);
 $('#processTotal').textContent=durationText(total);$('#processRequests').textContent=`${job?.request_count??0} 次模型请求（已回执）`;
 const rail=$('#processRail');rail.replaceChildren();defs.forEach((d,i)=>{const active=current===d.key,status=active?'active':d.done?'complete':d.warning?'warning':'pending',box=el('div',undefined,'process-step '+status);box.append(el('span',String(i+1).padStart(2,'0'),'process-index'),el('strong',d.name,'process-name'),el('span',active?'正在处理…':d.meta,'process-state'),el('span',active?(stageMs(d.key)==null?'计时中…':durationText(stageMs(d.key))):d.done||d.warning?(entry?.cache_hit?'已复用 · 本次未执行':durationText(d.time)):'等待开始','process-time'));rail.append(box);});
}
function mathKind(text){if(/[⊆⊂∩∪{}]|集合|并集|交集/.test(text))return '集合';if(/[<>≤≥]|大于|小于|不超过|区间/.test(text))return '区间';if(/当且仅当|缺一不可|同时成立|AND|OR|XOR/.test(text))return '逻辑';if(/恰\s*\d|共\s*\d|全部\s*\d|\d+\s*份|次数|额度/.test(text))return '数量';if(/前置|开始时|依赖|依据.*生成|先于|之后/.test(text))return '依赖';return null;}
function mathExcerpt(text,kind){const pieces=text.split(/[。；]/).map(x=>x.trim()).filter(Boolean),tests={集合:/[⊆⊂∩∪{}]|集合|并集|交集/,区间:/[<>≤≥]|大于|小于|不超过|区间/,逻辑:/当且仅当|缺一不可|同时成立|AND|OR|XOR/,数量:/恰\s*\d|共\s*\d|全部\s*\d|\d+\s*份|次数|额度/,依赖:/前置|开始时|依赖|依据.*生成|先于|之后/};return pieces.filter(x=>tests[kind].test(x)).join('；')||text;}
function mathAnalysisRows(result){
 const clauses=result?.boundary?.clauses??[],byId=new Map(clauses.map(c=>[c.id,c])),rows=[];
 const analyses=result?.proposal?.math_analysis;
 if(Array.isArray(analyses))for(const a of analyses){
  if(!a||typeof a!=='object')continue;
  const ids=Array.isArray(a.clause_ids)?a.clause_ids:[],bound=ids.length>0&&ids.every(id=>byId.get(id)?.source_valid===true);
  const issue=(result.review?.issues??[]).some(i=>i.analysis_ids?.includes(a.id)||(i.clause_ids??[]).some(id=>ids.includes(id)));
  const full=['formula','result','reason'].every(k=>typeof a[k]==='string'&&a[k].trim());
  const supported=bound&&full&&!issue;
  const verdict=/\b(PASS|SAT|NONEMPTY|MANY|true|empty)\b|∅/.test(a.result??'');
  rows.push({owner:'LLM',title:typeof a.title==='string'?a.title:'模型数学分析',formula:typeof a.formula==='string'?a.formula:'未提供公式',result:supported&&!verdict?a.result:'待核对',reason:!full?'缺少公式、结果或理由。':!bound?'缺少已绑定原文的条款依据。':issue?'独立审阅指出关联问题，当前结论尚不能确认。':verdict?'模型提出了判定结论，尚无对应程序复算证据。模型理由：'+a.reason:a.reason,claim:(!supported||verdict)&&typeof a.result==='string'?a.result:null,clause_ids:ids.filter(id=>byId.has(id)),verified:false});
 }
 const m=result?.workbench_math;
 // Stored analysis statuses and a completed pipeline are not proof of calculation.
 // A finite result is shown only for the core's documented finite-set fragment.
 const finite=m?.set_problem&&m?.set_result?.verification==='FINITE_ENUMERATION'&&Number.isInteger(m.set_result.checked_assignments)&&m.set_result.checked_assignments>0&&Number.isInteger(m.set_result.solution_count)&&m.set_result.solution_count>=0&&['SAT','UNSAT'].includes(m.set_result.result)&&((m.set_result.result==='SAT')===(m.set_result.solution_count>0));
 if(finite)rows.push({owner:'PROGRAM',title:'显式集合约束一致性',formula:(m.set_problem.variables??[]).map(v=>v+' ⊆ '+m.set_problem.universe_id+', |'+v+'| = '+m.set_problem.sizes[v]).join('; ')+'; |'+m.set_problem.variables.join(' ∩ ')+'| = '+m.set_problem.overlap+'; '+m.set_problem.variables.join(' ∪ ')+' = '+m.set_problem.universe_id,result:m.set_result.result==='SAT'?'该集合片段可满足':'该集合片段不可满足',reason:'程序已枚举 '+m.set_result.checked_assignments+' 个有限集合赋值。仅覆盖上述显式集合约束，不代表整项任务通过。',verified:true,clause_ids:[]});
 if(m?.interval){const t=m.interval;if([t.lower,t.upper].every(Number.isFinite)&&t.lower<=t.upper)rows.push({owner:'PROGRAM',title:'时间区间',formula:t.lower+(t.lower_inclusive?' ≤ ':' < ')+t.variable+(t.upper_inclusive?' ≤ ':' < ')+t.upper,result:t.variable+' ∈ '+(t.lower_inclusive?'[':'(')+t.lower+', '+t.upper+(t.upper_inclusive?']':')')+' '+(t.unit??''),reason:'程序从已保存的显式不等式读取端点；未验证原文语义或实际执行耗时。',verified:false,clause_ids:[]});}
 return rows;
}
function mathCheckGaps(result){
 const m=result?.workbench_math;if(!m)return [];
 const d=m.determinations??{},defs=[
 ['required_gap','必需条件缺口','Missing = Required ∖ Specified','缺少可比较的 Required、Specified 集合，不能把差集写成空集。'],
 ['forbidden_conflict','禁止边界冲突','Conflict = A_planned ∩ F_forbidden','缺少结构化的计划动作与禁止动作集合，不能判为无冲突。'],
 ['consistency','约束一致性','Consistency(Φ)','当前记录没有整项约束的一致性证明；局部计算不等于整体通过。'],
 ['decidability','完成条件可判定性','Decidable(K)','记录完成条件不等于已验证其可判定性，也不表示业务已经完成。']
 ];
 return defs.filter(([k])=>d[k]).map(([key,title,formula,reason])=>({owner:'PROGRAM',title,formula,result:'未复算',reason,verified:false,clause_ids:[]}));
}
function renderMath(){
 const node=findNode(state.focus),result=node?.result,rows=mathAnalysisRows(result);
 $('.math-card').hidden=!result||rows.length===0;
 const summary=$('#mathSummary');summary.replaceChildren();summary.hidden=true;
 const badge=$('#mathVerification');badge.className='verification-badge';badge.textContent='LLM 分析与程序复算分列';
 const root=$('#mathResults');root.replaceChildren();
 $('.math-head h2').textContent='数学分析：公式、结果与理由';$('.math-head .section-kicker').textContent='7+1 边界';
 if(!result){root.append(el('p','当前版本尚无生成结果；可从任务快照回看已有结果。','math-empty'));return;}
 const appendCard=(parent,row)=>{
  const card=el('article',undefined,'analysis-card '+(row.owner==='LLM'?'model-analysis':'program-analysis')),head=el('div',undefined,'analysis-card-head');
  head.append(el('strong',row.title),el('span',row.owner==='LLM'?'LLM 分析 · 非程序证明':row.verified?'程序复算 · 限定范围':'程序检查','analysis-owner'));card.append(head);
  for(const [label,value,cls] of [['公式',row.formula,'analysis-formula'],['结果',row.result,'analysis-result'],['理由',row.reason,'analysis-reason']]){
   const field=el('div',undefined,'analysis-field');field.append(el('span',label),el('div',value,cls));card.append(field);
  }
  if(row.claim){const raw=el('details');raw.append(el('summary','查看模型原结论（尚未确认）'),el('p',row.claim));card.append(raw);}
  for(const id of row.clause_ids){const b=el('button','原文依据 · '+id,'btn');b.onclick=()=>source({node_id:node.id,clause_id:id});card.append(b);}
  parent.append(card);
 };
 for(const [owner,title]of [['LLM','LLM 数学分析'],['PROGRAM','程序核对结果']]){
  const selected=rows.filter(r=>r.owner===owner);if(!selected.length)continue;
  const section=el('section',undefined,'analysis-section');section.append(el('h3',title));
  if(!selected.length)section.append(el('p',owner==='LLM'?'本次保存结果未单独交付“公式＋结果＋理由”；不重复右侧条款。':'本次没有可展示的、有计算依据的复算结果。','small'));
  for(const row of selected)appendCard(section,row);root.append(section);
 }

}
const mdCell=value=>String(value??'—').replace(/\|/g,'\\|').replace(/\r?\n/g,'<br>');
function markdownReport(){
 if(!state.plan)throw Error('暂无保存结果');const plan=state.plan,job=latestJob(),lines=[],total=elapsed(job?.started_at,job?.ended_at),generated=new Date().toLocaleString('zh-CN',{hour12:false});
 lines.push(`# BoundX 任务边界报告：${plan.label}`,'',`> 生成时间：${generated}  `,`> 项目：${plan.project_id} · 快照 v${plan.revision} · ${plan.mode==='TREE'?'父子任务':'单任务'}  `,'> 本报告是边界分析与核验记录，不构成业务裁决或执行授权。','');
 lines.push('## 1. 编译过程','', '| 阶段 | 状态 | 耗时 / 结果 |','|---|---|---|');
 const entry=job?.entries?.at(-1),calls=entry?.calls??[],gen=calls.find(c=>c.phase==='GENERATE'),audit=calls.find(c=>c.phase==='AUDIT'),focus=findNode(state.focus)??plan.nodes[0],scan=focus?.result?.dictionary_scan,math=focus?.result?.workbench_math;
 for(const row of [['文本',focus?.text?'已固化':'未提供',focus?.text?`${[...focus.text].length} 字符`:'—'],['字典扫描',scan?'已完成':'未执行',scan?`${scan.matches?.length??0} 命中 / ${scan.entries?.length??0} 词条`:'—'],['LLM 边界生成',gen?'已完成':'未执行',gen?durationText(gen.elapsed_ms):'—'],['独立审阅',audit?'已完成':'未执行',audit?durationText(audit.elapsed_ms):'—'],['确定性数学计算',math?.calculation_performed?'已执行':'未执行',math?.calculation_performed?`${math.structural?.clause_count??0} 条边界记录`:'—'],['结果保存',focus?.result?'已完成':'未完成',focus?.result?`${focus.result.boundary?.clauses?.length??0} 条边界`:'—']])lines.push(`| ${row.map(mdCell).join(' | ')} |`);
 lines.push('',`**本次总耗时：${durationText(total)}；模型请求：${job?.request_count??0} 次。**`,'');
 lines.push('## 2. 7+1 边界总览','', '| 维度 | 定义 | 当前条款 |','|---|---|---|');
 for(let i=0;i<AXES.length;i++){const a=AXES[i],texts=plan.nodes.flatMap(n=>(n.result?.boundary?.clauses??[]).filter(c=>c.axes.includes(a)).map(c=>`**${n.label}/${c.id}** ${c.text}`));lines.push(`| ${a} | ${NAMES[i]} | ${mdCell(texts.join('<br><br>')||'原文未明示')} |`);}
 lines.push('','## 3. 任务条款与原文证据','');
 for(const n of plan.nodes){lines.push(`### ${n.label} · 原文 v${n.version}`,'','#### 原文','',...String(n.text??'').split(/\r?\n/).map(x=>'    '+x),'','#### 边界条款','');for(const c of n.result?.boundary?.clauses??[])lines.push(`- **${c.id} · ${c.axes.join('/')}** ${c.text}`,`  - 原文依据：${(c.evidence??[]).map(e=>`“${e.quote}” [${e.span?.join(', ')??'—'})`).join('；')||'未绑定'}`);if(!n.result)lines.push('- 尚未生成当前版本结果。');lines.push('');}
 lines.push('## 4. 数学分析：公式、结果与理由','');
 for(const n of plan.nodes){
  lines.push('### '+n.label,'');
  const rows=mathAnalysisRows(n.result);
  if(!rows.length)lines.push('本次没有单独交付的数学分析或有依据的程序复算结果。','');
  for(const row of rows){
   lines.push('#### '+row.title,'','- 来源：'+(row.owner==='LLM'?'LLM 分析（非程序证明）':row.verified?'程序复算（限定范围）':'程序检查'),'- 公式：'+row.formula,'- 结果：'+row.result,'- 理由：'+row.reason);
   if(row.claim)lines.push('- 模型原结论（尚未确认）：'+row.claim);
   if(row.clause_ids.length)lines.push('- 原文依据：'+row.clause_ids.join('、'));
   lines.push('');
  }
 }
 lines.push('## 5. 独立审阅','');for(const n of plan.nodes)lines.push(`- **${n.label}**：${n.result?.review?.status??'未执行'}${n.result?.review?.scope?' — '+n.result.review.scope:''}`);
 lines.push('','## 6. 边界声明','', '- 雷达半径仅表达离散状态，不是评分、完成率或授权大小。','- “独立审阅未发现问题”不等于数学证明。','- 程序未复算的自然语言表达不得作为确定性计算结果。','- `business_decision = null`','- `execution_authorization = null`','');return lines.join('\n');
}
function download(name,content,type){const a=el('a'),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function api(url,body){const r=await fetch(url,{method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'content-type':'application/json','x-boundx-session':state.session.token},body:body===undefined?undefined:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw Error(data.error??r.status);return data;}
const base=()=>'/api/workbench/projects/'+state.plan.project_id;
function error(e){$('#error').textContent=e.message;$('#error').hidden=false;}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2000);}
const action=(s,fn)=>$(s).addEventListener('click',()=>Promise.resolve().then(fn).catch(error));
function modal(title){$('#dialogTitle').textContent=title;$('#dialogBody').replaceChildren();if(!$('#dialog').open)$('#dialog').showModal();return $('#dialogBody');}
function field(container,label,tag='input',value=''){const l=el('label',label),c=el(tag);c.value=value;l.append(c);container.append(l);return c;}
function button(container,text,fn,cls='btn'){const b=el('button',text,cls);b.type='button';b.onclick=()=>Promise.resolve().then(fn).catch(error);container.append(b);return b;}
async function refreshList(){const ps=(await api('/api/workbench/projects')).filter(p=>p.nodes>0),s=$('#projectSelect');s.replaceChildren(new Option('选择已保存任务',''),...ps.sort((a,b)=>b.saved_at.localeCompare(a.saved_at)).map(p=>new Option(`${p.label} · ${p.nodes===1?'单任务':p.nodes+'项父子任务'}`,p.project_id)));if(state.plan?.nodes.length)s.value=state.plan.project_id;}
async function load(id,revision){state.plan=await api('/api/workbench/projects/'+id+(revision===undefined?'':'?revision='+revision));state.historical=revision!==undefined;[state.snapshots,state.jobs]=await Promise.all([api(base()+'/snapshots'),api(base()+'/jobs')]);if(!state.plan.nodes.some(n=>n.id===state.focus)&&state.focus!=='combo')state.focus=state.plan.nodes[0]?.id??null;localStorage.setItem('boundx-workbench-project',id);render();await refreshList();}
async function mutate(command){if(state.historical)throw Error('历史快照只读，请返回当前版本');state.plan=await api(base(),{revision:state.plan.revision,command});await load(state.plan.project_id);}
async function create(){
 const body=modal('新建任务'),kind=field(body,'任务类型','select');kind.add(new Option('单任务（默认）','SINGLE'));kind.add(new Option('父子任务','TREE'));kind.value='SINGLE';
 const name=field(body,'任务名称','input','新任务'),text=field(body,'任务原文（不会执行其中的业务指令）','textarea','');
 const upload=field(body,'或上传 UTF-8 文本');upload.type='file';upload.accept='.txt,.md';upload.onchange=async()=>{try{text.value=await upload.files[0].text();}catch(e){error(e);}};
 body.append(el('p','通常选择“单任务”；只有需要比较父任务和子任务的边界时，才选择“父子任务”。','small'));
 button(body,'保存',async()=>{
  const label=name.value.trim(),source=text.value.trim();if(!label)throw Error('请填写任务名称');if(!source)throw Error('请填写任务原文或上传文本文件');
  state.plan=await api('/api/workbench/projects',{label,settings:{model:state.session.requested_model,reasoning:state.session.requested_reasoning,parse_method:'SKILL'}});
  const id='T-'+crypto.randomUUID().slice(0,8),url='/api/workbench/projects/'+state.plan.project_id;state.plan=await api(url,{revision:state.plan.revision,command:{type:'add',id,label,text:source,parent_id:null,parent_basis:'',context_mode:'NONE'}});
  if(kind.value==='TREE')state.plan=await api(url,{revision:state.plan.revision,command:{type:'mode',mode:'TREE'}});
  state.focus=id;$('#dialog').close();await load(state.plan.project_id);
 },'primary');
}
function newTask(){
 const current=findNode(state.focus);if(state.plan?.mode==='TREE'&&current&&!state.historical){const body=modal('新建任务');body.append(el('p',`当前选择“${current.label}”。请选择新任务的归属。`,'small'));button(body,'添加为当前任务的子任务',()=>{$('#dialog').close();editNode(true);},'primary');button(body,'新建独立任务',()=>{$('#dialog').close();create();});return;}create();
}
function deleteTask(){
 const current=findNode(state.focus);if(!current)throw Error('请先选择要删除的任务');if(state.historical)throw Error('历史快照不可删除');const descendants=state.plan.nodes.filter(n=>n.id!==current.id&&(()=>{let p=n;while(p?.parent_id){if(p.parent_id===current.id)return true;p=findNode(p.parent_id);}return false;})()),body=modal('删除任务');body.append(el('p',`将删除“${current.label}”${descendants.length?`及其 ${descendants.length} 项子任务`:''}。此操作会生成新的版本快照。`,'delete-warning'));button(body,'取消',()=>$('#dialog').close());button(body,'确认删除',async()=>{const parent=current.parent_id;await mutate({type:'remove',id:current.id});state.focus=parent&&findNode(parent)?parent:state.plan.nodes[0]?.id??null;$('#dialog').close();render();},'danger-btn');
}
function editNode(child=false){
 if(!state.plan)return create();if(state.historical)throw Error('历史快照只读');
 const old=!child?state.plan.nodes.find(n=>n.id===state.focus):null,body=modal(old?'编辑任务':child?'新建子任务':'新建任务');
 const name=field(body,'任务名称','input',old?.label??'新任务'),text=field(body,'任务原文（不会执行其中的业务指令）','textarea',old?.text??'');
 const upload=field(body,'或上传 UTF-8 文本');upload.type='file';upload.accept='.txt,.md';upload.onchange=async()=>{try{text.value=await upload.files[0].text();}catch(e){error(e);}};
 let parent,basis;if(child){parent=field(body,'直属父任务','select');for(const n of state.plan.nodes)parent.add(new Option(n.label,n.id));parent.value=state.focus==='combo'?state.plan.nodes[0]?.id:state.focus;basis=field(body,'父子关系依据（可写明原文中的父任务称呼）','input',`用户确认：原文中的“${findNode(parent.value)?.label}”是当前父任务。`);parent.onchange=()=>basis.value=`用户确认：原文中的“${findNode(parent.value)?.label}”是当前父任务。`;}
 let context=null;if(child||old?.parent_id){context=field(body,'需要父任务原文解释“上述文件”等指代');context.type='checkbox';context.checked=old?.context_mode==='PARENT';body.append(el('p','只在子任务确有指代时启用；系统会自动绑定对应父任务版本。','small'));}
 button(body,'保存',async()=>{
  const label=name.value.trim(),source=text.value.trim();if(!label)throw Error('请填写任务名称');if(!source)throw Error('请填写任务原文或上传文本文件');
  const command=old?{type:'edit',id:old.id,label,text:source,context_mode:context?.checked?'PARENT':'NONE'}:{type:'add',id:'T-'+crypto.randomUUID().slice(0,8),label,text:source,parent_id:child?parent.value:null,parent_basis:child?basis.value:'',context_mode:context?.checked?'PARENT':'NONE'};
  await mutate(command);state.focus=command.id;$('#dialog').close();render();},'primary');
 if(old?.parent_id){
  const move=field(body,'迁移到其他父任务','select');for(const n of state.plan.nodes.filter(n=>n.id!==old.id))move.add(new Option(n.label,n.id));move.value=old.parent_id;
  button(body,'保存父子关系',async()=>{await mutate({type:'move',id:old.id,parent_id:move.value,parent_basis:'用户明确迁移'});$('#dialog').close();});
 }
}
function settings(){
 if(!state.plan)throw Error('请先新建任务');const body=modal('模型与字典设置'),s=state.plan.settings;
 const model=field(body,'模型','select');const catalog=state.session.model_catalog;const models=catalog.models??[];
 for(const m of models){const id=typeof m==='string'?m:m.id??m.slug??m.model;if(id)model.add(new Option(id,id));}if(![...model.options].some(o=>o.value===s.model))model.add(new Option(s.model,s.model));model.value=s.model;
 const reasoning=field(body,'推理强度','select');for(const v of ['low','medium','high','xhigh'])reasoning.add(new Option(v,v));reasoning.value=s.reasoning;
 const method=field(body,'解析方式','select');method.add(new Option('Skill','SKILL'));method.add(new Option('skill1','SKILL1'));method.value=s.parse_method;
 const packs=state.session.dictionary_catalog.packs??state.session.dictionary_catalog;
 const selections={};for(const layer of ['L2','L3']){const select=field(body,layer+' 字典','select');select.add(new Option('不启用',''));for(const p of Array.isArray(packs)?packs:[])if(p.layer===layer)select.add(new Option(p.label??p.id,p.id));select.value=s.dictionaries?.[layer.toLowerCase()]??'';selections[layer.toLowerCase()]=select;}
 button(body,'保存配置',async()=>{await mutate({type:'settings',settings:{model:model.value,reasoning:reasoning.value,parse_method:method.value,dictionaries:Object.fromEntries(Object.entries(selections).map(([k,v])=>[k,v.value||null]))}});$('#dialog').close();},'primary');
 body.append(el('p','配置参与结果身份；不同配置的结果不会当成同版缓存。仅保存不调用模型。','small'));
}
function relations(){
 if(!state.plan)return;const body=modal('有来源的保留工作与执行依赖');body.append(el('p','勾选父任务仍承担的原文条款。选择只登记规划，不自动证明该条款已经执行。','small'));const retained=[];
 for(const n of state.plan.nodes.filter(n=>state.plan.nodes.some(c=>c.parent_id===n.id)))for(const c of n.result?.boundary?.clauses??[]){const label=el('label'),cb=el('input');cb.type='checkbox';cb.checked=state.plan.retained.some(r=>r.node_id===n.id&&r.clause_id===c.id);label.append(cb,document.createTextNode(n.label+' · '+c.text));body.append(label);retained.push({cb,node_id:n.id,clause_id:c.id,basis:c.evidence[0]?.quote??''});}
 body.append(el('h3','交接、前置与共享关系'),el('p','这些关系不会改变任务的父子归属。填写支持该关系的原文或明确规划依据。','small'));
 const list=el('div'),rows=[];body.append(list);
 const addRelation=(d={})=>{const box=el('fieldset');list.append(box);const from=field(box,'来自任务','select'),to=field(box,'关联任务','select');for(const n of state.plan.nodes){from.add(new Option(n.label,n.id));to.add(new Option(n.label,n.id));}from.value=d.from??state.plan.nodes[0]?.id;to.value=d.to??state.plan.nodes[1]?.id;const kind=field(box,'关系','select');for(const [v,t]of [['handoff','报告交接'],['prerequisite','前置条件'],['shared_resource','共享资源'],['exclusion','互斥分支']])kind.add(new Option(t,v));kind.value=d.kind??'handoff';const basis=field(box,'原文或规划依据','input',d.basis??'');const row={from,to,kind,basis,removed:false};rows.push(row);button(box,'移除此关系',()=>{row.removed=true;box.remove();});};
 for(const d of state.plan.dependencies)addRelation(d);button(body,'添加关系',()=>addRelation());
 button(body,'保存保留工作与依赖',async()=>{await mutate({type:'relations',retained:retained.filter(r=>r.cb.checked).map(({cb,...r})=>r),dependencies:rows.filter(r=>!r.removed).map(r=>({from:r.from.value,to:r.to.value,kind:r.kind.value,basis:r.basis.value}))});$('#dialog').close();},'primary');
}
async function start(kind){
 if(!state.plan?.nodes.length)throw Error('请先录入原文');if(state.historical)throw Error('历史快照不可启动请求');
 const missing=state.plan.nodes.filter(n=>!n.result),treeCompare=kind==='generate'&&state.plan.mode==='TREE'&&state.plan.nodes.some(n=>n.parent_id)&&(!state.plan.comparison||state.plan.comparison_stale);
 if(kind==='generate'){
  const j=await api(base()+'/jobs',{kind,request_id:crypto.randomUUID()});state.jobs.push(j);render();return;
 }
 const body=modal(kind==='review_compare'?'重新独立审阅已有比较':'比较当前规划');
 body.append(el('p',kind==='review_compare'?'复用已保存的任务边界与比较候选，仅调用一次新的独立审阅，不重新编译全部任务。':'比较使用已保存的任务边界及原文。语义映射与独立审阅通常共2次请求；已有同版比较直接复用。'));
 button(body,'开始',async()=>{const j=await api(base()+'/jobs',{kind,request_id:crypto.randomUUID()});state.jobs.push(j);$('#dialog').close();render();},'primary');
}
function findNode(id){return state.plan?.nodes.find(n=>n.id===id);}
function source(ref){const n=findNode(ref.node_id),c=n?.result?.boundary?.clauses.find(c=>c.id===ref.clause_id);if(!n||!c)return;const body=modal(n.label+' · 原文 v'+n.version),info=el('p',undefined,'small'),p=el('div',undefined,'source-text'),chars=[...n.text],select=el('div',undefined,'actions');body.append(select,info,p);const show=q=>{p.replaceChildren();info.textContent=q?`来源位置 [${q.span.join(', ')}) · Unicode 字符 · 原换行保留`:'来源未绑定';if(q)p.append(document.createTextNode(chars.slice(0,q.span[0]).join('')),el('mark',chars.slice(...q.span).join('')),document.createTextNode(chars.slice(q.span[1]).join('')));else p.textContent=n.text;};c.evidence.forEach((q,i)=>button(select,'来源 '+(i+1),()=>show(q)));show(c.evidence[0]);}
function clauseBox(c,nodeId,parent=false){const box=el('div',undefined,'comparison-box'+(c.axes.includes('B')?' contains-prohibition':'')),labels={I:'输入范围',O:'产物交付',A:'动作',P:'责任主体',R:'额度与时间',V:'版本依据',C:'完成与停止',B:'+1 禁止边界'},tags=el('div',undefined,'clause-tags');if(state.comparison||parent)box.append(el('div',(parent?'上级任务：':'任务：')+(findNode(nodeId)?.label??nodeId),'box-label'));for(const a of c.axes)tags.append(el('span',labels[a]??a,a==='B'?'clause-tag boundary-b':'clause-tag'));box.append(tags,el('div',c.text,'clause-text'));const foot=el('div',undefined,'clause-footer');button(foot,'查看原文依据',()=>source({node_id:nodeId,clause_id:c.id}),'evidence-link');const ref=el('small','条款 '+c.id,'clause-ref');ref.title='内部引用编号，用于追溯；不表示评分或优先级。';foot.append(ref);box.append(foot);return box;}
function displayedFindings(){const r=state.plan?.comparison?.comparison;return (r?.findings??[]).filter(f=>state.focus==='combo'||f.child_refs?.some(x=>x.node_id===state.focus)||f.target_node_ids?.includes(state.focus)||f.target_node_id===state.focus||f.parent_refs?.some(x=>x.node_id===state.focus));}
function axisStates(){
 if(state.comparison&&state.plan?.mode==='TREE'){
  if(state.plan.comparison_stale)return Object.fromEntries(AXES.map(a=>[a,'STALE']));
  if(!state.plan.comparison)return Object.fromEntries(AXES.map(a=>[a,'NOT_RUN']));
  const fs=displayedFindings(),priority=['VIOLATED','UNRESOLVED','PENDING_COVERAGE','COMPATIBLE','INHERITED','VERIFIED','NOT_APPLICABLE'];
  return Object.fromEntries(AXES.map(a=>[a,priority.find(s=>fs.some(f=>f.axes.includes(a)&&f.status===s))??'NOT_APPLICABLE']));
 }
 const n=findNode(state.focus);return n?.status==='STALE'?Object.fromEntries(AXES.map(a=>[a,'STALE'])):n?.axes??Object.fromEntries(AXES.map(a=>[a,'NOT_RUN']));
}
const svg=(name,attrs={},text)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',name);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;return n;};
const point=(i,r)=>{const a=(i*45-90)*Math.PI/180;return [380+Math.cos(a)*r,300+Math.sin(a)*r];};
function radar(){
 const root=$('#radar');root.replaceChildren(svg('title',{},'7+1 边界状态'),svg('desc',{},'离散状态示意，不是评分或授权面积。'));
 const defs=svg('defs'),pattern=svg('pattern',{id:'boundaryGapHatch',patternUnits:'userSpaceOnUse',width:7,height:7,patternTransform:'rotate(35)'});pattern.append(svg('line',{x1:0,y1:0,x2:0,y2:7,stroke:'#8998af','stroke-width':2}));defs.append(pattern);root.append(defs);
 for(const r of [100,150,200,250])root.append(svg('polygon',{points:AXES.map((_,i)=>point(i,r).join(',')).join(' '),fill:r===150?'#f7faff':'none',stroke:'#eaf0f8'}));
 AXES.forEach((a,i)=>{const [x,y]=point(i,250);root.append(svg('line',{x1:380,y1:300,x2:x,y2:y,stroke:a==='B'?'#a18bc8':'#e7edf6','stroke-width':a==='B'?2:1,'stroke-dasharray':a==='B'?'5 4':''}));});
 if(state.plan?.mode==='TREE'&&state.plan.nodes.length>1)root.append(svg('polygon',{points:AXES.map((_,i)=>point(i,200).join(',')).join(' '),fill:'none',stroke:'#8198b8','stroke-dasharray':'5 6','stroke-width':1.5}));
 const states=axisStates(),coords=AXES.map((a,i)=>point(i,RADII[states[a]]??200));
 if(state.comparison||state.focus==='combo')AXES.forEach((a,i)=>{if(!['VIOLATED','PENDING_COVERAGE'].includes(states[a]))return;const vertices=[point(i-.38,175),point(i-.38,250),point(i+.38,250),point(i+.38,175)],bad=states[a]==='VIOLATED';root.append(svg('polygon',{points:vertices.map(p=>p.join(',')).join(' '),fill:bad?'#fbe0e5':'url(#boundaryGapHatch)',stroke:bad?'#df4f61':'#a5b1c2','stroke-width':1}));});
 const plot=(ss,col,opacity)=>{const ps=AXES.map((a,i)=>point(i,RADII[ss[a]]??200));for(let i=0;i<8;i++){const j=(i+1)%8,a=AXES[i],b=AXES[j],u=uncertain(ss[a])||uncertain(ss[b]);root.append(svg('line',{x1:ps[i][0],y1:ps[i][1],x2:ps[j][0],y2:ps[j][1],stroke:color(ss[a],col),'stroke-width':opacity===1?2.8:1.5,'stroke-opacity':opacity,'stroke-dasharray':u?'4 5':''}));}AXES.forEach((a,i)=>root.append(svg('circle',{cx:ps[i][0],cy:ps[i][1],r:opacity===1?5:3,fill:uncertain(ss[a])?'white':color(ss[a],col),stroke:color(ss[a],col),'stroke-width':2,opacity})));};
 if(state.plan?.mode==='TREE')for(const n of state.plan.nodes)if(n.id!==state.focus&&state.visible[n.id]!==false&&n.result)plot(n.axes,'#8b9fbd',.23);
 if(state.visible[state.focus]!==false)plot(states,'#3267eb',1);
 root.append(svg('circle',{cx:380,cy:300,r:66,fill:'white',stroke:'#e7edf7'}),svg('text',{x:380,y:295,'text-anchor':'middle',fill:'#294362','font-size':16,'font-weight':700},state.focus==='combo'?'Σ 当前组合':'本任务 7+1'),svg('text',{x:380,y:320,'text-anchor':'middle',fill:'#8e9fb4','font-size':10},state.comparison?'边界比较':'原文边界 · 非执行结果'));
 AXES.forEach((a,i)=>{const [x,y]=point(i,275),s=states[a],isB=a==='B',title=isB?'+1 · B 禁止边界':a+' '+NAMES[i],g=svg('g',{tabindex:0,role:'button','aria-label':title+' '+LABELS[s]});g.append(svg('rect',{x:x-77,y:y-22,width:154,height:48,rx:10,fill:isB?'#f5effb':state.axis===a?'#edf3ff':'transparent',stroke:isB?'#ad94cf':'none'}),svg('text',{x,y:y-2,'text-anchor':'middle',class:'axis-label',fill:isB?'#705097':color(s)},title),svg('text',{x,y:y+16,'text-anchor':'middle',class:'axis-status',fill:color(s)},LABELS[s]));g.onclick=()=>measure(()=>{state.axis=a;radar();details();});g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();g.onclick();}};root.append(g);});
 let bLegend=$('#independentBoundary');if(!bLegend){bLegend=el('button',undefined,'independent-boundary');bLegend.id='independentBoundary';bLegend.type='button';bLegend.onclick=()=>{state.axis='B';radar();details();};$('.chart-legend').after(bLegend);}bLegend.replaceChildren(el('strong','+1 · B 独立禁止边界'),el('span','七项任务维度之外，单独核对禁止条款。点击查看原文与依据。'),el('small',LABELS[states.B]??'尚未核验'));bLegend.setAttribute('aria-pressed',String(state.axis==='B'));
 const legend=$('.chart-legend');legend.replaceChildren();for(const [kind,label]of [...(state.plan?.mode==='TREE'?[['parent','父任务基线']]:[]),['current',state.comparison?'当前子任务 / 组合':'本任务边界'],['conflict','已确认越界 / 冲突'],['gap','待覆盖缺口'],['unknown','未明示 / 未决']]){const item=el('span',undefined,'legend-item');item.append(el('i',undefined,'legend-symbol '+kind),el('span',label));legend.append(item);}
}
function details(){
 const container=$('#detail');container.replaceChildren();$('#detailAxis').textContent=state.axis==='B'?'+1 · B 独立禁止边界':state.axis+' '+NAMES[AXES.indexOf(state.axis)];$('#detailAxis').classList.toggle('boundary-b',state.axis==='B');
 $('.coverage-card').hidden=state.plan?.mode!=='TREE';const warning=$('.source-warning');if(!warning.dataset.compact){const copy=warning.textContent;warning.replaceChildren();const disclosure=el('details');disclosure.append(el('summary','模型与程序的职责说明'),el('p',copy));warning.append(disclosure);warning.dataset.compact='true';$('#historyDetails').append(warning);}
 if(state.comparison&&state.plan?.comparison_stale)container.append(el('p','这是旧版比较。程序可以复算其操作数；更新后的语义审阅尚未完成，不能当作新版已核验。','pending'));
 const n=findNode(state.focus);
 if(n){container.append(el('h3',n.label));const actions=el('div',undefined,'actions');button(actions,'当前任务边界',()=>{state.comparison=false;render();});if(n.parent_id)button(actions,'与父任务比较',()=>{state.comparison=true;render();});container.append(actions);}
 if(state.comparison||state.focus==='combo'){
  const fs=displayedFindings().filter(f=>f.axes.includes(state.axis)&&(!$('#diffOnly').checked||['VIOLATED','UNRESOLVED','PENDING_COVERAGE'].includes(f.status)));
  if(!state.plan?.comparison)container.append(el('p','尚未运行同版规划比较。生成边界不等于规划已核验。','empty'));
  for(const f of fs){const box=el('section',undefined,'result-box '+(f.status==='VIOLATED'?'bad-box':['UNRESOLVED','PENDING_COVERAGE'].includes(f.status)?'pending-box':''));box.append(el('b',f.id+' · '+(LABELS[f.status]??f.status)),el('p',f.reason),el('div','依据：'+(BASIS[f.basis]??f.basis),'small'));if(f.model_reason&&f.model_reason!==f.reason)box.append(el('p','生成模型的判断：'+f.model_reason));for(const [isParent,refs]of [[true,f.parent_refs],[false,f.child_refs]])for(const r of refs??[]){const c=findNode(r.node_id)?.result?.boundary?.clauses.find(c=>c.id===r.clause_id);if(c)box.append(clauseBox(c,r.node_id,isParent));}if(f.operands||f.counterexamples){const d=el('details'),s=el('summary','操作数与程序复算');d.append(s,el('pre',JSON.stringify({operation:f.operands,calculation:f.operand_calculation,method:f.method,counterexamples:f.counterexamples,total:f.total,limit:f.limit,outside:f.outside},null,2)));if(f.operand_calculation?.semantic_mapping_confirmed===false)d.append(el('p','上述数学结果仅针对所列操作数；语义对应仍有审阅分歧。','pending'));box.append(d);}container.append(box);}
  if(!fs.length&&state.plan?.comparison)container.append(el('p','本维度没有关联比较项；不作为全文通过。','small'));
 }else{
  for(const c of n?.result?.boundary?.clauses??[])if(c.axes.includes(state.axis))container.append(clauseBox(c,n.id));
  if(!n?.result)container.append(el('p','当前任务尚未编译。','empty'));
  else{
   if(n.result.boundary.unstated_axes.includes(state.axis))container.append(el('p','原文未明示。不是无限授权，也不是识别失败。','small'));
   for(const issue of n.result.boundary.issues)container.append(el('p','程序来源检查：'+issue.code,'pending'));
   for(const issue of n.result.boundary.uncertainties??[])container.append(el('p','模型保留的疑点：'+(typeof issue==='string'?issue:JSON.stringify(issue)),'pending'));
   for(const issue of n.result.review?.issues??[])container.append(el('p','独立审阅：'+issue.reason,'pending'));
   const review=el('details');review.append(el('summary','独立审阅与生成记录'),el('pre',JSON.stringify(n.result.review,null,2)));container.append(review);
  }
 }
}
function renderTree(){
 const root=$('#tree'),showLayers=state.plan?.mode==='TREE';root.replaceChildren();const walk=parent=>{const ul=el('ul');for(const n of state.plan?.nodes.filter(n=>n.parent_id===parent)??[]){const li=el('li'),row=el('div',undefined,'tree-row '+(n.id===state.focus?'active':'')),b=el('button',undefined,'tree-select');b.append(el('b',n.label),el('small','v'+n.version+' · '+(LABELS[n.status]??n.status)));b.onclick=()=>measure(()=>{state.focus=n.id;state.comparison=false;render();});row.append(b);if(showLayers){const eye=button(row,state.visible[n.id]===false?'◌':'◉',()=>measure(()=>{state.visible[n.id]=state.visible[n.id]===false;render();toast('只切换图层；比较结果未改变');}),'eye');eye.setAttribute('aria-label','显示或隐藏 '+n.label);eye.setAttribute('aria-pressed',String(state.visible[n.id]!==false));}li.append(row,walk(n.id));ul.append(li);}return ul;};root.append(walk(null));
}
function measure(fn){const start=performance.now();fn();const measurement={operation:'cached_ui',render_ms:performance.now()-start,elapsed_ms:null,measurement:'handler_to_second_animation_frame'};state.perf.push(measurement);requestAnimationFrame(()=>requestAnimationFrame(()=>measurement.elapsed_ms=performance.now()-start));}
function render(){
 const p=state.plan,n=findNode(state.focus),tree=p?.mode==='TREE',r=p?.comparison?.comparison;
 $('#taskSidebar').hidden=false;$('#workspace').classList.remove('single-layout');$('#treeStructure').hidden=!tree;$('#treePlanning').hidden=!tree;$('#leftNote').hidden=!tree;
 $('#modeLabel').textContent=tree?'父子任务':'单任务';$('#eyebrow').textContent=tree?'父任务 × 子任务':'单任务文本';$('#nodeCount').textContent=(p?.nodes.length??0)+' 项任务';$('#currentFocus').textContent=state.focus==='combo'?'父子任务总览':n?.label??'未选任务';$('#sourceVersion').textContent=n?'原文 v'+n.version:'—';$('#snapshotLabel').textContent=p?'快照 '+p.revision+(state.historical?' · 历史只读':' · 当前'):'';$('#planState').textContent=p?.planning==='COMPLETE'?'完整提交':'规划中';$('#comboBtn').hidden=!tree;$('#comboBtn').classList.toggle('active',state.focus==='combo');$('#completeBtn').hidden=!tree;$('#compareBtn').hidden=!tree;$('#relationsBtn').hidden=!tree;$('#editBtn').disabled=!n||state.historical;$('#deleteBtn').disabled=!n||state.historical;
 const hasTasks=!!p?.nodes.length;
 $('#generateBtn').textContent='开始编译';$('#generateBtn').disabled=!hasTasks||state.historical;$('#compareBtn').disabled=!p?.nodes.some(n=>n.parent_id)||state.historical;
 $('#reviewCompareBtn').hidden=!tree;$('#recalculateBtn').hidden=!tree;$('#reviewCompareBtn').disabled=!p?.comparison||state.historical;$('#recalculateBtn').disabled=!p?.comparison||state.historical;
 $('#statusBanner').textContent=state.comparison?LABELS[r?.status]??'等待规划比较':n?.result?'当前任务边界已保存 · 独立审阅见右侧':'录入原文后开始编译';$('#retainedText').textContent=p?.retained.length?p.retained.map(x=>findNode(x.node_id)?.label+' / '+x.clause_id).join('、'):'尚未登记';
 const defects=r?.findings.filter(f=>f.status==='VIOLATED')??[],open=r?.findings.filter(f=>['UNRESOLVED','PENDING_COVERAGE'].includes(f.status))??[];$('#issueCount').textContent=r?String(defects.length)+' 项已确认越界':'—';$('#coverageText').textContent=r?`未决或待覆盖 ${open.length} 项；相容或已验证 ${r.findings.filter(f=>['VERIFIED','COMPATIBLE','INHERITED'].includes(f.status)).length} 项。只要仍有未决，就不能判定“无越界”。`:tree?'父子及组合比较尚未运行。':'单任务没有父基线，不显示比较通过。';
 const running=state.jobs.find(j=>['QUEUED','RUNNING'].includes(j.status)),last=latestJob();$('#cancelBtn').disabled=!running;$('#cancelBtn').hidden=!running;$('#jobStatus').textContent=running?`进行中 · ${STAGE_LABELS[running.progress?.stage]??running.progress?.stage??running.kind} · ${running.request_count} 次请求`:last?`最近任务：${last.status==='COMPLETED'?'已完成':last.status} · ${last.request_count} 次请求`:'未开始生成';
 const steps=$('#steps');steps.replaceChildren();for(const s of state.snapshots){const b=el('button',undefined,'step '+(s.revision===p?.revision?'active':'')),name={add:'添加任务',edit:'编辑任务',settings:'修改运行设置',remove:'删除任务',planning:'修改规划状态',dependencies:'修改依赖关系',retained:'修改保留工作'}[s.label]??s.label.replace(/^生成 /,'保存边界结果 · ');b.append(el('b','v'+s.revision+' '+name),el('small',new Date(s.saved_at).toLocaleString()));b.title='只读回看此时的任务、设置和结果，不重新调用模型';b.onclick=()=>load(p.project_id,s.revision).catch(error);steps.append(b);}
 $('.timeline>.small').textContent='v 表示任务记录编号，不是软件版本或模型调用次数。点击只读回看当时的原文、设置与结果；返回当前版本继续操作。';
 const ledger=$('#ledger');ledger.replaceChildren();ledger.append(el('p','此处列出这份任务的历次运行，最新在前。请求数按已保存回执统计；零条记录不代表已证明没有调用。','small'));
 const statusName=s=>({COMPLETED:'已完成',FAILED:'失败',INTERRUPTED:'已中断',RUNNING:'运行中',QUEUED:'排队中',CANCELLED:'已取消',UNRESOLVED:'含未决项'}[s]??s);
 for(const j of [...state.jobs].sort((a,b)=>String(b.started_at).localeCompare(String(a.started_at)))){
  const card=el('article',undefined,'ledger-run'),kind={generate:'边界生成与审阅',compare:'父子任务比较',review_compare:'重新审阅比较'}[j.kind]??j.kind;
  const reused=j.status==='COMPLETED'&&j.entries?.length>0&&j.entries.every(e=>e.cache_hit===true);
  card.append(el('strong',`${kind} · ${statusName(j.status)}`),el('div',`${new Date(j.started_at).toLocaleString()} · ${j.request_count>0?'已记录 '+j.request_count+' 次请求':reused?'复用已保存结果 · 未新增模型请求':'请求账本记录为 0 次（不能据此确认未调用）'}`,'small'));
  for(const e of j.entries??[]){const interrupted=['INTERRUPTED','CANCELLED','FAILED'].includes(j.status)&&['RUNNING','QUEUED'].includes(e.status),name=e.node_id?(findNode(e.node_id)?.label??'历史任务（'+e.node_id+'）'):'父子组合';card.append(el('p',`${name} · ${interrupted?'运行已结束，子记录未收尾':statusName(e.status)}${e.source_version!=null?' · 原文 v'+e.source_version:''}`));
   for(const c of e.calls??[]){card.append(el('div',`${c.phase==='GENERATE'?'LLM 生成／比较':'独立审阅'} · ${c.elapsed_ms==null?'耗时回执不可用':(c.elapsed_ms/1000).toFixed(1)+' 秒'} · 已记录 ${c.count} 次请求`,'small'));
    if(c.usage){const usage=el('details'),names={input_tokens:'输入 Token',cached_input_tokens:'缓存命中 Token',cache_write_input_tokens:'缓存写入 Token',output_tokens:'输出 Token',reasoning_output_tokens:'推理输出 Token'};usage.append(el('summary','查看 Token 用量'));for(const [key,value] of Object.entries(c.usage))usage.append(el('div',`${names[key]??key}：${value}`,'small'));card.append(usage);}else card.append(el('div','Token 用量回执不可用','small'));
   }
  }
  if(j.error){card.append(el('p',j.error==='MODEL_REQUEST_BUDGET_EXHAUSTED'?'本次运行达到请求预算上限，已停止。':j.error,'bad'));}ledger.append(card);
 }
 renderTree();renderProcess();radar();renderMath();details();
}
button($('#compareBtn').parentElement,'重新独立审阅比较',()=>start('review_compare')).id='reviewCompareBtn';
button($('#compareBtn').parentElement,'程序复算 · 0调用',async()=>{state.plan=await api(base(),{revision:state.plan.revision,command:{type:'recalculate'}});await load(state.plan.project_id);}).id='recalculateBtn';
for(const id of ['compareBtn','reviewCompareBtn','recalculateBtn','cancelBtn'])$('.task-command-actions').append($('#'+id));
action('#newBtn',newTask);action('#editBtn',()=>editNode());action('#deleteBtn',deleteTask);action('#settingsBtn',settings);action('#relationsBtn',relations);
action('#generateBtn',()=>start('generate'));action('#compareBtn',()=>start('compare'));
action('#comboBtn',()=>measure(()=>{state.focus='combo';state.comparison=true;render();}));
action('#completeBtn',()=>mutate({type:'planning',value:state.plan.planning==='COMPLETE'?'OPEN':'COMPLETE'}));
action('#latestBtn',()=>state.plan&&load(state.plan.project_id));
action('#cancelBtn',async()=>{const j=state.jobs.find(j=>['RUNNING','QUEUED'].includes(j.status));if(j){await api('/api/workbench/jobs/'+j.id+'/cancel',{});toast('已请求停止；远端终止状态以回执为准');}});
action('#exportMdBtn',()=>{if(!state.plan)throw Error('暂无保存结果');download(`${state.plan.project_id}-v${state.plan.revision}-REPORT.zh-CN.md`,markdownReport(),'text/markdown;charset=utf-8');toast('Markdown 报告已导出 · 0 次模型请求');});
action('#exportBtn',()=>{if(!state.plan)throw Error('暂无保存结果');const payload={plan:state.plan,jobs:state.jobs,display:{focus:state.focus,axis:state.axis,visible:state.visible,state_mapping_version:'radar-status/1',radii:RADII,geometry_is_not_judgment:true},cached_interactions:state.perf,business_decision:null,execution_authorization:null};download(state.plan.project_id+'-v'+state.plan.revision+'.json',JSON.stringify(payload,null,2),'application/json');});
$('#projectSelect').onchange=e=>{if(e.target.value)load(e.target.value).catch(error);};$('#diffOnly').onchange=()=>{state.comparison=true;render();};
async function poll(){try{if(state.plan&&!state.historical){const js=await api(base()+'/jobs'),was=state.jobs.some(j=>['RUNNING','QUEUED'].includes(j.status)),running=js.some(j=>['RUNNING','QUEUED'].includes(j.status));state.jobs=js;if(was||running){state.plan=await api(base());state.snapshots=await api(base()+'/snapshots');const completed=was&&!running?js.at(-1):null;if(completed?.status==='COMPLETED'&&completed.entries?.some(e=>e.node_id===null)&&state.plan.comparison){state.focus='combo';state.comparison=true;toast('父子规划比较完成，已显示越界结论');}render();}}}catch(e){error(e);}finally{setTimeout(poll,2000);}}
try{state.session=await api('/api/session');$('#productVersion').textContent=state.session.product_snapshot?.product_version?.match(/ui\.?\d+/)?.[0].replace('.','')??'开发候选';$('#runtimeLabel').textContent='BoundX / 工作台候选';await refreshList();const last=localStorage.getItem('boundx-workbench-project');if(last&&[...$('#projectSelect').options].some(o=>o.value===last))await load(last);else render();poll();}catch(e){error(e);}
