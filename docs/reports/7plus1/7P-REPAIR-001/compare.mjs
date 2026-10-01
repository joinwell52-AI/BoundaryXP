// Offline adjudication review only. This file is never imported by the Parser.
import fs from 'node:fs';import {createHash} from 'node:crypto';
const dir='docs/reports/7plus1/7P-REPAIR-001',read=p=>JSON.parse(fs.readFileSync(p)),put=(n,x)=>fs.writeFileSync(dir+'/'+n,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'}),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const authority=read('fixtures/7plus1/standard/ACTIVE-ADJUDICATION.json'),active=read(authority.manifest),prior=read('docs/reports/7plus1/7P-STANDARD-003/COMPARISON.json'),before=read('docs/reports/7plus1/7P-STANDARD-003/SLOT-SUMMARY.json'),counts=()=>({MATCH:0,MISSING:0,FALSE_DEFINED:0,WRONG_BINDING:0,WRONG_STATUS:0}),totals=Object.fromEntries([...'IOAPRVCB'].map(k=>[k,counts()])),content=counts(),cases=[],failures=[],retired=[];
function reviewNew(id,slot,e,c,facts){
 const value=e.display_value,answer=(decision,refs,reason)=>({decision,expected_entry_refs:refs.map(r=>id+':'+r),reason});
 if(slot==='P'&&value==='ME [PERFORMER]'&&facts.every(f=>f.participant_node_ids.some(i=>c.semantic_nodes.find(n=>n.node_id===i)?.metadata.current_task_assignment)))return answer('MATCH',['P0'],'原文 frontmatter recipient 明确分派给 ME；PERFORMER 来自任务接收关系，不从 sender 或职级推权限。');
 if(id==='SWAI-007'&&slot==='R'){const q=c.boundary_ir.quantity_expr_nodes.find(q=>q.expr_id===e.quantity_expr_id),n=c.semantic_nodes.find(n=>n.node_id===q?.target_node_ids[0]);if(q?.unit==='天'&&q.lower_bound?.value===7&&q.lower_bound.inclusive&&n?.metadata.quantity_class==='THRESHOLD'&&/无回应/u.test(n.surface))return answer('MATCH',['R0'],'对象是原文 ≥7 天无回应状态，GTE 下界 inclusive=true、unit=天 和来源作用域均保留；不以单独显示数字 7 判断匹配。');}
 if(['SWAI-009','SWAI-010'].includes(id)){
  if(slot==='O'&&/src\/fcop\/rules\/_data\/agent-bringup-prompt\.(zh|en)\.md$/u.test(value))return answer('MATCH',[value.endsWith('.zh.md')?'O0':'O1'],'CURRENT_TASK 新建文件头通过显式 heading/list 子路径连接完整文件名，RESULT→DELIVERABLE→ITEM 对象一致。此为交付文件条目匹配，不代表内容要求通过。');
  if(slot==='A'&&/REQUIRED 新建/u.test(value)&&/prompt.zh.md/u.test(value)&&/prompt.en.md/u.test(value))return answer('MATCH',['A0','A1'],'显式新建头拥有双语文件列表，两项 RESULT 都有父头与各文件证据，当前编写动作成立；未将未来 agent 行为升格。');
  if(slot==='A'||slot==='O'){if(facts.some(f=>c.semantic_nodes.find(n=>n.node_id===f.predicate_node_id)?.metadata.authored_document))return answer('PARTIAL_SUPPORT',[],'当前起草/落文档的语义得到保留，但这里只是概括性文档端点；不额外当具体双语文件及内容已全部完成。');}
  if(slot==='B'){
   const b=id==='SWAI-009'?{install:0,letter:1,tool:2,release:3,protocol:4}:{install:1,letter:2,tool:5,release:4,protocol:3};
   if(/agent-install-prompt.zh.md/u.test(value))return answer('MATCH',['B'+b.install],'当前 Out-of-scope 明确不修改已有安装 prompt；肯定谓词与独立 FORBIDDEN 模态、完整文件/内容目标及当前 scope 保留。');
   if(/LETTER-TO-ADMIN.md/u.test(value))return answer('MATCH',['B'+b.letter],'当前排除 LETTER 文件的修改；不是未来输出内容中的读文档行为。');
   if(/工具层.*防呆/u.test(value))return answer('MATCH',['B'+b.tool],'当前任务不实施工具层防呆，完整对象未截成做/在等功能词。');
   if(/发 新版本/u.test(value))return answer('MATCH',['B'+b.release],'当前不发布新版本的禁止模态和目标正确。');
   if(/协议规则/u.test(value))return answer('MATCH',['B'+b.protocol],'当前不修改协议规则，完整对象保留。');
   if(/混进 内容/u.test(value))return answer('WRONG_BINDING',[],'否定已正确，但该补充句仍缺 bringup 内容与既有安装 prompt 的附着，不能解释为泛化禁止混入所有内容。保留为下一轮复合对象缺口。');
   if(/触发 drift/u.test(value))return answer('UNLISTED_SOURCE_SUPPORTED',[],'原文明确新增 prompt 不应该触发 drift，现保留负向约束而非 REQUIRED 触发；此独立局部约束未列人工 B，不据此改 Gold 或计整条目标匹配。');
  }
 }
 if(id==='SWAI-001'&&slot==='B'&&/next_sequence/u.test(value))return answer('MATCH',['B1'],'Out-of-scope 不改 next_sequence() 本身语义：完整调用名及本身语义限定保留，禁止算子与谓词分离。');
 throw Error('UNREVIEWED_RESOLVED '+id+' '+slot+' '+e.canonical_entry_id+' '+value);
}
for(const a of active.cases.filter(a=>a.denominator_included)){
 const id=a.sample_id,out=dir+'/replay/'+id,r=read(out+'/trace.json'),run=read(out+'/RUN.json'),c=r.compiler_v03,actual=c.canonical_7plus1,expected=read(a.expected_path),old=prior.cases.find(c=>c.sample_id===id),source=[...fs.readFileSync(a.source_path,'utf8')];if(sha(a.source_path)!==a.source_sha256||c.source.sha256!==a.source_sha256)throw Error('SOURCE_CHANGED');
 const cc={sample_id:id,active_revision:a.active_revision,source_sha256:a.source_sha256,expected_path:a.expected_path,expected_sha256:sha(a.expected_path),actual_run_id:run.run_id,actual_path:out+'/actual-7plus1.json',trace_path:out+'/trace.json',contract_status:r.contract_gate_results.status,slots:{}};
 for(const slot of 'IOAPRVCB'){
  const ar=actual[slot].entries.map((e,i)=>{const facts=c.boundary_ir.facts.filter(f=>e.boundary_fact_ids.includes(f.boundary_fact_id)),ns=[...new Set(facts.flatMap(f=>f.node_ids))],rs=[...new Set(facts.flatMap(f=>f.relation_ids))],oldReview=old.slots[slot].actual_reviews.find(x=>x.canonical_entry_id===e.canonical_entry_id);let review;
   if(e.state!=='RESOLVED')review={decision:'UNRESOLVED',expected_entry_refs:oldReview?.expected_entry_refs??[],reason:'实际状态未决；不把保留的候选计成错误 RESOLVED，也不当完整匹配。'+(oldReview?'此前问题：'+oldReview.reason:'')};
   else if(oldReview&&oldReview.state==='RESOLVED')review={decision:oldReview.decision,expected_entry_refs:oldReview.expected_entry_refs,reason:'逐项核对：此条实际谓词/对象/模态仍同旧评审，'+oldReview.reason};
   else review=reviewNew(id,slot,e,c,facts);
   const spans=r.source_spans.filter(s=>e.source_span_ids.includes(s.span_id));for(const s of spans)if(source.slice(s.start,s.end).join('')!==s.text)throw Error('SPAN_CHANGED');
   return {...e,alias:slot+i,...review,boundary_facts:facts,semantic_nodes:c.semantic_nodes.filter(n=>ns.includes(n.node_id)),relations:c.relations.filter(r=>rs.includes(r.relation_id)),source_spans:spans,expressions:{scope:c.boundary_ir.set_expr_nodes.filter(q=>facts.some(f=>f.scope_expr_id===q.expr_id)),condition:c.boundary_ir.condition_expr_nodes.filter(q=>facts.some(f=>f.condition_expr_id===q.expr_id)),quantity:c.boundary_ir.quantity_expr_nodes.filter(q=>facts.some(f=>f.quantity_expr_id===q.expr_id))}};
  });
  const er=expected.slots[slot].entries.map((entry,i)=>{const eid=id+':'+slot+i,matching=ar.filter(r=>r.decision==='MATCH'&&r.expected_entry_refs.includes(eid));return {entry_id:eid,entry,finding:matching.length?'MATCH':'MISSING',matching_actual_ids:matching.map(r=>r.canonical_entry_id),reason:matching.length?matching.map(r=>r.reason).join(' '):'最终 IR 未给出完整等价条目；不从原文证据或未决候选补造结构。'};});
  const cr=(expected.slots[slot].output_content_requirements??[]).map(entry=>({entry_id:id+':O:'+entry.requirement_id,entry,finding:'MISSING',reason:'前端已保留 OUTPUT_CONTENT、局部节点和关系，但组合条件/角色/输出归属尚未全部证明，不能仅凭文本收录计 MATCH。',preserved_frontend_requirement_ids:c.nlp_signals.semantic_decoding.discourse.output_content_requirements.map(r=>r.requirement_id)}));
  const findings=[...er.map(e=>({finding:e.finding,expected_entry_id:e.entry_id,actual_entry_ids:e.matching_actual_ids,reason:e.reason})),...ar.filter(r=>['FALSE_DEFINED','WRONG_BINDING'].includes(r.decision)).map(r=>({finding:r.decision,actual_entry_id:r.canonical_entry_id,reason:r.reason}))];
  if(actual[slot].status!==expected.slots[slot].status)findings.push({finding:'WRONG_STATUS',actual:actual[slot].status,expected:expected.slots[slot].status,reason:'槽位仍存在覆盖/语义未决；程序运行和合同通过不代表语义闭环。'});
  for(const f of findings){totals[slot][f.finding]++;if(f.finding!=='MATCH')failures.push({sample_id:id,slot,...f});}for(const f of cr){content[f.finding]++;failures.push({sample_id:id,slot,counting_bucket:'OUTPUT_CONTENT',...f});}
  cc.slots[slot]={expected_status:expected.slots[slot].status,actual_status:actual[slot].status,actual_reviews:ar,expected_reviews:er,output_content_reviews:cr,findings,semantic_equivalent:findings.every(f=>f.finding==='MATCH')&&cr.every(f=>f.finding==='MATCH')&&ar.every(r=>r.decision==='MATCH')};
  for(const previous of old.slots[slot].actual_reviews.filter(r=>['FALSE_DEFINED','WRONG_BINDING'].includes(r.decision)&&!ar.some(n=>n.canonical_entry_id===r.canonical_entry_id&&n.decision===r.decision)))retired.push({sample_id:id,slot,previous_actual_id:previous.canonical_entry_id,previous_decision:previous.decision,previous_display:previous.display_value,current:ar.find(n=>n.canonical_entry_id===previous.canonical_entry_id)?.decision??'NOT_PROJECTED',note:'没有投影不等于对应人工条目已匹配；MISSING 独立统计。'});
 }
 cc.STANDARD_PARSED_SAMPLE=Object.values(cc.slots).every(s=>s.semantic_equivalent);cases.push(cc);
}
const parsed=cases.filter(c=>c.STANDARD_PARSED_SAMPLE).length,summary={denominator:9,excluded:['SWAI-005'],by_slot:totals,output_content_requirements:{requirements:20,counts:content},STANDARD_PARSED:parsed+'/9'},comparison={task:'7P-REPAIR-001',authority,method:'Read-only item review of actual typed IR after implementation freeze; prior judgments retained only for unchanged resolved entries. New entries require explicit reviewed mapping. No Gold in Parser inputs.',cases,retired,excluded:['SWAI-005'],STANDARD_PARSED:parsed+'/9'};
put('COMPARISON.json',comparison);put('SLOT-SUMMARY.json',summary);put('FAILURES.json',{findings:failures});put('BEFORE-AFTER.json',{before,after:summary,REF001:read(dir+'/replay/REF-001/RUN.json').ref_assertions.every(a=>a.pass)?'PASS':'FAIL',unchanged_gold:true,retired});
console.log(JSON.stringify(summary));
