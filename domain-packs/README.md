# L0 内核 + 三层语义包治理

界痕只有一套语义合同：`action / role / fact → I/O/A/P/R/V/C + B`。L0 是固定 BXP 验证与计算内核；语言/语义包仅分 L1、L2、L3 三层，是生产者方法，不是协议。当前 Python 包加载是有限研究实现，尚未输出标准 BXP IR，BXP-EXTRACT 保持 RESERVED。

Packs support producer-side interpretation, not alternative BXP semantics. The production core consumes explicit IR and never automatically loads policies or packs.

| 层级 | 性质 | 职责 | 当前落点 |
|---|---|---|---|
| L0 | 内核，不是语言包 | 原文码点证据、三态、7+1 不变量与五类计算 | src/bxp/，唯一 Schema 注册表 |
| L1 | 基础语义包 | 跨行业 operation、模态、通用角色和基础动作词 | `python/semantic_lexicon.json` 与 Lark 语法 |
| L2 | 垂直语义包 | 行业动作框架、实体类型、中英文触发词 | `domain-packs/l2/<pack-id>/` |
| L3 | 业务定制包 | 单位/租户私有术语、受控别名和场景增量 | 预留 `domain-packs/l3/` 契约 |

这个结构让 L1 保持小而稳定，L2 按行业安装，L3 只维护差异；所有层最终仍进入 L0 的同一合同，不复制 7+1 计算代码。

## 组合与冲突规则

1. 宿主必须按 pack ID 明确注册和启用语义包，不扫描目录自动启用。
2. 加载前校验 schema、层级、pack ID/version、frame ID、operation/role 一致性和实体引用。
3. L2/L3 只能映射到 L1 已有 operation；不得覆盖 L0 证据与安全不变量或重新定义 7+1。
4. 更长、更具体且唯一的触发短语可先于其短词匹配，例如“评审设计”先于“评审”。
5. 相同归一化触发词命中多个 frame 时必须声明全部候选，运行时返回 unresolved；不得按 L3/L2/L1 层级或加载顺序偷选。
6. L3 默认只增不改。重复 frame ID、未声明触发词碰撞、未知 operation 或弱化边界的包应拒绝加载。
7. 卸载 L2/L3 只应减少该包候选，不应改变 L1 对同一原文的既有解释。

## 当前实现状态

首个 `software-ai@0.1.0` 是 L2 预览包。当前适配器在代码中显式启用它，并对单包做完整交叉引用和歧义声明校验。

L1 目前仍由既有 `semantic_lexicon.json` 承担，尚未迁移为独立目录包。L3 只定义治理边界，尚未实现多包组合、运行时 UI 热插拔、租户上传、签名校验、隔离审计或模型微调。这里的“插件化”指受控数据包与 adapter 边界，不表示任意代码插件可以执行。
