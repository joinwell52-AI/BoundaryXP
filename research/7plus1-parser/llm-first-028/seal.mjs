import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileInventory,implementationInventory} from './evidence.mjs';
import {sha256} from './source.mjs';
const args=process.argv.slice(2),directory=path.resolve(args[1]);
if(!['create','verify'].includes(args[0])||!args[1])throw Error('Usage: seal.mjs create|verify report-directory');
const excluded=new Set(['MANIFEST.json','SHA256SUMS','SEAL.json']);
const manifestPath=path.join(directory,'MANIFEST.json'),sumsPath=path.join(directory,'SHA256SUMS'),sealPath=path.join(directory,'SEAL.json');
if(args[0]==='create'){
 if(fs.existsSync(sealPath))throw Error('SEAL_ALREADY_EXISTS');
 const files=fileInventory(directory).filter(f=>!excluded.has(path.basename(f))).map(f=>({path:path.relative(directory,f).replaceAll('\\','/'),bytes:fs.statSync(f).size,sha256:sha256(fs.readFileSync(f))}));
 const manifest={task:'7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG',task_revision:'r02',manual_revision:'v0.4/r02',base_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),implementation:implementationInventory(),files};
 fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');fs.writeFileSync(sumsPath,files.map(f=>`${f.sha256}  ${f.path}`).join('\n')+'\n');fs.writeFileSync(sealPath,JSON.stringify({task:manifest.task,state:'WAITING_ADMIN_REVIEW',created_at:new Date().toISOString(),manifest_sha256:sha256(fs.readFileSync(manifestPath)),sha256sums_sha256:sha256(fs.readFileSync(sumsPath)),immutable:true},null,2)+'\n');
}
const manifest=JSON.parse(fs.readFileSync(manifestPath)),seal=JSON.parse(fs.readFileSync(sealPath)),fail=[];
for(const f of manifest.files){const file=path.join(directory,f.path);if(!fs.existsSync(file)||sha256(fs.readFileSync(file))!==f.sha256)fail.push(f.path);}
for(const f of manifest.implementation){const file=path.resolve('research/7plus1-parser/llm-first-028',f.path);if(!fs.existsSync(file)||sha256(fs.readFileSync(file))!==f.sha256)fail.push('implementation:'+f.path);}
if(sha256(fs.readFileSync(manifestPath))!==seal.manifest_sha256)fail.push('MANIFEST');if(sha256(fs.readFileSync(sumsPath))!==seal.sha256sums_sha256)fail.push('SHA256SUMS');
console.log(JSON.stringify({seal_verified:fail.length===0,files:manifest.files.length,implementation:manifest.implementation.length,fail}));if(fail.length)process.exitCode=1;
