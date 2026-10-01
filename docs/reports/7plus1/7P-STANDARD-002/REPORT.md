# 7P-STANDARD-002：人工标准落库与冻结 actual 对照

STATUS=WAITING_ADMIN_REVIEW
STANDARD_GOLD=10/10
STANDARD_PARSED=0/10
PARSER_MODIFIED=false
GOLD_SOURCE_MODIFIED=false
BXP_PROTOCOL_MODIFIED=false
REF_001_MODIFIED=false
MAIN_MERGED=false
RELEASED=false
PRODUCTION_READY=false

人工答案先原样钉死，再对照 7P-STANDARD-001 的既有实际输出，没有重跑 Parser，没有修复。程序运行 COMPLETE=10/10 与语义完整正确 0/10 分开。所有10份仍为 GOLD_7PLUS1_CONFIRMED；没有降级标准。当前没有样本晋级 STANDARD_PARSED_SAMPLE。REF-001 保持原确认状态与字节。

机器与人读答案保留原 bullet、嵌套输入函数、AND 完成集、显式模态/角色、>=7天阈值、superseded 失效信息；逐份校验 JSON/MD 与 ADMIN 原文一致。所有source逐字节与冻结候选一致，不读旧 Gold 生成答案。

|样本|Source SHA-256|STANDARD_PARSED_SAMPLE|
|---|---|---|
|SWAI-001|c753ba96dea69aa9d92a9f53d84724b77391b5f8f3ca948f045b3c6c490e2869|false|
|SWAI-002|2c844c38f858e89a8534202011d780a389cb542c2896e5162244662b58e04642|false|
|SWAI-003|a3a205c6a074878be56715c8099781fcaabd215c416c2daee89f386034be187f|false|
|SWAI-004|38ad20b6f941101247abd013fcf0760641a58f5901a6494308df175faf9261c8|false|
|SWAI-005|f34c2fb2578312a6a97a2d3904dfd967d40089244e71e4ec73725cda47c648c0|false|
|SWAI-006|687cc24af6a868a30b23b9c2e571ed1664a0c27d3a4768c0b99f3bbad806c645|false|
|SWAI-007|b76d7f064f9e3d18a2337922a3a1e50e824b679b6a11924de8b62a0f97c8a797|false|
|SWAI-008|620f1984b13af56a3ef7a88dfd19b46da4fd71ded6817b36aaed00c8cd7cafaf|false|
|SWAI-009|bd7171221e72883dc45f52cb5f090f96bac8bc6ada30178c5f4d68f532430d62|false|
|SWAI-010|3b253ea59ea1878e7db5c1f9f5cb79cd3dc902d8957587ad0ba197d6017f56d6|false|

计数为逐项 finding，不是错误样本数；一条可能与另一槽位部分关联，不能相加得到准确率。未决条目未作为 FALSE_DEFINED。部分支持、原文明确但人工未列条目另行记录，不仅凭显示文案不同判断失败。

|Slot|MATCH|MISSING|FALSE_DEFINED|WRONG_BINDING|WRONG_STATUS|
|---|---:|---:|---:|---:|---:|
|I|0|55|5|3|10|
|O|0|54|1|2|10|
|A|1|65|5|9|10|
|P|0|15|25|9|10|
|R|0|1|8|0|10|
|V|0|32|0|0|10|
|C|0|27|0|0|10|
|B|0|54|1|10|10|

SWAI-007 给出建议与人工给出合规建议的局部动作按语义同义匹配；槽位其他动作、角色和状态依然不符。SWAI-006 显式路径有部分正确模态，但当前事实没有 git add/commit阶段语义，不能把证据文本补当已生成 IR。

## ADMIN_ADJUDICATION_CONFLICT

SWAI-003 V [7042,7055) `符合 ADR-0003 |`：原文明确写符合 ADR-0003；人工 V 清单未列 ADR-0003。保留双方原样，交 ADMIN 确认是否有意省略；不据此认定该引用是幻造。 expected 不变，等待 ADMIN；不将来源支持的 ADR 引用判为幻造。

SWAI-007 不冒充 ADMIN 是原文支持的额外细项，不因未列人工答案而自动判幻造，也不替代禁止自命 PM/AUDITOR 的完整范围。010 未观察到旧固定版本作为有效当前要求；这里只记录 supersedes 结构未产出，不虚构错误。

