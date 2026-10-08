// Freeze this supplemental review, including its actual source mapping, not old reports.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {report,write} from './check.mjs';import {sha256} from '../llm-first-028/source.mjs';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);
const hash=p=>sha256(fs.readFileSync(p));
const excluded=new Set(['MANIFEST.json','SHA256SUMS','SEAL.json']);
if(process.argv[2]==='create'){
 assert.ok(!fs.existsSync(path.join(report,'SEAL.json')),'SEAL_ALREADY_EXISTS');
 const files=walk(report).filter(f=>!excluded.has(path.relative(report,f).replaceAll('\\','/'))).map(f=>({path:path.relative(report,f).replaceAll('\\','/'),bytes:fs.statSync(f).size,sha256:hash(f)})).sort((a,b)=>a.path.localeCompare(b.path));
 const implementation=JSON.parse(fs.readFileSync(path.join(report,'FROZEN-SOURCE-INTEGRITY.json')));
 const review=walk(path.resolve('research/7plus1-parser/product-closure-031-r1-q05')).map(p=>({path:path.relative(process.cwd(),p).replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:hash(p)}));
 const pointer={path:'docs/tasks/7plus1/CURRENT-TASK.md',sha256:hash('docs/tasks/7plus1/CURRENT-TASK.md')};
 write('MANIFEST.json',{task:'7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG',addendum:'031-R1-Q05-OBJECT-RANGE-CLOSURE',source_commit:implementation.source_commit,contract:'031-r1-q05.1',product:'0.1.0-candidate.031-r1.q05.1',files,implementation:implementation.files,review_scripts:review,pointer});
 fs.writeFileSync(path.join(report,'SHA256SUMS'),files.map(f=>`${f.sha256}  ${f.path}`).join('\n')+'\n',{flag:'wx'});
 write('SEAL.json',{state:'WAITING_ADMIN_REVIEW',created_at:new Date().toISOString(),manifest_sha256:hash(path.join(report,'MANIFEST.json')),sha256sums_sha256:hash(path.join(report,'SHA256SUMS')),immutable:true,semantic_acceptance:'REVIEW_REQUIRED',full_new_method_model_validation:'NOT_COMPLETE',production_ready:false});
}
const m=JSON.parse(fs.readFileSync(path.join(report,'MANIFEST.json'))),seal=JSON.parse(fs.readFileSync(path.join(report,'SEAL.json'))),fail=[];
for(const x of m.files){const p=path.resolve(report,x.path);if(!p.startsWith(report+path.sep)||!fs.existsSync(p)||hash(p)!==x.sha256||fs.statSync(p).size!==x.bytes)fail.push(x.path);}
for(const x of m.implementation){if(hash(x.source_path)!==x.sha256)fail.push('implementation:'+x.source_path);}
for(const x of m.review_scripts){if(hash(x.path)!==x.sha256)fail.push('review_script:'+x.path);}
if(hash(path.join(report,'MANIFEST.json'))!==seal.manifest_sha256)fail.push('MANIFEST');
if(hash(path.join(report,'SHA256SUMS'))!==seal.sha256sums_sha256)fail.push('SHA256SUMS');
// CURRENT-TASK may later be updated by ADMIN; its sealed historical digest stays in manifest.
const actual=walk(report).filter(f=>!excluded.has(path.relative(report,f).replaceAll('\\','/'))).map(f=>path.relative(report,f).replaceAll('\\','/')).sort();
assert.deepEqual(actual,m.files.map(f=>f.path).sort(),'ADDED_OR_MISSING_REPORT_FILE');
console.log(JSON.stringify({seal_verified:fail.length===0,files:m.files.length,implementation:m.implementation.length,review_scripts:m.review_scripts.length,fail}));if(fail.length)process.exitCode=1;
