# 环境作用域与“立即”结构修复 / ui.36

58618 已从 ui.32 更新为 **v0.1.36 候选**，完整版本为 `0.1.0-candidate.031-r1.2-ui.36`，编译器为 `031-r1-c11`。页面、会话、静态资源、安装摘要及重启启动入口均实际核对；59 条旧历史和原有导出字节保持一致。状态为 `WAITING_ADMIN_REVIEW`，产品验收仍为 `PARTIAL`，没有公开发布、merge、release 或 tag。

本轮按用户“先修复，然后发版本”的授权，修复刚才非 Gold 手工样本暴露的两处合同问题，并将真实复测中发现的非法实体备选引用接入已有有界局部修订。旧封存、Gold、原文、7+1 定义及确定性投影架构不变。

## 实际源码与修复

开发工作区已有大量未提交改动，且根目录源码属于不同版本流。本轮以实际运行的 ui.32 安装及其 137 文件 Manifest 为唯一父版本，在隔离副本修改，再封存完整安装包。父 Manifest 为 `03c2e4cd599aea6f0ba3cbba757b09f73b3b2877e8e8389e36ca31194d871ef4`；最终 Manifest 为 `5a9065fbfdf651aedd89b4851ca27f56dc1f024e5b3828a7823f98b459a33658`。

完整真实运行源码在本目录 ui.36 ZIP 中，路径保持原样。`product/short-compiler/manual-contract-repair-ui36-overlay.json` 同时保存各变更文件的父摘要、最终摘要及完整 UTF-8 字节，没有把不同根目录实现覆盖进安装版。

1. `research/7plus1-parser/llm-first-028/validate.mjs`：原 TEST 检查允许约束事件自身属性，而 SCOPE 检查未接受相同事件，导致合法的测试环境约束被二次拒绝。现在两个检查统一使用同事件所有权：允许事件自身及其已声明角色对象；继续拒绝 ROOT 属性目标、其他事件及跨事件对象。没有按测试样例 ID 替换引用。
2. `property-tests.mjs`、`contracts/schema.mjs` 及候选/传输 Schema：增加定性 `IMMEDIATE`，其目标必须是自身事件、属性路径为空、值为 null。它表示立即且无不必要延迟，不转换为“0 秒内”或其他伪造的数值期限。条件触发与立即约束独立保留。只有同目标、同事件的明确布尔运行观测才能给出 TRUE/FALSE，缺少观测保持 UNKNOWN。
3. 共享 `semantic-contract.md` 与两个原有 Skill：同步事件属性所有权及定性立即规则；模型解释原文并生成结构，程序不扫描原文或 note 补出“立即”。任务整体容器及整体禁止不强求一个虚构的执行者，PM 组织职责不变成 DEV/OPS 执行职责。
4. `revision.mjs`：将 `BAD_IDENTITY_ALTERNATIVE` 加入现有技术修订反馈。ROOT 是作用域保留标记，不是合法实体备选。程序不自动选替代实体、不删除真实限制；模型只改被反馈的字段，再由独立会话审阅。
5. `compile.mjs`、原 UI 的 `process-view.js` / `calculation-view.js`：从同一结构显示事件目标和定性立即，避免将事件标签错报为缺失实体或显示 `IMMEDIATE null`。`engine.mjs` / `service.mjs` 的编译器、资源摘要与实际安装保持一致。

`calculus.mjs` 及 `src/bxp/` 未修改。现有 TEST/布尔约束路径消费新增操作符，业务裁决与执行授权始终为 null。

## 相同原文真实复测

输入为 `docs/testing/7plus1/MANUAL-TEST-001.txt`，273 个正文字符加末尾换行；原始字节 SHA-256 为 `ec5fbb0e8841b391bec8f4ee8586ec6656d7d0b6690eb58670c2eb674b9ea130`。人工核对清单未送入模型，没有使用 Gold 答案。

用户 ui.32 原记录 `37a34be8-ce53-4a40-8657-7c7cb9e9eebf` 保留：环境 TEST 最终绑定工作事件，但对应 SCOPE 被误拒绝；“立即”仍是覆盖缺口。其八槽状态和原结果复制到 `user-baseline/`，没有倒改。

新版首次解析及独立审阅合计 224.492 秒、2 次调用。环境和立即均已正确产生可计算结构；但模型把 ROOT 填入“本任务”实体的 alternatives，技术检查正确拒绝该引用，A 保持未决。首次失败完整保留在 `first-attempt/`，未作为整例通过。

接入通用局部反馈后的续测复用首次真实候选和审阅，追加局部修订及新会话审阅：113.914 秒、2 次调用。模型仅修改实体 `n16` 的 alternatives，其余候选不变；此 ID 只用于本条证据描述，不是运行时条件。局部修订实际模型时间 15.113 秒，独立审阅 97.652 秒。最终 ui.36 以相同真实响应做零调用回放，候选、审阅、IR、7+1 及计算结果一致。

