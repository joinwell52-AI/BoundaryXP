import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
const name=process.argv[2],root=path.resolve(process.argv[3]);
if(!/^[a-z0-9-]+$/.test(name??''))throw Error('ROUND_REQUIRED');
const out=path.resolve('docs/reports/7plus1/LOCAL-CONDITION-REPAIR-r01',name);if(fs.existsSync(out))throw Error('FIRST_RESULT_EXISTS');fs.mkdirSync(out,{recursive:true});
const r=spawnSync(process.execPath,['--test','--test-reporter=tap','product/short-compiler/tests/local-condition-assessment.test.mjs'],{windowsHide:true,encoding:'utf8',env:{...process.env,BOUNDARYXP_INPUT_TEST_ROOT:root}});
fs.writeFileSync(path.join(out,'tests.tap'),r.stdout??'',{flag:'wx'});fs.writeFileSync(path.join(out,'stderr.txt'),r.stderr??'',{flag:'wx'});
const summary={root,exit_code:r.status,counts:Object.fromEntries(['tests','pass','fail'].map(k=>[k,Number(r.stdout.match(new RegExp('^# '+k+' (\\d+)','m'))?.[1]??0)])),real_model_calls:0};
fs.writeFileSync(path.join(out,'RESULT.json'),JSON.stringify(summary,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(summary));process.exitCode=r.status;
