import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import Ajv from 'ajv';
import {boundaryFixture} from './boundary-rules-fixture.mjs';
import {rulesSchema,rulesAuditSchema,lowerBoundaryRules,rulesReviewInput,expandRulesAudit} from '../../research/7plus1-parser/llm-first-028/boundary-rules.mjs';
import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';import {evaluateCore} from '../../src/bxp/ir-kernel/evaluate.mjs';import {evaluateRequirements} from '../../src/bxp/ir-kernel/rules.mjs';import {stable} from '../../src/bxp/ir-kernel/values.mjs';
import {acceptCandidateIR} from '../../research/7plus1-parser/llm-first-028/direct-ir-accept.mjs';import {parseDirectIR} from '../../research/7plus1-parser/llm-first-028/direct-ir-engine.mjs';import {directIRKernelBundle} from '../../research/7plus1-parser/llm-first-028/direct-ir-kernel-resources.mjs';import {directIROutputSchema} from '../../research/7plus1-parser/llm-first-028/direct-ir-output-schema.mjs';
const review=w=>({format:'boundx-boundary-rules-audit/1',candidate_sha256:rulesReviewInput(w).audit_binding.candidate_sha256,examined_sources:w.sources.map(x=>x.id),verdicts:['tasks','objects','actions','states','rules'].flatMap(k=>w[k].map(x=>({id:x.id,verdict:'SUPPORT',reason:'Offline fixture review'}))),omissions:[]});
const setup=(w=boundaryFixture())=>{const {ir,groups}=lowerBoundaryRules(w);return {ir,groups,core:compileCore(ir).core};};
const requirements=(s,ids)=>ids.flatMap(id=>s.groups[id].filter(r=>r.kind==='REQUIREMENT').map(r=>r.id));
const exact=events=>({events,completeness:{kind:'EXACT_SNAPSHOT',task_id:'task',basis:'Offline explicit query'}});
const actual=(id,operation,roles,extra={})=>({id,task_id:'task',operation,roles:Object.entries(roles).flatMap(([role,ids])=>(Array.isArray(ids)?ids:[ids]).map(id=>({role,value:{kind:'ENTITY',id}}))),occurred:true,...extra});
test('wire removes expression/interface work; both strict schemas validate; deterministic lowering compiles',()=>{
 const w=boundaryFixture(),s=setup(w),check=new Ajv({strict:false}).compile(directIROutputSchema(rulesSchema).schema);assert.ok(check(w),JSON.stringify(check.errors));assert.ok(new Ajv({strict:false}).validate(directIROutputSchema(rulesAuditSchema).schema,review(w)));
 assert.equal(rulesSchema.properties.expressions,undefined);assert.equal(rulesSchema.properties.requirements,undefined);assert.deepEqual(lowerBoundaryRules(w),lowerBoundaryRules(w));
 const a=expandRulesAudit(review(w),rulesReviewInput(w));const t=acceptCandidateIR(s.ir,a,{text:w.sources[0].quote});assert.equal(t.technical_ok,true,JSON.stringify(t.errors));assert.equal(t.rows.filter(r=>r.status!=='ACCEPTED').length,0,JSON.stringify(t.diagnostics));
 assert.ok(JSON.stringify(w).length<JSON.stringify(s.ir).length*0.5);
});
test('all model declarations retained with sources; gaps and missing reviews never auto-pass',()=>{
 const w=boundaryFixture();w.gaps.push({id:'gap',source_refs:['s'],reason:'Explicit unsupported boundary'});const {ir}=setup(w);assert.equal(ir.coverage[0].status,'GAP');
 const a=review(w);a.verdicts=a.verdicts.filter(v=>v.id!=='choice');assert.ok(expandRulesAudit(a,rulesReviewInput(w)).omissions.some(o=>o.reason.includes('choice')));
 a.candidate_sha256='0'.repeat(64);assert.throws(()=>expandRulesAudit(a,rulesReviewInput(w)),/DIGEST/);
 const duplicate=boundaryFixture();duplicate.rules[0].id='a';assert.throws(()=>lowerBoundaryRules(duplicate),/ID/);
});
test('input subset, fixed choice and forbidden objects vary generically; no source or label inference',()=>{
 const s=setup(),q={requirements:requirements(s,['input']),plan:{external_inputs:{task:['a']}}};assert.equal(evaluateRequirements(s.core,q).result,'SATISFIED');q.plan.external_inputs.task=['unknown'];assert.equal(evaluateRequirements(s.core,q).result,'VIOLATED');
 const declared=s.ir.requirements.filter(r=>requirements(s,['choice']).includes(r.id)&&r.kind==='CONSTRAINT').map(r=>r.id);
 for(const object of ['a','b']){const result=evaluateRequirements(s.core,{requirements:declared,variables:{choice:{object:'a'}},plan:exact([actual('fresh','READ',{PERFORMER:'dev',OBJECT:object})])});assert.equal(result.result,object==='a'?'SATISFIED':'VIOLATED');}
 assert.equal(evaluateRequirements(s.core,{requirements:declared,variables:{choice:{object:'a'}},plan:exact([actual('other','READ',{PERFORMER:'pm',OBJECT:'b'})])}).result,'SATISFIED');
 const w=boundaryFixture();w.sources[0].quote='Completely different source text';w.objects.forEach(o=>o.label='Renamed');const changed=setup(w);assert.equal(evaluateRequirements(changed.core,q).result,'VIOLATED');
});
test('any actor prohibition catches new actors and multiple recipients; unknown remains unknown',()=>{
 const s=setup(),requirements_=requirements(s,['forbid_extra']);
 const event=actual('new_delivery','DELIVER',{PERFORMER:'someone_else',DELIVERABLE:'extra',RECIPIENT:['qa','admin']});assert.equal(evaluateRequirements(s.core,{requirements:requirements_,plan:exact([event])}).result,'VIOLATED');
 event.roles=event.roles.filter(r=>r.role!=='RECIPIENT');assert.equal(evaluateRequirements(s.core,{requirements:requirements_,plan:exact([event])}).result,'UNKNOWN');
 assert.equal(evaluateRequirements(s.core,{requirements:requirements_,plan:exact([actual('different','DELIVER',{DELIVERABLE:'report',RECIPIENT:'admin'})])}).result,'SATISFIED');
});
test('delivery gate applies to new matching actions and uses time at start, independently of obligation',()=>{
 const s=setup(),state=evaluateCore(s.core,{kind:'STATE',id:'passed'}).state,requirements_=requirements(s,['delivery_gate']);
 for(const at of ['4','8']){const r=evaluateRequirements(s.core,{requirements:requirements_,plan:exact([actual('new_delivery','DELIVER',{PERFORMER:'pm',DELIVERABLE:'report',RECIPIENT:'admin'},{start:'5',end:'6'})]),states:{[state]:{value:true,established_at:at}}});assert.equal(r.result,at==='4'?'SATISFIED':'VIOLATED');}
 assert.ok(s.ir.requirements.some(r=>r.subject.id==='deliver'&&r.kind==='EVENT_NORM'&&r.modality==='REQUIRED'));
});
test('data at use is not silently strengthened; explicit COMPLETE_RESULT changes the result',()=>{
 for(const mode of ['AT_USE','COMPLETE_RESULT']){const w=boundaryFixture();w.rules.find(r=>r.id==='use_submit').availability=mode;const s=setup(w);const key=stable({object:{object:'report'},producer:{event:'generate'}});
 const q={requirements:requirements(s,['use_submit']),plan:{events:[{id:'generate',task_id:'task',occurred:true,completed:true,start:'0',end:'10'},{id:'submit',task_id:'task',occurred:true,completed:true,start:'6',end:'7'}]},availability:{[key]:{at:'5',unit:'second'}}};assert.equal(evaluateRequirements(s.core,q).result,mode==='AT_USE'?'SATISFIED':'VIOLATED');}
});
test('strict duration endpoints and completion direction preserved without execution witness',()=>{
 const s=setup(),v=s.ir.variables.find(v=>v.id.startsWith('duration~')).id;
 for(const [minutes,expected]of [[0,'VIOLATED'],[1,'SATISFIED'],[20,'SATISFIED'],[21,'VIOLATED']])assert.equal(evaluateRequirements(s.core,{requirements:requirements(s,['duration']),variables:{[v]:{number:String(minutes*60)}},plan:{events:[{id:'task',task_id:'task',start:'0',end:String(minutes*60),occurred:true}]}}).result,expected);
 const c=s.ir.requirements.find(r=>r.kind==='COMPLETION');assert.equal(s.ir.expressions.find(e=>e.id===c.body.id).operator,'IFF');
 const w=boundaryFixture();w.rules.find(r=>r.id==='duration').upper='7';w.rules.find(r=>r.id==='retry').max_extra=4;const s2=setup(w);assert.equal(s2.ir.sequences[0].max_instances,5);
});
test('new runtime uses two compact calls, keeps original wire and does not invoke old IR repair',async()=>{
 for(const rejected of [false,true]){const w=boundaryFixture(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'boundary-rules-'));let calls=0;
 const result=await parseDirectIR(Buffer.from(w.sources[0].quote),{output:dir,probe:{},productSnapshot:{contract:'candidate-ir/2.0'},maxModelRequests:6,call:async args=>{calls++;assert.equal(args.bundle.boundary_rules,true);assert.equal(args.bundle.resources.length,2);if(calls===2){assert.equal(args.candidate.format,w.format);assert.equal(args.candidate.expressions,undefined);}const a=review(w);if(rejected)a.verdicts.find(v=>v.id==='use_submit').verdict='CONTRADICT';return {value:calls===1?w:a,receipt:{thread_id:'mock-'+calls},attempts:[{thread_id:'mock-'+calls}]};}});
 assert.equal(calls,2);assert.deepEqual(result.boundary_declaration,w);assert.equal(result.ir_origin,'DETERMINISTIC_BOUNDARY_RULE_LOWERING');assert.equal(result.boundary_calculations.status,rejected?'PARTIAL':'BOUNDARY_READY');
 }
});
test('active phase resources include only phase Skill and boundary contract',()=>{for(const phase of ['parse','audit']){const b=directIRKernelBundle(phase);assert.equal(b.resources.length,2);assert.ok(!b.text.includes('operator-registry'));assert.ok(b.resources[0].path.includes('semantic-'+phase));assert.ok(!b.text.includes('INSTANCE_LOCAL'));}});

