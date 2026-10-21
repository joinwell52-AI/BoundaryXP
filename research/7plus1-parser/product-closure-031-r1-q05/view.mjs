// Read-only source review aid; does not score or repair outputs.
import fs from 'node:fs';import path from 'node:path';import {report} from './check.mjs';
for(const id of process.argv.slice(2)){
 const p=path.join(report,'runs',id,'run/trace.json');if(!fs.existsSync(p)){console.log(id+' NOT_COMPLETED');continue;}
 const t=JSON.parse(fs.readFileSync(p)),g=t.proposal,names=new Map(g.entities.map(e=>[e.id,e.label]));
 console.log(JSON.stringify({id,text:t.source.text,revision:t.revision,entities:g.entities,events:g.events.map(e=>({...e,roles:g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===e.id).map(c=>({id:c.id,role:c.role,entity:names.get(c.entity_id),sources:c.sources})),scopes:g.claims.filter(c=>c.kind==='SCOPE'&&c.event_id===e.id),constraints:g.claims.filter(c=>e.constraint_ids.includes(c.id))})),expressions:g.expressions,artifacts:g.claims.filter(c=>c.kind==='ARTIFACT_USE'),root:g.claims.filter(c=>['COMPLETION','STOP'].includes(c.kind)),non_accepted:t.technical.rows.filter(r=>r.status!=='ACCEPTED'),coverage:t.technical.coverage,gaps:t.ir.gaps,audit_issues:t.audit.issues,omissions:t.audit.omissions,slots:Object.fromEntries(Object.entries(t.canonical.slots).map(([k,v])=>[k,v.status]))}));
}
