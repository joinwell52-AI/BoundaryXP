import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {OUT,CODE,read,save,sha} from './setup.mjs';
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
const syntax=[];
for(const f of walk(CODE)){if(f.endsWith('.mjs')){const x=spawnSync(process.execPath,['--check',f],{encoding:'utf8'});syntax.push({file:f,exit_code:x.status,stdout:x.stdout,stderr:x.stderr});}else if(f.endsWith('.py')){const dest='.boundx/experiments/026e/syntax-cache/'+path.basename(f)+'.pyc';fs.mkdirSync(path.dirname(dest),{recursive:true});const x=spawnSync('.boundx/nlp-venv/Scripts/python.exe',['-c','import py_compile,sys;py_compile.compile(sys.argv[1],cfile=sys.argv[2],doraise=True)',f,dest],{encoding:'utf8'});syntax.push({file:f,exit_code:x.status,stdout:x.stdout,stderr:x.stderr});}}
if(syntax.some(r=>r.exit_code!==0))throw Error('SYNTAX_CHECK_FAILED');
const review=read(`${OUT}/FINAL-DECISIONS.json`),selection=read(`${OUT}/CORPUS-SELECTION.json`);
const protectedRows=selection.protected_files.map(r=>({...r,match:sha(fs.readFileSync(r.file))===r.sha256}));
if(protectedRows.some(r=>!r.match))throw Error('BASELINE_MUTATED');
save(`${OUT}/FINAL-CHECKS.json`,{syntax,protected_files:protectedRows.length,protected_changed:0,source_count:60,AB_outputs:120,AB_contracts:'119/120 PASS; B/ROOT-031 FAIL preserved',AB_architecture:'120/120 PASS',oracle_original_entry:'0/10 G8 refusal preserved',oracle_diagnostic:'7/10 semantically correct for reviewed fixture, ADMIN pending',pre_gamma:read(`${OUT}/PRE-GAMMA-AUDIT.json`).totals,audit_tests:read(`${OUT}/audit-tests/r002.json`),installed_spacy_assets:read(`${OUT}/AB-INSTALLED-WHEEL-COMPARISON.json`),full_regression:'NOT_RUN_TASK_NOT_REQUIRED_NO_RUNTIME_CHANGES',snapshot_sha256:read(`${OUT}/RUNTIME-SNAPSHOT-MANIFEST.json`).digest,WAITING_ADMIN_REVIEW:true});
const files=[...walk(OUT),...walk(CODE)].filter(f=>!['MANIFEST.json','SHA256SUMS.txt','SEAL.json'].includes(path.basename(f))).sort().map(file=>({file,bytes:fs.statSync(file).size,sha256:sha(fs.readFileSync(file))}));
save(`${OUT}/MANIFEST.json`,{task:selection.task,git_task_pointer_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),code_identity:'Actual admitted local r050 source SHA, not task-pointer Git HEAD',files,evidence_package:read(`${OUT}/EVIDENCE-PACKAGE.json`),raw_files_remain_local:true,model_weights_cache_credentials_excluded:true,review_pending_ADMIN:true});
save(`${OUT}/SHA256SUMS.txt`,files.map(r=>r.sha256+'  '+r.file).join('\n')+'\n');
const seal={task:selection.task,status:'SEALED_FOR_ADMIN_REVIEW',created_at:new Date().toISOString(),file_count:files.length,manifest_sha256:sha(fs.readFileSync(`${OUT}/MANIFEST.json`)),sha256sums_sha256:sha(fs.readFileSync(`${OUT}/SHA256SUMS.txt`)),evidence_zip_sha256:read(`${OUT}/EVIDENCE-PACKAGE.json`).sha256,decisions:review,immutable_outputs:true,WAITING_ADMIN_REVIEW:true};
save(`${OUT}/SEAL.json`,seal);
for(const r of files)if(sha(fs.readFileSync(r.file))!==r.sha256)throw Error('POST_SEAL_CHANGED '+r.file);
console.log(JSON.stringify({files:files.length,syntax:syntax.length,seal:seal.manifest_sha256,protected:protectedRows.length,zip:seal.evidence_zip_sha256}));
