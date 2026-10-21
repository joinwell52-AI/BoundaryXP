// Case-specific source assertions and observation fixtures stay in this offline
// review harness. The production calculator receives typed IR only.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
const root=path.resolve(process.argv[2]??'.boundx/owned-event-calculus-r01/work');
const output=path.resolve(process.argv[3]??'docs/reports/7plus1/MANUAL-FULL-FLOW-CALCULUS-r01/work-review');
if(fs.existsSync(output))throw Error('FIRST_REVIEW_RESULTS_EXIST');fs.mkdirSync(output,{recursive:true});
const reference=path.resolve('docs/testing/7plus1/MANUAL-TEST-001-standard-r01'),read=p=>JSON.parse(fs.readFileSync(p));
const expected=read(path.join(reference,'expected.json')),prior=read(path.join(reference,'actual/ui36/trace.json'));
const load=f=>import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028',f)));
const {calculateBoundary,renderCalculations}=await load('calculus.mjs'),{technicalValidate}=await load('validate.mjs'),{compileBoundary}=await load('compile.mjs');
const checks=technicalValidate(prior.source,prior.proposal,prior.audit),compiled=compileBoundary(prior.source,prior.proposal,prior.audit,checks);
assert.deepEqual(compiled.ir,prior.ir);assert.deepEqual(compiled.canonical,prior.canonical);assert.equal(prior.source.sha256,expected.source.sha256);
const g=prior.proposal,index=new Map([...g.entities,...g.events,...g.claims,...g.expressions].map(x=>[x.id,x]));
const label=id=>index.get(id)?.label,role=(e,r,n)=>g.claims.some(c=>c.kind==='ROLE'&&c.event_id===e&&c.role===r&&label(c.entity_id)===n);
const sourceResults=[];const check=(id,pass,refs)=>sourceResults.push({requirement_id:id,pass:!!pass,candidate_refs:refs,ir_fact_ids:compiled.ir.facts.filter(f=>f.claim_ids.some(x=>refs.includes(x))).map(f=>f.id),sources:expected.requirements.find(x=>x.id===id).sources});
check('REQ-01',role('e_work','BASIS','《配置核查规程》v1.2'),['c_rule']);
check('REQ-02',role('e_org','ORGANIZER','PM')&&!role('e_dev_check','PERFORMER','PM')&&!role('e_ops_check','PERFORMER','PM'),['c_org_pm']);
check('REQ-03',index.get('x_inputs').op==='UNION'&&index.get('c_input_scope').event_id==='e_work'&&role('e_work','INPUT_OBJECT','app.yaml')&&role('e_work','INPUT_OBJECT','env.json')&&g.claims.filter(c=>c.role==='INPUT_OBJECT').every(c=>['app.yaml','env.json'].includes(label(c.entity_id))),['c_input_scope','x_inputs','c_work_app','c_work_env']);
check('REQ-04',index.get('c_test_scope').event_id==='e_work'&&index.get('x_test').operands[0]==='n_test', ['c_test_scope','x_test']);
const q=g.claims.find(x=>x.kind==='QUANTITY');check('REQ-05',q.quantity.value===30&&q.quantity.comparator==='LTE'&&q.quantity.target_id==='e_work'&&q.quantity.distribution.mode==='AGGREGATE'&&q.quantity.count_scope==='ROOT'&&g.claims.filter(x=>x.kind==='QUANTITY').length===1,[q.id]);
check('REQ-06',role('e_dev_check','PERFORMER','DEV')&&role('e_dev_check','INPUT_OBJECT','app.yaml'),['c_dev_check_p','c_dev_check_i']);
check('REQ-07',role('e_dev_gen','PERFORMER','DEV')&&role('e_dev_gen','RESULT','dev.md'),['c_dev_gen_p','c_dev_result']);
check('REQ-08',role('e_ops_check','PERFORMER','OPS')&&role('e_ops_check','INPUT_OBJECT','env.json'),['c_ops_check_p','c_ops_check_i']);
check('REQ-09',role('e_ops_gen','PERFORMER','OPS')&&role('e_ops_gen','RESULT','ops.md'),['c_ops_gen_p','c_ops_result']);
check('REQ-10',role('e_dev_submit','PERFORMER','DEV')&&role('e_dev_submit','DELIVERABLE','dev.md')&&role('e_dev_submit','RECIPIENT','QA'),['c_dev_submit_p','c_dev_deliverable','c_dev_recipient','c_dev_submit_flow']);
check('REQ-11',role('e_ops_submit','PERFORMER','OPS')&&role('e_ops_submit','DELIVERABLE','ops.md')&&role('e_ops_submit','RECIPIENT','QA'),['c_ops_submit_p','c_ops_deliverable','c_ops_recipient','c_ops_submit_flow']);
check('REQ-12',index.get('c_review_order').temporal==='AFTER'&&index.get('c_review_order').direction==='ORDER'&&index.get('x_submissions').op==='AND'&&JSON.stringify(index.get('x_submissions').operands)===JSON.stringify(['x_dev_submitted','x_ops_submitted']),['c_review_order','x_submissions']);
check('REQ-13',role('e_review','REVIEWER','QA')&&role('e_review','OBJECT','dev.md')&&role('e_review','OBJECT','ops.md'),['c_review_p','c_review_dev','c_review_ops']);
check('REQ-14',['c_summary_condition','c_deliver_condition'].every(id=>index.get(id).temporal==='AFTER'&&index.get(id).direction==='SUFFICIENT'&&index.get(id).expression_id==='x_review_pass'),['c_summary_condition','c_deliver_condition']);
check('REQ-15',role('e_summary','PERFORMER','PM')&&role('e_summary','RESULT','summary.md'),['c_summary_p','c_summary_result']);
check('REQ-16',role('e_summary','BASIS','dev.md')&&role('e_summary','BASIS','ops.md')&&role('e_summary','OBJECT','dev.md')&&role('e_summary','OBJECT','ops.md'),['c_summary_basis_dev','c_summary_basis_ops','c_summary_obj_dev','c_summary_obj_ops','c_summary_dev_flow','c_summary_ops_flow']);
check('REQ-17',role('e_deliver','PERFORMER','PM')&&role('e_deliver','DELIVERABLE','summary.md')&&role('e_deliver','RECIPIENT','ADMIN'),['c_deliver_p','c_summary_deliverable','c_summary_recipient']);
check('REQ-18',index.get('x_complete').op==='AND'&&JSON.stringify(index.get('x_complete').operands)===JSON.stringify(['x_submissions','x_review_pass','x_summary_delivered'])&&index.get('c_completion').direction==='SUFFICIENT', ['c_completion','x_complete']);
check('REQ-19',role('e_stop','PERFORMER','PM')&&role('e_stop','OBJECT','本任务')&&index.get('c_stop_condition').expression_id==='x_high_found'&&index.get('c_stop_condition').direction==='SUFFICIENT', ['c_stop_p','c_stop_obj','c_stop_condition','c_root_stop']);
check('REQ-20',index.get('x_immediate').test.operator==='IMMEDIATE'&&index.get('x_immediate').test.target_id==='e_stop'&&index.get('x_immediate').test.event_id==='e_stop'&&index.get('x_immediate').test.value===null,['c_stop_immediate','x_immediate']);
check('REQ-21',role('e_notify','PERFORMER','PM')&&role('e_notify','RECIPIENT','ADMIN')&&index.get('c_notify_condition').expression_id==='x_high_found'&&index.get('c_notify_condition').direction==='SUFFICIENT',['c_notify_p','c_notify_recipient','c_notify_condition']);
check('REQ-22',index.get('e_modify').modality==='FORBIDDEN'&&JSON.stringify(index.get('n_inputs').members)===JSON.stringify(['n_app','n_env'])&&index.get('c_modify_scope').expression_id==='x_input_members',['e_modify','c_modify_scope','x_input_members']);
check('REQ-23',index.get('e_access').modality==='FORBIDDEN'&&role('e_access','OBJECT','生产环境'),['e_access','c_access_obj']);
const base=calculateBoundary(compiled.ir),scenarioResults=[];
const bindings={D:'x_dev_submitted',O:'x_ops_submitted',Q:'x_review_pass',S:'x_summary_delivered',H:'x_high_found'};
for(const scenario of expected.scenarios){
 const fixture=scenario.observations,observations={states:{}};
 for(const [name,id]of Object.entries(bindings))if(typeof fixture[name]==='boolean')observations.states[id]=fixture[name];
 if('elapsed_minutes'in fixture)observations.quantities={[q.id]:{value:fixture.elapsed_minutes,unit:fixture.quantity_binding==='MATCH'?q.quantity.unit:'seconds',target_id:q.quantity.target_id,count_scope:q.quantity.count_scope}};
 if('immediate'in fixture){const t=index.get('x_immediate').test;observations.tests={x_immediate:{...t,target_id:fixture.property_binding==='MATCH'?t.target_id:'another-event',known:true,immediate:fixture.immediate}};}
 if(fixture.query_modify){const id=g.entities.find(x=>x.label===fixture.query_modify)?.id??'unknown-identity';observations.range_queries={c_modify_scope:[{id:scenario.id,target_id:id,identity_known:true}]};}
 if('used_portion_available'in fixture){const r=compiled.ir.artifact_dependencies[0];observations.artifacts={[r.id]:{artifact_id:fixture.artifact_binding==='MATCH'?r.artifact_id:'other-report',producer_event_id:r.producer_event_id,used_portion_available:fixture.used_portion_available}};}
 const calculated=calculateBoundary(compiled.ir,observations),actual={};
 for(const key of Object.keys(scenario.expected)){
  if(key==='completion')actual[key]=calculated.conditions.find(x=>x.kind==='COMPLETION').condition_value;
  else if(key==='high_risk')actual[key]=calculated.conditions.find(x=>x.kind==='STOP').condition_value;
  else if(key==='duration')actual[key]=calculated.quantities[0].result;
  else if(key==='immediate')actual[key]=calculated.ranges.find(x=>x.expression_id==='x_immediate').result;
  else if(key==='availability')actual[key]=calculated.availability[0].result;
  else if(key==='prohibition_membership')actual[key]=calculated.ranges.find(x=>x.expression_id==='x_input_members').membership_queries?.[0]?.result??'NOT_SUPPORTED';
  else if(key==='execution_authorization')actual[key]=calculated.execution_authorization;
  else actual[key]='UNKNOWN'; // No supplied business execution/completion observation is claimed.
 }
 const pass=JSON.stringify(actual)===JSON.stringify(scenario.expected);
 scenarioResults.push({id:scenario.id,synthetic:true,pass,expected:scenario.expected,actual,observations});
 fs.writeFileSync(path.join(output,scenario.id+'.json'),JSON.stringify({fixture:scenario,observations,actual,pass,calculation:calculated},null,2)+'\n',{flag:'wx'});
}
const rows={source_sha256:expected.source.sha256,real_model_calls:0,mode:'SAME_REAL_MODEL_RESPONSES_CONSUMER_REPLAY',model_resource_change:false,semantic_checks:sourceResults,semantic_pass:sourceResults.every(x=>x.pass),
 observations:scenarioResults,observation_pass:scenarioResults.every(x=>x.pass),ir_identical:true,canonical_identical:true,
 calculation:{before_status:prior.boundary_calculations.status,after_status:base.status,before_unsupported:prior.boundary_calculations.unsupported.length,after_unsupported:base.unsupported.length,before_order_edges:prior.boundary_calculations.dependency.edges.length,after_order_edges:base.dependency.edges.length,after_conditional_edges:base.dependency.conditional_edges.length,cycles:base.dependency.cycles.length},
 proof_paths_complete:[...base.boolean.formulas,...base.dependency.edges,...base.dependency.conditional_edges].every(f=>(f.ownership_paths??[]).every(p=>p.supported&&p.evidence.every(e=>e.sources?.length))),
 source_semantic_generalization:'NOT_PROVEN',full_bxp_conformance:'NOT_PROVEN',business_decision:null,execution_authorization:null};
