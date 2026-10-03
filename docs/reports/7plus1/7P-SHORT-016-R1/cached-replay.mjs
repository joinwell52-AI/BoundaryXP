import fs from 'node:fs';import {out,read,write,cases} from './common.mjs';
import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {compileNative} from '../../../../research/7plus1-parser/v0.3-7p-short-direct-016-r1/engine.mjs';
import {compare} from './compare.mjs';
const phase=process.argv[2];if(!/^candidate-[\w-]+$/.test(phase)||fs.existsSync(out+phase))throw Error('New phase required');
const rows=[];for(const c of cases()){const b='docs/reports/7plus1/7P-SHORT-016/final-first/'+c.id+'/';write(out+phase+'/'+c.id+'/source.md',c.source);const r=compileNative(sourceDocument(c.source),read(b+'signals.json'));const comparison=compare(r,c);write(out+phase+'/'+c.id+'/trace.json',r);write(out+phase+'/'+c.id+'/comparison.json',comparison);rows.push({id:c.id,contract:r.contract_gate_results.status,full:comparison.FULL_CASE_CLOSED,joint:comparison.IOA_CLOSED,failed:comparison.slots.filter(r=>!r.closed).map(r=>r.slot),owned:comparison.owned_output_content_complete});}
write(out+phase+'/INDEX.json',rows);console.log(JSON.stringify(rows));
