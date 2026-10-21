// Controlled fixed-entry observability deployment. Does not invoke or configure models.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {lockProduct} from './resources.mjs';
const home=path.resolve('.boundx/short-compiler-031-r1'),report=path.resolve('docs/reports/7plus1/PUBLIC-SESSION-ACTIVITY-R04'),url='http://127.0.0.1:58618/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const base='0.1.0-candidate.031-r1.2-ui.10',version='0.1.0-candidate.031-r1.2-ui.12',candidate=lockProduct(path.join(home,'versions',version));candidate.verify();
const json=async suffix=>{const r=await fetch(url+suffix,{signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('HTTP:'+r.status);return r.json();};
async function exportsOf(history){const rows=[];for(const r of history.filter(x=>x.status.startsWith('COMPLETED'))){const row={run_id:r.run_id};for(const suffix of ['json','export','trace.json']){const x=await fetch(url+'api/runs/'+r.run_id+'/'+suffix);if(!x.ok)throw Error('EXPORT_FAILED');row[suffix]=sha(Buffer.from(await x.arrayBuffer()));}rows.push(row);}return rows;}
if(process.argv[2]==='preflight'){
 const current=read(path.join(home,'current.json')),old=lockProduct(path.join(home,'versions',base)),s=await json('api/session'),history=await json('api/runs');old.verify();
 if(current.version!==base||s.product_snapshot.manifest_sha256!==old.snapshot.manifest_sha256)throw Error('WRONG_LIVE_TARGET');
 if(history.some(x=>['QUEUED','RUNNING','CANCELLING'].includes(x.status)))throw Error('ACTIVE_REQUEST_DO_NOT_STOP');
 if(read(path.join(report,'VERIFY.json')).status!=='PASS')throw Error('QUALITY_GATE_REQUIRED');
 const backup=path.join(home,'backups','public-session-'+new Date().toISOString().replaceAll(':','-'));fs.mkdirSync(backup,{recursive:true});for(const f of ['current.json','config.json'])fs.copyFileSync(path.join(home,f),path.join(backup,f),fs.constants.COPYFILE_EXCL);
 const config=read(path.join(home,'config.json'));fs.cpSync(fs.realpathSync(config.data_dir),path.join(backup,'data'),{recursive:true,errorOnExist:true,force:false});
 const p={backup,current:base,candidate:version,history_count:history.length,active_requests:0,exports:await exportsOf(history),manifest:candidate.snapshot.manifest_sha256,real_model_calls:0};
 fs.writeFileSync(path.join(report,'PREFLIGHT.json'),JSON.stringify(p,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({backup,history_count:history.length,active_requests:0}));
}else if(process.argv[2]==='activate'){
 const p=read(path.join(report,'PREFLIGHT.json'));if(p.candidate!==version||read(path.join(home,'current.json')).version!==base)throw Error('PREFLIGHT_CHANGED');
 try{await fetch(url+'api/session',{signal:AbortSignal.timeout(1500)});throw Error('SERVICE_STILL_RUNNING');}catch(e){if(e.cause?.code!=='ECONNREFUSED')throw e;}
 const file=path.join(home,'current.json');fs.writeFileSync(file+'.tmp',JSON.stringify({version,previous:base},null,2)+'\n');fs.renameSync(file+'.tmp',file);console.log(JSON.stringify({pointer:version,previous:base}));
}else if(process.argv[2]==='verify-online'){
 const before=read(path.join(report,'PREFLIGHT.json')),session=await json('api/session'),history=await json('api/runs');
 if(session.product_snapshot.manifest_sha256!==candidate.snapshot.manifest_sha256)throw Error('LIVE_VERSION_MISMATCH');
 const exportsNow=await exportsOf(history);if(JSON.stringify(before.exports)!==JSON.stringify(exportsNow)||before.history_count!==history.length)throw Error('HISTORY_OR_EXPORT_CHANGED');
 const sample='d857d161-6a8e-48e1-a36f-14a72d22667f',run=await json('api/runs/'+sample),activityExport=await json('api/runs/'+sample+'/activity.json');
 if(run.model_activity.calls.length!==2||run.model_activity.calls.some(c=>c.summaries.length!==0||c.summary_status!=='NOT_RETURNED'))throw Error('ACTUAL_SUMMARY_HISTORY_MISREPRESENTED');
 if(run.model_activity.calls.reduce((s,c)=>s+c.diagnostic_count,0)!==4)throw Error('SESSION_DIAGNOSTICS_MISSING');
 if(activityExport.hidden_reasoning_included||activityExport.semantic_evidence)throw Error('ACTIVITY_AS_SEMANTIC_EVIDENCE');
 const api={status:'PASS',url,version,manifest:session.product_snapshot.manifest_sha256,history_count:history.length,original_exports_identical:true,sample:{run_id:sample,public_summaries:0,session_diagnostics:4,threads:run.model_activity.calls.map(c=>c.thread_id)},account_config_changed:false,real_model_calls:0};
 fs.writeFileSync(path.join(report,'ONLINE.json'),JSON.stringify(api,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(api,null,2));
}else throw Error('Use preflight / activate / verify-online');
