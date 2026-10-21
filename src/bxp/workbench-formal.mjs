// Internal workbench adapter. This is not a new BXP protocol or an NLP parser.
// Producers describe source constraints; only this Core chooses comparisons.
import {mappedDomainValues} from './workbench-member-binding.mjs';
import {mapBooleanExpression} from './workbench-symbol-binding.mjs';
import {normalizeBindingCoverage} from './workbench-binding.mjs';
import {AXES,ancestors,validatePlan} from './workbench-model.mjs';
import {calculateComparison} from './workbench-calculators.mjs';
import {evaluateCalculationPlan,validateCalculationPlan,calculationPlanRefersTo} from './workbench-math-plan.mjs';
import {isInstantQuantity} from './workbench-time-coordinate.mjs';
import {findPrerequisitePath} from './dependency-solver.mjs';
import {add,multiply,compare,stable,units,dimension,rational} from './ir-kernel/values.mjs';
// Compile a parent-only temporal reference before substituting child values.
// Shared endpoint identities express exact adjacency; spelling and amounts
// never establish identity. Branches, cycles and inconsistent declarations
// cannot establish this serial template.
function parentSerialReferences(constraints,total){
 const graphs=constraints.filter(c=>c.type==='order'&&c.events?.length>1),out=[];
 for(const graph of graphs){
  const aggregate=graph.events.find(e=>e.id===total.instance),events=graph.events.filter(e=>e!==aggregate);
  if(events.length<2)continue;
  let completionProof=null;
  if(aggregate){
   const completion=constraints.filter(c=>c.type==='obligation'&&c.mode==='REQUIRED'&&c.timing==='ON_TRIGGER'&&c.key===aggregate.end);
   const conjunction=e=>{
    if(e===true)return [];if(e?.var)return [e.var];if(!Array.isArray(e?.all))return null;
    const xs=e.all.map(conjunction);return xs.some(x=>x===null)?null:xs.flat();
   };
   completionProof=completion.find(c=>{const xs=conjunction(c.guard);if(xs===null)return false;const s=[...new Set(xs)];return s.length===events.length&&events.every(e=>s.includes(e.end));});
   // An exact serial chain can prove aggregate endpoints directly below.
  }
  if(new Set(events.map(e=>e.id)).size!==events.length)continue;
  const conflict=graphs.some(g=>g.events.some(e=>events.some(p=>p.id===e.id&&(p.start!==e.start||p.end!==e.end))));
  if(conflict)continue;
  if(new Set(events.map(e=>e.start)).size===1){
   if(aggregate&&!completionProof)continue;
   out.push({graph,completionProof,instances:events.map(e=>e.id),start:events[0].start,end:events.map(e=>e.end),combination:'PARALLEL'});continue;
  }
  if(new Set(events.map(e=>e.start)).size!==events.length||new Set(events.map(e=>e.end)).size!==events.length)continue;
  const heads=events.filter(e=>!events.some(p=>p.end===e.start));if(heads.length!==1)continue;
  const ordered=[],seen=new Set();let event=heads[0];
  while(event&&!seen.has(event.id)){ordered.push(event);seen.add(event.id);event=events.find(e=>e.start===event.end);}
  if(event||ordered.length!==events.length)continue;
  if(aggregate&&(aggregate.start!==ordered[0].start||aggregate.end!==ordered.at(-1).end))continue;
  // A second declaration of a shared instance must agree on its endpoints.
  if(graphs.some(g=>g.events.some(e=>events.some(p=>p.id===e.id&&(p.start!==e.start||p.end!==e.end)))))continue;
  out.push({graph,completionProof,instances:ordered.map(e=>e.id),start:ordered[0].start,end:ordered.at(-1).end,combination:'SERIAL'});
 }
 return out;
}

