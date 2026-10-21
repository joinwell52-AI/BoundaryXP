import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const report=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(report,'../../../..');
const rel=p=>path.relative(repo,p).replaceAll('\\','/');
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(name,v)=>fs.writeFileSync(path.join(report,name),JSON.stringify(v,null,2)+'\n');
if(process.argv.includes('--verify')){
 const manifest=read(path.join(report,'MANIFEST.json')),seal=read(path.join(report,'SEAL.json'));
 for(const x of manifest.files)assert.equal(hash(fs.readFileSync(path.join(repo,x.path))),x.sha256,x.path);
 assert.equal(hash(fs.readFileSync(path.join(report,'MANIFEST.json'))),seal.manifest_sha256);
 assert.equal(hash(fs.readFileSync(path.join(report,'SHA256SUMS'))),seal.sha256sums_sha256);
 console.log('SEAL VERIFIED '+manifest.files.length+' payload files');
}else{
 const selected=new Set();const add=p=>{if(fs.statSync(p).isFile())selected.add(p);};const tree=p=>walk(p).forEach(add);
 tree(path.join(repo,'research/7plus1-parser/llm-first-028'));
 for(const p of ['package.json','docs/tasks/7plus1/CURRENT-TASK.md','docs/tasks/7plus1/7P-SHORT-COMPILER-DELIVERY-029-LONG.md','docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md','research/7plus1-parser/v0.3-p2.1-generalization/server.mjs','research/7plus1-parser/v0.3-p2.1-generalization/web/index.html','research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js','research/7plus1-parser/v0.3-p2.1-generalization/web/style.css'])add(path.join(repo,p));
 const seals=new Set(['MANIFEST.json','SHA256SUMS','SEAL.json']);
 for(const e of fs.readdirSync(report,{withFileTypes:true}))if(e.isFile()&&!seals.has(e.name))add(path.join(report,e.name));
 tree(path.join(report,'inputs'));tree(path.join(report,'delivery-final'));
 for(const group of ['first','final','repeat-1','repeat-2','browser','actual-cancel'])for(const p of walk(path.join(report,group))){
  const local=path.relative(path.join(report,group),p).replaceAll('\\','/'),name=path.basename(p);
  // Top-level full trace retains the complete first-result compilation; do not duplicate it per revision.
  if(/revision-\d+\/(?:trace\.json|7plus1\.json|7plus1\.zh\.md|technical-validation\.json|boundary-ir\.json)$/.test(local))continue;
  if(name==='service-result.json')continue;
  if(name==='environment.json'&&!(group==='browser'&&local==='S00/run/environment.json'))continue;
  add(p);
 }
 for(const group of ['consumer-only','final-compiled','qualified','s-regression']){const f=path.join(report,group,'RESULTS.json');if(fs.existsSync(f))add(f);}
 for(const p of walk(path.join(report,'engineering-delivery')))if(!p.includes('cli-other-cwd'+path.sep))add(p);
 for(const name of ['RESULTS.json','cli.txt'])add(path.join(report,'shared-consumer',name));
 const snapshot=read(path.join(repo,'.boundx/experiments/029/pre-sync/snapshot.json'));
 const protectedFiles=new Set(snapshot.tracked.map(x=>x.file));
 const allowedExistingUI=new Set(['research/7plus1-parser/v0.3-p2.1-generalization/server.mjs','research/7plus1-parser/v0.3-p2.1-generalization/web/index.html','research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js','research/7plus1-parser/v0.3-p2.1-generalization/web/style.css']);
 const files=[...selected].map(p=>{assert(!protectedFiles.has(rel(p)),'protected local change in submission');assert(allowedExistingUI.has(rel(p))||!snapshot.untracked.some(u=>u.endsWith('/')?rel(p).startsWith(u):rel(p)===u),'unrelated original untracked file in submission');const b=fs.readFileSync(p);return {path:rel(p),bytes:b.length,sha256:hash(b)};}).sort((a,b)=>a.path.localeCompare(b.path));
 assert(files.every(x=>x.bytes<20*1024*1024));
 const suspicious=files.filter(x=>/\.(?:json|txt|md|mjs|js|html)$/.test(x.path)&&/(?:sk-(?:proj-)?[A-Za-z0-9_-]{32,}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(fs.readFileSync(path.join(repo,x.path),'utf8'))).map(x=>x.path);
 assert.deepEqual(suspicious,[],'credential-like payload found');
 const manifest={format:'boundx-029-delivery-manifest/v1',task:'7P-SHORT-COMPILER-DELIVERY-029-LONG',branch:'review/7plus1-parser',compiler_revision:'029-c4',contract:'028-r02.3',method:'v0.4/r02',files,package_bytes:files.reduce((n,x)=>n+x.bytes,0),excluded_local_only:['.boundx/ (run database, notes, backups, caches)','duplicate intermediate replay trees (final-compiled, qualified, consumer-only, s-regression); aggregate results retained','duplicate revision-level compiled output and service-result snapshots; top-level first-result/full trace retained','repeated CLI probe environment.json; one actual probe retained','unrelated original tracked/untracked changes; no deletion or rollback'],secret_scan:{credential_like_matches:0,scope:'selected text payload; no credentials read/copied'},self_hash_rule:'MANIFEST, SHA256SUMS and SEAL excluded from payload; SEAL hashes the first two. Git commit identifies SEAL.'};
 write('MANIFEST.json',manifest);
 fs.writeFileSync(path.join(report,'SHA256SUMS'),files.map(x=>x.sha256+'  '+x.path).join('\n')+'\n');
 write('SEAL.json',{format:'boundx-029-seal/v1',sealed_at:new Date().toISOString(),status:'WAITING_ADMIN_REVIEW',SHORT_COMPILER_029:'PASS',payload_files:files.length,payload_bytes:manifest.package_bytes,manifest_sha256:hash(fs.readFileSync(path.join(report,'MANIFEST.json'))),sha256sums_sha256:hash(fs.readFileSync(path.join(report,'SHA256SUMS'))),business_execution_enabled:false,merge_release_tag:false});
 console.log(JSON.stringify({files:files.length,MiB:manifest.package_bytes/1024/1024,max_bytes:Math.max(...files.map(x=>x.bytes)),credential_like_matches:0}));
 if(process.argv.includes('--stage')){
  const paths=[...files.map(x=>x.path),...['MANIFEST.json','SHA256SUMS','SEAL.json'].map(x=>rel(path.join(report,x)))];
  for(let i=0;i<paths.length;i+=30){const r=spawnSync('git',['add','--',...paths.slice(i,i+30)],{cwd:repo,encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr);}
  console.log('Explicit delivery-only staging complete');
 }
}
