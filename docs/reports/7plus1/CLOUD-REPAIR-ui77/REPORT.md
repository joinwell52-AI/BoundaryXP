# 7+1云端续作交付：ui77

2026-10-12。状态：**WAITING_ADMIN_REVIEW**。仅交付私有 `review/7plus1-parser`；基线确认包含 `e25ad6a139f7649e3c8067627d1a83a06223fff4`。候选 `0.1.0-candidate.031-r1.2-ui.77` / `direct-ir-r05-test` / `candidate-ir/1.4`，最终运行资源提交 `f895887d316afd972620beaab28d2291e140ed94`。

同一冻结真实 IR/audit 的消费者问题已修复，相关工程回归76/76，标准原有29项机械对照全部吻合，完整候选包已由干净签出构建、独立解压安装依赖并通过CLI、UI及观测API验证。**这些不是新Skill真实模型准确性成绩，也不表示完整源文语义或整个产品验收通过。**

## 基线、复现与保护

完整读取交接、MANUAL-TEST-001 MD/TXT、方法说明、共享合同/Schema、两个Skill及实际运行证据。沿用原 `llm-first-028`、`src/bxp` 唯一计算Core和现有UI，没有另建解析器，没有NLP补答案。

真实基线运行 `7671553d-7b8d-4a82-906a-2db224be43ab`；Source SHA-256 `0b9b336d11a39a5e50d3ac361025211a742abe3c9578403098d3e3bcb45fda70`，IR SHA-256 `22f094d303b61dce3fc58e73c01330c6d855eafa9d5b35f27191d5f6dc1cab87`。原首次运行的解析/审阅、未知actual_model、432.490秒/178.612秒及原失败不覆盖。八份冻结证据的原SHA256SUMS重新核验全部通过；标准、TXT及旧ui76报告没有修改。

修改前 `BEFORE-REPLAY` / `BEFORE-COMPARISON` 重现26吻合、1局部门不等价、2时序查询UNKNOWN/SEARCH_CAPACITY。初始实际存在的相关测试38通过；交接命令中的三个Boolean测试文件在基线未入库，本次补上9项有意义的Core验证，没有把缺文件当作已执行测试。

## 通用修复

- ACTION/已绑定实例的CONSTRAINT消费为 `(发生 ∧ applicability) ⇒ body`；TASK、完成IFF、输入范围及整体期限保持全局。EVENT_NORM与STOP仍按充分触发启用真实义务。隔离必要门的四种G/Q赋值与 `G⇒Q` 一致；独立必需动作、条件义务、纯BEFORE和全局条件另验。
- 求解器增加有根据的布尔传播，在部分赋值中检查已激活的严格时序环。默认100000搜索节点上限不变；未解决分支仍可返回UNKNOWN。反例保存假设、传播轨迹、闭合路径及独立证书核验，没有删约束或把UNKNOWN改PASS。
- DATA_USE保留独立可用点与消费使用点；AT_USE不强制生产者全部工作结束。激活条件同时用于使用限制和外部输入投影，防止条件未激活时制造额外输入。递归输入激活明确为未支持项。
- 新观测消费者检查typed identity、主体/对象/接收者、输入子集、全部实际操作环境、开始时必要条件、材料使用及可用性、整体耗时、完成三值逻辑、高危义务与停止阶段。缺身份/时间/单位/阶段不判满足；未分类操作不因不同字符串而判相容。停止periods只用于CONTROL_EFFECT，不能覆盖SUCCESS里程碑来追认提前动作。
- 同源中文/UI展示条件、真实材料关系、范围和数学值。环境全称归到I的范围摘要，保留模型原declared_views；时序边与必要门分别列示。宿主按精确quote/occurrence附加Unicode坐标，不修改模型IR，页面能定位原文。
- 完整构建器从Git源码冻结200项资源，重建此前未入库的60份源文示例目录，仅装源文、不装Gold答案。没有依赖上一版安装目录、父目录Node模块或D盘路径。

## 最终验证

