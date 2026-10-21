import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {compareProgramPlan} from '../src/bxp/workbench-program.mjs';
import {bindingIssues,supplementsParentDuty} from '../src/bxp/workbench-binding.mjs';

const read=name=>JSON.parse(fs.readFileSync(new URL('./fixtures/ui220-enterprise/'+name,import.meta.url)));
const manifest=read('MANIFEST.json');
for(const row of manifest.cases)test(`${row.id}: saved mathematical structures yield ${row.expected} without models`,()=>{
 const bytes=fs.readFileSync(new URL('./fixtures/ui220-enterprise/'+row.file,import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);
 const input=JSON.parse(bytes),before=JSON.stringify(input),result=compareProgramPlan(input);
 assert.equal(result.status,row.expected);assert.equal(result.new_model_requests,0);
 assert.equal(JSON.stringify(input),before,'Calculation must preserve its source and saved parse');
});
const baseline=read('EA002.json');
const run=boundaries=>compareProgramPlan({plan:baseline.plan,boundaries});
const copy=()=>structuredClone(baseline.boundaries);
test('Known relations resolve without unnecessary concrete numbers or version labels',()=>{
 const result=run(copy());assert.equal(result.status,'VERIFIED');
 assert.equal(result.findings.filter(f=>f.status==='UNRESOLVED').length,0);
 assert.equal(result.diagnostics.filter(d=>d.reason==='DETAIL_NOT_REQUIRED_BY_BOUNDARY_COMPARISON').length,3);
});
test('A genuinely unknown relation remains unresolved',()=>{
 const b=copy();Object.assign(b.p.boundary.formal.constraints.find(c=>c.id==='c04.4'),{type:'unknown',reason:'Missing relation in negative test'});
 assert.equal(run(b).status,'UNRESOLVED');
});
test('Incomplete clause coverage cannot be waived',()=>{
 const b=copy();b.p.boundary.formal.coverage.find(c=>c.clause_id==='c04').unresolved=[{reason:'Missing operand in negative test'}];
 assert.equal(run(b).status,'UNRESOLVED');
});
test('Invalid source evidence remains unresolved',()=>{
 const b=copy();b.p.boundary.clauses.find(c=>c.id==='c04').quotes[0].quote='This quotation is absent from the source';
 assert.equal(run(b).status,'UNRESOLVED');
});
function addNumeric(b,empty=false){
 const add=(node,clause,c)=>{const f=b[node].boundary.formal;f.constraints.push({...c,clause_ids:[clause],axes:['R']});f.coverage.find(x=>x.clause_id===clause).constraint_ids.push(c.id);};
 const common={type:'quantity',key:'test.explicit_numeric_boundary',unit:'count',combination:'SINGLE',instance:'test.same_instance'};
 add('p','c04',{...common,id:'test.limit',role:'LIMIT',lower:null,upper:{value:'5',inclusive:true}});
 add('ops','ops-5',{...common,id:'test.actual',role:'VALUE',lower:empty?null:{value:'6',inclusive:true},upper:empty?null:{value:'6',inclusive:true}});
}
test('An explicit numeric violation survives detail diagnostics',()=>{const b=copy();addNumeric(b);assert.equal(run(b).status,'VIOLATED');});
test('A necessary missing numeric operand stays unresolved',()=>{const b=copy();addNumeric(b,true);assert.equal(run(b).status,'UNRESOLVED');});
test('An unexecutable mathematical model stays unresolved',()=>{
 const b=copy();b.p.boundary.formal.compiled_math_models.models.push({axes:['R'],formula:'Missing numeric operand',source_refs:[{node_id:'p',clause_id:'c04'}],expression:{kind:'interval_subset',parent:{lower:null,upper:{value:'5',inclusive:true}},child:{lower:null,upper:null}}});
 assert.equal(run(b).status,'UNRESOLVED');
});
test('A proposition requires the actual model variable identity',()=>{
 const b=copy(),c=b.qa.boundary.formal.constraints.find(c=>c.id==='qa-5.2');c.key+='-different';
 assert(bindingIssues(baseline.plan,b,baseline.plan.nodes.find(n=>n.id==='qa'),c).some(e=>e.code==='UNBOUND_TYPED_IDENTITY'));
});
test('A source citation alone does not resolve a proposition binding',()=>{
 const b=copy(),c=b.qa.boundary.formal.constraints.find(c=>c.id==='qa-5.2');
 b.p.boundary.formal.compiled_math_models.models=b.p.boundary.formal.compiled_math_models.models.filter(m=>m.expression.kind!=='boolean_implication');
 assert(bindingIssues(baseline.plan,b,baseline.plan.nodes.find(n=>n.id==='qa'),c).some(e=>e.code==='UNBOUND_TYPED_IDENTITY'));
});
test('Supplemental duties cannot cancel obligations or weaken immediate parent gates',()=>{
 const p={type:'obligation',key:'whole',mode:'REQUIRED',timing:'EVENTUALLY'};
 assert(supplementsParentDuty({type:'obligation',key:'part',mode:'REQUIRED'},p));
 assert(!supplementsParentDuty({type:'obligation',key:'part',mode:'CANCELLED'},p));
 assert(!supplementsParentDuty({type:'permission',key:'part',expression:true},p));
 assert(!supplementsParentDuty({type:'condition',key:'part'},{...p,timing:'ON_TRIGGER'}));
});
