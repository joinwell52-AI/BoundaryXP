// Seal factual offline evidence. Never starts a service or invokes a model.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const root=process.cwd(),report='docs/reports/7plus1/PUBLIC-SESSION-ACTIVITY-R04',home=path.join(root,'.boundx/short-compiler-031-r1');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
if(fs.existsSync(path.join(report,'SEAL.json')))throw Error('ALREADY_SEALED');
const before=read('docs/reports/7plus1/PUBLIC-SESSION-ACTIVITY-R03/PREFLIGHT.json'),config=read(path.join(home,'config.json')),current=read(path.join(home,'current.json'));
if(current.version!=='0.1.0-candidate.031-r1.2-ui.10')throw Error('ROLLBACK_POINTER_CHANGED');
const list=(dir,prefix='')=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?list(path.join(dir,x.name),prefix+x.name+'/'):[{path:prefix+x.name,sha256:sha(fs.readFileSync(path.join(dir,x.name)))}]).sort((a,b)=>a.path.localeCompare(b.path));
const backup=list(path.join(before.backup,'data')),data=list(config.data_dir);
if(JSON.stringify(backup)!==JSON.stringify(data))throw Error('ORIGINAL_HISTORY_CHANGED');
let port;try{await fetch('http://127.0.0.1:58618/api/session',{signal:AbortSignal.timeout(1500)});port='RESPONDING';}catch(e){port=e.cause?.code??e.name;}
const state={status:'DEPLOYMENT_BLOCKED',auto_review:'START_PROCESS_REJECTED',reason:'blocked by policy; no further reason supplied',alternative_launch_attempted:false,installation_pointer:current.version,port_probe:port,history_files_identical_to_backup:true,history_file_count:data.length,backup:before.backup,real_model_calls:0};
fs.writeFileSync(path.join(report,'DEPLOYMENT.json'),JSON.stringify(state,null,2)+'\n',{flag:'wx'});
const source=['docs/BOUNDARYXP-LLM-SEMANTIC-ESSENTIALS.zh-CN.md','product/short-compiler/launch-installed.mjs','product/short-compiler/build-session-activity-ui.mjs','product/short-compiler/verify-session-activity-ui.mjs','product/short-compiler/session-activity-deployment.mjs','product/short-compiler/seal-session-activity-report.mjs','product/short-compiler/tests/count-timing.test.mjs','product/short-compiler/tests/session-activity.test.mjs','product/short-compiler/tests/runtime-version.test.mjs','research/7plus1-parser/llm-first-028/model-activity.mjs','research/7plus1-parser/llm-first-028/observability.mjs','research/7plus1-parser/llm-first-028/service.mjs','research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js','research/7plus1-parser/v0.3-p2.1-generalization/web/style.css'];
const files=[...source,...['PUBLIC-SESSION-ACTIVITY-R02','PUBLIC-SESSION-ACTIVITY-R03','PUBLIC-SESSION-ACTIVITY-R04'].flatMap(d=>fs.readdirSync('docs/reports/7plus1/'+d).filter(f=>!['MANIFEST.json','SHA256SUMS','SEAL.json'].includes(f)).map(f=>'docs/reports/7plus1/'+d+'/'+f))].map(p=>({path:p,sha256:sha(fs.readFileSync(p))}));
const manifest={status:'OFFLINE_VERIFIED_DEPLOYMENT_BLOCKED',candidate:'0.1.0-candidate.031-r1.2-ui.12',files};
fs.writeFileSync(path.join(report,'MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(report,'SHA256SUMS'),files.map(f=>f.sha256+'  '+f.path).join('\n')+'\n',{flag:'wx'});
fs.writeFileSync(path.join(report,'SEAL.json'),JSON.stringify({status:'WAITING_ADMIN_REVIEW',manifest_sha256:sha(fs.readFileSync(path.join(report,'MANIFEST.json'))),sha256sums_sha256:sha(fs.readFileSync(path.join(report,'SHA256SUMS'))),tests:read(path.join(report,'VERIFY.json')).tests,online_test:'NOT_RUN_POLICY_BLOCKED',real_model_calls:0},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({sealed:true,report,state,files:files.length},null,2));
