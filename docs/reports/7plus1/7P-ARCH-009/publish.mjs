// Publish exactly the sealed diagnostic directory, never dirty unrelated work.
// Raw Git blobs preserve UTF-8 bytes without worktree filters or source editing.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';
const cwd='D:/boundx',dir='docs/reports/7plus1/7P-ARCH-009/',ref='refs/heads/review/7plus1-parser';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),sha=p=>hash(fs.readFileSync(p)),read=p=>JSON.parse(fs.readFileSync(p));
const git=(args,opts={})=>{const r=spawnSync('git',args,{cwd,encoding:'utf8',maxBuffer:150e6,...opts});if(r.status!==0)throw Error(r.stderr||r.error||'git failed');return r.stdout.trim();};
const head=git(['rev-parse','HEAD']),manifest=read(dir+'MANIFEST.json'),seal=read(dir+'SEAL-VERIFICATION.json');
if(git(['symbolic-ref','HEAD'])!==ref||git(['diff','--cached','--name-only'])||seal.status!=='PASS'||head!==manifest.pre_seal_head)throw Error('BRANCH_INDEX_SEAL_HEAD');
if(git(['ls-remote','--heads','origin','review/7plus1-parser']).split(/\s/u)[0]!==head)throw Error('REMOTE_CHANGED');
for(const [p,h]of Object.entries(manifest.files))if(!p.startsWith(dir)||sha(p)!==h)throw Error('SEALED_CONTENT_SCOPE_CHANGED '+p);
for(const [p,h]of [[dir+'MANIFEST.json',seal.manifest_sha256],[dir+'SHA256SUMS.txt',seal.sha256sums_sha256],[dir+'SEAL.md',seal.seal_sha256]])if(sha(p)!==h)throw Error('SEAL_CHANGED '+p);
const paths=[...Object.keys(manifest.files),...manifest.excluded_self_referential].sort();
if(paths.some(p=>!p.startsWith(dir))||paths.length!==seal.files_accounted)throw Error('PATH_SCOPE');
const indexHash=sha('.git/index'),env={...process.env,GIT_INDEX_FILE:path.join(cwd,'.git/7P-ARCH-009-publish.index')};git(['read-tree',head],{env});
const oids=git(['hash-object','-w','--no-filters','--stdin-paths'],{input:paths.map(p=>JSON.stringify(p)).join('\n')+'\n'}).split('\n');
git(['update-index','-z','--index-info'],{env,input:paths.map((p,i)=>'100644 '+oids[i]+'\t'+p+'\0').join('')});
const tree=git(['write-tree'],{env}),commit=git(['commit-tree',tree,'-p',head],{input:'7P-ARCH-009: seal read-only architecture review and recovery decision\n'});
const changed=git(['diff-tree','--no-commit-id','--name-only','-r',commit]).split('\n');if(changed.some(p=>!paths.includes(p)))throw Error('OUT_OF_SCOPE_TREE_CHANGE');
if(sha('.git/index')!==indexHash)throw Error('UNEXPECTED_REAL_INDEX_CHANGE');
git(['read-tree',commit]);git(['update-ref',ref,commit,head]);
git(['push','origin',ref+':'+ref]);
const remote=git(['ls-remote','--heads','origin','review/7plus1-parser']).split(/\s/u)[0],bad=[];
for(const p of paths){const r=spawnSync('git',['show',commit+':'+p],{cwd,encoding:null,maxBuffer:100e6});if(r.status!==0||hash(r.stdout)!==sha(p))bad.push(p);}
const receipt={task:'7P-ARCH-009',status:remote===commit&&!bad.length?'PASS':'FAIL',commit,remote,branch:'review/7plus1-parser',changed_git_paths:changed.length,verified_git_blobs:paths.length,blob_mismatches:bad,manifest_sha256:sha(dir+'MANIFEST.json'),seal_sha256:sha(dir+'SEAL.md'),primary_decision:manifest.primary_decision,no_merge_release_tag:true,no_runtime_gold_source_method_production_changes:true,STATUS:'WAITING_ADMIN_REVIEW'};
// A Git metadata receipt cannot recursively become part of its own sealed commit.
fs.writeFileSync('.git/7P-ARCH-009-PUSH-RECEIPT.json',JSON.stringify(receipt,null,2)+'\n','utf8');console.log(JSON.stringify(receipt));if(receipt.status!=='PASS')process.exitCode=1;
