import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDARY_WORK??'.boundx/local-boundary-repair-r08/work');
const {technicalValidate}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/validate.mjs')));
const {compileBoundary}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/compile.mjs')));
const {calculateBoundary}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/calculus.mjs')));
const original=JSON.parse(fs.readFileSync('docs/reports/7plus1/MATHEMATICAL-RESULT-CLOSURE-r01/live-attempt-01/revision-0/trace.json'));
function fixture(){const t=structuredClone(original);t.proposal.issues=[];t.audit.issues=[];t.audit.omissions=[];for(const r of t.audit.reviews)r.verdict='SUPPORT';for(const c of t.proposal.claims.filter(x=>['c43','c44'].includes(x.id))){c.event_id=null;c.quantity.target_id='ROOT';}t.proposal.events[0].constraint_ids=[];t.proposal.coverage=[];t.audit.source_checks=[];return t;}
test('explicit ROOT aggregate duration binds and computes on root, not organizer',()=>{
 const t=fixture(),v=technicalValidate(t.source,t.proposal,t.audit);for(const id of ['c43','c44'])assert.equal(v.rows.find(x=>x.id===id).status,'ACCEPTED');const c=compileBoundary(t.source,t.proposal,t.audit,v),r=calculateBoundary(c.ir);assert.equal(r.intervals[0].subject,'ROOT');assert.equal(r.intervals[0].lower.value,'0');assert.equal(r.intervals[0].upper.value,'30');assert.ok(c.ir.facts.filter(x=>x.kind==='QUANTITY').every(x=>x.slots.includes('R')));
});
for(const change of ['scope','output','each','event'])test('invalid root quantity '+change+' remains rejected',()=>{
 const t=fixture(),q=t.proposal.claims.find(x=>x.id==='c43');if(change==='scope')q.scope_id='e1';if(change==='output')q.quantity.use='OUTPUT_CONTENT';if(change==='each')q.quantity.distribution={mode:'EACH',domain_id:'xinputs'};if(change==='event')q.event_id='e1';const v=technicalValidate(t.source,t.proposal,t.audit);assert.equal(v.rows.find(x=>x.id===q.id).status,'REJECTED');
});
test('explicit root property object is accepted; a different TEST target is rejected',()=>{
 const t=fixture();let v=technicalValidate(t.source,t.proposal,t.audit);assert.equal(v.rows.find(x=>x.id==='c7').status,'ACCEPTED');t.proposal.expressions.find(x=>x.id==='xtest').test.target_id='app';v=technicalValidate(t.source,t.proposal,t.audit);assert.equal(v.rows.find(x=>x.id==='c7').status,'REJECTED');
});
test('accepted root property participates in Boolean calculation rather than disappearing',()=>{
 const t=fixture(),v=technicalValidate(t.source,t.proposal,t.audit),c=compileBoundary(t.source,t.proposal,t.audit,v),r=calculateBoundary(c.ir);assert.ok(r.boolean.formulas.some(x=>x.rule==='EXPLICIT_ROOT_OBJECT_PROPERTY_SCOPE'||x.rule_id==='EXPLICIT_ROOT_OBJECT_PROPERTY_SCOPE'));
});
