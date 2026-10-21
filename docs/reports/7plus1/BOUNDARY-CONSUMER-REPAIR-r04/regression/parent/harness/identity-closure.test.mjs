import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
import os from 'node:os';
const root=path.resolve(process.env.BOUNDARYXP_COMPACT_TEST_ROOT??'.boundx/identity-repair-ui21-work');
const load=p=>import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028',p)).href);
const {normalizeIdentity,identityInventory}=await load('identity.mjs');
const {decodeProposal,encodeProposal}=await load('compact-wire.mjs');
const {applyRevisionPatch,revisionBaseDigest}=await load('revision-wire.mjs');
const {technicalRevisionFeedback}=await load('revision.mjs');
const {technicalValidate}=await load('validate.mjs');
const {prepareSource}=await load('source.mjs');
const {publicError,createServer}=await load('service.mjs');
const {buildPrompt}=await load('provider.mjs');
const {partialArtifacts,publicProgress}=await load('observability.mjs');
const src=[{quote:'Operator must inspect item. Do not change item.',occurrence:1}];
function graph(id='shared'){
 return {contract_version:'031-r1.1',entities:[{id:'actor',label:'Operator',type:'PERSON',mentions:src,alternatives:[]},{id,label:'item',type:'FILE',mentions:src,alternatives:[]}],events:[{id:'act',predicate:'inspect',kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',modality:'REQUIRED',polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:[],requires:[],sources:src}],claims:[{id:'performer',kind:'ROLE',event_id:'act',entity_id:'actor',role:'PERFORMER',expression_id:null,direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:'act',requires:[],sources:src,note:''},{id,kind:'ROLE',event_id:'act',entity_id:id,role:'OBJECT',expression_id:null,direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:'act',requires:[],sources:src,note:''}],expressions:[{id:'state',op:'STATE',operands:[],state:{predicate:'ready',event_id:null,args:[id],polarity:'POSITIVE'},sources:src}],issues:[],coverage:[{sources:src,claim_ids:[id],status:'EXPRESSED',affected_views:['I','A']}]};
}
function patch(g){return {transport_version:'COMPACT_SEMANTIC_PATCH_R01',base_candidate_sha256:revisionBaseDigest(g),disposition:'PATCH',source_additions:[],upserts:{entities:[],events:[],claims:[],expressions:[],issues:[]},coverage_updates:[],retirements:[],reason:'Test only'};}
test('Typed collision normalization preserves both meanings, counts, sources and raw input',()=>{
 const g=graph(),before=JSON.stringify(g),r=normalizeIdentity(g);
 assert.equal(JSON.stringify(g),before);assert.equal(r.evidence.renames.length,2);
 assert.notEqual(r.value.entities[1].id,r.value.claims[1].id);assert.equal(r.value.claims[1].entity_id,r.value.entities[1].id);
 for(const k of ['entities','events','claims','expressions','issues','coverage'])assert.equal(r.value[k].length,g[k].length);
 assert.equal(r.value.claims[1].role,'OBJECT');assert.deepEqual(r.value.claims[1].sources,src);assert.equal(r.evidence.semantic_choices_inferred,0);
});
test('Untyped state and coverage references stay ambiguous, never choose by name or closeness',()=>{
 const r=normalizeIdentity(graph());assert.equal(r.value.expressions[0].state.args[0],'shared');assert.equal(r.value.coverage[0].claim_ids[0],'shared');
 assert.deepEqual(r.evidence.unresolved.map(x=>x.path),['/expressions/0/state/args/0','/coverage/0/claim_ids/0']);assert.equal(r.evidence.unresolved[0].candidates.length,2);
});
test('Unicode and arbitrary IDs work without entity names, offsets or benchmark IDs',()=>{
 for(const id of ['任意编号','x[42]/name','nothing-special']){const r=normalizeIdentity(graph(id));assert.equal(r.value.claims[1].entity_id,r.value.entities[1].id);assert.equal(r.evidence.unresolved[0].original_id,id);}
});
test('Same-collection duplicates do not get an arbitrary typed binding',()=>{
 const g=graph();g.entities.push(structuredClone(g.entities[1]));const r=normalizeIdentity(g);
 assert.equal(r.value.claims[1].entity_id,'shared');assert.ok(r.evidence.unresolved.some(x=>x.path==='/claims/1/entity_id'&&x.candidates.length===2));
 assert.ok([...identityInventory(r.value).values()].every(x=>x.length===1));
});
test('Normalization is deterministic and idempotent with no collisions',()=>{
 const a=normalizeIdentity(graph()),b=normalizeIdentity(graph());assert.deepEqual(a,b);
 const c=normalizeIdentity(a.value);assert.deepEqual(c.value,a.value);assert.equal(c.evidence.renames.length,0);
});
test('No-collision graphs are byte-equivalent; inverse indices and restrictions retained',()=>{
 const g=graph();g.claims[1].id='object';g.events[0].modality='FORBIDDEN';
 assert.equal(JSON.stringify(normalizeIdentity(g).value),JSON.stringify(g));
});
test('Program-generated names cannot collide with existing user IDs',()=>{
 const g=graph();g.entities.push({...g.entities[0],id:'bx:entities:shared:1'});
 const r=normalizeIdentity(g);assert.notEqual(r.value.entities[1].id,'bx:entities:shared:1');assert.equal(r.value.entities[2].id,'bx:entities:shared:1');
});
test('Reserved ROOT identity cannot be smuggled in as a graph node',()=>{
 const g=graph();g.entities[0].id='ROOT';assert.throws(()=>normalizeIdentity(g),/IDENTITY_RESERVED_ID/);
});
test('Artifact-use, ITEM and role references use their explicit endpoint collections',()=>{
 const g=graph();g.expressions[0]={id:'state',op:'ITEM',operands:['shared'],state:null,sources:src};
 g.claims.push({...g.claims[1],id:'use',kind:'ARTIFACT_USE',role:null,artifact_use:{producer_result_id:'shared',consumer_role_id:'shared',availability:'COMPLETE_RESULT'}});
 const r=normalizeIdentity(g);assert.equal(r.value.expressions[0].operands[0],r.value.entities[1].id);assert.equal(r.value.claims[2].artifact_use.producer_result_id,r.value.claims[1].id);
});
test('Every explicitly typed event/expression/constraint/quantity reference follows its own collection',()=>{
 const g=graph();g.events[0].id='shared';g.events[0].owner_id='shared';g.events[0].constraint_ids=['shared'];
 g.claims[0].event_id='shared';g.claims[1].event_id='shared';g.claims[0].expression_id='shared';
 g.claims[0].quantity={use:'EXECUTION_LIMIT',target_id:'shared',count_scope:'shared'};
 g.claims[1].quantity={use:'OUTPUT_CONTENT',target_id:'shared',count_scope:'ROOT'};
 g.expressions[0].id='shared';g.expressions[0].state.event_id='shared';
 const r=normalizeIdentity(g),event=r.value.events[0],entity=r.value.entities[1],claim=r.value.claims[1],expression=r.value.expressions[0];
 assert.equal(event.owner_id,event.id);assert.equal(event.constraint_ids[0],claim.id);assert.equal(r.value.claims[0].event_id,event.id);assert.equal(r.value.claims[0].expression_id,expression.id);
 assert.equal(r.value.claims[0].quantity.target_id,event.id);assert.equal(claim.quantity.target_id,entity.id);assert.equal(expression.state.event_id,event.id);
 assert.equal(r.value.claims[0].quantity.count_scope,'shared');assert.ok(r.evidence.unresolved.some(x=>x.path==='/claims/0/quantity/count_scope'));
});
test('Ambiguous references cannot pass the unchanged technical gate as RESOLVED',()=>{
 const r=normalizeIdentity(graph()),source=prepareSource(Buffer.from(src[0].quote));
 const audit={contract_version:'031-r1.1',reviews:[...r.value.entities,...r.value.events,...r.value.claims,...r.value.expressions].map(x=>({subject_id:x.id,field_path:'',verdict:'SUPPORT',context_refs:[],sources:src,reason:'Unit-test review'})),issues:[],omissions:[]};
 const check=technicalValidate(source,r.value,audit);
 assert.ok(check.rows.find(x=>x.id==='state').errors.some(e=>e.code==='STATE_ARGUMENT_REFERENCE'));assert.notEqual(check.rows.find(x=>x.id==='state').status,'ACCEPTED');
 assert.ok(check.diagnostics.some(e=>e.code==='COVERAGE_INVALID'));
 const feedback=technicalRevisionFeedback(check,r.value,r.evidence);assert.ok(feedback.some(x=>x.code==='AMBIGUOUS_ID_REFERENCE'&&x.candidates.length===2&&x.selects_replacement===false));
});
test('Decode records mechanical lineage and exposes unique IDs before independent audit',()=>{
 const original=graph(),decoded=decodeProposal(encodeProposal(original));assert.equal(decoded.evidence.identity.renames.length,2);assert.equal(decoded.value.claims[1].entity_id,decoded.value.entities[1].id);
 assert.ok(buildPrompt({bundle:{phase:'audit',transport_version:'COMPACT_SEMANTIC_WIRE_R01',text:'TEST'},source:{text:src[0].quote,lines:[],literals:[]},candidate:decoded.value,candidateIdentity:decoded.evidence.identity}).includes('<MECHANICAL_IDENTITY>'));
});
test('New patch collisions are rejected; no source/source-catalog ID relaxation',()=>{
 const g=normalizeIdentity(graph()).value,p=patch(g);const event=encodeProposal(g).events[0];p.upserts.events=[{...event,id:g.entities[0].id}];
 assert.throws(()=>applyRevisionPatch(g,p,{reviews:[]}),/PATCH_GLOBAL_ID_COLLISION/);
});
test('Historical malformed base can accept a local field repair without deleting duplicate nodes',()=>{
 const g=graph(),p=patch(g);p.upserts.events=[{...encodeProposal(g).events[0],predicate:'check'}];
 const r=applyRevisionPatch(g,p,{reviews:[]});assert.equal(r.value.events[0].predicate,'check');assert.equal(r.evidence.identity.renames.length,2);
 assert.equal(r.value.entities.length,g.entities.length);assert.equal(r.value.claims.length,g.claims.length);
});
test('Ambiguous review ID cannot authorize retirement of a prohibition or duplicate node',()=>{
 const g=graph(),p=patch(g);p.retirements=[{collection:'entities',id:'shared',source_refs:encodeProposal(g).entities[1].source_refs,reason:'Ambiguous old review'}];
 assert.throws(()=>applyRevisionPatch(g,p,{reviews:[{subject_id:'shared',verdict:'CONTRADICT'}]}),/RETIRE_NOT_SUPPORTED/);
});
test('Actual failed response replay gets beyond the ID crash with all local changes retained',()=>{
 const dir='.boundx/short-compiler-031-r1/data/runs/624754ba-c693-4307-a55c-c2646fe1cb72';
 const read=p=>JSON.parse(fs.readFileSync(dir+'/'+p,'utf8'));
 const g=read('revision-0/proposal.json'),p=read('revision-1/parse-call/response-0.txt'),f=read('revision-0/revision-request.json');
 const before=JSON.stringify(g),r=applyRevisionPatch(g,p,f);assert.equal(JSON.stringify(g),before);
 assert.equal(r.evidence.identity.renames.length,8);assert.equal(r.value.claims.length,g.claims.length+7);assert.equal(r.value.entities.length,g.entities.length+4);
 assert.ok([...identityInventory(r.value).values()].every(x=>x.length===1));assert.equal(r.value.events.filter(x=>x.modality==='FORBIDDEN').length,g.events.filter(x=>x.modality==='FORBIDDEN').length);
 assert.ok(r.evidence.identity.unresolved.length>0); // Not a claim of semantic repair.
});
test('Public errors explain the failure category without leaking raw messages or credentials',()=>{
 const e=publicError(Object.assign(Error('private error / token=secret'),{code:'COMPACT_WIRE_CONTRACT_FAILURE',detail:'PATCH_GLOBAL_ID_COLLISION'}));
 assert.equal(e.code,'COMPACT_WIRE_CONTRACT_FAILURE');assert.equal(e.detail_code,'PATCH_GLOBAL_ID_COLLISION');assert.ok(!JSON.stringify(e).includes('secret'));
 assert.equal(publicError(Object.assign(Error('limit'),{code:'MODEL_REQUEST_BUDGET_EXHAUSTED'})).code,'MODEL_REQUEST_BUDGET_EXHAUSTED');
});
test('Failed later revision exposes prior evidence explicitly, never promotes it to a final result',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-failed-evidence-'));fs.mkdirSync(path.join(dir,'revision-0'));fs.mkdirSync(path.join(dir,'revision-1'));
 fs.writeFileSync(path.join(dir,'revision-0/proposal.json'),JSON.stringify(graph()));
 const failed=partialArtifacts(dir,{revision:1,status:'FAILED'});assert.ok(failed.proposal);assert.equal(failed.artifact_revision,0);assert.equal(failed.provisional,true);assert.equal(failed.canonical,undefined);
 const running=partialArtifacts(dir,{revision:1,status:'RUNNING'});assert.equal(running.proposal,null);assert.equal(running.artifact_revision,1);
});
test('Public normalization event exposes counts only, without source text or private errors',()=>{
 const event=publicProgress({stage:'PARSING',kind:'IDENTITY_NORMALIZED',renamed_nodes:8,ambiguous_references:3,private_text:'secret'});
 assert.equal(event.signal,'IDENTITY_NORMALIZED');assert.equal(event.renamed_nodes,8);assert.ok(!JSON.stringify(event).includes('secret'));
});
test('Actual local HTTP consumer preserves a typed contract error and has no fabricated final result',async()=>{
 const dataRoot=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-identity-http-'));
 const server=createServer({dataRoot,legacyRoot:path.join(dataRoot,'absent'),parse:async()=>{throw Object.assign(Error('private detail'),{code:'COMPACT_WIRE_CONTRACT_FAILURE',detail:'PATCH_GLOBAL_ID_COLLISION'});}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 try{
  const session=await fetch(base+'/api/session'),s=await session.json(),cookie=session.headers.get('set-cookie').split(';')[0];
  const created=await fetch(base+'/api/parse',{method:'POST',headers:{'content-type':'application/json',cookie,'x-boundx-session':s.token},body:JSON.stringify({text:src[0].quote,request_id:randomUUID()})});assert.equal(created.status,202);
  const run=await created.json();await new Promise(resolve=>setTimeout(resolve,30));const result=await (await fetch(base+'/api/runs/'+run.run_id)).json();
  assert.equal(result.status,'FAILED');assert.equal(result.error.code,'COMPACT_WIRE_CONTRACT_FAILURE');assert.equal(result.error.detail_code,'PATCH_GLOBAL_ID_COLLISION');assert.equal(result.result,null);
  assert.equal((await fetch(base+'/api/runs/'+run.run_id+'/json')).status,409);assert.ok(fs.existsSync(path.join(dataRoot,'runs',run.run_id,'run.json')));
 }finally{await new Promise(resolve=>server.close(resolve));}
});
