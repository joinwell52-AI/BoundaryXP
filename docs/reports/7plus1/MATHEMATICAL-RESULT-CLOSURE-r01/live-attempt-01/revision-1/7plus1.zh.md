# BoundX 7+1（有限技术接受，不是业务授权）

## I 输入与作用域 — UNRESOLVED
- [UNRESOLVED] 组织核查：输入/受检对象=app.yaml；必须；合计：本任务总耗时 ≥ 0 分钟；目标=组织核查；计数范围=根任务；合计：本任务总耗时 ≤ 30 分钟；目标=组织核查；计数范围=根任务（bf:9a2f761e3c8fea686cde）
- [UNRESOLVED] 组织核查：输入/受检对象=env.json；必须；合计：本任务总耗时 ≥ 0 分钟；目标=组织核查；计数范围=根任务；合计：本任务总耗时 ≤ 30 分钟；目标=组织核查；计数范围=根任务（bf:82ea5bf0760c9129136a）
- [ACCEPTED] 作用域  UNION(ITEM(app.yaml),ITEM(env.json))；目标=根任务（bf:a36d920d2782ce32e074）
- [ACCEPTED] 检查配置：输入/受检对象=app.yaml；必须（bf:227351f4b0becf1468ba）
- [ACCEPTED] 检查环境配置：输入/受检对象=env.json；必须（bf:2603d877cf0e2184d67d）

## O 交付与结果 — RESOLVED
- [ACCEPTED] 生成开发报告：产生结果=dev.md；必须（bf:6213e43c44e1d71b0644）
- [ACCEPTED] 提交开发报告：交付产物=dev.md；必须（bf:576f8e8ec510cefcc671）
- [ACCEPTED] 生成运维报告：产生结果=ops.md；必须（bf:fbf585d5112e653f6a26）
- [ACCEPTED] 提交运维报告：交付产物=ops.md；必须（bf:7eea7fb4d6f988c764e7）
- [ACCEPTED] 生成汇总报告：产生结果=summary.md；必须；必要前提  复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:94d7495856bab1bea23b）
- [ACCEPTED] 交付汇总报告：交付产物=summary.md；必须；必要前提  复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:64f189d9f8a12315727b）

## A 正向动作 — UNRESOLVED
- [UNRESOLVED] 必须 组织核查；组织者=PM；对象=本次核查；依据=《配置核查规程》v1.2；输入/受检对象=app.yaml；输入/受检对象=env.json；合计：本任务总耗时 ≥ 0 分钟；目标=组织核查；计数范围=根任务；合计：本任务总耗时 ≤ 30 分钟；目标=组织核查；计数范围=根任务（bf:f301c2f6a8fbfdee8ee0）
- [ACCEPTED] 必须 检查配置；执行者=DEV；输入/受检对象=app.yaml（bf:6042d73a36bca9235608）
- [ACCEPTED] 必须 生成开发报告；执行者=DEV；产生结果=dev.md（bf:5a5adb68c75ef34cb851）
- [ACCEPTED] 必须 提交开发报告；执行者=DEV；交付产物=dev.md；接收者=QA（bf:0308c0581be5ad3214a4）
- [ACCEPTED] 必须 检查环境配置；执行者=OPS；输入/受检对象=env.json（bf:3a1b17f3c6c737abaa4e）
- [ACCEPTED] 必须 生成运维报告；执行者=OPS；产生结果=ops.md（bf:2cca90eef1d4585177c9）
- [ACCEPTED] 必须 提交运维报告；执行者=OPS；交付产物=ops.md；接收者=QA（bf:13e79804388e1f8e90c4）
- [ACCEPTED] 必须 复核两份报告；复核者=QA；对象=dev.md；对象=ops.md；时间先后 之后 AND(提交完成(dev.md,QA)；所指事件=提交开发报告 [e4]；执行者=DEV；交付产物=dev.md；接收者=QA [POSITIVE;运行值UNKNOWN],提交完成(ops.md,QA)；所指事件=提交运维报告 [e7]；执行者=OPS；交付产物=ops.md；接收者=QA [POSITIVE;运行值UNKNOWN])（bf:469d5ef7ed48ad2d9382）
- [ACCEPTED] 必须 生成汇总报告；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告；必要前提  复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:fcc083602d101fedc1f0）
- [ACCEPTED] 必须 交付汇总报告；执行者=PM；交付产物=summary.md；接收者=ADMIN；必要前提  复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:b7b307c9daadff3ea313）
- [ACCEPTED] 必须 停止核查与汇总；执行者=PM；对象=本次核查；对象=本次汇总；充分触发  发现高危问题(高危问题) [POSITIVE;运行值UNKNOWN]（bf:36fd0982759cc2eebd8f）
- [ACCEPTED] 必须 汇报高危问题；执行者=PM；接收者=ADMIN；内容=高危问题（bf:3978f9aefab0eb32b779）
- [ACCEPTED] 作用域  立即执行限定：停止核查与汇总 [e11]；执行者=PM；对象=本次核查；对象=本次汇总；不得无故延迟；未指定数值期限 [运行值UNKNOWN]；目标=停止核查与汇总；充分触发  发现高危问题(高危问题) [POSITIVE;运行值UNKNOWN]（bf:06f12582d485b58db218）

