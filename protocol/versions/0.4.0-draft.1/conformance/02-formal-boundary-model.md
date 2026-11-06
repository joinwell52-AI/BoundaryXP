# formal-boundary-model

> 25 cases · all applicable · all Producer-scored

# BXP-0.4-CASE-026 · 兼容区间求交非空
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证非空区间求交。

## 2. Source / 测试输入

> 为参数 target_value 选择一个实数，使其同时满足下界 20 和上界 100；记录所选值即完成。

- `source_digest`: `19c88f90e95b7e8be362cb4f521be9de20c229aed5f23da34818f24c48fb1c4e`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | target_value | “参数 target_value” |
| **O** | `resolved` | a value in [20,100] | “同时满足下界 20 和上界 100” |
| **A** | `resolved` | select_value | “选择一个实数” |
| **P** | `absent` | — | — |
| **R** | `resolved` | 20<=target_value<=100 | “下界 20 和上界 100” |
| **V** | `absent` | — | — |
| **C** | `resolved` | selected_value_recorded | “记录所选值即完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "target_value"
  ],
  "Sigma": "real_numbers",
  "Q": [
    "target_value>=20",
    "target_value<=100"
  ],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "target_value>=20",
    "target_value<=100"
  ]
}
```

## 5. Gold 断言

```text
SolutionSet=[20,100]
SolutionSet!=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.INTERVAL_NONEMPTY`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-027 · 互斥区间导致空解空间
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证空区间产生 inconsistent。

## 2. Source / 测试输入

> 为服务设置 latency 目标值，要求该值同时不超过 100ms 且不低于 200ms；只有同时满足两个条件才算完成。

- `source_digest`: `7a84baa8883f64bacfacfd5180e1f43a8d10f4269c09eae38937e73e728b0b78`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | latency target | “latency 目标值” |
| **O** | `resolved` | latency satisfying both bounds | “同时不超过 100ms 且不低于 200ms” |
| **A** | `resolved` | set_latency_target | “设置 latency 目标值” |
| **P** | `absent` | — | — |
| **R** | `resolved` | latency<=100ms and latency>=200ms | “不超过 100ms 且不低于 200ms” |
| **V** | `absent` | — | — |
| **C** | `resolved` | both_constraints_satisfied | “同时满足两个条件才算完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "latency_ms"
  ],
  "Sigma": "real_numbers",
  "Q": [
    "latency_ms<=100",
    "latency_ms>=200"
  ],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "latency_ms<=100",
    "latency_ms>=200"
  ]
}
```

## 5. Gold 断言

```text
SolutionSet=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "inconsistent",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.INTERVAL_EMPTY`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-028 · 开闭端点在同一点冲突
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证端点开闭语义。

## 2. Source / 测试输入

> 为参数 x 选择一个实数，要求 x>10 且 x<=10；满足全部约束才算完成。

- `source_digest`: `741214574b47ad1da00d0583bf1f358f9020790934baaf6f28028474a7f514d2`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | x | “参数 x” |
| **O** | `resolved` | x satisfying all constraints | “x>10 且 x<=10” |
| **A** | `resolved` | select_value | “选择一个实数” |
| **P** | `absent` | — | — |
| **R** | `resolved` | x>10 and x<=10 | “x>10 且 x<=10” |
| **V** | `absent` | — | — |
| **C** | `resolved` | all_constraints_satisfied | “满足全部约束才算完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "x"
  ],
  "Sigma": "real_numbers",
  "Q": [
    "x>10",
    "x<=10"
  ],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "x>10",
    "x<=10"
  ]
}
```

## 5. Gold 断言

```text
SolutionSet=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "inconsistent",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.OPEN_CLOSED_EMPTY`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-029 · 整数域归一化
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证整数域得到 {3,4}。

## 2. Source / 测试输入

> 将副本数 replicas 设置为整数，要求 replicas>2 且 replicas<5；保存配置后完成。

- `source_digest`: `ee4d6919e3955f6595983990a69d1517e2032ada41573ec038e10a060f62d053`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | replicas | “副本数 replicas” |
| **O** | `resolved` | replicas in {3,4} | “replicas>2 且 replicas<5” |
| **A** | `resolved` | set_replica_count | “设置为整数” |
| **P** | `absent` | — | — |
| **R** | `resolved` | replicas is integer; 2<replicas<5 | “设置为整数，要求 replicas>2 且 replicas<5” |
| **V** | `absent` | — | — |
| **C** | `resolved` | configuration_saved | “保存配置后完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "replicas"
  ],
  "Sigma": "integers",
  "Q": [
    "replicas>2",
    "replicas<5"
  ],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "replicas in Z",
    "replicas>2",
    "replicas<5"
  ]
}
```

