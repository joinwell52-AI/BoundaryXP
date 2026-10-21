import fs from 'node:fs';import crypto from 'node:crypto';
export const out='docs/reports/7plus1/7P-HYBRID-015-SHORT-r02/',oldOut='docs/reports/7plus1/7P-HYBRID-015/',runtime='research/7plus1-parser/v0.3-7p-hybrid-015/';
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),digest=p=>hash(fs.readFileSync(p)),walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+e.name+'/'):[p+e.name]).sort();
export function write(p,v){if(fs.existsSync(out+'SEAL.md'))throw Error('SEALED');if(!p.startsWith(out))throw Error('SCOPE');fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');}
