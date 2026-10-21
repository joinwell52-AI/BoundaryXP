import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),folder='docs/reports/7plus1/7P-SHORT-COMPILER-ACCURACY-030',out=path.join(root,folder);
const hash=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const excluded=new Set(['MANIFEST.json','SHA256SUMS','SEAL.json']);
if(process.argv[2]==='create'){
 assert(!fs.existsSync(path.join(out,'SEAL.json')),'Sealed result must not be overwritten');
 const result=read(path.join(out,'FINAL-RESULT.json'));assert.equal(result.SHORT_ACCURACY_030,'TEST_COMPLETED');assert.equal(result.status,'WAITING_ADMIN_REVIEW');
 const files=[...walk(out).filter(p=>!excluded.has(path.basename(p))),...walk(path.join(root,'research/7plus1-parser/accuracy-030'))].sort().map(p=>({path:path.relative(root,p).replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:hash(fs.readFileSync(p))}));
 const m={task:'7P-SHORT-COMPILER-ACCURACY-030',at:new Date().toISOString(),tested_commit:result.tested_commit,semantic_result:result.ACCURACY_030,coverage:'030 evaluation code, frozen inputs/expectations, all 40 original runs, independent reviews and final report; no unrelated history',self_excluded:[...excluded],files};
 fs.writeFileSync(path.join(out,'MANIFEST.json'),JSON.stringify(m,null,2)+'\n',{flag:'wx'});
 fs.writeFileSync(path.join(out,'SHA256SUMS'),files.map(f=>f.sha256+'  '+f.path).join('\n')+'\n',{flag:'wx'});
 fs.writeFileSync(path.join(out,'SEAL.json'),JSON.stringify({task:m.task,at:m.at,status:'SEALED_FOR_ADMIN_REVIEW',semantic_acceptance:false,files:files.length,manifest_sha256:hash(fs.readFileSync(path.join(out,'MANIFEST.json'))),sha256sums_sha256:hash(fs.readFileSync(path.join(out,'SHA256SUMS'))),expected_sha256:read(path.join(out,'RUN-MANIFEST.json')).expectedResources.find(x=>x.path.endsWith('/EXPECTED-FACTS.json')).sha256,actual_test_result:result.ACCURACY_030,note:'Digest integrity only; no ADMIN approval or semantic PASS implied.'},null,2)+'\n',{flag:'wx'});
}
const m=read(path.join(out,'MANIFEST.json')),s=read(path.join(out,'SEAL.json'));
assert.equal(hash(fs.readFileSync(path.join(out,'MANIFEST.json'))),s.manifest_sha256);assert.equal(hash(fs.readFileSync(path.join(out,'SHA256SUMS'))),s.sha256sums_sha256);
for(const f of m.files){const p=path.join(root,f.path);assert.equal(fs.statSync(p).size,f.bytes,f.path);assert.equal(hash(fs.readFileSync(p)),f.sha256,f.path);}
for(const f of [...read(path.join(out,'RUN-MANIFEST.json')).resources,...read(path.join(out,'RUN-MANIFEST.json')).expectedResources])assert.equal(hash(fs.readFileSync(path.join(root,f.path))),f.sha256,f.path);
console.log(JSON.stringify({seal:'CHECKS_PASS',files:m.files.length,semantic_result:s.actual_test_result,semantic_acceptance:false},null,2));
