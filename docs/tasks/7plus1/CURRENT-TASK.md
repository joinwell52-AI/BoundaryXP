# 当前 7+1 编译器任务

**当前任务：`7P-LLM-SEMANTIC-COMPILER-027-R1-CODE-CLOSURE`**

任务书：
`docs/tasks/7plus1/7P-LLM-SEMANTIC-COMPILER-027-R1-CODE-CLOSURE.md`

规范：
`docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md`

仓库：`joinwell52-AI/BoundX`。
唯一工作及推送分支：`review/7plus1-parser`。

027已封存为EVAL_FAILED，证据提交为`1fe7dc819e21d067bbd580ef822fbc289fe34054`。不得改写该终态、原响应或105条锁定首次结果。

## 本次直接交付代码

按ADMIN最新要求：**先把程序实现写对，再整批测试；不先跑大批样本再猜改什么。**

先保护本地已有修改并读取任务书，在独立027-r1目录中修正：

1. 提示词、Schema、候选图与实际消费者的字段合同一致性。
2. 同一实体在生成、检查、复核、提交等不同动作中的用途，不再用单个产物标签全局否决。
3. 审阅疑问仅影响被质疑的语义及真实依赖，不感染所有相关实体和独立动作。
4. 条件、所有权与认证依赖按真实语义合同闭合，不丢条件、不凭上下文造事实。

连续完成实现、必要的编程自检和单条短任务贯通，再冻结修复版做已有记录回放与最终回归。优先使用已保存模型输出；不先重复调用245/350条，不增盲测、不换模型、不重建026。

交付可运行代码、修改定位、真实前后差异、最小反例与批量验证结果。不能用门禁数量、Skill封装或报告数量代替代码修复。代码正确性仍须由针对性检查和复测支持，不能先宣称已正确。

028保持PLANNED_NOT_ACTIVE，不在本次编写/安装/启用Skill。活动生产入口保持不变，不merge、release、tag。完成后返回`LLM_COMPILER_027_R1=PASS / PARTIAL / FAIL / ENV_BLOCKED / REVIEW_REQUIRED`之一，并停止`WAITING_ADMIN_REVIEW`，不自动启动028。
