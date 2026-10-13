# 类型化接口一致性修复 r01

2026-10-13。状态：DEVELOPMENT_TESTED_NOT_DEPLOYED。本轮修程序消费者，不改变两套 Skill、合同、Schema、模型配置或历史 IR。用户正在原 58618 安装测试004，本轮没有重启或替换该服务。

## 问题和通用修复

原实现把任务归属分别写在输入检查、事件域检查、联合计算的不同位置；ROOT 范围标记又被直接拼成总耗时的事件时间点。另一方面，EVENT_INSTANCE/PREVIOUS_INSTANCE 在事件上下文可求值，在等式上下文却报未实现。这些是类型接口消费者不一致，不依赖任务原文句式。

- 新增唯一任务身份消费者 `direct-ir-task-scope.mjs`：实际 TASK ID 优先；没有显式 ROOT 节点时，ROOT 只在根任务唯一时解析。多根歧义、缺失与循环归属保持未知，不按文本、名称或数组首项猜测。输入、事件策略、全称构造、生命周期和禁止模式复用该语义。
- TOTAL_DURATION 按已有 REAL 变量的显式 EVENT owner 绑定 TASK 起止，同时校验变量与要求的范围一致。不再制造 ROOT:start/end；有耗时但无业务动作的任务仍有显式任务生命周期。缺失或冲突归属报告具体缺口。
- 新增共享 EVENT 项求值器 `direct-ir-event-identity.mjs`：直接事件、事件实例、前次实例和量词绑定事件变量具有一致身份；等式、事件操作及构造见证复核复用。前次索引越界、未绑定变量保留问题，事件相等不添加发生义务。

没有添加案例 ID、实体名、句式关键词或从原文/note 补语义的规则。没有把有限列举当成实际实例全集，没有静默删除审阅缺口。

## 无模型检查

129 项通过，0 失败，包括既有 123 项及 6 组新增接口机制测试。新增组内参数对照覆盖：

1. 根任务任意改名、显式 owner 与唯一 ROOT 范围标记；时间、输入及事件消费者一致。
2. 子孙任务、其他独立任务、多根歧义、缺失归属及循环；不扩大任务域。
3. 缺失/错误总耗时 owner、错误范围以及没有业务动作的任务。
4. 前次实例和嵌套前次实例参与等式，独立整数减法作为对照；相等得到可满足、不相等得到冲突、越界保持缺口。
5. EVENT 变量进入 EQ、NOT、OR、FORALL；见证复核保持一致，不凭身份表达制造事件发生。
6. 归属不明不会变为空集合，也不会让全称规则自动通过。

命令：

```text
node --test tests/direct-ir-*.test.mjs tests/direct-candidate-ir.test.mjs product/short-compiler/tests/live-progress.test.mjs product/short-compiler/tests/process-presentation.test.mjs
```

## 两份冻结真实响应回放

使用原 IR 和原技术接受记录，未重新调用模型，未改变来源、审阅或覆盖声明。回放工具为 `scripts/replay-direct-ir-interface.mjs`，输出独立保存并校验原 Trace 字节不变。

| 原运行 | 原程序 | 修复后程序 | 界限 |
| --- | --- | --- | --- |
| f29396fc-a589-4001-a3bc-7841984ef239 / Skill | PARTIAL，总耗时见证校验失败 | CALCULATED；139 项见证检查通过 | 只证明这份已表达 IR 的约束可满足；不证明原文语义完整 |
| 65abcca1-3e7a-48d8-a15b-6b587b3caafb / Skill1 | PARTIAL，13 条诊断 | PARTIAL，11 条诊断 | 消除 INPUT_USE_SCOPE_UNKNOWN、TERM_NOT_IMPLEMENTED:PREVIOUS_INSTANCE；保留原审阅、覆盖及修订未应用问题 |

Skill1 的剩余 11 条不是 11 个独立语义错误，包含同一修改操作缺口的节点和要求依赖诊断。不能为了得到 CALCULATED 去删除这些诊断。

本地回放证据：`D:/boundx/.boundx/interface-repair-20261013/RESULTS.json` 及两份 calculation.json。两份原始 Trace 的 SHA256 分别为：

- Skill：`6a4935f29dbcf4ec50bb58464a7177244103d86d2b28a67b821cc2f6d0f5d6e8`
- Skill1：`e787bed84937b1f58226d9e68a9f729746a2297a46e7b2613bdccf829d911879`

## 尚未解决，不能冒称接口全面完成

- 实际重复事件全集与计数上限的闭合表达。
- WRITE 与修改既有文件的精确语义，以及其他操作类别的范围。
- 对未支持的其他算子组合、开放域求解和观察记录接口，本轮没有宣称全覆盖。
- 002 中已发现的模型多造规范数据就绪、漏严格先后或交付完成精度，需要独立语义修订，不能由本次消费者修复伪装消失。

这些边界应按类型、算子和组合维护能力与反例测试，而不是按每份任务文本追加特例。本轮新增模型调用 0；没有重新打包、升级58618或宣称产品验收通过。
