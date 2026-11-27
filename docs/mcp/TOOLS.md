# 21 个 MCP 工具 / MCP tool reference

**适用 / Applies to：`boundaryxp-mcp 0.4.0-rc.12` · B-353。** 2026-11-28 的 rc.12 实包案例确认 **21 个工具、17 项资源**。本工具说明在 2026-11-18 对照 rc.11 的清单、输入 Schema 和双语帮助整理，rc.12 未增删工具。rc.9 已新增自定义字典的格式、校验、导入三项工具；旧版本的工具数按其历史记录解释。

The rc.12 packaged case confirmed **21 tools and 17 resources** on 2026-11-28. This reference was checked against rc.11 schemas and bilingual help on 2026-11-18; rc.12 adds or removes no tools. The three custom-dictionary tools were added in rc.9. Inventory verification does not claim execution acceptance of every tool.

[导航 / Index](README.md) · [L2/L3 中文规范与示例](npm/guides/DICTIONARIES.zh-CN.md) · [Dictionary format and examples](npm/guides/DICTIONARIES.md)

## 完整工具清单 / Complete inventory

| # · 工具 / Tool | 用途 / Purpose | 写入与模型范围 / Effects |
|---|---|---|
| 01 · `bx_capabilities` | 版本、合同、限制、中英帮助与更新状态 / Version, contracts, limits, help and update state | 只读；零模型 / Read-only; no model |
| 02 · `bx_profiles_list` | 模型配置与就绪状态，不返回密钥 / Profiles and readiness, without keys | 只读；就绪不代表有额度 / Read-only; readiness is not quota |
| 03 · `bx_dictionaries_list` | 可用 L2/L3 标识、版本、摘要与测试标记 / Available L2/L3 IDs, versions, digests and test flags | 只读；无活动 L1 / Read-only; no active L1 |
| 04 · `bx_dictionaries_bind` | 校验显式选择并返回固定绑定摘要 / Validate a selection and return its binding digest | 不改已有任务、不授予权限 / No task edit or authority |
| 05 · `bx_dictionary_lookup` | 按绑定摘要分页检索词条 / Paginate lexical entries in digest-bound resources | 只读；不作语义裁决 / Read-only; no semantic ruling |
| 06 · `bx_task_validate` | 校验完整结构输入、父子关系、字典与容量 / Validate full structured input, tree, resources and limits | 不保存、不分析语义 / No save or semantic analysis |
| 07 · `bx_task_import` | 完整 Markdown 预览；保留多个同角色任务 / Preview complete Markdown and distinct repeated roles | 父关系缺失须确认；不自动保存 / Confirm missing parents; no automatic save |
| 08 · `bx_project_create` | 保存完整任务并返回项目及版本 / Save a full task and return its project/revision | 写新项目；不调用模型 / Writes a project; no model |
| 09 · `bx_projects_list` | 分页列出已保存项目 / Paginate saved projects | 只读 / Read-only |
| 10 · `bx_project_get` | 读取指定项目的精确版本与制品引用 / Read an exact revision and artifact references | 只读；不回退到 latest / Read-only; no latest fallback |
| 11 · `bx_project_update` | 按精确版本编辑任务、关系或设置 / Edit tasks, relations or settings at an exact revision | 写新快照，保留历史；不自动分析 / New snapshot, history retained; no automatic analysis |
| 12 · `bx_analysis_submit` | 默认 host 的 prepare/complete，或显式 API 分析 / Host prepare/complete, or explicit API analysis | 准备/提交作业；两种模式见下文 / Prepares/submits a job; see modes below |
| 13 · `bx_job_get` | 作业状态、失败和正式结果版本 / Job state, failures and formal result revision | 只读；提交不等于完成 / Read-only; submission is not completion |
| 14 · `bx_job_cancel` | 请求取消作业，保留历史 / Request cancellation while retaining history | 改变作业状态；不保证远端立即停止 / Changes job state; immediate remote termination not guaranteed |
| 15 · `bx_result_get` | 精确结果版本的 LLM、计算器及报告引用 / LLM, calculator and report references for an exact revision | 只读；不重跑、不自动翻译 / Read-only; no rerun or automatic translation |
| 16 · `bx_result_recheck` | 用原保存候选和操作数再次调用 Core / Recompute the saved candidate and operands with Core | 生成新版本，保留旧结果；零新模型 / New revision; old results retained; no new model |
| 17 · `bx_artifact_get` | 按 SHA-256 分页读取原文、规范、结果或报告 / Read source, instructions, result or report pages by digest | 只读；偏移为 Unicode 码点 / Read-only; Unicode code-point offsets |
| 18 · `bx_workbench_open` | 返回独立工作台地址，可指定项目 / Return the independent workbench URL, optionally for a project | 由宿主打开；不提交分析 / Host opens the URL; no analysis |
| 19 · `bx_dictionary_format` | 自定义 L2/L3 规范、Schema、中英文示例 / Custom L2/L3 specification, schema and bilingual examples | 只读；零模型 / Read-only; no model |
| 20 · `bx_dictionary_validate` | 校验完整 JSON，返回字段错误、歧义提示与摘要 / Validate full JSON; return errors, ambiguity warnings and digest | 不保存、不导入；零模型 / No save or import; no model |
| 21 · `bx_dictionary_import` | 按校验摘要导入不可覆盖的字典版本 / Import a digest-validated immutable dictionary version | 写字典，不自动绑定或修改任务；零模型 / Writes a dictionary, no automatic binding/task edit; no model |

