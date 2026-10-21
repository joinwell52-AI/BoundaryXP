# ADM-026 模型配置核验

## 原文

DEV 读取 model-config.json，核查模型路径、精度设置和设备配置，生成 model-config-review.md。不得加载模型权重或发起推理。PM 安排 QA 复核报告；整个任务最多使用 20 分钟。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

无实际条目。

### O · PARSER_COVERAGE_FAILURE

- model-config-review.md [RESOLVED]
  - 对象=model-config-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:5a0a0319696f39778947825d","kind":"ITEM","entity_node_id":"p1:ece478a1f776f10ce57136f9","source_span_ids":["p1:3a107309c64a4d9d48c1e45c","p1:f275cba26c9805e968f92ad9"],"relation_ids":["p1:279bb4061e472e23cbaac512"]}；数量=null
  - 证据：[42,44) undefined；[42,67) undefined；[45,67) undefined

### A · PARSER_COVERAGE_FAILURE

- REQUIRED 生成 model-config-review.md [RESOLVED]
  - 对象=model-config-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:5a0a0319696f39778947825d","kind":"ITEM","entity_node_id":"p1:ece478a1f776f10ce57136f9","source_span_ids":["p1:3a107309c64a4d9d48c1e45c","p1:f275cba26c9805e968f92ad9"],"relation_ids":["p1:279bb4061e472e23cbaac512"]}；数量=null
  - 证据：[42,44) undefined；[42,67) undefined；[45,67) undefined

### P · PARSER_COVERAGE_FAILURE

无实际条目。

### R · PARSER_COVERAGE_FAILURE

- 20 [RESOLVED]
  - 对象=20；主体=；角色=；条件=null；作用域=null；数量={"expr_id":"p1:ec8ff2ae2cd1473bc443d230","metric":"TIME","target_node_ids":["p1:56bc4ae119625d44a7e02178"],"upper_bound":{"inclusive":true,"value":20},"unit":"分钟","value_node_ids":["p1:a6a153b1d97666dd2e711456"],"source_span_ids":["p1:a4ee1e59cfb638bbab5cc437","p1:01afffde666dd4d7ff3434e2","p1:6839d1a454447e6af9f958ac"],"relation_ids":["p1:1cd075cab406ebebe9ab733f"]}
  - 证据：[102,104) undefined；[96,110) undefined；[105,107) undefined

### V · PARSER_COVERAGE_FAILURE

无实际条目。

### C · PARSER_COVERAGE_FAILURE

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 加载 模型权重 [RESOLVED]
  - 对象=模型权重；主体=；角色=；条件=null；作用域={"expr_id":"p1:8d984ec38d33921665d1ab11","kind":"ITEM","entity_node_id":"p1:5f2aca7b1302a822a713f26b","source_span_ids":["p1:f496be08cc89aec08b53c6be","p1:29d4309b50b44c221464ba14"],"relation_ids":["p1:3deebf1a0c5bd5242671f3f1"]}；数量=null
  - 证据：[70,72) undefined；[68,81) undefined；[72,76) undefined
- FORBIDDEN 推理 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[79,81) undefined；[68,81) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_RELATION: No supported native semantic construction for this clause

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
