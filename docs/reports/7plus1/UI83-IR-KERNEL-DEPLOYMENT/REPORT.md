# ui83 同入口安装与启动

日期：2026-10-13。ADMIN在本会话明确要求“启动新的58618”“同步最新的”“安装最新的”；本次授权接在WP0—WP5隔离验收之后，允许备份、安装与启动同一个58618入口。原隔离任务的零部署记录保持原样，不倒改。

实际地址：**http://127.0.0.1:58618/**。已安装 `0.1.0-candidate.031-r1.2-ui.83`，页面短版本 **v0.1.83**，核心 `direct-ir-kernel-r01-test`，合同 `candidate-ir/2.0`。完整安装manifest为 `131a7fa3d04210b79fc31331e8f17e7bae12b7dc7498b3d3162a893acd1c1611`；运行HTTP服务PID18844，源码提交 `b9584184daa60dc59a994fc2ed074d4d70450bab`。

本轮将同版2.0解析／审阅资源适配接入原编译路径和原UI；原Skill与skill1正文文件没有重写。每次请求由安装快照选择合同，两种Skill分别收到本阶段对应资源。程序消费同一Core计算，结果页面显示计算支持状态、SAT／UNSAT／UNKNOWN／未运行原因、Core见证复核、表达式值、模型及来源映射。技术失败仍返回原候选和问题；旧1.4历史记录保留原格式，未自动重算。

升级前确认58618无监听、没有目标产品Node进程，也没有QUEUED／RUNNING／CANCELLING记录。随后用现有安装器完整备份配置、指针和历史；依赖从现有npm缓存离线安装，安装成功后原子切换指针，后台启动只监听127.0.0.1:58618，没有新增用户端口或更改全局账号配置。

备份目录：`D:\boundx\.boundx\short-compiler-031-r1\backups\2026-10-13T12-45-07.114Z`。

完整版本目录：`D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2-ui.83`。

可复现候选包：`D:\boundx\.boundx\ir-kernel-implementation-v1\products\0.1.0-candidate.031-r1.2-ui.83`。

电脑重启后的启动命令（可从任意目录执行）：

```text
node D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/product/short-compiler/deploy.mjs start --home D:/boundx/.boundx/short-compiler-031-r1
```

或使用新候选的版本核对启动器：

```text
npm --prefix D:/boundx/.boundx/ir-kernel-implementation-v1/candidate run 7plus1:ui -- --home D:/boundx/.boundx/short-compiler-031-r1
```

主工作区原启动脚本的写入未成功，本轮没有换工具强制覆盖它；不要将主目录原`npm run 7plus1:ui`当成本次已更新的入口。以上启动方法仍加载完整安装版本、原配置及同一历史目录。

回滚：先确认无在途请求，仅正常停止已识别的本产品服务，然后执行以下命令，再用同一启动方法启动；原历史目录保留。

```text
node D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.83/product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle
```

实际检查：新接线4/4、全组内核42/42、原接口115/115。接线首次检查中3/4通过，一项夹具误读固定A槽；按该夹具原来的views核对全部槽位后4/4通过，没有更改语义预期。技术检查器对构造但不listen的HTTP服务测试曾误报监听；门改为禁止实际listen调用，原真正监听的测试仍被排除。

安装后 `/`、各JS／CSS、`/api/session`均200且版本与manifest一致；保留88条历史，原历史JSON、中文和计算导出均200。浏览器实见v0.1.83、IR2.0、Skill／skill1选择、模型选择及可用“开始编译”按钮。详细回执见同目录HTTP-VERIFICATION.json、PROGRAM-CHECKS.json。

本轮真实解析／审阅／修订调用0。采用离线固定响应贯通和页面冒烟，不把它们计成新合同模型语义准确性。产品状态仍WAITING_ADMIN_REVIEW；开放全域、动态实例与定性立即等限制在页面如实显示。没有merge、release、tag或公开发布；仅同步私有review分支。
