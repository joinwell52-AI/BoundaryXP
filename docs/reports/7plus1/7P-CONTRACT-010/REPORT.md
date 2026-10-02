# 7P-CONTRACT-010 — ADMIN 合同裁定与冻结 Trace 离线重评

STATUS=WAITING_ADMIN_REVIEW
PARSER_UNCHANGED=true
PRODUCTION_READY=false

完成六项 ADMIN 固定裁定与 C1–C7 比较合同冻结。008 r03 的真实解析结果未改、未重新运行。I/O/A 联合完整匹配仍为 0/9，完整 STANDARD 仍为 0/9。合同纠正没有创造新 Parser MATCH。

## 输入与授权

任务声明前轮封存 HEAD 为 64d33f06eabdd3223670011a03e95df307f27f12；实际任务派发 HEAD 为 18458187af814e590c85bd5290f792d133b23549。远端派发仅新增 010 任务书及更新 CURRENT 指针，以快进同步；未做 merge 操作。保留本地所有无关未提交改动。读取完整任务书、v0.3 方法、009 审计/报告/决定、SWAI-009/010 完整 Source 和当前 r02 expected，以及 007/008 比较工具。九案全量冻结 JSON 与参考关系已核对，READING-INVENTORY / HISTORICAL-GOLD-HASHES 固定字节。

只写本报告目录和 fixtures/7plus1/standard-contract/v0.3-admin-20261002/。不改 Parser、QI–QB、历史 Gold/ACTIVE 指针、Source、v0.3、模型/阈值/Pack、BXP、生产入口或旧封存。不启动 58618、不重新解析、不执行样本文本业务操作、不执行 009 counterfactual 输出作为实际答案。REF-001 和非 STANDARD SWAI-005 不变。

## 六项裁定

| 决定 | 原单元 | 当前比较要求 |
|---|---|---|
| D1 | SWAI-009:I1 agent-install-prompt.zh.md | 移出当前 I，保留 BACKGROUND_REFERENCE 证据 |
| D2 | SWAI-009:V0 Python >=3.10 | 两个 bring-up prompt 输出的 OUTPUT_CONTENT |
| D3 | SWAI-009:V1 两个目标版本一致 | 同上，保留完整比较要求 |
| D4 | SWAI-010:V1 Python >=3.10 | 两个 bring-up prompt 输出的 OUTPUT_CONTENT |
| D5 | SWAI-010:V2 最新版/不固定版本 | 同上，既有 no-pin 组件 MATCH 不代替完整要求 |
| D6 | SWAI-010:B0 不硬编码 ==X.Y.Z | OUTPUT_CONTENT，FORBIDDEN；不得当根 B |

六项以原 expected 的 JSON pointer、SHA-256、原 unit ID 和精确 Source span 固定。保留原 ID，不重新编号。五项迁移不删除要求，也不与已有 OCR 自动合并。历史 r02 V/B 已含 OUTPUT_CONTENT 提示，008 比较工具仍在根槽迭代；010 将比较范围显式更正，不改历史文件。

## 冻结重评

| 根槽 | MATCH 原 → 裁定后 | MISSING 原 → 裁定后 | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS |
|---|---|---|---|---|---|
| I | 7 → 7 | 42 → 41 | 3 | 0 | 9 |
| O | 7 → 7 | 42 → 42 | 0 | 0 | 9 |
| A | 9 → 9 | 47 → 47 | 6 | 2 | 9 |
| P | 9 → 9 | 3 → 3 | 0 | 0 | 9 |
| R | 1 → 1 | 0 → 0 | 0 | 0 | 9 |
| V | 12 → 12 | 19 → 15 | 0 | 0 | 9 |
| C | 19 → 19 | 4 → 4 | 0 | 0 | 9 |
| B | 12 → 12 | 30 → 29 | 0 | 9 | 9 |

根要求 263 → 257；MATCH 76 → 76，MISSING 187 → 181。输出内容要求 20 → 25，MATCH 3 → 3，MISSING 17 → 22。全部要求 283 → 282，总 MATCH 79 → 79，总 MISSING 204 → 203。唯一取消的当前要求是 D1；五项迁移仍全部计入 full-case 遗漏。

FALSE_DEFINED 合计 9 → 9；WRONG_BINDING 11 → 11；72 个槽状态差异仍保留。C3 完整 UNION 证明使三个本来已属于 MATCH aggregate 的 test-file 叶条目从 PARTIAL_SUPPORT 改为 component-only MATCH，I PARTIAL_SUPPORT 9 → 6。其完整 I2 原先就 MATCH，根 MATCH 未增长。不是模型或 Parser 修复。

