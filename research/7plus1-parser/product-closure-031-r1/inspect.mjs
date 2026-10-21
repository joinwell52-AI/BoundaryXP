import fs from 'node:fs';import path from 'node:path';import {report} from './prepare.mjs';
const group=process.argv[2];
for(const id of process.argv.slice(3)){
 const file=path.join(report,'runs',group,id,'run',process.env.REVIEW_FIRST==='1'?'revision-0/trace.json':'trace.json');if(!fs.existsSync(file)){console.log(id+' NOT_READY');continue;}const t=JSON.parse(fs.readFileSync(file)),g=t.proposal,ix=new Map([...g.entities,...g.events,...g.claims,...g.expressions].map(x=>[x.id,x])),name=id=>ix.get(id)?.label??ix.get(id)?.predicate??id;
 console.log('\n'+id+' SOURCE '+t.source.text+' REV='+t.revision);
 for(const e of g.events)console.log(JSON.stringify({id:e.id,p:e.predicate,mode:e.modality,layer:e.layer,use:e.use,owner:e.owner_id,roles:g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===e.id).map(c=>[c.id,c.role,name(c.entity_id)]),constraints:e.constraint_ids}));
 for(const c of g.claims.filter(c=>c.kind!=='ROLE'))console.log(JSON.stringify(c));
 for(const x of g.expressions)console.log(JSON.stringify({...x,state:x.state?{...x.state,args:x.state.args.map(name),event:name(x.state.event_id)}:null}));
 console.log(JSON.stringify({entities:g.entities.map(e=>[e.id,e.label,e.alternatives]),issues:g.issues,audit:t.audit.reviews.filter(x=>x.verdict!=='SUPPORT'),omissions:t.audit.omissions,technical:t.technical.rows.filter(x=>x.status!=='ACCEPTED').map(x=>[x.id,x.status,x.errors,x.uncertain]),artifacts:t.canonical.artifact_dependencies,slots:Object.fromEntries(Object.entries(t.canonical.slots).map(([k,v])=>[k,[v.status,v.entries.map(f=>[f.kind,f.event?.id,f.claim?.id,f.entity?.label,f.status])]]))}));
}
