# 032 续作：首批关键组来源复核

固定版本：`0.1.0-candidate.032.3 / 032-c3 / 032.1`。没有修改模型可见资源、核心或消费代码；执行顺序为 Q05、D01—D08、S00，逐条编译并完成来源复核后才启动下一条。

本组 10/10 完整编译并已逐层复核：8 项 `SOURCE_FAITHFUL`、2 项 `CLARIFICATION_CORRECT`。这是执行者根据原文的验收复核，不是新的 ADMIN Gold，也不把模型 SUPPORT 当作语义成绩。全部原始候选、审阅、请求回执、技术校验、Boundary IR、JSON、中文和完整 Trace 位于 `runs/domain-c3/<ID>/attempt-01/`。

| 来源 | 来源复核 | 关键证据与结论 |
|---|---|---|
| Q05 | CLARIFICATION_CORRECT | 全称禁止保留；限定文件内和未限定任务类别两个域在 DOMAIN_CHOICE 中竞争，B 局部未决；明确 I/O/A/P 不受污染。没有以任一解释冒充最终范围。 |
| D01 | SOURCE_FAITHFUL | 显式“该文件内”确定 settings.json 内全称，列表与生成义务完整。 |
| D02 | SOURCE_FAITHFUL | 明确跨文件禁止采用未局限于单文件的任务类别域；不扩大正向输入或新增许可。 |
| D03 | SOURCE_FAITHFUL | 唯一“其中”承接 alpha.json；独立 QA 生成 check.md 保留。 |
| D04 | SOURCE_FAITHFUL | 两文件类别域的 UNION 上施加 FORALL；没有仅禁止两个文件名或制造 DOMAIN_CHOICE。 |
| D05 | SOURCE_FAITHFUL | app.json 配置域上的 FORALL(EXCEPT(...,debug))，debug 的容器身份保留；例外不等于更改许可。 |
| D06 | SOURCE_FAITHFUL | 分别绑定 a.json/timeout、b.json/retries 两个具体项；不扩大成全称，也不把项名 retries 变成重试限制。 |
| D07 | CLARIFICATION_CORRECT | “该文件”保留 a.json/b.json 两个域备选；读取两文件与 QA 生成 audit.md 继续明确。 |
| D08 | SOURCE_FAITHFUL | 追加说明后确定 settings.json 内全称；不授予其他对象操作权限。它是独立新源，不替换 Q05。 |
| S00 | SOURCE_FAITHFUL | 同报告身份、产物使用依赖、提交许可必要前提与 AFTER、读取重试 ≤3、提交成功充分完成条件、原文件禁止修改完整。状态值保持 UNKNOWN。 |

计算范围核对另存于 `ACTUAL-RANGE-MEMBER-CHECK-Q05-D01.json` 和 `ACTUAL-RANGE-MEMBER-CHECK-D05.json`：使用真实响应中的范围树查询模拟成员，区分域内、域外、未知归属及例外；这不是读取真实业务文件或获得执行许可。

关键组外层启动 20 次、可见内部重试信号 1 次，新增保守占用 21；加历史原样保留的 108，总占用 129/360。服务端实际收费次数未知。D05 的首次请求、重试信号和结果均保留，未挑选重跑结果。

后续仍须完成原 79 次中的剩余 69 次、重复比较、产品质量门和部署后真实页面冒烟。本报告不声明完整产品已验收或 58618 已升级。