test('unbound choice in event roles remains unknown instead of escaping a forbidden object selector',()=>{
 const s=setup();const event={id:'read',task_id:'task',occurred:true};
 assert.equal(evaluateRequirements(s.core,{requirements:requirements(s,['forbid_c']),plan:exact([event])}).result,'UNKNOWN');
});

test('retry total spans child tasks, missing failure stays unknown and later failure cannot authorize an earlier retry',()=>{
 const w=boundaryFixture();w.tasks.push({id:'child',source_refs:['s'],label:'Child',parent:'task',roles:[]});const s=setup(w);
 const counts=s.ir.requirements.filter(r=>requirements(s,['retry']).includes(r.id)&&r.views.length===1&&r.views[0]==='R').map(r=>r.id);
 const events=Array.from({length:4},(_,n)=>({...actual('new_'+n,'READ',{PERFORMER:'dev',OBJECT:'a'}),task_id:n%2?'child':'task'}));
 assert.equal(evaluateRequirements(s.core,{requirements:counts,plan:exact(events)}).result,'VIOLATED');
 events.pop();assert.equal(evaluateRequirements(s.core,{requirements:counts,plan:exact(events)}).result,'SATISFIED');
 const gate=s.ir.expressions.find(e=>e.id.startsWith('retry~')&&e.operator==='TRUE_AT_START');
 const previous=s.ir.states.find(n=>n.id===gate.arguments[0].id),instance=s.ir.expressions.find(e=>e.id===gate.arguments[1].id),index=instance.arguments[1].id;
 const bindings={[index]:{number:'2'}},key=evaluateCore(s.core,{kind:'STATE',id:previous.id},{},bindings).state,eventId=evaluateCore(s.core,gate.arguments[1],{},bindings).event;
 for(const [entry,expected]of [[undefined,'unknown'],[{value:true,established_at:'4'},true],[{value:true,established_at:'6'},false],[{value:false},false]]){
  const result=evaluateCore(s.core,{kind:'EXPRESSION',id:gate.id},{plan:{events:[{id:eventId,task_id:'task',start:'5',occurred:true}]},states:entry?{[key]:entry}:{}},bindings);
  assert.equal(expected==='unknown'?result.unknown:result,expected==='unknown'?true:expected);
 }
 const free=boundaryFixture();free.rules.find(r=>r.id==='retry').previous_failure_required=false;const sf=setup(free);assert.ok(sf.ir.requirements.some(r=>r.id.startsWith('retry~')&&r.modality==='PERMITTED'));assert.ok(!sf.ir.expressions.some(e=>e.id.startsWith('retry~')&&e.operator==='TRUE_AT_START'));
});

test('compact boundary rows render rules, scope and permission without showing generated expressions as model output',async()=>{
 const {boundaryRuleRows}=await import('../../research/7plus1-parser/v0.3-p2.1-generalization/web/direct-ir-process.js');
 const w=boundaryFixture(),rows=boundaryRuleRows(w);assert.equal(rows.length,w.rules.length);const text=JSON.stringify(rows);assert.ok(text.includes('2'));assert.ok(text.includes('Inspection'));assert.ok(!text.includes('INSTANCE_LOCAL'));
});
