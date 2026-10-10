import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {lockProduct} from './resources.mjs';
const out=path.resolve('.boundx/exports/SEMANTIC-CONTRACT-CLOSURE-r02'),hash=x=>createHash('sha256').update(x).digest('hex'),save=(n,x)=>fs.writeFileSync(path.join(out,n),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const old=JSON.parse(fs.readFileSync(path.join(out,'pre-freeze/parent.json'),'utf8')),next=JSON.parse(fs.readFileSync(path.join(out,'pre-freeze/candidate.json'),'utf8'));
const normalize=n=>n.endsWith('runtime-version.test.mjs')?'HARNESS/runtime-version.test.mjs':n;
const a=old.failed.map(normalize),b=next.failed.map(normalize);
save('REGRESSION-COMPARISON.json',{parent:old.counts,candidate:next.counts,new_named_assertion_failures:b.filter(x=>!a.includes(x)),closed_named_assertions:a.filter(x=>!b.includes(x)),normalization:'Only the absolute test-harness container path is normalized; raw TAP and assertions stay unchanged.',whole_regression_pass:false});
const frozen=lockProduct('.boundx/products/0.1.0-candidate.031-r1.2-ui.30'),installed=lockProduct('.boundx/semantic-closure-r02-install-check/versions/0.1.0-candidate.031-r1.2-ui.30');frozen.verify();installed.verify();
if(frozen.snapshot.manifest_sha256!==installed.snapshot.manifest_sha256)throw Error('CLEAN_INSTALL_MISMATCH');
save('CLEAN-INSTALL.json',{version:frozen.snapshot.product_version,manifest:frozen.snapshot.manifest_sha256,manifest_files:frozen.snapshot.files.length,installed_files_verified:true,model_calls:0,user_service_changed:false,new_user_ports:0});
const seals=[];
for(const name of ['TRANSPORT-INPUT-CLOSURE-r01','SEMANTIC-CONTRACT-CLOSURE-r01','SEMANTIC-CONTRACT-CLOSURE-REPORT-CORRECTION-r02']){
 const dir=path.resolve('.boundx/exports',name),bytes=fs.readFileSync(path.join(dir,'MANIFEST.json')),m=JSON.parse(bytes),seal=JSON.parse(fs.readFileSync(path.join(dir,'SEAL.json'),'utf8'));
 if(hash(bytes)!==seal.manifest_sha256)throw Error('OLD_SEAL_CHANGED:'+name);
 for(const f of m.files)if(hash(fs.readFileSync(path.join(dir,f.path)))!==f.sha256)throw Error('OLD_FILE_CHANGED:'+f.path);
 seals.push({name,manifest:hash(bytes),files_verified:m.files.length});
}
save('OLD-SEALS-VERIFIED.json',{seals,checked_at:new Date().toISOString()});
const base='http://127.0.0.1:58618',page=await fetch(base),session=await fetch(base+'/api/session'),history=await fetch(base+'/api/runs');
if(!page.ok||!session.ok||!history.ok)throw Error('58618_NOT_ONLINE');const s=await session.json(),runs=await history.json();
const active=runs.filter(r=>['QUEUED','RUNNING','PARSING','AUDITING','VALIDATING','COMPILING','CALCULATING','REVISING'].includes(r.status));
save('58618-BEFORE.json',{url:base,page_http:page.status,version:s.product_snapshot.product_version,manifest:s.product_snapshot.manifest_sha256,compiler_revision:s.compiler_revision,history_count:runs.length,active_count:active.length,upgraded:false,account_data_saved:false});
console.log(JSON.stringify({new_regression_failures:b.filter(x=>!a.includes(x)).length,old_seals:seals.length,clean_install:true,current_version:s.product_snapshot.product_version,active:active.length}));
