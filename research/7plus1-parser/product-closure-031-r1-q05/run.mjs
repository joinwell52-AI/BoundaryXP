import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {report,oldReport,write} from './check.mjs';import {lockProduct} from '../../../product/short-compiler/resources.mjs';
const root=path.resolve('.boundx/experiments/031-r1/packages/q05-c1'),lock=lockProduct(root);
const {parse7Plus1}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/engine.mjs')));
const {probeCodex,callCodex}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/provider.mjs')));
const oldEnvironment=JSON.parse(fs.readFileSync(path.join(oldReport,'ENVIRONMENT.json'))),probe=probeCodex(fs.existsSync(oldEnvironment.binary)?oldEnvironment.binary:undefined);
write('CLI-ENVIRONMENT-CHANGE.json',{old_binary:oldEnvironment.binary,old_binary_exists:fs.existsSync(oldEnvironment.binary),new_binary:probe.binary,new_version:probe.version,new_sha256:probe.binary_sha256,model_unchanged:true,provider_unchanged:true,old_probe_failure:'ENOENT before any model request',official_reference:'https://developers.openai.com/codex/noninteractive/'});
write('ENVIRONMENT.json',probe);write('FROZEN-CANDIDATE.json',{snapshot:lock.snapshot,manifest:JSON.parse(fs.readFileSync(path.join(root,'PRODUCT-MANIFEST.json'))),not_installed:true,service58621_unchanged:true});
const plan=JSON.parse(fs.readFileSync(path.join(report,'VALIDATION-PLAN.json'))),walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]):[];
const counts=()=>{const files=walk(path.join(report,'runs')),outer=files.filter(f=>/request-\d+\.json$/.test(f)).length,retry=files.filter(f=>/stderr-\d+\.txt$/.test(f)).reduce((n,f)=>n+(fs.readFileSync(f,'utf8').match(/retrying sampling request|stream connection failed; waiting to retry/g)??[]).length,0);return{outer,observed_internal_retries:retry,prior_conservative:159,total_conservative:159+outer+retry,remaining:180-159-outer-retry};};
const singleCall=async opts=>{
 lock.verify();if(counts().remaining<2)throw Error('CONSERVATIVE_BUDGET_RESERVED');
 if(opts.requestBudget.remaining<=0)throw Error('MODEL_REQUEST_BUDGET_EXHAUSTED');opts.requestBudget.remaining--;
 // Preserve production provider; evaluation allows one transport attempt per phase, not retries until success.
 const result=await callCodex({...opts,requestBudget:{remaining:1}});lock.verify();return result;
};
let stopped=null,networkFailures=0;const outcomes=[];
for(const c of plan.cases){
 if(stopped){outcomes.push({id:c.id,status:'NOT_RUN',reason:stopped});continue;}
 const remaining=counts().remaining;if(remaining<3){stopped='REQUEST_BUDGET';outcomes.push({id:c.id,status:'NOT_RUN',reason:stopped});continue;}
 const maximum=Math.min(4,remaining-1),start=Date.now();console.log('START '+c.id+' '+JSON.stringify(counts()));
 const dir=path.join(report,'runs',c.id);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'launch.json'),JSON.stringify({id:c.id,at:new Date().toISOString(),maximum_outer_requests:maximum,model:'gpt-6.1-sol',reasoning:'medium',snapshot:lock.snapshot.manifest_sha256},null,2)+'\n',{flag:'wx'});
 let result;try{
  const t=await parse7Plus1(fs.readFileSync(path.join(report,'inputs',c.id+'.txt')),{output:path.join(dir,'run'),probe,model:'gpt-6.1-sol',reasoning:'medium',maxModelRequests:maximum,call:singleCall,resourceGuard:lock.verify,productSnapshot:lock.snapshot});
  result={id:c.id,status:'RUN_SUCCEEDED',semantic_status:'NOT_REVIEWED',revision:t.revision,slot_status:Object.fromEntries(Object.entries(t.canonical.slots).map(([s,v])=>[s,v.status]))};networkFailures=0;
 }catch(e){result={id:c.id,status:'RUN_FAILED',error:e.message,semantic_status:'NOT_REVIEWED'};if(/QUOTA|LOGIN|MODEL_UNAVAILABLE|ENV_UNAVAILABLE|blocked by policy/i.test(e.message))stopped='EXTERNAL_BLOCKER';if(/NETWORK|TRANSPORT|TIMEOUT/.test(e.message))networkFailures++;if(networkFailures>=3)stopped='THREE_NETWORK_FAILURES';}
 result.elapsed_ms=Date.now()-start;result.budget_after=counts();fs.writeFileSync(path.join(dir,'execution.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});outcomes.push(result);console.log('END '+JSON.stringify(result));
}
write('REAL-RUNS.json',{outcomes,counts:counts(),stopped,new_method_full_validation:'NOT_COMPLETE',old52_results_not_carried_as_model_pass:true});console.log('FINAL '+JSON.stringify(counts()));
