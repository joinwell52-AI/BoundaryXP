# BoundX 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — UNRESOLVED
- [ACCEPTED] 读取：输入/受检对象=a.csv；必须（bf:254bb1487dab130499a8）
- [ACCEPTED] 读取：输入/受检对象=b.csv；必须（bf:06cfe5194efa0913b9c0）
- [UNRESOLVED] 比较：输入/受检对象=该文件；必须（bf:9afab678a865197737c3）
- [ACCEPTED] 比较：输入/受检对象=c.csv；必须（bf:06ed0c9607d22a7de0b5）

## O 交付与结果 — ABSENT

## A 正向动作 — UNRESOLVED
- [UNRESOLVED] 必须 读取；执行者=PM；输入/受检对象=a.csv；输入/受检对象=b.csv（bf:a2f91d8edd188f688907）
- [UNRESOLVED] 必须 比较；执行者=PM；输入/受检对象=该文件；输入/受检对象=c.csv（bf:613379bac93114adde96）

## P 参与关系 — UNRESOLVED
- [UNRESOLVED] 读取：执行者=PM；必须（bf:2bf9a6c120def9155951）
- [UNRESOLVED] 比较：执行者=PM；必须（bf:e20f5485288bc991ee70）

## R 执行量化限制 — ABSENT

## V 版本与依据 — ABSENT

## C 完成与停止 — ABSENT

## B 禁止与限制 — ABSENT

## 未指定 / 歧义 / 未投影语义
- AMBIGUITY 两个文件均为合理先行项；歧义仅影响该文件在比较事件中的身份用途。；影响=ent_ref,cl_compare_ref
