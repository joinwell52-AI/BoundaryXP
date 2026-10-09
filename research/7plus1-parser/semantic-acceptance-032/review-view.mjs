// A read-only review lens. Never scores a case or creates expected semantics.
import fs from 'node:fs';import path from 'node:path';import {report} from './prepare.mjs';
const compact=(value)=>{
 if(Array.isArray(value))return value.map(compact);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([k])=>!['proof','source_sha256','provenance_refs','audit_refs','checks','context_references_are_not_required_dependencies'].includes(k)).map(([k,v])=>[k,k==='sources'?v.map(s=>({quote:s.quote,span:s.span})):compact(v)]));
 return value;
};
for(const id of process.argv.slice(2)){
 const paths=[path.join(report,'runs/final-c2',id,'run/trace.json'),path.join(report,'runs/connectivity-recheck-c2',id,'run/trace.json'),path.join(report,'runs/consumer-r02-replay',id,'run/trace.json')],p=paths.find(p=>fs.existsSync(p));if(!p){console.log(JSON.stringify({id,status:'NO_COMPLETE_TRACE'}));continue;}
 const t=JSON.parse(fs.readFileSync(p));console.log(JSON.stringify({id,path:path.relative(report,p).replaceAll('\\','/'),source:t.source.text,revision:t.revision,candidate:compact(t.proposal),audit_issues:compact(t.audit.issues),audit_omissions:compact(t.audit.omissions),audit_non_support:t.audit.reviews.filter(r=>r.verdict!=='SUPPORT'),technical_valid:t.technical.valid,ir_statuses:t.ir.facts.map(f=>({id:f.id,status:f.status,kind:f.kind,claim:f.claim?.id,event:f.event?.id,slots:f.slots})),slots:Object.fromEntries(Object.entries(t.canonical.slots).map(([s,v])=>[s,{status:v.status,openness:v.openness,ids:v.entries.map(e=>e.id)}])),unresolved:t.canonical.unresolved.map(e=>({id:e.id,kind:e.kind,status:e.status})),gaps:compact(t.canonical.gaps),chinese:t.chinese},null,0));
}
