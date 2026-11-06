# admission-conformance

> 25 cases · all applicable · all Producer-scored

# BXP-0.4-CASE-076 · 全部准入条件满足
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-076，在 staging 生成 report.json；禁止 external_send；report.json 生成即完成，且当前协议、Profile、Operator 与版本绑定均有效。

- `source_digest`: `e79e1fe07e88a673682582914a2bc4b5220d09b87ede09991616509fa2800e19`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-076; current bindings valid | 原文 |
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
    "ticket=T-076; current bindings valid"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
ProtocolValid=true
BoundaryDetermined=true
ReleaseConditions=true
VersionBound=true
Admit(T_v)=true
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

`BXP.ADMISSION.OK`

标准准入通过。


---

# BXP-0.4-CASE-077 · underdetermined 必须阻断
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-077，清理旧日志并生成报告；不得影响在线服务。“清理”没有说明归档还是删除。

- `source_digest`: `51556e836c3bca34df5905acc29eb095478c78ef24d13d8a4aea92ee95b08fc2`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | old logs | 原文 |
| **O** | `resolved` | cleanup report | 原文 |
| **A** | `unresolved` | archive_logs or delete_logs | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-077 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `resolved` | no service interruption | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "old logs"
  ],
  "Sigma": "task",
  "Q": [
    "cleanup report"
  ],
  "F": [
    "no service interruption"
  ],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-077"
  ],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
BoundaryDetermined=false
Admit(T_v)=false
Release=blocked
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

`BXP.ADMISSION.BOUNDARY_NOT_DETERMINED`

未确定边界不能正式发布。


---

# BXP-0.4-CASE-078 · inconsistent 必须阻断
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-078，任务同时要求创建 report.json 又禁止创建 report.json。

- `source_digest`: `8e01d8d485fb093c87e8cde371702ce15cbe43592605b3bf0f3d05d731255961`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | report.json | 原文 |
| **O** | `resolved` | report.json created | 原文 |
| **A** | `resolved` | create_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-078 | 原文 |
| **C** | `absent` | — | — |
| **B** | `resolved` | do not create report.json | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "report.json"
  ],
  "Sigma": "task",
  "Q": [
    "report.json created"
  ],
  "F": [
    "do not create report.json"
  ],
  "K": [],
  "Rels": [],
  "D": [
    "ticket=T-078"
  ],
  "Phi": [
    "constraints are jointly unsatisfiable"
  ]
}
```

## 5. Gold 断言

```text
State=inconsistent
Admit(T_v)=false
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

`BXP.ADMISSION.INCONSISTENT`

矛盾任务不能发布。


---