// Walk an explicitly closed parent quantity graph. Leaves are submitted child
// operands, never numbers derived from text. Every level uses the existing Core.
function evaluateCompositionTree(root,declarations,known){
 const steps=[],used=[],visited=new Set(),active=new Set(),leaves=new Set();
 const walk=(key,isRoot=false)=>{
  if(active.has(key))throw Error('完整组成图存在循环');active.add(key);
  const actual=known.filter(x=>x.c.key===key),decl=declarations.filter(c=>c.type==='quantity'&&c.key===key);
  let interval;
  if(!isRoot&&actual.length){
   const shapes=[...new Set(actual.map(x=>stable([x.c.instance,x.c.lower,x.c.upper])))];
   if(shapes.length!==1)throw Error('组成项存在多个不一致的数量实例或区间');
   const row=actual[0];if(leaves.has(row.c.instance))throw Error('同一数量实例在完整组成图重复计入');leaves.add(row.c.instance);used.push(...actual);interval={lower:row.c.lower,upper:row.c.upper};
  }else{
   const choices=decl.filter(c=>c.components?.length);if(!choices.length)throw Error('完整组成缺少子数量：'+key);
   if(new Set(choices.map(c=>stable([c.components,c.combination,c.choice_model]))).size!==1)throw Error('完整组成存在相互矛盾的算子或成员');
   const c=choices[0];visited.add(c);if(c.combination==='SINGLE'&&c.components.length!==1)throw Error('单项组成不能隐含多个成员相加');
   const xs=c.components.map(k=>walk(k));
   if(c.combination==='SINGLE')interval=xs[0];
   else{const op={kind:'interval_composition',dimension:key,unit:root.unit,parent:{lower:null,upper:null},combination:c.combination,independent:c.choice_model==='INDEPENDENT',intervals:xs},result=calculateComparison(op);
    if(result.status!=='VERIFIED')throw Error('组成算子无法计算：'+result.reason);interval=result.composed;steps.push({constraint_id:c.id,clause_ids:c.clause_ids,key,components:c.components,operands:op,result});}
  }
  active.delete(key);return interval;
 };
 const interval=walk(root.key,true);return {interval,steps,used,clause_ids:[...new Set([...visited].flatMap(c=>c.clause_ids))]};
}
export const FORMAL_VERSION='workbench-formal/1';
const types=['quantity','domain','condition','permission','selection','obligation','order','conversion','unknown'];
const arr=x=>Array.isArray(x),str=x=>typeof x==='string'&&x.trim().length>0;
const refs=(node,c)=>(c.clause_ids??[]).map(clause_id=>({node_id:node,clause_id}));
const symbols=e=>typeof e==='boolean'?[]:e?.var?[e.var]:e?.not?symbols(e.not):Object.values(e??{}).flatMap(v=>arr(v)?v.flatMap(symbols):[]);
function expression(e,depth=0){if(depth>16)return false;if(typeof e==='boolean')return true;if(!e||typeof e!=='object'||arr(e)||Object.keys(e).length!==1)return false;if('var'in e)return str(e.var);if('not'in e)return expression(e.not,depth+1);return ['all','any','implies'].some(k=>arr(e[k])&&e[k].length>0&&(k!=='implies'||e[k].length===2)&&e[k].every(x=>expression(x,depth+1)));}
function bounds(c){return isInstantQuantity(c)||['lower','upper'].every(k=>Object.hasOwn(c,k)&&(c[k]===null||str(c[k]?.value)&&typeof c[k]?.inclusive==='boolean'&&(()=>{try{compare(c[k].value,'0');return true;}catch{return false;}})()));}
// A review comment is not an operand or a boundary verdict. Clause-level
// comments on fully represented inputs stay available for source review while
// Core evaluates those inputs. Explicitly disputed operands, absent coverage
// and unknown facts remain blocking. This never repairs a source or a formula.
function reviewIsDiagnostic(boundary,x){
 if(x.constraint_ids?.length)return false;
 if(x.analysis_ids?.length)return true;
 if(!arr(x.clause_ids)||!x.clause_ids.length)return false;
 const f=boundary?.formal;
 return x.clause_ids.every(id=>{
  if(!boundary.clauses?.some(c=>c.id===id&&c.source_valid))return false;
  const rows=f?.coverage?.filter(c=>c.clause_id===id)??[];
  if(rows.length!==1||rows[0].kind!=='STRUCTURED'||rows[0].unresolved?.length||!rows[0].constraint_ids?.length)return false;
  return rows[0].constraint_ids.every(cid=>f.constraints.some(c=>c.id===cid&&c.type!=='unknown'&&c.clause_ids?.includes(id)));
 });
}
export function validateFormal(boundary,review){
 const f=boundary?.formal,issues=[],clauses=boundary?.clauses??[],ids=new Set();
 const issue=(reason,c)=>issues.push({reason,clause_ids:arr(c?.clause_ids)?c.clause_ids:[],constraint_id:c?.id,axes:arr(c?.axes)?c.axes:[]});
 if(f?.version!==FORMAL_VERSION||!arr(f.constraints)||!arr(f.coverage))return [{reason:'当前7+1条款尚未由程序转换为可比较约束，本次不能判定是否越界；不会为此追加模型请求或要求重新生成。',clause_ids:clauses.map(c=>c.id),axes:[...new Set(clauses.flatMap(c=>c.axes))]}];
 for(const e of boundary.issues??[])issue(e.code==='AXIS_NOT_ACCOUNTED'?'7+1维度未交付且未标明原文未明示：'+e.axis:'条款结构或原文来源未通过校验：'+e.code,{clause_ids:e.clause_id?[e.clause_id]:[],axes:e.axis?[e.axis]:[]});
 if(f.constraints.length>400)return [{reason:'结构化约束超过本地计算容量。',clause_ids:[],axes:[]}];
 if(f.relations!==undefined&&!arr(f.relations))issue('组成关系图必须为数组。');
 if(arr(f.relations)&&f.relations.length>800)issue('组成关系图超过本地核对容量。');
 for(const edge of arr(f.relations)?f.relations:[]){if(!edge||!['PART_OF','SAME_AS','DISTINCT','SPECIALIZES'].includes(edge.type)||!str(edge.from)||!str(edge.to)||edge.from===edge.to||!arr(edge.clause_ids)||!edge.clause_ids.length||edge.clause_ids.some(id=>!clauses.some(c=>c.id===id&&c.source_valid)))issue('组成/身份关系图的边或来源无效。',edge);}
 for(const c of f.constraints){
  if(!c||!str(c.id)||ids.has(c.id)||!types.includes(c.type)||!str(c.key)||!arr(c.axes)||!c.axes.length||c.axes.some(a=>!AXES.includes(a))||!arr(c.clause_ids)||!c.clause_ids.length||c.clause_ids.some(id=>!clauses.some(x=>x.id===id&&x.source_valid))){issue('约束类型、身份、维度或原文来源无效。',c);continue;}ids.add(c.id);
  if(['verdict','status','operation','result'].some(k=>Object.hasOwn(c,k)))issue('生成接口禁止交付比较结论或计算操作；须交付边界约束。',c);
  if(c.type==='quantity'&&((!str(c.unit)&&!(c.unit==null&&c.role==='LIMIT'&&c.lower===null&&c.upper===null))||!bounds(c)||!['SINGLE','ADDITIVE','EXCLUSIVE','SERIAL','PARALLEL','UNKNOWN'].includes(c.combination)||!str(c.instance)||!['LIMIT','VALUE'].includes(c.role)))issue('数值约束缺少端点、单位、实例或组合关系。',c);
  if(c.type==='quantity'&&c.components!==undefined&&(!arr(c.components)||!c.components.length||c.components.some(k=>!str(k)||k===c.key)||new Set(c.components).size!==c.components.length||c.combination==='SINGLE'&&c.components.length!==1))issue('完整组成必须提供唯一子数量身份；SINGLE只允许一个组成项。',c);
  if(c.type==='domain'&&(!['ALLOW','FORBID','SELECT'].includes(c.mode)||!arr(c.values)||!c.values.length||c.values.some(x=>!str(x))))issue('集合约束缺少允许/禁止/选用关系或对象身份。',c);
  if(c.type==='condition'&&!expression(c.expression))issue('条件结构无效，必须明确且、或、非和事件身份。',c);
  if(c.type==='permission'&&!expression(c.expression))issue('充分许可必须交付有原文依据的触发条件。',c);
  if(c.type==='selection'&&(!arr(c.members)||!c.members.length||c.members.some(x=>!str(x))||new Set(c.members).size!==c.members.length||!Number.isInteger(c.min)||!Number.isInteger(c.max)||c.min<0||c.max<c.min||c.max>c.members.length))issue('选择约束必须给出候选数量实例及最少/最多选择数。',c);
  if(c.type==='quantity'&&c.choice_model!==undefined&&!['INDEPENDENT','UNKNOWN'].includes(c.choice_model))issue('数值选择关系无效。',c);
  if(c.type==='obligation'&&!['REQUIRED','CANCELLED','NOT_ASSIGNED'].includes(c.mode))issue('义务约束缺少明确模态。',c);
  if(c.type==='obligation'&&Object.hasOwn(c,'guard')&&!expression(c.guard))issue('条件义务的触发条件无效。',c);
  if(c.type==='obligation'&&Object.hasOwn(c,'timing')&&!['ON_TRIGGER','WHILE_GUARD','EVENTUALLY'].includes(c.timing))issue('义务触发时序无效。',c);
  if(c.type==='order'&&c.forbidden_paths!==undefined&&(!arr(c.forbidden_paths)||!c.forbidden_paths.every(e=>str(e.from)&&str(e.to))))issue('禁止路径必须列出有效起止节点。',c);
  if(c.type==='order'&&Object.hasOwn(c,'closed')&&typeof c.closed!=='boolean')issue('图的闭合声明必须为布尔值。',c);
  if(c.type==='order'&&(!arr(c.edges)||!c.edges.every(e=>str(e.from)&&str(e.to))||!arr(c.removed)||!c.removed.every(e=>str(e.from)&&str(e.to))))issue('依赖图缺少有效节点或边。',c);
  if(c.type==='order'&&c.events!==undefined&&(!arr(c.events)||!c.events.every(e=>str(e.id)&&str(e.start)&&str(e.end)&&e.start!==e.end)))issue('事件必须提供稳定身份与不同的开始、完成节点。',c);
  if(c.type==='conversion'&&(!str(c.from)||!str(c.to)||!str(c.factor)||(()=>{try{return compare(c.factor,'0')<=0;}catch{return true;}})()))issue('换算关系缺少有效正系数。',c);
  if(c.type==='unknown'&&!str(c.reason))issue('未知约束必须说明具体原文缺口。',c);
 }
 for(const e of f.binding_issues??[])issues.push(e);
 for(const c of clauses){const rows=f.coverage.filter(x=>x?.clause_id===c.id);if(rows.length!==1){issue('条款必须有且只有一项结构化覆盖记录。',{clause_ids:[c.id],axes:c.axes});continue;}const r=rows[0];
  const expressionOwnsClause=(f.calculation_plans??[]).some(p=>p.expression&&(()=>{const owns=e=>e&&typeof e==='object'&&((e.source_refs??[]).some(ref=>ref.clause_id===c.id)||(e.args??[]).some(owns));return owns(p.expression);})());
  if(!arr(r.constraint_ids)||!['STRUCTURED','CONTEXT','INHERITED','UNSUPPORTED'].includes(r.kind)||!str(r.reason)||r.constraint_ids.some(id=>!f.constraints.some(x=>x.id===id&&x.clause_ids?.includes(c.id)))||r.kind==='STRUCTURED'&&!r.constraint_ids.length&&!(f.relations??[]).some(e=>e.clause_ids?.includes(c.id))&&!expressionOwnsClause)issue('条款覆盖记录或约束来源不完整。',{clause_ids:[c.id],axes:c.axes});
  if(r.unresolved!==undefined){
   if(!arr(r.unresolved)||r.unresolved.some(x=>!str(x.reason)))issue('局部未解析项缺少具体原因。',{clause_ids:[c.id],axes:c.axes});
   else for(const [i,x]of r.unresolved.entries())issue('生成或计算覆盖缺口：'+x.reason,{id:c.id+':residual:'+i,clause_ids:[c.id],axes:c.axes});
  }
  if(r.kind==='UNSUPPORTED')issue('生成或计算覆盖缺口：'+r.reason,{clause_ids:[c.id],axes:c.axes});
 }
 for(const c of f.constraints)if(c&&arr(c.clause_ids)&&!c.clause_ids.every(id=>f.coverage.some(r=>r?.clause_id===id&&r.kind==='STRUCTURED'&&arr(r.constraint_ids)&&r.constraint_ids.includes(c.id))))issue('参与计算的约束未在对应条款的结构化覆盖记录中声明。',c);
 if(!review||!arr(review.issues)||!['NO_ISSUES_FOUND','ISSUES_FOUND'].includes(review.status))issue('缺少有效的独立来源审阅。');
 else if(review.status==='ISSUES_FOUND'&&!review.issues.length)issue('来源审阅声称发现问题但未交付问题内容。');
 else for(const x of review.issues){
  if(reviewIsDiagnostic(boundary,x))continue;
  if(x.constraint_ids?.length)for(const id of x.constraint_ids)issue('7+1来源审阅问题：'+x.reason,f.constraints.find(c=>c.id===id)??{clause_ids:x.clause_ids??[],axes:[]});
  else issue('7+1来源审阅问题：'+x.reason,{clause_ids:x.clause_ids??[],axes:[]});
 }
 return issues;
}
function constraintLabel(c){return c.label??c.key;}
function numberText(x){const s=String(x);if(!s.includes('/'))return s;const {n,d}=rational(s);let q=d,twos=0,fives=0;while(q%2n===0n){q/=2n;twos++;}while(q%5n===0n){q/=5n;fives++;}if(q!==1n)return s;const scale=Math.max(twos,fives),v=(n<0n?-n:n)*10n**BigInt(scale)/d,digits=v.toString().padStart(scale+1,'0');return (n<0n?'-':'')+(scale?digits.slice(0,-scale)+'.'+digits.slice(-scale):digits);}
const unitText=u=>({CNY:'元人民币',USD:'美元',minute:'分钟',second:'秒',hour:'小时',count:'次'}[u]??u);
function formula(op,result){switch(op.kind){case 'budget':case 'duration':{const terms=op.allocations?.map(a=>a.amount)??op.durations,max=op.combination==='EXCLUSIVE'||op.schedule==='PARALLEL';return `${max?'max('+terms.join(', ')+')':terms.join(' + ')} = ${numberText(result.total)}；上限 ${op.limit} ${unitText(op.unit)}`;}case 'interval_subset':return `子区间 ${stable(op.child)} ⊆ 父区间 ${stable(op.parent)}`;case 'set_subset':return `子对象 {${op.child.join('、')}} ⊆ 父允许集合 {${op.parent.join('、')}}`;case 'boolean_implication':return '子条件 ⇒ 父条件';case 'dependency':return '父必要前置路径保留，且未被子任务反转';default:return '结构化约束比较';}}
function chinese(op,r){if(r.status==='UNRESOLVED')return '程序无法计算：'+r.reason;if(op.kind==='budget'||op.kind==='duration')return `${op.kind==='budget'?(op.combination==='EXCLUSIVE'?'互斥备选中的最大额度':'资源合计'):'整体时长'} ${numberText(r.total)} ${unitText(op.unit)}，父上限 ${op.limit} ${unitText(op.unit)}；`+(r.status==='VIOLATED'?`超出 ${numberText(add(r.total,multiply(op.limit,'-1')))} ${unitText(op.unit)}。`:'未超过上限。');if(op.kind==='set_subset')return r.status==='VIOLATED'?`以下对象超出父允许范围：${r.outside.join('、')}。`:'子对象均在父允许范围内。';if(op.kind==='interval_subset')return r.status==='VIOLATED'?'子任务明确的数值或区间不包含于父允许区间，突破了端点限制。':'子数值或区间包含于父允许区间。';if(op.kind==='boolean_implication')return r.status==='VIOLATED'?`存在子条件允许、父条件不允许的状态：${JSON.stringify(r.counterexamples?.[0]??{})}。`:'程序枚举的子允许状态均满足父条件。';if(op.kind==='dependency')return r.status==='VIOLATED'?r.cycles.length?'子任务与父前置关系形成循环：'+r.cycles.map(x=>x.nodes.join(' → ')).join('；'):'子任务明确移除的必要前置关系没有保留路径。':'必要前置关系路径保留，未形成循环。';return r.status==='VERIFIED'?'程序核对未突破该父约束。':'程序发现父子约束冲突。';}
function computationFormula(op,result){
 if(op.calculation_expression){const coordinate=op.time_coordinate?`${op.time_coordinate.date} 日零点为原点，UTC偏移 ${op.time_coordinate.utc_offset_minutes} 分钟；`:'';return `${coordinate}${op.calculation_expression.numeric} = ${result.child?.lower?.value??'?'} ${unitText(op.unit)}；父区间 ${stable(op.parent)}；${result.status==='VIOLATED'?'超出父允许范围':'包含于父允许范围'}`;}
 if(op.kind==='containment_lower_bound')return `T整体 ≥ T子任务 ≥ ${op.part_lower.value} ${op.unit}；父要求 T整体 ${op.parent_upper.inclusive?'≤':'<'} ${op.parent_upper.value} ${op.unit}`;
 if(op.kind==='cardinality_composition')return `${op.min} ≤ Σxᵢ ≤ ${op.max}，xᵢ∈{0,1}；费用=Σxᵢqᵢ；合法选择合计范围 ${result.min_total}..${result.max_total} ${op.unit}`;
 if(op.kind==='interval_composition')return `${op.combination}(${op.intervals.map(x=>stable(x)).join(', ')}) = ${stable(result.composed)}；组合区间 ⊆ 父区间`;
 return formula(op,result);
}
export function compareFormalPlan({plan,boundaries}){
 validatePlan(plan);boundaries=normalizeBindingCoverage(plan,boundaries);const findings=[],diagnostics=[],map=new Map(),errors=new Map(),compositionPaths=new Map(),evaluations=new Map();
 const recordEvaluation=(node,c,status)=>{const key=node+':'+c.id,rows=evaluations.get(key)??[];rows.push(status);evaluations.set(key,rows);};
 for(const n of plan.nodes){const b=boundaries[n.id]?.boundary;map.set(n.id,arr(b?.formal?.constraints)?b.formal.constraints.filter(c=>c&&typeof c==='object'&&!arr(c)):[]);errors.set(n.id,validateFormal(b,boundaries[n.id]?.review));}
 for(const n of plan.nodes){
  const b=boundaries[n.id]?.boundary;
  for(const issue of arr(boundaries[n.id]?.review?.issues)?boundaries[n.id].review.issues:[])if(reviewIsDiagnostic(b,issue))diagnostics.push({reason:issue.analysis_ids?.length?'LOCAL_ANALYSIS_REVIEW_ISSUE':'SOURCE_REVIEW_ADVISORY',reason_zh:issue.reason,suggestion:issue.suggestion,analysis_ids:issue.analysis_ids,child_refs:(issue.clause_ids??[]).map(clause_id=>({node_id:n.id,clause_id})),comparison_effect:'REVIEW_COMMENT_NOT_A_BOUNDARY_RESULT',review_status:'RETAINED',constraint_ids:(b.formal?.constraints??[]).filter(c=>c.clause_ids?.some(id=>issue.clause_ids?.includes(id))).map(c=>c.id)});
  for(const issue of b?.formal?.binding_diagnostics??[])diagnostics.push({...issue,reason:issue.code,reason_zh:issue.reason,child_refs:(issue.clause_ids??[]).map(clause_id=>({node_id:n.id,clause_id})),comparison_effect:'ADDITIONAL_RELATION_DOES_NOT_WEAKEN_PARENT_DUTY'});
 }
 for(const n of plan.nodes){
  const nodes=[n,...ancestors(plan,n.id)],rows=nodes.filter(a=>!errors.get(a.id).some(e=>!e.clause_ids.length)).flatMap(a=>(boundaries[a.id]?.boundary?.formal?.relations??[]).filter(e=>e&&str(e.from)&&str(e.to)&&arr(e.clause_ids)&&['PART_OF','SAME_AS'].includes(e.type)).map((e,i)=>({...e,node_id:a.id,id:a.id+':relation:'+i})));
  const edges=rows.flatMap(e=>[{...e,kind:'prerequisite'},...(e.type==='SAME_AS'?[{...e,id:e.id+':reverse',from:e.to,to:e.from,kind:'prerequisite'}]:[])]);
  for(const e of rows.filter(e=>e.node_id===n.id&&e.type==='PART_OF'))if(findPrerequisitePath(edges,e.to,e.from).reachable)errors.get(n.id).push({reason:'组成关系图出现包含自身的循环，不能据此合计资源。',clause_ids:e.clause_ids,axes:['R']});
 }
const related=(node,parent,c,pc)=>{if(c.key===pc.key)return true;if(c.type!==pc.type&&c.type!=='unknown'&&pc.type!=='unknown')return false;const allowed=[node,...ancestors(plan,node.id)],edges=allowed.flatMap(n=>(arr(boundaries[n.id]?.boundary?.formal?.relations)?boundaries[n.id].boundary.formal.relations:[]).filter(e=>e.type==='SAME_AS'||e.type==='PART_OF'&&(c.type==='quantity'||c.type==='unknown'&&map.get(node.id).some(q=>q.type==='quantity'&&q.key===c.key))||e.type==='SPECIALIZES'&&['domain','order'].includes(c.type)).filter(e=>!errors.get(n.id).some(i=>i.constraint_id ? (map.get(n.id)??[]).some(c=>c.id===i.constraint_id&&[e.from,e.to].includes(c.key)) : !i.clause_ids.length||e.clause_ids.some(id=>i.clause_ids.includes(id)))).flatMap((e,i)=>[{id:n.id+':'+i,kind:'prerequisite',from:e.from,to:e.to,source_refs:e.clause_ids.map(clause_id=>({node_id:n.id,clause_id}))},...(e.type==='SAME_AS'?[{id:n.id+':'+i+':reverse',kind:'prerequisite',from:e.to,to:e.from,source_refs:e.clause_ids.map(clause_id=>({node_id:n.id,clause_id}))}]:[])]));const path=findPrerequisitePath(edges,c.key,pc.key);if(path.reachable)compositionPaths.set(stable([node.id,c.id,parent.id,pc.id]),{child_node_id:node.id,child_constraint:c.id,parent_node_id:parent.id,parent_constraint:pc.id,...path,source_refs:edges.filter(e=>path.edge_ids.includes(e.id)).flatMap(e=>e.source_refs)});return path.reachable;};
 const addFinding=(p,pc,children,status,reason,calc=null,extra={})=>{
  if(p&&pc)recordEvaluation(p.id,pc,status);
  for(const x of children)if(x.c.id)recordEvaluation(x.node.id,x.c,status);
  const parent_refs=p&&pc?refs(p.id,pc):[],child_refs=children.flatMap(x=>refs(x.node.id,x.c));
const axes=pc?.type==='quantity'?(pc.axes.includes('R')?['R']:pc.axes):pc?.type==='condition'?pc.axes.includes('C')?['C',...(pc.axes.includes('B')?['B']:[])]:['A',...(pc.axes.includes('B')?['B']:[])]:pc?.axes??[...new Set(children.flatMap(x=>x.c.axes??[]))];
  const key=stable([parent_refs,child_refs,status,calc?.operands??reason]);
  if(findings.some(x=>x._key===key))return;
findings.push({_key:key,status,reason,reason_zh:reason,basis:calc&&status!=='UNRESOLVED'?'PROGRAM':'PROGRAM_INPUT_CHECK',axes,parent_refs,child_refs,boundary_key:pc?.key,constraint_type:pc?.type,scope:children.length>1?'COMBINATION':'DIRECT',target_node_ids:[...new Set(children.map(x=>x.node.id))],...(calc?{operands:calc.operands,operand_calculation:calc.result,formula:computationFormula(calc.operands,calc.result)}:{}),...(calc&&status==='UNRESOLVED'?{failure_layer:/CAPACITY|LIMIT|NOT_IMPLEMENTED/.test(calc.result.reason??'')?'CALCULATOR_COVERAGE':'GENERATION_OR_INTERFACE'}:{}),...extra});
 };
 const run=(p,pc,children,op,explain)=>{const result=calculateComparison(op);if(['CHILD_CONDITION_INCONSISTENT','CHILD_INTERVAL_EMPTY'].includes(result.reason)){diagnostics.push({reason:result.reason,reason_zh:'子约束自身矛盾；这不是突破父边界的证据，也不证明任务可以执行。',child_refs:children.flatMap(x=>refs(x.node.id,x.c))});addFinding(p,pc,children,'INHERITED','子约束没有增加父边界之外的允许状态；其自身矛盾另列诊断。',null,{basis:'PROGRAM',rule:'EMPTY_CHILD_SET',operands:op});return;}addFinding(p,pc,children,result.status,explain?explain(result):chinese(op,result),{operands:op,result});};
 const relevantErrors=(id,c)=>(errors.get(id)??[]).filter(e=>e.constraint_id?e.constraint_id===c.id:e.clause_ids.length?arr(c.clause_ids)&&c.clause_ids.some(x=>e.clause_ids.includes(x)):!e.axes.length||c.axes?.some(a=>e.axes.includes(a)));
 for(const n of plan.nodes)for(const e of errors.get(n.id)){const c={clause_ids:e.clause_ids,axes:e.axes.length?e.axes:[...new Set((boundaries[n.id]?.boundary?.clauses??[]).filter(c=>!e.clause_ids.length||e.clause_ids.includes(c.id)).flatMap(c=>c.axes))]};addFinding(null,null,[{node:n,c}],'UNRESOLVED',e.reason,null,{failure_layer:'GENERATION_OR_INTERFACE'});}
 for(const parent of plan.nodes){const descendants=plan.nodes.filter(n=>ancestors(plan,n.id).some(a=>a.id===parent.id));if(!descendants.length)continue;
  const parentConstraints=[];
  for(const c of map.get(parent.id)){
   if(c.type!=='condition'||relevantErrors(parent.id,c).length){parentConstraints.push(c);continue;}
   const prior=parentConstraints.find(p=>p.type==='condition'&&p.key===c.key&&!relevantErrors(parent.id,p).length);
   if(prior){prior.expression={all:[prior.expression,c.expression]};prior.clause_ids=[...new Set([...prior.clause_ids,...c.clause_ids])];prior.axes=[...new Set([...prior.axes,...c.axes])];}
   else parentConstraints.push(structuredClone(c));
  }
  for(const pc of parentConstraints){
   const expressionPlans=pc.type==='quantity'?boundaries[parent.id]?.boundary?.formal?.calculation_plans?.filter(p=>p.target_constraint_id===pc.id)??[]:[];
   if(['conversion','permission'].includes(pc.type)||pc.type==='obligation'&&pc.mode!=='REQUIRED'||pc.type==='domain'&&pc.mode==='SELECT'||relevantErrors(parent.id,pc).length&&!expressionPlans.length)continue;
   if(pc.type==='quantity'&&pc.lower===null&&pc.upper===null){diagnostics.push({reason:'UNBOUNDED_PARENT_INTERVAL',parent_refs:refs(parent.id,pc),comparison_effect:'NO_NUMERIC_RESTRICTION'});continue;}
   if(expressionPlans.length){
    let operands=[];
    try{
     if(expressionPlans.length!==1)throw Error('MATH_PLAN_DUPLICATED: 同一父数量存在多个数学计划');
     const record=expressionPlans[0],checked=validateCalculationPlan(record,{plan,boundaries,node_id:parent.id}),references=new Set(checked.leaves.map(r=>r.node_id+':'+r.constraint_id));
     operands=[parent,...descendants].flatMap(node=>map.get(node.id).filter(c=>references.has(node.id+':'+c.id)).map(c=>({node,c})));
     // The expression executor checks exact operands, types and original
     // evidence. A separate generation review/coverage diagnosis cannot erase
     // an otherwise computable expression or prevent its result being shown.
     const computed=evaluateCalculationPlan(record,{plan,boundaries,node_id:parent.id,operands});
     const proof={...pc,clause_ids:[...new Set([...pc.clause_ids,...computed.source_refs.filter(r=>r.node_id===parent.id).map(r=>r.clause_id)])]};
     addFinding(parent,proof,computed.used,computed.result.status,computed.result.status==='VIOLATED'?'解析生成的运算表达式经Core统一单位并求值后突破父允许区间。':'解析生成的运算表达式经Core统一单位并求值后包含于父允许区间。',{operands:computed.operands,result:computed.result});
    }catch(error){addFinding(parent,pc,operands,'UNRESOLVED','数学表达式尚不可执行：'+error.message,null,{failure_layer:'GENERATION_OR_INTERFACE',diagnostic_code:error.code??'MATH_PLAN_INVALID'});}
    continue;
   }
   if(pc.type==='quantity'&&isInstantQuantity(pc)){addFinding(parent,pc,[],'UNRESOLVED','完整时刻边界已保留，尚缺将子开始时刻及持续时长连接为同坐标表达式的解析。',null,{failure_layer:'GENERATION_OR_INTERFACE',diagnostic_code:'MATH_TIME_EXPRESSION_REQUIRED'});continue;}
   const targets=descendants.flatMap(node=>map.get(node.id).filter(c=>c.type!=='conversion'&&related(node,parent,c,pc)).map(c=>({node,c}))).filter(x=>!relevantErrors(x.node.id,x.c).length);
   if(!targets.length){addFinding(parent,pc,[],'INHERITED','子任务未明确修改这项父约束；父约束继续适用。',null,{basis:'PROGRAM',rule:'PARENT_CONSTRAINT_PERSISTS'});continue;}
   if(pc.type==='unknown'){addFinding(parent,pc,targets,'UNRESOLVED','本次子约束涉及父边界尚未明确的信息：'+pc.reason,null,{failure_layer:'SOURCE_INFORMATION'});continue;}
   const unknowns=targets.filter(x=>x.c.type==='unknown');if(unknowns.length)addFinding(parent,pc,unknowns,'UNRESOLVED','原文缺少判断所需信息：'+[...new Set(unknowns.map(x=>x.c.reason))].join('；'),null,{failure_layer:'SOURCE_INFORMATION'});
   if(pc.type==='condition')for(const x of targets.filter(x=>x.c.type==='permission')){
    // Sufficient permission is a positive set of permitted states, not a new
    // necessary condition. Each explicit grant must fit the parent's boundary.
    const constraints=targets.filter(y=>y.node.id===x.node.id&&y.c.type==='condition').map(y=>mapBooleanExpression(y.c.expression,y.c,parent.id,pc.key));
    const own=mapBooleanExpression(x.c.expression,x.c,parent.id,pc.key);const child=constraints.length?{all:[own,...constraints]}:own;
    run(parent,pc,[x],{kind:'boolean_implication',variables:[...new Set([...symbols(pc.expression),...symbols(child)])].sort(),parent:pc.expression,child},r=>r.status==='VIOLATED'?'子任务明确许可的状态突破父前提：'+JSON.stringify(r.counterexamples?.[0]??{})+'。':'该充分许可的全部触发状态均在父允许范围内。');
   }
   // An immediate duty can require an action while its parent permission is
   // false. A future duty is not treated as an immediate action or permission.
   if(pc.type==='condition')for(const x of targets.filter(x=>x.c.type==='obligation'&&x.c.mode==='REQUIRED'&&['ON_TRIGGER','WHILE_GUARD'].includes(x.c.timing))){const child=mapBooleanExpression(x.c.guard??true,x.c,parent.id,pc.key);run(parent,pc,[x],{kind:'boolean_implication',variables:[...new Set([...symbols(pc.expression),...symbols(child)])].sort(),parent:pc.expression,child},r=>r.status==='VIOLATED'?'子任务要求执行该动作时，存在父任务仍不允许的状态：'+JSON.stringify(r.counterexamples?.[0]??{})+'。':'执行该动作的条件状态均满足父允许前提。');}
   // A parent duty due now cannot be disabled by a child's necessary gate.
   // Future duties remain future: no same-state inference for EVENTUAL timing.
   if(pc.type==='obligation'&&pc.mode==='REQUIRED'&&['ON_TRIGGER','WHILE_GUARD'].includes(pc.timing))for(const x of targets.filter(x=>x.c.type==='condition')){
    const gate=mapBooleanExpression(x.c.expression,x.c,parent.id,pc.key),trigger=pc.guard??true;
    run(parent,pc,[x],{kind:'boolean_implication',variables:[...new Set([...symbols(gate),...symbols(trigger)])].sort(),parent:gate,child:trigger},r=>r.status==='VIOLATED'?'父任务要求立即履行该义务时，子任务条件禁止履行：'+JSON.stringify(r.counterexamples?.[0]??{})+'。':'子任务条件没有排除父任务立即履行义务的触发状态。');
   }
   // One entity may have a numeric limit and a separate obligation. They are
   // different typed properties, not a disagreement or an unperformed comparison.
   const matches=targets.filter(x=>x.c.type===pc.type);if(!matches.length)continue;
   if(pc.type==='quantity'){
    if(pc.lower===null&&pc.upper===null){addFinding(parent,pc,matches,'INHERITED','父任务未对这个合计口径设数值上下限；各项已明示的独立限制仍分别核对。',null,{basis:'PROGRAM',rule:'UNBOUNDED_PARENT_INTERVAL'});continue;}
    const convert=(row)=>{const c=structuredClone(row.c);if(c.unit==null&&c.role==='LIMIT'&&c.lower===null&&c.upper===null)c.unit=pc.unit;if(c.unit!==pc.unit){const candidates=[parent,...ancestors(plan,parent.id),row.node,...ancestors(plan,row.node.id)].flatMap(n=>map.get(n.id).filter(v=>v.type==='conversion'&&v.from===c.unit&&v.to===pc.unit&&!relevantErrors(n.id,v).length));const factors=[...new Set(candidates.map(x=>x.factor))];let factor=factors.length===1?factors[0]:null;if(factors.length>1)return null;if(!factor&&units[c.unit]&&units[pc.unit]&&dimension(c.unit)===dimension(pc.unit)){const inverse=String(units[pc.unit]).includes('/')?units[pc.unit].split('/').reverse().join('/'):'1/'+units[pc.unit];factor=multiply(units[c.unit],inverse);}if(!factor)return null;for(const k of ['lower','upper'])if(c[k])c[k].value=multiply(c[k].value,factor);c.unit=pc.unit;}return {...row,c};};
    const normalized=matches.map(convert);if(normalized.some(x=>!x))addFinding(parent,pc,matches.filter((_,i)=>!normalized[i]),'UNRESOLVED','同一资源的单位不同，缺少唯一、有原文依据的换算关系。',null,{failure_layer:'SOURCE_INFORMATION'});
    const known=normalized.filter(Boolean),values=known.filter(x=>x.c.role==='VALUE'&&(x.c.lower!==null||x.c.upper!==null)),limits=known.filter(x=>x.c.role==='LIMIT'&&(x.c.lower!==null||x.c.upper!==null));
    if(pc.components?.length){
     try{const tree=evaluateCompositionTree(pc,map.get(parent.id).filter(c=>!relevantErrors(parent.id,c).length),known);
      const parentProof={...pc,clause_ids:[...new Set([...pc.clause_ids,...tree.clause_ids])]},op={kind:'interval_subset',dimension:pc.key,unit:pc.unit,parent:{lower:pc.lower,upper:pc.upper},child:tree.interval,composition_tree:tree.steps};
      run(parent,parentProof,tree.used,op,r=>r.status==='VIOLATED'?'沿父完整组成图逐层计算的总量突破父允许区间。':'沿父完整组成图逐层计算的总量包含于父允许区间。');
     }catch(e){addFinding(parent,pc,known,'UNRESOLVED',e.message,null,{failure_layer:'GENERATION_OR_INTERFACE'});}
     continue;
    }
    const independenceEvidence=pc.choice_model==='INDEPENDENT'?[{node_id:parent.id,constraint_id:pc.id,source_refs:refs(parent.id,pc)}]:[];
    const independentChoice=row=>{
     if(row.c.choice_model!==undefined){if(row.c.choice_model==='INDEPENDENT')independenceEvidence.push({node_id:row.node.id,constraint_id:row.c.id,source_refs:refs(row.node.id,row.c)});return row.c.choice_model==='INDEPENDENT';}
     for(const n of [row.node,...ancestors(plan,row.node.id)]){
      const declarations=map.get(n.id).filter(c=>c.type==='quantity'&&c.key===row.c.key&&c.instance===row.c.instance&&c.choice_model!==undefined&&!relevantErrors(n.id,c).length);
      if(declarations.length){const yes=declarations.every(c=>c.choice_model==='INDEPENDENT');if(yes)independenceEvidence.push(...declarations.map(c=>({node_id:n.id,constraint_id:c.id,source_refs:refs(n.id,c)})));return yes;}
     }return false;
    };
    // Duration containment gives a lower bound even if overlap is unknown.
    // Do not infer this monotonic relation for temperature or arbitrary units.
    if(pc.upper&&units[pc.unit]&&dimension(pc.unit)==='TIME')for(const x of known){
     if(!x.c.lower||x.c.key===pc.key||!compositionPaths.has(stable([x.node.id,x.c.id,parent.id,pc.id])))continue;
     const op={kind:'containment_lower_bound',unit:pc.unit,parent_upper:pc.upper,part_lower:x.c.lower},r=calculateComparison(op);
     if(r.status==='VIOLATED')addFinding(parent,pc,[x],'VIOLATED',`整体包含子作业，整体时间至少 ${numberText(x.c.lower.value)} ${unitText(pc.unit)}，突破父上限 ${numberText(pc.upper.value)} ${unitText(pc.unit)}；与其他作业是否重叠无关。`,{operands:op,result:r});
    }
    const byInstance=new Map();for(const x of values){const a=byInstance.get(x.c.instance)??[];a.push(x);byInstance.set(x.c.instance,a);}
    let representatives=[];for(const rows of byInstance.values()){const variants=[...new Set(rows.map(x=>stable([x.c.lower,x.c.upper])))];if(variants.length>1){diagnostics.push({reason:'INTERNAL_QUANTITY_CONTRADICTION',reason_zh:'同一数量存在相互矛盾的明确值；各值分别与父边界比较，不相加，也不据此宣称方案可执行。',child_refs:rows.flatMap(x=>refs(x.node.id,x.c))});for(const row of rows)run(parent,pc,[row],{kind:'interval_subset',dimension:pc.key,unit:pc.unit,parent:{lower:pc.lower,upper:pc.upper},child:{lower:row.c.lower,upper:row.c.upper}});}else representatives.push(rows[0]);}
    const limitGroups=new Map();for(const x of limits){const xs=limitGroups.get(x.c.instance)??[];xs.push(x);limitGroups.set(x.c.instance,xs);}
    for(const rows of limitGroups.values()){
     if(byInstance.has(rows[0].c.instance)){for(const x of rows)run(parent,pc,[x],{kind:'interval_subset',dimension:pc.key,unit:pc.unit,parent:{lower:pc.lower,upper:pc.upper},child:{lower:x.c.lower,upper:x.c.upper}});continue;}
     const merged=structuredClone(rows[0]);for(const k of ['lower','upper']){const bs=rows.map(x=>x.c[k]).filter(Boolean).sort((a,b)=>compare(a.value,b.value));const endpoint=k==='lower'?bs.at(-1):bs[0];merged.c[k]=endpoint?{value:endpoint.value,inclusive:bs.filter(b=>compare(b.value,endpoint.value)===0).every(b=>b.inclusive)}:null;}
     representatives.push(merged);
    }
    // Explicit aggregate statements and their components are separate evidence,
    // never separate expenses. Check totals, then compose only leaf instances.
    const totals=representatives.filter(x=>representatives.some(y=>y.c.key!==x.c.key&&related(y.node,x.node,y.c,x.c)));
    for(const x of totals)run(parent,pc,[x],{kind:'interval_subset',dimension:pc.key,unit:pc.unit,parent:{lower:pc.lower,upper:pc.upper},child:{lower:x.c.lower,upper:x.c.upper}});
    representatives=representatives.filter(x=>!totals.includes(x));
    const explicitSelections=targets.filter(x=>x.c.type==='selection');
    const selections=explicitSelections.length?explicitSelections:map.get(parent.id).filter(c=>c.type==='selection'&&c.key===pc.key&&!relevantErrors(parent.id,c).length).map(c=>({node:parent,c}));
    if(selections.length){
     for(const selection of selections){const chosen=representatives.filter(x=>selection.c.members.includes(x.c.instance));
      if(chosen.length!==selection.c.members.length){addFinding(parent,pc,[selection,...chosen],'UNRESOLVED','选择约束的候选实例缺少数量或身份不唯一。',null,{failure_layer:'GENERATION_OR_INTERFACE'});continue;}
      const others=representatives.filter(x=>!selection.c.members.includes(x.c.instance));
      if(others.length||selections.length>1){addFinding(parent,pc,[selection,...representatives],'UNRESOLVED','多个选择组或组外费用的联合选择尚未实现。',null,{failure_layer:'CALCULATOR_COVERAGE'});continue;}
      const op={kind:'cardinality_composition',dimension:pc.key,unit:pc.unit,parent:{lower:pc.lower,upper:pc.upper},min:selection.c.min,max:selection.c.max,independent:pc.choice_model==='INDEPENDENT'||chosen.every(independentChoice),independence_evidence:independenceEvidence,items:chosen.map(x=>({instance:x.c.instance,interval:{lower:x.c.lower,upper:x.c.upper}}))};
      run(parent,pc,[selection,...chosen],op,r=>r.status==='UNRESOLVED'?'选择数量计算缺口：'+r.reason:`枚举 ${r.choices_checked} 种合法选择，合计范围 ${r.min_total} 至 ${r.max_total} ${unitText(pc.unit)}；`+(r.status==='VIOLATED'?'存在突破父边界的选择：'+r.witness.instances.join('、')+'。':'全部选择均在父边界内。'));
     }continue;
    }
    // The composition label can live on source-bound components as well as on
    // the total. Use it only when every independent instance explicitly links
    // to this total and every component declares the same composition law.
    let combination=pc.combination;
    const parentTemplates=parentSerialReferences(map.get(parent.id).filter(c=>!relevantErrors(parent.id,c).length),pc);
    let temporalReference=null;
    if(['SINGLE','UNKNOWN'].includes(combination)&&units[pc.unit]&&dimension(pc.unit)==='TIME'&&representatives.length>1&&representatives.every(x=>compositionPaths.has(stable([x.node.id,x.c.id,parent.id,pc.id])))){
     const templates=parentTemplates.filter(t=>t.instances.length===representatives.length&&t.instances.every(id=>representatives.some(x=>x.c.instance===id)));
     if(templates.length&&new Set(templates.map(t=>stable([t.instances,t.start,t.end]))).size===1){
      const t=templates[0];combination=t.combination;
      representatives=t.instances.map(id=>representatives.find(x=>x.c.instance===id));
      temporalReference={kind:combination==='PARALLEL'?'PARENT_PARALLEL_TIME_REFERENCE':'PARENT_SERIAL_TIME_REFERENCE',instances:t.instances,start:t.start,end:t.end,operator:combination==='PARALLEL'?'MAX':'SUM',parent_interval:{lower:pc.lower,upper:pc.upper},source_refs:[...refs(parent.id,pc),...refs(parent.id,t.graph),...(t.completionProof?refs(parent.id,t.completionProof):[])]};
      diagnostics.push({reason:'COMPOSITION_FROM_PARENT_TIME_GRAPH',...temporalReference,child_refs:representatives.flatMap(x=>refs(x.node.id,x.c)),comparison_effect:'SUBSTITUTE_CHILD_VALUES_IN_PARENT_REFERENCE'});
     }
    }
    // Composition is a property of the source-bound component, not merely
    // of the current numeric value. Consult declarations of that same typed
    // identity in its ancestor chain; never derive a law from amount or unit.
    const componentDeclarations=representatives.map(x=>{
     const declarations=[x.node,...ancestors(plan,x.node.id)].flatMap(n=>map.get(n.id).filter(c=>c.type==='quantity'&&c.key===x.c.key&&c.instance===x.c.instance&&!relevantErrors(n.id,c).length&&['ADDITIVE','SERIAL','PARALLEL','EXCLUSIVE'].includes(c.combination)).map(c=>({node_id:n.id,constraint_id:c.id,combination:c.combination,source_refs:refs(n.id,c)})));
     const modes=[...new Set(declarations.map(d=>d.combination))];
     return {mode:modes.length===1?modes[0]:modes.length?'UNKNOWN':x.c.combination,declarations};
    });
    const componentModes=[...new Set(componentDeclarations.map(x=>x.mode))];
    if(componentDeclarations.some(x=>x.declarations.length))diagnostics.push({reason:'COMPONENT_COMPOSITION_DECLARATIONS',parent_refs:refs(parent.id,pc),components:componentDeclarations,comparison_effect:'SOURCE_BOUND_TYPED_IDENTITY'});
    if(['SINGLE','UNKNOWN'].includes(combination)&&representatives.length>1&&componentModes.length===1&&['ADDITIVE','SERIAL','PARALLEL','EXCLUSIVE'].includes(componentModes[0])&&representatives.every(x=>x.c.key!==pc.key&&compositionPaths.has(stable([x.node.id,x.c.id,parent.id,pc.id])))){
     combination=componentModes[0];diagnostics.push({reason:'COMPOSITION_FROM_LINKED_COMPONENTS',parent_refs:refs(parent.id,pc),child_refs:representatives.flatMap(x=>refs(x.node.id,x.c)),combination,comparison_effect:'EXPLICIT_STRUCTURAL_COMPOSITION'});
    }
    if(representatives.length>1&&['SINGLE','UNKNOWN'].includes(combination)){addFinding(parent,pc,representatives,'UNRESOLVED','多项资源之间缺少明确的累计、串行、并行或同一实例关系，不能擅自组合。',null,{failure_layer:'SOURCE_INFORMATION'});continue;}
    if(representatives.length>1){
     if(!pc.upper||representatives.some(x=>!x.c.lower||!x.c.upper||!x.c.lower.inclusive||!x.c.upper.inclusive||compare(x.c.lower.value,x.c.upper.value)!==0)){
      const op={kind:'interval_composition',dimension:pc.key,unit:pc.unit,parent:{lower:pc.lower,upper:pc.upper},combination,independent:pc.choice_model==='INDEPENDENT'||representatives.every(independentChoice),independence_evidence:independenceEvidence,intervals:representatives.map(x=>({lower:x.c.lower,upper:x.c.upper}))};
      run(parent,pc,representatives,op,r=>r.status==='UNRESOLVED'?'区间组合缺少可计算依据：'+r.reason:`组合允许区间为 ${r.composed.lower?.inclusive?'[':'('}${r.composed.lower?.value??'-∞'}, ${r.composed.upper?.value??'+∞'}${r.composed.upper?.inclusive?']':')'} ${unitText(pc.unit)}；`+(r.status==='VIOLATED'?'不包含于父允许区间，存在越界。':'包含于父允许区间。'));continue;
     }
     const op=['ADDITIVE','EXCLUSIVE'].includes(combination)?{kind:'budget',resource:pc.key,scope:pc.key,window:pc.key,unit:pc.unit,limit:pc.upper.value,combination,...(combination==='EXCLUSIVE'?{exclusion_ref:parent.id+':'+pc.clause_ids[0]}:{}),allocations:representatives.map(x=>({node_id:x.node.id,instance:x.c.instance,resource:pc.key,scope:pc.key,window:pc.key,unit:pc.unit,amount:x.c.lower.value}))}:{kind:'duration',schedule:combination,durations:representatives.map(x=>x.c.lower.value),limit:pc.upper.value,unit:pc.unit,order_evidence:temporalReference?temporalReference.source_refs.map(r=>r.node_id+':'+r.clause_id):pc.clause_ids.map(id=>parent.id+':'+id),...(temporalReference?{parent_reference:temporalReference}:{})};
     const r=calculateComparison(op);if(r.status==='VERIFIED'&&(pc.lower||!pc.upper.inclusive)){run(parent,pc,representatives,{kind:'interval_subset',dimension:pc.key,unit:pc.unit,parent:{lower:pc.lower,upper:pc.upper},child:{lower:{value:r.total,inclusive:true},upper:{value:r.total,inclusive:true}}});}else addFinding(parent,pc,representatives,r.status,chinese(op,r),{operands:op,result:r});
    }else for(const x of representatives)run(parent,pc,[x],{kind:'interval_subset',dimension:pc.key,unit:pc.unit,parent:{lower:pc.lower,upper:pc.upper},child:{lower:x.c.lower,upper:x.c.upper}},r=>{const v=x.c.lower;if(v&&x.c.upper&&compare(v.value,x.c.upper.value)===0&&pc.upper&&compare(v.value,pc.upper.value)>0)return `子任务确定 ${numberText(v.value)} ${unitText(pc.unit)}，父上限 ${numberText(pc.upper.value)} ${unitText(pc.unit)}，超出 ${numberText(add(v.value,multiply(pc.upper.value,'-1')))} ${unitText(pc.unit)}。`;return chinese({kind:'interval_subset'},r);});
   }else if(pc.type==='selection'){
    for(const x of matches){
     run(parent,pc,[x],{kind:'set_subset',parent:pc.members,child:x.c.members});
     run(parent,pc,[x],{kind:'interval_subset',dimension:pc.key+':selection-count',unit:'count',parent:{lower:{value:String(pc.min),inclusive:true},upper:{value:String(pc.max),inclusive:true}},child:{lower:{value:String(x.c.min),inclusive:true},upper:{value:String(x.c.max),inclusive:true}}});
    }
   }else if(pc.type==='domain'){
for(const x of matches){if(x.c.mode==='FORBID'){addFinding(parent,pc,[x],'INHERITED','子任务增加限制或未取消父约束；父限制继续适用。',null,{basis:'PROGRAM',rule:'PARENT_CONSTRAINT_PERSISTS'});continue;}
     const child=mappedDomainValues(x.c,parent,pc),allowed=pc.mode==='FORBID'?[...new Set(child)].filter(v=>!pc.values.includes(v)):pc.values;
     run(parent,pc,[x],{kind:'set_subset',parent:allowed,child});}
   }else if(pc.type==='condition'){
    const perNode=new Map();for(const x of matches){const group=perNode.get(x.node.id)??[];group.push(x);perNode.set(x.node.id,group);}
    for(const group of perNode.values()){const mapped=group.map(x=>mapBooleanExpression(x.c.expression,x.c,parent.id,pc.key)),child=mapped.length===1?mapped[0]:{all:mapped},variables=[...new Set([...symbols(pc.expression),...symbols(child)])].sort();run(parent,pc,group,{kind:'boolean_implication',variables,parent:pc.expression,child});}
   }
   else if(pc.type==='obligation')for(const x of matches){if(pc.mode!=='REQUIRED'||x.c.mode==='NOT_ASSIGNED'){addFinding(parent,pc,[x],'INHERITED','未取消父方必要义务；角色未承担不等于删除父方责任。',null,{basis:'PROGRAM',rule:'PARENT_OBLIGATION_PERSISTS'});continue;}if(x.c.mode==='CANCELLED'){const overlap={all:[pc.guard??true,mapBooleanExpression(x.c.guard??true,x.c,parent.id,pc.key)]},op={kind:'boolean_implication',variables:[...new Set(symbols(overlap))].sort(),parent:{not:overlap},child:true};run(parent,pc,[x],op,r=>r.status==='VIOLATED'?`子任务明确取消父任务必需义务“${constraintLabel(pc)}”，且父子触发条件存在共同成立状态。`:'取消条件与父义务触发条件不相交。');}else addFinding(parent,pc,[x],'INHERITED','子任务没有取消该必要义务；父方义务及其原触发条件继续适用。',null,{basis:'PROGRAM',rule:'PARENT_OBLIGATION_PERSISTS'});}
   else if(pc.type==='order'){
    // Compare the union as well as individual children: two locally harmless
    // edges can jointly reverse a required parent path.
    const byNode=new Map();for(const x of matches){if(!byNode.has(x.node.id))byNode.set(x.node.id,[]);byNode.get(x.node.id).push(x);}
    const nodeGraphs=[...byNode.values()];const groups=nodeGraphs.length>1?[...nodeGraphs,matches]:nodeGraphs;
    for(const group of groups){
     const events=[...(pc.events??[]),...group.flatMap(x=>x.c.events??[])],identities=new Map();
     let identityConflict=false;for(const event of events){const previous=identities.get(event.id);if(previous&&(previous.start!==event.start||previous.end!==event.end))identityConflict=true;identities.set(event.id,event);}
     if(identityConflict){addFinding(parent,pc,group,'UNRESOLVED','同一事件的开始/完成身份存在不一致，须修正结构映射。',null,{failure_layer:'GENERATION_OR_INTERFACE'});continue;}
     // The producer supplies the identity table; Core never strips a suffix or
     // compares natural-language event names. Task-before-task means end→start.
     const expand=e=>({from:identities.get(e.from)?.end??e.from,to:identities.get(e.to)?.start??e.to});
     const shared=new Set([...identities.values()].filter(a=>[...identities.values()].some(b=>a.id!==b.id&&a.end===b.start)).map(a=>a.end));
     const nontrivial=e=>e.from!==e.to||!shared.has(e.from);
     const required=pc.edges.map(expand).filter(nontrivial),edgeKey=e=>e.from+'\0'+e.to,removed=new Set(group.flatMap(x=>x.c.removed).map(expand).map(edgeKey));
     const lifecycle=[...identities.values()].map(e=>({from:e.start,to:e.end,lifecycle:true}));
     const supplied=group.flatMap(x=>x.c.edges).map(expand).filter(nontrivial),closed=group.some(x=>x.c.closed===true);
     if(pc.closed===true)run(parent,pc,group,{kind:'set_subset',parent:required.map(e=>JSON.stringify([e.from,e.to])),child:supplied.map(e=>JSON.stringify([e.from,e.to]))},r=>r.status==='VIOLATED'?'子图新增了父闭合前置关系集合之外的边。':'子图新增边均位于父闭合前置关系集合内。');
     const edges=[...(closed?[]:required.filter(e=>!removed.has(edgeKey(e)))),...supplied,...lifecycle].filter(nontrivial).map((e,i)=>({...e,id:'e'+i,kind:'prerequisite'}));
     const op={kind:'dependency',edges,required},r=calculateComparison(op);
     if(r.status==='UNRESOLVED'){addFinding(parent,pc,group,r.status,chinese(op,r),{operands:op,result:r});continue;}
     const reversals=required.filter(e=>e.from!==e.to).map(e=>findPrerequisitePath(edges,e.to,e.from)).filter(p=>p.reachable);
     const missing=r.reachability?.filter(p=>!p.reachable)??[];
     const childForbidden=group.flatMap(x=>x.c.forbidden_paths??[]).map(expand),parentForbidden=(pc.forbidden_paths??[]).map(expand);
     const checkPaths=(graph,paths)=>paths.length?calculateComparison({kind:'dependency',edges:graph,required:paths}):null;
     const parentGraph=[...required,...lifecycle].filter(nontrivial).map((e,i)=>({...e,id:'parent'+i,kind:'prerequisite'}));
     const deniedRequired=checkPaths(parentGraph,childForbidden),forbiddenIntroduced=checkPaths(edges,parentForbidden);
     if([deniedRequired,forbiddenIntroduced].some(x=>x?.status==='UNRESOLVED')){addFinding(parent,pc,group,'UNRESOLVED','禁止路径检查超过计算能力，不能判为通过。',null,{failure_layer:'CALCULATOR_COVERAGE'});continue;}
     const deniedWitness=deniedRequired?.reachability?.filter(p=>p.reachable)??[],forbiddenWitness=forbiddenIntroduced?.reachability?.filter(p=>p.reachable)??[];
     const parentConflict=reversals.length||missing.length||deniedWitness.length||forbiddenWitness.length;
     if(r.cycles.length&&!parentConflict)diagnostics.push({reason:'INTERNAL_DEPENDENCY_CYCLE',reason_zh:'子任务内部依赖有环，但未反转或移除父任务必要路径。',cycles:r.cycles,child_refs:group.flatMap(x=>refs(x.node.id,x.c))});
     const result={...r,status:parentConflict?'VIOLATED':'VERIFIED',parent_reversed_paths:reversals,...(childForbidden.length?{child_forbidden_parent_paths:deniedWitness}:{}),...(parentForbidden.length?{parent_forbidden_paths:forbiddenWitness}:{})};
     addFinding(parent,pc,group,result.status,parentConflict?forbiddenWitness.length?'子任务建立了父任务明确禁止的前置路径。':deniedWitness.length?'子任务明确排除了父任务必须保留的前置路径。':reversals.length?'子任务及其组合反转父任务必要前置路径：'+reversals.map(p=>p.nodes.join(' → ')).join('；'):'子任务明确移除父任务必要路径，且没有等价替代路径。':'父任务必要前置路径保留，未被反转。',{operands:op,result});
    }
   }
  }
 }
 // Unmatched graph scopes still receive an internal diagnostic, without
 // turning their unrelated cycles into a parent-boundary violation.
 for(const n of plan.nodes)for(const c of map.get(n.id).filter(c=>c.type==='order'&&!relevantErrors(n.id,c).length)){
  const op={kind:'dependency',edges:c.edges.filter(e=>e.from!==e.to||!(c.events??[]).some(a=>a.end===e.from&&(c.events??[]).some(b=>a.id!==b.id&&b.start===e.from))).map((e,i)=>({...e,id:'internal'+i,kind:'prerequisite'})),required:[]},r=calculateComparison(op);
  if(r.cycles?.length&&!diagnostics.some(d=>d.reason==='INTERNAL_DEPENDENCY_CYCLE'&&stable(d.child_refs)===stable(refs(n.id,c))))diagnostics.push({reason:'INTERNAL_DEPENDENCY_CYCLE',reason_zh:'局部依赖存在环；是否突破父必要路径由父子图计算单独判断。',cycles:r.cycles,child_refs:refs(n.id,c)});
 }
 // Novel child constraints have no parent restriction with the same explicit identity.
 // Record the scope of this conclusion rather than inventing a universal proof.
for(const n of plan.nodes.filter(n=>n.parent_id))for(const c of map.get(n.id)){
 if(relevantErrors(n.id,c).length)continue;
 const parents=ancestors(plan,n.id),hasMatch=calculationPlanRefersTo(plan,boundaries,n,c)||parents.some(p=>map.get(p.id).some(a=>related(n,p,c,a)));
 if(!hasMatch&&c.type==='unknown'&&c.axes?.includes('R')){const affected=parents.flatMap(p=>map.get(p.id).filter(pc=>pc.type==='quantity'&&pc.axes.includes('R')&&!c.independent_of?.includes(pc.key)).map(pc=>({p,pc})));for(const {p,pc} of affected)addFinding(p,pc,[{node:n,c}],'UNRESOLVED','未知资源尚未绑定父资源范围：'+c.reason+'；需补齐同一对象或独立范围的结构依据。',null,{failure_layer:'GENERATION_OR_INTERFACE'});}
 if(!hasMatch){const unmatched=parents.flatMap(p=>map.get(p.id).filter(a=>a.type==='quantity'&&(a.lower!==null||a.upper!==null)&&c.type==='quantity'&&a.unit===c.unit&&a.axes?.includes('R')&&c.axes?.includes('R')&&(!a.measure||!c.measure||a.measure===c.measure)&&!c.independent_of?.includes(a.key)).map(pc=>({p,pc})));if(unmatched.length){for(const {p,pc}of unmatched)addFinding(p,pc,[{node:n,c}],'UNRESOLVED','同单位子资源没有绑定父资源，也没有有来源的独立范围说明；需补齐组成关系图，不能视为父约束已保留。',null,{failure_layer:'GENERATION_OR_INTERFACE'});}else{recordEvaluation(n.id,c,c.type==='unknown'?'UNRESOLVED':'LOCAL_DECLARATION');diagnostics.push({reason_zh:c.type==='unknown'?c.reason:'新增结构未匹配同一身份的父限制：'+constraintLabel(c),child_refs:refs(n.id,c),comparison_effect:'NO_MATCHING_PARENT_BOUNDARY'});}}
}
 // A proved breach is decisive for this exact parent boundary. Preserve a
 // nondecisive source gap as diagnostic evidence, not another unresolved result.
 for(let i=findings.length-1;i>=0;i--){const f=findings[i];if(f.status!=='UNRESOLVED'||f.failure_layer!=='SOURCE_INFORMATION'||!f.boundary_key)continue;const proof=findings.find(v=>v.status==='VIOLATED'&&v.basis==='PROGRAM'&&v.boundary_key===f.boundary_key&&v.parent_refs[0]?.node_id===f.parent_refs[0]?.node_id);if(proof){diagnostics.push({reason:'GAP_NOT_NEEDED_FOR_PROVED_BREACH',reason_zh:f.reason,child_refs:f.child_refs,parent_refs:f.parent_refs,decisive_operands:proof.operands,comparison_effect:'VIOLATION_ALREADY_PROVED'});findings.splice(i,1);}}
 // Merge evidence of one explicit violation, not different parent restrictions.
 const grouped=[];for(const f of findings){const prior=grouped.find(g=>g.status===f.status&&stable(g.parent_refs)===stable(f.parent_refs)&&stable(g.axes)===stable(f.axes)&&stable(g.operands)===stable(f.operands)&&g.reason===f.reason);if(prior){prior.child_refs=[...new Map([...prior.child_refs,...f.child_refs].map(r=>[stable(r),r])).values()];prior.target_node_ids=[...new Set([...prior.target_node_ids,...f.target_node_ids])];}else grouped.push(f);}
 // A full duration composition and its contained-part lower bound prove the
 // same parent limit. Keep the stronger full composition with both proofs.
 for(let i=grouped.length-1;i>=0;i--){const f=grouped[i];
  if(f.status!=='VIOLATED'||f.operands?.kind!=='containment_lower_bound')continue;
  const full=grouped.find(g=>g!==f&&g.status==='VIOLATED'&&g.boundary_key===f.boundary_key&&stable(g.parent_refs)===stable(f.parent_refs)&&g.operands?.kind==='duration'&&f.child_refs.every(r=>g.child_refs.some(x=>stable(x)===stable(r))));
  if(full){full.additional_proofs??=[];full.additional_proofs.push({parent_refs:f.parent_refs,child_refs:f.child_refs,operands:f.operands,result:f.operand_calculation});grouped.splice(i,1);}
 }
 // A closed allowance and its explicit prohibition can describe one breach.
 // Merge that same child event within one parent's object domain, retaining both
 // proofs. Different numeric limits and different parent nodes stay separate.
 for(let i=grouped.length-1;i>=0;i--){const f=grouped[i];if(f.status!=='VIOLATED'||f.constraint_type!=='domain')continue;
  const prior=grouped.slice(0,i).find(g=>g.status==='VIOLATED'&&g.constraint_type==='domain'&&g.boundary_key===f.boundary_key&&g.parent_refs[0]?.node_id===f.parent_refs[0]?.node_id&&stable(g.child_refs)===stable(f.child_refs)&&stable([...(g.operand_calculation?.outside??[])].sort())===stable([...(f.operand_calculation?.outside??[])].sort()));
  if(prior){prior.additional_proofs??=[];prior.additional_proofs.push({parent_refs:f.parent_refs,operands:f.operands,result:f.operand_calculation});prior.parent_refs=[...new Map([...prior.parent_refs,...f.parent_refs].map(r=>[stable(r),r])).values()];prior.axes=[...new Set([...prior.axes,...f.axes])];grouped.splice(i,1);}
 }
 // Repeated identical restrictions along one ancestry chain are one breached
 // boundary. Keep each ancestor's proof; different allowances remain separate.
 for(let i=grouped.length-1;i>=0;i--){const f=grouped[i];if(f.status!=='VIOLATED'||f.constraint_type!=='domain')continue;
  const prior=grouped.slice(0,i).find(g=>g.status==='VIOLATED'&&g.constraint_type==='domain'&&g.boundary_key===f.boundary_key&&stable(g.child_refs)===stable(f.child_refs)&&stable(g.operands)===stable(f.operands)&&g.parent_refs.some(a=>f.parent_refs.some(b=>a.node_id!==b.node_id&&(ancestors(plan,a.node_id).some(n=>n.id===b.node_id)||ancestors(plan,b.node_id).some(n=>n.id===a.node_id)))));
  if(prior){prior.additional_proofs??=[];prior.additional_proofs.push({parent_refs:f.parent_refs,operands:f.operands,result:f.operand_calculation},...(f.additional_proofs??[]));prior.parent_refs=[...new Map([...prior.parent_refs,...f.parent_refs].map(r=>[stable(r),r])).values()];prior.axes=[...new Set([...prior.axes,...f.axes])];grouped.splice(i,1);}
 }
 for(let i=grouped.length-1;i>=0;i--){const f=grouped[i];if(f.status!=='UNRESOLVED'||f.failure_layer!=='SOURCE_INFORMATION'||!f.boundary_key)continue;
  const prior=grouped.slice(0,i).find(g=>g.status==='UNRESOLVED'&&g.failure_layer==='SOURCE_INFORMATION'&&g.boundary_key===f.boundary_key&&g.parent_refs[0]?.node_id===f.parent_refs[0]?.node_id);
  if(prior){prior.source_gaps??=[{reason:prior.reason,parent_refs:prior.parent_refs,child_refs:prior.child_refs}];prior.source_gaps.push(...(f.source_gaps??[{reason:f.reason,parent_refs:f.parent_refs,child_refs:f.child_refs}]));for(const k of ['parent_refs','child_refs'])prior[k]=[...new Map([...prior[k],...f[k]].map(r=>[stable(r),r])).values()];prior.axes=[...new Set([...prior.axes,...f.axes])];prior.target_node_ids=[...new Set([...prior.target_node_ids,...f.target_node_ids])];prior.reason=prior.reason_zh=[...new Set(prior.source_gaps.map(g=>g.reason))].join('；');grouped.splice(i,1);}
 }
 grouped.forEach((f,i)=>{delete f._key;f.id='F'+(i+1);});
 const priority=['VIOLATED','UNRESOLVED','VERIFIED','INHERITED'];const axes=Object.fromEntries(AXES.map(a=>[a,priority.find(s=>grouped.some(f=>f.axes.includes(a)&&f.status===s))??'NOT_RUN']));
 const status=priority.find(s=>grouped.some(f=>f.status===s))??'NOT_RUN';
 // Preserve per-operand decisions before presentation grouping merges clauses.
 // Known source facts need no invented numeric value. Unknown operands and
 // unresolved comparisons remain explicit; this ledger is not an extra parser.
 const constraint_evaluations=plan.nodes.flatMap(n=>map.get(n.id).map(c=>{
  const rows=evaluations.get(n.id+':'+c.id)??[],bad=c.type==='unknown'||relevantErrors(n.id,c).length||c.type==='quantity'&&c.role==='VALUE'&&c.lower===null&&c.upper===null;
  const state=bad?'UNRESOLVED':['UNRESOLVED','VIOLATED','VERIFIED','INHERITED','LOCAL_DECLARATION'].find(s=>rows.includes(s))
   ??(c.type==='domain'&&c.mode==='SELECT'?'SOURCE_FACT':c.type==='quantity'&&c.lower===null&&c.upper===null?'NO_RESTRICTION':null);
  return {node_id:n.id,constraint_id:c.id,key:c.key,clause_ids:c.clause_ids,status:state??'UNRESOLVED'};
 }));
 return {format:'boundx-plan-comparison/8',engine:'DETERMINISTIC_FORMAL_CORE',status,axes,findings:grouped,diagnostics,constraint_evaluations,composition_paths:[...compositionPaths.values()],covered_clause_count:plan.nodes.reduce((sum,n)=>sum+(boundaries[n.id]?.boundary?.clauses?.length??0),0),coverage_basis:'SOURCE_BOUND_FORMAL_CONSTRAINTS',business_decision:null,execution_authorization:null};
}
