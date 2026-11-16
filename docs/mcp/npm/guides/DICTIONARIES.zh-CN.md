# 自定义 L2/L3 字典

适用：MCP 0.4.0-rc.9。rc.8 只支持内置字典，不支持本页导入工具。

从rc.8可直接升级，无需卸载。使用[安装指南的rc.9新版安装器命令](../INSTALL.zh-CN.md#升级)并提供`--migrate-data`原数据目录。旧rc.8管理器的自检固定检查18工具，会拒绝新包的21工具，因此这一轮不能依赖旧管理器自动升级。新版按目标包声明核对工具，支持18/21工具安装与回退。先结束活动任务并断开对应客户端；升级复制数据，不覆盖旧目录。

UTF-8 JSON（允许BOM），每包≤256 KiB、1–512词条。必填schema/id/layer/version/label/entries及两个null权限字段；L3另需tenant。id使用小写字母、数字、点、下划线、短横线；version使用三段版本号。每词条必填唯一id、terms名称数组和definition定义。拒绝重复JSON键、未知字段、超限及同ID同版本不同内容；同名词保留歧义。source与location等只作文字资料，不读取路径或URL。先validate，再用返回sha256导入；导入不会绑定或修改任务。新版本与旧版并存，选择返回的custom/...@版本并bind。字典只是资料，不授予权限；不要放密码、密钥或指令。

## 格式与示例

- [JSON Schema](../schemas/custom-dictionary.json)
- [L2 中文示例](../examples/dictionary-L2-zh-CN.json) · [L2 English](../examples/dictionary-L2-en.json)
- [L3 中文示例](../examples/dictionary-L3-zh-CN.json) · [L3 English](../examples/dictionary-L3-en.json)
- 可用可选词条字段：canonical、kind、environment、location、repository、directories、system、operation、department、job_title、manager_id、subject_type、role_ref、source。完整类型与长度见 Schema；未知字段拒绝，不自动改写原文件。
- 两种语言示例的包 ID 不同，可以同时导入。词条可以用 terms 同时保留中英文名称；不自动翻译或合并同名词。

## 在 MCP 聊天中使用

1. 调用 bx_dictionary_format({language:"zh-CN",layer:"L3"})，直接获取格式和示例，无需打开本地文档。
2. 让宿主读取你选定的 UTF-8 JSON 文件，将完整内容放入 bx_dictionary_validate 的 document 字符串参数。MCP 不读取任意宿主路径。
3. valid=true 后，调用 bx_dictionary_import，提交相同 document 与校验返回的 sha256。不要补造摘要。
4. 用 bx_dictionaries_list 查看返回的 pack_id，然后 bx_dictionaries_bind({selection:{l2:实际L2包ID,l3:实际L3包ID}})。每层同时选择一个包。
5. 新任务使用绑定返回的 selection 和 sha256；旧任务需要明确调用 bx_project_update 的 settings，提供当前 revision。导入本身不修改任务。

口令：“查看L2/L3格式和示例，校验我提供的字典，展示错误与歧义；校验通过后导入，先不要更改任何任务绑定。”

## 在页面中使用

打开工作台顶部 **L2/L3 字典 · Dictionaries**。选择层级和语言，下载 Schema 或示例；上传 JSON 文件（或粘贴 JSON），点击“校验字典”，检查字段路径和歧义提示，再点击“确认导入”。导入成功后，在任务的“模型与字典”里选择对应版本并保存。无需先创建任务即可管理字典。

## 保存、升级与排障

字典保存在 MCP 数据目录的 custom-dictionaries 子目录，不写入安装包。不要手工改这些记录；备份完整数据目录。相同包/版本/内容重复导入无副作用；不同内容必须改 version，旧版保留。新增字典不会自动刷新已有任务的选择；新分析绑定版本和摘要，旧报告不改写。复制迁移会保留自定义字典；回滚到 rc.8 时它不能使用新增自定义字典，但迁移前原目录和任务仍保留。

- INVALID_JSON / DUPLICATE_JSON_KEY：修正 JSON 或重复键。
- DICTIONARY_BYTE_LIMIT：每包最多256 KiB，不截断；按合理领域拆包。
- 校验 errors.path：按 JSON Pointer 定位字段；L3 的 tenant 和每词条 definition 均必填。
- AMBIGUOUS_TERM_RETAINED：同名候选全部保留；不是校验失败或自动消歧。
- DICTIONARY_VALIDATION_DIGEST_MISMATCH：校验后内容发生变化，应重新校验。
- DICTIONARY_VERSION_CONFLICT：同身份版本已有不同内容，使用新版本。
- CUSTOM_DICTIONARY_INTEGRITY_FAILED：保存文件受损，停止使用；从可信备份恢复，不跳过摘要验证。

本地最多200个自定义字典版本。无自动删除、覆盖、模型调用、网络下载或业务授权。字典内容在分析时会提供给所选宿主 LLM 或可选模型 API；导入本身不发送给模型。
