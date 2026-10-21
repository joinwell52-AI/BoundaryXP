# ADM-011 代码差异检查

## 原文

DEV 以 commit 6ab9c21 为基线检查当前代码差异，生成 code-diff.md。必须列出新增接口及删除接口，不要求修复发现的问题。不得提交代码、合并分支或创建标签；PM 接收检查报告。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- code-diff.md [RESOLVED]
  - 对象=code-diff.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:2c35032b2bd5c65a160d3b37","kind":"ITEM","entity_node_id":"p1:6cb568864a1d5ab3a6ed7722","source_span_ids":["p1:19040ea010ecaebef3baf245","p1:8414e69c3afb1db2da7efeb2"],"relation_ids":["p1:252334b73035e2a1cb18559b"]}；数量=null
  - 证据：[33,35) undefined；[33,48) undefined；[36,48) undefined

### A · UNRESOLVED

- REQUIRED 生成 code-diff.md [RESOLVED]
  - 对象=code-diff.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:2c35032b2bd5c65a160d3b37","kind":"ITEM","entity_node_id":"p1:6cb568864a1d5ab3a6ed7722","source_span_ids":["p1:19040ea010ecaebef3baf245","p1:8414e69c3afb1db2da7efeb2"],"relation_ids":["p1:252334b73035e2a1cb18559b"]}；数量=null
  - 证据：[33,35) undefined；[33,48) undefined；[36,48) undefined
- REQUIRED 列出 接口 [RESOLVED]
  - 对象=接口；主体=；角色=；条件=null；作用域={"expr_id":"p1:4b1196fdf6f3c97249dfc461","kind":"ITEM","entity_node_id":"p1:9f8df47cf20013cedc72e9dc","source_span_ids":["p1:28352afe7cf0f13f9a9054ad","p1:17542de4e8ab5644ca2011af"],"relation_ids":["p1:f4c2a08c438f039624fa6c8f"]}；数量=null
  - 证据：[51,53) undefined；[49,62) undefined；[55,57) undefined
- REQUIRED 删除 接口 [RESOLVED]
  - 对象=接口；主体=；角色=；条件=null；作用域={"expr_id":"p1:d1d76c4b20c5489c881c5927","kind":"ITEM","entity_node_id":"p1:e3f1aeb6dc8ebef2388bbf19","source_span_ids":["p1:1838f74e64fbe437655f7b35","p1:17542de4e8ab5644ca2011af"],"relation_ids":["p1:7e72468cf6be0f609de08053"]}；数量=null
  - 证据：[58,60) undefined；[49,62) undefined；[60,62) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · RESOLVED

- 6ab9c21 [RESOLVED]
  - 对象=6ab9c21；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[13,20) undefined；[0,32) undefined；[0,102) undefined

### C · ABSENT

无实际条目。

### B · RESOLVED

- FORBIDDEN 提交 代码 [RESOLVED]
  - 对象=代码；主体=；角色=；条件=null；作用域={"expr_id":"p1:dfe8ad3e484da05ba9bf2869","kind":"ITEM","entity_node_id":"p1:08b4c4c9ae1a963c214759ea","source_span_ids":["p1:384eae88d8cb89ca51ca8477","p1:4e5c6cb205f4da28f5a65d2a"],"relation_ids":["p1:5b2fa5a34af6d9685aea229c"]}；数量=null
  - 证据：[76,78) undefined；[74,90) undefined；[78,80) undefined
- FORBIDDEN 创建 标签 [RESOLVED]
  - 对象=标签；主体=；角色=；条件=null；作用域={"expr_id":"p1:85aa08be2ac22bb3bafda464","kind":"ITEM","entity_node_id":"p1:21b0a3c9b870634e518113fe","source_span_ids":["p1:df6afe505d497251b6cdb80c","p1:4e5c6cb205f4da28f5a65d2a"],"relation_ids":["p1:e3019bc84b379c47bf97e291"]}；数量=null
  - 证据：[86,88) undefined；[74,90) undefined；[88,90) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
