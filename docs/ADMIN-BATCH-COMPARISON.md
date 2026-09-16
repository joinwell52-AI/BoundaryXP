# 批量草稿比较 / Batch draft comparison

批量工具复用[草稿比较器](ADMIN-DRAFT-SCORING.md)，固定覆盖任务书120条原文及30条复测，共150个运行位置。所有步骤离线，不调用模型，不改草稿，不把类别数量称为行业覆盖。

This offline tool covers all 150 planned run slots using the existing draft comparator. Test categories are not industries. No model calls, annotation edits or reviewed accuracy claims are made.

## 两种输入 / Two input formats

```text
node scripts/score-admin-batch.mjs <review-workspace> <candidate-directory>
node scripts/score-admin-batch.mjs <review-workspace> <acceptance-run-directory> --records
```

第一种读取T001-1.json等原始候选；第二种直接读取运行器的T001-1/record.json，核对运行ID、用例ID、次数、原文摘要和live/mock标记，只取raw_candidate重新复核。不使用记录中的evaluation作为答案或计算依据。缺文件和无模型输出保留为缺失，不从固定计划删去。

Candidate-file mode reads flat raw candidates. Record mode checks identities and re-evaluates raw_candidate, ignoring stored evaluation claims. Recorded live/mock headers are counted separately but are not authenticated proof of model execution.

## 输出 / Output

每次新建本地忽略目录.boundx/draft-comparisons/<随机ID>/，逐运行保存完整报告及summary.json，不覆盖先前报告。summary按zh-CN/en/mixed与任务书12个测试类别分别统计：

- COMPUTED：合法候选进入Core；不等于答案正确。
- MISSING：无原始输出，但仍保留草稿预期分母。
- REJECTED：候选结构、证据或快照验证失败。
- NOT_SCORED：标注未填或尚有无效答案，预期分母未确定。
- INPUT_ERROR：文件不可读、符号链接、超限或运行记录身份不匹配。
- REVIEW_UNAVAILABLE：草稿、工作区或快照损坏/不可用；不跳过该运行位置。

Every planned slot remains represented, including unavailable reviews and malformed inputs. Per-language/category totals add up to 150. Comparable runs, unknown expected denominators and whole-alternative matches remain distinct.

另列input_counts区分PRESENT/MISSING/UNREADABLE/NOT_INSPECTED，避免“没有金标所以未评分”掩盖“没有原始输出”。工作区不可读而尚未检查输入时保持NOT_INSPECTED，不假装已确认缺文件。

Independent input counts distinguish present, missing, unreadable and uninspected inputs. Missing annotations do not hide missing observations; uninspected files are not falsely classified as absent.

多个答案的条目数量不合并、不挑最有利分母；各答案详细计数留在单条报告。whole_alternative_matches只统计整套替代答案完全一致的草稿比较次数，不是正式准确率。全局precision/recall仍为null，acceptance_passed始终false。CLI退出码0只表示报告写出成功；进程/磁盘中断时BUILDING不算完成。

Per-alternative counts are never pooled. Global precision/recall remain null and acceptance remains false. Successful CLI exit means reports were written, not that semantic acceptance passed. Interrupted BUILDING output is incomplete.

## 限制 / Limits

输入使用Core现有严格JSON解析器，单个候选或完整record.json最多2,000,000字节，不放宽协议或复制解析器。带大快照/大原始输出的记录可能超过限制，此时明确INPUT_ERROR；不能声称已完成其比较。未知预期分母须补标注；最终金标冻结、诊断判定器、真实模型验收与独立审阅仍未完成。

The existing strict parser limits each input file to 2,000,000 bytes. Large record envelopes fail explicitly as INPUT_ERROR rather than silently disappearing. Final frozen gold, diagnostic matching, independent review and live-model acceptance remain separate requirements.

## 验证 / Verification

新增3项汇总测试；原120草稿集成测试实际比较两组固定150个运行位置，涵盖原始候选、运行记录、缺失、非法候选、坏草稿及不可读输入。已跟踪Core 557/557、UI 154/154、协议单测103/103、冻结向量208/208、Python 135/135、文档单测20/20通过。两组程序回放不是300次真实模型调用。

Three new aggregation tests and the existing 120-draft integration exercise both 150-slot input formats. Local tracked Core557, UI154, protocol103, frozen208, Python135 and documentation20 pass. These comparisons are not 300 live-model calls.
