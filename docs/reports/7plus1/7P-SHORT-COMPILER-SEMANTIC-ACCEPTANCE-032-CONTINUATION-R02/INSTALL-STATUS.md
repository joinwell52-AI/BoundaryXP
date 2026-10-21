# 同版032.3候选与当前用户安装

本轮语义质量门未通过，候选**没有部署**。最终58618无监听；完整安装指针仍是`0.1.0-candidate.031-r1.2`，前一版`031-r1.1`保留。本轮不启动或回滚用户服务。

电脑重启后原启动命令：

```bat
cd /d D:\boundx
npm run 7plus1:ui
```

正常启动后地址：http://127.0.0.1:58618/ 。该启动器绑定旧完整安装，不读取032开发Skill/Schema。不要把开发CLI与旧安装混称同版。安装版CLI为：

```bat
npm run 7plus1:installed -- --input task.txt --output new-run-directory
```

032.3包沿用：[BoundaryXP-short-compiler-0.1.0-candidate.032.3.zip](../7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG/delivery/BoundaryXP-short-compiler-0.1.0-candidate.032.3.zip)。摘要：`1e65b9598d85788e0e9cc96cd07db3a9a09c17a207e009e3fb701d4ab05e5dd3`。包内有实际核心、两Skill、合同/Schema、原UI和依赖锁；无权重、凭据、缓存、私人历史或160项脏工作区。没有重新打包。

可在干净目录解压作无模型核验，不能作为质量通过或升级授权：

```bat
npm ci --omit=dev --ignore-scripts
npm run verify
```

前提为Windows、Node≥22.18和既有正常Codex登录。实际模型配置保持gpt-6.1-sol/medium。当前有workspace routing传输故障，没有通过修改TLS/代理/账号/计费通道绕过。

后续只有质量门通过、真实目标PID/版本/在途请求核对、完整备份及正常权限允许，才执行包内原有升级模块并固定58618；未授权阶段不执行：

```bat
node product/short-compiler/deploy.mjs upgrade --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle
cd /d D:\boundx
npm run 7plus1:ui
```

若获准升级后部署检查失败，确认真实目标空闲并按正常许可停止该实例，再使用同一完整安装模块回滚：

```bat
node product/short-compiler/deploy.mjs rollback --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle
cd /d D:\boundx
npm run 7plus1:ui
```

不杀未知进程、不用新端口、不混用新Skill旧核心、不重算历史。以上是既有维护流程说明，本轮升级、回滚与部署后D08均未执行；测试home的历史工程验证不等同真实用户入口部署。
