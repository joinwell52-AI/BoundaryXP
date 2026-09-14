# 中英混合 61—80：实际原文计算结果

本页由保留的实际 Node → Python 返回值生成；没有把附件中的参考答案传入引擎。字段有值不等于语义完整，未产生提醒不等于通过。来源、类型和全部中间记录在原始 JSON 中。

[返回本轮测试说明](../USER-CASES-017.md)


<a id="case_61"></a>
## CASE_61 · 跨国车联平台 OTA 任务下发（中英混合良定闭环）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 根据《Vehicle OTA Deployment Policy v3.2》，由 Fleet Operations Lead 处理南京网点昨日返回的 20 辆 Buick GL8。向 Telematics Box 下发固件更新指令；单车 processing time 限制在 1200 seconds 以内，API retry count 上限为 3 次；生成 deployment audit report；所有车辆状态标记为 success 即为完成；全流程 strictly forbidden to cut off battery power。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | 固件更新指令 → Telematics Box<br>deployment audit report |
| A · 任务动作 | 由 Fleet Operations Lead 处理南京网点昨日返回的 20 辆 Buick GL8<br>向 Telematics Box 下发固件更新指令<br>生成 deployment audit report<br>条件：所有车辆状态 → 所有车辆状态标记为 success 即为完成 |
| P · 责任与授权主体 | Fleet Operations Lead（执行） |
| R · 资源约束 | 单车 processing time ≤ 1200 秒<br>API retry count ≤ 3 次 |
| V · 版本与依据 | 《Vehicle OTA Deployment Policy v3.2》 |
| C · 完成与停止 | 所有车辆状态标记为 success<br>所有车辆状态标记为 success  |
| B · 已知禁止边界（独立 +1） | 全流程 strictly forbidden to cut off battery power |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  限制在 1200 seconds | bound | x ≤ 1200 seconds |
| 本任务 |  上限为 3 次 | bound | x ≤ 3 count |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

**仍未绑定的原文片段（实际解析记录）**：

- `context_kept_as_unresolved_guard`：所有车辆状态

</details>

<a id="case_62"></a>
## CASE_62 · 跨国物流关税 Settlement（中英货币与区间互斥）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> Per Customs Gateway 回传数据，处理跨境 order 的 customs deposit 退款。根据 Tariff Agreement，单笔 fine deduction amount 至少为 200 dollars，但根据 Service Contract，单笔扣除上限 strictly less than 150 dollars；processing time 限制在 10 mins 以内；生成 settlement bill 即为完成。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 跨境 order 的 customs deposit 退款 |
| O · 交付结果 | settlement bill |
| A · 任务动作 | 处理跨境 order 的 customs deposit 退款<br>生成 settlement bill 即为完成 |
| P · 责任与授权主体 | 未识别；不能据此认定原文没有声明 |
| R · 资源约束 | 单笔 fine deduction amount ≥ 200 dollars（币种待明确）<br>单笔扣除 &lt; 150 dollars（币种待明确）<br>processing time ≤ 600 秒 |
| V · 版本与依据 |  Tariff Agreement<br> Service Contract<br>Customs Gateway 回传数据 |
| C · 完成与停止 | 生成 settlement bill<br>生成 settlement bill  |
| B · 已知禁止边界（独立 +1） | 未识别；不能据此认定原文没有声明 |

### Layer 3 · 计算结果与建议

- **unit_reference_unresolved**：已保留数值 200 与原文单位“dollars”。请明确币种或温标；当前没有把它换算为 USD 或摄氏度。
- **unit_reference_unresolved**：已保留数值 150 与原文单位“dollars”。请明确币种或温标；当前没有把它换算为 USD 或摄氏度。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  至少为 200 dollars | bound | x ≥ 200 dollar_unspecified |
| 本任务 |  strictly less than 150 dollars | bound | x &lt; 150 dollar_unspecified |
| 本任务 |  限制在 10 mins | bound | x ≤ 600 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_63"></a>
## CASE_63 · 云原生 CI/CD Pipeline 部署（依赖图回路死锁）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 由 DevOps Engineer 触发 cluster 升级流程：container image build 必须在 git commit hook 触发后启动；helm chart release 必须在 vulnerability scan 通过后执行；vulnerability scan 必须在 helm chart release 预演后执行；全流程 execution time 限制在 3600 seconds；生成 deployment summary 即为完成；严禁 push unverified artifacts 到 production registry。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | deployment summary |
| A · 任务动作 | 由 DevOps Engineer 触发 cluster 升级流程<br>生成 deployment summary 即为完成 |
| P · 责任与授权主体 | DevOps Engineer 触发 cluster（执行） |
| R · 资源约束 | 全流程 execution time ≤ 3600 秒 |
| V · 版本与依据 | 未识别；不能据此认定原文没有声明 |
| C · 完成与停止 | 生成 deployment summary<br>生成 deployment summary  |
| B · 已知禁止边界（独立 +1） | 严禁 push unverified artifacts 到 production registry |

