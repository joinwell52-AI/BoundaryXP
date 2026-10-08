# 031-R1：58618固定入口恢复

PORT_58618_RESTORED=true。实际地址：http://127.0.0.1:58618/。

运行版本0.1.0-candidate.031-r1.2，编译器031-r1-c3，语义合同031-r1.1。安装目录D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2。核心、两个Skill、合同、Schema和原UI均来自这一完整安装快照，35项摘要未变。Q05候选未安装，语义仍PARTIAL/REVIEW_REQUIRED；PRODUCTION_READY=false。恢复入口不代表语义验收通过。

## 实际操作与保护

安全fetch并fast-forward到f039fb2639cadecc8fa6f00bbf6dad8cac48c55b，只带入本维护Task和CURRENT-TASK变更。没有reset、clean、合并main或暂存无关文件。原160项tracked改动及119080项untracked的摘要检查见PROTECTION.json。中文新增/变更使用apply_patch。

恢复前58618/58621均无监听者，没有待运行请求，针对候选启动路径未发现旧服务进程。本次不需要停止任何进程，没有操作历史PID27880。此前策略拒绝作为历史保留；本次正常启动工具未拒绝，没有替换工具、换端口或使用资源覆盖绕过拒绝。不停止58619、其他Node或Codex。

先将配置、指针、候选与原入口历史、旧历史、原启动脚本及package.json备份并逐文件核对摘要，再原子修改安装配置port=58618。data_dir、Codex配置及current.json保持原值。legacy_dir指向新建的旧历史只读副本，使用原来的LEGACY_READ_ONLY API，不合并当前候选运行、改写旧答案或重新调用模型。

备份目录：D:\boundx\.boundx\short-compiler-031-r1\backups\restore-58618-2026-10-08T14-27-08.963Z。

原入口16条运行记录保留为原字节只读快照，候选2条记录仍在自己的data目录。旧原生历史32个目录项完整保留，API按原规则仅展示UUID.json；全部只读列表合计41条，不谎称32项都能按新产品结果打开。原入口评价、日志和源文件均在原处及备份，未把私人运行原文复制到Git交付。

## 启动与回退

电脑重启后，在终端运行：

```bat
cd /d D:\boundx
npm run 7plus1:ui
```

在PowerShell终端先运行cd D:\boundx，再运行npm run 7plus1:ui。浏览器打开http://127.0.0.1:58618/。此入口仅做安装身份/端口探测，启动绝对安装路径deploy.mjs；不会导入开发区语义核心、选新端口或升级Q05。

本次实际运行npm run 7plus1:ui已识别完整同版本实例并正常退出，不重复启动。端口未知占用或版本/清单不符时拒绝，不自动杀进程或回退旧NLP。启动终端可见候选PARTIAL/REVIEW_REQUIRED状态。当前UI原资源仅显示“候选”及合同/版本；没有新增PARTIAL/Q05专用横幅，保留这一显示限制，不改冻结UI来冒充升级或验收。

回退本次入口维护时，须先通过正常许可核实并停止属于本安装且空闲的实例，恢复备份config.json（旧port58621与legacy_dir）及原package.json启动脚本；current.json本轮未改变，无需更换安装版本。候选data和原历史不删除、不重算。不得直接替换正在运行的配置或把这一说明当作停止未知服务的权限。本次未执行回退，电脑物理重启未实测。

## 真实无模型验收

实际监听127.0.0.1:58618，UI PID30152；其父PID10800从绝对安装目录deploy.mjs启动，父的父为本轮隐藏窗口启动器PID6584。进程命令证据见PROCESS.json。未新增端口，未停止任何旧服务。

| 检查 | 实际结果 |
|---|---|
| 新启动适配无模型测试 | 4 PASS，0 FAIL，0 SKIP |
| 原页面启动脚本断言及textContent安全检查 | 1 PASS，0 FAIL，0 SKIP |
| 页面/脚本/样式 | HTTP200，字节SHA与安装快照一致 |
| 会话、引擎、合同及两个Skill | c3/031-r1.1及完整清单一致，无混版 |
| 受保护接口 | 缺会话403、异源403、不支持字段400、缺请求ID400、错误内容类型415，均未启动解析 |
| 候选历史 | 2条保持原状态，无queued/running/cancelling |
| 原58618历史 | 16条通过只读API逐条与原字节内容核对 |
| 原始历史和备份 | 522项摘要一致；current.json及35项安装资源未变 |
| 导出 | 最终JSON、中文、Trace JSON/Markdown/HTML与原快照核对通过 |
| 同源冻结响应离线回放 | 原c3响应编译出的IR/7+1/中文完全相同，不新增历史，不计新模型准确性 |
| 真实页面 | 展开Run History，打开c3记录，核对8槽位/允许生成/无交付义务、点击证据、页面JSON下载匹配 |
| 重复启动 | 实际npm run 7plus1:ui返回already_running=true，零额外进程/模型调用 |

浏览器证据PAGE-TOP.jpg、PAGE.jpg，详细HTTP和摘要见VERIFICATION.json；下载摘要及交互说明见BROWSER.json。未点击“开始编译”。本轮真实模型调用=0，031-R1预算175/180与旧031预算239/240保持独立且未消耗。未重跑批量语义/旧350/Gold-60或全量模型回归；本轮transport改动以专项与真实入口验收为准，不沿用此前6689结果冒称本轮全量测试。

DOCUMENTATION-AUDIT.md是用户追加的只读文档检查：main与review产品首页/使用入口存在滞后；未借此改旧方法、README或安装快照。原030、031、031-R1、Q05报告和SEAL不改。

MANIFEST/SHA256SUMS/SEAL核对本次新增维护证据与必要启动适配；提交号由Git提交返回，不在封存文件中自引用。仅推送review/7plus1-parser，不merge/release/tag，不公开发布。

STOP_STATE=WAITING_ADMIN_REVIEW。