## 5. Gold 断言

```text
SolutionSet={3,4}
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.INTEGER_NORMALIZATION`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-030 · 必需修改目标与禁止目标有交集
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证集合交集冲突。

## 2. Source / 测试输入

> 修改对象 A 和 B；同时明确禁止修改 B 和 C；只有所有要求同时满足才算完成。

- `source_digest`: `ed10df18d09619743cedc05fa349db50b2a352334a7e5cf3607ab168de7db9e8`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | objects A,B,C | “对象 A 和 B”“B 和 C” |
| **O** | `resolved` | A and B modified without forbidden changes | “修改对象 A 和 B” |
| **A** | `resolved` | modify | “修改” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | all_requirements_satisfied | “所有要求同时满足才算完成” |
| **B** | `resolved` | no modify(B); no modify(C) | “禁止修改 B 和 C” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "A",
    "B",
    "C"
  ],
  "Sigma": "modifiable_targets",
  "Q": [
    "modify(A)",
    "modify(B)"
  ],
  "F": [
    "modify(B)",
    "modify(C)"
  ],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
RequiredAndForbiddenOverlap={modify(B)}
SolutionSet=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "inconsistent",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.REQUIRED_FORBIDDEN_OVERLAP`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-031 · 必需修改目标与禁止目标不相交
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证集合不相交。

## 2. Source / 测试输入

> 修改对象 A；禁止修改对象 B 和 C；A 修改完成且未触碰 B、C 即完成。

- `source_digest`: `6f94a62747e27cabb103505f86f8caf5817a2f61def0b41bf0efd2228af6b626`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | objects A,B,C | “对象 A”“对象 B 和 C” |
| **O** | `resolved` | A modified | “修改对象 A” |
| **A** | `resolved` | modify | “修改” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | A_modified_and_BC_untouched | “A 修改完成且未触碰 B、C 即完成” |
| **B** | `resolved` | no modify(B); no modify(C) | “禁止修改对象 B 和 C” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "A",
    "B",
    "C"
  ],
  "Sigma": "modifiable_targets",
  "Q": [
    "modify(A)"
  ],
  "F": [
    "modify(B)",
    "modify(C)"
  ],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
RequiredAndForbiddenOverlap=empty
SolutionSet!=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.SET_DISJOINT`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-032 · 交接缺少必需制品
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证 handoff deficit。

## 2. Source / 测试输入

> 阶段 1 必须为阶段 2 交付 schema.json，阶段 2 只有收到 schema.json 才能开始；当前阶段 1 只计划输出 model.bin。

