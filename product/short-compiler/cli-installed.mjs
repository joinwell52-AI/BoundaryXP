// Installed transport only: same frozen root as the fixed UI. No semantic implementation.
import path from 'node:path';import {spawn} from 'node:child_process';
import {installedPlan} from './launch-installed.mjs';
const plan=installedPlan(),args=process.argv.slice(2),cwd=process.cwd();
for(let i=0;i<args.length;i++)if(['--input','--output','--replay-from'].includes(args[i])&&args[i+1])args[++i]=path.resolve(cwd,args[i]);
plan.verify();console.error(JSON.stringify({mode:'INSTALLED_CLI',version:plan.snapshot.product_version,compiler:plan.snapshot.compiler_revision,contract:plan.snapshot.contract,root:plan.root}));
const child=spawn(process.execPath,[path.join(plan.root,'product/short-compiler/cli.mjs'),...args],{cwd:plan.root,stdio:'inherit',windowsHide:true});
child.on('error',e=>{console.error(e.message);process.exitCode=1;});child.on('exit',code=>{process.exitCode=code??1;});process.on('SIGINT',()=>child.kill('SIGINT'));
