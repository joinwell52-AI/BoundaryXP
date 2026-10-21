import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';import {report,write} from './prepare.mjs';
const kind=process.argv[2],glob=kind==='core'?'research/7plus1-parser/llm-first-028/tests/*.test.mjs':kind==='installed'?'product/short-compiler/tests/*.test.mjs':'tests/*.test.mjs';
const directory=path.join(report,'engineering',process.argv[3]??kind);fs.mkdirSync(directory,{recursive:true});const fd=fs.openSync(path.join(directory,'full.log'),'wx'),started=Date.now();
const child=spawn(process.execPath,['--test','--test-concurrency=1',glob],{windowsHide:true,stdio:['ignore','pipe','pipe']});let tail='';
for(const stream of [child.stdout,child.stderr])stream.on('data',b=>{fs.writeSync(fd,b);tail=(tail+b.toString()).slice(-20000);});
const code=await new Promise(r=>child.on('close',r));fs.closeSync(fd);const n=k=>Number(tail.match(new RegExp('(?:ℹ |# )'+k+' (\\d+)'))?.[1]??-1);
const result={exit_code:code,total:n('tests'),pass:n('pass'),fail:n('fail'),skip:n('skipped'),elapsed_ms:Date.now()-started,real_model_calls:0};write('engineering/'+(process.argv[3]??kind)+'/RESULTS.json',result);console.log(JSON.stringify(result));
