import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
const final=['final','delivery'].includes(process.argv[2]),number=process.argv[2]==='delivery'?'36':final?'35':'33';
const report=path.resolve('docs/reports/7plus1/MANUAL-CONTRACT-REPAIR-r01/'+(number==='36'?'regression-delivery':final?'regression-final':'regression'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const tests=fs.readdirSync('product/short-compiler/tests').filter(f=>f.endsWith('.test.mjs')&&f!=='event-property-immediacy.test.mjs').sort();
for(const [label,root] of [['parent','.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.32'],['candidate','.boundx/products/0.1.0-candidate.031-r1.2-ui.'+number]]){
 const dir=path.join(report,label),absolute=path.resolve(root);if(fs.existsSync(dir))throw Error('FIRST_RESULT_EXISTS');fs.mkdirSync(dir,{recursive:true});const ledger=[];
 for(const name of tests){const original=fs.readFileSync('product/short-compiler/tests/'+name,'utf8');const text=original.replace(/(['"])\.\.\/\.\.\/\.\.\/(research\/[^'"\n]+)\1/g,(_,q,p)=>q+pathToFileURL(path.join(absolute,p)).href+q).replace(/(['"])\.\.\/([^'"\n]+\.mjs)\1/g,(_,q,p)=>q+pathToFileURL(path.resolve('product/short-compiler',p)).href+q);fs.writeFileSync(path.join(dir,name),text,{flag:'wx'});ledger.push({name,original_sha256:sha(original),harness_sha256:sha(text),assertions_changed:false});}
 const env={...process.env};for(const key of ['BOUNDX_COMPACT_TEST_ROOT','BOUNDX_INPUT_TEST_ROOT','BOUNDX_TIMING_TEST_ROOT','BOUNDX_COMPARISON_ROOT','BOUNDX_EFFICIENCY_TEST_ROOT','BOUNDX_SEMANTIC_TEST_ROOT','BOUNDX_IDENTITY_TEST_ROOT'])env[key]=absolute;
 const r=spawnSync(process.execPath,['--test','--test-concurrency=1','--test-reporter=tap',...tests.map(f=>path.join(dir,f))],{env,encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:20*1024*1024});
 fs.writeFileSync(path.join(dir,'tests.tap'),r.stdout??'',{flag:'wx'});fs.writeFileSync(path.join(dir,'stderr.txt'),r.stderr??'',{flag:'wx'});
 const counts=Object.fromEntries(['tests','pass','fail','skipped'].map(k=>[k,Number(r.stdout?.match(new RegExp('^# '+k+' (\\d+)','m'))?.[1]??0)]));
 const failures=[...(r.stdout??'').matchAll(/^not ok \d+ - (.+)$/gm)].map(x=>x[1].includes('.test.mjs')?path.basename(x[1]):x[1]);
 fs.writeFileSync(path.join(dir,'RESULT.json'),JSON.stringify({root:absolute,exit_code:r.status,counts,failures,ledger,real_model_calls:0,error:r.error?.message??null},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({label,counts,failures}));
}
const read=l=>JSON.parse(fs.readFileSync(path.join(report,l,'RESULT.json'))),before=read('parent'),after=read('candidate');const result={before:before.counts,after:after.counts,new_failures:after.failures.filter(f=>!before.failures.includes(f)),closed_failures:before.failures.filter(f=>!after.failures.includes(f)),full_regression_pass:after.counts.fail===0&&after.exit_code===0,semantic_accuracy_claim:false};
fs.writeFileSync(path.join(report,'COMPARISON.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
