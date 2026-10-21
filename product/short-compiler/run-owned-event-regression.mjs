import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
const candidate=path.resolve(process.argv[2]??'.boundx/owned-event-calculus-r01/work'),round=process.argv[3]??'work';
const report=path.resolve('docs/reports/7plus1/MANUAL-FULL-FLOW-CALCULUS-r01/regression-'+round);
if(fs.existsSync(report))throw Error('FIRST_REGRESSION_RESULTS_EXIST');fs.mkdirSync(report,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const tests=fs.readdirSync('product/short-compiler/tests').filter(x=>x.endsWith('.test.mjs')&&!['event-property-immediacy.test.mjs','owned-event-calculus.test.mjs'].includes(x)).sort();
const envFor=root=>({...process.env,...Object.fromEntries(['BOUNDX_COMPACT_TEST_ROOT','BOUNDX_INPUT_TEST_ROOT','BOUNDX_TIMING_TEST_ROOT','BOUNDX_COMPARISON_ROOT','BOUNDX_EFFICIENCY_TEST_ROOT','BOUNDX_SEMANTIC_TEST_ROOT','BOUNDX_IDENTITY_TEST_ROOT'].map(k=>[k,root]))});
function run(dir,files,env){fs.mkdirSync(dir,{recursive:true});const r=spawnSync(process.execPath,['--test','--test-concurrency=1','--test-reporter=tap',...files],{env,encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:20*1024*1024});
 fs.writeFileSync(path.join(dir,'tests.tap'),r.stdout??'',{flag:'wx'});fs.writeFileSync(path.join(dir,'stderr.txt'),r.stderr??'',{flag:'wx'});
 return {exit_code:r.status,error:r.error?.message??null,counts:Object.fromEntries(['tests','pass','fail','skipped'].map(k=>[k,Number(r.stdout?.match(new RegExp('^# '+k+' (\\d+)','m'))?.[1]??0)])),failures:[...(r.stdout??'').matchAll(/^not ok \d+ - (.+)$/gm)].map(x=>x[1].includes('.test.mjs')?path.basename(x[1]):x[1])};}
const results={};
for(const [label,root]of [['parent',path.resolve('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.36')],['candidate',candidate]]){
 const harness=path.join(report,label+'-harness');fs.mkdirSync(harness);const ledger=[];
 for(const name of tests){const original=fs.readFileSync('product/short-compiler/tests/'+name,'utf8');const text=original.replace(/(['"])\.\.\/\.\.\/\.\.\/(research\/[^'"\n]+)\1/g,(_,q,p)=>q+pathToFileURL(path.join(root,p)).href+q).replace(/(['"])\.\.\/([^'"\n]+\.mjs)\1/g,(_,q,p)=>q+pathToFileURL(path.resolve('product/short-compiler',p)).href+q);fs.writeFileSync(path.join(harness,name),text,{flag:'wx'});ledger.push({name,original_sha256:sha(original),harness_sha256:sha(text),assertions_changed:false});}
 results[label]={root,...run(path.join(report,label),tests.map(x=>path.join(harness,x)),envFor(root)),ledger};fs.writeFileSync(path.join(report,label,'RESULT.json'),JSON.stringify(results[label],null,2)+'\n',{flag:'wx'});
}
const targeted=run(path.join(report,'targeted'),['owned-event-calculus','event-property-immediacy','property-constraints','native-calculus'].map(x=>'product/short-compiler/tests/'+x+'.test.mjs'),envFor(candidate));
const summary={before:results.parent.counts,after:results.candidate.counts,new_failures:results.candidate.failures.filter(x=>!results.parent.failures.includes(x)),closed_failures:results.parent.failures.filter(x=>!results.candidate.failures.includes(x)),targeted,full_regression_pass:results.candidate.exit_code===0&&results.candidate.counts.fail===0,real_model_calls:0,old_tests_and_assertions_unchanged:true};
fs.writeFileSync(path.join(report,'SUMMARY.json'),JSON.stringify(summary,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(summary));
if(summary.new_failures.length||targeted.exit_code!==0)process.exitCode=1;
