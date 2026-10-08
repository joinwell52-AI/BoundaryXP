// Seal maintenance evidence; installed semantic resources and older seals are never rewritten.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {report,walk,write} from './prepare.mjs';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const relative=p=>path.relative(process.cwd(),p).replaceAll('\\','/');
const excluded=new Set(['MANIFEST.json','SHA256SUMS','SEAL.json']);
const sources=['package.json','.gitattributes','docs/tasks/7plus1/CURRENT-TASK.md','product/short-compiler/launch-installed.mjs','product/short-compiler/tests/installed-entry.test.mjs','research/7plus1-parser/llm-first-028/tests/delivery.test.mjs',...walk(path.resolve('research/7plus1-parser/maintenance-58618')).map(relative)];
if(process.argv[2]==='create'){
 assert.ok(!fs.existsSync(path.join(report,'SEAL.json')),'SEAL_ALREADY_EXISTS');
 const v=JSON.parse(fs.readFileSync(path.join(report,'VERIFICATION.json'))),p=JSON.parse(fs.readFileSync(path.join(report,'PROTECTION.json')));
 assert.equal(v.PORT_58618_RESTORED,true);assert.equal(v.model_calls,0);assert.deepEqual(p.tracked_changes,[]);assert.deepEqual(p.untracked_changes,[]);
 const rows=walk(report).filter(p=>!excluded.has(path.relative(report,p))).map(p=>({path:path.relative(report,p).replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:hash(p)})).sort((a,b)=>a.path.localeCompare(b.path));
 const implementation=sources.map(p=>({path:p,bytes:fs.statSync(p).size,sha256:hash(p)}));
 write('MANIFEST.json',{task:'031-R1-RESTORE-58618',source_base:'f039fb2639cadecc8fa6f00bbf6dad8cac48c55b',semantic_core_changed:false,installed_snapshot:v.product_snapshot,files:rows,maintenance_sources:implementation});
 fs.writeFileSync(path.join(report,'SHA256SUMS'),rows.map(r=>r.sha256+'  '+r.path).join('\n')+'\n',{flag:'wx'});
 write('SEAL.json',{state:'WAITING_ADMIN_REVIEW',created_at:new Date().toISOString(),immutable:true,PORT_58618_RESTORED:true,semantic_acceptance:'PARTIAL / REVIEW_REQUIRED',production_ready:false,model_calls:0,manifest_sha256:hash(path.join(report,'MANIFEST.json')),sha256sums_sha256:hash(path.join(report,'SHA256SUMS'))});
}
const m=JSON.parse(fs.readFileSync(path.join(report,'MANIFEST.json'))),s=JSON.parse(fs.readFileSync(path.join(report,'SEAL.json')));
for(const x of m.files){const p=path.resolve(report,x.path);assert.ok(p.startsWith(report+path.sep));assert.equal(hash(p),x.sha256,x.path);assert.equal(fs.statSync(p).size,x.bytes);}
for(const x of m.maintenance_sources){assert.equal(hash(x.path),x.sha256,x.path);}
assert.equal(hash(path.join(report,'MANIFEST.json')),s.manifest_sha256);assert.equal(hash(path.join(report,'SHA256SUMS')),s.sha256sums_sha256);
assert.deepEqual(walk(report).map(p=>path.relative(report,p).replaceAll('\\','/')).filter(p=>!excluded.has(p)).sort(),m.files.map(x=>x.path).sort());
console.log(JSON.stringify({seal_verified:true,files:m.files.length,maintenance_sources:m.maintenance_sources.length,semantic_core_changed:false,model_calls:0,state:s.state}));
