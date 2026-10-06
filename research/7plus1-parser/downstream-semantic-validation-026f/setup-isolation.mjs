import fs from 'node:fs';
import {CODE,OUT,OLD,read,save,sha} from './util.mjs';
const files=read(`${OLD}/RUNTIME-SNAPSHOT-MANIFEST.json`).files;
const rows=files.map(r=>({...r,baseline_sha256:sha(fs.readFileSync(`${CODE}/baseline/${r.file}`)),trial_sha256:sha(fs.readFileSync(`${CODE}/trial/${r.file}`))}));
if(rows.some(r=>r.sha256!==r.baseline_sha256||r.sha256!==r.trial_sha256))throw Error('SNAPSHOT_BYTE_MISMATCH');
save(`${OUT}/SNAPSHOT-VERIFIED.json`,{files:rows,count:rows.length,all_match:true});
// Extract only the existing manual diagnostic builder. No production code
// imports it. The old builder's execution loop is deliberately not copied.
let builder=fs.readFileSync(`${CODE}/baseline/research/7plus1-parser/semantic-parser-feasibility-026e/oracle.mjs`,'utf8');
builder=builder.slice(0,builder.indexOf('const runRevision='));
builder=builder.replace("import {OUT,read,save,sha} from './setup.mjs';","import {OLD as OUT,read} from './util.mjs';");
builder=builder.replace("import {fixtures} from './oracle-fixtures.mjs';",'');
builder=builder.replace(/^import .*compileCandidates.*\n/m,'').replace(/^import .*compileOracle.*\n/m,'');
builder=builder.replaceAll("from '../","from './baseline/research/7plus1-parser/");
builder=builder.replace("const segmented=read(`${OUT}/arm-A/${row.id}/signals.json`).clauses;","const segmented=row.segmented??read(`${OUT}/arm-A/${row.id}/signals.json`).clauses;");
fs.writeFileSync(`${CODE}/reviewed-builder.mjs`,builder,{flag:'wx'});
console.log('Snapshot verified',rows.length);
