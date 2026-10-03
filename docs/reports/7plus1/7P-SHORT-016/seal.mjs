import fs from 'node:fs';import assert from 'node:assert/strict';import {out,read,write,walk,digest,hash} from './common.mjs';
if(fs.existsSync(out+'SEAL.md'))throw Error('Already sealed');
const envelopes=new Set(['MANIFEST.json','SHA256SUMS.txt','SEAL.md','SEAL-VERIFICATION.json']);
const payload=[...walk(out).filter(p=>!envelopes.has(p.slice(out.length))),...read(out+'IMPLEMENTATION-FREEZE.json').files.map(f=>f.path),'tests/parser-7p-short-016.test.mjs'].sort();
for(const f of read(out+'IMPLEMENTATION-FREEZE.json').files)assert.equal(digest(f.path),f.sha256);
assert.equal(read(out+'PROTECTED-ASSET-VERIFICATION.json').status,'PASS');
const records=payload.map(path=>({path,sha256:digest(path),bytes:fs.statSync(path).size}));
write(out+'MANIFEST.json',{task:'7P-SHORT-016',status:'ADMIN_CASE_CONTRACT_REVIEW_REQUIRED',semantic_success:false,files:records});
write(out+'SHA256SUMS.txt',records.map(r=>r.sha256+'  '+r.path).join('\n')+'\n');
const manifest=digest(out+'MANIFEST.json'),sums=digest(out+'SHA256SUMS.txt');
write(out+'SEAL.md','# 7P-SHORT-016 seal\n\nStatus: WAITING_ADMIN_REVIEW / ADMIN_CASE_CONTRACT_REVIEW_REQUIRED.\nPRODUCTION_READY=false. Semantic closure 6/8; not validated.\n\nMANIFEST SHA-256: '+manifest+'\nSHA256SUMS SHA-256: '+sums+'\nPayload files: '+records.length+'\n\nSource, expected and original 008–015 seals remain unchanged. No future writes to this report directory.\n');
const verification={status:'PASS',task:'7P-SHORT-016',checked_payload_files:records.length,manifest_sha256:manifest,sha256sums_sha256:sums,seal_sha256:digest(out+'SEAL.md'),semantic_status:'NOT_VALIDATED',verified_at:new Date().toISOString()};
for(const r of records)assert.equal(digest(r.path),r.sha256);
// SEAL.md is now the write barrier. Only this enclosing verification envelope
// is created directly after all payload and manifest digests have been checked.
fs.writeFileSync(out+'SEAL-VERIFICATION.json',JSON.stringify(verification,null,2)+'\n');console.log(JSON.stringify(verification));
