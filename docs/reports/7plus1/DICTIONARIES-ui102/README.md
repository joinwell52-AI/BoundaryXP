# ui102：L2/L3按需字典接入

58618设置增加行业字典L2、企业字典L3两个下拉框，均可不启用。生成与独立审阅绑定同一选择及资源摘要，不将整包内容注入提示词。

## 已接入资源

- L2：现有software-ai 0.2.0，行业动作、对象、岗位、资源、风险提示、完成概念与版本引用。
- L3：现有tenant-a 0.2.0、tenant-b 0.1.0虚构名册；example-software-team 0.1.0企业别名示例。
- L3明确标注虚构测试。未新增真实企业资料；尚无crm-prod或核心模块目录的已确认映射。
- 旧资源按原字节打包。词条里的历史分类、岗位、风险及投影提示不是本次ADMIN授权，不生成新的禁止或责任。

## 运行路径

设置选择 → 服务端检查允许的包ID → 保存版本和摘要 → 生成LLM按需lookup → 新会话审阅LLM按需lookup → 保存报告、审阅、查询回执并展示。

使用本机stdio MCP，无新增监听端口。工具只接收短查询、已选包ID和分页位置，不接收文件路径、不联网、不修改字典。未命中返回空结果和明确说明；共享别名返回多个候选，不自动选人。查询结果记录原文件摘要及JSON pointer。

本次保存dictionary-selection.json、dictionary-snapshot.json，以及两阶段每次请求的dictionary-lookups-N.jsonl。最终Trace带dictionaries与dictionary_lookups；页面、Markdown和JSON导出保留实际选择和查阅记录。选中包不等于模型已经查询。历史结果不改写。

L2/L3只提供释义和企业上下文。Core没有新增模型或网络调用；目前仍不代表PM规划已核验，也不是语义完整性证明。

## 验证范围

`node --test tests/boundary-dictionaries.test.mjs tests/boundary-report.test.mjs`：11项无模型测试通过，覆盖选择校验、企业隔离、歧义、未命中、分页、真实stdio握手、生成/审阅共用快照、HTTP入口与请求幂等、历史报告和导出回归。

`node tests/dictionary-codex-transport.mjs`：实际本机Codex app-server识别boundx_dictionary.lookup，server toolsError为null；仅初始化和发现工具，无turn/start、无模型调用。一次探针尝试使用了该子命令不支持的ignore-user-config参数，失败后改用临时命令行覆盖；不修改用户配置。最终成功不覆盖首次失败记录。

本轮未新增真实生成/审阅模型调用；接入后的语义正确率、模型是否恰当查询及延时由后续用户实测记录，不能沿用ui101成绩冒充ui102验收。

MCP配置依据：[OpenAI Docs](https://developers.openai.com/codex/mcp)。配置仅在当前子进程argv中，保留登录、模型和原有禁用工具策略，仅开放字典lookup。

状态：WAITING_ADMIN_REVIEW。无合并、公开发布或tag。

## 本地安装与页面检查（2026-10-15）

- 实际运行版本：0.1.0-candidate.031-r1.2-ui.102；核心boundary-report-r02-dictionaries。
- 构建源码：ecbfa564ccd582d354bd535c8c26e5876621a575，source_runtime_clean=true。
- 安装manifest SHA256：8b543fc55341b2897f4b8c31a10f0d59e699b2da56c30cc7bac3fb816f704247。
- 包含274个受摘要保护的文件，独立依赖安装及14个离线HTTP处理检查通过；旧报告只读回放保持来源和报告。
- 更新前确认58618无运行请求，备份current/config及data到 `.boundx/short-compiler-031-r1/backups/2026-10-15T05-11-09.310Z`。
- 更新后仍有178条历史，4838个数据文件逐摘要比较无变化。
- 实际浏览器显示v0.1.102，L2/L3选项正确；选择软件行业与企业A后刷新保持选择；测试后恢复为不启用。未点击开始编译，浏览器错误日志为空。
- 正常启动仍为根目录 `npm run 7plus1:ui`。原入口文件在替换前完整保留，其他本地改动不重置。
- 回滚：先确认无活动请求并停止已识别的58618进程，再执行安装包deploy.mjs的rollback操作（home为现有short-compiler-031-r1，confirmed-idle），随后正常启动。previous指针为ui101，历史数据不重算。

实际验证附件：UNIT-TESTS.txt、CODEX-MCP.txt、PACKAGE-VERIFICATION.json、DEPLOYMENT.json。界面截图保存在本地evidence/dictionaries-ui102/settings.png。未提交真实用户任务正文或登录资料。
