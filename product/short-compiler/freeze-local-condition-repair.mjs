import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {lockProduct} from './resources.mjs';
const parent='0.1.0-candidate.031-r1.2-ui.38',version='0.1.0-candidate.031-r1.2-ui.39';
const base=path.resolve('.boundx/short-compiler-031-r1/versions',parent),work=path.resolve('.boundx/local-condition-repair-r01/work'),target=path.resolve('.boundx/products',version);
const report=path.resolve('docs/reports/7plus1/LOCAL-CONDITION-REPAIR-r01');
const hash=b=>createHash('sha256').update(b).digest('hex');const lock=lockProduct(base);lock.verify();
if(fs.existsSync(target))throw Error('IMMUTABLE_VERSION_EXISTS');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'PRODUCT-MANIFEST.json')));
const changed=manifest.files.filter(f=>hash(fs.readFileSync(path.join(work,f.path)))!==f.sha256);
const allowed=new Set(['research/7plus1-parser/llm-first-028/calculus.mjs','research/7plus1-parser/llm-first-028/engine.mjs','research/7plus1-parser/v0.3-p2.1-generalization/web/calculation-view.js']);
if(changed.some(x=>!allowed.has(x.path))||changed.length!==3)throw Error('UNEXPECTED_CHANGE');
const added='research/7plus1-parser/llm-first-028/condition-assessment.mjs';
const files=[...manifest.files,{path:added}];for(const f of files){const to=path.join(target,f.path);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(work,f.path),to,fs.constants.COPYFILE_EXCL);}
for(const name of ['package.json','package-lock.json']){const p=path.join(target,name),j=JSON.parse(fs.readFileSync(p));j.version=version;if(j.packages?.[''])j.packages[''].version=version;fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');}
const next={...manifest,version,compiler_revision:'031-r1-c13',created_at:new Date().toISOString(),parent_version:parent,parent_manifest:lock.snapshot.manifest_sha256,
 semantic_base:parent,semantic_base_manifest_sha256:lock.snapshot.manifest_sha256,
 calculation:{...manifest.calculation,adapter:'native-ir-to-existing-core-r03',observation_extension:{field:'outcomes',key:'accepted claim id',required:['target_id','kind','known=true','value:boolean'],kinds:['EVENT_EXECUTED','EVENT_STATE','TASK_COMPLETE','TASK_STOP','OUTPUT_BEHAVIOR'],meaning:'External host/test outcome observation; not a source fact, authorization or inferred execution'}},
 change_scope:'Typed local-condition outcome checking through existing Boolean Core, exact observation binding and visible results; model resources and deterministic projection unchanged',
 product_acceptance:'PARTIAL / LOCAL_CONDITION_CANDIDATE_NOT_ADMIN_ACCEPTED',
 files:files.map(f=>({path:f.path,sha256:hash(fs.readFileSync(path.join(target,f.path)))}))};
fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(next,null,2)+'\n',{flag:'wx'});fs.cpSync(path.join(base,'node_modules'),path.join(target,'node_modules'),{recursive:true,errorOnExist:true,force:false});
const final=lockProduct(target);final.verify();lock.verify();
const overlay={parent,parent_manifest:lock.snapshot.manifest_sha256,version,files:[...changed,{path:added}].map(f=>({path:f.path,before_sha256:f.sha256??null,sha256:hash(fs.readFileSync(path.join(work,f.path))),base64:fs.readFileSync(path.join(work,f.path)).toString('base64')}))};
fs.writeFileSync('product/short-compiler/local-condition-ui39-overlay.json',JSON.stringify(overlay,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(report,'FREEZE.json'),JSON.stringify({version,root:target,manifest:final.snapshot.manifest_sha256,compiler:'031-r1-c13',files:next.files,changed:overlay.files.map(x=>({path:x.path,before_sha256:x.before_sha256,sha256:x.sha256})),model_resources_changed:false},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({version,target,manifest:final.snapshot.manifest_sha256,changed:overlay.files.map(x=>x.path)}));
