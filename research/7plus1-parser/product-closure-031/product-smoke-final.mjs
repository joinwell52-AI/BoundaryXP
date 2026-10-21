// Deployment acceptance only: no model calls, no semantic processing, no user service mutation.
import fs from 'node:fs';import path from 'node:path';import {spawn,spawnSync} from 'node:child_process';import {createHash,randomUUID} from 'node:crypto';import assert from 'node:assert/strict';
const workspace=process.cwd(),report=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG'),home=path.resolve('.boundx/experiments/031/rollback-final-c5'),pkg=path.resolve('.boundx/experiments/031/packages/frozen-031-c5');
const setup=spawnSync(process.execPath,['.boundx/experiments/031/packages/prior-029/product/short-compiler/deploy.mjs','install','--home',home,'--port','58620'],{encoding:'utf8',windowsHide:true});assert.equal(setup.status,0,setup.stderr);
const configFile=path.join(home,'config.json'),config=JSON.parse(fs.readFileSync(configFile)),external=path.resolve('.boundx/experiments/031/rollback-final-external-data');
fs.cpSync(path.resolve('.boundx/experiments/031/clean-final/data'),external,{recursive:true,errorOnExist:true,force:false});config.data_dir=external;fs.writeFileSync(configFile,JSON.stringify(config,null,2));
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex'),walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]):[];
const data=path.resolve(read(path.join(home,'config.json')).data_dir),tree=d=>Object.fromEntries(walk(d).map(p=>[path.relative(d,p).replaceAll('\\','/'),sha(fs.readFileSync(p))]));
const before=tree(data),rows=[],runIds=fs.readdirSync(path.join(data,'runs')).filter(x=>fs.existsSync(path.join(data,'runs',x,'trace.json')));
assert(runIds.length,'requires preserved real UI history fixture');
function command(cwd,args){const r=spawnSync(process.execPath,args,{cwd,encoding:'utf8',windowsHide:true});rows.push({kind:'command',cwd,args,exit_code:r.status,stdout:r.stdout,stderr:r.stderr});return r;}
async function probe(version){
 const root=path.join(home,'versions',read(path.join(home,'current.json')).version);assert.equal(read(path.join(root,'PRODUCT-MANIFEST.json')).version,version);
 const child=spawn(process.execPath,['product/short-compiler/ui.mjs'],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,BOUNDARYXP_PARSER_PORT:'58620',BOUNDARYXP_DATA_DIR:data}});let log='';child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b);
 const ended=new Promise(r=>child.once('close',r));
 try{let s;for(let i=0;i<100;i++){try{const r=await fetch('http://127.0.0.1:58620/api/session');if(r.ok){s={body:await r.json(),cookie:r.headers.get('set-cookie').split(';')[0]};break;}}catch{}await new Promise(r=>setTimeout(r,50));}assert(s,'service must start');
  const list=await(await fetch('http://127.0.0.1:58620/api/runs')).json();assert(runIds.every(id=>list.some(x=>x.run_id===id)),'history persisted');
  for(const id of runIds){const t=read(path.join(data,'runs',id,'trace.json'));const exported=await(await fetch('http://127.0.0.1:58620/api/runs/'+id+'/json')).json();assert.deepEqual(exported,t.canonical);const text=await(await fetch('http://127.0.0.1:58620/api/runs/'+id+'/export')).text();assert.equal(text,t.chinese);}
  const checks=[];for(const text of ['', 'x'.repeat(301)]){const r=await fetch('http://127.0.0.1:58620/api/parse',{method:'POST',headers:{'content-type':'application/json',cookie:s.cookie,'x-boundx-session':s.body.token},body:JSON.stringify({text,request_id:randomUUID()})});const error=await r.json();assert.equal(r.status,400);assert.equal(error.error,text?'SHORT_TEXT_SCOPE_EXCEEDED':'EMPTY_SOURCE');checks.push({code:r.status,error});}
  const html=await(await fetch('http://127.0.0.1:58620/')).text();assert(html.includes('7+1'));assert.deepEqual(tree(data),before,'read/history/invalid inputs do not mutate or reparse');
  rows.push({kind:'service',version,pid:child.pid,session:{...s.body,token:undefined},history_count:list.length,history_export_equal:true,invalid_inputs:checks,model_requests:0});
 }finally{child.kill();await ended;rows.push({kind:'owned_process_stopped',pid:child.pid,log});}
}
await probe('0.1.0-baseline.029.4');
assert.equal(command(pkg,['product/short-compiler/deploy.mjs','upgrade','--home',home,'--confirmed-idle']).status,0);
assert.deepEqual(tree(data),before);await probe('0.1.0-candidate.031.5');
const backups=fs.readdirSync(path.join(home,'backups')).sort(),backup=path.join(home,'backups',backups.at(-1));assert.deepEqual(tree(path.join(backup,'data')),before);assert(fs.existsSync(path.join(backup,'config.json'))&&fs.existsSync(path.join(backup,'current.json')));
assert.equal(command(pkg,['product/short-compiler/deploy.mjs','rollback','--home',home,'--confirmed-idle']).status,0);await probe('0.1.0-baseline.029.4');
assert.equal(command(pkg,['product/short-compiler/deploy.mjs','rollback','--home',home,'--confirmed-idle']).status,0);await probe('0.1.0-candidate.031.5');
// A tampered package must fail before changing the active pointer.
const broken=path.resolve('.boundx/experiments/031/tampered-final-c5');assert(!fs.existsSync(broken));fs.cpSync(pkg,broken,{recursive:true});const manifest=read(path.join(broken,'PRODUCT-MANIFEST.json'));fs.appendFileSync(path.join(broken,manifest.files[0].path),'\n// intentional integrity-negative fixture\n');const pointer=fs.readFileSync(path.join(home,'current.json'));const bad=command(broken,['product/short-compiler/deploy.mjs','upgrade','--home',home,'--confirmed-idle']);assert.notEqual(bad.status,0);assert(bad.stderr.includes('PRODUCT_DIGEST_MISMATCH'));assert.deepEqual(fs.readFileSync(path.join(home,'current.json')),pointer);assert.deepEqual(tree(data),before);
const result={at:new Date().toISOString(),status:'PASS',home,package:pkg,versions:['029','031-c5','029','031-c5'],backup,history_file_count:Object.keys(before).length,history_sha256:sha(JSON.stringify(before)),model_requests:0,failed_upgrade_pointer_unchanged:true,rows};
fs.writeFileSync(path.join(report,'PRODUCT-C5-UPGRADE-ROLLBACK.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,rows:undefined}));


