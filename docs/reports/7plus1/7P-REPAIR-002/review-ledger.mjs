// Offline ADMIN-comparison evidence only; never imported by any parser entrypoint.
import fs from'node:fs';
const dir='docs/reports/7plus1/7P-REPAIR-002',read=p=>JSON.parse(fs.readFileSync(p));
const actual={};
const add=(id,decision,expected_entry_refs,reason)=>actual[id]={decision,expected_entry_refs,reason};
add('p1:a5ec9f5ae314895324a2f0b5','MATCH',['SWAI-001:V0'],'frontmatter references 字段明确引用完整 ISSUE 文件名，保留 REFERENCES 类型与字段及值跨度。');
add('p1:9cf7809df00a855de76a02aa','MATCH',['SWAI-001:V1'],'frontmatter references 的同一列表项明确引用完整前序 TASK 文件名，来源关系完整。');
add('p1:57bfec9b63a5d635dc2ec1b3','PARTIAL_SUPPORT',[],'引用文件已恢复，但对应代码行号仍只在原文证据，未成为结构化定位；不把 V2 计完整匹配。');
add('p1:bfc818e98d3dea348a7d049d','MATCH',['SWAI-001:C0','SWAI-001:C1','SWAI-001:C2','SWAI-001:C3'],'验收标题拥有四个真实列表 STATE 子项；ALL_OF 编译为 AND，分别完整保留新测试、587 passed、ruff、两个人工 rename 文件保护条件及同一组合归属。');
const output_content={};
fs.writeFileSync(dir+'/SEMANTIC-REVIEW-LEDGER.json',JSON.stringify({method:'Explicit offline review of actual typed structures; no runtime dependency',actual,output_content},null,2)+'\n');
