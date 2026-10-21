import fs from 'node:fs';
for(const [p,a,b]of [
 ['research/7plus1-parser/llm-first-028/contracts/semantic-contract.md','## 031-R1 Q05 可计算对象范围（强制补充）','## 可计算对象范围（强制补充）'],
 ['research/7plus1-parser/llm-first-028/contracts/FIELD-MAP.md','## Q05对象范围闭环','## 对象范围闭环']
]){const t=fs.readFileSync(p,'utf8');if(t.split(a).length!==2)throw Error('ANCHOR');fs.writeFileSync(p+'.032.tmp',t.replace(a,b),{flag:'wx'});fs.renameSync(p+'.032.tmp',p);}
