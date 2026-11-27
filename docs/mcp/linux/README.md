# BoundaryXP MCP · Linux

> rc.12 / B353：修复运算类型漏填、Windows 路径引文重复转义与预算明细共同字段漏填。仅按明确且无冲突的结构和原文补全，原始响应与补全记录保留；原生 Core 输出完整固定预算的剩余金额。

B348 一次分析保存中英文两份完整报告，共用计算核验。`bx_result_get` 支持 `language: "zh-CN"` 或 `"en"`，返回单语及双语 Markdown；历史报告保留。API 模式先连接验证、获取型号，再选择保存；证据面板支持折叠。

> rc.12 / B353: recover omitted operation kinds, an extra Windows-path escaping layer, and missing shared budget-allocation fields only from explicit, unambiguous input and exact source matches. Original responses and adaptation receipts are preserved. The native Core reports remaining complete fixed budget.

B348 saves complete Chinese and English reports from one analysis, sharing native verification. `bx_result_get` supports `language: "zh-CN"` or `"en"` and returns `reports` and `bilingual_report`. Legacy reports remain readable. API mode verifies credentials and fetches models before selection/save; the evidence panel supports collapse.

[简体中文](#简体中文) · [English](#english)

## 简体中文

BoundaryXP（BXP，界痕）把任务原文和父子关系整理为带原文证据的 7+1 边界表示。当前宿主 LLM 独立分析，原生 Core 计算复核提交的形式输入；报告分别保留判断、计算回执、引用和未知项。程序核验不自动证明语义抽取正确，也不授予执行权限。

Linux 版本为 `0.4.0-rc.12-linux.1`，运行基线 B353，原生计算器同步预算余额字段；21 个工具、17 项资源。MIT 许可；原始 Core 源码不随产品交付，适配器、页面和资源仍含可读文件。

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


## English

BoundaryXP (BXP) turns task sources and parent/child relationships into an evidence-linked 7+1 boundary representation. Your host LLM analyzes the task independently; the native Core verifies submitted formal inputs. Reports retain judgments, calculation receipts, evidence and unknowns separately. Calculation does not prove semantic extraction correct or grant execution authority.

Linux version: `0.4.0-rc.12-linux.1`, B353 runtime and native budget remainder calculation, 21 tools and 17 resources, including custom L2 industry and L3 enterprise dictionaries. MIT licensed. Original Core source is excluded; adapters, UI and resources remain readable distribution files.

## Requirements and MCP setup

rc.10 adds Installed/Import dictionary tabs and five steps: L2/L3 → full folder → validate → name → save. L2 requires 8 JSON files plus README; L3 requires 3 JSON files plus README. The format tool provides complete examples in both languages. Existing rc.9 dictionaries and legacy JSON tool imports remain compatible. Model settings and dictionary settings save independently without starting analysis.

Linux x64, glibc ≥2.36 (for example Debian 12), Node.js ≥22.19.0 and npm. ARM64, Alpine/musl and macOS are not supported. Windows users retain `0.4.0-rc.12`; npm `latest/next` remain Windows channels. Linux uses the `linux` tag or this pinned version.

Add a local stdio server to your MCP host, replacing the data path with your own absolute path:

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

Host configuration formats vary; the common stdio launch command is:

```sh
npx --yes --package=boundaryxp-mcp@0.4.0-rc.12-linux.1 bxp serve --data-root /absolute/path/to/bxp-data
```

The host keeps stdin open for MCP messages. First installation downloads npm packages. No separate workbench installation or hosted business server is required. The default workflow uses the current host LLM without an additional model API key; MCP itself is not a model.

## Use

Ask the host: “Call BoundaryXP bx_capabilities with language en and help_topic tools, then bx_workbench_open for the current page address.”

Full workflow: preview complete source with `bx_task_import`; validate/create the project; use `bx_analysis_submit` prepare; let the host LLM read instructions and submit its analysis; poll `bx_job_get`; read `bx_result_get`; run `bx_result_recheck`. Follow built-in schemas. Multiple DEV tasks need separate IDs and explicit parent IDs rather than one combined role node.

Use `bx_dictionary_format` for L2/L3 schemas and Chinese/English examples, `bx_dictionary_validate` to check, then `bx_dictionary_import`. Existing versions are not overwritten. The UI also supports validation and import. `bx_dictionaries_bind` binds versions and digests; dictionaries do not grant business authority.

Open the loopback URL returned by `bx_workbench_open` in a browser on the same Linux host. The port can change after restart. Closing the browser does not delete tasks; stopping MCP stops its page service. Keep the data directory and do not share it between active instances.

## Docker

The public Dockerfile downloads only the compiled package and verifies its checksum. It requires no private Core source.

```sh
git clone https://github.com/joinwell52-AI/BoundaryXP.git
cd BoundaryXP
docker build --platform linux/amd64 -t boundaryxp:linux .
docker volume create bxp-linux-data
docker run --rm -i --mount type=volume,source=bxp-linux-data,target=/data boundaryxp:linux
```

Use that final docker command as your host's MCP stdio launcher. The image runs as non-root user node and publishes no host ports by default. Preserve the `/data` volume; one container per volume.

The workbench URL belongs to the container loopback interface. It is not directly reachable in the host browser by default. Native Linux can explicitly use `--network host`; remote hosts require SSH local forwarding. This is not a universal Docker Desktop port-mapping solution. Origin/session checks remain enabled.

## Updates and troubleshooting

This first independent Linux release does not replace installed Windows versions. A pinned npx configuration stays pinned. Finish active tasks before upgrading to a future Linux release and retain the data directory. `@linux` resolves the channel when the host restarts and npm refreshes it; running processes are not hot-swapped. Do not change the OS or overwrite existing Windows installs/data.

For `EBADPLATFORM`, check Linux x64 and the package version. `BXP_NATIVE_GLIBC_2_36_REQUIRED` requires a supported glibc distribution. For `DATA_ROOT_IN_USE`, confirm the existing instance has exited; do not blindly delete locks or share a volume. Built-in `bx_capabilities` help_topic troubleshooting provides more guidance.

Local isolated acceptance covered a full host-LLM case, dictionaries, reports, recheck, installation and container restart. Glama's build/review status is separate. Publication does not imply Glama approval; npm installation works independently.
