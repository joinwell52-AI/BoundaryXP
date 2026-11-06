# BXP 0.4 Core Gold 100 v3 — 全量适用修复候选

> 状态：`GOLD_CANDIDATE_FOR_REVIEW`。**100 / 100 用例均提供完整 7+1、Formal Boundary Model、Boundary Result 与 Admission；不存在“不适用”占位。**

---

# BXP-0.4-CASE-001 · 生产日志“清理”动作语义与相对截止时点均未唯一化
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证动作语义和相对时间基线任一会改变规范边界时，必须保持 underdetermined。

## 2. Source / 测试输入

> 依据工单 OPS-2026-0916-17，由 SRE 在今天 18:00 前清理生产集群中 90 天以前的应用日志。清理完成后磁盘可用空间至少达到 30%。不得影响在线服务，也不得修改日志采集配置。

- `source_digest`: `df32470f3d02481ec3967050e24eed0e5cabf9800c92f3096c10be330bee5ae1`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 生产集群中 90 天以前的应用日志 | “生产集群中 90 天以前的应用日志” |
| **O** | `resolved` | 磁盘可用空间至少 30% | “磁盘可用空间至少达到 30%” |
| **A** | `unresolved` | logs.archive \| logs.delete | “清理”未说明归档还是删除 |
| **P** | `resolved` | SRE | “由 SRE” |
| **R** | `unresolved` | deadline=today 18:00; free_space>=30% | “今天 18:00 前”缺少日期基线；30% 明确 |
| **V** | `resolved` | ticket=OPS-2026-0916-17 | “依据工单 OPS-2026-0916-17” |
| **C** | `resolved` | free_space>=30% | “清理完成后磁盘可用空间至少达到 30%” |
| **B** | `resolved` | no service interruption; no collector config change | “不得影响在线服务，也不得修改日志采集配置” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "old_application_logs",
    "production_cluster"
  ],
  "Sigma": "production_cluster; age(log)>90d",
  "Q": [
    "free_space>=30%"
  ],
  "F": [
    "service_interruption",
    "modify(log_collector_config)"
  ],
  "K": [
    "free_space>=30%"
  ],
  "Rels": [
    "actor_role=SRE"
  ],
  "D": [
    "ticket=OPS-2026-0916-17"
  ],
  "Phi": [
    "cleanup_action unresolved: archive|delete",
    "deadline_date unresolved; clock=18:00"
  ]
}
```

## 5. Gold 断言

```text
CleanupAction in {archive,delete}
DeadlineDate=unresolved
UniqueCanonicalBoundary=false
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

`BXP.SEMANTIC.ACTION_OR_TIME_UNRESOLVED`

“清理”至少支持归档/删除两种边界效果，且“今天 18:00”缺少可重放日期基线；不得猜测。
---

# BXP-0.4-CASE-002 · “更新限流配置”动作明确，但目标配置内容缺失
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证不能把“更新配置”误拆成改值/仅重载；真正未确定的是要更新成什么配置。

## 2. Source / 测试输入

> 依据 CHG-441，由运维在 30 分钟内更新网关限流配置并使其生效，不得改变认证规则。

- `source_digest`: `2eaab98ff033d9ed9fcef4de1e7e4209cf2fd6840cb1681da57a281d937919c4`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 网关限流配置 | “网关限流配置” |
| **O** | `unresolved` | 目标限流配置生效 | 只说“更新…并使其生效”，未给目标值/目标版本 |
| **A** | `resolved` | config.update | “更新网关限流配置” |
| **P** | `resolved` | 运维 | “由运维” |
| **R** | `resolved` | duration<=1800s | “在 30 分钟内” |
| **V** | `resolved` | change=CHG-441 | “依据 CHG-441” |
| **C** | `resolved` | updated_rate_limit_config_effective | “并使其生效” |
| **B** | `resolved` | no auth-rule change | “不得改变认证规则” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "gateway_rate_limit_config"
  ],
  "Sigma": "gateway/rate-limit",
  "Q": [
    "target_rate_limit_config_applied"
  ],
  "F": [
    "modify(authentication_rules)"
  ],
  "K": [
    "updated_rate_limit_config_effective"
  ],
  "Rels": [
    "actor_role=ops"
  ],
  "D": [
    "change=CHG-441"
  ],
  "Phi": [
    "duration<=1800s",
    "target_rate_limit_config=unresolved"
  ]
}
```

## 5. Gold 断言

```text
Action=config.update
TargetConfiguration=unresolved
UniqueCanonicalBoundary=false
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

`BXP.SEMANTIC.TARGET_VALUE_UNRESOLVED`

“更新配置”在本句中是修改/更新动作；不能人为制造 reload 候选。由于目标限流值或目标配置版本缺失，最终要求仍不唯一。
---

# BXP-0.4-CASE-003 · 并列禁止对象分别受约束
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证中文并列禁止对象不应被误解释为“只有同时删除 A+B 才禁止”。

## 2. Source / 测试输入

