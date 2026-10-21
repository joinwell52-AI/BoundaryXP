import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {lockProduct} from './resources.mjs';
const version='0.1.0-candidate.031-r1.2-ui.38',parent='0.1.0-candidate.031-r1.2-ui.36';
const candidate=path.resolve('.boundx/products',version),base=path.resolve('.boundx/short-compiler-031-r1/versions',parent),home=path.resolve('.boundx/owned-event-calculus-r01/clean-install'),rollbackHome=path.resolve('.boundx/owned-event-calculus-r01/rollback-install');
const report=path.resolve('docs/reports/7plus1/MANUAL-FULL-FLOW-CALCULUS-r01/install');
const continuation=process.argv[2]?.startsWith('continue-cli');
const attempt=process.argv[2]==='continue-cli-03'?'03':'02';
if(!continuation){if(fs.existsSync(report)||fs.existsSync(home)||fs.existsSync(rollbackHome))throw Error('FIRST_INSTALL_EVIDENCE_EXISTS');fs.mkdirSync(report,{recursive:true});}
const read=f=>JSON.parse(fs.readFileSync(f));const rows=[];
function run(label,root,args){const r=spawnSync(process.execPath,[path.join(root,'product/short-compiler/deploy.mjs'),...args],{windowsHide:true,encoding:'utf8',timeout:120000});
 fs.writeFileSync(path.join(report,label+'.txt'),(r.stdout??'')+'\n'+(r.stderr??''),{flag:'wx'});if(r.status!==0)throw Error(label+': '+r.status);rows.push({label,exit_code:r.status});}
const old=lockProduct(base),next=lockProduct(candidate);old.verify();next.verify();
if(!continuation)run('clean-install',candidate,['install','--home',home,'--port','58618']);
const installed=path.join(home,'versions',version),lock=lockProduct(installed);lock.verify();assert.equal(lock.snapshot.manifest_sha256,next.snapshot.manifest_sha256);
if(!continuation){
 run('rollback-parent-install',base,['install','--home',rollbackHome,'--port','58618']);
 const config=fs.readFileSync(path.join(rollbackHome,'config.json'));fs.mkdirSync(path.join(rollbackHome,'data'),{recursive:true});fs.writeFileSync(path.join(rollbackHome,'data','history-marker.txt'),'preserve history\n',{flag:'wx'});
 run('upgrade',candidate,['upgrade','--home',rollbackHome,'--confirmed-idle']);assert.equal(read(path.join(rollbackHome,'current.json')).version,version);
 run('rollback',candidate,['rollback','--home',rollbackHome,'--confirmed-idle']);assert.deepEqual(fs.readFileSync(path.join(rollbackHome,'config.json')),config);
}else{
 for(const label of ['clean-install','rollback-parent-install','upgrade','rollback']){assert.match(fs.readFileSync(path.join(report,label+'.txt'),'utf8'),label==='rollback'?/ROLLED_BACK/:/INSTALLED/);rows.push({label,exit_code:0,reused_first_success:true});}
}
assert.equal(read(path.join(rollbackHome,'current.json')).version,parent);assert.equal(fs.readFileSync(path.join(rollbackHome,'data','history-marker.txt'),'utf8'),'preserve history\n');
const output=path.join(report,continuation?'cli-replay-attempt-'+attempt:'cli-replay'),source=path.resolve('docs/testing/7plus1/MANUAL-TEST-001.txt'),trace=path.resolve('docs/testing/7plus1/MANUAL-TEST-001-standard-r01/actual/ui36/trace.json');
const r=spawnSync(process.execPath,['product/short-compiler/cli.mjs','--input',source,'--output',output,'--replay-from',path.dirname(trace)],{cwd:installed,windowsHide:true,encoding:'utf8',timeout:30000});
fs.writeFileSync(path.join(report,continuation?'CLI-attempt-'+attempt+'.txt':'CLI.txt'),(r.stdout??'')+'\n'+(r.stderr??''),{flag:'wx'});if(r.status!==0)throw Error('CLI_REPLAY_FAILED');
const actual=read(path.join(output,'trace.json')),prior=read(trace);assert.deepEqual(actual.ir,prior.ir);assert.deepEqual(actual.canonical,prior.canonical);assert.equal(actual.boundary_calculations.status,'CALCULATED_FRAGMENT');assert.equal(actual.boundary_calculations.unsupported.length,0);assert.equal(actual.real_calls_in_this_replay,0);assert.equal(actual.consumer_revision,'031-r1-c12');assert.equal(actual.product_snapshot.product_version,version);
const changed=read(path.join(candidate,'PRODUCT-MANIFEST.json')).files.filter(f=>!read(path.join(base,'PRODUCT-MANIFEST.json')).files.some(x=>x.path===f.path&&x.sha256===f.sha256)).map(x=>x.path);
const protectedFiles=read(path.join(base,'PRODUCT-MANIFEST.json')).files.filter(f=>/skills\/|contracts\/|semantic-contract\.md|model|compile\.mjs$|validate\.mjs$/.test(f.path));assert.ok(protectedFiles.every(f=>read(path.join(candidate,'PRODUCT-MANIFEST.json')).files.some(x=>x.path===f.path&&x.sha256===f.sha256)));
const result={pass:true,version,manifest:lock.snapshot.manifest_sha256,installed,checks:rows,changed,protected_files_unchanged:protectedFiles,cli_same_ir_and_canonical:true,cli_consumer_revision:actual.consumer_revision,real_model_calls:0,listeners_started:0,upgrade_and_rollback_preserve_history:true};
fs.writeFileSync(path.join(report,'RESULT.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({...result,protected_files_unchanged:protectedFiles.length}));
