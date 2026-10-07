import fs from 'node:fs';
import path from 'node:path';
import {parse7Plus1,replay7Plus1} from './engine.mjs';
const args=process.argv.slice(2),get=flag=>args[args.indexOf(flag)+1];
if(!args.includes('--input')||!args.includes('--output')){console.error('Usage: node research/7plus1-parser/llm-first-028/cli.mjs --input task.txt --output new-run-directory [--model gpt-6.1-sol] [--reasoning medium] [--no-semantic-revision]');process.exit(2);}
try{const bytes=fs.readFileSync(path.resolve(get('--input'))),options={output:path.resolve(get('--output'))};const result=args.includes('--replay-from')?replay7Plus1(bytes,{...options,replayFrom:path.resolve(get('--replay-from'))}):await parse7Plus1(bytes,{...options,model:args.includes('--model')?get('--model'):'gpt-6.1-sol',reasoning:args.includes('--reasoning')?get('--reasoning'):'medium',semanticRevision:!args.includes('--no-semantic-revision'),maxModelRequests:args.includes('--request-budget')?Number(get('--request-budget')):undefined});console.log(result.chinese);}catch(e){console.error(e.stack);process.exitCode=1;}