> 压缩客户 A 和客户 B 的历史归档；不得删除客户 A 的归档，也不得删除客户 B 的归档。压缩完成即结束。

- `source_digest`: `9a4cc22260e09d5403705aee9fbd18bee2af5a693d7743eb1603515e1066f7a4`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 客户 A 与客户 B 的历史归档 | “客户 A 和客户 B 的历史归档” |
| **O** | `resolved` | 已压缩的 A/B 历史归档 | “压缩…历史归档” |
| **A** | `resolved` | archive.compress | “压缩” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | compression_done | “压缩完成即结束” |
| **B** | `resolved` | no delete(archive_A); no delete(archive_B) | 分别写明不得删除 A、不得删除 B |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "archive_A",
    "archive_B"
  ],
  "Sigma": "customer_A_B_archives",
  "Q": [
    "compress(archive_A)",
    "compress(archive_B)"
  ],
  "F": [
    "delete(archive_A)",
    "delete(archive_B)"
  ],
  "K": [
    "compression_done"
  ],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
delete(archive_A)=forbidden
delete(archive_B)=forbidden
UniqueCanonicalBoundary=true
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

`BXP.OK.CONJUNCTIVE_PROHIBITION_RESOLVED`

修订输入消除伪歧义：A、B 两个对象分别受删除禁令约束。
---

# BXP-0.4-CASE-004 · 部署仅允许测试环境，未指定主体不应补造主体
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证作用域和禁止边界可确定，同时 P/C 缺失保持 absent 而不是补造。

## 2. Source / 测试输入

> 只允许在测试环境部署 build-2026.09；除测试环境外不得执行部署。

- `source_digest`: `1e4fa976a2b770e1f948f12523bccca46041873ebf2580b63a75c8224a144adb`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | build-2026.09; test environment | “build-2026.09”“测试环境” |
| **O** | `resolved` | build-2026.09 deployed in test | “只允许在测试环境部署” |
| **A** | `resolved` | deploy | “部署” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | build=2026.09 | “build-2026.09” |
| **C** | `absent` | — | — |
| **B** | `resolved` | no deploy outside test | “除测试环境外不得执行部署” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "build-2026.09",
    "test_environment"
  ],
  "Sigma": "test_environment",
  "Q": [
    "deploy(build-2026.09,test_environment)"
  ],
  "F": [
    "deploy(build-2026.09,environment!=test_environment)"
  ],
  "K": [],
  "Rels": [],
  "D": [
    "build=2026.09"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
AllowedDeployScope={test_environment}
DeployOutsideTest=forbidden
Participant=absent
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

`BXP.OK.SCOPE_AND_PROHIBITION_RESOLVED`

原文没有 release-engineer，也没有 deployment_healthy；这两个字段必须保持 absent。
---

# BXP-0.4-CASE-005 · 代词“它/他”缺少实体指代
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证对象和审核主体的代词未绑定到实体时不得猜测。

## 2. Source / 测试输入

> 把它交给他审核，审核通过后归档；不得外发。

- `source_digest`: `ac1f29794250f7d2cb81e48e4b274e61b4e1eb301d2913c003c7648b28ba5cf7`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `unresolved` | object referred by “它” | “它”缺少先行实体 |
| **O** | `resolved` | approved object archived | “审核通过后归档” |
| **A** | `resolved` | handoff; review; archive | “交给…审核…归档” |
| **P** | `unresolved` | reviewer referred by “他” | “他”缺少先行主体 |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | review_passed then archived | “审核通过后归档” |
| **B** | `resolved` | no external send | “不得外发” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [],
  "Sigma": "unresolved_object",
  "Q": [
    "review_passed",
    "archive_after_review"
  ],
  "F": [
    "external_send"
  ],
  "K": [
    "archive_after_review"
  ],
  "Rels": [
    "reviewer_identity=unresolved"
  ],
  "D": [],
  "Phi": [
    "target_identity=unresolved"
  ]
}
```

## 5. Gold 断言

```text
TargetIdentity=unresolved
ReviewerIdentity=unresolved
UniqueCanonicalBoundary=false
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

`BXP.SEMANTIC.PRONOUN_REFERENCE_UNRESOLVED`

对象“它”和主体“他”都没有可追溯先行词，不能由模型自行补实体。
---

# BXP-0.4-CASE-006 · 显式局部主体标签与角色可解析
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证原文直接给出的参与者标签与角色可以作为本任务局部身份，不需要外部企业 L3。

## 2. Source / 测试输入

> 负责人张工（SRE）负责重启 staging-api；5 分钟内健康检查通过，不得触碰 production-api。

