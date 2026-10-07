// Offline review aggregation. No model calls and no compiler/UI mutations.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
import {reviews} from './reviews.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),out=path.join(root,'docs/reports/7plus1/7P-SHORT-COMPILER-ACCURACY-030');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>createHash('sha256').update(b).digest('hex');
const expected=read(path.join(out,'EXPECTED-FACTS.json')),manifest=read(path.join(out,'RUN-MANIFEST.json'));
for(const r of manifest.expectedResources)assert.equal(hash(fs.readFileSync(path.join(root,r.path))),r.sha256,'Frozen expectations changed: '+r.path);
const runs=fs.existsSync(path.join(out,'RUN-RESULTS.json'))?read(path.join(out,'RUN-RESULTS.json')):[];
const walks=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walks(path.join(d,e.name)):[path.join(d,e.name)]):[];
const split=s=>(s??'').split(/\s+/).filter(Boolean),all=g=>['entities','events','claims','expressions'].flatMap(c=>(g[c]??[]).map(x=>({...x,collection:c})));
const status=verdicts=>verdicts.includes('ERROR')?'FAIL':verdicts.some(v=>v!=='SUPPORTED')?'REVIEW_REQUIRED':'PASS';
const evidence=(g,refs)=>all(g).filter(x=>refs.includes(x.id)).map(({collection,id,label,predicate,type,kind,layer,use,modality,polarity,owner_id,event_id,entity_id,role,expression_id,direction,temporal,quantity,scope_id,requires,op,operands,state,note,sources,mentions})=>({collection,id,label,predicate,type,kind,layer,use,modality,polarity,owner_id,event_id,entity_id,role,expression_id,direction,temporal,quantity,scope_id,requires,op,operands,state,note,sources,mentions}));
const evidenceText=items=>items.map(x=>`${x.id}: ${x.predicate??x.label??x.kind??x.op}${x.modality?' '+x.modality:''}${x.role?' '+x.role+'='+x.entity_id:''}${x.direction?' '+x.direction:''}${x.temporal?' '+x.temporal:''}${x.scope_id?' @'+x.scope_id:''}`).join('; ');
function assertions(t,source){
 const g=t.proposal,items=all(g),ids=new Set(items.map(x=>x.id)),errors=[],references=[];
 if(ids.size!==items.length)errors.push('DUPLICATE_ID');
 if(t.source.text!==source.text||t.source.sha256!==source.sha256)errors.push('SOURCE_MISMATCH');
 for(const x of items){
  const refs=[x.owner_id,x.event_id,x.entity_id,x.scope_id,x.expression_id,...(x.requires??[]),...(x.constraint_ids??[]),...(x.alternatives??[]),...(x.operands??[]),x.state?.event_id,...(x.state?.args??[]),x.quantity?.target_id,x.quantity?.count_scope].filter(y=>typeof y==='string'&&y!=='ROOT');
  for(const id of refs){references.push([x.id,id]);if(!ids.has(id))errors.push('MISSING_REFERENCE:'+x.id+'->'+id);}
  for(const s of [...(x.sources??[]),...(x.mentions??[])]){
   const occurrences=[];let start=0;while(start<=source.text.length){const i=source.text.indexOf(s.quote,start);if(i<0)break;occurrences.push(i);start=i+Math.max(1,s.quote.length);}
   if(!s.quote||!occurrences[s.occurrence-1]&&occurrences[s.occurrence-1]!==0)errors.push('BAD_SOURCE_QUOTE:'+x.id);
  }
 }
 const facts=[...Object.values(t.canonical.slots).flatMap(s=>s.entries),...(t.canonical.retained_nonprojected??[])];
 for(const f of facts){
  // Explicit local ambiguity is a valid delivered fact, not a schema failure.
  if(!['ACCEPTED','REJECTED','UNRESOLVED','DEFERRED','UNSUPPORTED'].includes(f.status))errors.push('INVALID_FACT_STATUS:'+f.id);
  for(const id of f.claim_ids??[])if(!ids.has(id))errors.push('BAD_FACT_REFERENCE:'+f.id+'->'+id);
  for(const s of f.sources??[]){if(s.source_sha256!==source.sha256||!s.span||[...source.text].slice(...s.span).join('')!==s.quote)errors.push('BAD_EXACT_SPAN:'+f.id);}
  if(f.event&&f.claim?.event_id&&f.event.id!==f.claim.event_id)errors.push('EVENT_BINDING_CORRUPTION:'+f.id);
  if(f.entity&&f.claim?.entity_id&&f.entity.id!==f.claim.entity_id)errors.push('ENTITY_BINDING_CORRUPTION:'+f.id);
 }
 if(t.canonical.business_decision!==null||t.canonical.execution_authorization!==null)errors.push('BUSINESS_AUTHORIZATION');
 return {status:errors.length?'CHECKS_FAIL':'CHECKS_PASS',errors,item_count:items.length,reference_count:references.length,accepted_fact_count:facts.length,semantic_pass_implied:false};
}
function inventory(t,inv={}){
 return all(t.proposal).map(x=>{
  const row=t.technical?.rows?.find(r=>r.id===x.id);
  let review=x.collection==='entities'?(typeof inv.entities==='object'&&!inv.entities?.verdict?inv.entities?.[x.id]:inv.entities):x.collection==='events'?inv.events?.[x.id]:x.collection==='expressions'?inv.expressions?.[x.id]:x.kind==='ROLE'?inv.roles?.[x.id]??inv.events?.[x.event_id]:inv.claims?.[x.id];
  if(typeof review==='string')review={verdict:'SUPPORTED',reason:review};
  return {id:x.id,collection:x.collection,kind:x.kind??x.op??x.type,technical_status:row?.status??'NOT_CHECKED',identity_status:row?.identity_status,independent_verdict:review?.verdict??'NOT_REVIEWED',reason:review?.reason??'未完成独立来源审阅，不从模型SUPPORT推断。',source_quotes:x.sources??x.mentions??[]};
 });
}
const results=[];
for(const group of ['first','repeat-1','repeat-2'])for(const c of expected.cases){
 if(group!=='first'&&!manifest.repeat_ids.includes(c.id))continue;
 const key=group+'/'+c.id,run=runs.find(x=>x.group===group&&x.id===c.id),dir=path.join(out,'runs',group,c.id,'run'),file=path.join(dir,'trace.json'),r=reviews[key];
 if(!run||!fs.existsSync(file)){results.push({group,id:c.id,status:run?'ENV_FAILED':'NOT_RUN',runtime_status:run?.status??'NOT_RUN',error:run?.error??null});continue;}
 const t=read(file),first=read(path.join(dir,'revision-0/proposal.json')),initialTrace=read(path.join(dir,'revision-0/trace.json'));
 assert.deepEqual(initialTrace.proposal,first,'First raw proposal must be preserved');
 const check=assertions(t,c);assert.deepEqual(read(path.join(dir,'7plus1.json')),t.canonical);assert.equal(fs.readFileSync(path.join(dir,'7plus1.zh.md'),'utf8'),t.chinese);
 if(r)assert.equal(r.facts.length,c.facts.length,key+' fact coverage');
 const finalItems=inventory(t,r?.inventory),initialItems=inventory(initialTrace,r?.first_inventory??(t.revision===0?r?.inventory:{}));
 const factResults=c.facts.map((f,i)=>{
  const note=r?.facts[i],override=note?.[2]??{},v=stage=>override[stage]??(note?'SUPPORTED':'NOT_REVIEWED');
  const finalRefs=split(note?.[0]),firstRefs=split(override.first_refs??note?.[0]);
  if(note){const ids=new Set(all(t.proposal).map(x=>x.id));for(const id of finalRefs)assert(ids.has(id),key+' bad final evidence '+id);const ids0=new Set(all(first).map(x=>x.id));for(const id of firstRefs)assert(ids0.has(id),key+' bad first evidence '+id);}
  const actualFirst=evidence(first,firstRefs),actualFinal=evidence(t.proposal,finalRefs);
  const canonicalRefs=Object.entries(t.canonical.slots).flatMap(([slot,s])=>s.entries.filter(x=>(x.claim_ids??[]).some(id=>finalRefs.includes(id))).map(x=>({slot,fact_id:x.id,event_id:x.event?.id,claim_id:x.claim?.id,entity_id:x.entity?.id,constraint_ids:x.constraints?.map(c=>c.id)})));
  return {expected:f,first:{verdict:v('first'),refs:firstRefs,actual:actualFirst},final_candidate:{verdict:v('final'),refs:finalRefs,actual:actualFinal},canonical_json:{verdict:v('canonical'),refs:finalRefs,canonical_refs:canonicalRefs},delivered:{verdict:v('delivered'),refs:finalRefs,canonical_refs:canonicalRefs},reason:note?.[1]??'尚未独立逐事实审阅。'};
 });
 const findings=r?.findings??[],layerStatus=(stage,items)=>status([...factResults.map(f=>f[stage].verdict),...items.map(x=>x.independent_verdict),...findings.filter(f=>(f.affects??['first','final_candidate','delivered']).includes(stage)).map(f=>f.verdict??'ERROR')]);
 const usedIds=new Set([...Object.values(t.canonical.slots).flatMap(s=>s.entries),...t.canonical.retained_nonprojected].flatMap(f=>f.claim_ids??[]));
 const deliveredItems=finalItems.filter(i=>usedIds.has(i.id));
 const firstStatus=layerStatus('first',initialItems),finalStatus=layerStatus('final_candidate',finalItems),jsonStatus=check.errors.length?'FAIL':layerStatus('canonical_json',deliveredItems),deliveredStatus=check.errors.length?'FAIL':layerStatus('delivered',deliveredItems);
 results.push({group,id:c.id,source:c.text,source_sha256:c.sha256,status:deliveredStatus,runtime_status:run.status,initial_candidate_status:firstStatus,final_candidate_status:finalStatus,canonical_json_status:jsonStatus,revision:t.revision,real_requests:run.model_requests_in_run,elapsed_ms:run.elapsed_ms,structure_checks:check,facts:factResults,first_inventory:initialItems,final_inventory:finalItems,findings,notes:r?.notes??'',paths:{run:path.relative(out,dir).replaceAll('\\','/'),trace:path.relative(out,file).replaceAll('\\','/')}});
}
const states=rows=>Object.fromEntries(['PASS','FAIL','REVIEW_REQUIRED','ENV_FAILED','NOT_RUN'].map(k=>[k,rows.filter(r=>r.status===k).length]));
const first=results.filter(r=>r.group==='first'),extra=results.filter(r=>r.group!=='first');
const summary={reviewer:'executing Codex; not ADMIN acceptance or independent human Gold',as_of:new Date().toISOString(),total_distinct_sources:30,total_planned_runs:40,first_states:states(first),extra_states:states(extra),initial_candidate_correct:first.filter(r=>r.initial_candidate_status==='PASS').length,final_candidate_correct:first.filter(r=>r.final_candidate_status==='PASS').length,canonical_json_correct:first.filter(r=>r.canonical_json_status==='PASS').length,delivered_correct:first.filter(r=>r.status==='PASS').length,model_requests_completed_runs:runs.reduce((n,r)=>n+r.model_requests_in_run,0),review_complete:results.every(r=>r.facts?.every(f=>![f.first.verdict,f.final_candidate.verdict,f.delivered.verdict].includes('NOT_REVIEWED'))),results};
fs.writeFileSync(path.join(out,'CASE-RESULTS.json'),JSON.stringify(summary,null,2)+'\n');
const fmt=f=>f.predicate?[f.actor,f.predicate,f.object,f.modality].join(' / '):f.detail;
let md='# 030 逐案来源审阅\n\n评审者：执行Codex；不是ADMIN Gold或模型自审评分。CHECKS与语义结论分开。最终JSON与包含中文的最终交付单列。\n\n| Run | Runtime | First candidate | Final candidate | Canonical JSON | Delivered | Revision | Calls |\n|---|---|---|---|---|---|---|---|\n';
for(const r of results)md+=`| ${r.group}/${r.id} | ${r.runtime_status} | ${r.initial_candidate_status??'-'} | ${r.final_candidate_status??'-'} | ${r.canonical_json_status??'-'} | ${r.status} | ${r.revision??'-'} | ${r.real_requests??0} |\n`;
for(const r of results){md+=`\n## ${r.group}/${r.id}\n\n${r.source??''}\n\n${r.notes??r.error??''}\n\n`;if(!r.facts)continue;md+=`原始完整证据：[Trace](${r.paths.trace})；结构检查 ${r.structure_checks.status}，不代表语义通过。\n\n| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |\n|---|---|---|---|---|---|\n`;for(const f of r.facts)md+=`| ${f.expected.id} | ${fmt(f.expected).replaceAll('|','/')} | ${f.first.verdict}: ${evidenceText(f.first.actual).replaceAll('|','/')} | ${f.final_candidate.verdict}: ${evidenceText(f.final_candidate.actual).replaceAll('|','/')} | ${f.delivered.verdict}: ${f.delivered.canonical_refs.map(x=>x.slot+'/'+x.fact_id).join(', ')} | ${f.delivered.refs.join(', ')}：${f.reason.replaceAll('|','/')} |\n`;md+='\n所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。\n';}
fs.writeFileSync(path.join(out,'CASE-RESULTS.md'),md);
console.log(JSON.stringify({...summary,results:undefined},null,2));
