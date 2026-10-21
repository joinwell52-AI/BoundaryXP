### I · 输入与作用域

- 对象为宿主级 `fcop-rules.mdc`、`fcop-protocol.mdc`，RC 阶段升级以反映 v1.0 reframing 及 REVIEW、Boundary、Failure、Event 四个新抽象。（“RC 阶段必须把宿主级 rule 文件升级”“4 抽象”）
- 范围包括两份 mdc、CHANGELOG，以及 TASK-010 报告与归档。（“R1 … rules.mdc + protocol.mdc + CHANGELOG”“R2 … TASK-010 报告 + 归档”）

### O · 产物与交付

| 产物 | 必须满足的边界 | 原文依据 |
|---|---|---|
| `fcop-rules.mdc` | 新增正式 Rule 9，完整包含四个子段，分别对齐四个抽象；含双语正文，形式与 Rule 0..8 一致 | “4 子段对齐 4 抽象”“含双语正文”“形式必须与既有 Rule 0..8 一致” |
| rules 版本记录 | frontmatter 为 `fcop_rules_version: 1.9.0`；body changelog 顶部新增 1.9.0 段，两处同步 | “frontmatter … 1.9.0 + body changelog 顶部 1.9.0 段”“frontmatter ↔ body changelog 同步” |
| `fcop-protocol.mdc` | 顶部新增 v1.0 capabilities pointer callout | “顶部含 v1.0 capabilities pointer callout” |
| protocol 版本记录 | frontmatter 为 `fcop_protocol_version: 1.7.0`；Protocol Version Log 含 v1.7 段，与元数据同步 | “frontmatter … 1.7.0 + Protocol Version Log v1.7 段” |
| 配套交付 | 同步 CHANGELOG，形成 TASK-010 报告并归档 | “CHANGELOG 同步”“TASK-010 报告 + 归档” |

### A · 动作

- 按 additive expansion 增补规则、pointer 与对应版本记录。（“严格 SemVer additive”“minor bump 反映新增 callout”）
- 原文规定两轮：R1 修改两份 mdc 与 CHANGELOG，标记 `feat(rules):`；R2 报告与归档，标记 `docs(workflow):`。（执行计划 R1、R2）
- 验证指定元数据一致性测试及全回归，结果要求见 C。（“测试守门”“全回归无新红”）

### P · 参与关系

- ADMIN 向 ME 下达任务，采用 Solo 模式。（`sender: ADMIN`、`recipient: ME`；“Solo 模式任务”）
- self-review 为任务内自检记录；未指定独立复核人、接收人或额外审批流程。（“§5 · self-review”）
- Cursor / Claude / Codex agent 是规则操作面的读取者，不据此认定为本任务执行或验收参与人。（“任何 Cursor / Claude / Codex agent 都会自动读到”）

### R · 资源、数量与时间范围

- 数量约束：新增 **1 条 Rule 9、完整 4 个子段**，逐一对齐四个抽象；验收标准共 **5 项**。（“Rule 9，4 子段对齐 4 抽象”；`acceptance_criteria_count: 5`）
- 阶段约束：RC 阶段完成宿主级规则升级；mdc 重 emit 是 v1.0 ship 必含事项；详细 commentary 留至 v1.0 final。（“RC 阶段必须”“v1.0 ship 必须包含 mdc 重 emit”“详细留 v1.0 final”）
- 任务日期为 2026-05-09、优先级 P1、登记状态 `in_progress`；未给出具体截止时刻、工时或额度。“1194 行”是控制扩写的理由，并非明确的总行数上限。（对应 frontmatter；“1194 行 mdc 不能再加 commentary 进去”）

### V · 版本与依据

- rules：**1.8.0 → 1.9.0**；protocol：**1.6.0 → 1.7.0**。Protocol Version Log 的段标题按原文为 **v1.7**。（决议 2、4；验收 4）
- 依据为 `adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md`，明确引用其 §execution roadmap；前序关联为 `docs/agents/log/tasks/TASK-20260509-Z01-ADMIN-to-ME.md`。（`ref_charter`、`ref_predecessor`；“per ADR-0015 §execution roadmap”）
- 元数据同步关联既有 `ISSUE-20260427-007` 及防漂移测试。（“既有 ISSUE-20260427-007 防止 metadata drift 测试守门”）
- 任务封套的 `protocol: fcop`、`version: 1` 与上述目标文件版本分别保留，不混同。（frontmatter）

### C · 完成、停止及升级条件

- 完成须同时满足五项验收：Rule 9 四子段及双语正文、rules 版本记录、protocol 顶部 pointer、protocol 版本记录，以及测试要求；具体产物条件见 O。（“§3 · 验收标准”）
- 测试要求为 `tests/test_fcop/test_rules_metadata_consistency.py` **全绿**，且**全回归无新红**；后者未要求消除所有既有失败。（验收 5）
- CHANGELOG 同步、报告与归档仍是独立交付义务，不因未单列在五项验收中而取消。（执行计划；“CHANGELOG 同步”）
- 未规定失败后的停止、升级或豁免流程。验收条目前的 ✅、self-review 的 `[x]` 是原文标记；结合 `in_progress`，不能仅凭这些标记认定已经完成或测试通过。（验收、自检标记及任务状态）

### B · 独立禁止与限制

- **不得改动 Rule 0..8 主体**，既有规则全部继续生效；新增 Rule 9 不替代既有规则。（“不动 Rule 0..8 主体”“既有规则全部继续生效”）
- **protocol.mdc 此次仅加 pointer，不展开详细 commentary**；上述版本元数据及日志更新仍须履行。（“仅加 pointer”“不展开”“详细 commentary 留 final”；验收 4）

具体内容缺口：原文未提供四个抽象的详细规则语义、pointer 文案及目标、双语的具体语言组合，也未给出全回归命令或“新红”的比较基线；所引文档正文未随数据提供。因此可确定上述交付边界，但不能据此补造具体规则内容或验证结果。