fs.writeFileSync(path.join(output,'REVIEW.json'),JSON.stringify(rows,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(output,'boundary-calculations.json'),JSON.stringify(base,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(output,'7plus1.json'),JSON.stringify(compiled.canonical,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(output,'7plus1.zh.md'),compiled.chinese+renderCalculations(base),{flag:'wx'});
fs.writeFileSync(path.join(output,'boundary-ir.json'),JSON.stringify(compiled.ir,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(output,'technical-validation.json'),JSON.stringify(checks,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(output,'trace.json'),JSON.stringify({format:'boundx-calculus-consumer-replay/r01',new_real_model_calls:0,input_real_run_id:'2d564b91-2496-4fd2-9314-f71eb794408b',original_frontend_product:prior.product_snapshot,source:prior.source,proposal:prior.proposal,audit:prior.audit,technical:checks,ir:compiled.ir,canonical:compiled.canonical,chinese:compiled.chinese+renderCalculations(base),boundary_calculations:base,input_real_trace_sha256:createHash('sha256').update(fs.readFileSync(path.join(reference,'actual/ui36/trace.json'))).digest('hex')},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output,semantic_checks:sourceResults.length,semantic_pass:sourceResults.filter(x=>x.pass).length,scenarios:scenarioResults.length,scenarios_pass:scenarioResults.filter(x=>x.pass).length,calculation:rows.calculation,proof_paths_complete:rows.proof_paths_complete}));
if(!rows.semantic_pass||!rows.observation_pass||!rows.proof_paths_complete||base.unsupported.length)process.exitCode=1;
