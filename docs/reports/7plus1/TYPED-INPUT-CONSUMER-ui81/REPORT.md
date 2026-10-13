# ui81：输入范围消费者一致性修复

2026-10-13；消费者修复，不改变 Skill、合同、Schema、模型或原始运行结果。

## 缺陷与修改

ui80 的集合摘要只从 TASK.INPUT_OBJECT 角色读取输入。Skill1 通过 SUBSET(TASK_EXTERNAL_INPUTS(task), GROUP_MEMBERS(group)) 完整表达三个输入，但未重复写入 TASK 角色，导致摘要错误显示零个。不是模型漏掉三个输入。

增加共享类型化集合消费者：读取明确任务输入子集约束，支持 SET、GROUP_MEMBERS、UNION、INTERSECTION、DIFFERENCE；摘要和输入观测核查共用同一结果，计算器复用同一集合运算。相同任务上的无条件合取边界取交集；保留任务范围、技术接受状态、条件和来源路径。不得从 OR、否定、蕴含或条件中提取无条件许可。没有确定域时输出 null/UNKNOWN，不当成空集合；明确空集合数量才为 0。单独输入角色列举不证明排他允许域。

同时修正完成公式摘要对 EVENT_OCCURRED 叶子的程序崩溃：转换到既有 Core 布尔求值器，保持“事件发生”与“交付完成状态”区别，不替 LLM 改语义。未支持公式保留具体计算缺口。补齐 patch-call 回执，使未应用的局部修订也计入耗时与调用次数。

页面、中文导出、JSON 使用同一个计算摘要；“允许输入域”不表示实际已经使用或获得业务执行许可。

## 冻结真实响应回放

同一原文 SHA256：`a6a07b7309f7afd5b51a8afe3b76164f8a977cdb09422aada431f75e9a71484f`。

| 原运行 | 方法 | 输入 | 产物 | 并集 | 完成公式满足/违反 | 整体 |
| --- | --- | ---: | ---: | ---: | --- | --- |
| 50b7f312-435b-4868-8778-b8ccc135069c | Skill | 3 | 2 | 5 | 4 / 4 | PARTIAL |
| 8abb3852-bb95-4abf-8fd6-c0e35cfc4716 | Skill1 | 3 | 2 | 5 | 4 / 4 | PARTIAL |

两份完成公式数值相同不代表语义相同：Skill 使用 EVENT_OCCURRED(deliver_check)，Skill1 使用交付完成状态；仍须按原文核对。保留 Skill 的三个 INSTANCE_INDEX_NOT_FIXED_NONNEGATIVE_INTEGER 缺口，以及 Skill1 的 AUDIT_OMISSION、COVERAGE_GAP、REVISION_NOT_APPLIED。没有把有限实例列举当作任意未来重试已经封闭，也没有删除上限限制。

Skill1 的真实调用是解析 206.218 秒、审阅 223.756 秒、局部修订 36.330 秒，共三次；总计 468.346 秒，剩余本地开销 2.042 秒。旧界面漏读 patch-call，曾错误提示回执不完整。本次没有重新调用模型，历史 IR、审阅、Trace 原字节不变。

## 验证

123 项检查通过：原有 115 项，以及 8 项新增机制测试（包含多组参数对照）。覆盖改 ID、0/1/2/3/5/9 个成员、五种集合表达、重复成员、范围内外观测、未知成员所属任务、缺失与循环引用、技术未接受节点、条件与子任务隔离、AND/OR 区分、输入角色非排他证明、完成公式两类叶子及修订调用计数。未扫描原文或 note 补答案。

命令：

```text
node --test tests/direct-ir-*.test.mjs tests/direct-candidate-ir.test.mjs product/short-compiler/tests/live-progress.test.mjs product/short-compiler/tests/process-presentation.test.mjs
```

本地证据目录：`D:/boundx/.boundx/typed-input-repair-20261013/`。`replay.mjs` 对两份真实原始响应进行摘要检查、IR/audit 对象一致性及原 Trace 字节检查；模型资源摘要必须完全一致。安装部署事实另记 DEPLOYMENT.md，不能以此源码报告预先宣布上线成功。

完整产品语义验收尚未通过。本修复解决已确认的消费者错误，不宣称 LLM 语义或重试全模型已经正确。
