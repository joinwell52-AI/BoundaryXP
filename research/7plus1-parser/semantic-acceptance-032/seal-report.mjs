// Evidence seal: an immutable report payload is not a semantic acceptance PASS.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';import {report,write} from './prepare.mjs';import {sha256} from '../llm-first-028/source.mjs';
const excluded=new Set(['MANIFEST.json','SHA256SUMS','SEAL.json']);
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):e.isFile()?[path.join(d,e.name)]:[]);
const read=n=>JSON.parse(fs.readFileSync(path.join(report,n),'utf8'));
if(process.argv[2]==='verify'){
 const manifest=read('MANIFEST.json'),seal=read('SEAL.json');
 for(const f of manifest.files)assert.equal(sha256(fs.readFileSync(path.join(report,f.path))),f.sha256,'REPORT_CHANGED:'+f.path);
 assert.equal(sha256(fs.readFileSync(path.join(report,'MANIFEST.json'))),seal.manifest_sha256);
 assert.equal(sha256(fs.readFileSync(path.join(report,'SHA256SUMS'))),seal.sha256sums_sha256);
 const actual=walk(report).map(p=>path.relative(report,p).replaceAll('\\','/')).filter(p=>!excluded.has(p)).sort();assert.deepEqual(actual,manifest.files.map(f=>f.path));
 const sums=fs.readFileSync(path.join(report,'SHA256SUMS'),'utf8').trim().split('\n');
 for(const row of sums){const m=row.match(/^([a-f0-9]{64})  (.+)$/);assert.ok(m);assert.equal(sha256(fs.readFileSync(path.join(report,m[2]))),m[1]);}
 console.log(JSON.stringify({seal:'VERIFIED',files:manifest.files.length,product_acceptance:seal.SHORT_COMPILER_ACCEPTANCE,status:seal.state}));
}else{
 const files=walk(report).map(p=>({path:path.relative(report,p).replaceAll('\\','/'),sha256:sha256(fs.readFileSync(p)),bytes:fs.statSync(p).size})).filter(f=>!excluded.has(f.path)).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
 assert.ok(!files.some(f=>/\.tmp$/.test(f.path)),'UNFINISHED_FILE');
 const gates=read('GATES.json'),budget=read('CALL-BUDGET-FINAL-R02.json');assert.ok(gates.SHORT_COMPILER_ACCEPTANCE.startsWith('BLOCKED'));
 assert.equal(read('engineering/domain-v2-full/RESULTS.json').fail,0);
 const detected=files.filter(f=>!f.path.endsWith('.zip')&&f.bytes<10000000).filter(f=>/(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(fs.readFileSync(path.join(report,f.path),'utf8')));
 assert.equal(detected.length,0,'POSSIBLE_CREDENTIAL_MUST_REVIEW');
 write('MANIFEST.json',{schema:'boundx-report-manifest/v1',task:'7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG',at:new Date().toISOString(),files,excluded_self_references:[...excluded],raw_first_runs_preserved:true});
 const manifestSha=sha256(fs.readFileSync(path.join(report,'MANIFEST.json')));
 const sums=files.map(f=>f.sha256+'  '+f.path).concat(manifestSha+'  MANIFEST.json').join('\n')+'\n';fs.writeFileSync(path.join(report,'SHA256SUMS'),sums,{flag:'wx'});
 write('SEAL.json',{schema:'boundx-evidence-seal/v1',at:new Date().toISOString(),task:'7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG',implementation_commit:read('DOMAIN-V2-CANDIDATE-FROZEN.json').implementation_commit,report_parent_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),manifest_sha256:manifestSha,sha256sums_sha256:sha256(Buffer.from(sums)),files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0),SHORT_COMPILER_ACCEPTANCE:gates.SHORT_COMPILER_ACCEPTANCE,EVALUATION_COVERAGE:gates.EVALUATION_COVERAGE,LOCAL_DEPLOYMENT:'NOT_PERFORMED_QUALITY_GATES_BLOCKED',PUBLIC_RELEASE:false,state:'WAITING_ADMIN_REVIEW',current_c3_model_complete:0,current_required:79,historical_c2_complete:11,historical_c2_semantic_fail:1,post_deploy_smoke:'NOT_RUN',budget_conservative:budget.conservative_charged_including_reserve,remaining_budget:budget.remaining_conservative,minimum_fresh_validation:160,budget_shortfall:28,evidence_sealed_does_not_mean_product_pass:true});
 console.log(JSON.stringify({seal:'CREATED',files:files.length,manifest_sha256:manifestSha,product_acceptance:'BLOCKED'}));
}
