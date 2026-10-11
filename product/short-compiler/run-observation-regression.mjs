import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
const old=fs.readFileSync('product/short-compiler/run-local-condition-regression.mjs','utf8');
const code=old.replaceAll('LOCAL-CONDITION-REPAIR-r01/regression','LOCAL-CONDITION-REPAIR-r02/regression')
 .replaceAll("'local-condition-assessment.test.mjs'","'local-condition-assessment.test.mjs','observation-product.test.mjs','observation-ui.test.mjs'")
 .replace(".boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.38",".boundx/products/0.1.0-candidate.031-r1.2-ui.39")
 .replace(".boundx/products/0.1.0-candidate.031-r1.2-ui.39')]])",".boundx/products/0.1.0-candidate.031-r1.2-ui.40')]])");
const runner=path.resolve('.boundx/local-condition-repair-r02/regression-runner.mjs');fs.writeFileSync(runner,code,{flag:'wx'});
const r=spawnSync(process.execPath,[runner],{stdio:'inherit',windowsHide:true});process.exitCode=r.status??1;