## 共性 first-divergence / 根因候选

以下8项是结构证据和真实实现路径支持的候选，不是本轮已定位修复的结论；实际运行 first_divergence 仍保存在原 run summary。没有仅凭首个未决列表顺序宣称已证明因果。

- RC1 文档层级/格式残片进入语义；重复样本 SWAI-001, SWAI-002, SWAI-003, SWAI-005, SWAI-008, SWAI-009, SWAI-010。标题、代码、表格、引用片段没有可靠保持话语层，##/**/后剩成为主体或谓词。 查看 research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/frontend.mjs:39。
- RC2 类型/字面量边界识别；重复样本 SWAI-002, SWAI-003, SWAI-004, SWAI-007, SWAI-010。/7、截断路径、字段列表成为路径；版本比较被数量化。 查看 research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/frontend.mjs:20。
- RC3 参与者身份与论元类型；重复样本 SWAI-001, SWAI-002, SWAI-003, SWAI-004, SWAI-005, SWAI-006, SWAI-007, SWAI-008, SWAI-009, SWAI-010。SRL AGENT 被自动打 PERSON/PERFORMER；eligibility.mjs:19 再产生 P；普通名词、命令、代词没有角色身份约束。 查看 research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/frontend.mjs:64。
- RC4 输入与交付/待实现对象区分；重复样本 SWAI-002, SWAI-004, SWAI-005, SWAI-007, SWAI-010。已有输入、待构造对象、否定存在与验收状态未稳定区分；九条 O 为空，一条 O 有错误结果绑定。 查看 research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/eligibility.mjs:7。
- RC5 数量用途/目标与 R 资格；重复样本 SWAI-002, SWAI-003, SWAI-007, SWAI-010。LIMIT 直接产生 RESOURCE；测试数量/清单数量冒入 R，真正 >=7天无回应阈值缺失。 查看 research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/eligibility.mjs:20。
- RC6 模态极性/嵌入指令/有效性；重复样本 SWAI-003, SWAI-005, SWAI-008, SWAI-009, SWAI-010。可能后果、调查假设、prompt 中指令升为任务动作；不应该触发转 REQUIRED。010 superseded 未有有效版本事实，未观察到旧==3.0.2被重新激活，不能虚报该错误。 查看 research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/frontend.mjs:45。
- RC7 复合动作/条件/完成集作用域；重复样本 SWAI-001, SWAI-003, SWAI-004, SWAI-005, SWAI-006, SWAI-008, SWAI-009, SWAI-010。both-exist/dry-run、局部不写盘、版本锁定==、每步报告且停、AND验收集合未完整绑定；scope ITEM 不能替代这些逻辑。 查看 research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/expressions.mjs:64。
- RC8 依据引用/覆盖与 slot 状态闭环；重复样本 SWAI-001, SWAI-002, SWAI-003, SWAI-004, SWAI-005, SWAI-006, SWAI-007, SWAI-008, SWAI-009, SWAI-010。V 九条空、C 九条空一条未决；所有80槽状态不等价。coverage 状态诚实暴露缺口，不应为通过改状态。003额外ADR依据须 ADMIN 裁定。 查看 research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/projection.mjs:9。

## 校验与边界

VERIFY.json 记录源/标准表达一致性、冻结候选及 REF-001、历史资产、实现/模型/Pack/BXP摘要校验。MANIFEST.json 记录本次全部新增文件摘要，自身不自哈希。comparison 中逐个实际条目有引用链，逐个人工条目有对应或缺失记录；SLOT-SUMMARY.json 由此机械汇总。审阅 ledger 是离线判断资料，未接入 Parser，没有源偏移/实体或样本特判进入执行代码。

工作区与 review Base 的17个历史治理/文档文件存在既有差异，已逐个核对在 STANDARD-001/BASELINE.json 中记录过；不恢复、不带入提交，不把它们冒称逐字节一致。真实冻结实现及其2825项依赖/封存核验通过，当前 Parser/BXP运行文件与 Base 原始 blob 一致。本轮实际改动清单以独立 index 的 CHANGED-FILES.txt 为准。

提交仅 standard 数据、任务书和本报告目录；使用指定 Base 的独立 Git index，不带入其他未提交修改。推送 review/7plus1-parser，停止等待 ADMIN Review，不开启修复/下一阶段。