## P 参与关系 — UNRESOLVED
- [UNRESOLVED] 组织核查：组织者=PM；必须；合计：本任务总耗时 ≥ 0 分钟；目标=组织核查；计数范围=根任务；合计：本任务总耗时 ≤ 30 分钟；目标=组织核查；计数范围=根任务（bf:daa80cfa49ecf60c6f62）
- [ACCEPTED] 检查配置：执行者=DEV；必须（bf:7a3d5d529e9e51878d59）
- [ACCEPTED] 生成开发报告：执行者=DEV；必须（bf:9949e562aa71bf29940a）
- [ACCEPTED] 提交开发报告：执行者=DEV；必须（bf:23ae063eaa9739ca8abb）
- [ACCEPTED] 提交开发报告：接收者=QA；必须（bf:c82d6c7005a9296084e0）
- [ACCEPTED] 检查环境配置：执行者=OPS；必须（bf:9dce9e9fb71db1ede780）
- [ACCEPTED] 生成运维报告：执行者=OPS；必须（bf:8710f08f8029339a856f）
- [ACCEPTED] 提交运维报告：执行者=OPS；必须（bf:8e39cc183c5c4d44f9e8）
- [ACCEPTED] 提交运维报告：接收者=QA；必须（bf:97bcd09bf06a44310b81）
- [ACCEPTED] 复核两份报告：复核者=QA；必须；时间先后 之后 AND(提交完成(dev.md,QA)；所指事件=提交开发报告 [e4]；执行者=DEV；交付产物=dev.md；接收者=QA [POSITIVE;运行值UNKNOWN],提交完成(ops.md,QA)；所指事件=提交运维报告 [e7]；执行者=OPS；交付产物=ops.md；接收者=QA [POSITIVE;运行值UNKNOWN])（bf:3fcbd848ddafca2aeff0）
- [ACCEPTED] 生成汇总报告：执行者=PM；必须；必要前提  复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:9c609bd13a9cf5b671e7）
- [ACCEPTED] 交付汇总报告：执行者=PM；必须；必要前提  复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:8dd07a62e26f2d257733）
- [ACCEPTED] 交付汇总报告：接收者=ADMIN；必须；必要前提  复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:22ce5068c27542536a29）
- [ACCEPTED] 停止核查与汇总：执行者=PM；必须；充分触发  发现高危问题(高危问题) [POSITIVE;运行值UNKNOWN]（bf:e7a246d793260d810dc4）
- [ACCEPTED] 汇报高危问题：执行者=PM；必须（bf:2e6528a15e05d4f28428）
- [ACCEPTED] 汇报高危问题：接收者=ADMIN；必须（bf:fe9f93790b1e799d1d28）

## R 执行量化限制 — PARSER_COVERAGE_FAILURE
- [UNRESOLVED] 组织核查：合计：本任务总耗时 ≥ 0 分钟；目标=组织核查；计数范围=根任务；合计：本任务总耗时 ≥ 0 分钟；目标=组织核查；计数范围=根任务；合计：本任务总耗时 ≤ 30 分钟；目标=组织核查；计数范围=根任务（bf:1239e1f7414748174f2c）
- [UNRESOLVED] 组织核查：合计：本任务总耗时 ≤ 30 分钟；目标=组织核查；计数范围=根任务；合计：本任务总耗时 ≥ 0 分钟；目标=组织核查；计数范围=根任务；合计：本任务总耗时 ≤ 30 分钟；目标=组织核查；计数范围=根任务（bf:520e6a439fcb6aeab41f）

## V 版本与依据 — UNRESOLVED
- [UNRESOLVED] 组织核查：依据=《配置核查规程》v1.2；必须；合计：本任务总耗时 ≥ 0 分钟；目标=组织核查；计数范围=根任务；合计：本任务总耗时 ≤ 30 分钟；目标=组织核查；计数范围=根任务（bf:07b20105a6d18dcbb92f）
- [ACCEPTED] 生成汇总报告：依据=两份报告；必须；必要前提  复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:8d02744fe148b5195662）

