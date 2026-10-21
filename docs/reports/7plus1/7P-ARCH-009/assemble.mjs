import fs from 'node:fs';
import {read,write,old,out,runtime,sha} from './collect.mjs';
const comparison=read(old+'COMPARISON.json'),gold=read(out+'GOLD-CONTRACT-AUDIT.json'),dag=read(out+'CLUSTER-DEPENDENCY-DAG.json'),cf=read(out+'COUNTERFACTUAL-RESULTS.json');
// This script assembles diagnostic artifacts only. It never invokes a model,
// changes a parser module, supplies Gold to a compiler, or rescores a run.
const excerpts=(p,from,to)=>({path:p,sha256:sha(fs.readFileSync(p)),start_line:from,end_line:to,text:fs.readFileSync(p,'utf8').split(/\r?\n/u).slice(from-1,to).join('\n')});
const chains=[];
for(const [case_id,node_id,fact_id] of [['SWAI-006','p1:54d26ba4cd7808e48019c486','p1:d5a9cec7e061d231e780c5d3'],['SWAI-010','p1:84d07ac5d3a7ebf8627631d3','p1:11d81173009ccaf0a6c32aae']]){
 const p=old+'replay-r03/'+case_id+'/trace.json',t=read(p),c=t.compiler_v03,n=c.semantic_nodes.find(n=>n.node_id===node_id),f=c.boundary_ir.facts.find(f=>f.boundary_fact_id===fact_id);
 if(!n||!f)throw Error('Wrong soundness chain ID');
 const relations=c.relations.filter(r=>f.relation_ids.includes(r.relation_id)),decision=c.eligibility_decisions.find(e=>e.eligibility_decision_id===f.eligibility_decision_id),entries=[...'IOAPRVCB'].flatMap(k=>c.canonical_7plus1[k].entries).filter(e=>e.boundary_fact_ids.includes(fact_id));
 const spans=t.source_spans.filter(s=>new Set([...f.source_span_ids,...n.source_span_ids]).has(s.span_id));
 chains.push({case_id,frozen_trace:p,frozen_sha256:sha(fs.readFileSync(p)),source_spans:spans,node:n,relations,eligibility:decision,fact:f,canonical_entries:entries,contract_gates:t.contract_gate_results.status,relation_type_audit:t.relation_type_audit.status,model_validation:c.nlp_signals.semantic_model_signals.relation_validation.filter(v=>v.candidate_node_ids.includes(node_id)),counterfactual:cf.experiments.find(x=>x.case_id===case_id&&x.removed_fact_ids?.includes(fact_id)),interpretation:case_id==='SWAI-006'?'A main prohibition on git add is inherited by a parenthetical explanation predicate. Exact spans and legal role types do not establish prohibition ownership.':'A line-wrapped narrative token is promoted to a required document imperative. Valid IDs and graph signatures do not license current task action ownership.'});
}
write('SOUNDNESS-SOURCE-EVIDENCE.json',{task:'7P-ARCH-009',mode:'FROZEN_ACTUAL_TRACE_AND_SOURCE_INSPECTION',chains,code_excerpts:[excerpts(runtime+'candidate-recall.mjs',27,39),excerpts(runtime+'grammar.mjs',23,33),excerpts(runtime+'syntax-mechanisms.mjs',29,38),excerpts(runtime+'instruction-syntax.mjs',8,24),excerpts(runtime+'engine.mjs',26,34),excerpts(runtime+'eligibility.mjs',7,14),excerpts(runtime+'eligibility.mjs',33,40),excerpts(runtime+'compiler/validation/gates.mjs',45,64),excerpts(runtime+'model-signals.mjs',1,24)],limits:'These are two witnessed causal chains, not an exhaustive causal localization of every false entry. CF05 accepts unused poisoned metadata but does not emit a new wrong boundary; do not confuse metadata validation with emitted semantic corruption.'});
const stageMap=read(out+'PIPELINE-STAGE-MAP.json');
for(const s of stageMap.stage_rows){s.code_files=s.code.split(' + ').map((p,i)=>i?p.startsWith('research/')?p:runtime+p:p).flatMap(p=>p.split(' / ').map((q,i)=>i?runtime+q:q)).map(p=>p.replace(/:(?:produceEligibility|produceBoundaryIR)$/u,''));if(s.stage==='POST_CANONICAL_MODEL_SIGNALS')s.code_files=[runtime+'model-signals.mjs'];if(s.stage==='QI_QB')s.code_files=[runtime+'graph-queries.mjs'];if(s.stage==='STRUCTURE_DISCOURSE')s.code_files=[runtime+'frontend.mjs',runtime+'discourse.mjs'];for(const p of s.code_files)if(!fs.existsSync(p))throw Error('Invalid stage code path '+p);}
write('PIPELINE-STAGE-MAP.json',stageMap);
const missing=gold.units.filter(x=>x.frozen_comparison_finding!=='MATCH'),ownership=missing.filter(x=>x.cluster_ids.some(id=>['C02','C04','C05','C06','C07','C08','C11'].includes(id)));
const allOriginalBlockers=dag.nodes.reduce((n,c)=>n+c.phase_a_blocker_count,0);
const optA={option:'A',decision_candidate:'CONTINUE_V0_3_IMPLEMENTATION',assessment:'CONDITIONALLY_PLAUSIBLE_NOT_CURRENTLY_JUSTIFIED',root_abstraction_count:4,work_estimate:dag.root_abstractions.map(r=>({...r,effort:r.id==='R1'||r.id==='R4'?'HIGH_CROSS_STAGE_CONTRACT_AND_ADVERSARIAL_VALIDATION':'MEDIUM_TYPED_NORMALIZATION_OR_TRANSFER_FRONTEND'})),normative_change_required:false,can_address:['C02','C03','C04','C05','C06','C07','C08','C09','C10','C11'],C12:'Derived accountability after genuine semantic closure; not a separate clearing rule',expected_closure:'Unmeasured; four abstractions are a dependency decomposition, not proof of 9/9 closure',false_positive_risk:'HIGH: partial local certificates already promote well-typed wrong owners and narrative predicates',maintenance:'Without a single consumed owner/layer/behavior contract, independent local helpers multiply competing metadata; adding rules alone is not recommended',performance:{historical_latency_ms:[451961,641998],change_percent:null,measurement_note:'Historical total over ten replays. Concurrency/query-volume changed; no controlled 009 latency experiment',new_009_model_latency:'NOT_MEASURED'},criteria:{few_abstractions:true,all_accepted_standards_source_contract_clear:false,full_downstream_counterfactual_closure_proven:false,false_positive_growth_contained:false,new_normative_abstraction_proven_needed:false},recommendation:'Only after ADMIN source/scope comparison adjudication and independent proof of complete owner/composition admission; not another phrase-first patch'};
// Keep the historical ratio exact without introducing a rounded pseudo-measurement.
optA.performance.change_percent=(641998/451961-1)*100;
write('OPTION-A-V0.3-CONTINUE.json',optA);
write('OPTION-B-HYBRID-FRONTEND.json',{option:'B',decision_candidate:'HYBRID_FRONTEND_REQUIRED',assessment:'RESEARCH_OPTION_NOT_EVIDENCE_ESTABLISHED_REQUIRED',existing_roles:{HanLP_spaCy:'Actual upstream syntax/SRL/NER evidence',BGE_M3_E5_NLI:'Actual post-Canonical ranking/role-validation signals, no candidate owner/scope injection',LLM:'NOT_USED'},counterfactual_manual_proposals:6,actual_model_semantic_proposal_trials:0,measurable_multi_cluster_collapse:false,representation:'v0.3 node/relation/expression/provenance interface can accommodate proposals; no direct model-to-slot projection permitted',certification_suitable:'Existing type/ID/source checks are necessary but not sufficient; global predicate-layer/domain/negative ownership evidence must be consumed before any proposal is admitted',benefit_hypothesis:'May reduce upstream discovery omissions when proposals include owners, scoped arguments and behavior composition; not measured in this task',risks:['Well-typed hallucinated or misowned predicates pass local gates','Posthoc NLI entailment of a role does not establish a prohibition','Cost, latency, repeatability and licensing remain to be evaluated in an ADMIN-authorized controlled experiment'],criteria:{v03_representation_insufficient:false,upstream_discovery_dominant:true,deterministic_certification_adequate_for_untrusted_owner_proposals:false,model_proposal_collapse_measured:false},recommendation:'Do not select REQUIRED or authorize models from this audit. If later authorized, compare frozen non-Gold proposal graphs and deterministic acceptance against adversarial owners; preserve all raw failures and provenance.'});
write('OPTION-C-V0.4-METHOD.json',{option:'C',decision_candidate:'V0_4_METHOD_REQUIRED',assessment:'NOT_SUPPORTED_AS_REQUIRED',confirmed_unrepresentable_semantics:0,method_clauses:['§10 nodes/roles','§11 conditions and quantity','§16.2 owned output content','§17 PART_OF or equivalent structural provenance','§18.1 graph consistency'],actual_implementation:'Explicit owner annotations and several frame/contract metadata exist; no single fully consumed hierarchical semantic ownership/composition forest',PART_OF:{normative:true,runtime_relation_enum:false,equivalent_provenance:true,meaning:'Runtime enum omission alone is not a method gap because equivalent exact provenance is explicitly allowed'},required_structural_capabilities:['predicate layer containment','owned output/test/declaration subgraphs','scope inheritance with evidence','cross-section reference bindings','composition-level negative constraints'],normative_absence_proven:false,criteria:{accepted_semantics_cannot_be_represented:false,missing_normative_structural_abstraction_proven:false},recommendation:'Implementing a shared consumed ownership/composition contract may remain within v0.3. Do not draft or implement v0.4 without a concrete representability counterexample and ADMIN authorization.'});
const decision={task:'7P-ARCH-009',primary_architecture_diagnosis:'SYSTEMIC_OWNERSHIP_COMPOSITION_AND_UPSTREAM_CANDIDATE_CERTIFICATION_FAILURE_WITH_SOURCE_SCOPE_ACCEPTANCE_QUESTIONS',primary_decision:'GOLD_CONTRACT_REVIEW_REQUIRED',decision_basis:{source_insufficient_units:1,scope_granularity_units:5,all_gold_audited:283,parser_omissions_remain_even_if_extra_status_ignored:'0/9 required-only IOA',systemic_failure_not_explained_away_by_gold:true,full_counterfactual_case_closure:false,measured_hybrid_proposal_collapse:false,confirmed_method_representation_gap:0},secondary_flags:{SYSTEMIC_COMPOSITION_REPAIR_REQUIRED:true,STRONGER_FRONTEND_CANDIDATE_DISCOVERY_NEEDED:true,GLOBAL_SEMANTIC_OWNER_CERTIFICATION_GAP:true,HYBRID_FRONTEND_REQUIRED:false,V0_4_METHOD_REQUIRED:false,CONTINUE_V0_3_IMPLEMENTATION_UNCONDITIONAL:false},next_task_recommendation:'7P-CONTRACT-010 — ADMIN source-role / owned-content scope / comparison-granularity adjudication; old standards remain sealed',no_new_implementation_authorized:true,PRODUCTION_READY:false,STATUS:'WAITING_ADMIN_REVIEW'};
write('DECISION.json',decision);
const matrix=comparison.cases.map(c=>{const z=k=>`${c.slots[k].expected_reviews.filter(x=>x.finding==='MATCH').length}/${c.slots[k].expected_reviews.length}`;return `| ${c.sample_id} | ${z('I')} | ${z('O')} | ${z('A')} | FAIL |`;}).join('\n');
write('SYSTEMIC-FAILURE-ANALYSIS.md',`# 7P-ARCH-009 系统性失败分析

现有实现在局部结构合法之后，仍不能证明同一任务节点上的谓词、对象、模态、条件和内容归属完整一致。冻结 r03 的 9 个 STANDARD 均未 joint closure；不是多跑几条机制测试就能消除的缺口。

## 1. 实际生产链与模型位置

\`engine.mjs:26–34\` 的 candidateGraph 先后执行原生候选、解码、来源保留、discourse、参与者/数量、表达式、soundness、结构恢复、graph closure、materialization。compileNative 再执行 edge/table/frame/identity/declared/test/input/recipient closure，之后才 Eligibility、IR、coverage、Q/projection、Proof 和 Gate。BGE/E5/NLI 在 compileNative 返回后运行，\`semantic_decision_overrides=0\`。因此模型真实加载不等于它们参与 owner、scope 或缺失关系发现。

SourceDocument 的显式树在这些样本中只有 2–3 层，多数是 ROOT 下的行/子句；heading path、内容归属和 frame ownership 分散于 annotation 与 metadata。不能把浅层已实现树误认成任务书本身简单，也不能说当前完全没有 ownership。

## 2. Cluster 耦合与错误放大

旧 Phase A 的 ${allOriginalBlockers} 个 blocker 是历史诊断单位，不是当前 missing 数量。r03 有 ${missing.length} 个未 MATCH 的 expected 单位，其中 ${ownership.length} 个触及 C02/C04/C05/C06/C07/C08/C11 的归属/组合链；五个新退步单位由 009 单独补充归因，未改旧 ledger。cluster 和 stage 计数重叠，禁止求和冒充独立缺陷数。

C05 的 domain/owner 给 C04 候选谓词、C06 论元绑定、C07 edge admission 提供前提；这些再决定 C02 测试行为、C08 输出内容和 C11 条件组合是否完整。C03 的文件/成员限定身份能独立规范化，但进入义务仍须正确 owner；C09 引用和 C10 recipient 的唯一候选亦受此约束。C12 反映真实未闭合图的 slot accountability，不是应单独清除的症状。

建议按四个根抽象估计工作：R1 统一且实际消费的 owner/predicate-layer forest；R2 qualified typed identity/role；R3 明示 transfer/recipient；R4 消费前三者的组合一致性与反证认证。R1/R4 是高耦合任务，R2/R3 局部可分离；并不证明实现四块即可 9/9。

## 3. 两条错误 RESOLVED 的真实链

SWAI-006 的“不要 git add -A”主句有禁止，括号“会抓所有 untracked 残留”是解释。原候选把“抓”赋为 FORBIDDEN，经合法 PATIENT、Eligibility 生成 \`p1:d5a9cec7e061d231e780c5d3\`，进入 B。explicitModal 沿 NLP dependency chain 找到同句 modal；层级限制没有在全部 local-modal admission 路径统一消费。原 NLI 的角色假设得到 entailment 0.93408，但假设预装了错误 FORBIDDEN，既不能证明禁令归属，也不回流认证。诊断提供非当前解释层后，原下游删掉这一条错误事实，Gate 仍 PASS。

SWAI-010 的换行叙述“观察到笨模型翻车”被拆成行首“到”，并作为 EXPLICIT_DOCUMENT_IMPERATIVE/REQUIRED，事实 \`p1:11d81173009ccaf0a6c32aae\` 进入 A。NLI 为 neutral 0.72276，但位于 Canonical 之后，错误结果仍 RESOLVED。诊断提供完整段落 BACKGROUND 后，下游删除该事实。两条原结果均通过合同/签名 Gate；源 span 正确、ID 合法、类型匹配，不足以证明当前任务意图。

详见 SOUNDNESS-SOURCE-EVIDENCE.json 的完整 node → relation → Eligibility → fact → Canonical/NLI 链及代码行；不是只看显示文本。

## 4. 局部成功、复杂任务失败

283 个 required 单位有 79 个原比较 MATCH，204 个未 MATCH；既有单字段结果和短样本的局部成功共存。长度 1,961 的 SWAI-008 仍失败，不能把缺陷简单归为长文本。9 个都是结构化多段任务，没有简单原子控制组；浅层 document depth 也不代表语义组合深度。当前数据支持“独立叶子可命中但全任务组合未闭合”，不支持深度与准确率的因果统计或跨行业泛化结论。

## 5. Gold 与比较合同需要先澄清，但不能替 Parser 开脱

SWAI-004 的 ADR-0015 在 ref_charter 明示，SWAI-010 对 TASK-006 有 archive 要求，均属正确源要求。SWAI-009 的旧安装提示文件只有背景与不修改范围；是否因此成为当前 Input 需要 ADMIN 统一 source-role 合同。其余五项来源真实，但约束对象是未来输出内容；不能用 root V/B 自动代替 owned graph。此为一条源角色问题与五条比较层级问题，不删除、不改分、不否认有效 owned constraint。

比较器还把 UNLISTED_SOURCE_SUPPORTED 等非 MATCH 条目纳入 full equality 阻断，聚合人类条目与单 fact Canonical 的比较需要 scope/graph 合同。只读敏感性分析即使忽略 extras/status，required-only IOA 仍 0/9。因此源合同复审是下一步的前置裁定，不是本次 0/9 的主要解释。

## 6. 恢复路径的证据边界

CF01 正确 owner metadata 未产生行为组合；CF02/03 移除各一条错误边界；CF04 明示 recipient proposal 通过现有下游生成事实；CF05 不相关 owner metadata 未被 Gate 检查、也未影响 Canonical，不能夸成新错误边界被接受；CF06 悬空 endpoint 被拒绝。没有完整 STANDARD 闭合，没有实际模型 proposal 实验。Hybrid 是有待验证的方案，不能宣布 REQUIRED。v0.3 的条件、集合、PART_OF 或等价结构来源及 owned content 已能容纳这些例子，尚无规范级不表达反例。

结论是当前需要整体 owner/composition admission 能力，不是下一条 phrase patch。ADMIN 应先裁定小范围 source/scope/comparison 合同，然后才授权实现或受控 Hybrid 试验。
`);
write('NEXT-TASK-RECOMMENDATION.md',`# 建议任务：7P-CONTRACT-010

本文件仅建议，不启动下一任务。

请 ADMIN 先独立裁定 GOLD-CONTRACT-AUDIT.json 的六个问题：SWAI-009:I1 的当前 source-role；SWAI-009:V0/V1、SWAI-010:V1/V2/B0 的 OUTPUT_CONTENT vs 当前任务比较范围。ADR-0015 已有 ref_charter；TASK-006 的归档义务也明示。不能把这两项误列为缺证，不读取外部参考内容。

同时固定比较合同：人类聚合 expected 应由哪些联合 typed node/relation/set/condition witnesses 满足；同一 owner、对象、条件与模态必须一致；source-supported 未列条目是否按封闭全集阻断；owned content 必须在 O 子图比较，不能冒充当前 B/V。保留全部历史 Gold 和首次 replay，仅 ADMIN 能授权另开人工修订。REF-001 及“上述材料”真实歧义保持有效。

交付应是逐项 source-span/owner/role/contract 裁定与比较规则说明，不修改 Parser、Q、模型或生产入口；不因需要复审而自动降低要求或删除条目。required-only IOA 仍 0/9 必须保留。

裁定后再决定是否授权四根抽象的 v0.3 实现验证，或先做 non-Gold 模型 proposal + 确定性认证实验。后者必须实际测量跨 cluster 候选闭合和错误 owner 拒绝，不得直接 LLM → 7+1。若发现 v0.3 真正不可表示的结构，再交 ADMIN 考虑 v0.4；本次未证明该条件。
`);
write('REPORT.md',`# 7P-ARCH-009 — Architecture Review & Recovery Decision

TASK=7P-ARCH-009；STATUS=WAITING_ADMIN_REVIEW；PRODUCTION_READY=false。

主架构诊断：**上游候选发现与归属/组合认证存在系统性缺口**。当前主决策为 **GOLD_CONTRACT_REVIEW_REQUIRED**：先裁定 1 个源角色问题和 5 个 owned-content 比较问题，再决定恢复实现路径。此选择并不把 0/9 归咎于 Gold：忽略 extras/status 后，required-only IOA 仍为 0/9。

## 范围与冻结基线

CURRENT-TASK 指向本任务。任务声明的旧封存 HEAD 为 68d28da5c2f5db614867d1fa4ad8d0d3fb3ec53b；实际任务分发 HEAD 为 4f7bea24e767b993f59d3721bcdaf6891a8a7cc7，只增加 009 task/pointer。分析对象为 008 final r03 与实际 runtime；不切换生产入口，不解析新 Gold，不执行原文描述的业务操作，不调用 LLM 或改变模型/阈值。

阅读覆盖 CURRENT/taskbook/completion plan/v0.3、001–008 任务书和终报告、008 gap/cluster/gate/diagnostic/performance/determinism、9 STANDARD 与 REF 的完整原文、expected、10 份 r03 Trace 及运行源码。READING-INVENTORY 记录字节摘要和读取方式；大 Trace 全量 JSON 读取、完整实体关系枚举与针对性语义审阅，不把打印模型 score 全文当作推理证据。trace-views 是旧 Trace 的只读切片，counterfactual 是明确标记的诊断副本，不是新正式 replay。

## 冻结事实及同一样本矩阵

008 的 Phase A PASS / B FAIL / C 只读评估 FAIL / D NOT RUN 保持不变。专项 518 PASS、原 Parser 739 PASS、全量 5861 PASS / 0 FAIL / 17 SKIP 是 **008 历史实测**，本轮未冒称重新执行。I=7、O=7、A=9、P=9、R=1、V=12、C=19、B=12 是单项 MATCH；A_FALSE_DEFINED=6、I_FALSE_DEFINED=3、A_WRONG_BINDING=2、B_WRONG_BINDING=9。joint=0/9、full=0/9；输出内容 3/20。机制绿灯不能覆盖这些语义失败。相对 007，I_MATCH 8→7、B_MATCH 14→12，A_FALSE_DEFINED 2→6、B_WRONG_BINDING 6→9，均保留真实退步。冻结首处缺口仍为 SWAI-001 的 OWNED_TEST_BEHAVIOR_COMPOSITION（O2/A4），不以此再开 phrase patch。

下表是每个 case 的 expected I/O/A MATCH 数/required 数，FAIL 指同一样本三个字段全部满足没有成立，未改变原比较口径。

| Case | I | O | A | joint |
|---|---:|---:|---:|---|
${matrix}

## 架构与依赖结果

PIPELINE-STAGE-MAP 逐阶段给出实际代码、输入输出、确定性/模型来源、错误放大、恢复限制、cluster 与 blocker。CLUSTER-DEPENDENCY-DAG 区分历史 blocker 与当前未 MATCH，计数可重叠。C02/C04/C05/C06/C07/C08/C11 共用 owner/predicate-layer/behavior composition；C03/C09/C10 局部可分离但入界仍依赖 owner；C12 是下游问责症状。当前未 MATCH 为 204，其中旧 map 有 199 个已归因，5 个 r03 新损失由 SUPPLEMENTAL-CLUSTER-ATTRIBUTION 单独分析。

工作量应按 R1 owner/layer + R2 typed identity + R3 transfer + R4 composition certification 四根抽象估算，而非按九个短语估算。R1/R4 高耦合；没有证据证明四块简单补齐就全闭合。

283 个 Gold 单位（263 slot + 20 content）逐项审计：79 GOLD_OK_V0_3_REPRESENTABLE，198 GOLD_OK_BUT_REQUIRES_STRONGER_FRONTEND，1 INSUFFICIENT_SOURCE_EVIDENCE，5 COMPARATOR_GRANULARITY_ISSUE，0 METHOD_REPRESENTATION_GAP。审计 79 个可表示项与冻结 MATCH 数一致；该审计不构成新的 ADMIN 语义审定。ADR-0015 的 ref_charter 及 TASK-006 的归档要求经完整原文复核均有明确证据，不列为 Gold 缺证。198 指有源要求但前端/组合见证不足，并非 198 个独立规则。定位性词面证据单独标记，不当作 role/entailment 证明。全部 expected 保持原字节。

## 受控反事实

5 个注入实验在改变诊断副本前，nodes/relations/IR/Canonical 均复现旧 r03；另有 1 个 dangling negative control。CF01 owner metadata 无效果；CF02/03 各删除 1 个错误事实；CF04 明示 recipient 提案产生 2 个事实（含 AUX）；CF05 无效 owner metadata Gate PASS，但 Canonical 不变；CF06 悬空对象 Gate FAIL。均未生成 official MATCH，没有完整 case 闭合，未测模型 proposal。原文、runtime、Gold、正式 Canonical 均未覆盖。

两条实际错误 RESOLVED 完整链保存在 SOUNDNESS-SOURCE-EVIDENCE：括号解释“抓”错误继承主句禁止；换行叙述“到”被提升为任务动作。前者 NLI entailment、后者 neutral，都不会改已生成 Canonical。说明当前模型信号的真实位置和合同 Gate 的语义边界，不能把合法 ID/type 当作人类意图符合性证明。

## 三个选项与决策

A：v0.3 继续实现有条件可行，四根抽象，owner/global certification 需重于局部补规则。尚未证明完整下游反事实闭合，也未证明错界增长已可控；不满足无条件 CONTINUE criteria。历史十案总延迟 451961→641998 ms，约 +42%，受并发/查询量影响，不是本轮可控性能对比。

B：模型可提出 typed node/relation/owner/scope 候选，再确定性认证，原则上不冲突。但当前 BGE/E5/NLI 是 post-Canonical signals；本轮没有实际模型 proposal 测量，现有认证亦不能安全接收任意合法 owner。因此不能宣称 HYBRID_FRONTEND_REQUIRED。

C：尚无 v0.3 不能表示的规范反例。§16.2 owned content、§17 PART_OF 或等价结构 provenance、条件/集合及 graph consistency 可表达已观察需求。运行枚举缺少 PART_OF 不等于规范缺失；不设计 v0.4。

主决策 GOLD_CONTRACT_REVIEW_REQUIRED，次级标记 SYSTEMIC_COMPOSITION_REPAIR_REQUIRED / STRONGER_FRONTEND_CANDIDATE_DISCOVERY_NEEDED / GLOBAL_SEMANTIC_OWNER_CERTIFICATION_GAP。建议仅 7P-CONTRACT-010 人工 source-role、owned-content scope 与比较合同裁定，详见 NEXT-TASK-RECOMMENDATION；本次不自动授权下一轮实现。

## 验证与交付

本轮实际执行 12 项诊断完整性、计数、DAG、源角色正例及反事实基线/重复性检查：12 PASS / 0 FAIL。VERIFY 实际核对本轮起始 5,747 个文件、旧受保护 46,736 个文件、2,825 个模型/Pack/依赖文件以及 760 个旧封存文件/封套，无字节差异；CURRENT-TASK 的已授权任务分发单独列为例外。结果在 DIAGNOSTIC-TESTS/VERIFY。旧 r03 语义 FAIL 保留，不用完整性 PASS 替代语义验收。只读工具失败及恢复在 INCIDENTS，未把失败写成 PASS。Manifest/SHA256SUMS 覆盖交付，SEAL/SEAL-VERIFICATION 验证字节；push 仅 review/7plus1-parser。Parser=false、Gold=false、Source=false、BXP=false、v0.3=false、模型/阈值=false、QI–QB/projection=false、生产入口=false；不 merge/release/tag。
`);
write('INCIDENTS.json',{task:'7P-ARCH-009',incidents:[{kind:'READ_ONLY_INTROSPECTION_ERRORS',details:'Report assembly initially rejected unescaped template quotes and a descriptive code locator; corrected only report scripts, then rerun. Two optional console summaries called slice on JSON.stringify(undefined); one PowerShell command used shell-incompatible brace path expansion. Retried with explicit paths / guarded inspection. No runtime or source write.',retained_failures:true},{kind:'COUNTERFACTUAL_OUTPUT_DIRECTORY_MISSING',details:'First diagnostic experiment write failed ENOENT before artifact output; created only the new report/counterfactual directory and reran all baselines. No prior result was overwritten.',effect_on_frozen_data:false},{kind:'STALE_EMPTY_GIT_INDEX_LOCK',details:'Verified an empty stale index.lock predating this task by over 40 minutes and no active Git mutation. Renamed it inside .git; read-tree HEAD synchronized index only to already-dispatched task HEAD, preserving pre-existing worktree modifications/deletions.',scope:'Git index metadata only, no parser/source or previous seal byte edits'},{kind:'DIAGNOSTIC_ATTRIBUTION_CORRECTION',details:'Provisional audit assumptions incorrectly missed the explicit ADR-0015 ref_charter and the TASK-006 archive requirement. Final source review corrected both before seal; no prior Gold or comparison changed. Regression assertions protect both positive source licenses. A broad diagnostic script replacement temporarily counted new supplemental losses as originally clustered. Corrected to retain 199 original plus 5 new missing; regression assertion added.',prior_artifacts_changed:false}],all_observed_failures_are_diagnostic_tools_not_parser_replays:true});
console.log(JSON.stringify({written:'options,decision,reports,soundness evidence',ownership_missing:ownership.length,original_phase_a_blockers:allOriginalBlockers}));
