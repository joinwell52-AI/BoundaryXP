// Rebuild the installed ui131 candidate byte-for-byte from repository sources.
// No prior installation, account state, model calls or listening socket is used.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
export const candidateVersion='0.1.0-candidate.031-r1.2-ui.131';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),recipe=path.join(root,'product/short-compiler/ui131-package'),hash=b=>createHash('sha256').update(b).digest('hex');
export function buildCandidate(output=path.join(root,'.boundx/products',candidateVersion)){
 const target=path.resolve(output);if(fs.existsSync(target))throw Error('IMMUTABLE_CANDIDATE_EXISTS');
 const manifestBytes=fs.readFileSync(path.join(recipe,'PRODUCT-MANIFEST.json')),m=JSON.parse(manifestBytes);
 if(m.version!==candidateVersion)throw Error('CANDIDATE_VERSION_MISMATCH');
 const special=new Set(['package.json','package-lock.json','product/short-compiler/launch-installed.mjs']);
 const entries=m.files.map(f=>{
  if(path.isAbsolute(f.path)||f.path.split(/[\\/]/).includes('..'))throw Error('INVALID_SOURCE_PATH');
  const source=special.has(f.path)?path.join(recipe,path.basename(f.path)):path.join(root,f.path),bytes=fs.readFileSync(source);
  if(hash(bytes)!==f.sha256)throw Error('CANDIDATE_SOURCE_DIGEST_MISMATCH:'+f.path);
  return {...f,bytes};
 });
 fs.mkdirSync(target,{recursive:true});
 for(const f of entries){const dest=path.join(target,f.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,f.bytes,{flag:'wx'});}
 fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),manifestBytes,{flag:'wx'});
 return {version:candidateVersion,target,files:entries.length,integrity:'PASS',manifest_sha256:hash(manifestBytes),real_model_calls:0,identity:'EXACT_INSTALLED_UI131'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(buildCandidate(process.argv[2])));