| 槽位 | 用户 ui.32 基线 | 最终 ui.36 |
| --- | --- | --- |
| I | RESOLVED | RESOLVED |
| O | RESOLVED | RESOLVED |
| A | PARSER_COVERAGE_FAILURE | RESOLVED |
| P | UNRESOLVED | RESOLVED |
| R | RESOLVED | RESOLVED |
| V | RESOLVED | RESOLVED |
| C | PARSER_COVERAGE_FAILURE | RESOLVED |
| B | PARSER_COVERAGE_FAILURE | RESOLVED |

来源复核 14/14 通过，核对执行者、组织者、对象、文件身份、交付接收者、QA 对象、提交与复核条件方向、完成合取、整体期限、任务整体禁止、产物使用依赖、环境作用域、立即和高危触发。最终 79 条 IR 事实全部技术接受、来源 GAP 为 0。两条整体禁止的单一执行者未明确记录保留为非阻断疑点，没有强填 PM。详见 `SOURCE-REVIEW.json`、`final-proposal.json`、`final-audit.json`、`final-technical.json`、`final-7plus1.json`、`final-7plus1.zh.md` 及 `final-trace.json`。

本条来源核对通过不代表通用语义已证明正确，也不代表任务已实际执行完成。

## 测试、调用和剩余限制

- 无模型专项：58/58 PASS，0 FAIL；覆盖事件自身/跨事件/ROOT、立即的正反例与 UNKNOWN、条件方向、来源缺口、引用反馈和旧响应回放。
- 安装启动入口专项：4/4 PASS。
- 现有产品全量回归：父 ui.32 与最终 ui.36 均为 260 项、218 PASS、42 FAIL；失败名称一致，新增失败为 0。**全量回归不是 PASS。**42 项包括历史字节/资源版本锁定、旧响应、时间口径和一项运行版本测试装载问题，原始 TAP 与测试脚本适配摘要全部保留；没有将失败自动视作可忽略。
- 中间 ui.35 曾有 43 FAIL，额外一项是 HTTP 方法资源 profile 兼容标签改变。最终恢复既有 profile 标识，以资源摘要和 additive revision 标识新语义资源；解析和审阅实际正文 SHA 未改变。中间失败留在 `regression-final/`；最终对比为 `regression-delivery/`。
- 本轮真实启动 4 次、内部重试信号 0 次，保守上限 6，余 2 未消耗；服务端收费次数不可观测。旧 032 账本和预算不重置。请求模型 `gpt-6.1-sol / medium`，服务端实际模型未披露，不把请求值写成服务端证明。
- 计算仍为 **PARTIAL**，仍有 `OWNED_EVENT_ACTIVATION_SCOPE_NOT_SUPPORTED`、`ORDER_ENDPOINT_ACTIVATION_SCOPE_NOT_SUPPORTED`。没有运行观测，属性、条件及数量当前值保持 UNKNOWN；不能声称完整边界计算、BXP 符合性或执行授权。具体见 `final-calculations.json`。

## 使用、安装与回滚

实际页面：<http://127.0.0.1:58618/>，页头显示 **v0.1.36 · 候选**。页面截图为 `deployment/58618-ui36.png`。升级后未启动新模型请求或新用户端口。

电脑重启后：

```bat
cd /d D:\boundx
npm run 7plus1:ui
```

该入口启动或识别同一完整安装版本，不混读开发目录 Skill/Schema。安装位置：`D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2-ui.36`。

运行包：本目录 `0.1.0-candidate.031-r1.2-ui.36.zip`，SHA-256 `94a9e26e4746dfa95b751523f0c180dd160753bdff3c95117f515baee4157843`。包含 137 项完整核心/UI/Skill/合同/Schema 和 Manifest；不含缓存、权重、node_modules 或凭据。解压后在包根目录执行 `node product/short-compiler/deploy.mjs install --home <独立安装目录> --port 58618`，该命令通过锁定依赖安装；端口被占用时不得并行替换现有服务。已在独立目录验证安装、升级、回滚和 137 项摘要一致。

本机升级前备份：`D:\boundx\.boundx\short-compiler-031-r1\backups\ui36-2026-10-11T01-14-29.257Z`。核对原进程身份、空闲请求及备份后，仅停止本产品旧 58618 实例；旧 ui.32 安装和数据未覆盖。启动后首次连接检查遇启动瞬间 ECONNREFUSED，后续真实在线检查通过，错误没有计作语义失败。59 条历史文件与 JSON、中文及完整 Trace 导出摘要逐条一致，详见 `deployment/PREFLIGHT.json` 与 `deployment/ONLINE.json`。

需要回滚时，先确认 58618 无在途请求并只停止该安装实例，再执行：

```bat
cd /d D:\boundx
node .boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2-ui.36\product\short-compiler\deploy.mjs rollback --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle
npm run 7plus1:ui
```

回滚切回 ui.32，保留历史，不重新解析。Manifest/SHA256SUMS/SEAL 只封存本轮新目录，旧封存原样保留。只提交本轮运行包、变更 overlay、证据、脚本及启动入口新增一行，其余本地改动不提交。
