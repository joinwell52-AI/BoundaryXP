# ui95 第一版测试候选安装

2026-10-14，ADMIN明确授权先完成第一版修改、安装58618，然后测试。本次为本地测试候选安装，不是完整语义验收通过或公开发布。

- 来源提交：`b3d1882e3421c03d9ca3cfe109f8d5dfd6aae267`。
- 安装版本：`0.1.0-candidate.031-r1.2-ui.95`，页面简称`v0.1.95`。
- 编译核心：`declarative-boundary-r01.2-test`；合同：`candidate-ir/2.0`。
- 完整包249文件，清单SHA256：`d534e6bbe973d7759a59c757c9a534a98050cef11e11960fba662f5ff58d3142`。
- 包：`D:\boundx\.boundx\ir-kernel-implementation-v1\products\verified\0.1.0-candidate.031-r1.2-ui.95`。
- 实际安装：`D:\boundx\.boundx\short-compiler-031-r1\versions\0.1.0-candidate.031-r1.2-ui.95`。

## 实际安装核对

安装前确认58618为ui88、PID33544，98条历史、无在途请求。备份到`D:\boundx\.boundx\short-compiler-031-r1\backups\ui95-prestop-2026-10-14T06-36-14.968Z`，2483份数据文件逐摘要核对。正常停止已识别目标后，使用现有deploy upgrade和离线依赖安装切换版本。

根工作区保持原有未提交修改；原启动脚本先备份，仅增加ui95版本登记。覆盖式文件写入发生本地文件访问错误，已用经过apply_patch修改的暂存文件按原字节校验后写入，写后逐字节验证。没有替换其他本地修改。

通过原命令`npm run 7plus1:ui`实际启动，PID24896；GET /api/session的版本、核心和清单一致。Chrome真实页面显示v0.1.95。重复执行同一启动命令返回already_running，没有第二个监听器。升级后2483份旧文件摘要全部不变，配置摘要不变。

## 使用、重启与回滚

在`D:\boundx`执行`npm run 7plus1:ui`，打开http://127.0.0.1:58618/ 。无需新端口或长启动参数。界面保留Skill与skill1选择及模型设置。新的边界提取、程序预检、独立审阅、同源7+1与静态值分阶段显示。

回滚需先确认58618空闲并正常停止该目标进程，再从本版安装目录执行`node product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle`，然后在`D:\boundx`执行`npm run 7plus1:ui`。当前previous为ui88；历史不重算、不删除。

## 验证界限

本版UI18项工程测试通过；先前同核心196项无模型检查保留为工程证据。它们均不替代语义准确性。

用户已在安装后的页面启动002，run_id=`1cfd8a17-7eec-4fb7-8603-792c5fb2c7f0`，Skill，gpt-6.1-sol，medium，298字符，与标准TXT正文SHA256一致。未另发重复请求。该真实测试成绩另记；本文不预填通过。

已知仍有旧界面总标题沿用“IR与边界计算”措辞，详细阶段已经按声明式边界展示。当前运行期间不修改安装资源或重启服务。产品状态保持WAITING_ADMIN_REVIEW。
