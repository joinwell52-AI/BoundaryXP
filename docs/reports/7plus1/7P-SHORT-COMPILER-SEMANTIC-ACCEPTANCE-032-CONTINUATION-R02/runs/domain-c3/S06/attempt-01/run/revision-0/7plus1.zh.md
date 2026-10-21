# BoundaryXP 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — RESOLVED
- [ACCEPTED] 检查：输入/受检对象=a.csv；必须；对象范围=具体对象(a.csv)（bf:22ef8724d2941b69cc0e）
- [ACCEPTED] 作用域  具体对象(a.csv)；目标=a.csv（bf:0b5fdf18a582c3f22a38）
- [ACCEPTED] 读取：输入/受检对象=b.csv；允许；对象范围=具体对象(b.csv)（bf:9b8865018f086129d98b）
- [ACCEPTED] 作用域  具体对象(b.csv)；目标=b.csv（bf:e129a36411ceb7ad4824）

## O 交付与结果 — ABSENT

## A 正向动作 — RESOLVED
- [ACCEPTED] 必须 检查；执行者=PM；输入/受检对象=a.csv；对象范围=具体对象(a.csv)（bf:2edea9994d10666fe7c7）
- [ACCEPTED] 允许 读取；执行者=PM；输入/受检对象=b.csv；对象范围=具体对象(b.csv)（bf:517383ca36394d889df2）

## P 参与关系 — RESOLVED
- [ACCEPTED] 检查：执行者=PM；必须（bf:a96b4b1546a7f63bcc85）
- [ACCEPTED] 读取：执行者=PM；允许（bf:cb30812a3e5f00f34429）

## R 执行量化限制 — ABSENT

## V 版本与依据 — ABSENT

## C 完成与停止 — ABSENT

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 重启；执行者=PM；对象=服务；对象范围=类别范围(服务；适用范围=未限定容器：本任务类别域)（bf:b169bfcc903291b81433）
- [ACCEPTED] 作用域  类别范围(服务；适用范围=未限定容器：本任务类别域)；目标=服务（bf:2aa9013cd35a365700f3）

## 产物关联与可用性依赖（不等于事件强顺序）

## 未指定 / 歧义 / 未投影语义
- [ACCEPTED] ROLE；事件=重启 [ev_restart]；执行者=PM；对象=服务；执行者=PM（bf:871d8b9fa4d17eab38e3）
- [ACCEPTED] ROLE；事件=重启 [ev_restart]；执行者=PM；对象=服务；对象=服务；对象范围=类别范围(服务；适用范围=未限定容器：本任务类别域)（bf:5ad8d1e3f58e022e604e）
