import fs from 'node:fs';
import {parseBoundary,compileProposal} from './engine.mjs';
import {sourceDocument} from './source.mjs';
import {read,save} from './util.mjs';
const [command,input,...args]=process.argv.slice(2);
if(command!=='parse-boundary'||!input)throw Error('Usage: node cli.mjs parse-boundary task.md --provider codex-local --json result.json --receipts unique-directory');
const option=k=>{const i=args.indexOf(k);return i>=0?args[i+1]:null;},provider=option('--provider')??'codex-local',output=option('--json');
let result;
if(provider==='codex-local')result=await parseBoundary(fs.readFileSync(input,'utf8'),{receipt_dir:option('--receipts')??output+'.receipts'});
else if(provider==='replay'){const r=read(input);if(!Object.hasOwn(r,'nlp_input'))throw Error('REPLAY_NLP_INPUT_NOT_RECORDED');result=compileProposal(sourceDocument(r.source.raw_text),r.parser_proposal,r.auditor_response,{receipts:r.provider_receipts,nlp:r.nlp_input});}
else throw Error('MOCK_PROVIDER_IS_TEST_ONLY');
if(output)save(output,result);else process.stdout.write(JSON.stringify(result,null,2)+'\n');
