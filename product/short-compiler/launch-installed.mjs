// User entry transport only. Semantic core, Skills, Schema and UI load from the installed version.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {lockProduct} from './resources.mjs';
const approvedVersions={
 '0.1.0-candidate.031-r1.2':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.032.1':{compiler:'032-c1',contract:'032.1'}
};
export const fixedPort=58618;
const repository=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export const installedHome=path.join(repository,'.boundx','short-compiler-031-r1');
// Only an explicitly controlled pointer change can activate the approved candidate.
export const expectedVersion=fs.existsSync(path.join(installedHome,'current.json'))?JSON.parse(fs.readFileSync(path.join(installedHome,'current.json'),'utf8')).version:'0.1.0-candidate.031-r1.2';
export const expectedCompiler=approvedVersions[expectedVersion]?.compiler;
export function installedPlan(home=installedHome){
 home=fs.realpathSync(home);
 const current=JSON.parse(fs.readFileSync(path.join(home,'current.json'),'utf8'));
 const config=JSON.parse(fs.readFileSync(path.join(home,'config.json'),'utf8'));
 const expected=approvedVersions[current.version];if(!expected)throw Error('INSTALLED_VERSION_CHANGED_REQUIRES_ADMIN: '+current.version);
 if(config.port!==fixedPort)throw Error('ENTRY_PORT_NOT_RESTORED: expected 58618');
 const root=fs.realpathSync(path.join(home,'versions',current.version));
 if(!root.startsWith(home+path.sep))throw Error('INSTALLED_PATH_OUTSIDE_HOME');
 const lock=lockProduct(root);
 if(lock.snapshot.product_version!==current.version||lock.snapshot.compiler_revision!==expected.compiler||lock.snapshot.contract!==expected.contract)throw Error('INSTALLED_VERSION_IDENTITY_MISMATCH');
 return{home,root,url:`http://127.0.0.1:${fixedPort}/`,config,snapshot:lock.snapshot,verify:lock.verify,
  command:process.execPath,args:[path.join(root,'product/short-compiler/deploy.mjs'),'start','--home',home]};
}
export async function existingEntry(plan,fetchImpl=fetch){
 try{
  const r=await fetchImpl(plan.url+'api/session',{signal:AbortSignal.timeout(2500)});
  if(!r.ok)return{state:'OTHER_OR_UNKNOWN',http_status:r.status};
  const session=await r.json(),s=session.product_snapshot;
  if(s?.manifest_sha256!==plan.snapshot.manifest_sha256||s?.product_version!==(plan.snapshot.product_version??expectedVersion)||session.compiler_revision!==(plan.snapshot.compiler_revision??expectedCompiler)||session.contract!==plan.snapshot.contract)
   return{state:'OTHER_OR_UNKNOWN',reason:'VERSION_MISMATCH'};
  // Session token/cookie stays in memory and is never logged.
  return{state:'SAME_INSTALLED_VERSION',version:s.product_version,compiler:session.compiler_revision};
 }catch(e){return e.cause?.code==='ECONNREFUSED'?{state:'FREE'}:{state:'OTHER_OR_UNKNOWN',reason:e.cause?.code??e.name};}
}
export async function launchInstalled({home=installedHome,probe=existingEntry,spawnImpl=spawn,log=console.log}={}){
 const plan=installedPlan(home),existing=await probe(plan);plan.verify();
 if(existing.state==='SAME_INSTALLED_VERSION'){
  log(JSON.stringify({already_running:true,url:plan.url,version:plan.snapshot.product_version,compiler:plan.snapshot.compiler_revision,semantic_acceptance:plan.snapshot.product_acceptance,model_calls:0}));return{already_running:true,plan};
 }
 if(existing.state!=='FREE')throw Error('PORT_IN_USE_OR_UNVERIFIED: no process was stopped and no alternate port was selected');
 const child=spawnImpl(plan.command,plan.args,{cwd:plan.root,stdio:'inherit',windowsHide:true,env:{...process.env}});
 log(JSON.stringify({starting:true,url:plan.url,version:plan.snapshot.product_version,compiler:plan.snapshot.compiler_revision,installation:plan.root,semantic_acceptance:plan.snapshot.product_acceptance,known_limitations:plan.snapshot.known_limitations}));
 return{already_running:false,child,plan};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.argv.length!==2)throw Error('Usage: npm run 7plus1:ui (fixed installed home and port; no override)');
 const {child}=await launchInstalled();
 if(child){
  child.on('error',e=>{console.error(e.message);process.exitCode=1;});
  child.on('exit',code=>{process.exitCode=code??1;});
  process.on('SIGINT',()=>child.kill('SIGINT'));
 }
}
