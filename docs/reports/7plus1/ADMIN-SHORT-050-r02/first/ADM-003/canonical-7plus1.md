# ADM-003 MCP 权限审计

## 原文

OPS 读取 mcp-config.json，检查已启用 MCP 工具的访问权限；PM 负责协调本次审计。OPS 必须生成 mcp-access.md，并交给 QA 复核。不得调用被审计的工具，也不得改动 mcp-config.json。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

- 本次审计 [RESOLVED]
  - 对象=本次审计；主体=；角色=；条件=null；作用域={"expr_id":"p1:6cb1af9c8d5aa5da4e49728f","kind":"ITEM","entity_node_id":"p1:c585930871d537ed80e17061","source_span_ids":["p1:5fc2b1fe6ac773fb541ecc16","p1:46728915b453883020718db0"],"relation_ids":["p1:4eea7fa05fb0f32e747cea39"]}；数量=null
  - 证据：[48,52) undefined；[41,52) undefined；[0,120) undefined

### O · PARSER_COVERAGE_FAILURE

- mcp-access.md [RESOLVED]
  - 对象=mcp-access.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:887402970f8c9cc1cd2dd3a5","kind":"ITEM","entity_node_id":"p1:ddd2ddfa7feb623d451edd5b","source_span_ids":["p1:51210d1a663b4637de90254b","p1:00b02c0fb408dcec5fb3057b"],"relation_ids":["p1:e056bddc71012f85fe8bd006"]}；数量=null
  - 证据：[59,61) undefined；[53,75) undefined；[62,75) undefined

### A · UNRESOLVED

- REQUIRED 协调 本次审计 [RESOLVED]
  - 对象=本次审计；主体=；角色=；条件=null；作用域={"expr_id":"p1:b09988227f60912c5c14239f","kind":"ITEM","entity_node_id":"p1:c585930871d537ed80e17061","source_span_ids":["p1:5fc2b1fe6ac773fb541ecc16","p1:46728915b453883020718db0"],"relation_ids":["p1:3ca95446d8f04310e652355e"]}；数量=null
  - 证据：[46,48) undefined；[41,52) undefined；[48,52) undefined
- REQUIRED 生成 mcp-access.md [RESOLVED]
  - 对象=mcp-access.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:887402970f8c9cc1cd2dd3a5","kind":"ITEM","entity_node_id":"p1:ddd2ddfa7feb623d451edd5b","source_span_ids":["p1:51210d1a663b4637de90254b","p1:00b02c0fb408dcec5fb3057b"],"relation_ids":["p1:e056bddc71012f85fe8bd006"]}；数量=null
  - 证据：[59,61) undefined；[53,75) undefined；[62,75) undefined
- REQUIRED 交给 QA [RESOLVED]
  - 对象=QA；主体=；角色=；条件=null；作用域={"expr_id":"p1:e535766e258562569d3e64da","kind":"ITEM","entity_node_id":"p1:3f9f88e55e2ea1bee7bde588","source_span_ids":["p1:a6fbfb83d4ad0fd123303bd9","p1:d1964e1639a8b7fed324370b"],"relation_ids":["p1:f47d0359474a8281322d3e87"]}；数量=null
  - 证据：[77,79) undefined；[76,85) undefined；[80,82) undefined
- REQUIRED 复核 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[83,85) undefined；[76,85) undefined

### P · PARSER_COVERAGE_FAILURE

无实际条目。

### R · PARSER_COVERAGE_FAILURE

无实际条目。

### V · PARSER_COVERAGE_FAILURE

无实际条目。

### C · PARSER_COVERAGE_FAILURE

无实际条目。

### B · PARSER_COVERAGE_FAILURE

- FORBIDDEN 调用 工具 [RESOLVED]
  - 对象=工具；主体=；角色=；条件=null；作用域={"expr_id":"p1:fe139815f6e91a3ed5e90181","kind":"ITEM","entity_node_id":"p1:b73524a29779adcc2b10e32c","source_span_ids":["p1:641be32592f4068744d3cd97","p1:f7fe77ae058928547dcc350c"],"relation_ids":["p1:6ccf4acbac24459ee655a29e"]}；数量=null
  - 证据：[88,90) undefined；[86,96) undefined；[94,96) undefined
- FORBIDDEN 改动 mcp-config.json [RESOLVED]
  - 对象=mcp-config.json；主体=；角色=；条件=null；作用域={"expr_id":"p1:9f88968746e08f4f8d578fb6","kind":"ITEM","entity_node_id":"p1:e90eb2894d1659e89ffb627a","source_span_ids":["p1:d133489c756b86dad4ab3a14","p1:57ff33403f80f04e881de122"],"relation_ids":["p1:831c703f29703f0fa3e5733d"]}；数量=null
  - 证据：[100,102) undefined；[97,118) undefined；[103,118) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No supported native semantic construction for this clause
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
