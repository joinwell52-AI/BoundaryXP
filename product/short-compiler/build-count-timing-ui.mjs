// Presentation only. Copy the complete immutable installation; change no semantic resources.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {lockProduct} from './resources.mjs';
const home=path.resolve('.boundx/short-compiler-031-r1'),current=JSON.parse(fs.readFileSync(path.join(home,'current.json'),'utf8'));
if(current.version!=='0.1.0-candidate.031-r1.2-ui.7')throw Error('CURRENT_INSTALLATION_CHANGED');
const base=path.join(home,'versions',current.version),old=lockProduct(base);old.verify();
const version='0.1.0-candidate.031-r1.2-ui.8',target=path.join(home,'versions',version);
if(fs.existsSync(target))throw Error('IMMUTABLE_VERSION_ALREADY_EXISTS');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'PRODUCT-MANIFEST.json'),'utf8'));
const changed=['index.html','native-app.js','process-view.js'].map(n=>'research/7plus1-parser/v0.3-p2.1-generalization/web/'+n);
for(const x of manifest.files){const dest=path.join(target,x.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(base,x.path),dest,fs.constants.COPYFILE_EXCL);}
for(const rel of changed)fs.copyFileSync(path.resolve(rel),path.join(target,rel));
for(const rel of ['package.json','package-lock.json']){const file=path.join(target,rel),data=JSON.parse(fs.readFileSync(file,'utf8'));data.version=version;if(data.packages?.[''])data.packages[''].version=version;fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');}
const sha=b=>createHash('sha256').update(b).digest('hex');
const next={...manifest,version,created_at:new Date().toISOString(),parent_version:current.version,parent_manifest:old.snapshot.manifest_sha256,presentation_only:true,change_scope:'Readable Unicode count and completed run timing; semantic resources, model configuration and original outputs unchanged',files:manifest.files.map(x=>({path:x.path,sha256:sha(fs.readFileSync(path.join(target,x.path)))}))};
fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(next,null,2)+'\n',{flag:'wx'});
fs.cpSync(path.join(base,'node_modules'),path.join(target,'node_modules'),{recursive:true});
old.verify();const lock=lockProduct(target);lock.verify();
console.log(JSON.stringify({version,manifest:lock.snapshot.manifest_sha256,changed:[...changed,'package.json','package-lock.json'],semantic_files_identical:manifest.files.filter(x=>!changed.includes(x.path)&&!['package.json','package-lock.json'].includes(x.path)).every(x=>next.files.find(y=>y.path===x.path).sha256===x.sha256),model_calls:0,pointer_changed:false},null,2));
