# 58618 更新至 ui32

2026-10-11（Asia/Shanghai）。用户明确指令「直接更新版本！」，授权将已封存候选用于本地测试。实际更新成功，状态 `UPDATED_FOR_USER_TESTING`；语义质量仍为 FAIL / PARTIAL，不代表 ADMIN 语义验收通过或公开发布。此前 r02 报告及 SEAL 保持不变，本文件记录其后的部署。

## 实际版本

- 地址：`http://127.0.0.1:58618/`。
- 页面显示：`v0.1.32 · 候选`。
- 完整版本：`0.1.0-candidate.031-r1.2-ui.32`。
- 核心：`031-r1-c7`；兼容合同：`031-r1.1`；实际资源修订：`031-r1.3-additive`。
- Manifest SHA-256：`03c2e4cd599aea6f0ba3cbba757b09f73b3b2877e8e8389e36ca31194d871ef4`。
- 有效请求资源 SHA-256：`81b04858d1b6e8f064ebe4aeb7aca2ff71d75ff6b3d1a93bd4c7fe5cb29c056d`。

版本来自原 r02 完整封存包，使用同版核心、两个 Skill、Schema 与原 UI，不加载开发工作区语义资源。没有重新打包或改变语义判定。页面保留 `PARTIAL / SEMANTIC_REPAIR_CANDIDATE_NOT_ADMIN_ACCEPTED`。

## 部署与核对

核对 ui22 服务的 PID 33052、父进程与安装路径，以及 HTTP 运行摘要；58 条历史均处终态，无在途请求。停止前备份 current.json、config.json 和全部 667 个数据文件（371,507,770 字节），逐文件核验备份一致。仅停止已确认的目标 UI 进程，使用冻结包原安装器升级，再通过原启动入口启动 58618；新服务 PID 4292，仍只监听 127.0.0.1:58618。

实际页面刷新后显示 v0.1.32，浏览器错误记录为空。首页及四项 JS/CSS 资源 HTTP 200，内容摘要与候选完整包一致。58 条历史 ID、全部数据文件、已完成记录的最终 JSON、中文及完整 Trace 导出摘要逐项不变，配置不变；旧 ui22 文件摘要仍完整，可回滚。详见 PREFLIGHT.json、ONLINE.json 及页面截图。

原启动器只新增 ui32 的版本/核心/合同登记；其余工作区修改保留。安装入口测试 4/4 PASS，重复执行 `npm run 7plus1:ui` 实际识别同版已运行服务，不重复启动、不新增端口。首次在线探测发生在服务启动完成前，得到 ECONNREFUSED；随后页面、API 与资源检查全部通过，不冒称首次探测成功。

本次仅部署与无模型检查，新增模型调用 **0**。此前 80/80 专项、111 PASS / 40 FAIL 历史回归及 REAL-GOLD-015 PARTIAL 均保持原结论，不能将本次页面检查当作新的语义验收。

## 重启与回滚

电脑重启后：

```text
cd D:\boundx
npm run 7plus1:ui
```

更新前备份：`D:\boundx\.boundx\short-compiler-031-r1\backups\ui32-user-authorized-2026-10-11T00-31-50.887Z`。安装器另保留了一份升级备份。

需回滚时，先核对目标进程并确认没有在途编译，停止该目标服务，然后执行：

```text
node D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2-ui.32\product\short-compiler\deploy.mjs rollback --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle
cd D:\boundx
npm run 7plus1:ui
```

回滚指针返回完整 ui22，保留历史，不重算或混读新版 Skill。上述生产回滚未执行；旧版完整性已核验，原 r02 干净目录升级/回滚实测仍作为安装器证据。

仅同步私有 review/7plus1-parser；不 merge/release/tag，未变更全局账号或模型配置。完成后停止等待 ADMIN Review。
