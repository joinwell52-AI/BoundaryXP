import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {contractVersion} from '../contracts/schema.mjs';
import {prepareSource} from '../source.mjs';
import {graphItems,technicalValidate} from '../validate.mjs';
import {auditBindingRevisionFeedback} from '../revision.mjs';
import {parse7Plus1} from '../engine.mjs';
const bytes=Buffer.from('负责人可发送资料；批准后才能发送。');
const source=prepareSource(bytes),sources=[{quote:source.text,occurrence:1}];
function fixture(){
 const g={contract_version:contractVersion,entities:[{id:'actor',label:'负责人',type:'PERSON',mentions:sources,alternatives:[]},{id:'item',label:'资料',type:'DOCUMENT',mentions:sources,alternatives:[]}],events:[{id:'send',predicate:'发送',kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',modality:'PERMITTED',polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:[],requires:[],sources}],claims:[{id:'object',kind:'ROLE',event_id:'send',entity_id:'item',role:'OBJECT',expression_id:null,direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:'send',requires:[],sources,note:''}],expressions:[],issues:[],coverage:[]};
 const a={contract_version:contractVersion,reviews:graphItems(g).map(x=>({subject_id:x.id,field_path:'',verdict:x.id==='object'?'UNCERTAIN':'SUPPORT',context_refs:[],sources,reason:'Synthetic audit signal, not model evidence'})),issues:[{id:'binding',issue_kind:'BINDING',subject_ids:['object'],field_path:'entity_id',context_refs:['item','send'],sources,reason:'The asserted binding lacks sufficient evidence.',suggested_json:null}],omissions:[]};
 return {g,a};
}
const feedback=({g,a})=>auditBindingRevisionFeedback(technicalValidate(source,g,a),g,a);
test('Typed uncertain binding gets bounded feedback without selecting replacement or parsing reason',()=>{
 const f=fixture(),before=JSON.stringify(f);const r=feedback(f);assert.equal(r.length,1);assert.equal(r[0].selects_replacement,false);assert.equal(JSON.stringify(f),before);
 f.a.issues[0].reason='任意文字';assert.equal(feedback(f).length,1);
 f.a.issues[0].issue_kind='IDENTITY';assert.equal(feedback(f).length,0);
});
test('Declared source ambiguity and competing referents stay unresolved without a forced repair',()=>{
 const f=fixture();f.g.issues=[{id:'amb',kind:'AMBIGUITY',subject_ids:['item'],field_path:'',alternatives:[],affected_views:['A'],sources,note:'Unresolved source identity'}];assert.equal(feedback(f).length,0);
 const p=fixture();p.g.entities.push(...['a','b'].map(id=>({id,label:id,type:'DOCUMENT',alternatives:[],mentions:sources})));p.g.entities[1].alternatives=['a','b'];p.a.reviews.push(...['a','b'].map(subject_id=>({subject_id,field_path:'',verdict:'SUPPORT',context_refs:[],sources,reason:'unit'})));assert.equal(feedback(p).length,0);
});
test('Unrelated ambiguity does not suppress local binding review; metadata-only uncertainty is not semantic repair',()=>{
 const f=fixture();f.g.entities.push({id:'other',label:'other',type:'OTHER',alternatives:[],mentions:sources});f.g.issues.push({id:'amb',kind:'AMBIGUITY',subject_ids:['other'],field_path:'',alternatives:[],affected_views:['I'],sources,note:'unrelated'});f.a.reviews.push({subject_id:'other',field_path:'',verdict:'UNCERTAIN',context_refs:[],sources,reason:'unit'});assert.equal(feedback(f).length,1);
 f.a.issues[0].issue_kind='CONTRACT';f.a.issues[0].field_path='type';assert.equal(feedback(f).length,0);
});
test('Invalid audit source or dangling targets cannot trigger semantic replacement',()=>{
 const f=fixture();f.a.issues[0].sources=[{quote:'not in source',occurrence:1}];assert.equal(feedback(f).length,0);
 const p=fixture();p.a.issues[0].subject_ids=['missing'];assert.equal(feedback(p).length,0);
});
test('Binding uncertainty and other repair classes share one revision and save both passes',async()=>{
 const {g,a}=fixture(),calls=[],output=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-binding-budget-'));let n=0;
 const call=async o=>{calls.push(o);return {value:structuredClone(o.bundle.phase==='parse'?g:a),receipt:{thread_id:'synthetic-'+(++n)},attempts:[{execution_mode:'UNIT_STUB_NOT_MODEL_EVIDENCE'}]};};
 const result=await parse7Plus1(bytes,{output,probe:{unit:true},call});assert.equal(calls.length,4);assert.equal(result.revision,1);assert.equal(calls[2].revisionIssues.binding_errors.length,1);assert.equal(calls[2].revisionIssues.budget.semantic_revisions_remaining,1);
 assert.ok(fs.existsSync(path.join(output,'revision-0/trace.json')));assert.ok(fs.existsSync(path.join(output,'revision-1/trace.json')));
 assert.equal(result.technical.rows.find(x=>x.id==='object').status,'UNRESOLVED');
});
