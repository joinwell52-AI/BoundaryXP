import {spawn} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {OUT,write} from './audit-tools.mjs';
const kind=process.argv[2]??'mechanism',name=process.argv[3]??kind,dir=path.join(OUT,'test-runs',name);fs.mkdirSync(dir,{recursive:true});
const args=kind==='full'?['test']:['--test','--test-concurrency=1','tests/parser-candidate-semantic-023.test.mjs'];
const command=kind==='full'?'cmd.exe':process.execPath,actual=kind==='full'?['/d','/c','npm test']:args;
const log=fs.createWriteStream(path.join(dir,'output.log'),{flags:'wx'}),start=new Date().toISOString();
const child=spawn(command,actual,{cwd:process.cwd(),windowsHide:true});child.stdout.on('data',b=>log.write(b));child.stderr.on('data',b=>log.write(b));
child.on('close',code=>{log.end(()=>{const s=fs.readFileSync(path.join(dir,'output.log'),'utf8'),counts={};for(const k of ['tests','pass','fail','cancelled','skipped','todo']){const m=[...s.matchAll(new RegExp('(?:# |ℹ )'+k+' (\\d+)','gu'))].at(-1);counts[k]=m?Number(m[1]):null;}write('test-runs/'+name+'/result.json',{kind,command,args:actual,started_at:start,ended_at:new Date().toISOString(),exit_code:code,...counts,status:code===0?'PASS':'FAIL'});console.log(JSON.stringify({kind,name,code,...counts}));});});