## 直接读取中英文帮助 / Built-in bilingual help

工具名、字段和错误码不随界面语言改变。完整输入/输出 Schema 以宿主的工具发现结果及当前 `bx_capabilities` 为准；不要求读取本地文件，也不发起分析模型请求。

Tool names, fields and error codes remain stable across languages. Discover the actual input/output schemas through the MCP host and current capabilities. Help requires no local file reads or analysis-model request.

```json
{"language":"zh-CN","help_topic":"tools"}
```

将上面的参数传给 `bx_capabilities`；英文将 `language` 改为 `en`。查看单个工具时增加 `tool_name`，例如 `bx_dictionary_import`。主题为 `overview`、`tools`、`examples`、`troubleshooting`。

Pass these arguments to `bx_capabilities`; use `language:"en"` for English and optional `tool_name` for one tool. Topics are `overview`, `tools`, `examples` and `troubleshooting`.

内置资源 / Help resources：`boundaryxp://help/{zh-CN|en}/{overview|tools|examples|troubleshooting}`。

<details>
<summary>展开全部 21 个工具的参数索引 / Input index for all 21 tools</summary>

下表列顶层字段；嵌套类型、枚举和条件必填项见运行时 Schema。没有参数的工具传 `{}`。`bx_analysis_submit` 还须符合下节相应模式的条件字段，不能仅按这一行调用。

These are top-level fields; consult runtime schemas for nested types, enums and conditional requirements. Pass `{}` to no-argument tools. The analysis tool also requires the mode-specific fields described below.

| 工具 / Tool | 通用必填 / Common required fields | 可选或依模式必填 / Optional or mode-specific fields |
|---|---|---|
| `bx_capabilities` | — | `language`, `help_topic`, `tool_name` |
| `bx_profiles_list` | — | — |
| `bx_dictionaries_list` | — | — |
| `bx_dictionaries_bind` | `selection` | — |
| `bx_dictionary_lookup` | `dictionaries`, `query` | `pack_id`, `offset` |
| `bx_task_validate` | `input` | — |
| `bx_task_import` | `source`, `label`, `profile_id`, `dictionaries` | `parents` |
| `bx_project_create` | `request_id`, `input` | — |
| `bx_projects_list` | — | `offset`, `limit` |
| `bx_project_get` | `project_id`, `revision` | — |
| `bx_project_update` | `project_id`, `revision`, `request_id`, `command` | — |
| `bx_analysis_submit` | `project_id`, `revision`, `request_id` | `confirm_model_call`, `action`, `job_id`, `preparation_sha256`, `response` |
| `bx_job_get` | `project_id`, `job_id` | — |
| `bx_job_cancel` | `project_id`, `job_id` | — |
| `bx_result_get` | `project_id`, `revision` | — |
| `bx_result_recheck` | `project_id`, `revision`, `request_id` | — |
| `bx_artifact_get` | `sha256` | `offset`, `limit` |
| `bx_workbench_open` | — | `project_id` |
| `bx_dictionary_format` | — | `language`, `layer` |
| `bx_dictionary_validate` | `document` | — |
| `bx_dictionary_import` | `document`, `sha256` | — |

