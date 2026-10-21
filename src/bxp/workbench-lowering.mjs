// A bounded, source-accountable grammar, not a verdict classifier.
// Parse complete expressions, resolve typed identities, then use the existing Core.
// Unknown syntax and ambiguous bindings remain diagnostics. No model or I/O here.
import {ancestors} from './workbench-model.mjs';
import {stable,units,dimension} from './ir-kernel/values.mjs';
export const LOWERING_VERSION='reviewed-clause-grammar/2';
const unitNames={元:'CNY',人民币:'CNY',CNY:'CNY',美元:'USD',USD:'USD',秒:'second',分钟:'minute',小时:'hour',毫秒:'ms',second:'second',minute:'minute',hour:'hour',次:'count',个:'count',count:'count'};
const number='-?\\d+(?:\\.\\d+)?',unit='('+Object.keys(unitNames).join('|')+')';
const operators={'不得超过':'<=','不超过':'<=','至多':'<=','最多':'<=','上限为':'<=','小于':'<','低于':'<','至少':'>=','不低于':'>=','不得少于':'>=','大于':'>','超过':'>','确定为':'=','等于':'=','为':'=','≤':'<=','<=':'<=','<':'<','≥':'>=','>=':'>=','>':'>','=':'='};
const op=Object.keys(operators).sort((a,b)=>b.length-a.length).join('|');
const quant=new RegExp(`^(?:将)?(.+?)\\s*(${op})\\s*(${number})\\s*${unit}$`);
const range=new RegExp(`^(${number})\\s*(<|≤|<=)\\s*([^<≤]+?)\\s*(<|≤|<=)\\s*(${number})\\s*${unit}$`);
const punctuation=s=>s.trim().replace(/[。；;]+$/u,'').trim();
const atom=s=>typeof s==='string'&&s.trim()&&!/[{}=<>≤≥;；。→∧∨()（）]/u.test(s)&&s.length<160;
const typeUnit=u=>['second','minute','hour','ms'].includes(u)?'TIME':['CNY','USD'].includes(u)?'MONEY':'COUNT';
export const knownUnitDimension=u=>Object.values(unitNames).includes(u)?typeUnit(u):Object.hasOwn(units,u)?dimension(u):null;
const edge=(value,inclusive=true)=>({value,inclusive});
function interval(operator,value){return {lower:['=','>','>='].includes(operator)?edge(value,operator!=='>'):null,upper:['=','<','<='].includes(operator)?edge(value,operator!=='<'):null};}
function list(s){const values=s.split(/[,，、]/u).map(x=>x.trim()).filter(Boolean);return values.length&&values.every(v=>atom(v)&&!/[且或和与]|\b(?:and|or)\b/iu.test(v))?[...new Set(values)]:null;}
function boolean(s){
 s=s.trim();if(s==='true'||s==='false')return s==='true';
 if(s.startsWith('(')&&s.endsWith(')'))return boolean(s.slice(1,-1));
 for(const [sep,key]of [['||','any'],['∨','any'],['或','any'],['&&','all'],['∧','all'],['且','all']]){
  let depth=0,start=0,parts=[];for(let i=0;i<s.length;i++){if(s[i]==='(')depth++;if(s[i]===')')depth--;if(depth===0&&s.startsWith(sep,i)){parts.push(s.slice(start,i));start=i+sep.length;i+=sep.length-1;}}
  if(parts.length){parts.push(s.slice(start));const xs=parts.map(boolean);return xs.every(x=>x!==null)?{[key]:xs}:null;}
 }
 if(s.startsWith('!')||s.startsWith('¬')){const b=boolean(s.slice(1));return b===null?null:{not:b};}
 return atom(s)?{var:s}:null;
}
// Split at statement separators only, never inside sets or grouped expressions.
function statements(text){let depth=0,start=0,out=[];for(let i=0;i<text.length;i++){
 const c=text[i];if('{(['.includes(c))depth++;if('})]'.includes(c))depth--;if(depth<0)return null;
 if(depth===0&&'。；;\n'.includes(c)){if(text.slice(start,i).trim())out.push(text.slice(start,i).trim());start=i+1;}
 }if(depth!==0)return null;if(text.slice(start).trim())out.push(text.slice(start).trim());return out;}
