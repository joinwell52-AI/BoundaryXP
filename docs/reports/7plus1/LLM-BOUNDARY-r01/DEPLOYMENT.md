# v0.1.85安装与运行记录

## 当前：原npm入口恢复，58618实际在线

2026-10-14 10:17（本地）核对：用户另行明确授权修复原本地启动入口并通过`npm run 7plus1:ui`启动最新完整安装版本。原`D:/boundx/product/short-compiler/launch-installed.mjs`只登记到ui78，无法接受已安装ui85；先保存原字节，再仅增加ui85/ui84/ui83三条版本登记，没有替换用户其他修改。

正常原npm入口已实际执行成功，监听127.0.0.1:58618，PID25752。运行版本ui85／llm-boundary-r01-test／candidate-ir/2.0，请求配置LLM_BOUNDARY_CALCULATION_R01；241文件完整安装摘要仍为2e808292e9142a109cd9a42794fe31c1c943ba158a73f6e816041e7a0b25b664，与实际会话一致。再次执行同一命令返回already_running，未启动第二个服务；没有执行曾受拒绝的隐藏后台命令、停止其他进程或更改端口。

实际浏览器页面显示v0.1.85及新流程；模型和Skill/skill1选择、93条历史、旧001记录查看正常，浏览器未观察到错误。实际点击JSON导出得到下载文件，与原canonical一致；HTTP JSON/中文导出均200且与原trace一致。2246份历史文件及config摘要保持原样。本次新增模型调用0，新Skill真实语义验收仍NOT_RUN，产品状态WAITING_ADMIN_REVIEW。

以后在`D:/boundx`使用唯一短入口：

```text
npm run 7plus1:ui
```

实际地址：http://127.0.0.1:58618/。本地证据在`.boundx/ir-kernel-implementation-v1/evidence/ui85-deployment/SHORT-ENTRY-LIVE-VERIFICATION.json`及`PAGE-ui85-LIVE.png`；原启动文件备份在同目录`main-launcher-before-short-entry.mjs`。

## 以下为此前安装及首次启动受阻的原始记录

日期：2026-10-14。代码提交e042bab857f0fae007494e1ca8dd914018172e0b。包为0.1.0-candidate.031-r1.2-ui.85，compiler llm-boundary-r01-test，Core合同candidate-ir/2.0。**完整包已经安装，但58618尚未在线，不能报告页面启动成功或语义验收通过。**

## 包与安装

完整包：`D:/boundx/.boundx/ir-kernel-implementation-v1/products/0.1.0-candidate.031-r1.2-ui.85`。

已安装目录：`D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.85`。

241个冻结文件，source_runtime_clean=true。manifest SHA256：2e808292e9142a109cd9a42794fe31c1c943ba158a73f6e816041e7a0b25b664。干净包离线npm ci安装18依赖，使用包内依赖，无开发目录混读。

原001真实冻结响应回放与新计算人工夹具回放，各14条离线HTTP处理器/页面资源/导出检查200；验证不打开监听、不触发模型。前者仍PARTIAL/NOT_RUN并保留必要约束SAT；后者MODEL_REVIEWED/SAT是人工夹具而非真实模型准确性。详见PACKAGE-OLD001.json、PACKAGE-ARTIFICIAL-LLM.json。

安装前实际58618没有监听，52条当前run记录均已结束；既有只读旧历史另行保留。正常deploy upgrade --confirmed-idle --offline完成，current.json现在指向ui85，previous=ui84。没有停掉任何进程，也没有新增端口。

备份：`D:/boundx/.boundx/short-compiler-031-r1/backups/2026-10-14T01-43-16.457Z`。安装后2246份data文件摘要逐项一致，配置摘要一致。241文件安装完整性再核对通过，见INSTALLED-VERIFICATION.json。

## 实际阻断

隐藏后台启动已提交一次正常工具操作，CreateProcess被自动策略拒绝，返回只有`blocked by policy`。命令未执行，未提供更细拒绝理由。没有更换命令、工具或运行方式再次尝试启动。随后只读HTTP核对为ECONNREFUSED，所以在线页面/会话/版本/导出冒烟NOT_RUN；不把离线处理器检查冒充在线成功。

目标仍为http://127.0.0.1:58618/，不是当前已可用地址。安装版本ui85与运行版本分别陈述：ui85已安装，当前无运行版本。新Skill真实模型生成/计算/审阅验收NOT_RUN，产品仍WAITING_ADMIN_REVIEW。

## 正常启动与回滚入口

在用户自己的正常本地终端中启动既有同一个安装入口（本轮自动工具未获准执行）：

```text
node D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.85/product/short-compiler/deploy.mjs start --home D:/boundx/.boundx/short-compiler-031-r1
```

该命令读HOME的current/config，启动完整安装包，不读开发工作区Skill/Schema；旧模型/模式选择仍可用，默认首次生成IR＋计算、新会话审阅，共两次调用。刷新页面后新编译才有新增LLM计算；旧历史不补造。闭合标准、LLM输出与程序复核必须继续真实核对。

若需要回滚，先正常确认目标服务空闲并停止已识别的本实例，再执行已有回滚入口（本轮未执行回滚）：

```text
node D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.85/product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle
```

previous为ui84；历史保留。回滚后的start同样读取当前指针，不混读版本。禁止据此自动重试被拒绝的后台启动；真实权限阻断需由正常用户权限流程处理。
