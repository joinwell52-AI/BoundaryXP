## I｜输入与作用域

- 本批任务是 README 版本同步整改，授权文件集合为 `{README.md, README.zh.md}`，批次标识为 `readme-3.0-sync-20260522`。〔“scope: batch-remediation”；“files: [README.md, README.zh.md]”；“batch_id: readme-3.0-sync-20260522”〕
- 输入依据包括所列 CHANGELOG 条目、上次 `fcop_report()` 结果及交班说明；这些引用不扩展可修改文件范围。〔“## 引用”；“改动只限 batch 授权清单内的 2 个文件”〕

## O｜产物与交付

两份 README **均须**具备以下结果，不能由一份文件代替另一份满足：

| 位置 | 要求 | 短原文依据 |
|---|---|---|
| 头部 badge | `release-3.0.0` 改为 `release-3.0.1` | “头部 badge `release-3.0.0` → `release-3.0.1`” |
| Recent releases／近期发版表 | 最顶上插入 v3.0.1、v3.0.0 两行，指向 CHANGELOG | “在最顶上插入 v3.0.1 与 v3.0.0 两行”；“行（指 CHANGELOG）” |
| Current release／当前发布段 | 从 v2.0.2 改写为 v3.0.1，含一句话摘要，并提及 v3.0.0“文件夹即状态”纪元 | “一句话摘要 + 提 v3.0.0 ‘文件夹即状态’纪元” |
| Earlier releases 列表 | 加入 v2.0.2、v2.0.0 | “‘Earlier releases’列表把 v2.0.2 / v2.0.0 加进来” |

原文未要求另交报告、提交记录或其他产物。

## A｜动作

- 授权并要求执行上述 badge 替换、表格插入、当前发布段改写及早期版本列表补充；动作限于本批两份 README。〔“ADMIN 授权批量整改”；“## 要做的事”〕
- `fcop_report()` 在本任务中是既有结果的引用，未要求重新调用；proposal 路径是交班依据的引用，未要求修改或执行该 proposal。〔“上一次 fcop_report() 输出确认”；“proposal 已落……”〕

## P｜参与关系

- ADMIN 为授权方和发送方，ME 为接收方；原文未另行指定执行者之外的复核人或验收接收人。〔“sender: ADMIN”；“recipient: ME”；“ADMIN 授权”〕
- 交班说明声称旧会话 `sess-20260513-me-05` 已结束，ME 交班给本会话；该确认是依据“开始啊”及此前 proposal 上下文推导的隐式确认，不是所附原文中的直接明确确认。〔“隐式确认”；“凭 ‘开始啊’ 一句加 11:34 的 double-bind proposal 上下文推出”〕

## R｜资源、数量与时间

- 可修改且要求整改的文件共 **2 个**；每份表格插入 **2 行**，合计 **4 行**，但仍须逐文件满足。〔“2 个文件”；“插入 v3.0.1 与 v3.0.0 两行”〕
- 消息优先级为 P1；未给出截止时间、工时或其他资源额度。〔“priority: P1”〕
- `2026-05-22 11:47` 和 `11:34` 是交班确认及 proposal 的背景时间，不是整改期限。〔“11:47 隐式确认”；“11:34 的 double-bind proposal”〕

## V｜版本与依据

- README 的当前发布目标为 **v3.0.1**，同时保留并介绍 **v3.0.0** 的纪元意义；v2.0.2、v2.0.0 归入早期版本。〔“把版本同步到 v3.0.1”；“提 v3.0.0……纪元”；“Earlier releases”〕
- 发布内容依据为 `CHANGELOG.md L11` 的 **3.0.1 path-consolidation patch** 与 `L47` 的 **3.0.0 protocol-level MAJOR**。所附数据仅给出引用，未提供对应条目全文，因此不能据此补造摘要细节。〔“CHANGELOG.md L11”；“CHANGELOG.md L47”〕
- 既有报告区分组件版本：`fcop`／`fcop-mcp` 为 **3.0.1**，`rules`／`protocol` 为 **3.0.0**；README 同步要求不意味着所有组件版本统一改成 3.0.1。〔“fcop / fcop-mcp 均为 3.0.1，rules / protocol 均为 3.0.0”〕
- 消息头 `protocol: fcop`、`version: 1` 是消息元数据，应与上述发布版本区分。〔“protocol: fcop”；“version: 1”〕

## C｜完成、停止与升级

- 完成须同时满足两份 README 的全部产物要求及修改范围限制。验收明确检查两份 badge、两份发布表及当前发布段；“Earlier releases”虽未在验收清单中重复，仍是独立必做项。〔“## 要做的事”第 4 项；“## 验收”〕
- 原文未规定额外停止条件、升级流程或失败处理方式，亦未提供整改已经完成的证据。

## B｜禁止与限制

- 禁止修改授权集合之外的文件，包括作为依据引用的 CHANGELOG 和 proposal 文件。〔“改动只限 batch 授权清单内的 2 个文件”〕
- 即使位于授权 README 内，也不得改动 essays、仓库结构、设计原则等无关章节；文件授权与章节限制须同时满足。〔“不动 essays / 仓库结构 / 设计原则等无关章节”〕
- 交班推断所依赖的完整上下文未附，无法独立核实该推断；这一局部依据缺口不取消正文明确给出的批量整改授权与限制。〔“凭……上下文推出”〕