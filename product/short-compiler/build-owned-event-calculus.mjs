import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {lockProduct} from './resources.mjs';
const parent='0.1.0-candidate.031-r1.2-ui.36',version='0.1.0-candidate.031-r1.2-ui.38';
const base=path.resolve('.boundx/short-compiler-031-r1/versions',parent);
const work=path.resolve('.boundx/owned-event-calculus-r01/work'),target=path.resolve('.boundx/products',version);
const report=path.resolve('docs/reports/7plus1/MANUAL-FULL-FLOW-CALCULUS-r01');
const hash=b=>createHash('sha256').update(b).digest('hex');
const lock=lockProduct(base);lock.verify();
if(lock.snapshot.manifest_sha256!=='5a9065fbfdf651aedd89b4851ca27f56dc1f024e5b3828a7823f98b459a33658')throw Error('PARENT_CHANGED');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'PRODUCT-MANIFEST.json')));
const corePath='src/bxp/target-set-solver.mjs',coreCommit='2d244cf72ea2b23a00581f44894532c7dc6d1ddf';
const core=spawnSync('git',['show',coreCommit+':'+corePath],{windowsHide:true});
if(core.status!==0)throw Error('EXISTING_CORE_NOT_READABLE');
const files=[...manifest.files,{path:corePath,sha256:hash(core.stdout)}];
if(process.argv[2]==='prepare'){
 if(fs.existsSync(work)||fs.existsSync(report))throw Error('FIRST_RESULTS_ALREADY_EXIST');
 fs.mkdirSync(report,{recursive:true});
 for(const f of manifest.files){const dest=path.join(work,f.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(base,f.path),dest,fs.constants.COPYFILE_EXCL);}
 fs.cpSync(path.join(base,'node_modules'),path.join(work,'node_modules'),{recursive:true,errorOnExist:true,force:false});
 fs.copyFileSync(path.join(base,'PRODUCT-MANIFEST.json'),path.join(report,'BASELINE-MANIFEST.json'),fs.constants.COPYFILE_EXCL);
 console.log(JSON.stringify({work,parent,version,report}));
}else if(process.argv[2]==='stage-core'){
 const dest=path.join(work,corePath);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,core.stdout,{flag:'wx'});
 fs.writeFileSync(path.join(report,'EXISTING-CORE-PROVENANCE.json'),JSON.stringify({path:corePath,commit:coreCommit,sha256:hash(core.stdout),copied_without_changes:true,reason:'Package the already-existing unique Core dependency required by finite range membership queries; do not implement another solver'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({existing_core:corePath,sha256:hash(core.stdout)}));
}else if(process.argv[2]==='freeze'){
 if(fs.existsSync(target))throw Error('IMMUTABLE_VERSION_EXISTS');
 const changed=manifest.files.filter(f=>hash(fs.readFileSync(path.join(work,f.path)))!==f.sha256);
 const allowed=new Set(['research/7plus1-parser/llm-first-028/calculus.mjs','research/7plus1-parser/llm-first-028/engine.mjs']);
 if(changed.some(f=>!allowed.has(f.path)))throw Error('UNEXPECTED_RUNTIME_CHANGE');
 const overlay={parent,parent_manifest:lock.snapshot.manifest_sha256,version,files:changed.map(f=>({path:f.path,before_sha256:f.sha256,sha256:hash(fs.readFileSync(path.join(work,f.path))),base64:fs.readFileSync(path.join(work,f.path)).toString('base64')}))};
 fs.writeFileSync('product/short-compiler/owned-event-calculus-ui38-overlay.json',JSON.stringify(overlay,null,2)+'\n',{flag:'wx'});
 if(hash(fs.readFileSync(path.join(work,corePath)))!==hash(core.stdout))throw Error('EXISTING_CORE_MODIFIED');
 for(const f of files){const dest=path.join(target,f.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(work,f.path),dest,fs.constants.COPYFILE_EXCL);}
 for(const name of ['package.json','package-lock.json']){const f=path.join(target,name),j=JSON.parse(fs.readFileSync(f));j.version=version;if(j.packages?.[''])j.packages[''].version=version;fs.writeFileSync(f,JSON.stringify(j,null,2)+'\n');}
 const next={...manifest,version,compiler_revision:'031-r1-c12',parent_version:parent,parent_manifest:lock.snapshot.manifest_sha256,created_at:new Date().toISOString(),presentation_only:false,
 semantic_base:parent,semantic_base_manifest_sha256:lock.snapshot.manifest_sha256,
 known_limitations:[...manifest.known_limitations.slice(0,-1),'计算支持来源闭合、无条件且必须执行的当前任务容器内的显式局部义务和时序；带条件或可选父层激活、超出求解容量的结构仍保持缺口；缺少运行观测保持UNKNOWN；不是完整BXP符合性或业务授权'],
 calculation:{...manifest.calculation,adapter:'native-ir-to-existing-core-r02',core_files:[...manifest.calculation.core_files,{path:corePath,sha256:hash(core.stdout)}]},
 change_scope:'Typed accepted event ownership validation and existing explicit temporal/condition calculus; no source scanning, model resource or projection change',
 product_acceptance:'PARTIAL / CALCULUS_REPAIR_CANDIDATE_NOT_ADMIN_ACCEPTED',files:files.map(f=>({path:f.path,sha256:hash(fs.readFileSync(path.join(target,f.path)))}))};
 fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(next,null,2)+'\n',{flag:'wx'});
 fs.cpSync(path.join(base,'node_modules'),path.join(target,'node_modules'),{recursive:true,errorOnExist:true,force:false});
 const verified=lockProduct(target);verified.verify();lock.verify();console.log(JSON.stringify({target,version,manifest:verified.snapshot.manifest_sha256,changed:changed.map(f=>f.path)}));
}else throw Error('Use prepare|stage-core|freeze');
