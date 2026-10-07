# BoundX 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — RESOLVED
- [ACCEPTED] 检查：INPUT_OBJECT=a.csv；必须（bf:c9e5d82b8b9dbc15afc0）
- [ACCEPTED] 读取：INPUT_OBJECT=b.csv；允许（bf:7caba190fae3fce39599）

## O 交付与结果 — ABSENT

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 检查；PERFORMER=PM；INPUT_OBJECT=a.csv（bf:775e289d75d1477c62fe）
- [ACCEPTED] 允许 读取；INPUT_OBJECT=b.csv（bf:3f2785144de2c1a0927f）

## P 参与关系 — RESOLVED
- [ACCEPTED] 检查：PERFORMER=PM；必须（bf:acb0498dcaab41636d38）

## R 执行量化限制 — ABSENT

## V 版本与依据 — ABSENT

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 重启；OBJECT=服务（bf:7f53028071080c6b12ed）

## 未指定 / 歧义 / 未投影语义
- UNSPECIFIED 未明确禁止所针对的执行者，不默认沿用检查动作的PM。；影响=evt_restart
- UNSPECIFIED 未明确读取动作的执行者，不默认沿用检查动作的PM。；影响=evt_read

