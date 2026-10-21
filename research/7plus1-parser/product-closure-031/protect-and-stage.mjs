// Stage explicit task resources only; preserve the pre-existing workspace.
import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {sha256} from '../llm-first-028/source.mjs';
const snapshot=JSON.parse(fs.readFileSync('.boundx/experiments/031/pre-sync/snapshot.json')),oldTracked=new Set(snapshot.tracked.map(x=>x.file)),oldUntracked=new Set(snapshot.untracked.map(x=>typeof x==='string'?x:x.file));
const changes=snapshot.tracked.filter(x=>fs.existsSync(x.file)!==x.exists||(x.exists&&sha256(fs.readFileSync(x.file))!==x.sha256));if(changes.length)throw Error('PREEXISTING_TRACKED_CHANGED:'+changes.map(x=>x.file));
const scopes=['research/7plus1-parser/llm-first-028','product/short-compiler','research/7plus1-parser/product-closure-031','research/7plus1-parser/v0.3-p2.1-generalization/web/index.html','research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js','docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md','docs/tasks/7plus1/CURRENT-TASK.md'];
const raw=execFileSync('git',['status','--porcelain=v1','-z','--untracked-files=all','--',...scopes],{encoding:'utf8'}),files=raw.split('\0').filter(Boolean).map(x=>x.slice(3));for(const f of files)if(oldTracked.has(f)||oldUntracked.has(f))throw Error('PREEXISTING_CHANGE_SELECTED:'+f);
if(files.length)execFileSync('git',['add','--',...files],{stdio:'pipe'});
console.log(JSON.stringify({preexisting_tracked_preserved:snapshot.tracked.length,preexisting_untracked_not_selected:true,staged_task_files:files.length,files}));
