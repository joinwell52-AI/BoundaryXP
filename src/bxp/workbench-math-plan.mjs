// Declarative composition plans. Arithmetic remains in the existing Core.
import {ancestors} from './workbench-model.mjs';
import {calculateComparison} from './workbench-calculators.mjs';
import {compare,stable,units,dimension,add,multiply,rational} from './ir-kernel/values.mjs';
import {isInstantQuantity,instantConstraintValue,instantTarget,timeCoordinate,convertTime} from './workbench-time-coordinate.mjs';
import {convertUnit,productUnit,quotientUnit} from './workbench-unit-algebra.mjs';

const fail=(code,message)=>{const error=new Error(code+': '+message);error.code=code;throw error;};
const keys=(value,allowed)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(key=>allowed.includes(key));
const refKey=ref=>ref.node_id+':'+ref.constraint_id;
const getConstraint=(boundaries,ref)=>boundaries[ref.node_id]?.boundary?.formal?.constraints?.find(c=>c.id===ref.constraint_id);
const sourceExists=(boundaries,ref)=>keys(ref,['node_id','clause_id'])&&typeof ref.node_id==='string'&&typeof ref.clause_id==='string'&&boundaries[ref.node_id]?.boundary?.clauses?.some(c=>c.id===ref.clause_id&&c.source_valid);

export function validateCalculationPlan(record,{plan,boundaries,node_id}){
 if(!keys(record,['target_constraint_id','expression','unresolved','measure','unit'])||typeof record.target_constraint_id!=='string')fail('MATH_PLAN_FORMAT','数学计划字段无效');
 let target=getConstraint(boundaries,{node_id,constraint_id:record.target_constraint_id});
 if(target?.type!=='quantity'||target.role!=='LIMIT'||!target.lower&&!target.upper)fail('MATH_TARGET_INVALID','数学计划必须指向已有数量边界');
 if(record.unresolved!==undefined&&(!Array.isArray(record.unresolved)||record.unresolved.some(x=>!keys(x,['reason'])||typeof x.reason!=='string'||!x.reason.trim())))fail('MATH_UNRESOLVED_INVALID','未决项必须保留具体原因');
 if(record.expression===undefined||record.expression===null){
  if(!record.unresolved?.length)fail('MATH_EXPRESSION_REQUIRED','绑定不能替代数学表达式');
  return {target,leaves:[],source_refs:[]};
 }
 if(record.unresolved?.length)fail('MATH_PLAN_AMBIGUOUS','表达式与未决状态不能混用');
 const declaredUnit=record.unit??record.expression?.unit;
 if(record.unit!==undefined&&record.expression?.unit!==undefined&&record.unit!==record.expression.unit)fail('MATH_UNIT_ANNOTATION_CONFLICT','计划与根表达式的单位声明冲突');
 const originalTarget=target;let origin=null;
 if(isInstantQuantity(target)){
  if(record.measure!=='INSTANT'||typeof declaredUnit!=='string')fail('MATH_TIME_COORDINATE_REQUIRED','时刻表达式必须声明INSTANT及统一时间单位');
  ({target,origin}=instantTarget(target,declaredUnit));
 }else{
  if(record.measure!==undefined&&!['QUANTITY','DURATION'].includes(record.measure))fail('MATH_MEASURE_INVALID','普通数量不能作为绝对时刻');
  if(declaredUnit!==undefined&&declaredUnit!==target.unit){target={...target,unit:declaredUnit,lower:target.lower?{...target.lower,value:convertTime(target.lower.value,target.unit,declaredUnit)}:null,upper:target.upper?{...target.upper,value:convertTime(target.upper.value,target.unit,declaredUnit)}:null};}
 }
 const leaves=[],sources=[];let count=0;
 const walk=(expression,depth,asInstant=false)=>{
  if(++count>256||depth>32)fail('MATH_PLAN_CAPACITY','数学表达式超过结构容量');
  if(keys(expression,['ref'])&&Object.hasOwn(expression,'ref')){
   const ref=expression.ref;
   if(!keys(ref,['node_id','constraint_id'])||typeof ref.node_id!=='string'||typeof ref.constraint_id!=='string')fail('MATH_OPERAND_REFERENCE','操作数必须引用已有约束');
   const owner=plan.nodes.find(n=>n.id===ref.node_id),constraint=getConstraint(boundaries,ref);
   if(!owner||owner.id!==node_id&&!ancestors(plan,owner.id).some(n=>n.id===node_id)||!constraint)fail('MATH_OPERAND_SCOPE','操作数必须引用本数学目标范围内已有约束');
   if(asInstant){if(!origin||!instantConstraintValue(constraint))fail('MATH_TIME_POINT_REFERENCE','INSTANT必须引用已有单一完整日期时刻，且父边界提供同一坐标原点');}
   else{
    if(constraint.type!=='quantity'||constraint.role!=='VALUE')fail('MATH_OPERAND_SCOPE','普通操作数必须是已有子数量值');
    if(!constraint.lower||!constraint.upper||!constraint.lower.inclusive||!constraint.upper.inclusive||compare(constraint.lower.value,constraint.upper.value)!==0)fail('MATH_EXACT_OPERAND_REQUIRED','当前运算计划只接受已有精确数量值，未定区间必须保留未决');
   }
   if(!constraint.clause_ids?.length||constraint.clause_ids.some(clause_id=>!sourceExists(boundaries,{node_id:owner.id,clause_id})))fail('MATH_OPERAND_SOURCE','操作数缺少精确原文来源');
   leaves.push({...ref,kind:asInstant?'INSTANT':'QUANTITY'});return;
  }
  const arity=expression?.operator==='INSTANT'?[1,1]:['DIFFERENCE','QUOTIENT'].includes(expression?.operator)?[2,2]:[2,64];
  if(asInstant||!keys(expression,['operator','args','source_refs','unit'])||!['SUM','MAX','MIN','PRODUCT','DIFFERENCE','QUOTIENT','INSTANT'].includes(expression.operator)||!Array.isArray(expression.args)||expression.args.length>arity[1]||expression.args.length<arity[0])fail('MATH_OPERATOR_INVALID','表达式只接受有定义的基本算术算子及操作数引用，不接受字面答案');
  if(expression.unit!==undefined&&(typeof expression.unit!=='string'||!expression.unit.trim()))fail('MATH_UNIT_ANNOTATION_CONFLICT','单位标注必须为明确单位');
  if(!Array.isArray(expression.source_refs)||!expression.source_refs.length||expression.source_refs.some(ref=>!sourceExists(boundaries,ref)||ref.node_id!==node_id&&!plan.nodes.some(n=>n.id===ref.node_id&&ancestors(plan,n.id).some(p=>p.id===node_id))))fail('MATH_OPERATOR_SOURCE','每个运算符必须引用本范围内的原文依据');
  sources.push(...expression.source_refs);for(const arg of expression.args)walk(arg,depth+1,expression.operator==='INSTANT');
 };
 walk(record.expression,0);
 return {target,original_target:originalTarget,origin,leaves,source_refs:[...new Map(sources.map(ref=>[stable(ref),ref])).values()]};
}

