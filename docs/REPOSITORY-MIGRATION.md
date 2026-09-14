# BoundX 独立仓库迁移记录

日期：2026-09-14。目标仓库：[joinwell52-AI/BoundX](https://github.com/joinwell52-AI/BoundX)，保持私有。

## 来源与范围

- 来源：`joinwell52-AI/codeflowmu` 的 `boundx/` 组件，母仓提交 `181a38f5ba3d1d8d66041352ea28be1c56c084f8`。
- 迁移前，`D:\boundx` 的全部 198 个对应文件与该提交一致（比较时忽略 CRLF/LF 差异）；没有缺失或内容差异。
- 独立初始提交 `91ce5aa` 保留这 198 个文件的迁入快照。独立仓库不导入母仓整仓历史；历史出处保留原提交链接与协议来源索引。
- 包含计算核心、Python 引擎及依赖清单、CLI、MCP、HTTP/UI、测试、协议、语义包、示例和文档。不上传 `.venv`、缓存、凭据或无关宿主源码。
- 检查时 `D:\codeflowmu\boundx` 已不存在，母仓工作树已将原组件标为删除；本次未修改母仓、提交母仓删除、推送母仓或更改宿主适配。
- 后续唯一工作目录为 `D:\boundx`，只连接独立 BoundX 远端。CodeFlowMu 的宿主适配与其删除记录的收尾属于母仓维护，不是 BoundX 运行依赖。

## 独立化调整

- 添加本仓库开发规则、远端元数据、换行规则和敏感文件/依赖忽略项。
- README 增加独立安装、运行和测试入口，旧母仓适配引用改为固定提交的历史链接。
- 打包脚本从本仓库根目录读取 `HEAD:package.json`，不再读取母仓或 `HEAD:boundx/...`；补齐 Python、协议、领域包及 ADMIN 桥接文件，支持中文文件名。
- 原母仓 LICENSE 声明原样保留于根目录。本次不执行产品草案中的 AGPL 变更，也不代表公开授权、npm/PyPI 发布或创建 Release。
- 保留旧产品方案和测试记录作为历史资料；其“待拆仓”、母仓路径、外部证据和发布描述应结合本记录理解，不是本仓库当前状态。母仓外部证据未复制，也不作为独立目录的新测试结果。

## 本目录重新验证

环境：Windows、Node.js `v24.16.0`、Python `3.10.11`，使用本目录 `.venv`。

| 检查 | 本次结果 |
|---|---|
| `npm test` 的 core 测试 | 21/21 通过 |
| `npm test` 的 protocol 测试 | 15/15 通过 |
| BXP-CALC 向量运行 | 176/176 通过 |
| `npm run test:ui` | 127/127 通过，含真实 Node/Python 桥接和本地服务端检查 |
| `.venv\Scripts\python.exe -m unittest discover -s python -p "test_*.py"` | 133/133 通过 |
| `python -m py_compile scripts/package-portable.py` | 通过；本次未生成或发布便携安装包 |

首次 `npm test` 失败：迁入快照的 `protocol/conformance/bxp-calc-v1.0.json` 包含无效 UTF-8，无法解析 JSON；母仓同提交包含同样内容，并非新目录运行通过。随后运行既有 `npm run protocol:build` 重建派生产物，再运行测试全部通过。重建结果与原已提交的 provenance manifest 一致，manifest 无需更改；未改生成器、规范、计算算法或预期结果。初始提交保留损坏快照供追溯。

测试通过仅表示当前实现回归通过，不证明任意自然语言已完整理解，也不授予业务决定或执行权限。
