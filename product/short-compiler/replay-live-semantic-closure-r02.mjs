// Same-model-response verification of consumer-only repairs. No model requests.
import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {lockProduct} from './resources.mjs';
const evidence=path.resolve('.boundx/exports/SEMANTIC-CONTRACT-CLOSURE-r02'),origin=path.join(evidence,'live-REAL-GOLD-015'),output=path.join(evidence,'consumer-replay-ui32'),root=path.resolve('.boundx/products/0.1.0-candidate.031-r1.2-ui.32');
if(fs.existsSync(output)||!fs.existsSync(path.join(origin,'trace.json')))throw Error('ACTUAL_COMPLETED_TRACE_REQUIRED_WITH_NEW_OUTPUT');lockProduct(root).verify();
const result=spawnSync(process.execPath,['product/short-compiler/cli.mjs','--input',path.join(origin,'source.txt'),'--output',output,'--replay-from',origin],{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:20*1024*1024});
fs.writeFileSync(path.join(evidence,'CLI-REPLAY.stdout.txt'),result.stdout??'',{flag:'wx'});fs.writeFileSync(path.join(evidence,'CLI-REPLAY.stderr.txt'),result.stderr??'',{flag:'wx'});
if(result.status!==0)throw Error('CLI_REPLAY_FAILED');const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),a=read(path.join(origin,'trace.json')),b=read(path.join(output,'trace.json'));
const equal={};for(const key of ['source','proposal','audit','technical','ir','canonical','chinese','boundary_calculations'])equal[key]=JSON.stringify(a[key])===JSON.stringify(b[key]);
if(Object.values(equal).some(x=>!x))throw Error('CONSUMER_REPLAY_CHANGED_LIVE_SEMANTICS');
fs.writeFileSync(path.join(evidence,'CLI-REPLAY-EQUALITY.json'),JSON.stringify({equal,real_new_model_calls:0,live_model_product:a.product_snapshot.product_version,replay_consumer_product:b.product_snapshot.product_version,source_audit_required:true},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({equal,real_new_model_calls:0}));
