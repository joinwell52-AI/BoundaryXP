import fs from 'node:fs';import path from 'node:path';import{createHash}from'node:crypto';import{execFileSync}from'node:child_process';
const base='13bd28fb25b02ee9358f20f2e1f2baa58df802f4',root='D:/boundx',report='docs/reports/7plus1/7P-REPAIR-002',old='research/7plus1-parser/v0.3-7p-repair-001',next='research/7plus1-parser/v0.3-7p-repair-002';
const git=(...a)=>execFileSync('git',a,{cwd:root,encoding:'utf8',maxBuffer:80e6}),sha=b=>createHash('sha256').update(b).digest('hex');
const put=(p,b)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,b,{flag:'wx'});};
if(git('rev-parse','review/7plus1-parser').trim()!==base)throw Error('BASE_CHANGED');
const paths=git('ls-tree','-r','--name-only',base).trim().split('\n');
put(`${report}/BASELINE.json`,JSON.stringify({base_commit:base,working_head:git('rev-parse','HEAD').trim(),files:Object.fromEntries(paths.map(p=>[p,fs.existsSync(p)?sha(fs.readFileSync(p)):null]))},null,2)+'\n');
put('docs/tasks/7plus1/7P-REPAIR-002.md',fs.readFileSync('C:/Users/wei/.codex/attachments/f530b44e-b5bd-4414-a692-d01c922919ab/已粘贴的文本.txt'));
for(const p of paths.filter(p=>p.startsWith(old+'/')&&!p.endsWith('.html')&&!p.endsWith('README.md'))){put(p.replace(old,next),fs.readFileSync(p));}
for(const p of paths.filter(p=>p.startsWith(old+'/web/')&&p.endsWith('.html')))put(p.replace(old,next),fs.readFileSync(p));
console.log(next);
