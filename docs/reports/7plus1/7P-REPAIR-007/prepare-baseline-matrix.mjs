// Read-only derivation from the sealed 006 review. Does not run or modify Parser.
import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const root='docs/reports/7plus1/7P-REPAIR-006',out='docs/reports/7plus1/7P-REPAIR-007',hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),comparison=read(root+'/COMPARISON.json');
const rows=comparison.cases.map(c=>{const slots=Object.fromEntries(['I','O','A'].map(k=>{const s=c.slots[k];return[k,{complete_match:s.semantic_equivalent===true,matched_entries:s.expected_reviews.filter(e=>e.finding==='MATCH').length,required_entries:s.expected_reviews.length,missing_expected_ids:s.expected_reviews.filter(e=>e.finding!=='MATCH').map(e=>e.entry_id),actual_status:s.actual_status,expected_status:s.expected_status,false_defined:s.actual_reviews.filter(e=>e.decision==='FALSE_DEFINED').length,wrong_binding:s.actual_reviews.filter(e=>e.decision==='WRONG_BINDING').length,actual_path:c.actual_path,trace_path:c.trace_path}];}));return{sample_id:c.sample_id,source_sha256:c.source_sha256,slots,I_MATCH:slots.I.complete_match,O_MATCH:slots.O.complete_match,A_MATCH:slots.A.complete_match,joint_complete_match:['I','O','A'].every(k=>slots[k].complete_match),scope_binding_proof_status:'NOT_REASSESSED_BASELINE_ONLY'};});
assert.equal(rows.length,9);
const data={task:'7P-REPAIR-007',status:'PREPARATION_ONLY_AWAITING_TASKBOOK',baseline_commit:'d2de84a97c415d02b9f2087afedbff4276a69287',authority_comparison:root+'/COMPARISON.json',authority_sha256:hash(root+'/COMPARISON.json'),derivation:'Reuse sealed 006 per-slot complete semantic-equivalence judgments without changing any prior review, Parser, source, expected or replay.',denominator:9,excluded:['SWAI-005'],joint_complete_matches:rows.filter(r=>r.joint_complete_match).length,success_contract:{minimum_joint_complete_cases:1,required:'At least one same STANDARD case has I_MATCH && O_MATCH && A_MATCH and a verified common task-node scope/binding chain.',component_count_growth_is_sufficient:false,tests_or_contract_pass_is_sufficient:false,zero_joint_matches_allows_completion:false,required_evidence:['9-case per-case I/O/A matrix','Source to graph to Boundary IR to canonical proof for first joint MATCH','Shared task-node and object/artifact identity','Exact scope, binding and source spans']},rows};
fs.writeFileSync(out+'/BASELINE-IOA-MATRIX.json',JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const table=rows.map(r=>`| ${r.sample_id} | ${r.slots.I.matched_entries}/${r.slots.I.required_entries} | ${r.slots.O.matched_entries}/${r.slots.O.required_entries} | ${r.slots.A.matched_entries}/${r.slots.A.required_entries} | ${r.I_MATCH} | ${r.O_MATCH} | ${r.A_MATCH} | ${r.joint_complete_match} |`).join('\n');
fs.writeFileSync(out+'/BASELINE-IOA-MATRIX.md',`# 007 联合完整匹配基线

这是封存 006 的只读派生，尚未执行 007 实现。当前 joint complete match = **${data.joint_complete_matches}/9**。

各分数是人工条目的局部匹配数量；I_MATCH / O_MATCH / A_MATCH 是该样本该槽的完整语义匹配判断，不能用局部命中代替。基线沿用 006 原判断，没有重新审定 Gold 或改写结果。

| STANDARD | I 条目 | O 条目 | A 条目 | I_MATCH | O_MATCH | A_MATCH | Joint |
|---|---:|---:|---:|---|---|---|---|
${table}

007 完成必须至少出现一个同一样本的 I_MATCH && O_MATCH && A_MATCH，并提供共同任务节点、工件身份、scope/binding 和原文来源证据链。joint 仍为 0/9 时不得声明完成。单槽增长、专项和全量回归通过均不能替代此门槛。

当前本地及远端 CURRENT-TASK 仍指向 006，未找到 007 任务书。本文件仅准备验收基线，不变更任务指针或自行确定实现方法。
`,{flag:'wx'});
console.log({rows:rows.length,joint:data.joint_complete_matches+'/9',parser_changed:false,prior_review_changed:false});
