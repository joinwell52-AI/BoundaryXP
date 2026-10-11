# 58618更新ui.40

ADMIN明确要求58618使用最新版本。本次实际更新到 `0.1.0-candidate.031-r1.2-ui.40` / `031-r1-c14`，没有新增用户端口。新Skill的模型语义验证仍未完成，页面继续显示真实候选状态，部署成功不等于产品语义验收。

升级前核对监听进程18224及父部署进程16344的ui.38完整安装路径，并两次检查无在途请求。停止前备份current/config及809个历史文件并逐摘要验证；只停止该已识别的空闲目标，没有停止其他Codex或服务。正常停止执行成功，没有策略拒绝；随后安装、保留配置历史、启动ui.40。旧ui.38版本保留，部署器另有完整备份。

原启动入口已登记ui.40，`npm run 7plus1:ui`实际返回相同在线安装版本。原文件直接apply_patch写入失败；保留原始字节备份，在副本用apply_patch增加版本登记后原子替换，原有其他改动保留，未用PowerShell改中文。

实际HTTP检查验证版本、页面及JavaScript与安装资源摘要一致、60条历史及809个文件不变，并成功读取既有JSON、中文、Trace和计算导出。详情见RESULT.json。浏览器工具访问被安全策略拒绝，未换浏览器或其他界面绕过；没有声称实际浏览器点击通过。本次模型调用0。

使用：http://127.0.0.1:58618/ ，刷新页面加载新版。

重启：在D:\boundx执行 `npm run 7plus1:ui`。

如需回滚：先确认无在途请求，只停止核实身份的58618服务，再执行 `node .boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.40/product/short-compiler/deploy.mjs rollback --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle`，随后 `npm run 7plus1:ui`。回退目标ui.38，历史不重新解析。

旧记录不被新资源静默重算；不同版本的观测重算会拒绝。新观测功能用于新版本产生的记录。没有修改旧语义成绩或清零调用账本，没有merge/release/tag。
