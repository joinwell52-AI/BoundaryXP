import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileNative} from '../research/7plus1-parser/v0.3-admin-short-019/engine.mjs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {check} from '../docs/reports/7plus1/7P-ADMIN-SHORT-019-LONG/run-controls.mjs';
const root='docs/reports/7plus1/7P-ADMIN-SHORT-019-LONG/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
for(const c of read(root+'INDEPENDENT-CONTROLS.json').controls)test('019 frozen independent '+c.id,()=>{const signals=read(root+'controls-attempts/fresh-r01/'+c.id+'/trace.json').compiler_v03.nlp_signals,r=compileNative(sourceDocument(c.source),structuredClone(signals)),v=check(c,r);assert.equal(v.status,'PASS',JSON.stringify(v.failures));});
test('019 runtime never reads the task acceptance oracle',()=>{for(const name of fs.readdirSync('research/7plus1-parser/v0.3-admin-short-019').filter(n=>n.endsWith('.mjs')))assert.doesNotMatch(fs.readFileSync('research/7plus1-parser/v0.3-admin-short-019/'+name,'utf8'),/ADMIN-SHORT-050-ORACLE|ADM-0\d\d|expected-7plus1|readFileSync/);});
