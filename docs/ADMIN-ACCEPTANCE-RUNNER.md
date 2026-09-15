# ADMIN验收运行器 / ADMIN acceptance runner

运行器连接原120条任务文本、独立场景包、准备快照、模型原始候选、程序诊断、BXP输入与结果。不生成金标，不把Core结构通过解释为抽取正确。

The runner links the 120 task seeds, isolated package setups, prepared snapshots, raw model candidates, diagnostics and BXP inputs/results. It does not generate gold labels or infer semantic accuracy from valid IR.

## 离线检查 / Offline plan

```text
node scripts/run-admin-acceptance.mjs --plan
```

不加参数也只输出计划，不读取密钥、不调用模型、不创建运行目录。验证120个连续ID、原文摘要、语言/类别数量以及审阅索引对应关系。固定复测T001–T010、T031–T040、T111–T120，总计150个预定初始运行，不是150条独立原文。

The default is offline: no credential lookup, model call or run directory. The plan validates source digests and enumerates the exact 120+30 schedule. Repeated runs are not additional independent sources.

## 显式运行 / Explicit execution

仅在已取得虚构语料外发和模型费用授权后，由操作者配置当前进程环境变量：

| 环境变量 / Variable | 用途 / Purpose |
|---|---|
| BOUNDX_MODEL_PROVIDER | 本轮使用codex订阅；也支持api、cursor / This acceptance uses codex subscription; api and cursor remain supported |
| BOUNDX_MODEL_ID | 明确模型ID / Explicit model ID |
| BOUNDX_MODEL_PROTOCOL | API入口使用responses或chat / responses or chat for API |
| BOUNDX_MODEL_URL | HTTPS API完整地址 / HTTPS API endpoint |
| BOUNDX_MODEL_API_KEY | API密钥，仅当前环境 / API credential in process environment |
| CURSOR_API_KEY | Cursor密钥，仅当前环境 / Cursor credential in process environment |

```text
node scripts/run-admin-acceptance.mjs --execute --authorize-synthetic-data --max-runs 1
```

`--max-runs`必须明确给出1–150；该命令可能产生费用。没有隐式重试，不读取其他仓库或.env文件，不打印密钥。完整计划在审批后才能选择150。提供方调用失败保留记录；日志或场景构建失败则停止批次，不跳过该种子继续发送。

An explicit 1–150 bound and data authorization are mandatory. Execution may incur charges. There are no implicit retries, cross-repository config reads or credential prints. Provider failures remain recorded; setup or persistence failures stop the batch.

本轮统一使用 Codex 订阅接入，明确设置 `BOUNDX_MODEL_PROVIDER=codex` 和可用的 `BOUNDX_MODEL_ID`；使用本地已登录账号，不读取 API 密钥，不回退到 Cursor。认证失败、额度限制或模型不可用时，批次以 `PROVIDER_BLOCKED` 停止，`provider_stop` 只记录用例 ID 和安全错误码；失败记录及150项固定分母保留。候选 JSON 无效不会阻止下一条用例，也不会被重试或伪装成成功。

This acceptance uses Codex subscription authentication, an explicit available model ID and no API key or Cursor fallback. Authentication, quota and unavailable-model errors stop subsequent dispatch with `PROVIDER_BLOCKED`; `provider_stop` contains only the run ID and safe code. Failed records and the fixed 150-run denominator remain. Invalid candidate JSON does not stop the next scheduled case or trigger retries.

中断后可以显式使用 `--start-at 42 --max-runs 109` 运行固定计划的第42至150项；编号121至150对应原定30条复测，不是新原文。分段始终创建新目录，保留旧记录，不自动重试中断项、覆盖或合并旧结果。每段仍报告150项分母及本段起点/数量；完成一个分段不代表完整验收。汇总必须逐运行ID核对重复、缺失、实现版本及中断记录，不能简单相加成功数。

After interruption, an explicit `--start-at 42 --max-runs 109` runs schedule positions 42–150 in a new directory. Positions 121–150 are the fixed repeat cases. Previous artifacts remain untouched; interrupted calls are not automatically retried or counted as completed. Segment summaries retain the 150-slot denominator and declared range. Combined reporting must account for duplicates, missing runs, implementation revisions and interruptions, not simply add success totals.

