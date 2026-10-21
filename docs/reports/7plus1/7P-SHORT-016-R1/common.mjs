import fs from 'node:fs';import crypto from 'node:crypto';
export const out='docs/reports/7plus1/7P-SHORT-016-R1/';
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export const digest=p=>hash(fs.readFileSync(p));
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+e.name+'/'):[p+e.name]).sort();
export function write(p,v){if(fs.existsSync(out+'SEAL.md')||!p.startsWith(out))throw Error('SEALED_OR_SCOPE');fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');}
export function cases(){const text=fs.readFileSync('docs/tasks/7plus1/7P-SHORT-016-FROZEN-CASES.md','utf8');return [...text.matchAll(/# (D\d\d) — ([^\n]+)[\s\S]*?```text\n([\s\S]*?)\n```[\s\S]*?```yaml\n([\s\S]*?)\n```/g)].map(m=>({id:m[1],title:m[2],source:m[3],expected_yaml:m[4]}));}
