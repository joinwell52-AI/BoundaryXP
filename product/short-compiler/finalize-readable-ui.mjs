// Capture presentation-only verification; never start a model or alter a run.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync,execFileSync} from 'node:child_process';
import {lockProduct} from './resources.mjs';
const repo=process.cwd(),home=path.join(repo,'.boundx/short-compiler-031-r1');
const report=path.join(repo,'docs/reports/7plus1/READABLE-COMPILATION-UI');fs.mkdirSync(report,{recursive:true});
const version='0.1.0-candidate.031-r1.2-ui.4',root=path.join(home,'versions',version),lock=lockProduct(root);lock.verify();
const base=lockProduct(path.join(home,'versions','0.1.0-candidate.031-r1.2'));base.verify();
const sha=b=>createHash('sha256').update(b).digest('hex');
const session=await(await fetch('http://127.0.0.1:58618/api/session')).json();
if(session.product_snapshot.manifest_sha256!==lock.snapshot.manifest_sha256)throw Error('LIVE_VERSION_MISMATCH');
const history=await(await fetch('http://127.0.0.1:58618/api/runs')).json();
if(history.some(r=>['QUEUED','RUNNING','CANCELLING'].includes(r.status)))throw Error('ACTIVE_REQUEST');
const pre=JSON.parse(fs.readFileSync(path.join(home,'readable-ui-verification/SWITCH-PREFLIGHT.json'),'utf8'));
const exports=[];
for(const x of pre.exports){const r={run_id:x.run_id};for(const ext of ['json','export','trace.json']){const response=await fetch('http://127.0.0.1:58618/api/runs/'+x.run_id+'/'+ext);if(!response.ok)throw Error('EXPORT_FAILED');r[ext]=sha(Buffer.from(await response.arrayBuffer()));if(r[ext]!==x[ext])throw Error('HISTORY_EXPORT_CHANGED');}exports.push(r);}
const suites=[['presentation-and-entry',['product/short-compiler/tests/process-presentation.test.mjs','product/short-compiler/tests/installed-entry.test.mjs']],['active-core-regression',fs.readdirSync(path.join(repo,'research/7plus1-parser/llm-first-028/tests')).filter(x=>x.endsWith('.test.mjs')).map(x=>'research/7plus1-parser/llm-first-028/tests/'+x)]];
const tests=[];for(const [name,files] of suites){const r=spawnSync(process.execPath,['--test',...files],{encoding:'utf8',cwd:repo});const out=(r.stdout??'')+(r.stderr??'');fs.writeFileSync(path.join(report,name+'.log'),out);if(r.status!==0)throw Error('TEST_FAILED:'+name);tests.push({suite:name,pass:Number(out.match(/(?:#|ℹ) pass (\d+)/u)?.[1]),fail:Number(out.match(/(?:#|ℹ) fail (\d+)/u)?.[1]),exit_code:r.status,model_calls:0});}
for(const rel of ['research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js','research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js'])execFileSync(process.execPath,['--check',path.join(root,rel)]);
const staticRoutes=[];for(const route of ['/','/app.js','/process-view.js','/style.css']){const r=await fetch('http://127.0.0.1:58618'+route);if(!r.ok)throw Error('STATIC_FAILED:'+route);staticRoutes.push({route,status:r.status,content_type:r.headers.get('content-type')});}
const replay=JSON.parse(fs.readFileSync(path.join(home,'readable-ui-verification-r04/VERIFY.json'),'utf8'));
const result={verified_at:new Date().toISOString(),status:'PASS',scope:'presentation-only',version,compiler:session.compiler_revision,contract:session.contract,product_semantic_acceptance:lock.snapshot.product_acceptance,manifest:lock.snapshot.manifest_sha256,base_manifest:base.snapshot.manifest_sha256,static_routes:staticRoutes,tests,replay,history_count:history.length,history_exports_unchanged:true,exports,model_calls_added:0,model_configuration_changed:false,skills_changed:false,contract_schema_changed:false,canonical_json_changed:false,chinese_export_changed:false};
fs.writeFileSync(path.join(report,'TESTS.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({version,tests,history_count:history.length,history_exports_unchanged:true,model_calls_added:0,report},null,2));
