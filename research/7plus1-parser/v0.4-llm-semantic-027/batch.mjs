import fs from 'node:fs';
import {REPORT,read,save} from './util.mjs';
import {parseBoundary} from './engine.mjs';
const split=process.argv[2]??'development',revision=process.argv[3]??'v1',limit=process.argv[4]?Number(process.argv[4]):Infinity;
if(!['development','locked'].includes(split)||!/^[\w-]+$/u.test(revision))throw Error('INVALID_RUN_ARGUMENT');
if(split==='locked'&&!fs.existsSync(`${REPORT}/METHOD-FREEZE.json`))throw Error('METHOD_NOT_FROZEN_FOR_LOCKED');
const rows=read(`${REPORT}/SPLIT-FREEZE.json`).rows.filter(r=>r.split===split).slice(0,limit),prefix=`${REPORT}/runs/${split}-${revision}`;
if(fs.existsSync(prefix))throw Error('FIRST_RUN_OUTPUT_EXISTS');save(prefix+'/PLAN.json',{split,revision,total:rows.length,concurrency:4,new_semantic_proposals:true,expected_in_provider_input:false});
let index=0;const results=[];
async function worker(){while(index<rows.length){const row=rows[index++],base=`${prefix}/${row.corpus}/${row.id}`,start=Date.now();try{const t=await parseBoundary(fs.readFileSync(row.source_path,'utf8'),{receipt_dir:base+'/provider',nlp:read(row.nlp_path)});save(base+'/trace.json',t);save(base+'/canonical.json',t.canonical_7plus1);results.push({...row,status:'OUTPUT_SAVED',elapsed_ms:Date.now()-start,trace:base+'/trace.json',canonical:base+'/canonical.json'});}catch(e){save(base+'/ERROR.json',{error:String(e),details:e.details??null,receipt:e.receipt??null});results.push({...row,status:'ERROR',elapsed_ms:Date.now()-start,error:String(e)});}console.log(JSON.stringify({done:results.length,total:rows.length,last:results.at(-1).id,status:results.at(-1).status}));}}
await Promise.all(Array.from({length:Math.min(4,rows.length)},worker));
save(prefix+'/RESULTS.json',{split,revision,rows:results.sort((a,b)=>a.corpus.localeCompare(b.corpus)||a.id.localeCompare(b.id)),total:rows.length,errors:results.filter(r=>r.status==='ERROR').length});
