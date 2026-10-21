# BoundX 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — RESOLVED
- [ACCEPTED] 比较配置：输入/受检对象=当前配置；必须（bf:b9cbc2d691247ba8c584）

## O 交付与结果 — RESOLVED
- [ACCEPTED] 生成差异文件：产生结果=diff.md；必须（bf:40f45802ffa18ab62a01）

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 比较配置；执行者=PM；输入/受检对象=当前配置；依据=commit 7ac921e（bf:3a1edd9dda81d56cce64）
- [ACCEPTED] 必须 生成差异文件；执行者=PM；产生结果=diff.md（bf:7a6482e6013b00be7fc8）

## P 参与关系 — RESOLVED
- [ACCEPTED] 比较配置：执行者=PM；必须（bf:4a951e83d2e35be393d9）
- [ACCEPTED] 生成差异文件：执行者=PM；必须（bf:22fd07d0371be85091bc）

## R 执行量化限制 — ABSENT

## V 版本与依据 — RESOLVED
- [ACCEPTED] 比较配置：依据=commit 7ac921e；必须（bf:48ec982aaf0f11d7a4e5）

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 切换工作区提交；执行者=PM；对象=当前工作区的commit（bf:71219f7d0f7920c9e3a1）

## 未指定 / 歧义 / 未投影语义
- [ACCEPTED] ROLE；事件=切换工作区提交 [ev_switch]；执行者=PM；对象=当前工作区的commit；执行者=PM（bf:ff8d15876c9e15779cf9）
- [ACCEPTED] ROLE；事件=切换工作区提交 [ev_switch]；执行者=PM；对象=当前工作区的commit；对象=当前工作区的commit（bf:fe46b34f9ffd30a81a2c）
