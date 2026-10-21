import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';import path from 'node:path';import {execFileSync} from 'node:child_process';
const OUT='docs/reports/7plus1/7P-ADMIN-NATURAL-021-LONG/',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(args,options={})=>{const result=execFileSync('git',args,{encoding:'utf8',maxBuffer:100e6,...options});return typeof result==='string'?result.trim():result;};
const m=read(OUT+'MANIFEST.json'),base=m.base_commit,branch='review/7plus1-parser';
assert.equal(git(['branch','--show-current']),branch);assert.equal(git(['rev-parse','HEAD']),base);assert.equal(read(OUT+'SEAL-VERIFICATION.json').status,'PASS');
const remote=git(['ls-remote','origin','refs/heads/'+branch]).split(/\s+/u)[0];assert.equal(remote,base,'Remote changed; do not overwrite');
const selected=[...new Set(m.publication_paths)].sort();
const receipt={status:'VERIFIED_SCOPE_READY_FOR_FAST_FORWARD_PUSH',branch,base_commit:base,remote_before:remote,manifest_sha256:sha(fs.readFileSync(OUT+'MANIFEST.json')),selected_files:selected.length,commit_id:'Recorded in Git history and final execution receipt; excluded here to avoid a self-referential commit hash',raw_blob_bytes:true,unrelated_dirty_assets_not_staged:true,production_switch:false,merge:false,release:false,tag:false};
// Delivery receipt is printed; it is not a post-seal mutable report file.
const index=path.resolve('.boundx/7p-admin-natural-021-tools/publication.index');assert.ok(!fs.existsSync(index));const env={...process.env,GIT_INDEX_FILE:index};
fs.mkdirSync(path.dirname(index),{recursive:true});
git(['read-tree',base],{env});let input='';
const expected=new Map();for(const p of selected){assert.ok(fs.existsSync(p),p);assert.ok(!/[\r\n"]/u.test(p));const digest=sha(fs.readFileSync(p)),record=m.files.find(r=>r.path===p);if(record)assert.equal(digest,record.sha256,p);expected.set(p,digest);}
// --no-filters preserves original UTF-8/binary bytes, independently of checkout attributes.
const objectIDs=git(['hash-object','-w','--no-filters','--stdin-paths'],{input:selected.join('\n')+'\n'}).split('\n');assert.equal(objectIDs.length,selected.length);
for(let i=0;i<selected.length;i++)input+='100644 '+objectIDs[i]+'\t'+selected[i]+'\n';
git(['update-index','--index-info'],{env,input});const tree=git(['write-tree'],{env});const changed=git(['diff-tree','--no-commit-id','--name-only','-r',base,tree]).split('\n').filter(Boolean);assert.equal(changed.length,selected.length);
assert.ok(changed.every(p=>selected.includes(p)));assert.ok(changed.every(p=>p.startsWith(OUT)||p.startsWith('research/7plus1-parser/v0.3-admin-natural-021/')||p==='tests/parser-admin-natural-021.test.mjs'));
const commit=git(['commit-tree',tree,'-p',base,'-m','Seal 7P-ADMIN-NATURAL-021-LONG diagnostic: blind16, repaired21, architecture review required']);
git(['update-ref','refs/heads/'+branch,commit,base]);
// Update only the new task paths; preserve every unrelated staged/unstaged asset.
git(['update-index','--index-info'],{input});
for(let offset=0;offset<selected.length;offset+=200){const group=selected.slice(offset,offset+200),bytes=git(['cat-file','--batch'],{input:group.map(p=>commit+':'+p).join('\n')+'\n',encoding:null,maxBuffer:150e6});let cursor=0;for(const p of group){const end=bytes.indexOf(10,cursor),header=bytes.subarray(cursor,end).toString('ascii'),match=/^[0-9a-f]+ blob (\d+)$/u.exec(header);assert.ok(match,p);const length=Number(match[1]),start=end+1;assert.equal(sha(bytes.subarray(start,start+length)),expected.get(p),p);assert.equal(bytes[start+length],10);cursor=start+length+1;}assert.equal(cursor,bytes.length);}
console.log(JSON.stringify({status:'COMMIT_BLOBS_VERIFIED',commit,tree,files:selected.length,manifest_sha256:receipt.manifest_sha256}));
git(['push','origin','refs/heads/'+branch+':refs/heads/'+branch],{stdio:['ignore','pipe','pipe'],maxBuffer:100e6});
const after=git(['ls-remote','origin','refs/heads/'+branch]).split(/\s+/u)[0];assert.equal(after,commit);
console.log(JSON.stringify({status:'PUSH_CONFIRMED',commit,remote_commit:after,branch,STATUS:'WAITING_ADMIN_REVIEW'}));


