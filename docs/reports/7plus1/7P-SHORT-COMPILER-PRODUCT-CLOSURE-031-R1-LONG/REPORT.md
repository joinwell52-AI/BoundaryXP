# 031-R1 产品候选交付与真实验收

终态：`WAITING_ADMIN_REVIEW`。`SHORT_PRODUCT_031_R1=PARTIAL`，`SEMANTIC_ACCEPTANCE=REVIEW_REQUIRED`，`PRODUCT_DELIVERY_READY=false`。已交付可运行候选，但不宣称全部质量门关闭；Q05全称范围仍待审，原58618恢复仍受策略阻塞。执行者的来源复核不是ADMIN独立Gold审定。

## 运行包、地址与使用

- 最终包：[BoundaryXP-short-compiler-0.1.0-candidate.031-r1.2.zip](delivery/BoundaryXP-short-compiler-0.1.0-candidate.031-r1.2.zip)，90,843字节，SHA-256 `d7f8a1b244cf63fe69b775be5e818c66103d59bfd4e279064b55da26d676b8fd`。
- 实际候选地址：[http://127.0.0.1:58621/](http://127.0.0.1:58621/)，本轮创建的独立安装实例，PID29268，核心031-r1-c3。没有替换原58618或58619。
- 当前安装：`D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2`；数据与备份在相邻data/backups目录。
- 包含唯一核心、原UI、两个Skill、合同、Schema、锁定依赖、中文说明和安装模块；不含账号凭据、用户历史、模型权重、无关工作区文件。包的35个运行文件逐字节验证；干净Temp目录安装、启动、升级和回滚已实测。

Windows、Node>=22.18及既有已登录Codex CLI是前提；模型调用需要可用额度。只支持非空、≤300 Unicode码点的单一ADMIN短任务，不执行原文业务操作。文本会发送给已配置模型服务，本地页面不是离线推理。

解压到干净目录，在包根执行以下命令；选择空闲端口和新安装目录，不要与现有服务竞争：

```bat
node product/short-compiler/deploy.mjs install --home D:\boundx-short-local --port 58622
node product/short-compiler/deploy.mjs start --home D:\boundx-short-local
```

页面粘贴/上传txt或md，点击“开始编译”；查看八维、独立B、无需义务、未决和原文证据；可导出中文、JSON、完整HTML/Markdown/JSON Trace。历史按生成版本只读，不重新调用模型。实际最终UI跑了同一N01，两次真实请求，77.147秒；见[使用证据](UI-CLI-CONSISTENCY-c3.json)及[截图](UI-N01-c3-final.png)。

当前58621已启动。未来正常停止该已确认且空闲的候选后，可从任意工作目录用绝对路径启动：

```bat
node D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2\product\short-compiler\deploy.mjs start --home D:\boundx\.boundx\short-compiler-031-r1
```

升级/回滚前核对目标PID、版本、无在途请求并正常停止目标实例；从新完整包执行`deploy.mjs upgrade --home <目录> --confirmed-idle`，再start。回滚执行`deploy.mjs rollback --home <目录> --confirmed-idle`，再start。指针切换完整版本，历史不重算；备份包含指针、配置和真实data_dir。58621升级备份：`D:\boundx\.boundx\short-compiler-031-r1\backups\2026-10-07T19-06-25.052Z`，previous为c2。旧031-c5↔c3的干净安装/回滚另在隔离目录验证，不用用户生产实例试回滚。

## 版本及修复

最终核心提交：`63b0fb74e4639ea4c4c52979585dcf189adc3b2b`；第一轮核心提交：`0d0fb3a70431986e0830a66700548fc20a019ed8`。完整版本清单见[PRODUCT-MANIFEST](delivery/PRODUCT-MANIFEST.json)：合同031-r1.1，手册v0.4/r04，c3清单SHA `619884b961d9da62882d07c402042c92ec385ce8e5f692774a0c73fd4f29f39f`，运行资源SHA `d826e4f1d507a50bd627aebd560b7a47ec93a2970e9cd650a11e25603c459cd9`。

35个实际运行文件与该提交中的对应Git blob逐字节一致，不依赖未提交开发文件；见[SOURCE-COMMIT-BYTE-CHECK](SOURCE-COMMIT-BYTE-CHECK.json)。最终证据提交由Git提交历史标识，报告不写自引用提交号。

1. Q04/S00/T03修前逐项核对见[THREE-TRACE-DIAGNOSIS](THREE-TRACE-DIAGNOSIS.md)。原图已有生成/复核/提交及共享报告身份，不能说全部没识别；也不能由同一身份推完整生产结束。缺少当前RESULT实例→具体消费用途的机器关系。新增最小ARTIFACT_USE由LLM声明、两端来源校验，程序派生DERIVED可用性依赖；身份索引、产物流、明确TEMPORAL、Proof.requires分别解释。反例覆盖旧版本、新旧不同文件、部分结果、竞争报告、引文和ID重排。原031结果不倒改，原输出零模型检查明确只是诊断。
2. 核心位置：`contracts/schema.mjs`与两个Skill/共享合同定义新用途；`validate.mjs`检查角色、身份、版本、正向用途及来源；`artifacts.mjs`构造身份索引和有限依赖；`compile.mjs`/同源中文消费关系。所有派生保留规则版本、输入主张、模态、范围及provenance；不创建事件全部完成、QA批准或调度授权。
3. Q21首图把批准对象无依据绑定为文件，审阅UNCERTAIN正确拦住，但原共享修订流程只处理反对/遗漏，明确双批准边界全未决。c3在`revision.mjs`增加有来源的typed BINDING疑点反馈；只反馈实际质疑，不解释reason、代选对象或读评测答案。与原修订共用最多一轮。真实身份竞争或关联多先行项不强制修订。70份c2完成响应扫描只命中Q21，全部JSON/中文回放未变；Q21真实修订撤回无依据OBJECT和状态对象参数，不另造批准对象，AND必要许可、OR充分禁止、主体、发布产物和极性完整。四组有限假设观察及UNKNOWN检查见[Q21-CONDITION-REPLAY](Q21-CONDITION-REPLAY.json)，不是实际批准/业务决策。
4. 403失败并非需要开放编译路由：原本地P21测试对无会话编译请求期待200，已不符合当前受保护短文本接口及300码点范围。保留原测试字节，仅修授权范围内断言；真实测试Provider验证有效会话202→完成、无会话/跨源403、长输入400、同request幂等、历史/导出及取消合同，不放宽安全门，不删/skip该项。测试Provider不算真实模型成绩。
5. `product/short-compiler/resources.mjs`锁完整安装清单；UI/CLI从安装路径解析，模型前及请求阶段核验，不从开发区借Skill/Schema。c3实测修改独立开发副本不影响实例、破坏安装副本409/CLI模型前拒绝、恢复后保持摘要。工程验证0模型，实际UI运行使用同一锁定c3。

## 逐层语义结果及版本区别

两Skill、Schema、合同发生变化，因此按任务路径B真实重跑53固定、10额外重复及原N01—N08，合计71个预定完整编译尝试。完整运行成功不等于语义正确；首次超时只留真实失败。

| 范围 | 结果 |
|---|---|
| c2固定53首次完整结果 | 48 PASS、3 FAIL、1 REVIEW_REQUIRED、1 RUN_FAILED |
| c2固定53经自身有界修订后 | 50 PASS、1 FAIL(Q21)、1 REVIEW_REQUIRED(Q05)、1 RUN_FAILED(Q10) |
| c3当前有效固定结果 | 52 PASS、1 REVIEW_REQUIRED(Q05)；逐层JSON/中文/关系同此结果 |
| 指定五例三次观察 | 最终15/15正确；Q15首次候选曾修订，Q29真实歧义局部保留 |
| 原N组 | 8/8来源复核正确；N01/N04已暴露，不能称全部盲测 |
| 最终c3原UI N01追加验证 | PASS；2真实请求，CLI同响应回放/实际下载一致 |

c3不是另跑53份新模型响应：模型可见parse/audit bundle、Skill、Schema、手册、合同及模型配置与c2完全一致。70份完成响应在c3重新编译，JSON和中文全部相同，0新增模型请求；依据7.3只重验修订入口/UI受影响项。Q21是捕获原首次候选/审阅后，真实新解析+新审阅的2请求修订；Q10是相同原文单列的新2请求补测；原c2首次失败仍在原目录和统计中。最终N01再经c3原UI真实2请求；不混算首次准确率或宣称71份全是c3首次生成。

Q15首图多出非义务交付ARTIFACT_USE，经模型CONTRADICT后唯一修订移除；S09首次有不适用非空数量/范围字段，被技术签名门拒绝，唯一修订保留两类数量正确目标。这两项不是修改评分得到PASS。S09首次合同失败也不能等同自然语言全部理解错误。

390条评测需求见[PER-FACT-REVIEW](PER-FACT-REVIEW.json)，逐案来源、层级结果和完整引用见[SEMANTIC-REVIEW](SEMANTIC-REVIEW.md)/[PER-CASE-RESULTS](PER-CASE-RESULTS.json)。表中判定来自执行者逐原文人工核对，证据索引不是自动语义认证。条件、对象、模态、数量、角色、额外无依据语义和真正歧义均参与核对；模型自审不用于直接宣告准确。

## 仍未关闭

**Q05（评测待审/表达能力风险）**：原文“不得更改任何配置项”。候选保存原文及note“全称”，但机器表达只有`ITEM(配置项)`，实体类型OTHER，标签“配置项”；中文不显式保留“任何”。不能确认全类别量化已成为可计算合同，故不计完整正确，也不把问题降成原文歧义。没有改原文或把“全称”从note/原文关键词重新猜进Γ。ADMIN需裁定该现有实体域是否足够表达；若要求显式全称集合合同，则需同源合同/Schema/Skill及消费者修复并重新做相应模型可见资源验证。本轮剩21保守调用，低于模型可见合同改变后路径B正常142次验证需求，未提高180上限。没有以仅显示原文、修改答案或全填未决通过。

**原58618恢复**：只读核查仍HTTP400 `SKILL_CONTRACT_VERSION_MISMATCH`，PID27880；`LEGACY_58618_RECOVERY=POLICY_BLOCKED`，没有换命令/工具或资源间接绕过。原58619仍031-c5/031-r01、PID26144，session HTTP200，未修改；这不是新候选语义质量验收。新58621 c3/session HTTP200，PID29268，状态记录见[SERVICE-STATES](SERVICE-STATES.json)。

本轮不因Q05待审宣布产品READY，也不以全量0FAIL取代语义质量。其他真实歧义（Q29/S11/T09/N07）按原文保留局部Unknown，明确独立事实仍可接受，不把它们作为待修模型缺陷。

## 工程、资源、性能与调用

- 最终c3核心55/55 PASS、相关服务3/3 PASS；全量6706：6689 PASS、0 FAIL、17 SKIP。17项为当前宿主符号链接限制、历史模型/NLI重计算未启用及一项历史资产缺少失败夹具；均保留日志，不能写成6706全通过，也不冒称本轮重跑Gold-60/NLI模型。见[全量结果](regression-final-c3/RESULTS.json)、[日志](regression-final-c3/full.log)。
- c3资源隔离[PASS](version-isolation-c3/RESULTS.json)；干净安装/原c5升级回滚/真实历史SHA未变[PASS](engineering-c3/RESULTS.json)。实际候选c2→c3升级前确认0在途、备份成功，原58618/58619不动。
- 固定52成功运行耗时p50 134.301秒、p95 274.308秒；Q10首次超时301.366秒独立；10额外重复p50 116.468秒、p95 268.805秒；c3 UI77.147秒。性能不包装为15ms或无限额度；见[PERFORMANCE](PERFORMANCE.json)。
- 实际外层157次，观察内部重试2，保守159/180，余21；旧031239/240独立保留。逐请求/回执见[MODEL-CALL-AUDIT](MODEL-CALL-AUDIT.json)，不能当精确后端计费。使用冻结`codex-cli 0.160.1`及二进制SHA；请求gpt-6.1-sol/medium，实际模型未披露，原生Skill加载NOT_VERIFIED，实际INLINE_BUNDLE两Skill可核查；无模型工具执行事件，不改账号/通道。
- 本地160项原tracked改动、118857原untracked及旧0313283封存文件逐摘要核验；只有明确授权的本地P21测试为原untracked例外，原字节保存。未reset/clean、未混入无关改动。最终核验见[LOCAL-PROTECTION-CHECK-final](LOCAL-PROTECTION-CHECK-final.json)。

`PACKAGE_VERIFIED=true`、`VERSION_ISOLATION_VERIFIED=true`、`BUSINESS_EXECUTION_ENABLED=false`，`business_decision/execution_authorization=null`。本轮仅review分支提交/push，不merge/release/tag或对外发布；保留031及更早封存，停于WAITING_ADMIN_REVIEW。
