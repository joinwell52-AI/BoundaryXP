# 通用事件归属与显式时序计算修复

58618 已实际更新为 **v0.1.38 · 候选**，完整安装版本 `0.1.0-candidate.031-r1.2-ui.38`，编译器 `031-r1-c12`。60 条历史、配置及原有 JSON、中文、Trace 导出摘要均保持一致。页面截图为 `deployment/58618-ui38.png`。本轮修复目标通过；整个产品仍为 `PARTIAL / CALCULUS_REPAIR_CANDIDATE_NOT_ADMIN_ACCEPTED`，不能宣称完整产品或完整 BXP 符合性已通过。

用户授权完成全流程标准对照，再连续测试、完善代码、更新版本；随后明确要求通用功能修复。本轮没有按样本文字、实体名、Case ID 或源偏移选择计算分支。开发工作区已有大量未提交改动，使用实际安装 ui.36 的完整 Manifest 建立隔离副本，没有覆盖不同版本的根目录运行源码。

## 全流程标准对照

人工标准候选位于 `docs/testing/7plus1/MANUAL-TEST-001-standard-r01/`。原文、解析与审阅两轮原始响应、机械展开、技术校验、IR、固定 7+1、中文、计算基线、原始回执及请求资源均保留。`STANDARD.md` 给出各层对照；`expected.json` 包含 23 项带来源要求及 21 个预声明运行观测场景。原文不修改，人工核对清单没有进入模型输入，历史 Gold 没有进入 expected。

原文件 SHA-256 为 `ec5fbb0e8841b391bec8f4ee8586ec6656d7d0b6690eb58670c2eb674b9ea130`，273 个正文字符加尾部换行。标准状态为 `STANDARD_REFERENCE_CANDIDATE_FOR_ADMIN_REVIEW`；冻结字节不是自动人工审定，也不是 GOLDEN_CONFIRMED。

完成判据保留原文明示的充分方向：两份报告均提交 QA、QA 复核通过、summary.md 交付 ADMIN，则任务完成。不得改为唯一完成判据或 IFF；本判据不成立不证明所有可能完成路径均不存在。总耗时 ≤30 分钟是独立要求，未加入原文没有给出的完成合取。

## 根因与通用修复

旧计算消费者只支持 `owner_id=ROOT` 的当前任务动作。局部动作属于一个已接受的整体任务容器时，IR 和 7+1 没有丢失，但义务公式与明确时序端点被拒绝计算。这是消费者的归属链能力缺口，不需要 LLM 重新理解样本。

实际修改在运行包中的 `research/7plus1-parser/llm-first-028/calculus.mjs`，可读源码差异为本目录 `RUNTIME-DIFF.patch`，完整字节和父摘要在 `product/short-compiler/owned-event-calculus-ui38-overlay.json`。

1. 验证已接受事件到 ROOT 的完整归属链。每层必须属于当前任务、主层、正向；祖先必须是无条件的必需动作，并提供真实来源证据。缺失父节点、未接受父节点、循环、缺少来源、引文父层、可选父层及带条件父层都保持具体不支持原因。不会把 `owner_id` 改为 ROOT，也不会推断父节点完成才能执行子节点。
2. 消费事件自身已有的义务、条件及禁止模态。条件义务保留前提，不生成无条件执行要求；局部许可不会变成执行义务。祖先执行者、对象、范围和条件不被任意复制给子事件。
3. 原结构已有的显式时序可以使用来源闭合的局部事件端点。合取前提分别产生边；OR、否定前提和无唯一端点保持诊断。充分触发的时序单列为带条件边，不混入无条件循环检查。归属边本身不产生时间边，产物可用性也不变成整项事件先后。
4. 每条公式和显式时间边记录事件归属路径、父子事实及各自来源；不只记录“该对象曾在上下文出现过”。运行观测仍独立，缺少观测保持 UNKNOWN。
5. 对可消费的有限范围增加外部对象归属查询，调用仓库原有唯一 Core 的 `evaluateValidatedTargetSet`，没有另写集合求解器。范围内成员 TRUE、确定范围外 FALSE、身份或归属未知 UNKNOWN；返回 FALSE 不产生执行许可。现有 `src/bxp/target-set-solver.mjs` 从固定提交 `2d244cf72ea2b23a00581f44894532c7dc6d1ddf` 原字节打包，未修改其实现；摘要见 `EXISTING-CORE-PROVENANCE.json`。

`engine.mjs` 只有版本常量从 c11 同步到 c12。合同、两个 Skill、全部 Schema、模型设置、校验器、IR 及 7+1 投影保持原字节；解析和审阅模型正文与 Schema 摘要分别相同，证据为 `MODEL-RESOURCE-PROOF.json`。本轮新增真实调用为 **0**。

## 修复前后实际结果

回放真实用户记录 `2d564b91-2496-4fd2-9314-f71eb794408b`。该原记录有 4 次真实调用、1 次局部修订，总耗时 352.325 秒；原模型结果及历史不倒改。这里使用原有最终响应进行程序回放，不能将其写成新版重新调用模型的准确率验证。

