## I｜输入与作用域

- 任务为 `TASK-20260513-008`，ADMIN 发给 ME，优先级 P0、风险 high；目标是完成本轮 sprint，将 **fcop / fcop-mcp 均升级为 2.0.0**。父任务为 TASK-20260513-006，线程为 `fcop-2.0.0-release-sprint`。〔元数据；§1：“全部完成,然后升级为 2.0.0”〕
- 范围以 `fcop/shared/SPRINT-fcop-2.0.0-release.md` §2 表格为准，包括 **12 个 C 子变更、4 个 D 阶段、3 个 E 阶段，共 19 项验收项**；不能据“全部完成”扩展到表外变更。〔§2：“12 个 sub-changes…+ 4 个 D 阶段 + 3 个 E 阶段”；§6：“任何不在 SPRINT §2 表格内的 sub-change”〕
- 已有交付是本任务的输入基线：ADR-0034 v2.1.1、essay #13 中英版、FCOP-2.0.png 已交付（`523d81e` / `d2e0967`），REPORT-006 已落（`92980c7`），ADR-0034 已由 Proposed 转为 Accepted（`cbe6adb`）。这些是既有状态，不是本轮重新交付要求。〔§1：“三件套交付”“回执已落”“Proposed → Accepted”〕

## O｜产物与交付

以下逐项为独立验收义务，须组合满足：

| 项目 | 要求及产物 | 短原文依据 |
|---|---|---|
| C1 | `fcop-rules.mdc` 增加 Rule 4.6；rules 2.4.0 → 3.0.0 | “加 Rule 4.6 + rules 2.4.0 → 3.0.0” |
| C2 | 第二张哲学图 FCoP Semantic Evolution Loop 放在“七大核心概念”末尾，原文逐字保留 | “严格原文不改一字” |
| C3 | `fcop-protocol.mdc` 增加 Internal/External Document Convention commentary；protocol 2.4.0 → 3.0.0 | “加 §Internal/External Document Convention commentary” |
| C4 | 同一 `fcop-protocol.mdc` 增加双图对偶 commentary | “同 mdc 加 §双图对偶 commentary” |
| C5 | `Project.init(deploy_internal_template: bool = False)` 支持显式选择启用，默认不启用 | “`… = False` opt-in” |
| C6 | 新增 `INTERNAL-README.md` 模板 | “模板新增” |
| C7 | 4 个 preset team 的 `TEAM-OPERATING-RULES.md`，每个均覆盖 zh、en，增加 internal-only 声明语法 | “4 个 preset team…(zh + en)” |
| C8 | `audit.py` 增加 internal-only 检查，级别为 P3、非阻断 | “P3 non-blocking” |
| C9 | 两处 `_version.py` 均从 1.6.0 升至 2.0.0；同步 `AGENTS.md`、`CLAUDE.md`、`.cursor/rules/*.mdc` 镜像 | “`_version.py × 2`…镜像同步” |
| C10 | CHANGELOG.md 增加 [2.0.0] 段，显式注明无 API breaking | “No API breaking despite MAJOR” |
| C11 | 新增 unit tests；1061+ 旧测试全部通过；ruff、mypy、pip_audit 全清 | “新 unit tests + 1061+ 旧 test 全过…全清” |
| C12 | README 与 LETTER-TO-ADMIN 按原文要求同步 zh/en 版本；ADR 索引补 ADR-0034 Accepted 行 | “README + LETTER-TO-ADMIN(zh/en)版本 sync” |
| D1 | dry-run 与本地全测通过 | “dry-run + 本地全测 pass” |
| D2 | agent 停手，等待 ADMIN 二次确认 | “agent 停手,等 ADMIN 二次确认” |
| D3 | 二次确认后创建并推送 `v2.0.0` tag，触发 GitHub Actions 5/5 jobs | “二次确认后 tag v2.0.0 + push” |
| D4 | 验证公网 PyPI 上两个包分别为 `fcop==2.0.0`、`fcop-mcp==2.0.0`；GitHub Release v2.0.0 含 4 个 assets | “验证 PyPI 上…+ GitHub Release…含 4 assets” |
| E1 | ADMIN 在本仓、Bridgeflow、codeflow 三处调用 `redeploy_rules()` | “ADMIN 在本仓 + Bridgeflow + codeflow 调” |
| E2 | ADR-0034 从 Accepted 转为 Implemented，并提交 | “Accepted → Implemented + commit” |
| E3 | 写整个 sprint 的 REPORT-008，归档 TASK-008，并提交 | “整个 sprint 闭环报告…archive TASK-008 + commit” |

