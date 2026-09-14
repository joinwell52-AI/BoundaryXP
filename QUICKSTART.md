# 界痕 · BoundX：下载包首次使用

**1.2.0-preview.1 新界面：双击 `start-ui.cmd`，按页面三步操作。** 详见[界面使用指南](docs/UI-GUIDE.md)。以下无图形界面的描述和步骤记录 1.1.0-preview.1；该旧包不会自动获得新入口。

这是 Windows x64 独立便携工具，包含 Node.js 运行时，不需要安装 Node、npm、CodeFlowMu 或提供 API key。它没有图形操作界面，不自动读取你的项目。

## 另一台电脑怎样使用

1. 登录有权访问私有仓库的 GitHub 账号，从 BoundX 预览 Release 下载 ZIP 和 SHA256SUMS.txt。
2. 完整解压到一个新目录，例如 `D:\Tools\BoundX`，不要只复制 CMD 或 node.exe。
3. 双击 `demo.cmd` 查看 D044 任务分解案例；看到 input_gap 是示例的预期发现，不是启动失败。
4. 自己的任务须先由人工或助手整理为 JSON。打开终端进入解压目录，运行：

```text
bx.cmd task examples\task.json
bx.cmd decomposition examples\decomposition-d044.json
bx.cmd decomposition D:\tasks\my-plan.json
self-test.cmd
```

计算结果输出到终端，可重定向保存。边界发现属于正常结果，退出码 0 不代表任务通过；输入错误返回非零退出码。原文映射要求、数学原理和完整案例见 `docs/DECOMPOSITION.md`。JSON 字段不因中文展示而改变。

## 接入支持 MCP 的 AI 助手

在助手的 MCP 配置中添加一个 stdio 服务。不同助手的界面或配置文件入口由该助手决定；以下为常见 mcpServers 配置片段，路径改为你的实际解压目录：

```json
{
  "mcpServers": {
    "boundx": {
      "command": "D:\\Tools\\BoundX\\runtime\\node.exe",
      "args": ["D:\\Tools\\BoundX\\mcp.mjs"]
    }
  }
}
```

工具包括原任务检查、规划检查、分解契约检查和回应核对。助手负责准备输入、调用与展示；是否自动调用取决于宿主。命令不需要 API key，但宿主助手本身的模型服务可能需要它自己的订阅或凭据。本包不配置或消费这些服务。

## CodeFlowMu 怎样使用

CodeFlowMu 仓库源码已有界痕适配，但这不等于另一台电脑已安装的 CodeFlowMu 包含它。这个独立包不是 CodeFlowMu 安装程序，也不会替换或自动注册到 CodeFlowMu。已有源码适配可供 ADMIN 本地命令行与 PM 工具使用；新增分解接口尚未自动挂载到其专用 PM 工具。

独立使用本包无需下载 CodeFlowMu 源码。在现有 CodeFlowMu 内直接使用，则需要一个明确包含界痕及适配的新版 CodeFlowMu 安装包，或由开发人员在源码工作区构建接入；本次下载不提供该安装包，也不要求普通用户自行编译。

如只想先使用分解计算，可独立运行本包，把结果交给 PM 核查。若要在任务创建、规划、派单时自动调用，需完成 CodeFlowMu 适配开发，不能靠下载本包自动获得。完整说明见仓库的 `docs/engineering/BOUNDX.md`。

## 更新、校验与范围

新版本解压到新目录，保留旧目录和自己的任务数据；确认后再调整 MCP 路径。回滚时切回旧目录。本包无常驻服务，不写注册表、不改系统 PATH、不升级已有 CodeFlowMu，不保存会话和业务授权。

可以用 Windows 命令 `certutil -hashfile BoundX-1.1.0-preview.1-win-x64.zip SHA256` 与 Release 的 SHA256SUMS.txt 比较。ZIP 内的 FILES.sha256 记录每个有效负载文件的摘要，BUILD.json 记录来源提交和运行时版本。

当前是内部预览版，原文到符号仍由调用方映射。无异常不等于理解正确，建议不是授权，回复不是裁决。尚未实际在第二台物理电脑验证；本轮使用独立解压目录和内置运行时验证。
