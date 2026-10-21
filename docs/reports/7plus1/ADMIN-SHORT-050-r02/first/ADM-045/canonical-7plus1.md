# ADM-045 完成条件析取

## 原文

QA 执行测试环境的连通性检查，生成 connection-review.md。主链路检查通过或备用链路检查通过时即可完成；两者都失败时停止检查并通知 PM。不得改变网络路由。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

无实际条目。

### O · PARSER_COVERAGE_FAILURE

- connection-review.md [RESOLVED]
  - 对象=connection-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:52faefc200bf2d0c9aa33580","kind":"ITEM","entity_node_id":"p1:d01164f224f6138bc3ce844c","source_span_ids":["p1:5f9faa4b41b0b4da29daf2d3","p1:1b309ffcb3fb779b9abd77f0"],"relation_ids":["p1:4cc0d2dbb0e674dfee474789"]}；数量=null
  - 证据：[16,18) undefined；[16,39) undefined；[19,39) undefined

### A · PARSER_COVERAGE_FAILURE

- REQUIRED 生成 connection-review.md [RESOLVED]
  - 对象=connection-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:52faefc200bf2d0c9aa33580","kind":"ITEM","entity_node_id":"p1:d01164f224f6138bc3ce844c","source_span_ids":["p1:5f9faa4b41b0b4da29daf2d3","p1:1b309ffcb3fb779b9abd77f0"],"relation_ids":["p1:4cc0d2dbb0e674dfee474789"]}；数量=null
  - 证据：[16,18) undefined；[16,39) undefined；[19,39) undefined

### P · PARSER_COVERAGE_FAILURE

无实际条目。

### R · PARSER_COVERAGE_FAILURE

无实际条目。

### V · PARSER_COVERAGE_FAILURE

无实际条目。

### C · UNRESOLVED

- 完成 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[59,61) undefined；[40,61) undefined
- 检查 [UNRESOLVED]
  - 对象=检查；主体=；角色=；条件=null；作用域={"expr_id":"p1:8371eef9cd3d20f09d7ee55f","kind":"ITEM","entity_node_id":"p1:7300a90828f24ffa472e45d5","source_span_ids":["p1:b13293f25b8a29f7822819b3","p1:7a27f29bc8a2b9f9131b6159"],"relation_ids":["p1:29ed60e81ac8bc5c13719de2"]}；数量=null
  - 证据：[68,70) undefined；[62,78) undefined；[70,72) undefined；[0,89) undefined

### B · PARSER_COVERAGE_FAILURE

- FORBIDDEN 改变 网络路由 [RESOLVED]
  - 对象=网络路由；主体=；角色=；条件=null；作用域={"expr_id":"p1:0bac919a2e631fd81462eb8d","kind":"ITEM","entity_node_id":"p1:9e757312cd3282ef5d2246cc","source_span_ids":["p1:2159d8d329613e1b07391a86","p1:4094b68662358bd5bc2c2f95"],"relation_ids":["p1:12636acc44b906dede6c66f2"]}；数量=null
  - 证据：[81,83) undefined；[79,87) undefined；[83,87) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Completion predicate has no explicit unique completion domain
- UNRESOLVED_RELATION: No supported native semantic construction for this clause

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
