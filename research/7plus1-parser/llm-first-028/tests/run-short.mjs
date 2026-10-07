import fs from 'node:fs';
import path from 'node:path';
import {cases} from './short-texts.mjs';
import {evaluate} from './evaluate.mjs';
import {parse7Plus1,writeJSON} from '../engine.mjs';
import {probeCodex} from '../provider.mjs';
const args=process.argv.slice(2),get=flag=>args[args.indexOf(flag)+1];
const output=path.resolve(get('--output'));
fs.mkdirSync(output,{recursive:true});
const selected=args.includes('--case')?cases.filter(c=>c.id===get('--case')):cases.slice(1);
if(!selected.length)throw Error('INVALID_CASE');
const probe=probeCodex();
const results=[],workers=args.includes('--workers')?Number(get('--workers')):1;
if(!Number.isInteger(workers)||workers<1||workers>3)throw Error('WORKERS_1_TO_3_ONLY');
async function run(c){
 console.log(`START ${c.id}`);
 const dir=path.join(output,c.id);
 try{
  const trace=await parse7Plus1(Buffer.from(c.text,'utf8'),{output:dir,probe});
  const result=evaluate(c,trace);writeJSON(path.join(dir,'evaluation.json'),result);writeJSON(path.join(dir,'expected-test-only.json'),c.expect);results.push(result);
  console.log(`DONE ${c.id} semantic=${result.semantic} end_to_end=${result.end_to_end} failures=${result.failures.length}`);
 }catch(e){const result={id:c.id,status:'ENV_OR_PROGRAM_FAILURE',error:e.stack};fs.mkdirSync(dir,{recursive:true});writeJSON(path.join(dir,'error.json'),result);results.push(result);console.log(`ERROR ${c.id} ${e.message}`);}
 writeJSON(path.join(output,args.includes('--case')?'s00-summary.json':'short-summary.json'),[...results].sort((a,b)=>a.id.localeCompare(b.id)));
}
let cursor=0;
await Promise.all(Array.from({length:workers},async()=>{while(cursor<selected.length)await run(selected[cursor++]);}));
