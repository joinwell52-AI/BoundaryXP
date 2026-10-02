# 7P-COMPOSITION-013

TERMINAL_OUTCOME=R4_IMPLEMENTATION_GATE_FAILED
STATUS=WAITING_ADMIN_REVIEW
PRODUCTION_READY=false

R1 / R2 / R3 = PASS，R4 = FAIL。最终同样本 I/O/A joint 仍为 0/9，STANDARD_PARSED 仍为 0/9；不能宣称 Parser 语义修复完成。

## 方法与实现

完整阅读 CURRENT-TASK、013/012/011、v0.3、012 审计与冻结 Trace、010 比较合同后，独立克隆封存候选到 research/7plus1-parser/v0.3-7p-composition-013/。生产入口未切换。R1 在 Eligibility 前认证指代集合与条件；R2 认证完整技术身份、方法成员集合、通配集合和已有角色；R3 仅从明确依存或结构化字段绑定接收者；R4 尝试整帧组合认证，缺失要件保留未决。查询、投影、关系空间、Schema 未修改。

R1 将 ANY 指代绑定到唯一、同 owner 的完整四文件先行集合，显式 UNION 保留成员。SWAI-004 的历史禁止事实实际是 both-exist 时不动盘，不是旧诊断所称的 Dry-run；R1 正确保留前者的局部条件，但独立 Dry-run 缺口没有获得 MATCH。两个新增来源支持的 B 项继续作为 C5 待 ADMIN 审阅，不改 Gold、不补 expected。

R2 三个冻结构式通过，继承的路径/行号 locator、修改前后角色在实际专项与保留测试中验证。R3 三个冻结构式通过；初版将已有 PERFORMER 任务接收字段重复解释成报告接收者，9 条错误首次结果保留在 R3-RECIPIENT-AUDIT.json。最终规则依据同来源明确角色优先级纠正，不按实体名称判断。

## R4 的真实阻断

NG17 三成员方法集合在完整文件归属、UNION、明确模态、关系和来源下认证通过。NG18 原文保持不变：在三个文件中各加一个测试点。实际上游图将一个文件作为 AGENT、另一个作为 PATIENT，谓词模态 UNSTATED，未形成 EACH / 每成员数量。完整组合消费者明确拒绝认证，不补造命令模态、成员集合或数量。

非 Gold 目标为 52 PASS / 1 FAIL。这一失败不能被 fail-closed 单元测试、合同 Gate、9 个 Trace 运行成功或全量回归通过替代。R4 原始失败、完整 Trace 与引用链见 FIRST-DIVERGENCE.json 和 R4-COMPOSITION-CERTIFICATION-AUDIT.json。此轮 R4 实现仅部分完成；所有原始事实并未被新的统一整帧证书全面覆盖。不声称 v0.3 无法表示，也不满足“四阶段机制全部通过后 joint=0”的 Hybrid 建议前提。按 Gate 失败终止运行语义开发，完成报告封存。

## 实测

|检查|实际结果|
|---|---|
|专项|103 PASS / 0 FAIL|
|冻结 non-Gold|52 PASS / 1 FAIL|
|保留候选回归|518 PASS / 0 FAIL|
|原 Parser 回归|739 PASS / 0 FAIL|
|全量回归|6042 PASS / 0 FAIL / 17 SKIP|
|STANDARD 重放|9/9 actual compiler，合同和关系类型 Gate PASS|

fail-closed 测试验证不伪造 RESOLVED，并不将失败的 EACH 目标改成正确答案。冻结文本和机制 expected 未在 STANDARD 后修改。R2 的 wildcard 检查曾补强为真实 ALL 集合，不仅检查路径字符串；旧弱基线检查结果原样保留。首次 R1 non-Gold 失败、retained 508/10、错误旧 focused 命令、运行中规则变化的首次 full receipt、R3 首次 9 个错角色、R4 non-Gold 失败全部保留，最终 credited 回归独立在固定实现上运行。

## 同一样本 I/O/A 矩阵

|样本|I MATCH/required|O MATCH/required|A MATCH/required|joint|
|---|---|---|---|---|
|SWAI-001|3/3 (false)|2/3 (false)|4/5 (false)|false|
|SWAI-002|0/4 (false)|0/9 (false)|0/6 (false)|false|
|SWAI-003|0/6 (false)|0/8 (false)|0/6 (false)|false|
|SWAI-004|0/5 (false)|0/5 (false)|0/7 (false)|false|
|SWAI-006|0/2 (false)|0/4 (false)|0/6 (false)|false|
|SWAI-007|0/7 (false)|0/1 (false)|1/5 (false)|false|
|SWAI-008|4/10 (false)|1/5 (false)|0/5 (false)|false|
|SWAI-009|0/5 (false)|2/6 (false)|2/8 (false)|false|
|SWAI-010|0/6 (false)|2/8 (false)|2/8 (false)|false|

|语义指标|010 before|013 final|
|---|---:|---:|
|CASE_IOA_JOINT|0/9|0/9|
|STANDARD_PARSED|0/9|0/9|
|root false-defined|9|8|
|root wrong-binding|11|5|
|slot status mismatch|72|72|
|owned-content missing|22|22|
|source-floor regression|0|0|

旧 MATCH 逐个完整 IR、角色、scope、关系与 proof 复核后保留；不按显示串、单个叶子或数量增长计 joint MATCH。所有新事实先独立来源审阅。不变的 frozen 010 结论只复用于原语义完全相同的条目；新增 provenance metadata 另审。不增加 expected 或人工标准答案。

## 性能与完整性

受控测量使用正式 010/008 before，同一进程交替运行，9 案各 1 warmup pair + 3 measured pairs，只计真实 deterministic compiler。各案 median 总和 39981.38 → 39219.59 ms，变化 -1.91%，performance_concern=false。真实冻结 HanLP/spaCy signals 作为输入，STANDARD 与性能运行未再次调用 NLP/BGE/E5/NLI，不冒称端到端模型延迟或新增模型验证。

反过拟合：实际 import closure 扫描与定向调用路径复核，53 个输入编译期间 0 文件读取；模型和 Pack 在先前初始化，不声称通用信息流证明。旧 barrel import 的宽扫描 flags 保留。6443 个 protected tracked 文件及原有脏状态保留；旧封存、Gold、Source、v0.3、010 overlay、模型、Pack、阈值与生产入口不改。最终 9 案独立 repeat 通过。

按范围 commit/push review/7plus1-parser，推送回执放 .git/7P-COMPOSITION-013-PUSH-RECEIPT.json，避免 SEAL 自引用。没有 merge/release/tag。等待 ADMIN Review。
