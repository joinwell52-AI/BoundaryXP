import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {CODE,OUT,save,sha} from './util.mjs';
const mode=process.argv[2]??'targeted',revision=process.argv[3]??'r001',prefix=`${OUT}/regression/${mode}-${revision}`;
fs.mkdirSync(prefix,{recursive:true});
const tests=mode==='full'?fs.readdirSync('tests').filter(p=>p.endsWith('.test.mjs')).map(p=>'tests/'+p):['tests/parser-admin-short-018.test.mjs','tests/parser-admin-short-018-r1.test.mjs','tests/parser-admin-natural-021.test.mjs'];
if(mode==='trial'){
 tests.splice(0,tests.length,...['parser-candidate-architecture-026.test.mjs','parser-candidate-context-safety-026.test.mjs','parser-candidate-gamma-licenses-026.test.mjs'].map(name=>{
  let code=fs.readFileSync('tests/'+name,'utf8');
  code=code.replace(/from '([^']+)'/gu,(all,ref)=>{if(!ref.startsWith('../research/'))return all;let p=ref.slice(3);if(p.endsWith('v0.3-candidate-parsing-026/engine.mjs'))p=p.replace('engine.mjs','downstream-core.mjs');const target=fs.existsSync(`${CODE}/trial/${p}`)?`${CODE}/trial/${p}`:p;return 'from '+JSON.stringify(pathToFileURL(`${process.cwd()}/${target}`).href);});
  const target=`${CODE}/trial-tests/${revision}/${name}`;fs.mkdirSync(`${CODE}/trial-tests/${revision}`,{recursive:true});fs.writeFileSync(target,code,{flag:'wx'});return target;
 }));
}
save(`${prefix}/PLAN.json`,{command:process.execPath,args:['--test','--test-reporter=tap','--test-concurrency=1',...tests],files:tests.map(p=>({path:p,sha256:sha(fs.readFileSync(p))})),scope:mode==='full'?'All current package test:gold:data Node tests; Python source validation separately':mode==='trial'?'Existing 026 safety/Γ/architecture assertions with only imports redirected to isolated trial': '018/021 historical tests unchanged; candidate preservation independently checked on frozen 350 graphs'});
const log=fs.createWriteStream(`${prefix}/stdout.log`,{flags:'wx'}),err=fs.createWriteStream(`${prefix}/stderr.log`,{flags:'wx'}),start=Date.now();let output='';
const p=spawn(process.execPath,['--test','--test-reporter=tap','--test-concurrency=1',...tests],{cwd:process.cwd(),windowsHide:true});
p.stdout.on('data',b=>{log.write(b);output+=b.toString();});p.stderr.on('data',b=>err.write(b));
const timer=setTimeout(()=>p.kill(),1800000);
p.on('close',(code,signal)=>{clearTimeout(timer);log.end();err.end();const count=k=>Number(new RegExp('^# '+k+' (\\d+)','m').exec(output)?.[1]??0);save(`${prefix}/RESULT.json`,{exit_code:code,signal,elapsed_ms:Date.now()-start,PASS:count('pass'),FAIL:count('fail'),SKIP:count('skipped'),tests:count('tests'),status:code===0?'PASS':'FAIL'});console.log(JSON.stringify({mode,exit:code,pass:count('pass'),fail:count('fail'),skip:count('skipped')}));});
