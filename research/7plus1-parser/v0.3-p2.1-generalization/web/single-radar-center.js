/**
 * BoundaryXP 单文本中央雷达组件。源于 v0.2 图形方法与画布。
 * 只挂载到传入的 SVG；不创建页面、标题栏、按钮、左右面板或日志。
 * 已有结果只读；不调用模型，不计算父子关系，不改业务数据。
 * 父子视图复用几何投影，状态仅转呈保存结果。
 */
import { projectSingleResult } from './single-radar-project.js';
let instanceSequence=0;
const mountedRoots=new WeakSet();
const CHART_STYLES="svg[data-bx-radar-center]{isolation:isolate;font-family:\"Noto Sans CJK SC\",\"Microsoft YaHei\",\"PingFang SC\",sans-serif}\nsvg[data-bx-radar-center] .axis-label{cursor:pointer}\nsvg[data-bx-radar-center] .axis-label .label-bg{fill:transparent;stroke:transparent}\nsvg[data-bx-radar-center] .axis-label:hover .label-bg{fill:#f3f8fc;stroke:#e5edf4}\nsvg[data-bx-radar-center] .axis-label.selected .label-bg{fill:#f0fafb;stroke:#c3e7eb}\nsvg[data-bx-radar-center] .axis-label:focus{outline:none}\nsvg[data-bx-radar-center] .axis-label:focus .label-bg{stroke:#3569d4;stroke-width:2}\nsvg[data-bx-radar-center] .axis-name{font-size:17px;font-weight:700;fill:#163047}\nsvg[data-bx-radar-center] .axis-excerpt{font-size:15px;fill:#4c657a}\nsvg[data-bx-radar-center] .axis-foot{font-size:10px;fill:#73889a}\nsvg[data-bx-radar-center] .axis-code{font-size:15px;font-weight:750}\nsvg[data-bx-radar-center] .inactive .axis-name{fill:#667d90}\nsvg[data-bx-radar-center] .inactive .axis-excerpt{fill:#8294a3}\nsvg[data-bx-radar-center] .axis-label.inactive{opacity:.61}\nsvg[data-bx-radar-center] .axis-label.selected .axis-name{fill:#078c9f}\nsvg[data-bx-radar-center] text{font-family:inherit}\n";
const cloneView=value=>JSON.parse(JSON.stringify(value));
export function createSingleRadar(root,options={}){
  if(!root||root.namespaceURI!=='http://www.w3.org/2000/svg'||root.localName!=='svg')throw new TypeError('需要传入既有中央绘图区内的 SVG 元素');
  if(mountedRoots.has(root))throw new Error('该SVG已有中央雷达实例，请复用或先销毁');
  mountedRoots.add(root);
  const originalChildren=Array.from(root.childNodes);
  const changedAttrs=['data-bx-radar-center','viewBox','role','aria-labelledby','preserveAspectRatio','data-density'];
  const originalAttrs=new Map(changedAttrs.map(k=>[k,root.getAttribute(k)]));
  const uid='bx-radar-center-'+(++instanceSequence);
  const assertLive=()=>{if(destroyed)throw new Error('组件已销毁');};
  const el=(tag,attrs={},text='')=>{const n=root.ownerDocument.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;};
  root.setAttribute('data-bx-radar-center','');root.setAttribute('viewBox','0 0 1000 716');root.setAttribute('role','img');root.setAttribute('aria-labelledby',uid+'-title '+uid+'-desc');root.setAttribute('preserveAspectRatio','xMidYMid meet');
  let input=null,projection=null,annotations={},destroyed=false;
  let compact=root.getBoundingClientRect().width<700;
  const resizeObserver=new ResizeObserver(()=>{const next=root.getBoundingClientRect().width<700;if(next!==compact){compact=next;render();}});resizeObserver.observe(root);
  const state={mode:'overview',axis:null,clause:null,background:true,page:0};
  const current=()=>projection?.clauses.find(c=>c.id===state.clause);
  const relevantClauses=()=>state.mode==='clause'?(current()?[current()]:[]):state.mode==='dimension'?projection.clauses.filter(c=>c.axes.includes(state.axis)):projection.clauses;
  const viewLabel=()=>state.mode==='overview'?'任务总览':state.mode==='dimension'?state.axis+' · 维度聚焦':state.clause+' · 条款聚焦';
  function emit(){if(typeof options.onSelect==='function')options.onSelect({type:'bxradar-select',mode:state.mode,axis:state.axis,clause_id:state.clause,clause_ids:relevantClauses().map(c=>c.id),task_id:input.task_id,result_ref:cloneView(input.result_ref||{})});}
  function focusAxis(axis){assertLive();if(!projection||!projection.axes.some(a=>a.id===axis))throw new Error('无效维度');if(state.mode==='dimension'&&state.axis===axis)return reset();state.mode='dimension';state.axis=axis;state.clause=null;state.page=0;render();emit();}
  function focusClause(id){assertLive();if(!projection||!projection.clauses.some(c=>c.id===id))throw new Error('无效或未映射条款');state.mode='clause';state.clause=id;state.axis=null;state.page=0;render();emit();}
  function reset(){assertLive();if(!projection)return;state.mode='overview';state.axis=null;state.clause=null;state.page=0;render();emit();}
  function checkAnnotations(candidate,p){
    if(!candidate||typeof candidate!=='object')return {};
    // 注释只能引用该结果中同轴条款的原文子串，不将语义摘要写回结果。
    const a={axes:{},focus:{}};
    for(const [axis,item]of Object.entries(candidate.axes||{})){
      const c=p.clauses.find(c=>c.id===item.clause_id&&c.axes.includes(axis));
      if(c&&Array.isArray(item.lines)&&item.lines.every(t=>typeof t==='string'&&c.text.includes(t)))a.axes[axis]=cloneView(item);
    }
    for(const [id,byAxis]of Object.entries(candidate.focus||{})){
      const c=p.clauses.find(c=>c.id===id);if(!c)continue;
      for(const [axis,item]of Object.entries(byAxis))if(c.axes.includes(axis)&&Array.isArray(item.lines)&&item.lines.every(t=>typeof t==='string'&&c.text.includes(t))){a.focus[id]??={};a.focus[id][axis]=cloneView(item);}
    }
    return a;
  }
function shapeKey(g){return String(g.axis_mask)}
function shapePoints(g){return g.geometry.points.map(p=>[500+210*p.x,335+210*p.y]);}
function svgShape(g,attrs={}){const ps=shapePoints(g),kind=g.geometry.primitive;if(kind==='point')return el('circle',{cx:ps[0][0],cy:ps[0][1],r:6,...attrs});if(kind==='segment')return el('line',{x1:ps[0][0],y1:ps[0][1],x2:ps[1][0],y2:ps[1][1],...attrs});return el('polygon',{points:ps.map(p=>p.join(',')).join(' '),...attrs});}
function allEdges(groups){const map=new Map();for(const g of groups){const p=shapePoints(g);if(p.length===1)continue;const end=g.geometry.closed?p.length:p.length-1;for(let i=0;i<end;i++){const a=p[i],b=p[(i+1)%p.length],key=[a.join(','),b.join(',')].sort().join('|');if(!map.has(key))map.set(key,[a,b]);}}return [...map.values()];}
function splitSvgText(text,max=22,maxLines=2){const chars=Array.from(String(text)),lines=[];let line='',width=0;for(const c of chars){let w=/[\x00-\xff]/.test(c)?.55:1;if(width+w>max){lines.push(line);line='';width=0;if(lines.length===maxLines){lines[maxLines-1]=lines[maxLines-1].slice(0,-1)+'…';return lines;}}line+=c;width+=w;}if(line)lines.push(line);return lines;}
function labelContent(axis){const focused=state.mode==='clause'?current():null; if(focused&&focused.axes.includes(axis)){const f=annotations.focus?.[focused.id]?.[axis];return f||{lines:[focused.text],ref:`${focused.id} · 条款节选，条件见全文`};} const anno=annotations.axes?.[axis];if(anno)return anno;const c=projection.clauses.find(c=>c.axes.includes(axis));if(!c)return {lines:['没有已映射条款'],ref:'非未明示判定'};return {lines:splitSvgText(c.text,21,2),ref:`${c.id} · 条款节选，条件见全文`};}
function treeLabelContent(axis){
 const c=current(),ctx=input.display_context;
 if(c&&c.axes.includes(axis))return {lines:[c.text],ref:`${c.node_label} · ${c.display_id}`};
 if(ctx.comparison){const s=ctx.statuses[axis];return {lines:[ctx.labels[s]??s],ref:'点击查看依据'};}
 const first=projection.clauses.find(c=>c.axes.includes(axis));
 return first?{lines:[first.text],ref:`${first.display_id} · 条款节选`}:{lines:['没有已映射条款'],ref:'点击查看依据'};
}
const statusColor=s=>s==='VIOLATED'?'#df4f61':['UNRESOLVED','PENDING_COVERAGE'].includes(s)?'#b88016':['STALE','NOT_RUN','NOT_APPLICABLE','UNSTATED'].includes(s)?'#98a8bd':'#3267eb';
// 锚点只控制文字排版；真正内容顶点在统一R=210上，八轴顺序不变。
const ANCHORS={I:{x:355,y:11,w:290,h:97,align:'middle'},O:{x:737,y:108,w:248,h:114},A:{x:750,y:277,w:240,h:126},P:{x:737,y:465,w:248,h:126},R:{x:339,y:570,w:322,h:103,align:'middle'},V:{x:15,y:465,w:248,h:126,align:'end'},C:{x:10,y:277,w:240,h:126,align:'end'},B:{x:15,y:108,w:248,h:126,align:'end'}};
function drawRadar(){const svg=root;svg.setAttribute('data-density',compact?'compact':'normal');svg.replaceChildren();svg.append(el('title',{id:uid+'-title'},`${input.task_id} · ${viewLabel()} · 7+1关联雷达`));svg.append(el('desc',{id:uid+'-desc'},'八轴固定，顶点半径一致。点、线、面只表达条款维度归属，不表达数值、评分、授权或业务状态。轴旁为条款节选，完整条件通过宿主既有条款详情查看。'));
svg.append(el('metadata',{},JSON.stringify({task:input.task_id,result_ref:input.result_ref,source_ref:input.source_ref,view_spec_version:projection.view_spec_version,component_version:'bxradar.center/0.2.1',view:{...state},presentation:'仅中央雷达组件／只读投影／非授权'})));
const defs=el('defs');const grad=el('radialGradient',{id:uid+'-paper'});grad.append(el('stop',{offset:'0%','stop-color':'#f4fafe'}),el('stop',{offset:'100%','stop-color':'#ffffff'}));defs.append(grad);svg.append(defs);
svg.append(el('circle',{cx:500,cy:335,r:247,fill:`url(#${uid}-paper)`}));
for(const r of[.36,.68,1]){const ps=projection.axes.map(a=>`${500+210*r*a.x},${335+210*r*a.y}`).join(' ');svg.append(el('polygon',{points:ps,fill:'none',stroke:r===1?'#b6c8d7':'#e5edf3','stroke-width':r===1?1.15:.85,'stroke-dasharray':r===1?'4 6':'none'}));}
for(const a of projection.axes){svg.append(el('line',{x1:500,y1:335,x2:500+210*a.x,y2:335+210*a.y,stroke:'#dde8f0','stroke-width':.9}));}
let groups=projection.groups;
if(input.display_context?.comparison){
 const parent=projectSingleResult({...input,clauses:input.clauses.filter(c=>c.layer==='parent')});
 groups=projectSingleResult({...input,clauses:input.clauses.filter(c=>c.layer!=='parent')}).groups;
 if(state.background)for(const g of parent.groups)svg.append(svgShape(g,{fill:'none',stroke:'#8198b8','stroke-width':1.5,'stroke-dasharray':'5 6','stroke-opacity':.55,'data-parent-mask':g.axis_mask}));
}
const chosen=state.mode==='clause'?current():null;
const focus=state.mode==='clause'?[{...chosen,clause_ids:[chosen.id]}]:state.mode==='dimension'?groups.filter(g=>g.axes.includes(state.axis)):[];
const filtered=state.mode==='dimension'?focus:groups;const pageGroups=input.display_context?.tree?filtered:filtered.slice(state.page*12,state.page*12+12);
const backgroundGroups=state.mode==='overview'?pageGroups:(state.background?(input.display_context?.tree?groups:groups.slice(0,12)):[]);
// 不叠加相同几何边；浅填充总透明度受控，深浅不映射任何业务量。
if(state.background||state.mode!=='overview'){
 const faces=backgroundGroups.filter(g=>g.geometry.filled);
 // 没有面时，关联线仍是任务内容，不应淡化成背景网格。保持原有几何，不补造填充面。
 const sparseOverview=state.mode==='overview'&&!input.display_context?.comparison&&faces.length===0;
 for(const g of faces)svg.append(svgShape(g,{fill:'#3569d4','fill-opacity':faces.length?(.085/faces.length):0,stroke:'none','data-background-mask':shapeKey(g)}));
 for(const[a,b]of allEdges(backgroundGroups))svg.append(el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'#5c8bbd','stroke-width':sparseOverview?2:1,'stroke-opacity':sparseOverview?.85:state.mode==='overview'?.28:.10}));
}
if(state.mode==='dimension'){const faces=pageGroups.filter(g=>g.geometry.filled);for(const g of faces)svg.append(svgShape(g,{fill:'#078c9f','fill-opacity':faces.length?.12/faces.length:0,stroke:'none','data-axis-mask':shapeKey(g)}));for(const[a,b]of allEdges(pageGroups))svg.append(el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'#078c9f','stroke-width':1.7,'stroke-opacity':.65}));}
if(chosen){const n=svgShape(chosen,{fill:chosen.geometry.filled?'#078c9f':'none','fill-opacity':.14,stroke:'#078c9f','stroke-width':2.6,'stroke-linejoin':'round','stroke-linecap':'round','data-focus-primitive':chosen.geometry.primitive});svg.append(n);}
const activeAxes=new Set(chosen?chosen.axes:state.mode==='dimension'?[state.axis]:projection.axes.filter(a=>a.count).map(a=>a.id));
for(const a of projection.axes){const x=500+210*a.x,y=335+210*a.y,on=activeAxes.has(a.id),col=state.mode==='overview'?'#4478b3':on?'#078c9f':'#b6c6d4';svg.append(el('circle',{cx:x,cy:y,r:on&&state.mode!=='overview'?13:10,fill:on&&state.mode!=='overview'?'#e0f2f4':'#f5f9fc',stroke:'none'}));svg.append(el('circle',{cx:x,cy:y,r:on&&state.mode!=='overview'?5:4,fill:a.count?col:'#fff',stroke:col,'stroke-width':1.5,'data-axis-node':a.id}));}
// 中心身份浮层不是数值或几何顶点。
const cent=el('g',{'aria-hidden':'true'});cent.setAttribute('data-reset','');cent.setAttribute('role','button');cent.setAttribute('tabindex','0');cent.setAttribute('aria-label','返回任务总览');cent.removeAttribute('aria-hidden');cent.setAttribute('cursor','pointer');cent.onclick=()=>reset();cent.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();reset();}};cent.append(el('circle',{cx:500,cy:322,r:51,fill:'#fff','fill-opacity':.96,stroke:'#e1edf3','stroke-width':1}));cent.append(el('text',{x:500,y:303,'text-anchor':'middle','font-size':10,fill:'#698397'},state.mode==='overview'?'任务总览':state.mode==='dimension'?'维度聚焦':'条款聚焦'));
cent.append(el('text',{x:500,y:330,'text-anchor':'middle','font-size':state.mode==='overview'?25:24,'font-weight':650,fill:state.mode==='overview'?'#264e6b':'#078c9f'},state.mode==='overview'?`${projection.clause_count}`:state.mode==='dimension'?state.axis:state.clause));cent.append(el('text',{x:500,y:349,'text-anchor':'middle','font-size':10,fill:'#6e8598'},state.mode==='overview'?'条边界':state.mode==='dimension'?`${relevantClauses().length}条关联`:`${chosen.axes.length}维关联`));svg.append(cent);
for(const a of projection.axes){const p=ANCHORS[a.id],selected=state.mode==='dimension'?a.id===state.axis:chosen?.axes.includes(a.id),inactive=state.mode!=='overview'&&!selected;const g=el('g',{class:`axis-label ${selected?'selected':''} ${inactive?'inactive':''}`,role:'button',tabindex:0,'aria-label':`${a.id} ${a.title}，${a.count}条关联`,'data-axis':a.id});const align=p.align||'start',tx=align==='middle'?p.x+p.w/2:align==='end'?p.x+p.w-14:p.x+14;g.append(el('rect',{x:p.x,y:p.y,width:p.w,height:p.h,rx:12,class:'label-bg'}));
let nx=500+210*a.x,ny=335+210*a.y;let lx,ly;if(a.id==='I'){lx=500;ly=p.y+p.h+3;}else if(a.id==='R'){lx=500;ly=p.y-5;}else {lx=align==='end'?p.x+p.w+8:p.x-8;ly=p.y+47;}svg.append(el('line',{x1:nx,y1:ny,x2:lx,y2:ly,stroke:selected?'#a2d2dc':'#dce6ed','stroke-width':1}));
const t=el('text',{x:tx,y:p.y+27,'text-anchor':align==='start'?'start':align,class:'axis-name'});t.append(el('tspan',{class:'axis-code',style:a.id==='B'?'fill:#a76416':'',fill:a.id==='B'?'#a76416':selected?'#078c9f':'#3b6a9c'},a.id==='B'?'+1  B  ':a.id+'  '),el('tspan',{},a.title));g.append(t);
const c=labelContent(a.id);let lns=(c.lines||[]).flatMap(s=>splitSvgText(s,compact?(p.w>280?14:10):(p.w>280?19:15),3)).slice(0,compact||p.h<110?2:3);lns.forEach((line,i)=>g.append(el('text',{x:tx,y:p.y+51+i*(compact?23:19),'text-anchor':align==='start'?'start':align,class:'axis-excerpt'},line)));
const lastY=compact?p.y+p.h-3:Math.min(p.y+p.h-10,p.y+51+lns.length*19+2);g.append(el('text',{x:tx,y:lastY,'text-anchor':align==='start'?'start':align,class:'axis-foot'},compact?`${a.count}条 · ${c.ref?.split(' · ')[0]??''} · 节选`:`${state.mode==='clause'&&selected?`全维度${a.count}条`:`${a.count}条关联`} · ${c.ref||'点击查看'}`));g.onclick=()=>focusAxis(a.id);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focusAxis(a.id);}};svg.append(g);}
}

  function render(){
    if(destroyed)throw new Error('组件已销毁');if(!projection)return;
    drawRadar();
    if(input.display_context?.tree){
      const ctx=input.display_context;
      for(const a of projection.axes){
        const g=root.querySelector(`[data-axis="${a.id}"]`),p=ANCHORS[a.id],align=p.align||'start',tx=align==='middle'?p.x+p.w/2:align==='end'?p.x+p.w-14:p.x+14;
        g.querySelectorAll('.axis-excerpt,.axis-foot').forEach(n=>n.remove());
        const c=treeLabelContent(a.id),col=ctx.comparison?statusColor(ctx.statuses[a.id]):'#4c657a';
        (c.lines||[]).flatMap(t=>splitSvgText(t,compact?(p.w>280?14:10):(p.w>280?19:15),2)).slice(0,2).forEach((line,i)=>g.append(el('text',{x:tx,y:p.y+53+i*(compact?23:19),'text-anchor':align,'font-size':compact?21:15,fill:col},line)));
        g.append(el('text',{x:tx,y:p.y+p.h-5,'text-anchor':align,class:'axis-foot'},compact&&state.mode==='clause'?current().display_id+' · 条款节选':c.ref));
        if(ctx.comparison){const marker=root.querySelector(`[data-axis-node="${a.id}"]`);if(state.mode==='overview'){marker.setAttribute('fill',col);marker.setAttribute('stroke',col);}marker.setAttribute('data-comparison-status',ctx.statuses[a.id]);}
      }
      const texts=root.querySelector('[data-reset]').querySelectorAll('text');
      texts[0].textContent=state.mode==='overview'?ctx.title:state.mode==='dimension'?'维度聚焦':'条款聚焦';
      if(state.mode==='clause')texts[1].textContent=current()?.display_id??state.clause;
      root.append(el('text',{x:500,y:690,'text-anchor':'middle','font-size':11,fill:'#637f92'},ctx.comparison?'灰虚线：上级条款关联 · 蓝线：当前条款关联 · 节点颜色：已有比较状态':'八轴固定 · 点、线、面表示条款关联 · +1 B 独立禁止边界'));
      root.append(el('text',{x:500,y:708,'text-anchor':'middle','font-size':10,fill:'#7b8d9d'},'形状不代表越界程度；点击维度或右侧条款查看依据，点击中心返回总览。'));
      return;
    }
    const groupCount=(state.mode==='dimension'?projection.groups.filter(g=>g.axes.includes(state.axis)):projection.groups).length;
    const status=state.mode==='clause'?`${input.task_id} · ${state.clause}条款聚焦`:state.mode==='dimension'?`${input.task_id} · ${state.axis}维度聚焦`:`${input.task_id} · 任务总览`;
    root.append(el('text',{x:500,y:690,'text-anchor':'middle','font-size':11,fill:'#637f92'},status+'  ｜  八轴参考框 · 蓝线为关联 · 青色为焦点；无评分、无业务判定'));
    let note='轴旁为条款节选，完整条件见原有详情；点击中心返回总览。';
    if(groupCount>12&&state.mode!=='clause')note=`当前显示${Math.min(12,Math.max(0,groupCount-state.page*12))}/${groupCount}个结构组 · 第${state.page+1}页；分页仅改变显示。`;
    if(projection.unmapped_clause_count)note+=` ${projection.unmapped_clause_count}条未映射。`;
    root.append(el('text',{x:500,y:708,'text-anchor':'middle','font-size':10,fill:'#7b8d9d'},note));
  }
  function setResult(savedResult,displayAnnotations={}){
    if(destroyed)throw new Error('组件已销毁');
    const p=projectSingleResult(savedResult); // 先完成验证；失败不覆盖上一个已显示结果。
    input=cloneView(savedResult);projection=p;annotations=checkAnnotations(displayAnnotations,p);
    state.mode='overview';state.axis=null;state.clause=null;state.page=0;render();
  }
  const onKey=e=>{if(e.key==='Escape'){reset();}};root.addEventListener('keydown',onKey);
  const api={
    setResult,focusAxis,focusClause,reset,
    setBackground(show){assertLive();state.background=Boolean(show);render();},
    setPage(page){assertLive();if(!projection)throw new Error('未加载结果');const n=Number(page);if(!Number.isInteger(n)||n<0)throw new Error('无效页码');const total=state.mode==='dimension'?projection.groups.filter(g=>g.axes.includes(state.axis)).length:projection.groups.length;if(n>=Math.max(1,Math.ceil(total/12)))throw new Error('页码超范围');state.page=n;render();},
    getState:()=>cloneView(state),
    getProjection:()=>projection?cloneView(projection):null,
    exportSvg(){assertLive();if(!projection)throw new Error('未加载结果');const svg=root.cloneNode(true);svg.append(el('style',{},CHART_STYLES));svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width','1000');svg.setAttribute('height','716');return new root.ownerDocument.defaultView.XMLSerializer().serializeToString(svg);},
    destroy(){
      if(destroyed)return;
      destroyed=true;root.removeEventListener('keydown',onKey);resizeObserver.disconnect();
      root.replaceChildren(...originalChildren);
      for(const [name,value]of originalAttrs){if(value===null)root.removeAttribute(name);else root.setAttribute(name,value);}
      mountedRoots.delete(root);
    }
  };
  return Object.freeze(api);
}
