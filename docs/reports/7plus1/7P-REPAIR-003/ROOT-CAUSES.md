# 7P-REPAIR-003 根因与实现边界

执行基线为 review/7plus1-parser 的 5372051bc4e3fc07f6283289ec1d5ea31f972805；语义比较基线为 7ccdcc349aba616e8952fab7755d8ab23c73819e。完整读取 CURRENT-TASK、任务书及其引用的 v0.3 规范后执行。

最终源码位于 research/7plus1-parser/v0.3-7p-repair-003-r03/；以下均为通用机制，Source、Gold、模型、阈值和 Pack 不变。

- **对象身份与组成**：原 structured-recovery.mjs 的 artifactPattern 以扩展名为主，不能完整表达父文件与方法集合。graph-closure.mjs 将 protected inline-code 实体组合为带 PART_OF 证明的 Qualified Members 对象；before/after 共用该身份。不能将整个父文件作为一个无限定输入来代替成员限定。
- **局部论元闭合**：原 NLP clause 可在反引号内部的逗号/点号处分裂。新的保护跨度恢复限于实际同一文档块；compare 的左右操作数、组成成员与证据一并保留。不会搜索任意邻近文本补参数。
- **列表结构**：开放补语只能消费显式冒号与缩进支持的名词列表。嵌套路径保留组成关系；带谓词或问句的列表项不是父谓词对象。
- **不变与禁止**：NO_CHANGE 表示 RESTRICT(change(target))，仅使用既定模态；完整目标、文件类别的 ALL、组合 UNION 均有关系来源。破折号前独立限定语与后半句目标分开；前缀作用域不能唯一确认时仍未决。
- **输出内容**：在既有 owner_output_ids 下保留局部节点、关系、条件、数量及未决项；括号内完整否定指令具有独立 syntactic_layer_id。现有 domain eligibility 继续阻止未来动作进入当前 A/P/B。
- **coverage**：coverage-locality.mjs 原先在父级聚合时重新引入子级已排除的影响。现在父级读取子级影响集合；显式 ACCEPTANCE、OUTPUT_CONTENT 和已知 typed endpoint 按合同限定影响。无法限定影响的真实未知区域仍保守保留，不通过缩小 affected_slots 制造 ABSENT。
- **投影视图**：graph-queries.mjs 显式提供 QI–QB，只读取已认证图及类型/模态属性；projection.mjs 继续确定性形成 Canonical Entry。模型和原文不进入 Q。
- **未决注册表身份**：frontend.mjs 原闭包 unknown() 保存初始数组，而后续过滤赋值可能使新诊断写入旧数组。新 revision 保持单一活跃注册表，避免悬空 unresolved/proof 引用。

## 保留的候选

首个 003 候选发现 NO_CHANGE 跨破折号扁平化、Qualified Members 被扩大成父文件输入的问题。r02 修复这两点，但仍暴露非名词子项借为对象、论元未闭合就提升模态的问题。r03 收紧这些规则，并补充反例。三个候选的实现摘要、首次真实模型输出及测试记录分目录保存，不覆盖前次结果。

这些改进不构成完整语义闭合。复杂 API 行为、条件与结果组合、完整 OUTPUT_CONTENT 操作序列仍有缺口；最终数量和首处剩余偏离以 COMPARISON.json、FAILURES.json、FIRST-DIVERGENCE.json 为准。
