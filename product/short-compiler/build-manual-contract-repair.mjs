import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {lockProduct} from './resources.mjs';
const final=process.argv[2]==='freeze-r02';
const number=final?(process.argv[3]??'34'):'33';
if(!['33','34','35','36'].includes(number))throw Error('INVALID_REPAIR_VERSION');
const parent='0.1.0-candidate.031-r1.2-ui.32',version='0.1.0-candidate.031-r1.2-ui.'+number;
const base=path.resolve('.boundx/short-compiler-031-r1/versions',parent);
const work=path.resolve('.boundx/manual-contract-repair-r01/work'),target=path.resolve('.boundx/products',version);
const report=path.resolve('docs/reports/7plus1/MANUAL-CONTRACT-REPAIR-r01');
const hash=x=>createHash('sha256').update(x).digest('hex');
const old=lockProduct(base);old.verify();
if(old.snapshot.manifest_sha256!=='03c2e4cd599aea6f0ba3cbba757b09f73b3b2877e8e8389e36ca31194d871ef4')throw Error('BASELINE_CHANGED');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'PRODUCT-MANIFEST.json')));
const core='research/7plus1-parser/llm-first-028/';
const allowed=new Set(['validate.mjs','property-tests.mjs','compile.mjs','calculus.mjs','bundle.mjs','engine.mjs','revision.mjs','contracts/schema.mjs','contracts/proposal.schema.json','contracts/audit.schema.json','contracts/wire-proposal.schema.json','contracts/wire-audit.schema.json','contracts/wire-revision.schema.json','contracts/semantic-contract.md','contracts/compact-wire.md','skills/boundx-semantic-parse/SKILL.md','skills/boundx-semantic-audit/SKILL.md'].map(x=>core+x));
for(const x of ['process-view.js','calculation-view.js'])allowed.add('research/7plus1-parser/v0.3-p2.1-generalization/web/'+x);
allowed.add(core+'service.mjs');
if(process.argv[2]==='prepare'){
 if(fs.existsSync(work)||fs.existsSync(report))throw Error('FIRST_RESULTS_EXIST');
 fs.mkdirSync(report,{recursive:true});
 for(const f of manifest.files){const dest=path.join(work,f.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(base,f.path),dest,fs.constants.COPYFILE_EXCL);}
 fs.cpSync(path.join(base,'node_modules'),path.join(work,'node_modules'),{recursive:true,force:false,errorOnExist:true});
 fs.copyFileSync(path.join(base,'PRODUCT-MANIFEST.json'),path.join(report,'BASELINE-MANIFEST.json'),fs.constants.COPYFILE_EXCL);
 console.log(JSON.stringify({work,parent,version,report}));
}else if(process.argv[2]==='freeze'||final){
 if(fs.existsSync(target))throw Error('IMMUTABLE_VERSION_EXISTS');
 const changed=manifest.files.filter(f=>hash(fs.readFileSync(path.join(work,f.path)))!==f.sha256);
 if(changed.some(f=>!allowed.has(f.path)))throw Error('UNAUTHORIZED_FILE_CHANGE');
 const overlay={parent,parent_manifest:old.snapshot.manifest_sha256,version,files:changed.map(f=>({path:f.path,before_sha256:f.sha256,sha256:hash(fs.readFileSync(path.join(work,f.path))),base64:fs.readFileSync(path.join(work,f.path)).toString('base64')}))};
 fs.writeFileSync('product/short-compiler/manual-contract-repair-ui'+number+'-overlay.json',JSON.stringify(overlay,null,2)+'\n',{flag:'wx'});
 for(const f of manifest.files){const dest=path.join(target,f.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(work,f.path),dest,fs.constants.COPYFILE_EXCL);}
 for(const name of ['package.json','package-lock.json']){const dest=path.join(target,name),j=JSON.parse(fs.readFileSync(dest));j.version=version;if(j.packages?.[''])j.packages[''].version=version;fs.writeFileSync(dest,JSON.stringify(j,null,2)+'\n');}
 const next={...manifest,version,compiler_revision:number==='36'?'031-r1-c11':number==='35'?'031-r1-c10':final?'031-r1-c9':'031-r1-c8',semantic_contract_revision:'031-r1.4-additive',parent_version:parent,parent_manifest:old.snapshot.manifest_sha256,created_at:new Date().toISOString(),change_scope:'Event-self property ownership and qualitative immediacy; typed alternative feedback; no source scanning or task execution',product_acceptance:'PARTIAL / SEMANTIC_REPAIR_CANDIDATE_NOT_ADMIN_ACCEPTED',files:manifest.files.map(f=>({path:f.path,sha256:hash(fs.readFileSync(path.join(target,f.path)))}))};
 fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(next,null,2)+'\n',{flag:'wx'});
 fs.cpSync(path.join(base,'node_modules'),path.join(target,'node_modules'),{recursive:true,force:false,errorOnExist:true});
 const verified=lockProduct(target);verified.verify();old.verify();
 console.log(JSON.stringify({target,version,manifest:verified.snapshot.manifest_sha256,changed:changed.map(x=>x.path)}));
}else throw Error('Use prepare|freeze');
