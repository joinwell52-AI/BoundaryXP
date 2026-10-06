import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {OUT,read,save,sha,BASE} from './setup.mjs';
import {evaluateBatch} from '../../../docs/reports/7plus1/7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG/development-comparator.mjs';
const OLD='docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG';
const url=p=>pathToFileURL(path.resolve(p)).href;
const corpus=read(`${OUT}/CORPUS-SELECTION.json`);
export async function evaluate(arm,ids=corpus.cases.map(x=>x.id)){
 const root=`${OUT}/evaluation/${arm}`;
 const helper=`import fs from 'node:fs';import crypto from 'node:crypto';export const OUT=${JSON.stringify(root)};export const read=p=>JSON.parse(fs.readFileSync(p));export const sha=x=>crypto.createHash('sha256').update(x).digest('hex');export function write(p,x){const f=OUT+'/'+p;fs.mkdirSync(f.substring(0,f.lastIndexOf('/')),{recursive:true});fs.writeFileSync(f,JSON.stringify(x,null,2)+'\\n',{flag:'wx'});}`;
 save(`${root}/audit-tools.mjs`,helper);
 const results=[];
 for(const group of ['root','natural','exposed200']){
  const rows=corpus.cases.filter(x=>x.corpus===group&&ids.includes(x.id)).map(x=>{const f=`${OUT}/arm-${arm}/${x.id}/trace.json`;return {id:x.id,source_sha256:x.source_sha256,trace:f,trace_sha256:fs.existsSync(f)?sha(fs.readFileSync(f)):null};});
  if(!rows.length)continue;
  const manifest=`${root}/development/r001/${group}/RESULTS.json`;save(manifest,{rows});
  if(group==='exposed200'){
   const relative={rows:rows.map(x=>({...x,trace:x.trace.slice(OUT.length+1)}))};save(`${root}/controls-manifest.json`,relative);
   const reviewed=evaluateBatch(`${OLD}/BLIND-200-FRAMES.json`,`${root}/controls-manifest.json`,OUT);
   save(`${root}/CONTROL-REVIEW.json`,{rows:reviewed,total:reviewed.length,closed:reviewed.filter(x=>x.closed).length});
   results.push(...reviewed.map(x=>({...x,case_id:x.id,corpus:group})));continue;
  }
  const file=`${OLD}/${group}-source-audit.mjs`;let code=fs.readFileSync(file,'utf8');
  code=code.replaceAll("from './audit-tools.mjs'",'from '+JSON.stringify(url(`${root}/audit-tools.mjs`)));
  code=code.replace(/from '([^']+)'/gu,(whole,ref)=>ref.startsWith('.')?'from '+JSON.stringify(url(path.resolve(path.dirname(file),ref))):whole);
  code=code.replaceAll("read(runRoot+'/'+row.trace)","read(row.trace)").replaceAll("fs.readFileSync(runRoot+'/'+row.trace)","fs.readFileSync(row.trace)");
  code=code.replaceAll('sd=c.nlp_signals.semantic_decoding',"sd=new Proxy(c.nlp_signals.semantic_decoding,{get:(o,k)=>o[k]??(k==='qualified_domain_ir'?{domains:[]}:[])})");
  process.argv=group==='root'?['node',file,'root','r001']:['node',file,'r001'];
  await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  const audit=read(`${root}/source-audits/${group==='root'?'root-r001':'r001'}.json`);
  results.push(...audit.ledger.map(x=>({...x,closed:x.closed??x.closure_status==='SOURCE_SEMANTICALLY_CLOSED',corpus:group})));
 }
 const summary={arm,total:results.length,closed:results.filter(x=>x.closed).length,groups:Object.fromEntries(['root','natural','exposed200'].map(g=>[g,{total:results.filter(x=>x.corpus===g).length,closed:results.filter(x=>x.corpus===g&&x.closed).length}])),rows:results.map(x=>({id:x.case_id,corpus:x.corpus,closed:x.closed,failures:x.checks.filter(y=>y.status==='FAIL').map(y=>({claim:y.claim,category:y.category??'source_semantic_check',evidence:y.evidence})),source_obligations:x.source_obligations??null,trace:`${OUT}/arm-${arm}/${x.case_id}/trace.json`}))};
 save(`${root}/SUMMARY.json`,summary);return summary;
}
if(process.argv[1]?.endsWith('offline-review.mjs'))for(const arm of ['A','B']){const s=await evaluate(arm);console.log(JSON.stringify({arm,total:s.total,closed:s.closed,groups:s.groups}));}
