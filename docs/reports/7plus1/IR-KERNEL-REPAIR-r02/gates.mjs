import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../../../..'),rows=[];
for(const [name,args]of [['kernel',['tests/ir-kernel/*.test.mjs']],['legacy',['tests/direct-ir*.test.mjs','tests/direct-candidate-ir.test.mjs']]]){
 const files=args.flatMap(pattern=>pattern.includes('*')?fs.readdirSync(path.join(root,path.dirname(pattern))).filter(f=>f.startsWith(path.basename(pattern).split('*')[0])&&f.endsWith('.test.mjs')).map(f=>path.join(path.dirname(pattern),f)):[pattern]);
 const result=spawnSync(process.execPath,['--test','--test-concurrency=1',...files],{cwd:root,encoding:'utf8',windowsHide:true});const text=(result.stdout??'')+(result.stderr??'');fs.writeFileSync(path.join(here,name+'-final.tap'),text,{flag:'wx'});
 const number=key=>Number(text.match(new RegExp('(?:#|ℹ) '+key+' (\\d+)'))?.[1]);rows.push({name,exit_code:result.status,tests:number('tests'),pass:number('pass'),fail:number('fail'),real_model_calls:0});if(result.status!==0)process.exitCode=1;
}
fs.writeFileSync(path.join(here,'GATES.json'),JSON.stringify({date:'2026-10-13',real_model_calls:0,rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(rows));
