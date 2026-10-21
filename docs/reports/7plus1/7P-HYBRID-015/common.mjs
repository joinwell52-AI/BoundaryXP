import fs from 'node:fs';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';
export const out='docs/reports/7plus1/7P-HYBRID-015/',runtime='research/7plus1-parser/v0.3-7p-hybrid-015/',control='research/7plus1-parser/v0.3-7p-composition-014/',contract='fixtures/7plus1/standard-contract/v0.3-admin-20261002/';
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),digest=p=>hash(fs.readFileSync(p));
export function write(p,v){if(fs.existsSync(out+'SEAL.md'))throw Error('SEALED');if(!(p.startsWith(out)||p.startsWith(runtime)||p.startsWith('tests/parser-7p-hybrid-015-')))throw Error('SCOPE');fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');}
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+e.name+'/'):[p+e.name]).sort();
export function git(...args){const r=spawnSync('git',args,{encoding:'utf8',maxBuffer:150e6});if(r.status!==0)throw Error(r.stderr);return r.stdout.trim();}
