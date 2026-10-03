import fs from 'node:fs';
import crypto from 'node:crypto';
export const OUT='docs/reports/7plus1/7P-ADMIN-SHORT-018/';
export const ROOT='research/7plus1-parser/v0.3-admin-short-018/';
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const digest=p=>sha(fs.readFileSync(p));
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+e.name+'/'):[p+e.name]).sort();
export function write(p,v){if(fs.existsSync(OUT+'SEAL.md'))throw Error('SEALED');if(!p.startsWith(OUT))throw Error('OUT_OF_REPORT_SCOPE');fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');}
export const groups={G0:[3,6,12,21,47],G1:[1,10,26,32,48],G2:[38,39,41,42,49],G3:[11,29,43,45,46]};
export const caseId=n=>'ADM-'+String(n).padStart(3,'0');
export const source=n=>fs.readFileSync('fixtures/7plus1/admin-short-050-r02/'+caseId(n)+'/source.txt','utf8');
