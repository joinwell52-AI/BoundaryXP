# v0.1.84同入口候选安装

日期：2026-10-13。沿用ADMIN已授权的同产品修复、升级后继续测试路线；本次安装是开发候选，不宣称新资源的产品语义质量门通过。实际地址 **http://127.0.0.1:58618/**，版本 **v0.1.84**／`0.1.0-candidate.031-r1.2-ui.84`，编译核心 `direct-ir-kernel-r02-test`，合同 `candidate-ir/2.0`、资源修订r02。状态WAITING_ADMIN_REVIEW。

源码提交 `60b8fa6025f18434a4e3d25967a6fa3991baa18c`；干净运行源码构建，238文件完整manifest为 `0474c043650fcc37ec6fc56d95633f220720b4d27741bef8e8fb11c14bb04b72`。实际HTTP服务PID29216、父安装启动器PID30432。只监听127.0.0.1:58618。

完整运行包：`D:\boundx\.boundx\ir-kernel-implementation-v1\products\0.1.0-candidate.031-r1.2-ui.84`。

安装目录：`D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2-ui.84`。

在新目录从npm现有缓存离线安装18个依赖，未执行安装脚本。包完整性通过；CLI原响应回放正常；14项页面、会话与导出处理器检查通过（直接调用原HTTP处理器，未listen），详见PACKAGE-VERIFICATION.json。原006响应CLI回放仍PARTIAL、必要子问题SAT；原010响应包内回放为必要约束UNSAT，不改原语义预期。

切换前通过实际HTTP、监听端口及父子进程命令行核对旧ui83身份，确认无QUEUED／RUNNING／CANCELLING请求。先完整备份，再次核对空闲，只正常停止已识别的旧产品PID18844；未停止其他Codex或Node服务。原安装器离线安装完整新包并原子切换指针，再由隐藏后台安装启动器启动。首次立即读取HTTP发生启动等待，随后正常监听，未创建其他端口或换工具绕过任何拒绝。

升级前备份：`D:\boundx\.boundx\short-compiler-031-r1\backups\ui84-preflight-2026-10-13T15-09-34.253Z`。

安装器备份：`D:\boundx\.boundx\short-compiler-031-r1\backups\2026-10-13T15-09-59.453Z`。

升级后在线检查10项均200（页面、脚本、样式、历史、JSON、中文、过程Markdown／HTML及计算导出），会话版本、Core与manifest一致。历史91→91，预核对164份run/source/candidate/trace原文件摘要全部未变。npm版本核对启动器确认已运行同一安装，不重复启动。没有真实解析／审阅／修订调用；新资源模型语义验证仍NOT_RUN。详细证据见HTTP-VERIFICATION.json和DEPLOYMENT-PREFLIGHT.json。

## 重启电脑后的启动

从任意目录执行：

```text
node D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.84/product/short-compiler/deploy.mjs start --home D:/boundx/.boundx/short-compiler-031-r1
```

或使用已验证的候选启动器（已有同版服务时不重复启动）：

```text
npm --prefix D:/boundx/.boundx/ir-kernel-implementation-v1/candidate run 7plus1:ui -- --home D:/boundx/.boundx/short-compiler-031-r1
```

主开发工作区原启动器的旧写入阻塞未绕过，不将主目录未更新脚本宣称为本版入口。以上命令加载同一完整安装、原配置与历史，不读取开发工作区的Skill／Schema。

## 使用和回滚

刷新58618确认v0.1.84。选择Skill或skill1及模型，再发起新的真实编译；新结果分别保存LLM IR、独立审阅、技术问题、固定7+1和程序计算。旧历史保持原结果，不在浏览时自动重算。必要子问题SAT不显示为完整SAT；010这类已表达必要约束冲突显示UNSAT并保留证明范围和缺口。

回滚前核对当前产品身份、无在途请求，并正常停止该产品服务；不得照抄历史PID停止其他进程。然后执行：

```text
node D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.84/product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle
```

回滚指针返回ui83，历史保持；再执行上述同一安装启动命令，安装器按当前指针加载ui83。未merge、release、tag或对外发布。
