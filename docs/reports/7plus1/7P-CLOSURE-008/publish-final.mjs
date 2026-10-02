// Stage only the sealed task scope, preserving unrelated user work and UTF-8 bytes.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';
const cwd='D:/boundx',dir='docs/reports/7plus1/7P-CLOSURE-008',ref='refs/heads/review/7plus1-parser',read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const git=(args,opts={})=>{const r=spawnSync('git',args,{cwd,encoding:'utf8',maxBuffer:150e6,...opts});if(r.status!==0)throw Error(r.stderr);return r.stdout.trim();};
const head=git(['rev-parse','HEAD']),manifest=read(dir+'/MANIFEST.json'),seal=read(dir+'/SEAL-VERIFICATION.json');
if(git(['symbolic-ref','HEAD'])!==ref||git(['diff','--cached','--name-only'])||seal.status!=='PASS')throw Error('BRANCH_INDEX_SEAL');
if(git(['ls-remote','--heads','origin','review/7plus1-parser']).split(/\s/u)[0]!==head)throw Error('REMOTE_CHANGED');
for(const [p,h]of Object.entries(manifest.files))if(sha(p)!==h)throw Error('SEALED_CONTENT_CHANGED '+p);
for(const [p,h]of [[dir+'/MANIFEST.json',seal.manifest_sha256],[dir+'/SHA256SUMS.txt',seal.sha256sums_sha256],[dir+'/SEAL.md',seal.seal_sha256]])if(sha(p)!==h)throw Error('SEAL_CHANGED '+p);
const paths=[...Object.keys(manifest.files),...['MANIFEST.json','SHA256SUMS.txt','SEAL.md','SEAL-VERIFICATION.json'].map(p=>dir+'/'+p)];
for(const p of paths)if(!(p.startsWith(dir+'/')||p.startsWith('research/7plus1-parser/v0.3-7p-closure-008/')||/^tests\/parser-7p-closure-008.*\.test\.mjs$/u.test(p)))throw Error('OUT_OF_TASK_SCOPE '+p);
const indexHash=sha('.git/index'),env={...process.env,GIT_INDEX_FILE:path.join(cwd,'.git/7P-CLOSURE-008-final.index')};git(['read-tree',head],{env});
const oids=git(['hash-object','-w','--no-filters','--stdin-paths'],{input:paths.map(p=>JSON.stringify(p)).join('\n')+'\n'}).split('\n');git(['update-index','-z','--index-info'],{env,input:paths.map((p,i)=>'100644 '+oids[i]+'\t'+p+'\0').join('')});
const tree=git(['write-tree'],{env}),commit=git(['commit-tree',tree,'-p',head],{input:'7P-CLOSURE-008: seal diagnostic candidate; implementation gaps remain, no v0.3 certification\n'});if(sha('.git/index')!==indexHash)throw Error('UNEXPECTED_REAL_INDEX_CHANGE');git(['read-tree',commit]);git(['update-ref',ref,commit,head]);
git(['push','origin',ref+':'+ref]);const remote=git(['ls-remote','--heads','origin','review/7plus1-parser']).split(/\s/u)[0];
const bad=[];for(const [p,h]of Object.entries(manifest.files)){const blob=spawnSync('git',['show',commit+':'+p],{cwd,encoding:null,maxBuffer:100e6});if(blob.status!==0||createHash('sha256').update(blob.stdout).digest('hex')!==h)bad.push(p);}
const receipt={status:remote===commit&&!bad.length?'PASS':'FAIL',commit,remote,branch:'review/7plus1-parser',verified_git_blobs:paths.length,blob_mismatches:bad,manifest_sha256:sha(dir+'/MANIFEST.json'),seal_sha256:sha(dir+'/SEAL.md'),no_merge_release_tag:true,production_entry_changed:false,terminal:'IMPLEMENTATION_GAP_REMAINS'};
fs.writeFileSync(dir+'/FINAL-PUSH-RECEIPT.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));if(receipt.status!=='PASS')process.exitCode=1;
