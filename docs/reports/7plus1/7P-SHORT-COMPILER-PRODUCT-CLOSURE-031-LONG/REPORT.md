# 031短文本编译器产品候选交付

SHORT_PRODUCT_031=BLOCKED
LOCAL_PRODUCT_CANDIDATE_READY=false
PRODUCTION_READY=false
FINAL_STATE=WAITING_ADMIN_REVIEW

本轮有效修复保留并交付可运行候选，但**未满足031全部产品验收门**。239/240保守调用预算已不足再完成解析及独立审阅；固定回归6份、额外重复10份、新文本6份未运行。来源审阅还发现3份内部产物事件先后遗漏。未以合同检查、模型SUPPORT、包可启动或全量回归代替语义验收。

## 运行包与入口

版本0.1.0-candidate.031.5；唯一核心031-c5、合同031-r01、手册v0.4/r03。源代码提交1a91974d75ebdb126a8c6727f2b7833a792dc055。

- 压缩包：D:\boundx\.boundx\deliverables\BoundX-Short-Compiler-0.1.0-candidate.031.5.zip。
- 包构建目录：D:\boundx\.boundx\experiments\031\packages\delivery-031-c5-committed。
- 干净安装目录：D:\boundx\.boundx\short-compiler-031。
- 已实际启动的独立候选页面：http://127.0.0.1:58619/。
- 版本资源：安装目录versions；历史：data；配置：config.json；完整资源版本指针：current.json。

原58618没有部署失败候选。其长期运行的029进程在工作区资源变化后出现SKILL_CONTRACT_VERSION_MISMATCH，不能声称仍可正常解析。原配置和历史已备份，完整029恢复资源已准备；自动审批拒绝了仅针对PID27880的停止及恢复启动，理由仅为“blocked by policy”。未换一种停止方式绕过拒绝，恢复仍未执行。

## 安装与启动

需要Node>=22.18，以及已安装并登录且可使用gpt-6.1-sol的Codex CLI。本地界面不是离线推理；不修改全局账户配置。包不含凭据、历史、权重或用户160项既有改动。

解压后在包根目录执行，安装到自己的新目录及空闲端口：

```bat
node product/short-compiler/deploy.mjs install --home D:\boundx-short-031 --port 58619
node product/short-compiler/deploy.mjs start --home D:\boundx-short-031
```

如果58619已运行本次候选，不启动第二个同端口进程。重启本轮已安装实例使用：

```bat
cd D:\boundx
node product/short-compiler/deploy.mjs start --home D:\boundx\.boundx\short-compiler-031
```

单次CLI在解压的包目录执行：

```bat
npm ci --omit=dev --ignore-scripts
npm run verify
npm run 7plus1 -- --input task.txt --output new-run-directory
```

页面粘贴任务或上传UTF-8文件，非空且最多300 Unicode码点，点击开始编译。逐条查看I/O/A/P/R/V/C/B、待确认、独立B及原文来源。可选结果不是必交清单；无需项在独立区域完整显示。导出JSON、中文和完整Trace；历史打开按当时版本快照，不重新调用模型。任务中业务操作只作待表示的数据，编译器不执行业务操作。

升级前核实目标进程及无在途请求并备份。从新包执行upgrade --home原安装目录 --confirmed-idle，校验完整资源、安装锁定依赖后切换指针；失败不切指针。rollback --home同一目录 --confirmed-idle后再start恢复上一完整版本，历史不重算。本轮质量门未通过，**不得升级原58618**。

## 已交付的通用修复

1. ADMIN批准O口径：RESULT产生用途与DELIVERABLE交付用途分开；提交义务保留A与O，不推断生成、修改、已有状态或额外I。可选生成和无交付义务各自保留。手册、共享合同、两个Skill、Schema、投影和本轮来源预期一致。030原始结论不改。
2. 相同030响应的无模型消费者回归证明：无需项保留执行者/复核者和对象，STATE显示引用事件及角色。原UI、CLI、JSON与中文同源，不在显示端补语义。
3. 两个Skill加入同指令主体承接与隔离规程、报告mention身份与条件目标核对、组织职责当前用途及范围完整性；不在程序Γ中按原文词语猜执行者或合并报告。
4. 数量target/use/count_scope与结果所有权维持严格合同。可修正技术错误作为真实错误码、字段路径及相关ID反馈给现有一轮有界修订；审阅错误与技术错误共享同一轮预算，第二次错误保留，不无限调用、不丢限制。
5. 明确条件参与者的P投影覆盖ROOT完成/停止及当前时间表达式。纯结构可达性与明确ROLE，不读原文、不新增动作义务。Q22/Q23同响应补回ADMIN，其他7槽逐字节等价；新增P的Proof包含所依赖的完成边界与STATE来源。CONSUMER-C5-COMPARISON.json保留修复前后完整链。
6. 实际Q23网络回执的时间戳数字401曾误触发登录错误。失败分类现在要求HTTP/状态上下文；真实网络失败正确分类，原错误回执不删除。40项核心中有对应回执和数字反例测试。

源码定位：compile.mjs负责有类型用途投影与完整渲染；validate.mjs负责有限来源、引用、依赖和跨字段合同；revision.mjs负责白名单技术反馈；engine.mjs负责共享一轮预算；process.mjs负责传输分类。两个Skill负责语义，不使用旧NLP旁路，不另搭核心。

## 实际语义结果

