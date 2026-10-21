// Typed mathematical algebra. No source-language rules or model calls.
import {add,multiply,compare,exact,stable,rational} from './ir-kernel/values.mjs';
import {convertUnit,productUnit,quotientUnit} from './workbench-unit-algebra.mjs';
const num=(value,unit='count',coordinate)=>({type:'number',value:exact(value),unit,...(coordinate?{coordinate}:{})});
const bool=value=>({type:'boolean',value});
const demand=(condition,message)=>{if(!condition)throw Error(message);};
const inverse=value=>{const q=rational(value);demand(q.n!==0n,'DIVISION_BY_ZERO');return String(q.n<0n?-q.d:q.d)+'/'+String(q.n<0n?-q.n:q.n);};
const unique=items=>[...new Map(items.map(x=>[stable(x),x])).values()];
const compatible=(a,b)=>{demand(a.type==='number'&&b.type==='number','NUMBER_REQUIRED');demand(!a.coordinate||!b.coordinate||a.coordinate===b.coordinate,'TIME_COORDINATE_MISMATCH');return convertUnit(b.value,b.unit,a.unit);};
export function evaluateMathematicalExpression(expression,context={}){
 let nodes=0;const steps=[];
 const walk=(e,depth=0)=>{
  demand(e&&typeof e==='object'&&!Array.isArray(e)&&++nodes<=4096&&depth<=64,'EXPRESSION_STRUCTURE_OR_CAPACITY');
  if(e.ref){const b=context.boundaries?.[e.ref.node_id]?.boundary,c=b?.formal?.constraints?.find(c=>c.id===e.ref.constraint_id);demand(c&&c.clause_ids?.length&&c.clause_ids.every(id=>b.clauses.some(cl=>cl.id===id&&cl.source_valid)),'OPERAND_REFERENCE_OR_SOURCE');
   if(c.type==='quantity'){if(e.ref.bound){demand(['lower','upper'].includes(e.ref.bound)&&c[e.ref.bound],'FINITE_BOUND_REQUIRED');return num(c[e.ref.bound].value,c.unit);}demand(c.role==='VALUE'&&c.lower&&c.upper&&c.lower.inclusive&&c.upper.inclusive&&compare(c.lower.value,c.upper.value)===0,'EXACT_QUANTITY_REQUIRED');return num(c.lower.value,c.unit);}
   demand(c.type==='domain'&&c.mode==='SELECT'&&Array.isArray(c.values),'SET_REFERENCE_REQUIRED');return {type:'set',items:unique(c.values)};
  }
  if(Object.hasOwn(e,'number'))return num(e.number,e.unit);
  if(Object.hasOwn(e,'boolean')){demand(typeof e.boolean==='boolean','BOOLEAN_REQUIRED');return bool(e.boolean);}
  if(Object.hasOwn(e,'set')){demand(Array.isArray(e.set),'SET_REQUIRED');return {type:'set',items:unique(e.set)};}
  if(Object.hasOwn(e,'clock')){demand(typeof e.coordinate==='string'&&e.coordinate.length>0&&/^\d{2}:\d{2}(?::\d{2})?$/.test(e.clock),'CLOCK_COORDINATE_REQUIRED');const [h,m,s='0']=e.clock.split(':');demand(Number(h)<24&&Number(m)<60&&Number(s)<60,'CLOCK_INVALID');return num(add(add(multiply(h,'60'),m),multiply(s,'1/60')),'minute',e.coordinate);}
  demand(typeof e.op==='string'&&Array.isArray(e.args),'OPERATOR_ARGUMENTS_REQUIRED');const xs=e.args.map(x=>walk(x,depth+1));let r;
  const arity=n=>demand(xs.length===n,'OPERATOR_ARITY:'+e.op);
  const ns=()=>{demand(xs.length>0&&xs.every(x=>x.type==='number'),'NUMERIC_ARGUMENTS_REQUIRED');return xs;};
  switch(e.op){
   case 'LIST':r={type:'list',items:xs};break;
   case 'UNIQUE':arity(1);demand(['list','set'].includes(xs[0].type),'COLLECTION_REQUIRED');r={type:'set',items:unique(xs[0].items)};break;
   case 'CARDINALITY':arity(1);demand(xs[0].type==='set','SET_REQUIRED');r=num(String(xs[0].items.length));break;
   case 'UNION':case 'INTERSECTION':{
    demand(xs.length>=2&&xs.every(x=>x.type===xs[0].type),'SAME_COLLECTION_KIND_REQUIRED');
    if(xs[0].type==='set'){const items=unique(xs.flatMap(x=>x.items));r={type:'set',items:e.op==='UNION'?items:items.filter(item=>xs.every(x=>x.items.some(v=>stable(v)===stable(item))))};break;}
    demand(e.op==='INTERSECTION'&&xs.every(x=>x.type==='interval'),'INTERVAL_INTERSECTION_REQUIRED');
    let lower=xs[0].lower,upper=xs[0].upper,lc=xs[0].closed[0],uc=xs[0].closed[1];
    for(const x of xs.slice(1)){const l=compatible(lower,x.lower),u=compatible(upper,x.upper),cl=compare(l,lower.value),cu=compare(u,upper.value);if(cl>0){lower=num(l,lower.unit,lower.coordinate);lc=x.closed[0];}else if(!cl)lc=lc&&x.closed[0];if(cu<0){upper=num(u,upper.unit,upper.coordinate);uc=x.closed[1];}else if(!cu)uc=uc&&x.closed[1];}
    r={type:'interval',lower,upper,closed:[lc,uc]};break;
   }
   case 'INTERVAL':arity(2);demand(xs.every(x=>x.type==='number')&&Array.isArray(e.closed)&&e.closed.length===2&&e.closed.every(x=>typeof x==='boolean'),'INTERVAL_REQUIRED');r={type:'interval',lower:xs[0],upper:num(compatible(xs[0],xs[1]),xs[0].unit,xs[0].coordinate??xs[1].coordinate),closed:e.closed};break;
   case 'EMPTY':arity(1);demand(['set','interval'].includes(xs[0].type),'SET_OR_INTERVAL_REQUIRED');r=bool(xs[0].type==='set'?!xs[0].items.length:compare(xs[0].lower.value,xs[0].upper.value)>0||compare(xs[0].lower.value,xs[0].upper.value)===0&&!xs[0].closed.every(Boolean));break;
   case 'TAKE_SMALLEST':arity(2);demand(xs[0].type==='list'&&xs[1].type==='number','LIST_AND_COUNT_REQUIRED');{const n=Number(xs[1].value);demand(Number.isSafeInteger(n)&&n>=0&&n<=xs[0].items.length,'COUNT_OUT_OF_RANGE');const items=[...xs[0].items];items.sort((a,b)=>compare(a.value,compatible(a,b)));r={type:'list',items:items.slice(0,n)};}break;
   case 'INDICATOR':arity(1);demand(xs[0].type==='interval','INTERVAL_REQUIRED');r={type:'step_function',terms:[{interval:xs[0],weight:num('1')}]};break;
   case 'SUPREMUM':{
    arity(1);demand(xs[0].type==='step_function'&&xs[0].terms.length,'STEP_FUNCTION_REQUIRED');const terms=xs[0].terms,origin=terms[0].interval.lower,unit=terms[0].weight.unit;
    const intervals=terms.map(t=>({lower:compatible(origin,t.interval.lower),upper:compatible(origin,t.interval.upper),closed:t.interval.closed,weight:convertUnit(t.weight.value,t.weight.unit,unit)}));
    const events=new Map(),event=t=>{if(!events.has(t))events.set(t,{startClosed:'0',startOpen:'0',endClosed:'0',endOpen:'0'});return events.get(t);};
    for(const x of intervals){const cmp=compare(x.lower,x.upper);demand(cmp<=0,'INTERVAL_REVERSED');if(!cmp&&!x.closed.every(Boolean))continue;const l=event(x.lower),u=event(x.upper),sk=x.closed[0]?'startClosed':'startOpen',ek=x.closed[1]?'endClosed':'endOpen';l[sk]=add(l[sk],x.weight);u[ek]=add(u[ek],x.weight);}
    const endpoints=[...events.keys()].sort(compare);let max='0',running='0',witness=null;
    for(const t of endpoints){const ev=events.get(t),at=add(add(running,multiply(ev.endOpen,'-1')),ev.startClosed),after=add(add(at,multiply(ev.endClosed,'-1')),ev.startOpen);for(const[position,v]of [['AT',at],['AFTER',after]])if(compare(v,max)>0){max=v;witness={coordinate:origin.coordinate,point:t,position,unit:origin.unit};}running=after;}
    r=num(max,unit);steps.push({operator:'SUPREMUM_WITNESS',witness,critical_points_checked:endpoints.length,algorithm:'EXACT_ENDPOINT_SWEEP'});break;
   }
   case 'SUM':case 'PRODUCT':case 'DIFFERENCE':case 'QUOTIENT':case 'MIN':case 'MAX':{
    const args=xs.length===1&&xs[0].type==='list'?xs[0].items:xs;demand(args.length>0,'NUMERIC_ARGUMENTS_REQUIRED');
    if(args.some(x=>x.type==='step_function')){demand(['SUM','PRODUCT'].includes(e.op),'FUNCTION_OPERATION_UNSUPPORTED');if(e.op==='SUM'){demand(args.every(x=>x.type==='step_function'),'STEP_FUNCTION_SUM_REQUIRED');r={type:'step_function',terms:args.flatMap(x=>x.terms)};}else{const f=args.filter(x=>x.type==='step_function');demand(f.length===1,'LINEAR_STEP_PRODUCT_REQUIRED');const factors=args.filter(x=>x.type!=='step_function');demand(factors.every(x=>x.type==='number'),'NUMBER_REQUIRED');r={type:'step_function',terms:f[0].terms.map(t=>({interval:t.interval,weight:num(factors.reduce((v,x)=>multiply(v,x.value),t.weight.value),productUnit([t.weight.unit,...factors.map(x=>x.unit)]))}))};}break;}
    demand(args.every(x=>x.type==='number'),'NUMBER_REQUIRED');let value,unit=args[0].unit;
    if(e.op==='PRODUCT'){value=args.reduce((v,x)=>multiply(v,x.value),'1');unit=productUnit(args.map(x=>x.unit));}
    else if(e.op==='QUOTIENT'){arity(2);value=multiply(args[0].value,inverse(args[1].value));unit=quotientUnit(args[0].unit,args[1].unit);}
    else{const values=args.map(x=>compatible(args[0],x));if(e.op==='SUM')value=values.reduce(add,'0');else if(e.op==='DIFFERENCE'){arity(2);value=add(values[0],multiply(values[1],'-1'));}else value=values.reduce((a,b)=>(compare(a,b)*(e.op==='MIN'?1:-1)<=0)?a:b);}
    r=num(value,unit,args[0].coordinate);break;
   }
   case 'LE':case 'LT':case 'GE':case 'GT':case 'EQ':case 'NE':{arity(2);let n;if(xs[0].type==='number')n=compare(xs[0].value,compatible(xs[0],xs[1]));else{demand(xs[0].type===xs[1].type,'COMPARABLE_TYPES_REQUIRED');n=stable(xs[0])===stable(xs[1])?0:1;demand(['EQ','NE'].includes(e.op),'ORDERED_NUMBERS_REQUIRED');}r=bool({LE:n<=0,LT:n<0,GE:n>=0,GT:n>0,EQ:n===0,NE:n!==0}[e.op]);break;}
   case 'AND':case 'OR':demand(xs.length>0&&xs.every(x=>x.type==='boolean'),'BOOLEAN_REQUIRED');r=bool(e.op==='AND'?xs.every(x=>x.value):xs.some(x=>x.value));break;
   case 'NOT':arity(1);demand(xs[0].type==='boolean','BOOLEAN_REQUIRED');r=bool(!xs[0].value);break;
   case 'IMPLIES':arity(2);demand(xs.every(x=>x.type==='boolean'),'BOOLEAN_REQUIRED');r=bool(!xs[0].value||xs[1].value);break;
   default:throw Error('MATHEMATICAL_OPERATOR_NOT_IMPLEMENTED:'+e.op);
  }
  steps.push({operator:e.op,arguments:xs,value:r});return r;
 };
 const value=walk(expression);demand(value.type==='boolean','COMPARISON_EXPRESSION_REQUIRED');return {status:value.value?'VERIFIED':'VIOLATED',basis:'PROGRAM',method:'TYPED_MATHEMATICAL_EXPRESSION',value:value.value,steps};
}
