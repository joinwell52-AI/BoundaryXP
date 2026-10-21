import fs from 'node:fs';import crypto from 'node:crypto';
const root='fixtures/7plus1/admin-short-050-r02/',report='docs/reports/7plus1/ADMIN-SHORT-050-r02/';
if(fs.existsSync(root+'MANIFEST.json'))throw Error('Already frozen');
const rows=[
['系统环境核查','PM 负责本次系统环境核查，安排 OPS 检查测试机的操作系统、磁盘余量和服务进程。OPS 必须生成 environment-check.md，QA 复核报告后由 PM 提交给 ADMIN。整个任务须在 40 分钟内完成，不得修改系统配置。','检查范围与检查责任分离；QA 复核、PM 汇报；时限不能绑定报告或复核人。'],
['FCoP 落地检查','PM 安排 DEV 按照 FCoP 的 v2.1 规范核查当前项目的任务记录和证据留存。DEV 必须生成 fcop-review.md，列出符合项与缺失项。QA 确认报告包含全部缺失项后，PM 向 ADMIN 提交报告；不得补造历史记录。','规范与版本组合；报告内容要求不成为新的执行任务；禁止补造历史。'],
['MCP 权限审计','OPS 读取 mcp-config.json，检查已启用 MCP 工具的访问权限；PM 负责协调本次审计。OPS 必须生成 mcp-access.md，并交给 QA 复核。不得调用被审计的工具，也不得改动 mcp-config.json。','工具是被审计对象，不是调用授权；配置只读与禁止调用分别保留。'],
['Skills 分配审计','PM 安排 DEV 检查 skills-map.yaml 中的 Skills 分配，核对每个角色是否只获得已批准的能力。DEV 生成 skills-audit.md，QA 复核角色与能力的对应关系，PM 最后向 ADMIN 汇报。禁止修改角色授权或安装新 Skill。','Skills 不冒充资源额度；角色与能力关系完整；两类禁止独立。'],
['轨道机运行检查','OPS 按照 OPS-RULE-12 检查轨道机当前运行状态和最近一小时的告警日志，生成 orbit-review.md。发现停机时，OPS 必须立即停止后续检查并向 PM 汇报。不得重启轨道机；未发现停机时，报告提交给 PM 即完成。','检查时间窗口不同于执行时限；停止与汇报共享停机条件。'],
['备份核验','PM 安排 OPS 读取 backup-index.csv，检查其中所有备份的校验结果，生成 backup-audit.md。QA 确认报告覆盖清单中的每一项后，PM 向 ADMIN 提交报告。不得恢复备份，不得删除任何备份文件。','ALL 清单覆盖；检查不等于执行恢复；两个禁止动作。'],
['权限最小化检查','安全员顾宁负责本次权限检查，读取 roles.csv 和 grants.csv，并生成 permission-review.md。检查范围仅限测试环境，生产环境不在本次检查范围内。不得修改授权；只有两份输入都检查完且报告已生成，任务才完成。','两个输入与环境范围；完成 AND；排除范围不自动产生额外动作。'],
['证书有效期核查','OPS 读取 certificates.csv，检查每张证书的到期时间，生成 expiry-report.md。距到期不足 15 天的证书必须在报告中单独列出。不得更换证书；PM 收到报告后向 ADMIN 汇报。','15 天是报告分类条件，不是任务时限；报告内容条件保留所属。'],
['日志排查','DEV 读取 app.log 和 error.log，定位重复报错，生成 incident-notes.md。单次查询最多重试 3 次，整个排查不得超过 30 分钟。若发现凭据泄露，立即停止排查并通知 PM；不得把日志上传到外部服务。','次数与时限分别绑定；条件停止；外传禁止不扩大为禁止读取。'],
['发布前只读检查','QA 依据 RELEASE-6 的 v3.0 版本读取 release.yaml 和 build.log，生成 release-check.md。PM 在 QA 提交报告后向 ADMIN 汇报。此次任务不执行发布，不得修改源码或发布配置。','依据身份与版本；不执行发布不等于已执行；禁止范围含两类对象。'],
['代码差异检查','DEV 以 commit 6ab9c21 为基线检查当前代码差异，生成 code-diff.md。必须列出新增接口及删除接口，不要求修复发现的问题。不得提交代码、合并分支或创建标签；PM 接收检查报告。','commit 依据；NOT_REQUIRED 修复不变 FORBIDDEN；三类明确禁止。'],
['接口兼容性检查','DEV 读取 api-old.json 和 api-new.json，检查公共接口的兼容性，生成 compatibility.md。QA 确认每个删除或改名的接口都已记录后，PM 将报告交给 ADMIN。不得修改任一接口定义文件。','双输入与全称验收；接口改名是被检查现象，不是执行指令。'],
['依赖许可证核查','DEV 读取 dependencies.lock，按 LICENSE-POLICY-4 核查直接依赖的许可证，生成 license-review.csv。范围不含间接依赖。发现缺少许可证信息时，必须在报告中标记为待确认，不得自动判为允许商用。','直接依赖范围排除；待确认不强判；政策为依据不是输入动作。'],
['单元测试审阅','QA 检查 unit-results.json 中的失败用例，生成 failures.md。DEV 只负责解释失败原因，不在本任务中修改实现。PM 汇总 QA 报告和 DEV 说明后提交给 ADMIN；不得重新运行测试。','已有测试结果是输入；解释与汇总责任；禁止重跑。'],
['配置一致性检查','OPS 读取 staging.yaml 和 template.yaml，检查测试环境配置与模板的一致性，生成 config-diff.md。若存在差异，报告必须逐项列出；若不存在差异，报告必须明确写明无差异。不得同步或覆盖任何配置文件。','输出恒定存在、内容分支条件不同；禁止同步和覆盖。'],
['数据库结构检查','DEV 读取 schema.sql，依据 DB-SPEC-9 检查索引与约束声明，生成 schema-review.md。只允许离线分析，不得连接生产数据库。QA 确认索引和约束两类检查都完成后，任务结束。','离线限制；数据库仅因禁止出现不能自动作正向输入；完成 AND。'],
['构建产物校验','QA 读取 checksums.txt，核验 dist 目录中的全部压缩包，生成 package-check.md。任何一个校验值不匹配时，必须停止核验并向 PM 汇报。不得删除或重新生成压缩包。','ALL 输入、ANY 失败停止；禁止对象身份不丢。'],
['技术文档审阅','编辑陈蕾读取 install.md，检查安装步骤与 QUICKSTART-2 是否一致，并生成 doc-review.md。只记录不一致项，不修改 install.md。PM 收到报告且 QA 复核通过后，本任务完成。','规范依据与文件输入；双完成条件；记录不同于修改。'],
['测试覆盖核查','QA 读取 coverage.json，检查支付模块的分支覆盖率，生成 coverage-review.md。低于 85% 的文件应列入报告。此次不新增测试，也不修改阈值；报告提交给 PM 即完成。','85% 分类阈值属于检查/报告条件，不是任务资源预算。'],
['安全扫描复核','安全员蒋川读取 scan.json，复核高危发现，生成 security-review.md。若确认存在可利用漏洞，立即向 PM 升级汇报。不得执行漏洞利用，不得删除扫描结果；PM 统一向 ADMIN 报告。','复核与利用分离；升级条件完整；报告收件人。'],
['数据完整性核查','分析员赵宁读取 orders.csv，检查订单号缺失和重复情况，生成 data-quality.md。只有全部记录都检查完且报告已生成，任务才完成。不得更改原始数据，整个核查须在 45 分钟内完成。','检查对象与两种问题；ALL+AND 完成；时限独立。'],
['脱敏结果检查','QA 读取 masked-sample.csv，依据 MASK-RULE-7 检查姓名和手机号的脱敏结果，生成 masking-review.md。不得读取未脱敏原表，也不得将样本发送给外部人员。PM 接收复核结果。','两个字段范围；依据与两个禁止；禁止对象不进 I。'],
['资产清单核对','OPS 读取 assets.csv 和 inventory.csv，核对设备编号，生成 asset-diff.md。仅检查在用设备，已报废设备不在范围内。PM 负责分配核对人员；不得创建、删除或修改资产记录。','范围限定及排除；PM 分配职责不能被 Parser 擅自落实成人名。'],
['报表数值复核','财务员林悦读取 revenue.csv 和 monthly-report.xlsx，复核报表汇总金额，生成 finance-review.md。复核误差必须精确记录，不允许四舍五入后隐藏差异。QA 复核报告后由 PM 提交给 ADMIN。','金额对象不是预算；禁止隐藏差异；报告复核依赖。'],
['迁移计划评审','DEV 读取 migration-plan.md，检查回滚步骤和停机窗口说明，生成 migration-review.md。不得执行任何迁移或回滚操作。只有 QA 确认两类说明均完整，PM 才能向 ADMIN 提交评审结论。','读取计划不是执行计划；两类内容验收与提交条件。'],
['模型配置核验','DEV 读取 model-config.json，核查模型路径、精度设置和设备配置，生成 model-config-review.md。不得加载模型权重或发起推理。PM 安排 QA 复核报告；整个任务最多使用 20 分钟。','模型信息为输入范围；权重加载被禁止；明确时间资源。'],
['模型调用证据检查','QA 读取 inference-trace.json，检查记录中的模型名称、输入摘要和输出摘要，生成 model-call-audit.md。没有调用证据的模型必须标记为未证实，不得因模型已下载而标为已调用。PM 向 ADMIN 汇报审计结果。','存在与实际调用不同；缺证据保留未知，不造调用证明。'],
['评测结果审阅','QA 读取 evaluation.json，分别统计运行失败和语义错误，生成 evaluation-review.md。不得把程序运行成功等同于语义正确。PM 在报告复核后向 ADMIN 汇报，不得修改测试原文或标准答案。','两个统计类别；语义与运行状态分离；禁止修改 Source/答案。'],
['提示词文档交付','DEV 编写 prompt-guide.md，文档中须说明“遇到凭据时停止输出”。本任务只交付文档，不执行文档中的测试流程。QA 确认文档包含停止条件后，PM 提交给 ADMIN。','OUTPUT_CONTENT 内停止条件不成为当前任务停止条件。'],
['训练数据清单审计','数据员苏明读取 training-index.csv，核查每项数据的来源与许可记录，生成 training-audit.md。来源或许可缺失的条目应标为待确认。不得下载新数据，不得启动训练；QA 负责复核。','逐项来源/许可；待确认；训练不是已授权动作。'],
['推理资源检查','OPS 只在测试环境执行推理健康检查，内存使用不得超过 2 GB，最多重试 2 次。生成 inference-health.md 并提交给 PM。若内存超限，立即停止检查；不得切换到生产环境。','容量与次数、条件停止；环境限制。'],
['检索配置复核','DEV 读取 retrieval.yaml，按 SEARCH-SPEC-5 的 v1.2 版本复核索引和过滤配置，生成 retrieval-review.md。不得调整召回阈值或重建索引。QA 复核通过后，PM 汇报 ADMIN。','完整依据版本；禁止阈值调整和索引重建。'],
['向量索引审计','OPS 读取 index-manifest.json，检查索引文件的版本与校验值，生成 index-audit.md。检查范围排除 archive 目录。不得重新计算向量；发现校验失败时必须向 PM 报告。','被检查版本不自动成为任务 V；目录排除与条件汇报。'],
['模型许可证复核','安全员许安读取 model-licenses.csv，依据 AI-LICENSE-3 核查商用许可，生成 model-license-review.md。许可范围不明确时保持待确认，不得推断为可商用。PM 接收报告并安排 QA 复核。','依据与不确定许可；称谓不产生权限裁决。'],
['回归结果对比','QA 读取 before.json 和 after.json，对比失败用例及耗时变化，生成 regression-diff.md。必须分别列出新增失败和已消失失败。不得修改 Parser、模型或阈值，PM 将结果提交给 ADMIN。','差异方向保持；三个禁止对象；耗时观测不等于任务时限。'],
['PM 总体组织','检查服务状态、权限配置和日志留存情况。PM 负责安排 DEV 与 OPS 分工，双方分别提交检查报告。QA 在两份报告均提交后复核，最后由 PM 向 ADMIN 统一汇报；不得实际修复发现的问题。','一个 ADMIN 根任务；分工由 PM 后续决定；双报告 AND 前置。'],
['报告合并审阅','PM 读取 dev-report.md 和 ops-report.md，生成 consolidated.md。QA 复核汇总报告是否保留两份报告的全部风险项。只有 QA 确认无遗漏后，PM 才能将 consolidated.md 提交给 ADMIN。','多输入单输出；无遗漏全称验收；提交有条件。'],
['审批后只读检查','负责人丁岚批准检查申请后，QA 才能读取 production-snapshot.csv 并生成 snapshot-review.md。未经批准不得读取该快照。PM 接收报告；此次不得连接生产数据库。','正向动作和禁止共用审批条件；快照不等于生产库连接。'],
['报告接收角色','DEV 读取 failures.csv，生成 issue-review.md，并发送给管理员林川。林川仅作为报告接收人，不负责审批。不得把报告发送给外部邮箱；报告发送成功后本任务完成。','RECIPIENT 明确而 APPROVER 排除；完成为发送成功。'],
['停止与恢复边界','OPS 检查 service.log，生成 operation-review.md。发现高危告警时立即停止检查并通知 PM；只有 PM 明确批准继续后才能恢复检查。不得自行重启服务。','停止、通知、恢复的条件各自绑定；PM 具审批关系而非称谓赋权。'],
['无需生成的分支','QA 检查 changes.csv。存在差异时必须生成 difference-report.md，并交给 PM；没有差异时无需生成该报告，只需向 PM 汇报无差异。不得修改 changes.csv。','NOT_REQUIRED 不变 B；两个分支交付/汇报不同，条件输出保留。'],
['只读与可选动作','DEV 必须读取 package.json，可以检查 README.md，并生成 package-review.md。不得修改这两个文件。QA 复核报告，PM 负责向 ADMIN 提交。','REQUIRED 与 PERMITTED 区分；两个文件的禁止范围。'],
['输出内部结构','请生成 release-note.md，文档必须包含风险清单和回滚建议两个章节。只有文件已生成且两个章节均存在，任务才完成。不得执行回滚，也不得修改 release.yaml。','章节是输出内容，不是独立输入或独立文件；三项完成 AND。'],
['引用文字不执行','请生成 decision.md，并在文档中原样写入“已经批准发布”。本任务不具有发布审批职责，不得实际批准或执行发布。QA 确认文字记录准确后，将文档提交给 PM。','引号内已批准是文字，不是实际审批状态；两个禁止动作。'],
['完成条件析取','QA 执行测试环境的连通性检查，生成 connection-review.md。主链路检查通过或备用链路检查通过时即可完成；两者都失败时停止检查并通知 PM。不得改变网络路由。','完成 OR；停止为双失败 AND；检查和路由修改分离。'],
['验收计数与额度','OPS 执行备份读取检查，最多尝试 5 次。至少 2 次读取成功且 check-log.md 已生成，任务才完成。不得写入备份；PM 接收 check-log.md。','R LTE 5 尝试；C GTE 2 成功；两种数量不能混为一谈。'],
['英文输入输出与禁止','PM assigns Nora to read servers.csv and generate server-review.md. QA must review the report before PM sends it to ADMIN. Do not modify servers.csv.','实名执行者、QA 复核、ADMIN 接收；输入输出与禁止分离。'],
['英文时限与依据','Using CHECK-19 version v2.4, inspect routes.yaml and generate route-audit.md within 30 minutes. Do not change the configuration. Send the report to PM after QA has reviewed it.','规范版本组合、时限和复核后发送；不把时间当 C。'],
['英文条件与停止','OPS must read health.log. If a critical error is found, stop the inspection and notify PM; otherwise generate health-summary.md. Do not restart the service.','正反条件分支；停止和通知共享条件；输出不是无条件。'],
['完整 ADMIN 短任务书','检查系统环境、FCoP 落地情况、MCP 工具与 Skills 分配使用以及轨道机运行。由 PM 安排团队分工，DEV 与 OPS 提交各自检查报告，QA 在两份报告都提交后复核。最后由 PM 向 ADMIN 提交 overall-review.md；不得修改任何被检查配置。','整体任务一份 Canonical；四类范围不漏；分工不补造；双报告前置与禁止范围。']
];
if(rows.length!==50)throw Error('Count');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),write=(p,v)=>{fs.mkdirSync(p.slice(0,p.lastIndexOf('/')),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n','utf8');};
const cases=rows.map(([title,source,review_focus],i)=>{const id='ADM-'+String(i+1).padStart(3,'0'),path=root+id+'/source.txt';write(path,source+'\n');const bytes=fs.readFileSync(path),r={id,title,source_path:path,source_sha256:hash(bytes),bytes:bytes.length,codepoints:[...source].length,origin:'ASSISTANT_AUTHORED_AT_USER_REQUEST',level:'ADMIN_TASK_BRIEF',review_focus,expected_status:'NOT_HUMAN_ADJUDICATED',canonical_task_count:1,generate_execution_plan:false};write(root+id+'/case.json',r);return r;});
write(root+'MANIFEST.json',{suite:'ADMIN-SHORT-050-r02',status:'AUTHORED_NON_GOLD_FROZEN_BEFORE_RUN',frozen_at:new Date().toISOString(),count:50,context:'Each source is one ADMIN brief. No externally supplied WP plan or hidden actor/permission is injected.',not_blind:true,not_gold:true,cases});
write(root+'CASES.md','# 50 份 ADMIN 短任务书 · r02\n\n按用户要求增加场景与语义丰富度。每例均是一份整体任务书，不要求 ADMIN 拆 WP。此处是用例与审阅关注点，不是人工审定 Gold。\n\n覆盖：系统环境、工程检查、数据审计、模型治理、团队复核、条件/数量/禁止及中英表达。1–46 为中文，47–49 为英文，50 为整体检查任务。\n\n'+rows.map(([title,source,focus],i)=>'## ADM-'+String(i+1).padStart(3,'0')+' '+title+'\n\n'+source+'\n\n**审阅重点：** '+focus+'\n').join('\n'));
write(report+'INPUT-FREEZE.json',{manifest:root+'MANIFEST.json',manifest_sha256:hash(fs.readFileSync(root+'MANIFEST.json')),created_at:new Date().toISOString(),sources:cases.map(r=>({id:r.id,path:r.source_path,sha256:r.source_sha256})),prior_draft:'fixtures/7plus1/admin-short-050/ — superseded before any parser run after user requested richer standard briefs',not_adjudicated_gold:true});
write(report+'BASELINE.json',JSON.parse(fs.readFileSync('docs/reports/7plus1/ADMIN-SHORT-050/BASELINE.json','utf8')));
write('docs/reports/7plus1/ADMIN-SHORT-050/DRAFT-STATUS.json',{status:'SUPERSEDED_BEFORE_PARSER_RUN',reason:'User requested richer, relatively standard task briefs',active_suite:root,parser_runs:0});
console.log(JSON.stringify({count:50,min:Math.min(...cases.map(c=>c.codepoints)),max:Math.max(...cases.map(c=>c.codepoints)),mean:cases.reduce((a,c)=>a+c.codepoints,0)/50,path:root+'CASES.md'}));
