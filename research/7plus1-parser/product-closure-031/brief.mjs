// Read-only review view. No assertions of semantic correctness.
import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG'),group=process.argv[2]??'first';
for(const id of process.argv.slice(3)){
 const p=path.join(root,'runs',group,id,process.env.REVIEW_FIRST==='1'?'run/revision-0/trace.json':'run/trace.json');if(!fs.existsSync(p)){console.log(id+' NOT_READY');continue;}
 const t=JSON.parse(fs.readFileSync(p)),g=t.proposal,ix=new Map([...g.entities,...g.events,...g.claims,...g.expressions].map(x=>[x.id,x])),name=id=>ix.get(id)?.label??ix.get(id)?.predicate??id;
 console.log('\n'+group+'/'+id+' SOURCE '+t.source.text+' REV '+t.revision);
 for(const e of g.events)console.log(JSON.stringify({id:e.id,p:e.predicate,mode:e.modality,layer:e.layer,use:e.use,owner:e.owner_id,roles:g.claims.filter(x=>x.kind==='ROLE'&&x.event_id===e.id).map(x=>[x.id,x.role,name(x.entity_id)]),constraints:e.constraint_ids}));
 for(const c of g.claims.filter(x=>x.kind!=='ROLE'))console.log(JSON.stringify(c));
 for(const x of g.expressions)console.log(JSON.stringify({...x,state:x.state?{...x.state,args:x.state.args.map(name),event:name(x.state.event_id)}:null}));
 for(const e of g.entities)console.log(JSON.stringify({id:e.id,label:e.label,type:e.type,alternatives:e.alternatives.map(name)}));
 console.log(JSON.stringify({issues:g.issues,audit:t.audit.reviews.filter(x=>x.verdict!=='SUPPORT'),omissions:t.audit.omissions,technical:t.technical.rows.filter(x=>x.status!=='ACCEPTED').map(({id,status,errors,uncertain})=>({id,status,errors,uncertain})),slots:Object.fromEntries(Object.entries(t.canonical.slots).map(([k,v])=>[k,[v.status,v.entries.map(x=>[x.kind,x.event?.id,x.claim?.id,x.entity?.label,x.status])]]))}));
 if(process.env.REVIEW_ZH==='1')console.log(t.chinese);
 if(t.revision&&process.env.REVIEW_RAW_FIRST==='1')console.log('FIRST_GRAPH '+JSON.stringify(JSON.parse(fs.readFileSync(path.join(path.dirname(p),'revision-0/proposal.json')))));
}
