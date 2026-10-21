# ADM-015 配置一致性检查

## 原文

OPS 读取 staging.yaml 和 template.yaml，检查测试环境配置与模板的一致性，生成 config-diff.md。若存在差异，报告必须逐项列出；若不存在差异，报告必须明确写明无差异。不得同步或覆盖任何配置文件。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- config-diff.md [RESOLVED]
  - 对象=config-diff.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:70f1f16b6d8cca6d7c5d62dd","kind":"ITEM","entity_node_id":"p1:c4285882de9d9a03b66e8bca","source_span_ids":["p1:6776a989c5db6c8241f37899","p1:12819af19a35ba08b123154a"],"relation_ids":["p1:d36d3d5043925b28fd40694d"]}；数量=null
  - 证据：[52,54) undefined；[52,69) undefined；[55,69) undefined

### A · UNRESOLVED

- REQUIRED 检查 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[36,38) undefined；[36,51) undefined
- REQUIRED 生成 config-diff.md [RESOLVED]
  - 对象=config-diff.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:70f1f16b6d8cca6d7c5d62dd","kind":"ITEM","entity_node_id":"p1:c4285882de9d9a03b66e8bca","source_span_ids":["p1:6776a989c5db6c8241f37899","p1:12819af19a35ba08b123154a"],"relation_ids":["p1:d36d3d5043925b28fd40694d"]}；数量=null
  - 证据：[52,54) undefined；[52,69) undefined；[55,69) undefined
- REQUIRED 列出 [UNRESOLVED]
  - 对象=；主体=；角色=；条件={"expr_id":"p1:68ad22f5094ce41423d9cd06","op":"STATE_REF","state_node_id":"p1:829ce11ca7bb077273d47ec7","source_span_ids":["p1:8430e34d5669bef1d97e7335"],"relation_ids":[]}；作用域=null；数量=null
  - 证据：[82,84) undefined；[76,84) undefined；[70,75) undefined
- REQUIRED 写明 [UNRESOLVED]
  - 对象=；主体=；角色=；条件={"expr_id":"p1:f24a364dca044426edc42569","op":"NOT","operand_expr_id":"p1:18fedd5e34dadde56ce979eb","source_span_ids":["p1:b8e407d647542c33a14e3004"],"relation_ids":[]}；作用域=null；数量=null
  - 证据：[98,100) undefined；[92,103) undefined；[85,91) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 同步 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[106,108) undefined；[104,117) undefined
- FORBIDDEN 覆盖 任何配置文件 [RESOLVED]
  - 对象=任何配置文件；主体=；角色=；条件=null；作用域={"expr_id":"p1:a272175a62091180408b8b8d","kind":"ITEM","entity_node_id":"p1:432b63f3e851664964e2afd2","source_span_ids":["p1:3113263ec8cb9f5156e56f4f","p1:10ce3baaa0a8843971cb61b9"],"relation_ids":["p1:1932594dfb58677224909060"]}；数量=null
  - 证据：[109,111) undefined；[104,117) undefined；[111,117) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Coordination lacks a complete dependency member set
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
