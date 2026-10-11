# 58618 已升级 ui.42

按用户“直接升级”的明确授权，将同一个 58618 入口从 ui.40 更新到 `0.1.0-candidate.031-r1.2-ui.42`，编译器 `031-r1-c16`，合同 `031-r1.1`。页面仍如实标记候选及 PARTIAL，部署通过不等于全部语义验收。

停止前核实监听进程 18272 及父进程 8480 的 ui.40 安装路径，两次核对无在途请求；备份 880 个历史文件并逐摘要核对。仅停止这两个已确认目标，旧版本、配置、历史保留。

安装成功。首次后台启动与 npm 入口启动发生竞争，后台进程报 PORT_IN_USE 并退出；npm 启动成功的监听进程为 19168，没有改用其他端口。再次执行 npm 入口返回相同版本 already_running。

实际 HTTP 验证：会话摘要与完整安装一致，页面及三项 JavaScript 资源摘要一致，61 条历史保留；既有 JSON、中文、Trace 和计算导出均 HTTP 200。没有新增模型调用，没有声称实际浏览器点击验证。

地址：http://127.0.0.1:58618/ 。刷新页面后使用新版开始新编译，旧记录保留旧版本结果，不静默重算。

重启电脑后，在 `D:\boundx` 执行 `npm run 7plus1:ui`。

回滚：先确认没有在途请求，仅停止核实身份的 58618 服务，再运行 `node .boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.42/product/short-compiler/deploy.mjs rollback --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle`，随后执行同一 npm 启动命令。回滚目标 ui.40，历史保留。

语义修复及剩余问题见 BOUNDARY-CONSUMER-REPAIR-r04/REPORT.md。仍有真实未决及计算 PARTIAL，没有将它们改写为完整通过。
