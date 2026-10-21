import fs from 'node:fs';import assert from 'node:assert/strict';import {OUT,read,write} from './common.mjs';
import {parse7Plus1,compileNative} from '../../../../research/7plus1-parser/v0.3-admin-short-019/engine.mjs';
import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
export function check(c,r){const g=r.compiler_v03,ir=g.boundary_ir,ns=new Map(g.semantic_nodes.map(n=>[n.node_id,n])),facts=ir.facts,live=g.relations.filter(r=>r.state==='RESOLVED');const failures=[],a=c.assertions;
 const guard=(message,fn)=>{try{fn();}catch(e){failures.push({message,actual_error:e.message});}};
 const has=(type,text)=>facts.some(f=>f.fact_type===type&&f.state==='RESOLVED'&&(ns.get(f.predicate_node_id)?.surface===text||f.object_node_ids.some(x=>ns.get(x)?.surface.includes(text))));
 guard('contract',()=>assert.equal(r.contract_gate_results.status,'PASS'));
 if(a.basis)guard('compound basis identity',()=>assert.ok(facts.some(f=>f.fact_type==='BASELINE'&&f.object_node_ids.some(x=>{const ref=g.nlp_signals.semantic_decoding.basis_reference_ir.references.find(q=>q.endpoint_node_id===x);return ref&&ns.get(ref.identifier_node_id)?.surface===a.basis[0]&&ns.get(ref.version_node_id)?.surface===a.basis[1]&&ref.relation_ids.some(id=>live.some(r=>r.relation_id===id&&r.relation_type==='CONJUNCTION'&&r.tail_node_id===ref.version_node_id));}))));
 if(a.no_basis)guard('observed version is not a basis',()=>assert.ok(!facts.some(f=>f.fact_type==='BASELINE')));
 if(a.resource)guard('resource target',()=>assert.ok(facts.some(f=>f.fact_type==='RESOURCE'&&ir.quantity_expr_nodes.some(q=>q.expr_id===f.quantity_expr_id&&q.metric===a.resource[0]&&q.upper_bound?.value===a.resource[1]&&q.upper_bound.inclusive===true&&q.target_node_ids.length===1&&q.target_node_ids.every(i=>a.resource[2]==='TASK'?ns.get(i).node_type==='DISCOURSE':ns.get(i).node_type==='EVENT'&&ns.get(i).metadata.sense==='retry')))));
 if(a.no_time_resource)guard('observation duration',()=>assert.ok(!facts.some(f=>f.fact_type==='RESOURCE'&&ir.quantity_expr_nodes.find(q=>q.expr_id===f.quantity_expr_id)?.metric==='TIME')));
 if(a.no_resource)guard('content threshold',()=>assert.ok(!facts.some(f=>f.fact_type==='RESOURCE')));
 if(a.flow)for(const identity of a.flow)guard('flow participant '+identity,()=>assert.ok(facts.some(f=>f.fact_type==='PARTICIPANT'&&f.participant_node_ids.some(x=>ns.get(x)?.surface===identity))));
 if(a.not_approver)guard('negative role',()=>assert.ok(!facts.some(f=>f.fact_type==='PARTICIPANT'&&f.participant_node_ids.some(x=>ns.get(x)?.surface===a.not_approver&&ns.get(x)?.metadata.participant_roles?.includes('APPROVER')))));
 if(a.recipient)guard('recipient',()=>assert.ok(facts.some(f=>f.fact_type==='PARTICIPANT'&&f.participant_node_ids.some(x=>ns.get(x)?.surface===a.recipient&&ns.get(x)?.metadata.participant_roles?.includes('RECIPIENT')))));
 if(a.modalities)for(const m of a.modalities)guard('modality '+m,()=>assert.ok(facts.some(f=>['ACTION','FORBID'].includes(f.fact_type)&&ns.get(f.predicate_node_id)?.metadata.modality===m)));
 if(a.not_required)guard('not-required retained as auxiliary, absent from A/B',()=>{assert.ok(!has('ACTION',a.not_required)&&!has('FORBID',a.not_required));assert.ok(g.semantic_nodes.some(n=>n.node_type==='EVENT'&&n.surface.includes(a.not_required)&&n.metadata.modality==='NOT_REQUIRED'&&!n.metadata.retired_by_admin_root));});
 if(a.stop===true)guard('stop',()=>assert.ok(facts.some(f=>f.fact_type==='STOP'&&f.condition_expr_id)));
 if(a.no_stop)guard('no quoted stop leakage',()=>assert.ok(!facts.some(f=>f.fact_type==='STOP')));
 if(a.no_completion)guard('no example completion leakage',()=>assert.ok(!facts.some(f=>f.fact_type==='COMPLETION')));
 if(a.completion)guard('completion operator and distinct typed operands',()=>assert.ok(facts.some(f=>f.fact_type==='COMPLETION'&&ir.condition_expr_nodes.some(q=>q.expr_id===f.condition_expr_id&&q.op===a.completion&&q.operand_expr_ids.length===2&&new Set(q.operand_expr_ids).size===2))));
 if(a.stop==='AND')guard('stop operator and domain membership',()=>assert.ok(facts.some(f=>f.fact_type==='STOP'&&ir.condition_expr_nodes.some(q=>q.expr_id===f.condition_expr_id&&q.op==='AND'&&q.operand_expr_ids.length===2&&q.operand_expr_ids.every(i=>ns.get(ir.condition_expr_nodes.find(x=>x.expr_id===i).state_node_id).metadata.object_node_ids.length===1)))));
 if(a.content)guard('output-content owner',()=>assert.ok([].concat(a.content).every(t=>g.nlp_signals.semantic_decoding.output_content_ir.requirements.some(x=>x.content_text.includes(t)&&x.owner_output_ids.length===1))));
 if(a.conditional_content)guard('complementary output-content branches',()=>{const rs=g.nlp_signals.semantic_decoding.output_content_ir.requirements;assert.equal(rs.length,2);assert.ok(rs.every(r=>r.owner_output_ids.length===1&&r.condition_expr_id));const q=ir.condition_expr_nodes.find(q=>q.expr_id===rs[1].condition_expr_id);assert.equal(q.op,'NOT');assert.equal(q.operand_expr_id,rs[0].condition_expr_id);assert.ok(!facts.some(f=>f.fact_type==='ACTION'&&/列出|写明/u.test(ns.get(f.predicate_node_id)?.surface??'')));});
 if(a.forbid)guard('forbid',()=>assert.ok(has('FORBID',a.forbid)));
 if(a.forbid_object)guard('exact forbidden object',()=>assert.ok(facts.some(f=>['FORBID','RESTRICT'].includes(f.fact_type)&&f.object_node_ids.some(x=>ns.get(x)?.surface===a.forbid_object))));
 if(a.not_input)guard('output not input',()=>assert.ok(!has('TASK_OBJECT',a.not_input)));
 if(a.exclude)guard('excluded scope evidence',()=>assert.ok(facts.some(f=>['FORBID','RESTRICT'].includes(f.fact_type)&&f.object_node_ids.some(x=>ns.get(x)?.surface.includes(a.exclude)))||g.nlp_signals.semantic_decoding.scope_restriction_ir?.some(x=>x.excluded_surface===a.exclude)));
 if(a.all)guard('universal domain',()=>assert.ok(ir.set_expr_nodes.some(x=>x.kind==='ALL')||g.nlp_signals.semantic_decoding.qualified_domain_ir.domains.some(x=>x.quantifier==='ALL')));
 if(a.no_heading_action)guard('heading is structural',()=>assert.ok(!facts.some(f=>f.fact_type==='ACTION'&&/任务|Task|执行要求/u.test(ns.get(f.predicate_node_id)?.surface??''))));
 if(a.no_delete)guard('background delete absent',()=>assert.ok(!has('ACTION','删除')));
 if(a.no_modify)guard('example modify absent',()=>assert.ok(!has('ACTION','修改')));
 if(a.unresolved)guard('genuine ambiguity retained',()=>assert.ok(g.unresolved.length>0));
 return {id:c.id,mechanism:c.mechanism,kind:c.kind,status:failures.length?'FAIL':'PASS',failures,unresolved:g.unresolved.length};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/run-controls.mjs')){
const rev=process.argv[2],cache=process.argv[3]==='--cached',out=OUT+'controls-attempts/'+rev+'/';if(!rev||fs.existsSync(out))throw Error('Unique revision required');
try{const rows=[];for(const c of read(OUT+'INDEPENDENT-CONTROLS.json').controls){const prior=OUT+'controls-attempts/fresh-r01/'+c.id+'/trace.json';const r=cache?compileNative(sourceDocument(c.source),structuredClone(read(prior).compiler_v03.nlp_signals)):await parse7Plus1(c.source);const v=check(c,r);write(out+c.id+'/trace.json',r);rows.push(v);console.log(c.id+' '+v.status+' '+v.failures.map(x=>x.message).join(','));}write(out+'RESULTS.json',{passed:rows.filter(x=>x.status==='PASS').length,failed:rows.filter(x=>x.status==='FAIL').length,skipped:0,rows});}finally{closeNlp();}
}