</details>

## 分析有两种模式 / Two analysis modes

### 默认 host：当前宿主 LLM / Default: current host LLM

1. 任务使用 `profile_id:"host"`。以精确的 `project_id`、`revision`、`request_id` 调用 `bx_analysis_submit(action:"prepare")`，冻结本次准备上下文。
2. 用 `bx_artifact_get` 读完返回的 `instructions_artifact` 全部分页；由**当前宿主 LLM**按规范分析完整任务，不用聊天摘要替代原文。
3. 调用 `action:"complete"`，提交对应的 `project_id`、`revision`、新的 `request_id`、`job_id`、`preparation_sha256` 和完整 JSON 文本 `response`。
4. 轮询 `bx_job_get(project_id,job_id)`，完成后按返回的 `result_revision` 读取 `bx_result_get`。提交成功不等于计算完成。

Use profile `host`. Prepare an exact revision, read **all** instruction pages, analyze with the current host LLM, and complete with the matching job, preparation digest and full JSON response. Poll the job and read its exact `result_revision`.

该模式不要求额外模型 API Key，MCP 服务端不再另发分析模型请求；宿主 LLM 的分析仍受宿主本身的使用范围与费用约束。它不是“没有使用模型”，也不保证每次语义解释正确。

No separate model API key or extra server-side analysis-model request is required. The host LLM still performs analysis under the host's own access and usage terms; this is neither model-free analysis nor a guarantee of correct interpretation.

### 可选 API：显式配置与授权 / Optional API mode

选择已配置的 API profile，提交 `project_id`、`revision`、`request_id` 和 `confirm_model_call:true`；该模式会向所选服务商发起分析请求。失败不自动重试。该确认仅允许这次模型请求，不授予任务的业务执行权。

Use an explicitly configured API profile and supply `confirm_model_call:true` with the project, revision and request ID. This mode sends an analysis request to the selected provider, without automatic retries. Confirmation does not authorize business execution.

## rc.9 起支持：自定义 L2/L3 字典 / New custom-dictionary tools

| 工具 / Tool | 参数与结果 / Inputs and result | 影响 / Effects |
|---|---|---|
| `bx_dictionary_format` | 可选 `language:zh-CN/en`、`layer:L2/L3`；返回 Schema、完整示例、规范和限制 / Optional language and layer; returns schema, example, instructions and limits | 只读，不要求访问本地文件 / Read-only; no file access required |
| `bx_dictionary_validate` | 必填 `document`：完整 JSON 文本字符串；返回 `valid`、`errors`、`warnings`，有效校验提供导入摘要 / Required complete JSON text; returns validity, field errors, warnings and import digest when valid | 不保存、不导入、不调用模型 / No save, import or model call |
| `bx_dictionary_import` | 必填同一 `document` 和校验返回的 `sha256`；返回导入结果 / Required unchanged document and validation digest; returns import result | 写新字典；不自动选择或修改已有任务 / Writes a dictionary; no automatic selection or task edit |

**顺序：format → validate → import → list → bind。** 不补造摘要。导入后，用 `bx_dictionaries_list` 查实际包 ID，再用 `bx_dictionaries_bind` 取得绑定引用；已有任务需明确编辑 settings 和精确 revision，导入本身不修改任务。

**Sequence: format → validate → import → list → bind.** Use the returned digest, then discover the installed pack ID and bind it explicitly. Existing tasks require an explicit settings update at an exact revision.

