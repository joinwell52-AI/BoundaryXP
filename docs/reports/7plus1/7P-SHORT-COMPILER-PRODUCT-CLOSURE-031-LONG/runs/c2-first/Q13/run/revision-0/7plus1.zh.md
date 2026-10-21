# BoundX 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — RESOLVED
- [ACCEPTED] 比较配置：输入/受检对象=当前配置；必须（bf:d7367d3db2d2e48ad70c）

## O 交付与结果 — RESOLVED
- [ACCEPTED] 生成差异文件：产生结果=diff.md；必须（bf:a21ee5e95fde1b1e9247）

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 比较配置；执行者=PM；输入/受检对象=当前配置；依据=commit 7ac921e（bf:6bdfc9c1b4df8aae3cc9）
- [ACCEPTED] 必须 生成差异文件；执行者=PM；产生结果=diff.md（bf:de7a9ae2b1158e5fb755）

## P 参与关系 — RESOLVED
- [ACCEPTED] 比较配置：执行者=PM；必须（bf:8b8e23a9d60808e1488a）
- [ACCEPTED] 生成差异文件：执行者=PM；必须（bf:c511e26c2eec1a8b2552）

## R 执行量化限制 — ABSENT

## V 版本与依据 — RESOLVED
- [ACCEPTED] 比较配置：依据=commit 7ac921e；必须（bf:cf442f221cf77cf4573c）

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 切换工作区提交；执行者=PM；对象=当前工作区的commit（bf:ec201084db3e3e4f240f）

## 未指定 / 歧义 / 未投影语义
- [ACCEPTED] ROLE；事件=切换工作区提交 [EV_SWITCH]；执行者=PM；对象=当前工作区的commit；执行者=PM（bf:437a05bcd6c823118ea9）
- [ACCEPTED] ROLE；事件=切换工作区提交 [EV_SWITCH]；执行者=PM；对象=当前工作区的commit；对象=当前工作区的commit（bf:5443e8037ee9a09d83e8）
