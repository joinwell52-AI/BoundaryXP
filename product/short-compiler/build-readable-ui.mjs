// Build a complete presentation-only candidate from the active frozen installation.
// No model call, account change, semantic resource change, or pointer activation.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {lockProduct} from './resources.mjs';
const repo=process.cwd(),home=path.join(repo,'.boundx/short-compiler-031-r1');
const current=JSON.parse(fs.readFileSync(path.join(home,'current.json'),'utf8'));
if(!['0.1.0-candidate.031-r1.2','0.1.0-candidate.031-r1.2-ui.1','0.1.0-candidate.031-r1.2-ui.2'].includes(current.version))throw Error('EXPECTED_ORIGINAL_OR_PRESENTATION_INSTALLED_VERSION');
const base=path.join(home,'versions','0.1.0-candidate.031-r1.2'),locked=lockProduct(base);locked.verify();
const version='0.1.0-candidate.031-r1.2-ui.4',target=path.join(home,'versions',version);
if(fs.existsSync(target))throw Error('CANDIDATE_ALREADY_EXISTS');
const web='research/7plus1-parser/v0.3-p2.1-generalization/web/',service='research/7plus1-parser/llm-first-028/service.mjs';
for(const p of [web+'native-app.js',web+'process-view.js'])execFileSync(process.execPath,['--check',path.join(repo,p)],{stdio:'pipe'});
const hash=b=>createHash('sha256').update(b).digest('hex');
const baseline=JSON.parse(fs.readFileSync(path.join(base,'PRODUCT-MANIFEST.json'),'utf8'));
for(const x of baseline.files){const dst=path.join(target,x.path);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(path.join(base,x.path),dst,fs.constants.COPYFILE_EXCL);}
for(const filename of ['index.html','native-app.js','style.css','process-view.js'])fs.copyFileSync(path.join(repo,web,filename),path.join(target,web,filename));
const before=fs.readFileSync(path.join(base,service),'utf8');
const after=before.replace("['/','/app.js','/style.css'].includes(route)","['/','/app.js','/process-view.js','/style.css'].includes(route)").replace("route==='/app.js'?'native-app.js':'style.css'","route==='/app.js'?'native-app.js':route==='/process-view.js'?'process-view.js':'style.css'");
if(after===before)throw Error('STATIC_ROUTE_PATCH_NOT_APPLIED');
fs.writeFileSync(path.join(target,service),after);
// Expose existing product status metadata without changing compile or model resources.
const metadataPath='product/short-compiler/resources.mjs',metadataBefore=fs.readFileSync(path.join(base,metadataPath),'utf8');
const metadataAfter=metadataBefore.replace('files:manifest.files};','files:manifest.files,product_acceptance:manifest.product_acceptance,support_profile:manifest.support_profile,known_limitations:manifest.known_limitations,public_release:manifest.public_release};');
if(metadataAfter===metadataBefore)throw Error('METADATA_PRESENTATION_PATCH_NOT_APPLIED');
fs.writeFileSync(path.join(target,metadataPath),metadataAfter);
for(const name of ['package.json','package-lock.json']){
 const p=path.join(target,name),x=JSON.parse(fs.readFileSync(p,'utf8'));x.version=version;if(x.packages?.[''])x.packages[''].version=version;
 fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
}
const filePaths=[...baseline.files.map(x=>x.path),web+'process-view.js'];
const manifest={...baseline,version,created_at:new Date().toISOString(),source_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
 presentation_revision:'readable-process.4',presentation_only:true,semantic_base:baseline.version,semantic_base_manifest_sha256:locked.snapshot.manifest_sha256,
 product_acceptance:'PARTIAL / REVIEW_REQUIRED',public_release:false,support_profile:'单一ADMIN短任务，非空且≤300码点',known_limitations:['产品语义验收尚未全部完成','模型审阅和技术接受不等于人工验收或业务执行授权'],
 files:filePaths.map(p=>({path:p,sha256:hash(fs.readFileSync(path.join(target,p)))}))};
fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
const changed=baseline.files.filter(x=>hash(fs.readFileSync(path.join(target,x.path)))!==x.sha256).map(x=>x.path);
const allowed=new Set([web+'index.html',web+'native-app.js',web+'style.css',service,metadataPath,'package.json','package-lock.json']);
if(changed.some(p=>!allowed.has(p)))throw Error('NON_PRESENTATION_RESOURCE_CHANGED');
// Dependencies are exactly the existing complete installed dependency tree. No download.
fs.cpSync(path.join(base,'node_modules'),path.join(target,'node_modules'),{recursive:true});
locked.verify();lockProduct(target).verify();
const output={version,root:target,changed,added:[web+'process-view.js'],semantic_base:baseline.version,semantic_files_unchanged:true,model_calls:0,pointer_changed:false};
fs.writeFileSync(path.join(target,'PRESENTATION-BUILD.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(output,null,2));
