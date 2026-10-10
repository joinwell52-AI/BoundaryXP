// Verification uses only existing completed responses, with zero model requests.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {lockProduct} from './resources.mjs';
import {processView} from '../../research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js';
const repo=process.cwd(),home=path.join(repo,'.boundx/short-compiler-031-r1');
const report=path.join(repo,'.boundx/short-compiler-031-r1/readable-ui-verification-r04');
fs.mkdirSync(report,{recursive:true});
const base=path.join(home,'versions','0.1.0-candidate.031-r1.2'),target=path.join(home,'versions','0.1.0-candidate.031-r1.2-ui.4');
const a=lockProduct(base),b=lockProduct(target);a.verify();b.verify();
const hash=x=>createHash('sha256').update(x).digest('hex');
const baseEngine=await import(pathToFileURL(path.join(base,'research/7plus1-parser/llm-first-028/engine.mjs')));
const newEngine=await import(pathToFileURL(path.join(target,'research/7plus1-parser/llm-first-028/engine.mjs')));
const cases=[];
for(const entry of fs.readdirSync(path.join(home,'data/runs'))){
 const folder=path.join(home,'data/runs',entry),runFile=path.join(folder,'run.json');if(!fs.existsSync(runFile))continue;
 const record=JSON.parse(fs.readFileSync(runFile,'utf8'));if(!record.status.startsWith('COMPLETED'))continue;
 const beforeHash=hash(fs.readFileSync(path.join(folder,'trace.json'))),bytes=fs.readFileSync(path.join(folder,'source.txt'));
 const old=baseEngine.replay7Plus1(bytes,{replayFrom:folder,output:path.join(report,entry,'base')});
 const fresh=newEngine.replay7Plus1(bytes,{replayFrom:folder,output:path.join(report,entry,'presentation')});
 const canonicalSame=JSON.stringify(old.canonical)===JSON.stringify(fresh.canonical),irSame=JSON.stringify(old.ir)===JSON.stringify(fresh.ir),chineseSame=old.chinese===fresh.chinese;
 const view=processView({...record,result:fresh}),undefinedDisplay=view.stages.flatMap(s=>s.rows).some(r=>r.cells.some(v=>String(v).includes('undefined')));
 const unchanged=beforeHash===hash(fs.readFileSync(path.join(folder,'trace.json')));
 const result={run_id:entry,canonicalSame,irSame,chineseSame,original_trace_unchanged:unchanged,undefinedDisplay,stage_rows:view.stages.map(s=>({id:s.id,rows:s.rows.length})),model_calls:0};
 if(!canonicalSame||!irSame||!chineseSame||!unchanged||undefinedDisplay)throw Error('PRESENTATION_REGRESSION:'+entry);
 cases.push(result);
}
if(cases.length<3)throw Error('EXPECTED_EXISTING_THREE_COMPLETED_RUNS');
const result={status:'PASS',cases,base_manifest:a.snapshot.manifest_sha256,presentation_manifest:b.snapshot.manifest_sha256,model_calls:0};
fs.writeFileSync(path.join(report,'VERIFY.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
