import fs from 'node:fs';import crypto from 'node:crypto';
export const OUT='docs/reports/7plus1/7P-ADMIN-SHORT-020-LONG/',ROOT='research/7plus1-parser/v0.3-admin-short-020/',OLD='docs/reports/7plus1/7P-ADMIN-SHORT-019-LONG/';
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),digest=p=>sha(fs.readFileSync(p)),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+e.name+'/'):[p+e.name]).sort();
export function write(p,v){if(fs.existsSync(OUT+'SEAL.md'))throw Error('SEALED');if(!p.startsWith(OUT))throw Error('OUT_OF_SCOPE');fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');}
export {signature} from '../7P-ADMIN-SHORT-019-LONG/common.mjs';