- `source_digest`: `e21261c952239c092355cc8fc38cbfcc66e910e8ef4f85749a38f0dd5ed16312`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | stage1, stage2, schema.json, model.bin | 原文阶段与制品 |
| **O** | `resolved` | schema.json handed off to stage2 | “必须为阶段 2 交付 schema.json” |
| **A** | `resolved` | handoff_artifact | “交付” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | stage2_can_start_after_schema_received | “只有收到 schema.json 才能开始” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "stage1",
    "stage2",
    "model.bin",
    "schema.json"
  ],
  "Sigma": "pipeline",
  "Q": [
    "stage2 requires schema.json"
  ],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [
    "stage1 outputs model.bin",
    "stage2 input schema.json"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
MissingHandoff={schema.json}
SolutionSet=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "inconsistent",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.HANDOFF_DEFICIT`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-033 · 交接制品闭合
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 handoff satisfied。

## 2. Source / 测试输入

> 阶段 1 输出 schema.json 并交给阶段 2；阶段 2 收到 schema.json 后开始处理，成功接收即完成交接。

- `source_digest`: `4d18e834310d6f02d413263d49fcdd3d4dadad12e05f3cb9d067f01ba0636088`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | stage1, stage2, schema.json | 原文阶段与制品 |
| **O** | `resolved` | schema.json delivered to stage2 | “输出 schema.json 并交给阶段 2” |
| **A** | `resolved` | handoff_artifact | “交给阶段 2” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | schema_received_by_stage2 | “成功接收即完成交接” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "stage1",
    "stage2",
    "schema.json"
  ],
  "Sigma": "pipeline",
  "Q": [
    "stage2 requires schema.json"
  ],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [
    "stage1 outputs schema.json",
    "stage2 input schema.json"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
MissingHandoff=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.HANDOFF_SATISFIED`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-034 · 强制前置依赖形成环
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证 dependency cycle。

## 2. Source / 测试输入

> 安排任务 A、B、C 的前置关系：A 必须在 B 之后，B 必须在 C 之后，C 又必须在 A 之后；排出合法顺序才算完成。

- `source_digest`: `8e998ad620a176b5f375285f56651271deace03076209379e123dd9a719f454e`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | tasks A,B,C | “任务 A、B、C” |
| **O** | `resolved` | a valid execution order | “排出合法顺序” |
| **A** | `resolved` | order_tasks | “安排…前置关系” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | valid_order_exists | “排出合法顺序才算完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "A",
    "B",
    "C"
  ],
  "Sigma": "dependency_graph",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [
    "B before A",
    "C before B",
    "A before C"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
DependencyCycle=true
SolutionSet=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "inconsistent",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.DEPENDENCY_CYCLE`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-035 · 强制前置依赖为 DAG
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 DAG 可拓扑排序。

## 2. Source / 测试输入

> 安排任务 A、B、C：A 在 B 之前，B 在 C 之前；给出满足前置关系的执行顺序即完成。

- `source_digest`: `a7ffef2e8c7f7dacb3218cd75d42fba1efa767c444c931888ed66461acae9d23`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | tasks A,B,C | “任务 A、B、C” |
| **O** | `resolved` | valid execution order | “给出满足前置关系的执行顺序” |
| **A** | `resolved` | order_tasks | “安排” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | valid_order_recorded | “执行顺序即完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "A",
    "B",
    "C"
  ],
  "Sigma": "dependency_graph",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [
    "B before A",
    "C before B"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
DependencyCycle=false
TopologicalOrderExists=true
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.DEPENDENCY_DAG`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-036 · 命题约束可满足
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证逻辑 satisfiable。

## 2. Source / 测试输入

> 规则规定 approved=true 时必须 deploy=true；当前 approved=true。计算 deploy 的必需状态并记录结果。

- `source_digest`: `07caaba7e31da8c60bb60d078a45f38c6b934e74939fb60899248943552bdee6`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | approved, deploy | 原文布尔变量 |
| **O** | `resolved` | required deploy state | “计算 deploy 的必需状态” |
| **A** | `resolved` | evaluate_logic | “计算” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | deploy_state_recorded | “记录结果” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "approved",
    "deploy"
  ],
  "Sigma": "boolean_logic",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "approved implies deploy",
    "approved=true"
  ]
}
```

## 5. Gold 断言

```text
deploy=true
Satisfiable=true
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.LOGIC_SAT`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-037 · 命题约束不可满足
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证逻辑 unsatisfiable。

## 2. Source / 测试输入

> 当前约束同时要求 deploy=true 和 deploy=false；验证是否存在满足全部约束的状态并记录结果。

- `source_digest`: `30a9ebc0a86878ffc437312035a9c142d5622f16bab9c63b2f1bb1f07593158e`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | deploy | “deploy” |
| **O** | `resolved` | satisfiability result | “验证是否存在满足全部约束的状态” |
| **A** | `resolved` | evaluate_logic | “验证” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | satisfiability_recorded | “记录结果” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "deploy"
  ],
  "Sigma": "boolean_logic",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "deploy=true",
    "deploy=false"
  ]
}
```

## 5. Gold 断言

```text
Satisfiable=false
SolutionSet=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "inconsistent",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.LOGIC_UNSAT`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-038 · 时间顺序可满足
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 temporal ordering。

## 2. Source / 测试输入

> 部署必须在 build 完成之后开始，并要求 build_end<deploy_start；确认时间顺序满足后完成。

