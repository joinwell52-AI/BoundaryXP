import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
import {report} from './prepare.mjs';
const dir=path.join(report,process.argv[2]??'offline-tests');fs.mkdirSync(dir,{recursive:true});
for(const [name,args] of [['core',['--test','research/7plus1-parser/llm-first-028/tests/*.test.mjs']],['service-contract',['--test','tests/parser-v03-p21-service.test.mjs']]]){
 const result=spawnSync(process.execPath,args,{encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});fs.writeFileSync(path.join(dir,name+'.log'),result.stdout+result.stderr,{flag:'wx'});fs.writeFileSync(path.join(dir,name+'.json'),JSON.stringify({exit_code:result.status,tests:result.stdout.match(/tests (\d+)/)?.[1],pass:result.stdout.match(/pass (\d+)/)?.[1],fail:result.stdout.match(/fail (\d+)/)?.[1],model_calls:0},null,2)+'\n',{flag:'wx'});if(result.status!==0)throw Error(name+' FAILED');
}
console.log('offline core and session contract PASS; zero model calls');
