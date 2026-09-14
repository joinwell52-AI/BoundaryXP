import test from 'node:test';
import assert from 'node:assert/strict';
import {assignmentRisks,compareAssignments,followUpText,taskReminder} from './task-risks.mjs';
import {localTaskProjection} from './local-task.mjs';
const doc=(text,actor='DEV')=>({text,parameters:{O:text},actions:[{actor,verb:'inspect',target:'system',quote:text}],completion:[]});
const plan={document:doc('root'),tasks:[{id:'T1',document:doc('inspect A'),depends_on:['T10']},{id:'T10',document:doc('inspect B'),depends_on:['T1']}]};
const findings=[{id:'f1',kind:'action_difference',location:'T10.actions',source_quote:'inspect B'},{id:'f2',kind:'completion_difference',location:'plan.completion',source_quote:'root'},{id:'f3',kind:'dependency_cycle',location:'tasks',source_quote:'T1 → T10 → T1'}];
test('risk attribution separates exact task IDs, PM conditions and shared cycles',()=>{
 const sections=assignmentRisks(plan,{findings});assert.equal(sections.find(s=>s.id==='T1').findings.length,1);assert.equal(sections.find(s=>s.id==='T10').findings.length,2);assert.equal(sections.find(s=>s.id==='$root').findings[0].id,'f2');assert.equal(sections.find(s=>s.id==='T1').risks[0].severity,'structural');
 assert(taskReminder(plan,{findings},'en').includes('T10'));assert(!taskReminder(plan,{findings},'en').includes('风险'));
});
test('ambiguous prefixes remain unassigned rather than blamed on a task',()=>{
 const ambiguous={...plan,tasks:[...plan.tasks,{id:'T1.child',document:doc('x'),depends_on:[]}]};const sections=assignmentRisks(ambiguous,{findings:[{kind:'action_difference',location:'T1.child.actions',source_quote:'x'}]});assert(sections.find(s=>s.id==='$unknown'));
});
test('before/after tracks actual task changes; renamed IDs are not assumed resolved',()=>{
 const after=structuredClone(plan);after.tasks[0].document=doc('inspect A revised','QA');after.tasks[1].id='T20';const rows=compareAssignments(plan,after);assert.equal(rows[0].status,'changed');assert(rows[0].changed.includes('owner'));assert.equal(rows[1].status,'unmatched');assert.equal(rows[2].status,'added');assert.equal(compareAssignments(plan,plan)[0].status,'unchanged');
 const text=followUpText({input:after,followUp:{before:plan}},'en');assert(text.includes('do not prove'));assert(text.includes('unmatched'));
});
test('missing reply and incomplete parsing are not successful revision',()=>{
 assert(followUpText({},'en').includes('No reminder'));assert(followUpText({followUps:[{status:'received_not_compared',reply:'I changed it'}]},'en').includes('not completed'));assert(followUpText({followUps:[{status:'failed'}]},'en').includes('no completed'));
});
test('local ADMIN checks preserve source, leave unknowns and never create authorized actions',()=>{
 const text='检查系统；由 PM 分工；最后向 ADMIN 汇报；预算待定；禁止修改源代码。';const result=localTaskProjection(text);assert.equal(result.text,text);assert(result.parameters.I);assert(result.parameters.O);assert(result.parameters.C);assert(!result.parameters.R);assert.deepEqual(result.actions,[]);for(const quote of Object.values(result.parameters))assert(text.includes(quote));
 const english=localTaskProjection('Inspect the system; PM assigns work; finally report to ADMIN; budget TBD.');assert(english.parameters.I);assert(english.parameters.O);assert(!english.parameters.R);
});
