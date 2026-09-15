import {renderAdminResult} from './source-render.mjs';
import {renderThreeLayerReport} from './bxp-view.mjs';
import { packLabel } from './pack-labels.mjs';
import {originalBoundary,withEngineAdvice} from './admin-boundary.mjs';
import {adminAdviceLayers} from './advice.mjs';
import { checkAdminText } from './admin-check.mjs';
import { draftDocument, draftPlan, createBxpResultState } from './records.mjs';
import { createConnectionState, resolveEndpoint, modelPreferences } from './connection.mjs';
import { adminAdvice, planAdvice, planAssignments, conclusion, completeTask } from './advice.mjs';
import { createLocale, registerPair, selectCopy } from './i18n.mjs';
import { localTaskProjection, prohibitedActions } from './local-task.mjs';
import { assignmentRisks, compareAssignments, followUpText, taskReminder } from './task-risks.mjs';
import { pairedCopy } from './paired-copy.mjs';
import { requestStage, canReuseTask, withDeadline } from './progress.mjs';
for(const pair of pairedCopy)registerPair(...pair);
registerPair('下载原始边界计算 JSON','Download original boundary JSON');
let initialLanguage='zh-CN';try{initialLanguage=localStorage.getItem('boundx-language')||'zh-CN';}catch{}
const locale=createLocale(initialLanguage);
const t=text=>locale.t(text);
const pick=(zh,en)=>selectCopy(zh,en,locale.language);
function localized(node,zh,en){const text=document.createTextNode('');node.append(text);locale.bind(text,l=>en===undefined?locale.t(zh):selectCopy(zh,en,l));return node;}
function setText(node,text){node.replaceChildren();localized(node,text);}
function attribute(node,name,text){node.setAttribute(name,t(text));const proxy=document.createTextNode('');node.append(proxy);locale.bind(proxy,()=>{node.setAttribute(name,t(text));return '';});}
function editable(node,render){for(const child of [...node.childNodes])if(child._editableBinding)child.remove();const drafts={};let previous=locale.language;node.value=render(previous);const proxy=document.createTextNode('');proxy._editableBinding=true;node.append(proxy);locale.bind(proxy,l=>{if(l!==previous){drafts[previous]=node.value;node.value=drafts[l]??render(l);previous=l;}return '';});}
const $=id=>document.getElementById(id);
const clone=x=>structuredClone(x);
const token=document.querySelector('meta[name="session-token"]').content;
const parameterNames={I:'检查对象与输入',O:'交付结果',A:'允许的动作',P:'责任分工',R:'时间与资源',V:'版本与证据',C:'完成与停止条件'};
const titles={parameter_unmapped:'边界尚未映射',projection_incomplete:'动作或完成条件尚未明确',parameter_difference:'边界表述发生变化',action_difference:'动作与基线存在差异',completion_difference:'完成条件发生变化',completion_omission:'基线完成条件未对应',dependency_unknown:'依赖对象未提供',dependency_cycle:'依赖图出现循环'};
let state={schema:'boundx-ui/v1',task:null,baseline:null,plan:null,history:[],reviews:[],calls:[]};
let currentReview=null,controller=null,activeLocal=false;
function noticePair(zh,en){registerPair(zh,en);notice(zh+' / '+en);}
const notice=(text,error=false)=>{setText($('notice'),text);$('notice').className=error?'error':'';};
function element(tag,text,cls){const node=document.createElement(tag);if(text!==undefined){if(tag==='blockquote'||tag==='pre')node.textContent=text;else localized(node,text);}if(cls)node.className=cls;return node;}
function input(value,placeholder,change){const node=element('input');node.value=value??'';attribute(node,'placeholder',placeholder);attribute(node,'aria-label',placeholder);node.addEventListener('input',()=>change(node.value));return node;}
function button(text,run){const node=element('button',text);node.type='button';node.onclick=run;return node;}
function page(name){const pm=name!=='task';$('page-task').hidden=pm;$('page-plan').hidden=!pm;$('page-results').hidden=!pm||currentReview?.kind!=='plan';$('tab-task').toggleAttribute('aria-current',!pm);$('tab-plan').toggleAttribute('aria-current',pm);window.scrollTo({top:0,behavior:'smooth'});}

