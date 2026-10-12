import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {parse7Plus1,replay7Plus1} from './engine.mjs';
export async function runCLI(args=process.argv.slice(2),{resourceGuard=()=>{},productSnapshot=null}={}){
 const get=flag=>args[args.indexOf(flag)+1];
 if(!args.includes('--input')||!args.includes('--output')){console.error('Usage: 7plus1 --input task.txt --output new-run-directory [--request-budget N]');process.exitCode=2;return;}
 try{resourceGuard();const bytes=fs.readFileSync(path.resolve(get('--input'))),options={output:path.resolve(get('--output')),resourceGuard,productSnapshot};
  const result=args.includes('--replay-from')?replay7Plus1(bytes,{...options,replayFrom:path.resolve(get('--replay-from'))}):await parse7Plus1(bytes,{...options,parseMethod:args.includes('--parse-method')?String(get('--parse-method')).toUpperCase():'SKILL',model:args.includes('--model')?get('--model'):'gpt-6.1-sol',reasoning:args.includes('--reasoning')?get('--reasoning'):'medium',semanticRevision:!args.includes('--no-semantic-revision'),maxModelRequests:args.includes('--request-budget')?Number(get('--request-budget')):undefined});
  resourceGuard();console.log(result.chinese);
 }catch(e){console.error(e.stack);process.exitCode=1;}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await runCLI();

