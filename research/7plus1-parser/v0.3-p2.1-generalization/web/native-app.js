const $=id=>document.getElementById(id);
const names={I:'输入与作用域',O:'交付与结果',A:'正向动作',P:'参与关系',R:'执行量化限制',V:'版本与依据',C:'完成与停止',B:'禁止与限制'};
const stages={QUEUED:'等待',PREPARING:'准备与版本核对',PARSING:'Codex 正在解析原文',AUDITING:'新会话正在审阅',VALIDATING:'技术校验',COMPILING:'保真编译',COMPLETED:'编译流程完成',COMPLETED_WITH_UNRESOLVED:'编译流程完成 · 含未决/缺口',FAILED:'运行失败',CANCELLING:'取消中（等待本地子进程退出）',CANCELLED:'本地请求已取消（不声称云端停止计费）',INTERRUPTED:'服务中断 · 未自动重跑'};
const errors={EMPTY_SOURCE:'请输入非空任务',SHORT_TEXT_SCOPE_EXCEEDED:'超过300码点，不会截断',SOURCE_BYTE_LIMIT:'输入字节超限',INVALID_UTF8:'文件不是有效UTF-8',CODEX_LOGIN_REQUIRED:'Codex 登录失效，请在本机重新登录',CODEX_QUOTA_OR_RATE_LIMIT:'Codex 额度或限流，未自动重试',CODEX_TIMEOUT:'本地调用超时，子进程已停止',CODEX_NETWORK_FAILURE:'网络调用失败',CODEX_MODEL_UNAVAILABLE:'请求模型不可用',COMPILER_BUSY:'已有编译正在进行',SESSION_REQUIRED:'页面会话失效，请刷新',COMPILER_ERROR:'编译失败，详情保存在本地运行目录'};
let current=null,uploaded=null,session=null,pollTimer=null,busy=false,tab='pending';
const el=(tag,value,cls)=>{const e=document.createElement(tag);if(value!==undefined)e.textContent=value;if(cls)e.className=cls;return e;};
async function api(url,options={}){const response=await fetch(url,{...options,headers:{...options.headers,...(options.method?{'x-boundx-session':session?.token??''}: {})}});const data=await response.json();if(!response.ok)throw Error(data.error??data.code);return data;}
const jsonPost=(url,data)=>api(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
function count(){const n=Array.from($('input').value).length;$('input-count').textContent=n+' / 300 码点';return n;}
function showError(e){$('status').textContent=errors[e.message]??e.message;$('status').className='failure';}
function highlight(sources){
 if(!current||!sources?.length)return;
 const chars=Array.from(current.source_text),spans=sources.filter(s=>s.source_sha256===current.source_sha256&&s.span&&Number.isInteger(s.span[0])&&s.span[0]>=0&&s.span[1]<=chars.length);
 if(!spans.length)return;
 const starts=new Set(spans.map(s=>s.span[0])),ends=new Set(spans.map(s=>s.span[1]));let text='',marked=null;const children=[];
 for(let i=0;i<=chars.length;i++){const active=spans.some(s=>i>=s.span[0]&&i<s.span[1]);if(active!==marked){if(text)children.push(marked?el('mark',text):document.createTextNode(text));text='';marked=active;}if(i<chars.length)text+=chars[i];}
 if(text)children.push(marked?el('mark',text):document.createTextNode(text));$('evidence').replaceChildren(...children);$('span-info').textContent=spans.map(s=>'['+s.span.join(', ')+') '+s.quote).join('；');
}
function record(value){$('panel').replaceChildren();for(const s of value.sources??[]){if(!s.span)continue;const b=el('button','['+s.span.join(',')+') '+s.quote,'secondary');b.onclick=()=>highlight([s]);$('panel').append(b);}$('panel').append(el('pre',JSON.stringify(value,null,2)));highlight(value.sources);}
function entry(f){
 const line=current.result.chinese.split('\n').find(l=>l.endsWith('（'+f.id+'）'));
 const b=el('button',line?.replace(/^- \[[^\]]+\] /,'').replace('（'+f.id+'）','')??JSON.stringify({kind:f.kind,event:f.event?.predicate,role:f.claim?.role,entity:f.entity?.label}),'entry');
 b.append(el('small',f.status+' · '+f.id));b.onclick=()=>record(f);return b;
}
function render(run){
 current=run;if(run.status==='LEGACY_READ_ONLY'){$('status').textContent='旧引擎历史 · 原格式只读';$('panel').replaceChildren(el('pre',JSON.stringify(run.raw,null,2)));$('slots').replaceChildren();return;}
 busy=['QUEUED','RUNNING','CANCELLING'].includes(run.status);$('parse').disabled=busy;$('cancel').disabled=!busy||run.status==='CANCELLING';$('input').readOnly=busy;$('file').disabled=busy;
 $('run-id').textContent=run.run_id+' · '+run.source_sha256;$('status').textContent=(stages[run.stage]??run.stage)+' · 已用 '+Math.round(run.elapsed_ms/1000)+' 秒'+(run.error?' · '+(errors[run.error.code]??run.error.code):'');$('status').className=run.status==='FAILED'?'failure':'';
 $('engine-info').textContent=run.engine+' · '+(run.compiler_revision??'历史编译版本，详见Trace')+' · 合同 '+run.contract+' · '+run.skill_mode+' · 请求 '+run.requested_model+' · 实际服务模型 '+(run.actual_model??'未披露');
 $('evidence').textContent=run.source_text;$('trace-colors').textContent=run.source_text;$('trace-summary').textContent='原文 → 解析Skill → Codex → 审阅Skill / 新会话 → 技术校验 → IR → 固定7+1；技术接受不是业务授权';
 $('input').value=run.source_text;uploaded=null;count();
 const result=run.result;for(const id of ['export','export-json','trace-html','trace-md','trace-json'])$(id).disabled=!result;
 $('pipeline').textContent=JSON.stringify({stages:run.stages,slot_status:run.slot_status,real_calls:run.real_calls,semantic_test:'用户运行未进行标准答案评分',native_skill_loading:run.native_skill_loading,error:run.error??null},null,2);
 if(!result){$('slots').replaceChildren();$('panel').replaceChildren();$('v03-canonical-status').textContent='本次尚无最终结果';return;}
 $('v03-canonical-status').textContent=Object.entries(result.canonical.slots).map(([s,v])=>s+': '+v.status).join(' · ');$('slots').replaceChildren();
 for(const [slot,name] of Object.entries(names)){const v=result.canonical.slots[slot],card=el('div',undefined,slot==='B'?'card b':'card'),h=el('h3');h.append(el('span',slot,'letter'),document.createTextNode(name),el('span',v.status,'badge '+(v.status==='UNRESOLVED'?'unresolved':'')));card.append(h);for(const f of v.entries)card.append(entry(f));if(!v.entries.length)card.append(el('p',v.status==='ABSENT'?'原文未明确此维边界（不等于禁止或授权）':'存在覆盖缺口或未决'));$('slots').append(card);}
 $('compiler-root').replaceChildren();
 for(const [key,title] of [['proposal','Codex 原始语义候选'],['audit','独立会话审阅'],['technical','技术校验（不是语义证明）'],['ir','Boundary IR'],['canonical','最终7+1']]){const d=el('details'),s=el('summary',title);d.append(s,el('pre',JSON.stringify(result[key],null,2)));$('compiler-root').append(d);}panel(tab);
}
function panel(kind){
 tab=kind;$('panel').replaceChildren();const r=current?.result;if(!r)return;
 if(kind==='json')return $('panel').append(el('pre',JSON.stringify(r.canonical,null,2)));
 if(kind==='diagnostics')return $('panel').append(el('pre',JSON.stringify({issues:r.ir.issues,audit_issues:r.ir.audit_issues,gaps:r.ir.gaps,technical:r.ir.technical_diagnostics},null,2)));
 if(kind==='frames')return $('panel').append(el('pre',JSON.stringify(r.proposal,null,2)));
 if(kind==='forbid'){for(const f of r.canonical.slots.B.entries)$('panel').append(entry(f));return;}
 if(kind==='retained'){for(const f of r.canonical.retained_nonprojected)$('panel').append(entry(f));return;}
 $('panel').append(el('h3','未决 / 最小澄清 / 未指定细节'));
 for(const i of r.ir.issues){const b=el('button',i.kind+'：'+i.note,'entry');b.onclick=()=>record(i);$('panel').append(b);}
 for(const i of r.ir.audit_issues){const b=el('button','审阅待确认 '+i.subject_ids.join(',')+(i.field_path?' / '+i.field_path:'')+'：'+i.reason,'entry');b.onclick=()=>record(i);$('panel').append(b);}
 for(const f of r.canonical.unresolved)$('panel').append(entry(f));
 for(const gap of r.canonical.gaps)$('panel').append(el('pre',JSON.stringify(gap,null,2)));
 const retained=r.canonical.retained_nonprojected.filter(f=>f.kind==='EVENT'&&f.event.modality==='NOT_REQUIRED');
 if(retained.length){$('panel').append(el('h3','明确无义务（不等于禁止或新增许可）'));for(const f of retained)$('panel').append(entry(f));}
 if(!r.ir.issues.length&&!r.ir.audit_issues.length&&!r.canonical.unresolved.length&&!r.canonical.gaps.length)$('panel').append(el('p','本次没有记录到未决或覆盖缺口；不保证模型永不误解。'));
}
async function history(){
 const rows=await api('/api/runs');$('history').replaceChildren();
 for(const row of rows){const b=el('button',(row.created_at??'旧历史')+' · '+row.status+'\n'+row.summary);b.onclick=async()=>{try{if(row.run_id.startsWith('legacy:'))return render(await api('/api/legacy/'+row.run_id.slice(7)));await open(row.run_id);}catch(e){showError(e);}};$('history').append(b);}
}
async function open(id){
 clearTimeout(pollTimer);const run=await api('/api/runs/'+id);render(run);
 if(busy){localStorage.setItem('boundx029-active',id);pollTimer=setTimeout(()=>open(id).catch(showError),1000);}
 else{localStorage.removeItem('boundx029-active');localStorage.removeItem('boundx029-pending');await history();}
}
$('parse').onclick=async()=>{
 if(busy)return;const n=count();if(!n||!$('input').value.replaceAll('\uFEFF','').trim())return showError(Error('EMPTY_SOURCE'));if(n>300)return showError(Error('SHORT_TEXT_SCOPE_EXCEEDED'));
 busy=true;$('parse').disabled=true;
 const sourcePayload=uploaded??{text:$('input').value},pending=JSON.parse(localStorage.getItem('boundx029-pending')??'null');
 const payload=pending&&(pending.text===sourcePayload.text&&pending.base64===sourcePayload.base64)?pending:{...sourcePayload,request_id:crypto.randomUUID()};localStorage.setItem('boundx029-pending',JSON.stringify(payload));
 try{const run=await jsonPost('/api/parse',payload);localStorage.setItem('boundx029-active',run.run_id);await open(run.run_id);}
 catch(e){busy=false;$('parse').disabled=false;showError(e);}
};
$('cancel').onclick=async()=>{if(!current||!busy)return;try{render(await jsonPost('/api/runs/'+current.run_id+'/cancel',{}));await open(current.run_id);}catch(e){showError(e);}};
$('input').oninput=()=>{uploaded=null;count();};$('clear').onclick=()=>{if(busy)return;$('input').value='';uploaded=null;count();};
$('file').onchange=async()=>{
 try{const f=$('file').files[0];if(!f)return;if(!/\.(txt|md)$/i.test(f.name))throw Error('仅支持txt/md');if(f.size>4096)throw Error('SOURCE_BYTE_LIMIT');const bytes=new Uint8Array(await f.arrayBuffer());const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes);if(Array.from(text).length>300)throw Error('SHORT_TEXT_SCOPE_EXCEEDED');$('input').value=text;uploaded={filename:f.name,base64:btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''))};count();}
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
async function boot(){session=await api('/api/session');$('engine-info').textContent=session.engine+' · '+session.contract+' · '+session.skill_mode+' · 实际模型未披露';await history();let id=localStorage.getItem('boundx029-active');if(!id){const pending=JSON.parse(localStorage.getItem('boundx029-pending')??'null');if(pending){id=(await api('/api/runs')).find(r=>r.request_id===pending.request_id)?.run_id;if(!id){$('input').value=pending.text??'';count();}}}if(id)await open(id);}
boot().catch(showError);
