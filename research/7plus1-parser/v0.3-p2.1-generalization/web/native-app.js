import {renderCompilerProcess, renderModelInfo, factText, readable, sourceLength,renderReportText} from '/process-view.js';
import {MAX_SOURCE_BYTES} from '/input-limits.js';
import {renderBoundaryCalculations} from '/calculation-view.js';
import {boundaryRuleRows} from '/direct-ir-process.js';
const $=id=>document.getElementById(id);
const names={I:'输入与作用域',O:'交付与结果',A:'正向动作',P:'参与关系',R:'执行量化限制',V:'版本与依据',C:'完成与停止',B:'禁止与限制'};
const stages={QUEUED:'等待',PREPARING:'准备与版本核对',PARSING:'Codex 正在解析原文',AUDITING:'新会话正在审阅',VALIDATING:'技术校验',COMPILING:'保真编译',CALCULATING:'程序正在计算边界',COMPLETED:'编译流程完成',COMPLETED_WITH_UNRESOLVED:'编译流程完成 · 含未决/缺口',FAILED:'运行失败',CANCELLING:'取消中（等待本地子进程退出）',CANCELLED:'本地请求已取消（不声称云端停止计费）',INTERRUPTED:'服务中断 · 未自动重跑'};
const directTrace=r=>['DECLARATIVE_BOUNDARY','LLM_DIRECT_CANDIDATE_IR','LLM_IR_AND_BOUNDARY_CALCULATION'].includes(r?.pipeline);
const errors={EMPTY_SOURCE:'请输入非空任务',SOURCE_BYTE_LIMIT:'原文容量超过1 MiB，不会截断',INVALID_UTF8:'文件不是有效UTF-8',CODEX_LOGIN_REQUIRED:'Codex 登录失效，请在本机重新登录',CODEX_QUOTA_OR_RATE_LIMIT:'Codex 额度或限流，未自动重试',CODEX_TIMEOUT:'本地调用超时，子进程已停止',CODEX_NETWORK_FAILURE:'网络调用失败',CODEX_MODEL_UNAVAILABLE:'请求模型不可用',COMPILER_BUSY:'已有编译正在进行',SESSION_REQUIRED:'页面会话失效，请刷新',COMPILER_ERROR:'编译失败，详情保存在本地运行目录'};
Object.assign(errors,{COMPACT_WIRE_CONTRACT_FAILURE:'模型响应未通过结构或引用检查，原响应已保存，未自动重跑',PATCH_GLOBAL_ID_COLLISION:'局部修订引入重复编号，未接受该修订',IDENTITY_RESERVED_ID:'候选节点使用了保留编号 ROOT，未接受该候选',MODEL_REQUEST_BUDGET_EXHAUSTED:'本次有界请求数已用完，已保留结果与缺口'});
let current=null,uploaded=null,session=null,pollTimer=null,busy=false,tab='pending';
errors.DIRECT_IR_TECHNICAL_REJECTED='候选IR未通过技术校验；具体字段和错误见过程区，后续计算未启动';
const settingLabels={low:'低 · 较少推理',medium:'中 · 默认',high:'高 · 更深入',xhigh:'很高',max:'最高'};
function configureModels(){
 document.querySelector('.model-settings summary').textContent='本次运行的模型与会话记录';
 const box=el('fieldset',undefined,'compile-settings');box.id='compile-settings';box.append(el('legend','本次编译设置'));
 const model=el('select');model.id='compile-model';model.setAttribute('aria-label','调用模型');
 const reasoning=el('select');reasoning.id='compile-reasoning';reasoning.setAttribute('aria-label','推理强度');
 const method=el('select');method.id='compile-method';method.setAttribute('aria-label','解析方式');
 for(const [value,label] of [['SKILL','Skill'],['SKILL1','skill1']]){const o=el('option',label);o.value=value;method.append(o);}
 for(const m of session.model_catalog?.models??[{id:session.requested_model,label:session.requested_model,reasoning:['medium']}]){const o=el('option',m.label);o.value=m.id;model.append(o);}
 const previous=JSON.parse(localStorage.getItem('boundx-compile-settings')??'null');model.value=[...model.options].some(o=>o.value===previous?.model)?previous.model:session.requested_model;
 method.value=[...method.options].some(o=>o.value===previous?.parse_method)?previous.parse_method:'SKILL';
 const selectors={};
 for(const [layer,label]of [['L2','行业字典 L2'],['L3','企业字典 L3']]){
  const select=el('select');select.id='compile-'+layer.toLowerCase();select.setAttribute('aria-label',label);const none=el('option','不启用');none.value='';select.append(none);
  for(const pack of session.dictionary_catalog??[]){if(pack.layer!==layer)continue;const o=el('option',pack.label);o.value=pack.id;select.append(o);}
  const old=previous?.dictionaries?.[layer.toLowerCase()];select.value=[...select.options].some(o=>o.value===old)?old:'';selectors[layer]=select;
 }
 const save=()=>localStorage.setItem('boundx-compile-settings',JSON.stringify({model:model.value,reasoning:reasoning.value,parse_method:method.value,dictionaries:{l2:selectors.L2.value,l3:selectors.L3.value}}));
 const update=()=>{const old=reasoning.value;reasoning.replaceChildren();const m=session.model_catalog?.models.find(x=>x.id===model.value);for(const level of m?.reasoning??['medium']){const o=el('option',settingLabels[level]??level);o.value=level;reasoning.append(o);}reasoning.value=[...reasoning.options].some(o=>o.value===old)?old:[...reasoning.options].some(o=>o.value==='medium')?'medium':reasoning.options[0]?.value;save();};
 const resourceInfo=el('p',undefined,'muted');resourceInfo.id='compile-resource-info';
 const waitInfo=el('p',session.model_wait_policy?.automatic_timeout_ms==null?'模型等待不设固定超时；可以手动取消。网络、登录及额度错误仍如实报告。':'模型等待上限：'+session.model_wait_policy.automatic_timeout_ms/1000+' 秒。','muted');box.append(waitInfo);
 const viewedInfo=el('p',undefined,'process-notice');viewedInfo.id='compile-viewed-settings';
 const describe=()=>updateResourceInfo();
 model.onchange=update;reasoning.onchange=save;method.onchange=()=>{save();describe();};const ml=el('label','调用模型 '),rl=el('label','推理强度 '),pl=el('label','解析方式 ');ml.append(model);rl.append(reasoning);pl.append(method);box.append(viewedInfo,pl,ml,rl,resourceInfo,el('p','解析和独立审阅使用本次选择的同一模型。列表来自本机Codex目录，实际调用仍须账号可用；不自动换模型。更换配置不继承原版语义验收。','muted'));$('input').insertAdjacentElement('afterend',box);
 for(const [layer,label]of [['L2','行业字典 L2 '],['L3','企业字典 L3 ']]){const l=el('label',label);l.append(selectors[layer]);selectors[layer].onchange=save;box.append(l);}
 box.append(el('p','生成与审阅按需查询同版字典，不整包加载。L2解释行业术语；L3解释本企业对象与别名。标注“虚构测试”的包不代表真实企业；字典不授予权限。','muted'));
 const actual=el('div');actual.id='dictionary-usage';box.append(actual);
 update();describe();if(previous?.model===model.value&&[...reasoning.options].some(o=>o.value===previous.reasoning)){reasoning.value=previous.reasoning;save();}updateViewedSettings();
}
function updateViewedSettings(){
 const box=$('compile-settings');if(!box)return;
 box.querySelector('legend').textContent=current?(busy?'本次运行设置（已锁定）':'下一次编译设置'):'本次编译设置';
 $('compile-viewed-settings').textContent=current?'当前查看记录实际使用：'+(current.parse_method==='MD'?'MD · r02（历史只读）':current.parse_method==='SKILL1'?'skill1 · semantics-first-r02':current.parse_method==='SKILL'?'Skill':'历史记录，模式以原始记录为准')+'；请求模型 '+(current.requested_model??'未记录')+'；推理 '+(current.requested_reasoning??'未记录')+(busy?'。':'。下方选择只影响下一次编译，不改变此记录。'):'选择Skill原版或skill1新规程进行对比；两者共用同版合同、Schema及计算核心。MD历史记录保持只读。';
 updateResourceInfo();
 if(session?.request_profile==='BOUNDARY_REPORT_R01'&&!current)$('compile-viewed-settings').textContent='Skill与skill1均已取消固定类型和输出Schema；两者分别加载生成Skill、审阅Skill，共用7+1方法。';
 const usage=$('dictionary-usage');if(usage){usage.replaceChildren();if(current){const selection=current.dictionaries??current.result?.dictionaries;usage.append(el('p','本条记录选择的字典：'+(selection?selection.packs.map(p=>p.layer+' '+p.label).join('；')||'未启用':'历史记录未记录字典选择')));
  const lookups=current.result?.dictionary_lookups;if(lookups){usage.append(el('p',`实际查阅：生成 ${lookups.parse.length} 次；审阅 ${lookups.audit.length} 次。选中不代表已查阅。`));
   for(const [phase,label]of [['parse','生成LLM'],['audit','审阅LLM']])for(const entry of lookups[phase]){const d=el('details');d.append(el('summary',`${label}查询“${entry.arguments?.query??''}”：${entry.error??('命中 '+entry.result.total+' 条')}`));for(const row of entry.result?.entries??[]){const v=row.value,title=v.display_name??v.surface??(typeof v.label==='string'?v.label:v.label?.['zh-CN'])??v.id??'词条';d.append(el('p',`${title} · ${row.pack_id} · ${row.path}${row.pointer}`));}usage.append(d);}
  }else usage.append(el('p',busy?'运行中；完成后显示实际字典查询记录。':'此记录没有字典查询回执。','muted'));}}
}
function updateResourceInfo(){
 const mode=$('compile-method')?.value,r=session?.comparison_resources?.[mode]?.selected_resources,target=$('compile-resource-info');if(!target)return;
 if(session.request_profile==='BOUNDARY_REPORT_R01'){target.textContent='LLM直接生成完整7+1边界与必要的简短计算，新会话独立审阅。无固定规则类型、输出Schema或自动证明展开。'+(r?'生成说明 '+r.parse.characters+' 字符；审阅说明 '+r.audit.characters+' 字符（另含原文及待审报告）。':'');return;}
 target.textContent=(session.request_profile==='DECLARATIVE_BOUNDARY_R01'?'LLM提取完整边界，新会话审阅；程序校验并生成同源7+1与确定值。不编执行安排。':['LLM_BOUNDARY_CALCULATION_R01','LLM_BOUNDARY_CALCULATION_R02','LLM_BOUNDARY_CALCULATION_R03'].includes(session.request_profile)?'LLM负责IR与完整边界计算，新会话独立审阅；程序校验、复核并展示结果差异。':session.request_profile==='DIRECT_CANDIDATE_IR_R01'?'直接候选IR：模型解释原文并输出可计算结构，新会话独立审阅；程序校验后形成7+1视图并计算，不另造语义IR。':'历史语义接口。')+(r?'解析正文资源 '+r.parse.characters+' 字符；审阅正文资源 '+r.audit.characters+' 字符（不含通道Schema及本次候选）。':'')+' 请求配置 '+(session.request_profile??'未记录')+'；完整产品语义验收状态另见版本详情。';
}
const el=(tag,value,cls)=>{const e=document.createElement(tag);if(value!==undefined)e.textContent=value;if(cls)e.className=cls;return e;};
function configureRuntimeVersion(){
 const p=session.product_snapshot;if(!p)return;
 const m=/^0\.1\.0-candidate\..*-ui\.(\d+)$/.exec(p.product_version);
 $('product-version').textContent=m?'v0.1.'+m[1]+' · 候选':p.product_version;
 const detail=el('details');detail.append(el('summary','版本详情'),el('p','完整运行版本：'+p.product_version+'；核心：'+p.compiler_revision+'；合同：'+p.contract));
 $('product-version').insertAdjacentElement('afterend',detail);
}
function resetViewedResult(){
 current=null;localStorage.removeItem('boundx029-active');localStorage.removeItem('boundx029-pending');
 for(const id of ['slots','panel','compiler-root','trace-root','trace-detail','pipeline','trace-colors','evidence','span-info','run-id'])$(id).replaceChildren();
 for(const id of ['export','export-json','trace-html','trace-md','trace-json'])$(id).disabled=true;
 $('status').textContent='原文已载入，等待编译';$('status').className='';$('v03-canonical-status').textContent='本次尚无最终结果';
 renderModelInfo($('model-info'),{},session);renderCompilerProcess($('compiler-root'),{},{session});updateViewedSettings();if($('calculation-root'))$('calculation-root').replaceChildren();
}
async function configureExamples(){
 const data=await api('/api/examples');if(!data.count)return;
 const box=el('fieldset',undefined,'compile-settings');box.append(el('legend','历史真实任务原文 · Gold60'));
 const select=el('select');select.id='source-example';select.setAttribute('aria-label','选择历史真实任务原文');
 for(const c of data.cases){const option=el('option',c.id+' · '+c.active_revision+' · '+c.codepoints+' 字符');option.value=c.id;select.append(option);}
 const button=el('button','载入原文','secondary');button.id='load-example';
 const status=el('p','只载入 ACTIVE 原文，不发送 Gold 答案、不自动启动模型。历史样本不等于本版语义验收通过。','muted');
 button.onclick=async()=>{if(busy)return;button.disabled=true;try{const c=await api('/api/examples/'+select.value);resetViewedResult();uploaded={filename:c.filename,base64:c.base64};$('input').value=c.text;count();status.textContent=c.id+' / '+c.active_revision+' · 已载入完整原文，'+c.codepoints+' 字符；SHA-256 '+c.source_sha256+'。点击开始编译才会调用模型。';}catch(e){showError(e);}finally{button.disabled=busy;}};
 box.append(select,button,status);$('input').insertAdjacentElement('beforebegin',box);
}
async function api(url,options={}){const response=await fetch(url,{...options,headers:{...options.headers,...(options.method?{'x-boundx-session':session?.token??''}: {})}});const data=await response.json();if(!response.ok)throw Error(data.error??data.code);return data;}
const jsonPost=(url,data)=>api(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
function count(){const info=sourceLength($('input').value);$('input-count').textContent=info.label;$('input-count').title=info.explanation;return info.count;}
function showError(e){$('status').textContent=errors[e.message]??e.message;$('status').className='failure';}
function highlight(sources){
 if($('source-evidence'))$('source-evidence').open=true;
 if(!current||!sources?.length)return;
 const chars=Array.from(current.source_text),spans=sources.filter(s=>s.source_sha256===current.source_sha256&&s.span&&Number.isInteger(s.span[0])&&s.span[0]>=0&&s.span[1]<=chars.length);
 if(!spans.length)return;
 const starts=new Set(spans.map(s=>s.span[0])),ends=new Set(spans.map(s=>s.span[1]));let text='',marked=null;const children=[];
 for(let i=0;i<=chars.length;i++){const active=spans.some(s=>i>=s.span[0]&&i<s.span[1]);if(active!==marked){if(text)children.push(marked?el('mark',text):document.createTextNode(text));text='';marked=active;}if(i<chars.length)text+=chars[i];}
 if(text)children.push(marked?el('mark',text):document.createTextNode(text));$('evidence').replaceChildren(...children);$('span-info').textContent=spans.map(s=>'['+s.span.join(', ')+') '+s.quote).join('；');
}
function record(value){$('panel').replaceChildren();$('panel').append(el('p',value.event||value.claim?factText(value,current?.result):value.note??value.reason??'查看本项来源与记录'));for(const s of value.sources??[]){if(!s.span)continue;const b=el('button','['+s.span.join(',')+') '+s.quote,'secondary');b.onclick=()=>highlight([s]);$('panel').append(b);}const detail=el('details');detail.append(el('summary','开发详情：原始JSON'),el('pre',JSON.stringify(value,null,2)));$('panel').append(detail);highlight(value.sources);}
function entry(f){
 if(directTrace(current.result)){const b=el('button',f.text,'entry');b.append(el('small',readable(f.status)+' · 查看原文来源'));b.onclick=()=>{const refs=new Set(f.source_refs);highlight(f.sources??(current.result.technical.source_links??current.result.ir.source_table).filter(s=>refs.has(s.id)));};return b;}
 const b=el('button',factText(f,current.result),'entry');
 b.append(el('small',readable(f.status)+' · 点击查看原文证据'));b.onclick=()=>record(f);return b;
}
function render(run){
 if(!$('boundary-summary')){const summary=el('section');summary.id='boundary-summary';$('compiler-root').parentElement.insertAdjacentElement('beforebegin',summary);}
 const boundarySummary=$('boundary-summary');boundarySummary.replaceChildren();
 if(run.request_profile==='DECLARATIVE_BOUNDARY_R01'){
  const trace=run.result,allFindings=trace?.problem_report?.findings??[],deferred=allFindings.filter(f=>f.code==='NODE_REVIEW_REQUIRED').length,findings=[...new Map(allFindings.filter(f=>f.code!=='NODE_REVIEW_REQUIRED').map(f=>[[f.code,f.node_id??f.id,f.requirement_id,f.problem].join('|'),f])).values()],ready=trace?.boundary_calculations?.status==='BOUNDARY_READY';
  boundarySummary.append(el('h2','本次边界结果'));
  boundarySummary.append(el('h3','1. ADMIN边界'),el('p',!trace?'正在提取与核对，尚无最终结果。':ready?'已建立边界结构；7+1及来源见下方，模型审阅不等于人工验收。':'已保存候选边界，仍有待修正问题；当前不能作为完整比较基准。'));
  if(trace?.boundary_declaration){
   const declarations=el('details');declarations.open=true;declarations.append(el('summary','LLM提取的边界（'+trace.boundary_declaration.rules.length+'条）'));
   for(const row of boundaryRuleRows(trace.boundary_declaration)){const p=el('p');p.append(el('strong',row.cells[0]+'：'),document.createTextNode(row.cells[1]+'；'+row.cells[2]));declarations.append(p);}boundarySummary.append(declarations);
  }
  boundarySummary.append(el('h3','2. 需要处理的问题'));
  if(!trace)boundarySummary.append(el('p','等待核对结果。'));else if(findings.length)for(const f of findings.slice(0,5)){const explanation={FREE_LOCAL_VARIABLE:'规则引用了未绑定的局部变量，程序无法确定它对应哪一次或哪一个对象',MODEL_REQUEST_BUDGET_EXHAUSTED:'本次运行的请求数保护已触发，局部修订未采用，首轮结果保留'}[f.code]??f.problem??f.code;boundarySummary.append(el('p',explanation+(f.node_id?'（'+f.node_id+'）':'')+(f.suggestion?'；建议：'+f.suggestion:'')));}else if(!deferred)boundarySummary.append(el('p','程序未列出问题；仍需核对是否忠实完整表达原文。'));
  if(deferred)boundarySummary.append(el('p',deferred+'条节点待核验记录不代表同样数量的独立语义错误；完整技术记录保留在详情中。'));
  if(findings.length>5)boundarySummary.append(el('p','另有'+(findings.length-5)+'项，展开处理过程查看全部。'));
  boundarySummary.append(el('h3','3. PM规划核验'),el('p','本次没有提交PM子任务，尚未核验。边界提取完成不代表PM拆分通过。'));
 }
 if(!$('calculation-root')){const root=el('div');root.id='calculation-root';$('slots').insertAdjacentElement('afterend',root);}
 $('calculation-root').dataset.runId=run.run_id??'';
 if(run.request_profile==='BOUNDARY_REPORT_R01')$('calculation-root').replaceChildren();else renderBoundaryCalculations($('calculation-root'),run.result,sources=>{highlight(sources);$('evidence').scrollIntoView({behavior:'smooth',block:'center'});},input=>jsonPost('/api/runs/'+run.run_id+'/observations',input));
 current=run;if(run.status==='LEGACY_READ_ONLY'){
  $('status').textContent='旧引擎历史 · 原格式只读；未提供本版五阶段记录';
  for(const id of ['slots','compiler-root','trace-root','trace-detail','pipeline','trace-colors','evidence','span-info','run-id'])$(id).replaceChildren();
  for(const id of ['export','export-json','trace-html','trace-md','trace-json'])$(id).disabled=true;
  $('trace-summary').textContent='旧记录不反推成新版编译过程。';$('v03-canonical-status').textContent='旧格式结果见原始快照。';
  $('model-info').replaceChildren(el('p','旧记录不继承上一条记录的模型与会话设置。'));
  $('panel').replaceChildren(el('p','保留原记录，只读查看；未重跑、未重新计算。'));
  const d=el('details');d.append(el('summary','开发详情：旧引擎原始快照'),el('pre',JSON.stringify(run.raw,null,2)));$('panel').append(d);return;
 }
 busy=['QUEUED','RUNNING','CANCELLING'].includes(run.status);$('parse').disabled=busy;$('cancel').disabled=!busy||run.status==='CANCELLING';$('input').readOnly=busy;$('file').disabled=busy;
 for(const id of ['compile-model','compile-reasoning','compile-method','compile-l2','compile-l3','source-example','load-example'])if($(id))$(id).disabled=busy;
 if(busy){if($('compile-method')&&run.parse_method)$('compile-method').value=run.parse_method;if($('compile-model')&&run.requested_model)$('compile-model').value=run.requested_model;if($('compile-reasoning')&&run.requested_reasoning)$('compile-reasoning').value=run.requested_reasoning;}
 updateViewedSettings();
 const stageTitle=run.request_profile==='DECLARATIVE_BOUNDARY_R01'?({PARSING:'LLM正在提取任务边界',AUDITING:'新会话正在核对边界',CALCULATING:'程序正在计算确定值并建立边界'}[run.stage]??stages[run.stage]):['LLM_BOUNDARY_CALCULATION_R01','LLM_BOUNDARY_CALCULATION_R02','LLM_BOUNDARY_CALCULATION_R03'].includes(run.request_profile)?({PARSING:'LLM正在识别IR与计算边界',AUDITING:'新会话正在核对IR与计算结果',CALCULATING:'程序正在复核并整理结果'}[run.stage]??stages[run.stage]):stages[run.stage];
 $('run-id').textContent=run.run_id+' · '+run.source_sha256;$('status').textContent=(stageTitle??run.stage)+' · 已用 '+Math.round(run.elapsed_ms/1000)+' 秒'+(run.error?' · '+(errors[run.error.code]??run.error.code):'');$('status').className=run.status==='FAILED'?'failure':'';
 $('engine-info').textContent=run.engine+' · '+(run.compiler_revision??'历史编译版本，详见Trace')+' · 合同 '+run.contract+' · '+(run.parse_method??'SKILL')+' / '+(run.resource_profile??'原资源')+' · 请求 '+run.requested_model+' · 实际服务模型 '+(run.actual_model??'未披露');
 $('evidence').textContent=run.source_text;$('trace-colors').textContent=run.source_text;$('trace-summary').textContent=run.request_profile==='DECLARATIVE_BOUNDARY_R01'?'原文 → 解析Skill / Codex：完整边界IR → 新会话独立审阅 → 技术校验 → 同源7+1与静态计算 → 待核验PM规划；技术接受不是业务授权':['LLM_BOUNDARY_CALCULATION_R01','LLM_BOUNDARY_CALCULATION_R02','LLM_BOUNDARY_CALCULATION_R03'].includes(run.request_profile)?'原文 → 解析Skill / Codex：IR＋完整边界计算 → 审阅Skill / 新会话：核对两者 → 程序校验与证据复核 → 固定7+1及数学结果；技术接受不是业务授权':run.request_profile==='DIRECT_CANDIDATE_IR_R01'?'原文 → 解析Skill / Codex候选IR → 审阅Skill / 新会话 → 技术校验 → 固定7+1 → 程序边界计算；技术接受不是业务授权':'历史流程：原文 → 语义候选 → 独立审阅 → 技术校验 → IR → 7+1 → 计算';
 if((run.resource_profile??'').includes('BOUNDARY_RULES_R01'))$('trace-summary').textContent='原文 → LLM提取边界 → 程序展开与预检 → 新会话核对边界 → 同源7+1 → 待核验PM规划；不编执行安排，技术接受不是业务授权';
 $('input').value=run.source_text;uploaded=null;count();
 const result=run.result;for(const id of ['export','export-json','trace-html','trace-md','trace-json'])$(id).disabled=!result;
 renderModelInfo($('model-info'),run,session);
 renderCompilerProcess($('compiler-root'),run,{session,onEvidence:sources=>{highlight(sources);$('evidence').scrollIntoView({behavior:'smooth',block:'center'});}});
 $('pipeline').textContent=JSON.stringify({parse_method:run.parse_method??'SKILL',resource_profile:run.resource_profile??'LEGACY_ORIGINAL',selected_resources:run.selected_resources,stages:run.stages,slot_status:run.slot_status,real_calls:run.real_calls,semantic_test:'用户运行未进行标准答案评分',native_skill_loading:run.native_skill_loading,error:run.error??null},null,2);
 if(run.request_profile==='BOUNDARY_REPORT_R01'){
  $('trace-summary').textContent='原文 → LLM生成完整7+1边界 → 新会话独立审阅 → 程序核对记录、保存与展示；PM规划尚未核验。';
  if(run.status==='COMPLETED')$('status').textContent='7+1生成与审阅完成 · 已用 '+Math.round(run.elapsed_ms/1000)+' 秒 · 审阅结论见下方';
  $('slots').replaceChildren();$('panel').replaceChildren();
  const generated=result?.report??run.progress?.proposal?.text,review=result?.review??run.progress?.audit?.text;
  $('v03-canonical-status').textContent=generated?'LLM原始7+1边界 · 未自动判定语义完整性':'等待LLM生成7+1边界';
  boundarySummary.append(el('h2','LLM生成：7+1边界与必要计算'));
  if(generated)renderReportText(boundarySummary,generated);else boundarySummary.append(el('p','正在等待模型结果。'));
  boundarySummary.append(el('h2','独立LLM审阅：问题与建议'));
  if(review)renderReportText(boundarySummary,review);else boundarySummary.append(el('p','尚无审阅结果；已生成内容可先查看。'));
  boundarySummary.append(el('h3','程序核对范围'),el('p',result?'已核对回执、同版资源绑定与会话独立性，完整保存上述两份原文。程序未自动证明语义完整性或复算自由表达的公式；PM规划尚未核验。':'程序随运行保存记录；生成完成不代表审阅已完成。'));
  if(result)panel(tab);return;
 }
 if(!result){$('slots').replaceChildren();$('panel').replaceChildren();$('v03-canonical-status').textContent='本次尚无最终结果';return;}
 $('v03-canonical-status').textContent=Object.entries(result.canonical.slots).map(([s,v])=>s+'：'+readable(v.status)).join(' · ');$('slots').replaceChildren();
 for(const [slot,name] of Object.entries(names)){const v=result.canonical.slots[slot],card=el('div',undefined,slot==='B'?'card b':'card'),h=el('h3');h.append(el('span',slot,'letter'),document.createTextNode(name),el('span',readable(v.status),'badge '+(v.status==='UNRESOLVED'?'unresolved':'')));card.append(h);for(const f of v.entries)card.append(entry(f));if(!v.entries.length)card.append(el('p',v.status==='ABSENT'?'原文未明确此维边界（不等于禁止或授权）':'存在覆盖缺口或未决'));$('slots').append(card);}
 const flow=el('section');flow.append(el('h3','产物关联 / 可用性依赖（不自动推出事件强顺序）'));
 for(const relation of [...(result.canonical.artifact_associations??[]),...(result.canonical.artifact_dependencies??[])]){
  const line=result.chinese.split('\n').find(l=>l.endsWith('（'+relation.id+'）'));
  const b=el('button',line??JSON.stringify(relation),'entry');b.onclick=()=>record(relation);flow.append(b);
 }
 if(flow.children.length>1)$('compiler-root').append(flow);
 panel(tab);
}
function directPanel(kind,r){
 const root=$('panel');
 const row=(label,item)=>{
  const section=el('section');section.append(el('p',label));
  const refs=item.source_refs??[];
  for(const ref of refs){const id=typeof ref==='string'?ref:ref.id;const source=(r.ir.source_table??[]).find(x=>x.id===id);if(source)section.append(el('p','原文依据：'+source.quote));}
  const detail=el('details');detail.append(el('summary','查看实际结构'),el('pre',JSON.stringify(item,null,2)));section.append(detail);return section;
 };
 if(kind==='json'){root.append(el('pre',JSON.stringify(r.canonical,null,2)));return;}
 if(kind==='frames'){renderCompilerProcess(root,current,{session,onEvidence:highlight});return;}
 if(kind==='forbid'){for(const f of r.canonical.slots?.B?.entries??[])root.append(row(f.text??f.reason??f.id,f));return;}
 if(kind==='retained'){
  root.append(el('h3','作用域、引文及背景（不自动成为业务动作）'));
  const items=(r.ir.events??[]).filter(x=>x.kind!=='ACTION'||x.layer!=='MAIN'||x.use==='MENTION_ONLY');
  for(const x of items)root.append(row([x.id,x.kind,x.layer,x.use].filter(Boolean).join(' · '),x));
  if(!items.length)root.append(el('p','本次没有这类事件记录。'));return;
 }
 root.append(el('h3',kind==='diagnostics'?'独立审阅与技术校验问题':'未决、歧义与计算覆盖缺口'));
 let count=0;
 for(const [label,items] of [['IR局部疑点',r.ir.issues],['独立审阅问题',r.audit?.issues],['独立审阅遗漏',r.audit?.omissions],['技术诊断',r.technical?.diagnostics],['未接受的节点',(r.technical?.rows??[]).filter(x=>x.status!=='ACCEPTED')],['最终未决',r.canonical.unresolved],['覆盖缺口',r.canonical.gaps]]){
  if(!items?.length)continue;
  const group=el('details');group.append(el('summary',label+'（'+items.length+'条记录）'));root.append(group);
  for(const x of items){count++;group.append(row(label+'：'+(x.reason??x.message??x.code??x.id??x.status??'查看结构'),x));}
 }
 if(!count)root.append(el('p','本次未记录未决或缺口；技术接受不等于语义必然正确或业务授权。'));
}
function panel(kind){
 tab=kind;$('panel').replaceChildren();const r=current?.result;if(!r)return;
 if(r.pipeline==='BOUNDARY_REPORT_R01'){
  if(kind==='json')$('panel').append(el('pre',JSON.stringify(r.canonical,null,2)));
  else if(kind==='frames')renderCompilerProcess($('panel'),current,{session,onEvidence:highlight});
  else { $('panel').append(el('h3',kind==='forbid'?'禁止边界请对照上方完整7+1报告':'独立审阅原文'));renderReportText($('panel'),r.review); }
  return;
 }
 if(directTrace(r))return directPanel(kind,r);
 if(kind==='json')return $('panel').append(el('pre',JSON.stringify(r.canonical,null,2)));
 if(kind==='diagnostics'&&directTrace(r)){
  $('panel').append(el('h3','本次审阅与技术诊断'));
  for(const i of [...(r.audit.issues??[]),...(r.audit.omissions??[]),...(r.technical.diagnostics??[])])$('panel').append(el('p',i.reason??i.code));
  for(const i of r.technical.rows.filter(x=>x.status!=='ACCEPTED'))$('panel').append(el('p',i.id+'：'+readable(i.status)+(i.blocked_dependencies?'；依赖未接受：'+i.blocked_dependencies.join('，'):'')));
  return;
 }
 if(kind==='diagnostics'){
  for(const [label,items] of [['原文未明确 / 歧义',r.ir.issues],['独立审阅待确认',r.ir.audit_issues],['覆盖缺口',r.ir.gaps],['技术诊断',r.ir.technical_diagnostics]]){
   $('panel').append(el('h3',label+'：'+(items??[]).length+'项'));
   for(const i of items??[]){const b=el('button',readable(i.kind??i.code??i.status)+'：'+(i.reason??i.message??i.note??'查看记录和来源'),'entry');b.onclick=()=>record(i);$('panel').append(b);}
  }return;
 }
 if(kind==='frames')return renderCompilerProcess($('panel'),current,{session,onEvidence:highlight});
 if(kind==='forbid'){for(const f of r.canonical.slots.B.entries)$('panel').append(entry(f));return;}
 if(kind==='retained'){for(const f of r.canonical.retained_nonprojected)$('panel').append(entry(f));return;}
 $('panel').append(el('h3','未决 / 最小澄清 / 未指定细节'));
 for(const q of r.canonical.clarifications??[]){
  const section=el('section');section.append(el('h3',q.question),el('p','备选仅用于解释差异，未预选答案；请手工修改左侧原文，再点击编译。旧记录保持不变。'));
  const detail=el('button','查看该限制、备选与来源','secondary');detail.onclick=()=>record(q);section.append(detail);
  for(const choice of q.choices){for(const x of choice.alternatives)section.append(el('pre',JSON.stringify({在该解释下:x,最终边界:false},null,2)));}
  const edit=el('button','编辑原文并澄清此范围','secondary');edit.onclick=()=>{$('input').focus();$('input').setSelectionRange($('input').value.length,$('input').value.length);};section.append(edit);$('panel').append(section);
 }
 for(const i of r.ir.issues){const b=el('button',readable(i.kind)+'：'+i.note,'entry');b.onclick=()=>record(i);$('panel').append(b);}
 for(const i of r.ir.audit_issues){const b=el('button','审阅待确认 '+i.subject_ids.join(',')+(i.field_path?' / '+i.field_path:'')+'：'+i.reason,'entry');b.onclick=()=>record(i);$('panel').append(b);}
 for(const f of r.canonical.unresolved)$('panel').append(entry(f));
 for(const gap of r.canonical.gaps){const b=el('button','覆盖缺口：'+(gap.reason??gap.note??gap.code??'查看缺失结构'),'entry');b.onclick=()=>record(gap);$('panel').append(b);}
 const retained=r.canonical.retained_nonprojected.filter(f=>f.kind==='EVENT'&&f.event.modality==='NOT_REQUIRED');
 if(retained.length){$('panel').append(el('h3','明确无义务（不等于禁止或新增许可）'));for(const f of retained)$('panel').append(entry(f));}
 if(!r.ir.issues.length&&!r.ir.audit_issues.length&&!r.canonical.unresolved.length&&!r.canonical.gaps.length)$('panel').append(el('p','本次没有记录到未决或覆盖缺口；不保证模型永不误解。'));
}
async function history(){
 const rows=await api('/api/runs');$('history').replaceChildren();
 for(const row of rows){const b=el('button',(row.created_at??'旧历史')+' · '+(row.parse_method??'Skill原版')+' · '+(stages[row.status]??(row.status==='LEGACY_READ_ONLY'?'旧引擎只读':row.status))+'\n'+row.summary);b.onclick=async()=>{try{if(row.run_id.startsWith('legacy:'))return render(await api('/api/legacy/'+row.run_id.slice(7)));await open(row.run_id);}catch(e){showError(e);}};$('history').append(b);}
}
async function open(id){
 clearTimeout(pollTimer);const run=await api('/api/runs/'+id);render(run);
 if(busy){localStorage.setItem('boundx029-active',id);pollTimer=setTimeout(()=>open(id).catch(showError),1000);}
 else{localStorage.removeItem('boundx029-active');localStorage.removeItem('boundx029-pending');await history();}
}
$('parse').onclick=async()=>{
 if(busy)return;const n=count();if(!n||!$('input').value.replaceAll('\uFEFF','').trim())return showError(Error('EMPTY_SOURCE'));if(new TextEncoder().encode($('input').value).length>MAX_SOURCE_BYTES)return showError(Error('SOURCE_BYTE_LIMIT'));
 busy=true;$('parse').disabled=true;
 const sourcePayload={...(uploaded??{text:$('input').value}),model:$('compile-model').value,reasoning:$('compile-reasoning').value,parse_method:$('compile-method').value,dictionaries:{l2:$('compile-l2').value,l3:$('compile-l3').value}},pending=JSON.parse(localStorage.getItem('boundx029-pending')??'null');
 if(session.source_lineage_supported&&current?.result&&current.source_text!==$('input').value)sourcePayload.parent_run_id=current.run_id;
 const payload=pending&&(pending.text===sourcePayload.text&&pending.base64===sourcePayload.base64)&&(pending.model??session.requested_model)===sourcePayload.model&&(pending.reasoning??'medium')===sourcePayload.reasoning&&pending.parse_method===sourcePayload.parse_method&&JSON.stringify(pending.dictionaries)===JSON.stringify(sourcePayload.dictionaries)?pending:{...sourcePayload,request_id:crypto.randomUUID()};localStorage.setItem('boundx029-pending',JSON.stringify(payload));
 try{const run=await jsonPost('/api/parse',payload);localStorage.setItem('boundx029-active',run.run_id);await open(run.run_id);}
 catch(e){busy=false;$('parse').disabled=false;showError(e);}
};
$('cancel').onclick=async()=>{if(!current||!busy)return;try{render(await jsonPost('/api/runs/'+current.run_id+'/cancel',{}));await open(current.run_id);}catch(e){showError(e);}};
$('input').oninput=()=>{uploaded=null;count();};$('clear').onclick=()=>{if(busy)return;$('input').value='';uploaded=null;count();};
$('file').onchange=async()=>{
 try{const f=$('file').files[0];if(!f)return;if(!/\.(txt|md)$/i.test(f.name))throw Error('仅支持txt/md');if(f.size>MAX_SOURCE_BYTES)throw Error('SOURCE_BYTE_LIMIT');const bytes=new Uint8Array(await f.arrayBuffer());const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes);$('input').value=text;uploaded={filename:f.name,base64:btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''))};count();}
 catch(e){uploaded=null;$('input').value='';count();showError(e instanceof TypeError?Error('INVALID_UTF8'):e);}
};
for(const [id,full] of [['simple-mode',false],['full-mode',true]])$(id).onclick=()=>{document.body.classList.toggle('full-mode',full);$(id).setAttribute('aria-pressed','true');$(full?'simple-mode':'full-mode').setAttribute('aria-pressed','false');};
function download(suffix){if(!current?.result)return;const a=el('a');a.href='/api/runs/'+current.run_id+'/'+suffix;a.download='';a.click();}
for(const ext of ['html','md','json'])$('trace-'+ext).onclick=()=>download('trace.'+ext);
$('export').onclick=()=>download('export');$('export-json').onclick=()=>download('json');
function confirmation(message){return new Promise(resolve=>{$('confirmation-message').textContent=message;const finish=x=>{$('confirmation').close();resolve(x);};$('confirmation-yes').onclick=()=>finish(true);$('confirmation-no').onclick=()=>finish(false);$('confirmation').oncancel=e=>{e.preventDefault();finish(false);};$('confirmation').showModal();});}
$('delete-run').onclick=async()=>{if(!current||busy||!await confirmation('从本轮列表隐藏该记录？原始运行文件保留。'))return;await api('/api/runs/'+current.run_id,{method:'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify({confirmation:current.run_id})});await history();};
$('clear-history').onclick=async()=>{if(busy||!await confirmation('隐藏本轮列表？不删除旧历史或运行文件。'))return;const c=await jsonPost('/api/clear-confirmation',{});if(!await confirmation(c.message))return;await api('/api/runs',{method:'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify({token:c.token,confirmation:'DELETE_ALL_HISTORY'})});await history();};
$('save').onclick=async()=>{if(!current)return;try{const x=await jsonPost('/api/review',{run_id:current.run_id,notes:$('notes').value});$('review-status').textContent='已保存 '+x.file;}catch(e){showError(e);}};
$('refresh').onclick=()=>history().catch(showError);document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>panel(b.dataset.tab));
async function boot(){session=await api('/api/session');const p=session.product_snapshot;$('product-version').textContent=p?`${p.product_version} · ${p.compiler_revision} · 合同 ${p.contract}`:`开发工作区 · ${session.compiler_revision} · 合同 ${session.contract}`;$('product-acceptance').textContent='产品验收：'+(p?.product_acceptance??'开发版本，尚未验收')+'；公开发布：'+(p?.public_release?'已发布':'未发布候选');$('product-limits').textContent=(p?.support_profile??'完整ADMIN任务原文，不设短文本字符上限')+'；'+(p?.known_limitations??['源文可能需澄清；不是业务执行授权']).join('；');$('engine-info').textContent=session.engine+' · '+session.contract+' · '+session.skill_mode+' · 实际模型未披露';await history();let id=localStorage.getItem('boundx029-active');if(!id){const pending=JSON.parse(localStorage.getItem('boundx029-pending')??'null');if(pending){id=(await api('/api/runs')).find(r=>r.request_id===pending.request_id)?.run_id;if(!id){$('input').value=pending.text??'';count();}}}if(id)await open(id);}
boot().then(async()=>{configureRuntimeVersion();configureModels();await configureExamples();for(const id of ['compile-model','compile-reasoning','compile-method','compile-l2','compile-l3','source-example','load-example'])$(id).disabled=busy;const p=session.product_snapshot;$('product-acceptance').textContent='产品验收：'+readable(p?.product_acceptance??'开发版本，尚未验收')+'；公开发布：'+(p?.public_release?'已发布':'未发布候选');if(!current){renderModelInfo($('model-info'),{},session);renderCompilerProcess($('compiler-root'),{},{session});}}).catch(showError);
