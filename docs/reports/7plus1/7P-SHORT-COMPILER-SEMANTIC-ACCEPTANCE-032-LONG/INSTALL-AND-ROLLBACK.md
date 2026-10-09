# 032候选运行包与固定入口

当前运行包：`0.1.0-candidate.032.3`，核心`032-c3`，合同`032.1`。声明范围为非空、≤300码点的单一ADMIN短任务。**本轮语义质量门未通过，候选未安装到58618；不得把以下维护说明当作当前升级已经获准实施的回执。**

包文件：[BoundX-short-compiler-0.1.0-candidate.032.3.zip](delivery/BoundX-short-compiler-0.1.0-candidate.032.3.zip)。SHA-256：`1e65b9598d85788e0e9cc96cd07db3a9a09c17a207e009e3fb701d4ab05e5dd3`。包不含模型权重、依赖缓存、凭据、私人历史或开发工作区的160项原有改动。包内包含实际唯一核心、两Skill、合同/Schema、原UI、锁定依赖清单及中文使用说明。

## 当前用户入口

当前完整安装指针仍为`0.1.0-candidate.031-r1.2`、核心`031-r1-c3`、合同`031-r1.1`。最终核查58618无监听，**没有报告已上线或已恢复**。本任务未重新启动旧服务或切换指针。

电脑重启后的既有启动命令：

```bat
cd /d D:\boundx
npm run 7plus1:ui
```

该命令启动上面的完整旧安装；正常启动后固定地址为 http://127.0.0.1:58618/ 。安装版CLI使用同一版本：

```bat
npm run 7plus1:installed -- --input task.txt --output new-run-directory
```

开发入口`npm run 7plus1`与旧安装不是同一版，不可混称。既有登录和用量仍是模型运行前提；本轮真实传输故障没有通过更换账号、TLS设置、代理或模型绕过。

## 解压核验与依赖

将zip解压到独立干净目录，不覆盖旧安装。在包根核验及安装依赖：

```bat
npm ci --omit=dev --ignore-scripts
npm run verify
```

Windows、Node≥22.18、现有Codex CLI登录为运行前提。可设置进程级`BOUNDX_CODEX_EXE`指向既有二进制；不改全局账号配置。离线核验和干净安装已实测；真实路由已在一次有界核查中恢复；新版Skill完整验收因剩余预算不足未运行。不得通过安装包自动补足额度或放宽校验。

## 后续受控升级与回滚步骤（本轮未执行）

只有G1–G6完成、目标实际PID/版本已核实、无在途请求、正常权限允许时，先备份`current.json`、`config.json`及配置中实际data_dir。只停止已确认的目标实例；拒绝不能换命令或工具绕过。保持原UI、配置和历史。

在已核验候选包根执行既有安装模块，固定home和端口，不新增用户端口：

```bat
node product/short-compiler/deploy.mjs upgrade --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle
cd /d D:\boundx
npm run 7plus1:ui
```

完成后核对页面会话、完整Manifest、两bundle、D08真实编译及同版JSON/中文导出。本轮G3/G4未通过，**不执行上述升级**。

如维护后出现回归，核实目标空闲并正常停止该实例，再从同一完整安装的deploy模块回滚：

```bat
node product/short-compiler/deploy.mjs rollback --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle
cd /d D:\boundx
npm run 7plus1:ui
```

回滚切换完整版本，不将新Skill混入旧核心，不重算历史。以上安装、资源隔离、备份及回滚只在自有干净测试home实测，没有读写用户私人历史。
