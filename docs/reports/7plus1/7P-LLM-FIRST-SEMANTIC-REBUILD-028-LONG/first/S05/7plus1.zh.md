# BoundX 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — RESOLVED
- [ACCEPTED] 检查：INPUT_OBJECT=a.csv；必须（bf:473541a6c10ca9868ede）

## O 交付与结果 — ABSENT

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 检查；PERFORMER=PM；INPUT_OBJECT=a.csv（bf:ec95564413f66331e549）

## P 参与关系 — RESOLVED
- [ACCEPTED] 检查：PERFORMER=PM；必须（bf:d81ae1515ffcf5a4b9d5）

## R 执行量化限制 — ABSENT

## V 版本与依据 — ABSENT

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 删除；OBJECT=a.csv（bf:92256a9e8b5470779580）

## 未指定 / 歧义 / 未投影语义
- UNSPECIFIED 两项限制未单独明确执行者，不将检查事件中的PM自动绑定到其他事件。；影响=evt_restart,evt_delete
- 无需 重启（不等于禁止）
