import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {lockProduct} from './resources.mjs';
const parent='0.1.0-candidate.031-r1.2-ui.29',suffix=process.argv[3]??'30';if(!['30','31','32'].includes(suffix))throw Error('INVALID_VERSION');const version='0.1.0-candidate.031-r1.2-ui.'+suffix;
const base=path.resolve('.boundx/products',parent),stage=path.resolve('.boundx/semantic-closure-r02-work'),target=path.resolve('.boundx/products',version),evidence=path.resolve('.boundx/exports/SEMANTIC-CONTRACT-CLOSURE-r02');
const core='research/7plus1-parser/llm-first-028/',hash=x=>createHash('sha256').update(x).digest('hex'),lock=lockProduct(base);lock.verify();
if(lock.snapshot.manifest_sha256!=='3b87d6e8e19b01a8e4e3c7b1fe81c1c6ca1ccb62121dc3f1481bb3785ee0c363')throw Error('PARENT_CHANGED');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'PRODUCT-MANIFEST.json'),'utf8'));
const allowed=new Set(['compile.mjs','validate.mjs','calculus.mjs','engine.mjs','compact-wire.mjs','contracts/schema.mjs','contracts/proposal.schema.json','contracts/audit.schema.json','contracts/wire-proposal.schema.json','contracts/wire-audit.schema.json','contracts/semantic-contract.md','contracts/compact-wire.md','skills/boundx-semantic-parse/SKILL.md','skills/boundx-semantic-audit/SKILL.md'].map(x=>core+x));
const added=[core+'property-tests.mjs'];
for(const p of ['identity.mjs','revision.mjs'])allowed.add(core+p);
for(const p of ['bundle.mjs','service.mjs'])allowed.add(core+p);
allowed.add(core+'contracts/wire-revision.schema.json');
for(const p of ['process-view.js','calculation-view.js'])allowed.add('research/7plus1-parser/v0.3-p2.1-generalization/web/'+p);
if(process.argv[2]==='prepare'){
 if(fs.existsSync(stage)||fs.existsSync(evidence))throw Error('FIRST_RESULTS_EXIST');fs.mkdirSync(evidence,{recursive:true});
 for(const f of manifest.files){const p=path.join(stage,f.path);fs.mkdirSync(path.dirname(p),{recursive:true});fs.copyFileSync(path.join(base,f.path),p,fs.constants.COPYFILE_EXCL);}
 fs.cpSync(path.join(base,'node_modules'),path.join(stage,'node_modules'),{recursive:true,force:false,errorOnExist:true});
 fs.copyFileSync(path.join(base,'PRODUCT-MANIFEST.json'),path.join(evidence,'BASELINE-PRODUCT-MANIFEST.json'),fs.constants.COPYFILE_EXCL);
 fs.copyFileSync('docs/tasks/7plus1/ADDENDUM-SEMANTIC-CONTRACT-CLOSURE-R02-20261011.md',path.join(evidence,'ADMIN-AUTHORIZATION.md'),fs.constants.COPYFILE_EXCL);
 console.log(JSON.stringify({stage,evidence,parent,version}));
}else if(process.argv[2]==='freeze'){
 if(fs.existsSync(target))throw Error('IMMUTABLE_VERSION_EXISTS');
 const changed=manifest.files.filter(f=>hash(fs.readFileSync(path.join(stage,f.path)))!==f.sha256);
 if(changed.some(f=>!allowed.has(f.path)))throw Error('UNAUTHORIZED_FILE_CHANGE');
 const files=[...changed.map(f=>({path:f.path,before_sha256:f.sha256})),...added.map(p=>({path:p,before_sha256:null}))].map(f=>({...f,sha256:hash(fs.readFileSync(path.join(stage,f.path))),base64:fs.readFileSync(path.join(stage,f.path)).toString('base64')}));
 fs.writeFileSync('product/short-compiler/semantic-closure-ui'+suffix+'-overlay.json',JSON.stringify({parent_manifest:lock.snapshot.manifest_sha256,parent,version,files},null,2)+'\n',{flag:'wx'});
 for(const p of [...manifest.files.map(x=>x.path),...added]){const dest=path.join(target,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(stage,p),dest,fs.constants.COPYFILE_EXCL);}
 for(const p of ['package.json','package-lock.json']){const loc=path.join(target,p),j=JSON.parse(fs.readFileSync(loc,'utf8'));j.version=version;if(j.packages?.[''])j.packages[''].version=version;fs.writeFileSync(loc,JSON.stringify(j,null,2)+'\n');}
 const next={...manifest,version,compiler_revision:'031-r1-c7',semantic_contract_revision:'031-r1.3-additive',parent_version:parent,parent_manifest:lock.snapshot.manifest_sha256,created_at:new Date().toISOString(),change_scope:'Typed property tests and explicitly bound output behavior; no raw source semantic inference',product_acceptance:'PARTIAL / SEMANTIC_REPAIR_CANDIDATE_NOT_ADMIN_ACCEPTED',files:[...manifest.files.map(x=>x.path),...added].map(p=>({path:p,sha256:hash(fs.readFileSync(path.join(target,p)))}))};
 fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(next,null,2)+'\n',{flag:'wx'});fs.cpSync(path.join(base,'node_modules'),path.join(target,'node_modules'),{recursive:true,force:false,errorOnExist:true});lockProduct(target).verify();lock.verify();console.log(JSON.stringify({target,manifest:hash(fs.readFileSync(path.join(target,'PRODUCT-MANIFEST.json'))),version}));
}else throw Error('Usage: prepare|freeze');
