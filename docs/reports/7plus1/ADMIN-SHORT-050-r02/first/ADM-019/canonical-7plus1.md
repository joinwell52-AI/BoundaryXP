# ADM-019 测试覆盖核查

## 原文

QA 读取 coverage.json，检查支付模块的分支覆盖率，生成 coverage-review.md。低于 85% 的文件应列入报告。此次不新增测试，也不修改阈值；报告提交给 PM 即完成。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

无实际条目。

### O · PARSER_COVERAGE_FAILURE

- coverage-review.md [RESOLVED]
  - 对象=coverage-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:975ccfbc599f55a157b1482a","kind":"ITEM","entity_node_id":"p1:815870c05e5de6d52761c084","source_span_ids":["p1:689768fe221ee3edf38a6076","p1:4c5fd598adfc5e6a11189999"],"relation_ids":["p1:8d0cfc0df0571dcfe68d30dc"]}；数量=null
  - 证据：[33,35) undefined；[33,54) undefined；[36,54) undefined

### A · PARSER_COVERAGE_FAILURE

- REQUIRED 检查 分支覆盖率 [RESOLVED]
  - 对象=分支覆盖率；主体=；角色=；条件=null；作用域={"expr_id":"p1:1f8fe4335a7099e1779cb883","kind":"ITEM","entity_node_id":"p1:89349df7af06f6a02642bb99","source_span_ids":["p1:d16210804e9a8d877e83659a","p1:fc612aa39f013cf99fd41da7"],"relation_ids":["p1:12914634e6ab32bbe6ab9f2f"]}；数量=null
  - 证据：[20,22) undefined；[20,32) undefined；[27,32) undefined
- REQUIRED 生成 coverage-review.md [RESOLVED]
  - 对象=coverage-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:975ccfbc599f55a157b1482a","kind":"ITEM","entity_node_id":"p1:815870c05e5de6d52761c084","source_span_ids":["p1:689768fe221ee3edf38a6076","p1:4c5fd598adfc5e6a11189999"],"relation_ids":["p1:8d0cfc0df0571dcfe68d30dc"]}；数量=null
  - 证据：[33,35) undefined；[33,54) undefined；[36,54) undefined
- REQUIRED 列入 报告 [RESOLVED]
  - 对象=报告；主体=；角色=；条件=null；作用域={"expr_id":"p1:84023bce54c418428ee65f9e","kind":"ITEM","entity_node_id":"p1:43285cd917ad84061d947108","source_span_ids":["p1:166d38a82f6bcdc0b2b9bcf2","p1:31e01f0b8d3facb19cec63dc"],"relation_ids":["p1:39624680afa26bc7fbdc0231"]}；数量={"expr_id":"p1:264514d9eaff799cfaa7f30a","metric":"PERCENT","target_node_ids":["p1:d5dc29e42f91c2f7531b883c"],"upper_bound":{"inclusive":false,"value":85},"unit":"%","value_node_ids":["p1:04076d8578b0d92027dff1dd"],"source_span_ids":["p1:31e01f0b8d3facb19cec63dc","p1:26b2830b08c221a9083bf300","p1:ed1bdea8572379d0f7624e57"],"relation_ids":["p1:c017bee79de6916ed418f547"]}
  - 证据：[66,68) undefined；[55,70) undefined；[68,70) undefined；[58,60) undefined

### P · PARSER_COVERAGE_FAILURE

无实际条目。

### R · PARSER_COVERAGE_FAILURE

无实际条目。

### V · PARSER_COVERAGE_FAILURE

无实际条目。

### C · PARSER_COVERAGE_FAILURE

无实际条目。

### B · PARSER_COVERAGE_FAILURE

无实际条目。

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_COREFERENCE: Transfer object lacks one explicit coordinated result
- UNRESOLVED_RELATION: No supported native semantic construction for this clause

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
