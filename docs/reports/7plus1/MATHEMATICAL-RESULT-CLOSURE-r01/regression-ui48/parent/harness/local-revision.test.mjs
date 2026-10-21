import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDX_COMPACT_TEST_ROOT??'.boundx/local-revision-ui18-work'),core='research/7plus1-parser/llm-first-028/';
const load=p=>import(pathToFileURL(path.join(root,core+p)).href),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const {revisionBaseDigest,applyRevisionPatch,validateRevisionWire}=await load('revision-wire.mjs'),{encodeProposal}=await load('compact-wire.mjs');
const {technicalValidate}=await load('validate.mjs'),{compileBoundary}=await load('compile.mjs'),{parse7Plus1}=await load('engine.mjs'),{buildBundle}=await load('bundle.mjs'),{buildPrompt}=await load('provider.mjs');
const prior=read('.boundx/exports/COMPACT-SEMANTIC-INTERFACE-r03/SKILL/revision-0/trace.json'),feedback=read('.boundx/exports/COMPACT-SEMANTIC-INTERFACE-r03/SKILL/revision-0/revision-request.json');
function patch(g=prior.proposal){return {transport_version:'COMPACT_SEMANTIC_PATCH_R01',base_candidate_sha256:revisionBaseDigest(g),disposition:'NO_SAFE_CHANGE',source_additions:[],upserts:{entities:[],events:[],claims:[],expressions:[],issues:[]},coverage_updates:[],retirements:[],reason:'Unit test: no safe contract-supported semantic change; keep the gap'};}
test('Strict no-change preserves candidate, all limitations, actual audit, IR and Chinese',()=>{
 const p=patch(),r=applyRevisionPatch(prior.proposal,p,feedback);assert.equal(r.no_change,true);assert.deepEqual(r.value,prior.proposal);
 const technical=technicalValidate(prior.source,r.value,prior.audit),out=compileBoundary(prior.source,r.value,prior.audit,technical);
 assert.deepEqual(technical,prior.technical);assert.deepEqual(out.ir,prior.ir);assert.deepEqual(out.canonical,prior.canonical);assert.equal(out.chinese,prior.chinese);
 assert.equal(r.evidence.gaps_preserved,true);assert.equal(r.evidence.semantic_choices_inferred,0);
});
test('Local replacement changes only the chosen node and records untouched-node digests',()=>{
 const w=encodeProposal(prior.proposal),p=patch();p.disposition='PATCH';const e=structuredClone(w.events[0]);e.modality='PERMITTED';p.upserts.events=[e];
 const r=applyRevisionPatch(prior.proposal,p,feedback);assert.equal(r.value.events[0].modality,'PERMITTED');assert.deepEqual(r.value.events.slice(1),prior.proposal.events.slice(1));
 for(const k of ['entities','claims','expressions','issues','coverage'])assert.deepEqual(r.value[k],prior.proposal[k]);
 assert.equal(r.evidence.operations.length,1);assert.ok(r.evidence.preserved_nodes.length>50);assert.equal(r.evidence.semantic_choices_inferred,0);
});
test('Wrong base digest, mixed no-change mutation and duplicate operations fail',()=>{
 let p=patch();p.base_candidate_sha256='wrong';assert.throws(()=>applyRevisionPatch(prior.proposal,p,feedback),/BASE_DIGEST_MISMATCH/);
 p=patch();p.upserts.events=[encodeProposal(prior.proposal).events[0]];assert.throws(()=>applyRevisionPatch(prior.proposal,p,feedback),/NO_CHANGE_WITH_MUTATIONS/);
 p.disposition='PATCH';p.upserts.events.push(p.upserts.events[0]);assert.throws(()=>applyRevisionPatch(prior.proposal,p,feedback),/DUPLICATE_OPERATION/);
});
test('Removing a retained prohibition without real contradictory evidence is forbidden',()=>{
 const e=prior.proposal.events.find(e=>e.modality==='FORBIDDEN'),p=patch();p.disposition='PATCH';p.retirements=[{collection:'events',id:e.id,source_refs:encodeProposal(prior.proposal).events.find(n=>n.id===e.id).source_refs,reason:'Not supported by actual audit'}];
 assert.throws(()=>applyRevisionPatch(prior.proposal,p,feedback),/RETIRE_NOT_SUPPORTED/);
});
test('A technical error cannot authorize deleting a source-backed limitation',()=>{
 const e=prior.proposal.events.find(e=>e.modality==='FORBIDDEN'),p=patch();p.disposition='PATCH';p.retirements=[{collection:'events',id:e.id,source_refs:encodeProposal(prior.proposal).events.find(n=>n.id===e.id).source_refs,reason:'Technical field is invalid'}];
 assert.throws(()=>applyRevisionPatch(prior.proposal,p,{reviews:[],technical_errors:[{subject_id:e.id,code:'BAD_STRUCTURAL_OWNER'}]}),/RETIRE_NOT_SUPPORTED/);
});
test('Source and identity collisions are not silently repaired',()=>{
 let p=patch();p.disposition='PATCH';p.source_additions=[encodeProposal(prior.proposal).source_table[0]];assert.throws(()=>applyRevisionPatch(prior.proposal,p,feedback),/SOURCE_ID_COLLISION/);
 p=patch();p.disposition='PATCH';const e=structuredClone(encodeProposal(prior.proposal).events[0]);e.id=prior.proposal.entities[0].id;p.upserts.events=[e];assert.throws(()=>applyRevisionPatch(prior.proposal,p,feedback),/GLOBAL_ID_COLLISION/);
});
test('Bad scope/argument references are still rejected by unchanged technical checks',()=>{
 const p=patch();p.disposition='PATCH';const c=structuredClone(encodeProposal(prior.proposal).claims.find(c=>c.binding.kind==='ROLE'));c.binding.entity_id='missing';p.upserts.claims=[c];
 const r=applyRevisionPatch(prior.proposal,p,feedback),technical=technicalValidate(prior.source,r.value,prior.audit);
 assert.notEqual(technical.rows.find(n=>n.id===c.id).status,'ACCEPTED');assert.ok(technical.rows.find(n=>n.id===c.id).errors.length);
});
test('New omission structure appends explicit source evidence without guessing other roles',()=>{
 const p=patch();p.disposition='PATCH';p.source_additions=[{id:'new-source',quote:'DEV检查build.zip',occurrence:1}];
 const w=encodeProposal(prior.proposal),e=structuredClone(w.entities[0]);e.id='new-entity';e.label='明确新增测试实体';e.source_refs=['new-source'];p.upserts.entities=[e];
 const r=applyRevisionPatch(prior.proposal,p,feedback);assert.deepEqual(r.value.events,prior.proposal.events);assert.deepEqual(r.value.claims,prior.proposal.claims);assert.equal(r.value.entities.at(-1).mentions[0].quote,'DEV检查build.zip');
});
test('Coverage updates are index-bound and cannot overwrite another location by proximity',()=>{
 const p=patch();p.disposition='PATCH';p.coverage_updates=[{index:prior.proposal.coverage.length+1,value:encodeProposal(prior.proposal).coverage[0]}];assert.throws(()=>applyRevisionPatch(prior.proposal,p,feedback),/COVERAGE_INDEX_INVALID/);
});
test('Schema rejects incomplete patches; there is no full-graph fallback',()=>{
 const p=patch();delete p.upserts.claims;assert.equal(validateRevisionWire(p).ok,false);assert.throws(()=>applyRevisionPatch(prior.proposal,p,feedback),/SCHEMA_INVALID/);
});
test('Revision prompt requests only patch and exact base digest; original text remains intact',()=>{
 const prompt=buildPrompt({bundle:buildBundle('parse',{parseMethod:'SKILL'}),source:prior.source,candidate:prior.proposal,revisionIssues:feedback});
 assert.ok(prompt.includes('COMPACT_SEMANTIC_PATCH_R01'));assert.ok(prompt.includes(revisionBaseDigest(prior.proposal)));assert.ok(prompt.includes(JSON.stringify(prior.source.text)));
});
test('Engine skips repeat audit only for exact no-change, retaining old real audit and gaps',async()=>{
 const phases=[],output=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-local-patch-test-'));let n=0;
 const result=await parse7Plus1(Buffer.from(prior.source.text),{output,parseMethod:'SKILL',probe:{version:'NO_MODEL_UNIT_TEST'},call:async o=>{
  phases.push(o.bundle.phase);const receipt={thread_id:'unit-'+n++};
  if(n===1)return {value:prior.proposal,receipt,attempts:[receipt]};
  if(n===2)return {value:prior.audit,receipt,attempts:[receipt]};
  const p=patch(),r=applyRevisionPatch(o.candidate,p,o.revisionIssues);return {...r,wire_value:r.wire,patch_value:p,normalization:r.evidence,receipt,attempts:[receipt]};
 }});
 assert.deepEqual(phases,['parse','audit','parse']);assert.deepEqual(result.proposal,prior.proposal);assert.deepEqual(result.audit,prior.audit);assert.deepEqual(result.canonical,prior.canonical);
 const summary=read(path.join(output,'run-summary.json'));assert.equal(summary.real_calls,3);assert.equal(summary.no_change_revision_count,1);assert.equal(summary.revision_count,0);
 assert.equal(result.revision_attempts[0].no_change,true);assert.ok(fs.existsSync(path.join(output,'revision-1/revision-no-change.json')));
});
test('Engine cannot reuse old review when a no-change flag conceals modified meaning',async()=>{
 let n=0;const output=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-bad-nochange-test-'));
 await assert.rejects(()=>parse7Plus1(Buffer.from(prior.source.text),{output,parseMethod:'SKILL',probe:{version:'NO_MODEL_UNIT_TEST'},call:async()=>{
  const receipt={thread_id:'unit-'+n++};if(n===1)return {value:prior.proposal,receipt,attempts:[receipt]};if(n===2)return {value:prior.audit,receipt,attempts:[receipt]};
  const value=structuredClone(prior.proposal);value.events[0].modality='PERMITTED';return {value,no_change:true,receipt,attempts:[receipt]};
 }}),/NO_CHANGE_IDENTITY_MISMATCH/);
});
test('Changed local patches still require a new independent audit, never inherited support',async()=>{
 let n=0;const phases=[],output=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-changed-patch-test-'));
 const p=patch();p.disposition='PATCH';const node=structuredClone(encodeProposal(prior.proposal).events[0]);node.modality='PERMITTED';p.upserts.events=[node];
 const merged=applyRevisionPatch(prior.proposal,p,feedback),newAudit=structuredClone(prior.audit);newAudit.reviews.find(r=>r.subject_id===node.id).verdict='CONTRADICT';
 const result=await parse7Plus1(Buffer.from(prior.source.text),{output,parseMethod:'SKILL',probe:{version:'NO_MODEL_UNIT_TEST'},call:async o=>{
  phases.push(o.bundle.phase);const receipt={thread_id:'unit-'+n++};
  if(n===1)return {value:prior.proposal,receipt,attempts:[receipt]};if(n===2)return {value:prior.audit,receipt,attempts:[receipt]};
  if(n===3)return {...merged,wire_value:merged.wire,patch_value:p,normalization:merged.evidence,receipt,attempts:[receipt]};return {value:newAudit,receipt,attempts:[receipt]};
 }});
 assert.deepEqual(phases,['parse','audit','parse','audit']);assert.equal(result.audit.reviews.find(r=>r.subject_id===node.id).verdict,'CONTRADICT');
 assert.notEqual(result.technical.rows.find(r=>r.id===node.id).status,'ACCEPTED');
});
