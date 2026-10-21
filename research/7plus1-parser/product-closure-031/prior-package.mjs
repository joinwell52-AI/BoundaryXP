// Package the byte-exact committed 029 core for isolated full-version rollback rehearsal.
import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {sha256} from '../llm-first-028/source.mjs';
const commit='ca86e87ea5b07ca770948e5e1231ae9972542ff5',dest=path.resolve('.boundx/experiments/031/packages/prior-029'),current=path.resolve('.boundx/experiments/031/packages/frozen-031');
if(fs.existsSync(dest))throw Error('PACKAGE_EXISTS');fs.mkdirSync(dest,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(current,'PRODUCT-MANIFEST.json'))),files=[],priorPaths=new Set(execFileSync('git',['-c','core.quotePath=false','ls-tree','-r','--name-only',commit,'--','research/7plus1-parser/llm-first-028/','research/7plus1-parser/v0.3-p2.1-generalization/web/','docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md'],{encoding:'utf8',maxBuffer:4*1024*1024}).split('\n'));
for(const x of manifest.files){
 if((x.path.startsWith('research/7plus1-parser/')||x.path.startsWith('docs/'))&&!priorPaths.has(x.path))continue;
 let b;if(x.path.startsWith('research/7plus1-parser/')||x.path.startsWith('docs/'))b=execFileSync('git',['show',commit+':'+x.path],{maxBuffer:10*1024*1024});else b=fs.readFileSync(path.join(current,x.path));
 if(x.path==='package.json'){const p=JSON.parse(b);p.version='0.1.0-baseline.029.4';b=Buffer.from(JSON.stringify(p,null,2)+'\n');}
 if(x.path==='package-lock.json'){const p=JSON.parse(b);p.version='0.1.0-baseline.029.4';p.packages[''].version=p.version;b=Buffer.from(JSON.stringify(p,null,2)+'\n');}
 const to=path.join(dest,x.path);fs.mkdirSync(path.dirname(to),{recursive:true});fs.writeFileSync(to,b);files.push({path:x.path,sha256:sha256(b)});
}
fs.writeFileSync(path.join(dest,'PRODUCT-MANIFEST.json'),JSON.stringify({...manifest,version:'0.1.0-baseline.029.4',compiler_revision:'029 committed core',contract:'028-r02',source_commit:commit,created_at:new Date().toISOString(),files,rehearsal_only:true,transport_wrappers_from_031:true},null,2)+'\n');console.log(dest);
