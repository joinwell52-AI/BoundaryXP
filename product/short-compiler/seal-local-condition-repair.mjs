import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const hash=b=>createHash('sha256').update(b).digest('hex');
const report=path.resolve('docs/reports/7plus1/LOCAL-CONDITION-REPAIR-r01');
const read=p=>JSON.parse(fs.readFileSync(path.join(report,p)));
const tests={generic:read('frozen/RESULT.json'),variants:read('variants-frozen/SUMMARY.json'),regression:read('regression/SUMMARY.json'),install:read('install/RESULT.json'),real:read('LIVE-SOURCE-REVIEW.json'),full_product_pass:false};
fs.writeFileSync(path.join(report,'TESTS.json'),JSON.stringify(tests,null,2)+'\n',{flag:'wx'});
const seal=root=>{
 const files=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else {const b=fs.readFileSync(p);files.push({path:path.relative(root,p).replaceAll('\\','/'),bytes:b.length,sha256:hash(b)});}}};walk(root);files.sort((a,b)=>a.path.localeCompare(b.path,'en'));
 const manifest={status:'SEALED_EVIDENCE_NOT_SEMANTIC_ACCEPTANCE',created_at:new Date().toISOString(),files};
 const b=Buffer.from(JSON.stringify(manifest,null,2)+'\n');fs.writeFileSync(path.join(root,'MANIFEST.json'),b,{flag:'wx'});
 const sums=files.map(f=>f.sha256+'  '+f.path).join('\n')+'\n';fs.writeFileSync(path.join(root,'SHA256SUMS'),sums,{flag:'wx'});
 fs.writeFileSync(path.join(root,'SEAL.json'),JSON.stringify({manifest_sha256:hash(b),sha256sums_sha256:hash(Buffer.from(sums)),payload_files:files.length},null,2)+'\n',{flag:'wx'});
 for(const f of files)if(hash(fs.readFileSync(path.join(root,f.path)))!==f.sha256)throw Error('SEAL_MISMATCH '+f.path);
 console.log(JSON.stringify({root,files:files.length,manifest:hash(b)}));
};
seal(path.resolve('docs/testing/7plus1/MANUAL-TEST-001-local-conditions-r01'));seal(report);
