// Scope-only freeze; pre-existing dirty files are never staged.
import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {sha256} from '../llm-first-028/source.mjs';import {report} from './prepare.mjs';
const snap=JSON.parse(fs.readFileSync('.boundx/experiments/031-r1/pre-sync/snapshot.json'));
for(const x of snap.dirty){const exists=fs.existsSync(x.file);if(exists!==x.exists||exists&&sha256(fs.readFileSync(x.file))!==x.sha256)throw Error('PREEXISTING_TRACKED_CHANGED:'+x.file);}
const diff=execFileSync('git',['diff','--name-only','-z'],{encoding:'utf8'}).split('\0').filter(Boolean),original=new Set(snap.dirty.map(x=>x.file));
const allowed=p=>p==='.gitattributes'||p==='docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md'||p.startsWith('product/short-compiler/')||p.startsWith('research/7plus1-parser/llm-first-028/')||p==='research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js';
const owned=diff.filter(p=>!original.has(p));if(owned.some(p=>!allowed(p)))throw Error('UNEXPECTED_TASK_DIFF:'+JSON.stringify(owned.filter(p=>!allowed(p))));
const added=['product/short-compiler/resources.mjs','research/7plus1-parser/llm-first-028/artifacts.mjs','research/7plus1-parser/llm-first-028/tests/artifact-flow.test.mjs','research/7plus1-parser/llm-first-028/tests/resource-snapshot.test.mjs','tests/parser-v03-p21-service.test.mjs',...fs.readdirSync('research/7plus1-parser/product-closure-031-r1').filter(p=>p.endsWith('.mjs')).map(p=>'research/7plus1-parser/product-closure-031-r1/'+p)];
if(execFileSync('git',['diff','--cached','--name-only'],{encoding:'utf8'}).trim())throw Error('INDEX_NOT_EMPTY');
execFileSync('git',['add','--',...new Set([...owned,...added])],{stdio:'inherit'});
const staged=execFileSync('git',['diff','--cached','--name-only','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);if(staged.some(p=>original.has(p)))throw Error('PREEXISTING_STAGED');
fs.writeFileSync(path.join(report,'CODE-FREEZE-INPUTS.json'),JSON.stringify({at:new Date().toISOString(),original_tracked_preserved:snap.dirty.length,authorized_preexisting_untracked_test:'tests/parser-v03-p21-service.test.mjs',files:staged.map(p=>({path:p,sha256:sha256(fs.readFileSync(p))}))},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({staged:staged.length,preexisting_tracked_preserved:snap.dirty.length}));