# BXP-0.4-CASE-079 · invalid 必须阻断
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task+protocol-mutation`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`invalid`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-079，在 staging 生成 report.json；report.json 生成即完成。

- `source_digest`: `039b6a6e6d2e6349b6c18ec9732f9516f2dbb8c53fe1a594cf087322e6e79cac`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-079 | 原文 |
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
    "ticket=T-079"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
ProtocolValid=false
Admit(T_v)=false
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

`BXP.ADMISSION.INVALID`

无效输入 fail closed。


---

# BXP-0.4-CASE-080 · ADMIN 修改来源后旧准入失效
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 当前任务版本 v2：依据工单 T-080，在 staging 生成 report-v2.json；report-v2.json 生成即完成。旧 Admission 绑定的是 v1 文本。

- `source_digest`: `4cc629e34ba0906a05e1d764da6c867a3da7f70d75151923fbf86043a5333120`

### 测试上下文

```json
{
  "old_admission_source_version": "v1",
  "current_source_version": "v2"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report-v2.json | 原文 |
| **O** | `resolved` | report-v2.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-080; source_version=v2 | 原文 |
| **C** | `resolved` | report-v2.json created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report-v2.json"
  ],
  "Sigma": "task",
  "Q": [
    "report-v2.json"
  ],
  "F": [],
  "K": [
    "report-v2.json created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-080; source_version=v2"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
SourceVersionChanged=true
Admission(v)↛Admission(v+1)
Release=blocked
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
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.ADMISSION.STALE_SOURCE`

修改来源后必须重新准入。


---

# BXP-0.4-CASE-081 · ADMIN 修改后边界恰好相同仍需重准入
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 当前任务版本 v2：依据工单 T-081，在 staging 生成 report.json；只是措辞从“生成”改成“创建”，规范边界不变，但旧 Admission 绑定的是 v1 文本。

- `source_digest`: `c243da642b0c6ef07569296cf8c6f9a7df355f896217108b235f12240b059f37`

### 测试上下文

```json
{
  "old_admission_source_version": "v1",
  "current_source_version": "v2",
  "canonical_boundary_equivalent": true
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | create_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-081; source_version=v2 | 原文 |
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
    "ticket=T-081; source_version=v2"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
SourceVersionChanged=true
CanonicalBoundaryEquivalent=true
old admission stale
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
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.ADMISSION.REVALIDATION_REQUIRED`

来源版本变化本身使旧绑定失效。


---

# BXP-0.4-CASE-082 · IR 变化导致 Admission Binding 不匹配
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-082，在 staging 生成 report.json；report.json 生成即完成。Source 未变化，但当前经人工修订的 IR 与旧 Admission 绑定 IR 不同。

- `source_digest`: `099181c68e478ff982a3dc4b27c2baf46f4e4b57c3c0fa586d59083d2bb8ac68`

### 测试上下文

```json
{
  "old_ir_binding": "ir-v1",
  "current_ir_binding": "ir-v2"
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
| **V** | `resolved` | ticket=T-082 | 原文 |
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
    "ticket=T-082"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
IRBindingMismatch=true
AdmissionBindingMismatch=true
Release=blocked
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
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.ADMISSION.IR_BINDING_MISMATCH`

正式发布绑定精确 IR。


---

# BXP-0.4-CASE-083 · Formal Model 变化导致绑定不匹配
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-083，在 staging 生成 report.json；report.json 生成即完成。当前 Formalizer 修订后得到的新 Formal Model 与旧 Admission 绑定模型不同。

- `source_digest`: `b1aa5d6e9950032f0d80e225d6d8b47c2095d603d4a61dd1a4ab123e27cd7056`

### 测试上下文

```json
{
  "old_formal_model_binding": "m-v1",
  "current_formal_model_binding": "m-v2"
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
| **V** | `resolved` | ticket=T-083 | 原文 |
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
    "ticket=T-083"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
FormalModelBindingMismatch=true
Release=blocked
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
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.ADMISSION.MODEL_BINDING_MISMATCH`

形式模型身份参与绑定。


---

# BXP-0.4-CASE-084 · Operator Profile 变化导致绑定失效
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-084，在 staging 生成 report.json；report.json 生成即完成。当前使用 Operator Profile v2，旧 Admission 绑定 v1。

- `source_digest`: `593ae435c3bfd6c04f11d3e0da457d861484f155b9f728d5c547811d789be4dd`

### 测试上下文

```json
{
  "old_operator_profile": "v1",
  "current_operator_profile": "v2"
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
| **V** | `resolved` | ticket=T-084; operator_profile=v2 | 原文 |
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
    "ticket=T-084; operator_profile=v2"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
O_v_current!=O_v_admitted
AdmissionBindingMismatch=true
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
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.ADMISSION.OPERATOR_PROFILE_MISMATCH`

算子版本必须固定。


---

# BXP-0.4-CASE-085 · Profile 变化导致绑定失效
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-085，在 staging 生成 report.json；report.json 生成即完成。当前 Profile 的 required elements 已更新，旧 Admission 使用旧 Profile。

- `source_digest`: `93be941805cc11d9862b96495c9e991c28d8a881798ba476ecc094bd13660b42`

### 测试上下文

```json
{
  "old_profile": "profile-v1",
  "current_profile": "profile-v2"
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
| **V** | `resolved` | ticket=T-085; current_profile | 原文 |
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
    "ticket=T-085; current_profile"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
Profile_current!=Profile_admitted
Release=blocked
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
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.ADMISSION.PROFILE_MISMATCH`

Profile 是准入合同的一部分。


---

# BXP-0.4-CASE-086 · Boundary Digest 变化必须阻断
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-086，在 staging 生成 report.json；report.json 生成即完成。重新计算得到的当前 Boundary 与旧 Admission 绑定 Boundary 不同。

- `source_digest`: `69959dd56433ba61fc13547cad30f3cf4032e8fbe25e7921bd6f7af0d84a1716`

### 测试上下文

```json
{
  "old_boundary_binding": "db-v1",
  "current_boundary_binding": "db-v2"
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
| **V** | `resolved` | ticket=T-086 | 原文 |
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
    "ticket=T-086"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
BoundaryBindingMismatch=true
Release=blocked
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
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.ADMISSION.BOUNDARY_DIGEST_MISMATCH`

边界变化需要新准入。


---

# BXP-0.4-CASE-087 · 缓存旧 Admission 不得复用
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 当前任务版本 v2：依据工单 T-087，在 staging 生成 report-v2.json；Host 只缓存了 v1 的 admitted 结果。

- `source_digest`: `12fe2752fd8e6b691d2915a26580a6d8e02ff6b973a747f5782596072a657758`

### 测试上下文

```json
{
  "host_cached_admission": "v1 admitted",
  "current_source_version": "v2"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report-v2.json | 原文 |
| **O** | `resolved` | report-v2.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-087; source_version=v2 | 原文 |
| **C** | `resolved` | report-v2.json created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report-v2.json"
  ],
  "Sigma": "task",
  "Q": [
    "report-v2.json"
  ],
  "F": [],
  "K": [
    "report-v2.json created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-087; source_version=v2"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
cached_version!=current_version
cached_admission unusable
Release=blocked
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
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.ADMISSION.STALE_CACHE`

缓存不能绕过精确绑定。


---

# BXP-0.4-CASE-088 · UI 显示 PASS 但绑定不一致
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-088，在 staging 生成 report.json；页面显示 PASS，但当前 Admission Binding 与本任务版本不一致。

- `source_digest`: `f87a27059727e544eeb7301778bbd9429bde70eba5bea2e8d9600fe3bb6babf4`

### 测试上下文

```json
{
  "ui_state": "PASS",
  "admission_binding_match": false
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
| **V** | `resolved` | ticket=T-088; current task version | 原文 |
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
    "ticket=T-088; current task version"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
UI_PASS=true
AdmissionBindingMismatch=true
Release=blocked
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
  "status": "blocked",
  "release": "blocked",
  "admission_binding_digest": null,
  "digest_status": "PENDING_CANONICALIZER_AND_BINDING_FREEZE"
}
```

## 8. Gold Diagnostic

`BXP.ADMISSION.UI_NOT_AUTHORITY`

显示层不能替代门禁。


---

# BXP-0.4-CASE-089 · 模型声称安全但 BXP blocked
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-089，清理旧日志并生成报告；“清理”没有说明归档还是删除。模型意见写着“可以发布”。

- `source_digest`: `232fcafa9b967d9640904a1b787a7ed39f52ada87dbaf15aa749d10470768eec`

### 测试上下文

```json
{
  "model_opinion": "allow"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | old logs | 原文 |
| **O** | `resolved` | cleanup report | 原文 |
| **A** | `unresolved` | archive_logs or delete_logs | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-089 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "old logs"
  ],
  "Sigma": "task",
  "Q": [
    "cleanup report"
  ],
  "F": [],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-089"
  ],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
ModelOpinion=allow
Admit=false
Host must block
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

`BXP.ADMISSION.MODEL_CANNOT_BYPASS`

模型意见不具准入权。


---

# BXP-0.4-CASE-090 · 业务审批已通过但 BXP 未通过
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-090，清理旧日志并生成报告；“清理”没有说明归档还是删除。业务审批已经通过。

- `source_digest`: `28055ede3c5a04351468d31ec74c38eba8d01ee8d5047c30c7f093f280a1f861`

### 测试上下文

```json
{
  "business_approval": true
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | old logs | 原文 |
| **O** | `resolved` | cleanup report | 原文 |
| **A** | `unresolved` | archive_logs or delete_logs | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-090 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "old logs"
  ],
  "Sigma": "task",
  "Q": [
    "cleanup report"
  ],
  "F": [],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-090"
  ],
  "Phi": [
    "boundary-relevant unresolved semantic/provenance"
  ]
}
```

## 5. Gold 断言

```text
BusinessApproval=true
BoundaryDetermined=false
Admit=false
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

`BXP.ADMISSION.BUSINESS_APPROVAL_NOT_SUBSTITUTE`

业务审批不能替代边界准入。


---

# BXP-0.4-CASE-091 · BXP admitted 但 execution_authorization 仍为 null
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 依据工单 T-091，在 staging 生成 report.json；禁止 external_send；report.json 生成即完成。BXP 可允许进入正式规划，但没有任何执行授权。

- `source_digest`: `acdefd340191f80da2e1df3ec918f86e52e2364d379700ccbd9a4d6d1c161e08`

### 测试上下文

```json
{
  "execution_authorization": null
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
| **V** | `resolved` | ticket=T-091 | 原文 |
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
    "ticket=T-091"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
Admit=true
execution_authorization=null
PlanningReleaseAllowed=true
ExecutionAllowed=false
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

`BXP.ADMISSION.NOT_EXECUTION_AUTH`

准入与执行权限分离。


---

# BXP-0.4-CASE-092 · PM 计划完全符合父边界
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-parent-task+downstream-plan`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.downstream-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 父任务：依据工单 T-092，在 staging 生成 report.json 与 artifact.bin，禁止 delete，耗时不超过 600 秒；两项制品都生成即完成。

- `source_digest`: `da68c78a4e97bfe2563629c7124490bbdb8ba0e5354c02609c69e09eb03f76a5`

### 测试上下文

```json
{
  "downstream_plan": {
    "outputs": [
      "report.json",
      "artifact.bin"
    ],
    "actions": [
      "generate"
    ],
    "duration_seconds": 500,
    "forbidden_actions": []
  }
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json; artifact.bin | 原文 |
| **O** | `resolved` | report.json and artifact.bin | 原文 |
| **A** | `resolved` | generate_deliverables | 原文 |
| **P** | `absent` | — | — |
| **R** | `resolved` | duration<=600s | 原文 |
| **V** | `resolved` | ticket=T-092 | 原文 |
| **C** | `resolved` | both deliverables created | 原文 |
| **B** | `resolved` | no delete | 原文 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report.json; artifact.bin"
  ],
  "Sigma": "task",
  "Q": [
    "report.json and artifact.bin"
  ],
  "F": [
    "no delete"
  ],
  "K": [
    "both deliverables created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-092"
  ],
  "Phi": [
    "duration<=600s"
  ]
}
```

## 5. Gold 断言

```text
Conform(X,B)=true
X∈Omega_B
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

`BXP.CONFORMANCE.OK`

下游方案在允许解空间内。


---

# BXP-0.4-CASE-093 · PM 计划漏掉必需输出
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-parent-task+downstream-plan`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.downstream-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 父任务：依据工单 T-093，在 staging 生成 report.json 与 artifact.bin；两项都生成即完成。

- `source_digest`: `a8cc758051f6942d7f5c8cba1a9df463cba6dec57348a401893a76f0693ed8a7`

### 测试上下文

```json
{
  "downstream_plan": {
    "outputs": [
      "artifact.bin"
    ],
    "actions": [
      "generate"
    ]
  }
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json; artifact.bin | 原文 |
| **O** | `resolved` | report.json and artifact.bin | 原文 |
| **A** | `resolved` | generate_deliverables | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-093 | 原文 |
| **C** | `resolved` | both deliverables created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging; report.json; artifact.bin"
  ],
  "Sigma": "task",
  "Q": [
    "report.json and artifact.bin"
  ],
  "F": [],
  "K": [
    "both deliverables created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-093"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
Missing={report}
Conform(X,B)=false
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

`BXP.CONFORMANCE.MISSING_REQUIRED`

父边界已准入，但该下游方案不符合。


---

# BXP-0.4-CASE-094 · PM 计划包含禁止动作
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-parent-task+downstream-plan`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.downstream-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 父任务：依据工单 T-094，在 staging 生成 report.json，明确禁止 delete；report.json 生成即完成。

- `source_digest`: `f21dabdffde99cb0804785ca0dcdc5befc8e92f96172c745b1872ac62011cf0b`

### 测试上下文

```json
{
  "downstream_plan": {
    "outputs": [
      "report.json"
    ],
    "actions": [
      "generate",
      "delete"
    ]
  }
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
| **V** | `resolved` | ticket=T-094 | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `resolved` | no delete | 原文 |

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
    "no delete"
  ],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-094"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
Violation={delete}
Conform(X,B)=false
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

`BXP.CONFORMANCE.FORBIDDEN_ACTION`

禁止集合不可被下游突破。


---

# BXP-0.4-CASE-095 · PM 计划超出资源限制
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-parent-task+downstream-plan`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.downstream-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 父任务：依据工单 T-095，在 staging 生成 report.json，耗时不得超过 600 秒；report.json 生成即完成。

- `source_digest`: `30a68ebb9ca9852987ccc4eef3948b01c7fda3aee8404e14dc2adca37cf90d47`

### 测试上下文

```json
{
  "downstream_plan": {
    "outputs": [
      "report.json"
    ],
    "duration_seconds": 900
  }
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging; report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `resolved` | duration<=600s | 原文 |
| **V** | `resolved` | ticket=T-095 | 原文 |
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
    "ticket=T-095"
  ],
  "Phi": [
    "duration<=600s"
  ]
}
```

## 5. Gold 断言

```text
900>600
Conform(X,B)=false
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

`BXP.CONFORMANCE.LIMIT_VIOLATION`

资源上界是边界的一部分。


---

# BXP-0.4-CASE-096 · 子任务集合完整覆盖父任务要求
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-parent-task+downstream-plan`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.downstream-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 父任务：必须完成结果 A、B、C；三个结果全部完成即结束。

- `source_digest`: `7dc18f42bf261cb4fa5e2958ad08766c94437cb239b3033fd5147080e3df1fa7`

### 测试上下文

```json
{
  "downstream_plan": {
    "children": {
      "T1": [
        "A"
      ],
      "T2": [
        "B"
      ],
      "T3": [
        "C"
      ]
    }
  }
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | requirements A,B,C | 原文 |
| **O** | `resolved` | A,B,C all completed | 原文 |
| **A** | `resolved` | complete_requirements | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | A and B and C completed | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "requirements A,B,C"
  ],
  "Sigma": "task",
  "Q": [
    "A,B,C all completed"
  ],
  "F": [],
  "K": [
    "A and B and C completed"
  ],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
Union(Covered_children)=Required_parent
Conform(children,B)=true
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

`BXP.CONFORMANCE.CHILD_COVERAGE_OK`

允许分解，只要边界守恒。


---

# BXP-0.4-CASE-097 · 子任务分解丢失禁止边界
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-parent-task+downstream-plan`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.downstream-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 父任务：生成 report.json，且任何阶段都禁止 external_send；report.json 生成即完成。

- `source_digest`: `5ec6424114d4d58a4b9b4c0ab391fff4875e33bc95639878e1973ece1677b4dc`

### 测试上下文

```json
{
  "downstream_plan": {
    "children": [
      {
        "id": "T1",
        "boundary": []
      },
      {
        "id": "T2",
        "boundary": []
      }
    ],
    "parent_forbidden": [
      "external_send"
    ]
  }
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | report.json | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | report_created | 原文 |
| **B** | `resolved` | no external_send in any stage | 原文 |

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
    "no external_send in any stage"
  ],
  "K": [
    "report_created"
  ],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
Forbidden_parent not preserved
Conform(children,B)=false
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

`BXP.CONFORMANCE.FORBIDDEN_DROPPED`

分解不得丢失父边界。


---

# BXP-0.4-CASE-098 · 子任务错误改变版本依据
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-parent-task+downstream-plan`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.downstream-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 父任务：只能处理制品 sha=abc，并生成 report.json；report.json 生成即完成。

- `source_digest`: `b85821e4f779a8eecc4b0c934fb40e38a856a1ffd548f1657e18340da68704d4`

### 测试上下文

```json
{
  "downstream_plan": {
    "artifact_sha": "def"
  }
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | artifact sha=abc | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | process_artifact_and_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | artifact_sha=abc | 原文 |
| **C** | `resolved` | report_created | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "artifact sha=abc"
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
    "artifact_sha=abc"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
Version_child!=Version_parent
Conform(child,B)=false
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

`BXP.CONFORMANCE.VERSION_DRIFT`

下游不得静默漂移事实源。


---

# BXP-0.4-CASE-099 · 不同实现方案但都在允许解空间
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-parent-task+downstream-plan`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.downstream-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 父任务：生成 report.json；实现方式不限，可以使用脚本或库函数；只要 report.json 内容满足要求即完成。

- `source_digest`: `415fb0db7ca54ad942df88a88452f75f542ec42ac35f6c1f70e77020b0baf983`

### 测试上下文

```json
{
  "downstream_plan_variants": [
    {
      "implementation": "script",
      "outputs": [
        "report.json"
      ]
    },
    {
      "implementation": "library",
      "outputs": [
        "report.json"
      ]
    }
  ]
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | report.json requirement | 原文 |
| **O** | `resolved` | report.json | 原文 |
| **A** | `resolved` | generate_report | 原文 |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | report_requirement_satisfied | 原文 |
| **B** | `absent` | — | — |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "report.json requirement"
  ],
  "Sigma": "task",
  "Q": [
    "report.json"
  ],
  "F": [],
  "K": [
    "report_requirement_satisfied"
  ],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
X_A∈Omega_B
X_B∈Omega_B
Conform(A,B)=Conform(B,B)=true
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

`BXP.CONFORMANCE.MULTIPLE_VALID_IMPLEMENTATIONS`

BXP约束边界，不规定唯一实现路径。


---

# BXP-0.4-CASE-100 · ADMIN 澄清后形成新版本并重新准入
- **分类**：`admission-conformance`
- **Case Kind**：`natural-language-parent-task+downstream-plan`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.admission-conformance`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证正式任务 Admission、版本绑定与下游符合性。

## 2. Source / 测试输入

> 当前任务 v2：依据工单 T-100，仅归档 90 天前日志，不得删除；归档完成并生成报告即结束。v1 的“清理”歧义已经由 ADMIN 澄清。

- `source_digest`: `18e1fd7a3937555ec0a6a1008144df975705913e939f97e913702472346de47a`

### 测试上下文

```json
{
  "previous_source": "v1 used ambiguous verb 清理",
  "clarification": "仅归档不删除"
}
```

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | logs older than 90 days | 原文 |
| **O** | `resolved` | logs archived; report created | 原文 |
| **A** | `resolved` | archive_logs | “仅归档” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | ticket=T-100; source_version=v2 | 原文 |
| **C** | `resolved` | archive_done_and_report_created | 原文 |
| **B** | `resolved` | no delete | “不得删除” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "logs older than 90 days"
  ],
  "Sigma": "task",
  "Q": [
    "logs archived; report created"
  ],
  "F": [
    "no delete"
  ],
  "K": [
    "archive_done_and_report_created"
  ],
  "Rels": [],
  "D": [
    "ticket=T-100; source_version=v2"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
SourceVersionChanged=true
UniqueCanonicalBoundary(v2)=true
Admit(v2)=true
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

`BXP.ADMISSION.CLARIFICATION_REENTERED`

澄清产生新任务版本，重新计算并准入。
