// Same independent standard assertions as ui76, applied to AFTER-TRACE from the current consumer.
// Original checker and evidence are immutable. No source or expected assertion is changed.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {solveJointBoundary,verifyJointWitness} from '../../../../src/bxp/joint-boundary-solver.mjs';
import {evaluateDirectEventPolicies} from '../../../../research/7plus1-parser/llm-first-028/direct-ir-event-policy.mjs';
import {evaluateDirectInputPolicies} from '../../../../research/7plus1-parser/llm-first-028/direct-ir-input-policy.mjs';
const evidence=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(evidence,'../../../..'),id='7671553d-7b8d-4a82-906a-2db224be43ab';
const folder=path.resolve(process.argv[2]??path.join(root,'.boundx/cloud-comparison',new Date().toISOString().replaceAll(':','-')));
if(fs.existsSync(folder))throw Error('COMPARISON_OUTPUT_ALREADY_EXISTS');
fs.mkdirSync(folder,{recursive:true});
const trace=JSON.parse(fs.readFileSync(path.join(evidence,'DELIVERY-TRACE.json'),'utf8'));
const md=fs.readFileSync(path.join(root,'docs/testing/7plus1/MANUAL-TEST-001.md'),'utf8');
const txt=fs.readFileSync(path.join(root,'docs/testing/7plus1/MANUAL-TEST-001.txt'),'utf8');
const hash=x=>createHash('sha256').update(x).digest('hex');
const {ir,technical,canonical}=trace,c=trace.boundary_calculations,p=c.problem,m=c.mathematical_summary;
const nodes=new Map(['entities','events','states','expressions','requirements'].flatMap(k=>ir[k].map(x=>[x.id,x])));
const rows=[],queries=[];
function check(name,fn){try{const evidence=fn();rows.push({name,result:'MATCH',evidence:evidence??null});}catch(e){rows.push({name,result:e.unresolved?'UNRESOLVED':'MISMATCH',error:e.message});}}
const labels=refs=>refs.map(x=>nodes.get(typeof x==='string'?x:x.id)?.label).sort();
const roles=e=>Object.fromEntries(e.roles.map(r=>[r.role,nodes.get(r.value.id)?.label]));
const varFor=(kind,id)=>Object.entries(p.variable_meanings).find(([,m])=>m.kind===kind&&(m.state_id===id||m.event_id===id))?.[0];
const boolConstraint=(variable,value)=>value?{var:variable}:{not:{var:variable}};
function query(name,assumptions,expected,extraOrders=[]){
 const added=assumptions.map(([kind,id,value],i)=>{const v=varFor(kind,id);assert.ok(v,'Variable missing: '+kind+':'+id);return {id:'comparison:'+name+':'+i,formula:boolConstraint(v,value),rule:'POST_RUN_QUERY_ASSUMPTION_NOT_SOURCE_REQUIREMENT'};});
 const out=solveJointBoundary({...p,constraints:[...p.constraints,...added],orders:[...p.orders,...extraOrders]});
 const evidence={name,assumptions,expected,actual:out.result,verified:out.verification?.valid??null,reason:out.reason??null};queries.push(evidence);if(out.result==='unknown'&&expected!=='unknown'){const error=new Error(out.reason||'UNKNOWN_QUERY');error.unresolved=true;throw error;}assert.equal(out.result,expected);return evidence;
}
check('Source matches MD and TXT',()=>{assert.equal(trace.source.sha256,hash(txt));assert.equal(trace.source.text,txt);assert.equal(md.match(/```text\r?\n([\s\S]*?)\r?\n```/)[1],txt.trimEnd());return trace.source.sha256;});
check('Sets and cardinality',()=>{assert.deepEqual(m.input_files.map(x=>x.label).sort(),['app.yaml','env.json']);assert.deepEqual(m.output_artifacts.map(x=>x.label).sort(),['dev.md','ops.md','summary.md']);assert.equal(m.intersection.length,0);assert.equal(m.union_count,5);return {inputs:2,outputs:3,intersection:[],union:5};});
check('External input subset operand and internal origin',()=>{assert.equal(nodes.get('external_inputs').operator,'TASK_EXTERNAL_INPUTS');assert.equal(nodes.get('input_limit').operator,'SUBSET');assert.equal(nodes.get('external_inputs').arguments[0].id,'ROOT');assert.deepEqual(labels(nodes.get('allowed_inputs').arguments),['app.yaml','env.json']);for(const r of ir.requirements.filter(r=>r.kind==='DATA_USE')){const label=nodes.get(r.data_use.object.id).label;if(['dev.md','ops.md','summary.md'].includes(label))assert.equal(r.data_use.origin,'INTERNAL');}return c.joint.base.input_boundary_verification;});
check('12 event identity and role bindings',()=>{
 const expected=[['organize','ORGANIZE','ORGANIZER','PM','OBJECT','本次核查与汇总任务'],['check_app','REVIEW','PERFORMER','DEV','OBJECT','app.yaml'],['make_dev','CREATE','PERFORMER','DEV','RESULT','dev.md'],['submit_dev','DELIVER','PERFORMER','DEV','OBJECT','dev.md','QA'],['check_env','REVIEW','PERFORMER','OPS','OBJECT','env.json'],['make_ops','CREATE','PERFORMER','OPS','RESULT','ops.md'],['submit_ops','DELIVER','PERFORMER','OPS','OBJECT','ops.md','QA'],['review','REVIEW','REVIEWER','QA','OBJECT','两份报告'],['make_summary','CREATE','PERFORMER','PM','RESULT','summary.md'],['deliver_summary','DELIVER','PERFORMER','PM','OBJECT','summary.md','ADMIN'],['stop','STOP','PERFORMER','PM','OBJECT','本次核查与汇总任务'],['report_risk','REPORT','PERFORMER','PM','CONTENT','高危问题','ADMIN']];
 for(const [id,op,actorRole,actor,objectRole,object,recipient]of expected){const e=nodes.get(id),r=roles(e);assert.equal(e.operation,op);assert.equal(r[actorRole],actor);assert.equal(r[objectRole],object);if(recipient)assert.equal(r.RECIPIENT,recipient);assert.equal(e.owner_id,'ROOT');}
 assert.deepEqual(labels(nodes.get('reports').members),['dev.md','ops.md']);return expected.map(x=>x[0]);
});
check('Basis version and same two-report identity',()=>{assert.equal(roles(nodes.get('organize')).BASIS,'《配置核查规程》v1.2');assert.equal(roles(nodes.get('make_summary')).BASIS,'两份报告');const uses=ir.requirements.filter(r=>r.kind==='DATA_USE'&&r.data_use.consumer.id==='make_summary');assert.deepEqual(labels(uses.map(r=>r.data_use.object)),['dev.md','ops.md']);return uses.map(r=>r.id);});
check('Nine input/report use dependencies',()=>{const pairs=[['app','check_app'],['envfile','check_env'],['devreport','submit_dev'],['opsreport','submit_ops'],['devreport','review'],['opsreport','review'],['devreport','make_summary'],['opsreport','make_summary'],['summary','deliver_summary']];for(const [object,consumer]of pairs){const r=ir.requirements.find(r=>r.kind==='DATA_USE'&&r.data_use.object.id===object&&r.data_use.consumer.id===consumer);assert.ok(r);assert.equal(r.data_use.availability,'AT_USE');if(['devreport','opsreport','summary'].includes(object))assert.ok(r.data_use.producer);}return pairs;});
check('Global test environment stays quantified',()=>{const e=nodes.get('all_in_test');assert.equal(e.operator,'FORALL');assert.equal(nodes.get(e.arguments[0].id).operator,'TASK_EVENTS');assert.equal(nodes.get('in_test').operator,'EQ');assert.equal(nodes.get('in_test').arguments[1].id,'testenv');assert.ok(c.joint.base.quantified_verification.checks.every(x=>x.check.results.every(r=>r.result==='SATISFIED')));return {actualWitnessEvents:c.joint.base.quantified_verification.checks.length,futureUniversalExecutionProof:false};});
check('Closed duration interval [0,30] minutes',()=>{const a=c.intervals.find(i=>i.subject==='duration');assert.deepEqual(a.lower,{value:'0',inclusive:true});assert.deepEqual(a.upper,{value:'30',inclusive:true});assert.equal(a.unit,'分钟');assert.equal(a.scope_id,'ROOT');return a;});
check('Two explicit submission-before-review edges',()=>{const e=ir.expressions.filter(e=>e.operator==='BEFORE');assert.equal(e.length,2);for(const id of ['dev_before_review','ops_before_review']){const x=nodes.get(id);assert.equal(x.operator,'BEFORE');assert.equal(nodes.get(x.arguments[0].id).operator,'STATE_ESTABLISHED');assert.equal(nodes.get(x.arguments[1].id).operator,'EVENT_START');}return e.map(x=>({id:x.id,arguments:x.arguments}));});
check('QA passed required at each summary action start',()=>{for(const id of ['passed_at_generation','passed_at_delivery']){const e=nodes.get(id);assert.equal(e.operator,'TRUE_AT_START');assert.equal(e.arguments[0].id,'review_passed');}assert.equal(nodes.get('review_passed').kind,'SUCCESS');assert.ok(p.state_checks.filter(x=>x.state_point==='state:review_passed@review').length===2);return p.state_checks.filter(x=>x.state_point==='state:review_passed@review');});
check('Completion IFF truth table: 1/15 and 16/16',()=>{const a=m.completions[0];for(const r of a.table){const v=r.assignment,k=v.dev_submitted&&v.ops_submitted&&v.review_passed&&v.summary_delivered;assert.equal(r.satisfied,v.task_completed===k);}assert.deepEqual([a.premise_true_count,a.premise_false_count,a.satisfied_count,a.violation_count],[1,15,16,16]);return {premise:[1,15],iff:[16,16]};});
check('Three static forbidden patterns',()=>{const rs=ir.requirements.filter(r=>r.modality==='FORBIDDEN'&&!r.applicability);assert.equal(rs.length,3);const actual=rs.map(r=>{const e=nodes.get(r.subject.id);return e.operation+':'+roles(e).OBJECT;}).sort();assert.deepEqual(actual,['ACCESS:生产环境','WRITE:app.yaml','WRITE:env.json']);return actual;});
check('Risk obligations, immediate stop only, stopped continuation ban',()=>{for(const id of ['r_stop','r_report_risk']){const r=nodes.get(id);assert.equal(r.modality,'REQUIRED');assert.equal(r.applicability.id,'risk_value');}assert.equal(nodes.get('immediate_stop').operator,'IMMEDIATE_AFTER');assert.equal(ir.expressions.filter(x=>x.operator==='IMMEDIATE_AFTER').length,1);assert.equal(nodes.get('r_no_continue').modality,'FORBIDDEN');assert.equal(nodes.get('r_no_continue').applicability.id,'stopped_value');return {immediateResponse:'stop',reportIsAlsoImmediate:false};});
check('Program joint and completion witnesses',()=>{assert.equal(c.joint.base.result,'satisfiable');assert.equal(c.joint.base.verification.valid,true);assert.ok(c.completion_queries.some(q=>q.result==='satisfiable'&&q.verification.valid));return {checks:c.joint.base.verification.checks.length,duration:c.joint.base.witness.metric_schedule,manualIllustrativeDuration:16};});
for(const [environment,expected]of [['testenv','SATISFIED'],['prodenv','VIOLATED'],[null,'UNKNOWN']])check('Environment query '+environment,()=>{const r=evaluateDirectEventPolicies(ir,technical,{owner_id:'ROOT',roles:environment?{ENVIRONMENT:{kind:'ENTITY',id:environment}}:{}}).results[0];assert.equal(r.result,expected);return r;});
for(const [inputs,expected]of [[['app','envfile'],'SATISFIED'],[['app','envfile','third_confirmed_input'],'VIOLATED'],[null,'UNKNOWN']])check('External input query '+expected,()=>{const r=evaluateDirectInputPolicies(ir,technical,[{owner_id:'ROOT',...(inputs?{external_inputs:inputs.map(id=>({kind:'ENTITY',id}))}:{})}]).results[0];assert.equal(r.result,expected);return r;});
check('High risk triggers stop and report',()=>{const e=query('risk',[['STATE','risk_found',true]],'satisfiable');return e;});
check('High risk without stop is impossible',()=>query('risk-no-stop',[['STATE','risk_found',true],['EVENT_OCCURRED','stop',false]],'unsatisfiable'));
check('High risk without report is impossible',()=>query('risk-no-report',[['STATE','risk_found',true],['EVENT_OCCURRED','report_risk',false]],'unsatisfiable'));
check('Stopped plus continuation is impossible',()=>query('stopped-continue',[['STATE','stopped',true],['PATTERN_OCCURRED','continue',true]],'unsatisfiable'));
check('QA absent pass but summary generated is impossible',()=>query('summary-no-pass',[['STATE','review_passed',false],['EVENT_OCCURRED','make_summary',true]],'unsatisfiable'));
check('Local necessary-condition formula preserves action activation',()=>{
 const gate=p.constraints.find(x=>x.id==='r_summary_generation_gate');
 const local=p.state_checks.find(x=>x.id==='passed_at_generation:make_summary');
 const link=p.constraints.find(x=>x.id==='local-state:passed_at_generation:make_summary');
 const variables=[local.global_variable,local.local_variable,varFor('EVENT_OCCURRED','make_summary')];
 const q={variables,constraints:[gate,link,{id:'local-query-no-pass',formula:{not:{var:local.global_variable}}},{id:'local-query-no-action',formula:{not:{var:variables[2]}}}],intervals:[],orders:[],domains:[],state_checks:[]};
 const actual=solveJointBoundary(q);
 queries.push({name:'ISOLATED_NECESSARY_GATE_NOT_FULL_TASK',assumptions:'G=false,Q=false; only gate and state linkage, other source obligations deliberately excluded',expected:'satisfiable under G implies Q',actual:actual.result,gate,link});
 assert.equal(actual.result,'satisfiable');return actual.result;
});
check('QA pass later cannot authorize earlier summary generation',()=>query('late-pass',[['STATE','review_passed',true],['EVENT_OCCURRED','make_summary',true]],'unsatisfiable',[{id:'comparison-late-pass',from:'make_summary:start',to:'state:review_passed@review',relation:'LT'}]));
check('Summary before submitted report is impossible',()=>query('early-review',[['EVENT_OCCURRED','review',true]],'unsatisfiable',[{id:'comparison-early-review',from:'review:start',to:'submit_dev:end',relation:'LT'}]));
check('Constructed elapsed time equals task endpoint difference',()=>{const w=c.joint.base.witness,h=p.temporal_horizons[0],s=w.metric_schedule[h.interval_id],point=id=>{const v=s.points[id];return Number(v.numerator)/Number(v.denominator);};const elapsed=point(h.end_point)-point(h.start_point);assert.equal(elapsed,Number(s.duration));assert.equal(elapsed,30);return {manualWitness:16,programWitness:elapsed,bothWithinAllowedInterval:true};});
// These probes detect an overclaim of complete execution semantics; they do not alter IR.
const limitations=[];
const stopContinuation=query('risk-with-continuation-probe',[['STATE','risk_found',true],['EVENT_OCCURRED','stop',true],['PATTERN_OCCURRED','continue',true]],'satisfiable');
limitations.push({name:'This non-temporal query cannot prove continuation occurred during stop',result:stopContinuation.actual,detail:'CONTROL_EFFECT currently only implies its source event. The query can leave stopped=false; event occurrence is not stop completion. Therefore this probe is not evidence that a timed stop-phase violation was wrongly accepted.',standard_scope:'Requires phase/time observations to distinguish events before stop from continuation during stop; no claim of all future execution safety.'});
const output={run_id:id,source_sha256:trace.source.sha256,standard_sha256:hash(md),version:trace.product_snapshot?.product_version,mode:'CURRENT_CONSUMER_OF_UNCHANGED_FROZEN_IR_NO_MODEL_CALLS',rows,queries,limitations,display_issues:[],unverified:['Frozen replay is not a new live model accuracy validation; human mechanism observations are recorded separately.','Finite quantifier, unbound event-instance and continuous local numerical observation combinations remain unsupported.','Current consumer does not prove compliance of every possible future execution.','Original frozen candidate conditions the summary EVENT_NORM on QA success; this replay cannot certify completeness of independent source obligations.'],business_decision:null,execution_authorization:null};
fs.writeFileSync(path.join(folder,'COMPARISON.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({run_id:id,matched:rows.filter(x=>x.result==='MATCH').length,mismatched:rows.filter(x=>x.result==='MISMATCH').length,unresolved:rows.filter(x=>x.result==='UNRESOLVED').length,nonmatching:rows.filter(x=>x.result!=='MATCH')}));
