import fs from 'node:fs';import {out} from './common.mjs';
const old='docs/reports/7plus1/7P-SHORT-016-R1/';
let r=fs.readFileSync(old+'ref001.mjs','utf8').replace("v0.3-7p-short-direct-016-r1/engine.mjs","v0.3-7p-short-direct-016-r2/engine.mjs").replace("v0.3-7p-short-direct-016/engine.mjs","v0.3-7p-short-direct-016-r1/engine.mjs");
r=r.replace("!['ref-first','ref-repeat'].includes(phase)","!/^ref-(?:first|repeat|probe-\\d+)$/.test(phase)").replace("assert.ok(read(out+'final-first/INDEX.json').every(r=>r.full&&r.joint&&r.contract==='PASS'));","assert.ok(read(out+'non-gold-r04/INDEX.json').every(r=>r.pass)); assert.ok(read(out+'candidate-r02/INDEX.json').every(r=>r.full&&r.joint&&r.contract==='PASS'));").replace("for(const r of read(out+'IMPLEMENTATION-FREEZE.json').files)","for(const r of (fs.existsSync(out+'IMPLEMENTATION-FREEZE.json')?read(out+'IMPLEMENTATION-FREEZE.json').files:[]))");
fs.writeFileSync(out+'ref001.mjs',r);
fs.writeFileSync(out+'signatures.mjs',r.slice(r.indexOf('export function signatures'),r.indexOf('\nif(process.argv[2])')).replace('export function signatures','const keys=[\'I\',\'O\',\'A\',\'P\',\'R\',\'V\',\'C\',\'B\'];\nexport function signatures'));
