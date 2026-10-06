import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const OUT='docs/reports/7plus1/7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG';
export const OLD='docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG';
export const RUNTIME='research/7plus1-parser/v0.3-candidate-parsing-026';
export const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
export const read=p=>JSON.parse(fs.readFileSync(p));
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name).replaceAll('\\','/')]);
export function write(p,x){const file=path.join(OUT,p);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});}
