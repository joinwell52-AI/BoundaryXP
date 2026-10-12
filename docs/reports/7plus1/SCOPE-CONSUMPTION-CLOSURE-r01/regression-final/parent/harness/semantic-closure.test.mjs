import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDX_SEMANTIC_TEST_ROOT??'.boundx/semantic-closure-ui23-work');
const load=p=>import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028',p)).href);
const {technicalValidate}=await load('validate.mjs');
const {prepareSource}=await load('source.mjs');
const {compileBoundary,evaluateQuantity}=await load('compile.mjs');
const {calculateBoundary}=await load('calculus.mjs');
const {evaluateDistributedQuantity}=await load('quantity-domain.mjs');
const {encodeProposal,decodeProposal,encodeAudit,decodeAudit,validateWire}=await load('compact-wire.mjs');
const {technicalRevisionFeedback}=await load('revision.mjs');
const {buildBundle}=await load('bundle.mjs');
const {parse7Plus1}=await load('engine.mjs');
const {codexWireOutputSchema}=await load('compact-wire.mjs');
const text='Operator creates two test files. Each test file needs at least four cases. Use is optional. Deliver only selected symbols. Three commits are a work plan.';
const sources=[{quote:text,occurrence:1}];
function graph(){
 const entity=(id,type='FILE',members=null)=>({id,label:id,type,mentions:sources,alternatives:[],...(members===null?{}:{members})});
 const role=(id,entity_id,role)=>({id,kind:'ROLE',event_id:'create',entity_id,role,expression_id:null,direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:'create',requires:[],sources,note:''});
 const g={contract_version:'031-r1.1',entities:[entity('worker','PERSON'),entity('files','GROUP',['a','b']),entity('a'),entity('b'),entity('outside'),entity('broad','GROUP',['a','b','outside'])],events:[{id:'create',predicate:'create',kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',modality:'REQUIRED',polarity:'POSITIVE',owner_id:'ROOT',constraint_ids:['q'],requires:[],sources}],claims:[role('result','files','RESULT'),role('actor','worker','PERFORMER'),{id:'q',kind:'QUANTITY',event_id:'create',entity_id:null,role:null,expression_id:null,direction:null,temporal:null,quantity:{metric:'case count',target_id:'files',comparator:'GTE',value:4,unit:'cases',use:'OUTPUT_CONTENT',count_scope:'files',distribution:{mode:'EACH',domain_id:'members'}},artifact_use:null,scope_id:'create',requires:[],sources,note:''}],expressions:[{id:'item',op:'ITEM',operands:['files'],state:null,sources},{id:'members',op:'MEMBERS',operands:['item'],state:null,sources},{id:'state',op:'STATE',operands:[],state:{predicate:'created',event_id:'create',args:['files'],polarity:'POSITIVE'},sources}],issues:[],coverage:[{sources,claim_ids:['q'],status:'EXPRESSED',affected_views:['O'],requirement_kind:'QUANTITY_EACH'}]};
 return g;
}
function audit(g){return {contract_version:g.contract_version,reviews:[...g.entities,...g.events,...g.claims,...g.expressions].map(x=>({subject_id:x.id,field_path:'',verdict:'SUPPORT',context_refs:[],sources,reason:'Synthetic structural assertion, not model evidence'})),issues:[],omissions:[],source_checks:[]};}
function compile(g=graph(),a=audit(g)){const source=prepareSource(Buffer.from(text)),checks=technicalValidate(source,g,a);return {...compileBoundary(source,g,a,checks),checks};}
const observed=(member_id,value)=>({value,unit:'cases',target_id:member_id,count_scope:'files'});
const evaluate=(g,values,memberships={})=>evaluateDistributedQuantity(g.claims.find(x=>x.id==='q').quantity,g.expressions,g.entities,values,memberships,evaluateQuantity);
test('UI-selected Skill uses the same current parse and audit resources as CLI',()=>{
 for(const phase of ['parse','audit'])assert.equal(buildBundle(phase,{parseMethod:'SKILL'}).sha256,buildBundle(phase).sha256);
 assert.throws(()=>buildBundle('parse',{parseMethod:'MD'}),/MD_COMPARISON_STOPPED/);
});
test('Current structured-output Schema requires declared additive semantics without mutating local compatibility Schema',()=>{
 const schema=buildBundle('parse').schema,before=JSON.stringify(schema),s=codexWireOutputSchema(schema).schema;
 const visit=x=>{if(!x||typeof x!=='object')return;if(x.type==='object'&&x.properties)assert.deepEqual(new Set(x.required),new Set(Object.keys(x.properties)));for(const v of Object.values(x))if(typeof v==='object')visit(v);};
 visit(s);assert.equal(JSON.stringify(schema),before);
});
test('New same-version engine preserves explicit quantities through two independent fixture sessions and program calculation',async()=>{
 const g=graph(),a=audit(g);a.source_checks=[{sources,claim_ids:['q'],status:'EXPRESSED',requirement_kind:'QUANTITY_EACH',affected_views:['O'],reason:'Source requirement recorded'}];
 const phases=[],output=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-closure-engine-'));let n=0;
 const t=await parse7Plus1(Buffer.from(text),{output,probe:{version:'NO_MODEL_TEST'},parseMethod:'SKILL',call:async o=>{phases.push(o.bundle.phase);const receipt={thread_id:'fixture-'+(++n)};return {value:o.bundle.phase==='parse'?g:a,receipt,attempts:[receipt]};}});
 assert.deepEqual(phases,['parse','audit']);assert.deepEqual(t.proposal,g);assert.deepEqual(t.audit,a);assert.equal(t.technical.audit_coverage,'RECORDED_NOT_PROVEN');assert.equal(t.boundary_calculations.quantities[0].distribution,'EACH');assert.equal(t.boundary_calculations.quantities[0].result,'UNKNOWN');assert.equal(t.canonical.slots.R.entries.length,0);
});
test('Fresh independent audit cannot equate empty omission checks with complete coverage',()=>{
 const g=graph(),a=audit(g),s=prepareSource(Buffer.from(text)),checks=technicalValidate(s,g,a,{requireSourceAudit:true});
 assert.equal(checks.audit_coverage,'MISSING_REQUIRED_SOURCE_AUDIT');
 assert.equal(compileBoundary(s,g,a,checks).canonical.slots.O.status,'PARSER_COVERAGE_FAILURE');
 assert.equal(checks.source_checks[0].sources[0].quote,text);
});
test('Recorded source audit remains evidence rather than semantic proof',()=>{
 const g=graph(),a=audit(g);a.source_checks=[{sources,claim_ids:['q'],status:'EXPRESSED',requirement_kind:'QUANTITY_EACH',affected_views:['O'],reason:'Explicit source quantity checked'}];
 const checks=technicalValidate(prepareSource(Buffer.from(text)),g,a,{requireSourceAudit:true});assert.equal(checks.audit_coverage,'RECORDED_NOT_PROVEN');assert.equal(checks.source_checks[0].status,'EXPRESSED');
});
test('Explicit member domain survives wire/canonical round trip and deterministic O projection',()=>{
 const g=graph(),wire=encodeProposal(g);assert.equal(validateWire('proposal',wire).ok,true);
 assert.deepEqual(decodeProposal(wire).value,g);const c=compile(g);assert.equal(c.checks.rows.find(x=>x.id==='q').status,'ACCEPTED');
 assert.equal(c.canonical.slots.R.entries.length,0);assert.ok(c.chinese.includes('逐成员'));assert.ok(c.canonical.slots.O.entries.some(x=>x.content_quantities?.[0]?.quantity.distribution.mode==='EACH'));
});
test('Two members meeting their own minimum yield TRUE',()=>assert.equal(evaluate(graph(),{members:{a:observed('a',4),b:observed('b',6)}}).result,'TRUE'));
test('A large total cannot hide one failing member',()=>assert.equal(evaluate(graph(),{members:{a:observed('a',12),b:observed('b',1)}}).result,'FALSE'));
test('A missing count stays UNKNOWN instead of dropping that member',()=>assert.equal(evaluate(graph(),{members:{a:observed('a',8)}}).result,'UNKNOWN'));
test('Out-of-domain observations do not enlarge the quantified scope',()=>{
 const e=evaluate(graph(),{members:{a:observed('a',4),b:observed('b',4),outside:observed('outside',0)}});assert.equal(e.result,'TRUE');assert.deepEqual(e.out_of_domain_observation_ids,['outside']);assert.equal(e.execution_authorization,null);
});
test('Unknown membership remains UNKNOWN even with apparently sufficient counts',()=>{
 const g=graph();g.entities.find(x=>x.id==='files').members=null;
 const e=evaluate(g,{members:{a:observed('a',4),b:observed('b',4)}});assert.equal(e.result,'UNKNOWN');assert.equal(e.membership_complete,false);
});
test('Complete external membership enables evaluation without rewriting the candidate',()=>{
 const g=graph();g.entities.find(x=>x.id==='files').members=null;const before=JSON.stringify(g);
 assert.equal(evaluate(g,{members:{a:observed('a',4),b:observed('b',4)}},{files:{members:['a','b'],complete:true}}).result,'TRUE');assert.equal(JSON.stringify(g),before);
});
test('Incomplete external membership cannot prove universal success',()=>{
 const g=graph();g.entities.find(x=>x.id==='files').members=null;assert.equal(evaluate(g,{members:{a:observed('a',8)}},{files:{members:['a'],complete:false}}).result,'UNKNOWN');
});
test('A wrong object/unit/scope measurement cannot certify a member',()=>{
 for(const field of ['target_id','unit','count_scope']){const bad={...observed('b',8),[field]:'wrong'};assert.equal(evaluate(graph(),{members:{a:observed('a',8),b:bad}}).result,'UNKNOWN');}
});
test('Exception domain excludes only the declared exception',()=>{
 const g=graph();g.expressions.push({id:'except-item',op:'ITEM',operands:['b'],state:null,sources},{id:'except',op:'EXCEPT',operands:['members','except-item'],state:null,sources});g.claims[2].quantity.distribution.domain_id='except';
 assert.equal(evaluate(g,{members:{a:observed('a',4),b:observed('b',0)}}).result,'TRUE');assert.deepEqual(evaluate(g,{members:{a:observed('a',4)}}).members.map(x=>x.member_id),['a']);
});
test('Boolean ALL cannot stand in for a set domain',()=>{
 const g=graph();g.expressions[1].op='ALL';g.expressions[1].operands=['state','state'];const c=compile(g);assert.ok(c.checks.rows.find(x=>x.id==='q').errors.some(x=>x.code==='EACH_QUANTITY_DOMAIN'));
});
test('A foreign result cannot become the member domain through proximity',()=>{
 const g=graph();g.expressions[0].operands=['broad'];assert.ok(compile(g).checks.rows.find(x=>x.id==='q').errors.some(x=>x.code==='EACH_QUANTITY_DOMAIN_OWNERSHIP'));
});
test('A foreign count_scope cannot authorize importing the other result',()=>{
 const g=graph();g.expressions[0].operands=['broad'];g.claims[2].quantity.count_scope='broad';const c=compile(g);assert.ok(c.checks.rows.find(x=>x.id==='q').errors.some(x=>x.code==='EACH_QUANTITY_DOMAIN_OWNERSHIP'));
});
test('ITEM(group) cannot masquerade as all members of its own group',()=>{
 const g=graph();g.claims[2].quantity.distribution.domain_id='item';const c=compile(g);assert.ok(c.checks.rows.find(x=>x.id==='q').errors.some(x=>x.code==='EACH_GROUP_ITEM_NOT_MEMBERS'));assert.equal(c.canonical.slots.O.status,'PARSER_COVERAGE_FAILURE');
});
test('Source EACH requirement cannot be marked complete using an aggregate',()=>{
 const g=graph();g.claims[2].quantity.distribution={mode:'AGGREGATE',domain_id:null};const c=compile(g);assert.equal(c.checks.coverage[0].status,'GAP');assert.equal(c.canonical.slots.O.status,'PARSER_COVERAGE_FAILURE');
});
test('Source restriction cannot be marked covered by a plain object role',()=>{
 const g=graph();g.coverage=[{sources,claim_ids:['result'],status:'EXPRESSED',affected_views:['B'],requirement_kind:'RESTRICTION'}];const c=compile(g);assert.equal(c.checks.coverage[0].status,'GAP');assert.equal(c.canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');
});
test('A restriction may cite an explicit prohibition through its own role binding',()=>{
 const g=graph();g.events[0].modality='FORBIDDEN';g.coverage=[{sources,claim_ids:['result'],status:'EXPRESSED',affected_views:['B'],requirement_kind:'RESTRICTION'}];
 const c=compile(g);assert.equal(c.checks.coverage[0].status,'EXPRESSED');assert.deepEqual(c.checks.coverage[0].constraint_paths[0].path,['result','create']);assert.equal(c.checks.coverage[0].constraint_paths[0].sources[0].quote,text);
});
test('A quoted or background prohibition is not a current restriction',()=>{
 for(const layer of ['QUOTED','BACKGROUND']){const g=graph();g.events[0].modality='FORBIDDEN';g.events[0].use='MENTION_ONLY';g.events[0].layer=layer;g.coverage=[{sources,claim_ids:['result'],status:'EXPRESSED',affected_views:['B'],requirement_kind:'RESTRICTION'}];assert.equal(compile(g).checks.coverage[0].status,'GAP');}
});
test('Dangling prohibition ownership cannot establish coverage',()=>{
 const g=graph();g.claims[0].event_id='missing';g.coverage=[{sources,claim_ids:['result'],status:'EXPRESSED',affected_views:['B'],requirement_kind:'RESTRICTION'}];assert.equal(compile(g).checks.coverage[0].status,'GAP');
});
test('Explicit temporal and completion constraints retain coverage without changing their semantics',()=>{
 for(const kind of ['TEMPORAL','COMPLETION']){const g=graph();g.claims.push({id:'transition',kind,event_id:kind==='TEMPORAL'?'create':null,entity_id:null,role:null,expression_id:'state',direction:kind==='TEMPORAL'?'ORDER':'SUFFICIENT',temporal:kind==='TEMPORAL'?'BEFORE':null,quantity:null,artifact_use:null,scope_id:kind==='TEMPORAL'?'create':'ROOT',requires:[],sources,note:''});if(kind==='TEMPORAL')g.events[0].constraint_ids.push('transition');g.coverage=[{sources,claim_ids:['transition'],status:'EXPRESSED',affected_views:['C'],requirement_kind:'RESTRICTION'}];const c=compile(g);assert.equal(c.checks.coverage[0].status,'EXPRESSED');assert.equal(c.checks.coverage[0].constraint_paths[0].relation,'TYPED_CONSTRAINT');assert.equal(c.ir.facts.find(x=>x.claim?.id==='transition').claim.kind,kind);}
});
test('Independent source check omissions retain exact evidence and affected slot',()=>{
 const g=graph(),a=audit(g);a.source_checks=[{sources,claim_ids:[],status:'GAP',affected_views:['B'],requirement_kind:'RESTRICTION',reason:'Missing local restriction'}];const w=encodeProposal(g),aw=encodeAudit(a,w);assert.deepEqual(decodeAudit(aw,w).value,a);
 const c=compile(g,a);assert.equal(c.checks.audit_coverage,'RECORDED_NOT_PROVEN');assert.equal(c.canonical.slots.B.status,'PARSER_COVERAGE_FAILURE');assert.equal(c.ir.gaps[0].sources[0].quote,text);
});
test('Wrong wide-set STATE binding is rejected despite all SUPPORT verdicts',()=>{
 const g=graph();g.expressions[2].state.args=['broad'];const c=compile(g),r=c.checks.rows.find(x=>x.id==='state');assert.equal(r.status,'REJECTED');assert.ok(r.errors.some(x=>x.code==='STATE_EVENT_ARGUMENT_OWNERSHIP'));
 assert.ok(technicalRevisionFeedback(c.checks,g).some(x=>x.code==='STATE_EVENT_ARGUMENT_OWNERSHIP'));
});
test('ROOT scope sentinel cannot replace a concrete event argument or member domain',()=>{
 const g=graph();g.expressions[2].state.args=['ROOT'];const c=compile(g),row=c.checks.rows.find(x=>x.id==='state');assert.equal(row.status,'REJECTED');assert.ok(row.errors.some(x=>x.code==='STATE_EVENT_ARGUMENT_OWNERSHIP'&&x.detail==='ROOT'));
});
test('A root-level state without an owning event retains its declared ROOT reference',()=>{
 const g=graph();g.expressions[2].state.event_id=null;g.expressions[2].state.args=['ROOT'];assert.equal(compile(g).checks.rows.find(x=>x.id==='state').status,'ACCEPTED');
});
test('A declared narrow member/subset remains structurally valid',()=>{
 const g=graph();g.expressions[2].state.args=['a'];assert.equal(compile(g).checks.rows.find(x=>x.id==='state').status,'ACCEPTED');
});
test('A narrower GROUP depends on the owning role that establishes its membership',()=>{
 const g=graph();g.entities.push({id:'narrow',label:'Selected files',type:'GROUP',members:['a'],mentions:sources,alternatives:[]});g.expressions[2].state.args=['narrow'];
 const c=compile(g),row=c.checks.rows.find(x=>x.id==='state');assert.equal(row.status,'ACCEPTED');assert.ok(row.structural_refs.includes('result'));
 const stateFact=c.ir.facts.find(f=>f.claim?.id==='q');assert.ok(stateFact);
 const a=audit(g);a.reviews.find(x=>x.subject_id==='result').verdict='UNCERTAIN';
 const pending=compile(g,a).checks.rows.find(x=>x.id==='state');assert.equal(pending.status,'UNRESOLVED');assert.ok(pending.uncertain.includes('REQUIRED_DEPENDENCY:result'));
});
test('An unrelated event argument cannot be reused as another round state',()=>{
 const g=graph();g.events.push({...g.events[0],id:'next',constraint_ids:[]});g.claims.push({...g.claims[0],id:'next-object',event_id:'next',entity_id:'outside',role:'OBJECT',scope_id:'next'});g.expressions[2].state.event_id='next';assert.equal(compile(g).checks.rows.find(x=>x.id==='state').status,'REJECTED');
});
test('Plan count is retained without inventing resource constraints',()=>{
 const g=graph();g.claims[2].quantity={...g.claims[2].quantity,target_id:'create',use:'WORK_PLAN',distribution:{mode:'AGGREGATE',domain_id:null}};g.coverage[0].requirement_kind='WORK_PLAN';
 const c=compile(g);assert.equal(c.checks.rows.find(x=>x.id==='q').status,'ACCEPTED');assert.equal(c.canonical.slots.R.status,'ABSENT');assert.ok(c.canonical.retained_nonprojected.some(x=>x.kind==='QUANTITY'&&x.claim.quantity.use==='WORK_PLAN'));assert.ok(c.chinese.includes('不是资源配额'));
});
function scoped(g=graph()){
 g.claims.push({id:'scope',kind:'SCOPE',event_id:'create',entity_id:null,role:null,expression_id:'members',direction:null,temporal:null,quantity:null,artifact_use:null,scope_id:'files',requires:[],sources,note:''});return g;
}
test('An event-owned scope without an INPUT_OBJECT does not invent external input',()=>{
 const unrelated=scoped();unrelated.claims.at(-1).scope_id='outside';const c=compile(unrelated),fact=c.ir.facts.find(f=>f.claim?.id==='scope');assert.equal(c.canonical.slots.I.entries.length,0);assert.deepEqual(fact.slots,[]);
 const g=scoped();g.claims.at(-1).scope_id='create';const taskScope=compile(g).ir.facts.find(f=>f.claim?.id==='scope');assert.deepEqual(taskScope.slots,['A']);
});
test('An explicit input relation is required and included in input-scope proof',()=>{
 const g=scoped();g.claims.at(-1).scope_id='create';g.claims.push({...g.claims[0],id:'input',role:'INPUT_OBJECT'});const c=compile(g),fact=c.ir.facts.find(f=>f.claim?.id==='scope');assert.deepEqual(fact.slots,['I']);assert.ok(fact.proof.provenance_refs.includes('input'));
});
test('A global union is supported by multiple distinct explicit input roles',()=>{
 const g=scoped();g.claims.at(-1).scope_id='ROOT';g.claims.at(-1).event_id=null;g.expressions.push({id:'input-a',op:'ITEM',operands:['a'],state:null,sources},{id:'input-b',op:'ITEM',operands:['b'],state:null,sources},{id:'input-union',op:'UNION',operands:['input-a','input-b'],state:null,sources});g.claims.at(-1).expression_id='input-union';g.claims.push({...g.claims[0],id:'input-first',role:'INPUT_OBJECT',entity_id:'a'},{...g.claims[0],id:'input-second',role:'INPUT_OBJECT',entity_id:'b'});const f=compile(g).ir.facts.find(f=>f.claim?.id==='scope');assert.deepEqual(f.slots,['I']);assert.ok(f.proof.provenance_refs.includes('input-first'));assert.ok(f.proof.provenance_refs.includes('input-second'));
});
test('A missing operand cannot be borrowed from an unrelated or non-input role',()=>{
 const g=scoped();g.claims.at(-1).scope_id='ROOT';g.claims.at(-1).event_id=null;g.expressions.push({id:'input-a',op:'ITEM',operands:['a'],state:null,sources},{id:'input-b',op:'ITEM',operands:['outside'],state:null,sources},{id:'input-union',op:'UNION',operands:['input-a','input-b'],state:null,sources});g.claims.at(-1).expression_id='input-union';g.claims.push({...g.claims[0],id:'input-first',role:'INPUT_OBJECT',entity_id:'a'});assert.deepEqual(compile(g).ir.facts.find(f=>f.claim?.id==='scope').slots,[]);
});
test('An output content scope stays O and a prohibited event scope stays B',()=>{
 const g=scoped(),out=compile(g).ir.facts.find(f=>f.claim?.id==='scope');assert.deepEqual(out.slots,['O']);
 g.events[0].modality='FORBIDDEN';g.claims.at(-1).scope_id='create';const forbidden=compile(g).ir.facts.find(f=>f.claim?.id==='scope');assert.deepEqual(forbidden.slots,['B']);
});
test('A declared Boolean qualifier is evaluated without pretending it is an input set or an observed permission',()=>{
 const g=scoped();g.claims.at(-1).scope_id='create';g.claims.at(-1).expression_id='state';const c=compile(g),calc=calculateBoundary(c.ir),range=calc.ranges[0];assert.equal(c.canonical.slots.I.entries.length,0);assert.equal(range.scope_fragment,'BOOLEAN_QUALIFIER');assert.equal(range.result,'UNKNOWN');assert.equal(range.structurally_expressed,true);assert.equal(range.execution_authorization,null);assert.ok(!calc.unsupported.some(x=>x.fact_id===range.fact_id));
});
test('A member set remains a finite calculable scope rather than collapsing to its group object',()=>{
 const c=calculateBoundary(compile(scoped()).ir),r=c.ranges.find(x=>x.expression_id==='members');assert.equal(r.result,'FINITE_SET');assert.deepEqual(r.members,['a','b']);assert.ok(r.domain_provenance_ids.includes('files'));assert.equal(r.execution_authorization,null);
});
test('An unenumerated scope stays UNKNOWN instead of inventing members',()=>{
 const g=scoped();g.entities.find(x=>x.id==='files').members=null;const r=calculateBoundary(compile(g).ir).ranges[0];assert.equal(r.result,'UNKNOWN');assert.equal(r.membership_complete,false);assert.equal(r.members,null);
});
test('An exception applies locally in scope calculation without widening sibling domains',()=>{
 const g=scoped();g.expressions.push({id:'excluded',op:'ITEM',operands:['b'],state:null,sources},{id:'difference',op:'EXCEPT',operands:['members','excluded'],state:null,sources});g.claims.at(-1).expression_id='difference';
 const r=calculateBoundary(compile(g).ir).ranges[0];assert.deepEqual(r.members,['a']);assert.equal(r.execution_authorization,null);
});
test('Calculation expands separate member intervals instead of aggregate equality',()=>{
 const c=compile(),calc=calculateBoundary(c.ir,{quantities:{q:{members:{a:observed('a',4),b:observed('b',5)}}}});assert.equal(calc.quantities[0].result,'TRUE');assert.deepEqual(calc.intervals.map(x=>x.subject).sort(),['a','b']);assert.equal(calc.business_decision,null);assert.equal(calc.execution_authorization,null);
});
test('Missing observations do not turn an explicit requirement into a parse omission',()=>{
 const c=compile(),calc=calculateBoundary(c.ir);assert.equal(c.canonical.slots.O.status,'RESOLVED');assert.equal(calc.quantities[0].result,'UNKNOWN');assert.equal(calc.quantities[0].structurally_expressed,true);assert.equal(c.ir.gaps.length,0);
});
test('Local binding status remains separate from constrained-event completeness',()=>{
 const g=graph(),a=audit(g);a.reviews.find(x=>x.subject_id==='q').verdict='UNCERTAIN';const c=compile(g,a),actor=c.canonical.slots.P.entries.find(x=>x.claim?.id==='actor');assert.equal(actor.binding_status,'ACCEPTED');assert.equal(actor.status,'UNRESOLVED');assert.equal(actor.binding_acceptance_is_not_event_acceptance,true);
});
test('Declared membership cycles do not get silently expanded or accepted',()=>{
 const g=graph();g.entities[1].members=['broad'];g.entities[5].members=['files'];assert.ok(compile(g).checks.rows.filter(x=>['files','broad'].includes(x.id)).every(x=>x.status==='REJECTED'));
});