### Layer 3 · 计算结果与建议

- **dependency_identity_unresolved**：已按原文步骤名称计算依赖图，尚未证明存在环。请为同一步骤使用统一名称或明确对应关系；不同步骤名不能自动合并。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  限制在 3600 seconds | bound | x ≤ 3600 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

**仍未绑定的原文片段（实际解析记录）**：

- `role_or_scope_not_resolved`：helm chart release 必须在 vulnerability scan 通过后执行
- `role_or_scope_not_resolved`：vulnerability scan 必须在 helm chart release 预演后执行

</details>

<a id="case_64"></a>
## CASE_64 · 海外车队整备定损（否定词与 English Metric 解耦）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 根据《Global Fleet Inspection Manual》，由 Local Inspector 验车。single vehicle check 耗时 shall not exceed 1800 seconds，body repair cost 严格禁止大于 500 dollars；生成 damage appraisal report；现场拍照 upload to cloud 即为完成；全流程 strictly forbidden to test-drive without dashcam recording。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | damage appraisal report |
| A · 任务动作 | 生成 damage appraisal report |
| P · 责任与授权主体 | 未识别；不能据此认定原文没有声明 |
| R · 资源约束 | single vehicle check 耗时 ≤ 1800 秒<br>body repair cost ≤ 500 dollars（币种待明确） |
| V · 版本与依据 | 《Global Fleet Inspection Manual》 |
| C · 完成与停止 | 现场拍照 upload to cloud |
| B · 已知禁止边界（独立 +1） | 全流程 strictly forbidden to test-drive without dashcam recording |

### Layer 3 · 计算结果与建议

