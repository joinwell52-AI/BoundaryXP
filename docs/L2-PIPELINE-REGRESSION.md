# L2候选链路回归 / L2 candidate pipeline regression

## 覆盖 / Coverage

复用现有120条词帧fixture，不重写原文、不改已有词帧或包版本，不把它们改称已审阅金标。15个新增动作帧逐一覆盖中文、英文各四类：正例、否定、歧义、缺证据。

The tests reuse the existing 120 fixtures: 15 added frames × two languages × four classes. Sources, package identities and prior lexical expectations are unchanged. These are not independently reviewed extraction gold labels.

每条从本地启用的L1/L2准备快照开始，检查实际检索出的动作引用，分别经过结构化回放、标签回放及模拟模型候选入口，进入唯一BXP Core和三层报告：

- 正例：显式动作保留在A；关联风险不自动生成B。
- 否定：已构造的明确禁止候选保留在独立B，不变为允许动作A。
- 歧义：两个解释及原因保留为unresolved；强行改为resolved的多候选被拒绝。
- 缺证据：伪造引文得到QUOTE_NOT_FOUND，不输出计算结果。
- 所有有效候选：原文、引用及码点证据保持；未提供的其他要素保持absent；两项授权始终null；三个入口的计算轴和计算内容一致。

Prepared references, exact evidence, unresolved alternatives and independent B survive all three candidate paths. Fabricated quotes and collapsed multi-candidate ambiguity fail closed. Mock transport is explicitly labeled; no model request is sent.

## 修复 / Fix

新增链路测试首次有30条歧义场景失败：标签适配器只允许element/status/entries，错误拒绝合法reason_codes。现在从唯一产品Schema读取桶字段并原样保留，继续由该Schema拒绝非法字段和空原因；不复制字段枚举、不修改协议。

The initial run exposed 30 ambiguity failures: label replay rejected the valid reason_codes field. Bucket properties now come from the existing candidate Schema and are preserved through conversion. Invalid fields and empty unresolved reasons still fail validation. No protocol changes.

## 证明边界 / Limits

候选是测试显式构造的，不是自然语言抽取器生成的。通过只证明候选链路保留约定语义和执行必要拒绝，不证明模型能正确识别否定、穷尽歧义或完整抽取。真实模型输出仍须独立金标与实测评估；Core通过不等于语义正确。CLI/MCP/HTTP传输一致性由现有跨入口集成测试另行覆盖，本文件不将函数回放冒称真实宿主实测。

Candidates are authored fixture inputs, not extraction outputs. Passing proves representation preservation and specified rejection, not natural-language understanding, recall or independent semantic accuracy. Existing CLI/MCP/HTTP integration tests cover transport separately; these replays are not live Host acceptance.

## 实际回归 / Actual regression

本轮独立目录验证：已跟踪Core 540/540、UI 154/154、协议单测103/103、冻结向量208/208、Python 135/135、文档单测20/20。新增121项为120个链路fixture加1个清单检查；不是121次真实生成。原有标签回放测试另增合法原因保留、空原因及权限字段拒绝断言。协议目录和LICENSE相较e4156a4无差异。

Tracked Core540, UI154, protocol103, frozen vectors208, Python135 and documentation20 pass locally. New tests comprise 120 pipeline fixtures plus one inventory check. They are not live-model calls. Protocol assets and LICENSE remain unchanged relative to e4156a4.
