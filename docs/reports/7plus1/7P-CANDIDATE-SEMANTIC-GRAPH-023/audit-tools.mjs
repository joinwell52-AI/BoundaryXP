import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
export const OUT='docs/reports/7plus1/7P-CANDIDATE-SEMANTIC-GRAPH-023',RUNTIME='research/7plus1-parser/v0.3-candidate-semantic-023';
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const git=(args,opts={})=>execFileSync('git',args,{encoding:'utf8',maxBuffer:100e6,...opts});
export const write=(name,data)=>{const p=path.join(OUT,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof data==='string'?data:JSON.stringify(data,null,2)+'\n',{flag:'wx'});};
export const read=p=>JSON.parse(fs.readFileSync(p));
export function walk(p){return fs.existsSync(p)?fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name).replaceAll('\\','/')]):[];}
export function baseline(){const paths=git(['ls-files','-z']).split('\0').filter(Boolean),models=walk('.boundx/nlp-models').filter(p=>!p.includes('/cache/'));write('BASELINE.json',{base_commit:git(['rev-parse','HEAD']).trim(),branch:git(['branch','--show-current']).trim(),dirty:git(['status','--porcelain=v1','-uno']),files:paths.map(p=>({path:p,sha256:fs.existsSync(p)&&fs.statSync(p).isFile()?sha(fs.readFileSync(p)):null})),models:models.map(p=>({path:p,sha256:sha(fs.readFileSync(p))})),production_scripts:read('package.json').scripts});}
if(process.argv[2]==='baseline')baseline();