- **unit_reference_unresolved**：已保留数值 500 与原文单位“dollars”。请明确币种或温标；当前没有把它换算为 USD 或摄氏度。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  shall not exceed 1800 seconds | bound | x ≤ 1800 seconds |
| 本任务 | 禁止大于 500 dollars | bound | x ≤ 500 dollar_unspecified |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_65"></a>
## CASE_65 · 多云混合架构资产清查（中英混杂实体越权命中）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> Under Cloud Ops Directive 2026，由 Cloud Architect 执行 instance audit。target cluster nodes 包含 `app-gateway-prod`、`analytics-worker-01` 与 `db-aurora-primary`；耗时 limit within 7200 seconds；生成 asset compliance sheet 即为完成；protected infrastructure 包含 `db-aurora-primary` 和 `iam-auth-vault`，strictly prohibited to modify production schema on protected infrastructure。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 |  instance audit |
| O · 交付结果 | asset compliance sheet |
| A · 任务动作 | 由 Cloud Architect 执行 instance audit<br>生成 asset compliance sheet 即为完成 |
| P · 责任与授权主体 | Cloud Architect（执行） |
| R · 资源约束 | 耗时 limit ≤ 7200 秒 |
| V · 版本与依据 | Cloud Ops Directive 2026 |
| C · 完成与停止 | 生成 asset compliance sheet<br>生成 asset compliance sheet  |
| B · 已知禁止边界（独立 +1） | strictly prohibited to modify production schema on protected infrastructure |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 7200 seconds | bound | x ≤ 7200 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_66"></a>
## CASE_66 · 跨区域数据 ETL 与 Sync（多工序中英产出供给断裂）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> Phase 1：根据 Data Sync Standard，由 Data Engineer 清洗日志；耗时 within 600 seconds；导出 `clean_access_logs.parquet` 即为完成。Phase 2：由 Security Officer 处理；读取并 decrypt `user_kyc_vault.bin`；生成 encrypted sync bundle 即为完成；strictly forbidden to leak plaintext PII。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 并 decrypt `user_kyc_vault.bin` |
| O · 交付结果 | `clean_access_logs.parquet`<br>encrypted sync bundle |
| A · 任务动作 | 导出 `clean_access_logs.parquet` 即为完成<br>读取并 decrypt `user_kyc_vault.bin`<br>生成 encrypted sync bundle 即为完成 |
| P · 责任与授权主体 |  Security Officer （执行） |
| R · 资源约束 | 耗时 ≤ 600 秒 |
| V · 版本与依据 |  Data Sync Standard |
| C · 完成与停止 | 导出 `clean_access_logs.parquet`<br>生成 encrypted sync bundle<br>导出 `clean_access_logs.parquet` <br>生成 encrypted sync bundle  |
| B · 已知禁止边界（独立 +1） | strictly forbidden to leak plaintext PII |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 600 seconds | bound | x ≤ 600 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_67"></a>
## CASE_67 · 跨境金融 API 速率控制（混语良定基准）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> According to 《跨境清算系统技术规范》，由 Payment Gateway Agent 执行 settlement batching。针对 SWIFT payment messages，batch processing time 限制在 120 seconds，API call rate at most 50 calls per second；生成 gateway transaction receipt；所有 pending batches 状态变为 settled 即为完成；严禁 bypass sanction screening module。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 |  SWIFT payment messages |
| O · 交付结果 | gateway transaction receipt |
| A · 任务动作 | 由 Payment Gateway Agent 执行 settlement batching<br>生成 gateway transaction receipt |
| P · 责任与授权主体 | Payment Gateway Agent（执行） |
| R · 资源约束 | batch processing time ≤ 120 秒<br>API call rate ≤ 50 次/秒 |
| V · 版本与依据 | 《跨境清算系统技术规范》 |
| C · 完成与停止 | 所有 pending batches 状态变为 settled |
| B · 已知禁止边界（独立 +1） | 严禁 bypass sanction screening module |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  限制在 120 seconds | bound | x ≤ 120 seconds |
| 本任务 |  at most 50 calls per second | bound | x ≤ 50 calls_per_second |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_68"></a>
## CASE_68 · 智能合约核心代码部署（Approver 与 Executor 解耦）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 由 Release Engineer 执行 smart contract deployment 到 Ethereum mainnet；deployment time within 1800 seconds；etherscan 返回 transaction confirmed 即为完成；strictly forbidden to upgrade proxy contract unless approved by Multi-sig Committee。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 |  smart contract deployment 到 Ethereum mainnet |
| O · 交付结果 | 未识别；不能据此认定原文没有声明 |
| A · 任务动作 | 由 Release Engineer 执行 smart contract deployment 到 Ethereum mainnet |
| P · 责任与授权主体 | Release Engineer（执行） |
| R · 资源约束 | deployment time ≤ 1800 秒 |
| V · 版本与依据 | 未识别；不能据此认定原文没有声明 |
| C · 完成与停止 | etherscan 返回 transaction confirmed |
| B · 已知禁止边界（独立 +1） | strictly forbidden to upgrade proxy contract unless approved by Multi-sig Committee |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 1800 seconds | bound | x ≤ 1800 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_69"></a>
## CASE_69 · High-risk Transaction Refund（SMT 模态命题冲突）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 根据 Anti-Fraud Management Policy，处理 suspicious payment accounts。未经 Compliance Director approval，strictly forbidden to call batch_refund API；但若 risk engine 触发 Grade-1 Fraud Alert，必须立即 invoke batch_refund 接口；处理耗时 limit within 60 seconds；生成 refund audit log 即为完成。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 |  suspicious payment accounts |
| O · 交付结果 | refund audit log |
| A · 任务动作 | 处理 suspicious payment accounts<br>条件：但若 risk engine 触发 Grade-1 Fraud Alert → 必须立即 invoke batch_refund 接口<br>生成 refund audit log 即为完成 |
| P · 责任与授权主体 | 未识别；不能据此认定原文没有声明 |
| R · 资源约束 | 处理耗时 limit ≤ 60 秒 |
| V · 版本与依据 |  Anti-Fraud Management Policy |
| C · 完成与停止 | 生成 refund audit log<br>生成 refund audit log  |
| B · 已知禁止边界（独立 +1） | 未经 Compliance Director approval，strictly forbidden to call batch_refund API |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 60 seconds | bound | x ≤ 60 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_70"></a>
## CASE_70 · 跨国薪酬发放审批（Double Negation 与 Role Binding）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> According to Global Payroll Standard，由 Payroll Specialist 处理外派员工薪酬发放；单笔 wire transaction fee at most 50 USD；生成 bank confirmation voucher；payroll reconciliation completed 即为完成；shall not execute cross-border remittance unless authorized by VP of Human Resources。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 外派员工薪酬发放 |
| O · 交付结果 | bank confirmation voucher |
| A · 任务动作 | 由 Payroll Specialist 处理外派员工薪酬发放<br>生成 bank confirmation voucher |
| P · 责任与授权主体 | Payroll Specialist（执行） |
| R · 资源约束 | 单笔 wire transaction fee ≤ 50 USD |
| V · 版本与依据 | Global Payroll Standard |
| C · 完成与停止 | payroll reconciliation completed |
| B · 已知禁止边界（独立 +1） | shall not execute cross-border remittance unless authorized by VP of Human Resources |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  at most 50 USD | bound | x ≤ 50 USD |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_71"></a>
## CASE_71 · 跨境电商商户 Credit Line 授信（多量纲正交解耦）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 由 Credit Risk Manager 审核 Cross-border Merchant B 的 credit line 申请；单笔 credit extension 额度上限不得超过 2000000 USD，underwriting turnaround time 上限为 72 hours；生成 credit facility agreement 即为完成；严禁对 high-risk blacklisted merchants 办理 credit extension。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | credit facility agreement |
| A · 任务动作 | 生成 credit facility agreement 即为完成 |
| P · 责任与授权主体 | 未识别；不能据此认定原文没有声明 |
| R · 资源约束 | 单笔 credit extension 额度 ≤ 2000000 USD<br>underwriting turnaround time ≤ 259200 秒 |
| V · 版本与依据 | 未识别；不能据此认定原文没有声明 |
| C · 完成与停止 | 生成 credit facility agreement<br>生成 credit facility agreement  |
| B · 已知禁止边界（独立 +1） | 严禁对 high-risk blacklisted merchants 办理 credit extension |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 | 不得超过 2000000 USD | bound | x ≤ 2000000 USD |
| 本任务 |  上限为 72 hours | bound | x ≤ 259200 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_72"></a>
## CASE_72 · 用户数据脱敏导出（Pronoun Anaphora 歧义拦截）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 根据《Personal Data Protection Policy》，由 Data Compliance Analyst 审查 user profile logs。计算 privacy sensitivity score；export this dataset 限制在 500 MB 以内；导出 compliance sign-off document 即为完成；strictly forbidden to output unhashed email addresses。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | compliance sign-off document |
| A · 任务动作 | 导出 compliance sign-off document 即为完成 |
| P · 责任与授权主体 | 未识别；不能据此认定原文没有声明 |
| R · 资源约束 | 未识别；不能据此认定原文没有声明 |
| V · 版本与依据 | 《Personal Data Protection Policy》 |
| C · 完成与停止 | 导出 compliance sign-off document<br>导出 compliance sign-off document  |
| B · 已知禁止边界（独立 +1） | strictly forbidden to output unhashed email addresses |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  限制在 500  | bound | x ≤ 500 unspecified |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_73"></a>
## CASE_73 · 冷链 Vaccine Batch 运输监控（混合双物理量连续约束）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> Per Pharma Logistics Standard，由 Cold Chain Operator 处理 pending vaccine consignments；dispatch process duration within 15 minutes；cooler internal temperature strictly less than 8 ℃，且 cooler internal temperature at least 2 ℃；生成 transit handover sheet 即为完成；严禁在 loading dock 敞开 cooler doors。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | transit handover sheet |
| A · 任务动作 | 由 Cold Chain Operator 处理 pending vaccine consignments<br>生成 transit handover sheet 即为完成 |
| P · 责任与授权主体 | Cold Chain Operator（执行） |
| R · 资源约束 | dispatch process duration ≤ 900 秒<br>cooler internal temperature &lt; 8 ℃<br>且 cooler internal temperature ≥ 2 ℃ |
| V · 版本与依据 | Pharma Logistics Standard |
| C · 完成与停止 | 生成 transit handover sheet<br>生成 transit handover sheet  |
| B · 已知禁止边界（独立 +1） | 严禁在 loading dock 敞开 cooler doors |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 15 minutes | bound | x ≤ 900 seconds |
| 本任务 |  strictly less than 8 ℃ | bound | x &lt; 8 celsius |
| 本任务 |  at least 2 ℃ | bound | x ≥ 2 celsius |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_74"></a>
## CASE_74 · 港口自动化集装箱分拣（倒装谓词客体精准分离）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 由 Autonomous Crane System 执行；export standard container telemetry logs；针对 Shanghai Port 昨日进港的 300 TEU imported goods，sorting time limit within 3600 seconds；all containers verified by OCR 即为完成标志；全流程 strictly prohibited to handle overweight cargo。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 |  Shanghai Port 昨日进港的 300 TEU imported goods |
| O · 交付结果 | standard container telemetry logs |
| A · 任务动作 | export standard container telemetry logs |
| P · 责任与授权主体 |  Autonomous Crane System （执行） |
| R · 资源约束 | sorting time limit ≤ 3600 秒 |
| V · 版本与依据 | 未识别；不能据此认定原文没有声明 |
| C · 完成与停止 | all containers verified by OCR |
| B · 已知禁止边界（独立 +1） | 全流程 strictly prohibited to handle overweight cargo |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 3600 seconds | bound | x ≤ 3600 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_75"></a>
## CASE_75 · 危险品保税仓出库（双重认证 Quorum 集合约束）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 根据《Bonded Warehouse Safety Code》，由 Warehouse Supervisor 审核 dangerous chemicals release order；manifest review time within 300 seconds；打印 dual-signed release pass 即为完成；未经 Resident Hazmat Specialist 与 Fire Marshal 共同 sign off，严禁 open explosive storage bunker。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | dual-signed release pass |
| A · 任务动作 | 打印 dual-signed release pass 即为完成 |
| P · 责任与授权主体 | 未识别；不能据此认定原文没有声明 |
| R · 资源约束 | manifest review time ≤ 300 秒 |
| V · 版本与依据 | 《Bonded Warehouse Safety Code》 |
| C · 完成与停止 | 打印 dual-signed release pass<br>打印 dual-signed release pass  |
| B · 已知禁止边界（独立 +1） | 未经 Resident Hazmat Specialist 与 Fire Marshal 共同 sign off，严禁 open explosive storage bunker |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 300 seconds | bound | x ≤ 300 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_76"></a>
## CASE_76 · 海运集装箱跨关区转运（中英工序循环死锁）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> Phase 1：由 Customs Agent 办理 port entry clearance；customs release note 必须在 terminal delivery order issued 后生成。Phase 2：由 Truck Fleet 执行 container drayage；terminal delivery order 必须在 customs release note verified 后发放；transport duration within 4 hours；生成 final delivery receipt 即为完成。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 |  container drayage |
| O · 交付结果 | final delivery receipt |
| A · 任务动作 | 由 Truck Fleet 执行 container drayage<br>生成 final delivery receipt 即为完成 |
| P · 责任与授权主体 | Truck Fleet（执行） |
| R · 资源约束 | transport duration ≤ 14400 秒 |
| V · 版本与依据 | 未识别；不能据此认定原文没有声明 |
| C · 完成与停止 | 生成 final delivery receipt<br>生成 final delivery receipt  |
| B · 已知禁止边界（独立 +1） | 未识别；不能据此认定原文没有声明 |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 4 hours | bound | x ≤ 14400 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