// Expression references establish operand membership directly. They do not
// require every leaf event to be repeated in an ancestor's event inventory.
export function calculationPlanRefersTo(plan,boundaries,node,c){
 for(const parent of ancestors(plan,node.id))for(const record of boundaries[parent.id]?.boundary?.formal?.calculation_plans??[]){
  if(!record.expression)continue;
  try{if(validateCalculationPlan(record,{plan,boundaries,node_id:parent.id}).leaves.some(r=>r.node_id===node.id&&r.constraint_id===c.id))return true;}catch{/* Invalid expressions remain execution errors. */}
 }
 return false;
}

export function evaluateCalculationPlan(record,context){
 const checked=validateCalculationPlan(record,context);
 if(!record.expression)fail('MATH_EXPRESSION_UNRESOLVED',record.unresolved.map(x=>x.reason).join('；'));
 const {target,origin}=checked,available=context.operands.filter(x=>x.c.role==='VALUE'||instantConstraintValue(x.c)),operands=new Map(available.map(x=>[refKey({node_id:x.node.id,constraint_id:x.c.id}),x]));
 const used=[],steps=[];
 const scalar=unit=>['count','次','1'].includes(unit);
 const fixed=value=>({lower:{value,inclusive:true},upper:{value,inclusive:true}});
 const adapt=(value,to)=>{
  if(value.unit===to)return value;
  if(scalar(value.unit)&&scalar(to))return {...value,unit:to};
  const converted=convertUnit(value.interval.lower.value,value.unit,to);
  return {...value,unit:to,interval:{lower:{...value.interval.lower,value:converted},upper:{...value.interval.upper,value:converted}},numeric:converted};
 };
 const intervalText=interval=>interval.lower&&interval.upper&&interval.lower.inclusive&&interval.upper.inclusive&&compare(interval.lower.value,interval.upper.value)===0?interval.lower.value:stable(interval);
 const point=expression=>{
  const ref=expression.args[0].ref,row=operands.get(refKey(ref));if(!row)fail('MATH_OPERAND_UNBOUND','时刻引用不存在于本范围');
  const raw=instantConstraintValue(row.c),value=timeCoordinate(raw,origin,target.unit);used.push(row);
  const interval={lower:{value,inclusive:true},upper:{value,inclusive:true}};
  steps.push({operator:'INSTANT',source_refs:expression.source_refs,reference:ref,source_value:raw,coordinate:origin,unit:target.unit,value});
  return {interval,numeric:value,symbolic:row.c.label??row.c.key,kind:'INSTANT',unit:target.unit};
 };
 const walk=expression=>{
  if(expression.operator==='INSTANT'){const value=point(expression);return expression.unit?adapt(value,expression.unit):value;}
  if(expression.ref){
   const row=operands.get(refKey(expression.ref));
   if(!row)fail('MATH_OPERAND_UNBOUND','表达式引用的操作数尚未绑定到该父边界');
   const interval={lower:row.c.lower,upper:row.c.upper};used.push(row);
   return {interval,numeric:intervalText(interval),symbolic:row.c.label??row.c.key,kind:'QUANTITY',unit:row.c.unit};
  }
  let args=expression.args.map(walk),points=args.filter(x=>x.kind==='INSTANT').length;
  let unit=expression.unit??(points?target.unit:args.find(x=>!scalar(x.unit))?.unit??args[0].unit),kind=points?'INSTANT':'QUANTITY',interval,result,op;
  const name=expression.operator;
  if(name==='PRODUCT'||name==='QUOTIENT'){
   if(points)fail('MATH_TIME_KIND_MISMATCH','时刻不能直接乘除');
   if(name==='PRODUCT'){
    unit=productUnit(args.map(x=>x.unit));interval=fixed(args.reduce((v,x)=>multiply(v,x.interval.lower.value),'1'));
   }else{
    unit=quotientUnit(args[0].unit,args[1].unit);
    const q=rational(args[1].interval.lower.value);if(q.n===0n)fail('MATH_DIVISION_BY_ZERO','除数为零');const inverse=String(q.n<0n?-q.d:q.d)+'/'+String(q.n<0n?-q.n:q.n);interval=fixed(multiply(args[0].interval.lower.value,inverse));
   }
   op={kind:'EXACT_ARITHMETIC',operator:name,args:args.map(x=>({value:x.interval.lower.value,unit:x.unit})),unit};result={status:'VERIFIED',basis:'PROGRAM',value:interval.lower.value};
  }else{
   args=args.map(x=>adapt(x,unit));
   if(name==='SUM'&&points>1||['MAX','MIN'].includes(name)&&points&&points!==args.length||name==='DIFFERENCE'&&points===1&&args[0].kind!=='INSTANT')fail('MATH_TIME_KIND_MISMATCH','时刻与时长的运算类型不相容');
   if(name==='DIFFERENCE'&&points===2)kind='QUANTITY';
   if(name==='SUM'||name==='MAX'){
    op={kind:'interval_composition',dimension:target.key,unit,parent:{lower:null,upper:null},combination:name==='SUM'?'ADDITIVE':'PARALLEL',intervals:args.map(x=>x.interval)};result=calculateComparison(op);interval=result.composed;
   }else{
    const values=args.map(x=>x.interval.lower.value),value=name==='MIN'?values.reduce((a,b)=>compare(a,b)<0?a:b):add(values[0],multiply(values[1],'-1'));
    interval=fixed(value);op={kind:'EXACT_ARITHMETIC',operator:name,args:values,unit};result={status:'VERIFIED',basis:'PROGRAM',value};
   }
  }
  if(result.status!=='VERIFIED')fail('MATH_OPERATOR_EVALUATION',result.reason??'已有算术未能求值');
  steps.push({operator:name,source_refs:expression.source_refs,operands:op,result});
  const render=field=>['MAX','MIN'].includes(name)?name.toLowerCase()+'('+args.map(x=>x[field]).join(', ')+')':'('+args.map(x=>x[field]).join({SUM:' + ',PRODUCT:' × ',DIFFERENCE:' - ',QUOTIENT:' ÷ '}[name])+')';
  const value={interval,numeric:render('numeric'),symbolic:render('symbolic'),kind,unit};return expression.unit?adapt(value,expression.unit):value;
 };
 const evaluated=adapt(walk(record.expression),target.unit);
 if((evaluated.kind==='INSTANT')!==!!origin)fail('MATH_RESULT_KIND_MISMATCH','计算结果必须与父边界同为时刻或同为数量');
 const op={kind:'interval_subset',dimension:target.key,unit:target.unit,parent:{lower:target.lower,upper:target.upper},child:evaluated.interval,calculation_expression:{numeric:evaluated.numeric,symbolic:evaluated.symbolic},calculation_plan:record,composition_tree:steps,...(origin?{time_coordinate:{...origin,unit:target.unit},source_parent:checked.original_target}:{})};
 return {operands:op,result:calculateComparison(op),used,source_refs:checked.source_refs};
}
