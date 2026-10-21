import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {lockProduct} from './resources.mjs';
const parent='0.1.0-candidate.031-r1.2-ui.39',version='0.1.0-candidate.031-r1.2-ui.40';
const base=path.resolve('.boundx/products',parent),work=path.resolve('.boundx/local-condition-repair-r02/work'),target=path.resolve('.boundx/products',version),report=path.resolve('docs/reports/7plus1/LOCAL-CONDITION-REPAIR-r02');
const hash=b=>createHash('sha256').update(b).digest('hex'),lock=lockProduct(base);lock.verify();
if(fs.existsSync(target))throw Error('IMMUTABLE_VERSION_EXISTS');
const m=JSON.parse(fs.readFileSync(path.join(base,'PRODUCT-MANIFEST.json'))),added='research/7plus1-parser/llm-first-028/observation-request.mjs';
const changed=m.files.filter(f=>hash(fs.readFileSync(path.join(work,f.path)))!==f.sha256);
const allowed=new Set(['research/7plus1-parser/llm-first-028/service.mjs','research/7plus1-parser/llm-first-028/engine.mjs','research/7plus1-parser/llm-first-028/contracts/semantic-contract.md','research/7plus1-parser/llm-first-028/skills/boundx-semantic-parse/SKILL.md','research/7plus1-parser/llm-first-028/skills/boundx-semantic-audit/SKILL.md','research/7plus1-parser/v0.3-p2.1-generalization/web/calculation-view.js','research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js']);
if(changed.some(f=>!allowed.has(f.path))||changed.length!==allowed.size)throw Error('UNEXPECTED_CHANGE');
const files=[...m.files,{path:added}];for(const f of files){const p=path.join(target,f.path);fs.mkdirSync(path.dirname(p),{recursive:true});fs.copyFileSync(path.join(work,f.path),p,fs.constants.COPYFILE_EXCL);}
for(const name of ['package.json','package-lock.json']){const p=path.join(target,name),j=JSON.parse(fs.readFileSync(p));j.version=version;if(j.packages?.[''])j.packages[''].version=version;fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');}
const next={...m,version,compiler_revision:'031-r1-c14',created_at:new Date().toISOString(),parent_version:parent,parent_manifest:lock.snapshot.manifest_sha256,
 product_acceptance:'PARTIAL / OBSERVATION_UI_AND_SKILL_REPAIR_NOT_LIVE_VALIDATED',model_resources_changed:true,real_model_validation:'NOT_RUN_BUDGET_EXHAUSTED',
 change_scope:'Authenticated append-only observed-IR recalculation and existing UI; independent local condition direction guidance. No source-scanning semantic repair.',
 files:files.map(f=>({path:f.path,sha256:hash(fs.readFileSync(path.join(target,f.path)))}))};
fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(next,null,2)+'\n',{flag:'wx'});fs.cpSync(path.join(base,'node_modules'),path.join(target,'node_modules'),{recursive:true});
const final=lockProduct(target);final.verify();lock.verify();
const overlay={parent,parent_manifest:lock.snapshot.manifest_sha256,version,files:[...changed,{path:added}].map(f=>({path:f.path,before_sha256:f.sha256??null,sha256:hash(fs.readFileSync(path.join(work,f.path))),base64:fs.readFileSync(path.join(work,f.path)).toString('base64')}))};
fs.writeFileSync('product/short-compiler/observation-ui40-overlay.json',JSON.stringify(overlay,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(report,'FREEZE.json'),JSON.stringify({version,manifest:final.snapshot.manifest_sha256,compiler:'031-r1-c14',changed:overlay.files.map(({base64,...r})=>r),model_resources_changed:true,live_validation:false},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({version,manifest:final.snapshot.manifest_sha256,changes:overlay.files.length}));
