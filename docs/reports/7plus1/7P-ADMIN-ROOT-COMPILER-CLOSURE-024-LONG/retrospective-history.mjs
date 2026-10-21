import fs from 'node:fs';import {execFileSync} from 'node:child_process';
import {OUT,read,write} from './audit-tools.mjs';
// Re-evaluate already immutable development outputs with the source checks
// declared before holdout. No compiler execution or code mutation occurs.
let source=fs.readFileSync(OUT+'/source-semantic-audit.mjs','utf8');
source=source.replace('read,write,OUT,sha','read,write as rawWrite,OUT,sha');
const version=process.argv[2]??'r01';if(!['r01','r02','r03'].includes(version))throw Error('INVALID_AUDIT_VERSION');
const folder=version==='r01'?'retrospective-history/':`retrospective-history/${version}/`;
source=source.replace('// Offline adjudication only.',`const write=(name,data)=>rawWrite(name.replace('source-audits/','${folder}'),{corpus:data.corpus,revision:data.revision,post_holdout_read_only_reassessment:true,not_contemporaneous_semantic_counts:true,closed_by_predeclared_checks:data.closed,total:data.total,ledger:data.ledger.map(x=>({case_id:x.case_id,checks:x.checks,closure_status:x.closure_status,trace:x.trace,trace_sha256:x.trace_sha256}))});\n// Offline adjudication only.`);
// A missing older-stage field fails the same semantic assertion as an empty
// structure. This is only a compatibility adapter for OFFLINE historical reads.
if(version!=='r01'){source=source.replace(/(sd\.[a-z_]+)\.some/gu,'($1??[]).some').replace('sd.output_content_ir.requirements.filter','(sd.output_content_ir?.requirements??[]).filter');}
if(version==='r03')source=source.replace('sd.qualified_domain_ir.domains.some','(sd.qualified_domain_ir?.domains??[]).some');
const worker=OUT+'/_retrospective-source-audit-'+version+'.mjs';
fs.writeFileSync(worker,source,{flag:'wx'});
for(let n=version==='r03'?4:1;n<=(version==='r03'?10:71);n++){const rev='r'+String(n).padStart(2,'0');try{execFileSync(process.execPath,[worker,'development',rev],{stdio:['ignore','ignore','pipe'],maxBuffer:10e6});console.log(rev+' READ_ONLY_REASSESSMENT_SAVED');}catch(e){write(folder+rev+'-error.json',{revision:rev,not_parser_error:true,post_holdout_read_only_reassessment:true,reason:'Newer offline acceptance-check code cannot consume this older snapshot completely; do not pretend a semantic score.',stderr:e.stderr?.toString()??e.message});console.log(rev+' AUDIT_CONTRACT_DIFFERENCE_RETAINED');}}