- `source_digest`: `0a8a4a75f1208f7d43166f4a89e4840e8094420c5bbdef85bc14825f36a47b07`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | staging-api | “staging-api” |
| **O** | `resolved` | staging-api health check passed | “健康检查通过” |
| **A** | `resolved` | restart(staging-api) | “负责重启 staging-api” |
| **P** | `resolved` | participant_label=张工; role=SRE | “负责人张工（SRE）” |
| **R** | `resolved` | duration<=300s | “5 分钟内” |
| **V** | `absent` | — | — |
| **C** | `resolved` | health_check_passed | “健康检查通过” |
| **B** | `resolved` | no touch production-api | “不得触碰 production-api” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "staging-api",
    "production-api"
  ],
  "Sigma": "staging-api",
  "Q": [
    "restart(staging-api)",
    "health_check_passed"
  ],
  "F": [
    "touch(production-api)"
  ],
  "K": [
    "health_check_passed"
  ],
  "Rels": [
    "actor_label=张工",
    "actor_role=SRE"
  ],
  "D": [],
  "Phi": [
    "duration<=300s"
  ]
}
```

## 5. Gold 断言

```text
ActorLabel=张工
ActorRole=SRE
production-api not in allowed scope
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

`BXP.OK.LOCAL_PARTICIPANT_RESOLVED`

只解析原文明确给出的“张工（SRE）”，不映射成任何企业 employee_id。
---

# BXP-0.4-CASE-007 · 任务版本与代码来源依据缺失
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证 source 中没有代码版本/仓库基线时，V 应为 absent，并因必需 provenance 缺口阻断。

## 2. Source / 测试输入

> 工程师修复认证模块并提交补丁；测试通过后完成；不得修改支付模块。

- `source_digest`: `d0e646a7b7ffa18fa6e0fab10df289b474a9b1f9396a27278fb39b89c911a4b0`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 认证模块 | “认证模块” |
| **O** | `resolved` | auth fix patch | “提交补丁” |
| **A** | `resolved` | fix auth module; create/submit patch; run tests | “修复…提交补丁；测试通过” |
| **P** | `resolved` | 工程师 | “工程师” |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | tests_pass | “测试通过后完成” |
| **B** | `resolved` | no modify payment module | “不得修改支付模块” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "auth_module",
    "payment_module"
  ],
  "Sigma": "auth_module",
  "Q": [
    "auth_fix_patch",
    "tests_pass"
  ],
  "F": [
    "modify(payment_module)"
  ],
  "K": [
    "tests_pass"
  ],
  "Rels": [
    "actor_role=engineer"
  ],
  "D": [
    "code_revision=absent"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
CodeRevision=absent
RequiredProvenanceResolved=false
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

`BXP.PROVENANCE.REQUIRED_CODE_BASELINE_ABSENT`

V 没写就必须是 absent；如果当前 Profile 要求对代码变更绑定精确基线，则 Boundary/Admission 不能假装已经确定。
---

# BXP-0.4-CASE-008 · 主观完成条件“效果满意”
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证主观停止条件无法确定性求值时必须保持 underdetermined。

## 2. Source / 测试输入

> 优化推荐提示词，直到效果满意；不得泄露系统提示词。

- `source_digest`: `af07effb104fe0f7b379fe0a8664ec0e6cff4c936f244de6de2c2c5bd8caedc8`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 推荐提示词 | “推荐提示词” |
| **O** | `resolved` | 优化后的推荐提示词 | “优化推荐提示词” |
| **A** | `resolved` | prompt.optimize | “优化” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `unresolved` | “效果满意” | “直到效果满意”没有可计算阈值 |
| **B** | `resolved` | no system-prompt disclosure | “不得泄露系统提示词” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "recommendation_prompt",
    "system_prompt"
  ],
  "Sigma": "recommendation_prompt",
  "Q": [
    "optimized_recommendation_prompt"
  ],
  "F": [
    "disclose(system_prompt)"
  ],
  "K": [
    "satisfaction_threshold=unresolved"
  ],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
CompletionCriterion=unresolved
UniqueCanonicalBoundary=false
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

`BXP.COMPLETION.SUBJECTIVE_CRITERION`

不能把“满意”替换成任意模型评分阈值。
---

# BXP-0.4-CASE-009 · 明确期限、交付、完成条件与禁止边界
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证原文没有责任主体时 P 保持 absent，但其余边界仍可确定。

## 2. Source / 测试输入

> 依据 ISSUE-901，在 600 秒内生成 auth 修复补丁并使单元测试全部通过；不得推送远程分支。

- `source_digest`: `db2d7a14fa6f5b097112ef134ad7551eb0dd95446a50167fe9497cc73519aadc`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | auth module | “auth 修复补丁” |
| **O** | `resolved` | auth fix patch; unit tests pass | “生成 auth 修复补丁并使单元测试全部通过” |
| **A** | `resolved` | generate patch; run unit tests | 同上 |
| **P** | `absent` | — | — |
| **R** | `resolved` | duration<=600s | “在 600 秒内” |
| **V** | `resolved` | issue=ISSUE-901 | “依据 ISSUE-901” |
| **C** | `resolved` | all_unit_tests_pass | “单元测试全部通过” |
| **B** | `resolved` | no remote push | “不得推送远程分支” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "auth_module",
    "patch"
  ],
  "Sigma": "auth_module",
  "Q": [
    "auth_fix_patch",
    "all_unit_tests_pass"
  ],
  "F": [
    "push(remote_branch)"
  ],
  "K": [
    "all_unit_tests_pass"
  ],
  "Rels": [],
  "D": [
    "issue=ISSUE-901"
  ],
  "Phi": [
    "duration<=600s"
  ]
}
```

## 5. Gold 断言

```text
Participant=absent
duration<=600s
push(remote_branch)=forbidden
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

