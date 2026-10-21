# LLM-first 028 core / delivery 029 / v0.4 r02

029在本目录继续完善唯一语义核心，并接入用户已有58618页面。启动：`npm run 7plus1:ui`；CLI：`npm run 7plus1 -- --input task.txt --output new-run-directory`。输入非空且不超过300 Unicode码点。共享合同现为028-r02.3；同源Skill模式为INLINE_BUNDLE。运行、取消、刷新恢复、本地历史和导出由薄服务层提供；BXP的`npm run ui`入口未改。

当前使用说明及真实验收见 `docs/reports/7plus1/7P-SHORT-COMPILER-DELIVERY-029-LONG/`。下面保留028原实施背景，不表示029仍无UI接线。旧报告和原始失败不覆盖；当前任务结果以029报告为准。

新研究入口，未切换产品入口。原文→真实解析 Skill→Codex→候选→真实审阅 Skill→新会话 Codex→有限技术 Γ→Boundary IR→固定7+1。两个 Skill、合同和 Schema 均从源文件构建，使用 INLINE_BUNDLE；原生加载 NOT_VERIFIED，不伪报。

依赖：Node >=22.18、本仓库既有 ajv@8.20.0、已登录且支持本机帮助所示参数的 Codex CLI。Provider 自动查找桌面 Codex，可通过 BOUNDARYXP_CODEX_EXE 指定绝对路径。不申请 API key，不修改用户配置。请求模型默认 gpt-6.1-sol、medium；真实服务模型版本未返回时记录 null。

```text
node research/7plus1-parser/llm-first-028/contracts/schema.mjs
node --test research/7plus1-parser/llm-first-028/tests/selfcheck.test.mjs
node research/7plus1-parser/llm-first-028/cli.mjs --input task.txt --output new-run-directory
```

CLI 原样接受 UTF-8 输入；本轮 >300码点明确拒绝，不截断。输出目录必须新建，已有 source.txt 不覆盖。每次正常一次解析、一次审阅；传输/格式最多重试2次；实际 CONTRADICT/遗漏、白名单技术错误，以及未被候选声明为真实歧义的结构化 BINDING 疑点，共享最多一轮修订+新会话审阅。程序只反馈真实问题，不选择替代绑定；明确竞争指代保留，不因修订自动接受。候选、审阅、技术检查、IR、JSON、中文、请求/响应/退出/耗时/用量全部保存，首次结果不覆盖。测试期望不进入 Provider。

本轮实际运行的 CLI（S00原文，输出目录首次创建）：

```text
node research/7plus1-parser/llm-first-028/cli.mjs --input docs/reports/7plus1/7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG/first/S00/source.txt --output docs/reports/7plus1/7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG/cli-live-s00
```

已有目录不覆盖。再次运行时更换输出目录。纯消费者回放显式增加 `--replay-from <此前真实运行目录>`，校验原文与两个 Skill 包摘要，真实模型调用为0；原始调用收据仍链接到首次运行，不将回放冒称再次模型调用。

只读策略、禁用模型工具、ignore-user-config、无项目指令及 host skill discovery 开关构成隔离配置；这不是操作系统级 air-gap。原生 Skill 发现未作功能声明；同源内联正文的摘要与真实提示被保存。独立会话审阅不是独立真值。技术接受不等于自然语言必然正确；不执行任何业务动作、business_decision/execution_authorization 始终 null。

固定开发/验收输入只有 S00、S01—S12，tests/short-texts.mjs 中预期仅评测端消费。本轮无旧NLP导入、无旧语料运行、无UI/生产接线、无训练。编程自检的人工结构不计模型成绩。报告见 docs/reports/7plus1/7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG/。
