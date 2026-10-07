import test from 'node:test';
import assert from 'node:assert/strict';
import {contractVersion} from '../contracts/schema.mjs';
import {prepareSource} from '../source.mjs';
import {technicalValidate,graphItems} from '../validate.mjs';
import {compileBoundary} from '../compile.mjs';
test('Supported identity properties do not require supported metadata; genuine identity doubt blocks',()=>{
 const source=prepareSource(Buffer.from('负责人核对材料')),sources=[{quote:source.text,occurrence:1}];
 const g={contract_version:contractVersion,entities:[{id:'actor',label:'负责人',type:'OTHER',mentions:sources,alternatives:[]}],events:[{id:'check',predicate:'核对',kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',modality:'REQUIRED',polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:[],requires:[],sources}],claims:[{id:'performer',kind:'ROLE',event_id:'check',entity_id:'actor',role:'PERFORMER',expression_id:null,direction:null,temporal:null,quantity:null,scope_id:'check',requires:[],sources,note:''}],expressions:[],issues:[],coverage:[]};
 const review=(subject_id,field_path,verdict)=>({subject_id,field_path,verdict,context_refs:[],sources,reason:'Property-level unit evidence, not model output'});
 const a={contract_version:contractVersion,reviews:[...graphItems(g).filter(x=>x.id!=='actor').map(x=>review(x.id,'','SUPPORT')),review('actor','label','SUPPORT'),review('actor','mentions','SUPPORT'),review('actor','type','UNCERTAIN')],issues:[{id:'type-question',issue_kind:'IDENTITY',subject_ids:['actor'],field_path:'type',context_refs:[],sources,reason:'Only classification',suggested_json:null}],omissions:[]};
 const run=()=>{const checks=technicalValidate(source,g,a);return {checks,...compileBoundary(source,g,a,checks)};};
 let r=run();assert.equal(r.checks.rows.find(x=>x.id==='actor').status,'UNRESOLVED');assert.ok(r.canonical.slots.A.entries.every(x=>x.status==='ACCEPTED'));assert.ok(r.canonical.slots.P.entries.every(x=>x.status==='ACCEPTED'));
 a.reviews=a.reviews.filter(x=>x.field_path!=='mentions');assert.equal(run().canonical.slots.P.status,'RESOLVED');a.reviews.push(review('actor','mentions','SUPPORT'));
 const savedIssues=a.issues;a.issues=[];assert.equal(run().canonical.slots.P.status,'RESOLVED');a.issues=savedIssues;
 a.reviews.find(x=>x.field_path==='mentions').verdict='UNCERTAIN';r=run();assert.equal(r.canonical.slots.P.status,'UNRESOLVED');
 a.reviews.find(x=>x.field_path==='mentions').verdict='SUPPORT';g.claims[0].requires=['actor'];assert.equal(run().canonical.slots.P.status,'UNRESOLVED');g.claims[0].requires=[];
 a.issues[0].field_path='label';assert.equal(run().canonical.slots.P.status,'UNRESOLVED');
});
