import fs from 'node:fs';
import {REPORT,read,save,sha} from './util.mjs';
const base=REPORT+'/runs/development-v1',first=read(base+'/RESULTS.json');
if(first.total!==245)throw Error('ORIGINAL_DEVELOPMENT_NOT_COMPLETE');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
const files=walk(base).sort().map(path=>({path,bytes:fs.statSync(path).size,sha256:sha(fs.readFileSync(path))}));
save(REPORT+'/ORIGINAL-DEVELOPMENT-FIRST-OUTPUT-SEAL.json',{sealed_at:new Date().toISOString(),total:first.total,completed:first.rows.filter(r=>r.trace).length,errors:first.errors,environment_failures_preserved:true,files,digest:sha(JSON.stringify(files)),subsequent_transport_recovery_does_not_replace_first_results:true});
console.log(JSON.stringify({files:files.length,first_errors:first.errors}));
