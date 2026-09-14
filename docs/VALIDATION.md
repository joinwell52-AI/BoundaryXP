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
| Core | BXP 生产者示例、CLI/MCP 同结果、严格输入及显式 legacy 回归 |
| Protocol | Schema、精确数值、双语原文、作用域、摘要与冻结向量 |
| UI | BXP HTTP 与渲染、中英文／非 BMP、Python 码点桥接、legacy 与访问边界 |
| Python | 局部自然语言提取和数学检查 |
| Docs | Markdown 本地目标、标题锚点、当前架构口径与版本检查 |

文档链接检查涵盖 Git 管理和未忽略的新增 Markdown，包括工作区删除状态；不访问项目外的旧目录。外部网站可达性单独核验，403、限流、超时或私有仓库匿名404不能直接判定为链接失效。

Document validation checks local targets and heading anchors. External availability requires separate verification; access restrictions are not proof that a page is missing.

## 实测记录 / Measured results

本轮固定协议 0.3.0-draft.2、套件 1.0.0-draft.3（208条）。每个工作包的实际计数见 [执行回执](tasks/BXP-ALIGNMENT-RECEIPT.md)，最终全量验证与 GitHub CI 状态单独记录，不能沿用其他目录或之前版本的数字。

CLI/MCP/UI 共用 src/bxp/，冻结向量逐对象完整比较；不刷新 expected。Python/Lark 测试属于有限覆盖研究回归。文档扫描区分当前产品口径与带标签的历史非规范材料。

Local tests and remote CI reruns are separate evidence, not a second implementation. Structured vectors are not extraction gold labels. BXP-EXTRACT is RESERVED; passing tests does not certify arbitrary language understanding, authorize execution or publish the product.
