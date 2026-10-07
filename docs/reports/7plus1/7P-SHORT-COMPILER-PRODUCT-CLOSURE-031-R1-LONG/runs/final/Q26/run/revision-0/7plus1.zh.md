# BoundX 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — RESOLVED
- [ACCEPTED] 检查：输入/受检对象=测试机A；必须（bf:080f4e8d4eb958feafb0）
- [ACCEPTED] 检查：输入/受检对象=测试机C；必须（bf:9ba07edeb8f90269f8d2）
- [ACCEPTED] 作用域  EXCEPT(UNION(ITEM(测试机A),ITEM(测试机B),ITEM(测试机C),ITEM(测试机D)),UNION(ITEM(测试机B),ITEM(测试机D)))；目标=检查（bf:1e7add81b18cee4bba0b）

## O 交付与结果 — ABSENT

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 检查；执行者=PM；输入/受检对象=测试机A；输入/受检对象=测试机C（bf:b99c07ddd0fe1a6c1eb0）

## P 参与关系 — RESOLVED
- [ACCEPTED] 检查：执行者=PM；必须（bf:1383b9be9cf8ac076f30）

## R 执行量化限制 — ABSENT

## V 版本与依据 — ABSENT

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 重启；执行者=PM；对象=任何测试机（bf:5d9ea3f923ace5388a96）

## 产物关联与可用性依赖（不等于事件强顺序）

## 未指定 / 歧义 / 未投影语义
- [ACCEPTED] ROLE；事件=重启 [evt_restart]；执行者=PM；对象=任何测试机；执行者=PM（bf:a3e3f4f2f16841d9ae78）
- [ACCEPTED] ROLE；事件=重启 [evt_restart]；执行者=PM；对象=任何测试机；对象=任何测试机（bf:40f28f0c635372a196b6）
