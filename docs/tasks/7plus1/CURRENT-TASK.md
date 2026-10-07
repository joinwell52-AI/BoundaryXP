# 当前 BoundX 7+1 任务

**当前任务：`7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG`；任务版本：r01，ADMIN已激活。**

当前任务书：`docs/tasks/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG.md`。
当前产品合同：`docs/tasks/7plus1/SHORT-COMPILER-PRODUCT-DELIVERY-CONTRACT.md`。
ADMIN启动与O口径确认：`docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG/AUTHORIZATION.md`。

2026-10-07用户明确激活031并确认第2节O口径，解除准备时NOT_ACTIVE。连续修复同一产品，完成规定真实短文本验证、干净目录安装、升级回滚和交付。不重搭架构、不扩长文本/WP/旧350条。030原始结果不动。质量门、备份和目标空闲检查通过才受控升级58618。仅推送review分支，不merge/release/tag；交付后WAITING_ADMIN_REVIEW。

以下为已结束030的历史授权记录，**不再执行030**；031按上述当前任务执行。

任务书：`docs/tasks/7plus1/7P-SHORT-COMPILER-ACCURACY-030.md`
任务书创建提交：`643442b40dc284d39a702bec541e7b76204bd18c`。
规范：`docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md`，v0.4/r02。
仓库：`joinwell52-AI/BoundX`。
工作及推送分支：`review/7plus1-parser`。

## ADMIN最新授权：实际测试现在的短文本编译器是否准确

029已经交付并停止。本次固定受测实现为029提交`ca86e87ea5b07ca770948e5e1231ae9972542ff5`的实际运行资源，读取其REPORT与METHOD-FROZEN-FULL核对。任务文档提交不等于改变受测核心身份。

保留原有本地UI、160项已有工作和历史，不重新搭架构、不改Skill/模型/Schema/技术策略/编译器，不因个别失败转为边测边修。保护工作区后安全同步，连续完成测试、逐事实评分和交付。

## 固定测试范围

- 首次真实编译任务书中的Q01—Q30，共30份新短文本，每份<=300 Unicode码点。
- Q07、Q20、Q25、Q29、Q30各做两次额外真实运行；含各首次形成5组共15份重复性观察。
- 全轮40次完整编译运行，30份不同原文。正常约80次模型调用，产品内有界修订/重试另计，最多启动200次模型请求；不得无限循环。
- 使用029正常CLI/同一核心；测试输入不含期待/案例ID。解析和审阅会话不接触预期、测试任务书或其他案例。
- 先从原文核定并冻结来源语义预期，再运行。允许语义等价表示，但必须审阅额外输出，不能只查几个字符串或使用LLM自审SUPPORT判真。
- 不跑旧23条替代新测试，不扩旧350条或长文本，不重做UI，不操作任务提及的业务文件。

## 结果必须分别说明

1. LLM首次是否正确理解；产品内部修订后是否正确。
2. 程序是否损坏已经正确的候选，或接受错误候选。
3. 用户最终7+1正确多少/30，FAIL、REVIEW_REQUIRED、ENV_FAILED、NOT_RUN各多少。
4. 无依据义务/许可、明确禁止或条件遗漏、错误绑定、数量/范围错误、真歧义处理的实际反例。
5. 重复结果是否既稳定又正确，全部运行计分，不挑最好答案。

技术检查/SEAL/运行成功不是语义准确率；这些新例不是外部随机业务抽样或独立人工Gold。旧23/23不能外推任意输入正确。没有独立复核的内容如实待审，不能改答案凑PASS。

任务状态使用`SHORT_ACCURACY_030=TEST_COMPLETED / PARTIAL_RUN / ENV_BLOCKED`；准确性另报`ACCURACY_030=PASS_IN_TESTED_SET / FAIL_IN_TESTED_SET / REVIEW_REQUIRED / INCOMPLETE`。测试完成允许是失败结论。

仅提交测试代码与必要脱敏证据，保留每次原始输出。不得修改当前可用编译器或重启用户UI，不申请API key/改全局配置，不merge/release/tag。中文用UTF-8 Python/Node写入，不用PowerShell改写。

完成本次真实准确性测试后停止`WAITING_ADMIN_REVIEW`，不自动修复或扩大范围。

## ADMIN追加产品交付总要求（2026-10-07）

最终目标是可直接使用、维护和升级的短文本7+1编译器产品，不是实验品。产品交付合同：

`docs/tasks/7plus1/SHORT-COMPILER-PRODUCT-DELIVERY-CONTRACT.md`

030固定版本、样本、评分和停止规则不变；本次测试是产品质量核验，测试完成不等于产品开发结束或产品验收通过。之后在同一个产品实现上完成确认缺陷修复、回归、运行包/安装、升级回滚与使用验收，不重搭架构，不每次复制研究原型。

本追加不授权030边测边修、修改现有UI或自动开始下一任务；不宣告当前版本已经产品就绪。公开发布仍待ADMIN明确授权。
