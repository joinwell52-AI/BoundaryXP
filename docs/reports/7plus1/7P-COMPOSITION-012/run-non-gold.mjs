import fs from 'node:fs';import {out,runtime,read,write,digest,walk} from './common.mjs';
import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {compileNative} from '../../../../research/7plus1-parser/v0.3-7p-composition-012/engine.mjs';
import {checks} from './acceptance-checks.mjs';
const revision=process.argv[2];if(!/^[a-z0-9-]+$/.test(revision??''))throw Error('revision required');const base=out+'non-gold-'+revision+'/';if(fs.existsSync(base))throw Error('PRESERVE_FIRST_RUN');
const records=[];
for(const x of read(out+'NON-GOLD-FROZEN-INPUTS.json').cases.filter(x=>x.stage==='R1')){let record;try{const r=compileNative(sourceDocument(x.text),read(out+'non-gold-signals/'+x.id+'.json').signals,{run_id:'012-'+revision+'-'+x.id,created_at:'2026-10-03T00:00:00.000Z'});write(base+x.id+'.json',r);const cs=checks(x,r);record={id:x.id,checks:cs,status:cs.every(c=>c.pass)&&r.contract_gate_results.status==='PASS'?'PASS':'FAIL',contract_gate:r.contract_gate_results};}catch(e){record={id:x.id,status:'ERROR',error:e.stack};}records.push(record);console.log(JSON.stringify({id:x.id,status:record.status,failed:record.checks?.filter(c=>!c.pass).map(c=>c.check),error:record.error}));}
write(base+'RESULTS.json',{stage:'R1',cases:records,pass:records.filter(r=>r.status==='PASS').length,fail:records.filter(r=>r.status!=='PASS').length,implementation:walk(runtime).filter(p=>p.endsWith('.mjs')).map(path=>({path,sha256:digest(path)})),frozen_inputs_sha256:digest(out+'NON-GOLD-FROZEN-INPUTS.json')});
