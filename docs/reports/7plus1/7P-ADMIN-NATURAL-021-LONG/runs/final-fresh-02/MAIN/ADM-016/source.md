DEV 读取 schema.sql，依据 DB-SPEC-9 检查索引与约束声明，生成 schema-review.md。只允许离线分析，不得连接生产数据库。QA 确认索引和约束两类检查都完成后，任务结束。
