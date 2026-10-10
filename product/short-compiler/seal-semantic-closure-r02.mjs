// Immutable evidence seals. A seal never changes a failed semantic verdict.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const root=path.resolve('.boundx/exports/SEMANTIC-CONTRACT-CLOSURE-r02'),report=path.resolve('docs/reports/7plus1/SEMANTIC-CONTRACT-CLOSURE-r02');
const hash=x=>createHash('sha256').update(x).digest('hex'),save=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
for(const name of ['REPORT.md','SOURCE-REVIEW.md'])fs.copyFileSync(path.join(report,name),path.join(root,name),fs.constants.COPYFILE_EXCL);
function seal(dir,extra={}){
 if(fs.existsSync(path.join(dir,'SEAL.json')))throw Error('SEALED_DIRECTORY');const files=[];
 function walk(folder){for(const x of fs.readdirSync(folder,{withFileTypes:true})){const p=path.join(folder,x.name);if(x.isDirectory())walk(p);else{const data=fs.readFileSync(p);files.push({path:path.relative(dir,p).replaceAll('\\','/'),bytes:data.length,sha256:hash(data)});}}}walk(dir);files.sort((a,b)=>a.path.localeCompare(b.path));
 const manifest={format:'boundx-evidence-manifest/v1',task:'SEMANTIC-CONTRACT-CLOSURE-r02',created_at:new Date().toISOString(),files};save(path.join(dir,'MANIFEST.json'),manifest);const sha=hash(fs.readFileSync(path.join(dir,'MANIFEST.json')));
 fs.writeFileSync(path.join(dir,'SHA256SUMS'),files.map(x=>x.sha256+'  '+x.path).join('\n')+'\n'+sha+'  MANIFEST.json\n',{flag:'wx'});
 const result={format:'boundx-evidence-seal/v1',manifest_sha256:sha,files:files.length,semantic_quality_gate:'FAIL',product_complete:false,deployed:false,status:'WAITING_ADMIN_REVIEW',...extra};save(path.join(dir,'SEAL.json'),result);
 for(const f of files)if(hash(fs.readFileSync(path.join(dir,f.path)))!==f.sha256)throw Error('SEAL_VERIFY_FAILED');return result;
}
const local=seal(root);for(const name of ['MANIFEST.json','SEAL.json'])fs.copyFileSync(path.join(root,name),path.join(report,'LOCAL-'+name),fs.constants.COPYFILE_EXCL);
const review=seal(report,{local_manifest_sha256:local.manifest_sha256});console.log(JSON.stringify({local,review}));
