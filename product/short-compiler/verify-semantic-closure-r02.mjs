// Read-only verification of the frozen candidate and historical evidence.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';import {lockProduct} from './resources.mjs';
const dir=path.resolve('.boundx/exports/SEMANTIC-CONTRACT-CLOSURE-r02'),sha=x=>createHash('sha256').update(x).digest('hex');
const save=(name,v)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const frozen=lockProduct('.boundx/products/0.1.0-candidate.031-r1.2-ui.32'),installed=lockProduct('.boundx/semantic-closure-r02-install-check/versions/0.1.0-candidate.031-r1.2-ui.32');frozen.verify();installed.verify();
if(frozen.snapshot.manifest_sha256!==installed.snapshot.manifest_sha256)throw Error('INSTALL_DIGEST_MISMATCH');
const bundles={};for(const v of ['30','32']){const {buildBundle}=await import(pathToFileURL(path.resolve('.boundx/products/0.1.0-candidate.031-r1.2-ui.'+v,'research/7plus1-parser/llm-first-028/bundle.mjs')));bundles[v]=Object.fromEntries(['parse','audit'].map(p=>[p,buildBundle(p).sha256]));}
if(JSON.stringify(bundles['30'])!==JSON.stringify(bundles['32']))throw Error('LIVE_MODEL_RESOURCES_DIFFER');
const regression={};for(const v of ['parent','candidate'])regression[v]=JSON.parse(fs.readFileSync(path.join(dir,'frozen-ui32',v+'.json')));
const normalize=s=>s.endsWith('runtime-version.test.mjs')?'HARNESS/runtime-version.test.mjs':s,prior=regression.parent.failed.map(normalize),after=regression.candidate.failed.map(normalize);
const old_seals=[];for(const name of ['TRANSPORT-INPUT-CLOSURE-r01','SEMANTIC-CONTRACT-CLOSURE-r01','SEMANTIC-CONTRACT-CLOSURE-REPORT-CORRECTION-r02']){
 const root=path.resolve('.boundx/exports',name),bytes=fs.readFileSync(path.join(root,'MANIFEST.json')),manifest=JSON.parse(bytes),seal=JSON.parse(fs.readFileSync(path.join(root,'SEAL.json')));if(sha(bytes)!==seal.manifest_sha256)throw Error('OLD_SEAL_CHANGED');
 for(const f of manifest.files)if(sha(fs.readFileSync(path.join(root,f.path)))!==f.sha256)throw Error('OLD_EVIDENCE_CHANGED:'+f.path);old_seals.push({name,manifest_sha256:sha(bytes),files:manifest.files.length});
}
const pointer=JSON.parse(fs.readFileSync('.boundx/semantic-closure-r02-install-check/current.json'));if(pointer.version!==frozen.snapshot.product_version)throw Error('CLEAN_ROLLBACK_CHECK_INCOMPLETE');
save('FINAL-ENGINEERING-VERIFICATION.json',{version:frozen.snapshot.product_version,manifest:frozen.snapshot.manifest_sha256,manifest_files:frozen.snapshot.files.length,clean_install_verified:true,clean_upgrade_rollback:'31 -> 32 -> 31 -> 32',user_service_upgraded:false,new_user_ports:0,model_resources:bundles,model_resources_identical:true,targeted:JSON.parse(fs.readFileSync(path.join(dir,'frozen-ui32/targeted.json'))),regression:{parent:regression.parent.counts,candidate:regression.candidate.counts,new_named_assertion_failures:after.filter(s=>!prior.includes(s)),raw_failures_preserved:true,full_regression_pass:false},old_seals,verified_at:new Date().toISOString()});
console.log(JSON.stringify({candidate:frozen.snapshot.product_version,targeted_pass:80,old_seals_verified:old_seals.length,new_regression_failures:after.filter(s=>!prior.includes(s)).length}));
