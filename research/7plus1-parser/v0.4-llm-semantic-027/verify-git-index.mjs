// Post-seal Git-byte verification. Its receipt stays outside the sealed payload.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {ROOT,REPORT,read,save,sha} from './util.mjs';
const tests=['tests/parser-llm-semantic-027.test.mjs','tests/parser-llm-eligibility-policy-027.test.mjs'];
const algorithm=execFileSync('git',['rev-parse','--show-object-format'],{encoding:'utf8'}).trim();
const records=execFileSync('git',['ls-files','--stage','-z','--',ROOT,REPORT,...tests],{encoding:'utf8',maxBuffer:8*1024*1024}).split('\0').filter(Boolean).map(s=>{const [meta,path]=s.split('\t');const [mode,hash,stage]=meta.split(' ');return {mode,hash,stage,path};});
const index=new Map(records.map(r=>[r.path,r]));
const manifest=read(REPORT+'/MANIFEST.json');
const sealNames=['MANIFEST.json','SHA256SUMS.txt','SEAL.json','SEAL-VERIFICATION.json'];
const files=[...manifest.files,...sealNames.map(name=>({path:REPORT+'/'+name,sha256:sha(fs.readFileSync(REPORT+'/'+name))}))];
const errors=[];
for(const file of files){const data=fs.readFileSync(file.path),stored=index.get(file.path),blob=crypto.createHash(algorithm).update(Buffer.from('blob '+data.length+'\0')).update(data).digest('hex');if(sha(data)!==file.sha256)errors.push({path:file.path,error:'SEALED_FILE_CHANGED'});if(!stored||stored.stage!=='0'||stored.hash!==blob)errors.push({path:file.path,error:'GIT_STAGED_BYTES_DIFFER'});}
const staged=execFileSync('git',['diff','--cached','--name-only','-z'],{encoding:'utf8',maxBuffer:8*1024*1024}).split('\0').filter(Boolean);
const allowed=p=>p.startsWith(ROOT+'/')||p.startsWith(REPORT+'/')||tests.includes(p);
for(const p of staged)if(!allowed(p))errors.push({path:p,error:'UNAUTHORIZED_STAGED_PATH'});
if(staged.length!==files.length)errors.push({error:'PAYLOAD_INDEX_COUNT_MISMATCH',staged:staged.length,expected:files.length});
const pre=read('.boundx/experiments/027/pre-sync.json');
const protectedChanged=pre.tracked_changes.filter(f=>(fs.existsSync(f.file)?sha(fs.readFileSync(f.file)):null)!==f.sha256);
for(const p of protectedChanged)errors.push({path:p.file,error:'PREEXISTING_USER_CHANGE_ALTERED'});
save('.boundx/experiments/027/GIT-INDEX-VERIFICATION.json',{status:errors.length?'FAIL':'PASS',checked_at:new Date().toISOString(),branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),base_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),git_object_algorithm:algorithm,staged_payload_files:staged.length,exact_git_blob_bytes_verified:true,protected_original_paths_verified:pre.tracked_changes.length,errors,seal_sha256:sha(fs.readFileSync(REPORT+'/SEAL.json'))});
console.log(JSON.stringify({status:errors.length?'FAIL':'PASS',staged_files:staged.length,errors}));
if(errors.length)process.exitCode=1;
