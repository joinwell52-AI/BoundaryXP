import test from 'node:test';import assert from 'node:assert/strict';
import {contractVersion} from '../contracts/schema.mjs';import {prepareSource} from '../source.mjs';import {technicalValidate} from '../validate.mjs';
const source=prepareSource(Buffer.from('读取甲或乙，所指对象待确认。')),sources=[{quote:source.text,occurrence:1}];
function fixture(){return{contract_version:contractVersion,entities:[{id:'a',label:'甲',type:'FILE',mentions:sources,alternatives:[]},{id:'b',label:'乙',type:'FILE',mentions:sources,alternatives:[]},{id:'r',label:'所指对象',type:'REFERENT',mentions:sources,alternatives:['a','b']}],events:[],claims:[],expressions:[],issues:[{id:'ambiguity',kind:'AMBIGUITY',subject_ids:['r'],field_path:'alternatives',alternatives:['a','b'],affected_views:['I'],sources,note:'Synthetic identity competition'}],coverage:[]};}
function audit(g,context=['ambiguity']){return{contract_version:contractVersion,reviews:g.entities.map(x=>({subject_id:x.id,field_path:'',verdict:'SUPPORT',context_refs:context,sources,reason:'Source-preserved synthetic structure'})),issues:[],omissions:[]};}
test('Source-valid declared issue is legitimate audit background, never an accepted identity dependency',()=>{
 const g=fixture(),r=technicalValidate(source,g,audit(g));assert.ok(!r.diagnostics.some(d=>d.code==='AUDIT_DANGLING_REFERENCE'));assert.equal(r.rows.find(x=>x.id==='a').status,'ACCEPTED');assert.equal(r.rows.find(x=>x.id==='r').status,'UNRESOLVED');assert.deepEqual(r.rows.find(x=>x.id==='a').required_dependencies,[]);
});
test('Missing, duplicate and bad-source issue context remains invalid; issue IDs cannot be direct subjects',()=>{
 for(const change of [g=>g.issues[0].sources=[{quote:'not source',occurrence:1}],g=>g.issues.push(structuredClone(g.issues[0])),g=>g.issues[0].id='a']){const g=fixture();change(g);const r=technicalValidate(source,g,audit(g));assert.ok(r.diagnostics.some(d=>d.code==='AUDIT_DANGLING_REFERENCE'));}
 const g=fixture(),a=audit(g,['missing']);assert.ok(technicalValidate(source,g,a).diagnostics.some(d=>d.code==='AUDIT_DANGLING_REFERENCE'));
 a.reviews[0].subject_id='ambiguity';assert.ok(technicalValidate(source,g,a).diagnostics.some(d=>d.code==='AUDIT_DANGLING_REFERENCE'&&d.id==='ambiguity'));
});
