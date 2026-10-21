import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {lockProduct} from './resources.mjs';
const root=path.resolve('D:/boundx'),home=path.join(root,'.boundx/short-compiler-031-r1'),url='http://127.0.0.1:58618/';
const base='0.1.0-candidate.031-r1.2-ui.22',version='0.1.0-candidate.031-r1.2-ui.32';
const candidateRoot=path.join(root,'.boundx/products',version),report=path.join(root,'docs/reports/7plus1/SEMANTIC-CONTRACT-CLOSURE-r02-DEPLOYMENT-20261011');
const sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const save=(name,v)=>fs.writeFileSync(path.join(report,name),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const terminal=new Set(['COMPLETED','COMPLETED_WITH_UNRESOLVED','FAILED','CANCELLED','INTERRUPTED','LEGACY_READ_ONLY']);
async function response(route){const r=await fetch(url+route,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status+' '+route);return r;}
async function json(route){return (await response(route)).json();}
function inventory(dir){const rows=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.isFile())rows.push({path:path.relative(dir,p).replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:sha(fs.readFileSync(p))});else throw Error('UNSUPPORTED_DATA_ENTRY');}}walk(dir);return rows.sort((a,b)=>a.path.localeCompare(b.path));}
async function exportHashes(history){const rows=[];for(const r of history.filter(x=>x.status.startsWith('COMPLETED')).sort((a,b)=>a.run_id.localeCompare(b.run_id))){const row={run_id:r.run_id};for(const format of ['json','export','trace.json'])row[format]=sha(Buffer.from(await (await response('api/runs/'+r.run_id+'/'+format)).arrayBuffer()));rows.push(row);}return rows;}
async function idle(expectedManifest){const s=await json('api/session'),history=await json('api/runs');if(s.product_snapshot?.manifest_sha256!==expectedManifest)throw Error('WRONG_SERVICE_SNAPSHOT');if(history.some(x=>!terminal.has(x.status)))throw Error('TARGET_HAS_ACTIVE_OR_UNKNOWN_REQUEST');return{s,history};}
if(process.argv[2]==='preflight'){
 if(fs.existsSync(report))throw Error('DEPLOYMENT_REPORT_ALREADY_EXISTS');
 fs.mkdirSync(report,{recursive:true});
 const candidate=lockProduct(candidateRoot),old=lockProduct(path.join(home,'versions',base));
 if(candidate.snapshot.manifest_sha256!=='03c2e4cd599aea6f0ba3cbba757b09f73b3b2877e8e8389e36ca31194d871ef4')throw Error('CANDIDATE_DIGEST_MISMATCH');
 const packagePath=path.join(root,'docs/reports/7plus1/SEMANTIC-CONTRACT-CLOSURE-r02/candidate',version+'.zip');
 if(sha(fs.readFileSync(packagePath))!=='4c5a3659a17f339be136507badb977c19529085f53e2a336285be4ddc4277371')throw Error('CANDIDATE_ARCHIVE_CHANGED');
 const current=read(path.join(home,'current.json')),config=read(path.join(home,'config.json'));
 if(current.version!==base||config.port!==58618)throw Error('TARGET_POINTER_CHANGED');
 const before=await idle(old.snapshot.manifest_sha256),data=fs.realpathSync(config.data_dir),dataBefore=inventory(data),exportsBefore=await exportHashes(before.history);
 const backup=path.join(home,'backups','ui32-user-authorized-'+new Date().toISOString().replaceAll(':','-'));
 if(!backup.startsWith(home+path.sep)||backup.startsWith(data+path.sep))throw Error('INVALID_BACKUP_PATH');
 fs.mkdirSync(backup,{recursive:true});
 for(const name of ['current.json','config.json'])fs.copyFileSync(path.join(home,name),path.join(backup,name),fs.constants.COPYFILE_EXCL);
 fs.cpSync(data,path.join(backup,'data'),{recursive:true,errorOnExist:true,force:false});
 if(JSON.stringify(inventory(path.join(backup,'data')))!==JSON.stringify(dataBefore)||JSON.stringify(inventory(data))!==JSON.stringify(dataBefore))throw Error('BACKUP_OR_LIVE_DATA_CHANGED');
 await idle(old.snapshot.manifest_sha256);
 save('PREFLIGHT.json',{at:new Date().toISOString(),authorization:'User explicitly requested immediate local version update; semantic quality remains FAIL/PARTIAL.',home,url,base,candidate:version,manifest:candidate.snapshot.manifest_sha256,old_manifest:old.snapshot.manifest_sha256,backup,config_sha256:sha(fs.readFileSync(path.join(home,'config.json'))),history_count:before.history.length,history_ids:before.history.map(x=>x.run_id).sort(),active_requests:0,data_files:dataBefore,exports:exportsBefore,model_calls:0,public_release:false});
 console.log(JSON.stringify({backup,history_count:before.history.length,data_files:dataBefore.length,active_requests:0,candidate:version,manifest:candidate.snapshot.manifest_sha256}));
}else if(process.argv[2]==='verify-idle'){
 const p=read(path.join(report,'PREFLIGHT.json'));if(read(path.join(home,'current.json')).version!==base)throw Error('POINTER_CHANGED');await idle(p.old_manifest);console.log('VERIFIED_OLD_TARGET_IDLE');
}else if(process.argv[2]==='verify-online'){
 const p=read(path.join(report,'PREFLIGHT.json')),lock=lockProduct(path.join(home,'versions',version)),live=await idle(p.manifest);
 if(read(path.join(home,'current.json')).version!==version||live.s.compiler_revision!=='031-r1-c7'||live.s.contract!=='031-r1.1')throw Error('NEW_VERSION_IDENTITY_MISMATCH');
 if(live.s.product_snapshot.product_acceptance!=='PARTIAL / SEMANTIC_REPAIR_CANDIDATE_NOT_ADMIN_ACCEPTED')throw Error('SEMANTIC_STATUS_CHANGED');
 if(sha(fs.readFileSync(path.join(home,'config.json')))!==p.config_sha256)throw Error('CONFIG_CHANGED');
 if(JSON.stringify(inventory(read(path.join(home,'config.json')).data_dir))!==JSON.stringify(p.data_files))throw Error('HISTORY_BYTES_CHANGED');
 if(JSON.stringify(live.history.map(x=>x.run_id).sort())!==JSON.stringify(p.history_ids)||JSON.stringify(await exportHashes(live.history))!==JSON.stringify(p.exports))throw Error('HISTORY_OR_EXPORT_CHANGED');
 const old=lockProduct(path.join(home,'versions',base));if(old.snapshot.manifest_sha256!==p.old_manifest)throw Error('ROLLBACK_VERSION_CHANGED');
 const web=path.join(candidateRoot,'research/7plus1-parser/v0.3-p2.1-generalization/web'),assets=[];
 for(const [route,file] of [['','index.html'],['app.js','native-app.js'],['process-view.js','process-view.js'],['calculation-view.js','calculation-view.js'],['style.css','style.css']]){
  const r=await response(route),actual=Buffer.from(await r.arrayBuffer()),expected=fs.readFileSync(path.join(web,file));if(sha(actual)!==sha(expected))throw Error('WEB_MIXED_VERSION '+route);assets.push({route:route||'/',status:r.status,sha256:sha(actual)});
 }
 lock.verify();
 const result={at:new Date().toISOString(),status:'PASS',local_deployment:'UPDATED_FOR_USER_TESTING',semantic_quality:'FAIL / PARTIAL',product_version:version,compiler:live.s.compiler_revision,contract:live.s.contract,manifest:lock.snapshot.manifest_sha256,url,history_count:live.history.length,history_bytes_unchanged:true,exports_unchanged:true,config_unchanged:true,rollback_version:base,backup:p.backup,assets,skill_mode:live.s.skill_mode,resource_profile:live.s.resource_profile,effective_resource_sha256:live.s.comparison_resources?.SKILL?.effective_resource_sha256,requested_model:live.s.requested_model,actual_model:live.s.actual_model,model_calls:0,public_release:false};
 save('ONLINE.json',result);console.log(JSON.stringify(result,null,2));
}else throw Error('Use preflight / verify-idle / verify-online');