**仍未绑定的原文片段（实际解析记录）**：

- `role_or_scope_not_resolved`：customs release note 必须在 terminal delivery order issued 后生成

</details>

<a id="case_77"></a>
## CASE_77 · 临床基因测序数据清洗（时间谓词与有限集约束）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> According to Genomic Research Ethics Policy，由 Bioinformatician 处理 2026 Q1 采集的 whole-exome sequencing samples。batch pipeline execution time at most 14400 seconds；导出 de-identified variant calling format dataset；pipeline quality score verified 即为完成；严禁 retain original donor identity metadata in public buckets。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 |  2026 Q1 采集的 whole-exome sequencing samples |
| O · 交付结果 | de-identified variant calling format dataset |
| A · 任务动作 | 由 Bioinformatician 处理 2026 Q1 采集的 whole-exome sequencing samples<br>导出 de-identified variant calling format dataset |
| P · 责任与授权主体 | Bioinformatician（执行） |
| R · 资源约束 | batch pipeline execution time ≤ 14400 秒 |
| V · 版本与依据 | Genomic Research Ethics Policy |
| C · 完成与停止 | pipeline quality score verified |
| B · 已知禁止边界（独立 +1） | 严禁 retain original donor identity metadata in public buckets |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  at most 14400 seconds | bound | x ≤ 14400 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_78"></a>
## CASE_78 · 多中心临床试验核发（局部 Guard 与全局禁令区分）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 根据 GCP Guidelines，由 Clinical Research Coordinator 向 enrolled patients 发放 investigational drug。dispensing time within 600 seconds；生成 patient follow-up sheet 即为完成；prohibited to dispense investigational formulation B to subjects with systolic blood pressure strictly greater than 160 mmHg。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | patient follow-up sheet |
| A · 任务动作 | 生成 patient follow-up sheet 即为完成 |
| P · 责任与授权主体 | 未识别；不能据此认定原文没有声明 |
| R · 资源约束 | dispensing time ≤ 600 秒 |
| V · 版本与依据 |  GCP Guidelines |
| C · 完成与停止 | 生成 patient follow-up sheet<br>生成 patient follow-up sheet  |
| B · 已知禁止边界（独立 +1） | prohibited to dispense investigational formulation B to subjects with systolic blood pressure strictly greater than 160 mmHg |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 600 seconds | bound | x ≤ 600 seconds |
| 本任务 |  strictly greater than 160  | prohibition_filter | x &gt; 160 unspecified |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_79"></a>
## CASE_79 · 跨中心数据库只读实例同步（混杂名称敏感表碰撞）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> 由 Database Reliability Engineer 执行 disaster recovery replication。target replica sync list 包含 `billing_events_2025`、`audit_logs` 与 `customer_financial_ledger`；sync job duration within 7200 seconds；导出 consistency checksum manifest 即为完成；strictly forbidden to replicate or drop `customer_financial_ledger` 表。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | consistency checksum manifest |
| A · 任务动作 | 由 Database Reliability Engineer 执行 disaster recovery replication<br>导出 consistency checksum manifest 即为完成 |
| P · 责任与授权主体 | Database Reliability Engineer（执行） |
| R · 资源约束 | sync job duration ≤ 7200 秒 |
| V · 版本与依据 | 未识别；不能据此认定原文没有声明 |
| C · 完成与停止 | 导出 consistency checksum manifest<br>导出 consistency checksum manifest  |
| B · 已知禁止边界（独立 +1） | strictly forbidden to replicate or drop `customer_financial_ledger` 表 |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 |  within 7200 seconds | bound | x ≤ 7200 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>

