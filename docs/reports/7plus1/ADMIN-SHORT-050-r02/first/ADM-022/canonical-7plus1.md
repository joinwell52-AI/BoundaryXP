# ADM-022 脱敏结果检查

## 原文

QA 读取 masked-sample.csv，依据 MASK-RULE-7 检查姓名和手机号的脱敏结果，生成 masking-review.md。不得读取未脱敏原表，也不得将样本发送给外部人员。PM 接收复核结果。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- masking-review.md [RESOLVED]
  - 对象=masking-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:a0d7f5711232e50f6dbf16bf","kind":"ITEM","entity_node_id":"p1:e113db9aee36a5723d62e77c","source_span_ids":["p1:0f447587962a6e37aad7cfa2","p1:056551644219ce84ea01e946"],"relation_ids":["p1:5cd9bec4d7e9242b1c6cbd5e"]}；数量=null
  - 证据：[53,55) undefined；[53,73) undefined；[56,73) undefined

### A · UNRESOLVED

- REQUIRED 生成 masking-review.md [RESOLVED]
  - 对象=masking-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:a0d7f5711232e50f6dbf16bf","kind":"ITEM","entity_node_id":"p1:e113db9aee36a5723d62e77c","source_span_ids":["p1:0f447587962a6e37aad7cfa2","p1:056551644219ce84ea01e946"],"relation_ids":["p1:5cd9bec4d7e9242b1c6cbd5e"]}；数量=null
  - 证据：[53,55) undefined；[53,73) undefined；[56,73) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · RESOLVED

- MASK-RULE-7 [RESOLVED]
  - 对象=MASK-RULE-7；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[27,38) undefined；[24,52) undefined；[0,109) undefined

### C · ABSENT

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 读取 原表 [RESOLVED]
  - 对象=原表；主体=；角色=；条件=null；作用域={"expr_id":"p1:33c6f93a62143819cd45e265","kind":"ITEM","entity_node_id":"p1:54f2a51285943b73eaa20e47","source_span_ids":["p1:8ae15f1a0a78c4fdfe88cb2d","p1:ffb13fc8ffce581366ce2488"],"relation_ids":["p1:7a463c2f110c49ae4fdead7b"]}；数量=null
  - 证据：[76,78) undefined；[74,83) undefined；[81,83) undefined
- FORBIDDEN 发送 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[90,92) undefined；[84,97) undefined；[93,97) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_RELATION: No boundary-eligible action modality

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