`BXP.OK.SOURCE_BACKED_BOUNDARY`

删除原 Gold 中凭空出现的 engineer；P absent 不等于边界必然不确定。
---

# BXP-0.4-CASE-010 · 归档且禁止删除形成明确数据保留边界
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证“归档保存，不要删”不会被改写为删除；未给主体时 P 保持 absent。

## 2. Source / 测试输入

> 把 30 天前日志归档保存，不要删；完成后磁盘至少空出 20%。

- `source_digest`: `03f85761fbdf268393373880b0f36c522aa1b4ea643e5b2b90f407fd3b944838`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 30 天前日志 | “30 天前日志” |
| **O** | `resolved` | 日志已归档且磁盘空闲>=20% | “归档保存…磁盘至少空出 20%” |
| **A** | `resolved` | logs.archive | “归档保存” |
| **P** | `absent` | — | — |
| **R** | `resolved` | free_space>=20% | “磁盘至少空出 20%” |
| **V** | `absent` | — | — |
| **C** | `resolved` | free_space>=20% | “完成后磁盘至少空出 20%” |
| **B** | `resolved` | no delete(logs) | “不要删” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "logs_older_than_30d"
  ],
  "Sigma": "age(log)>30d",
  "Q": [
    "archive(logs)",
    "free_space>=20%"
  ],
  "F": [
    "delete(logs)"
  ],
  "K": [
    "free_space>=20%"
  ],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
ArchiveRequired=true
DeleteForbidden=true
Participant=absent
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

`BXP.OK.ARCHIVE_NOT_DELETE`

动作与禁止效果清晰；不补造 operator。
---

# BXP-0.4-CASE-011 · 数值时限进入资源约束，公网禁令进入禁止边界
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证 R 与 B 分层，同时不补造 builder。

## 2. Source / 测试输入

> 构建任务必须在 10 分钟内完成；不得访问公网。

- `source_digest`: `58fdf38296f836b5e032d8c7f1e0b9f5bd31c7df26cc6896415f489dcf16abf6`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 构建任务 | “构建任务” |
| **O** | `resolved` | build completed | “必须在 10 分钟内完成” |
| **A** | `resolved` | build | “构建任务” |
| **P** | `absent` | — | — |
| **R** | `resolved` | duration<=600s | “10 分钟内” |
| **V** | `absent` | — | — |
| **C** | `resolved` | build_completed | “完成” |
| **B** | `resolved` | no public internet access | “不得访问公网” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "build_task"
  ],
  "Sigma": "build_task",
  "Q": [
    "build_completed"
  ],
  "F": [
    "access(public_internet)"
  ],
  "K": [
    "build_completed"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "duration<=600s"
  ]
}
```

## 5. Gold 断言

```text
duration<=600s
access(public_internet)=forbidden
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

`BXP.OK.RESOURCE_AND_FORBIDDEN_SEPARATED`

原 Gold 的 builder 无来源，已删除。
---

# BXP-0.4-CASE-012 · 生产数据只读统计，删除和修改均禁止
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证读取/统计可以与禁止写入边界共存，未给 analyst 时 P=absent。

## 2. Source / 测试输入

> 读取生产数据库统计订单量；不得删除或修改任何生产数据。

- `source_digest`: `774b0b2bcad47ed2f37c2ab3007571356c40767da294176b4200a4d07d7de6da`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 生产数据库订单数据 | “生产数据库…订单量” |
| **O** | `resolved` | 订单量统计结果 | “统计订单量” |
| **A** | `resolved` | read; aggregate/count | “读取…统计” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `absent` | — | — |
| **B** | `resolved` | no delete or modify production data | “不得删除或修改任何生产数据” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "production_database",
    "order_data"
  ],
  "Sigma": "production/order_data/read_only",
  "Q": [
    "order_count_observed"
  ],
  "F": [
    "delete(production_data)",
    "modify(production_data)"
  ],
  "K": [],
  "Rels": [],
  "D": [],
  "Phi": [
    "read_only=true"
  ]
}
```

## 5. Gold 断言

```text
WriteEffects intersection ProductionData = empty
Participant=absent
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

`BXP.OK.READ_ONLY_DATA_SCOPE`

输出“订单量统计结果”来自动作目标；不补造 analyst 和 report_created。
---

# BXP-0.4-CASE-013 · ADMIN 批准是条件边界，不等于 BXP 执行授权
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证条件发布约束可以确定，且未知发布执行者不得被补造。

## 2. Source / 测试输入

