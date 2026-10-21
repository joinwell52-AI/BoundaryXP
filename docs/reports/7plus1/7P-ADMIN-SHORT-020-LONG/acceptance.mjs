import {execFileSync} from 'node:child_process';import {OUT,read} from './common.mjs';
for(const mode of ['MAIN','OLD_SHADOW','OLD_CONTROLS','DEVELOPMENT','RETENTION']){execFileSync(process.execPath,[OUT+'run.mjs',mode,process.argv[2]],{stdio:'inherit'});const r=read(OUT+'runs/'+mode+'/'+process.argv[2]+'/RESULTS.json');if(r.fail)throw Error(mode+' ACCEPTANCE_FAILED');}
