import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {executable} from './providers/codex.mjs';
import {REPORT,save,sha} from './util.mjs';
const revision=process.argv[2];if(!revision||!/^[\w-]+$/u.test(revision))throw Error('INVALID_REVISION');
const exe=executable(),commands=[['version',['--version']],['help',['--help']],['exec-help',['exec','--help']],['features',['features','list']]],results=[];
for(const [name,args]of commands){const r=spawnSync(exe,args,{encoding:'utf8',windowsHide:true});save(`${REPORT}/environment/${revision}/${name}.txt`,r.stdout??'');save(`${REPORT}/environment/${revision}/${name}.stderr.txt`,r.stderr??'');results.push({name,args,exit_code:r.status});}
save(`${REPORT}/environment/${revision}/ENVIRONMENT.json`,{executable:exe,sha256:sha(fs.readFileSync(exe)),commands:results,recorded_at:new Date().toISOString(),reason:'Revalidate actual capabilities after the previously used desktop executable disappeared'});
console.log(JSON.stringify({exe,results}));
