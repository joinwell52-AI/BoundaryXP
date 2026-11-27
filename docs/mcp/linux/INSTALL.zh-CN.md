# BoundaryXP Linux · 中文安装

[English](INSTALL.en.md)

BoundaryXP（BXP，界痕）把任务原文和父子关系整理为带原文证据的 7+1 边界表示。当前宿主 LLM 独立分析，原生 Core 计算复核提交的形式输入；报告分别保留判断、计算回执、引用和未知项。程序核验不自动证明语义抽取正确，也不授予执行权限。

Linux 版本为 `0.4.0-rc.12-linux.1`，运行基线 B353，原生 Core 同步完整固定预算的余额计算；21 个工具、17 项资源。MIT 许可；原始 Core 源码不随产品交付，适配器、页面和资源仍含可读文件。

rc.10 页面提供“已安装字典”和“导入语义库”。选择 L2/L3 → 选择完整文件夹 → 校验 → 名称 → 保存。L2 是 8 个 JSON＋README，L3 是 3 个 JSON＋README。格式工具提供完整中英文目录示例；旧 rc.9 字典继续可读，旧 JSON 工具导入仍兼容。模型设置与字典分别保存，保存不发起分析。

## 环境与接入

需要 Linux x64、glibc ≥2.36（例如 Debian 12）、Node.js ≥22.19.0 和 npm。尚不支持 ARM64、Alpine/musl 或 macOS。Windows 客户继续使用 `0.4.0-rc.12`；npm `latest/next` 保持 Windows 版本，Linux 使用 `linux` 渠道或下列固定版本。

在支持本地 stdio 的 MCP 宿主中添加以下配置，把数据路径改成你自己的绝对路径：

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "npx",
      "args": ["--yes", "--package=boundaryxp-mcp@0.4.0-rc.12-linux.1", "bxp", "serve", "--data-root", "/home/you/.local/share/boundaryxp"]
    }
  }
}
```

各宿主配置文件结构可能不同；共同的启动命令为：

```sh
npx --yes --package=boundaryxp-mcp@0.4.0-rc.12-linux.1 bxp serve --data-root /absolute/path/to/bxp-data
```

该命令由宿主保持 stdin 打开，以 stdio 交换 MCP 消息。首次安装需联网下载 npm 包。无需额外安装工作台或提供业务服务器。默认使用当前宿主 LLM，无需另外配置模型 API Key；MCP 本身不是模型。

## 使用

在宿主聊天中说：“调用 BoundaryXP 的 bx_capabilities（language 为 zh-CN，help_topic 为 tools），查看工具说明；调用 bx_workbench_open 返回页面地址。”

完整流程：`bx_task_import` 预览完整任务文本 → `bx_task_validate` / `bx_project_create` → `bx_analysis_submit` 的 prepare 阶段 → 宿主 LLM 阅读指令并提交分析 → `bx_job_get` → `bx_result_get` → `bx_result_recheck`。按内置 schema 传参，不把 MCP 当成独立模型。多个 DEV 使用不同任务编号和明确父任务编号，不能按角色合并成一个节点。

字典：`bx_dictionary_format` 读取 L2/L3 格式及中英文示例，`bx_dictionary_validate` 校验，再用 `bx_dictionary_import` 导入；重复版本不会覆盖。页面也支持格式查看、校验与导入。`bx_dictionaries_bind` 绑定版本和摘要，加载字典不产生业务权限。

`bx_workbench_open` 返回当前回环地址；本机 Linux 浏览器可打开。重启后端口可能变化。关闭网页不删除任务；停止 MCP 会停止页面服务。数据目录应长期保留，不要与另一运行实例共用。

## Docker

公开仓库的 Dockerfile 只下载已发布的编译包并校验摘要，不读取私有源码。

```sh
git clone https://github.com/joinwell52-AI/BoundaryXP.git
cd BoundaryXP
docker build --platform linux/amd64 -t boundaryxp:linux .
docker volume create bxp-linux-data
docker run --rm -i --mount type=volume,source=bxp-linux-data,target=/data boundaryxp:linux
```

把最后一行的 `docker` 命令及参数配置为宿主的 MCP stdio 启动命令即可。镜像以 node 非 root 用户运行，默认不映射主机端口。`/data` 持久卷保留任务和字典，一个卷只给一个容器使用。

容器内的工作台 URL 属于容器回环接口，默认不能直接从主机浏览器打开。原生 Linux 可显式使用 `--network host` 访问其回环页面；远端机器需要 SSH 本地端口转发。这不是通用 Docker Desktop 端口映射方案，不关闭 Origin/session 检查。

## 升级与排障

此版是 Linux 首次独立发行，不会把已安装 Windows 版本自动换成 Linux。固定版本的 npx 配置不会自动改变版本；未来升级请先等待任务结束，再按对应 Linux 发行说明更新版本，保留数据目录。使用 `@linux` 可在宿主重新启动、npm 重新解析渠道后取得该渠道版本，但不会热替换运行中的进程。不要给现有 Windows 安装改 OS、覆盖目录或删除历史。

遇到 `EBADPLATFORM`，核对 Linux x64 与版本号；`BXP_NATIVE_GLIBC_2_36_REQUIRED` 需升级到受支持 glibc 发行版。`DATA_ROOT_IN_USE` 时先确认已有实例正常退出，不直接删锁或共用数据卷。`bx_capabilities` 的 `help_topic: troubleshooting` 提供内置中英文排障。

Linux 本地完整案例、字典、报告、复验、安装及容器重启已隔离验收。Glama 平台的构建/审核是独立状态，发布此包不代表已获 Glama 验证；客户可以直接通过 npm 使用。
