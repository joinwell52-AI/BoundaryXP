import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {compileNative,parse7Plus1} from '../../../../research/7plus1-parser/v0.3-natural-generalization-025/engine.mjs';
import {closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
const OUT='docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG',OLD='docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG';
const [rev,corpus='natural',mode='cached']=process.argv.slice(2);if(!/^r\d{3}$/.test(rev))throw Error('NEW_REVISION_REQUIRED');
const hash=x=>createHash('sha256').update(x).digest('hex'),walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name).replaceAll('\\','/')]);
const dir=OUT+'/development/'+rev+'/'+corpus;fs.mkdirSync(dir,{recursive:true});
const write=(p,x)=>fs.writeFileSync(dir+'/'+p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const files=walk('research/7plus1-parser/v0.3-natural-generalization-025').map(p=>({path:p,sha256:hash(fs.readFileSync(p))}));write('IMPLEMENTATION.json',{mode,files,at:new Date().toISOString()});
const manifest=JSON.parse(fs.readFileSync(OLD+(corpus==='natural'?'/natural-first/r01/RESULTS.json':'/root-model/r04/RESULTS.json'))),rows=[];
try{for(const item of manifest.rows){
 const prior=JSON.parse(fs.readFileSync(OLD+'/'+item.trace)),source=prior.compiler_v03.source.raw_text,base=item.id;fs.mkdirSync(dir+'/'+base);write(base+'/source.md',source);
 try{const r=mode==='models'?await parse7Plus1(source):compileNative(sourceDocument(source),structuredClone(prior.compiler_v03.nlp_signals));write(base+'/trace.json',r);const c=r.compiler_v03,row={id:item.id,status:'OUTPUT_SAVED',trace:base+'/trace.json',source_sha256:hash(source),gate:r.candidate_graph_gate_results.status,contract:r.contract_gate_results.status,unknown:c.unresolved.length};rows.push(row);}
 catch(e){write(base+'/error.json',{message:e.message,stack:e.stack});rows.push({id:item.id,status:'ERROR_SAVED',error:base+'/error.json'});}
 console.log(JSON.stringify(rows.at(-1)));
}}finally{await closeNlp();}
write('RESULTS.json',{revision:rev,corpus,mode,total:rows.length,outputs:rows.filter(x=>x.status==='OUTPUT_SAVED').length,errors:rows.filter(x=>x.status==='ERROR_SAVED').length,rows});
