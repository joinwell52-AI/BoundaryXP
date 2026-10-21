# ADM-010 发布前只读检查

## 原文

QA 依据 RELEASE-6 的 v3.0 版本读取 release.yaml 和 build.log，生成 release-check.md。PM 在 QA 提交报告后向 ADMIN 汇报。此次任务不执行发布，不得修改源码或发布配置。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- release-check.md [RESOLVED]
  - 对象=release-check.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:4ce8d7de4dd8104d234e9d1e","kind":"ITEM","entity_node_id":"p1:2ee9bd5ac9db1054337b5c57","source_span_ids":["p1:d869ca3e898446ba41845b2d","p1:6e7d65f199c1bbea6de9b212"],"relation_ids":["p1:ed9de0593ebf131b19809781"]}；数量=null
  - 证据：[53,55) undefined；[53,72) undefined；[56,72) undefined

### A · UNRESOLVED

- REQUIRED 生成 release-check.md [RESOLVED]
  - 对象=release-check.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:4ce8d7de4dd8104d234e9d1e","kind":"ITEM","entity_node_id":"p1:2ee9bd5ac9db1054337b5c57","source_span_ids":["p1:d869ca3e898446ba41845b2d","p1:6e7d65f199c1bbea6de9b212"],"relation_ids":["p1:ed9de0593ebf131b19809781"]}；数量=null
  - 证据：[53,55) undefined；[53,72) undefined；[56,72) undefined

### P · UNRESOLVED

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[88,93) undefined；[73,96) undefined；[94,96) undefined

### R · ABSENT

无实际条目。

### V · RESOLVED

- v3.0 [RESOLVED]
  - 对象=v3.0；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[18,22) undefined；[0,52) undefined；[0,120) undefined
- release.yaml [RESOLVED]
  - 对象=release.yaml；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[28,40) undefined；[0,52) undefined；[0,120) undefined

### C · ABSENT

无实际条目。

### B · RESOLVED

- FORBIDDEN 修改 发布配置 [RESOLVED]
  - 对象=发布配置；主体=；角色=；条件=null；作用域={"expr_id":"p1:a590c61492571028df6b6fa4","kind":"ITEM","entity_node_id":"p1:3c8a6db92ebf87109fc5ac3c","source_span_ids":["p1:75b0a7ecb23a51576f27e443","p1:16b0ddc99a69a63c61dd9a6c"],"relation_ids":["p1:8d14e42023074be23b1beac8"]}；数量=null
  - 证据：[109,111) undefined；[107,118) undefined；[114,118) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
