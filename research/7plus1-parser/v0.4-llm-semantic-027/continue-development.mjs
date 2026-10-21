// Infrastructure recovery only. Never retry or replace a started first attempt.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {REPORT,read,save,sha} from './util.mjs';
import {parseBoundary} from './engine.mjs';
import {SemanticParserPort} from './semantic-parser-port.mjs';
import {FrozenCodexProvider} from './providers/frozen-codex.mjs';
const prefix=REPORT+'/runs/development-v1',rows=read(REPORT+'/SPLIT-FREEZE.json').rows.filter(r=>r.split==='development'),results=[],pending=[],interrupted=[];
if(fs.existsSync(prefix+'/RESULTS.json'))throw Error('FIRST_DEVELOPMENT_ALREADY_COMPLETED');
const snapshot=read(REPORT+'/IMPLEMENTATION-v1.json');for(const f of snapshot.files)if(sha(fs.readFileSync(f.path))!==f.sha256)throw Error('INITIAL_METHOD_CHANGED '+f.path);
const receipt=read(REPORT+'/environment/PROVIDER-PROBE-r002.json').actual.receipt,configuration={executable:receipt.executable,executable_sha256:receipt.executable_sha256,version:receipt.version,model_configuration:receipt.model_configuration};
const temp=fs.readdirSync(os.tmpdir(),{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name.startsWith('boundx-027-')).map(e=>path.join(os.tmpdir(),e.name)).filter(p=>fs.existsSync(path.join(p,'request.txt')));
for(const row of rows){const base=`${prefix}/${row.corpus}/${row.id}`;
 if(fs.existsSync(base+'/trace.json')){if(!fs.existsSync(base+'/canonical.json'))throw Error('COMPLETE_TRACE_WITHOUT_CANONICAL');results.push({...row,status:'OUTPUT_SAVED',elapsed_ms:null,trace:base+'/trace.json',canonical:base+'/canonical.json',retained_first_output:true});continue;}
 if(fs.existsSync(base+'/ERROR.json')){const error=read(base+'/ERROR.json');results.push({...row,status:'ERROR',elapsed_ms:null,error:error.error,retained_first_error:true});continue;}
 if(fs.existsSync(base+'/provider')){const stages=fs.readdirSync(base+'/provider'),orphans=[];
  for(const stage of stages){const p=base+'/provider/'+stage;if(fs.existsSync(p+'/RECEIPT.json'))continue;if(!fs.existsSync(p+'/request.txt'))continue;const requestHash=sha(fs.readFileSync(p+'/request.txt'));
   for(const directory of temp.filter(d=>sha(fs.readFileSync(path.join(d,'request.txt')))===requestHash)){const response=path.join(directory,'response.json'),record={stage,directory,request_sha256:requestHash,response_present:fs.existsSync(response),exit_code:'NOT_RECOVERABLE',stdout_stderr:'NOT_RECOVERABLE_FROM_INTERRUPTED_PARENT'};
    if(record.response_present){const destination=p+'/interrupted-orphan-response.json';save(destination,fs.readFileSync(response,'utf8'));record.preserved_response=destination;record.response_sha256=sha(fs.readFileSync(response));}orphans.push(record);
   }
  }
  const error={error:'ENVIRONMENT_PROCESS_INTERRUPTED',classification:'FIRST_ATTEMPT_ENVIRONMENT_FAILURE',detected_at:new Date().toISOString(),completed_trace:false,existing_raw_requests_responses_preserved:true,exit_status_unavailable:true,retry_performed:false,orphans};save(base+'/ERROR.json',error);interrupted.push({id:row.id,...error});results.push({...row,status:'ERROR',elapsed_ms:null,error:error.error});continue;
 }
 pending.push(row);
}
save(REPORT+'/EXECUTION-CONTINUATION.json',{created_at:new Date().toISOString(),reason:'Original execution sessions became unknown; operating-system process inventory contained no original node or Codex task process',original_completed:results.filter(r=>r.trace).length,original_interrupted:interrupted,pending_first_calls:pending.length,original_first_outputs_unchanged:true,retry_of_started_calls:false,concurrency:12,infrastructure_change_only:true,provider_configuration:configuration,semantic_method_unchanged:true});
let index=0;async function worker(){while(index<pending.length){const row=pending[index++],base=`${prefix}/${row.corpus}/${row.id}`,start=Date.now();try{const t=await parseBoundary(fs.readFileSync(row.source_path,'utf8'),{receipt_dir:base+'/provider',nlp:read(row.nlp_path),port:new SemanticParserPort(new FrozenCodexProvider(configuration))});save(base+'/trace.json',t);save(base+'/canonical.json',t.canonical_7plus1);results.push({...row,status:'OUTPUT_SAVED',elapsed_ms:Date.now()-start,trace:base+'/trace.json',canonical:base+'/canonical.json'});}catch(e){save(base+'/ERROR.json',{error:String(e),details:e.details??null,receipt:e.receipt??null});results.push({...row,status:'ERROR',elapsed_ms:Date.now()-start,error:String(e)});}console.log(JSON.stringify({done:results.length,total:245,last:row.id,status:results.at(-1).status}));}}
await Promise.all(Array.from({length:12},worker));
save(prefix+'/RESULTS.json',{split:'development',revision:'v1',total:245,rows:results.sort((a,b)=>a.corpus.localeCompare(b.corpus)||a.id.localeCompare(b.id)),errors:results.filter(r=>r.status==='ERROR').length,first_results_never_overwritten:true,continuation:REPORT+'/EXECUTION-CONTINUATION.json'});