上述各行来源分别为 §5.1、§5.2、§5.3 的对应编号；D2 的许可条件及 E1 的主体限制见下文。

## A｜动作及条件关系

- **正常发布路径**：C1–C12 全部完成且 dry-run 通过后，进入 D2 停手；D1 还独立要求本地全测通过。只有取得 ADMIN 二次确认，才可继续 D3 的 tag push 及受守门约束的公网 PyPI 发布；D4 验证发布结果；E 阶段在 release 后进行。确认是必要前提，不替代代码、测试与发布验证义务。〔§4：“C1-C12 finished + dry-run pass”“second confirm required for PyPI + main-branch tag push”；§5.3：“release 后”〕
- 本仓未装 fcop-mcp，因此本任务 §4 的 D2 显式守门声明代替自动 `decision=needs_human` REVIEW 的语义；替代的是守门表达方式，仍须等待人工二次确认。〔§3：“本仓未装…D2 守门点等价 needs_human 语义”〕
- 每个 C 阶段子 commit 必须能独立 `git revert`，且不影响其他子 commit；原文没有规定确切 commit 数量。〔§7：“每个子 commit 独立可…不影响其它子 commit”〕
- tag 已推送但 GitHub Actions 失败时，按 release SOP v2 §6 的 5-job 失败处理流程处理；PyPI 已发布且需要撤回时采用 yank；协议规则回滚由 ADMIN 调用 `redeploy_rules()`。这些是条件触发的处置要求，不是正常路径必做动作。〔§7 对应三项回滚条款〕

## P｜参与关系与权限

- ADMIN 是发令者及 D2 二次确认者，ME 是任务接收者；agent 承担守门停手义务。ADMIN 13:06 的指令仅是第一次确认、启动 sprint，**不能计作 D2 二次确认**。〔元数据；§4：“不构成 D2 二次 confirm”〕
- E1 的三处 `redeploy_rules()` 均由 ADMIN 执行，agent 不得代调；规则回滚同样由 ADMIN 执行。〔§5.3：“agent 不调,Rule 8 + ADR-0006”；§7：“由 ADMIN 调”〕
- 2.0.0 yank 后，下一个版本号由 ADMIN 决定，不能由 agent 自行选定。〔§7：“ADMIN 决定下次版本号”〕
- 原文未另行指定独立复核者、最终接收者或额外人工验收签署人；不能把二次发布确认扩展解释为所有阶段的验收签署。〔§4–§5 仅明确二次确认与各验收项〕

## R｜资源、数量及时间范围

- 数量约束分别作用于对应对象：4 个 preset team **逐个覆盖双语**（4 × 2＝8 个团队语言覆盖单元）；2 处版本文件均升级；1061+ 旧测试全过且另有新测试；发布涉及 2 个包、5/5 Actions jobs、4 个 Release assets；E1 涉及 3 个仓库。不得用其中一部分的完成替代整体要求。〔§5 C7、C9、C11、D3、D4、E1〕
- 发布目标包含公网 PyPI、`origin/main` 上的 `v2.0.0` tag 和 GitHub Release v2.0.0。〔§3：“推送到公网 PyPI”“tag 在 origin/main 上”；§5 D4〕
- 发令时间为 2026-05-13 13:06 +08:00，任务创建时间为同日 13:35 +08:00；原文没有截止时间、执行时长或费用额度。P0 不可换算为具体时限。〔§1；元数据 `created_at`、`priority`〕

