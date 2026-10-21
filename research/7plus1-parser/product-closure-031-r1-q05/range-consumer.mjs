// Test observations are synthetic, not real configuration or business decisions.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {report,write} from './check.mjs';
const root=path.resolve('.boundx/experiments/031-r1/packages/q05-c1');
const {evaluateScope}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/scopes.mjs')));
const rows=[];
const categories=(g,key,seen=new Set())=>{if(seen.has(key))return [];seen.add(key);const e=g.expressions.find(e=>e.id===key);return e?.op==='CATEGORY'?[e]:(e?.operands??[]).flatMap(k=>categories(g,k,seen));};
for(const id of ['Q05','U-CN','X-CN','E-CN','U-EN','I-EN','Q05-R2']){
 const t=JSON.parse(fs.readFileSync(path.join(report,'runs',id,'run/trace.json'))),g=t.proposal;
 const scopes=g.claims.filter(c=>c.kind==='SCOPE'&&g.events.find(e=>e.id===c.event_id)?.modality==='FORBIDDEN');
 for(const c of scopes){
  const x=g.expressions.find(e=>e.id===c.expression_id),domain=categories(g,c.expression_id).find(e=>e.operands[0]===c.scope_id);
  const memberCases=domain?['TEST:member-one','TEST:member-two','TEST:outside','TEST:unknown']:[...x.operands];
  if(domain){const exception=g.expressions.find(e=>e.op==='ENUM');if(x.op==='FORALL'&&exception)memberCases.push(exception.operands[0]);}
  const observations=domain?memberCases.filter(m=>m!=='TEST:unknown').map(m=>({member_id:m,category_id:domain.operands[0],within_id:domain.operands[1]??null,value:m==='TEST:outside'?'FALSE':'TRUE'})):[];
  if(!domain)memberCases.push('TEST:outside');
  const results=memberCases.map(member=>evaluateScope(g.expressions,c.expression_id,member,{entities:g.entities,memberships:observations}));
  if(domain){assert.deepEqual(results.slice(0,4).map(r=>r.scope_value),['TRUE','TRUE','FALSE','UNKNOWN']);if(results.length>4)assert.equal(results.at(-1).scope_value,'FALSE');}
  else {assert.ok(results.slice(0,-1).every(r=>r.scope_value==='TRUE'));assert.equal(results.at(-1).scope_value,'FALSE');}
  assert.ok(results.every(r=>r.business_decision===null&&r.execution_authorization===null&&r.not_matching_is_not_permission));
  rows.push({case:id,claim_id:c.id,expression_id:x.id,quantifier:x.op,observations,results,source_spans:t.technical.rows.find(r=>r.id===c.id).sources});
 }
}
write('ACTUAL-GRAPH-RANGE-CONSUMER.json',{status:'PASS',mode:'SYNTHETIC_OBSERVATIONS_OVER_REAL_MODEL_GRAPHS',model_calls:0,source_or_business_observations_claimed:false,rows});console.log(JSON.stringify({status:'PASS',scope_checks:rows.length}));
