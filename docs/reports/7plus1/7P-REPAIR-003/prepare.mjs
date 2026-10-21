import fs from 'node:fs';import path from 'node:path';import{createHash}from'node:crypto';import{execFileSync}from'node:child_process';
const base='5372051bc4e3fc07f6283289ec1d5ea31f972805',report='docs/reports/7plus1/7P-REPAIR-003',old='research/7plus1-parser/v0.3-7p-repair-002-r03',next='research/7plus1-parser/v0.3-7p-repair-003';
const git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:100e6}),sha=b=>createHash('sha256').update(b).digest('hex'),put=(p,b)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,b,{flag:'wx'});};
if(git('rev-parse','origin/review/7plus1-parser').trim()!==base)throw Error('REMOTE_BASE_CHANGED');
git('merge-base','--is-ancestor','f266f67df770ad5cd65947f29c7dbdc7a7f29bc2',base);
if(git('diff','--cached','--name-only').trim())throw Error('STAGED_CHANGES_REQUIRE_PRESERVATION');
const previous_head=git('rev-parse','HEAD').trim(),previous_branch=git('symbolic-ref','HEAD').trim();
put('.git/7P-REPAIR-003.original-index',fs.readFileSync('.git/index'));
const paths=JSON.parse('['+git('-c','core.quotePath=false','ls-tree','-r','--name-only',base).trim().split('\n').map(JSON.stringify).join(',')+']');
put(report+'/BASELINE.json',JSON.stringify({base_commit:base,semantic_base:'7ccdcc349aba616e8952fab7755d8ab23c73819e',previous_head,previous_branch,index_backup:'.git/7P-REPAIR-003.original-index',files:Object.fromEntries(paths.map(p=>[p,fs.existsSync(p)?sha(fs.readFileSync(p)):null]))},null,2)+'\n');
// Change only Git branch/index metadata: no checkout, reset, merge or working-file overwrite.
git('update-ref','refs/heads/review/7plus1-parser',base,'7ccdcc349aba616e8952fab7755d8ab23c73819e');
git('symbolic-ref','HEAD','refs/heads/review/7plus1-parser');git('read-tree',base);
for(const p of paths.filter(p=>p=== 'docs/tasks/7plus1/CURRENT-TASK.md'||p==='docs/tasks/7plus1/7P-REPAIR-003.md'||p==='docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md'))put(p,execFileSync('git',['show',base+':'+p]));
for(const p of paths.filter(p=>p.startsWith(old+'/')))put(p.replace(old,next),fs.readFileSync(p));
console.log({base,branch:git('branch','--show-current').trim(),files:paths.length,next});
