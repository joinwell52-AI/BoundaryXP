import {out,read,write,digest} from './common.mjs';
export function renderReport({final,matrix,ngSummary,safety,independent,performance,repeat,verdict,cmp,states}){
 const a=cmp.before,b=cmp.after,p=performance.STANDARD_first.total,table=matrix.map(c=>`|${c.case_id}|${c.I.MATCH}/${c.I.required}; ${c.I.hybrid}|${c.O.MATCH}/${c.O.required}; ${c.O.hybrid}|${c.A.MATCH}/${c.A.required}; ${c.A.hybrid}|${c.hybrid_joint}|`).join('\n');
 write(out+'REPORT.md',`# 7P-HYBRID-015

TERMINAL_OUTCOME=${final.terminal_outcome}
STATUS=WAITING_ADMIN_REVIEW
PRODUCTION_READY=false

受控 upstream proposal 实验已执行并保留全部真实失败。混合链没有实现同案完整语义：CASE_IOA_JOINT ${a.CASE_IOA_JOINT} → ${b.CASE_IOA_JOINT}，STANDARD_PARSED ${a.STANDARD_PARSED} → ${b.STANDARD_PARSED}，完整 I/O/A 槽 ${a.complete_IOA_slots} → ${b.complete_IOA_slots}。更重要的是，新增准入出现错误 RESOLVED 关系，且 SWAI-009 的实际合同 FAIL，因此裁定 HYBRID_GATE_UNSAFE，不能只写 INSUFFICIENT 或检查 PASS。

## 实验链路与冻结

当前指针为 015；没有继续 014 实现。独立候选只有 engine.mjs 接线与 proposal-lane.mjs，在真实 syntax/typed CandidateGraph 后、closeEdges 与 Eligibility 前生成 UNTRUSTED 关系候选。局部显式依存或已存在 typed edge 确定 EVENT→endpoint 域，BGE-M3/E5 分别检索角色与冻结 L1/L2 action 候选，保留 top-k 和分歧；mDeBERTa 验证候选专属 typed hypothesis。全部 request/response、分数、hypothesis、source spans、SRL/NER、clause、owner/scope/condition/quantity 及模型/Pack摘要在每案 proposals.json 中。

每个候选要过来源、类型、signature、owner/discourse、scope、artifact/reference role、referent、condition、set/cardinality、negative evidence、graph consistency、竞争候选十二类检查。模型分数仅排序，不直接写 Boundary IR 或 Canonical。既有规范 relation、QI–QB 与最终投影没改。此 lane 仅提议已有端点上的六类关系，不产生缺失 node/owner/composite frame；实验范围不足以证明 v0.3 或 hybrid 原理不可能。

实际本地 bge-m3 / multilingual-e5-large / 当前 mdeberta-nli 均已载入和调用；精确 revision、路径、完整逐文件 SHA-256、HanLP/spaCy 资产指纹、框架版本见 MODEL-MANIFESTS.json 与 NLP-RESOURCE-MANIFESTS.json。L1 core-ontology@1.1.0、L2 software-ai@0.2.0 冻结；L3 未选；LLM 未用。不下载升级训练、不调模型或阈值、不访问 hosted API。缺少可提议 pair 的输入没有单案模型调用，不把资源可用算语义覆盖。

## 非 Gold 与首次结果

30 条独立中英文输入及机制合同先冻结，SHA-256=${digest(out+'NON-GOLD-FROZEN-INPUTS.json')}。覆盖长嵌套、背景、OUTPUT_CONTENT、验收、代码/表格、跨节引用、member/wildcard、basis/version、recipient、condition/forbid、deictic、EACH、owner 冲突等。最终与重复运行各 30 PASS / 0 FAIL，仅表示该冻结协议/安全套件通过，绝非语义 30/30 完整。

${safety.length} 次刻意错误 source/owner/role/scope/reference/endpoint/condition 变异均 REJECTED 或 UNRESOLVED。这个有限套件没有覆盖被动受事冒充执行者、nominal predicate、重叠论元和追加关系后 schema 冲突，因此不能把安全套件 PASS 提升为准入门普遍安全。

非 Gold role-kind probe ${ngSummary.recall.probe_role_kind_hits}/30；已有局部 pair 域的 source-typed witness retrieval ${ngSummary.recall.existing_resolved_typed_witness_hits}/${ngSummary.recall.existing_resolved_typed_witness_total}。前者只测角色种类，后者只测已有端点域，均不是整条边界 recall。最终非 Gold新 ADMITTED=${ngSummary.counts.ADMITTED}，ALREADY_PRESENT=${ngSummary.counts.ALREADY_PRESENT}，REJECTED=${ngSummary.counts.REJECTED}，UNRESOLVED=${ngSummary.counts.UNRESOLVED}。新准入为零，precision=NOT_ESTIMABLE。BGE/E5 disagreement=${ngSummary.model_disagreements}；NLI支持/中立/矛盾/不可用分布完整保留在 NON-GOLD-RESULTS。

首次 H18/H24 实际新增两条指代关系，原始结果和独立来源复核全部保留。nominal alias 可能绕过同一 span 上 UNKNOWN_REFERENT 的问题，在 STANDARD 前用通用 span-lattice referent certification 补强并新增回归；没有样例文字、实体或 offset 特判。它们未产生新的错误 RESOLVED；最终均保留未闭合指代。最终专项 10 PASS / 0 FAIL；首次 7 PASS / 1 FAIL 是 counterfactual test 更换数组导致工具闭包失联，修测试原数组删除后重跑，没有据此改 runtime。中间模型运行和测试失败没有覆盖。

## STANDARD 实际准入与失败

九案 Arm A 实际重编译并逐案验证等于冻结 014；Arm B 在同一 source/真实 HanLP/spaCy frozen signals 上实际执行上游三模型，再走同一确定性下游。两次都完成九案；没有边测边修或改写输入。STANDARD 新准入 ${states.ADMITTED} 条，独立来源审阅 ${independent.counts.SUPPORTED_LOCAL_ROLE} 条支持局部角色、${independent.counts.PARTIAL_SUPPORT} 条仅部分支持、${independent.counts.WRONG_BINDING} 条错误。严格局部关系 precision=${independent.post_admission_strict_precision.correct}/${independent.post_admission_strict_precision.total}，partial 不计正确；这不是最终 7+1 准确率。

主要真实缺陷：

- SWAI-003 的 no-op 被 PERSON NER 误标为人；替换为句式中的被替换对象经 nsubj + participant_eligibility 被接受为 AGENT。pub-sub 是替换结果却被接受为 PATIENT；前行显式 TASK-007 后续工作也未被局部 owner 证书排除。错误 RESOLVED 关系真实存在，虽未投影新 P/A 也不能隐藏。
- SWAI-004 在 quoted WHY NOW 的配工具帧新增 migrate-workspace，完整命令名被截断；工具与命令别名被拼成两个对象，但 scope 仍只有旧 ITEM(自动迁移工具) 和旧 relation。已存在错误 ACTION 的 binding 被进一步改坏；不是新完整 A MATCH。
- SWAI-009 的 在/本 续句不识别真正排除对象；追加 FORBIDS 与已有 PATIENT 使 related_node_ids 出现重复。实际 ExecutionContext schema/G1–G16 FAIL，repeat 同样保留失败。完成草稿+验收 与单独验收同时作为独立 PATIENT，暴露跨 endpoint 重叠未检查。
- SWAI-010 的不区分场景是通用适用范围，新增 FORBIDS 把描述性否定当禁止。OUTPUT_CONTENT 隔离阻止当前 B 误投影，但上游关系仍错误；相同复合/成员重叠也存在。

详见 STANDARD-ADMISSION-SOURCE-EVIDENCE、STANDARD-ADMISSION-INDEPENDENT-REVIEW、NEW-CANONICAL-SOURCE-REVIEW 与完整 Trace。源码缺口位于 proposal-lane.mjs 的 directRoleEvidence 与 evaluateProposal：信任上游 EVENT/NER/owner/modality 标签、把 direct nsubj 当 performer、仅同 endpoint 检查竞争角色、scope检查只比对注入前 expression ID。这轮冻结实验在看到 STANDARD 后没有继续修。

## 冻结 010 合同对照

四个 Canonical frame ID 发生替换，不是四个新增义务：relation 加入使内容身份变化。逐项检查旧/新事实、原文、predicate、对象、scope、模态，三条保留原语义分类；配工具帧另保留新增对象与旧 scope 不一致证据。没有以 display string 做自动比较，也没有借人工 expected 补 Parser。所有不变 MATCH 都在实际两臂重验 typed root/aggregate/content proof；三个 OUTPUT_CONTENT relation delta 独立审阅，没有全义务完成 credit。此前的 false-defined/wrong-binding 保留计数，不因 ID 改变重复累计，也不因局部角色正确清掉错误 governing scope。

|Case|I MATCH/required; complete|O MATCH/required; complete|A MATCH/required; complete|joint|
|---|---|---|---|---|
${table}

首个 joint MATCH=NONE。各槽条目数量和具体义务见 CASE-IOA-JOINT-BEFORE-AFTER/FULL-CASE-BEFORE-AFTER。

|指标|Control|Hybrid|
|---|---:|---:|
|CASE_IOA_JOINT|${a.CASE_IOA_JOINT}|${b.CASE_IOA_JOINT}|
|STANDARD_PARSED|${a.STANDARD_PARSED}|${b.STANDARD_PARSED}|
|完整 I/O/A 槽|${a.complete_IOA_slots}|${b.complete_IOA_slots}|
|Canonical false-defined|${a.root_false_defined}|${b.root_false_defined}|
|Canonical wrong-binding|${a.root_wrong_binding}|${b.root_wrong_binding}|
|slot status mismatch|${a.slot_status_mismatches}|${b.slot_status_mismatches}|
|owned-content missing|${a.owned_content_missing}|${b.owned_content_missing}|
|missing root|${a.missing_root}|${b.missing_root}|
|source-floor retained MATCH loss|0|0|
|新增错误 RESOLVED semantic relation|0|${independent.wrong_RESOLVED_relation_count}|
|实际合同失败案|0|${cmp.hybrid_contract_failures.length}|

Canonical错误计数不增长，不代表内部语义soundness没有恶化。没有新增独立错误 Canonical义务，但已有错误事实的结构改变、10 条错误新 RESOLVED 关系和合同失败足以拒绝混合准入门。

## 重复、性能与完整性

39 个最终输入 proposal 各执行两次。ranking/scores/NLI ${repeat.every(r=>r.rank_and_scores_and_NLI_equal)?'完全一致':'有差异，原始结果保留'}；admission、Boundary IR、Canonical、ProofDAG 全部一致。错误也可重复，不代表正确。语法 frozen signals 重用，语法本身未重推理。

STANDARD 首次九案合计：control deterministic ${(p.control_deterministic_ms/1000).toFixed(2)}s，BGE ${(p.bge_ms/1000).toFixed(2)}s，E5 ${(p.e5_ms/1000).toFixed(2)}s，NLI ${(p.nli_ms/1000).toFixed(2)}s，admission ${(p.admission_ms/1000).toFixed(3)}s，hybrid deterministic ${(p.hybrid_deterministic_ms/1000).toFixed(2)}s，total hybrid shadow ${(p.hybrid_shadow_ms/1000).toFixed(2)}s。逐案与 repeat 各分量见 PERFORMANCE；sequential CPU，包括各进程首次模型加载，不含重用语法延迟，不能冒称新输入端到端或 warmed median。

本任务实测专项、安全反例、30 非 Gold、九案配对与重复。015未要求重新跑全仓，因此全量回归本轮未重跑；014历史6181 PASS / 0 FAIL / 17 SKIP不计本轮实测。${read(out+'PROTECTED-ASSET-VERIFICATION.json').checked} 个既有 tracked 字节/缺失状态及原 dirty 状态均保持；实际外部 import closure逐一验证HEAD blobs。宽扫描 flags原样保留、调用路径审阅；30次compile及一次fresh model proposal的读取guard没有读Gold/比较材料。此为有界证据，不声称普遍信息流证明。

Gold/Source、旧seals、v0.3/010、QI–QB、模型、Pack、阈值、Schema、projection、58618/CLI生产入口都没改。MANIFEST/SHA256SUMS/SEAL验证的是证据完整性，不是语义通过。结论 ${final.terminal_outcome}；建议 ${verdict.recommendation}。不建议生产采用，不自动修复或开始下一任务，不merge/release/tag。范围推送review/7plus1-parser后停止等待ADMIN Review。
`);
}
