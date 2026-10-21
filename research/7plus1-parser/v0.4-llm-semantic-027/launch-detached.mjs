// Durable Windows-compatible launcher; output is written directly to new files.
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {ROOT,REPORT,save} from './util.mjs';
const [script,label,...args]=process.argv.slice(2);
if(!script||!label||!/^[\w-]+$/u.test(label)||!fs.existsSync(ROOT+'/'+script))throw Error('INVALID_LAUNCH_ARGUMENT');
const base=REPORT+'/execution/'+label;fs.mkdirSync(REPORT+'/execution',{recursive:true});
const out=fs.openSync(base+'.stdout.txt','wx'),err=fs.openSync(base+'.stderr.txt','wx');
const child=spawn(process.execPath,[ROOT+'/'+script,...args],{cwd:process.cwd(),detached:true,windowsHide:true,stdio:['ignore',out,err]});
await new Promise((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject);});
save(base+'.LAUNCH.json',{pid:child.pid,executable:process.execPath,args:[ROOT+'/'+script,...args],cwd:process.cwd(),windowsHide:true,detached:true,created_at:new Date().toISOString(),stdout:base+'.stdout.txt',stderr:base+'.stderr.txt'});
child.unref();fs.closeSync(out);fs.closeSync(err);console.log(JSON.stringify({pid:child.pid,label}));
