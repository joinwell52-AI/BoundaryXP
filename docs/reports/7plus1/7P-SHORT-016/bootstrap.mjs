import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const git=(...a)=>execFileSync('git',a,{maxBuffer:100e6});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const out='docs/reports/7plus1/7P-SHORT-016/';
if(fs.existsSync(out+'BASELINE.json'))throw Error('Already bootstrapped');
const before=git('rev-parse','HEAD').toString().trim(),next=git('rev-parse','origin/review/7plus1-parser').toString().trim();
const allowed=['docs/tasks/7plus1/CURRENT-TASK.md','docs/tasks/7plus1/7P-SHORT-016.md','docs/tasks/7plus1/7P-SHORT-016-FROZEN-CASES.md'];
const changed=git('diff','--name-only',before,next).toString().trim().split('\n');
if(changed.some(p=>!allowed.includes(p))||git('diff','--cached','--name-only').length)throw Error('Incoming scope/index');
const status=git('status','--porcelain=v1','--untracked-files=no');
for(const p of changed){if(git('diff','HEAD','--',p).length)throw Error('Dirty authority');fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,git('show',next+':'+p));}
git('read-tree',next);git('update-ref','refs/heads/review/7plus1-parser',next,before);
if(!status.equals(git('status','--porcelain=v1','--untracked-files=no')))throw Error('Dirty status changed');
const protected_files=git('ls-files','-z').toString().split('\0').filter(Boolean).map(path=>({path,sha256:fs.existsSync(path)?hash(fs.readFileSync(path)):null}));
fs.writeFileSync(out+'BASELINE.json',JSON.stringify({task:'7P-SHORT-016',started_at:new Date().toISOString(),from:before,head:next,implementation_baseline:'f03d09a099f06a4da2786a3c8e9dcd9fdb50dd37',protected_files},null,2)+'\n');
fs.writeFileSync(out+'FROZEN-CASE-VERIFICATION.json',JSON.stringify({frozen_before_coding:true,files:allowed.map(path=>({path,sha256:hash(fs.readFileSync(path))})),unchanged:true},null,2)+'\n');
console.log(next,protected_files.length);