- `source_digest`: `c68b129b93ed5bf8931a12cca36c9f6331871be67d7356dcdb506027ca6f7a06`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | build_end, deploy_start | 原文时间点 |
| **O** | `resolved` | valid build-before-deploy order | “部署必须在 build 完成之后开始” |
| **A** | `resolved` | validate_temporal_order | “确认时间顺序” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | temporal_order_validated | “确认…后完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "build_end",
    "deploy_start"
  ],
  "Sigma": "time",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "build_end<deploy_start"
  ]
}
```

## 5. Gold 断言

```text
TemporalOrderValid=true
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.TEMPORAL_ORDER`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-039 · 时间顺序互相矛盾
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证时序环。

## 2. Source / 测试输入

> 任务要求 A 必须先于 B，同时又要求 B 必须先于 A；验证是否存在合法时间顺序。

- `source_digest`: `8552fe64cf140655403808e56f4f488feb8b51acbbc5055c11e651d1511ed590`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | A,B | “A”“B” |
| **O** | `resolved` | temporal satisfiability result | “验证是否存在合法时间顺序” |
| **A** | `resolved` | validate_temporal_order | “验证” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | temporal_result_recorded | “验证是否存在合法时间顺序” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "A",
    "B"
  ],
  "Sigma": "strict_order",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "A<B",
    "B<A"
  ]
}
```

## 5. Gold 断言

```text
TemporalCycle=true
SolutionSet=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "inconsistent",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.TEMPORAL_CYCLE`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-040 · 基数上下界一致
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 cardinality feasible。

## 2. Source / 测试输入

> 确定审核人数，要求至少 2 人且至多 4 人；给出所有允许的人数范围即完成。

- `source_digest`: `2219cb1e62195126762775c025a27561c9234428830108f0d0a52e487d70d961`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | reviewer_count | “审核人数” |
| **O** | `resolved` | allowed reviewer count range | “至少 2 人且至多 4 人” |
| **A** | `resolved` | compute_cardinality_range | “确定” |
| **P** | `absent` | — | — |
| **R** | `resolved` | 2<=reviewer_count<=4 | “至少 2 人且至多 4 人” |
| **V** | `absent` | — | — |
| **C** | `resolved` | allowed_range_recorded | “给出所有允许的人数范围即完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "reviewer_count"
  ],
  "Sigma": "integers",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "reviewer_count>=2",
    "reviewer_count<=4"
  ]
}
```

## 5. Gold 断言

```text
SolutionSet={2,3,4}
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.CARDINALITY_FEASIBLE`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-041 · 基数上下界冲突
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证 cardinality conflict。

## 2. Source / 测试输入

> 确定审核人数，要求至少 5 人且至多 3 人；验证是否存在可行人数。

- `source_digest`: `a888c1092157471a9e102c7b9f5622bf02e69057cbeda399367cc78794ec855c`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | reviewer_count | “审核人数” |
| **O** | `resolved` | feasibility result | “验证是否存在可行人数” |
| **A** | `resolved` | compute_cardinality_range | “确定审核人数” |
| **P** | `absent` | — | — |
| **R** | `resolved` | reviewer_count>=5 and <=3 | “至少 5 人且至多 3 人” |
| **V** | `absent` | — | — |
| **C** | `resolved` | feasibility_recorded | “验证是否存在可行人数” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "reviewer_count"
  ],
  "Sigma": "integers",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "reviewer_count>=5",
    "reviewer_count<=3"
  ]
}
```

## 5. Gold 断言

```text
SolutionSet=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "inconsistent",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.CARDINALITY_EMPTY`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-042 · 实体等价关系有证据
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 identity equivalence resolved。

## 2. Source / 测试输入

> 根据 CMDB 明确映射，确认别名 prod-db 与实体 db-001 是同一数据库；记录规范实体 ID 即完成。

