# 当前 BoundX 7+1 开发任务

**当前任务：`7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG`**

任务书：
`docs/tasks/7plus1/7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG.md`

仓库：`joinwell52-AI/BoundX`。
唯一工作及推送分支：`review/7plus1-parser`。
新代码目录：`research/7plus1-parser/llm-first-028/`。

## 最新授权：重头实现，LLM承担主要语义分析

不再继续027-R1的旧代码修补；原028 Skill计划已经并入本任务，不再等待、不再单独执行。

一次写齐：

```text
原文
→ 任务语义解析Skill + Codex真实调用
→ 带来源的候选语义结构
→ 语义审阅Skill + 独立调用
→ 程序校验来源、类型、约束和真实依赖
→ 确定性生成可计算7+1
→ JSON及中文结果
```

LLM识别任务语义，程序保真消费。不用旧NLP构式规则重新理解，不以Skill缺席的临时提示词代替正式交付，不把合法JSON或两次模型一致当语义证明。

只从v0.4手册提取7+1和ADMIN边界语义；旧代码、旧图和旧测试不作为运行或兼容基线。不安排历史失败复盘、旧资产封存或旧350条批量重跑。不删除或回滚用户旧目录，在新目录独立开发。

先写好合同、Skill、调用和编译代码，完成必要编程自检；再走通一条真实短任务，之后运行任务书固定的小范围语义正反例。任务内连续完成，不逐模块等待新授权。

直接交付可运行CLI、两个Skill、实际调用、语义候选和最终7+1。真实问题如实报告，不只交计划。不merge、release、tag、全局安装或切生产；完成后停止`WAITING_ADMIN_REVIEW`。
