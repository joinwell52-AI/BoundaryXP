// Explicit transport recovery before method freeze. Original results stay sealed
// as first attempts; semantic errors are never eligible for this recovery.
import fs from 'node:fs';
import {REPORT,read,save,sha} from './util.mjs';
import {parseBoundary} from './engine.mjs';
import {SemanticParserPort} from './semantic-parser-port.mjs';
import {FrozenCodexProvider} from './providers/frozen-codex.mjs';
if(fs.existsSync(REPORT+'/METHOD-FREEZE.json'))throw Error('DEVELOPMENT_RECOVERY_AFTER_FREEZE_FORBIDDEN');
const first=read(REPORT+'/runs/development-v1/RESULTS.json'),prefix=REPORT+'/runs/development-v1-recovered';
if(fs.existsSync(prefix))throw Error('RECOVERY_RESULTS_EXIST');
for(const f of read(REPORT+'/IMPLEMENTATION-v1.json').files)if(sha(fs.readFileSync(f.path))!==f.sha256)throw Error('ORIGINAL_METHOD_CHANGED');
const probe=read(REPORT+'/environment/PROVIDER-PROBE-r003.json');if(probe.status!=='PASS')throw Error('RECOVERY_PROVIDER_PROBE_NOT_PASS');
const configuration=probe.actual.receipt;
const pending=first.rows.filter(r=>r.status==='ERROR'&&['ENVIRONMENT_PROCESS_INTERRUPTED','Error: FROZEN_CODEX_EXECUTABLE_CHANGED'].includes(r.error)),results=first.rows.filter(r=>!pending.includes(r));
save(prefix+'/PLAN.json',{reason:'Execution processes disappeared and old desktop binary was removed; current binary help/catalog/call were revalidated',total:245,retained:results.length,environment_recovery:pending.length,first_results:REPORT+'/runs/development-v1/RESULTS.json',first_results_sha256:sha(fs.readFileSync(REPORT+'/runs/development-v1/RESULTS.json')),concurrency:12,parser_schema_prompt_gamma_unchanged:true,model_and_reasoning_unchanged:true,old_cli_version:'codex-cli 0.160.0',new_cli_version:configuration.version,not_a_first_attempt_pass_claim:true});
let index=0;async function worker(){while(index<pending.length){const row=pending[index++],base=`${prefix}/${row.corpus}/${row.id}`,start=Date.now();try{const t=await parseBoundary(fs.readFileSync(row.source_path,'utf8'),{receipt_dir:base+'/provider',nlp:read(row.nlp_path),port:new SemanticParserPort(new FrozenCodexProvider(configuration))});save(base+'/trace.json',t);save(base+'/canonical.json',t.canonical_7plus1);results.push({...row,status:'OUTPUT_SAVED',error:null,elapsed_ms:Date.now()-start,trace:base+'/trace.json',canonical:base+'/canonical.json',transport_recovery:true,original_first_error:row.error});}catch(e){save(base+'/ERROR.json',{error:String(e),details:e.details??null,receipt:e.receipt??null});results.push({...row,error:String(e),original_first_error:row.error,elapsed_ms:Date.now()-start,transport_recovery:true});}console.log(JSON.stringify({done:results.length,total:245,last:row.id,status:results.at(-1).status}));}}
await Promise.all(Array.from({length:12},worker));
save(prefix+'/RESULTS.json',{split:'development',revision:'v1-recovered',total:245,rows:results.sort((a,b)=>a.corpus.localeCompare(b.corpus)||a.id.localeCompare(b.id)),errors:results.filter(r=>r.status==='ERROR').length,original_first_errors_retained:first.errors,environment_recovery_not_semantic_tuning:true});
