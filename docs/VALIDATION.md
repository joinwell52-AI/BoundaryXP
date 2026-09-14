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

2026-09-14 在 `D:\boundx` 实际运行：Core 21/21、Protocol 58/58、BXP-CALC 208/208、UI 127/127、Python 133/133；文档检查器回归9/9，7份 CLI 示例可运行。59份 Markdown 的222个本地链接与锚点检查通过。

32个公共外链本次 HTTP 检查均返回200；私有 BoundX 仓库通过已认证 GitHub API 确认存在、保持私有且没有 Release。这个检查结果只表示检查时可达，不保证外部网站永久有效。当前文档没有旧项目地址或项目外证据链接；Git 历史、许可证及规范测试的内容来源标识不因此重写。

向量是人工结构化输入，不是自然语言抽取金标；只有当前源码与当前测试配套运行的结果可用于本项目声明。

Local checks passed for core, protocol, UI, Python, documentation and seven CLI examples. Public external links were reachable at audit time; the private repository was checked using authenticated GitHub access. These results do not certify arbitrary natural-language interpretation or authorize execution.
