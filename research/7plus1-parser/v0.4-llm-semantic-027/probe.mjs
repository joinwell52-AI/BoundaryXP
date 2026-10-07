import {CodexProvider} from './providers/codex.mjs';
import {REPORT,read,save} from './util.mjs';
const split=read(`${REPORT}/SPLIT-FREEZE.json`);
if(split.development!==245||split.locked!==105)throw Error('SPLIT_NOT_FROZEN');
const schema={type:'object',properties:{probe:{type:'string',enum:['ready']}},required:['probe'],additionalProperties:false};
const revision=process.argv[2]??'r002';
try{const r=await new CodexProvider().call('This is a transport capability probe, not a business task. Do not use tools, read files, execute commands, browse, or delegate. Return only the structured object with probe = ready.',schema,`${REPORT}/environment/probe-${revision}`);save(`${REPORT}/environment/PROVIDER-PROBE-${revision}.json`,{status:'PASS',actual:r});console.log('AUTOMATIC_PROVIDER_AVAILABLE');}
catch(e){save(`${REPORT}/environment/PROVIDER-PROBE-${revision}.json`,{status:'FAILED',error:String(e),receipt:e.receipt??null});console.log('AUTOMATIC_PROVIDER_FAILED');process.exitCode=1;}
