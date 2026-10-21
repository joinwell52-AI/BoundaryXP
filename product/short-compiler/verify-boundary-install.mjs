import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {lockProduct} from './resources.mjs';
const version='0.1.0-candidate.031-r1.2-ui.41',parent='0.1.0-candidate.031-r1.2-ui.40';
const candidate=path.resolve('.boundx/products',version),base=path.resolve('.boundx/products',parent),home=path.resolve('.boundx/local-boundary-repair-r03/clean-install'),rollbackHome=path.resolve('.boundx/local-boundary-repair-r03/rollback-install');
const report=path.resolve('docs/reports/7plus1/BOUNDARY-SKILL-REPAIR-r03/install');if(fs.existsSync(report)||fs.existsSync(home)||fs.existsSync(rollbackHome))throw Error('FIRST_INSTALL_EXISTS');fs.mkdirSync(report,{recursive:true});
const read=f=>JSON.parse(fs.readFileSync(f));const rows=[];
function run(label,root,args){const r=spawnSync(process.execPath,[path.join(root,'product/short-compiler/deploy.mjs'),...args],{windowsHide:true,encoding:'utf8',timeout:120000});fs.writeFileSync(path.join(report,label+'.txt'),(r.stdout??'')+'\n'+(r.stderr??''),{flag:'wx'});if(r.status!==0)throw Error(label+': '+r.status);rows.push({label,exit_code:r.status});}
const old=lockProduct(base),next=lockProduct(candidate);old.verify();next.verify();
run('clean-install',candidate,['install','--home',home,'--port','58618']);
const lock=lockProduct(path.join(home,'versions',version));lock.verify();assert.equal(lock.snapshot.manifest_sha256,next.snapshot.manifest_sha256);
run('parent-install',base,['install','--home',rollbackHome,'--port','58618']);
const config=fs.readFileSync(path.join(rollbackHome,'config.json'));fs.mkdirSync(path.join(rollbackHome,'data'),{recursive:true});fs.writeFileSync(path.join(rollbackHome,'data','history-marker.txt'),'preserve history\n',{flag:'wx'});
run('upgrade',candidate,['upgrade','--home',rollbackHome,'--confirmed-idle']);assert.equal(read(path.join(rollbackHome,'current.json')).version,version);
run('rollback',candidate,['rollback','--home',rollbackHome,'--confirmed-idle']);assert.deepEqual(fs.readFileSync(path.join(rollbackHome,'config.json')),config);assert.equal(read(path.join(rollbackHome,'current.json')).version,parent);assert.equal(fs.readFileSync(path.join(rollbackHome,'data','history-marker.txt'),'utf8'),'preserve history\n');
fs.writeFileSync(path.join(report,'RESULT.json'),JSON.stringify({pass:true,version,manifest:lock.snapshot.manifest_sha256,checks:rows,real_model_calls:0,listeners_started:0,upgrade_and_rollback_preserve_history:true},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({pass:true,checks:rows.length,listeners_started:0}));
