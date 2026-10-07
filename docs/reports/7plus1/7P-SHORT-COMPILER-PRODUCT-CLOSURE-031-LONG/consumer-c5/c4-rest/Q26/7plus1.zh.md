# BoundX 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — RESOLVED
- [ACCEPTED] 检查：输入/受检对象=测试机A；必须（bf:a9129ef0b75a0a2a2554）
- [ACCEPTED] 检查：输入/受检对象=测试机C；必须（bf:56e604efeb880f209485）
- [ACCEPTED] 作用域  EXCEPT(UNION(ITEM(测试机A),ITEM(测试机B),ITEM(测试机C),ITEM(测试机D)),UNION(ITEM(测试机B),ITEM(测试机D)))；目标=检查（bf:8930e2e1c334cabb143a）

## O 交付与结果 — ABSENT

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 检查；执行者=PM；输入/受检对象=测试机A；输入/受检对象=测试机C（bf:053c1a81504d8903ffd1）

## P 参与关系 — RESOLVED
- [ACCEPTED] 检查：执行者=PM；必须（bf:d2fdfd6e3299db576f85）

## R 执行量化限制 — ABSENT

## V 版本与依据 — ABSENT

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 重启；执行者=PM；对象=任何测试机（bf:fa934192d475dbf83dc9）

## 未指定 / 歧义 / 未投影语义
- [ACCEPTED] ROLE；事件=重启 [evt_restart]；执行者=PM；对象=任何测试机；执行者=PM（bf:fdacea79cd94fb632b9b）
- [ACCEPTED] ROLE；事件=重启 [evt_restart]；执行者=PM；对象=任何测试机；对象=任何测试机（bf:cd2a0c545508baee9e45）