function quantity(subject,u,bounds,operator){
 subject=subject.trim().replace(/确定(?=支出预算$)/u,'');if(!atom(subject)||/[，,]/u.test(subject))return null;
 const kind=typeUnit(u);return {type:'quantity',subject,unit:u,measure:kind,role:operator==='='?'VALUE':'LIMIT',...bounds};
}
export function parseBoundaryExpression(text,{parent=false}={}){
 const s=punctuation(text);let m;
 // Fold only a repeated, identical, explicitly inclusive endpoint.
 const tail=s.match(new RegExp(`^(.+)[，,]\\s*(${number})\\s*${unit}\\s*允许$`));
 if(tail){const q=parseBoundaryExpression(tail[1],{parent});return q?.type==='quantity'&&q.unit===unitNames[tail[3]]&&q.upper?.value===tail[2]&&q.upper.inclusive?q:null;}
 if((m=s.match(range)))return quantity(m[3],unitNames[m[6]],{lower:edge(m[1],m[2]!=='<'),upper:edge(m[5],m[4]!=='<')},'range');
 if((m=s.match(quant)))return quantity(m[1],unitNames[m[4]],interval(operators[m[2]],m[3]),operators[m[2]]);
 // Symbolic sets have a dimension and an opaque, exact object identity.
 if((m=s.match(/^(?:(允许|禁止|选用)\s*)?([IOAPVCB])(?:\s*\[([^\]]+)\])?\s*(?:=|⊆)\s*\{([^{}]+)\}$/u))){
  const values=list(m[4]);if(!values)return null;return {type:'domain',subject:m[3]??m[2],axes:[m[2]==='B'?'A':m[2]],mode:m[1]==='禁止'?'FORBID':m[1]==='允许'?'ALLOW':m[1]==='选用'?'SELECT':parent?'ALLOW':'SELECT',values};
 }
 // Controlled modal predicates; the complete action/object phrase is an identity.
 // No synonym matching, omitted-object completion, or role-based authorization.
 if((m=s.match(/^(只允许|仅允许|禁止|不得|执行)([^，,；;。]+)$/u))){const values=list(m[2]);if(!values)return null;return {type:'domain',subject:'A',axes:['A'],mode:['禁止','不得'].includes(m[1])?'FORBID':['只允许','仅允许'].includes(m[1])?'ALLOW':'SELECT',values};}
 if((m=s.match(/^(输入|交付|参与主体|版本)(仅限|限于|为)\s*(.+)$/u))){const values=list(m[3]);if(!values)return null;const a={输入:'I',交付:'O',参与主体:'P',版本:'V'}[m[1]];return {type:'domain',subject:a,axes:[a],mode:m[2]==='为'&&!parent?'SELECT':'ALLOW',values};}
 if((m=s.match(/^(.+?)\s*(?:→|先于)\s*(.+)$/u))&&atom(m[1])&&atom(m[2]))return {type:'order',subject:'order',axes:['A'],edges:[{from:m[1].trim(),to:m[2].trim()}],removed:[]};
 if((m=s.match(/^(?:必须)?先(.+?)再(.+)$/u))&&atom(m[1])&&atom(m[2]))return {type:'order',subject:'order',axes:['A'],edges:[{from:m[1].trim(),to:m[2].trim()}],removed:[]};
 if((m=s.match(/^(.+?)的(?:必要)?前提\s*(?:=|为)\s*(.+)$/u))&&atom(m[1])){const expression=boolean(m[2]);if(expression!==null)return {type:'condition',subject:m[1].trim(),axes:['A'],expression};}
 if((m=s.match(/^仅当(.+?)才(?:可|允许)(.+)$/u))&&atom(m[2])){const expression=boolean(m[1]);if(expression!==null)return {type:'condition',subject:m[2].trim(),axes:['A'],expression};}
 if((m=s.match(/^当(.+?)即可(.+)$/u))&&atom(m[2])){const expression=boolean(m[1]);if(expression!==null)return {type:'permission',subject:m[2].trim(),axes:['A'],expression};}
 return null;
}
// Nominal measures are typed grammatical heads, never verdict keywords.
// All other name text is retained verbatim, including case and directory paths.
function descriptor(c){
 if(c.type!=='quantity')return {name:c.subject,scope:null,total:false};
 if(c.measure==='MONEY'){
  const m=c.subject.match(/^(.*?)(全部支出总额|支出总额|费用合计|总预算|支出预算|预算|费用|金额|成本)$/u);
  if(m)return {name:c.subject,scope:m[1].replace(/的$/u,''),head:m[2],total:['全部支出总额','支出总额','费用合计','总预算'].includes(m[2]),budget:['全部支出总额','支出总额','费用合计','总预算','支出预算','预算'].includes(m[2])};
 }
 if(c.measure==='TIME'&&['整体时间','整体经过时间','整体时长','总时长','整体','T'].includes(c.subject))return {name:c.subject,scope:'TASK',total:true,budget:true};
 if(c.measure==='TIME'&&['本任务时长','子任务时长','当前任务时长'].includes(c.subject))return {name:c.subject,scope:'TASK_PART',total:false};
 return {name:c.subject,scope:null,total:false};
}
const keyOf=(root,c)=>stable([root,c.type==='permission'?'condition':c.type,c.subject,c.type==='quantity'?c.measure:null]);
function compileNode(node,value,isParent,root){
 if(!value?.boundary)return {value,parsed:[],diagnostics:[]};
 if(value.boundary.formal){
  const result=structuredClone(value),f=result.boundary.formal;
  for(const cv of f.coverage??[]){
   if(cv.kind!=='UNSUPPORTED'||cv.reason!=='本条尚未提供等价结构'||cv.constraint_ids.length||cv.unresolved?.length)continue;
   const edges=(f.relations??[]).filter(e=>e.clause_ids?.includes(cv.clause_id));
   if(edges.length&&edges.every(e=>['SAME_AS','PART_OF','DISTINCT','SPECIALIZES'].includes(e.type)&&typeof e.from==='string'&&e.from.trim()&&typeof e.to==='string'&&e.to.trim()&&e.from!==e.to&&e.clause_ids.every(id=>result.boundary.clauses.some(c=>c.id===id&&c.source_valid)))){
    cv.kind='STRUCTURED';cv.reason='已有关系及来源完整；程序修正关系条款的默认覆盖标记';
   }
  }
  const ids=new Set((f.coverage??[]).filter(cv=>cv.kind==='UNSUPPORTED'&&!cv.constraint_ids.length).map(cv=>cv.clause_id));
  if(!ids.size)return {value:result,parsed:[],diagnostics:[],existing:true};
  const subset=structuredClone(value);delete subset.boundary.formal;subset.boundary.clauses=subset.boundary.clauses.filter(c=>ids.has(c.id));
  const local=compileNode(node,subset,isParent,root),fresh=local.value.boundary.formal;
  const accepted=new Set(fresh.coverage.filter(cv=>cv.kind==='STRUCTURED'&&cv.constraint_ids.every(id=>!f.constraints.some(c=>c.id===id))).map(cv=>cv.clause_id));
  f.constraints.push(...fresh.constraints.filter(c=>c.clause_ids.every(id=>accepted.has(id))));
  f.coverage=f.coverage.map(cv=>accepted.has(cv.clause_id)?fresh.coverage.find(v=>v.clause_id===cv.clause_id):cv);
  return {value:result,parsed:[],diagnostics:local.diagnostics,existing:true};
 }
 const result=structuredClone(value),formal={version:'workbench-formal/1',constraints:[],relations:[],coverage:[]},diagnostics=[];
 for(const clause of result.boundary.clauses){
  // Reviewed, exact source quotations are authoritative. Do not turn a model's
  // illustrative formula or math_analysis result into a new source operand.
  const sources=clause.evidence?.map(e=>e.quote)??[];
  const pieces=sources.length?statements(sources.join('\n')):null;
  const ast=clause.source_valid&&pieces?.length?pieces.map(s=>parseBoundaryExpression(s,{parent:isParent})):[];
  const good=ast.length&&ast.every(Boolean);
  if(!good){formal.coverage.push({clause_id:clause.id,kind:'UNSUPPORTED',constraint_ids:[],reason:'本地语法尚不能完整解析该条款的对象、模态或作用域'});diagnostics.push({node_id:node.id,clause_id:clause.id,code:'CLAUSE_GRAMMAR_UNSUPPORTED',axes:clause.axes,fragments:pieces});continue;}
  const ids=[];
  for(let i=0;i<ast.length;i++){
   const a=ast[i],id=`local:${clause.id}:${i}`,d=descriptor(a),key=keyOf(root,a);
   const c={...a,id,key,label:a.subject,clause_ids:[clause.id],axes:a.axes??['R'],local_descriptor:d,local_provenance:{method:LOWERING_VERSION,node_id:node.id,clause_id:clause.id,source_fragment:pieces[i],source_evidence:clause.evidence}};
   if(a.type==='quantity'){c.instance=key;c.combination=d.total&&a.measure==='MONEY'?'ADDITIVE':'SINGLE';}
   formal.constraints.push(c);ids.push(id);
  }
  formal.coverage.push({clause_id:clause.id,kind:'STRUCTURED',constraint_ids:ids,reason:'完整表达式经本地语法解析，操作数保留条款来源'});
 }
 result.boundary.formal=formal;result.local_lowering={version:LOWERING_VERSION,diagnostics};return {value:result,diagnostics};
}
export function lowerReviewedPlan({plan,boundaries}){
 const root=plan.nodes.find(n=>!n.parent_id)?.id??'root',rows=new Map(),diagnostics=[],bindings=[];
 for(const n of plan.nodes){const r=compileNode(n,boundaries[n.id],plan.nodes.some(c=>c.parent_id===n.id),root);rows.set(n.id,r);diagnostics.push(...r.diagnostics);}
 const cs=id=>rows.get(id)?.value?.boundary?.formal?.constraints??[];
 for(const n of [...plan.nodes].sort((a,b)=>ancestors(plan,a.id).length-ancestors(plan,b.id).length)){
  const row=rows.get(n.id);if(!n.parent_id||!row?.value?.boundary?.formal||row.existing)continue;
  for(const c of cs(n.id)){
   if(c.type!=='quantity')continue;const d=c.local_descriptor;let candidates=[];
   // Nearest exact typed identity wins. Currency equality alone is not identity.
   for(const p of ancestors(plan,n.id)){
    candidates=cs(p.id).filter(pc=>pc.type==='quantity'&&pc.measure===c.measure&&pc.subject===c.subject);
    if(candidates.length)break;
   }
   let relation='SAME_AS';
   if(!candidates.length)for(const p of ancestors(plan,n.id)){
    candidates=cs(p.id).filter(pc=>{
     const pd=pc.local_descriptor;if(pc.type!=='quantity'||pc.measure!==c.measure||!pd?.total)return false;
     if(c.measure==='TIME')return d.scope==='TASK_PART'||d.scope==='TASK';
     return c.unit===pc.unit&&d.scope!==null&&(d.scope===pd.scope||pd.scope&&d.scope.startsWith(pd.scope+'的'));
    });if(candidates.length){relation='PART_OF';break;}
   }
   const unique=[...new Map(candidates.map(c=>[c.key,c])).values()];
   if(unique.length===1){const pc=unique[0],pd=pc.local_descriptor;
    if(d.budget&&d.scope===pd?.scope)relation='SAME_AS';
    if(c.key!==pc.key)row.value.boundary.formal.relations.push({id:'bind:'+c.id,type:relation,from:c.key,to:pc.key,clause_ids:c.clause_ids});
    if(relation==='SAME_AS'){c.instance=pc.instance;c.key=pc.key;}
    bindings.push({node_id:n.id,constraint:c.id,parent_key:pc.key,relation,rule:relation==='SAME_AS'?'EXACT_TYPED_IDENTITY':'EXPLICIT_TOTAL_WITH_TREE_CONTAINMENT',source_refs:c.clause_ids.map(clause_id=>({node_id:n.id,clause_id}))});
   }else if(unique.length>1)diagnostics.push({code:'AMBIGUOUS_PARENT_BINDING',node_id:n.id,clause_ids:c.clause_ids,candidates:unique.map(c=>c.key)});
  }
 }
 // Repeated component labels on different branches do not prove either one
 // shared charge or two independent charges. Refuse both silent dedup and sum.
 const components=plan.nodes.flatMap(n=>cs(n.id).filter(c=>c.type==='quantity'&&c.role==='VALUE'&&c.local_descriptor&&!c.local_descriptor.budget).map(c=>({n,c})));
 for(let i=0;i<components.length;i++)for(const other of components.slice(i+1)){
  const a=components[i];if(a.n.id===other.n.id||a.c.key!==other.c.key||ancestors(plan,a.n.id).some(n=>n.id===other.n.id)||ancestors(plan,other.n.id).some(n=>n.id===a.n.id))continue;
  for(const x of [a,other]){const f=rows.get(x.n.id).value.boundary.formal;for(const id of x.c.clause_ids){const cv=f.coverage.find(v=>v.clause_id===id);cv.kind='UNSUPPORTED';cv.reason='不同分支的同名数量缺少实例身份，不能判断应去重还是相加';}diagnostics.push({node_id:x.n.id,clause_ids:x.c.clause_ids,code:'AMBIGUOUS_QUANTITY_INSTANCE'});}
 }
 // Unsupported child material cannot affect a disjoint, successfully parsed
 // parent dimension. Keep it as a conversion diagnostic, not a global verdict.
 for(const n of plan.nodes.filter(n=>n.parent_id)){
  const row=rows.get(n.id);if(!row?.value?.boundary?.formal||row.existing)continue;
  const parents=ancestors(plan,n.id),parentAxes=new Set(parents.flatMap(p=>cs(p.id).flatMap(c=>c.axes))),parentGaps=parents.some(p=>rows.get(p.id)?.diagnostics.length);
  for(const cv of row.value.boundary.formal.coverage.filter(c=>c.kind==='UNSUPPORTED')){
   const cl=row.value.boundary.clauses.find(c=>c.id===cv.clause_id);
   if(!parentGaps&&cl.axes.every(a=>!parentAxes.has(a))){cv.kind='CONTEXT';cv.reason='本次父边界未限制该维度；原条款与转换诊断保留，不作为比较操作数';const d=diagnostics.find(d=>d.node_id===n.id&&d.clause_id===cl.id);if(d)d.comparison_effect='DISJOINT_PARENT_DIMENSION';}
  }
 }
 return {boundaries:Object.fromEntries([...rows].map(([id,r])=>[id,r.value])),version:LOWERING_VERSION,diagnostics,bindings};
}