> 只有 ADMIN 已批准时才可以发布 build-77；否则不得发布。

- `source_digest`: `c8c8796ab383e6a814d8068abc80cdaaf98106bfc65a2fa70110ecf487ae71e9`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | build-77 | “build-77” |
| **O** | `resolved` | build-77 published only when ADMIN approved | “只有 ADMIN 已批准时才可以发布” |
| **A** | `resolved` | publish(build-77) conditional | “才可以发布” |
| **P** | `resolved` | ADMIN=approver; publisher absent | “ADMIN 已批准”只给出审批主体 |
| **R** | `absent` | — | — |
| **V** | `resolved` | build=77 | “build-77” |
| **C** | `absent` | — | — |
| **B** | `resolved` | if not ADMIN approved then no publish | “否则不得发布” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "build-77"
  ],
  "Sigma": "publication",
  "Q": [
    "publish only if admin_approved"
  ],
  "F": [
    "publish when admin_approved=false"
  ],
  "K": [],
  "Rels": [
    "approver=ADMIN",
    "publisher=absent"
  ],
  "D": [
    "build=77"
  ],
  "Phi": [
    "admin_approved -> publish_allowed",
    "not admin_approved -> publish_forbidden"
  ]
}
```

## 5. Gold 断言

```text
ApprovalConditionResolved=true
ExecutionAuthorization=null
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

`BXP.OK.CONDITIONAL_APPROVAL_BOUNDARY`

删除原 Gold 中凭空出现的 release-manager；Admission 只说明任务边界可进入后续规划，不授予发布执行权。
---

# BXP-0.4-CASE-014 · “尽快”是不可计算的资源约束
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证模糊时限不能被静默转换为任意秒数。

## 2. Source / 测试输入

> 尽快完成模型评测，评测通过就结束；不得修改模型。

- `source_digest`: `f31a5b0cbe5a1f1b60e02aa94ffb642b98b15e2053740d9f7e41d4e4a3db038d`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | model evaluation | “模型评测” |
| **O** | `resolved` | evaluation passed | “评测通过” |
| **A** | `resolved` | evaluate(model) | “完成模型评测” |
| **P** | `absent` | — | — |
| **R** | `unresolved` | deadline/latency=“尽快” | “尽快”无数值边界 |
| **V** | `absent` | — | — |
| **C** | `resolved` | evaluation_passed | “评测通过就结束” |
| **B** | `resolved` | no modify model | “不得修改模型” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "model",
    "evaluation"
  ],
  "Sigma": "model_evaluation",
  "Q": [
    "evaluation_passed"
  ],
  "F": [
    "modify(model)"
  ],
  "K": [
    "evaluation_passed"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "time_limit=unresolved"
  ]
}
```

## 5. Gold 断言

```text
TimeLimit=unresolved
UniqueCanonicalBoundary=false
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

`BXP.RESOURCE.VAGUE_TIME_LIMIT`

“尽快”是源文本中的约束但不可数值化；不能补造 ml-engineer 或时间上限。
---

# BXP-0.4-CASE-015 · 至少两名独立审核人且不得重复计数
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证审核基数与身份互异约束。

## 2. Source / 测试输入

> 发布前必须至少两名独立审核人通过；禁止同一人重复计数。

- `source_digest`: `8a2a3875ce9c7742edeb8b901b1197c1f9f7255d2c8f505d6be60653f74a2ea2`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | release review set | “发布前…审核人” |
| **O** | `resolved` | at least two independent approvals | “至少两名独立审核人通过” |
| **A** | `resolved` | review/approve | “审核人通过” |
| **P** | `resolved` | reviewers; identities not preselected | “至少两名独立审核人” |
| **R** | `resolved` | reviewer_count>=2 | “至少两名” |
| **V** | `absent` | — | — |
| **C** | `resolved` | two independent approvals recorded | “至少两名…通过” |
| **B** | `resolved` | no duplicate reviewer counting | “禁止同一人重复计数” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "release_review"
  ],
  "Sigma": "review",
  "Q": [
    "independent_approval_count>=2"
  ],
  "F": [
    "duplicate_reviewer_counting"
  ],
  "K": [
    "independent_approval_count>=2"
  ],
  "Rels": [
    "reviewers pairwise distinct"
  ],
  "D": [],
  "Phi": [
    "cardinality(reviewers)>=2"
  ]
}
```

## 5. Gold 断言

```text
ReviewerCount>=2
ReviewersDistinct=true
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

`BXP.OK.REVIEW_CARDINALITY`

主体集合由任务定义为“任意两名独立审核人”，无需预先指定具体人。
---

# BXP-0.4-CASE-016 · 只读检查动作与无写入边界
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证只读动作模态可形成确定边界，且不补造 reviewer。

## 2. Source / 测试输入

> 只读检查配置文件并输出差异报告；不得保存任何修改。

