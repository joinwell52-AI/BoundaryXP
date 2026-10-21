import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]??'.boundx/local-condition-repair-r01/work'),round=process.argv[3]??'work';
const out=path.resolve('docs/reports/7plus1/LOCAL-CONDITION-REPAIR-r01','variants-'+round);if(fs.existsSync(out))throw Error('FIRST_RESULT_EXISTS');fs.mkdirSync(out,{recursive:true});
const load=f=>import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028',f)));
const {prepareSource}=await load('source.mjs'),{technicalValidate}=await load('validate.mjs'),{compileBoundary}=await load('compile.mjs'),{calculateBoundary,renderCalculations}=await load('calculus.mjs');
const original=JSON.parse(fs.readFileSync('docs/testing/7plus1/MANUAL-TEST-001-standard-r01/actual/ui36/trace.json'));
const definitions=JSON.parse(fs.readFileSync('docs/testing/7plus1/MANUAL-TEST-001-local-conditions-r01/INDEX.json')).definitions;
const save=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const clean=x=>{if(Array.isArray(x))return x.map(clean);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).filter(([k])=>!['sources','mentions','reason','note'].includes(k)).map(([k,v])=>[k,clean(v)]));return x;};
const replaceQuotes=(x,d)=>{if(Array.isArray(x))return x.map(y=>replaceQuotes(y,d));if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,k==='quote'&&d.from?v.replace(d.from,d.to):replaceQuotes(v,d)]));return x;};
const results=[];
for(const d of definitions){
 const folder=path.join(out,d.id);fs.mkdirSync(folder);const source=prepareSource(fs.readFileSync('docs/testing/7plus1/MANUAL-TEST-001-local-conditions-r01/'+d.id+'/source.txt'));
 assert.equal(source.sha256,d.source_sha256);const proposal=replaceQuotes(structuredClone(original.proposal),d);
 if(d.field){const [collection,id,...fields]=d.field.split('.');const node=proposal[collection].find(x=>x.id===id);let p=node;for(const f of fields.slice(0,-1))p=p[f];if(fields.length)p[fields.at(-1)]=structuredClone(d.value);else Object.assign(node,d.value);}
 // This is an explicitly labelled HUMAN CONTRACT FIXTURE, not a reused model
 // audit or evidence that an LLM parsed the changed source correctly.
 const audit=replaceQuotes(structuredClone(original.audit),d);for(const r of audit.reviews)r.reason='Human-authored controlled compiler fixture; not a model review';for(const r of audit.source_checks)r.reason='Human-authored controlled compiler fixture; not a model source check';
 const technical=technicalValidate(source,proposal,audit),compiled=compileBoundary(source,proposal,audit,technical);
 assert.ok(technical.schemas.proposal.ok&&technical.schemas.audit.ok);assert.equal(technical.rows.filter(x=>x.status!=='ACCEPTED').length,0,d.id+': technical');
 assert.equal(compiled.ir.gaps.length,0);assert.deepEqual(Object.fromEntries(Object.entries(compiled.canonical.slots).map(([k,v])=>[k,v.status])),Object.fromEntries(Object.entries(original.canonical.slots).map(([k,v])=>[k,v.status])));
 for(const collection of ['entities','events','claims','expressions'])for(const item of proposal[collection]){
  const ref=original.proposal[collection].find(x=>x.id===item.id);if(d.field?.startsWith(collection+'.'+item.id))continue;assert.deepEqual(clean(item),clean(ref),d.id+' altered unrelated '+item.id);
 }
 const stateValues=(D,O,Q,S)=>({x_dev_submitted:D,x_ops_submitted:O,x_review_pass:Q,x_summary_delivered:S});
 const condition=compiled.ir.facts.find(x=>x.kind==='COMPLETION');
 const observations=[
  {id:'ALL_TRUE_COMPLETE_TRUE',states:stateValues(true,true,true,true),outcome:true,expected:'TRUE'},
  {id:'ONE_TRUE_COMPLETE_FALSE',states:stateValues(true,false,false,false),outcome:false,expected:d.id==='V03'?'FALSE':'TRUE'},
  {id:'CRITERION_FALSE_COMPLETE_TRUE',states:stateValues(false,false,false,false),outcome:true,expected:['V01','V02'].includes(d.id)?'FALSE':'TRUE'},
  {id:'ALL_TRUE_COMPLETE_FALSE',states:stateValues(true,true,true,true),outcome:false,expected:d.id==='V01'?'TRUE':'FALSE'},
  {id:'MISSING_STATES',states:{},outcome:null,expected:'UNKNOWN'}
 ];
 for(const obs of observations){const input={states:obs.states,...(obs.outcome===null?{}:{outcomes:{[condition.claim.id]:{target_id:'ROOT',kind:'TASK_COMPLETE',known:true,value:obs.outcome}}})};const r=calculateBoundary(compiled.ir,input);const assessed=r.conditions.find(x=>x.claim_id===condition.claim.id).assessment;assert.equal(assessed.logical_result,obs.expected,d.id+'/'+obs.id);assert.equal(r.business_decision,null);assert.equal(r.execution_authorization,null);save(path.join(folder,obs.id+'.json'),{synthetic:true,input,expected:obs.expected,actual:assessed});}
 const q=compiled.ir.facts.find(x=>x.kind==='QUANTITY').claim;
 const numbers=d.id==='V05'?[[20,'TRUE'],[21,'FALSE']]:d.id==='V04'?[[29,'TRUE'],[30,'FALSE']]:[[30,'TRUE'],[31,'FALSE']];
 for(const [value,expected]of numbers){const input={quantities:{[q.id]:{value,unit:q.quantity.unit,target_id:q.quantity.target_id,count_scope:q.quantity.count_scope}}};const r=calculateBoundary(compiled.ir,input);assert.equal(r.quantities.find(x=>x.claim_id===q.id).result,expected);save(path.join(folder,'TIME-'+value+'.json'),{synthetic:true,input,expected,actual:r.quantities});}
 const stopClaim=compiled.ir.facts.find(x=>x.claim?.id==='c_stop_condition').claim;const rawFinding=true;
 const input={states:{x_high_found:d.id==='V06'?!rawFinding:rawFinding},outcomes:{[stopClaim.id]:{target_id:stopClaim.event_id,kind:'EVENT_EXECUTED',known:true,value:false}}};
 const stopResult=calculateBoundary(compiled.ir,input).conditions.find(x=>x.claim_id===stopClaim.id).assessment;assert.equal(stopResult.logical_result,d.id==='V06'?'TRUE':'FALSE');save(path.join(folder,'STOP-LOCAL-NEGATION.json'),{synthetic:true,underlying_finding:rawFinding,input,actual:stopResult});
 const calculation=calculateBoundary(compiled.ir);assert.equal(calculation.status,'CALCULATED_FRAGMENT');assert.equal(calculation.unsupported.length,0);
 save(path.join(folder,'trace.json'),{execution_mode:'HUMAN_AUTHORED_CONTROLLED_COMPILER_FIXTURE',not_llm_output:true,source,proposal,audit,technical,...compiled,boundary_calculations:calculation,real_model_calls:0});
 fs.writeFileSync(path.join(folder,'7plus1.zh.md'),compiled.chinese+renderCalculations(calculation),'utf8');
 results.push({id:d.id,source_sha256:source.sha256,technical_rows:technical.rows.length,all_slots_preserved:true,unrelated_semantic_fields_unchanged:true,observation_checks:observations.length+numbers.length+1,pass:true,model_validation:'NOT_RUN_FOR_THIS_PROGRAM_FIXTURE'});
}
save(path.join(out,'SUMMARY.json'),{results,texts:results.length,observation_checks:results.reduce((n,x)=>n+x.observation_checks,0),program_fixture_pass:true,real_model_calls:0,not_a_new_llm_accuracy_claim:true});console.log(JSON.stringify({texts:results.length,observation_checks:results.reduce((n,x)=>n+x.observation_checks,0),pass:true,real_model_calls:0}));
