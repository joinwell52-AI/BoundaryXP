import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const out='docs/reports/7plus1/7P-SHORT-016/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(args,extra={})=>execFileSync('git',args,{maxBuffer:50e6,...extra});
const branch='review/7plus1-parser',before=git(['rev-parse','HEAD']).toString().trim(),remote=git(['rev-parse','origin/'+branch]).toString().trim();
if(before!==remote||git(['branch','--show-current']).toString().trim()!==branch||git(['diff','--cached','--name-only']).length)throw Error('HEAD/branch/index mismatch');
const status=git(['status','--porcelain=v1','--untracked-files=no']);
const records=read(out+'MANIFEST.json').files,files=[...records.map(r=>r.path),...['MANIFEST.json','SHA256SUMS.txt','SEAL.md','SEAL-VERIFICATION.json'].map(p=>out+p)];
for(const r of records)if(hash(fs.readFileSync(r.path))!==r.sha256)throw Error('SEALED_PAYLOAD_CHANGED '+r.path);
if(files.some(p=>!p.startsWith(out)&&!p.startsWith('research/7plus1-parser/v0.3-7p-short-direct-016/')&&p!=='tests/parser-7p-short-016.test.mjs'))throw Error('Publish scope');
const indexPath=git(['rev-parse','--git-path','7p-short-016-publish.index']).toString().trim();if(fs.existsSync(indexPath))throw Error('Temporary index exists');
const env={...process.env,GIT_INDEX_FILE:indexPath};git(['read-tree',before],{env});git(['add','--',...files],{env});const tree=git(['write-tree'],{env}).toString().trim();
const commit=git(['commit-tree',tree,'-p',before],{input:Buffer.from('7P-SHORT-016: seal direct candidate and G3 contract review stop\n')}).toString().trim();
for(const p of files){const b=git(['show',commit+':'+p]);if(hash(b)!==hash(fs.readFileSync(p)))throw Error('Git blob hash mismatch '+p);}
git(['update-ref','refs/heads/'+branch,commit,before]);git(['read-tree',commit]);
if(!status.equals(git(['status','--porcelain=v1','--untracked-files=no'])))throw Error('Preexisting dirty tracked state changed');
const output=git(['push','origin',branch]).toString();const check=git(['ls-remote','origin','refs/heads/'+branch]).toString().trim().split(/\s/)[0];if(check!==commit)throw Error('Push head mismatch');
fs.unlinkSync(indexPath);
const receipt={task:'7P-SHORT-016',commit,parent:before,remote_verified:check,files:files.length,payload_sha256_verified:true,Git_blobs_exact:true,preexisting_dirty_state_preserved:true,no_merge_release_tag_production_switch:true,STATUS:'WAITING_ADMIN_REVIEW'};
const receiptPath=git(['rev-parse','--git-path','7P-SHORT-016-PUSH-RECEIPT.json']).toString().trim();fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