- `source_digest`: `9293d74ccb153ba04234b5085bed5718d97520bbdd47334ecc558892b74bed80`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 配置文件 | “配置文件” |
| **O** | `resolved` | 差异报告 | “输出差异报告” |
| **A** | `resolved` | read/compare only | “只读检查” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | diff_report_created | “输出差异报告” |
| **B** | `resolved` | no save/write modifications | “不得保存任何修改” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "configuration_file",
    "diff_report"
  ],
  "Sigma": "configuration_file/read_only",
  "Q": [
    "diff_report_created"
  ],
  "F": [
    "persist_modification(configuration_file)"
  ],
  "K": [
    "diff_report_created"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "read_only=true"
  ]
}
```

## 5. Gold 断言

```text
ReadOnly=true
PersistModification=forbidden
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

`BXP.OK.READ_ONLY_MODALITY`

原文没有 reviewer，已删除补造主体。
---

# BXP-0.4-CASE-017 · 禁止后端修改已明确，但前端目标对象与目标文案未唯一化
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证局部禁止边界 resolved 不能推出整个任务 Boundary determined。

## 2. Source / 测试输入

> 调整前端按钮文案，不要改后端任何服务；测试截图生成即完成。

- `source_digest`: `5c0c208586cd0d897922de02fcbf572331a1646bef4452207bd3e0182cde434d`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `unresolved` | specific frontend button copy target | “前端按钮文案”没有唯一按钮/页面/控件身份 |
| **O** | `unresolved` | desired updated button copy | 没有给出目标文案内容 |
| **A** | `resolved` | ui.edit_text | “调整…文案” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | test_screenshot_created | “测试截图生成即完成” |
| **B** | `resolved` | no modify backend services | “不要改后端任何服务” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "backend_services"
  ],
  "Sigma": "frontend_button_target=unresolved",
  "Q": [
    "desired_button_copy=unresolved",
    "test_screenshot_created"
  ],
  "F": [
    "modify(backend_services)"
  ],
  "K": [
    "test_screenshot_created"
  ],
  "Rels": [],
  "D": [],
  "Phi": [
    "frontend_target_identity=unresolved"
  ]
}
```

## 5. Gold 断言

```text
ForbiddenBackendChangeResolved=true
FrontendTargetResolved=false
Determined=false
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

`BXP.SEMANTIC.TARGET_OBJECT_OR_VALUE_UNRESOLVED`

知道“不能改后端”只确定了禁止集合；并没有确定具体要改哪个按钮、改成什么文案。
---

# BXP-0.4-CASE-018 · 同一任务同时要求发布并禁止发布
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`inconsistent`
- **Admission**：`blocked`

## 1. 测试目的

验证同一条件下的必需动作与禁止动作直接导致空解空间。

## 2. Source / 测试输入

> 今天必须发布 build-9；同时今天不得发布任何 build。

- `source_digest`: `90ee305265654897fed36c9a4bf09bcce7e880687902ffff372ee69b6d430310`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | build-9 | “build-9” |
| **O** | `resolved` | build-9 published today | “今天必须发布 build-9” |
| **A** | `resolved` | publish(build-9) | “必须发布” |
| **P** | `absent` | — | — |
| **R** | `resolved` | time_scope=today (symbolic same day) | 两句都使用同一“今天” |
| **V** | `resolved` | build=9 | “build-9” |
| **C** | `resolved` | build-9 published | “必须发布” |
| **B** | `resolved` | no build may be published today | “今天不得发布任何 build” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "build-9"
  ],
  "Sigma": "same_symbolic_day",
  "Q": [
    "publish(build-9)"
  ],
  "F": [
    "publish(any_build)"
  ],
  "K": [
    "publish(build-9)"
  ],
  "Rels": [],
  "D": [
    "build=9"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
publish(build-9)=required
publish(build-9)=forbidden
Omega=empty
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

`BXP.BOUNDARY.REQUIRED_FORBIDDEN_CONFLICT`

即使“今天”的绝对日期尚未绑定，两条规则共享同一时间变量，矛盾仍成立。
---

# BXP-0.4-CASE-019 · 两个政策都声明适用，但政策内容/摘要未提供
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证多个 policy 同时适用时不应凭空猜优先级；真正缺口是可核验政策内容与规范组合结果。

## 2. Source / 测试输入

> 按 POLICY-v1 和 POLICY-v2 执行数据保留策略；两份都适用。

- `source_digest`: `be205ba63450bb31ead6a39423ac0c8e968e2ddb0c1021bfbf828707e443d382`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | data retention policy execution | “数据保留策略” |
| **O** | `unresolved` | combined retention obligations | 未提供 POLICY-v1/v2 的内容 |
| **A** | `resolved` | apply data-retention policies | “按…执行” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `resolved` | POLICY-v1; POLICY-v2; both applicable | “两份都适用” |
| **C** | `absent` | — | — |
| **B** | `unresolved` | depends on policy contents | 政策禁止项不可从名称推出 |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "POLICY-v1",
    "POLICY-v2"
  ],
  "Sigma": "data_retention",
  "Q": [
    "combined_policy_requirements=unresolved"
  ],
  "F": [
    "combined_policy_forbidden=unresolved"
  ],
  "K": [],
  "Rels": [],
  "D": [
    "POLICY-v1 content/digest unresolved",
    "POLICY-v2 content/digest unresolved"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
PolicyApplicability={v1,v2}
PolicyContentResolved=false
UniqueCanonicalBoundary=false
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

`BXP.PROVENANCE.POLICY_CONTENT_UNRESOLVED`

“两份都适用”已经排除了“选哪个”的优先级问题；但没有政策内容就无法计算合取后的边界。
---

# BXP-0.4-CASE-020 · 相对时间“明天”缺少参考时点
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证没有参考时点时相对截止时间不能确定性转换。

## 2. Source / 测试输入

> 明天下午 5 点前完成备份；不得删除源文件。

- `source_digest`: `f73a849ba223ed352193cc096d6c186f39892f50a112f7349fecf7611184b270`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | source files for backup | “完成备份…不得删除源文件” |
| **O** | `resolved` | backup created | “完成备份” |
| **A** | `resolved` | backup | “完成备份” |
| **P** | `absent` | — | — |
| **R** | `unresolved` | deadline=tomorrow 17:00 | “明天下午 5 点前”缺参考时点 |
| **V** | `absent` | — | — |
| **C** | `resolved` | backup_completed | “完成备份” |
| **B** | `resolved` | no delete source files | “不得删除源文件” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "source_files",
    "backup"
  ],
  "Sigma": "backup",
  "Q": [
    "backup_completed"
  ],
  "F": [
    "delete(source_files)"
  ],
  "K": [
    "backup_completed"
  ],
  "Rels": [],
  "D": [
    "time_baseline=absent"
  ],
  "Phi": [
    "deadline=relative(tomorrow,17:00)"
  ]
}
```

## 5. Gold 断言

```text
TimeBaseline=absent
AbsoluteDeadline=unresolved
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

