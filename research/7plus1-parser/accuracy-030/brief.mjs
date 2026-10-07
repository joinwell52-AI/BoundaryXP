// Evaluation-only read view. Never imported by the frozen compiler.
import fs from 'node:fs';import path from 'node:path';
const dir=path.resolve(process.argv[2]);const t=JSON.parse(fs.readFileSync(path.join(dir,'trace.json'),'utf8'));
const view=t=>{
 const g=t.proposal,ix=new Map([...g.entities,...g.events,...g.expressions].map(x=>[x.id,x]));
 const lab=id=>ix.get(id)?.label??id;
 const st=new Map(t.technical?.rows?.map(r=>[r.id,r])??[]);
 const status=id=>{const r=st.get(id);return r?{status:r.status,identity:r.identity_status,errors:r.errors,uncertain:r.uncertain}:{};};
 return {revision:t.revision,entities:g.entities.map(e=>({id:e.id,label:e.label,type:e.type,alternatives:e.alternatives.map(lab),...status(e.id)})),events:g.events.map(e=>({...e,roles:g.claims.filter(c=>c.kind==='ROLE'&&c.event_id===e.id).map(c=>({id:c.id,role:c.role,entity:lab(c.entity_id),scope:c.scope_id,note:c.note,sources:c.sources,...status(c.id)})),...status(e.id)})),claims:g.claims.filter(c=>c.kind!=='ROLE').map(c=>({...c,...status(c.id)})),expressions:g.expressions.map(e=>({...e,...status(e.id)})),issues:g.issues,audit_non_support:t.audit?.reviews?.filter(r=>r.verdict!=='SUPPORT'),audit_issues:t.audit?.issues,audit_omissions:t.audit?.omissions,diagnostics:t.technical?.diagnostics};
};
console.log('SOURCE',t.source.text);console.log('FINAL CANDIDATE',JSON.stringify(view(t)));
if(t.revision>0){const first=JSON.parse(fs.readFileSync(path.join(dir,'revision-0','trace.json'),'utf8'));console.log('FIRST CANDIDATE',JSON.stringify(view(first)));}
const fv=f=>({id:f.id,event:f.event?.id,claim:f.claim?.id,entity:f.entity?.label,kind:f.kind,constraints:f.constraints?.map(c=>c.id),content_quantities:f.content_quantities?.map(c=>c.id),content_scopes:f.content_scopes?.map(c=>c.id)});
console.log('CANONICAL',JSON.stringify({slots:Object.fromEntries(Object.entries(t.canonical.slots).map(([k,v])=>[k,{status:v.status,entries:v.entries.map(fv)}])),retained:t.canonical.retained_nonprojected.map(fv),gaps:t.canonical.gaps,unresolved:t.canonical.unresolved.map(f=>({...fv(f),status:f.status}))}));
console.log('CHINESE',t.chinese);