- `source_digest`: `06b5093e56e1b59e6403186ff3955015b9f2a06c655a9a9b2c6692170f8c3542`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | prod-db, db-001 | “prod-db”“db-001” |
| **O** | `resolved` | canonical entity db-001 | “同一数据库” |
| **A** | `resolved` | resolve_entity_identity | “确认…是同一数据库” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | CMDB explicit mapping | “根据 CMDB 明确映射” |
| **C** | `resolved` | canonical_id_recorded | “记录规范实体 ID 即完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "prod-db",
    "db-001"
  ],
  "Sigma": "entity_identity",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [
    "same_entity(prod-db,db-001)=true"
  ],
  "D": [
    "explicit identity evidence present"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
IdentityResolved=true
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.IDENTITY_EQUIVALENT`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-043 · 实体别名无证据
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 identity unresolved。

## 2. Source / 测试输入

> 任务引用 prod-db 与 database-main，但没有任何 CMDB 或其他证据说明二者是否同一实体；必须先确定目标数据库身份。

- `source_digest`: `18a0048ade906a2d047272d56f03b0a38311b32663ec19ec785f08a6dd16832e`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `unresolved` | database identity: prod-db ? database-main | “没有任何…证据说明二者是否同一实体” |
| **O** | `resolved` | a uniquely identified target database | “确定目标数据库身份” |
| **A** | `resolved` | resolve_entity_identity | “确定…身份” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | identity_resolved | “必须先确定” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "prod-db",
    "database-main"
  ],
  "Sigma": "entity_identity",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [
    "same_entity(prod-db,database-main)=unresolved"
  ],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
IdentityResolved=false
```

## 6. Gold Boundary Result

```json
{
  "state": "underdetermined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.IDENTITY_UNRESOLVED`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-044 · 单位换算规则缺失
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 unit conversion unresolved。

## 2. Source / 测试输入

> 比较内存约束 memory<=100MiB 与 memory>=100MB，但当前 Operator Profile 没有声明 MiB 与 MB 的换算规则；给出可比较结果才算完成。

- `source_digest`: `2c30d31b0b33eeb7718a49250ebc3dbcd3d53f13d549ba0101ed67d4fea92d1f`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | memory_limit | “内存约束” |
| **O** | `resolved` | comparison result | “给出可比较结果” |
| **A** | `resolved` | compare_quantities | “比较” |
| **P** | `absent` | — | — |
| **R** | `unresolved` | memory<=100MiB and memory>=100MB; conversion rule missing | “没有声明…换算规则” |
| **V** | `absent` | — | — |
| **C** | `resolved` | comparison_resolved | “给出可比较结果才算完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "memory_limit"
  ],
  "Sigma": "quantity",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [
    "unit conversion profile missing"
  ],
  "Phi": [
    "memory<=100MiB",
    "memory>=100MB"
  ]
}
```

## 5. Gold 断言

```text
UnitConversionBound=false
ComparisonResult=unresolved
```

## 6. Gold Boundary Result

```json
{
  "state": "underdetermined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.UNIT_RULE_UNBOUND`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-045 · 版本来源精确匹配
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 provenance match。

## 2. Source / 测试输入

> 任务要求处理制品 artifact 的 sha 必须为 abc；当前输入制品 sha=abc。验证版本身份后记录结果。

- `source_digest`: `22901965c4aa499e50c82fc2d6b0b8a68c3719f1f014c7fd8190dff76a0594a6`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | artifact sha=abc | 原文制品摘要 |
| **O** | `resolved` | version identity validation result | “验证版本身份” |
| **A** | `resolved` | verify_artifact_identity | “验证” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | required_sha=abc; actual_sha=abc | 原文 |
| **C** | `resolved` | version_check_recorded | “记录结果” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "artifact"
  ],
  "Sigma": "artifact_identity",
  "Q": [
    "artifact.sha=abc"
  ],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [
    "required_sha=abc",
    "actual_sha=abc"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
VersionMatch=true
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.VERSION_MATCH`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-046 · 版本来源不匹配
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证 provenance conflict。

## 2. Source / 测试输入

> 任务要求处理制品 artifact 的 sha 必须为 abc；当前输入制品 sha=def。验证是否可以把该制品作为任务输入。

- `source_digest`: `86ccb69102e5cab1f91bfe48e362eb5f2bf5a12b9389a3e2c51852863e2573d4`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | artifact required sha=abc; actual sha=def | 原文 |
| **O** | `resolved` | input admissibility result | “验证是否可以…作为任务输入” |
| **A** | `resolved` | verify_artifact_identity | “验证” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | required_sha=abc; actual_sha=def | 原文 |
| **C** | `resolved` | admissibility_recorded | “验证是否可以” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "artifact"
  ],
  "Sigma": "artifact_identity",
  "Q": [
    "artifact.sha=abc"
  ],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [
    "required_sha=abc",
    "actual_sha=def"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
VersionMatch=false
SolutionSet=empty
```

## 6. Gold Boundary Result

```json
{
  "state": "inconsistent",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.VERSION_MISMATCH`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-047 · 作用域身份未确定
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 unresolved scope。

## 2. Source / 测试输入

> 任务只允许作用于 blue 环境，但当前没有环境清单说明 blue 对应哪个实例；必须唯一确定实例后才能执行。

- `source_digest`: `bade606e2b426b1f35dd6ec228896762deb2eb562a2d63b6d371d1aaea87cde9`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `unresolved` | blue environment instance | “没有…说明 blue 对应哪个实例” |
| **O** | `resolved` | task bound to one concrete blue instance | “唯一确定实例” |
| **A** | `resolved` | resolve_scope_identity | “确定实例” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | scope_identity_resolved | “确定实例后才能执行” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "blue_environment"
  ],
  "Sigma": "environment_identity",
  "Q": [],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [
    "blue_instance=unresolved"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
ScopeIdentityResolved=false
```

## 6. Gold Boundary Result

```json
{
  "state": "underdetermined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.FORMAL.SCOPE_UNRESOLVED`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-048 · 全局禁止边界必须投影到子作用域
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证父边界的全局禁止项不能因为子作用域未重复声明而丢失。

## 2. Source / 测试输入

> 父任务全局禁止 external_send，stage-2 是父任务的子作用域；生成 stage-2 的边界时必须保留该全局禁止项。

- `source_digest`: `d769b32bb4b5229a141f931e10d8ce1fd9b2150c5c68813658d4cccf43de85d6`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | parent task and stage-2 | 原文 |
| **O** | `resolved` | stage-2 boundary preserving no external_send | “必须保留该全局禁止项” |
| **A** | `resolved` | project_parent_boundary | “生成 stage-2 的边界” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | child_boundary_generated | “生成…边界” |
| **B** | `resolved` | external_send forbidden in parent and descendants | “全局禁止 external_send” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "parent_task",
    "stage-2"
  ],
  "Sigma": [
    "parent_task",
    "stage-2"
  ],
  "Q": [],
  "F": [
    "external_send"
  ],
  "K": [],
  "Rels": [],
  "D": [
    "stage-2 child_of parent_task"
  ],
  "Phi": [
    "global_forbidden_applies_to_descendants=true"
  ]
}
```

## 5. Gold 断言

```text
Forbidden(stage-2) contains external_send
ApplicabilityResolved=true
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.GLOBAL_FORBIDDEN_PROJECTED`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-049 · 完成条件合取全部满足
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 completion conjunction。

## 2. Source / 测试输入

> 完成条件要求 tests_pass 且 lint_clean；当前两项都为 true。确认任务完成状态并记录。

- `source_digest`: `b6998d5bbbaf5b5a5dd9bd4221ee5ab71f0a9582a7697248257a2eef3eda5776`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | tests_pass, lint_clean | 原文 |
| **O** | `resolved` | completion status | “确认任务完成状态” |
| **A** | `resolved` | evaluate_completion | “确认” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | tests_pass and lint_clean | “完成条件要求 tests_pass 且 lint_clean” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "tests_pass",
    "lint_clean"
  ],
  "Sigma": "completion",
  "Q": [],
  "F": [],
  "K": [
    "tests_pass",
    "lint_clean"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "tests_pass=true",
    "lint_clean=true"
  ]
}
```

