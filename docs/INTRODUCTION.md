# BoundaryXP：执行前明确任务边界

BoundaryXP是BXP（Boundary Xplain Protocol，边界分析协议）的产品实现。当前开发目标为BXP 0.4。

任务原文经LLM、spaCy或HanLP生成7+1候选；系统复核证据并构建形式模型，通过唯一Core计算Boundary Result和Admission。ADMIN根据缺口完善任务，重算满足准入后进入任务书发布。

7+1是中间表示，完整链路包括形式化、边界求值、版本绑定和下游符合性。建议、边界结果和Admission都不等于执行授权。

完整实现处于开发中，不能以路线成功返回或结构复核通过宣称正式Gold验收完成。

请从[产品手册](BOUNDARYXP-PRODUCT-MANUAL.md)、[文档导航](README.md)和[本地任务书](tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md)继续。
