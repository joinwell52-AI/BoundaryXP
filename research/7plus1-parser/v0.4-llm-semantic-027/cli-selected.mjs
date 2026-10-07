import fs from 'node:fs';
import {parseBoundary as parseV1,compileProposal as compileV1} from './engine.mjs';
import {parseBoundary as parseV2,compileProposal as compileV2} from './engine-policy-v2.mjs';
import {sourceDocument} from './source.mjs';
import {REPORT,read,save,sha} from './util.mjs';
import {SemanticParserPort} from './semantic-parser-port.mjs';
import {FrozenCodexProvider} from './providers/frozen-codex.mjs';
const [command,input,...args]=process.argv.slice(2);
if(command!=='parse-boundary'||!input)throw Error('Usage: node cli-selected.mjs parse-boundary task.md --provider codex-local --json new.json --receipts new-directory');
const option=k=>{const i=args.indexOf(k);return i>=0?args[i+1]:null;},provider=option('--provider')??'codex-local',output=option('--json');
let t;if(provider==='codex-local'){const freeze=read(REPORT+'/METHOD-FREEZE.json');for(const f of [...freeze.files,...freeze.evaluation_files])if(sha(fs.readFileSync(f.path))!==f.sha256)throw Error('FROZEN_METHOD_MODIFIED '+f.path);const environment=read(REPORT+'/METHOD-ENVIRONMENT-FREEZE.json');if(environment.node_version!==process.version)throw Error('FROZEN_NODE_VERSION_MODIFIED');for(const f of environment.files)if(sha(fs.readFileSync(f.path))!==f.sha256)throw Error('FROZEN_ENVIRONMENT_MODIFIED '+f.path);t=await(freeze.selected_policy==='policy-v2'?parseV2:parseV1)(fs.readFileSync(input,'utf8'),{receipt_dir:option('--receipts')??output+'.receipts',port:new SemanticParserPort(new FrozenCodexProvider(freeze.provider_configuration))});}
else if(provider==='replay'){const r=read(input);if(!Object.hasOwn(r,'nlp_input'))throw Error('REPLAY_NLP_INPUT_NOT_RECORDED');t=(r.engine.endsWith('policy-v2')?compileV2:compileV1)(sourceDocument(r.source.raw_text),r.parser_proposal,r.auditor_response,{nlp:r.nlp_input,receipts:r.provider_receipts});}
else throw Error('MOCK_PROVIDER_IS_TEST_ONLY');
if(output)save(output,t);else process.stdout.write(JSON.stringify(t,null,2)+'\n');
