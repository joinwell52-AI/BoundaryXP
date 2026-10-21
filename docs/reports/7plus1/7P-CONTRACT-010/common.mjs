import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
export const out='docs/reports/7plus1/7P-CONTRACT-010/',asset='fixtures/7plus1/standard-contract/v0.3-admin-20261002/',old='docs/reports/7plus1/7P-CLOSURE-008/',prev='docs/reports/7plus1/7P-ARCH-009/';
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),digest=p=>sha(fs.readFileSync(p));
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+e.name+'/'):[p+e.name]);
export const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:150e6}).trim();
export function write(p,x){if(!p.startsWith(out)&&!p.startsWith(asset))throw Error('OUT_OF_SCOPE_WRITE');if(fs.existsSync(out+'SEAL.md'))throw Error('SEALED_REPORT');fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n','utf8');}
export const caseTraces=()=>read(old+'COMPARISON.json').cases.map(x=>({...x,trace:read(x.trace_path)}));
