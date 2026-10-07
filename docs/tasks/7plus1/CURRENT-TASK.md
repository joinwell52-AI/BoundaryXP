# 当前 BoundX 7+1 开发任务

**当前任务：7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG；任务修订：r02。**

任务书：docs/tasks/7plus1/7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG.md
规范手册：docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md
**规范版本：v0.4；规范修订：r02。**

本次核对的Git blob摘要：
- manual_blob_sha：58db3ddab5327173fd15cfe5d8bd1e6c3f2825ff
- task_blob_sha：be8acf6af83b54e0e95b471b2ced3ecb93eeaffd

仓库：joinwell52-AI/BoundX。
工作及推送分支：review/7plus1-parser。
实现目录：research/7plus1-parser/llm-first-028/。

## 最新授权：一次写齐完整LLM主语义链

原027-R1不再执行；原独立Skill任务已经并入028。运行旧028稿的会话在安全检查点重读本指针、修订后的手册及任务书，保护本地已写代码，不强制回滚。

```text
ADMIN短任务原文
→ 正式解析Skill + Codex实际语义分析
→ 带来源、角色、条件、模态和层级的候选结构
→ 正式审阅Skill + 新会话调用
→ 程序校验来源、类型、作用域和真实依赖
→ 保真编译为7+1 JSON及中文结果
```

LLM识别原文含义；程序不再通过旧NLP/构式规则猜含义。两个Skill、共享合同、Schema、加载调用、校验、编译和CLI在本任务同时交付，不再延期Skill。

## 只用短文本测试

先写齐代码和必要编程自检，再走通任务书S00；随后仅运行S01—S12。

**总计13条短文本（1＋12），每条不超过300个Unicode码点。** 这是测试输入范围，不授权静默截断原文。不跑旧245/105/350，不做长文本、WP矩阵、训练、多模型选型、旧失败复盘或历史兼容恢复。

测试必须展示LLM原始语义与最终7+1，区分模型漏解、Schema承载、程序消费、审阅误报和预期争议。不能用合法JSON、两次模型一致、全填未决或门禁数量代替正确结果。

Skill内容必须真实进入调用；原生加载与同源INLINE_BUNDLE明确区分，不伪报。不申请API key、不改用户全局配置、不增加业务执行权限。

## 交付与停止

连续完成实现、单例贯通和小范围验证，不逐模块等待新任务。旧文件原地不参与，不删除用户资料。只提交本任务文件，不merge/release/tag/全局安装/切生产。

结果使用LLM_FIRST_028=PASS / PARTIAL / FAIL / ENV_BLOCKED / REVIEW_REQUIRED，PASS仅指本次固定短文本范围。完成后停止WAITING_ADMIN_REVIEW，不自行扩大测试或开始下一任务。
