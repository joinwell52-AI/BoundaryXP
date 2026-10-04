# 7P-ADMIN-NATURAL-021-LONG

`TERMINAL_OUTCOME=ARCHITECTURE_REVIEW_REQUIRED`

`STATUS=WAITING_ADMIN_REVIEW`，`SEMANTIC_ACCEPTANCE=false`，`PRODUCTION_READY=false`。

021 已执行到允许的诊断终态，**没有达到自然短任务解析验收标准，也没有切换生产入口**。保留两轮有效通用改动作为隔离候选，但不批准其上线或替代 020。两轮完整样本主指标均低于预先冻结的 minimum expected delta=5；按 v0.3 §53/54 停止当前修复路线。原封存、Source、Oracle、Pack、模型、阈值、定义及确定性投影均不变。

## 入口、授权与冻结

- 当前指针：`docs/tasks/7plus1/CURRENT-TASK.md` → `7P-ADMIN-NATURAL-021-LONG`。
- 完整阅读任务书、ADMIN 授权、v0.3 规范、020 报告/冻结实现及 019/020 防过拟合规则。
- 测试 Source 在执行前读取；Oracle 只在全部首次输出保存后用于审阅，不作为 Parser 输入。此顺序服从专项 ADMIN blind integrity 授权。
- 基础提交：`d45eb32c6fec8357a37126ac7d8b4a63db4f0744`；只向 `review/7plus1-parser` 交付。
- 首次使用未经修改的 020：`42b1676906fd50576bee5023520584bf55096e047605330cb50d475bbe4ec9d7`。
- Source blob：`15154b2f30453de830f8fd4d78c1a92cf52d9f1e`；Oracle blob：`5410fb1d6d71333ff95f01f4d64b6dcf55103866`。
- PRE-RUN-INTEGRITY：274 项通过，0 失败。预检查曾有 harness 正则错误，失败回执保留；在修正前未执行 Parser。
- 021 隔离诊断候选：`research/7plus1-parser/v0.3-admin-natural-021/`，完整 closure SHA-256 为 `4031ff767123503db363c6b1b526daa500262da60e5537a68ff637db1ff9a1ca`。19 个自身文件、149 个 runtime closure 文件及 94 个模型依赖摘要见 `CANDIDATE-DIAGNOSTIC-FREEZE.json`。
- 真实入口 `parse7Plus1()` 使用原有 HanLP/spaCy；模型/配置/阈值保持 020 状态。BGE/E5/NLI 的运行状态仍是原候选的 NOT_USED；未增加模型调用或 LLM。测试文本仅作为输入，不执行其业务动作。

## 首次独立盲测

| 项目 | 实际结果 |
| --- | --- |
| 完整语义 | 16/100 |
| clear cases | 16/95 |
| ambiguity controls 完整验收 | 0/5 |
| 保存成功输出 / 保存错误 | 99 / 1 |
| 成功输出中的合同 Gate | 98 PASS / 1 FAIL |
| 首个失败 | ANB-001：QA 复核/转交链缺失 |
| 执行异常 | ANB-014：MISSING_REQUIRED_OBJECT_SCOPE |
| 合同失败 | ANB-037：retry 数量目标未闭合 |

首次确证的病例级问题簇为 partial RESOLVED 12、wrong binding 9、unsupported RESOLVED 11、遗漏 50、执行错误 1、合同失败 1。59 个 clear 病例含未决。**这些是每个失败病例的一组已核实问题，不是所有错误 BoundaryFact 的穷尽计数**；不把它们解释为完整 false-accept 数量。100 份逐条源文、实际答案、证据及审阅均保留。

原始 `FIRST-BLIND-SEAL.md` 和 `FIRST-BLIND-SHA256SUMS.txt` 完全不改；交付前逐一核对其 905 个文件，全部一致。看到失败后，这 100 份只作 development/regression；不得把后续重放称为新的独立盲测。

## 两轮通用实现及主指标

| 轮次 | 实现前冻结的对照 | 完整样本 | 净增 | 预声明门槛 | 结论 |
| --- | --- | --- | --- | --- | --- |
| R01 | 18：每类 3 positive、2 negative、1 ambiguity | 20/100 | +4 | +5 | 主指标假设未成立 |
| R02 | 再加 18；累计 36 | 21/100 | +1 | +5 | 第二次未成立，停线 |

R01 修复礼貌前缀与主体分离、词形/lemma 的来源保留、并列补语、禁止停止与完成域分离。新增闭环为 ANB-009/017/025/026。

R02 加入输出内容的非执行域、显式职责否定状态、未决对象对依赖事实的阻断，以及局部报告内容与唯一输出身份的绑定。ANB-004 首次闭环：QA 的“报告内容”通过带证据的 CONJUNCTION 绑定 `api-audit.md`，不再成为新的 I；DEV/QA/PM 的 PERFORMER/REVIEWER/RECIPIENT 保持独立，禁止修改接口定义的边界保留。具体节点、关系、scope、span 见 `development/r02/SEMANTIC-REVIEW/ANB-004.json` 和该例实际 Trace。

