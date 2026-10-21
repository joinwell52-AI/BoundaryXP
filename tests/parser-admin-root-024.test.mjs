import test from 'node:test';import assert from 'node:assert/strict';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {analyze,closeNlp} from '../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
import {nativeFrontend} from '../research/7plus1-parser/v0.3-admin-root-024/frontend.mjs';
import {prepareCandidates,freezeCandidateGraph} from '../research/7plus1-parser/v0.3-admin-root-024/candidates.mjs';
import {certifyCandidateGraph} from '../research/7plus1-parser/v0.3-admin-root-024/gamma.mjs';
import {nliProposition} from '../research/7plus1-parser/v0.3-admin-root-024/nli-propositions.mjs';
import {normalizationCandidates,certifyNormalizations} from '../research/7plus1-parser/v0.3-admin-root-024/normalization-evidence.mjs';
import {compileNative} from '../research/7plus1-parser/v0.3-admin-root-024/engine.mjs';
import {compileNative as compileLegacy} from '../research/7plus1-parser/v0.3-admin-natural-021/engine.mjs';
const examples=[
 {text:'范围包括风道温度、叶片转速和蓄能装置。',members:['风道温度','叶片转速','蓄能装置']},
 {text:'核验对象为沉淀物、过滤网以及供水泵。',members:['沉淀物','过滤网','供水泵']},
 {text:'输入包括 air.csv 与 duct.yaml。',members:['air.csv','duct.yaml']},
 {text:'Scope includes pressure valves and turbine bearings.',members:['pressure valves','turbine bearings']},
 {text:'不得修改供水泵和过滤网。',members:[]},
 {text:'检查报告应说明范围定义。',members:[]},
];
for(const e of examples)test('024 nominal enumeration '+e.text,async()=>{const f=nativeFrontend(sourceDocument(e.text),await analyze(sourceDocument(e.text)));const nodes=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));const rs=f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER');assert.deepEqual(rs.map(r=>nodes.get(r.tail_node_id).surface),e.members);assert.ok(rs.every(r=>r.state!=='RESOLVED'&&r.candidate_relation_id));for(const r of rs){const n=nodes.get(r.tail_node_id);for(const sid of n.source_span_ids){const s=f.source_spans.find(s=>s.span_id===sid);assert.equal([...e.text].slice(s.start,s.end).join(''),s.text);}}});
test.after(async()=>closeNlp());
for(const text of ['请检测振动幅度。','Please inspect the pressure gauge.','不得擦除仪表记录。'])test('024 governing operator '+text,async()=>{const doc=sourceDocument(text),f=nativeFrontend(doc,await analyze(doc));assert.ok(!f.semantic_nodes.some(n=>n.node_type==='EVENT'&&['请','得','Please'].includes(n.surface)));const events=f.semantic_nodes.filter(n=>n.node_type==='EVENT');assert.ok(events.length);assert.ok(events.every(e=>e.metadata.modality===((text.startsWith('不得'))?'FORBIDDEN':'REQUIRED')));});
for(const text of ['生成 prism-summary.md。','形成 quartz-record.md。','Produce turbine-summary.md.'])test('024 creation candidate and Gamma '+text,async()=>{
 const d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(r.candidate_graph_gate_results.status,'PASS');assert.ok(c.canonical_7plus1.O.entries.some(e=>e.state==='RESOLVED'));
 assert.ok(c.candidate_semantic_graph.candidate_relations.every(r=>r.state!=='RESOLVED'));
 for(const r of c.relations.filter(r=>r.state==='RESOLVED'))assert.ok(c.gamma_certification.decisions.some(d=>d.relation_id===r.relation_id&&d.decision==='CERTIFIED'));
});
for(const file of ['plume-report.md','optics-notes.md'])test('024 local artifact proof scope '+file,async()=>{
 const text=`形成 ${file}。最终由 LEAD 向 BOARD 提交报告。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(r.candidate_graph_gate_results.status,'PASS');assert.equal(c.canonical_7plus1.A.status,'RESOLVED');
 assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('BOARD')&&e.display_value.includes('RECIPIENT')));
 assert.ok(c.relations.some(r=>r.relation_type==='COREFERENCE'&&r.state==='RESOLVED'));
 assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&f.relation_ids.some(i=>c.relations.some(r=>r.relation_id===i&&r.relation_type==='COREFERENCE'))));
});
for(const text of ['请 LEAD 组织完成过滤网状态核查，形成 sieve-notes.md。','请 LEAD 组织完成叶轮振幅核查，形成 impeller-notes.md。'])test('024 nominal predicate and organizer '+text,async()=>{
 const d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.startsWith('LEAD [')));
 assert.ok(!c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('组织 [')));
 assert.ok(!c.canonical_7plus1.A.entries.some(e=>/^REQUIRED 请/u.test(e.display_value)));
 assert.equal(c.canonical_7plus1.O.status,'RESOLVED');
});
for(const text of ['检查零件寿命并形成 rotor-report.md。','检查阀门压力并形成 valve-report.md。'])test('024 nominal SRL predicate '+text,async()=>{
 const d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(c.canonical_7plus1.O.status,'RESOLVED');assert.ok(c.canonical_7plus1.A.entries.some(e=>e.display_value.includes('检查')));
});
test('024 relative predicate is not an execution action',async()=>{
 const text='请 LEAD 组织对 duct.json 中已安装装置的输出压力进行只读核查，形成 duct-review.md。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));assert.ok(!c.boundary_ir.facts.some(e=>e.state==='RESOLVED'&&e.fact_type==='ACTION'&&nm.get(e.predicate_node_id)?.surface==='安装'));
 assert.ok(c.candidate_semantic_graph.semantic_nodes.some(n=>n.metadata.syntactic_layer==='NOMINAL_QUALIFIER'));
});
for(const [actor,object,receiver] of [['AUDITOR','磁场偏差','BOARD'],['CHECKER','密封损伤','COUNCIL']])test('024 temporal predicate layers '+object,async()=>{
 const text=`${actor} 复核${object}后由 LEAD 向 ${receiver} 汇报。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.equal(c.unresolved.length,0);assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes(actor)));
 const review=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.metadata.sense==='review');
 const report=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.metadata.sense==='report');
 assert.ok(review.object_node_ids.some(i=>nm.get(i).surface===object));assert.ok(report.condition_expr_id);assert.equal(report.object_node_ids.length,0);
 assert.ok(c.relations.some(r=>r.state==='RESOLVED'&&r.relation_type==='SEQUENCE'&&r.head_node_id===review.predicate_node_id&&r.tail_node_id===report.predicate_node_id));
});
test('024 conditional recipient-only report preserves guard',async()=>{
 const text='若发现漏气，立即停止后续检查并向 COUNCIL 汇报。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.equal(c.unresolved.length,0);const report=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.metadata.sense==='report');assert.ok(report?.condition_expr_id);assert.equal(report.object_node_ids.length,0);assert.equal(c.canonical_7plus1.C.status,'RESOLVED');
});
test('024 transfer without object is not recipient-only reporting',async()=>{
 const text='向 COUNCIL 提交。',d=sourceDocument(text),r=compileNative(d,await analyze(d));assert.ok(r.compiler_v03.unresolved.length);assert.ok(!r.compiler_v03.canonical_7plus1.A.entries.some(e=>e.state==='RESOLVED'));
});
for(const state of ['轴承温度超限','水位超过警戒线'])test('024 inline modal stop '+state,async()=>{
 const text=`若${state}应立即停止。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(c.canonical_7plus1.C.status,'RESOLVED');
 const fact=c.boundary_ir.facts.find(x=>x.state==='RESOLVED'&&x.fact_type==='STOP');assert.ok(fact?.condition_expr_id);
 const relation=c.relations.find(x=>x.relation_type==='CONDITION_OF'&&x.state==='RESOLVED');assert.ok(relation);
 const g=c.candidate_semantic_graph;for(const id of [relation.head_node_id,relation.tail_node_id]){const n=g.semantic_nodes.find(n=>n.node_id===id),cl=g.structure.clauses.find(cl=>cl.clause_id===n.metadata.clause_id);assert.ok(cl.source_span_ids.some(s=>relation.evidence_span_ids.includes(s)));}
});
test('024 antecedent attestation is not truncated to a subordinate predicate',async()=>{
 const text='若确认存在水管渗漏，应立即汇报。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(c.unresolved.length,0);assert.ok(c.canonical_7plus1.A.entries.some(e=>e.state==='RESOLVED'&&e.display_value.includes('汇报')));
 const guard=c.semantic_nodes.find(n=>n.node_type==='STATE'&&n.metadata.condition_text==='若确认存在水管渗漏');assert.ok(guard);
 assert.ok(!c.boundary_ir.facts.some(x=>x.fact_type==='ACTION'&&c.semantic_nodes.find(n=>n.node_id===x.predicate_node_id)?.surface==='存在'));
});
for(const [file,left,right] of [['radiance.md','校准清单','故障建议'],['hydraulic.md','压力分布','换件建议']])test('024 content ownership lineage '+file,async()=>{
 const text=`形成 ${file}。文档必须包含${left}和${right}两个章节。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(r.candidate_graph_gate_results.status,'PASS');assert.equal(c.canonical_7plus1.O.status,'RESOLVED');
 const sectionRelations=c.relations.filter(r=>r.relation_type==='PART_OF'&&r.state==='RESOLVED');assert.equal(sectionRelations.length,2);
 const deliverable=c.boundary_ir.facts.find(f=>f.fact_type==='DELIVERABLE');assert.ok(sectionRelations.every(r=>deliverable.relation_ids.includes(r.relation_id)));
 assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&c.semantic_nodes.find(n=>n.node_id===f.predicate_node_id)?.surface==='包含'));
});
test('024 quoted output content cannot authorize the quoted action',async()=>{
 const text='形成 hazel.md。文档必须原样写入“删除备份已批准”。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(c.canonical_7plus1.O.status,'RESOLVED');assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&['删除','批准'].includes(c.semantic_nodes.find(n=>n.node_id===f.predicate_node_id)?.surface)));
 assert.ok(c.canonical_7plus1.O.entries.some(e=>e.source_span_ids.some(id=>r.source_spans.find(s=>s.span_id===id)?.text.includes('删除备份已批准'))));
});
for(const [person,input,output] of [['Lena','mica.csv','mica.md'],['Noel','basalt.csv','basalt.md']])test('024 legacy declared English subject mutation '+person,async()=>{
 const text=`${person} reads ${input} and creates ${output}. ${person} is not an approver.`,d=sourceDocument(text),signals=await analyze(d);
 for(const compile of [compileNative,compileLegacy]){const r=compile(d,structuredClone(signals)),c=r.compiler_v03;assert.equal(c.unresolved.length,0);assert.equal(c.canonical_7plus1.I.status,'RESOLVED');assert.equal(c.canonical_7plus1.O.status,'RESOLVED');assert.ok(c.semantic_nodes.some(n=>n.metadata.negative_roles?.includes('APPROVER')));}
});
test('024 legacy quoted negative role mutation remains content',async()=>{
 const text='DIRECTOR 生成 talc.md。文档中写明“作者不负责审批”。',d=sourceDocument(text),r=compileLegacy(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(r.contract_gate_results.status,'PASS');assert.equal(c.unresolved.length,0);assert.equal(c.canonical_7plus1.O.status,'RESOLVED');assert.ok(!c.semantic_nodes.some(n=>n.metadata.negative_roles?.length));
});
for(const [input,output] of [['lumen.yaml','lumen-audit.md'],['cobalt.csv','cobalt-review.md']])test('024 support complement excludes coordinated delivery '+input,async()=>{
 const text=`LEAD must organize an inspection of ${input} and deliver ${output}.`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(c.unresolved.length,0);assert.equal(c.canonical_7plus1.O.status,'RESOLVED');
 const nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.metadata.sense==='review'&&f.object_node_ids.some(i=>nm.get(i)?.surface===input)));
 assert.ok(!c.canonical_7plus1.O.entries.some(e=>e.display_value.includes('inspection')));
});
test('024 inspection mentioned as document content is not execution',async()=>{
 const text='Create obsidian.md. The document must contain "inspection completed".',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&c.semantic_nodes.find(n=>n.node_id===f.predicate_node_id)?.surface==='inspection'));
});
for(const [actor,file] of [['AUDITOR','amber-summary.md'],['CHECKER','zircon-summary.md']])test('024 passive typed argument mutation '+file,async()=>{
 const text=`If a fracture is found, the task must stop and ${actor} must be notified; otherwise ${file} must be produced.`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(c.unresolved.length,0);assert.equal(c.canonical_7plus1.O.status,'RESOLVED');
 assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes(actor)&&e.display_value.includes('RECIPIENT')));
 const output=c.boundary_ir.facts.find(f=>f.fact_type==='DELIVERABLE');assert.ok(output.condition_expr_id);
 assert.ok(c.boundary_ir.condition_expr_nodes.some(e=>e.expr_id===output.condition_expr_id&&e.op==='NOT'));
});
test('024 passive auxiliary does not permit an untyped missing artifact',async()=>{
 const text='Otherwise it must be produced.',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(!c.canonical_7plus1.O.entries.some(e=>e.state==='RESOLVED'));assert.ok(c.unresolved.length);
});
for(const object of ['轴承振动检查','水泵压力检查'])test('024 execution location and retry domain '+object,async()=>{
 const text=`请 LEAD 组织仅在隔离试验台执行${object}并形成 bench-notes.md。重试最多 3 次。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 const retry=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.metadata.sense==='retry');
 assert.ok(retry?.object_node_ids.some(i=>nm.get(i)?.surface===object));
 assert.ok(c.relations.some(r=>r.relation_type==='LOCATION'&&r.state==='RESOLVED'&&nm.get(r.tail_node_id)?.surface==='隔离试验台'));
 assert.ok(!c.canonical_7plus1.A.entries.some(e=>/REQUIRED (请|在|到)\b/u.test(e.display_value)));
});
test('024 competing execution domains cannot supply a guessed retry target',async()=>{
 const text='必须执行风扇检测。必须运行泵压检测。重试最多 3 次。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(c.unresolved.some(u=>u.unresolved_type==='UNRESOLVED_QUANTIFICATION'||u.kind==='UNRESOLVED_QUANTIFICATION'));
 assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&f.state==='RESOLVED'&&c.semantic_nodes.find(n=>n.node_id===f.predicate_node_id)?.metadata.sense==='retry'));
});
for(const [actor,receiver,input,output] of [['LEAD','BOARD','opal.csv','opal-review.md'],['OWNER','COUNCIL','jade.yaml','jade-review.md']])test('024 before subordinate transfer '+input,async()=>{
 const text=`${actor} must organize a review of ${input} and deliver ${output}. AUDITOR must review the report before ${actor} sends it to ${receiver}.`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 const send=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='sends');assert.ok(send?.condition_expr_id);
 assert.ok(c.relations.some(x=>x.relation_type==='AGENT'&&x.state==='RESOLVED'&&x.head_node_id===send.predicate_node_id&&nm.get(x.tail_node_id)?.surface===actor));
 assert.ok(c.relations.some(x=>x.relation_type==='RECIPIENT'&&x.state==='RESOLVED'&&x.head_node_id===send.predicate_node_id&&nm.get(x.tail_node_id)?.surface===receiver));
 assert.ok(c.relations.some(x=>x.relation_type==='SEQUENCE'&&x.state==='RESOLVED'&&x.tail_node_id===send.predicate_node_id));assert.equal(c.unresolved.length,0);
});
for(const [input,output] of [['bronze.yaml','bronze-review.md'],['garnet.csv','garnet-review.md']])test('024 nominal delivery before guard '+input,async()=>{
 const text=`LEAD must inspect ${input} and deliver ${output}. AUDITOR must review the report before delivery.`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n]));
 const deliver=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&nm.get(f.predicate_node_id)?.surface==='deliver');assert.ok(deliver?.condition_expr_id);
 const proof=c.nlp_signals.semantic_decoding.before_sequence_ir.find(x=>x.status==='UNIQUE_STRUCTURAL_EVENT_DOMAIN');assert.equal(proof?.candidate_event_ids.length,1);
});
test('024 nominal delivery without an explicit output event does not invent one',async()=>{
 const text='AUDITOR must review catalog.csv before delivery.',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(!c.boundary_ir.facts.some(f=>f.fact_type==='ACTION'&&c.semantic_nodes.find(n=>n.node_id===f.predicate_node_id)?.metadata.sense==='send'));
 assert.ok(c.nlp_signals.semantic_decoding.before_sequence_ir.some(x=>x.status==='UNRESOLVED_EVENT_DOMAIN'));
});
for(const noun of ['蓄压器','光谱仪'])test('024 local read-only mode '+noun,async()=>{
 const text=`请 LEAD 组织${noun}只读检查，并形成 ${noun}.md。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const mode=c.semantic_nodes.find(n=>n.metadata.sense==='READ_ONLY_MODE');assert.ok(mode);
 const fact=c.boundary_ir.facts.find(x=>x.fact_type==='ACTION'&&x.node_ids.includes(mode.node_id));assert.ok(fact);
 assert.ok(!c.boundary_ir.facts.some(x=>x.fact_type==='ACTION'&&['只','读'].includes(c.semantic_nodes.find(n=>n.node_id===x.predicate_node_id)?.surface)));
});
for(const role of ['负责人','管理员'])test('024 approval role from bounded subject '+role,async()=>{
 const text=`只有${role}批准后才允许读取 mica-snapshot.csv。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(c.canonical_7plus1.P.entries.some(e=>e.display_value.includes(role)&&e.display_value.includes('APPROVER')));
 assert.ok(c.relations.some(x=>x.relation_type==='APPROVAL_OF'&&x.state==='RESOLVED'));
 assert.ok(c.semantic_nodes.filter(n=>n.surface===role).every(n=>n.metadata.authority_inferred===false||n.metadata.participant_eligibility?.authority_inferred===false));
});
test('024 quoted approval role grants no task approval',async()=>{
 const text='生成 amber.md。报告必须写入“管理员批准”。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(!c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('APPROVER')));assert.ok(!c.relations.some(x=>x.relation_type==='APPROVAL_OF'&&x.state==='RESOLVED'));
});
test('024 immediate container is certified through Gamma',async()=>{
 const text='形成 zircon.md。文档必须包含震动幅度和气流速度两个章节。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const certs=c.nlp_signals.semantic_decoding.part_of_contract.certificates;assert.equal(certs.length,2);assert.ok(certs.every(x=>x.candidate_ids.length===1&&x.gamma_decision_id));
});
test('024 a missing immediate-container contract remains unresolved',async()=>{
 const text='形成 quartz.md。文档必须包含噪声强度和转速偏差两个章节。',d=sourceDocument(text),f=prepareCandidates(d,await analyze(d));
 for(const r of f.relations.filter(r=>r.relation_type==='PART_OF'))delete r.immediate_container_candidate;
 const g=freezeCandidateGraph(f),G=certifyCandidateGraph(g);assert.ok(G.decisions.filter(x=>g.candidate_relations.find(r=>r.relation_id===x.relation_id)?.relation_type==='PART_OF').every(x=>x.decision==='TYPED_UNRESOLVED'));
});
for(const [reference,file] of [['HANDBOOK-72','mica-guide.md'],['PROCEDURE-83','garnet-guide.md']])test('024 conformance comparison mutation '+reference,async()=>{
 const text=`请 LEAD 检查 ${file} 的操作步骤是否符合 ${reference}。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const referenceLink=c.relations.find(x=>x.relation_type==='CONFORMS_TO'&&x.state==='RESOLVED');assert.ok(referenceLink);
 assert.ok(c.canonical_7plus1.V.entries.some(e=>e.display_value.includes(reference)));assert.ok(c.nlp_signals.semantic_decoding.conformance_reference_ir.every(x=>x.asserts_conformance===false));
 assert.ok(!c.boundary_ir.facts.some(x=>x.fact_type==='ACTION'&&c.semantic_nodes.find(n=>n.node_id===x.predicate_node_id)?.surface==='符合'));
});
test('024 approved normative noun phrase is a comparison basis, not task approval',async()=>{
 const text='请 LEAD 核查角色分配是否符合已批准的人员访问规范。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(c.canonical_7plus1.V.entries.some(e=>e.display_value.includes('已批准的人员访问规范')));
 assert.ok(!c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('APPROVER')));
});
test('024 quoted reference is not a compliance comparison',async()=>{
 const text='形成 quartz.md。报告必须写入“已经符合 HANDBOOK-72”。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(c.canonical_7plus1.V.entries.length,0);
});
for(const [condition,verb,object,modalText] of [['若温度超限','停止','风扇检查','必须'],['未经 AUDITOR 批准','读取','opal.csv','不得']])test('024 NLI preserves source condition and modality '+condition,async()=>{
 const text=`${condition}${modalText}${verb}${object}。`,d=sourceDocument(text),f=prepareCandidates(d,await analyze(d)),candidate=f.relations.find(r=>r.state==='SUPPORTED'&&['PATIENT','FORBIDS'].includes(r.relation_type));assert.ok(candidate);
 const p=nliProposition(f,candidate);assert.equal(p.status,'SUPPORTED_HYPOTHESIS_STRUCTURE');assert.ok(p.antecedent?.includes(condition));assert.ok(p.hypothesis.includes(modalText));assert.ok(p.consequent.includes(object));assert.ok(p.premise.includes(condition));assert.ok(p.condition_expr_id);
 assert.ok(!p.hypothesis.includes('动作模态'));assert.ok(!p.hypothesis.includes('SOURCE_STATE'));
});
for(const [file,member] of [['opal-index.csv','样品'],['garnet-index.csv','测点']])test('024 qualified member container mutation '+member,async()=>{
 const text=`请 LEAD 组织读取 ${file} 并核验其中全部${member}的校验结果，形成 summary.md。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const domain=c.nlp_signals.semantic_decoding.qualified_domain_ir.domains.find(x=>x.member_selector?.surface===member);assert.ok(domain);assert.equal(domain.quantifier,'ALL');assert.equal(domain.property_selector.surface,'校验结果');
 assert.ok(domain.base_entity_ids.some(i=>c.semantic_nodes.find(n=>n.node_id===i).surface===file));
 const fact=c.boundary_ir.facts.find(x=>x.fact_type==='ACTION'&&c.semantic_nodes.find(n=>n.node_id===x.predicate_node_id)?.surface==='核验');
 assert.equal(fact.state,'RESOLVED');assert.equal(c.boundary_ir.set_expr_nodes.find(x=>x.expr_id===fact.scope_expr_id).kind,'ALL');assert.ok(domain.relation_ids.every(i=>fact.relation_ids.includes(i)));
});
test('024 competing read containers remain unresolved',async()=>{
 const text='读取 opal.csv 与 garnet.csv 并核验其中全部测点的校验结果。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(c.unresolved.some(u=>u.reason.includes('same-sentence read container')));assert.ok(!c.relations.some(x=>x.relation_type==='PART_OF'&&x.state==='RESOLVED'));
});
for(const [connector,operator] of [['或','OR'],['与','AND']])test('024 local shared predicate condition '+operator,async()=>{
 const text=`读取 minerals.csv 并形成 audit.md。来源${connector}许可缺失的条目标为待确认。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const req=c.nlp_signals.semantic_decoding.output_content_ir.requirements.find(x=>x.components?.some(y=>y.kind==='BOOLEAN_QUALIFIER'));assert.ok(req);
 const e=c.candidate_semantic_graph.candidate_expressions.find(x=>x.expression_id===req.condition_expr_id);assert.equal(e.expression.op,operator);assert.equal(e.expression.operand_expr_ids.length,2);
 for(const child of e.expression.operand_expr_ids){const x=c.boundary_ir.condition_expr_nodes.find(x=>x.expr_id===child),n=c.semantic_nodes.find(n=>n.node_id===x.state_node_id);assert.equal(n.metadata.predicate,'缺失');assert.ok(n.source_span_ids.length>=2);}
 assert.ok(c.canonical_7plus1.O.entries.every(e=>e.state==='RESOLVED'));assert.equal(c.canonical_7plus1.C.status,'ABSENT');
});
for(const [a,b,member] of [['first-review.md','second-review.md','风险项'],['alpha-review.md','beta-review.md','异常项']])test('024 plural proposition source domain '+member,async()=>{
 const text=`请 LEAD 组织读取 ${a} 与 ${b}，形成 combined.md，并确保两份报告的全部${member}得到保留。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const domain=c.nlp_signals.semantic_decoding.qualified_domain_ir.domains.find(x=>x.member_selector?.surface===member);assert.ok(domain);assert.equal(domain.base_entity_ids.length,2);
 const fact=c.boundary_ir.facts.find(x=>x.fact_type==='ACTION'&&c.semantic_nodes.find(n=>n.node_id===x.predicate_node_id)?.surface==='确保');assert.ok(domain.relation_ids.every(i=>fact.relation_ids.includes(i)));
 assert.ok(!c.canonical_7plus1.A.entries.some(x=>/REQUIRED (得到|保留)/u.test(x.display_value)));
});
test('024 a plural attestation with no source input set is not invented',async()=>{
 const text='请 LEAD 组织形成 combined.md，并确保两份报告的全部风险项得到保留。',d=sourceDocument(text),r=compileNative(d,await analyze(d));
 assert.ok(r.compiler_v03.unresolved.some(u=>u.reason.includes('report set')));
});
for(const text of ['不得将资料发送给外部人员。','The task must not send opal.csv to COUNCIL.'])test('024 forbidden destination is not assigned participant '+text,async()=>{
 const d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const dest=c.relations.find(x=>x.relation_type==='RECIPIENT'&&x.state==='RESOLVED');assert.ok(dest);assert.ok(c.canonical_7plus1.B.entries.some(x=>x.state==='RESOLVED'));
 assert.ok(!c.canonical_7plus1.P.entries.some(x=>/COUNCIL|外部人员/u.test(x.display_value)));assert.ok(c.boundary_ir.facts.some(x=>x.fact_type==='FORBID'&&x.relation_ids.includes(dest.relation_id)));
});
test('024 retry expression identity is derived from its bound domain',async()=>{
 const text='请 LEAD 仅在实验环境执行风压检查，最多重试 4 次。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const cert=c.nlp_signals.semantic_decoding.resource_target_ir.certificates.find(x=>x.category==='RETRY_COUNT');assert.ok(cert.original_quantity_expr_id);assert.notEqual(cert.quantity_expr_id,cert.original_quantity_expr_id);
 const old=c.candidate_semantic_graph.candidate_expressions.find(x=>x.expression_id===cert.original_quantity_expr_id),updated=c.candidate_semantic_graph.candidate_expressions.find(x=>x.expression_id===cert.quantity_expr_id);assert.ok(updated.expression.relation_ids.length>old.expression.relation_ids.length);
});
for(const [operator,kind] of [['才','NECESSARY'],['即可','SUFFICIENT']])test('024 completion operator contract '+kind,async()=>{
 const text=`检查完成时${operator}完成。`,d=sourceDocument(text),r=compileNative(d,await analyze(d));
 assert.ok(r.compiler_v03.nlp_signals.semantic_decoding.condition_operator_contract_ir.some(x=>x.condition_kind===kind));
});
for(const [first,second] of [['振动幅度','风道压力'],['叶片转速','蓄能装置']])test('024 coordinated noun components retain outer argument '+first,async()=>{
 const text=`请 LEAD 检查${first}与${second}。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const group=c.nlp_signals.semantic_decoding.nominal_coordination_ir.find(x=>x.operator==='AND');assert.ok(group);
 assert.deepEqual(group.component_node_ids.map(i=>c.semantic_nodes.find(n=>n.node_id===i).surface),[first,second]);
 assert.ok(c.candidate_semantic_graph.candidate_expressions.some(x=>x.expression_id===group.expression_id&&x.expression.kind==='UNION'));
 const fact=c.boundary_ir.facts.find(x=>x.fact_type==='ACTION');assert.ok(group.component_node_ids.every(i=>fact.node_ids.includes(i)));assert.ok(fact.object_node_ids.includes(group.parent_node_id));
});
test('024 coordinated nominal property does not flatten into separate actions',async()=>{
 const text='请 LEAD 检查电气配置与模板的一致性。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(c.canonical_7plus1.A.entries.length,1);assert.ok(c.canonical_7plus1.A.entries[0].display_value.includes('一致性'));
 const group=c.nlp_signals.semantic_decoding.nominal_coordination_ir[0];assert.ok(group);assert.equal(c.semantic_nodes.find(n=>n.node_id===group.parent_node_id).surface,'电气配置与模板的一致性');
});
test('024 quoted noun enumeration is not current execution scope',async()=>{
 const text='形成 quartz.md。文档必须写入“检查振动幅度与风道压力”。',d=sourceDocument(text),r=compileNative(d,await analyze(d));
 assert.equal(r.compiler_v03.nlp_signals.semantic_decoding.nominal_coordination_ir.length,0);assert.equal(r.compiler_v03.canonical_7plus1.I.status,'ABSENT');
});
test('024 Gamma refuses flattened conditional model evidence',async()=>{
 const d=sourceDocument('若风压过高必须停止排风检查。'),f=prepareCandidates(d,await analyze(d)),r=f.relations.find(r=>r.state==='SUPPORTED'&&r.relation_type==='PATIENT');assert.ok(r);
 const valid=nliProposition(f,r);assert.ok(valid.antecedent);const bad={...valid,antecedent:null,condition_expr_id:null,hypothesis:valid.consequent,nli:{label:'entailment',score:1}};
 const g=freezeCandidateGraph(f,{models:[],observations:[],relation_validation:[bad]}),G=certifyCandidateGraph(g),decision=G.decisions.find(x=>x.relation_id===r.relation_id);
 assert.equal(decision.decision,'TYPED_UNRESOLVED');assert.equal(decision.checks.MODEL_EVIDENCE_COHERENCE.status,'FAIL');
});
test('024 Gamma keeps a competing candidate even with high model support',async()=>{
 const d=sourceDocument('检查 opal.csv。'),f=prepareCandidates(d,await analyze(d)),r=f.relations.find(r=>r.state==='SUPPORTED'&&r.relation_type==='PATIENT');assert.ok(r);r.state='COMPETING';
 const valid=nliProposition(f,r),g=freezeCandidateGraph(f,{models:[],observations:[],relation_validation:[{...valid,nli:{label:'entailment',score:1}}]}),G=certifyCandidateGraph(g),decision=G.decisions.find(x=>x.relation_id===r.relation_id);
 assert.equal(decision.decision,'TYPED_UNRESOLVED');assert.equal(decision.checks.CARDINALITY.status,'FAIL');assert.equal(decision.checks.MODEL_EVIDENCE_COHERENCE.status,'FAIL');
});
test('024 Gamma verifies complete conditional model evidence without score-as-truth',async()=>{
 const d=sourceDocument('未经 CHECKER 批准不得读取 garnet.csv。'),f=prepareCandidates(d,await analyze(d)),r=f.relations.find(r=>r.state==='SUPPORTED'&&r.relation_type==='FORBIDS');assert.ok(r);
 const valid=nliProposition(f,r),g=freezeCandidateGraph(f,{models:[],observations:[],relation_validation:[{...valid,nli:{label:'neutral',score:.01}}]}),G=certifyCandidateGraph(g),decision=G.decisions.find(x=>x.relation_id===r.relation_id);
 assert.equal(decision.checks.MODEL_EVIDENCE_COHERENCE.status,'PASS');assert.equal(decision.decision,'CERTIFIED');assert.equal(decision.checks.MODALITY.status,'PASS');
});
for(const [left,right] of [['阀门压力','风道温度'],['转子振幅','叶片转速']])test('024 quantified state binds explicit two-member check domain '+left,async()=>{
 const text=`请 LEAD 检查${left}与${right}。QA 应确认两类检查都完成后任务结束。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const domain=c.nlp_signals.semantic_decoding.quantified_state_domain_ir.find(x=>x.status==='UNIQUE');assert.ok(domain);assert.equal(domain.member_node_ids.length,2);
 const fact=c.boundary_ir.facts.find(x=>x.fact_type==='COMPLETION');assert.equal(fact.state,'RESOLVED');const expr=c.boundary_ir.condition_expr_nodes.find(x=>x.expr_id===fact.condition_expr_id);assert.equal(expr.op,'AND');
 assert.ok(domain.member_node_ids.every(i=>fact.node_ids.includes(i)));assert.ok(c.canonical_7plus1.P.entries.some(x=>x.display_value.includes('QA')&&x.display_value.includes('REVIEWER')));
});
test('024 two compatible check domains do not choose the nearest',async()=>{
 const text='检查风压与水压。检查温度与转速。QA 应确认两类检查都完成后任务结束。',d=sourceDocument(text),r=compileNative(d,await analyze(d));
 assert.ok(r.compiler_v03.unresolved.some(u=>u.reason.includes('two-member domain')));assert.ok(!r.compiler_v03.canonical_7plus1.C.entries.some(e=>e.state==='RESOLVED'));
});
test('024 a referenced content class requires compatible nominal evidence',async()=>{
 const text='请 LEAD 检查风压与水压。只有 QA 确认两类说明均完整后才能向 BOARD 提交报告。',d=sourceDocument(text),r=compileNative(d,await analyze(d));
 assert.ok(r.compiler_v03.nlp_signals.semantic_decoding.quantified_state_domain_ir.some(x=>x.status==='UNRESOLVED'));
});

for(const [file,noun] of [['topaz.csv','样本'],['jasper.csv','测点']])test('024 quantified condition keeps explicit local nominal '+noun,async()=>{
 const text=`读取 ${file} 并形成 summary.md。只有全部${noun}检查完且报告已生成才完成。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const arg=c.nlp_signals.semantic_decoding.state_argument_ir.find(x=>c.semantic_nodes.find(n=>n.node_id===x.argument_node_id)?.surface===`全部${noun}`);assert.ok(arg);assert.equal(arg.quantifier,'ALL');
 assert.equal(c.candidate_semantic_graph.candidate_expressions.find(x=>x.expression_id===arg.scope_expr_id).expression.kind,'ALL');
 const fact=c.boundary_ir.facts.find(x=>x.fact_type==='COMPLETION');assert.ok(fact.node_ids.includes(arg.argument_node_id));assert.equal(fact.state,'RESOLVED');
 assert.ok(!c.relations.some(x=>x.relation_type==='COREFERENCE'&&x.head_node_id===arg.argument_node_id));
});
for(const [first,second,object] of [['移除','替换','字段'],['删除','改名','标签']])test('024 attested qualified noun keeps OR predicates '+object,async()=>{
 const text=`QA 应确认所有${first}或${second}${object}均已记录。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const arg=c.nlp_signals.semantic_decoding.state_argument_ir.find(x=>x.qualifier_state_ids.length===2);assert.ok(arg);
 const e=c.candidate_semantic_graph.candidate_expressions.find(x=>x.expression_id===arg.qualifier_expr_id);assert.equal(e.expression.op,'OR');
 assert.deepEqual(arg.qualifier_state_ids.map(i=>c.semantic_nodes.find(n=>n.node_id===i).surface),[first,second]);
 assert.equal(c.canonical_7plus1.A.entries.length,1);assert.ok(c.canonical_7plus1.A.entries[0].display_value.includes('确认'));
});
test('024 state argument source does not invent a containing file',async()=>{
 const d=sourceDocument('只有全部测点检查完才完成。'),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const arg=c.nlp_signals.semantic_decoding.state_argument_ir.find(x=>x.quantifier==='ALL');assert.ok(arg);assert.ok(!c.relations.some(x=>x.relation_type==='PART_OF'));
});
test('024 shared condition hypothesis names each actual member',async()=>{
 const text='检查转子振幅与叶片转速。QA 应确认两类检查都完成后任务结束。',d=sourceDocument(text),f=prepareCandidates(d,await analyze(d));
 const r=f.relations.find(x=>x.state==='SUPPORTED'&&x.relation_type==='COMPLETION_OF'),p=nliProposition(f,r);
 assert.ok(p.antecedent.includes('转子振幅'));assert.ok(p.antecedent.includes('叶片转速'));assert.ok(!p.antecedent.includes('两类检查都完成'));
});
for(const [object,verb] of [['叶片压力','检查'],['转子偏差','核验']])test('024 stopped operation reference keeps its checked domain '+verb,async()=>{
 const text=`请 LEAD ${verb}${object}。若发现异常应停止${verb}并汇报。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const ref=c.nlp_signals.semantic_decoding.action_domain_reference_ir.find(x=>x.status==='UNIQUE');assert.ok(ref);
 const fact=c.boundary_ir.facts.find(x=>x.fact_type==='STOP');assert.ok(fact.relation_ids.includes(ref.relation_id));assert.ok(fact.node_ids.includes(ref.event_node_id));
 assert.ok(!c.canonical_7plus1.I.entries.some(e=>e.display_value===verb));
});
test('024 ambiguous stopped operation domain is not nearest-bound',async()=>{
 const text='检查风压。检查水压。若发现异常应停止检查。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(c.unresolved.some(u=>u.reason.includes('Action-domain nominal')));assert.ok(!c.canonical_7plus1.C.entries.some(e=>e.state==='RESOLVED'));
});
test('024 unrestricted task stop invents no operation target',async()=>{
 const d=sourceDocument('若发现异常应立即停止。'),r=compileNative(d,await analyze(d));assert.equal(r.compiler_v03.nlp_signals.semantic_decoding.action_domain_reference_ir.length,0);
});
test('024 candidate dependencies survive without extending certified relation schema',async()=>{
 const text='请 LEAD 检查风压与水压。QA 应确认两类检查都完成后任务结束。',d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.equal(r.contract_gate_results.status,'PASS');assert.equal(r.candidate_graph_gate_results.status,'PASS');
 assert.ok(c.nlp_signals.semantic_decoding.relation_dependency_ir.length);assert.ok(c.relations.every(x=>!Object.hasOwn(x,'dependency_relation_ids')));
 for(const fact of c.boundary_ir.facts)for(const relationId of fact.relation_ids){const dependency=c.candidate_semantic_graph.candidate_relations.find(x=>x.relation_id===relationId);for(const id of dependency.dependency_relation_ids??[])assert.ok(fact.relation_ids.includes(id));}
});
for(const text of ['形成 topaz.md。文档必须包含压力偏差和温度偏差两个章节。','只读检查：只有负责人批准后才允许读取 quartz.csv。','读取 jasper.csv 并形成 summary.md。来源或许可缺失的条目标为待确认。'])test('024 structural provenance satisfies frozen context contract '+text,async()=>{
 const d=sourceDocument(text),r=compileNative(d,await analyze(d));assert.equal(r.contract_gate_results.status,'PASS');assert.equal(r.candidate_graph_gate_results.status,'PASS');
});
test('024 shared failure hypothesis retains two named operands and AND',async()=>{
 const text='执行电气连通性检查。主路径检查通过或备选路径检查通过时即可完成；两者都失败时应停止并通知 LEAD。',d=sourceDocument(text),f=prepareCandidates(d,await analyze(d)),r=f.relations.find(r=>r.state==='SUPPORTED'&&r.relation_type==='RECIPIENT');assert.ok(r);
 const p=nliProposition(f,r);assert.equal(p.status,'SUPPORTED_HYPOTHESIS_STRUCTURE');assert.ok(p.antecedent.includes('主路径'));assert.ok(p.antecedent.includes('备选路径'));assert.ok(p.antecedent.includes('失败'));assert.ok(p.antecedent.includes('且'));assert.ok(!p.hypothesis.includes('CHECK_'));
});
for(const noun of ['标识值','采样值'])test('024 ANY negative condition keeps its explicit subject '+noun,async()=>{
 const text=`任何${noun}不匹配时应停止并汇报。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const argument=c.nlp_signals.semantic_decoding.state_argument_ir.find(x=>x.quantifier==='ANY');assert.ok(argument);assert.ok(c.semantic_nodes.find(n=>n.node_id===argument.argument_node_id).surface.includes(noun));
 const stop=c.boundary_ir.facts.find(x=>x.fact_type==='STOP');assert.ok(stop.node_ids.includes(argument.argument_node_id));assert.equal(stop.state,'RESOLVED');assert.equal(r.contract_gate_results.status,'PASS');
});
test('024 normalization retrieval cannot replace lexical or endpoint type gates',async()=>{
 const d=sourceDocument('读取 quartz.csv。'),f=prepareCandidates(d,await analyze(d)),event=f.semantic_nodes.find(n=>n.node_type==='EVENT'&&n.metadata.sense==='read'),obs=[{node_id:event.node_id,bge:[{candidate_id:'irrelevant',score:1},{candidate_id:'repository',score:1}],e5:[{candidate_id:'irrelevant',score:1},{candidate_id:'repository',score:1}]}];
 const rows=normalizationCandidates(f,[{candidate_id:'irrelevant',aliases:['训练'],entry:{id:'TRAIN',operation:'CHANGE'}},{candidate_id:'repository',aliases:['读取'],entry:{id:'READ_REPOSITORY',operation:'READ',entityTypes:['repository']}}],obs);assert.equal(rows.length,2);assert.ok(rows.every(x=>x.candidate_state==='INSUFFICIENT'));
 const g=freezeCandidateGraph(f,{normalization_candidates:rows}),G=certifyCandidateGraph(g);assert.ok(G.normalization_decisions.every(x=>x.decision==='REJECTED'));
});
test('024 normalization evidence participates in ambiguous interpretation without creating facts',async()=>{
 const d=sourceDocument('读取 quartz.csv。'),f=prepareCandidates(d,await analyze(d)),event=f.semantic_nodes.find(n=>n.node_type==='EVENT'&&n.metadata.sense==='read'),obs=[{node_id:event.node_id,bge:[{candidate_id:'one',score:1},{candidate_id:'two',score:1}],e5:[{candidate_id:'one',score:1},{candidate_id:'two',score:1}]}];
 // Synthetic candidate-domain unit control, not a modified Semantic Pack or
 // a claim that a mocked signal is a real model invocation.
 const rows=normalizationCandidates(f,[{candidate_id:'one',aliases:['读取'],entry:{id:'READ',operation:'READ'}},{candidate_id:'two',aliases:['读取'],entry:{id:'OTHER',operation:'PROCESS'}}],obs),g=freezeCandidateGraph(f,{normalization_candidates:rows}),before=certifyCandidateGraph(g);assert.ok(before.normalization_decisions.every(x=>x.decision==='TYPED_UNRESOLVED'));
 const changed=structuredClone(g);changed.candidate_normalizations[0].nli={model_label:'entailment',confidence:.99};changed.candidate_normalizations[1].nli={model_label:'neutral',confidence:.99};
 const after=certifyNormalizations(changed,{nli_entailment_min:.9});assert.equal(after[0].decision,'CERTIFIED');assert.equal(after[1].decision,'TYPED_UNRESOLVED');assert.ok(after.every(x=>x.model_evidence_participated));assert.ok(!Object.hasOwn(after[0],'boundary_fact_id'));
});
test('024 normalization preserves competing interpretations when both are model-supported',async()=>{
 const d=sourceDocument('读取 quartz.csv。'),f=prepareCandidates(d,await analyze(d)),event=f.semantic_nodes.find(n=>n.node_type==='EVENT'&&n.metadata.sense==='read'),obs=[{node_id:event.node_id,bge:[{candidate_id:'one',score:1},{candidate_id:'two',score:1}],e5:[{candidate_id:'one',score:1},{candidate_id:'two',score:1}]}];
 const rows=normalizationCandidates(f,[{candidate_id:'one',aliases:['读取'],entry:{id:'READ',operation:'READ'}},{candidate_id:'two',aliases:['读取'],entry:{id:'OTHER',operation:'PROCESS'}}],obs);for(const row of rows)row.nli={model_label:'entailment',confidence:1};const g=freezeCandidateGraph(f,{normalization_candidates:rows}),G=certifyCandidateGraph(g);assert.ok(G.normalization_decisions.every(x=>x.decision==='TYPED_UNRESOLVED'));
});

for(const [verb,object] of [['记录','异常波形'],['查看','偏差标签']])test('024 exclusive argument preserves positive action and restriction '+verb,async()=>{
 const text=`只${verb}${object}。`,d=sourceDocument(text),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(c.canonical_7plus1.A.entries.some(e=>e.state==='RESOLVED'&&e.display_value.includes(verb)));
 assert.ok(c.canonical_7plus1.B.entries.some(e=>e.state==='RESOLVED'&&e.display_value.includes(object)));
 assert.ok(c.semantic_nodes.some(n=>n.metadata.local_restriction?.kind==='ARGUMENT_ONLY'));
 assert.equal(r.contract_gate_results.status,'PASS');
});
test('024 absent exclusivity creates no restriction',async()=>{
 const d=sourceDocument('记录异常波形。'),r=compileNative(d,await analyze(d));assert.equal(r.compiler_v03.canonical_7plus1.B.entries.length,0);
});
test('024 quoted exclusive wording does not restrict the current task',async()=>{
 const d=sourceDocument('形成 opal.md。报告中引用“只记录异常波形”。'),r=compileNative(d,await analyze(d));assert.ok(!r.compiler_v03.canonical_7plus1.B.entries.some(e=>e.display_value.includes('异常波形')));
});
for(const result of ['检查结果','最终结果'])test('024 substantive result noun is not document identity '+result,async()=>{
 const d=sourceDocument(`检查风道温度并形成 quartz.md。QA 必须复核${result}。`),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 assert.ok(c.canonical_7plus1.A.entries.some(e=>e.display_value.includes('复核')&&e.display_value.includes(result)));
 const ref=c.semantic_nodes.find(n=>n.surface===result);assert.ok(ref);assert.ok(!c.relations.some(r=>r.head_node_id===ref.node_id&&r.relation_type==='COREFERENCE'&&r.state==='RESOLVED'));
});
test('024 only-need withdraws excess obligation without inventing a prohibition',async()=>{
 const d=sourceDocument('只需记录偏差波形。'),r=compileNative(d,await analyze(d));assert.ok(r.compiler_v03.canonical_7plus1.A.entries.some(e=>e.state==='RESOLVED'));assert.equal(r.compiler_v03.canonical_7plus1.B.entries.length,0);
});
test('024 restriction NLI retains exclusive argument meaning',async()=>{
 const d=sourceDocument('只查看压力记录。'),f=prepareCandidates(d,await analyze(d)),r=f.relations.find(r=>r.relation_type==='RESTRICTS'&&r.state==='SUPPORTED');assert.ok(r);assert.ok(nliProposition(f,r).hypothesis.includes('仅'));
});
for(const text of ['不得重新运行压差检测。','必须精确记录转子偏差。','请谨慎读取 opal.csv。'])test('024 source adverb stays on its syntactic predicate '+text,async()=>{
 const d=sourceDocument(text),f=prepareCandidates(d,await analyze(d)),qualifier=f.semantic_nodes.find(n=>n.metadata.qualifier_contract==='EXPLICIT_SYNTACTIC_ADVERB');assert.ok(qualifier);
 const event=f.semantic_nodes.find(n=>n.node_id===qualifier.metadata.owner),r=f.relations.find(r=>r.head_node_id===event.node_id&&r.state==='SUPPORTED'&&['PATIENT','FORBIDS','THEME'].includes(r.relation_type));assert.ok(r);assert.ok(nliProposition(f,r).hypothesis.includes(qualifier.surface));
 const c=compileNative(d,await analyze(d)).compiler_v03;assert.ok(c.boundary_ir.facts.some(f=>f.predicate_node_id===event.node_id&&f.node_ids.includes(qualifier.node_id)));
});
test('024 unmodified verb does not invent repeated-operation qualifier',async()=>{
 const d=sourceDocument('不得运行压差检测。'),r=compileNative(d,await analyze(d));assert.ok(!r.compiler_v03.semantic_nodes.some(n=>n.metadata.qualifier_contract==='EXPLICIT_SYNTACTIC_ADVERB'&&n.surface==='重新'));
});
for(const environment of ['离线沙箱','隔离试验室'])test('024 exclusive execution location has its own restriction scope '+environment,async()=>{
 const d=sourceDocument(`请 LEAD 组织仅在${environment}执行温度检查并形成 quartz.md。`),r=compileNative(d,await analyze(d)),c=r.compiler_v03;
 const e=c.semantic_nodes.find(n=>n.metadata.restriction_kind==='EXECUTION_LOCATION_ONLY');assert.ok(e);const fact=c.boundary_ir.facts.find(f=>f.predicate_node_id===e.node_id&&f.fact_type==='RESTRICT');assert.ok(fact);assert.equal(fact.state,'RESOLVED');
 const scope=c.boundary_ir.set_expr_nodes.find(x=>x.expr_id===fact.scope_expr_id);assert.ok(c.semantic_nodes.find(n=>n.node_id===scope.entity_node_id).surface.includes(environment));assert.ok(c.canonical_7plus1.B.entries.length);assert.ok(!c.canonical_7plus1.A.entries.some(e=>e.display_value.includes('仅在')));assert.equal(r.contract_gate_results.status,'PASS');
});
for(const destination of ['审计外网','备用平台'])test('024 prohibited upload retains direction after generic frame replacement '+destination,async()=>{
 const d=sourceDocument(`不得向${destination}上传温度日志。`),r=compileNative(d,await analyze(d)),c=r.compiler_v03;const edge=c.relations.find(r=>r.state==='RESOLVED'&&r.relation_type==='RECIPIENT'&&c.semantic_nodes.find(n=>n.node_id===r.tail_node_id)?.surface===destination);assert.ok(edge);
 assert.ok(c.boundary_ir.facts.some(f=>f.fact_type==='FORBID'&&f.relation_ids.includes(edge.relation_id)));assert.ok(!c.canonical_7plus1.P.entries.some(e=>e.display_value.includes(destination)));
});
test('024 absent upload direction does not invent destination',async()=>{
 const d=sourceDocument('不得上传温度日志。'),r=compileNative(d,await analyze(d));assert.ok(!r.compiler_v03.relations.some(r=>r.state==='RESOLVED'&&r.relation_type==='RECIPIENT'));
});
for(const adverb of ['明确','如实'])test('024 negative output condition survives intervening manner '+adverb,async()=>{
 const d=sourceDocument(`形成 quartz.md。不存在偏差时${adverb}写明无偏差。`),r=compileNative(d,await analyze(d)),c=r.compiler_v03,requirement=c.nlp_signals.semantic_decoding.output_content_ir.requirements.find(r=>r.content_text.includes('不存在'));assert.ok(requirement?.condition_expr_id);
 const e=c.boundary_ir.condition_expr_nodes.find(e=>e.expr_id===requirement.condition_expr_id),state=c.semantic_nodes.find(n=>n.node_id===e.state_node_id);assert.equal(state.metadata.polarity,'NEGATIVE');assert.ok(state.surface.endsWith('时'));
});
for(const object of ['叶片状态','滤网状态'])test('024 colon continuation preserves actual document structure '+object,async()=>{
 const d=sourceDocument(`请 LEAD 组织${object}检查：只有审核员批准后才允许读取 quartz.csv。`),r=compileNative(d,await analyze(d));assert.ok(r.compiler_v03.nlp_signals.semantic_decoding.document_structure_recovery_ir.length);assert.ok(!r.compiler_v03.coverage.some(c=>c.disposition==='COVERAGE_FAILURE'));assert.equal(r.contract_gate_results.status,'PASS');
});
