import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {lockProduct} from './resources.mjs';
const repo=process.cwd(),home=path.join(repo,'.boundx/short-compiler-031-r1');
const current=JSON.parse(fs.readFileSync(path.join(home,'current.json'),'utf8'));
if(!['0.1.0-candidate.031-r1.2','0.1.0-candidate.031-r1.2-ui.2'].includes(current.version))throw Error('CURRENT_VERSION_CHANGED');
const candidate=lockProduct(path.join(home,'versions','0.1.0-candidate.031-r1.2-ui.4'));candidate.verify();
const session=await(await fetch('http://127.0.0.1:58618/api/session',{signal:AbortSignal.timeout(5000)})).json();
const original=lockProduct(path.join(home,'versions',current.version));original.verify();
if(session.product_snapshot?.manifest_sha256!==original.snapshot.manifest_sha256)throw Error('RUNNING_IDENTITY_MISMATCH');
const history=await(await fetch('http://127.0.0.1:58618/api/runs')).json();
if(history.some(r=>['QUEUED','RUNNING','CANCELLING'].includes(r.status)))throw Error('ACTIVE_REQUEST_DO_NOT_STOP');
const stamp=new Date().toISOString().replaceAll(':','-'),backup=path.join(home,'backups','readable-ui-'+stamp);
const config=JSON.parse(fs.readFileSync(path.join(home,'config.json'),'utf8'));
const data=fs.realpathSync(config.data_dir);
if(backup===data||backup.startsWith(data+path.sep))throw Error('BACKUP_WITHIN_DATA');
fs.mkdirSync(backup,{recursive:true});
for(const file of ['config.json','current.json'])fs.copyFileSync(path.join(home,file),path.join(backup,file),fs.constants.COPYFILE_EXCL);
fs.cpSync(data,path.join(backup,'data'),{recursive:true,errorOnExist:true,force:false});
const sha=b=>createHash('sha256').update(b).digest('hex');
const exports=[];for(const row of history.filter(r=>r.status.startsWith('COMPLETED'))){
 const entry={run_id:row.run_id};for(const suffix of ['json','export','trace.json']){const r=await fetch('http://127.0.0.1:58618/api/runs/'+row.run_id+'/'+suffix);if(!r.ok)throw Error('EXPORT_PRECHECK_FAILED');entry[suffix]=sha(Buffer.from(await r.arrayBuffer()));}exports.push(entry);
}
const result={prepared_at:stamp,backup,original:original.snapshot.product_version,candidate:candidate.snapshot.product_version,history_count:history.length,active_requests:0,exports,model_calls:0};
const report=path.join(home,'readable-ui-verification-r04');fs.writeFileSync(path.join(report,'SWITCH-PREFLIGHT.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