| 验证范围 | 实际结果 |
|---|---|
| 相关Core、候选IR、条件、输入、观测、来源、回放与UI回归 | **76通过 / 0失败 / 0跳过**，`DELIVERY-RELATED-TESTS.txt` |
| 原29项标准断言应用于当前消费者 | **29吻合 / 0不符 / 0未决**，`DELIVERY-COMPARISON/COMPARISON.json`；原标准断言未改 |
| 新消费者正常完成见证 | **176项核验通过**；T=30且任务起止差=30；人工T=16也合法 |
| 通用反例查询 | **10项无解、10项冲突证书核验通过**，包含QA晚通过和QA提前开始 |
| 人工机制观测变体 | **16/16吻合**，`FINAL-OBSERVATIONS/OBSERVATION-CHECKS.json`；不是实际业务观测或模型样本 |
| 两次干净构建 | 完整清单逐字节一致；最终manifest摘要 `c8f8223934f29d10da935688749a61092ae5399ca4446c43223528f2bfa03678` |
| 独立解压交付ZIP后安装依赖 | 200项资源摘要、包内依赖、CLI回放、12项HTTP及观测API全部通过；无父目录依赖继承 |
| 实际浏览器 | Chromium；原五个标签、60份源文入口、精确来源高亮、默认UNKNOWN、明确禁止VIOLATED通过；页面错误0 |
| 新增真实模型调用 | **0**；没有使用云端继承登录、购买额度或切换收费通道 |

主证据为 `DELIVERY-TRACE.json`、`DELIVERY-SUMMARY-R02.json`、`COMPLETE-PACKAGE-VERIFY`、`ARCHIVE-PACKAGE-VERIFY`、`ARCHIVE-BROWSER-VERIFY`。较早AFTER/FINAL命名目录是开发阶段快照，保留原样，不代表最后封装。最初浏览器探针遗漏展开历史details属于测试脚本问题，修正探针后页面通过；初版新测试误取了求解API的计数字段，也保留失败输出后改用既有canonical接口核验。

扩展执行 `tests/*.test.mjs` 后遇到历史Windows Python路径、旧研究模块缺失和NLP服务每项120秒超时，停止该扩展运行；原输出保留于 `EXTENDED-REGRESSION-INTERRUPTED.txt`，另有路径失败重现。**不声明全仓库回归通过**，不为旧NLP研究恢复服务或修改其冻结样本追成绩。

## 模型层剩余问题与本地补验

局部门修复后，冻结候选的 `r_make_summary` / `r_deliver_summary` 仍把独立动作义务条件化为QA成功才触发；回放不能从原文补造缺失义务。原两个Skill与共享合同已补充通用的必要门、充分触发和独立义务区分，Schema形状/版本及算子表不变。新资源必须由本地真实首次解析、新会话审阅和重复运行验证，特别核对独立义务，不能把旧响应的29项机械对照冒称新版语义完整通过。

默认回放门仍拒绝资源不匹配；验证器明确允许旧Skill/合同说明资源的响应进入当前消费者，保存原/新摘要与PRIOR_MODEL_RESOURCES范围，来源、Schema和算子资源门不绕过。模型actual_model仍未知，requested_model不是已确认服务模型。

有限变量/量词、不绑定的事件实例及局部连续数值等组合尚有明确未支持项；实际观测为用户自报，不是程序独立采集事实。开放任务域只核查所提供记录/本构造见证，不认证任意未来执行。没有恢复许可，不因停止禁令未命中而授予权限。Windows实际安装、用户本机模型登录、58618真实请求和回滚尚待本地受控验证。

## 完整候选与本地命令

[完整候选ZIP](../../../../review-assets/7plus1/cloud-ui77/BoundX-0.1.0-candidate.031-r1.2-ui.77.zip) 共541586字节；SHA-256 `d4e84b44c3f04ab9ee7009f4fd1ad5b1f6b47df3500f01b426e40d904585ddb5`。候选不含node_modules、凭据、个人历史、模型权重或Gold答案；依赖由锁文件安装。清单及摘要见同目录 `DELIVERY-MANIFEST.json` / `SHA256SUMS`。

完整干净签出、构建、安装检查、升级及回滚命令见 [CLOUD-CANDIDATE.md](../../../../product/short-compiler/CLOUD-CANDIDATE.md)。先保护脏的D:\boundx，独立克隆唯一分支并核对ADMIN审阅提交；不要在旧目录pull/reset/clean。完成包验证并在本地核对58618版本、空闲与备份后，才在候选根目录执行：

```bat
node product/short-compiler/deploy.mjs upgrade --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle
node D:/boundx-cloud-ui77/product/short-compiler/launch-installed.mjs --home D:/boundx/.boundx/short-compiler-031-r1
```

只push不会更新本机安装；旧工作区启动文件没有自动更新，因此使用新干净签出的启动器。升级器先备份并验证依赖/完整摘要，再切换指针；保留旧版本与历史。云端没有操作用户电脑的58618，不使用、不新增、不触发GitHub Actions，不merge/release/tag。business_decision与execution_authorization始终null。停止等待ADMIN Review。