字典为 UTF-8 JSON，每包最多 **256 KiB**，**1–512** 词条；本安装最多 **200** 个自定义版本。相同 ID/版本/内容重复导入不重复保存；同 ID/版本不同内容拒绝覆盖。字段校验通过不等于语义正确，同名词保留歧义。没有活动 L1；词库、岗位、经理关系与加载行为均不产生业务权限。

Dictionaries are UTF-8 JSON, at most **256 KiB** and **1–512 entries** per package, with **200 custom versions** per installation. Reimporting identical content is idempotent; different content at the same ID/version is rejected. Validation does not establish semantic correctness; ambiguous terms remain ambiguous. There is no active L1 or authority inferred from a resource, role or reporting relationship.

[完整中文规范与错误码](npm/guides/DICTIONARIES.zh-CN.md) · [English specification and troubleshooting](npm/guides/DICTIONARIES.md)

## 常用口令 / Requests

- **全部工具：**“列出 BXP 的 21 个工具，说明参数和写入/模型范围。” / “List all 21 BXP tools with inputs and effects.”
- **字典格式：**“给出 L2 中文格式和完整示例，不导入。” / “Show the English L3 schema and example without importing.”
- **先校验：**“校验这份完整 JSON，展示错误和歧义，先不导入。” / “Validate the full JSON and show errors and ambiguities without importing.”
- **明确导入：**“按刚才校验的同一内容和摘要导入，再列出实际包 ID；先不改已有任务。” / “Import the validated content and digest, then list its pack ID without editing existing tasks.”
- **预览任务：**“按完整原文预览父子任务，多个 DEV 分开；缺少父任务编号先说明，暂不保存或分析。” / “Preview the full task, preserve repeated DEV roles and resolve missing parents before saving or analyzing.”
- **宿主分析：**“使用 host 配置 prepare，读完全部规范，由当前 AI 分析后 complete；读取完成作业的正式结果，失败不自动重试。” / “Prepare with host, read all instructions, analyze with the current LLM and complete; read the final result without automatic retries.”
- **零模型复验：**“按保存操作数复验并保留旧结果，不调用新的 LLM。” / “Recheck saved operands, retain old results and make no new model request.”
- **只看历史：**“打开我选定的已保存项目，不重新分析。” / “Open the selected saved project without rerunning.”

## 输入、分页与结果边界 / Limits and result boundaries

- 单份来源与序列化联合输入各最多 **1 MiB**，HTTP 请求体最多 **8 MiB**；超限拒绝，不截断，没有 300 码点上限。 / Source and serialized joint input: **1 MiB each**; HTTP body: **8 MiB**; reject oversize input without truncation or a 300-code-point ceiling.
- `bx_artifact_get` 的偏移是 Unicode 码点；沿 `next_offset` 读取至 null，再核对内容摘要。单页最多 **16,384** 码点。 / Artifact offsets use Unicode code points; follow every page through `next_offset:null` and verify the digest, at most **16,384 code points** per page.
- `project_id`、`revision`、`job_id` 分别标识项目、精确快照与作业，不混用“当前”结果。对要求 `request_id` 的操作，每个新操作使用新的 UUID；同 ID 同参数取原操作结果，不靠换 ID 静默重试。 / Keep project, revision and job identities distinct. For operations requiring `request_id`, use a new UUID per new operation and retain idempotency instead of silently retrying with new IDs.
- `bx_result_get` 不重跑、不自动翻译；首次报告翻译是工作台中另行明确触发的模型操作。 / Reading a result does not rerun analysis or translate; first-time translation is a separate explicit workbench model operation.
- LLM 解释、Core 程序核验、词库校验和业务裁决分别记录。引文匹配或确定性计算不自动证明语义解释正确。`business_decision` 和 `execution_authorization` 均保持 null。 / Interpretation, Core checks, resource validation and business decisions have distinct scopes. Exact quotations or deterministic computation do not prove interpretation correct; both authorization fields remain null.
