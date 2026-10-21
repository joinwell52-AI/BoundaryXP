import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {OUT,read} from './util.mjs';
const digest=p=>{const fd=fs.openSync(p,'r'),b=Buffer.alloc(1024*1024),h=crypto.createHash('sha256');try{let n;while((n=fs.readSync(fd,b,0,b.length,null)))h.update(b.subarray(0,n));return h.digest('hex');}finally{fs.closeSync(fd);}};
const manifest=read(`${OUT}/MANIFEST.json`),seal=read(`${OUT}/SEAL.json`);
for(const r of manifest.files)if(digest(r.file)!==r.sha256)throw Error('FILE_CHANGED '+r.file);
if(digest(`${OUT}/MANIFEST.json`)!==seal.manifest_sha256||digest(`${OUT}/SHA256SUMS`)!==seal.sha256sums_sha256)throw Error('SEAL_MISMATCH');
if(process.argv.includes('--staged')){
 const expected=new Set([...manifest.files.map(r=>r.file),`${OUT}/MANIFEST.json`,`${OUT}/SHA256SUMS`,`${OUT}/SEAL.json`]);
 const actual=execFileSync('git',['diff','--cached','--name-only','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
 if(actual.length!==expected.size||actual.some(p=>!expected.has(p)))throw Error('STAGED_SCOPE_MISMATCH');
 for(const file of actual){
  // Git blob identity is calculated over exact working bytes, detecting EOL conversion.
  const working=execFileSync('git',['hash-object','--no-filters',file],{encoding:'utf8'}).trim();
  const staged=execFileSync('git',['rev-parse',':'+file],{encoding:'utf8'}).trim();
  if(working!==staged)throw Error('STAGED_BYTE_MISMATCH '+file);
 }
}
console.log(JSON.stringify({status:'PASS',files:manifest.files.length,task_status:seal.task_status,trial_admission:seal.trial_admission,manifest_sha256:seal.manifest_sha256}));
