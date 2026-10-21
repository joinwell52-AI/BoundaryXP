import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';
const sha=b=>createHash('sha256').update(b).digest('hex'),dirs=['docs/testing/7plus1/MANUAL-TEST-001-standard-r01','docs/reports/7plus1/MANUAL-FULL-FLOW-CALCULUS-r01','docs/reports/7plus1/MANUAL-CONTRACT-REPAIR-r01'];
const staged=spawnSync('git',['ls-files','--stage','-z'],{encoding:'utf8',windowsHide:true,maxBuffer:10*1024*1024});if(staged.status!==0)throw Error('INDEX_NOT_READABLE');
const index=new Map(staged.stdout.split('\0').filter(Boolean).map(x=>{const [meta,p]=x.split('\t');return[p,meta.split(' ')[1]];}));let files=0;const rows=[];
for(const dir of dirs){const manifest=JSON.parse(fs.readFileSync(path.join(dir,'MANIFEST.json')));const payload=[...manifest.files,{path:'MANIFEST.json'},{path:'SHA256SUMS'},{path:'SEAL.json'}];
 for(const f of payload){const p=(dir+'/'+f.path).replaceAll('\\','/'),b=fs.readFileSync(p);if(f.sha256)assert.equal(sha(b),f.sha256,p);files++;}
 if(dir.endsWith('MANUAL-CONTRACT-REPAIR-r01'))continue;
 const paths=payload.map(f=>dir+'/'+f.path),r=spawnSync('git',['hash-object','--no-filters',...paths],{encoding:'utf8',windowsHide:true,maxBuffer:1024*1024});if(r.status!==0)throw Error('STAGED_BYTES_NOT_READABLE');
 const hashes=r.stdout.trim().split('\n');assert.equal(hashes.length,paths.length);for(let i=0;i<paths.length;i++)assert.equal(index.get(paths[i]),hashes[i],paths[i]);rows.push({dir,payload_files:manifest.files.length,index_matches_exact_bytes:true});
}
assert.equal(sha(fs.readFileSync('docs/testing/7plus1/MANUAL-TEST-001.txt')),'ec5fbb0e8841b391bec8f4ee8586ec6656d7d0b6690eb58670c2eb674b9ea130');
console.log(JSON.stringify({all_payloads_verified:files,mismatches:0,old_seal_unchanged:true,staged:rows}));