最终为 **21/100，clear 21/95，ambiguity controls 0/5**。最终病例级确证问题簇：遗漏 50、partial RESOLVED 12、wrong binding 10、unsupported RESOLVED 5、执行错误 1、合同失败 1；52 个 clear 病例仍含未决。某些 safety 错误减少不等于整例闭环；不能将所有错误降为 UNRESOLVED 视作修复成功。

R02 独立对照实际为 33/36。三个真实失败 REF-N1、ROLE-P2、ROLE-N2 全部保留。审阅 harness 的字段路径/控制分类问题另有只读纠正，原结果没有覆盖，Source、Oracle、expectation 和 Trace 均未改。详见 `HARNESS-CORRECTIONS.json`、`CONTROL-REVIEW-CORRECTION.json`、`FINAL-CONTROL-REVIEW.json`。

## 实测保留、回归、重复性

| 检查 | 实际结果 |
| --- | --- |
| 020 main50 | 47/50；ADM-011/032/044 失败 |
| 旧 shadow100 | 98/100；两个对应合并禁止例失败 |
| 原 019 controls / 020 controls | 48/48、48/48 |
| 原 020 final blind A / B | 120/120、120/120；本轮为保留性重放 |
| G0 / 原 R1 controls | 5/5、17/18；R1 A3 输出章节未保留 |
| D01–D08 / REF-001 | 8/8、43/43 |
| 021 专项 Node 测试 | 34 PASS / 3 FAIL，总 37 |
| 原断言重定向当前候选 | 131/131；不替代逐源文完整语义审阅 |
| 原有 Parser 回归 | 4400/4400；使用原有测试的入口 |
| 全仓库 `npm test` | 6453：6433 PASS、3 FAIL、17 SKIP；未将 skip 计为通过 |
| 防过拟合 | 90/90 paired checks；30 改名、20 顺序、20 数量、20 中英；静态扫描 PASS |
| fresh NLP 两次重放 | 648/648 成功输出语义签名 EXACT；另 1/1 异常 ERROR_EXACT |

全仓库三个失败就是新专项的 REF-N1、ROLE-P2、ROLE-N2，断言仍要求正确语义，不改 expected 使其变绿。完整 stdout/stderr、命令、时间、exit code 已保存。重复性包括全部 ANB、main/shadow/blind、两代历史对照、本轮对照、D/REF/R1，共 649 个输入；异常没有可比较的成功语义签名，单独报告。

上述结果证明新候选有历史回退。020 原验收记录保持有效；不能用旧 020 的通过数字冒称新候选保留成功，也不能用合同或回归通过冒称自然语义通过。

## 下一处偏离与架构复审

首个仍失败的自然样本是 ANB-001：显式 QA 复核/交付链仍未形成完整根动作与角色框架。新增词形、安全状态及晚期阻断器无法恢复早期丢失的端点。ROOT frame proposal、participant role、output owner、quantity/condition target 和 unresolved dependencies 尚未共享完整的整框架认证合同。

实际源码位置及证据在 `ARCHITECTURE-REVIEW.md`、`REPAIR-IMPLEMENTATION-DIFF.json` 和 `FINAL-FIRST-DIVERGENCE.json`。ANB-028 的内存目标仍是 TASK，ANB-041/049 的职责/发送角色未闭合，ANB-066/075 的章节只是 opaque content，ANB-097 的候选域不能只从 RESULT 取得，因为原文是读取两个报告。ANB-014 的范围异常也不能隐藏。

三处 Source/Oracle 对应疑点保持原字节：ANB-039 的 test/staging、ANB-047 条件逆命题、ANB-056 禁止修改是否能推出输入。它们不抵消其他真实缺陷，也没有成为 runtime 特判。

按 v0.3 §54 停线并非请求放宽验收：两次可证伪主指标均失败，晚期局部认证与既有资格/角色/投影依赖存在实际不一致，需要 ADMIN 裁定统一认证合同。建议先复审，未自动开始新架构或第三轮短语修補。未来修复闭环后仍需要一套新的 ADMIN 独立盲测。

## 交付与完整性

保护了 14,183 个原有跟踪文件；已封存 020、Source/Oracle、模型/配置/阈值及生产 package 入口完全不变。当前工作区原有不相关改动未纳入交付。没有权重、缓存或凭据上传。

1930 份原始 Trace/Proof 文件无损保存在 36 个 `evidence-archives/*.tar.gz` 中，`ARCHIVE-INDEX.json` 逐文件登记原路径、字节数和 SHA-256，所有本地原文件也保留。Git 中源文、Canonical 答案、逐条审阅和概要可直接查看；恢复完整 Trace 后可核对首次封存：

```text
python docs/reports/7plus1/7P-ADMIN-NATURAL-021-LONG/restore-evidence.py
```

恢复工具不覆盖不同内容；本地已验证 1930 个 archive member 的原始字节。最终 Manifest、SHA256SUMS、SEAL 及 post-seal verification 分开，避免循环 hash。封存校验 PASS 只表示产物完整性，语义验收仍为失败。

完成本任务范围内的诊断、保留性与回归交付后只推送 `review/7plus1-parser`，不 merge、release、tag，不更换生产入口。最终 commit 在 Git 交付回执及分支历史中登记，避免嵌入自身封存文件形成自引用。
