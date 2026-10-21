import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';import {spawn,spawnSync} from 'node:child_process';import {pathToFileURL} from 'node:url';
import {sha256} from '../llm-first-028/source.mjs';import {report} from './prepare.mjs';
const label=process.argv[2]??'initial',packageRoot=path.resolve(process.env.BOUNDARYXP_R1_PACKAGE??'.boundx/experiments/031-r1/packages/offline-c1b'),home=path.resolve('.boundx/experiments/031-r1/isolation-home-'+label),port=58620,dir=path.join(report,'version-isolation-'+label);fs.mkdirSync(dir,{recursive:true});
const install=spawnSync(process.execPath,[path.join(packageRoot,'product/short-compiler/deploy.mjs'),'install','--home',home,'--port',String(port)],{cwd:os.tmpdir(),encoding:'utf8',windowsHide:true});fs.writeFileSync(path.join(dir,'install.log'),install.stdout+install.stderr,{flag:'wx'});assert.equal(install.status,0);
const current=JSON.parse(fs.readFileSync(path.join(home,'current.json'))),root=path.join(home,'versions',current.version),child=spawn(process.execPath,[path.join(packageRoot,'product/short-compiler/deploy.mjs'),'start','--home',home],{cwd:os.tmpdir(),windowsHide:true,stdio:['ignore','pipe','pipe']});let log='';child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b);
try{
 let session;for(let n=0;n<100;n++){try{session=await(await fetch('http://127.0.0.1:'+port+'/api/session')).json();if(session.product_snapshot)break;}catch{}await new Promise(r=>setTimeout(r,50));}assert.equal(session.product_snapshot.product_version,current.version);
 const {buildBundle}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/bundle.mjs'))),before=buildBundle('parse');
 // Deliberately invalid development copy: installed process and CLI must not borrow it.
 const development=path.resolve('.boundx/experiments/031-r1/development-mutated');fs.mkdirSync(development,{recursive:true});const changed=['research/7plus1-parser/llm-first-028/skills/boundx-semantic-parse/SKILL.md','research/7plus1-parser/llm-first-028/contracts/proposal.schema.json','research/7plus1-parser/llm-first-028/compile.mjs'];
 for(const file of changed){const p=path.join(development,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,'INTENTIONALLY_INVALID_DEVELOPMENT_COPY');}
 const after=await(await fetch('http://127.0.0.1:'+port+'/api/session')).json();assert.deepEqual(after.product_snapshot,session.product_snapshot);assert.equal(buildBundle('parse').sha256,before.sha256);
 const input=path.join(dir,'unit-input.txt');fs.writeFileSync(input,'测试输入',{flag:'wx'});const cli=spawnSync(process.execPath,[path.join(root,'product/short-compiler/cli.mjs'),'--input',input,'--output',path.join(dir,'zero-budget-cli'),'--request-budget','0'],{cwd:development,encoding:'utf8',windowsHide:true});assert.equal(cli.status,1);assert.match(cli.stderr,/MODEL_REQUEST_BUDGET_EXHAUSTED/);fs.writeFileSync(path.join(dir,'zero-budget-cli.log'),cli.stdout+cli.stderr,{flag:'wx'});
 assert.deepEqual((await(await fetch('http://127.0.0.1:'+port+'/api/runs')).json()),[]);
 const installedSkill=path.join(root,changed[0]),original=fs.readFileSync(installedSkill);fs.appendFileSync(installedSkill,'\nTAMPERED_INSTALLED_TEST_COPY');
 const broken=await fetch('http://127.0.0.1:'+port+'/api/session');assert.equal(broken.status,409);assert.equal((await broken.json()).error,'INSTALLED_RESOURCE_CHANGED');
 const rejected=spawnSync(process.execPath,[path.join(root,'product/short-compiler/cli.mjs'),'--input',input,'--output',path.join(dir,'tampered-cli'),'--request-budget','0'],{cwd:os.tmpdir(),encoding:'utf8',windowsHide:true});assert.match(rejected.stderr,/INSTALLED_RESOURCE_CHANGED/);assert.ok(!fs.existsSync(path.join(dir,'tampered-cli')));fs.writeFileSync(installedSkill,original);
 const result={status:'PASS',real_model_calls:0,installed_root:root,called_from:os.tmpdir(),development_changes:changed,installed_bundle_unchanged:before.sha256,complete_snapshot:session.product_snapshot,development_copy_has_no_runtime_effect:true,installed_corruption_rejected_before_provider:true,cli_rejected_corruption_before_output:true,caller_budget_zero_not_model_evidence:true};
 fs.writeFileSync(path.join(dir,'RESULTS.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({version:current.version,isolation:'PASS',model_calls:0}));
}finally{
 // Stop only children started by this script; no existing service PID is addressed.
 const target=Number(log.match(/TARGET_PID (\d+)/)?.[1]);if(target)try{process.kill(target);}catch{}
 child.kill();await new Promise(r=>{if(child.exitCode!==null)return r();child.once('close',r);});fs.writeFileSync(path.join(dir,'service.log'),log,{flag:'wx'});
}
