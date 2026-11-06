# boundary-result

> 25 cases · all applicable · all Producer-scored

# BXP-0.4-CASE-051 · 唯一、非空、无冲突边界
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-051，在 staging 生成 report.json；不得向外部网络发送数据；report.json 生成即完成。

- `source_digest`: `b4ada80f5f0ccee9e3bc32d5491a1ea5a143a3c0de622bc401b46d3096a94bb4`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | “生成 report.json” |
| **A** | `resolved` | generate_report | “生成” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-051 | “依据工单 T-051” |
| **C** | `resolved` | report.json created | “report.json 生成即完成” |
| **B** | `resolved` | no external network send | “不得向外部网络发送数据” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report.json"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [
    "no external network send"
  ],
  "K": [
    "report.json created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-051"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
UniqueCanonicalBoundary=true
Omega_B!=empty
Determined(B)=true
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

`BXP.OK.DETERMINED`

验证标准 determined。


---

# BXP-0.4-CASE-052 · 单一边界相关歧义
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 由值班人员处理数据库 prod-db 的只读健康检查，但当前“值班人员”对应哪个主体没有唯一记录；生成健康报告即完成。

- `source_digest`: `76c7a3b6739c91f8cca2c2004e4ec9528a6c27a563f5334e872fed60713c8264`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | prod-db | “数据库 prod-db” |
| **O** | `resolved` | health report | “健康报告” |
| **A** | `resolved` | read_only_health_check | “只读健康检查” |
| **P** | `unresolved` | on-duty operator identity | “值班人员”对应主体没有唯一记录 |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | health_report_created | “生成健康报告即完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "prod-db"
  ],
  "Sigma": "task",
  "Q": [
    "health report"
  ],
  "F": [],
  "K": [
    "health_report_created"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
IdentityResolved=false
Determined(B)=false
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

`BXP.RESULT.UNDERDETERMINED`

验证 underdetermined。


---

# BXP-0.4-CASE-053 · 形式模型空解空间
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 把服务副本数设置为同时至少 5 且至多 3；只有满足全部约束才算完成。

- `source_digest`: `69105a423555a04c0cd0c650824a06fc73113204877b1252b86859fafe373938`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | service replica count | “服务副本数” |
| **O** | `resolved` | replica count satisfying all constraints | 原文 |
| **A** | `resolved` | set_replica_count | “设置” |
| **P** | `absent` | — | — |
| **R** | `resolved` | replicas>=5 and replicas<=3 | 原文 |
| **V** | `absent` | — | — |
| **C** | `resolved` | all_constraints_satisfied | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "service replica count"
  ],
  "Sigma": "task",
  "Q": [
    "replica count satisfying all constraints"
  ],
  "F": [],
  "K": [
    "all_constraints_satisfied"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "constraints are jointly unsatisfiable"
  ]
}
```

## 5. Gold 断言

```text
Omega_B=empty
State=inconsistent
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

`BXP.RESULT.INCONSISTENT`

验证 inconsistent。


---

# BXP-0.4-CASE-054 · 证据 Span 与引文不一致
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task+protocol-mutation`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`invalid`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-054，在 staging 生成 build-report.md；报告生成即完成。

- `source_digest`: `c858164f95fab1f2bb495db43dde4a8901979d46366d447711ca630db67ce222`

### 测试上下文

```json
{
  "protocol_mutation": "evidence span intentionally points to text that does not equal the claimed evidence quote"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; build-report.md | 原文 |
| **O** | `resolved` | build-report.md | “生成 build-report.md” |
| **A** | `resolved` | generate_report | “生成” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-054 | “依据工单 T-054” |
| **C** | `resolved` | report_created | “报告生成即完成” |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; build-report.md"
  ],
  "Sigma": "task",
  "Q": [
    "build-report.md"
  ],
  "F": [],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-054"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
