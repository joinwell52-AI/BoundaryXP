以下按 boundx-semantic-parse 提取 7+1 边界；仅解释原文，不执行业务任务。

### I｜输入与作用域

- **任务身份**：ADMIN 发给 ME 的 TASK-20260509-Z01，日期 2026-05-09，优先级 P1，登记状态 `in_progress`，主题为 v1.0 RC 核心入口文档双语补齐。来源：“sender: ADMIN”“recipient: ME”“priority: P1”“status: in_progress”。
- **内容范围**：核心用户入口双语化，使中文用户理解 v1.0 定位与 RC 状态；包括 README、RC release notes、CHANGELOG 对应段、spec abstract、指定 ADR 的顶部摘要，以及明确要求的 ADR 状态和索引同步。来源：“仅核心**入口**文档双语化”“让中文用户能看到 v1.0 的 framing 与 RC 状态”。
- **依据输入**：章程引用 `adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md`，前序任务引用 `docs/agents/log/tasks/TASK-20260509-008-ADMIN-to-ME.md`；未提供这些文件内容，不能推定其中追加要求。来源：“ref_charter”“ref_predecessor”。

### O｜产物与交付

| 对象 | 必须达到的结果 | 短原文依据 |
|---|---|---|
| `README.md`、`README.zh.md` | 两份顶部 badge 与 nav 链接同步反映 v1.0 + RC | “README.md + README.zh.md 顶部 badge 与 nav 链接同步 v1.0 + RC” |
| `docs/releases/1.0.0-rc.1.md` | 顶部有中文、English TL;DR 双段 | “顶部含中文 TL;DR + English TL;DR 双段” |
| `CHANGELOG.md` | `[1.0.0-rc.1]` 段顶部有中文、English TL;DR | “`[1.0.0-rc.1]` 段顶部含中文 TL;DR + English TL;DR” |
| `spec/fcop-runtime-protocol-v1.0.md` | Abstract 中加入标题为“摘要（简体中文）”的小节 | “Abstract 段含 ‘摘要（简体中文）’ 小节” |
| ADR-0015 至 ADR-0022，每份 | 顶部有 `## TL;DR`，含中文、English 两段；约 3–5 行的篇幅要求见下方歧义说明 | “顶部各含 ‘## TL;DR’ 段（中文 + English 两段）”“每份 2 段，~3-5 行” |
| ADR-0016、0017、0021 | `status` 从 Proposed 升为 Accepted | “status: Proposed → Accepted” |
| `adr/README.md` | 索引同步上述三份 ADR 的状态 | “索引同步 status”“与 #6 联动” |
| TASK-Z01 报告与归档 | 形成任务报告并归档；具体格式、归档位置未给出 | “R3｜TASK-Z01 报告 + 归档” |

### A｜动作

- 按原文轮次组织：R1 处理 README × 2、RC notes、CHANGELOG、spec abstract；R2 处理指定 ADR 的 TL;DR、状态及 ADR 索引；R3 报告与归档。对应提交前缀为 `docs(i18n):`、`docs(adr):`、`docs(workflow):`。来源：“执行计划”三行。
- 执行全回归并核对无新增失败；不能仅以完成文档修改替代此要求。来源：“测试无回归”“全回归无新红”。
- 全部验收一次性完成时，**可以考虑**以 1–2 个 commit 收口，这是条件性许可，不是必须采用的提交数量。来源：“一次性完成所有验收 → 可考虑 1-2 commit 收口”。

### P｜参与关系

- ADMIN 是指令发送方，ME 是接收与执行主体；组织方式限定为 Solo。来源：“sender: ADMIN”“recipient: ME”“Solo 模式任务”。
- 原文列有 self-review，但未指定独立复核人、最终接收人或额外审批流程。来源：“## 5 · self-review”。
- 中文用户是入口体验的目标受众，不因此成为验收主体。来源：“目标是让中文用户能看到 v1.0 的 framing 与 RC 状态”。

### R｜数量、资源与时间

