import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';import {report} from './prepare.mjs';
const dir=path.join(report,process.argv[2]??'regression-c1');fs.mkdirSync(dir,{recursive:true});const file=path.join(dir,'full.log'),fd=fs.openSync(file,'wx'),started=Date.now();
const child=spawn(process.execPath,['--test','--test-concurrency=1','tests/*.test.mjs'],{windowsHide:true,stdio:['ignore','pipe','pipe']});let tail='';
for(const stream of [child.stdout,child.stderr])stream.on('data',b=>{fs.writeSync(fd,b);tail=(tail+b.toString()).slice(-10000);});
const code=await new Promise(r=>child.on('close',r));fs.closeSync(fd);const n=name=>Number(tail.match(new RegExp('(?:ℹ |# )'+name+' (\\d+)'))?.[1]??-1),result={exit_code:code,total:n('tests'),pass:n('pass'),fail:n('fail'),skip:n('skipped'),elapsed_ms:Date.now()-started};fs.writeFileSync(path.join(dir,'RESULTS.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
