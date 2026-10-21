import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {ROOT} from '../bundle.mjs';
import {writeJSON} from '../engine.mjs';
const repo=path.resolve(ROOT,'../../..'),report=path.join(repo,'docs/reports/7plus1/7P-SHORT-COMPILER-DELIVERY-029-LONG'),revision=process.argv[2]??'engineering-first';
const dir=path.join(report,revision);fs.mkdirSync(dir,{recursive:true});const results=[];
for(const [name,files] of [['core-delivery',fs.readdirSync(path.join(ROOT,'tests')).filter(f=>f.endsWith('.test.mjs')).map(f=>'research/7plus1-parser/llm-first-028/tests/'+f)],['unaffected-product-entrypoints',['tests/local-task-entrypoints.test.mjs','tests/ui-module-routes.test.mjs']]]){
 const args=['--test',...files],r=spawnSync(process.execPath,args,{cwd:repo,encoding:'utf8',timeout:120000,windowsHide:true});fs.writeFileSync(path.join(dir,name+'.txt'),r.stdout+'\n'+r.stderr,{flag:'wx'});results.push({name,args,exit_code:r.status,timeout:r.error?.code??null});console.log(name,r.status===0?'PASS':'FAIL');
}
const output=path.join(dir,'cli-other-cwd'),input=path.join(report,'inputs/S00.txt'),replay=path.resolve(process.argv[3]??path.join(repo,'docs/reports/7plus1/7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG/method-r2/S00'));
const args=[path.join(ROOT,'cli.mjs'),'--input',input,'--output',output,'--replay-from',replay],r=spawnSync(process.execPath,args,{cwd:os.tmpdir(),encoding:'utf8',timeout:30000,windowsHide:true});fs.writeFileSync(path.join(dir,'cli-other-cwd.txt'),r.stdout+'\n'+r.stderr,{flag:'wx'});results.push({name:'cli-other-cwd',args,exit_code:r.status,mode:'FROZEN_RESPONSE_REPLAY'});console.log('cli-other-cwd',r.status===0?'PASS':'FAIL');writeJSON(path.join(dir,'RESULTS.json'),results);
