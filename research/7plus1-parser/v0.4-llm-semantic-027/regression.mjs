import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {REPORT,sha,save} from './util.mjs';
const revision=process.argv[2]??'initial';if(!/^[\w-]+$/u.test(revision))throw Error('INVALID_REGRESSION_REVISION');
const directory=REPORT+(revision==='initial'?'/regression':'/regression-'+revision);fs.mkdirSync(directory,{recursive:true});
async function run(name,exe,args){const stdout=fs.openSync(directory+'/'+name+'.stdout.txt','wx'),stderr=fs.openSync(directory+'/'+name+'.stderr.txt','wx'),start=Date.now();const exit=await new Promise(resolve=>{const c=spawn(exe,args,{cwd:process.cwd(),stdio:['ignore',stdout,stderr],windowsHide:true});c.on('error',e=>resolve({code:null,error:String(e)}));c.on('close',(code,signal)=>resolve({code,signal}));});fs.closeSync(stdout);fs.closeSync(stderr);return {name,exe,args,...exit,elapsed_ms:Date.now()-start,stdout:directory+'/'+name+'.stdout.txt',stderr:directory+'/'+name+'.stderr.txt',stdout_sha256:sha(fs.readFileSync(directory+'/'+name+'.stdout.txt'))};}
const python=await run('source-integrity','python',['fixtures/real-project/BoundX-REAL-GOLD-P001-v0.1/validate_cases.py']);
const files=fs.readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).sort().map(f=>'tests/'+f);
const node=await run('full-node',process.execPath,['--test','--test-concurrency=1',...files]);
const text=fs.readFileSync(node.stdout,'utf8'),count=name=>Number(text.match(new RegExp('(?:ℹ|#) '+name+' (\\d+)'))?.[1]??NaN);
const output=REPORT+(revision==='initial'?'/FULL-REGRESSION.json':'/FULL-REGRESSION-'+revision+'.json');
save(output,{revision,status:python.code===0&&node.code===0&&count('fail')===0?'PASS':'FAIL',source_integrity:python,node,test_files:files.length,tests:count('tests'),pass:count('pass'),fail:count('fail'),skip:count('skipped'),not_semantic_closure_proof:true});
console.log(JSON.stringify({output,status:node.code===0?'PASS':'FAIL',pass:count('pass'),fail:count('fail'),skip:count('skipped')}));
