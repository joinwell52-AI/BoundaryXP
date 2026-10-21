// Presentation of saved parser expressions and Core results. Never evaluates
// an expression, changes a finding, or requests another model calculation.
const symbols={SUM:' + ',PRODUCT:' × ',DIFFERENCE:' − ',QUOTIENT:' ÷ ',LE:' ≤ ',LT:' < ',GE:' ≥ ',GT:' > ',EQ:' = ',NE:' ≠ ',AND:' ∧ ',OR:' ∨ ',IMPLIES:' ⇒ ',UNION:' ∪ ',INTERSECTION:' ∩ '};
const statusText={VIOLATED:'已确认越界',VERIFIED:'本项未越界',UNRESOLVED:'尚不能判定'};
const unitText=unit=>({minute:'分钟',hour:'小时',second:'秒',day:'天',percent:'%','%':'%'}[unit]??(/^(?:count|[()*\s])+$/.test(unit??'')?'':unit??''));
const scalar=value=>typeof value==='boolean'?(value?'成立':'不成立'):value==null?'未记录':String(value);
const collection=xs=>'{'+(xs??[]).map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(', ')+'}';
function clockText(value,unit='minute'){
  try{
    if(!['minute','second','hour'].includes(unit))return null;
    const [n,d='1']=String(value).split('/'),numerator=BigInt(n)*BigInt({minute:60,second:1,hour:3600}[unit]),denominator=BigInt(d);
    if(denominator<=0n||numerator<0n||numerator%denominator)return null;
    const seconds=numerator/denominator,h=seconds/3600n,m=seconds%3600n/60n,s=seconds%60n;
    return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+(s?':'+String(s).padStart(2,'0'):'');
  }catch{return null;}
}
function valueText(value){
  if(!value||typeof value!=='object')return scalar(value);
  if(value.type==='boolean')return scalar(value.value);
  if(value.type==='number'){
    if(value.coordinate)return clockText(value.value,value.unit)??String(value.value)+' '+unitText(value.unit);
    return String(value.value)+(unitText(value.unit)?' '+unitText(value.unit):'');
  }
  if(value.type==='interval')return (value.closed?.[0]?'[':'(')+valueText(value.lower)+', '+valueText(value.upper)+(value.closed?.[1]?']':')');
  if(value.type==='set')return collection(value.items);
  if(value.type==='list')return '['+value.items.map(valueText).join(', ')+']';
  if(value.type==='step_function')return value.terms.map(t=>valueText(t.weight)+' × 𝟙'+valueText(t.interval)+'(t)').join(' + ');
  return JSON.stringify(value);
}
function rangeText(range,unit){
  if(!range)return '未记录';
  const {lower,upper}=range,suffix=unitText(unit)?' '+unitText(unit):'';
  if(lower&&upper&&lower.inclusive&&upper.inclusive&&String(lower.value)===String(upper.value))return '{'+lower.value+'}'+suffix;
  return (lower?.inclusive?'[':'(')+(lower?.value??'−∞')+', '+(upper?.value??'+∞')+(upper?.inclusive?']':')')+suffix;
}
function expressionText(expression,boundaries,depth=0){
  if(!expression||depth>64)return '未记录';
  if(expression.ref){
    const ref=expression.ref,c=boundaries?.[ref.node_id]?.boundary?.formal?.constraints?.find(x=>x.id===ref.constraint_id);
    if(c?.type==='quantity'){
      if(ref.bound&&c[ref.bound])return String(c[ref.bound].value);
      if(c.lower&&c.upper&&c.lower.inclusive&&c.upper.inclusive&&String(c.lower.value)===String(c.upper.value))return String(c.lower.value);
    }
    if(c?.type==='domain'&&c.mode==='SELECT')return collection(c.values);
    return c?.label??c?.key??ref.node_id+'.'+ref.constraint_id;
  }
  if(Object.hasOwn(expression,'clock'))return expression.clock;
  if(Object.hasOwn(expression,'number'))return String(expression.number);
  if(Object.hasOwn(expression,'boolean'))return scalar(expression.boolean);
  if(Object.hasOwn(expression,'set'))return collection(expression.set);
  const args=(expression.args??[]).map(x=>expressionText(x,boundaries,depth+1)),op=expression.op;
  if(op==='INTERVAL')return (expression.closed?.[0]?'[':'(')+args.join(', ')+(expression.closed?.[1]?']':')');
  if(op==='INDICATOR')return '𝟙'+args[0]+'(t)';
  if(op==='SUPREMUM')return 'supₜ['+args[0]+']';
  if(op==='NOT')return '¬('+args[0]+')';
  if(op==='CARDINALITY')return '|'+args[0]+'|';
  if(symbols[op])return '('+args.join(symbols[op])+')';
  return (op??'表达式')+'('+args.join(', ')+')';
}
function booleanText(expression){
  if(typeof expression==='boolean')return scalar(expression);
  if(expression?.var)return expression.var;
  if(expression?.not)return '¬('+booleanText(expression.not)+')';
  for(const [key,join]of [['all',' ∧ '],['any',' ∨ '],['implies',' ⇒ ']])if(expression?.[key])return '('+expression[key].map(booleanText).join(join)+')';
  return JSON.stringify(expression);
}
// Native MathML typesets the saved expression; it does not evaluate it.
export function proofMathElement(proof,boundaries={},doc=document,label=''){
  const node=(tag,...children)=>{
    const element=doc.createElementNS('http://www.w3.org/1998/Math/MathML',tag);
    for(const child of children)element.append(typeof child==='string'?doc.createTextNode(child):child);
    return element;
  };
  const text=value=>node('mtext',String(value??'未记录'));
  const op=value=>node('mo',value);
  const row=(...items)=>node('mrow',...items);
  const fence=(item,left='(',right=')')=>row(op(left),item,op(right));
  const join=(items,separator)=>row(...items.flatMap((item,i)=>i?[op(separator),item]:[item]));
  const number=value=>{
    const parts=String(value).split('/');
    return parts.length===2&&parts.every(x=>/^-?\d+$/.test(x))
      ?node('mfrac',node('mn',parts[0]),node('mn',parts[1])):node('mn',String(value));
  };
  const set=values=>fence(join((values??[]).map(value=>text(typeof value==='object'?JSON.stringify(value):value)),','),'{','}');
  const plain=value=>{
    const tokens=String(value??'').match(/\d{1,2}:\d{2}(?::\d{2})?|-?\d+\/\d+|\d+(?:\.\d+)?|[≤≥≠⇒⊆∪∩∧∨¬×÷+\-−=<>→∞()[\]{},|]|[^0-9≤≥≠⇒⊆∪∩∧∨¬×÷+\-−=<>→∞()[\]{},|]+/gu)??[];
    return row(...tokens.map(token=>/^\d{1,2}:\d{2}/.test(token)?text(token):/^-?\d/.test(token)?number(token):token.length===1&&/[≤≥≠⇒⊆∪∩∧∨¬×÷+\-−=<>→∞()[\]{},|]/u.test(token)?op(token):text(token)));
  };
  const precedence={IMPLIES:1,OR:2,AND:3,LE:4,LT:4,GE:4,GT:4,EQ:4,NE:4,UNION:5,INTERSECTION:5,SUM:6,DIFFERENCE:6,PRODUCT:7,QUOTIENT:7,NOT:8};
  const expression=(value,parentPrecedence=0,depth=0)=>{
    if(!value||depth>64)return text('未记录');
    if(value.ref){
      const ref=value.ref,c=boundaries?.[ref.node_id]?.boundary?.formal?.constraints?.find(x=>x.id===ref.constraint_id);
      if(c?.type==='quantity'){
        if(ref.bound&&c[ref.bound])return number(c[ref.bound].value);
        if(c.lower&&c.upper&&c.lower.inclusive&&c.upper.inclusive&&String(c.lower.value)===String(c.upper.value))return number(c.lower.value);
      }
      if(c?.type==='domain'&&c.mode==='SELECT')return set(c.values);
      return text(c?.label??c?.key??ref.node_id+'.'+ref.constraint_id);
    }
    if(Object.hasOwn(value,'clock'))return text(value.clock);
    if(Object.hasOwn(value,'number'))return number(value.number);
    if(Object.hasOwn(value,'boolean'))return text(scalar(value.boolean));
    if(Object.hasOwn(value,'set'))return set(value.set);
    const kind=value.op,args=value.args??[],priority=precedence[kind]??10;
    const render=(arg,context=0)=>expression(arg,context,depth+1);
    let result;
    if(kind==='INTERVAL')result=fence(join(args.map(arg=>render(arg)),','),value.closed?.[0]?'[':'(',value.closed?.[1]?']':')');
    else if(kind==='INDICATOR')result=row(node('msub',node('mn','1'),render(args[0])),fence(node('mi','t')));
    else if(kind==='SUPREMUM'){
      const supremum=op('sup');supremum.setAttribute('movablelimits','false');
      result=row(node('munder',supremum,node('mi','t')),fence(render(args[0]),'[',']'));
    }else if(kind==='CARDINALITY')result=fence(render(args[0]),'|','|');
    else if(kind==='NOT')result=row(op('¬'),render(args[0],priority));
    else if(kind==='QUOTIENT'&&args.length===2)result=node('mfrac',render(args[0]),render(args[1]));
    else if(symbols[kind])result=join(args.map((arg,i)=>render(arg,priority+(kind==='DIFFERENCE'&&i>0?1:0))),kind==='PRODUCT'?'·':symbols[kind].trim());
    else{
      const name=node('mi',({MIN:'min',MAX:'max'}[kind]??kind??'表达式'));name.setAttribute('mathvariant','normal');
      result=row(name,fence(join(args.map(arg=>render(arg)),',')));
    }
    return priority<parentPrecedence?fence(result):result;
  };
  const boolean=(value,depth=0)=>{
    if(depth>64)return text('未记录');
    if(typeof value==='boolean')return text(scalar(value));
    if(value?.var)return text(value.var);
    if(value?.not)return row(op('¬'),fence(boolean(value.not,depth+1)));
    for(const [key,symbol]of [['all','∧'],['any','∨'],['implies','⇒']]){
      if(value?.[key])return fence(join(value[key].map(arg=>boolean(arg,depth+1)),symbol));
    }
    return text(JSON.stringify(value));
  };
  const operands=proof.operands;
  let body;
  if(operands?.kind==='mathematical_expression')body=expression(operands.expression);
  else if(operands?.kind==='set_subset')body=row(set(operands.child),op('⊆'),set(operands.parent));
  else if(operands?.kind==='boolean_implication')body=row(boolean(operands.child),op('⇒'),boolean(operands.parent));
  else body=plain(label||proof.formula);
  const math=node('math',body);
  math.setAttribute('display','block');
  math.setAttribute('aria-label',label||proof.formula||'数学公式');
  return math;
}
function openProofDialog(block,opener,doc){
  const dialog=doc.createElement('dialog');dialog.className='proof-dialog';
  dialog.setAttribute('aria-label','数学公式与计算结果放大视图');
  const header=doc.createElement('div');header.className='proof-dialog-head';
  const title=doc.createElement('strong');title.textContent='数学公式与计算结果';
  const close=doc.createElement('button');close.type='button';close.className='btn';
  close.textContent='关闭';close.setAttribute('aria-label','关闭公式放大视图');
  close.addEventListener('click',()=>dialog.close());
  header.append(title,close);
  const content=block.cloneNode(true);content.classList.add('proof-enlarged');
  content.querySelectorAll('.proof-expand').forEach(button=>button.remove());
  dialog.append(header,content);
  dialog.addEventListener('close',()=>{dialog.remove();if(opener.isConnected)opener.focus();},{once:true});
  doc.body.append(dialog);dialog.showModal();
}
function stepText(step){
  if(!step?.value)return null;
  const args=(step.arguments??[]).map(valueText);
  if(symbols[step.operator]&&step.value.type!=='step_function')return args.join(symbols[step.operator])+' → '+valueText(step.value);
  if(step.operator==='SUPREMUM')return '峰值 = '+valueText(step.value);
  if(['CARDINALITY','MIN','MAX','EMPTY','UNIQUE'].includes(step.operator))return ({CARDINALITY:'去重数量',MIN:'最小值',MAX:'最大值',EMPTY:'为空',UNIQUE:'去重'}[step.operator])+' = '+valueText(step.value);
  return null;
}
export function savedProofView(proof,boundaries={}){
  const op=proof.operands,calculation=proof.operand_calculation;
  if(!proof.formula&&!op&&!calculation)return null;
  let formula=proof.formula??'',substitution='',lines=[],explanation=[];
  if(op?.kind==='mathematical_expression'){
    substitution=expressionText(op.expression,boundaries);
    lines=(calculation?.steps??[]).map(stepText).filter(Boolean);
    const peak=calculation?.steps?.find(x=>x.operator==='SUPREMUM');
    if(peak){
      explanation.push('𝟙(区间,t)：t 在区间内取 1，否则取 0；各项贡献相加后取峰值。');
      for(const term of peak.arguments?.[0]?.terms??[])explanation.push(valueText(term.interval)+' 内计入 '+valueText(term.weight)+'，区间外计入 0。');
    }
    const witness=calculation?.steps?.find(x=>x.operator==='SUPREMUM_WITNESS')?.witness;
    if(witness)explanation.push('峰值位置：'+(clockText(witness.point,witness.unit)??witness.point)+'（'+(witness.position==='AFTER'?'该时刻之后的区间':'该时刻')+'）。');
  }else if(op?.kind==='interval_subset'||op?.kind==='interval_composition'){
    substitution=(op.calculation_expression?.numeric??rangeText(op.child??calculation?.child,op.unit))+' ⊆ '+rangeText(op.parent,op.unit);
    if(op.calculation_expression)lines.push('运算结果 = '+rangeText(calculation?.child??calculation?.composed,op.unit));
    if(calculation?.child&&calculation?.parent)lines.push(rangeText(calculation.child,op.unit)+' ⊆ '+rangeText(calculation.parent,op.unit)+' → '+(calculation.status==='VIOLATED'?'不成立':calculation.status==='VERIFIED'?'成立':'未确定'));
  }else if(op?.kind==='set_subset'){
    substitution=collection(op.child)+' ⊆ '+collection(op.parent);
    if(calculation?.outside)lines.push(calculation.outside.length?'越界成员：'+collection(calculation.outside):'越界成员：∅');
  }else if(op?.kind==='boolean_implication'){
    substitution=booleanText(op.child)+' ⇒ '+booleanText(op.parent);
    for(const counterexample of calculation?.counterexamples??[])lines.push('越界赋值：'+Object.entries(counterexample).map(([key,value])=>key+' = '+scalar(value)).join('；'));
  }else if(op?.kind==='dependency'){
    substitution='要求：'+(op.required??[]).map(e=>e.from+' → '+e.to).join('；');
    for(const cycle of calculation?.cycles??[])lines.push('冲突环：'+cycle.nodes.join(' → '));
    for(const reversed of calculation?.parent_reversed_paths??[])lines.push('反向路径：'+reversed.nodes.join(' → '));
    if(!lines.length)for(const reach of calculation?.reachability??[])lines.push(reach.from+' → '+reach.to+'：'+(reach.reachable?'路径存在':'路径不存在'));
  }else{
    if(calculation?.total!==undefined)lines.push('计算总量：'+scalar(calculation.total));
    if(calculation?.value!==undefined)lines.push('计算值：'+scalar(calculation.value));
    if(calculation?.outside)lines.push('越界成员：'+collection(calculation.outside));
    if(calculation?.max_total!==undefined)lines.push('最大总量：'+calculation.max_total);
    if(calculation?.min_total!==undefined)lines.push('最小总量：'+calculation.min_total);
  }
  const completed=!!calculation&&['VIOLATED','VERIFIED'].includes(calculation.status);
  const result=completed?(statusText[proof.status]??statusText[calculation.status]):'尚无可用计算结果';
  if(calculation?.reason&&!completed)explanation.push(calculation.reason);
  return {formula,substitution,lines:[...new Set(lines)],explanation,result,completed};
}
export function appendMathProof(container,finding,boundaries={},doc=document){
  const el=(tag,text,cls)=>{const node=doc.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
  const proofs=[finding,...(finding.additional_proofs??[]).map(p=>({...finding,...p,operand_calculation:p.result,additional_proofs:undefined}))];
  for(const [index,proof]of proofs.entries()){
    const view=savedProofView(proof,boundaries);if(!view)continue;
    const block=el('section',undefined,'comparison-math-proof');
    block.setAttribute('data-status',proof.status??'UNRESOLVED');
    block.setAttribute('aria-label',index?'补充数学证明 '+index:'数学公式与计算结果');
    block.append(el('h3',index?'补充数学证明 '+index:'数学公式与计算结果'));
    const formula=view.substitution||view.formula;
    if(formula){
      const toolbar=el('div',undefined,'proof-formula-toolbar');
      const expand=el('button','放大查看','btn proof-expand');expand.type='button';
      expand.setAttribute('aria-label','放大查看数学公式');
      expand.addEventListener('click',()=>openProofDialog(block,expand,doc));
      toolbar.append(el('div',view.substitution?'代入后的公式':'数学公式','proof-label'),expand);
      const display=el('div',undefined,'proof-formula');
      display.setAttribute('tabindex','0');display.setAttribute('role','region');
      display.setAttribute('aria-label','数学公式，可横向滚动或放大查看');
      display.append(proofMathElement(proof,boundaries,doc,formula));
      block.append(toolbar,display);
    }
    block.append(el('div','计算结果','proof-label'));
    for(const line of view.lines)block.append(el('p',line,'proof-calculation'));
    block.append(el('strong',view.result,'proof-verdict'));
    for(const line of view.explanation)block.append(el('p',line,'proof-explanation'));
    if(view.formula&&view.substitution&&view.formula!==view.substitution){
      const details=el('details',undefined,'proof-original');
      details.append(el('summary','解析原式与说明'),el('p',view.formula,'proof-original-text'));
      block.append(details);
    }
    container.append(block);
  }
}
