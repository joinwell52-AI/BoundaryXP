# 7P-MATRIX-017

**ADMIN_MATRIX_CASE_REVIEW_REQUIRED · STATUS=WAITING_ADMIN_REVIEW · PRODUCTION_READY=false**

已从远端同步当前任务指针，完整阅读任务书、冻结 M01–M04、v0.3 方法、R2 封存报告、D01–D08 与 REF 锚点。执行前合同核对触发任务书 §7 的停止条件；未启动 Parser 实现。

## 需要裁定的唯一阻断

M04 冻结预期（冻结案例文件第 483 行）要求 `PARALLEL(WP1, WP2)`。原文只明确“两个检查阶段都完成后，汇总阶段开始”，支持两路完成汇合，但没有像 M03 那样明确“两个检查阶段可以并行”。WP1 读取 accounts.csv，WP2 读取 permissions.csv，也不是 §5.3 写出的同一上游输入构式。

任务书 §5.3 写明：

> If two WPs share the same upstream input and source says/permits parallel work:

并要求 unsupported RESOLVED orchestration edge = 0。不能用“原文没禁止并行”补一条已认证的正向 PARALLEL 边。这里并非认定原文禁止并行；问题是现有规则不能证明冻结预期所要求的边。串行和重叠执行都可能满足该 join；join 与 PARALLEL 的证据必须分开。若 ADMIN 本意是将 PARALLEL 定义为可推导的无依赖关系，需要明确独立的证明规则，不能由实现者自行重定义。

§7 要求冻结合同与原文不一致时以 ADMIN_MATRIX_CASE_REVIEW_REQUIRED 停止。因此本轮未改原文/预期来追通过，也未输出伪造 WP、矩阵或 Global 7+1。CONTRACT-CONFLICT.json 保存完整原文码点 span、文件摘要、规则位置、M03 对照和逻辑反例。

## 实际验证状态

|项目|本轮状态|
|---|---|
|M01–M04 原文提取和字节核对|4/4|
|G0/G1/G2/G3|NOT_RUN，合同审阅前置停止|
|Block/WP/Local/DAG/Matrix/Global 成功数量|NOT_EVALUATED，不计 0/4 或 4/4|
|错误 WP / O→I / completion / contamination|NOT_MEASURED，不报 0|
|专项、原 Parser、全量回归、重复性|NOT_RUN|
|R2 封存保护|482 个载荷与封存包络摘要均一致|
|全部既有跟踪文件保护|11183 个字节/缺失状态保持|

历史 D01–D08 8/8 与 REF 43/43 的封存结果保持有效，但没有作为本轮新跑结果。所需中间产物文件明确存 NOT_RUN/null，不能被当作矩阵实现输出。

## 待 ADMIN 选择的修订方向

1. 在新冻结版本里明确 M04 允许并行，同时澄清 §5.3 是否允许不同上游输入。
2. 移除无显式依据的 PARALLEL 预期，保留真实 join。
3. 明确定义可证的派生并行/无依赖关系，与原文直接许可区别表示。

这些是裁定建议，均未执行。只追加 017 只读报告与封存，不修改 Parser、Gold、Source、v0.3、模型、阈值、Pack 或生产入口。不 merge/release/tag；推送 review/7plus1-parser 后停止等待 ADMIN Review。
