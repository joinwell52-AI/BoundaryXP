import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {CODE,OUT,OLD,read,save,sha} from './util.mjs';
const hash=p=>{const fd=fs.openSync(p,'r'),b=Buffer.alloc(1024*1024),h=crypto.createHash('sha256');try{let n;while((n=fs.readSync(fd,b,0,b.length,null)))h.update(b.subarray(0,n));return h.digest('hex');}finally{fs.closeSync(fd);}};
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
const archives=read(`${OUT}/ARCHIVES.json`);
for(const a of archives.archives)if(hash(a.file)!==a.sha256)throw Error('ARCHIVE_DIGEST_MISMATCH '+a.file);
const checks=[];
for(const r of read(`${OUT}/INPUT-FREEZE.json`).rows){
 const base=`${OUT}/inputs/${r.id}`;
 for(const [name,expected]of [['source.md',r.source_sha256],['input.json',r.input_sha256],['expected.json',r.expected_sha256]]){
  const actual=hash(base+'/'+name);checks.push({file:base+'/'+name,expected,actual});
 }
}
for(const r of read(`${OUT}/FAULT-FREEZE.json`).rows){const file=`${OUT}/fault-inputs/${r.id}/input.json`;checks.push({file,digest_format:'JSON.stringify(parsed input), matching the original frozen ledger',expected:r.input_sha256,actual:sha(Buffer.from(JSON.stringify(read(file)))),physical_file_sha256:hash(file)});}
if(checks.some(r=>r.expected!==r.actual))throw Error('FROZEN_INPUT_CHANGED');
const before=read('.boundx/experiments/026f/pre-sync.json');
const protectedFiles=[...before.tracked_changes,...before.protected_026_code];
const changed=protectedFiles.filter(r=>(fs.existsSync(r.file)?hash(r.file):null)!==r.sha256);
if(changed.length)throw Error('PREEXISTING_WORKSPACE_CHANGED');
const historical=[...read(`${OLD}/CORPUS-SELECTION.json`).protected_files,...read(`${OLD}/MANIFEST.json`).files];
const historicalChanged=historical.filter(r=>hash(r.file??r.path)!==r.sha256);
if(historicalChanged.length)throw Error('SEALED_HISTORICAL_ASSET_CHANGED');
const excluded=new Set(['MANIFEST.json','SHA256SUMS','SEAL.json','PROTECTED-INTEGRITY.json']);
// Retain the first oversized packaging attempt locally. Its identical raw
// entries are delivered in the split archives; it is not an omitted result.
for(const name of fs.readdirSync(OUT))if(name.endsWith('.zip')&&!archives.archives.some(a=>a.file===OUT+'/'+name))excluded.add(name);
const reports=fs.readdirSync(OUT,{withFileTypes:true}).filter(e=>e.isFile()&&!excluded.has(e.name)).map(e=>OUT+'/'+e.name);
const files=[...walk(CODE),...reports].sort();
const source=[];
for(const file of files){const size=fs.statSync(file).size;if(size>=95*1024*1024)throw Error('OVERSIZED_DELIVERY '+file);source.push({file,size,sha256:hash(file)});}
const status={task:'7P-DOWNSTREAM-SEMANTIC-VALIDATION-026F',task_status:'FAIL',trial_admission:'DENIED',state:'WAITING_ADMIN_REVIEW',production_ready:false};
save(`${OUT}/MANIFEST.json`,{...status,generated_at:new Date().toISOString(),base_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),files:source,archives:archives.archives,frozen_input_checks:checks,workspace_preserved:{tracked:before.tracked_changes.length,active:before.protected_026_code.length,changed:0,historical_final_rechecks:historical.length,historical_changed:0},raw_files_preserved:true,delivery_scope:'Only files listed in files plus MANIFEST.json, SHA256SUMS and SEAL.json. Raw evidence trees travel inside the ZIP archives; no original results are removed.'});
const m=`${OUT}/MANIFEST.json`,lines=[...source,{file:m,sha256:hash(m)}].map(r=>`${r.sha256}  ${r.file}`).join('\n')+'\n';
save(`${OUT}/SHA256SUMS`,lines);
save(`${OUT}/SEAL.json`,{...status,manifest_sha256:hash(m),sha256sums_sha256:hash(`${OUT}/SHA256SUMS`),delivery_files:files.length+3,archive_entry_verification:'CRC_AND_SHA256_EVERY_ENTRY',frozen_input_checks:checks.length,frozen_input_mismatches:0,source_and_archive_digest_mismatches:0,validation:'PASS',semantic_task_status:'FAIL'});
const delivery=[...files,m,`${OUT}/SHA256SUMS`,`${OUT}/SEAL.json`];
fs.mkdirSync('.boundx/experiments/026f',{recursive:true});
fs.writeFileSync('.boundx/experiments/026f/delivery-paths.bin',delivery.join('\0')+'\0',{flag:'wx'});
console.log(JSON.stringify({files:delivery.length,manifest_sha256:hash(m),seal_sha256:hash(`${OUT}/SEAL.json`)}));
