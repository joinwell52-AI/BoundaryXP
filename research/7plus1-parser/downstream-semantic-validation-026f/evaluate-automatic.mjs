import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {OUT as TASK_OUT,BASE,read,save,sha} from './util.mjs';
const OUT=process.argv[2]?`${TASK_OUT}/${process.argv[2]}`:TASK_OUT;
import {evaluateBatch} from './baseline/docs/reports/7plus1/7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG/development-comparator.mjs';
const OLD='docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG',url=p=>pathToFileURL(path.resolve(p)).href,results={};
for(const arm of ['baseline','trial']){
 const root=`${OUT}/evaluation/${arm}`,all=[];
 save(`${root}/audit-tools.mjs`,`import fs from 'node:fs';import crypto from 'node:crypto';export const OUT=${JSON.stringify(root)};export const read=p=>JSON.parse(fs.readFileSync(p));export const sha=x=>crypto.createHash('sha256').update(x).digest('hex');export function write(p,x){const f=OUT+'/'+p;fs.mkdirSync(f.substring(0,f.lastIndexOf('/')),{recursive:true});fs.writeFileSync(f,JSON.stringify(x,null,2)+'\\n',{flag:'wx'});}`);
 for(const corpus of ['root','natural','exposed200']){
  const manifest=read(`${OUT}/automatic/${arm}/${corpus}-RESULTS.json`);
  save(`${root}/development/r001/${corpus}/RESULTS.json`,manifest);
  if(corpus==='exposed200'){
   const relative={rows:manifest.rows.map(r=>({...r,trace:r.trace.slice(OUT.length+1)}))};save(`${root}/controls-manifest.json`,relative);
   const reviewed=evaluateBatch(`${OLD}/BLIND-200-FRAMES.json`,`${root}/controls-manifest.json`,OUT);save(`${root}/CONTROL-REVIEW.json`,{rows:reviewed,total:reviewed.length,closed:reviewed.filter(x=>x.closed).length});all.push(...reviewed.map(x=>({...x,case_id:x.id,corpus})));continue;
  }
  const file=`${OLD}/${corpus}-source-audit.mjs`;let code=fs.readFileSync(file,'utf8');
  code=code.replaceAll("from './audit-tools.mjs'",'from '+JSON.stringify(url(`${root}/audit-tools.mjs`)));
  code=code.replace(/from '([^']+)'/gu,(whole,ref)=>ref.startsWith('.')?'from '+JSON.stringify(url(path.resolve(path.dirname(file),ref))):whole);
  code=code.replaceAll("read(runRoot+'/'+row.trace)","read(row.trace)").replaceAll("fs.readFileSync(runRoot+'/'+row.trace)","fs.readFileSync(row.trace)");
  code=code.replaceAll('sd=c.nlp_signals.semantic_decoding',"sd=new Proxy(c.nlp_signals.semantic_decoding,{get:(o,k)=>o[k]??(k==='qualified_domain_ir'?{domains:[]}:[])})");
  process.argv=corpus==='root'?['node',file,'root','r001']:['node',file,'r001'];
  await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  all.push(...read(`${root}/source-audits/${corpus==='root'?'root-r001':'r001'}.json`).ledger.map(x=>({...x,closed:x.closed??x.closure_status==='SOURCE_SEMANTICALLY_CLOSED',corpus})));
 }
 results[arm]={groups:Object.fromEntries(['root','natural','exposed200'].map(corpus=>[corpus,{total:all.filter(r=>r.corpus===corpus).length,closed:all.filter(r=>r.corpus===corpus&&r.closed).length}])),rows:all.map(r=>({id:r.case_id,corpus:r.corpus,closed:r.closed,failures:r.checks.filter(c=>c.status==='FAIL')}))};
}
const regressions=results.baseline.rows.filter(b=>b.closed&&!results.trial.rows.find(t=>t.id===b.id&&t.corpus===b.corpus)?.closed),increments=results.trial.rows.filter(t=>t.closed&&!results.baseline.rows.find(b=>b.id===t.id&&b.corpus===t.corpus)?.closed);
save(`${OUT}/AUTOMATIC-SEMANTIC-COMPARISON.json`,{...results,existing_PASS_to_FAIL:regressions.length,regressions,increments,new_model_calls:false});console.log(JSON.stringify({baseline:results.baseline.groups,trial:results.trial.groups,regressions:regressions.length,increments:increments.length}));
