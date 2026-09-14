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