D2/D4 仅字面版本、无 Python >= 完整 owned 关系；D3 两个版本号未绑定两个具体 package 版本；D5 最新版部分缺 package/模态，既有 no-pin 只证明一个组件；D6 实际 root B 写 X.Y.Z 丢失 == 和输出 owner，仍为 WRONG_BINDING。详见 CONTENT-REVIEW-EVIDENCE 与 OFFLINE-REEVALUATION，不使用源文匹配代替语义证明。

| Case | I | O | A | P | R | V | C | B | Owned | IOA joint | Full |
|---|---|---|---|---|---|---|---|---|---|---|
| SWAI-001 | 3/3 | 2/3 | 4/5 | 1/1 | 0/0 | 2/3 | 4/4 | 3/4 | 0/0 | false | false |
| SWAI-002 | 0/4 | 0/9 | 0/6 | 1/1 | 0/0 | 4/5 | 1/2 | 0/5 | 0/0 | false | false |
| SWAI-003 | 0/6 | 0/8 | 0/6 | 1/1 | 0/0 | 4/4 | 1/2 | 0/7 | 0/0 | false | false |
| SWAI-004 | 0/5 | 0/5 | 0/7 | 1/1 | 0/0 | 2/2 | 1/1 | 0/5 | 0/0 | false | false |
| SWAI-006 | 0/2 | 0/4 | 0/6 | 1/2 | 0/0 | 0/4 | 5/5 | 0/3 | 0/0 | false | false |
| SWAI-007 | 0/7 | 0/1 | 1/5 | 1/2 | 1/1 | 0/4 | 3/4 | 0/4 | 0/0 | false | false |
| SWAI-008 | 4/10 | 1/5 | 0/5 | 1/2 | 0/0 | 0/3 | 2/3 | 1/3 | 0/0 | false | false |
| SWAI-009 | 0/5 | 2/6 | 2/8 | 1/1 | 0/0 | 0/1 | 1/1 | 4/5 | 2/12 | false | false |
| SWAI-010 | 0/6 | 2/8 | 2/8 | 1/1 | 0/0 | 0/1 | 1/1 | 4/5 | 1/13 | false | false |

表中为 MATCH/required，不代表槽或 Case 完整。所有 Case 联合/完整仍 false；status、partial/wrong/extra/owned 遗漏均阻断完成。十个已存在的、来源支持但未列在合同中的 distinct top-level boundary 继续 BLOCKING_ADMIN_REVIEW，不自动忽略或增补答案。内部节点、关系、helper/proof 是证据，仅顶层 Canonical 纳入 extra 审阅。

## 剩余实现缺口与恢复决定

203 个遗漏均保留原文和冻结 Trace 证明位置，181 根槽 +22 owned。170/203 与共享 owner/layer/composition 有关；聚类重叠，不能相加当唯一单元数。009 的 R1–R4 仍是恢复主线：R1 scoped owner/layer/candidate arbitration；R2 qualified artifact/reference roles；R3 explicit transfer/recipient；R4 deterministic whole-composition certification including negative evidence。

恢复决定：AUTHORIZE_V0_3_SYSTEMIC_COMPOSITION_REPAIR。建议下一项 7P-COMPOSITION-011，按四个共享抽象一次有界修复；此处仅向 ADMIN 提交决定/任务建议，不启动实现。零已证实 v0.3 表达能力反例；没有外部 proposal 的实测闭环，不能宣称必须 Hybrid。六项裁定没有新增合同歧义，原有 C5 extra 仍待 ADMIN 处理。

## 验证与封存

比较合同最终专项 25 PASS /0 FAIL；独立进程重新计算完整九案 JSON SHA-256 相同。负例覆盖双域误记、缺失/重复 ID、双语 owner、不完整集合、错运算符/成员/owner、缺失来源、无 typed role、输出 predicate 误入根槽、内部证据 vs 顶层 extra、status/owned/extra 阻断。首次 attempt-1 是测试工具深比较 optional undefined 与 JSON 省略字段的失败（24/1），原始失败保留，不当 Parser 失败。修为完整序列化 JSON 哈希比较后 attempt-2 为 25/0。另保留诊断 probe/schema 和初版 aggregate validator 失败，见 INCIDENTS。

本轮 Parser 全量回归、模型调用、58618 通道和自然语言 replay 均 NOT_RUN；仅合同离线重评获授权。旧 008 测试回执不作为本轮 PASS。VERIFY 对本轮前后保护字节、008/009 payload 与封存、模型/依赖 fingerprint、历史 Source/Gold、v0.3、生产入口进行只读 SHA 校验。MANIFEST / SHA256SUMS / SEAL 覆盖新增两个目录；自身引用按四个 envelope 排除并独立校验。提交/远端 blob 回执由 publish 脚本保存 Git 元数据并在最终回复返回，不写入自身封存。

PARSER 修改=false；Gold 修改=false；Source 修改=false；v0.3/QI–QB/模型/生产入口修改=false。未 merge/release/tag。推送 review/7plus1-parser 后停止等待 ADMIN Review。
