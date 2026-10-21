# BoundaryXP 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — RESOLVED
- [ACCEPTED] 检查：输入/受检对象=a.csv；必须（bf:c5b69eaf448c88914822）
- [ACCEPTED] 读取：输入/受检对象=b.csv；允许（bf:95e0e95c6089fe524633）

## O 交付与结果 — ABSENT

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 检查；执行者=PM；输入/受检对象=a.csv（bf:bb5c11bffa9fb3e0a57d）
- [ACCEPTED] 允许 读取；执行者=PM；输入/受检对象=b.csv（bf:d556913e391776515400）

## P 参与关系 — RESOLVED
- [ACCEPTED] 检查：执行者=PM；必须（bf:50302cf68fb1a28875c7）
- [ACCEPTED] 读取：执行者=PM；允许（bf:c31953f792cc845ebf9a）

## R 执行量化限制 — ABSENT

## V 版本与依据 — ABSENT

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 重启；执行者=PM；对象=服务（bf:7cd0c8df539dc47637bf）

## 产物关联与可用性依赖（不等于事件强顺序）

## 未指定 / 歧义 / 未投影语义
- [ACCEPTED] ROLE；事件=重启 [e_restart]；执行者=PM；对象=服务；执行者=PM（bf:d653a5a62b6657e47d1c）
- [ACCEPTED] ROLE；事件=重启 [e_restart]；执行者=PM；对象=服务；对象=服务（bf:25dd204f05c0e2d268e2）

