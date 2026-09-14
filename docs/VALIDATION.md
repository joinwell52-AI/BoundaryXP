# BoundX 验证说明 / Validation

工作目录：`D:\boundx`。当前是独立项目私有研发阶段，不以测试通过代替公开发布、语义认证或执行授权。

## 可重复命令 / Commands

```text
npm ci
npm test
npm run test:ui
.venv\Scripts\python.exe -m unittest discover -s python -p "test_*.py"
npm run test:docs
```

Linux/macOS 将 Python 路径替换为 `.venv/bin/python`。

## 验证范围 / Scope

| 验证 | 内容 |
|---|---|
| Core | 结构化任务、规划、分解、回应与授权边界 |
| Protocol | Schema、精确数值、双语原文、作用域、摘要与冻结向量 |
| UI | 中英文界面、ADMIN 本地 Python 桥接与访问边界 |
| Python | 局部自然语言提取和数学检查 |
| Docs | Markdown 本地目标、标题锚点和检查器回归 |

文档链接检查涵盖 Git 管理和未忽略的新增 Markdown，包括工作区删除状态；不访问项目外的旧目录。外部网站可达性单独核验，403、限流、超时或私有仓库匿名404不能直接判定为链接失效。

Document validation checks local targets and heading anchors. External availability requires separate verification; access restrictions are not proof that a page is missing.

## 当前自测 / Current self-test

2026-09-14 在 `D:\boundx` 实际运行：Core 21/21、Protocol 85/85、BXP-CALC 208/208、UI 127/127、Python 133/133；文档检查器回归9/9。59份 Markdown 的225个本地链接与锚点检查通过。

本轮协议为 `0.3.0-draft.2`，计算套件为 `1.0.0-draft.3`。公共外链可达性和私有仓库权限需单独核验，本节本轮文档结果仅涵盖本地目标与锚点，不保证外部网站永久有效。Git 历史、许可证及规范测试的内容来源标识不因此重写。

已配置 Node.js 22/24 的最小协议 CI；配置存在不等于远端运行通过，实际状态以 GitHub Actions 为准。本地测试和 CI 都不是第二独立实现的互操作验证。

向量是人工结构化输入，不是自然语言抽取金标；只有当前源码与当前测试配套运行的结果可用于本项目声明。

Local checks passed for core, protocol, UI, Python and local documentation links. The CI workflow reruns protocol tests on Node.js 22/24; its actual status is separate from these local results. Neither proves arbitrary extraction quality or authorizes execution.
