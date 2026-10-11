# 全流程标准对照包

打开 [STANDARD.md](STANDARD.md) 查看原文、每阶段职责、八槽标准、计算公式、观测场景和当前差异。

- source.txt：原始上传字节，与既有 MANUAL-TEST-001.txt 相同。
- expected.json：人工按原文整理的对照义项、来源、视图、计算预期；不是模型候选，不投喂生产链。
- actual/ui36：既有真实测试的首次候选、局部修订、两轮审阅、技术校验、IR、7+1、中文及完整 Trace。
- baseline-comparison.json：当前结果与目标的差异；PARTIAL 仍是计算缺口。
- MANIFEST.json、SHA256SUMS、SEAL.json：本包字节完整性，不自动授予 GOLDEN_CONFIRMED。

只上传 source.txt。报告、预期答案和模拟观测不得送给模型。
