import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';import path from 'node:path';import {execFileSync} from 'node:child_process';
const OUT='docs/reports/7plus1/7P-ADMIN-SHORT-020-LONG/',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(args,options={})=>{const result=execFileSync('git',args,{encoding:'utf8',maxBuffer:100e6,...options});return typeof result==='string'?result.trim():result;};
const m=read(OUT+'MANIFEST.json'),base=m.base_commit,branch='review/7plus1-parser';
assert.equal(git(['branch','--show-current']),branch);assert.equal(git(['rev-parse','HEAD']),base);assert.equal(read(OUT+'SEAL-VERIFICATION.json').status,'PASS');
const remote=git(['ls-remote','origin','refs/heads/'+branch]).split(/\s+/u)[0];assert.equal(remote,base,'Remote changed; do not overwrite');
const selected=[...new Set(m.publication_paths)].sort();
const receipt={status:'VERIFIED_SCOPE_READY_FOR_FAST_FORWARD_PUSH',branch,base_commit:base,remote_before:remote,manifest_sha256:sha(fs.readFileSync(OUT+'MANIFEST.json')),selected_files:selected.length,commit_id:'Recorded in Git history and final execution receipt; excluded here to avoid a self-referential commit hash',raw_blob_bytes:true,unrelated_dirty_assets_not_staged:true,production_switch:false,merge:false,release:false,tag:false};
assert.ok(!fs.existsSync(OUT+'GIT-PUBLICATION.json'));fs.writeFileSync(OUT+'GIT-PUBLICATION.json',JSON.stringify(receipt,null,2)+'\n');
const index=path.resolve('.boundx/7p-admin-short-020-tools/publication.index');assert.ok(!fs.existsSync(index));const env={...process.env,GIT_INDEX_FILE:index};
git(['read-tree',base],{env});let input='';
for(const p of selected){assert.ok(fs.existsSync(p),p);const b=fs.readFileSync(p),record=m.files.find(r=>r.path===p);if(record)assert.equal(sha(b),record.sha256,p);const oid=git(['hash-object','-w','--stdin'],{input:b,encoding:'utf8'});input+='100644 '+oid+'\t'+p+'\n';}
git(['update-index','--index-info'],{env,input});const tree=git(['write-tree'],{env});const changed=git(['diff-tree','--no-commit-id','--name-only','-r',base,tree]).split('\n').filter(Boolean);assert.equal(changed.length,selected.length);
assert.ok(changed.every(p=>selected.includes(p)));assert.ok(changed.every(p=>p.startsWith(OUT)||p.startsWith('research/7plus1-parser/v0.3-admin-short-020/')||p==='tests/parser-admin-short-020.test.mjs'));
const commit=git(['commit-tree',tree,'-p',base,'-m','Complete 7P-ADMIN-SHORT-020-LONG: generic mechanisms, two frozen shadow suites, sealed evidence']);
git(['update-ref','refs/heads/'+branch,commit,base]);
// Update only the new task paths; preserve every unrelated staged/unstaged asset.
git(['update-index','--index-info'],{input});
for(const p of selected){const b=git(['cat-file','blob',commit+':'+p],{encoding:null,maxBuffer:150e6});assert.equal(sha(b),sha(fs.readFileSync(p)),p);}
console.log(JSON.stringify({status:'COMMIT_BLOBS_VERIFIED',commit,tree,files:selected.length,manifest_sha256:receipt.manifest_sha256}));
git(['push','origin','refs/heads/'+branch+':refs/heads/'+branch],{stdio:['ignore','pipe','pipe'],maxBuffer:100e6});
const after=git(['ls-remote','origin','refs/heads/'+branch]).split(/\s+/u)[0];assert.equal(after,commit);
console.log(JSON.stringify({status:'PUSH_CONFIRMED',commit,remote_commit:after,branch,STATUS:'WAITING_ADMIN_REVIEW'}));
