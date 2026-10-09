import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const hash=b=>createHash('sha256').update(b).digest('hex');
export function lockProduct(root){
 root=fs.realpathSync(root);const manifestPath=path.join(root,'PRODUCT-MANIFEST.json'),bytes=fs.readFileSync(manifestPath),manifest=JSON.parse(bytes);
 const canonical=manifest.files.map(x=>[x.path,x.sha256]).sort((a,b)=>a[0].localeCompare(b[0]));
 const snapshot={product_version:manifest.version,compiler_revision:manifest.compiler_revision,contract:manifest.contract,manifest_sha256:hash(bytes),resources_sha256:hash(JSON.stringify(canonical)),files:manifest.files,product_acceptance:manifest.product_acceptance??'PARTIAL / REVIEW_REQUIRED',support_profile:manifest.support_profile??'单一ADMIN短任务，非空且≤300码点；语义可能需澄清',known_limitations:manifest.known_limitations??['候选版本，技术接受及模型审阅不等于语义准确或业务授权'],public_release:manifest.public_release??false};
 const verify=()=>{
  if(hash(fs.readFileSync(manifestPath))!==snapshot.manifest_sha256)throw Error('INSTALLED_RESOURCE_CHANGED: manifest');
  for(const x of manifest.files){const p=path.resolve(root,x.path);if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.realpathSync(p).startsWith(root+path.sep)||hash(fs.readFileSync(p))!==x.sha256)throw Error('INSTALLED_RESOURCE_CHANGED:'+x.path);}
  return snapshot;
 };verify();return{root,snapshot,verify};
}
