// Evaluation-only field checks against predeclared facts and independently read refs.
// Differences are review flags, never an automatic semantic PASS or a runtime patch.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {reviews} from './reviews.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),out=path.join(root,'docs/reports/7plus1/7P-SHORT-COMPILER-ACCURACY-030'),expected=JSON.parse(fs.readFileSync(path.join(out,'EXPECTED-FACTS.json'),'utf8'));
const rows=[];
for(const [key,r] of Object.entries(reviews)){
 const [group,id]=key.split('/'),dir=path.join(out,'runs',group,id,'run'),p=path.join(dir,'trace.json');if(!fs.existsSync(p))continue;
 const trace=JSON.parse(fs.readFileSync(p,'utf8')),g=trace.proposal,ix=new Map([...g.entities,...g.events,...g.claims,...g.expressions].map(x=>[x.id,x]));
 const c=expected.cases.find(x=>x.id===id);
 c.facts.forEach((f,i)=>{
  const refs=r.facts[i][0].split(/\s+/).map(x=>ix.get(x)).filter(Boolean);
  if(f.kind==='ACTION'){
   const re=new RegExp(expected.verbPatterns[f.predicate]),events=refs.filter(x=>x.predicate&&re.test(x.predicate));
   const bindings=events.map(e=>({event_id:e.id,modality:e.modality,roles:g.claims.filter(x=>x.kind==='ROLE'&&x.event_id===e.id&&['PERFORMER','ORGANIZER','REVIEWER'].includes(x.role)).map(x=>({claim_id:x.id,role:x.role,entity_id:x.entity_id,label:ix.get(x.entity_id)?.label}))}));
   rows.push({run:key,fact_id:f.id,check:'ACTION_MODALITY_AND_ACTOR',expected:{modality:f.modality,actor:f.actor},actual:bindings,status:bindings.some(x=>x.modality===f.modality&&x.roles.some(y=>y.label===f.actor))?'FIELDS_MATCH':'FIELD_DIFFERENCE_REQUIRES_REVIEW'});
  }
  if(f.kind==='IDENTITY'){
   const roleRefs=refs.filter(x=>x.kind==='ROLE'&&['OBJECT','RESULT','INPUT_OBJECT'].includes(x.role));
   rows.push({run:key,fact_id:f.id,check:'SHARED_OBJECT_IDENTITIES',actual:roleRefs.map(x=>({claim_id:x.id,entity_id:x.entity_id,label:ix.get(x.entity_id)?.label})),status:roleRefs.length&&new Set(roleRefs.map(x=>x.entity_id)).size===1?'FIELDS_MATCH':'FIELD_DIFFERENCE_REQUIRES_REVIEW',note:'Different IDs may be equivalent only with an explicit identity/version link; inspect full graph, do not hardcode ID equality as semantic truth.'});
  }
 });
}
const result={as_of:new Date().toISOString(),semantic_pass_implied:false,source_expectations_changed:false,rows};fs.writeFileSync(path.join(out,'FIELD-CHECKS.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({checks:rows.length,differences:rows.filter(x=>x.status!=='FIELDS_MATCH').map(x=>({run:x.run,fact:x.fact_id,check:x.check,actual:x.actual}))},null,2));
