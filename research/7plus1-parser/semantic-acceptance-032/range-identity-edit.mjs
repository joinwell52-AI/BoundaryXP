import fs from 'node:fs';
const edits={
 'research/7plus1-parser/llm-first-028/scopes.mjs':[
  ["export function scopeDomainState(expressions,id,seen=new Set())","export function scopeDomainState(expressions,id,entities=[],seen=new Set())"],
  ["if(x.op==='CATEGORY')return x.operands.length===1?","if(x.op==='CATEGORY'&&x.operands.some(k=>entities.find(e=>e.id===k)?.alternatives?.length))return 'COMPETING';\n if(x.op==='CATEGORY')return x.operands.length===1?"],
  ["scopeDomainState(expressions,k,new Set(seen))","scopeDomainState(expressions,k,entities,new Set(seen))"],
  ["if(x.op==='CATEGORY'){\n   const values=","if(x.op==='CATEGORY'){\n   if(x.operands.some(k=>entities.find(e=>e.id===k)?.alternatives?.length))return 'UNKNOWN';\n   const values="],
  ["scopeDomainState(expressions,id),choices=[]","scopeDomainState(expressions,id,entities),choices=[]"]
 ],
 'research/7plus1-parser/llm-first-028/compile.mjs':[
  ["scopeDomainState(g.expressions,k)","scopeDomainState(g.expressions,k,g.entities)"],
  ["scopeDomainState(g.expressions,x.expression_id)","scopeDomainState(g.expressions,x.expression_id,g.entities)"]
 ],
 'research/7plus1-parser/llm-first-028/validate.mjs':[
  ["scopeDomainState(g.expressions,claim?.expression_id)","scopeDomainState(g.expressions,claim?.expression_id,g.entities)"]
 ],
 'research/7plus1-parser/llm-first-028/contracts/semantic-contract.md':[
  ["应保留域选择或REFERENT竞争","应以DOMAIN_CHOICE保留范围竞争（REFERENT另用于对象身份竞争）"]
 ]
};
for(const [p,changes]of Object.entries(edits)){let t=fs.readFileSync(p,'utf8');for(const [a,b]of changes){if(t.split(a).length!==2)throw Error('ANCHOR:'+p+':'+a);t=t.replace(a,b);}fs.writeFileSync(p+'.032.tmp',t,{flag:'wx'});fs.renameSync(p+'.032.tmp',p);}
