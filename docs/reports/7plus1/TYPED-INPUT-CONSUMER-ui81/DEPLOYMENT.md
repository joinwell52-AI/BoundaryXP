# ui81 本地部署与回放记录

2026-10-13 12:53（UTC+8）完成同一 58618 的受控更新。

- 运行地址：`http://127.0.0.1:58618/`，HTTP 200；浏览器实见 `v0.1.81 · 候选`。
- 完整版本：`0.1.0-candidate.031-r1.2-ui.81`；Core `direct-ir-r05.4-test`；合同 `candidate-ir/1.4`。
- 源码提交：`535df8dc142d39c4c419f3507d023314c5ffa3bf`。
- 完整包：`D:/boundx/.boundx/products/0.1.0-candidate.031-r1.2-ui.81`。
- 安装目录：`D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.81`。
- Manifest SHA256：`caed5ad1a0c867b169296aeb4ee4f04e64226fe897539619ffc088dc9c4708ed`。

干净目录安装及实际安装各自核对 206 个资源。25 个 Skill、合同和 Schema 相关资源与 ui80 摘要一致。无新模型调用。干净安装中的 CLI 回放与同源 JSON、中文核对得到输入 3、并集 5。两次 002 原始 IR 与审阅保持不变，回放数学结果见 REPORT.md。

停止前已确认无活动请求、监听 PID 28304 为目标 node UI，完成原配置、版本指针与数据备份。正常停止该进程后安装；新 UI PID 10828，启动日志与 API Manifest 一致。第一次健康探测发生在启动完成之前，连接未就绪；随后服务正常就绪，页面与会话均核对成功。未停止其他服务，未新增端口。

前后 API 历史均 83 条（含旧兼容记录），当前 data/runs 中 42 份 run.json 及存在的 Trace、原文摘要全部一致；配置摘要一致。中文、7+1 JSON、完整 Trace JSON/Markdown/HTML、计算 JSON 共六种导出 HTTP 200。原 Skill1 历史调用回执现在能完整读取三次，包括 36.330 秒局部修订。

**旧历史计算结果仍是当次快照，不会被新版本静默重写。** 新版冻结响应回放另存在：

```text
D:/boundx/.boundx/typed-input-repair-20261013/installed-replay/
D:/boundx/.boundx/typed-input-repair-20261013/live-installed-verification/cli-replay/
```

验证证据：同目录 `LIVE-CHECK.json`、`clean-verification/INSTALL-CHECK.json`、`installed-replay/VERIFICATION.json`、`live-installed-verification/INSTALL-CHECK.json`。历史原件、首次失败和补丁未应用情况均保留。

## 启动与回滚

电脑重启后：

```text
cd D:\boundx
npm run 7plus1:ui
```

备份：`D:/boundx/.boundx/short-compiler-031-r1/backups/2026-10-13T04-53-23.465Z`；停止前备份：`D:/boundx/.boundx/typed-input-repair-20261013/pre-stop-backup`。

如需回滚，先核对 58618 实际进程和无在途请求，只停止目标 UI；在上述完整包目录执行：

```text
node product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle
node product/short-compiler/deploy.mjs start --home D:/boundx/.boundx/short-compiler-031-r1
```

当前 previous 为 ui80，回滚不重算或删除历史。本次依赖安装仍报告既有 3 项 npm 审计告警（2 moderate、1 high），未自动改依赖。

状态：WAITING_ADMIN_REVIEW。输入汇总、完成公式消费者、修订计时缺陷已关闭；动态重试实例和模型语义覆盖缺口未冒称解决，完整产品语义验收尚未通过。