- ADR 摘要覆盖闭区间 0015..0022，共 **8 份**，每份两种语言、两段，共 **16 段**；逐份要求不能用合并摘要代替。来源：“ADR-0015..0022”“每份 2 段”。
- 状态升级集合为 `{0016, 0017, 0021}`，共 **3 份**，是上述 8 份的子集；摘要覆盖全部 8 份，状态升级及索引同步仅针对指定 3 份。来源：决议 #5–#7。
- 明确文档对象合计 **14 份**：2 份 README + release notes + CHANGELOG + spec + 8 份 ADR + ADR 索引；任务报告与归档另计，未说明其文件数量。来源：验收 #1–#6、执行计划 R3。
- 未给工时、预算或截止时间；`2026-05-09` 是任务日期。全文翻译被留待后续版本，不能换算为本任务期限。来源：“date: 2026-05-09”“留 v1.0 final / v1.1”。

### V｜版本与依据

- 文档目标为 **v1.0 RC**，release notes 与 CHANGELOG 明确落在 **1.0.0-rc.1**；消息协议头为 `fcop`、`version: 1`，两者不能混同。来源：“protocol: fcop”“version: 1”“v1.0 + RC”“`[1.0.0-rc.1]`”。
- 英文 spec 保持权威规范地位，中文摘要承担导读作用，不改变规范依据。来源：“spec 是英文权威，中文是导读”“spec 仍为权威 normative”。
- 三份 ADR 状态升级的给定理由是 TASK-003/004 已实施、状态滞后；这与元数据中的前序任务引用是不同关联。来源：“TASK-003/004 已实施完毕，状态滞后，顺手刷新”。
- 回归基线为与上一 task 持平的 **965 passed**，唯一失败仍须是原有已知失败。来源：“965 passed，与上一 task 持平 + 唯一 fail 仍是已知 pre-existing”。

### C｜完成、停止与升级条件

- 完成须同时满足 O 中全部明确文档要求、报告与归档，以及回归要求；单项完成不能替代组合验收。来源：“验收标准”逐项列表、“R3｜TASK-Z01 报告 + 归档”“所有验收”。
- 回归允许保留原有唯一已知失败，不要求清零；新增失败或把其他失败当作该例外均不符合要求。该失败的具体标识未提供。来源：“唯一 fail 仍是已知 pre-existing”“全回归无新红”。
- 未规定停止、异常升级或失败后的处理流程。验收项的 `✅`、self-review 的 `[x]` 与 `status: in_progress` 并存，不能仅凭勾选符认定业务已完成。来源：“status: in_progress”“✅”“[x]”。

### B｜禁止与限制

- **不全译 spec 长文和 ADR 内文**；本任务不得借双语补齐扩展为全文翻译。来源：“不全译 spec 长文 + 长 ADR 内文”“深度技术文档……暂不全译”。
- **不得破坏既有英文版**，且须维持英文 spec 的规范权威。来源：“不破坏既有英文版（spec 仍为权威 normative）”。
- **ADR 正文不可变**；正文外的 meta 追加限于原文所述 TL;DR、Accepted-on，同时保留对三份 ADR 的明确状态修改要求。来源：“ADR 不可变正文；只追加 meta 段（TL;DR + Accepted-on）”“status: Proposed → Accepted”。

### 原文局部不一致与未明确项

- **验收数量不一致**：元数据 `acceptance_criteria_count: 6`，正文实际列出 **7 项**。第 7 项回归要求仍是明确边界，不能因计数不一致删除。
- **ADR 篇幅口径不明**：“每份 2 段，~3-5 行”未明确 3–5 行是每段还是每份合计；只能保留近似篇幅要求。
- **Accepted-on 要求不完整**：仅在“只追加 meta 段（TL;DR + Accepted-on）”中出现，未明确哪些 ADR 必须添加、填写何种日期；不能推定全部 8 份均须添加。
- **提交组织存在张力**：三轮各有指定 commit prefix，同时允许考虑 1–2 commit 收口；合并后如何对应三个前缀未说明。
- **全文翻译的后续版本口径不同**：正文称“v1.0 final / v1.1”，self-review 称“留 v1.0 final”；不影响本任务暂不全译的明确限制。