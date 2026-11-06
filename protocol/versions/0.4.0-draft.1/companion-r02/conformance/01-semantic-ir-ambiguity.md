# semantic-ir-ambiguity

> 25 cases · all applicable · all Producer-scored

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