## V｜版本与依据

- 版本轨道须区分：**包版本 1.6.0 → 2.0.0；rules、protocol 版本 2.4.0 → 3.0.0**。包的 MAJOR 代表协议哲学时代里程碑，CHANGELOG 仍须显式说明没有 API breaking。〔§3：“协议哲学时代的里程碑”；§5 C1、C3、C9、C10〕
- 本任务依据 SPRINT §2 详细范围、ADR-0034 §5.2 升级清单、`docs/release-process.md` v2；TASK-20260512-009 是可对照经验。Rule 9.5.1、Rule 7、Rule 8，以及 E1 的 ADR-0006、跨项目限制的 Rule 1，按原文承担对应约束。〔§3–§8〕
- rules 回滚目标是 3.0.0 → 2.4.0；旧文件据原文已自动归档于 `.fcop/migrations/<时间戳>/rules/`。实际时间戳未给定。〔§7：“旧文件已自动归档到…”〕

## C｜完成、停止与升级条件

- 完整闭环要求覆盖全部 C、D、E 验收项，包含发布后的 ADMIN 三仓重部署、ADR 状态更新、报告、任务归档和相应提交；仅成功发布两个包不足以完成整个 sprint。〔§5 全部验收项；E3：“整个 sprint 闭环报告”〕
- D2 必须停止并等待，未取得二次确认不得越过发布守门点；首次启动指令不能覆写该要求。〔§4：“STOP”“协议规则不被单条 ADMIN 指令覆写”〕
- 无回滚方案不得执行；Actions 失败、PyPI 需 yank、规则需回滚时，分别触发 A 中对应处置。〔§7：“无回滚方案 = 不得执行”〕
- 测试能否通过、ADMIN 何时确认、发布是否成功均是未来状态，不能预先判定，也不属于原文本身的歧义。〔§4–§5 的条件及待验收项〕

## B｜独立禁止、例外与局部不明

- 排除 ADR-0035、0036；0037 虽列为排除项，但原文明确 **其候选内容已由 C2 吸收**。该例外保留 C2，不授权额外开展整个 ADR-0037 工作。〔§6：“0037 候选实际被本 sprint 吸收(C2 已含)”〕
- 禁止 Bridgeflow / codeflow 仓内任何文件改动；禁止修订 release SOP、`workspace/` 路径或 Rule 7.5；禁止任何 SPRINT §2 表外子变更。〔§6 对应排除项〕
- 禁止 agent 调用 E1 的 `redeploy_rules()`；禁止改动 C2 要求严格保留的原文；C8 检查必须保持 P3 non-blocking。〔§5 E1、C2、C8〕
- PyPI 上传后只能 yank、不能删除；2.0.0 yank 后不能重用版本号。后续版本保留为 ADMIN 的未决选择，原文列出 2.0.1 / 2.1.0 / 3.0.0。〔§7：“只能 yank 不能删”“SemVer 不允许重用”〕

**具体缺口与张力：**

- SPRINT §2、SOP v2 §6、第二张图严格保留的原文等仅被引用，未随数据提供，因此不能补造其详细范围、失败处理步骤或逐字内容；4 个 assets 的身份也未列出。〔§2、§5 C2/D4、§7〕
- E1 要求 ADMIN 在 Bridgeflow / codeflow 重部署，而 §6 禁止这两仓“任何文件改动”。若重部署会改文件，两条存在适用范围张力；原文未明确是否将 ADMIN 的 E1 操作作为例外。agent 不得代调及不得跨仓改文件两条仍明确成立。〔§5 E1；§6〕
- C12 要补 ADR-0034 **Accepted** 索引行，E2 要将 ADR 状态改为 **Implemented**。阶段要求均明确，但 E2 是否还须同步索引为 Implemented，原文未说明。〔§5 C12/E2〕