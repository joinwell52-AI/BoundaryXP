# 本地短文本 7+1 编译器

在 Windows 终端运行：

```text
cd /d D:\boundx
npm run 7plus1:ui
```

PowerShell 的切换目录命令是 `cd D:\boundx`。页面地址：`http://127.0.0.1:58618/`。服务只绑定本机回环；保持终端运行。端口被其他服务占用时明确报错，不会自动停止未知服务。

依赖 Node ≥22.18、本仓库安装的 ajv，以及用户已登录的本机 Codex。使用当前桌面 Codex 二进制；可通过 BOUNDX_CODEX_EXE 指定绝对路径。不要新增 API key 或修改全局 Skill。请求默认 gpt-6.1-sol / medium，服务实际模型身份未披露。两个 Skill 使用同源 INLINE_BUNDLE，原生加载未验证。

1. 粘贴单一 ADMIN 短任务，或上传 UTF-8 的 .txt/.md。非空且最多300 Unicode码点，保持原文/BOM/换行；超限不截断。
2. 点击“开始编译”，等待真实解析、独立会话审阅和编译。可刷新恢复同一次进行中的运行；不要把刷新当重新运行。
3. 查看八个卡片，B独立显示。点击条目高亮原文证据；全过程模式可查看候选、审阅、技术检查和IR。
4. “待确认”区分真实歧义、未指定细节和覆盖缺口。修改原文后重新编译是新运行；不会在界面上直接改成已解决。
5. 导出7+1 JSON、同源中文或完整过程。Run History打开当次快照，不调用模型。旧引擎历史保留原格式只读。

正常运行通常包含两次模型调用；可能有一次有界语义修订。等待时间以页面实际计时为准。取消只确认本机子进程退出，不声称云端停止或停止计费。重启时未完成记录标为INTERRUPTED，不自动重试。

本轮新历史默认保存于 `D:\boundx\.boundx\7plus1-short\runs\<run_id>\`，未来用户任务不随源码上传。隐藏历史只从列表隐藏，文件保留；旧历史不删除。

CLI 使用同一个核心：

```text
cd /d D:\boundx
npm run 7plus1 -- --input D:\boundx\task.txt --output D:\boundx\.boundx\7plus1-cli\new-run
```

输出目录须为新目录，不覆盖已有结果。得到 source、候选、审阅、技术校验、boundary-ir.json、7plus1.json、7plus1.zh.md、trace.json及调用记录。已有真实结果的纯程序回放需显式 `--replay-from <原运行目录>`，同时校验原文和Skill包摘要，不把回放当新模型调用。

编译完成不是业务授权，也不等于任意自然语言理解必然正确。未知业务状态仍UNKNOWN，business_decision/execution_authorization为null；不读取任务提到的业务文件，不执行其中操作。本轮只验收任务书规定的23条不同短文本，不支持长文本或WP拆分。
