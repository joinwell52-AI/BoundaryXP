# 字段闭环

| Skill要求 | Schema字段 | 校验函数 | 编译消费 |
|---|---|---|---|
| 引文/重复出现定位 | sources/mentions.quote+occurrence | linkQuote/linkSources | compileBoundary.make/proof |
| 实体同一性与竞争 | entities.id/alternatives | technicalValidate: BAD_IDENTITY_ALTERNATIVE/COMPETING_IDENTITIES | ROLE.entity、局部status |
| 事件/层级/模态 | events.kind/layer/use/modality/polarity/owner_id | technicalValidate: event引用与审阅 | EVENT→A/B/retained_nonprojected |
| 逐事件角色/用途 | claims.ROLE.event_id/entity_id/role | ROLE_SIGNATURE、实体依赖 | ROLE→I/O/P/V |
| 条件方向/目标/时间 | claims.CONDITION.expression_id/direction/temporal，events.constraint_ids | CONDITION_SIGNATURE、CONSTRAINT_BINDING_* | constraints附着每一用途，不无条件化 |
| 单纯先后 | claims.TEMPORAL | TEMPORAL_DIRECTION | constraints，同IR中文 |
| 数量及计数范围 | claims.QUANTITY.quantity | QUANTITY_SIGNATURE/OWNERSHIP/TARGET | R/产物content_quantities、evaluateQuantity |
| 根完成停止 | claims.COMPLETION/STOP.scope_id | ROOT_TRANSITION_SIGNATURE | C、expression |
| 固定逻辑/集合/状态 | expressions.op/operands/state | EXPRESSION_ARITY/SIGNATURE/REFERENCE | expression、evaluateExpression |
| 真依赖而非上下文 | requires；audit.context_refs | REQUIRED_DEPENDENCY_* | status/proof；context不扩散 |
| 局部疑点 | issues.subject_ids/field_path；audit.reviews/ issues | 仅直接subject及真依赖传播 | 局部UNRESOLVED，不污染独立用途 |
| 覆盖/漏项 | coverage / audit.omissions.affected_views | COVERAGE_INVALID | gaps与PARSER_COVERAGE_FAILURE |

宿主生成最终技术状态、事实ID与摘要，不由模型签发。这里的类型/审阅接受不等于原文真值证明。

## 028-r02.3 的局部闭环

- 整节点路径：`normalizedFieldPath` 仅识别空路径、精确 `collection[id]` 和其属性前缀；属性支持不能代替整节点支持。
- 类别与身份：`technicalValidate.rows.identity_status` 保留明确身份、`unresolved_properties` 保留 type 疑点；角色/STATE/ITEM 的隐式实体依赖只需要身份，显式 requires 要求完整节点接受。身份竞争、来源失败、整节点反对均继续阻断。
- `evaluateExpression` 根据明确 STATE 参数与极性计算有限 Boolean 片段，最多枚举10个未知状态；单个状态继续 UNKNOWN，不作业务裁决。不同对象/事件不合并。
- Skill 操作方式限制不新增必做动作；新合同须真实重跑规定短文本，旧摘要不兼容的响应禁止当作新方法回放。
