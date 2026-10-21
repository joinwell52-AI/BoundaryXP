# L3 租户/单位语义包契约（设计预留）

> 生产者方法／研究资产，不重新定义 BXP；当前标准 IR 与本地计算以固定 BXP-0001 为准，EXTRACT 尚未启用。Producer methods only; no extraction conformance claim.

L3 用于私有别名、单位术语和场景增量，最终必须归一到已启用 L2 frame 或 L1 原语。`tenant-overlay.schema.json` 定义增量合同，`example-software-team.json` 给出不含真实单位数据的示例。当前版本尚未实现 L3 加载和运行时热插拔。

## 允许的增量

- 私有称呼到 L2/L1 类型的候选映射；
- 单位惯用动作短语到既有 frame 的别名；
- 带来源、版本和生效范围的政策引用；
- 冲突、未登记称呼和缺失关系的 unresolved 诊断。

## 不允许的静默覆写

“专职财务审批人 → FinanceApprover”可以是角色类型候选，但 `limit ≤ 50 万`、终审权或审计等级不是普通词条属性。它们必须来自另行验证的单位政策原文，并保留政策版本、生效时间、适用主体和证据区间。词条命中不证明该人员已获授权。

BXP 协议定义 7+1，L1 只提供通用语义原语。L3 不得覆盖 L0 证据规则、BXP 的 7+1 定义、L1 operation 含义或 L2 frame 含义。同名/同触发词冲突必须拒绝加载或返回 unresolved，不以租户层优先级静默取代上游。

BXP defines 7+1; L1 supplies general semantic primitives only. L3 must not override protocol invariants or upstream operation/frame meanings.

## 安全回退

未登记称呼（例如“张总特批代表”）应输出 `unresolved_role` 和人工复核请求。宿主执行系统可以采用 fail-closed，在复核前不执行高风险动作；不能把未知称呼伪造成原文 B 或已授权事实。这是设计要求，不表示 L3 运行时已经交付。

### 包采用/绑定状态与协议权力边界 / Binding vs Authority

| 字段 | 所属对象与含义 | 边界 |
|---|---|---|
| `policyBindings[].decision: null` | L3 语义包的采用/绑定决定尚未作出；绑定 `status` 仍为 `candidate` | 不是现实业务审批，也不是 BXP 结果字段 |
| `business_decision: null` | `boundx-result/v1` 的业务裁决权力边界 | BoundaryXP 不作业务裁决 |
| `execution_authorization: null` | `boundx-result/v1` 的执行授权权力边界 | BoundaryXP 不授予执行权 |

这三个字段不能互相替代、复制或推导。L3 当前 Schema 将绑定 `decision` 固定为 `null`，不允许据此新增非空状态；候选绑定不构成业务授权。BXP 两个字段始终保持 `null`，由宿主在协议结果之外处理实际审批和执行。

L3 `policyBindings[].decision` records an undecided pack adoption/binding decision, with `status: candidate`; it is not a BXP result field. BXP `business_decision` and `execution_authorization` express separate authority boundaries and always remain null. None of these three fields can substitute for or imply another, and the current L3 schema does not permit a non-null binding decision.

未来实现还需要包签名、租户隔离、允许列表、资源上限、启停审计、政策有效期和固定语料回归。
