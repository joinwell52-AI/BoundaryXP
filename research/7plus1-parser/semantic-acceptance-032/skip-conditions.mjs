// Explain existing boolean skips from their actual source; do not enable them.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {report,write} from './prepare.mjs';
const raw=JSON.parse(fs.readFileSync(path.join(report,'engineering/consumer-r02-full/SKIPS.json'))).records;
const files=fs.readdirSync('tests').filter(p=>p.endsWith('.test.mjs')).map(p=>({path:'tests/'+p,lines:fs.readFileSync('tests/'+p,'utf8').split(/\r?\n/)}));
const records=raw.map(row=>{
 const m=row.match(/^﹣ (.*) \([\d.]+ms\) # (.*)$/);assert.ok(m);const [_,name,reason]=m;
 if(reason!=='SKIP')return{name,reported_reason:reason,not_counted_as_pass:true};
 const matches=files.flatMap(f=>f.lines.flatMap((l,i)=>l.includes("test('"+name+"'")?[{file:f.path,line:i+1,source:f.lines.slice(i,i+4).join('\n')}]:[]));assert.equal(matches.length,1);
 const variable=matches[0].source.match(/process\.env\.([A-Z0-9_]+) !== '1'/)?.[1];assert.ok(variable);
 return{name,reported_reason:reason,source_condition:matches[0],environment_gate:variable,required_value:'1',enabled_for_this_run:false,reason:'Existing opt-in local model/Gold research integration gate was not enabled. This task does not authorize expanding those experiments.',not_counted_as_pass:true};
});
write('engineering/consumer-r02-full/SKIP-CONDITIONS.json',{count:records.length,tests_modified:false,skip_conditions_changed:false,records});console.log(JSON.stringify({recorded:records.length,enabled:0}));
