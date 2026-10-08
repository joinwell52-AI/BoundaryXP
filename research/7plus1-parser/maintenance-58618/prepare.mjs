// Local transport maintenance: preserve source history bytes; never parse a business task.
import fs from 'node:fs';import path from 'node:path';import net from 'node:net';import {createHash,randomUUID} from 'node:crypto';
import {lockProduct} from '../../../product/short-compiler/resources.mjs';
export const report=path.resolve('docs/reports/7plus1/031-R1-RESTORE-58618');
const home=path.resolve('.boundx/short-compiler-031-r1'),originalData=path.resolve('.boundx/7plus1-short'),originalLegacy=path.resolve('research/7plus1-parser/local-lab/history');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export const write=(name,v)=>{fs.mkdirSync(report,{recursive:true});fs.writeFileSync(path.join(report,name),JSON.stringify(v,null,2)+'\n',{flag:'wx'});};
export const walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]):[];
const inventory=d=>walk(d).map(p=>({path:path.relative(d,p).replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:hash(p)}));
const portFree=()=>new Promise((resolve,reject)=>{const s=net.connect({host:'127.0.0.1',port:58618});s.setTimeout(2000);s.once('connect',()=>{s.destroy();reject(Error('PORT_58618_OCCUPIED_NO_STOP_AUTHORIZATION_ASSUMED'));});s.once('error',e=>{s.destroy();e.code==='ECONNREFUSED'?resolve():reject(e);});s.once('timeout',()=>{s.destroy();reject(Error('PORT_58618_IDENTITY_UNVERIFIED'));});});
if(process.argv[2]==='backup'){
 const current=JSON.parse(fs.readFileSync(path.join(home,'current.json'))),config=JSON.parse(fs.readFileSync(path.join(home,'config.json')));
 if(current.version!=='0.1.0-candidate.031-r1.2'||config.port!==58621)throw Error('INSTALLATION_HAS_CHANGED_PROTECT_CURRENT');
 const root=path.join(home,'versions',current.version),lock=lockProduct(root);lock.verify();
 const candidateData=path.resolve(config.data_dir),terminal=new Set(['COMPLETED','COMPLETED_WITH_UNRESOLVED','FAILED','CANCELLED','INTERRUPTED']);
 const records=d=>fs.readdirSync(path.join(d,'runs')).filter(id=>fs.existsSync(path.join(d,'runs',id,'run.json'))).map(id=>JSON.parse(fs.readFileSync(path.join(d,'runs',id,'run.json'))));
 const pending=[...records(candidateData),...records(originalData)].filter(x=>!terminal.has(x.status));if(pending.length)throw Error('NONTERMINAL_HISTORY_REQUIRES_REVIEW: '+pending.map(x=>x.run_id).join(','));
 await portFree();
 const backup=path.join(home,'backups','restore-58618-'+new Date().toISOString().replaceAll(':','-'));fs.mkdirSync(backup,{recursive:false});
 const copies=[{source:path.join(home,'config.json'),destination:'config.json'},{source:path.join(home,'current.json'),destination:'current.json'},
  {source:path.join(root,'PRODUCT-MANIFEST.json'),destination:'candidate-PRODUCT-MANIFEST.json'},{source:candidateData,destination:'candidate-data'},
  {source:originalData,destination:'original-58618-data'},{source:originalLegacy,destination:'original-legacy-history'},
  {source:path.resolve('package.json'),destination:'original-package.json'},{source:path.resolve('research/7plus1-parser/v0.3-p2.1-generalization/server.mjs'),destination:'original-start-entry.mjs'}];
 const backups=[];
 for(const item of copies){
  if(!fs.existsSync(item.source))throw Error('SOURCE_BACKUP_MISSING:'+item.source);
  const dst=path.resolve(backup,item.destination);if(!dst.startsWith(backup+path.sep))throw Error('BACKUP_PATH');
  fs.cpSync(item.source,dst,{recursive:true,errorOnExist:true,force:false});
  const directory=fs.statSync(item.source).isDirectory(),files=directory?inventory(item.source):[{path:'',bytes:fs.statSync(item.source).size,sha256:hash(item.source)}];
  for(const file of files){const p=directory?path.join(dst,file.path):dst;if(hash(p)!==file.sha256)throw Error('BACKUP_DIGEST_MISMATCH');}
  backups.push({...item,backup_path:dst,files});
 }
 // Old records remain separate from the candidate data store. This is its existing LEGACY_READ_ONLY namespace.
 const archive=path.join(home,'legacy-58618-readonly-'+randomUUID());fs.cpSync(originalLegacy,archive,{recursive:true,errorOnExist:true,force:false});
 const archived=[];
 for(const r of records(originalData)){
  if(r.hidden)continue;
  const dir=path.join(originalData,'runs',r.run_id),trace=path.join(dir,'trace.json'),src=fs.existsSync(trace)?trace:path.join(dir,'run.json'),dst=path.join(archive,r.run_id+'.json');
  if(fs.existsSync(dst))throw Error('LEGACY_HISTORY_ID_COLLISION');
  fs.copyFileSync(src,dst,fs.constants.COPYFILE_EXCL);if(hash(src)!==hash(dst))throw Error('HISTORY_COPY_MISMATCH');
  archived.push({run_id:r.run_id,engine:r.engine,compiler_revision:r.compiler_revision??null,status:r.status,source_sha256:r.source_sha256,original_file:src,archive_file:dst,sha256:hash(src),mode:'RAW_ORIGINAL_BYTES_LEGACY_READ_ONLY'});
 }
 fs.writeFileSync(path.join(archive,'RESTORE-INDEX.json'),JSON.stringify({current_history_not_merged:true,original_legacy_root:originalLegacy,original_short_root:originalData,records:archived},null,2)+'\n',{flag:'wx'});
 const baseline=JSON.parse(fs.readFileSync('.boundx/experiments/031-r1-restore-58618/protection.json'));
 write('PREPARE.json',{at:new Date().toISOString(),home,root,backup,archive,config_before:config,current_before:current,snapshot:lock.snapshot,backups,
  original_short_records:records(originalData).length,candidate_records:records(candidateData).length,archived_short_records:archived,original_legacy_files:fs.readdirSync(originalLegacy).length,
  current_history_not_merged:true,nonterminal_records:[],current_target_listener:'NONE',processes_stopped:[],model_calls:0,protected_tracked:baseline.dirty.length,protected_untracked:baseline.untracked.length,
  protection_snapshot_local:'.boundx/experiments/031-r1-restore-58618/protection.json',protection_snapshot_sha256:hash('.boundx/experiments/031-r1-restore-58618/protection.json')});
 console.log(JSON.stringify({backup,archive,current:current.version,candidate_records:2,original_short_records:16,model_calls:0}));
}
if(process.argv[2]==='configure'){
 const prep=JSON.parse(fs.readFileSync(path.join(report,'PREPARE.json')));await portFree();
 const file=path.join(home,'config.json'),before=fs.readFileSync(file),config=JSON.parse(before);if(JSON.stringify(config)!==JSON.stringify(prep.config_before))throw Error('CONFIG_CHANGED_AFTER_BACKUP');
 if(hash(path.join(home,'current.json'))!==hash(path.join(prep.backup,'current.json')))throw Error('CURRENT_POINTER_CHANGED');
 for(const item of prep.backups)for(const f of item.files){const p=f.path?path.join(item.backup_path,f.path):item.backup_path;if(hash(p)!==f.sha256)throw Error('BACKUP_INTEGRITY_CHANGED');}
 const after={...config,port:58618,legacy_dir:prep.archive},temp=file+'.restore-'+randomUUID()+'.tmp';
 fs.writeFileSync(temp,JSON.stringify(after,null,2)+'\n',{flag:'wx'});fs.renameSync(temp,file);
 write('CONFIGURATION.json',{before:config,after,changed_fields:['port','legacy_dir'],data_dir_unchanged:true,codex_binary_unchanged:true,current_pointer_unchanged:true,installed_resources_unchanged:true,model_calls:0});
 console.log(JSON.stringify({port:58618,version:prep.current_before.version,configured:true,started:false,model_calls:0}));
}