## 场景与记录 / Setups and records

每次运行使用独立Registry；支持全部12种任务书setup，包括关闭L3、仅L1、tenant-b、prepare后切换名册、真实附加POL-1、缺附件及版本错配。恶意包文本位于虚构名册的合法岗位/别名字段，仅作为数据提供；不改变原文或生产者规则。

Each run has its own registry. All 12 setup variants preserve exact source text, explicit package selection and policy bytes. Malicious package text is synthetic data, not an execution instruction.

记录保存在忽略提交的`.boundx/acceptance-runs/<随机批次ID>/`：

- `plan.json`：源/审阅索引摘要及固定计划。
- `<用例ID>-<次数>/record.json`：开始、调用前、原始输出返回及计算后的原子记录；实际model ID可取则保存，版本未知保持unknown。
- 每次运行的Registry与prepare文件：包锁、规则、Schema摘要、最小上下文。
- `summary.json`：逐语言/类别的记录、拒绝和未完成数量；取消或记录失败显式标注。

Raw candidates and snapshots may contain task data; keep this directory private. Known credential echoes cause the affected record to be discarded and marked incomplete. Temporary files left by an interrupted atomic write are not completed records.

错误包摘要注入与标签适配器回放是独立的`model_call: false`程序检查，不增加真实调用计数。摘要分别统计提供方尝试、有原始输出的live记录及mock尝试；提供方尝试不等于成功生成。失败、不完整及取消不计为语义正确。精确率和召回率保持null，直到独立审阅金标及匹配规则完成。

Digest injection and label replay are separate program checks, never extra live model calls. Provider attempts, returned outputs and mock attempts are distinct. Precision/recall remain null pending independent gold review and frozen matching rules. A finished batch is not overall product acceptance or BXP-EXTRACT certification.

## Codex 实测增量 / Codex live checkpoint

2026-09-15：Codex 订阅模型 `gpt-5.6-sol` 已对固定计划首条 `T001-1` 完成一次真实调用，保留原始候选，Core 返回 `COMPUTED`，无网络的确定性回放为 `MATCHED`。本地记录目录为 `.boundx/acceptance-runs/eeef5bae-9a74-49df-8280-b5a2be56a43e/`（不提交）。该批次实际调用1次、有输出1次，剩余149项未运行；不代表抽取语义正确或最终验收通过，独立金标审阅仍未完成。

On 2026-09-15, one real Codex subscription call using `gpt-5.6-sol` completed fixed run `T001-1`, preserving its raw candidate. Core returned `COMPUTED` and offline replay `MATCHED`. The remaining 149 scheduled runs are missing; semantic accuracy and independent gold review remain unverified. Four added mock tests cover provider-blocked stopping and continuation after invalid JSON; all 30 runner tests pass locally.

## 运行器初次实现记录 / Initial runner implementation record

在独立目录重新运行：已跟踪Core 419/419、UI 154/154、协议单测103/103、冻结向量208/208、Python 135/135、文档单测20/20。新增24项运行器测试覆盖12种setup、固定120+30计划、原子落盘、失败/取消、凭据回显拦截、包摘要注入及跨适配器回放；模型传输全部模拟，真实模型生成仍为0次，独立金标审阅仍未完成。

Tracked Core419, UI154, protocol103, frozen vectors208, Python135 and documentation20 pass locally. The 24 new runner tests use mock transports, not live generation or independently reviewed gold labels.

首次工作区回归440/441通过，随后已跟踪文件回归418/419通过，均在既有中英文HTTP集成用例中的中文组遇到ECONNRESET；单独复跑3/3通过。该用例在同一事件循环中同步启动CLI/MCP子进程，长时间阻塞后复用空闲HTTP连接存在关闭竞态。测试请求改为显式关闭连接后，已跟踪完整回归419/419通过；未增加失败重试，未更改服务端或计算规则。工作区数量额外包含另一任务的22项行业测试，未提交到本增量。

Two initial full runs exposed an idle-connection reset in the existing integration test; the isolated three tests passed. Explicit connection closure removes idle reuse across synchronous CLI/MCP subprocess waits. The subsequent tracked full run passes without retries or production changes. Concurrent industry tests are excluded from the committed count. CI is reported separately for the actual commit.