for(const k of ['task','plan','results'])$('tab-'+k).onclick=()=>page(k);
$('settings-toggle').onclick=()=>{$('settings').hidden=!$('settings').hidden;};
$('clear-key').onclick=()=>{$('key').value='';notice('API 密钥已从页面清除。');};
function config(){return {provider:$('model-provider').value,protocol:$('protocol').value,url:$('url').value.trim(),model:$('model').value.trim(),key:$('model-provider').value==='codex'?'':$('key').value.trim(),disableThinking:$('disable-thinking').checked};}
function requireConfig(){const c=config();if((c.provider==='api'&&(!c.url||!c.key))||!c.model){$('settings').hidden=false;throw Error('请先填写模型设置。 / Configure a model first.');}return c;}
async function api(route,data){
  if(controller)throw Error('已有请求正在进行，请等待或取消。');
  const abort=new AbortController();controller=abort;activeLocal=route==='admin-boundary';const limitMs=activeLocal?12000:185000;$('busy').hidden=false;
  const stage=requestStage(route,data),started=Date.now();
  const update=()=>{const seconds=Math.floor((Date.now()-started)/1000);setText($('busy-label'),pick(stage.zh,stage.en)+pick(` · 已等待 ${seconds} 秒；本步骤最多等待 ${limitMs/1000} 秒。`,` · ${seconds}s elapsed; this step times out after ${limitMs/1000}s.`));};update();const ticker=setInterval(update,1000);
  const frozen=[...document.querySelectorAll('button,input,textarea,select')].filter(n=>n.id!=='cancel').map(n=>[n,n.disabled]);frozen.forEach(([n])=>n.disabled=true);
  const endpoint={'bxp-admin':'/api/admin-model','product-packs':'/api/admin-product','industry-selection':'/api/industry-selection'}[route]??'/api/legacy/'+route;
  try{return await withDeadline(async signal=>{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','X-BoundX-Token':token},body:JSON.stringify(data),signal});const result=await r.json();if(!r.ok)throw Error(result.error||'请求失败');return result;},{signal:abort.signal,timeoutMs:limitMs});}
  finally{clearInterval(ticker);if(controller===abort)controller=null;$('busy').hidden=true;frozen.forEach(([n,disabled])=>n.disabled=disabled);}
}
$('cancel').onclick=()=>{controller?.abort();notice(activeLocal?'已取消本机计算，未调用模型。 / Local calculation cancelled; no model call.':'已请求取消。本地不会自动重试；已发送的模型请求是否计费由服务商决定。');};
const action=fn=>async()=>{try{await fn();}catch(e){notice(e.name==='AbortError'?'请求已取消。':e.message,true);}};
const connection=createConnectionState();
const providerSelect=element('select');providerSelect.id='model-provider';
for(const [value,label] of [['api','自定义API / Custom API'],['cursor','Cursor SDK'],['codex','Codex订阅登录 / Codex subscription']]){const option=element('option');option.value=value;option.textContent=label;providerSelect.append(option);}
const providerLabel=localized(element('label'),'接入方式','Connection provider');providerLabel.append(providerSelect);$('settings').prepend(providerLabel);
const cursorCatalog=element('select');cursorCatalog.id='cursor-model-catalog';cursorCatalog.hidden=true;
cursorCatalog.setAttribute('aria-label','可用模型 / Available models');
const catalogStatus=element('span');catalogStatus.setAttribute('role','status');catalogStatus.hidden=true;
let catalogRevision=0;
let restoredModel='';
cursorCatalog.onchange=()=>{$('model').value=cursorCatalog.value;invalidateConnection();};
const loadCursorModels=button(undefined,action(async()=>{
 const revision=++catalogRevision,provider=providerSelect.value;
 const key=$('key').value.trim();
 $('model').value='';cursorCatalog.replaceChildren();cursorCatalog.disabled=true;invalidateConnection();
 setText(catalogStatus,'正在读取模型列表 / Loading models…');
 try{
 const result=await api(provider==='codex'?'codex-models':'cursor-models',provider==='codex'?{}:{key});
 if(revision!==catalogRevision||providerSelect.value!==provider)return;
 if(!Array.isArray(result.models)||!result.models.length)throw Error('没有可用模型，请检查登录后刷新。 / No models available; check sign-in and refresh.');
 for(const model of result.models){const option=element('option');option.value=model.id;option.textContent=model.name+' · '+model.id;cursorCatalog.append(option);}
 const preferred=restoredModel;restoredModel='';
 if(preferred){cursorCatalog.value=result.models.some(model=>model.id===preferred)?preferred:'';}
 cursorCatalog.disabled=false;$('model').value=cursorCatalog.value;invalidateConnection();
 if(preferred&&!cursorCatalog.value){setText(catalogStatus,'已保存的模型不在当前列表，请重新选择。 / Saved model unavailable; select another.');return;}
 setText(catalogStatus,'请选择模型，然后测试连接。 / Select a model, then test the connection.');
 }catch(error){if(revision===catalogRevision){cursorCatalog.disabled=true;setText(catalogStatus,error.message);}throw error;}
}));localized(loadCursorModels,'刷新模型列表','Refresh models');loadCursorModels.hidden=true;
$('model').closest('label').append(cursorCatalog,loadCursorModels,catalogStatus);
$('settings').append(localized(element('p'),'Cursor密钥可留空以使用服务器环境变量CURSOR_API_KEY；不会发送密钥到浏览器。模型目录可见不代表生成测试通过。','Leave the Cursor key blank to use the server CURSOR_API_KEY environment variable; server keys are not returned to the browser. Catalog access does not prove generation works.'));
$('settings').append(localized(element('p'),'Codex使用本机ChatGPT订阅登录，不填写API密钥；调用消耗订阅额度。仅用于标准BXP候选及文本连接测试。','Codex uses local ChatGPT sign-in, without an API key, and consumes subscription usage. Use it for standard BXP candidates and text connection tests.'));
providerSelect.onchange=()=>{catalogRevision++;const hosted=providerSelect.value!=='api';for(const id of ['protocol','url','disable-thinking'])$(id).closest('label').hidden=hosted;$('key').closest('label').hidden=providerSelect.value==='codex';loadCursorModels.hidden=!hosted;cursorCatalog.hidden=!hosted;catalogStatus.hidden=!hosted;$('model').hidden=hosted;$('model').value='';cursorCatalog.replaceChildren();cursorCatalog.disabled=true;setText(catalogStatus,'点击刷新读取可用模型。 / Refresh to load available models.');invalidateConnection();if(providerSelect.value==='codex')loadCursorModels.click();};
function connectionDisplay(detail){const node=$('connection-status');node.dataset.state=connection.status;setText(node,{untested:'● 未测试 / Not tested',testing:'● 正在测试 / Testing…',connected:'● 连接成功 / Connected',failed:'● 连接失败 / Failed'}[connection.status]);setText($('connection-detail'),detail);for(const id of ['generate-pm','test-current-task','recheck-pm','extract-bxp-task'])if($(id))$(id).disabled=connection.status!=='connected'||(providerSelect.value==='codex'&&id!=='extract-bxp-task');}
function connectedConfig(){if(connection.status!=='connected')throw Error('请先测试模型连接，绿色成功后才能测试 PM。 / Test the connection first.');return requireConfig();}
function invalidateConnection(){connection.invalidate();connectionDisplay('配置已变更，请重新测试。绿色状态不会保存或从记录恢复。');}
for(const id of ['protocol','url','model','key','disable-thinking'])for(const event of ['input','change'])$(id).addEventListener(event,invalidateConnection);
$('clear-key').addEventListener('click',invalidateConnection);
const preferenceKey='boundx-model-preferences-v1';
const preferenceStatus=element('p');preferenceStatus.setAttribute('role','status');
const savePreferences=button(undefined,action(async()=>{
 const value=modelPreferences(config());
 try{localStorage.setItem(preferenceKey,JSON.stringify(value));}catch{throw Error('浏览器无法保存设置 / Browser storage unavailable');}
 setText(preferenceStatus,'模型设置已保存在当前浏览器和地址；不含密钥、任务原文和连接状态。 / Saved for this browser and address; excludes keys, task text and connection status.');
}));localized(savePreferences,'保存模型设置','Save model settings');
const forgetPreferences=button(undefined,action(async()=>{localStorage.removeItem(preferenceKey);restoredModel='';setText(preferenceStatus,'已删除保存的设置；当前页面配置保留。 / Saved settings removed; current configuration retained.');}));localized(forgetPreferences,'忘记保存的设置','Forget saved settings');
const preferenceButtons=element('div',undefined,'buttons');preferenceButtons.append(savePreferences,forgetPreferences);$('settings').append(preferenceButtons,preferenceStatus);
$('test-connection').onclick=action(async()=>{
  const ticket=connection.begin();connectionDisplay('正在发送短文本测试，不发送任务正文。');
  try{
    const c=requireConfig();const endpoint=c.provider==='api'?resolveEndpoint(c.url,c.protocol):{url:c.provider==='cursor'?'cursor-sdk':'codex-subscription',adjusted:false};if(c.provider==='api'){c.url=endpoint.url;$('url').value=c.url;}
    const result=await api('connection',{config:c});
    if(connection.finish(ticket,result.connected===true))connectionDisplay(`实际返回模型：${result.model}；耗时 ${result.elapsed_ms} ms。${endpoint.adjusted?'已补全或规范化接口地址。':''}仅表示本次连接可用，不代表任务理解正确。`);
  }catch(e){if(connection.finish(ticket,false))connectionDisplay(e.name==='AbortError'?'测试已取消，未自动重试。':e.message);throw e;}
});
let bxpPacks={installed:[],active:[]};
const bxpPanel=element('section',undefined,'panel');
bxpPanel.id='bxp-context';
bxpPanel.append(localized(element('h2'),'03 · 选择语义上下文','03 · Select semantic context'));
bxpPanel.append(localized(element('p'),'点击开始分析后，将原文和所选语义上下文发送给模型；随后在本地验证、计算，不执行任务。','Start analysis sends source text and selected context to the model, followed by local validation and calculation. No task execution.'));
bxpPanel.append(localized(element('p'),'默认L1，可选L2行业及已启用L3名册；L3外发还需服务器授权。准备快照保存在本地，名册默认不选择。','Default L1 with optional L2 industry and active L3 directory; L3 disclosure also requires server authorization. Prepared snapshots are saved locally. No directory is selected by default.'));
const packageLink=element('a');packageLink.href='/admin';localized(packageLink,'打开语义包管理','Open semantic package management');bxpPanel.append(packageLink);
const industrySelect=element('select');industrySelect.id='bxp-industry';
const industryLabel=localized(element('label'),'行业包（先导入，再确认启用）','Industry package (install, then explicitly activate)');industryLabel.append(industrySelect);bxpPanel.append(industryLabel);
const directorySelect=element('select');directorySelect.id='bxp-directory';
const directoryLabel=localized(element('label'),'职员目录（可选，须先在管理页启用）','Employee directory (optional; activate in management first)');directoryLabel.append(directorySelect);bxpPanel.append(directoryLabel);
const bxpReport=element('div');bxpReport.id='bxp-model-result';
const bxpResultPanel=element('section',undefined,'panel');bxpResultPanel.id='bxp-result-panel';bxpResultPanel.hidden=true;
bxpResultPanel.append(localized(element('h2'),'04 · 分析结果','04 · Analysis results'));
const bxpResultState=createBxpResultState();
const bxpDownloads=element('div',undefined,'buttons');bxpDownloads.hidden=true;
const bxpDownloadButtons=[];
for(const [kind,zh,en] of [['report','下载三层报告','Download three-layer report'],['task','下载BXP任务JSON','Download BXP task JSON'],['result','下载BXP结果JSON','Download BXP result JSON']]){
 const control=button(undefined,action(async()=>{const file=bxpResultState.export(kind);download(file.name,file.text,file.type);}));
 localized(control,zh,en);control.disabled=true;bxpDownloadButtons.push({kind,control});bxpDownloads.append(control);
}
function clearBxpResult(){const ticket=bxpResultState.clear();for(const {control} of bxpDownloadButtons)control.disabled=true;bxpDownloads.hidden=true;bxpReport.textContent='';bxpResultPanel.hidden=true;return ticket;}
const refreshPacks=button(undefined,action(async()=>{
 clearBxpResult();
 bxpPacks=await api('product-packs',{method:'bx_list_semantic_packs',arguments:{}});
 industrySelect.replaceChildren();const none=element('option','None / 不使用行业包');none.value='';industrySelect.append(none);
 for(const pack of bxpPacks.installed.filter(pack=>pack.layer==='L2')){const option=element('option');option.textContent=packLabel(pack);option.title=`${pack.pack_id}@${pack.version}`;option.value=pack.digest;industrySelect.append(option);}
 directorySelect.replaceChildren();const noDirectory=element('option');noDirectory.value='';noDirectory.textContent='不使用职员目录 / No employee directory';directorySelect.append(noDirectory);
 for(const pack of bxpPacks.installed.filter(pack=>pack.layer==='L3'&&bxpPacks.active.some(reference=>reference.digest===pack.digest))){const option=element('option');option.value=pack.digest;option.textContent=packLabel(pack);directorySelect.append(option);}
 bxpReport.textContent='';
}));localized(refreshPacks,'加载/刷新本地语义包','Reload local semantic packages');
const activateIndustry=button(undefined,action(async()=>{
 clearBxpResult();
 const selected=bxpPacks.installed.find(pack=>pack.layer==='L2'&&pack.digest===industrySelect.value);
 if(!selected)throw Error('请选择已安装的行业包。 / Select an installed industry.');
 const {layer,...reference}=selected;const result=await api('industry-selection',{operation:'activate',reference});bxpPacks.active=result.active;bxpReport.textContent='';
}));localized(activateIndustry,'确认启用行业','Confirm industry activation');
const extractBxp=button(undefined,action(async()=>{
 const ticket=clearBxpResult();
 try{
 if(connection.status!=='connected')throw Error('请先测试模型连接。 / Test the model connection first.');
 const text=textRequired('task-source'),selected=industrySelect.value,directory=directorySelect.value;
 bxpResultPanel.hidden=false;
 bxpReport.textContent='正在抽取；尚未计算。 / Extracting; not yet calculated.';
 const l1=bxpPacks.active.find(reference=>bxpPacks.installed.some(pack=>pack.layer==='L1'&&pack.digest===reference.digest));
 if(!l1)throw Error('请先在语义包管理页或CLI安装并启用L1，再加载本地语义包。 / Install and activate L1, then reload packages.');
 if(selected&&!bxpPacks.active.some(reference=>reference.digest===selected))throw Error('请先确认启用行业。 / Confirm industry activation first.');
 if(directory&&!bxpPacks.active.some(reference=>reference.digest===directory))throw Error('名册状态已变化，请重新加载。 / Reload the directory selection.');
 const info=await fetch('/api/protocol-info').then(response=>response.json());
 const result=await api('bxp-admin',{config:requireConfig(),consent:true,prepare:{source:{text,language:locale.language},
  profile:{id:'org.boundx.admin',required_elements:info.core_elements},packs:[l1,...bxpPacks.active.filter(reference=>[selected,directory].includes(reference.digest))]}});
 if($('task-source').value!==text||industrySelect.value!==selected||directorySelect.value!==directory){clearBxpResult();bxpReport.textContent='输入已变化，请重新计算。 / Input changed; recalculate.';return;}
 if(!bxpResultState.accept(ticket,result))return;
 bxpDownloads.hidden=false;
 for(const {kind,control} of bxpDownloadButtons)control.disabled=kind!=='report'&&!result.computed;
 renderThreeLayerReport(bxpReport,result.report,()=>navigator.clipboard.writeText(text),result);
 noticePair(result.computed?'7+1候选已校验并完成BXP计算；结果不代表授权。':'尚未计算，请查看诊断。',result.computed?'Candidate validated and BXP calculated; no authority granted.':'Not computed; see diagnostics.');
 }catch(error){clearBxpResult();bxpResultPanel.hidden=false;bxpReport.textContent='尚未计算 / Not computed\n'+error.message;throw error;}
}));extractBxp.id='extract-bxp-task';extractBxp.disabled=true;localized(extractBxp,'用模型抽取7+1并计算','Extract 7+1 with model and calculate');
extractBxp.classList.add('primary');setText(extractBxp,'开始分析：抽取7+1并计算 / Start analysis');
const bxpButtons=element('div',undefined,'buttons');bxpButtons.append(refreshPacks,activateIndustry);bxpPanel.append(bxpButtons);
const bxpRun=element('section');bxpRun.id='bxp-run';
bxpRun.append(extractBxp,localized(element('p'),'使用上方原文、模型和语义上下文进行分析，不执行任务。','Analyze the source using the selected model and context; never execute the task.'));
bxpResultPanel.append(bxpReport,bxpDownloads);
const legacyResearch=element('details');legacyResearch.id='legacy-research';
legacyResearch.append(localized(element('summary'),'旧规则研究工具（已弃用，非模型抽取）','Legacy rule research tools (deprecated, not model extraction)'));
for(const node of [$('extract-task').parentElement,$('admin-advice'),$('task-editor').closest('details')])legacyResearch.append(node);
const legacyHint=$('task-source').nextElementSibling;if(legacyHint?.classList.contains('hint'))legacyResearch.prepend(legacyHint);
$('page-task').append(legacyResearch);
$('task-source').after(bxpPanel,bxpRun,bxpResultPanel);
$('settings').hidden=false;
setText($('settings').querySelector('h2'),'01 · 模型设置 / Model settings');
setText($('page-task').querySelector('h2'),'02 · 输入任务原文 / Enter task text');
const main=document.querySelector('main'),intro=main.querySelector('.intro');
setText(intro.querySelector('h1'),'任务边界分析 / Task boundary analysis');
setText(intro.querySelector('p'),'设置模型 → 输入原文 → 选择语义包 → 开始分析 → 查看结果 / Configure → Write → Select context → Analyze → Results');
main.prepend(intro);
const legacyWorkspace=element('details');legacyWorkspace.id='legacy-workspace';
legacyWorkspace.append(localized(element('summary'),'旧版研究与PM工具（已弃用）','Legacy research and PM tools (deprecated)'));
const historyDetails=$('history').closest('details');
legacyWorkspace.append(legacyResearch,main.querySelector('nav'),$('page-plan'),$('page-results'),main.querySelector('.storage'),historyDetails);
main.append(legacyWorkspace);
async function initializeModelPreferences(){
 await refreshPacks.onclick();
 let saved;
 try{const raw=localStorage.getItem(preferenceKey);if(!raw)return;saved=modelPreferences(JSON.parse(raw));}catch{setText(preferenceStatus,'保存的配置不可用，请重新设置。 / Saved settings unavailable; configure again.');return;}
 providerSelect.value=saved.provider;restoredModel=saved.model;providerSelect.onchange();
 if(saved.provider==='api'){for(const id of ['protocol','url','model'])$(id).value=saved[id];$('disable-thinking').checked=saved.disableThinking;restoredModel='';}
 else if(saved.provider==='cursor')await loadCursorModels.onclick();
 setText(preferenceStatus,'已恢复模型设置；请测试连接。不会自动发送任务。 / Settings restored; test the connection. No task is sent automatically.');
}
initializeModelPreferences();
for(const node of [$('task-source'),industrySelect,directorySelect])node.addEventListener('input',()=>{clearBxpResult();bxpReport.textContent='输入已变化，请重新计算。 / Input changed; recalculate.';});
function audit(kind,detail){state.history.push({time:new Date().toISOString(),kind,detail});$('history').textContent=state.history.map(x=>`${x.time} · ${x.kind} · ${x.detail}`).join('\n');}
function markDraft(kind){$(kind==='task'?'confirm-check':'plan-check').checked=false;}
function emptyDoc(text){return {text,parameters:{},actions:[],completion:[]};}
function textRequired(id){const text=$(id).value;if(!text.trim())throw Error('请先粘贴文本。');return text;}
function renderDocument(target,doc,kind){
  target.replaceChildren();const cards=element('div',undefined,'cards');
  for(const [id,title] of Object.entries(parameterNames)){
    const card=element('div',undefined,'card');const label=element('label',title+' · '+id);
    const area=element('textarea');area.rows=2;area.value=doc.parameters[id]??'';attribute(area,'placeholder','粘贴对应原句；未明确可以留空');attribute(area,'aria-label',title+'原句');
    area.oninput=()=>{if(area.value.trim())doc.parameters[id]=area.value;else delete doc.parameters[id];markDraft(kind);};label.append(area);card.append(label,element('small','引用必须出现在上方原文。补充要求请先加入原文，再重新整理。'));cards.append(card);
  }
  target.append(cards);
  const details=element('details');details.open=true;details.append(element('summary','核对动作与完成条件'));
  details.append(element('p','条件名称代表含义。规划与基线含义一致时使用同一名称；仅有原句还不能证明语义一致。','hint'));
  const actions=element('div'),conditions=element('div');
  const renderRows=()=>{
    actions.replaceChildren(element('h3','动作（谁 / 做什么 / 对象 / 原句）'));
    doc.actions.forEach((a,i)=>{const row=element('div',undefined,'row');for(const [key,title] of [['actor','角色'],['verb','动作'],['target','对象'],['quote','动作原句']])row.append(input(a[key],title,v=>{a[key]=v;markDraft(kind);}));row.append(button('删除',()=>{doc.actions.splice(i,1);markDraft(kind);renderRows();}));actions.append(row);});
    actions.append(button('＋ 添加动作',()=>{doc.actions.push({actor:'PM',verb:'',target:'',quote:''});markDraft(kind);renderRows();}));
    conditions.replaceChildren(element('h3','完成条件（稳定名称 / 原句）'));
    doc.completion.forEach((c,i)=>{const row=element('div',undefined,'row condition');row.append(input(c.id,'条件名称',v=>{c.id=v;markDraft(kind);}),input(c.quote,'完成条件原句',v=>{c.quote=v;markDraft(kind);}),button('删除',()=>{doc.completion.splice(i,1);markDraft(kind);renderRows();}));conditions.append(row);});
    conditions.append(button('＋ 添加完成条件',()=>{doc.completion.push({id:'condition-'+(doc.completion.length+1),quote:''});markDraft(kind);renderRows();}));
  };renderRows();details.append(actions,conditions);target.append(details);
}
function renderTask(){if(!state.task)return;clearBxpResult();$('task-source').value=state.task.text;renderDocument($('task-editor'),state.task,'task');for(const note of state.taskNotes??[])$('task-editor').prepend(element('p',note,'mapping-note'));$('task-bottom').hidden=false;markDraft('task');renderAdmin();}
function bilingualCard(host,title,enTitle,text,enText){const card=element('article',undefined,'finding');card.append(localized(element('h3'),title,enTitle),localized(element('p'),text,enText));host.append(card);}
function renderOriginalBoundary(host,text){
 const result=originalBoundary(text);
 host.append(localized(element('h2'),'原始边界计算：七要素＋B','Original boundary: seven elements + B'));
 host.append(localized(element('p'),'原文依据是候选映射，不表示边界已完整或已授权。','Source evidence is a candidate mapping, not completeness or authorization.'));
 const table=element('table',undefined,'boundary-table'),head=element('tr');
 for(const [zh,en] of [['要素','Element'],['计算状态','Status'],['原文依据','Source evidence']])head.append(localized(element('th'),zh,en));
 table.append(head);
 for(const field of result.fields){const row=element('tr');row.dataset.state=field.status;
  row.append(localized(element('th'),field.id+' · '+field.label,field.id+' · '+field.en));
  row.append(localized(element('td'),field.status==='unmapped'?'待补充／未识别':field.status==='review'?'已映射，存在待核对项':'找到原文，待确认',field.status==='unmapped'?'Unmapped / needs input':field.status==='review'?'Mapped; review needed':'Source found; unconfirmed'));
  const evidence=element('td');if(field.evidence.length)for(const e of field.evidence)evidence.append(element('blockquote',e.quote));else evidence.append(localized(element('span'),'未找到可靠对应，见下方建议。','No reliable mapping found; see advice below.'));row.append(evidence);table.append(row);
 }host.append(table);
 host.append(localized(element('h2'),'三类计算：各自报告，不投票裁决','Three checks: evidence without voting or adjudication'));
 const labels={sets:['集合与区间 · portion','Sets and intervals · portion'],logic:['逻辑约束 · Z3','Logical constraints · Z3'],graph:['依赖图 · NetworkX','Dependencies · NetworkX']};
 const status={insufficient_data:['缺少适用输入，未计算','Insufficient applicable input; not checked'],checked:['已计算覆盖部分，未发现此类提醒','Covered inputs checked; no finding'],findings:['发现待核对项','Review suggested'],error:['计算失败，不能判为通过','Calculation failed; not a pass'],incomplete:['计算未完成，不能判为通过','Incomplete; not a pass']};
 const engines=state.adminEngines?.text===text?state.adminEngines:null;
 if(engines){for(const e of engines.engines){const card=element('article',undefined,'task-risk '+(e.findings.length?'attention':'unknown'));card.append(localized(element('h3'),...labels[e.name]),localized(element('p'),...(status[e.status]??status.error)));
  for(const f of e.findings){card.append(localized(element('p'),f.suggestion['zh-CN'],f.suggestion.en));for(const s of f.sources)card.append(element('blockquote',s.quote));}host.append(card);}
 }else host.append(localized(element('p'),state.adminEngineError?'三类库计算未完成；请核对本机依赖安装或重试。':'尚未取得三类库计算结果。',state.adminEngineError?'Library checks did not complete; check local installation or retry.':'Library results are not available yet.'));
 const detail=element('details');detail.append(localized(element('summary'),'查看原始计算与库版本','Inspect original calculation and library versions'),element('pre',JSON.stringify({boundary:result,engines},null,2)));host.append(detail);
 host.append(button('下载原始边界计算 JSON / Download original boundary JSON',()=>download('BoundX-admin-original.json',JSON.stringify({boundary:result,engines},null,2),'application/json')));
}
function renderAdmin(){
 const host=$('admin-advice');host.replaceChildren();
 const result=state.adminEngines;
 if(result?.text===state.task.text&&(result.pipeline||result.sourceAnalysis)){
  renderAdminResult(host,result,{element,localized,attribute,editable,button,action,noticePair,download});return;
 }
 const failed=state.adminEngineError||result?.sourceAnalysisError;
 host.append(localized(element('p'),failed?'本次计算未完成，请检查错误信息。':'正在计算任务边界。',failed?'Calculation did not complete; inspect the error details.':'Calculating task boundaries.'));
 if(result){const details=element('details');details.append(localized(element('summary'),'查看技术详情','Technical details'),element('pre',JSON.stringify(result,null,2)));host.append(details);}
}

function renderPlan(){
  if(!state.plan)return;$('plan-source').value=state.plan.document.text;const host=$('plan-editor');host.replaceChildren();
  const root=element('div');renderDocument(root,state.plan.document,'plan');host.append(element('h3','总规划与 PM 保留职责'),root,element('h3',`派出的子任务 · ${state.plan.tasks.length} 项`));
  for(const note of state.planNotes??[])host.prepend(element('p',note,'mapping-note'));
  for(const [index,t] of state.plan.tasks.entries()){
    const card=element('div',undefined,'task-card');
    card.append(input(t.id,'任务编号',v=>{t.id=v;markDraft('plan');}),input(t.depends_on.join(', '),'必须等待的任务编号，逗号分隔；没有则留空',v=>{t.depends_on=v.split(/[,，]/).map(s=>s.trim()).filter(Boolean);markDraft('plan');}));
    const label=element('label','该派单原文（须是总规划中的连续片段）'),text=element('textarea');text.rows=3;text.value=t.document.text;text.oninput=()=>{t.document.text=text.value;markDraft('plan');};label.append(text);card.append(label);
    const details=element('details');details.append(element('summary','核对该任务的七参数、动作和完成条件'));const editor=element('div');renderDocument(editor,t.document,'plan');details.append(editor);card.append(details,button('移除这份派单',()=>{state.plan.tasks.splice(index,1);renderPlan();}));host.append(card);
  }
  host.append(button('＋ 添加一份派单',()=>{state.plan.tasks.push({id:'TASK-'+(state.plan.tasks.length+1),depends_on:[],document:emptyDoc('')});renderPlan();}));
  $('plan-bottom').hidden=false;markDraft('plan');
}
function baselineDisplay(){const b=state.baseline;setText($('baseline-status'),b?'已记录测试用任务原文。':'测试时自动记录当前任务原文，无需另行保存。');setText($('plan-baseline'),b?`当前比较基线：${b.document.text.slice(0,140)}${b.document.text.length>140?'…':''}`:'测试会使用上方 PM 任务原文。');}
function baseline(){if(!state.baseline)throw Error('请先核对任务并保存为比较基线。');return state.baseline.document;}
function recordCall(purpose,result){state.calls.push({time:new Date().toISOString(),purpose,model:result.model,usage:result.usage,text:result.text??null,notes:result.notes??[]});audit('模型调用',purpose+' · '+result.model);}
$('manual-task').onclick=action(async()=>{state.task=emptyDoc(textRequired('task-source'));state.taskNotes=[];renderTask();notice('请填写已有原句。可以保留缺口，不需要补造要求。');});
$('extract-task').onclick=action(async()=>{
 const text=textRequired('task-source');state.adminEngines=null;state.adminEngineError=null;state.task=localTaskProjection(text);state.taskMappedText=null;state.taskOrigin='local-rules';state.taskNotes=[];renderTask();audit('ADMIN 本地检查',`${Object.keys(state.task.parameters).length}/7 项有规则对应；不调用 AI`);
 try{state.adminEngines=await api('admin-boundary',{text});renderAdmin();noticePair('ADMIN 原始边界与三类本机计算已完成；请核对未覆盖项和建议。','Original boundary and three local checks completed; review uncovered inputs and advice.');}catch(e){state.adminEngineError=e.message;renderAdmin();throw e;}
});
$('task-source').addEventListener('input',()=>{if(state.task){state.task.text=$('task-source').value;state.adminEngines=null;state.adminEngineError=null;$('admin-advice').replaceChildren(localized(element('p'),'原文已修改，请重新计算；旧结果不适用于新文本。','Text changed. Recalculate; previous results do not apply.'));markDraft('task');}});
$('confirm').onclick=action(async()=>{
  if(!$('confirm-check').checked)throw Error('请先核对并勾选确认。');
  const r=await api('review',{kind:'task',document:state.task});
  state.baseline={document:clone(state.task),notes:clone(state.taskNotes??[]),savedAt:new Date().toISOString(),confirmation:'local_user; organizational authority not verified'};
  state.reviews.push({kind:'task',baseline:clone(state.baseline),input:clone(state.task),review:r.result,english:r.english,replies:[]});
  audit('保存基线','由当前用户确认；保留未明确项');baselineDisplay();renderReview(state.reviews.at(-1));notice(`基线已保存；${r.result.findings.length} 项映射缺口或提示，未自动补全。可以进入第 2 步。`);
});
$('manual-plan').onclick=action(async()=>{baseline();state.plan={document:emptyDoc(textRequired('plan-source')),tasks:[]};state.planNotes=[];renderPlan();notice('请整理总规划及各派单，含义相同的条件沿用基线名称。');});
$('extract-plan').onclick=action(async()=>{const b=await prepareTestTask();const r=await api('extract',{kind:'plan',text:textRequired('plan-source'),baseline:b,config:requireConfig()});state.plan=r.value;state.planNotes=r.notes??[];recordCall('规划候选提取',r);renderPlan();notice('规划整理完成；请核对条件名称、PM 根职责与子任务分界。');});
$('plan-source').addEventListener('input',()=>{if(state.plan){state.plan.document.text=$('plan-source').value;markDraft('plan');}});
function setPMText(text){state.plan=null;$('plan-editor').replaceChildren();$('plan-bottom').hidden=true;$('plan-source').value=text;page('plan');}
async function analyzeGenerated(text,followUp=null){const r=await api('extract',{kind:'plan',text,baseline:baseline(),config:connectedConfig()});state.plan=r.value;state.planNotes=r.notes??[];recordCall('规划候选提取',r);renderPlan();await comparePlan(followUp);}
async function prepareTestTask(){
  const config=connectedConfig(),text=textRequired('pm-task-source');
  let document;
  if(state.baseline?.document.text===text)document=state.baseline.document;
  else if(canReuseTask(state.task,state.taskMappedText,text))document=state.task;
  else{const r=await api('extract',{kind:'task',text,config});document=r.value;recordCall('PM 测试任务提取',r);}
  state.baseline={document:clone(document),savedAt:new Date().toISOString(),confirmation:'test input snapshot; no organizational authorization'};
  baselineDisplay();return baseline();
}
$('generate-pm').onclick=action(async()=>{const b=await prepareTestTask();page('plan');const r=await api('pm',{mode:'generate',text:b.text,config:connectedConfig()});recordCall('PM 初始规划',r);setPMText(r.text);noticePair('PM 已返回分工，正在等待模型提取规划；之后才进行本地计算。','PM returned a plan. Waiting for model extraction before local calculation.');await analyzeGenerated(r.text);});
$('copy-admin-task').onclick=action(async()=>{$('pm-task-source').value=textRequired('task-source');notice(t('已复制任务原文，尚未启动 PM 测试。'));});
$('test-current-task').onclick=()=>page('plan');
$('compare').onclick=action(async()=>{
  if(!$('plan-check').checked)throw Error('请先核对并勾选规划映射。');await comparePlan();
});
async function comparePlan(followUp=null){
  const b=baseline();
  if(state.plan.tasks.some(t=>!state.plan.document.text.includes(t.document.text)))throw Error('各派单须引用总规划中的连续原文。');
  const prior=[...state.reviews].reverse().find(x=>x.kind==='plan'&&JSON.stringify(x.baseline.document)===JSON.stringify(b));
  const r=await api('review',{kind:'plan',baseline:b,plan:state.plan});
  let previous=null;if(prior){previous=(await api('review',{kind:'plan',baseline:prior.input.document,plan:state.plan})).result;}
  const entry={kind:'plan',time:new Date().toISOString(),baseline:clone(state.baseline),input:clone(state.plan),notes:clone(state.planNotes??[]),review:r.result,english:r.english,previous,followUp,replies:[]};
  state.reviews.push(entry);audit('计算规划差异',`${r.result.findings.length} 项观察；业务决定为空`);renderReview(entry);page('results');notice('计算已完成。请逐项核查依据；观察不等于越权裁决。');
}
function renderAssignmentResults(host,entry){
 const summary=element('article',undefined,'followup-summary');summary.append(localized(element('h2'),'PM 有没有按建议调整？','Did PM revise the assignments?'),localized(element('p'),followUpText(entry),followUpText(entry,'en')));host.append(summary);
 const changes=entry.followUp?compareAssignments(entry.followUp.before,entry.input):[];
 if(entry.followUp){const history=element('details');history.append(localized(element('summary'),'查看本次提醒和 PM 原始回应','View the reminder and original PM reply'),element('blockquote',entry.followUp.reminder),element('blockquote',entry.followUp.reply));summary.append(history);}
 for(const change of changes){const row=element('p');const label={changed:['有变化','Changed'],unchanged:['未变化','Unchanged'],unmatched:['未找到同编号任务，不能确认去向','No matching ID; destination unconfirmed'],added:['新编号任务，不能据此认定旧任务已完成','New task ID; does not establish completion of old work']}[change.status];localized(row,change.id+'：'+label[0],change.id+': '+label[1]);summary.append(row);if(change.before&&change.after){const detail=element('details');detail.append(localized(element('summary'),'查看前后派单','View before and after'),element('blockquote',change.before.document.text),element('blockquote',change.after.document.text));summary.append(detail);}}
 const sections=assignmentRisks(entry.input,entry.review);const ordered=[...sections.filter(s=>s.id!=='$root'),...sections.filter(s=>s.id==='$root')];
 for(const section of ordered){
  const card=element('article',undefined,'assignment-card');const owner=section.document?[...new Set(section.document.actions.map(a=>a.actor))].join(', '):'';
  card.append(localized(element('h2'),section.id==='$root'?'PM 汇总与交付':section.id==='$unknown'?'归属待核对':section.id+' · '+owner,section.id==='$root'?'PM coordination and delivery':section.id==='$unknown'?'Attribution uncertain':section.id+' · '+owner));
  if(section.document){const raw=element('details');raw.append(localized(element('summary'),'查看这份派单原文','View assignment source'),element('blockquote',section.document.text));card.append(raw);}
  if(!section.risks.length)card.append(localized(element('p',undefined,'risk-badge quiet-risk'),'当前映射未检出这些风险，仍需核对语义。','No checked risk found in this mapping; semantics still require review.'));
  for(const risk of section.risks){
   const block=element('section',undefined,'task-risk '+risk.severity);const severity={structural:['结构异常','Structural issue'],attention:['需核对','Needs review'],unknown:['待明确','Unknown']}[risk.severity];
   block.append(localized(element('span',undefined,'risk-badge'),severity[0],severity[1]),localized(element('h3'),'风险点：'+risk.title.zh,'Risk: '+risk.title.en));
   if(risk.quotes.length)block.append(element('blockquote',risk.quotes[0]));
   if(risk.incomplete)block.append(localized(element('p'),'先核对这份派单已有说明；缺少映射不是已经越界。','Check the assignment source first; missing mappings are not a scope violation.'));
   block.append(localized(element('strong'),'给 PM 的建议：'+risk.suggestion.zh,'Recommendation to PM: '+risk.suggestion.en));
   if(risk.quotes.length>1){const more=element('details');more.append(localized(element('summary'),`另有 ${risk.quotes.length-1} 处对应原句`,`${risk.quotes.length-1} additional source excerpts`));for(const q of risk.quotes.slice(1))more.append(element('blockquote',q));block.append(more);}
   card.append(block);
  }host.append(card);
 }
}
function renderReview(entry){
  currentReview=entry;const host=$('results');host.replaceChildren();$('reminder-box').hidden=!entry||entry.kind!=='plan';if(!entry)return;
  if(entry.kind==='plan')renderAssignmentResults(host,entry);
  const calculations=element('details');calculations.append(element('summary','查看技术详情 / View technical details'));host.append(calculations);const evidenceHost=calculations;
  for(const note of entry.notes??[])evidenceHost.append(element('p',note,'mapping-note'));
  const gaps=element('details');const gapCount=entry.review.findings.filter(f=>['parameter_unmapped','projection_incomplete'].includes(f.kind)).length;
  gaps.append(element('summary',`展开 ${gapCount} 项映射缺口与补充建议`));
  if(!entry.review.findings.length)evidenceHost.append(element('p','当前映射范围内未发现这些结构异常。仍需核查语义、证据、权限与未映射部分。'));
  for(const finding of entry.review.findings){
    const card=element('article',undefined,'finding');card.append(element('h3',titles[finding.kind]??finding.kind),element('span',finding.location,'tag'));
    if(finding.baseline_quote)card.append(element('p','基线原句'),element('blockquote',finding.baseline_quote));
    if(finding.source_quote)card.append(element('p','当前文本'),element('blockquote',finding.source_quote));
    const english=entry.english?.findings.find(f=>f.id===finding.id);card.append(localized(element('p'),finding.basis,english?.basis??finding.basis),localized(element('p'),finding.consequence,english?.consequence??finding.consequence),localized(element('strong'),'建议：'+finding.suggestion,'Suggestion: '+(english?.suggestion??finding.suggestion)));
    if(finding.symbolic_counterexample){const detail=element('details');detail.append(element('summary','查看数学反例'),localized(element('pre'),JSON.stringify(finding.symbolic_counterexample,null,2),JSON.stringify(english?.symbolic_counterexample??finding.symbolic_counterexample,null,2)));card.append(detail);}
    if(entry.kind==='plan'){
      const old=entry.replies.find(x=>x.finding_id===finding.id);const reply=element('div',undefined,'reply');
      const select=element('select');attribute(select,'aria-label','回应立场');for(const [v,t] of [['accepted','接受建议'],['partially_accepted','部分接受'],['not_accepted','保留原安排'],['needs_admin','申请授权方澄清']]){const option=element('option',t);option.value=v;select.append(option);}select.value=old?.disposition??'accepted';
      const reason=element('textarea');attribute(reason,'placeholder','填写或粘贴负责人理由。仅“收到”不算完整回应。');reason.value=old?.reason??'';attribute(reason,'aria-label','回应理由');
      const ref=input(old?.references.join('\n')??'','依据、修订原句或澄清申请位置',()=>{});
      const status=element('p',old?'已记录回应；是否解决仍未裁决。':'尚未记录回应。');
      reply.append(select,reason,ref,button('记录回应',action(async()=>{
        const value={finding_id:finding.id,disposition:select.value,reason:reason.value,references:ref.value.split('\n').filter(Boolean)};
        const replies=[...entry.replies.filter(x=>x.finding_id!==finding.id),value];const r=await api('replies',{review:entry.review,replies});entry.replies=replies;entry.responseStatus=r.result;
        setText(status,'已记录回应；是否解决仍未裁决。');audit('记录回应',finding.id.slice(0,10));notice(`仍有 ${r.result.pending_finding_ids.length} 项未完整回应。`);
      })),status);card.append(reply);
    }if(['parameter_unmapped','projection_incomplete'].includes(finding.kind))gaps.append(card);else evidenceHost.append(card);
  }
  if(gapCount)evidenceHost.append(gaps);
  if(entry.previous){const detail=element('details');detail.append(element('summary',`相较上一版规划另有 ${entry.previous.findings.length} 项观察（非新问题计数）`));for(const f of entry.previous.findings)detail.append(element('p',`${titles[f.kind]??f.kind}：${f.source_quote||f.basis}`));evidenceHost.append(detail);}
  if(entry.kind==='plan')editable($('reminder'),l=>taskReminder(entry.input,entry.review,l));
}
$('copy-reminder').onclick=action(async()=>{await navigator.clipboard.writeText($('reminder').value);notice('提醒已复制。');});
$('recheck-pm').onclick=action(async()=>{
 if(!currentReview||currentReview.kind!=='plan')throw Error('请先计算规划差异。');
 if(JSON.stringify(currentReview.baseline.document)!==JSON.stringify(baseline())||$('pm-task-source').value!==baseline().text)throw Error('任务已变更，请先重新确认任务并测试 PM。 / The task changed; confirm it and run a new PM test.');
 const original=currentReview,attempt={time:new Date().toISOString(),reminder:$('reminder').value,status:'pending'};
 (original.followUps??=[]).push(attempt);
 try{
  const r=await api('pm',{mode:'recheck',text:original.baseline.document.text,plan:original.input.document.text,reminder:attempt.reminder,config:connectedConfig()});
  attempt.reply=r.text;attempt.status='received';recordCall('PM 提醒后复核',r);setPMText(r.text);
  await analyzeGenerated(r.text,{before:clone(original.input),beforeReview:clone(original.review),reminder:attempt.reminder,reply:r.text,time:attempt.time});attempt.status='compared';
 }catch(error){attempt.status=attempt.reply?'received_not_compared':'failed';renderReview(original);page('plan');throw error;}
});
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=element('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
function snapshot(){return {...clone(state),draftTexts:{task:$('task-source').value,plan:$('plan-source').value,pmTask:$('pm-task-source').value,suggestion:$('suggested-task')?.value??null,reminder:$('reminder').value}};}
$('save').onclick=action(async()=>{download('BoundX-record-'+Date.now()+'.json',JSON.stringify(snapshot(),null,2),'application/json');notice('记录已下载，包含任务文本与模型答复，不含配置和密钥。');});
$('report').onclick=action(async()=>{
 let text='# '+pick('界痕任务边界报告','BoundX report')+'\n\n'+pick('建议不构成授权；原始证据保持原语言。','Recommendations do not grant authority; source evidence retains its original language.')+'\n\n';
 text+='## '+pick('测试任务原文','Test task source')+'\n\n'+(state.baseline?.document.text??$('task-source').value)+'\n\n';
 if(state.task)text+='## '+pick('建议的完整任务文本','Suggested complete task')+'\n\n'+($('suggested-task')?.value??completeTask(state.task,locale.language))+'\n\n';
 for(const entry of state.reviews){
  if(entry.kind==='plan'){text+='## '+pick('逐任务风险与提醒后的变化','Per-task risks and observed revisions')+'\n\n'+followUpText(entry,locale.language)+'\n\n'+taskReminder(entry.input,entry.review,locale.language)+'\n\n';const c=conclusion(entry.review);text+='## '+pick('结论与建议','Conclusion and recommendations')+'\n\n'+pick(c.zh,c.en)+'\n\n'+planAdvice(entry.review).map(s=>pick(s.suggestion,s.en.suggestion)).join('\n\n')+'\n\n';}
  for(const f of (locale.language==='en'?entry.english??entry.review:entry.review).findings)text+=`### ${t(titles[f.kind]??f.kind)}\n\n${t('基线原句')}: ${f.baseline_quote??'—'}\n\n${t('当前文本')}: ${f.source_quote??'—'}\n\n${f.basis}\n\n${f.suggestion}\n\n`;
  for(const r of entry.replies)text+=`${t('记录回应')} ${r.finding_id}: ${r.disposition}; ${r.reason}; ${r.references.join('; ')}\n\n`;
 }
 download('BoundX-report.md',text,'text/markdown');
});
$('import').onchange=action(async()=>{
  const file=$('import').files[0];if(!file)return;if(file.size>5_000_000)throw Error('记录超过 5 MB。');const value=JSON.parse(await file.text());
  if(value.schema!=='boundx-ui/v1'||!Array.isArray(value.history)||!Array.isArray(value.reviews)||!Array.isArray(value.calls)||value.reviews.length>100)throw Error('不支持的记录格式或记录过大。');
  if(value.baseline)await api('review',{kind:'task',document:value.baseline.document});
  if(value.task)value.task=draftDocument(value.task);
  if(value.plan)value.plan=draftPlan(value.plan);
  // Recompute imported observations; imported reviews cannot masquerade as trusted calculations.
  for(const entry of value.reviews){const r=await api('review',entry.kind==='task'?{kind:'task',document:entry.input}:{kind:'plan',baseline:entry.baseline.document,plan:entry.input});entry.review=r.result;entry.english=r.english;entry.previous=null;if(entry.followUp){if(typeof entry.followUp.reminder!=='string'||typeof entry.followUp.reply!=='string')throw Error('Invalid follow-up record');const old=await api('review',{kind:'plan',baseline:entry.baseline.document,plan:entry.followUp.before});entry.followUp.beforeReview=old.result;entry.followUp.imported=true;}await api('replies',{review:entry.review,replies:entry.replies});}
  state={schema:value.schema,task:value.task,baseline:value.baseline,plan:value.plan,taskNotes:value.taskNotes??[],planNotes:value.planNotes??[],history:value.history,calls:value.calls,reviews:value.reviews};
  $('task-editor').replaceChildren();$('plan-editor').replaceChildren();$('task-bottom').hidden=true;$('plan-bottom').hidden=true;
  clearBxpResult();renderTask();renderPlan();baselineDisplay();renderReview(state.reviews.at(-1));$('task-source').value=value.draftTexts?.task??state.task?.text??'';$('plan-source').value=value.draftTexts?.plan??state.plan?.document.text??'';
  if(state.task)state.task.text=$('task-source').value;if(state.plan)state.plan.document.text=$('plan-source').value;
  $('pm-task-source').value=value.draftTexts?.pmTask??value.baseline?.document.text??'';
  if(typeof value.draftTexts?.suggestion==='string'&&$('suggested-task'))$('suggested-task').value=value.draftTexts.suggestion;
  if(typeof value.draftTexts?.reminder==='string')$('reminder').value=value.draftTexts.reminder;
  audit('打开记录','重新验证计算；引用与回应保留');notice('记录已打开并重新验证。编辑中的草案需再次核对；密钥需重新填写。');
});
const exampleText='检查FCoP落地情况，检查MCP工具情况，检查SKILLS分配和使用，检查各角色权限和职责，检查轨机运行情况；请PM分解任务，团队协作完成；最后形成报告向ADMIN汇报！';
$('example').onclick=action(async()=>{
  if((state.baseline||$('task-source').value)&&!window.confirm(t('载入固定示例会替换当前记录。需要保留请先取消并保存记录。')))return;
  state={schema:'boundx-ui/v1',task:emptyDoc(exampleText),baseline:null,plan:null,history:[],reviews:[],calls:[]};
  state.task.parameters={I:'检查FCoP落地情况，检查MCP工具情况，检查SKILLS分配和使用，检查各角色权限和职责，检查轨机运行情况',O:'最后形成报告向ADMIN汇报',A:'检查',P:'请PM分解任务，团队协作完成',C:'最后形成报告向ADMIN汇报'};
  state.task.actions=[{actor:'PM',verb:'检查',target:'五项检查',quote:state.task.parameters.I},{actor:'PM',verb:'汇报',target:'ADMIN',quote:state.task.parameters.O}];state.task.completion=[{id:'report',quote:state.task.parameters.C}];
  renderTask();$('plan-editor').replaceChildren();$('plan-source').value='';$('pm-task-source').value='';$('plan-bottom').hidden=true;renderReview(null);baselineDisplay();audit('固定示例','人工预设映射，不是模型现场分析');notice('已载入固定巡检示例，映射仅供体验。先核对，再保存为基线。');page('task');
});

function bindStatic(){
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode()){const node=walker.currentNode;if(node.parentElement.closest('script,textarea,#language'))continue;if(node.data.trim())nodes.push(node);}
 for(const node of nodes){const source=node.data;locale.bind(node,()=>t(source));}
 for(const node of document.querySelectorAll('[placeholder],[aria-label]')){if(node.id==='language')continue;for(const key of ['placeholder','aria-label'])if(node.hasAttribute(key))attribute(node,key,node.getAttribute(key));}
}
bindStatic();
$('language').value=locale.language;document.documentElement.lang=locale.language;
$('language').onchange=()=>{locale.set($('language').value);document.documentElement.lang=locale.language;try{localStorage.setItem('boundx-language',locale.language);}catch{}};

baselineDisplay();
connectionDisplay('请先测试连接，再测试 PM。 / Test the connection before testing PM.');
