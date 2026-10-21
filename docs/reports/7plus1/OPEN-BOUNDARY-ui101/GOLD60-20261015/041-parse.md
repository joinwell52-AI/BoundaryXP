## I｜输入与作用域

- 任务为 `TASK-20260513-011`，ADMIN 发给 ME，优先级 P1；父任务及关联任务均为 `TASK-20260513-010`，线程为 `docs-index-v2-finish`，会话为 `sess-20260513-me-04`；协议为 `fcop` v1。【来源：头部元数据】
- 补完 `docs/index.html` 的 v2.0.0 同步，核心是标题修正及 Essay 07—14 卡片补齐。【来源：“把 docs/index.html ‘半成品’ 做完”“改动清单(单文件 `docs/index.html`)”】
- 输入依据包括现有六张卡片、`essays/README.md` 权威清单及现场盘点。盘点时间为 **2026-05-13 21:18 +08:00**；其中 Hero pill、双图对偶段已完成，旧版本及“32 工具”残留被报告已清，不是新增改动项。【来源：“现场盘点”“✓ 已落”“(上一波 grep) 已清”】

## O｜产物与交付

**首页指定文字变更：**

| 对象 | 要求结果 | 来源 |
|---|---|---|
| 英文标题（原 L870） | `Fourteen essays. Command the agents — FCoP brings discipline to an AI team.` | 改动清单第 1 项 |
| 中文标题（原 L871） | `十四篇 essay。指挥 agent —— FCoP 让 AI 团队有纪律。` | 改动清单第 2 项 |
| Essay 06 编号栏（原 L952） | `<div class="num">Essay 06</div>` | “Essay 06 摘掉 `Latest`” |

**新增卡片及双语标题：**

| 编号栏 | 中文标题 | 英文标题 |
|---|---|---|
| Essay 07 | 当 agent 从自己的残骸中学习 | When agents learn from their own wreckage |
| Essay 08 | 协议为什么短,历史为什么长 | Why the protocol stays short |
| Essay 09 | 当 validator 撞向自己的镜像 | Gate design pitfalls case studies |
| Essay 10 | 一行 frontmatter 的旅程 | The supersedes field story |
| Essay 11 | 看,但不动手 | Looking without touching |
| Essay 12 | 五大 AI 模型眼中的 FCoP | What five AI models say about FCoP |
| Essay 13 | 演化,反向吸收 | Evolution, reverse absorption |
| Essay 14 · Latest | 当 Agent 第一次拿起工具 | When the agent picked up its tools |

【来源：改动清单第 4 项逐卡列名】

- **每张**新卡片均须复用 `<div class="essay-card">` 模板，包含 `.num`、英文 `<h3 class="en-only">`、中文 `<h3 class="zh-only">`、双语 `.hook` 一句话钩子，强调词用 `<strong>` 包裹。【来源：“每张卡片复用现有…模板,字段”】
- **每张**新卡片的 `.channels` 至少包含 GitHub EN、GitHub 中文；Essay **07 和 11** 还须补 CSDN。这里“至少”不是渠道数量上限，也不替代单文件及结构要求。【来源：“至少含 GitHub EN + GitHub 中文,有 CSDN 的(07 / 11)补上”】
- 另须产出 `REPORT-20260513-011`，并将 TASK 与 REPORT 归档至 `fcop/log/`。【来源：“写 REPORT-20260513-011 + archive TASK + REPORT 到 `fcop/log/`”】

## A｜动作

- 修改两处标题、移除 Essay 06 的 `Latest`，在 Essay 06 卡片闭合与 `essays-grid` 闭合之间插入八张卡片；原文定位为 L964 与 L965 之间。【来源：改动清单第 1—4 项】
- 执行 `commit + push`，并对 GitHub Pages 作实际渲染复诊；原文指定 `F12 ctrl+shift+R`。【来源：“commit + push,GitHub Pages 渲染 v2.0.0 完整(F12 ctrl+shift+R 复诊)”】
- 检查完成后才发布；不能以“已同步 GitHub”的表述掩盖首页仍为半成品。【来源：“说了检查了才发”“落到文件里的必须是真的”】
- 写报告并归档，不能用完成页面改动替代这项交付。【来源：归档验收项】

