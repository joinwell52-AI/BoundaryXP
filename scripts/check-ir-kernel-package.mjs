import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const [packageDir,evidenceDir,outputDir]=process.argv.slice(2).map(x=>path.resolve(x));
if(fs.existsSync(outputDir))throw Error('OUTPUT_ALREADY_EXISTS');
fs.mkdirSync(outputDir,{recursive:true});
const write=(name,value)=>fs.writeFileSync(path.join(outputDir,name),JSON.stringify(value,null,2)+'\n');
// Per-process denial; never changes the host firewall, proxy or login state.
const deny=path.join(outputDir,'deny-network.cjs');
fs.writeFileSync(deny,`const deny=()=>{throw Error('OFFLINE_TEST_NETWORK_FORBIDDEN')};
for(const [module,names]of Object.entries({'node:net':['connect','createConnection'],'node:tls':['connect'],'node:http':['request','get'],'node:https':['request','get']})){const m=require(module);for(const name of names)m[name]=deny;}
globalThis.fetch=deny;
require('node:module').syncBuiltinESMExports();
`);
const env={...process.env,NODE_OPTIONS:[process.env.NODE_OPTIONS??'','--require',JSON.stringify(deny)].join(' ')};
const verify=spawnSync(process.execPath,['-e',"try{require('node:http').get('http://127.0.0.1/');process.exit(1)}catch(e){if(e.message!=='OFFLINE_TEST_NETWORK_FORBIDDEN')throw e;console.log(e.message)}"],{cwd:packageDir,env,encoding:'utf8',windowsHide:true});
if(verify.status!==0)throw Error('NETWORK_GUARD_NOT_ACTIVE');
const cli=spawnSync(process.execPath,['scripts/ir-kernel.mjs','--ir',path.join(evidenceDir,'REFERENCE-IR.json'),'--query',path.join(evidenceDir,'QUERY-3.json'),'--out',path.join(outputDir,'cold-cli')],{cwd:packageDir,env,encoding:'utf8',windowsHide:true,timeout:30000});
fs.writeFileSync(path.join(outputDir,'cold-cli.log'),(cli.stdout??'')+(cli.stderr??''));
const files=fs.readdirSync(path.join(packageDir,'tests/ir-kernel')).filter(x=>x.endsWith('.test.mjs')).map(x=>'tests/ir-kernel/'+x);
const checks=spawnSync(process.execPath,['--test','--test-concurrency=1','--test-reporter=tap',...files],{cwd:packageDir,env,encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024,timeout:120000});
fs.writeFileSync(path.join(outputDir,'kernel.tap'),checks.stdout??'');fs.writeFileSync(path.join(outputDir,'kernel.stderr'),checks.stderr??'');
const resultFile=path.join(outputDir,'cold-cli/result.json'),result=fs.existsSync(resultFile)?JSON.parse(fs.readFileSync(resultFile,'utf8')):null;
const count=k=>Number(checks.stdout?.match(new RegExp('^# '+k+' (\\d+)$','m'))?.[1]??0);
const report={format:'boundx-kernel-clean-package-check/1',at:new Date().toISOString(),node:process.version,platform:process.platform,package_directory:packageDir,network_guard_probe:verify.stdout.trim(),network_guard_scope:'NODE_PROCESS_API_DENIAL_NOT_OS_FIREWALL',cli:{exit_code:cli.status,result:result?.result,verification:result?.verification,error:cli.error?.message??null},checks:{exit_code:checks.status,tests:count('tests'),pass:count('pass'),fail:count('fail'),error:checks.error?.message??null},tested_model_calls:0,listeners_started:0};
report.status=cli.status===0&&result?.result==='SAT'&&result?.verification==='MODEL_CHECKED'&&checks.status===0&&report.checks.tests>0?'PASS':'FAIL';
write('PACKAGE-CHECKS.json',report);console.log(JSON.stringify(report));if(report.status!=='PASS')process.exitCode=1;
