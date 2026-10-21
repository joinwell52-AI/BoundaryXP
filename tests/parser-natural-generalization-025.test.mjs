import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import {randomUUID} from 'node:crypto';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {analyze,closeNlp} from '../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
import {compileNative} from '../research/7plus1-parser/v0.3-natural-generalization-025/engine.mjs';
const parse=async text=>{const d=sourceDocument(text),r=compileNative(d,await analyze(d)),root='docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG/mutation-raw';fs.mkdirSync(root,{recursive:true});fs.writeFileSync(root+'/'+randomUUID()+'.json',JSON.stringify(r,null,2)+'\n',{flag:'wx'});return r;};
test.after(async()=>closeNlp());
for(const object of ['叶轮状态','阀门状态'])test('025 task noun is a governor rather than a participant '+object,async()=>{
 const r=await parse(`本次任务要求比较${object}并形成 valve-review.md。由 LEAD 组织。`),c=r.compiler_v03;
 assert.ok(!c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('本次任务')));assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('LEAD')));assert.equal(r.contract_gate_results.status,'PASS');
});
test('025 material adjunct stops before production',async()=>{
 const r=await parse('本次任务要求基于 fatigue.json 与 vibration.json 汇总失败情况并形成 rotor-summary.md。由 LEAD 组织，不重新运行测试。'),c=r.compiler_v03;
 for(const file of ['fatigue.json','vibration.json'])assert.ok(c.canonical_7plus1.I.entries.some(e=>e.display_value.includes(file)));assert.ok(!c.canonical_7plus1.I.entries.some(e=>e.display_value.includes('rotor-summary.md')));assert.equal(r.contract_gate_results.status,'PASS');
});
test('025 omitted support complement uses unique governed input',async()=>{
 const r=await parse('本任务由 LEAD 组织。未经负责人批准不得读取 bearing-snapshot.csv；批准后方可进行只读检查并形成 bearing-review.md。'),c=r.compiler_v03,nm=i=>c.semantic_nodes.find(n=>n.node_id===i);
 const action=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm(f.predicate_node_id)?.surface==='检查');assert.ok(action?.object_node_ids.some(i=>nm(i)?.surface==='bearing-snapshot.csv'));assert.equal(action.state,'RESOLVED');assert.ok(action.condition_expr_id);assert.equal(r.contract_gate_results.status,'PASS');
});
test('025 multiple support-complement inputs cannot resolve by proximity',async()=>{
 const r=await parse('本任务由 LEAD 组织。未经负责人批准不得读取 bearing-a.csv 与 bearing-b.csv；批准后方可进行只读检查并形成 bearing-review.md。'),c=r.compiler_v03,nm=i=>c.semantic_nodes.find(n=>n.node_id===i);
 const action=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm(f.predicate_node_id)?.surface==='检查');assert.equal(action?.state,'UNRESOLVED');assert.ok(c.unresolved.some(u=>u.kind==='UNRESOLVED_COREFERENCE'));assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&f.state==='RESOLVED'&&f.object_node_ids.some(i=>nm(i)?.surface==='检查')));assert.equal(r.contract_gate_results.status,'PASS');
});
for(const [a,b] of [['wheel-a.csv','wheel-b.csv'],['valve-a.csv','valve-b.csv']])test('025 governed quoted command preserves competing input domain '+a,async()=>{
 const r=await parse(`请 LEAD 组织读取 ${a} 与 ${b}，随后要求“复核该报告并提交”。“该报告”没有唯一指向，应保持未决。`),c=r.compiler_v03,nm=i=>c.semantic_nodes.find(n=>n.node_id===i);
 const unknown=c.semantic_nodes.find(n=>n.node_type==='UNKNOWN_REFERENT'&&n.surface==='该报告'&&n.metadata.resolution?.candidate_node_ids.length===2);assert.ok(unknown);
 assert.deepEqual(new Set(unknown.metadata.resolution.candidate_node_ids.map(i=>nm(i).surface)),new Set([a,b]));assert.deepEqual(unknown.metadata.resolution.selected_node_ids,[]);
 for(const word of ['复核','提交'])assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&nm(f.predicate_node_id)?.surface===word&&f.state==='UNRESOLVED'));
 assert.equal(r.contract_gate_results.status,'PASS');assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&/要求|保持|决/u.test(nm(f.predicate_node_id)?.surface??'')));
});
test('025 temporal ambiguity does not swallow explicit produced artifact',async()=>{
 const r=await parse('请 LEAD 组织读取 west.csv 与 east.csv，并检查“原始记录”后形成 bearing-summary.md。原文没有说明“原始记录”具体指哪一份文件；不得自行猜测。'),c=r.compiler_v03;
 assert.ok(c.canonical_7plus1.O.entries.some(e=>e.display_value.includes('bearing-summary.md')));assert.ok(!c.canonical_7plus1.I.entries.some(e=>e.display_value.includes('bearing-summary.md')));assert.equal(r.contract_gate_results.status,'PASS');
 assert.ok(c.semantic_nodes.some(n=>n.node_type==='UNKNOWN_REFERENT'&&n.surface==='原始记录'&&n.metadata.resolution?.candidate_node_ids.length===2));
});
for(const n of [3,5])test('025 minimum retry is prerequisite rather than consequent budget '+n,async()=>{
 const r=await parse(`本次任务要求在试验代理上完成探测并形成 shaft-summary.md，至少重试 ${n} 次后方可形成最终结果。不得修改代理配置。`),c=r.compiler_v03,nm=i=>c.semantic_nodes.find(n=>n.node_id===i);
 assert.equal(c.unresolved.length,0);assert.equal(r.contract_gate_results.status,'PASS');const q=c.boundary_ir.quantity_expr_nodes.find(q=>q.lower_bound?.value===n&&q.target_node_ids.some(i=>nm(i)?.metadata.sense==='retry'));assert.ok(q);assert.ok(!q.upper_bound);
 assert.ok(c.boundary_ir.facts.filter(f=>['ACTION','DELIVERABLE'].includes(f.fact_type)&&nm(f.predicate_node_id)?.metadata.sense==='generate').every(f=>f.condition_expr_id&&!f.quantity_expr_id));
});
test('025 source-stated ANY ALL uncertainty blocks final approval condition',async()=>{
 const r=await parse('本任务要求只有赵明或吴敏批准后才允许读取 ridge.csv 并形成 ridge-review.md，但没有说明是任一人批准即可还是两人共同批准，应保持审批条件未决。'),c=r.compiler_v03;
 assert.ok(c.unresolved.some(u=>u.kind==='UNRESOLVED_SCOPE'));assert.ok(c.candidate_semantic_graph.candidate_expressions.filter(e=>e.candidate_state==='COMPETING').length>=2);
 assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('赵明')&&e.display_value.includes('APPROVER')));assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('吴敏')&&e.display_value.includes('APPROVER')));
 assert.ok(c.boundary_ir.facts.filter(f=>['ACTION','DELIVERABLE'].includes(f.fact_type)).every(f=>f.state==='UNRESOLVED'&&f.condition_expr_id));assert.equal(r.contract_gate_results.status,'PASS');
});
for(const [a,b]of [['rotor-a.json','rotor-b.json'],['shaft-a.csv','shaft-b.csv']])test('025 material adjunct independent of patient '+a,async()=>{const r=await parse(`本任务要求基于 ${a} 与 ${b} 汇总异常情况并形成 material-audit.md。`),c=r.compiler_v03;for(const file of [a,b])assert.ok(c.canonical_7plus1.I.entries.some(e=>e.display_value.includes(file)));assert.equal(r.contract_gate_results.status,'PASS');});
test('025 prepositional scope declaration uses valid state relation',async()=>{const r=await parse('检查叶轮并形成 rotor-review.md。仅基于现有快照，不连接真实主机。'),c=r.compiler_v03;assert.equal(r.contract_gate_results.status,'PASS');assert.ok(c.semantic_nodes.some(n=>n.metadata.sense==='SOURCE_MATERIAL_RESTRICTION'));assert.equal(c.unresolved.length,0);});
for(const name of ['OWNER','RECEIVER'])test('025 exclusive recipient role '+name,async()=>{const r=await parse(`形成 seal-review.md。${name} 仅作为最终接收方。`),c=r.compiler_v03;assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes(name)&&e.display_value.includes('RECIPIENT')));assert.ok(c.nlp_signals.semantic_decoding.negative_role_declarations.some(x=>x.negative_roles.includes('PERFORMER')));assert.equal(c.unresolved.length,0);});
test('025 prohibited operation preserves operation domain',async()=>{const r=await parse('生成 release-manual.md。本任务不得实际部署。'),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));const f=c.boundary_ir.facts.find(x=>x.fact_type==='FORBID');assert.equal(f?.state,'RESOLVED');assert.ok(f.object_node_ids.some(i=>nm.get(i)?.metadata.argument_role==='PROHIBITED_OPERATION_DOMAIN'));assert.ok(!f.object_node_ids.some(i=>nm.get(i)?.surface==='release-manual.md'));});
for(const [noun,file]of [['喷口压力','nozzle-analysis.md'],['轴承寿命','bearing-overview.md']])test('025 requirement governor '+noun,async()=>{
 const r=await parse(`本任务要求核查${noun}并形成 ${file}。`),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.equal(r.candidate_graph_gate_results.status,'PASS');assert.equal(c.canonical_7plus1.O.status,'RESOLVED');
 const action=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='核查');assert.equal(action?.state,'RESOLVED');assert.ok(nm.get(action.predicate_node_id).metadata.modality_owner);
 assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='要求'));
});
for(const role of ['LEAD','COORDINATOR'])test('025 standalone organization '+role,async()=>{
 const r=await parse(`本任务由 ${role} 负责组织。检查叶轮状态并形成 impeller-audit.md。`),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes(role)));
 assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&['负责','组织'].includes(nm.get(f.predicate_node_id)?.surface)));
 assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='TASK_OBJECT'&&f.object_node_ids.some(i=>/^本任务$/u.test(nm.get(i)?.surface))));
});
test('025 output-content requirement is not current execution',async()=>{
 const r=await parse('生成 operator-note.md。文档必须包含“要求删除生产记录”。不得实际删除记录。'),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='删除'));
 assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='FORBID'&&f.state==='RESOLVED'));
});
test('025 explicit withdrawn obligation cannot become positive action',async()=>{
 const r=await parse('本任务不要求修复密封缺陷。不得修改设备。'),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='修复'));
 assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='AUX_CONDITION'&&nm.get(f.predicate_node_id)?.metadata.modality==='NOT_REQUIRED'));
});
for(const [actor,artifact] of [['Rita','sensor.bin'],['Oscar','codec.bin']])test('025 negative passive versus permission '+actor,async()=>{
 for(const [determiner,expected] of [['a','PERMITTED'],['no','FORBIDDEN']]){
  const r=await parse(`${actor} must organize an inspection of sample.csv. ${determiner} different model may be loaded.`),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
  const result=c.boundary_ir.facts.find(f=>nm.get(f.predicate_node_id)?.surface==='loaded');assert.equal(result?.state,'RESOLVED');assert.equal(nm.get(result.predicate_node_id).metadata.modality,expected);assert.equal(result.fact_type,expected==='FORBIDDEN'?'FORBID':'ACTION');
 }
});
for(const name of ['Owen','Tara'])test('025 negative role needs no positive role grant '+name,async()=>{
 const r=await parse(`${name} is not an approver.`),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 const declaration=c.nlp_signals.semantic_decoding.negative_role_declarations.find(x=>nm.get(x.subject_node_id)?.surface===name);assert.ok(declaration?.negative_roles.includes('APPROVER'));assert.equal(c.unresolved.length,0);
 assert.ok(!c.canonical_7plus1.P.entries.some(e=>e.display_value.includes(name)&&e.display_value.includes('APPROVER')));assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='FORBID'));
});
for(const noun of ['索引','词典'])test('025 explicit plain task negation '+noun,async()=>{
 const r=await parse(`本任务不重建${noun}。不重新计算向量。`),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='FORBID'&&f.object_node_ids.some(i=>nm.get(i)?.surface===noun)));assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='FORBID'&&nm.get(f.predicate_node_id)?.surface==='计算'));assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'));
});
test('025 focus clause is a source-owned review qualifier',async()=>{
 const r=await parse('请 LEAD 对 inlet.log 进行只读排查，关注最近 12 分钟重复告警，并形成 inlet-audit.md。'),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.ok(c.semantic_nodes.some(n=>n.metadata.sense==='REVIEW_FOCUS_QUALIFIER'&&n.surface.includes('12 分钟')));assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='关注'));
 assert.equal(c.canonical_7plus1.O.status,'RESOLVED');assert.equal(r.candidate_graph_gate_results.status,'PASS');
});
for(const [source,result] of [['sample-a.csv','inspection-a.md'],['sample-b.yaml','inspection-b.md']])test('025 source-owned nominal patient '+source,async()=>{
 const r=await parse(`请 LEAD 组织完成 ${source} 的状态检查并形成 ${result}。`),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='检查'&&f.object_node_ids.some(i=>nm.get(i)?.surface.includes(source))));assert.ok(c.canonical_7plus1.I.entries.some(e=>e.display_value.includes(source)));assert.equal(c.unresolved.length,0);
});
for(const noun of ['传感器','轴承'])test('025 nominal check retains local environment '+noun,async()=>{
 const r=await parse(`本任务由 LEAD 组织在试验室完成${noun}核查并形成 inspection.md。`),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 const a=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='核查');assert.ok(a?.object_node_ids.some(i=>nm.get(i)?.surface===noun));assert.ok(c.canonical_7plus1.I.entries.some(e=>e.display_value.includes('试验室')));assert.ok(!a.object_node_ids.some(i=>nm.get(i)?.surface==='本任务'));
});
test('025 final delivery is a directive with fronted content',async()=>{
 const r=await parse('检查 receipts.csv，最终交付 receipts-review.md。缺项应记录。'),c=r.compiler_v03;
 assert.equal(c.canonical_7plus1.O.status,'RESOLVED');assert.ok(c.nlp_signals.semantic_decoding.output_content_ir.requirements.some(x=>x.content_text==='缺项应记录'&&x.ownership_status==='UNIQUE_OUTPUT'));assert.equal(c.unresolved.length,0);
});
test('025 content and source disclaimer keep their output owner',async()=>{
 const r=await parse('形成 maintenance-guide.md，其中必须写明“删除临时记录前先确认备份”。该文字不构成本任务的删除授权；不得实际删除记录。'),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.ok(c.nlp_signals.semantic_decoding.output_content_ir.requirements.some(x=>x.content_text.includes('确认备份')&&x.ownership_status==='UNIQUE_OUTPUT'));assert.ok(c.semantic_nodes.some(n=>n.metadata.sense==='SOURCE_ROLE_CLARIFICATION'));assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='删除'));assert.equal(c.unresolved.length,0);
});
test('025 two content owners are not forced to one',async()=>{
 const r=await parse('生成 east.md 并生成 west.md。报告必须列出风险。'),c=r.compiler_v03;
 assert.ok(c.unresolved.some(x=>x.kind==='UNRESOLVED_SCOPE'));assert.ok(c.nlp_signals.semantic_decoding.output_content_ir.requirements.some(x=>x.ownership_status==='AMBIGUOUS_OUTPUT'));
});
for(const noun of ['离线设备','测试设备'])test('025 explicit negative scope '+noun,async()=>{
 const r=await parse(`检查 device-list.csv 并形成 device-review.md。${noun}不属于此次核对范围。`),c=r.compiler_v03;
 assert.ok(c.canonical_7plus1.B.entries.some(e=>e.state==='RESOLVED'&&e.display_value.includes(noun)));assert.equal(c.unresolved.length,0);
});
test('025 omitted restricted read uses one structural typed domain',async()=>{
 const r=await parse('核对 manifest.yaml 中的参数并形成 manifest-review.md。只允许读取，不得修改 manifest.yaml。'),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='RESTRICT'&&nm.get(f.predicate_node_id)?.surface==='读取'&&f.object_node_ids.some(i=>nm.get(i)?.surface.includes('manifest.yaml'))));assert.equal(c.unresolved.length,0);
});
for(const [first,second] of [['east.yaml','west.txt'],['sensor.json','ledger.md']])test('025 passive operands retain explicit file domain '+first,async()=>{
 const r=await parse(`LEAD must organize the task so that ${first} is read, ${second} may be inspected, and summary.md is produced. Neither file may be modified.`),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 for(const file of [first,second]){assert.ok(c.canonical_7plus1.I.entries.some(e=>e.display_value.includes(file)));assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='FORBID'&&f.state==='RESOLVED'&&f.object_node_ids.some(i=>nm.get(i)?.surface===file)));}
 const a=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='read');assert.equal(a?.state,'RESOLVED');assert.deepEqual(a.object_node_ids.map(i=>nm.get(i)?.surface),[first]);assert.equal(c.canonical_7plus1.O.status,'RESOLVED');assert.equal(r.contract_gate_results.status,'PASS');
});
for(const [noun,count] of [['轴承',7],['传感器',3]])test('025 conditional retry keeps guard and exact budget '+noun,async()=>{
 const r=await parse(`本任务由 LEAD 组织在试验室完成${noun}核查并形成 analysis.md。单次核查失败时最多重试 ${count} 次，不得修改参数。`),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 const retry=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='重试');assert.equal(retry?.state,'RESOLVED');assert.ok(retry.condition_expr_id);assert.ok(c.boundary_ir.quantity_expr_nodes.some(q=>q.upper_bound?.value===count));assert.equal(r.contract_gate_results.status,'PASS');
});
for(const count of [7,9])test('025 count acceptance preserves Boolean completion '+count,async()=>{
 const r=await parse(`读取 audit.csv 并形成 audit.md。至少 ${count} 个完成复核且 audit.md 已生成时任务完成。`),c=r.compiler_v03,done=c.boundary_ir.facts.find(f=>f.fact_type==='COMPLETION');assert.equal(done?.state,'RESOLVED');assert.equal(c.boundary_ir.condition_expr_nodes.find(e=>e.expr_id===done.condition_expr_id)?.op,'AND');assert.ok(c.boundary_ir.quantity_expr_nodes.some(q=>q.lower_bound?.value===count&&q.unit==='个'));assert.equal(r.contract_gate_results.status,'PASS');
});
for(const reversed of [false,true])test('025 independent task resources survive source order '+reversed,async()=>{
 const clauses=['任务须在 17 分钟内完成','内存使用不得超过 6 GB'];if(reversed)clauses.reverse();const r=await parse('检查 pump.json 并形成 pump.md。'+clauses.join('，')+'。'),c=r.compiler_v03,qs=c.boundary_ir.quantity_expr_nodes,rs=c.boundary_ir.facts.filter(f=>f.fact_type==='RESOURCE');for(const [value,unit]of [[17,'分钟'],[6,'GB']])assert.ok(rs.some(f=>qs.some(q=>q.expr_id===f.quantity_expr_id&&q.upper_bound?.value===value&&q.unit===unit)));assert.equal(r.contract_gate_results.status,'PASS');
});
test('025 notified passive person is affected recipient with owned scope',async()=>{
 const r=await parse('LEAD must organize a review of failure.log. If a fatal error appears, the task must stop and QA must be notified; otherwise failure.md must be created.'),c=r.compiler_v03,nm=i=>c.semantic_nodes.find(n=>n.node_id===i),notice=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm(f.predicate_node_id)?.surface==='notified');assert.equal(notice?.state,'RESOLVED');assert.ok(notice.condition_expr_id);assert.ok(notice.object_node_ids.some(i=>nm(i)?.surface==='QA'));assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('QA')&&e.display_value.includes('RECIPIENT')));assert.equal(r.contract_gate_results.status,'PASS');
});
test('025 explicit quoted section cardinality retains all local members',async()=>{
 const r=await parse('生成 handbook.md，文档必须包含“状态清单”“恢复前提”“核查步骤”三个章节。不得执行恢复。'),c=r.compiler_v03,req=c.nlp_signals.semantic_decoding.output_content_ir.requirements.find(q=>q.member_node_ids?.length===3);assert.ok(req);for(const id of req.member_node_ids)assert.ok(c.relations.some(r=>r.relation_type==='PART_OF'&&r.head_node_id===id&&req.owner_output_ids.includes(r.tail_node_id)&&r.state==='RESOLVED'));assert.equal(r.contract_gate_results.status,'PASS');
});
for(const artifact of ['assets.csv','seats.csv'])test('025 quantified verification stays a proposition layer '+artifact,async()=>{
 const r=await parse(`LEAD must organize a review of ${artifact} to verify that every active item has an owner and deliver evidence.md.`),c=r.compiler_v03,nm=i=>c.semantic_nodes.find(n=>n.node_id===i);assert.ok(c.semantic_nodes.some(n=>n.metadata.sense==='REQUIRED_PROPOSITION_STATE'&&n.surface.includes('every active item has an owner')&&n.metadata.modality==='REQUIRED'));assert.ok(c.boundary_ir.set_expr_nodes.some(e=>e.kind==='ALL'&&nm(e.base_entity_node_id)?.surface==='active item'));assert.ok(c.canonical_7plus1.I.entries.some(e=>e.display_value.includes(artifact)));assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&/^(has|that)$/iu.test(nm(f.predicate_node_id)?.surface??'')));assert.equal(r.contract_gate_results.status,'PASS');
});
