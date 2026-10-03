# ADM-027 模型调用证据检查

## 原文

QA 读取 inference-trace.json，检查记录中的模型名称、输入摘要和输出摘要，生成 model-call-audit.md。没有调用证据的模型必须标记为未证实，不得因模型已下载而标为已调用。PM 向 ADMIN 汇报审计结果。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · PARSER_COVERAGE_FAILURE

- model-call-audit.md [RESOLVED]
  - 对象=model-call-audit.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:b14c76a4606f842b9147def3","kind":"ITEM","entity_node_id":"p1:69acd1daa379c4f74ea309a3","source_span_ids":["p1:ba40e3299d6a93452fe526b6","p1:792e41c10bc0d32bfa44cca0"],"relation_ids":["p1:11bc9883050f82219241d05d"]}；数量=null
  - 证据：[48,50) undefined；[48,70) undefined；[51,70) undefined

### A · UNRESOLVED

- REQUIRED 生成 model-call-audit.md [RESOLVED]
  - 对象=model-call-audit.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:b14c76a4606f842b9147def3","kind":"ITEM","entity_node_id":"p1:69acd1daa379c4f74ea309a3","source_span_ids":["p1:ba40e3299d6a93452fe526b6","p1:792e41c10bc0d32bfa44cca0"],"relation_ids":["p1:11bc9883050f82219241d05d"]}；数量=null
  - 证据：[48,50) undefined；[48,70) undefined；[51,70) undefined
- REQUIRED 标记 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[82,84) undefined；[71,88) undefined

### P · PARSER_COVERAGE_FAILURE

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[109,114) undefined；[104,121) undefined；[115,117) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 标 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[98,99) undefined；[89,103) undefined
- FORBIDDEN 调用 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[101,103) undefined；[89,103) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Multiple operands without an explicit supported set connector
- UNRESOLVED_RELATION: No supported native semantic construction for this clause
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
