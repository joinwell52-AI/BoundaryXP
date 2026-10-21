import test from 'node:test';
import assert from 'node:assert/strict';
import {contractVersion} from '../contracts/schema.mjs';
import {prepareSource} from '../source.mjs';
import {technicalValidate,graphItems} from '../validate.mjs';
import {compileBoundary,evaluateExpression,evaluateScope} from '../compile.mjs';
import {expressionType} from '../scopes.mjs';
import {technicalRevisionFeedback} from '../revision.mjs';
// Artificial syntax/consumer fixtures, never model accuracy evidence.
const source=prepareSource(Buffer.from('负责人核对目录内所有记录，除记录甲外不得更改记录。'));
const sources=[{quote:source.text,occurrence:1}];
const entity=(id,type='OTHER')=>({id,label:id,type,mentions:sources,alternatives:[]});
const expr=(id,op,operands)=>({id,op,operands,state:null,sources});
function fixture(){
 const g={contract_version:contractVersion,entities:[entity('records','CLASS'),entity('directory','FILE'),entity('a'),entity('b'),entity('outside')],events:[{id:'edit',predicate:'更改',kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',modality:'FORBIDDEN',polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:[],requires:[],sources}],claims:[{id:'object',kind:'ROLE',event_id:'edit',entity_id:'records',role:'OBJECT',expression_id:null,direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:'edit',requires:[],sources,note:''},{id:'scope',kind:'SCOPE',event_id:'edit',entity_id:null,role:null,expression_id:'forall',direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:'records',requires:[],sources,note:''}],expressions:[expr('domain','CATEGORY',['records','directory']),expr('forall','FORALL',['domain'])],issues:[],coverage:[{sources,claim_ids:['edit','object','scope'],status:'EXPRESSED',affected_views:['B'],range_requirement:{kind:'UNIVERSAL',scope_claim_ids:['scope']}}]};return g;
}
const audit=g=>({contract_version:contractVersion,reviews:graphItems(g).map(x=>({subject_id:x.id,field_path:'',verdict:'SUPPORT',context_refs:[],sources,reason:'Artificial fixture only'})),issues:[],omissions:[]});
const run=(g,a=audit(g))=>{const checks=technicalValidate(source,g,a);return{checks,...compileBoundary(source,g,a,checks)};};
const observations=[{member_id:'a',category_id:'records',within_id:'directory',value:'TRUE'},{member_id:'b',category_id:'records',within_id:'directory',value:'TRUE'},{member_id:'outside',category_id:'records',within_id:'directory',value:'FALSE'}];
const matches=(g,k,member,obs=observations)=>evaluateScope(g.expressions,k,member,{entities:g.entities,memberships:obs});
test('Universal category applies to distinct in-domain members, excludes outside, unknown stays unknown',()=>{
 const g=fixture(),r=run(g);assert.ok(r.checks.rows.every(x=>x.status==='ACCEPTED'));assert.equal(r.canonical.slots.B.status,'RESOLVED');
 assert.deepEqual(['a','b','outside','unknown'].map(m=>matches(g,'forall',m).scope_value),['TRUE','TRUE','FALSE','UNKNOWN']);
 assert.equal(matches(g,'forall','a',[{...observations[0],within_id:'another-directory'}]).scope_value,'UNKNOWN');
 assert.equal(matches(g,'forall','a',[observations[0],{...observations[0],value:'FALSE'}]).scope_value,'UNKNOWN');
 assert.equal(matches(g,'forall','a').quantifier,'FORALL');assert.equal(matches(g,'domain','a').quantifier,null);
 assert.equal(evaluateExpression(g.expressions,'forall'),'UNKNOWN');
});
test('Finite enum, class domain, universal and exception remain distinct in structure and consumption',()=>{
 const g=fixture();g.expressions.push(expr('enum','ENUM',['a']),expr('except','EXCEPT',['domain','enum']),expr('all-except','FORALL',['except']));
 assert.deepEqual(['a','b','outside','unknown'].map(m=>matches(g,'all-except',m).scope_value),['FALSE','TRUE','FALSE','UNKNOWN']);
 assert.equal(matches(g,'enum','b').scope_value,'FALSE');assert.equal(matches(g,'forall','b').scope_value,'TRUE');
 g.claims[1].expression_id='all-except';g.coverage[0].range_requirement.kind='UNIVERSAL_EXCEPT';assert.equal(run(g).canonical.slots.B.status,'RESOLVED');
 assert.ok(run(g).chinese.includes('全称适用'));assert.ok(run(g).chinese.includes('范围排除'));assert.ok(run(g).chinese.includes('有限枚举'));
 const r=matches(g,'all-except','a');assert.equal(r.not_matching_is_not_permission,true);assert.equal(r.business_decision,null);assert.equal(r.execution_authorization,null);assert.ok(!run(g).canonical.slots.A.entries.length);
});
test('Boolean ALL cannot consume objects; universal cannot become Boolean condition',()=>{
 const g=fixture();g.expressions.push(expr('item-a','ITEM',['a']),expr('item-b','ITEM',['b']),expr('wrong','ALL',['item-a','item-b']));
 assert.equal(evaluateExpression(g.expressions,'wrong'),'UNKNOWN');assert.equal(expressionType(g.expressions,'wrong',g.entities),'INVALID');assert.equal(run(g).checks.rows.find(x=>x.id==='wrong').status,'REJECTED');
 g.events[0].constraint_ids=['condition'];g.claims.push({...g.claims[1],id:'condition',kind:'CONDITION',scope_id:'edit',expression_id:'forall',direction:'NECESSARY'});
 assert.ok(run(g).checks.rows.find(x=>x.id==='condition').errors.some(e=>e.code==='CONDITION_EXPRESSION_TYPE'));
});
test('A declared universal represented by ordinary ITEM stays a coverage gap, never fixed from note',()=>{
 const g=fixture();g.entities.find(x=>x.id==='records').type='OTHER';g.expressions=[expr('item','ITEM',['records'])];g.claims[1].expression_id='item';g.claims[1].note='所有/任何/全称；must not be parsed';
 const r=run(g);assert.equal(r.canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');assert.ok(r.ir.gaps.length);assert.ok(technicalRevisionFeedback(r.checks,g).some(x=>x.code==='RANGE_REQUIREMENT_UNREPRESENTED'));
 g.claims[1].note='arbitrary';assert.deepEqual(run(g).checks.coverage,r.checks.coverage);
 g.expressions.push(expr('fake-forall','FORALL',['item']));g.claims[1].expression_id='fake-forall';assert.equal(run(g).canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');
});
test('Missing universal binding, malformed ranges and wrong object ownership are never complete',()=>{
 for(const change of [g=>g.coverage[0].range_requirement.scope_claim_ids=[],g=>g.claims[1].scope_id='outside',g=>g.expressions[0].operands[0]='a',g=>g.expressions[1].operands=[],g=>g.expressions[1].op='ALL']){
  const g=fixture();change(g);assert.notEqual(run(g).canonical.slots.B.status,'RESOLVED');
 }
 const g=fixture();delete g.coverage[0].range_requirement;assert.equal(run(g).checks.schemas.proposal.ok,false);
});
test('Exception cannot be silently omitted or smuggled into plain universal coverage',()=>{
 const g=fixture();g.coverage[0].range_requirement.kind='UNIVERSAL_EXCEPT';assert.equal(run(g).canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');
 g.expressions.push(expr('except-items','ENUM',['a']),expr('except','EXCEPT',['domain','except-items']));g.expressions[1].operands=['except'];g.coverage[0].range_requirement.kind='UNIVERSAL';assert.equal(run(g).canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');
});
test('Scope/CLASS source or direct audit uncertainty blocks only the affected restriction',()=>{
 const g=fixture(),a=audit(g);a.reviews.find(x=>x.subject_id==='scope').verdict='UNCERTAIN';const r=run(g,a);assert.equal(r.canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');assert.ok(r.canonical.slots.B.entries.every(x=>x.status!=='ACCEPTED'));
 const b=audit(g);b.reviews.find(x=>x.subject_id==='records').verdict='UNCERTAIN';b.issues.push({id:'type',issue_kind:'IDENTITY',subject_ids:['records'],field_path:'type',context_refs:[],sources,reason:'CLASS not supported',suggested_json:null});assert.notEqual(run(g,b).canonical.slots.B.status,'RESOLVED');
 g.expressions[0].sources=[{quote:'not in source',occurrence:1}];assert.notEqual(run(g).canonical.slots.B.status,'RESOLVED');
});
test('JSON, Chinese and provenance carry same quantifier, class and container; IDs not labels decide membership',()=>{
 const g=fixture(),r=run(g),event=r.canonical.slots.B.entries.find(x=>x.kind==='EVENT'),range=event.object_scopes[0];
 assert.equal(range.expression.op,'FORALL');assert.deepEqual(range.expression.children[0].operands,['records','directory']);assert.ok(event.proof.provenance_refs.includes('directory'));assert.ok(event.sources.every(s=>Array.from(source.text).slice(...s.span).join('')===s.quote));
 assert.ok(r.chinese.includes('类别范围(records；适用范围=directory)'));g.entities.forEach(e=>e.label='same label');assert.equal(matches(g,'forall','outside').scope_value,'FALSE');
 const b=JSON.parse(JSON.stringify(g).replaceAll('"records"','"renamed-class"'));const obs=observations.map(o=>({...o,category_id:'renamed-class'}));assert.equal(matches(b,'forall','b',obs).scope_value,'TRUE');
});

test('Specific objects and finite enumerations never acquire category or universal meaning',()=>{
 const g=fixture();g.entities[0].type='OTHER';g.expressions=[expr('set','ENUM',['records','a'])];g.claims[1].expression_id='set';g.coverage[0].range_requirement.kind='FINITE_ENUM';assert.equal(run(g).canonical.slots.B.status,'RESOLVED');
 assert.deepEqual(['records','a','b'].map(m=>matches(g,'set',m).scope_value),['TRUE','TRUE','FALSE']);
 g.expressions[0]=expr('set','ITEM',['records']);g.coverage[0].range_requirement.kind='SPECIFIC';assert.equal(run(g).canonical.slots.B.status,'RESOLVED');assert.equal(matches(g,'set','a').scope_value,'FALSE');
 g.coverage[0].range_requirement.kind='FINITE_ENUM';assert.equal(run(g).canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');
});
