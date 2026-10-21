import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const base=path.resolve(process.env.BOUNDARY_WORK??'.boundx/local-boundary-repair-r04/work');
const {technicalValidate}=await import(pathToFileURL(path.join(base,'research/7plus1-parser/llm-first-028/validate.mjs')));
const {compileBoundary}=await import(pathToFileURL(path.join(base,'research/7plus1-parser/llm-first-028/compile.mjs')));
const read=()=>JSON.parse(fs.readFileSync('docs/reports/7plus1/BOUNDARY-SKILL-REPAIR-r03/live-attempt-01/trace.json'));
function replay(t){const checks=technicalValidate(t.source,t.proposal,t.audit,{requireSourceAudit:true});return {checks,...compileBoundary(t.source,t.proposal,t.audit,checks)};}
test('independently supported order survives disputed condition direction; whole events remain unresolved',()=>{
 const t=read(),r=replay(t);assert.deepEqual(r.checks.diagnostics,[]);
 for(const claim of t.proposal.claims.filter(c=>c.kind==='TEMPORAL')){
  const f=r.ir.facts.find(f=>f.claim?.id===claim.id);assert.equal(f.status,'ACCEPTED');
  assert.equal(f.relation_acceptance_is_not_event_acceptance,true);
  assert.ok(f.proof.provenance_refs.includes(claim.event_id));
  assert.equal(r.ir.facts.find(f=>f.kind==='EVENT'&&f.event.id===claim.event_id).status,'UNRESOLVED');
 }
 assert.equal(r.canonical.slots.B.entries.length,3);assert.ok(r.canonical.slots.B.entries.every(f=>f.status==='ACCEPTED'));
 assert.equal(r.ir.execution_authorization,null);
});
test('a disputed temporal relation cannot inherit acceptance from its context',()=>{
 const t=read(),c=t.proposal.claims.find(c=>c.kind==='TEMPORAL');
 t.audit.reviews.filter(r=>r.subject_id===c.id).forEach(r=>r.verdict='UNCERTAIN');
 assert.equal(replay(t).ir.facts.find(f=>f.claim?.id===c.id).status,'UNRESOLVED');
});
test('missing temporal endpoint is rejected',()=>{
 const t=read(),c=t.proposal.claims.find(c=>c.kind==='TEMPORAL');c.event_id='missing';
 assert.equal(replay(t).ir.facts.find(f=>f.claim?.id===c.id).status,'REJECTED');
});
test('rejected event and explicit full dependency still block independent order',()=>{
 const t=read(),c=t.proposal.claims.find(c=>c.kind==='TEMPORAL');
 t.proposal.events.find(e=>e.id===c.event_id).owner_id='missing';
 assert.notEqual(replay(t).ir.facts.find(f=>f.claim?.id===c.id).status,'ACCEPTED');
 const u=read(),d=u.proposal.claims.find(c=>c.kind==='TEMPORAL');d.requires=[d.event_id];
 assert.notEqual(replay(u).ir.facts.find(f=>f.claim?.id===d.id).status,'ACCEPTED');
});