`BXP.TIME.REFERENCE_BASELINE_ABSENT`

不补造 operator；“明天”必须绑定来源时点或显式 evaluation time。
---

# BXP-0.4-CASE-021 · 相对时间有明确参考时点
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证显式任务创建时点可以把“明天 17:00”唯一化。

## 2. Source / 测试输入

> 任务创建时间为 2026-09-16 10:00+08:00。明天下午 5 点前完成备份；不得删除源文件。

- `source_digest`: `a197cd96f65ad34bba45c8e1dde793a1d3bef589e21f6a1e72869510dc18a0f5`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | source files for backup | “完成备份…不得删除源文件” |
| **O** | `resolved` | backup created | “完成备份” |
| **A** | `resolved` | backup | “完成备份” |
| **P** | `absent` | — | — |
| **R** | `resolved` | deadline=2026-09-17T17:00:00+08:00 | 创建时间 2026-09-16 10:00+08:00 + “明天下午5点” |
| **V** | `resolved` | time_baseline=2026-09-16T10:00:00+08:00 | “任务创建时间为 …” |
| **C** | `resolved` | backup_completed | “完成备份” |
| **B** | `resolved` | no delete source files | “不得删除源文件” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "source_files",
    "backup"
  ],
  "Sigma": "backup",
  "Q": [
    "backup_completed"
  ],
  "F": [
    "delete(source_files)"
  ],
  "K": [
    "backup_completed"
  ],
  "Rels": [],
  "D": [
    "time_baseline=2026-09-16T10:00:00+08:00"
  ],
  "Phi": [
    "deadline<=2026-09-17T17:00:00+08:00"
  ]
}
```

## 5. Gold 断言

```text
AbsoluteDeadline=2026-09-17T17:00:00+08:00
UniqueCanonicalBoundary=true
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

`BXP.OK.RELATIVE_TIME_RESOLVED`

不补造 operator；时间基线来自原文。
---

# BXP-0.4-CASE-022 · “部分客户”未绑定到唯一客户子集
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证总体中的未指定子集会改变作用域，必须 underdetermined。

## 2. Source / 测试输入

> 把新功能开放给部分客户，不得影响其他客户。

- `source_digest`: `02cf492a4f0654b848a1bf5466c2ca0314e8a9da36983b25c1e22dfdf7048bc1`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `unresolved` | subset of customers | “部分客户”未指定集合 |
| **O** | `resolved` | new feature enabled for selected subset | “把新功能开放给部分客户” |
| **A** | `resolved` | feature.rollout | “开放” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | feature enabled for selected subset | 动作结果 |
| **B** | `resolved` | no impact to non-selected customers | “不得影响其他客户” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "new_feature"
  ],
  "Sigma": "customer_subset=unresolved",
  "Q": [
    "feature_enabled(selected_subset)"
  ],
  "F": [
    "impact(non_selected_customers)"
  ],
  "K": [
    "feature_enabled(selected_subset)"
  ],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
SelectedCustomerSubset=unresolved
UniqueCanonicalBoundary=false
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

`BXP.SCOPE.SUBSET_UNRESOLVED`

