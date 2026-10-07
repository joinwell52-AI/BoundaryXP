import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {contractVersion} from '../contracts/schema.mjs';
import {technicalValidate,graphItems} from '../validate.mjs';
import {compileBoundary,renderChinese} from '../compile.mjs';
import {prepareSource} from '../source.mjs';
import {technicalRevisionFeedback} from '../revision.mjs';
import {parse7Plus1} from '../engine.mjs';
const source=prepareSource(Buffer.from('负责人交付材料；允许产生附录；无需复核附录；复核与更新完成后才能发送。'));
const sources=[{quote:source.text,occurrence:1}];
const entity=(id,label)=>({id,label,type:'OTHER',alternatives:[],mentions:sources});
const event=(id,predicate,modality)=>({id,predicate,kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',modality,polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:[],requires:[],sources});
const claim=(id,event_id,entity_id,role)=>({id,kind:'ROLE',event_id,entity_id,role,expression_id:null,direction:null,temporal:null,quantity:null,scope_id:event_id,requires:[],sources,note:''});
const fixture=()=>({contract_version:contractVersion,entities:[entity('actor','负责人'),entity('artifact','材料'),entity('appendix','附录'),entity('items','风险项')],events:[event('deliver','交付','REQUIRED'),event('produce','产生','PERMITTED'),event('review','复核','NOT_REQUIRED'),event('update','更新','NOT_REQUIRED')],claims:[claim('d','deliver','artifact','DELIVERABLE'),claim('p','produce','appendix','RESULT'),claim('actor-review','review','actor','REVIEWER'),claim('review-object','review','appendix','OBJECT')],expressions:[],issues:[],coverage:[]});
const audit=g=>({contract_version:contractVersion,reviews:graphItems(g).map(x=>({subject_id:x.id,field_path:'',verdict:'SUPPORT',context_refs:[],sources,reason:'Synthetic unit evidence only'})),issues:[],omissions:[]});
const run=g=>{const a=audit(g),t=technicalValidate(source,g,a);return {technical:t,...compileBoundary(source,g,a,t)};};
test('Typed delivery projects O independently of creation, predicate spelling, I and existence',()=>{
 const g=fixture(),r=run(g);assert.ok(r.canonical.slots.O.entries.some(f=>f.claim.role==='DELIVERABLE'&&f.entity.id==='artifact'));assert.equal(r.canonical.slots.I.entries.length,0);assert.equal(g.events.some(e=>e.predicate==='生成'),false);
 g.events[0].predicate='任意语义谓词';assert.equal(run(g).canonical.slots.O.entries.find(f=>f.claim.id==='d').status,'ACCEPTED');
 for(const modality of ['NOT_REQUIRED','FORBIDDEN','UNSTATED']){g.events[0].modality=modality;assert.ok(!run(g).canonical.slots.O.entries.some(f=>f.claim.id==='d'));}
 g.events[0].modality='REQUIRED';g.events[0].use='MENTION_ONLY';g.events[0].layer='QUOTED';assert.ok(!run(g).canonical.slots.O.entries.some(f=>f.claim.id==='d'));
});
test('Optional result and no delivery obligation stay distinct; no inferred creation or input',()=>{
 const g=fixture();g.events.push(event('exempt','交付','NOT_REQUIRED'));g.claims.push(claim('exemption','exempt','appendix','DELIVERABLE'));const r=run(g);
 assert.equal(r.canonical.slots.O.entries.find(f=>f.entity.id==='appendix').event.modality,'PERMITTED');assert.ok(r.canonical.retained_nonprojected.some(f=>f.claim?.id==='exemption'));assert.equal(r.canonical.slots.I.entries.length,0);
});
test('NOT_REQUIRED Chinese retains exact actor/object and state event identity',()=>{
 const g=fixture();for(const id of ['review','update'])g.expressions.push({id:id+'-done',op:'STATE',operands:[],state:{predicate:'已完成',event_id:id,args:['actor','appendix'],polarity:'POSITIVE'},sources});
 g.expressions.push({id:'both',op:'AND',operands:['review-done','update-done'],state:null,sources});g.claims.push({...claim('condition','deliver',null,null),kind:'CONDITION',expression_id:'both',direction:'NECESSARY'});g.events[0].constraint_ids=['condition'];
 const r=run(g);assert.match(r.chinese,/无需 复核 \[review\]；复核者=负责人；对象=附录/);assert.match(r.chinese,/所指事件=复核 \[review\]/);assert.match(r.chinese,/所指事件=更新 \[update\]/);assert.equal(renderChinese(r.canonical),r.chinese);
});
test('030 captured responses: rendering repaired without altering semantic graph or calling model',()=>{
 const root=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-ACCURACY-030/runs/first');
 for(const [id,words] of [['Q08',['QA','access.md']],['Q09',['QA']],['Q17',['optional.md']]]){
  const t=JSON.parse(fs.readFileSync(path.join(root,id,'run/trace.json'))),before=JSON.stringify(t.canonical),text=renderChinese(t.canonical);const lines=text.split('\n').filter(l=>/无需/.test(l));for(const w of words)assert.ok(lines.some(l=>l.includes(w)),id+':'+w);assert.equal(JSON.stringify(t.canonical),before);
 }
 const t=JSON.parse(fs.readFileSync(path.join(root,'Q10/run/trace.json')));const zh=renderChinese(t.canonical);assert.match(zh,/所指事件=复核/);assert.match(zh,/所指事件=更新/);
});
function badQuantity(){const g=fixture();g.events[1].constraint_ids=['q'];g.claims.push({...claim('q','produce',null,null),kind:'QUANTITY',quantity:{metric:'风险项',target_id:'items',comparator:'EQ',value:2,unit:'项',use:'OUTPUT_CONTENT',count_scope:'appendix'}});return g;}
test('Technical quantity error is fed back, not silently rebound from count_scope',()=>{
 const g=badQuantity(),r=run(g),feedback=technicalRevisionFeedback(r.technical,g);assert.ok(feedback.some(x=>x.code==='CONTENT_QUANTITY_RESULT_TARGET'&&x.actual.quantity.target_id==='items'));assert.equal(g.claims.at(-1).quantity.target_id,'items');assert.equal(r.canonical.slots.O.entries.find(f=>f.entity.id==='appendix').status,'REJECTED');
 assert.deepEqual(technicalRevisionFeedback(run(fixture()).technical,fixture()),[]);
});
test('Audit and technical errors share one revision; second failure is saved, never looped to success',async()=>{
 const g=badQuantity(),a=audit(g),calls=[],output=fs.mkdtempSync(path.join(os.tmpdir(),'boundx031-budget-'));let n=0;
 const call=async o=>{calls.push(o);return {value:structuredClone(o.bundle.phase==='parse'?g:a),receipt:{thread_id:'unit-'+(++n)},attempts:[{thread_id:'unit-'+n,execution_mode:'UNIT_STUB_NOT_MODEL_EVIDENCE'}]};};
 const result=await parse7Plus1(Buffer.from(source.text),{output,probe:{unit:true},call});assert.equal(calls.length,4);assert.equal(result.revision,1);assert.ok(calls[2].revisionIssues.technical_errors.some(x=>x.code==='CONTENT_QUANTITY_RESULT_TARGET'));assert.equal(result.canonical.slots.O.entries.find(f=>f.entity.id==='appendix').status,'REJECTED');
 assert.ok(fs.existsSync(path.join(output,'revision-0/trace.json'))&&fs.existsSync(path.join(output,'revision-1/trace.json')));
});
test('Quantity ownership supports explicit delivery result but rejects sibling target and absent result',()=>{
 const g=badQuantity();g.claims.at(-1).quantity.target_id='appendix';g.claims.find(c=>c.id==='p').role='DELIVERABLE';assert.equal(run(g).technical.rows.find(x=>x.id==='q').status,'ACCEPTED');g.claims.at(-1).quantity.target_id='artifact';assert.ok(run(g).technical.rows.find(x=>x.id==='q').errors.some(e=>e.code==='CONTENT_QUANTITY_RESULT_TARGET'));
});
