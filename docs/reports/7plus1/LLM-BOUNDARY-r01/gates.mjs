import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../../../..'),output=process.argv[2]?path.resolve(root,process.argv[2]):here,rows=[];fs.mkdirSync(output,{recursive:true});
for(const [name,patterns]of [['kernel',['tests/ir-kernel/*.test.mjs']],['ir-interface',['tests/direct-ir*.test.mjs','tests/direct-candidate-ir.test.mjs']]]){
 const files=patterns.flatMap(pattern=>pattern.includes('*')?fs.readdirSync(path.join(root,path.dirname(pattern))).filter(f=>f.startsWith(path.basename(pattern).split('*')[0])&&f.endsWith('.test.mjs')).map(f=>path.join(path.dirname(pattern),f)):[pattern]);
 const r=spawnSync(process.execPath,['--test','--test-concurrency=1',...files],{cwd:root,encoding:'utf8',windowsHide:true}),text=(r.stdout??'')+(r.stderr??'');fs.writeFileSync(path.join(output,name+'.log'),text,{flag:'wx'});
 const n=key=>Number(text.match(new RegExp('(?:#|ℹ) '+key+' (\\d+)'))?.[1]);rows.push({name,exit_code:r.status,tests:n('tests'),pass:n('pass'),fail:n('fail'),real_model_calls:0});if(r.status!==0)process.exitCode=1;
}
fs.writeFileSync(path.join(output,'GATES.json'),JSON.stringify({date:'2026-10-14',real_model_calls:0,rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(rows));
