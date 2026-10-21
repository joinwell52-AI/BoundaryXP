# ADMIN TASK — 7P-STANDARD-001

Repository: joinwell52-AI/BoundX
Branch: review/7plus1-parser
Base: f062dd5b7ef9e6beeca0f4460f51ffc4225f6338

目标：准备第一批人工标准样本审定输入，仅保存原文与当前 Parser 实际输出。

禁止修改 Parser、修复语义错误、修改 BXP、历史 Real Gold 或 REF-001；不评价答案对错，不生成 expected-7plus1.json，不把历史 Gold 当标准答案。

固定候选依次为 REAL-GOLD-003、015、017、019、025、032、033、046、049、050。根据 review-assets/7plus1/real-gold-60/adjudications-r02/ACTIVE-REVISIONS.json 确定 active revision，依据该 revision 的 MANIFEST 取得原始 Source TASK。

建立 fixtures/7plus1/standard-candidates/SWAI-001…SWAI-010，每项保存 source.md（原字节）、source-meta.json、parser-actual-7plus1.json、parser-run-summary.json、historical-reference.json。历史引用仅保存原REAL-GOLD ID、active revision、source摘要与历史Gold路径；不复制历史答案为expected。

以当前冻结 parse7Plus1() 正常完整路径实际解析10份原文，仅输入source原文，不传历史Gold/答案/Case ID。记录最终Canonical、slot status、unresolved、scope/condition/quantity、run ID/engine/commit。异常原样保存，无返回时不能伪造Canonical；不因错误改源码或输入。

REF-001 继续为现有 GOLDEN_CONFIRMED / STANDARD_PARSED_SAMPLE，其字节与状态保持不变。

报告 docs/reports/7plus1/7P-STANDARD-001/REPORT.md 列明10份来源/摘要/ACTIVE revision、实际运行状态、actual文件路径；Parser修改=false，Gold修改=false，BXP修改=false，PRODUCTION_READY=false。

完成后只push固定review分支，停止等待ADMIN/ChatGPT独立人工审定。无合并、发布或自动下一阶段。
