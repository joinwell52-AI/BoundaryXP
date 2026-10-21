// Offline checks on saved actual structures. No semantic generation, model call or mutation.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {evaluateExpression,evaluateQuantity,evaluateCondition} from '../llm-first-028/compile.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const out=path.join(root,'docs/reports/7plus1/7P-SHORT-COMPILER-ACCURACY-030');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),rows=[];
const check=(run,name,actual,expected)=>rows.push({run,check:name,actual,expected,status:JSON.stringify(actual)===JSON.stringify(expected)?'CHECKS_PASS':'CHECKS_FAIL'});
for(const r of read(path.join(out,'RUN-RESULTS.json'))){
 if(r.status!=='RUN_SUCCEEDED')continue;
 const key=r.group+'/'+r.id,t=read(path.join(out,'runs',r.group,r.id,'run/trace.json')),g=t.proposal;
 const leaves=id=>{const x=g.expressions.find(e=>e.id===id);return !x?[]:x.op==='STATE'?[x]:x.operands.flatMap(leaves);};
 for(const c of g.claims.filter(x=>['CONDITION','COMPLETION','STOP'].includes(x.kind))){
  const v=evaluateCondition(c,g.expressions);
  check(key,c.id+':no_observed_state',v.condition_value,'UNKNOWN');
  check(key,c.id+':target_and_direction',[v.target_id,v.direction,v.temporal],[c.event_id??c.scope_id,c.direction,c.temporal]);
  check(key,c.id+':no_business_authorization',[v.business_decision,v.execution_authorization],[null,null]);
 }
 for(const c of g.claims.filter(x=>x.kind==='QUANTITY')){
  const q=c.quantity,observed=n=>({value:n,unit:q.unit,target_id:q.target_id,count_scope:q.count_scope});
  const expected={EQ:['FALSE','TRUE','FALSE'],LT:['TRUE','FALSE','FALSE'],LTE:['TRUE','TRUE','FALSE'],GT:['FALSE','FALSE','TRUE'],GTE:['FALSE','TRUE','TRUE']}[q.comparator];
  check(key,c.id+':comparator',[-1,0,1].map(d=>evaluateQuantity(q,observed(q.value+d))),expected);
  check(key,c.id+':unknown_without_observation',evaluateQuantity(q,null),'UNKNOWN');
  check(key,c.id+':wrong_target_unknown',evaluateQuantity(q,{...observed(q.value),target_id:'evaluation-only-different-target'}),'UNKNOWN');
  check(key,c.id+':wrong_unit_unknown',evaluateQuantity(q,{...observed(q.value),unit:'evaluation-only-different-unit'}),'UNKNOWN');
  const where=Object.entries(t.canonical.slots).filter(([,s])=>s.entries.some(f=>f.claim?.id===c.id||(f.content_quantities??[]).some(x=>x.id===c.id))).map(([slot])=>slot);
  check(key,c.id+':quantity_view',where,q.use==='OUTPUT_CONTENT'?['O']:['R']);
 }
 if(r.id==='Q21'){
  const necessary=g.claims.find(c=>c.kind==='CONDITION'&&c.direction==='NECESSARY'),sufficient=g.claims.find(c=>c.kind==='CONDITION'&&c.direction==='SUFFICIENT');
  const ns=necessary?leaves(necessary.expression_id):[];
  if(ns.length===2&&sufficient){
   const truth=[[false,false],[false,true],[true,false],[true,true]];
   check(key,'both_approvals_and_any_missing',truth.map(a=>{const obs=Object.fromEntries(ns.map((x,i)=>[x.id,a[i]]));return [evaluateExpression(g.expressions,necessary.expression_id,obs),evaluateExpression(g.expressions,sufficient.expression_id,obs)];}),[['FALSE','TRUE'],['FALSE','TRUE'],['FALSE','TRUE'],['TRUE','FALSE']]);
  }else check(key,'two_approval_structure',ns.length,2);
 }
 if(r.id==='Q22'||r.id==='Q23')check(key,'completion_direction',g.claims.filter(c=>c.kind==='COMPLETION').map(c=>c.direction),[r.id==='Q22'?'NECESSARY':'SUFFICIENT']);
 if(r.id==='Q26'){
  const scope=g.claims.find(c=>c.kind==='SCOPE'&&g.events.find(e=>e.id===c.event_id)?.modality==='REQUIRED');
  const value=scope?evaluateExpression(g.expressions,scope.expression_id):'UNKNOWN';
  check(key,'effective_scope_excludes_B_D',value instanceof Set?[...value].map(id=>g.entities.find(e=>e.id===id)?.label).sort():value,['测试机A','测试机C']);
  check(key,'four_is_not_resource_quantity',g.claims.filter(c=>c.kind==='QUANTITY').length,0);
 }
}
const result={at:new Date().toISOString(),source:'saved actual proposals; calls=0; no source text altered',semantic_pass_implied:false,checks:rows.length,failed:rows.filter(r=>r.status==='CHECKS_FAIL').length,rows};
fs.writeFileSync(path.join(out,'LOGIC-CHECKS.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,rows:undefined},null,2));
