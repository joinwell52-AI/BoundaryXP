# 原文至数学结果：代码、标准样板及58618交付

## 实际交付

58618已从ui42升级至 **0.1.0-candidate.031-r1.2-ui.51**，编译核心 **031-r1-c25**。实际HTTP页面、会话、数学结果展示模块均返回200。61条历史记录保持不变，抽查完整Trace导出SHA-256与升级前一致。备份位置、部署后版本见BACKUP.json及ENTRY-after.json。

流程现在实际保存：原文 → 解析Skill/Codex候选 → 审阅Skill/独立会话 → 来源、Schema及引用技术校验 → Boundary IR → 同源JSON和中文7+1 → 程序数学计算。模型负责解释；计算读取类型化IR，调用src/bxp/现有集合与布尔求解器，不扫描原文补语义。页面展示操作数、运算、结果、来源和未证明项。

## 重写标准与实际结果

标准文件为docs/testing/7plus1/MANUAL-TEST-001.txt及同名MD。新原文明示完成充要方向、整体期限两个端点及停止范围，不能用历史响应冒称本原文通过。来源SHA-256：0b9b336d11a39a5e50d3ac361025211a742abe3c9578403098d3e3bcb45fda70。

最终真实模型资源版本在live-ui49-attempt-01完成解析、独立审阅；ui51只修消费者，以同一真实响应重放，未再调用模型。最终逐来源对照见final-ui51-replay/STANDARD-COMPARISON-source-verified.json，16/16通过。

| 运算 | 程序实际结果 |
|---|---|
| 输入集合I | {app.yaml, env.json}，基数2 |
| 产物集合O | {dev.md, ops.md, summary.md}，基数3 |
| I∩O；I∪O | 空集；5个不同身份 |
| 整体时间区间 | [0,30]分钟，含两端，非空 |
| 完成前提K=D∧O∧Q∧S | 16个布尔赋值，1个为真、15个为假 |
| 完成充要约束C↔K | 32个赋值，16个满足、16个违反 |
| 依赖图 | 4条带条件前提的关系，无环 |
| 禁止边界 | 修改两输入、访问生产、停止期继续核查与汇总，共5个对象/动作原子 |
| 高危触发 | 停止及向ADMIN汇报共用高危前提；立即绑定停止，不偷换为0秒 |

完整实际7+1、IR、中文、Trace及计算保存在final-ui51-replay/。八槽位RESOLVED，来源覆盖缺口、未接受事实和不支持计算均为0。上述是本标准明确边界的核对结果，不表示业务已经执行。

仍有 **7项不同操作之间的关系比较缺少形式证明**，保留UNKNOWN并显示原因。没有把“检查”和“修改”等不同操作自动视为等价或互斥。程序未证明跨域联合执行可行性，joint_cross_domain_execution_feasibility=NOT_PROVEN；不能将分项求解或人工见证冒称程序联合证明。business_decision及execution_authorization保持null。

## 通用修复及失败保留

1. ROOT整体期限的合同、校验、IR及R投影闭合；只有明确整体期限签名可用ROOT，不能冒用于具体事件、逐项数量或输出内容。
2. ROOT对象属性作用域仍要求明确对象及一致TEST绑定，禁止跨对象借用。
3. 两个Skill及共享合同明确条件从句可覆盖多个并列义务；分号或重复主体不能单独证明条件结束，不机械传播“立即”。
4. 集合、数量、布尔表达式、身份去重、依赖图、禁止与冲突比较形成统一数学结果及中文/UI消费者；未知归属、缺失成员、未支持表达式保持真实缺口。

首轮真实失败live-attempt-01、条件汇报遗漏live-ui47-attempt-01均保留。最终成功使用新的真实ui49响应，不覆盖失败。比较脚本先前对边数量和OBJECT/CONTENT角色的假设过窄，修正说明及原失败分别保留，见EVALUATION-CLARIFICATION.md；不是仅修改评分来修复运行结果。

## 验证与限制

- 专项无模型检查32/32通过，见SELFTESTS-ui51.json。
- 标准逐来源/数学对照16/16通过。
- 全量回归260项：218通过、42失败；与消费者修复前基线相同，无新增失败。**全量回归不通过**，没有写成0 FAIL。
- 干净目录安装、父版安装、升级、回滚4/4通过，未启动额外端口。
- 本轮真实模型请求8次：首轮4、ui47两次、ui49两次；回放0次。历史预算未重置。请求模型gpt-6.1-sol，实际服务模型未披露，不能等同认定。
- 实际页面HTTP及资源、会话、历史和导出已验证；浏览器自动操作此前被策略拒绝，本轮未绕过，未冒称点击式页面全链验收。
- 此次完整BXP符合性、所有文本准确性及跨域联合执行可行性尚未验收，不宣称PRODUCTION_READY。

## 使用与回滚

地址：http://127.0.0.1:58618/。重启电脑后在D:\boundx执行npm run 7plus1:ui。刷新页面、上传标准TXT，展开“数学计算结果：操作数 → 运算 → 计算值”；历史旧记录不会被伪造补算。

运行包：0.1.0-candidate.031-r1.2-ui.51.zip，完整安装源和依赖锁文件已包含，node_modules及凭据不入包。安装模块支持干净目录部署，详见包内product/short-compiler使用说明。

回滚前确认无在途请求并停止该安装服务，然后执行：node .boundx/products/0.1.0-candidate.031-r1.2-ui.51/product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle；再执行npm run 7plus1:ui。备份及历史不可删除。

状态：WAITING_ADMIN_REVIEW。仅推送review分支，不merge/release/tag。
