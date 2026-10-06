import fs from 'node:fs';
import crypto from 'node:crypto';
export const CODE='research/7plus1-parser/downstream-semantic-validation-026f';
export const OUT='docs/reports/7plus1/7P-DOWNSTREAM-SEMANTIC-VALIDATION-026F';
export const OLD='docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E';
export const BASE='docs/reports/7plus1/7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG';
export const read=p=>JSON.parse(fs.readFileSync(p));
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export function save(p,x){fs.mkdirSync(p.substring(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});}
export const stable=x=>JSON.stringify(x,(_,v)=>v instanceof Map?Object.fromEntries(v):v);
