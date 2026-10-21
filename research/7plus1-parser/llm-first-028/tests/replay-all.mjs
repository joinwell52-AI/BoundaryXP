import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT} from '../bundle.mjs';
import {cases} from './short-texts.mjs';
import {evaluate} from './evaluate.mjs';
const args=process.argv.slice(2),input=path.resolve(args[0]),output=path.resolve(args[1]);
if(!args[0]||!args[1])throw Error('replay-all.mjs first-directory new-final-directory');
fs.mkdirSync(output,{recursive:true});
const results=[];
for(const c of cases){
 const dir=path.join(output,c.id);
 const command=[path.join(ROOT,'cli.mjs'),'--input',path.join(input,c.id,'source.txt'),'--output',dir,'--replay-from',path.join(input,c.id)];
 const r=spawnSync(process.execPath,command,{encoding:'utf8',windowsHide:true,timeout:30000});
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'cli-receipt.json'),JSON.stringify({command:[process.execPath,...command],exit_code:r.status,error:r.error?.message??null,execution_mode:'FROZEN_RESPONSE_REPLAY',real_calls:0},null,2)+'\n');
 fs.writeFileSync(path.join(dir,'cli-stdout.md'),r.stdout??'');fs.writeFileSync(path.join(dir,'cli-stderr.txt'),r.stderr??'');
 if(r.status!==0){results.push({id:c.id,end_to_end:false,error:r.stderr});continue;}
 const trace=JSON.parse(fs.readFileSync(path.join(dir,'trace.json'))),evaluation=evaluate(c,trace);
 fs.writeFileSync(path.join(dir,'evaluation.json'),JSON.stringify(evaluation,null,2)+'\n');results.push(evaluation);
 console.log(`${c.id} semantic=${evaluation.semantic} end_to_end=${evaluation.end_to_end}`);
}
fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(results,null,2)+'\n');
