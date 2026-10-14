# ui101实际安装与页面核对

2026-10-14（Asia/Shanghai），已将完整v0.1.101候选安装到原58618并用原`npm run 7plus1:ui`启动。实际监听127.0.0.1:58618，PID30264；页面显示v0.1.101、Skill/skill1、模型和推理设置，新流程只有LLM生成、独立LLM审阅、程序保存与核对。已打开页面交给用户发起005，不由助手启动模型。

- 完整版本：0.1.0-candidate.031-r1.2-ui.101。
- 核心运行标识：boundary-report-r01-test；新请求配置BOUNDARY_REPORT_R01。
- 源码提交：b5b4a15bf406499f78e93f932a40edf8e806e09f；完整包262文件，运行源码干净。
- Manifest SHA256：bb7c1bc2b09443c8e44290cb9a8b8655b827febf35599b6858e710394de5df33。
- 运行包：D:/boundx/.boundx/ir-kernel-implementation-v1/products/verified/0.1.0-candidate.031-r1.2-ui.101。
- 安装目录：D:/boundx/.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.101。
- 生成说明1200字符，审阅说明1171字符；各自加载阶段Skill及7+1简短方法，不含旧规则Schema。上述数值另加原文；审阅另加当次生成报告。

## 实际检查

222/222相关无模型回归通过，四份Skill校验通过。完整包摘要、独立依赖、旧005同响应回放以及14项离线HTTP处理检查通过，不启动监听或模型。首次包检查在依赖安装进程尚未完成时触发独立依赖断言；等待离线安装正常结束后重新检查通过，未修改断言或资源。

部署前确认58618无监听、旧PID已不在。预备备份逐文件验证，2747份历史数据及配置原字节保留；受控升级另存部署备份。安装后103条历史可见，2747文件和配置摘要一致，原005候选、审阅、IR、技术记录、7+1及计算结果原样。旧005六类导出均200，原页面及新JS/CSS均200，Gold60原文入口保留。实际浏览器显示新版本、新模型设置及分组职责，未点击开始编译。

本轮真实模型调用0，用户005新版本实测NOT_RUN。旧005的PARTIAL及首次成绩保留。新资源的完整性、准确性和生成少于60秒均须据用户真实结果判断，不因无模型检查通过而预填产品PASS。程序核对回执/资源绑定/独立会话，尚未自动复算自由表达的数学内容或核验PM规划。

## 启动与回滚

启动仍为在D:/boundx执行`npm run 7plus1:ui`。重复启动会检查现有安装，不另开端口。

回滚须先核对用户运行已经结束，只停止已确认的本次58618进程，然后执行安装版本的`product/short-compiler/deploy.mjs rollback --home D:/boundx/.boundx/short-compiler-031-r1 --confirmed-idle`，再执行原npm启动命令。上一版ui100完整包保持，历史无需重跑。

备份：D:/boundx/.boundx/short-compiler-031-r1/backups/ui101-preinstall-1791987010387；部署备份D:/boundx/.boundx/short-compiler-031-r1/backups/2026-10-14T14-11-01.427Z。原启动文件备份为D:/boundx/product/short-compiler/launch-installed.ui100-pre-ui101.mjs，只新增ui101登记。证据位于D:/boundx/.boundx/ir-kernel-implementation-v1/evidence/open-boundary-ui101/，包含TESTS、BEFORE、AFTER及package-check/PACKAGE-VERIFICATION.json。

终态WAITING_ADMIN_REVIEW。仅推送review/7plus1-parser，不merge、release或tag。