以下为执行Codex逐来源审阅的开发判断，不是ADMIN逐案签字，不是随机业务准确率，也不是模型自审计分。Source最低事实命中之外，额外输出和漏边仍参与整案结论。

|阶段|正确|错误|未运行|总数|
|---|---:|---:|---:|---:|
|首次完整候选|42|5|6|53|
|产品内修订后的候选|44|3|6|53|
|原JSON交付|42|5|6|53|
|同响应031-c5消费者JSON|44|3|6|53|
|同源中文交付|44|3|6|53|

Q01–Q30全部有完整新模型输出：首次完整候选27/30，最终候选及消费者修复后29/30。Q23在c3的首次传输失败没有候选，原运行保存；c4重试的首次完整候选另列，不能将网络失败覆盖为首次成功。Q06/Q08的初始内部时序遗漏经产品有界修订恢复。

Q04、S00、T03仍缺生成当前内部报告先于其复核的可消费关系。候选保留身份和复核职责，模型审阅没有指出缺边，程序来源/Schema合同接受也无法证明没有语义遗漏。按本轮Skill内部产物时序规程记整案FAIL；这不是仅修改中文或在投影端从原文补边可修复的问题。失败及全部原输出保留，不倒改031来源预期或030结果。

6份未运行：T01、T02、T07、T08、T09、T10。新增批次因调用预算预留等待，不代表编号顺序已全执行；T03–T06实际运行路径与时间均记录。

重复观察只完成5份首次；规定10份额外重复NOT_RUN，不能报告稳定性通过。8份预登记新文本中N01原UI真实上传通过；N04初始报告身份错误，修订Skill后同文重跑正确，已转为开发回归，不能重新称未见样本。N02/N03/N05/N06/N07/N08未运行。消费者修复后的最终冻结没有重新进行完整新8份，验收门为未通过。

S/T新运行和c3/c4模型候选使用同一最终语义Skill与Schema；c5只修结构消费者。相同响应重编译明示为零调用程序验证，不冒充新的LLM解析或最终版本全链53/53。

## 调用、性能、工程与产品门

198次外层Codex启动；195份完整回执，3份中断缺回执；解析101、审阅97；41次CLI内部网络重试信号。保守预算239/240。重试信号不是服务器收到请求的证明，实际服务调用数/模型身份没有由服务披露，不伪报精确后端调用数。资源/提示/响应SHA、隔离配置检查0错误，审阅为新会话，0重复会话，未见工具执行。两Skill实际加载方式INLINE_BUNDLE，原生加载未验证。

47份完整回归运行耗时中位数102986ms，P95为253531ms，最快55754ms，最慢385672ms。N01真实UI运行137秒；不宣传即时结果。性能与准确性分开，失败传输时间另存。

- 核心40/40通过，两个Skill UTF-8验证通过。
- 最终全量6705项：6687PASS、1FAIL、17SKIP；exit=1，**不是0fail**。唯一失败旧tests/parser-v03-p21-service.test.mjs:13无本地会话请求期待200，实际403；029共享服务wrapper SHA与当前完全相同。未修改旧测试，未关闭会话校验或恢复旧NLP。
- 干净目录依赖锁定安装、版本摘要校验、原UI启动、粘贴及真实UTF-8上传、精确来源高亮、JSON/中文实际下载一致通过。
- 完整029→031-c5→029→031-c5升级回滚演练通过。配置和84份历史文件备份摘要一致；外部配置的数据目录也实际备份；篡改包校验失败不切指针。0模型调用。
- 三份原UI试验历史在候选升级和重启后仍显示原031-c1/c2/c3快照，不重算；空输入与301码点实际页面拒绝且不截断，0模型调用。
- 取消/超时用已有可靠本地服务/独立子进程工程测试验证；真实模型UI取消未另外运行，未冒称实测。
- 原160项tracked字节全部一致，030封存路径Git对比无变化。原5868项untracked有路径盘点，启动前未做全部字节摘要，因此不声称逐字节比对；未整体stage/clean/reset，未吞入这些原文件。

剩余阻断：3个语义遗漏、6份固定回归、10份额外重复、6份新文本及最终新文本冻结要求、全量历史服务测试1FAIL、原58618恢复审批。运行包和工程可用不是产品语义门通过。达到本轮调用预算停止条件后保存有效修复、未完成项和候选，推送review/7plus1-parser，等待ADMIN决定后续预算与验收，不自动merge/release/tag或开始新任务。

## 证据入口

CASE-RESULTS.json / CASE-RESULTS.md：53份原文SHA、逐层结论、来源预期、原模型与最终Trace路径、完整候选清单及来源审阅。
CALL-AUDIT.json：逐请求资源、回执、会话及重试计数。
CONSUMER-C5-COMPARISON.json：原候选/audit不变、精确新增P及Proof链。
TESTS.json / c5-final-engineering/：最终真实测试数字和日志。
PRODUCT-C5-UPGRADE-ROLLBACK.json / PRODUCT-UPGRADE-ROLLBACK.json：实际部署演练。
PROTECTION.json / PERFORMANCE.json / REPEATED-RUNS.json：保护、性能和未完成稳定性。
各runs/和consumer-c5/：原文、初始候选、审阅、技术校验、IR、JSON、中文及完整Trace，失败/中断不删除。
MANIFEST.json / SHA256SUMS / SEAL.json：报告资源字节封存，不等于语义通过。
