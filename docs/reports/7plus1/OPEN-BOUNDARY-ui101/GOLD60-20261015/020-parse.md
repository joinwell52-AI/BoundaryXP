### I｜输入与作用域

- 任务为 `TASK-20260509-009-ADMIN-to-ME`：围绕 GitHub Issue #2 的“5 字段提案”，准备 v1.0 reframing 进度回复草稿，说明每个字段的去向、原因和落地时间。范围为草稿准备及仓库内交付，公开发布另有确认门槛。  
  来源：“准备 Issue #2 回复 draft”“5 字段每个走向哪、为什么、何时落地”。
- Issue #2 是回复对象及提案来源；前序任务为 `TASK-20260509-010-ADMIN-to-ME`。原文仅提供引用，未附 Issue、前序任务或 ADR 正文，不能据此补造提案内容和决议细节。  
  来源：`ref_external`、`ref_predecessor`、`ref_charter`。

### O｜产物与交付

| 产物 | 必须满足的边界 | 短原文引文 |
|---|---|---|
| `docs/issue-2-reply-draft.md` | 完整回复正文及 how-to-publish 段；包含发布命令，并解释为何不自动 push | “完整 draft + how-to-publish”“包含 publish 命令 + 解释为什么不自动 push” |
| `docs/issue-2-reply-body.md` | 可直接用于发布的纯正文，无前导 meta，便于 gh CLI 使用 | “纯 body 方便 gh CLI”“publishable body（无前导 meta）” |
| task、TASK-009 报告及归档 | 纳入两轮交付；具体 task 文件及归档位置未明确 | “R1…+ task”“R2…TASK-009 报告 + 归档” |

两份文件中的回复正文须共同满足以下内容要求；纯 body 文件不能因完整 draft 已覆盖而省略：

- TL;DR。
- 5 字段逐一回应表，覆盖每个字段的去向、原因及落地时间。
- 7 抽象 framing 表。
- 为什么 deferred。
- peerDependencies 升级建议，版本范围为 **`>=1.0,<2.0`**。
- roadmap。
- 给提案人的 **3 个问题**。
- 完整回应提案人的 **4 个具体问题**；这与向提案人提出 3 个问题是两项独立要求。

来源：“Body 含：TL;DR + 5 字段逐一表 + 7 抽象表 + 为什么 deferred + peerDeps 建议 + roadmap + 给提案人的 3 个问题”“回应提案 4 问全部”“peerDependencies…（>=1.0,<2.0）”。

### A｜动作

- 编写两份草稿文件并提交 repo。  
  来源：“写 draft 文件提交 repo”。
- 按原定两轮组织交付：R1 为两份文件及 task，标注 `docs(issue):`；R2 为 TASK-009 报告及归档，标注 `docs(workflow):`。原表多出未命名的第三列，两个标记的具体用途未明说。  
  来源：“R1…`docs(issue):`”“R2…`docs(workflow):`”。
- 将发布步骤和命令写入文档属于要求；实际调用发布命令不属于本次草稿交付。  
  来源：“draft 包含 publish 命令”“不实际执行 gh issue comment”。

### P｜参与关系

- ADMIN 为任务发送方，ME 为接收及执行主体，采用 Solo 模式；未指定其他执行者或独立复核人。  
  来源：`sender: ADMIN`、`recipient: ME`、“Solo 模式任务”。
- 回复以第一人称 ME 为主语，并引用 ADMIN 的 solo-mode sign-off，与 v1.0 README 的 maintainer 自我表述一致。sign-off 的具体文字未提供。  
  来源：“主语第一人称 ME，引用 ADMIN solo-mode sign-off”。
- 提案人为最终回复对象；ADMIN 掌握外部公开提交的二次确认及 push 时机决定权。  
  来源：“给提案人一个明确的进度回复”“需 ADMIN 二次确认”“不替 ADMIN 决定 push 时机”。

### R｜资源、数量与时间

- 明确数量：**2 份回复文件、5 个字段逐一回应、7 抽象表、回答 4 问、提出 3 问、4 项验收标准、2 轮交付**。这些数量对应不同对象，不可互相替代。  
  来源：决议第 2、3 项；验收第 3 项；执行计划；`acceptance_criteria_count: 4`。
- 任务日期为 **2026-05-09**，优先级 **P1**，状态标记为 **in_progress**；未给出截止时间、每轮工期或资源额度。正文要求说明字段“何时落地”，但具体时间需依据相关决议，原文未提供。  
  来源：`date`、`priority`、`status`、“何时落地”。

### V｜版本与依据

- 任务协议为 **fcop v1**；回复背景为 **v1.0.0-rc.1 已发布**，属于 v1.0 ship 的收尾动作之一。  
  来源：`protocol: fcop`、`version: 1`、“v1.0.0-rc.1 已发车”“回 Issue #2 进度通告”。
- 以 `adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md` 及其 execution roadmap 为任务依据；正文 framing 须与 **ADR-0015 至 ADR-0022** 一致，叙述身份与 v1.0 README 一致。引用文件正文未提供，当前无法核对其具体内容。  
  来源：`ref_charter`、“per ADR-0015 §execution roadmap”“与 ADR-0015..0022 的 framing 一致”。
- peerDependencies 建议允许域为 **大于等于 1.0 且小于 2.0**，包含下界、排除上界；这里只要求给建议，未要求修改依赖文件。  
  来源：“给出 peerDependencies 升级建议（>=1.0,<2.0）”。

### C｜完成、停止及升级条件

- 草稿交付验收须同时满足：完整 draft 与发布说明、无前导 meta 的纯正文、上述全部正文内容，以及未实际执行 `gh issue comment`。报告及归档仍是执行计划中的独立要求。  
  来源：验收标准第 1—4 项；“TASK-009 报告 + 归档”。
- 外部公开提交前须取得 ADMIN 二次确认；确认是发布的必要前提，不能用草稿完成或自审通过代替，也不构成本任务中立即发布的要求。  
  来源：“Rule 7 ‘外部公开提交’…需 ADMIN 二次确认才能 push”。
- 验收项带 ✅、self-review 带 `[x]`，但同时标记 `in_progress`，且未提供文件或操作证据。这些标记不能独立证明实际交付已完成；其究竟表示已检查还是预列标准，原文未说明。  
  来源：验收及 self-review 标记、`status: in_progress`。

### B｜独立禁止与限制

- 本次任务不得直接执行 `gh comment`／`gh issue comment`；文档内提供命令不解除此限制。  
  来源：“不直接 gh comment”“不实际执行 gh issue comment（Rule 7 守门）”。
- 不得替 ADMIN 决定 push 时机，不得自动进行需二次确认的公开提交。  
  来源：“不替 ADMIN 决定 push 时机”“为什么不自动 push”。
- **局部用词不明：**原文用“push”指涉需确认的外部公开提交，同时又要求“提交 repo”，未明确“push”是否还涵盖 Git 远端推送。因此，仓库提交要求明确、Issue 评论禁令明确；Git 远端推送的授权范围不能据此自行扩大。  
  来源：“写 draft 文件提交 repo”“需 ADMIN 二次确认才能 push”。