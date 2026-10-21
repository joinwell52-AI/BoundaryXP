import fs from 'node:fs';import assert from 'node:assert/strict';import {out,write,digest,walk,read} from './common.mjs';
assert.ok(!fs.existsSync(out+'IMPLEMENTATION-FREEZE.json'));
assert.ok(read(out+'non-gold-r05/INDEX.json').every(r=>r.pass));
assert.ok(read(out+'candidate-r03/INDEX.json').every(r=>r.full&&r.joint&&r.contract==='PASS'));
const paths=walk('research/7plus1-parser/v0.3-7p-short-direct-016-r2/');
write(out+'IMPLEMENTATION-FREEZE.json',{task:'7P-SHORT-016-R2',frozen_at:new Date().toISOString(),files:paths.map(path=>({path,sha256:digest(path)})),preflight:['non-gold-r05/INDEX.json','candidate-r03/INDEX.json'].map(p=>({path:out+p,sha256:digest(out+p)})),production_entry_unchanged:true,models_packs_QI_QB_unchanged:true});
console.log(JSON.stringify(paths));
