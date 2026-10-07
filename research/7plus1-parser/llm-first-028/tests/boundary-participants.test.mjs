import test from 'node:test';
import assert from 'node:assert/strict';
import {contractVersion} from '../contracts/schema.mjs';
import {prepareSource} from '../source.mjs';
import {technicalValidate,graphItems} from '../validate.mjs';
import {compileBoundary} from '../compile.mjs';
const source=prepareSource(Buffer.from('执行者交付材料；确认者确认后完成，异常则停止。'));
const sources=[{quote:source.text,occurrence:1}];
function fixture(kind,root){
 const event=(id,layer,use)=>({id,predicate:id,kind:'ACTION',layer,use,modality:use==='CURRENT_TASK'?'REQUIRED':'UNSTATED',polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:[],requires:[],sources});
 const role={id:'participant',kind:'ROLE',event_id:'confirm',entity_id:'actor',role:'PERFORMER',expression_id:null,direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:'confirm',requires:[],sources,note:''};
 const boundary={id:'boundary',kind,event_id:root?null:'deliver',entity_id:null,role:null,expression_id:'state',direction:kind==='TEMPORAL'?'ORDER':'SUFFICIENT',temporal:kind==='TEMPORAL'?'AFTER':null,quantity:null,artifact_use:null,scope_id:root?'ROOT':'deliver',requires:[],sources,note:''};
 const g={contract_version:contractVersion,entities:[{id:'actor',label:'确认者',type:'PERSON',alternatives:[],mentions:sources}],events:[event('deliver','MAIN','CURRENT_TASK'),event('confirm','CONDITION','MENTION_ONLY')],claims:[role,boundary],expressions:[{id:'state',op:'STATE',operands:[],state:{predicate:'已完成',event_id:'confirm',args:[],polarity:'POSITIVE'},sources}],issues:[],coverage:[]};
 if(!root)g.events[0].constraint_ids=['boundary'];return g;
}
function run(g,reject=false){const audit={contract_version:contractVersion,reviews:graphItems(g).map(x=>({subject_id:x.id,field_path:'',verdict:reject&&x.id==='boundary'?'CONTRADICT':'SUPPORT',context_refs:[],sources,reason:'Synthetic consumer contract fixture, not semantic model evidence'})),issues:[],omissions:[]};const checks=technicalValidate(source,g,audit);return compileBoundary(source,g,audit,checks);}
test('Explicit condition participants survive root completion/stop and temporal projection with governing proof',()=>{
 for(const [kind,root] of [['COMPLETION',true],['STOP',true],['TEMPORAL',false],['CONDITION',false]]){
  const r=run(fixture(kind,root)),p=r.canonical.slots.P.entries.find(f=>f.claim.id==='participant');assert.ok(p,kind);assert.equal(p.status,'ACCEPTED');assert.ok(p.claim_ids.includes('boundary'));assert.ok(p.proof.provenance_refs.includes('boundary'));assert.ok(p.proof.provenance_refs.includes('state'));assert.ok(p.sources.length);
  assert.ok(!r.canonical.slots.A.entries.some(f=>f.event.id==='confirm'));assert.equal(r.canonical.slots.I.entries.length,0);assert.match(r.chinese,/条件引用，不新增执行义务/);
 }
});
test('Unreachable/quoted/background roles and non-boundary expressions do not create P',()=>{
 for(const mutation of [g=>g.claims.pop(),g=>g.events[1].layer='QUOTED',g=>g.events[1].layer='BACKGROUND',g=>g.expressions[0].state.event_id='deliver',g=>g.claims[0].role='OBJECT',g=>g.events[0].use='MENTION_ONLY']){
  const g=fixture('TEMPORAL',false);mutation(g);assert.equal(run(g).canonical.slots.P.entries.length,0);
 }
});
test('A contradicted governing boundary cannot certify its explicit participant',()=>{const r=run(fixture('COMPLETION',true),true);assert.notEqual(r.canonical.slots.P.entries[0].status,'ACCEPTED');assert.equal(r.canonical.slots.P.status,'UNRESOLVED');});
