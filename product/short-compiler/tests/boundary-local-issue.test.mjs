import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const base=path.resolve(process.env.BOUNDARY_WORK??'.boundx/local-boundary-repair-r03/work');
const {issueTargetsItem,technicalValidate}=await import(pathToFileURL(path.join(base,'research/7plus1-parser/llm-first-028/validate.mjs')));
const {compileBoundary}=await import(pathToFileURL(path.join(base,'research/7plus1-parser/llm-first-028/compile.mjs')));
const {prepareSource}=await import(pathToFileURL(path.join(base,'research/7plus1-parser/llm-first-028/source.mjs')));
const run='.boundx/short-compiler-031-r1/data/runs/aba8a264-9488-405b-9f51-fc152bdb8ef2';
const read=p=>JSON.parse(fs.readFileSync(path.join(run,p),'utf8'));
test('qualified target does not make context an uncertainty dependency',()=>{
 const issue={subject_ids:['publish','latency'],field_path:'events[publish].modality'};
 assert.equal(issueTargetsItem(issue,{collection:'events',id:'publish'}),true);
 assert.equal(issueTargetsItem(issue,{collection:'claims',id:'latency'}),false);
});
test('relative and whole-node issues remain conservative',()=>{
 for(const field_path of ['','direction'])for(const id of ['first','second'])assert.equal(issueTargetsItem({subject_ids:['first','second'],field_path},{collection:'claims',id}),true);
});
test('invalid qualified target must not clear listed subjects',()=>{
 const item={id:'first',collection:'claims'},index=new Map([[item.id,item]]);
 for(const field_path of ['events[missing].modality','events[first].modality','claims[other].direction'])assert.equal(issueTargetsItem({subject_ids:['first'],field_path},item,index),true);
});
test('frozen real response: explicit immediate remains accepted; disputed event still unresolved',()=>{
 const source=read('source.json'),proposal=read('revision-1/proposal.json'),audit=read('revision-1/audit.json');
 const checks=technicalValidate(source,proposal,audit,{requireSourceAudit:true});
 assert.deepEqual(checks.diagnostics,[]);
 const row=id=>checks.rows.find(r=>r.id===id);
 assert.equal(row('c_stop_immediate').status,'ACCEPTED');
 assert.equal(row('report_admin').status,'UNRESOLVED');
 assert.equal(row('c_summary_condition').status,'UNRESOLVED');
 const compiled=compileBoundary(source,proposal,audit,checks);
 assert.equal(compiled.ir.facts.find(f=>f.claim?.id==='c_stop_immediate').status,'ACCEPTED');
 assert.equal(compiled.ir.facts.find(f=>f.claim?.id==='c_completion').claim.direction,'SUFFICIENT');
 assert.equal(compiled.canonical.slots.B.entries.length,2,'program must not invent a third prohibition from an old response');
});
test('whole-node doubt cannot be bypassed by an independent support review',()=>{
 const source=read('source.json'),proposal=read('revision-1/proposal.json'),audit=read('revision-1/audit.json');
 proposal.issues.push({id:'extra_doubt',kind:'AMBIGUITY',subject_ids:['c_stop_immediate'],field_path:'',alternatives:[],affected_views:['A'],sources:proposal.claims.find(c=>c.id==='c_stop_immediate').sources,note:'Uncertain binding'});
 assert.equal(technicalValidate(source,proposal,audit).rows.find(r=>r.id==='c_stop_immediate').status,'UNRESOLVED');
});
for(const [label,text,restriction] of [
 ['Chinese conditional stop','发现异常时，暂停当前检查，暂停期间不得继续检查。',true],
 ['English conditional stop','If a fault is detected, stop the current inspection and do not continue it while stopped.',true],
 ['Chinese report only','发现异常时，向负责人汇报，其他工作照常。',false],
 ['English report only','If a fault is detected, report it to the coordinator; other work continues.',false],
 ['Chinese quoted boundary','文档示例引用：发现异常时不得继续检查；本次只阅读文档。','quoted'],
 ['English quoted boundary','The manual quotes: do not continue on fault. This task only reads the manual.','quoted']
])test('typed consumer (not LLM validation): '+label,()=>{
 const source=prepareSource(Buffer.from(text)),sources=[{quote:text,occurrence:1}];
 const event={id:'action',predicate:restriction?'继续检查':'汇报',kind:'ACTION',layer:restriction==='quoted'?'QUOTED':'MAIN',use:restriction==='quoted'?'MENTION_ONLY':'CURRENT_TASK',modality:restriction?'FORBIDDEN':'REQUIRED',polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:['trigger'],requires:[],sources};
 const graph={contract_version:'031-r1.1',entities:[],events:[event],claims:[{id:'trigger',kind:'CONDITION',event_id:'action',entity_id:null,role:null,expression_id:'fault',direction:'SUFFICIENT',temporal:null,quantity:null,artifact_use:null,scope_id:'action',requires:[],sources,note:''}],expressions:[{id:'fault',op:'STATE',operands:[],state:{predicate:'故障已发现',event_id:null,args:[],polarity:'POSITIVE'},sources}],issues:[],coverage:[]};
 const audit={contract_version:'031-r1.1',reviews:[...graph.events,...graph.claims,...graph.expressions].map(x=>({subject_id:x.id,field_path:'',verdict:'SUPPORT',context_refs:[],sources,reason:'Predeclared typed fixture'})),issues:[],omissions:[]};
 const checks=technicalValidate(source,graph,audit);assert.ok(checks.rows.every(r=>r.status==='ACCEPTED'));
 const out=compileBoundary(source,graph,audit,checks);assert.equal(out.canonical.slots.B.entries.length,restriction===true?1:0);
 assert.equal(out.canonical.slots.A.entries.length,restriction===false?1:0);
 const fact=out.ir.facts.find(f=>f.kind==='EVENT');assert.equal(fact.constraints[0].direction,'SUFFICIENT');assert.equal(fact.constraints[0].expression.id,'fault');assert.equal(out.ir.execution_authorization,null);
});
