# BoundX 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — RESOLVED
- [ACCEPTED] 检查：输入/受检对象=a.csv；必须（bf:c9e5d82b8b9dbc15afc0）
- [ACCEPTED] 读取：输入/受检对象=b.csv；允许（bf:0518bdac2a8c904c4b63）

## O 交付与结果 — ABSENT

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 检查；执行者=PM；输入/受检对象=a.csv（bf:4f460cb765c183c48313）
- [ACCEPTED] 允许 读取；执行者=PM；输入/受检对象=b.csv（bf:23fd1cb516a12971b8b4）

## P 参与关系 — RESOLVED
- [ACCEPTED] 检查：执行者=PM；必须（bf:e1033e91164a2267b6a1）
- [ACCEPTED] 读取：执行者=PM；允许（bf:c0da92bc0eced8cac33b）

## R 执行量化限制 — ABSENT

## V 版本与依据 — ABSENT

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 重启；执行者=PM；对象=服务（bf:eb26b30a21898518eb55）

## 未指定 / 歧义 / 未投影语义
- [ACCEPTED] ROLE；事件=重启 [evt_restart]；执行者=PM；对象=服务；执行者=PM（bf:f71143ad8b148c1aa41e）
- [ACCEPTED] ROLE；事件=重启 [evt_restart]；执行者=PM；对象=服务；对象=服务（bf:3ca4ba5135dfcc448ddd）
