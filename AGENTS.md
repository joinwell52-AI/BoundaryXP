# 界痕 · BoundX 开发规则

- 本仓库为独立产品 BoundX，当前唯一工作目录为 `D:\boundx`；远端为 `https://github.com/joinwell52-AI/BoundX`，保持私有。
- 只按独立项目维护，不加载其他项目的治理规则，不读写或上传其他项目。
- 开发前核对本仓库 README、相关规则、package.json 版本及 Git 状态。
- 中文环境，不要用 PowerShell 修改中文；文本编辑使用 apply_patch，保持 UTF-8。
- Agent 或其他生产者按 7+1 形成 boundx-task/v1；BoundX 本地进行 Schema、证据、语义验证和确定性计算，输出 boundx-result/v1。支持中文与英文，保留原文证据。
- CLI、MCP、UI 共享 src/bxp/ 唯一 Core，Schema 与版本取唯一注册表；不得复制计算器或重新定义协议。Python/Lark 与语义包是有限覆盖研究／生产者方法，不是抽取符合性证明。
- BXP-0001 0.3.0-draft.2 为固定合同；BXP-EXTRACT 保持 RESERVED，不新增协议编号。
- 保持 I 输入范围、O 交付、A 动作、P 责任主体与角色分工、R 资源、V 版本依据、C 完成停止，以及独立 B 禁止边界；未明确项保持未明确。
- 建议不等于业务裁决或执行授权；business_decision 与 execution_authorization 始终 null。Core 不调用模型、不访问网络、不自动读取制度 URL；宿主负责裁决和执行。
- 当前产品版本 1.3.0-preview.0；协议与套件版本单独维护。legacy 接口必须显式标记已弃用，不静默升级旧对象。
- 验证必须在本独立目录重新运行；其他目录或版本的测试结果不得当作本次验证。
- 不提交虚拟环境、依赖缓存、密钥或客户私有数据；不擅自公开仓库、发布产品或变更许可证。
