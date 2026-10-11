import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
let code=fs.readFileSync('product/short-compiler/run-local-condition-regression.mjs','utf8');
code=code.replaceAll('LOCAL-CONDITION-REPAIR-r01/regression','MATHEMATICAL-RESULT-CLOSURE-r01/regression-ui46')
 .replace("'local-condition-assessment.test.mjs'","'local-condition-assessment.test.mjs','observation-product.test.mjs','observation-ui.test.mjs','boundary-local-issue.test.mjs','boundary-order-independence.test.mjs','boundary-order-calculus.test.mjs','mathematical-result-report.test.mjs','mathematical-result-ui.test.mjs'")
 .replace('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.38','.boundx/products/0.1.0-candidate.031-r1.2-ui.44')
 .replace('.boundx/products/0.1.0-candidate.031-r1.2-ui.39','.boundx/products/0.1.0-candidate.031-r1.2-ui.46');
const runner=path.resolve('.boundx/local-boundary-repair-r07/regression-ui46-runner.mjs');fs.writeFileSync(runner,code,{flag:'wx'});const r=spawnSync(process.execPath,[runner],{stdio:'inherit',windowsHide:true});process.exitCode=r.status??1;
