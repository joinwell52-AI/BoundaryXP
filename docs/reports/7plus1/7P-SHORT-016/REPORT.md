# 7P-SHORT-016 — short direct candidate

**Outcome: ADMIN_CASE_CONTRACT_REVIEW_REQUIRED. STATUS=WAITING_ADMIN_REVIEW. PRODUCTION_READY=false.**

隔离候选来自 014，015 的 BGE/E5/NLI 提议链未接入。本轮按分级 Gate 执行：G0/G1/G2 通过；G3 触发源文与预期身份合同裁定，G4 未执行。D01–D08 完整闭合 **6/8**，同案 I/O/A **6/8**，不声明 SHORT_DIRECT_PARSER_VALIDATED。

|Case|I|O|A|P|R|V|C|B|Full|Joint IOA|
|---|---|---|---|---|---|---|---|---|---|---|
|D01|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D02|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D03|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D04|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D05|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D06|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D07|NOT_CLOSED|MATCH|NOT_CLOSED|MATCH|MATCH|MATCH|NOT_CLOSED|MATCH|false|false|
|D08|NOT_CLOSED|NOT_CLOSED|NOT_CLOSED|NOT_CLOSED|NOT_CLOSED|NOT_CLOSED|NOT_CLOSED|NOT_CLOSED|false|false|

D07 原文“王齐负责整理说明”含显式的整理谓词和说明对象；冻结预期仅列读取 service.yaml 与生成 deployment-guide.md，未给出前述主任务动作/对象可与细化流程合并的身份证据。依任务书 §3 停止并提交 ADMIN-CASE-CONTRACT-REVIEW.json：需 ADMIN 裁定宏目标是否为独立语义项或等价身份。没有删掉该动作追答案，没有修改 Source/expected。此合同问题与真实算法缺陷分开：D07 已生成 AND 两部分存在被部分绑定为 OUTPUT_EXISTS 且错误 RESOLVED；D08 contain 部分被升格执行 A、完成及文件所有内容未闭合。仍有错误绑定 2、unsupported RESOLVED extra 1；D07 来源支持但合同未列的项不冒算“编造”。

已实现通用语法恢复：任务分派层与动作层分离、显式责任主体继承、perfective/passive 输出状态、局部依据补语/版本绑定、条件后件模态、NOT_REQUIRED 负分支、量化完成状态、复核确认、当前输出传递与外部输入分离、已支持对象身份问责。均先进入 Candidate Graph 并走既有 Eligibility→IR→固定 Q→Proof；所有源 spans/结构路径保留。没有新 Schema/Pack/模型/阈值或生产入口变更。候选未完成 G3，不作为已验收实现。

实现前已读取任务与规范，冻结 HYPOTHESIS/PRIMARY-SEMANTIC-GATE 和 ADMIN 原文/预期摘要。首个探测误接旧 p0 syntax adapter，原输出保留于 baseline/ 且明确 INVALID_AS_014_ENTRY；正式 baseline-014/ 按 014 实际入口重跑，不把旧适配器缺陷归给 014。D04 正式基线抛 BOUNDARY_SCOPE_INCONSISTENT，错误与失败尝试均保留，未关闭断言。过程中 candidate-r01/r02/r03 等失败/中间输出不覆盖；candidate-g2-r02/D05 的实现 ReferenceError 记录为失败，绝不写 PASS。

专项 9 pass / 0 fail；014 whole/recipient/qualified 26 pass / 0 fail 实际重定向到 016 候选；六组选择的原始/014 回归 164 pass / 0 fail，只代表这些测试。G4 未到，全仓库回归 **NOT_RUN**，REF-001 legacy/full Canonical 均 **NOT_RUN**；既有 REF Gold 和“上述材料”歧义字节保持不变，无推断。不是用既有会议断言代替本轮 G4。

冻结候选后，对全部八个原文进行 fresh HanLP/spaCy 首次和重复执行，Candidate节点、relations、eligibility、BoundaryIR、Canonical、Proof、未决及coverage全部 EXACT，包含 D07/D08 的失败语义。最终 JSON、可读 Markdown、完整 Trace、comparison、实际模型 signals 位于 final-first/ 与 final-repeat/。运行成功 8/8 不等于语义正确 8/8。每条 slot-status 与错误见专门审计文件。

静态 anti-overfit 扫描未发现 case/name/file/hash/offset 答案分支；没有长期 STANDARD expected 进入新候选或评测。静态扫描不证明广泛泛化。保护基线 9979 个 Git 文件的实际已有字节/缺失状态全部核验；旧 008–015 封存不覆盖，用户既有工作区改动保持。MANIFEST/SHA256SUMS/SEAL 覆盖当前报告、候选源码及专项测试。

仅推送 review/7plus1-parser；无 merge/release/tag/生产切换。停止等待 ADMIN。