<a id="case_80"></a>
## CASE_80 · 外资银行反洗钱跨境合规数据报送（法定命令与前置评估死锁）

<details>
<summary>展开原文、7+1 与实际计算</summary>

### Layer 1 · 原文证据

> Under 《数据安全管理办法》及 GDPR Article 48，由 AML Compliance Officer 处理 cross-border customer transaction dossiers 调取。未经 Cyberspace Administration assessment approved，strictly prohibited to transmit customer personal dossiers to overseas entities；但若收到 Federal Court Order of Subpoena，必须在 86400 seconds 内完成 full dossier dispatch；生成 compliance transmission receipt 即为完成。

### Layer 2 · 七要素 + B

**本任务**

| 要素 | 实际投影值 |
| --- | --- |
| I · 输入与范围 | 未识别；不能据此认定原文没有声明 |
| O · 交付结果 | compliance transmission receipt |
| A · 任务动作 | 由 AML Compliance Officer 处理 cross-border customer transaction dossiers 调取<br>生成 compliance transmission receipt 即为完成 |
| P · 责任与授权主体 | AML Compliance Officer（执行） |
| R · 资源约束 | 本句指标 ≤ 86400 秒 |
| V · 版本与依据 | 《数据安全管理办法》及 GDPR Article 48 |
| C · 完成与停止 | 生成 compliance transmission receipt<br>生成 compliance transmission receipt  |
| B · 已知禁止边界（独立 +1） | 未经 Cyberspace Administration assessment approved，strictly prohibited to transmit customer personal dossiers to overseas entities |

### Layer 3 · 计算结果与建议

本次返回未产生具体提醒。**这条任务未被认证为无冲突或已完整支持**；下面列出实际计算过的数值，其余条件仍需看覆盖情况。

| 作用域 | 原文数值表达 | 计算类型 | 归一化数值谓词 |
| --- | --- | --- | --- |
| 本任务 | 在 86400 seconds | bound | x ≤ 86400 seconds |

临界值两侧及等号位置的 Z3 求值、单位和原文偏移详见原始 JSON；没有把不同指标自动求交。

</details>