删除原 Gold 中 product-operator 补造。
---

# BXP-0.4-CASE-023 · 括号澄清“清理”仅压缩归档且不删除
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证显式括号说明消除 destructive/non-destructive 动作歧义。

## 2. Source / 测试输入

> 清理（仅压缩归档，不删除）90 天前日志；不得影响在线服务。

- `source_digest`: `013a4aab7e87f518011051e9fbbfea9e2cc965cf0c1226d771d39cc5bd1169a8`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | 90 天前日志 | “90 天前日志” |
| **O** | `resolved` | compressed archived logs | “仅压缩归档” |
| **A** | `resolved` | logs.compress_archive | “清理（仅压缩归档，不删除）” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | compression_complete | “清理（仅压缩归档…）”的动作结果 |
| **B** | `resolved` | no delete; no service impact | “不删除”“不得影响在线服务” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "logs_older_than_90d"
  ],
  "Sigma": "age(log)>90d",
  "Q": [
    "compress_archive(logs)"
  ],
  "F": [
    "delete(logs)",
    "service_interruption"
  ],
  "K": [
    "compression_complete"
  ],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
CleanupAction=compress_archive
DeleteForbidden=true
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

`BXP.OK.PARENTHETICAL_DISAMBIGUATION`

删除原 Gold 中 SRE 补造；动作语义由括号明确。
---

# BXP-0.4-CASE-024 · 政策名称存在但版本/唯一身份未绑定
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`underdetermined`
- **Admission**：`blocked`

## 1. 测试目的

验证仅有政策显示名称不足以形成可重放 provenance。

## 2. Source / 测试输入

> 按《数据处理规范》执行脱敏；不得导出明文。

- `source_digest`: `0e162c07175a26faedbd6891f73fc1639da9d680f41daba1a311eb0e7a8fa349`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | data to be de-identified | “执行脱敏” |
| **O** | `resolved` | de-identified data | “脱敏” |
| **A** | `resolved` | data.deidentify | “执行脱敏” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `unresolved` | 《数据处理规范》 version/digest | 只给显示名称，未给版本/摘要 |
| **C** | `resolved` | deidentification_completed | “执行脱敏” |
| **B** | `resolved` | no plaintext export | “不得导出明文” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "data",
    "policy:数据处理规范"
  ],
  "Sigma": "data_deidentification",
  "Q": [
    "deidentified_data"
  ],
  "F": [
    "export(plaintext)"
  ],
  "K": [
    "deidentification_completed"
  ],
  "Rels": [],
  "D": [
    "policy_version=unresolved",
    "policy_digest=unresolved"
  ],
  "Phi": []
}
```

## 5. Gold 断言

```text
PolicyIdentityResolved=false
UniqueCanonicalBoundary=false
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

`BXP.PROVENANCE.POLICY_IDENTITY_UNRESOLVED`

删除原 Gold 中 data-engineer 补造。
---

# BXP-0.4-CASE-025 · 中英混合术语映射到同一规范动作
- **分类**：`semantic-ir-ambiguity`
- **Case Kind**：`natural-language-task`
- **Producer 计分**：`true`
- **协议**：`0.4.0-draft.1`
- **Profile**：`org.boundx.core-7plus1`
- **Operator Profile**：`bxp-core-0.4-gold-v1`
- **Boundary State**：`determined`
- **Admission**：`admitted`

## 1. 测试目的

验证语言混合不应导致额外主体或动作被补造。

## 2. Source / 测试输入

> Run unit tests，并确保全部测试通过；do not push remote。

- `source_digest`: `2fb81fe8cf34c662473195b967185854a5d3ad356cd4f35b893a9c122d961cea`

## 3. Gold 7+1

| 元素 | 状态 | 规范化内容 | 证据 |
|---|---|---|---|
| **I** | `resolved` | unit test suite for current task context | “Run unit tests” |
| **O** | `resolved` | all unit tests pass | “确保全部测试通过” |
| **A** | `resolved` | test.run_unit | “Run unit tests” |
| **P** | `absent` | — | — |
| **R** | `absent` | — | — |
| **V** | `absent` | — | — |
| **C** | `resolved` | all_unit_tests_pass | “全部测试通过” |
| **B** | `resolved` | no remote push | “do not push remote” |

## 4. Gold Formal Boundary Model

```json
{
  "E": [
    "unit_test_suite"
  ],
  "Sigma": "current_task_test_context",
  "Q": [
    "all_unit_tests_pass"
  ],
  "F": [
    "push(remote)"
  ],
  "K": [
    "all_unit_tests_pass"
  ],
  "Rels": [],
  "D": [],
  "Phi": []
}
```

## 5. Gold 断言

```text
Action=test.run_unit
PushRemote=forbidden
Participant=absent
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

`BXP.OK.CROSS_LANGUAGE_NORMALIZATION`

删除原 Gold 中 engineer 补造；只保留源文本支持的动作、结果与禁止边界。
---

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
---

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
---

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
