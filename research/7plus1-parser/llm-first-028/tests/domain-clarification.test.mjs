import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {randomUUID} from 'node:crypto';
import {contractVersion} from '../contracts/schema.mjs';import {prepareSource} from '../source.mjs';
import {technicalValidate,graphItems} from '../validate.mjs';import {compileBoundary,evaluateScope} from '../compile.mjs';import {scopeDomainState} from '../scopes.mjs';import {createServer} from '../service.mjs';
// Synthetic contract/consumer fixtures. Not source interpretation or model accuracy scores.
const text='负责人核对目录内记录并生成清单；不得更改记录。',source=prepareSource(Buffer.from(text));
const sources=[{quote:text,occurrence:1}],entity=(id,type='OTHER')=>({id,label:id,type,mentions:sources,alternatives:[]});
const expr=(id,op,operands)=>({id,op,operands,state:null,sources});
const event=(id,modality)=>({id,predicate:id,kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',modality,polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:[],requires:[],sources});
const claim=(id,event_id,entity_id,role)=>({id,kind:'ROLE',event_id,entity_id,role,expression_id:null,direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:event_id,requires:[],sources,note:''});
function fixture(){return{contract_version:contractVersion,entities:[entity('records','CLASS'),entity('directory','FILE'),entity('other-directory','FILE'),entity('list','FILE'),entity('member'),entity('except')],events:[event('edit','FORBIDDEN'),event('produce','REQUIRED')],claims:[claim('object','edit','records','OBJECT'),claim('result','produce','list','RESULT'),{...claim('scope','edit',null,null),kind:'SCOPE',expression_id:'forall',scope_id:'records'}],expressions:[expr('local','CATEGORY',['records','directory']),expr('wide','CATEGORY',['records']),expr('choice','DOMAIN_CHOICE',['local','wide']),expr('forall','FORALL',['choice'])],issues:[{id:'ambiguity',kind:'AMBIGUITY',subject_ids:['choice','scope'],field_path:'expression_id',alternatives:['local','wide'],affected_views:['B'],sources,note:'Test interpretations; not an ADMIN decision'}],coverage:[{sources,claim_ids:['edit','object','scope'],status:'EXPRESSED',affected_views:['B'],range_requirement:{kind:'UNIVERSAL',scope_claim_ids:['scope']}},{sources,claim_ids:['produce','result'],status:'EXPRESSED',affected_views:['O','A'],range_requirement:{kind:'NONE',scope_claim_ids:[]}}]};}
const audit=g=>({contract_version:contractVersion,reviews:graphItems(g).map(x=>({subject_id:x.id,field_path:'',verdict:'SUPPORT',context_refs:[],sources,reason:'Synthetic structural preservation only'})),issues:[],omissions:[]});
const run=(g,a=audit(g))=>{const checks=technicalValidate(source,g,a);return{checks,...compileBoundary(source,g,a,checks)};};
const query=(g,obs)=>evaluateScope(g.expressions,'forall','member',{entities:g.entities,memberships:obs});
test('Source-faithful competing domain preserves full ban and separate A/O, never certifies a winner',()=>{
 const g=fixture(),r=run(g);assert.equal(r.checks.schemas.proposal.ok,true);assert.deepEqual(r.ir.gaps,[]);assert.equal(r.canonical.slots.B.status,'UNRESOLVED');
 assert.equal(r.canonical.slots.A.status,'RESOLVED');assert.equal(r.canonical.slots.O.status,'RESOLVED');assert.equal(r.canonical.slots.I.status,'ABSENT');
 assert.equal(r.canonical.slots.B.entries.filter(f=>f.kind==='SCOPE').length,1);assert.equal(r.canonical.clarifications.length,1);
 assert.equal(r.canonical.clarifications[0].choices[0].alternatives.length,2);assert.ok(r.chinese.includes('待确认域'));assert.ok(r.chinese.includes('全称适用'));assert.ok(r.chinese.includes('在该解释下'));
 const f=r.canonical.slots.B.entries.find(f=>f.kind==='EVENT');assert.ok(f.proof.provenance_refs.includes('directory'));assert.ok(f.proof.provenance_refs.includes('wide'));assert.ok(f.sources.every(s=>[...text].slice(...s.span).join('')===s.quote));
});
test('Different member answers remain alternative-only UNKNOWN; exceptions are retained for each interpretation',()=>{
 const g=fixture(),obs=[{member_id:'member',category_id:'records',within_id:'directory',value:'FALSE'},{member_id:'member',category_id:'records',value:'TRUE'}];
 const r=query(g,obs);assert.equal(r.scope_value,'UNKNOWN');assert.deepEqual(r.alternative_results.map(x=>x.scope_value),['FALSE','TRUE']);assert.ok(r.alternative_results.every(x=>x.interpretation_only&&!x.is_final_boundary));
 g.expressions.push(expr('exceptions','ENUM',['member']),expr('minus','EXCEPT',['choice','exceptions']));g.expressions.find(x=>x.id==='forall').operands=['minus'];
 assert.deepEqual(query(g,obs).alternative_results.map(x=>x.scope_value),['FALSE','FALSE']);assert.equal(query(g,obs).scope_value,'UNKNOWN');assert.equal(query(g,obs).execution_authorization,null);
});
test('Clear unbounded, explicit domain, unresolved parsing and competition are distinct, not one null',()=>{
 const g=fixture();assert.equal(scopeDomainState(g.expressions,'wide'),'TASK_CATEGORY_UNRESTRICTED');assert.equal(scopeDomainState(g.expressions,'local'),'DETERMINED');assert.equal(scopeDomainState(g.expressions,'forall'),'COMPETING');
 g.expressions.push(expr('missing','UNRESOLVED_DOMAIN',['records']));g.expressions.find(x=>x.id==='forall').operands=['missing'];g.issues=[];
 assert.equal(query(g,[]).domain_state,'UNPARSED');assert.equal(query(g,[]).scope_value,'UNKNOWN');assert.equal(run(g).canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');
});
test('Dropping choice evidence, corrupting ownership or installing both interpretations cannot pass coverage',()=>{
 for(const change of [g=>g.issues=[],g=>g.issues[0].alternatives=['local'],g=>g.claims.find(c=>c.id==='scope').scope_id='list',g=>g.expressions.find(e=>e.id==='choice').operands=['local','local']]){const g=fixture();change(g);assert.equal(run(g).canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');}
 const g=fixture();g.expressions.push(expr('local-all','FORALL',['local']));g.claims.push({...g.claims.find(c=>c.id==='scope'),id:'duplicate-scope',expression_id:'local-all'});const r=run(g);assert.ok(r.checks.rows.find(x=>x.id==='scope').errors.some(e=>e.code==='COMPETING_DOMAINS_SIMULTANEOUSLY_APPLIED'));assert.equal(r.canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');
});
test('Audit contradiction cannot be disguised as correctly preserved competition',()=>{
 const g=fixture(),a=audit(g);a.reviews.find(x=>x.subject_id==='local').verdict='CONTRADICT';assert.equal(run(g,a).canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');assert.equal(run(g,a).canonical.slots.O.status,'RESOLVED');
});
test('Explicit two-container union is simultaneous, never a source-domain choice; no member-name inference',()=>{
 const g=fixture();g.issues=[];g.expressions.find(x=>x.id==='wide').operands=['records','other-directory'];g.expressions.find(x=>x.id==='choice').op='UNION';
 assert.equal(run(g).canonical.slots.B.status,'RESOLVED');assert.deepEqual(run(g).canonical.clarifications,[]);
 const obs=[{member_id:'member',category_id:'records',within_id:'directory',value:'FALSE'},{member_id:'member',category_id:'records',within_id:'other-directory',value:'TRUE'}];assert.equal(query(g,obs).scope_value,'TRUE');assert.deepEqual(query(g,obs).alternative_results,[]);
 g.entities.forEach(x=>x.label='any');assert.equal(query(g,obs).scope_value,'TRUE');assert.equal(query(g,[]).scope_value,'UNKNOWN');
});
test('Explicit clarification makes new source/run lineage; original byte snapshots, history, exports remain untouched',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-032-lineage-'));let calls=0;
 const parse=async(bytes,o)=>{calls++;const s=prepareSource(bytes),g=fixture(),a=audit(g),checks=technicalValidate(s,g,a),compiled=compileBoundary(s,g,a,checks),t={source:s,source_lineage:o.sourceLineage,proposal:g,audit:a,technical:checks,...compiled};fs.writeFileSync(path.join(o.output,'trace.json'),JSON.stringify(t));fs.writeFileSync(path.join(o.output,'run-summary.json'),JSON.stringify({real_calls:0}));return t;};
 const server=createServer({dataRoot:root,legacyRoot:path.join(root,'legacy'),parse});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port,sr=await fetch(url+'/api/session'),session=await sr.json(),headers={'content-type':'application/json','x-boundx-session':session.token,cookie:sr.headers.get('set-cookie').split(';')[0],origin:url};
 const post=body=>fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify(body)});
 const completed=async id=>{for(let i=0;i<100;i++){const r=await(await fetch(url+'/api/runs/'+id)).json();if(r.status.startsWith('COMPLETED'))return r;if(r.status==='FAILED')throw Error(JSON.stringify(r.error));await new Promise(r=>setTimeout(r,5));}throw Error('TIMEOUT');};
 try{
  const first=await(await post({text,request_id:randomUUID()})).json();await completed(first.run_id);const file=path.join(root,'runs',first.run_id,'trace.json'),before=fs.readFileSync(file);
  const changed=text+'补充：仅限指定目录。',body={text:changed,request_id:randomUUID(),parent_run_id:first.run_id};
  const response=await post(body);assert.equal(response.status,202);const next=await response.json(),done=await completed(next.run_id);assert.notEqual(next.run_id,first.run_id);assert.notEqual(done.source_sha256,first.source_sha256);assert.equal(done.source_lineage.parent_source_sha256,first.source_sha256);assert.equal(done.result.source_lineage.parent_run_id,first.run_id);assert.deepEqual(fs.readFileSync(file),before);
  assert.equal((await post(body)).status,200);assert.equal(calls,2);assert.equal((await post({text,request_id:randomUUID(),parent_run_id:first.run_id})).status,400);assert.equal((await post({text:changed,request_id:randomUUID(),parent_run_id:randomUUID()})).status,400);
  assert.equal((await post({text:'x'.repeat(301),request_id:randomUUID(),parent_run_id:first.run_id})).status,400);assert.equal(calls,2);
  const exported=await(await fetch(url+'/api/runs/'+next.run_id+'/trace.json')).json();assert.equal(exported.run.source_lineage.parent_run_id,first.run_id);assert.equal(exported.source_lineage.source_sha256,done.source_sha256);
 }finally{await new Promise(r=>server.close(r));}
});
