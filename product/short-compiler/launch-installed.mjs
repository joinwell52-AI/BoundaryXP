// User entry transport only. Preserve complete installed core, Skills, Schema and UI identity.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {lockProduct} from './resources.mjs';
const approvedVersions={
 '0.1.0-candidate.031-r1.2-ui.87':{compiler:'llm-boundary-r02.1-test',contract:'candidate-ir/2.0'},
 '0.1.0-candidate.031-r1.2-ui.86':{compiler:'llm-boundary-r02-test',contract:'candidate-ir/2.0'},
 '0.1.0-candidate.031-r1.2-ui.85':{compiler:'llm-boundary-r01-test',contract:'candidate-ir/2.0'},
 '0.1.0-candidate.031-r1.2-ui.84':{compiler:'direct-ir-kernel-r02-test',contract:'candidate-ir/2.0'},
 '0.1.0-candidate.031-r1.2-ui.83':{compiler:'direct-ir-kernel-r01-test',contract:'candidate-ir/2.0'},
 '0.1.0-candidate.031-r1.2-ui.82':{compiler:'direct-ir-r05.5-test',contract:'candidate-ir/1.4'},
 '0.1.0-candidate.031-r1.2-ui.81':{compiler:'direct-ir-r05.4-test',contract:'candidate-ir/1.4'},
 '0.1.0-candidate.031-r1.2-ui.78':{compiler:'direct-ir-r05.1-test',contract:'candidate-ir/1.4'},
 '0.1.0-candidate.031-r1.2-ui.77':{compiler:'direct-ir-r05-test',contract:'candidate-ir/1.4'},
 '0.1.0-candidate.031-r1.2-ui.76':{compiler:'direct-ir-r04.1-test',contract:'candidate-ir/1.4'},
 '0.1.0-candidate.031-r1.2-ui.75':{compiler:'direct-ir-r04.1-test',contract:'candidate-ir/1.4'},
 '0.1.0-candidate.031-r1.2-ui.74':{compiler:'direct-ir-r04-test',contract:'candidate-ir/1.4'},
 '0.1.0-candidate.031-r1.2-ui.73':{compiler:'direct-ir-r03.2-test',contract:'candidate-ir/1.2'},
 '0.1.0-candidate.031-r1.2-ui.72':{compiler:'direct-ir-r03.1-test',contract:'candidate-ir/1.2'},
 '0.1.0-candidate.031-r1.2-ui.70':{compiler:'direct-ir-r02.2-test',contract:'candidate-ir/1.1'},
 '0.1.0-candidate.031-r1.2-ui.69':{compiler:'direct-ir-r02.2-test',contract:'candidate-ir/1.1'},
 '0.1.0-candidate.031-r1.2-ui.68':{compiler:'direct-ir-r02.1-test',contract:'candidate-ir/1.1'},
 '0.1.0-candidate.031-r1.2-ui.67':{compiler:'direct-ir-r02-test',contract:'candidate-ir/1.1'},
 '0.1.0-candidate.031-r1.2-ui.65':{compiler:'031-r1-c37',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.64':{compiler:'031-r1-c36',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.57':{compiler:'031-r1-c29',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.56':{compiler:'031-r1-c28',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.52':{compiler:'031-r1-c25',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.51':{compiler:'031-r1-c25',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.49':{compiler:'031-r1-c23',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.46':{compiler:'031-r1-c20',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.42':{compiler:'031-r1-c16',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.40':{compiler:'031-r1-c14',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.38':{compiler:'031-r1-c12',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.36':{compiler:'031-r1-c11',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.32':{compiler:'031-r1-c7',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.1':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.2':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.4':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.6':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.7':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.8':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.10':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.11':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.12':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.13':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.18':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.19':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.20':{compiler:'031-r1-c3',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.21':{compiler:'031-r1-c4',contract:'031-r1.1'},
 '0.1.0-candidate.031-r1.2-ui.22':{compiler:'031-r1-c5',contract:'031-r1.1'},
 '0.1.0-candidate.032.1':{compiler:'032-c1',contract:'032.1'},
 '0.1.0-candidate.032.2':{compiler:'032-c2',contract:'032.1'},
 '0.1.0-candidate.032.3':{compiler:'032-c3',contract:'032.1'}
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
 if(process.argv.length!==2&&!(process.argv.length===4&&process.argv[2]==='--home'&&path.isAbsolute(process.argv[3])))throw Error('Usage: npm run 7plus1:ui [-- --home ABSOLUTE_INSTALLATION_HOME] (fixed port 58618)');
 const {child}=await launchInstalled(process.argv.length===4?{home:process.argv[3]}:{});
 if(child){
  child.on('error',e=>{console.error(e.message);process.exitCode=1;});
  child.on('exit',code=>{process.exitCode=code??1;});
  process.on('SIGINT',()=>child.kill('SIGINT'));
 }
}


