import fs from 'node:fs';import path from 'node:path';import {report,oldReport,write} from './check.mjs';import {sha256} from '../llm-first-028/source.mjs';import {lockProduct} from '../../../product/short-compiler/resources.mjs';
const snap=JSON.parse(fs.readFileSync('.boundx/experiments/031-r1/pre-sync/snapshot.json'));
const tracked=snap.dirty.filter(x=>fs.existsSync(x.file)!==x.exists||x.exists&&sha256(fs.readFileSync(x.file))!==x.sha256);
const untracked=snap.untracked.filter(x=>x.file!=='tests/parser-v03-p21-service.test.mjs'&&(!fs.existsSync(x.file)||sha256(fs.readFileSync(x.file))!==x.sha256));
const manifest=JSON.parse(fs.readFileSync(path.join(oldReport,'MANIFEST.json'))),oldChanged=manifest.files.filter(x=>!fs.existsSync(path.join(oldReport,x.path))||sha256(fs.readFileSync(path.join(oldReport,x.path)))!==x.sha256);
const base=JSON.parse(fs.readFileSync(path.join(report,'PROTECTION-BASELINE.json')));
const sealUnchanged=sha256(fs.readFileSync(path.join(oldReport,'SEAL.json')))===base.prior_seal_sha256;
const lock=lockProduct(path.resolve('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2'));lock.verify();
let service={status:null},html='',serviceError=null;try{service=await fetch('http://127.0.0.1:58621/');html=await service.text();}catch(e){serviceError=e.cause?.code??e.message;}
write('FINAL-PROTECTION.json',{tracked_checked:snap.dirty.length,tracked_changed:tracked,untracked_checked:snap.untracked.length,unrelated_untracked_changed:untracked,old031_r1_files_checked:manifest.files.length,old031_r1_changed:oldChanged,old031_r1_seal_unchanged:sealUnchanged,service58621:{http_status:service.status,current_page:html.includes('031-R1'),error:serviceError,snapshot:lock.snapshot,upgraded:false},new_ports:false,legacy58618_recovery:'NOT_ATTEMPTED_POLICY_BLOCKED'});
if(tracked.length||untracked.length||oldChanged.length||!sealUnchanged)throw Error('PROTECTION_FAILURE');
console.log(JSON.stringify({tracked_changed:0,untracked_changed:0,old031_r1_changed:0,service58621:service.status,service_error:serviceError}));
