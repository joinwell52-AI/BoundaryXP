# 21 个 MCP 工具 / MCP tool reference

[导航 / Index](README.md)

工具名固定，中英文说明通过 MCP 内置帮助读取。对宿主说“调用 `bx_capabilities`，`language` 为 `zh-CN`，`help_topic` 为 `tools`”；英文使用 `en`。查询单个工具时加 `tool_name`。这些帮助不要求宿主读本地文档，也不发起分析模型请求。

Use `bx_capabilities` with `language: "en"`, `help_topic: "tools"` and optional `tool_name`. Tool discovery returns the actual JSON input/output schemas. Help resources are `boundaryxp://help/{zh-CN|en}/{overview|tools|examples|troubleshooting}`. Fields and error codes remain stable across languages.

| 工具 / Tool | 用途 / Purpose | 写入或模型调用 / Effects |
|---|---|---|
| `bx_capabilities` | 版本、能力、帮助、更新状态 / Version, help, capabilities and managed update status | 只读 / Read-only |
| `bx_profiles_list` | 可用模型配置及本地就绪状态 / Local profile readiness | 只读，不显示密钥 / No keys returned |
| `bx_dictionaries_list` | L2 行业、L3 企业字典清单 / L2/L3 dictionary inventory | 只读；没有活动 L1 / No active L1 |
| `bx_dictionaries_bind` | 校验选择并得到版本摘要 / Validate a selection and obtain its digest | 不授予业务权限 / No business authority |
| `bx_dictionary_lookup` | 已绑定资源内查询词条 / Look up entries in bound resources | 只读，不作语义裁决 / No semantic ruling |
| `bx_task_import` | 完整 Markdown 导入预览 / Preview role-based task sections | 不保存、不分析 / No save or analysis |
| `bx_task_validate` | 校验输入、父子关系和容量 / Validate structured input and limits | 不保存、不分析 / No save or analysis |
| `bx_project_create` | 保存一个新项目 / Save a new project | 写入，无模型请求 / Write, no analysis |
| `bx_projects_list` | 分页列出项目 / List projects | 只读 / Read-only |
| `bx_project_get` | 读取精确项目快照及内容引用 / Read an exact project revision | 只读 / Read-only |
| `bx_project_update` | 修改任务或设置，保留旧快照 / Edit while retaining history | 写入；不自动重算 / No automatic analysis |
| `bx_analysis_submit` | 一次 LLM 联合分析，再由 Core 复验 / One joint LLM analysis followed by Core verification | 明确授权模型请求 / Explicit model-call authorization |
| `bx_job_get` | 读取作业状态、失败和结果版本 / Read job status and result revision | 只读 / Read-only |
| `bx_job_cancel` | 请求取消，保留历史 / Request cancellation and retain history | 远端立即停止不保证 / Remote termination not guaranteed |
| `bx_result_get` | 正式结果、LLM/Core 和报告引用 / Read saved formal results and reports | 不重跑、不自动翻译 / No rerun or translation |
| `bx_result_recheck` | 按原保存操作数零模型复算 / Recompute saved operands without the LLM | 新快照，保留旧结果 / New revision, original retained |
| `bx_artifact_get` | 按摘要分页读取完整内容 / Read an artifact by digest | 只读；分页单位为 Unicode 码点 / Unicode code-point offsets |
| `bx_workbench_open` | 返回当前独立页面地址 / Return the current workbench URL | 不提交分析 / No analysis |
| `bx_dictionary_format` | 自定义字典规范、Schema和中英文示例 / Custom dictionary specification, Schema and bilingual examples | 只读 / Read-only |
| `bx_dictionary_validate` | 完整JSON校验、字段错误与歧义警告 / Validate full JSON, field errors and ambiguity warnings | 不保存、不调用模型 / No save or model call |
| `bx_dictionary_import` | 按校验摘要导入不可覆盖版本 / Import an immutable validated version | 写入新字典，不修改任务 / Adds a dictionary without changing tasks |

## 常用口令 / Requests

- **打开页面：**“用 BXP 打开工作台，不提交分析。” / “Open the BXP workbench without analyzing.”
- **看帮助：**“用 BXP 列出 21 个工具的中文说明和案例。” / “Read the English tool help and examples.”
- **看历史：**“列出 BXP 已保存项目，打开我选择的项目，不重新分析。” / “List saved projects and open the selected one without rerunning.”
- **导入预览：**“按原文预览父子任务，多个 DEV 分开，缺失父任务编号时先说明，暂不保存。” / “Preview the full task; retain each DEV separately and report missing parents before saving.”
- **一次分析：**“保存已确认任务，对指定 revision 分析一次，失败不自动重试；完成后读取正式结果。” / “Analyze the confirmed saved revision once, without automatic retries.”
- **零模型复验：**“按已保存操作数复验，保留旧结果，不再调用 LLM。” / “Recheck saved operands without calling the LLM.”
- **查更新状态：**“调用 bx_capabilities，显示 installation_update。” / “Show installation_update from bx_capabilities.”

## 输入输出要点 / Contract essentials

`project_id` 标识项目，`revision` 标识不可混用的保存快照，`job_id` 标识一次作业。写操作需要的新 `request_id` 由宿主生成 UUID；相同 ID 和相同参数只取原操作结果，不靠换 ID 静默重试。默认 host 模式使用 prepare/complete 两阶段，由当前宿主 LLM 分析，无需另配 API Key；只有可选 API 模式需要 `confirm_model_call:true`。两者均不授予业务执行权限。

Default host mode uses `bx_analysis_submit(action:"prepare")`, complete instruction artifact reads, current host LLM analysis and `action:"complete"` with the bound job, revision, digest and JSON response. No separate API key is needed. Only optional API mode uses `confirm_model_call:true`. Poll the job and read its exact result revision; submission is not completion.

单份来源和序列化联合输入各最多 1 MiB，HTTP 请求体最多 8 MiB；超限拒绝，不截断。完整原文通过制品分页读取，不能只截取聊天摘要当输入。根任务不填写父任务编号；各子任务填写明确编号。同角色不会合并，序号不是执行顺序。L2/L3 绑定版本与摘要，不自动补造字典或权限。

Read exact revisions and all artifact pages. Per-source and serialized joint input limits are each 1 MiB; HTTP request bodies are limited to 8 MiB. Oversize input is rejected, not truncated. Explicit parent IDs establish the tree; repeated roles are distinct. Binding dictionaries does not grant business authority.

LLM 判断和计算器复验分别保留，比较时必须对齐任务对象、检查问题和作用范围。Core 只证明输入操作数上的计算结果，不自动证明语义抽取正确。`business_decision` 和 `execution_authorization` 始终为 `null`。报告翻译是工作台中另行明确触发的模型操作，不是 `bx_result_get` 的自动行为。


自定义L2/L3：[中文格式、示例与流程](npm/guides/DICTIONARIES.zh-CN.md)。这三个工具从rc.9提供。

Custom L2/L3: [Format, examples and workflow](npm/guides/DICTIONARIES.md). These three tools are available from rc.9.
