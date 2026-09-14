// Present source-linked calculations; never manufacture a seven-slot draft.
export function sourceView(result,text){
 if(!result||result.text!==text||(!result.sourceAnalysis&&!result.pipeline))return null;
 const analysis=result.sourceAnalysis;
 const seen=new Set();
 const findings=[...(analysis?.advice??[]),...result.engines.flatMap(e=>e.findings),...(result.pipeline?.stages.flatMap(s=>s.findings)??[])].filter(f=>{
  const key=f.code+':'+f.sources.map(s=>s.start+'-'+s.end).join(',');
  if(seen.has(key))return false;seen.add(key);return true;
 });
 return {analysis,findings,confirmed:false};
}
export function sourceDraft(result,text,language='zh-CN'){
 const view=sourceView(result,text);
 if(!view)return text;
 if(!view.findings.length)return text;
 const title=language==='en'?'Specific decisions still needed (original requirements preserved; no new authority):':'仍需明确的具体事项（保留原要求，不产生新授权）：';
 return text+'\n\n'+title+'\n'+view.findings.map((f,i)=>`${i+1}. ${f.suggestion[language]}`).join('\n');
}

// Main-page summaries are distinct from evidence/debug records. No raw counts
// become a safety verdict, and no unrecognized field is called absent.
function quantityFormula(proof,numbers){
 const prefix=proof.operands.map(x=>x.interval).join(' ∩ ')+' = '+proof.readableResult+' ';
 const labels=numbers.find(n=>n.unit===proof.unit&&n.unitLabels)?.unitLabels??[proof.unit,proof.unit];
 return {'zh-CN':prefix+labels[0],en:prefix+labels[1]};
}
export function sourcePresentation(result,text){
 const view=sourceView(result,text);
 if(!view)return null;
 const a=view.analysis;
 const numbers=a?.numbers??result.pipeline?.stages.flatMap(s=>s.result?.sourceAnalysis?.numbers??[])??[];
 const findings=view.findings.map(f=>['source_bound_intersection','unbound_interval_comparison'].includes(f.proof?.operation)?{...f,formula:quantityFormula(f.proof,numbers)}:f);
 if(!a)return {elements:{},findings,calculationNotes:[],technical:null};
 const elements=Object.fromEntries('IOAPRVCB'.split('').map(k=>[k,a.projection?.fields?.[k]??[]]));
 // Explicit prohibitions stay visible even when their full guard is unresolved.
 elements.B=[...elements.B,...(a.fields.B??[]).filter(s=>!elements.B.some(v=>v.sources.some(e=>e.start<=s.start&&e.end>=s.end))).map(s=>({text:{'zh-CN':s.quote,en:s.quote},sources:[s]}))];
 const hasCalculations=e=>(e.calculations?.length??0)>0||(e.sourceCalculations?.length??0)>0||(e.scopes??[]).some(hasCalculations);
 const intersections=(a.structuralCalculations?.sets??[]).filter(c=>c.operation==='source_bound_intersection');
 const covered=new Set(intersections.flatMap(c=>c.operands.map(x=>x.source.start+':'+x.source.end)));
 const calculationNotes=intersections.filter(c=>!c.empty).map(c=>({
  combined:true,formula:c.operands.map(x=>x.interval).join(' ∩ ')+' = '+c.readableResult+' '+c.unit,
  localizedFormula:quantityFormula(c,numbers),
  text:{'zh-CN':c.metric+'：上下界交集非空。','en':c.metric+': the bound intersection is non-empty.'},sources:c.sources,
  assumption:c.binding?.status==='source_binding_assumption'?{'zh-CN':'计算按前后两个名称指向同一指标进行；请核对缩略名称是否确实指向前一对象。','en':'This calculation treats the two source names as the same metric. Confirm that the abbreviated name refers to the preceding object.'}:null
 }));
 for(const n of a.numbers){
  if(covered.has(n.expressionSource.start+':'+n.expressionSource.end))continue;
  const metric=n.boundMetric??n.metricDisplay??n.metric,scope=n.kind==='bound'?'':'（条件内数值）';
  const display=(index)=>n.unitLabels?n.displayInterval.replace(n.unit,n.unitLabels[index]):n.displayInterval;
  calculationNotes.push({combined:false,text:{'zh-CN':(metric||'本句指标')+scope+'：'+display(0)+'；原文：'+n.expressionSource.quote,
    en:(metric||'Clause metric')+(n.kind==='bound'?'':' (conditional value)')+': '+display(1)+'; source: '+n.expressionSource.quote},sources:[n.expressionSource]});
 }
 return {elements,findings,hasApplicableChecks:result.engines.some(hasCalculations),calculationNotes,technical:a};
}