EvidenceValid=false
State=invalid
```

## 6. Gold Boundary Result

```json
{
  "state": "invalid",
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

`BXP.RESULT.INVALID_EVIDENCE_SPAN`

验证 evidence invalid。


---

# BXP-0.4-CASE-055 · 来源摘要不匹配
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task+protocol-mutation`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`invalid`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-055，在 staging 生成 audit.json；audit.json 生成即完成。

- `source_digest`: `cdc770dd69f9fdfb4e6479a50759d66788e9fec10ae5d7e19e7f7c19cc1d4c36`

### 测试上下文

```json
{
  "protocol_mutation": "declared source_digest intentionally does not match exact source_text"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; audit.json | 原文 |
| **O** | `resolved` | audit.json | “生成 audit.json” |
| **A** | `resolved` | generate_audit | “生成” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-055 | 原文 |
| **C** | `resolved` | audit_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; audit.json"
  ],
  "Sigma": "task",
  "Q": [
    "audit.json"
  ],
  "F": [],
  "K": [
    "audit_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-055"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
State=invalid
```

## 6. Gold Boundary Result

```json
{
  "state": "invalid",
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

`BXP.RESULT.INVALID_SOURCE_DIGEST`

验证 digest invalid。


---

# BXP-0.4-CASE-056 · 条目 ID 重复
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task+protocol-mutation`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`invalid`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-056，把配置 key-a 与 key-b 写入 staging 配置集；两项都写入后完成。

- `source_digest`: `7f7c0126e81595bc0142c8ab2e196a0bfb45c3f8a697241835dd886c7325398e`

### 测试上下文

```json
{
  "protocol_mutation": "two normalized IR entries are assigned the same entry_id"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging config keys key-a,key-b | 原文 |
| **O** | `resolved` | both keys written | 原文 |
| **A** | `resolved` | write_config_entries | “写入” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-056 | 原文 |
| **C** | `resolved` | key-a and key-b written | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging config keys key-a,key-b"
  ],
  "Sigma": "task",
  "Q": [
    "both keys written"
  ],
  "F": [],
  "K": [
    "key-a and key-b written"
  ],
  "Rels": [],
  "D": [
    "ticket=T-056"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
UniqueEntryIds=false
State=invalid
```

## 6. Gold Boundary Result

```json
{
  "state": "invalid",
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

`BXP.RESULT.DUPLICATE_ID`

验证结构身份冲突。


---

# BXP-0.4-CASE-057 · 引用未声明 Scope
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task+protocol-mutation`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`invalid`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-057，只在 scope-x 中生成 report.txt；生成后完成。

- `source_digest`: `437170807a77328197d46ee6decad587e7797a96e0e566934e16f6d2799f921b`

### 测试上下文

```json
{
  "protocol_mutation": "formal constraint references scope-x but the protocol scope registry intentionally omits scope-x"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | scope-x; report.txt | 原文 |
| **O** | `resolved` | report.txt in scope-x | 原文 |
| **A** | `resolved` | generate_report | “生成” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-057 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "scope-x; report.txt"
  ],
  "Sigma": "task",
  "Q": [
    "report.txt in scope-x"
  ],
  "F": [],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-057"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
ScopeDeclared=false
State=invalid
```

## 6. Gold Boundary Result

```json
{
  "state": "invalid",
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

`BXP.RESULT.UNDECLARED_SCOPE`

验证 scope 引用无效。


---

# BXP-0.4-CASE-058 · 公式 AST 非法
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task+protocol-mutation`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`invalid`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-058，对布尔条件 approved 与 deployed 做逻辑校验；输出校验结果即完成。

- `source_digest`: `7994fb562de9cede150ee8afbdf3144a22e91fb5b3c34dbb9e14cdc9cd583b74`

### 测试上下文

```json
{
  "protocol_mutation": "formula AST is intentionally mutated to unsupported operator XORX"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | approved; deployed | 原文 |
| **O** | `resolved` | logic validation result | 原文 |
| **A** | `resolved` | validate_logic | “逻辑校验” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-058 | 原文 |
| **C** | `resolved` | validation_result_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "approved; deployed"
  ],
  "Sigma": "task",
  "Q": [
    "logic validation result"
  ],
  "F": [],
  "K": [
    "validation_result_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-058"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
FormulaValid=false
State=invalid
```

## 6. Gold Boundary Result

```json
{
  "state": "invalid",
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

`BXP.RESULT.INVALID_FORMULA`

验证形式语言边界。


---

# BXP-0.4-CASE-059 · 参与者身份未确定
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 由 admin 或 operator 中的一人执行 production 配置审阅，但当前没有记录说明究竟是哪一人；审阅报告生成即完成。

- `source_digest`: `13df5465cf383412b200c620e77cc2061fba3c025cebb6d1f70f626087578bd0`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | production configuration | 原文 |
| **O** | `resolved` | review report | 原文 |
| **A** | `resolved` | review_configuration | “审阅” |
| **P** | `unresolved` | admin or operator | “admin 或 operator 中的一人”但未唯一 |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | review_report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "production configuration"
  ],
  "Sigma": "task",
  "Q": [
    "review report"
  ],
  "F": [],
  "K": [
    "review_report_created"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
IdentityResolved=false
State=underdetermined
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

`BXP.RESULT.IDENTITY_UNRESOLVED`

验证身份不确定。


---

# BXP-0.4-CASE-060 · 作用域未确定
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 在 production 或 staging 之一执行只读检查，但当前未说明具体环境；检查报告生成即完成。

- `source_digest`: `d3544d5ff796e11501ba222c2faaefb1e89cbda69ee47b39a663a8c070bded11`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `unresolved` | production or staging | “production 或 staging 之一” |
| **O** | `resolved` | inspection report | 原文 |
| **A** | `resolved` | read_only_inspection | “只读检查” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | inspection_report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "production or staging"
  ],
  "Sigma": "task",
  "Q": [
    "inspection report"
  ],
  "F": [],
  "K": [
    "inspection_report_created"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
ScopeResolved=false
State=underdetermined
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

`BXP.RESULT.SCOPE_UNRESOLVED`

验证 scope 不确定。


---

# BXP-0.4-CASE-061 · Profile 不要求的可选字段未知
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-061，在 staging 生成 report.json；可选风险标签 risk_tag 当前未知，但本 Profile 不要求该标签且它不改变任何任务边界；report.json 生成即完成。

- `source_digest`: `b1d95defc6ddd191f479a64f04c1dc7539c3ec8594f43871e33427a27f8e391b`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-061 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report.json"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-061"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
RequiredResolved=true
OptionalUnknownIrrelevant=true
Determined(B)=true
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

`BXP.OK.OPTIONAL_UNKNOWN_IRRELEVANT`

验证非边界相关可选未知不阻断。


---

# BXP-0.4-CASE-062 · 完整但不一致
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-062，任务同时要求创建 artifact.bin 又禁止创建 artifact.bin；所有其他字段均明确。

- `source_digest`: `6f83fb29c9b03724c837ce9490c0434575ad8050359c566a70fa37e322f33fbc`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | artifact.bin | 原文 |
| **O** | `resolved` | artifact.bin created | “要求创建 artifact.bin” |
| **A** | `resolved` | create_artifact | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-062 | 原文 |
| **C** | `absent` | — | — |
| **B** | `resolved` | do not create artifact.bin | “禁止创建 artifact.bin” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "artifact.bin"
  ],
  "Sigma": "task",
  "Q": [
    "artifact.bin created"
  ],
  "F": [
    "do not create artifact.bin"
  ],
  "K": [],
  "Rels": [],
  "D": [
    "ticket=T-062"
  ],
  "Phi": [
    "constraints are jointly unsatisfiable"
  ]
}
```

## 5. Gold 断言

```text
AllRequiredResolved=true
Consistent=false
State=inconsistent
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

`BXP.RESULT.COMPLETE_BUT_INCONSISTENT`

完整不代表准入。


---

# BXP-0.4-CASE-063 · 必填已解析但可选未知会改变边界
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 生成 report.json；如果 source_policy=P-63 适用则禁止 external_send，但当前无法确定 P-63 是否适用；report.json 生成即完成。

- `source_digest`: `ab3c8033ae279c95c887abff79c36eb02d36ffb49345f402ab43b5459bf689e9`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | report.json; policy P-63 applicability | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `unresolved` | source_policy P-63 applicability | “无法确定 P-63 是否适用” |
| **C** | `resolved` | report_created | 原文 |
| **B** | `unresolved` | external_send forbidden iff P-63 applies | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "report.json; policy P-63 applicability"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "source_policy P-63 applicability"
  ],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
RequiredResolved=true
BoundaryRelevantOptionalUnknown=true
State=underdetermined
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

`BXP.RESULT.OPTIONAL_BUT_BOUNDARY_RELEVANT`

验证边界相关性优先于“必填/可选”标签。


---

# BXP-0.4-CASE-064 · 两个 Producer 语义等价
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-064，在 staging 生成 report.json；禁止 external_send；report.json 生成即完成。

- `source_digest`: `cf3db033cbe5c1013f03c79b969019e226e178168ace7ffa847d3b41b4e4db48`

### 测试上下文

```json
{
  "comparison": "Producer A and Producer B return semantically identical IR with different field ordering"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-064 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `resolved` | no external_send | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report.json"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [
    "no external_send"
  ],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-064"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
IR_A≡IR_B
M(IR_A)=M(IR_B)
B_A=B_B
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

`BXP.OK.PRODUCER_EQUIVALENCE`

验证 producer independence。


---

# BXP-0.4-CASE-065 · 仅展示差异不改变 CanonBoundary
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-065，在 staging 生成 report.json；禁止 external_send；report.json 生成即完成。

- `source_digest`: `c091196edb7a7ab31fbf14229295ed68ac1e0b1f3a3d5aaafb8e55c6e67baf4f`

### 测试上下文

```json
{
  "comparison": "Boundary findings/presentation order differs, canonical boundary semantics identical"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-065 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `resolved` | no external_send | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report.json"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [
    "no external_send"
  ],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-065"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
CanonBoundary(B1)=CanonBoundary(B2)
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

`BXP.OK.CANONICAL_PRESENTATION_INSENSITIVE`

验证展示差异不改变边界身份。


---

# BXP-0.4-CASE-066 · 语义差异改变 Boundary Digest
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-066，清理 90 天前的日志并释放空间；不得影响在线服务；完成后生成报告。这里“清理”未说明归档还是删除。

- `source_digest`: `12ff93683d8db004e628d82814d6bb7033e2893487f4e3ee5c4b11b2c09e765b`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | logs older than 90 days | 原文 |
| **O** | `resolved` | space released and report created | 原文 |
| **A** | `unresolved` | archive_logs or delete_logs | “清理”未说明归档还是删除 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-066 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `resolved` | no service interruption | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "logs older than 90 days"
  ],
  "Sigma": "task",
  "Q": [
    "space released and report created"
  ],
  "F": [
    "no service interruption"
  ],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-066"
  ],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
CanonicalBoundary(B1)!=CanonicalBoundary(B2)
BoundaryState=underdetermined
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

`BXP.RESULT.BOUNDARY_DIGEST_DIFF`

验证语义变化改变结果身份。


---

# BXP-0.4-CASE-067 · 确定性重放结果一致
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-067，在 staging 生成 report.json；禁止 external_send；report.json 生成即完成。

- `source_digest`: `f17c131c5735a6aa249cb5e62dbd99e804ead465492b6c938218de9f34c9cdfa`

### 测试上下文

```json
{
  "replay": "same M and same O_v evaluated twice"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-067 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `resolved` | no external_send | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report.json"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [
    "no external_send"
  ],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-067"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
Evaluate(M,O)_run1=Evaluate(M,O)_run2
BoundaryResultStable=true
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

`BXP.OK.REPLAY_STABLE`

验证 replayability。


---

# BXP-0.4-CASE-068 · Operator Profile 版本改变但结果恰好相同
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-068，把 replicas 设置为 3；当前 Operator Profile v1 与 v2 对此约束语义一致；配置保存即完成。

- `source_digest`: `2ce249b14f34a05a1bebba83f330a334dd42e0d7f8a4e70428e85be0461b7a5e`

### 测试上下文

```json
{
  "comparison": "O_v1 and O_v2 are both pinned; for this input they produce equivalent canonical boundary"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | replicas | 原文 |
| **O** | `resolved` | replicas=3 | 原文 |
| **A** | `resolved` | set_replica_count | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-068; operator profile pinned for each evaluation | 原文 |
| **C** | `resolved` | configuration_saved | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "replicas"
  ],
  "Sigma": "task",
  "Q": [
    "replicas=3"
  ],
  "F": [],
  "K": [
    "configuration_saved"
  ],
  "Rels": [],
  "D": [
    "ticket=T-068; operator profile pinned for each evaluation"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
BoundaryResult(O_v1)=BoundaryResult(O_v2)
OperatorProfileIdentityDiffers=true
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

`BXP.OK.RESULT_SAME_PROFILE_ID_DIFF`

不同 Operator Profile 可以偶然得到语义相同的 Boundary，但旧 Admission 仍不能跨 profile 复用；本 case 只验证 Boundary Result 语义等价。


---

# BXP-0.4-CASE-069 · 同一 Source，不同 IR
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-069，清理旧日志并生成空间报告；不得中断服务。“清理”未说明归档还是删除。

- `source_digest`: `9dc033faaf64a58fc5b26359f73eb7034a1302a55ab97498b66134a091706044`

### 测试上下文

```json
{
  "comparison": "two admissible IR interpretations differ for same source because cleanup action is unresolved"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | old logs | 原文 |
| **O** | `resolved` | space report | 原文 |
| **A** | `unresolved` | archive_logs or delete_logs | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-069 | 原文 |
| **C** | `resolved` | space_report_created | 原文 |
| **B** | `resolved` | no service interruption | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "old logs"
  ],
  "Sigma": "task",
  "Q": [
    "space report"
  ],
  "F": [
    "no service interruption"
  ],
  "K": [
    "space_report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-069"
  ],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
D_S1=D_S2
D_IR1!=D_IR2
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

`BXP.RESULT.IR_DIVERGENCE`

验证 Source identity 不等于 IR identity。


---

# BXP-0.4-CASE-070 · 同一 IR，不同形式化规则版本
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-070，把 duration 限制为 10 分钟；当前任务未绑定 Formalizer 规则版本，两个已知规则版本会生成不同形式模型。

- `source_digest`: `73eb29a0838cedca9ea3cfb5d0b93eb9cd363b3f2a55c21c943951308b15f3b3`

### 测试上下文

```json
{
  "formalizer_versions": [
    "f-v1",
    "f-v2"
  ],
  "binding": "unbound"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | duration constraint | 原文 |
| **O** | `resolved` | duration<=10min formalized | 原文 |
| **A** | `resolved` | formalize_constraint | 原文 |
| **P** | `absent` | — | — |
| **R** | `resolved` | duration<=10min | 原文 |
| **V** | `unresolved` | formalizer version | “未绑定 Formalizer 规则版本” |
| **C** | `absent` | — | — |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "duration constraint"
  ],
  "Sigma": "task",
  "Q": [
    "duration<=10min formalized"
  ],
  "F": [],
  "K": [],
  "Rels": [],
  "D": [
    "formalizer version"
  ],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
D_IR same
D_M1!=D_M2
Conformance claim invalid without rule pinning
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

`BXP.RESULT.FORMALIZER_VERSION_UNBOUND`

Formalizer version 未绑定且不同版本产生不同 M；在绑定确定前，规范边界不能唯一确定。


---

# BXP-0.4-CASE-071 · 明确空解空间必须 inconsistent
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 把 x 设置为同时大于 10 且小于等于 10；满足全部约束才算完成。

- `source_digest`: `c71d76cdfb3096e3df0482a8d9523d5c9a22dd29b4ebef7b66212fa31342a70d`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | x | 原文 |
| **O** | `resolved` | x satisfying both constraints | 原文 |
| **A** | `resolved` | set_value | 原文 |
| **P** | `absent` | — | — |
| **R** | `resolved` | x>10 and x<=10 | 原文 |
| **V** | `absent` | — | — |
| **C** | `resolved` | all_constraints_satisfied | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "x"
  ],
  "Sigma": "task",
  "Q": [
    "x satisfying both constraints"
  ],
  "F": [],
  "K": [
    "all_constraints_satisfied"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "constraints are jointly unsatisfiable"
  ]
}
```

## 5. Gold 断言

```text
UniqueCanonicalBoundary=true
Omega_B=empty
State=inconsistent
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

`BXP.RESULT.EMPTY_SOLUTION_SPACE`

唯一边界不等于可行。


---

# BXP-0.4-CASE-072 · 非空唯一边界
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-072，生成 report.json；可以使用脚本或库函数实现，但都必须禁止 external_send；report.json 生成即完成。

- `source_digest`: `8ac2e770b634d5278f42236fa4611a4cb8a79b1634344a82023be7bfef7f99b0`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-072 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `resolved` | no external_send | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "report.json"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [
    "no external_send"
  ],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-072"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
Omega_B has multiple x
UniqueCanonicalBoundary=true
State=determined
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

`BXP.OK.MULTIPLE_PLANS_ONE_BOUNDARY`

验证边界唯一不要求方案唯一。


---

# BXP-0.4-CASE-073 · 多个计划均在同一解空间
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-073，生成 report.json；方案可以使用 Python 脚本或现成库，只要满足同一输出和禁止边界即可。

- `source_digest`: `4d1ed5c8d098820308c39103142ea6bb946cf83f2bbea831c7a5e36d11e1003b`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-073 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "report.json"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-073"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
x1∈Omega_B
x2∈Omega_B
Boundary still determined
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

`BXP.OK.SOLUTION_SPACE_NON_SINGLETON`

强调解空间概念。


---

# BXP-0.4-CASE-074 · Boundary Result 不产生业务裁决
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-074，在 staging 生成审计报告；报告生成即完成。BXP 只计算边界，不替业务负责人决定是否采用报告结论。

- `source_digest`: `3fb6b02319803019d74cb67e4c616ec2c4d5697eef98225944fb2c4243120beb`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging audit task | 原文 |
| **O** | `resolved` | audit report | 原文 |
| **A** | `resolved` | generate_audit_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-074 | 原文 |
| **C** | `resolved` | audit_report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging audit task"
  ],
  "Sigma": "task",
  "Q": [
    "audit report"
  ],
  "F": [],
  "K": [
    "audit_report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-074"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
business_decision=null
Determined(B)=true
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

`BXP.OK.NO_BUSINESS_DECISION`

验证权限边界。


---

# BXP-0.4-CASE-075 · Boundary Result 不产生执行授权
- **分类**：`boundary-result`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.boundary-result-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 Boundary Result 的状态语义、身份或不变量。

## 2. Source / 测试输入

> 依据工单 T-075，在 staging 生成 report.json；report.json 生成即完成。即使任务通过 BXP Admission，也不因此获得执行授权。

- `source_digest`: `9079c8f0bf9b8b04b925dc2d8492f42b6a9bc64868f2862166fca1e1b2883155`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-075 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report.json"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-075"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
execution_authorization=null
Admission!=ExecutionAuthorization
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

`BXP.OK.NO_EXECUTION_AUTHORIZATION`

验证准入与执行授权分离。