| 检查 | ui.36 | 最终 ui.38 |
| --- | --- | --- |
| 候选、独立审阅 | 原始结果 | 保持相同 |
| 技术接受 | 106 项 | 106 项 |
| IR | 82 项，来源 GAP 0 | 完全相同 |
| 固定 7+1 | 八槽 RESOLVED | 完全相同 |
| 计算结构 | PARTIAL | CALCULATED_FRAGMENT |
| 不支持项 | 13 | 0 |
| 无条件显式前置边 | 0 | 2 |
| 条件时序边 | 0 | 2 |
| 时间循环 | 0 | 0 |

23/23 逐来源语义要求通过，21/21 预声明观测场景通过，公式和时序归属路径证据完整。`final-review/` 保存技术检查、IR、最终 JSON、中文、完整 Trace 及每个观测的实际计算；`install/cli-replay-attempt-03/` 保存完整安装版 CLI 回放。

布尔约束存在可行组合，只证明明确约束结构的一致性。没有提交、复核、交付、实际耗时或立即执行的真实运行观测时，这些当前值均保持 UNKNOWN。21 项观测是显式标记的合成计算输入，不是业务执行记录，也不是模型生成的额外事实。

## 测试和未通过事项

- 新机制 19/19 PASS：任意事件 ID、多层归属、中英文谓词命名、条件义务、合取时序、显式循环、OR/否定拒绝、许可与禁止、跨容器显式边、无来源/错误父层拒绝、范围查询、原响应保持不变。
- 原启动入口 4/4 PASS，重复启动识别同一完整版本且不增加服务。
- 组合专项 90 项：89 PASS、1 FAIL。失败是旧合同响应的 IR 字节一致性断言，在未修改 ui.36 同样失败；旧 `028-r02-technical-v2` 与当前 `031-r1-semantic-closure-technical-v3` 及 `direct_status` 差异位于计算前。没有删除或改写该断言。
- 产品既有全量：修复前后均 260 项、218 PASS、42 FAIL；新增失败 **0**。**全量回归不是 PASS。**失败及原始 TAP 逐项保留于 `regression-work/`、`regression-final/`，分类见 `REGRESSION-DEBT.json`。包含历史资源/输出的冻结断言、时间与字符口径，以及依赖父安装没有的网页导出函数的运行版本测试。没有自动豁免；仍须分别完成对应版本的兼容性与当前产品验收。
- 在干净独立目录实际安装全部 138 项资源；升级、回滚、历史标记及同版 CLI 回放验证通过。安装不依赖开发目录 Skill/Schema，不启动额外端口。

ui.37 在部署前发现 Manifest 写 c12、引擎仍导出 c11，因此拒绝安装，原 ZIP 保留。修正版本常量后另封存 ui.38，没有覆盖旧包。CLI 验证脚本曾使用错误参数和错误回放目录，首次失败分别保留，使用真实 CLI 参数补测通过。服务启动后的首次在线检查曾早于监听产生 ECONNREFUSED，后续实际连接通过。详见 `PREFLIGHT-FAILURES.json`，没有把这些失败计成语义通过。

仍未证明任意自然语言都能正确理解；带条件、可选或未支持父层的激活仍有明确缺口，超出既有 Core 求解容量时仍诊断不支持。程序结构修复通过不能替代后续陌生文本语义验收。`business_decision` 和 `execution_authorization` 始终为 null。

## 运行、包和回滚

实际地址：<http://127.0.0.1:58618/>。运行包：本目录 `0.1.0-candidate.031-r1.2-ui.38.zip`，SHA-256 为 `87134e8b5a4615ebfe04aa8dcf2150cb1928f50f1ed9ea0dd8e44a627c555282`；138 项 Manifest SHA-256 为 `d9e91260eb046cb3811467705b09ef68c1c1d65b4856ee7dbef98782f485a32e`。不含依赖缓存、权重、历史或凭据，没有公开发布。

电脑重启后：

```bat
cd /d D:\boundx
npm run 7plus1:ui
```

安装路径：`D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2-ui.38`。旧历史保持生成版本，不会因当前运行升级而自动重算；查看旧记录仍会看到当时的 PARTIAL。新编译和本报告的明确回放分别记录自己的版本。

升级前核对实际 ui.36 进程身份及空闲状态，备份为 `D:\boundx\.boundx\short-compiler-031-r1\backups\ui38-2026-10-11T06-45-18.890Z`。只停止已识别的本产品服务；没有修改全局账户、启动业务操作或干扰其他 Codex。实际页面、API、静态资源、历史及导出核对见 `deployment/ONLINE.json`。

回滚前确认没有在途请求，仅停止当前本产品实例，再执行：

```bat
cd /d D:\boundx
node .boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2-ui.38\product\short-compiler\deploy.mjs rollback --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle
npm run 7plus1:ui
```

回滚切回完整 ui.36，历史保留且不重新解析。新目录 Manifest/SHA256SUMS/SEAL 封存本轮证据，旧标准、报告与安装原字节保留。只提交本轮必要文件到 review 分支，不 merge、release 或 tag。