## 5. Gold 断言

```text
CompletionSatisfied=true
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.COMPLETION_CONJUNCTION`

Deterministic core conformance vector; not a Producer semantic benchmark.


---

# BXP-0.4-CASE-050 · 完成条件尚未满足不等于边界不一致
- **分类**：`formal-boundary-model`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-formal-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证当前 completion=false 只是“尚未完成”，不会把一个可行边界错误判成 inconsistent。

## 2. Source / 测试输入

> 完成条件要求 tests_pass 且 lint_clean；当前 tests_pass=true、lint_clean=false，但 lint_clean 仍可继续修复。判断边界是否仍一致以及任务是否已经完成。

- `source_digest`: `de7be668043cc25c445e510bbdf6996a7176d1809b4ce1e13a4aa147a9a779b3`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | tests_pass, lint_clean | 原文 |
| **O** | `resolved` | boundary consistency and completion status | “判断边界是否仍一致以及任务是否已经完成” |
| **A** | `resolved` | evaluate_completion | “判断” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | tests_pass and lint_clean | “完成条件要求…” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "tests_pass",
    "lint_clean"
  ],
  "Sigma": "completion",
  "Q": [],
  "F": [],
  "K": [
    "tests_pass",
    "lint_clean"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "tests_pass=true",
    "lint_clean=false",
    "lint_clean is mutable"
  ]
}
```

## 5. Gold 断言

```text
CompletionSatisfied=false
SolutionSetMayRemainNonEmpty=true
BoundaryState=determined
```

## 6. Gold Boundary Result

```json
{
  "state": "determined",
  "boundary_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 7. Gold Admission

```json
{
  "applicable": true,
  "status": "admitted",
  "release": "allowed",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.OK.COMPLETION_NOT_YET_SATISFIED`

Deterministic core conformance vector; not a Producer semantic benchmark.
