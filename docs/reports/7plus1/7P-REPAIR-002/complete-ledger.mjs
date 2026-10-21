// Read-only semantic adjudication of the frozen final traces. Never a runtime dependency.
import fs from'node:fs';import assert from'node:assert/strict';
const dir='docs/reports/7plus1/7P-REPAIR-002',read=p=>JSON.parse(fs.readFileSync(p)),ledger=read(dir+'/SEMANTIC-REVIEW-LEDGER.json'),prior=read('docs/reports/7plus1/7P-REPAIR-001/COMPARISON.json'),active=read('fixtures/7plus1/standard/adjudications/r02/manifest.json');
const add=(id,decision,refs,reason)=>ledger.actual[id]={decision,expected_entry_refs:refs,reason};
const vmap={'SWAI-001':{'ISSUE-20260427-003-ME.md':0,'TASK-20260427-002-ADMIN-to-ME.md':1},'SWAI-002':{'adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md':0,'ADR-0017':2,'ADR-0001':3,'ADR-0003':4},'SWAI-003':{'adr/ADR-0019-failure-and-recovery-semantics.md':0,'ADR-0019':0,'adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md':1,'failure.schema.json':2,'ADR-0003':3},'SWAI-004':{'adr/ADR-0022-workspace-directory-convention.md':0,'ADR-0022':0,'adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md':1}};
const cmaps={'SWAI-001':[0,1,2,3],'SWAI-002':[0],'SWAI-003':[0],'SWAI-004':[0],'SWAI-006':[0,1,2,3,4],'SWAI-007':[1,2,3],'SWAI-008':[0,1],'SWAI-009':[0],'SWAI-010':[0]};
for(const item of active.cases.filter(x=>x.denominator_included)){
 const sid=item.sample_id,r=read(dir+'/final-candidate/replay/'+sid+'/trace.json'),c=r.compiler_v03,old=prior.cases.find(x=>x.sample_id===sid),recovery=c.nlp_signals.semantic_decoding.structured_recovery;
 for(const slot of 'IOAPRVCB')for(const e of c.canonical_7plus1[slot].entries.filter(e=>e.state==='RESOLVED'&&!old.slots[slot].actual_reviews.some(o=>o.canonical_entry_id===e.canonical_entry_id&&o.state===e.state))){
  if(ledger.actual[e.canonical_entry_id])continue;
  if(slot==='V'){
   const target=vmap[sid]?.[e.display_value];
   if(target!==undefined){if(sid==='SWAI-003'&&target===3)assert.ok(recovery.references.some(v=>v.relation_type==='COMPLIES_WITH'&&v.structural_proof?.kind==='TABLE_ROW_PROPOSITION'&&c.semantic_nodes.find(n=>n.node_id===v.reference_node_id)?.surface==='ADR-0003'));
    add(e.canonical_entry_id,'MATCH',[sid+':V'+target],'逐项核对：原文明确依据/符合关系或 frontmatter 指定 reference 字段，引用对象与人工 V 等价。表格来源必须包含行主体、表头和单元格，非孤立 literal。');
   }else if(sid==='SWAI-010'&&/TASK-20260522-006/u.test(e.display_value))add(e.canonical_entry_id,'PARTIAL_SUPPORT',[],'SUPERSEDES/RELATED_REFERENCE 已分别保存，但 Canonical 尚未完整表达 SUPERSEDED、current_requirement=false 及 superseded_by；不把历史依据当已满足 V0。');
   else add(e.canonical_entry_id,'UNLISTED_SOURCE_SUPPORTED',[],'来源明确声明了 REFERENCES/PREDECESSOR/RELATED_REFERENCE 或具体 commit provenance；这是有来源的附加依据，未列在此 Gold V 项，不额外加 MATCH，也不把它解释为权限。');
  }else if(slot==='C'){
   const fact=c.boundary_ir.facts.find(f=>e.boundary_fact_ids.includes(f.boundary_fact_id)),plan=recovery.completion.find(x=>x.event_node_id===fact.predicate_node_id),expression=c.boundary_ir.condition_expr_nodes.find(x=>x.expr_id===fact.condition_expr_id);assert.ok(plan?.criterion_node_ids?.length);assert.equal(expression.op,'AND');assert.equal(expression.operand_expr_ids.length,plan.criterion_node_ids.length);
   const reason=sid==='SWAI-007'?'已恢复报告分级、每条出处及 unverified 的完整列表续行；A～I 整体覆盖仍未建成 C，因此 C0 仍缺失。':sid==='SWAI-008'?'Q1～Q4 结论/证据及完整下一步建议通过验收列表原文和子树保留；查不到要明确未验证尚未成为该组合操作数，C2 不匹配。':'验收列表/表格的真实子项组成 ALL_OF/AND，保留每个完整子项、附属续行、表头/列表路径和精确来源；按组合与人工原子验收项核对，不凭标题文字计分。';
   add(e.canonical_entry_id,'MATCH',cmaps[sid].map(i=>sid+':C'+i),reason);
  }else if(sid==='SWAI-002'&&['A','O'].includes(slot)&&/test_bundled_schemas_in_sync|test_review_no_v12_features/u.test(e.display_value))add(e.canonical_entry_id,'PARTIAL_SUPPORT',[],'两个明确新增测试文件及写入动作已真实恢复，但只是 Gold schema/review 测试集合的一部分，不把局部交付冒称整个测试工作包完整匹配。');
  else if(sid==='SWAI-008'&&slot==='I'&&e.display_value==='spec/fcop-3.0-spec.md')add(e.canonical_entry_id,'MATCH',[sid+':I8'],'对比谓词局部明确使用现有 spec 文件，READ_ONLY_INPUT→SCOPE_MEMBER→ITEM 的对象身份一致；没有把所有引用文件都放入 I。');
  else if(sid==='SWAI-008'&&slot==='A')add(e.canonical_entry_id,'WRONG_BINDING',[],'对比动作及 spec 输入正确，但另一对象仍是截断的 lifecycle，尚未完整表示规范描述与实际实现之间的对比。新 I MATCH 不抵消此 A 绑定缺口。');
  else throw Error('NEEDS_ITEM_REVIEW '+sid+' '+slot+' '+e.canonical_entry_id+' '+e.display_value);
 }
 // Only explicit section-level obligations with exact output ownership are credited.
 // Embedded conditions/actions are NOT marked complete merely because the whole text is retained.
 if(sid==='SWAI-009')for(const [needle,ocr] of [['环境检查','OCR-01'],['升级到目标版本','OCR-02']]){
  const req=recovery.output_content.find(x=>x.kind==='SECTION_CONTENT_REQUIREMENT'&&x.semantic_node_ids.some(i=>c.semantic_nodes.find(n=>n.node_id===i)?.surface.includes(needle)));assert.equal(req?.ownership_status,'OUTPUT_SET');assert.equal(req.owner_output_ids.length,2);assert.equal(req.modality,'REQUIRED');
  ledger.output_content[sid+':O:'+ocr]={finding:'MATCH',matching_requirement_ids:[req.requirement_id],reason:'人工项是文档必须包含的命名章节义务；实际已生成 REQUIRED SECTION_CONTENT_REQUIREMENT，绑定同一作者头的 zh/en 两个具体输出，包含结构化子要求及精确范围。该 MATCH 不代表章节内每条运行语义已解析。'};
 }
}
fs.writeFileSync(dir+'/SEMANTIC-REVIEW-LEDGER.json',JSON.stringify(ledger,null,2)+'\n');
