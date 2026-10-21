// Drafts may be incomplete; confirmed baselines and reviews are separately revalidated by the server.
export function draftDocument(value){
  if(!value||typeof value!=='object'||typeof value.text!=='string'||value.text.length>100000||!value.parameters||typeof value.parameters!=='object'||Array.isArray(value.parameters)||!Array.isArray(value.actions)||value.actions.length>128||!Array.isArray(value.completion)||value.completion.length>128)throw Error('草案记录结构无效。');
  const string=(x,max=10000)=>{if(typeof x!=='string'||x.length>max)throw Error('草案字段无效。');return x;};
  const parameters=Object.fromEntries(Object.entries(value.parameters).map(([k,v])=>{if(!['I','O','A','P','R','V','C'].includes(k))throw Error('未知边界字段。');return [k,string(v)];}));
  return {text:value.text,parameters,actions:value.actions.map(a=>({actor:string(a?.actor,512),verb:string(a?.verb,512),target:string(a?.target,512),quote:string(a?.quote)})),completion:value.completion.map(c=>({id:string(c?.id,512),quote:string(c?.quote)}))};
}
export function draftPlan(value){
  if(!value||!Array.isArray(value.tasks)||value.tasks.length>64)throw Error('规划草案结构无效。');
  return {document:draftDocument(value.document),tasks:value.tasks.map(t=>{if(typeof t.id!=='string'||t.id.length>512||!Array.isArray(t.depends_on)||t.depends_on.length>64||t.depends_on.some(x=>typeof x!=='string'||x.length>512))throw Error('派单草案结构无效。');return {id:t.id,depends_on:t.depends_on,document:draftDocument(t.document)};})};
}

export function restoreContextPreferences(value,installed,active){
  if(!value||Object.keys(value).some(key=>!['industry','directory'].includes(key))||[value.industry,value.directory].some(digest=>typeof digest!=='string'||(digest!==''&&!/^[a-f0-9]{64}$/.test(digest))))throw Error('语义配置无效 / Invalid context preferences');
  const available=(digest,layer)=>!digest||installed.some(pack=>pack.layer===layer&&pack.digest===digest&&(layer!=='L3'||active.some(reference=>reference.digest===digest)));
  const valid=available(value.industry,'L2')&&available(value.directory,'L3');
  return {industry:available(value.industry,'L2')?value.industry:'',directory:available(value.directory,'L3')?value.directory:'',valid};
}

export function createBxpResultState(){
  let revision=0,current=null;
  return {
    clear(){current=null;return ++revision;},
    accept(ticket,value){
      if(ticket!==revision)return false;
      if(value?.schema!=='boundx-producer-result/v1'||typeof value.report!=='string')throw Error('无有效BXP报告 / No valid BXP report');
      current=structuredClone(value);return true;
    },
    export(kind){
      if(!current)throw Error('请先重新计算 / Recalculate first');
      if(kind==='report')return {name:'BoundaryXP-BXP-report.md',type:'text/markdown;charset=utf-8',text:current.report};
      if(!['task','result'].includes(kind))throw Error('未知导出类型 / Unknown export type');
      if(!current.computed||!current[kind])throw Error('尚未计算 / Not computed');
      return {name:`BoundaryXP-BXP-${kind}.json`,type:'application/json',text:JSON.stringify(current[kind],null,2)};
    }
  };
}
