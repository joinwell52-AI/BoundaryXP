// Read-only post-freeze semantic review. Never imported by the Parser.
import fs from'node:fs';const d='docs/reports/7plus1/7P-REPAIR-005',old='docs/reports/7plus1/7P-REPAIR-004',put=(n,x)=>fs.writeFileSync(d+'/'+n,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const ledger=JSON.parse(fs.readFileSync(old+'/SEMANTIC-REVIEW-LEDGER.json'));
ledger.actual={
 'p1:0565fbc2225e98bdf40515de':{decision:'PARTIAL_SUPPORT',expected_entry_refs:['SWAI-001:I1'],reason:'原文明示 active 路径；实际有 INPUT_OF 和单项 scope，原文范围正确。但尚未形成对应 task/report/issue 文件集合及其 archive 配对，不等价于完整人工 I1。RESOLVED 仅支持局部路径事实，不计 MATCH。'},
 'p1:28f650e1b6ddbe5ec9cf6d93':{decision:'PARTIAL_SUPPORT',expected_entry_refs:['SWAI-001:I1'],reason:'原文明示 archived 路径；实际有 INPUT_OF 和单项 scope，原文范围正确。但泛称 archived 尚未绑定 log/archive 下各 writer 文件集合，不计完整 I1 MATCH。'},
 'p1:cfef62ff915c782f4ee328dc':{decision:'PARTIAL_SUPPORT',expected_entry_refs:['SWAI-001:A1','SWAI-001:A2','SWAI-001:A3'],reason:'SRL 看 的 ARG1 与 UNION 保存 active/archived 双成员，控制框架保留 next_seq 及上层修改目标。最终 ACTION 仍未携带各 writer 与其目录组合的受控计算关系；局部 REQUIRED 看 双路径不等价于三个 writer 的完整 union-scan 修复，不计 A MATCH。'}
};ledger.note='Only newly projected resolved entries are reviewed here. Prior review reuse additionally requires exact canonical/fact/expression equality in UNCHANGED-ENTRY-EVIDENCE.json. PARTIAL_SUPPORT is never MATCH.';put('SEMANTIC-REVIEW-LEDGER.json',ledger);
let s=fs.readFileSync(old+'/compare.mjs','utf8').replaceAll("const dir='docs/reports/7plus1/7P-REPAIR-004'","const dir='docs/reports/7plus1/7P-REPAIR-005'").replaceAll("task:'7P-REPAIR-004'","task:'7P-REPAIR-005'").replaceAll('docs/reports/7plus1/7P-REPAIR-003/','docs/reports/7plus1/7P-REPAIR-004/');
s=s.replace("const ledger=read(dir+'/SEMANTIC-REVIEW-LEDGER.json');","const ledger=read(dir+'/SEMANTIC-REVIEW-LEDGER.json'),equivalence=read(dir+'/UNCHANGED-ENTRY-EVIDENCE.json').equivalence;");
s=s.replace("else if(oldReview&&oldReview.state==='RESOLVED')","else if(oldReview&&oldReview.state==='RESOLVED'&&equivalence.find(x=>x.sample_id===id).entry_checks.some(x=>x.entry_id===e.canonical_entry_id&&x.slot===slot&&x.canonical_and_fact_unchanged))");
s=s.replace('WRONG_STATUS:0','WRONG_STATUS:0,PARTIAL_SUPPORT:0');s=s.replaceAll("['FALSE_DEFINED','WRONG_BINDING'].includes(r.decision)","['FALSE_DEFINED','WRONG_BINDING','PARTIAL_SUPPORT'].includes(r.decision)");
put('compare.mjs',s);
put('table-audit.mjs',fs.readFileSync(old+'/table-audit.mjs','utf8').replaceAll('7P-REPAIR-004','7P-REPAIR-005').replaceAll('/PARSER-RUNS.json','/RUNS.json'));
