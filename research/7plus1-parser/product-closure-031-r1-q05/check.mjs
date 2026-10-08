import fs from 'node:fs';import path from 'node:path';import {spawn,execFileSync} from 'node:child_process';
import {sha256} from '../llm-first-028/source.mjs';
export const report=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-Q05');
export const oldReport=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG');
export const write=(name,x)=>{fs.mkdirSync(path.dirname(path.join(report,name)),{recursive:true});fs.writeFileSync(path.join(report,name),JSON.stringify(x,null,2)+'\n',{flag:'wx'});};
if(process.argv[2]==='prepare'){
 if(fs.existsSync(report))throw Error('REPORT_EXISTS');fs.mkdirSync(report,{recursive:true});
 const snapshot=JSON.parse(fs.readFileSync('.boundx/experiments/031-r1/pre-sync/snapshot.json'));
 const verify=()=>snapshot.dirty.map(x=>({path:x.file,ok:fs.existsSync(x.file)===x.exists&&(!x.exists||sha256(fs.readFileSync(x.file))===x.sha256)}));
 const old=JSON.parse(fs.readFileSync(path.join(oldReport,'MANIFEST.json')));const oldFiles=Array.isArray(old.files)?old.files:[];
 const fields=Object.keys(oldFiles[0]??{});write('PROTECTION-BASELINE.json',{at:new Date().toISOString(),base_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),original_tracked:verify(),prior_seal_sha256:sha256(fs.readFileSync(path.join(oldReport,'SEAL.json'))),prior_manifest_sha256:sha256(fs.readFileSync(path.join(oldReport,'MANIFEST.json'))),prior_manifest_fields:fields,
  candidate58621_manifest_sha256:sha256(fs.readFileSync('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2/PRODUCT-MANIFEST.json'))});
 const original=JSON.parse(fs.readFileSync(path.join(oldReport,'MODEL-CALL-AUDIT.json')));
 write('BUDGET-BASELINE.json',{prior_report:'../7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG/MODEL-CALL-AUDIT.json',original,limit:180,prior_conservative:159,remaining:21,old031_separate:true,full_new_method_normal_requests:142,new_52_pass_claim:false});
}
if(['core','full','service'].includes(process.argv[2])){
 const phase=process.argv[2],glob=phase==='core'?'research/7plus1-parser/llm-first-028/tests/*.test.mjs':phase==='service'?'tests/parser-v03-p21-service.test.mjs':'tests/*.test.mjs';
 const fd=fs.openSync(path.join(report,phase+'.log'),'wx'),start=Date.now();let tail='';
 const child=spawn(process.execPath,['--test','--test-concurrency=1',glob],{windowsHide:true,stdio:['ignore','pipe','pipe']});
 for(const stream of [child.stdout,child.stderr])stream.on('data',b=>{fs.writeSync(fd,b);tail=(tail+b.toString()).slice(-18000);});
 const code=await new Promise(r=>child.on('close',r));fs.closeSync(fd);const n=k=>Number(tail.match(new RegExp('(?:ℹ |# )'+k+' (\\d+)'))?.[1]??-1);
 const result={exit_code:code,total:n('tests'),pass:n('pass'),fail:n('fail'),skip:n('skipped'),elapsed_ms:Date.now()-start};write(phase+'-RESULTS.json',result);console.log(JSON.stringify(result));
}
