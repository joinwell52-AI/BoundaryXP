# WP3 L2迁移与增量记录

新目录domain-packs/l2/software-ai/0.2.0保留原0.1.0目录及研究接口。新描述符精确依赖core-ontology@1.1.0摘要，资源不再依赖../../Schema路径；Schema身份由离线宿主注册。

| 数据 | 原数量 | 新数量 |
|---|---:|---:|
| 动作 | 107 | 122 |
| 实体 | 54 | 65 |
| 岗位 | 22 | 22 |
| 资源 | 30 | 34 |
| 依据 | 12 | 12 |
| 完成 | 10 | 15 |
| 风险 | 8 | 12 |

107个原动作逐ID/内容深相等回归通过。新增15个动作见fixtures/admin-text/l2-frame-cases.json；请求中的vector_index.search改为vector-index.search，原因是既有Frame ID语法不允许命名空间中的下划线；不修改既有Frame Schema以迁就新ID。

实体增加tool、session、context、document、lora-adapter、tokenizer、guardrail、ast、sbom、dependency-checksums、dependency-declaration；lockfile补Cargo.lock，go.sum与requirements.txt分到不同类型。

资源新增GPU卡数、节点数、输入/输出Token预算；完成新增lint、评测及三种不混同的安全扫描断言；风险增加4类但保持风险不自动转B、不授权。

120条新增fixture是15Frame×2语言×4类。当前执行的是词法候选检索和证据定位回归，不是实时模型抽取，不代表完整否定/歧义解释或跨入口验收已经通过。后续Producer/Assembler必须继续验证这些fixture的三态/模态及错误分层，不能用当前词法测试冒充全部WP3门禁。
