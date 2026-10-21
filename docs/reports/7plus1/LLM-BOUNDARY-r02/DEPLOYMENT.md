# ui88：实际安装与页面验收

2026-10-14 12:49（北京时间）实际入口为http://127.0.0.1:58618/，页面v0.1.88候选；完整版本`0.1.0-candidate.031-r1.2-ui.88`，编译器`llm-boundary-r02.2-test`，合同`candidate-ir/2.0`。产品状态仍WAITING_ADMIN_REVIEW，不是公开发布或任意文本准确性认证。

## 使用与运行包

原启动命令保持不变：在`D:\boundx`执行`npm run 7plus1:ui`。本次实际启动和重复启动均验证：重复执行返回already_running，不启动混版服务。重启电脑后执行同一命令；无需打开开发候选目录。运行只读取完整安装中的Core、两个Skill、同版合同/Schema和原UI。

完整候选包位于`D:\boundx\.boundx\ir-kernel-implementation-v1\products\0.1.0-candidate.031-r1.2-ui.88`；实际安装位于`D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2-ui.88`。244个登记文件，源码735de8cfd6620c0a29156df3f1738e4c042ae886；manifest SHA256为22c0bcfe928b41e6bc54f9b076e570ae50ede475e07b93cfdd16823bde2c7b63。没有依赖主工作区已有的203项改动完成模型验证或安装。

页面可选择Skill/skill1、模型和推理强度，显示实际当次设置、两次模型产物、技术校验、IR、7+1及数学复核。查看历史是只读行为，不重新调用模型。请将正常分支有限见证、原文准确性核对和实际业务完成分开理解。

## 实际升级顺序

首次部署核查发现原ui85用户请求仍在AUDITING，未打断。该请求自行结束后复核空闲、实际版本及端口进程身份，先备份配置/指针/全部历史并逐摘要验证，再正常停止唯一目标进程。未操作其他Codex或服务，未使用此前被拒绝的隐藏后台启动命令。

停止前备份：`D:\boundx\.boundx\short-compiler-031-r1\backups\ui88-prestop-2026-10-14T04-44-37.172Z`。安装器备份：同目录`2026-10-14T04-44-57.747Z`。原配置摘要及2378份既有data文件全部一致。完整包依赖离线安装及文件摘要校验通过，指针从ui85更新为ui88，previous为ui85。

原本地启动入口先做字节备份，仅增加ui88的ASCII版本登记，其余原字节保持。开发工作区未reset/clean/stash或整体覆盖。

## 页面、历史、导出与实际001结果

真实r05模型测试通过CLI完整运行，原始产物已按`LOCAL_CANDIDATE_ACCEPTANCE_CLI`标记复制到本地只读历史；不是另一次UI模型请求，也没有重新生成语义。记录ID为`85b00873-21d9-489b-a286-02e907881391`，时间2026-10-14T04:21:39.048Z。历史由96项增至97项，旧结果原样保留。

实际浏览器第一次查看发现本次CLI导入元数据把资源列表数组当成UI资源证据对象，触发`.map`展示错误。已保存首次元数据，逐项核对实际请求资源摘要一致，只修正该导入记录的资源展示封装并在空闲下重新载入同一ui88服务。没有修改运行包、Skill、IR、原回答、中文、7+1、数学操作数或评分，也没有新增模型调用。之后页面实际显示“编译流程完成 · 已用650秒”，无浏览器error日志。

最终数学卡片实际显示：模型SAT，Core有限见证满足全部声明IR约束，13/13计算已复核、31条完整见证要求满足。原文依据、角色、数量、条件和禁止的人工对照见SOURCE-COMPARISON-r05.json。定性“立即”及现实观测限制仍明确展示。

页面、会话、六项页面资源HTTP均200。API中的IR、7+1 JSON、中文、完整Trace和计算导出与实际原始产物一致；实际浏览器点击“导出7+1 JSON”下载后逐对象比对一致。页面数学卡片截图和在线检查位于本地`.boundx/ir-kernel-implementation-v1/evidence/llm-boundary-r02-live/PAGE-ui88-MATH.png`及ONLINE-CHECK-FINAL.json；最终证据摘要另存DEPLOYMENT-CHECK.json。部署新增被测模型0。

## 回滚

确认58618无在途请求，再停止已核实的当前服务；不要停止其他进程。在安装包目录调用现有`product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle`，指针回到previous ui85；然后回到`D:\boundx`执行`npm run 7plus1:ui`。回滚不删除配置、历史或本次真实产物；备份另行保留。

本次未实际触发回滚，因为部署检查通过；既有回滚实现及备份就绪，不将“备份存在”冒称实际回滚运行已测试。只推review/7plus1-parser，不merge、release、tag或触发Actions。停止于WAITING_ADMIN_REVIEW。
