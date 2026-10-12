// Read-only diagnosis of saved output and installed source. No model/service mutation.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
const product=path.resolve('.boundx/products/0.1.0-candidate.031-r1.2-ui.52');
const input='docs/reports/7plus1/USER-STANDARD-ui52-001aabad-r01/trace.json';
const out='docs/reports/7plus1/STANDARD-JOINT-ROOT-CAUSE-r01';
const trace=JSON.parse(fs.readFileSync(input)),c=trace.boundary_calculations,m=c.mathematical_results;
const {evaluateBooleanAssignment}=await import(pathToFileURL(path.join(product,'src/bxp/boolean-solver.mjs')));
const vars=x=>typeof x==='boolean'?[]:x.var?[x.var]:x.not?vars(x.not):Object.values(x)[0].flatMap(vars);
const witness=c.boolean.witness;
const formulaChecks=c.boolean.formulas.map(f=>{const variables=[...new Set(vars(f.formula))];return {fact_id:f.fact_id,rule:f.rule,satisfied:evaluateBooleanAssignment(variables,f.formula,Object.fromEntries(variables.map(id=>[id,witness[id]])))};});
const atoms=c.boolean.atoms;
const eventStatePairs=atoms.filter(x=>x.meaning.kind==='STATE'&&x.meaning.event_id).map(state=>{const event=atoms.find(x=>x.meaning.kind==='EVENT_EXECUTED'&&x.meaning.event_id===state.meaning.event_id);return {event_id:state.meaning.event_id,predicate:state.meaning.predicate,event_variable:event?.id??null,state_variable:state.id,event_value:event?witness[event.id]:null,state_value:witness[state.id],same_variable:event?.id===state.id,incompatible_completion_state_candidate:event&&witness[event.id]===true&&witness[state.id]===false};});
const completion=atoms.filter(x=>x.meaning.kind==='TASK_COMPLETE').map(x=>({variable:x.id,value:witness[x.id]}));
const sources=['research/7plus1-parser/llm-first-028/calculation-results.mjs','research/7plus1-parser/llm-first-028/calculus.mjs','research/7plus1-parser/llm-first-028/artifacts.mjs','research/7plus1-parser/llm-first-028/contracts/proposal.schema.json','src/bxp/boolean-solver.mjs'].map(file=>{const bytes=fs.readFileSync(path.join(product,file));return {path:file,sha256:createHash('sha256').update(bytes).digest('hex')};});
const boundary=new Map(Object.values(m.boundary_atoms).flat().map(a=>[a.fact_id,a]));
const frontier=m.unknown_frontier.map(x=>({reason:x.reason,left:boundary.get(x.left_atom)?.operation,right:boundary.get(x.right_atom)?.operation,shared_objects:x.overlap}));
const result={product_version:'0.1.0-candidate.031-r1.2-ui.52',source_sha256:trace.source.sha256,input_trace:input,model_calls:0,runtime_changes:false,
 installed_sources:sources,joint_result:m.joint_cross_domain_execution_feasibility,all_current_boolean_formulas_satisfied:formulaChecks.every(x=>x.satisfied),formula_count:formulaChecks.length,formulaChecks,eventStatePairs,completion,
 separately_evaluated_domains:{intervals:c.intervals.length,explicit_graph_edges:c.dependency.edges.length,availability_relations:c.availability.length,availability_without_observation:c.availability.filter(x=>x.result==='UNKNOWN').length},frontier,
 limitations:'Event occurrence and arbitrary state predicates are not generally equivalent. The demonstration identifies unlinked referenced states; a repair requires reviewed phase/result semantics, not blanket EVENT↔STATE inference.'};
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/ROOT-CAUSE-EVIDENCE.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({joint_result:result.joint_result,formulas_satisfied:result.all_current_boolean_formulas_satisfied,formula_count:result.formula_count,eventStatePairs,completion,domains:result.separately_evaluated_domains,frontier},null,2));
