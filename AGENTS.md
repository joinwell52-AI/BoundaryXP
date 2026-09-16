# BoundX开发规则

- 独立仓库joinwell52-AI/BoundX，实施根目录D:\boundx。保持私有，不读写其他项目。
- 当前目标BXP-0001 0.4.0-draft.1；产品版本1.3.0-preview.0。协议文本、目标设计、运行实现状态分别记录，不把设计写成已交付。
- 按docs/tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md执行；本地完成测试和验收，不依赖或触发GitHub Actions/Artifacts/Codespaces。
- 中文文本使用apply_patch、UTF-8，不用PowerShell写中文。
- 修改前核对README、package.json及Git状态，不清理或覆盖用户未提交变更。
- CLI/MCP/UI共享src/bxp唯一Core和版本注册表，未知保持未知。Core不调用模型、不自动读取制度URL。
- Gold Core100/L3 100独立审定；LLM/spaCy/HanLP三路不得读取Gold答案。Primary600与Stability1800分开记录。
- 正式实验须通过任务书冻结门禁；FDR/FAR与失败覆盖单列。证据不得覆盖，失败保留，修订产生新版本。
- L3身份、岗位、职级、权限分离；不从岗位职级或经理关系推导授权。
- business_decision和execution_authorization始终null；Admission不等于执行授权。
- 框架、模型、词典和依赖许可分别核验。不上传凭据、缓存、真实客户数据或无再分发权的模型权重。
- 未经明确授权不修改LICENSE、公开仓库、发布、推送或合并main。
