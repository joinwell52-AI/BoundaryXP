import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=path.resolve('docs/reports/7plus1/MANUAL-FULL-FLOW-CALCULUS-r01'),sha=b=>createHash('sha256').update(b).digest('hex');
if(fs.existsSync(path.join(root,'SEAL.json')))throw Error('IMMUTABLE_SEAL_EXISTS');
const stray=path.resolve('final-review'),destination=path.join(root,'ui37-preflight-replay'),workspace=path.resolve('.');
if(fs.existsSync(stray)){assert.ok(fs.realpathSync(stray).startsWith(workspace+path.sep));assert.ok(destination.startsWith(workspace+path.sep));assert.ok(!fs.existsSync(destination));fs.renameSync(stray,destination);}
const rows=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else if(e.isFile())rows.push({path:path.relative(root,file).replaceAll('\\','/'),bytes:fs.statSync(file).size,sha256:sha(fs.readFileSync(file))});else throw Error('UNSUPPORTED_REPORT_ENTRY');}}walk(root);rows.sort((a,b)=>a.path.localeCompare(b.path));
const manifest={format:'boundx-evidence-manifest/v1',status:'GENERIC_CALCULUS_REPAIR_CANDIDATE_FOR_ADMIN_REVIEW',product_acceptance:'PARTIAL',public_release:false,real_model_calls:0,files:rows};
fs.writeFileSync(path.join(root,'MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});const m=fs.readFileSync(path.join(root,'MANIFEST.json'));
const sums=[...rows,{path:'MANIFEST.json',sha256:sha(m)}].map(x=>x.sha256+'  '+x.path).join('\n')+'\n';fs.writeFileSync(path.join(root,'SHA256SUMS'),sums,{flag:'wx'});
fs.writeFileSync(path.join(root,'SEAL.json'),JSON.stringify({format:'boundx-evidence-seal/v1',sealed_at:new Date().toISOString(),status:manifest.status,manifest_sha256:sha(m),sha256sums_sha256:sha(Buffer.from(sums)),payload_files:rows.length,immutable:true,semantic_gold_confirmed:false,full_product_accepted:false,branch:'review/7plus1-parser'},null,2)+'\n',{flag:'wx'});
for(const f of rows)assert.equal(sha(fs.readFileSync(path.join(root,f.path))),f.sha256);console.log(JSON.stringify({sealed:root,payload_files:rows.length,manifest_sha256:sha(m),mismatches:0}));
