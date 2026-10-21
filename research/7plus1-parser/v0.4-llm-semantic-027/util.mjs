import fs from 'node:fs';
import crypto from 'node:crypto';
export const ROOT='research/7plus1-parser/v0.4-llm-semantic-027';
export const REPORT='docs/reports/7plus1/7P-LLM-SEMANTIC-COMPILER-027-LONG';
export const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
export const id=(...x)=>'v04:'+sha(JSON.stringify(x)).slice(0,24);
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export function save(p,x){fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{encoding:'utf8',flag:'wx'});}
export const uniq=a=>[...new Set(a)];