## C 完成与停止 — RESOLVED
- [ACCEPTED] 任务完成 充要条件 AND(AND(提交完成(dev.md,QA)；所指事件=提交开发报告 [e4]；执行者=DEV；交付产物=dev.md；接收者=QA [POSITIVE;运行值UNKNOWN],提交完成(ops.md,QA)；所指事件=提交运维报告 [e7]；执行者=OPS；交付产物=ops.md；接收者=QA [POSITIVE;运行值UNKNOWN]),复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN],交付完成(summary.md,ADMIN)；所指事件=交付汇总报告 [e10]；执行者=PM；交付产物=summary.md；接收者=ADMIN [POSITIVE;运行值UNKNOWN])；目标=根任务（bf:d29a92b4da687e86cc26）
- [ACCEPTED] 任务停止/升级 充分触发 发现高危问题(高危问题) [POSITIVE;运行值UNKNOWN]；目标=根任务（bf:f53e9026cb7b0533dddb）

## B 禁止与限制 — RESOLVED
- [ACCEPTED] 禁止 继续核查与汇总；对象=本次核查；对象=本次汇总；充分触发  处于停止期间(本次核查,本次汇总)；所指事件=停止核查与汇总 [e11]；执行者=PM；对象=本次核查；对象=本次汇总 [POSITIVE;运行值UNKNOWN]（bf:9c792609a81c705653cb）
- [ACCEPTED] 禁止 修改应用配置；对象=app.yaml（bf:64a9e2bf70dffb99e114）
- [ACCEPTED] 禁止 修改环境配置；对象=env.json（bf:319f7b0fe6b731f879b0）
- [ACCEPTED] 禁止 访问生产环境；对象=生产环境（bf:99fc65bde04156cf8bc7）

## 产物关联与可用性依赖（不等于事件强顺序）
- [ACCEPTED] 同身份产物 dev.md：生成开发报告 [e3]；执行者=DEV；产生结果=dev.md → 提交开发报告 [e4]；执行者=DEV；交付产物=dev.md；接收者=QA；仅关联，不推出版本可用或先后（ai:fd808c6cb9deae90ed0d）
- [ACCEPTED] 同身份产物 dev.md：生成开发报告 [e3]；执行者=DEV；产生结果=dev.md → 复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md；仅关联，不推出版本可用或先后（ai:89e6742741a11244ef31）
- [ACCEPTED] 同身份产物 dev.md：生成开发报告 [e3]；执行者=DEV；产生结果=dev.md → 生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告；仅关联，不推出版本可用或先后（ai:efeb0ca58352d583c71a）
- [ACCEPTED] 同身份产物 ops.md：生成运维报告 [e6]；执行者=OPS；产生结果=ops.md → 提交运维报告 [e7]；执行者=OPS；交付产物=ops.md；接收者=QA；仅关联，不推出版本可用或先后（ai:89ee912b76bcbbfb2bfb）
- [ACCEPTED] 同身份产物 ops.md：生成运维报告 [e6]；执行者=OPS；产生结果=ops.md → 复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md；仅关联，不推出版本可用或先后（ai:1addac73dd0c46625fd5）
- [ACCEPTED] 同身份产物 ops.md：生成运维报告 [e6]；执行者=OPS；产生结果=ops.md → 生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告；仅关联，不推出版本可用或先后（ai:0514502c8cad90d6d07f）
- [ACCEPTED] 同身份产物 summary.md：生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告 → 交付汇总报告 [e10]；执行者=PM；交付产物=summary.md；接收者=ADMIN；仅关联，不推出版本可用或先后（ai:5f11daba338833a642c2）
- [ACCEPTED] 产物可用性 dev.md：本次生成开发报告 [e3]；执行者=DEV；产生结果=dev.md结果 → 提交开发报告 [e4]；执行者=DEV；交付产物=dev.md；接收者=QA用途；所使用部分可用；保留生产=必须 / 使用=必须；实际可用UNKNOWN，不推出整项生产完成或审批（ad:b3ef4bb1005811bed3a5）
- [ACCEPTED] 产物可用性 ops.md：本次生成运维报告 [e6]；执行者=OPS；产生结果=ops.md结果 → 提交运维报告 [e7]；执行者=OPS；交付产物=ops.md；接收者=QA用途；所使用部分可用；保留生产=必须 / 使用=必须；实际可用UNKNOWN，不推出整项生产完成或审批（ad:1bb667a33d0e44c4fd3d）
- [ACCEPTED] 产物可用性 dev.md：本次生成开发报告 [e3]；执行者=DEV；产生结果=dev.md结果 → 复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md用途；所使用部分可用；保留生产=必须 / 使用=必须；实际可用UNKNOWN，不推出整项生产完成或审批（ad:b73af7bdea396e1ca9fc）
- [ACCEPTED] 产物可用性 ops.md：本次生成运维报告 [e6]；执行者=OPS；产生结果=ops.md结果 → 复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md用途；所使用部分可用；保留生产=必须 / 使用=必须；实际可用UNKNOWN，不推出整项生产完成或审批（ad:9d2ac9e043717ee1ecfe）
- [ACCEPTED] 产物可用性 dev.md：本次生成开发报告 [e3]；执行者=DEV；产生结果=dev.md结果 → 生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告用途；所使用部分可用；保留生产=必须 / 使用=必须；实际可用UNKNOWN，不推出整项生产完成或审批（ad:bdb1a9c4dfca396ddd39）
- [ACCEPTED] 产物可用性 ops.md：本次生成运维报告 [e6]；执行者=OPS；产生结果=ops.md结果 → 生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告用途；所使用部分可用；保留生产=必须 / 使用=必须；实际可用UNKNOWN，不推出整项生产完成或审批（ad:bbdac5862aefe220db0d）
- [ACCEPTED] 产物可用性 summary.md：本次生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告结果 → 交付汇总报告 [e10]；执行者=PM；交付产物=summary.md；接收者=ADMIN用途；所使用部分可用；保留生产=必须 / 使用=必须；实际可用UNKNOWN，不推出整项生产完成或审批（ad:7acaa3dd291eb8dc4dcc）

