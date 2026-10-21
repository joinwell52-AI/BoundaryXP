import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
export const BASE='docs/reports/7plus1/7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG';
export const OUT='docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E';
export const CODE='research/7plus1-parser/semantic-parser-feasibility-026e';
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const read=p=>JSON.parse(fs.readFileSync(p));
export function save(p,x){fs.mkdirSync(p.substring(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});}
export function selection(){
 const ledger=read(`${BASE}/generator-root-audit/r001/LEDGER.json`).rows;
 const stratify=corpus=>{
  const buckets=Object.entries(Object.groupBy(ledger.filter(r=>r.corpus===corpus),r=>r.underlying_generator_defect)).map(([root,rows])=>({root,rows:rows.sort((a,b)=>a.case.localeCompare(b.case)),allocation:1})).sort((a,b)=>b.rows.length-a.rows.length||a.root.localeCompare(b.root));
  // One per non-empty root, then weighted deficit allocation; ties favor larger
  // buckets then lexical root name. No output-dependent selection.
  while(buckets.reduce((s,b)=>s+b.allocation,0)<20){const b=buckets.filter(b=>b.allocation<b.rows.length).sort((a,b)=>(b.rows.length/(b.allocation+1))-(a.rows.length/(a.allocation+1))||b.rows.length-a.rows.length||a.root.localeCompare(b.root))[0];b.allocation++;}
  return {buckets:buckets.map(b=>({root:b.root,total:b.rows.length,selected:b.allocation})),rows:buckets.flatMap(b=>b.rows.slice(0,b.allocation).map(r=>({id:r.case,corpus,root:b.root,first_divergence:r.first_divergence,source:r.source,source_sha256:r.source_sha256,baseline_trace:r.gc_evidence.trace,baseline_trace_sha256:r.gc_evidence.trace_sha256}))),oracle:buckets.map(b=>b.rows[0].case).slice(0,5)};
 };
 const root=stratify('root'),natural=stratify('natural'),controls=read(`${BASE}/development/r050/exposed200/RESULTS.json`).rows.slice().sort((a,b)=>a.id.localeCompare(b.id)).slice(0,20).map(r=>{const file=`${BASE}/${r.trace}`,t=read(file);return {id:r.id,corpus:'exposed200',root:'ALREADY_CORRECT_CONTROL',source:t.compiler_v03.source.raw_text,source_sha256:r.source_sha256,baseline_trace:file,baseline_trace_sha256:r.trace_sha256};});
 const plan=read(`${BASE}/local-frame/r001/PLAN.json`),oldSeal=read(`${BASE}/local-frame/r001/MANIFEST.json`);
 const protectedFiles=[...new Map([...plan.protected_files,...oldSeal.files].map(r=>[r.file,r])).values()];
 for(const r of protectedFiles)if(sha(fs.readFileSync(r.file))!==r.sha256)throw Error('PROTECTED_CHANGED '+r.file);
 const x={task:'7P-SEMANTIC-PARSER-FEASIBILITY-026E',task_pointer_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),created_before_any_experiment_parser_run:true,algorithm:'Each unresolved corpus: at least one per nonempty root; allocate remaining slots by largest size/(allocation+1), ties descending bucket size then lexical root; first lexical IDs within bucket. Controls: first 20 lexical exposed200 IDs. Oracle: first case in first five ranked buckets in each unresolved corpus.',buckets:{root:root.buckets,natural:natural.buckets},cases:[...root.rows,...natural.rows,...controls],oracle_ids:[...root.oracle,...natural.oracle],evaluation_scope:'EXPOSED_DEVELOPMENT_DIAGNOSTIC_NOT_BLIND_NOT_BENCHMARK_SCORE',active_baseline:{root:16,natural:9,exposed200:200,A:false,B:false,narrowed_C:true},protected_files:protectedFiles};
 if(x.cases.length!==60||x.oracle_ids.length!==10)throw Error('SELECTION_SIZE');
 save(`${OUT}/CORPUS-SELECTION.json`,x);
 for(const r of x.cases){if(sha(Buffer.from(r.source))!==r.source_sha256)throw Error('SOURCE_HASH '+r.id);save(`${OUT}/sources/${r.id}.md`,r.source);}
 console.log(JSON.stringify({cases:x.cases.map(r=>r.id),oracle:x.oracle_ids,buckets:x.buckets,protected:protectedFiles.length}));
}
if(process.argv[1]?.endsWith('setup.mjs'))selection();
