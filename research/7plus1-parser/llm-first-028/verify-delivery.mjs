import fs from 'node:fs';
import path from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';
import {ROOT,buildBundle} from './bundle.mjs';
import {cases} from './tests/short-texts.mjs';
import {sha256} from './source.mjs';
import {fileInventory} from './evidence.mjs';
const output=path.resolve(process.argv[2]);
fs.mkdirSync(output,{recursive:true});
const units=spawnSync(process.execPath,['--test',path.join(ROOT,'tests/selfcheck.test.mjs')],{encoding:'utf8',windowsHide:true});
fs.writeFileSync(path.join(output,'SELF-CHECKS.log'),units.stdout+units.stderr);
const skillValidator=path.join(process.env.USERPROFILE,'.codex','skills','.system','skill-creator','scripts','quick_validate.py');
const skills=['parse','audit'].map(phase=>{const r=spawnSync('python',['-X','utf8',skillValidator,path.join(ROOT,'skills',`boundx-semantic-${phase}`)],{encoding:'utf8',windowsHide:true});return {phase,exit_code:r.status,stdout:r.stdout,stderr:r.stderr};});
const checks=[];
const check=(name,pass,detail=null)=>checks.push({name,pass,detail});
check('units',units.status===0);
check('skill_format',skills.every(s=>s.exit_code===0),skills);
const protectedSnapshot=JSON.parse(fs.readFileSync('.boundx/experiments/028/pre-sync-r02.json','utf8'));
const protectedDiff=protectedSnapshot.tracked.filter(x=>(fs.existsSync(x.path)?sha256(fs.readFileSync(x.path)):null)!==x.sha256);
check('protected_local_changes_unchanged',protectedDiff.length===0,{protected:protectedSnapshot.tracked.length,changed:protectedDiff});
for(const c of cases){
 const first=JSON.parse(fs.readFileSync(path.join(output,'first',c.id,'trace.json'))),model=JSON.parse(fs.readFileSync(path.join(output,'method-r2',c.id,'trace.json'))),final=JSON.parse(fs.readFileSync(path.join(output,'sealed-final',c.id,'trace.json')));
 check(`${c.id}:source_bytes`,[first,model,final].every(t=>t.source.text===c.text&&t.source.sha256===sha256(Buffer.from(c.text))));
 check(`${c.id}:proposal_audit_preserved`,JSON.stringify(model.proposal)===JSON.stringify(final.proposal)&&JSON.stringify(model.audit)===JSON.stringify(final.audit));
 check(`${c.id}:no_business_authorization`,final.ir.business_decision===null&&final.ir.execution_authorization===null);
 for(const f of final.ir.facts)for(const cite of f.sources)check(`${c.id}:span:${cite.span.join(':')}`,Array.from(c.text).slice(...cite.span).join('')===cite.quote);
 const parseThread=model.model_calls.parse.at(-1).thread_id,auditThread=model.model_calls.audit.at(-1).thread_id;
 check(`${c.id}:separate_sessions`,!!parseThread&&!!auditThread&&parseThread!==auditThread);
 for(const phase of ['parse','audit']){
  const bundle=buildBundle(phase),dir=path.join(output,'method-r2',c.id,`revision-${model.revision}`,`${phase}-call`),request=JSON.parse(fs.readFileSync(path.join(dir,'request-0.json'))),prompt=fs.readFileSync(path.join(dir,'prompt-0.txt'),'utf8');
  check(`${c.id}:${phase}:bundle_matches_source`,request.bundle_sha256===bundle.sha256&&bundle.resources.every(r=>prompt.includes(r.text)));
  check(`${c.id}:${phase}:no_other_test_inputs`,cases.filter(other=>other.id!==c.id).every(other=>!prompt.includes(other.text)));
  check(`${c.id}:${phase}:no_expected_resource`,request.resources.every(r=>!r.path.includes('tests/')&&!r.path.includes('expected')));
 }
}
const files=fileInventory(ROOT).filter(f=>f.endsWith('.mjs'));
check('no_legacy_runtime_imports',files.every(f=>!fs.readFileSync(f,'utf8').split('\n').filter(l=>l.startsWith('import ')).some(l=>/v0\.3|v0\.4-llm-semantic-027|candidate-parsing|hanlp|spacy/i.test(l))));
const oldSeal='docs/reports/7plus1/7P-LLM-SEMANTIC-COMPILER-027-LONG/SEAL.json';
if(fs.existsSync(oldSeal))check('027_seal_unchanged',sha256(fs.readFileSync(oldSeal))==='b99c89aaea944c4b4055484439e4310067394e01f64863c45dba7b35494c9a26');
const taskBlob=execFileSync('git',['hash-object','docs/tasks/7plus1/7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG.md'],{encoding:'utf8'}).trim(),manualBlob=execFileSync('git',['hash-object','docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md'],{encoding:'utf8'}).trim();
check('task_manual_r02_blobs',taskBlob==='be8acf6af83b54e0e95b471b2ced3ecb93eeaffd'&&manualBlob==='58db3ddab5327173fd15cfe5d8bd1e6c3f2825ff',{taskBlob,manualBlob});
const summary={pass:checks.every(c=>c.pass),unit_exit_code:units.status,unit_tests:13,unit_fail:units.status===0?0:null,checks,scope:'program selfchecks + same 13 short texts; no legacy full regression'};
fs.writeFileSync(path.join(output,'TESTS.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({pass:summary.pass,checks:checks.length,fail:checks.filter(c=>!c.pass)}));if(!summary.pass)process.exitCode=1;