## P｜参与关系

- ADMIN 为任务发送方及反馈方，ME 为任务接收方；未另行指定实现者、独立复核者或最终验收接收人。【来源：`sender: ADMIN`、`recipient: ME`、“ADMIN 立刻反馈”】
- GitHub 是提交推送目标，GitHub Pages 是部署后渲染检查对象；二者不等同于独立审核角色。【来源：“commit + push,GitHub Pages 渲染…完整”】

## R｜资源、数量与时间

- 页面业务改动限定在 `docs/index.html`；与归档要求的冲突见 B。【来源：“改动只在 `docs/index.html` 内(单文件)”】
- 卡片数量：现有 **6** 张加新增 **8** 张，合计 **14** 张；整体编号须覆盖 **01—14**，无跳号、无错号。【来源：“8 张新卡片”“现有 6 张”“01 → 14”】
- 新增卡片最低渠道项合计为 **18** 个：`8 × 2` 个 GitHub 双语渠道项，加 Essay 07、11 各一个 CSDN 渠道项；此数不是去重 URL 数。【来源：逐卡渠道要求】
- P1 是优先级；盘点时间是状态记录时间，原文未给截止时间、工时或提交次数要求。【来源：`priority: P1`、“现场盘点”】

## V｜版本与依据

- 目标站点内容为 **v2.0.0**；头部 `version: 1` 是任务协议元数据，不能混作站点版本。【来源：头部元数据、“GitHub Pages 渲染 v2.0.0 完整”】
- 编号及卡片内容按 `essays/README.md` 权威清单核对；结构以现有六张卡片为参照。【来源：“按 `essays/README.md` 权威清单”“结构与现有 6 张完全一致”】
- Rule 0.c `Only Land True Things` 是真实性依据：落入文件的内容及完成声明必须符合实际状态。【来源：“落到文件里的必须是真的”】
- 前序任务已同步 README × 3 至 2.0.0，仅是本次背景，不构成本次再次修改 README 的授权。【来源：“同步了 README × 3 → 2.0.0”】

## C｜完成、停止及升级条件

全部验收项共同成立才满足完成边界：

- 文件范围合规；八张新卡片与现有卡片结构一致，双语齐全；整体编号与权威清单一致。【来源：验收标准前四项】
- Essay 14 标 `Latest`、Essay 06 去掉 `Latest`；标题数字改为 `14 / 十四`。【来源：验收标准第五、六项】
- 已 commit、push，且复诊确认 GitHub Pages 的 v2.0.0 渲染完整；仅推送成功不足以满足该项。【来源：发布与复诊验收项】
- 报告已写，TASK 与 REPORT 已归档。【来源：最后一项验收标准】

原文没有另列停止或升级流程。未来实际渲染是否通过属于待验收状态，不是边界不明。

## B｜禁止、限制与局部不明确

- **排除首页补图**：v2.0.0 哲学 Hero 段、预留 Essay 13／14 封面图均不在本任务范围；视觉资源 ready 后仍须另立 TASK，不能自动并入本次。【来源：“后续视觉资源 ready 再立 TASK”】
- **排除导航结构改动**：不得在本任务中增加顶部 `Releases`／`Evolution Loop` 锚点。【来源：“不在本任务范围”“那是结构性改”】
- **文件范围存在字面冲突**：“改动只在 `docs/index.html` 内”与写报告、归档到 `fcop/log/` 的要求无法按全局单文件限制同时满足。可能意指“页面业务改动单文件、报告归档例外”，但原文未明确该例外；两项义务均须保留，不自行裁掉其中一项。
- **结构验收措辞局部不清**：“class / 锚点 / 链接四白对齐”中的“四白”含义未定义。明确部分仍是卡片结构完全一致，并核对 class、锚点和链接；不能自行将“四白”解释成某种空白或缩进规则。
- **具体内容未全部给出**：双语钩子文案、强调词、实际链接及锚点值未在原文列出；需受权威清单、现有模板和真实性要求约束。这些待确定内容不等于任意授权，也不应凭空补造。