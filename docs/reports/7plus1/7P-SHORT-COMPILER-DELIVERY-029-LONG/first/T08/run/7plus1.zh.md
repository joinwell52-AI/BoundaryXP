# BoundaryXP 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — ABSENT

## O 交付与结果 — RESOLVED
- [ACCEPTED] 生成：结果/交付=guide.md；必须（bf:45ccfba57030b18c1458）

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 生成；执行者=PM；结果/交付=guide.md（bf:48af5b6fb449ed5c7b2f）
- [ACCEPTED] 必须 写入；执行者=PM；对象=guide.md；内容=允许删除cache.db（bf:88a1422605290a23ad61）

## P 参与关系 — RESOLVED
- [ACCEPTED] 生成：执行者=PM；必须（bf:7680e796e6f878bca106）
- [ACCEPTED] 写入：执行者=PM；必须（bf:44dc6becc6bec3d51716）

## R 执行量化限制 — ABSENT

## V 版本与依据 — ABSENT

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 删除；对象=cache.db（bf:3e12f2bf79d889bd1e84）
- [ACCEPTED] 禁止 重启；对象=服务（bf:fb6b59803a8935c7c666）

## 未指定 / 歧义 / 未投影语义
- UNSPECIFIED 禁止针对本次工作，未明确具体执行者；不影响禁止本身。；影响=ev_forbidden_delete,ev_forbidden_restart
- UNSPECIFIED 未指定服务名称或具体实例。；影响=ent_service
