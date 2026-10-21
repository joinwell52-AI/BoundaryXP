import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
let code=fs.readFileSync('product/short-compiler/compare-joint-regression-final.mjs','utf8');
code=code.replaceAll('JOINT-BOUNDARY-CLOSURE-r01/regression-comparable-final','SCOPE-CONSUMPTION-CLOSURE-r01/regression-comparable').replaceAll('0.1.0-candidate.031-r1.2-ui.57','0.1.0-candidate.031-r1.2-ui.59').replaceAll('.boundx/joint-comparable-regression-final','.boundx/scope-comparable-regression');
code=code.replace("'joint-signature-gates.test.mjs'","'joint-signature-gates.test.mjs','scope-domain-closure.test.mjs'");
const file=path.resolve('.boundx/scope-regression-launch.mjs');fs.writeFileSync(file,code,{flag:'wx'});const r=spawnSync(process.execPath,[file],{stdio:'inherit',windowsHide:true});process.exitCode=r.status;
