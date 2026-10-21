// Observability-only update of the complete installed product; preserve all semantic resources.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {lockProduct} from './resources.mjs';
const home=path.resolve('.boundx/short-compiler-031-r1'),current=JSON.parse(fs.readFileSync(path.join(home,'current.json'),'utf8'));
if(current.version!=='0.1.0-candidate.031-r1.2-ui.10')throw Error('CURRENT_INSTALLATION_CHANGED');
const base=path.join(home,'versions',current.version),old=lockProduct(base);old.verify();
const version='0.1.0-candidate.031-r1.2-ui.12',target=path.join(home,'versions',version);
if(fs.existsSync(target))throw Error('IMMUTABLE_VERSION_ALREADY_EXISTS');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'PRODUCT-MANIFEST.json'),'utf8')),core='research/7plus1-parser/llm-first-028/',web='research/7plus1-parser/v0.3-p2.1-generalization/web/';
const changed=[core+'observability.mjs',core+'model-activity.mjs',core+'service.mjs',web+'process-view.js',web+'style.css'];
const once=(s,a,b)=>{if(!s.includes(a)||s.indexOf(a)!==s.lastIndexOf(a))throw Error('AMBIGUOUS_SERVICE_PATCH');return s.replace(a,b);};
let service=fs.readFileSync(path.join(base,core+'service.mjs'),'utf8');
if(!service.includes("import {sessionActivity} from './model-activity.mjs';")){
 service=once(service,"import {modelCatalog,requestSettings,publicProgress,partialArtifacts} from './observability.mjs';","import {modelCatalog,requestSettings,publicProgress,partialArtifacts} from './observability.mjs';\nimport {sessionActivity} from './model-activity.mjs';");
 service=once(service,'trace\\.md|trace\\.html)','trace\\.md|trace\\.html|activity\\.json)');
 service=once(service,'progress:trace?null:partialArtifacts(folder(record.run_id),record)});','progress:trace?null:partialArtifacts(folder(record.run_id),record),model_activity:sessionActivity(folder(record.run_id),record)});');
 service=once(service,"    if(!trace)return send(409,{error:'RESULT_NOT_READY'});","    if(match[2]==='activity.json')return download(JSON.stringify({run_id:record.run_id,run_product_version:record.product_snapshot?.product_version??null,requested_model:record.requested_model,actual_model:record.actual_model??null,...sessionActivity(folder(record.run_id),record)},null,2)+'\\n','application/json',record.run_id+'-sessions.json');\n    if(!trace)return send(409,{error:'RESULT_NOT_READY'});");
}
for(const x of manifest.files){const dest=path.join(target,x.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(base,x.path),dest,fs.constants.COPYFILE_EXCL);}
for(const rel of changed){const dest=path.join(target,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,rel===core+'service.mjs'?service:fs.readFileSync(path.resolve(rel)));}
for(const rel of ['package.json','package-lock.json']){const f=path.join(target,rel),d=JSON.parse(fs.readFileSync(f,'utf8'));d.version=version;if(d.packages?.[''])d.packages[''].version=version;fs.writeFileSync(f,JSON.stringify(d,null,2)+'\n');}
const sha=b=>createHash('sha256').update(b).digest('hex'),paths=[...new Set([...manifest.files.map(x=>x.path),core+'model-activity.mjs'])];
const next={...manifest,version,created_at:new Date().toISOString(),parent_version:current.version,parent_manifest:old.snapshot.manifest_sha256,change_scope:'Runtime versus historical version labels, public Codex summaries/events, per-round timing and saved revision reasons; read-only history and separate export; no semantic or model changes',files:paths.map(rel=>({path:rel,sha256:sha(fs.readFileSync(path.join(target,rel)))}))};
fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(next,null,2)+'\n',{flag:'wx'});fs.cpSync(path.join(base,'node_modules'),path.join(target,'node_modules'),{recursive:true});old.verify();const lock=lockProduct(target);lock.verify();
const untouched=manifest.files.filter(x=>![...changed,'package.json','package-lock.json'].includes(x.path));if(!untouched.every(x=>next.files.find(y=>y.path===x.path).sha256===x.sha256))throw Error('SEMANTIC_RESOURCE_CHANGED');
console.log(JSON.stringify({version,manifest:lock.snapshot.manifest_sha256,changed,unchanged_files:untouched.length,semantic_resources_unchanged:true,model_calls:0,pointer_changed:false},null,2));
