# 7P-REPAIR-002 — WAITING_ADMIN_REVIEW

最终实现：`research/7plus1-parser/v0.3-7p-repair-002-r03/`。REF-001=PASS；STANDARD_PARSED=0/9，分母仅 9，SWAI-005 仍排除。程序运行、合同检查和语义匹配分开统计。

| 槽 | MATCH before→after | MISSING before→after | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS |
|---|---:|---:|---:|---:|---:|
| I | 0 → 1 | 49 → 48 | 3 → 3 | 2 → 2 | 9 → 9 |
| O | 4 → 4 | 45 → 45 | 1 → 1 | 2 → 2 | 9 → 9 |
| A | 5 → 5 | 51 → 51 | 2 → 2 | 2 → 3 | 9 → 9 |
| P | 9 → 9 | 3 → 3 | 0 → 0 | 0 → 0 | 9 → 9 |
| R | 1 → 1 | 0 → 0 | 0 → 0 | 0 → 0 | 9 → 9 |
| V | 0 → 12 | 31 → 19 | 0 → 0 | 0 → 0 | 9 → 9 |
| C | 0 → 19 | 23 → 4 | 0 → 0 | 0 → 0 | 9 → 9 |
| B | 11 → 11 | 31 → 31 | 0 → 0 | 6 → 6 | 9 → 9 |

OUTPUT_CONTENT：MATCH 0 → 2；MISSING 20 → 18。只给已形成 REQUIRED 内容章节且有两个具体输出归属的条目计 MATCH，不用整段文本收录代替内部条件解析。

## ROOT_CAUSE / MECHANISM_CHANGE

- TABLE_SEMANTICS：001 的 TABLE 隔离门阻止了明确行语义。新层读取表头、行主体、单元格及精确路径，只给具备完整结构证明的 BASIS 关系限定例外；TABLE 全域仍不开放。SWAI-003 ADR-0003=MATCH。不认识的表头保留 STRUCTURED_TABLE_UNRESOLVED。
- IO_ROLE_RESOLUTION：在局部谓词和完整文件对象之间建立 READ_ONLY_INPUT / MODIFICATION_TARGET / UPDATED_OUTPUT / GENERATED_OUTPUT 等角色；修改对象的 before/after 共用身份，补建 ITEM scope。I 只增加了一个完整 Gold MATCH，O 新增的两个测试交付仍是集合子集，未计整项 MATCH。该改善有限，不能宣称 I/O 覆盖关闭。
- REFERENCE_BASIS：frontmatter 结构字段、正文明确标记与表格行关系保存 BASED_ON / PREDECESSOR / REFERENCES / RELATED_REFERENCE / SUPERSEDES 等区别。commit provenance 要求紧邻的哈希类型参数，不能吞入括号版本号。未读外部 ADR/TASK。
- COMPLETION_LOGIC：验收列表/表格子项组成 ALL_OF/AND；显式 only-if 及 OR 保留局部操作数。列表 criterion 覆盖其真实结构子树，含缩进续行；声明条数与真实子项不符即未决，不拿验收数量填 R。
- OUTPUT_CONTENT_OWNERSHIP：独立内容要求绑定当前 authored output；同一作者头的明确双语 sibling 为 OUTPUT_SET，多候选保持未决。章节内容有独立 DISCOURSE 节点、子要求和 scope，未来 A/P/B 不升格当前槽。

源码集中在最终 revision 的 structured-recovery.mjs；eligibility.mjs 只增加受结构证明约束的依据准入与同对象多角色去重；engine.mjs 接线。projection/schema/model/Pack 未改，participant 技术词 blacklist 未扩充。全部变化通过语义节点和关系进入 IR。

## GENERALIZATION_EVIDENCE

最终专项 191 pass / 0 fail；原 Parser 739 pass / 0 fail。全量结果见 TESTS.json，skip 单列，未把 skip 算 PASS。69 条初始非 Gold 文本、5 条续行、5 条错误 commit 附着变体均有真实 NLP 信号，旧 41 条语义和 001 机制、history/export/共享入口回归保留。

## KNOWN_REMAINING_FAILURES

FIRST_DIVERGENCE：SWAI-001 的模块—方法集合仍未完整成为输入和更新交付。I/O 组合对象、条件交付、完整 reference 定位、带时间效力的 supersedes，以及大部分输出内部复合行为仍有缺口。SWAI-008 的 spec 输入恢复，但对比的另一对象仍被截断为 lifecycle，单独记 A WRONG_BINDING，不因 I 改善掩盖。

保持 P/R 防污染与 >=7 天阈值；REF-001 “上述材料”的真实歧义继续保留。源码支持但人工 Gold 未列的附加 reference 标为 UNLISTED_SOURCE_SUPPORTED；部分完成标 PARTIAL_SUPPORT，不贡献 MATCH。逐条实际 IR、人工条目与证据见 COMPARISON.json；缺口见 FAILURES.json。

## 候选记录及冻结

最初候选 runtime v0.3-7p-repair-002、首次 replay/ 及 FIRST-CANDIDATE-* 原字节保留；续行候选 runtime -r02、final-run/ 也保留。最终为 -r03 与 final-candidate/。中间候选不作为最终验收实现；其缺陷分别为列表续行遗漏及 commit 参数类型/附着过宽。最终冻结后仅进行测试与离线审阅，没有修改运行代码追分。

旧 58618 没有自动切换。停止旧端口服务后，新启动命令：

```sh
cd D:\boundx
node research/7plus1-parser/v0.3-7p-repair-002-r03/server.mjs
```

CLI/server/UI 共用本 revision parse7Plus1；未做 UI 重构。旧复制 README 中的初始候选命令不代表最终交付入口，以上命令为本报告最终入口。

Parser 修改=true；Gold/Source/BXP/Pack/模型/阈值修改=false；PRODUCTION_READY=false。仅推送 review/7plus1-parser，不合并 main、不发版、不打 tag。完成封存后停止等待 ADMIN Review。
