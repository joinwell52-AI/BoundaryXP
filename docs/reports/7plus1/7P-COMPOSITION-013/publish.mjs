// Publish exact sealed allowed blobs. Preserve unrelated worktree and index state.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';
const cwd='D:/boundx',dir='docs/reports/7plus1/7P-COMPOSITION-013/',runtime='research/7plus1-parser/v0.3-7p-composition-013/',test='tests/parser-7p-composition-013-owner-role.test.mjs',ref='refs/heads/review/7plus1-parser';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),sha=p=>hash(fs.readFileSync(p)),read=p=>JSON.parse(fs.readFileSync(p));
const git=(args,opts={})=>{const r=spawnSync('git',args,{cwd,encoding:'utf8',maxBuffer:160e6,...opts});if(r.status!==0)throw Error(r.stderr||r.error||'git failed');return r.stdout.trim();};
const head=git(['rev-parse','HEAD']),m=read(dir+'MANIFEST.json'),s=read(dir+'SEAL-VERIFICATION.json'),allowed=p=>p.startsWith(dir)||p.startsWith(runtime)||p.startsWith('tests/parser-7p-composition-013-');
if(git(['symbolic-ref','HEAD'])!==ref||git(['diff','--cached','--name-only'])||s.status!=='PASS'||head!==m.pre_seal_head)throw Error('BRANCH_INDEX_SEAL_HEAD');
if(git(['ls-remote','--heads','origin','review/7plus1-parser']).split(/\s/u)[0]!==head)throw Error('REMOTE_CHANGED');
for(const [p,h]of Object.entries(m.files))if(!allowed(p)||sha(p)!==h)throw Error('SEALED_CONTENT_SCOPE_CHANGED '+p);
for(const [p,h]of [[dir+'MANIFEST.json',s.manifest_sha256],[dir+'SHA256SUMS.txt',s.sha256sums_sha256],[dir+'SEAL.md',s.seal_sha256]])if(sha(p)!==h)throw Error('SEAL_CHANGED '+p);
const paths=[...Object.keys(m.files),...m.excluded_self_referential].sort();if(paths.some(p=>!allowed(p))||paths.length!==s.files_accounted)throw Error('PATH_SCOPE');
const indexHash=sha('.git/index'),status=git(['status','--porcelain=v1','--untracked-files=no']),temporary=path.join(cwd,'.git/7P-COMPOSITION-013-publish.index');if(fs.existsSync(temporary))throw Error('EXISTING_PUBLICATION_INDEX');const env={...process.env,GIT_INDEX_FILE:temporary};git(['read-tree',head],{env});
const oids=git(['hash-object','-w','--no-filters','--stdin-paths'],{input:paths.map(p=>JSON.stringify(p)).join('\n')+'\n'}).split('\n');
git(['update-index','-z','--index-info'],{env,input:paths.map((p,i)=>'100644 '+oids[i]+'\t'+p+'\0').join('')});const tree=git(['write-tree'],{env}),commit=git(['commit-tree',tree,'-p',head],{input:'7P-COMPOSITION-013: seal source certification and R4 composition gate failure evidence\n'});
const changed=git(['diff-tree','--no-commit-id','--name-only','-r',commit]).split('\n');if(changed.length!==paths.length||changed.some(p=>!paths.includes(p)))throw Error('OUT_OF_SCOPE_TREE_CHANGE');if(sha('.git/index')!==indexHash)throw Error('REAL_INDEX_CHANGED');
git(['read-tree',commit]);git(['update-ref',ref,commit,head]);if(git(['status','--porcelain=v1','--untracked-files=no'])!==status)throw Error('UNRELATED_DIRTY_WORKTREE_CHANGED');
git(['push','origin',ref+':'+ref]);const remote=git(['ls-remote','--heads','origin','review/7plus1-parser']).split(/\s/u)[0],bad=[];
for(const p of paths){const r=spawnSync('git',['show',commit+':'+p],{cwd,encoding:null,maxBuffer:100e6});if(r.status!==0||hash(r.stdout)!==sha(p))bad.push(p);}
const receipt={task:'7P-COMPOSITION-013',status:remote===commit&&!bad.length?'PASS':'FAIL',commit,remote,branch:'review/7plus1-parser',changed_git_paths:changed.length,verified_git_blobs:paths.length,blob_mismatches:bad,manifest_sha256:sha(dir+'MANIFEST.json'),sha256sums_sha256:sha(dir+'SHA256SUMS.txt'),seal_sha256:sha(dir+'SEAL.md'),terminal_outcome:m.terminal_outcome,no_merge_release_tag:true,no_production_switch:true,old_source_gold_method_contract_preserved:true,STATUS:'WAITING_ADMIN_REVIEW'};
fs.writeFileSync('.git/7P-COMPOSITION-013-PUSH-RECEIPT.json',JSON.stringify(receipt,null,2)+'\n','utf8');console.log(JSON.stringify(receipt));if(receipt.status!=='PASS')process.exitCode=1;
