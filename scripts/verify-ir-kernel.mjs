import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),output=path.resolve(process.argv[2]??path.join(root,'.boundx/kernel-validation',new Date().toISOString().replace(/[:.]/g,'-')));
if(fs.existsSync(output))throw Error('EVIDENCE_OUTPUT_ALREADY_EXISTS');fs.mkdirSync(output,{recursive:true});
const groups={kernel:fs.readdirSync(path.join(root,'tests/ir-kernel')).filter(x=>x.endsWith('.test.mjs')).map(x=>'tests/ir-kernel/'+x),legacy:fs.readdirSync(path.join(root,'tests')).filter(x=>(x.startsWith('direct-ir-')||x==='direct-candidate-ir.test.mjs')&&x.endsWith('.test.mjs')&&x!=='direct-ir-skill-profiles.test.mjs').map(x=>'tests/'+x)};
const results=[];
for(const [group,files]of Object.entries(groups)){
 for(const file of files)if(/\.listen\s*\(|createServer\s*\(/.test(fs.readFileSync(path.join(root,file),'utf8')))throw Error('LISTENING_TEST_FORBIDDEN:'+file);
 const run=spawnSync(process.execPath,['--test','--test-concurrency=1','--test-reporter=tap',...files],{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:32*1024*1024,timeout:300000});
 fs.writeFileSync(path.join(output,group+'.tap'),run.stdout??'');fs.writeFileSync(path.join(output,group+'.stderr'),run.stderr??'');const count=k=>Number(run.stdout?.match(new RegExp('^# '+k+' (\\d+)$','m'))?.[1]??0);
 results.push({group,files,exit_code:run.status,tests:count('tests'),pass:count('pass'),fail:count('fail'),cancelled:count('cancelled'),error:run.error?.message??null});
}
const report={format:'boundx-kernel-program-checks/1',created_at:new Date().toISOString(),node:process.version,platform:process.platform,results,generated_seeds:{finite_boolean:{first:1,last:256},backend_differential:{first:1,last:12}},tested_model_calls:0,listeners_started:0,status:results.every(r=>r.exit_code===0&&r.fail===0)?'PASS':'FAIL',not_full_task_acceptance:true};
fs.writeFileSync(path.join(output,'PROGRAM-CHECKS.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({output,...report}));if(report.status!=='PASS')process.exitCode=1;
