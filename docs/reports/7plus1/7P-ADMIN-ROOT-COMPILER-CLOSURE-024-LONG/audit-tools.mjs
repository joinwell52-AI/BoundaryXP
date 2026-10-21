import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
export const OUT='docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG',RUNTIME='research/7plus1-parser/v0.3-admin-root-024';
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const git=(args,opts={})=>execFileSync('git',args,{encoding:'utf8',maxBuffer:100e6,...opts});
export const read=p=>JSON.parse(fs.readFileSync(p));
export const write=(name,data)=>{const p=path.join(OUT,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof data==='string'?data:JSON.stringify(data,null,2)+'\n',{flag:'wx'});};
export const walk=p=>fs.existsSync(p)?fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name).replaceAll('\\','/')]):[];
export function baseline(){const paths=git(['ls-files','-z']).split('\0').filter(Boolean);write('BASELINE.json',{base_commit:git(['rev-parse','HEAD']).trim(),branch:git(['branch','--show-current']).trim(),dirty:git(['status','--porcelain=v1','-uno']),files:paths.map(path=>({path,sha256:fs.existsSync(path)&&fs.statSync(path).isFile()?sha(fs.readFileSync(path)):null})),production_scripts:read('package.json').scripts,task_sha256:sha(fs.readFileSync('docs/tasks/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG.md')),method_sha256:sha(fs.readFileSync('docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md')),benchmark_sha256:sha(fs.readFileSync('docs/BoundaryXP-7plus1-ADMIN-ROOT-BENCHMARK-CONTRACT-v1.md'))});}
if(process.argv[2]==='baseline')baseline();
