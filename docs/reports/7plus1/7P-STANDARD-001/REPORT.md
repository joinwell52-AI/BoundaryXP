# 7P-STANDARD-001：第一批人工标准样本审定输入

STATUS=WAITING_ADMIN_ADJUDICATION
SOURCE_ACQUIRED=10/10
PARSER_MODIFIED=false
GOLD_MODIFIED=false
BXP_MODIFIED=false
REF_001_MODIFIED=false
EXPECTED_7PLUS1_CREATED=false
PRODUCTION_READY=false

Base: f062dd5b7ef9e6beeca0f4460f51ffc4225f6338
Branch: review/7plus1-parser

## 来源与实际输出

仅根据历史 ACTIVE-REVISIONS.json 与该 revision MANIFEST.json 确定源文件，源字节/摘要与指定Base一致；原始source目录及历史审定目录均不改。原始TASK前置元数据、正文、代码段和格式全部保留，未摘要、改写或执行其业务指令。历史Gold只记录路径，不读取其内容生成标准答案。

| 候选 | 历史 Case | ACTIVE | Source SHA-256 | 运行状态 | Parser状态 | actual 7+1 |
|---|---|---|---|---|---|---|
| SWAI-001 | REAL-GOLD-003 | rev2 | c753ba96dea69aa9d92a9f53d84724b77391b5f8f3ca948f045b3c6c490e2869 | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-001/parser-actual-7plus1.json) |
| SWAI-002 | REAL-GOLD-015 | rev3 | 2c844c38f858e89a8534202011d780a389cb542c2896e5162244662b58e04642 | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-002/parser-actual-7plus1.json) |
| SWAI-003 | REAL-GOLD-017 | rev3 | a3a205c6a074878be56715c8099781fcaabd215c416c2daee89f386034be187f | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-003/parser-actual-7plus1.json) |
| SWAI-004 | REAL-GOLD-019 | rev3 | 38ad20b6f941101247abd013fcf0760641a58f5901a6494308df175faf9261c8 | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-004/parser-actual-7plus1.json) |
| SWAI-005 | REAL-GOLD-025 | rev5 | f34c2fb2578312a6a97a2d3904dfd967d40089244e71e4ec73725cda47c648c0 | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-005/parser-actual-7plus1.json) |
| SWAI-006 | REAL-GOLD-032 | rev3 | 687cc24af6a868a30b23b9c2e571ed1664a0c27d3a4768c0b99f3bbad806c645 | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-006/parser-actual-7plus1.json) |
| SWAI-007 | REAL-GOLD-033 | rev3 | b76d7f064f9e3d18a2337922a3a1e50e824b679b6a11924de8b62a0f97c8a797 | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-007/parser-actual-7plus1.json) |
| SWAI-008 | REAL-GOLD-046 | rev2 | 620f1984b13af56a3ef7a88dfd19b46da4fd71ded6817b36aaed00c8cd7cafaf | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-008/parser-actual-7plus1.json) |
| SWAI-009 | REAL-GOLD-049 | rev2 | bd7171221e72883dc45f52cb5f090f96bac8bc6ada30178c5f4d68f532430d62 | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-009/parser-actual-7plus1.json) |
| SWAI-010 | REAL-GOLD-050 | rev2 | 3b253ea59ea1878e7db5c1f9f5cb79cd3dc902d8957587ad0ba197d6017f56d6 | COMPLETE | PARSED_WITH_UNRESOLVED | [JSON](../../../../fixtures/7plus1/standard-candidates/SWAI-010/parser-actual-7plus1.json) |

## 本轮运行

10条全部实际尝试，10条完整返回、0条异常。这里是程序运行状态，不是语义正确率；本轮没有评判“对/错”，未将任何候选自动审定为标准答案。若异常，actual JSON为null并在summary保留原错误，不能以伪造空槽充数。

真实生产者：research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/engine.mjs，摘要 6c2e8756cf49629479c682f64c62824a5ba311cf92b7f2b2c0fd2d5caed8b153；实现提交 f062dd5b7ef9e6beeca0f4460f51ffc4225f6338。工作区HEAD dba4cc8cf09112f5b885dbcec828ee71e904e8ea 与实现镜像提交分别记录，以源码指纹确定真实运行版本。解析仅收到source.md原文字节，未收到历史Gold/答案或SWAI ID。

正常调用 HanLP/spaCy及原冻结语义模型路径，串行复用模型进程。每条summary记录实际slot状态、unresolved、scope/condition/quantity结构、事实/节点、模型调用及诊断、run ID/时间/engine/commit；parser-expression-summary补充引用链的精确span/关系，不改变任何语义。COMPLETE或合同Gate状态不用于评价答案。Semantic信号未返回时原诊断照存。

## 文件与人工审定边界

每份候选在 fixtures/7plus1/standard-candidates/SWAI-001…SWAI-010。source.md原字节；source-meta.json为来源说明；parser-actual-7plus1.json为真实Canonical；parser-run-summary.json为运行事实；parser-expression-summary.json为实际引用链；historical-reference.json仅REAL-GOLD ID、active revision、source SHA及历史Gold路径。

没有生成expected-7plus1.json或其他expected答案。候选状态为STANDARD_CANDIDATE_AWAITING_HUMAN_ADJUDICATION，等待ADMIN/ChatGPT按原始自然语言和冻结7+1定义独立审定。Parser实际答案不能反向成为标准。

REF-001字节及GOLDEN_CONFIRMED状态不变，继续作为当前STANDARD_PARSED_SAMPLE；不按行业删除或降级。运行前后2825冻结/既有封存文件与REF-001、1841历史文件逐一核验一致。新写的仅候选数据与本任务采集/校验脚本、报告。本轮无Parser修复，因此不另跑大范围语义调优或测试答案补丁。

完整首次Trace保留本地 docs/reports/7plus1/7P-STANDARD-001/EVIDENCE/SWAI-xxx/trace.json，摘要在summary；Git提交原文、实际Canonical及可独立阅读的结构/诊断摘要，避免重复10份全量Trace。无异常日志删除、覆盖或为通过改措辞重试。

发布到私有仓库固定review分支，Git父提交严格指定Base；使用独立index保留当前工作分支/未提交成果。无main合并、发布或GitHub Actions。本任务完成后停止，等待独立人工7+1审定，不自动进入修复。
