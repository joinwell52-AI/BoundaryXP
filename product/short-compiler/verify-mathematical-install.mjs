import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
const original=fs.readFileSync('product/short-compiler/verify-boundary-install-ui44.mjs','utf8');
const code=original.replaceAll('0.1.0-candidate.031-r1.2-ui.44','0.1.0-candidate.031-r1.2-ui.45').replaceAll('BOUNDARY-SEMANTIC-REPAIR-r06','MATHEMATICAL-RESULT-CLOSURE-r01').replaceAll('local-boundary-repair-r06','local-boundary-repair-r07').replace("from './resources.mjs'","from '"+new URL('./resources.mjs',import.meta.url).href+"'");
const runner=path.resolve('.boundx/local-boundary-repair-r07/install-runner.mjs');fs.writeFileSync(runner,code,{flag:'wx'});const r=spawnSync(process.execPath,[runner],{stdio:'inherit',windowsHide:true});process.exitCode=r.status??1;