## 未指定 / 歧义 / 未投影语义
- COVERAGE_GAP 原文限制根任务总耗时，合同要求执行量目标为事件；组织核查不能代表包含汇总等工作的根任务。当前目标绑定不忠实，须保留此缺口。；影响=c43,c44,e1
- COVERAGE_GAP 30分钟上界同样缺少忠实的根任务执行量目标。；影响=c44,e1
- [UNRESOLVED] ROLE；事件=组织核查 [e1]；组织者=PM；对象=本次核查；依据=《配置核查规程》v1.2；输入/受检对象=app.yaml；输入/受检对象=env.json；对象=本次核查（bf:b08f99ec9cffaaddd363）
- [ACCEPTED] SCOPE；事件=根任务；属性约束：本任务全部操作.执行环境 EQ "测试环境" [运行值UNKNOWN]（bf:27c7eae872b656088eeb）
- [ACCEPTED] ARTIFACT_USE；事件=提交开发报告 [e4]；执行者=DEV；交付产物=dev.md；接收者=QA（bf:b13e27b823ae97a44176）
- [ACCEPTED] ARTIFACT_USE；事件=提交运维报告 [e7]；执行者=OPS；交付产物=ops.md；接收者=QA（bf:50ac416179ca9042ff23）
- [ACCEPTED] ROLE；事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md；对象=dev.md（bf:61d8e0089a317f2ab9fc）
- [ACCEPTED] ROLE；事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md；对象=ops.md（bf:928b8576424c1d6ace5e）
- [ACCEPTED] ARTIFACT_USE；事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md（bf:154d1105c750a04cdc70）
- [ACCEPTED] ARTIFACT_USE；事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md（bf:c5e06195da2b480590af）
- [ACCEPTED] TEMPORAL；事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md；AND(提交完成(dev.md,QA)；所指事件=提交开发报告 [e4]；执行者=DEV；交付产物=dev.md；接收者=QA [POSITIVE;运行值UNKNOWN],提交完成(ops.md,QA)；所指事件=提交运维报告 [e7]；执行者=OPS；交付产物=ops.md；接收者=QA [POSITIVE;运行值UNKNOWN])（bf:fdb72c6bdff20fb19364）
- [ACCEPTED] ROLE；事件=生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告；对象=dev.md（bf:65c367cc6bcee7bddcae）
- [ACCEPTED] ROLE；事件=生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告；对象=ops.md（bf:fb5d3861a411796fd527）
- [ACCEPTED] ARTIFACT_USE；事件=生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告（bf:fc12fbab2e8fa3716d01）
- [ACCEPTED] ARTIFACT_USE；事件=生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告（bf:ae78f716c0a324c603c8）
- [ACCEPTED] ARTIFACT_USE；事件=交付汇总报告 [e10]；执行者=PM；交付产物=summary.md；接收者=ADMIN（bf:a67fbb65f42c72197af6）
- [ACCEPTED] CONDITION；事件=生成汇总报告 [e9]；执行者=PM；产生结果=summary.md；对象=dev.md；对象=ops.md；依据=两份报告；复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:2e2ceb573c1d0e346055）
- [ACCEPTED] CONDITION；事件=交付汇总报告 [e10]；执行者=PM；交付产物=summary.md；接收者=ADMIN；复核通过(QA,dev.md,ops.md)；所指事件=复核两份报告 [e8]；复核者=QA；对象=dev.md；对象=ops.md [POSITIVE;运行值UNKNOWN]（bf:6c795b96a7e81b379d67）
- [ACCEPTED] ROLE；事件=停止核查与汇总 [e11]；执行者=PM；对象=本次核查；对象=本次汇总；对象=本次核查（bf:49ecb00568e2540e9e1e）
- [ACCEPTED] ROLE；事件=停止核查与汇总 [e11]；执行者=PM；对象=本次核查；对象=本次汇总；对象=本次汇总（bf:51a260b53dec8f8f6cb3）
- [ACCEPTED] CONDITION；事件=停止核查与汇总 [e11]；执行者=PM；对象=本次核查；对象=本次汇总；发现高危问题(高危问题) [POSITIVE;运行值UNKNOWN]（bf:fbb3ac137d585b69e103）
- [ACCEPTED] ROLE；事件=汇报高危问题 [e12]；执行者=PM；接收者=ADMIN；内容=高危问题；内容=高危问题（bf:fba7acce50710d3bdb2b）
- [ACCEPTED] ROLE；事件=继续核查与汇总 [e13]；对象=本次核查；对象=本次汇总；对象=本次核查（bf:f6709ecca55cffaded57）
- [ACCEPTED] ROLE；事件=继续核查与汇总 [e13]；对象=本次核查；对象=本次汇总；对象=本次汇总（bf:f81d30c119f3a5088335）
- [ACCEPTED] CONDITION；事件=继续核查与汇总 [e13]；对象=本次核查；对象=本次汇总；处于停止期间(本次核查,本次汇总)；所指事件=停止核查与汇总 [e11]；执行者=PM；对象=本次核查；对象=本次汇总 [POSITIVE;运行值UNKNOWN]（bf:c495359331bb9f2e1aaf）
- [ACCEPTED] ROLE；事件=修改应用配置 [e14]；对象=app.yaml；对象=app.yaml（bf:9fa21491a106d9e94055）
- [ACCEPTED] ROLE；事件=修改环境配置 [e15]；对象=env.json；对象=env.json（bf:7f05ae2cb2d5c9f38c0f）
- [ACCEPTED] ROLE；事件=访问生产环境 [e16]；对象=生产环境；对象=生产环境（bf:ad9ce599724d4b372950）
- [ACCEPTED] ARTIFACT_AVAILABILITY；事件=根任务（bf:099817bdc406704dbd65）
- [ACCEPTED] ARTIFACT_AVAILABILITY；事件=根任务（bf:73fa1f66061b116b8636）
- [ACCEPTED] ARTIFACT_AVAILABILITY；事件=根任务（bf:ad79da624f64b08768b9）
- [ACCEPTED] ARTIFACT_AVAILABILITY；事件=根任务（bf:adc1a38e737dbdd33ce5）
- [ACCEPTED] ARTIFACT_AVAILABILITY；事件=根任务（bf:1a4fa3dd37bb5fd49a87）
- [ACCEPTED] ARTIFACT_AVAILABILITY；事件=根任务（bf:91f6b5c75d5669bc830b）
- [ACCEPTED] ARTIFACT_AVAILABILITY；事件=根任务（bf:3d91e30cc46b735535c5）
- 覆盖缺口：原文限制根任务总耗时，合同要求执行量目标为事件；组织核查不能代表包含汇总等工作的根任务。当前目标绑定不忠实，须保留此缺口。
- 覆盖缺口：30分钟上界同样缺少忠实的根任务执行量目标。
- 覆盖缺口：缺少覆盖本任务全部工作的耗时目标，因而0至30分钟含两端的总耗时限制尚不能忠实消费；候选已标记此缺口。
- 覆盖缺口：coverage:15
- 覆盖缺口：GTE 0与LTE 30分钟正确，但目标错误，未忠实约束整个任务总耗时。
