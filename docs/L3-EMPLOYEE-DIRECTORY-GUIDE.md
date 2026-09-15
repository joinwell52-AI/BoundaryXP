# L3职员表 / Employee Directory

当前实现：封闭JSON合同、CSV导入/导出、显式岗位映射、CLI/页面构建、受限ZIP、Registry导入与单独启用、最小词法匹配和虚构目录。尚未完成真实Host和金标验收。

固定CSV列：employee_id,display_name,aliases,subject_type,job_title,status,department。aliases写JSON数组并按CSV双引号转义。允许入口单个BOM，保留原始姓名；重复employee_id拒绝，共享别名返回全部候选。导出含表格公式前缀的身份值时拒绝CSV并要求使用JSON，不暗改身份值。

job_title可自定义；role_ref可省略或null。岗位不是任务责任，不自动补执行人。inactive仍识别身份并显示名册状态；没有名册时仍允许原文文字主体。PM-01不等于product-manager，QA不是QA-01默认别名。

examples/semantic-packs含tenant-a 0.1.0/0.2.0与tenant-b 0.1.0虚构目录，当前示例role_ref均为空，演示只依赖L1的独立职员表。v2要求的可选L2角色映射验收需另补，不将这些空映射示例冒充已完成的全部名册setup。

Customer data stays local. Matching uses edge whitespace trimming and ASCII case folding only; no fuzzy matching, transliteration, Unicode normalization, job-based authorization or cross-tenant identity merging.

同一句证据可以出现多个不同员工。引用中存在某员工独有的姓名或别名时，不因同时出现另一员工而一律判为同名歧义；真正的共享别名仍需消歧或保持未明确。这只核对名册身份依据，不证明谁负责哪个动作，也不产生授权。

A quote may mention several distinct employees. A uniquely identifying name or alias is not rejected merely because another employee appears in the same quote. Shared aliases still require disambiguation or an unresolved state. Identity evidence does not prove action-role assignments or grant authority.

## CLI创建 / CLI Creation

默认本地数据目录为项目下忽略的.boundx。可由宿主配置BOUNDX_DATA_DIR和BOUNDX_TENANT；不同客户使用独立tenant。示例不使用真实客户数据。

```text
node cli.mjs pack import domain-packs/l1/core-ontology
node cli.mjs pack activate boundx/core-ontology@1.1.0
node cli.mjs pack template employee-directory .boundx/customer-input
```

填写生成的employees.csv，保留固定列；或提供符合窄Schema的JSON。然后生成新目录，再显式导入和启用：

```text
node cli.mjs pack create-employees .boundx/customer-input/employees.csv --name my-team --version 0.1.0 --l1 boundx/core-ontology@1.1.0 --output .boundx/my-team-v1
node cli.mjs pack build .boundx/my-team-v1 --output .boundx/my-team-v1.zip
node cli.mjs pack import .boundx/my-team-v1.zip
node cli.mjs pack activate local/my-team@0.1.0
```

如设置其他tenant，最后的local替换为该tenant。create-employees不会导入或启用；目标目录已存在则拒绝。更新改用新的version与输出目录；回退通过activate选择已安装旧版本，不覆盖旧包。

可选映射：先导入指定L2，增加`--l2 boundx/software-ai@0.2.0 --roles <mapping.json>`。映射文件形式为`{"staff-01":"software-engineer","pm-01":null}`；程序填入选定L2的真实版本和摘要，不要求用户手写digest，不根据job_title自动选择。JSON职员表已有role_ref也会验证其确实存在于声明的依赖中。

## 页面创建 / Browser Workflow

运行npm run ui，在打印的本地地址后打开/admin。展开“创建职员表”，下载模板或选择UTF-8 CSV，预览；填写包名、新版本，可选填写岗位映射；生成并下载ZIP，确认导入，再单独启用。行业映射使用页面当前显式选择的行业包；L1和该行业包须先由CLI导入启用。页面请求上限1MB，较大数据使用CLI。

输入、版本、岗位映射或行业改变后必须重新生成。导入失败不改变已启用名册。包启用后旧任务展示清除，要求重新prepare。关闭名册不删除原文中的人物；名册属性不是原文证据。L3上下文披露还受Host的BOUNDX_ALLOW_L3_DISCLOSURE配置控制，启用名册不自动授权外发。

The local browser flow separates preview, build, download, import and activation. No model is called by this flow. After changing a directory, prepare the task again; a successful import is not task authorization. Use the CLI for larger files and retain new immutable package versions for rollback.
