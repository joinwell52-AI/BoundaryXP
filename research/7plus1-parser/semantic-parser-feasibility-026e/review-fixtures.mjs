// Independent source assertions for the non-oracle unresolved cases.
// This is evaluation data, never candidate-generation code or a Pack.
// [predicate anchor, argument anchor, layer, modality, condition anchor]
const F='FORBIDDEN',R='REQUIRED',M='MAIN',C='OUTPUT_CONTENT',S='CONDITION_ANTECEDENT',Q='NOMINAL_QUALIFIER';
export const reviewFixtures={
 'ROOT-016':[['检查','索引与约束声明',M,R],['形成','schema-review.md',M,R],['连接','生产数据库',M,F],['确认','两类检查都完成',M,R],['完成','两类检查',S,null],['结束','任务',M,R,'QA 应确认两类检查都完成后']],
 'ROOT-018':[['检查','安装步骤',M,R],['符合','QUICKSTART-2','PROPOSITION_COMPLEMENT',null],['形成','doc-review.md',M,R],['记录','不一致项',M,'PERMITTED'],['修改','install.md',M,F],['收到','报告',S,null],['通过','QA 复核',S,null],['完成','任务',M,R,'PM 收到报告且 QA 复核通过后']],
 'ROOT-020':[['读取','scan.json',M,R],['复核','高危发现',M,R],['形成','security-review.md',M,R],['存在','可利用漏洞',S,null],['汇报',null,M,R,'若确认存在可利用漏洞'],['执行','漏洞利用',M,F],['删除','扫描结果',M,F]],
 'ROOT-024':[['读取','revenue.csv',M,R],['读取','monthly-report.xlsx',M,R],['复核','报表汇总金额',M,R],['形成','finance-review.md',M,R],['记录','复核误差',M,R],['隐藏','差异',M,F]],
 'ROOT-027':[['读取','inference-trace.json',M,R],['检查','模型名称',M,R],['检查','输入摘要',M,R],['检查','输出摘要',M,R],['形成','model-call-audit.md',M,R],['标记','未证实',C,R],['下载','模型',S,null],['标','已调用',M,F]],
 'ROOT-028':[['读取','evaluation.json',M,R],['统计','运行失败',M,R],['统计','语义错误',M,R],['形成','evaluation-review.md',M,R],['等同','语义正确',M,F],['修改','测试原文',M,F],['修改','标准答案',M,F]],
 'ROOT-029':[['编写','prompt-guide.md',M,R],['说明','遇到凭据时停止输出',C,R],['停止','输出',C,R,'遇到凭据时'],['交付','文档',M,R],['执行','测试流程',M,F],['确认','文档包含该停止条件',M,R]],
 'ROOT-031':[['执行','推理健康检查',M,R],['形成','inference-health.md',M,R],['超过','2 GB','DECLARATION',F],['重试',null,M,'PERMITTED'],['超限','内存',S,null],['停止',null,M,R,'若内存超限'],['切换','生产环境',M,F]],
 'ROOT-025':[['读取','migration-plan.md',M,R],['检查','回滚步骤',M,R],['检查','停机窗口说明',M,R],['形成','migration-review.md',M,R],['执行','迁移',M,F],['执行','回滚操作',M,F],['确认','两类说明均完整',S,null],['提交','评审结论',M,'PERMITTED','只有 QA 确认两类说明均完整后']],
 'ROOT-026':[['读取','model-config.json',M,R],['核查','模型路径',M,R],['核查','精度设置',M,R],['核查','设备配置',M,R],['形成','model-config-review.md',M,R],['加载','模型权重',M,F],['发起','推理',M,F],['使用','20 分钟','DECLARATION',R]],
 'ROOT-030':[['读取','training-index.csv',M,R],['核查','来源',M,R],['核查','许可记录',M,R],['形成','training-audit.md',M,R],['缺失','来源或许可',Q,null],['标','待确认',C,R],['下载','新数据',M,F],['启动','训练',M,F]],
 'ROOT-033':[['读取','index-manifest.json',M,R],['检查','版本',M,R],['检查','校验值',M,R],['形成','index-audit.md',M,R],['排除','archive 目录',M,R],['计算','向量',M,F],['失败','校验',S,null],['汇报',null,M,R,'发现校验失败时']],
 'ROOT-035':[['读取','before.json',M,R],['读取','after.json',M,R],['对比','失败用例',M,R],['对比','耗时变化',M,R],['形成','regression-diff.md',M,R],['列出','新增失败',C,R],['列出','已消失失败',C,R],['修改','Parser',M,F],['修改','模型',M,F],['修改','阈值',M,F]],
 'ROOT-041':[['检查','changes.csv',M,R],['存在','差异',S,null],['生成','difference-report.md',M,R,'存在差异时'],['提交','difference-report.md',M,R,'存在差异时'],['生成','该报告',M,'NOT_REQUIRED','没有差异时'],['说明','无差异',M,R,'没有差异时'],['修改','changes.csv',M,F]],
 'ROOT-049':[['review','health.log',M,R],['found','critical error',S,null],['stop','task',M,R,'If a critical error is found'],['notified','PM',M,R,'If a critical error is found'],['produced','health-summary.md',M,R,'otherwise'],['restarted','service',M,F]],
 'NROOT-003':[['检查','证据记录',M,R],['包含','文件名、哈希和时间信息','PROPOSITION_COMPLEMENT',null],['交付','evidence-integrity.md',M,R],['记录','缺项',C,R],['补造','证据',M,F]],
 'NROOT-005':[['排查','gateway.log',M,R],['排查','gateway-error.log',M,R],['关注','最近 20 分钟重复 5xx',M,R],['形成','gateway-review.md',M,R],['清理','日志',M,F],['重启','网关',M,F]],
 'NROOT-008':[['检查','内部链接',M,R],['形成','doc-link-review.md',M,R],['记录','失效项',C,R],['修改','文档',M,F]],
 'NROOT-009':[['读取','role-map.csv',M,R],['读取','permission-map.csv',M,R],['检查','角色与权限映射',M,R],['形成','role-permission-review.md',M,R],['新增','权限记录',M,F],['删除','权限记录',M,F],['修改','权限记录',M,F]],
 'NROOT-012':[['评审','migration.sql',M,R],['检查','回滚段',M,R],['检查','事务边界',M,R],['形成','migration-script-review.md',M,R],['连接','数据库',M,F],['执行','脚本',M,F]],
 'NROOT-013':[['核验','全部备份',M,R],['核验','校验状态',M,R],['核验','生成时间',M,R],['形成','backup-state-review.md',M,R],['列出','失败项',C,R],['恢复','备份',M,F],['删除','备份',M,F]],
 'NROOT-017':[['核查','id、timestamp、status 三列',M,R],['存在','三列','PROPOSITION_COMPLEMENT',null],['非空','三列','PROPOSITION_COMPLEMENT',null],['形成','sample-field-review.md',M,R],['修复','样本',M,F],['重写','样本',M,F]],
 'NROOT-019':[['检查','状态记录',M,R],['完整','状态记录','PROPOSITION_COMPLEMENT',null],['形成','task-ledger-review.md',M,R],['复核','最终报告',M,R],['补造','缺失历史',M,F]],
 'NROOT-010':[['比较','服务版本',M,R],['比较','启动参数',M,R],['形成','node-snapshot-diff.md',M,R],['连接','实际主机',M,F]],
 'NROOT-018':[['比较','api-before.json',M,R],['比较','api-after.json',M,R],['形成','api-change-review.md',M,R],['列出','新增、移除和重命名接口',C,R],['删除','接口',M,F],['改名','接口',M,F]],
 'NROOT-029':[['查看','audit.log',M,R],['形成','log-window.md',M,R],['是','观察窗口','METALINGUISTIC',null],['删除','日志',M,F]],
 'NROOT-011':[['审阅','release-note.md',M,R],['检查','版本',M,R],['检查','变更摘要',M,R],['检查','回滚说明',M,R],['形成','release-note-check.md',M,R],['发布','版本',M,F],['修改','原说明',M,F]],
 'NROOT-014':[['汇总','失败情况',M,R],['形成','test-summary.md',M,R],['运行','测试',M,F],['修改','实现',M,F]],
 'NROOT-074':[['生成','deployment-guide.md',M,R],['说明','检查通过则继续部署，检查失败则停止',C,R],['通过','检查',C,null],['部署',null,C,R,'检查通过'],['失败','检查',C,null],['停止',null,C,R,'检查失败'],['部署',null,M,F]],
 'NROOT-004':[['核对','公开接口的名称',M,R],['核对','版本标识',M,R],['形成','api-list-review.md',M,R],['复核',null,M,R],['提交',null,M,R,'QA 复核后'],['修改','接口定义',M,F]]
};
