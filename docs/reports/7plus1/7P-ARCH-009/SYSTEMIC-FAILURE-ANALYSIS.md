# 7P-ARCH-009 系统性失败分析

现有实现在局部结构合法之后，仍不能证明同一任务节点上的谓词、对象、模态、条件和内容归属完整一致。冻结 r03 的 9 个 STANDARD 均未 joint closure；不是多跑几条机制测试就能消除的缺口。

## 1. 实际生产链与模型位置

`engine.mjs:26–34` 的 candidateGraph 先后执行原生候选、解码、来源保留、discourse、参与者/数量、表达式、soundness、结构恢复、graph closure、materialization。compileNative 再执行 edge/table/frame/identity/declared/test/input/recipient closure，之后才 Eligibility、IR、coverage、Q/projection、Proof 和 Gate。BGE/E5/NLI 在 compileNative 返回后运行，`semantic_decision_overrides=0`。因此模型真实加载不等于它们参与 owner、scope 或缺失关系发现。

SourceDocument 的显式树在这些样本中只有 2–3 层，多数是 ROOT 下的行/子句；heading path、内容归属和 frame ownership 分散于 annotation 与 metadata。不能把浅层已实现树误认成任务书本身简单，也不能说当前完全没有 ownership。

## 2. Cluster 耦合与错误放大

旧 Phase A 的 339 个 blocker 是历史诊断单位，不是当前 missing 数量。r03 有 204 个未 MATCH 的 expected 单位，其中 170 个触及 C02/C04/C05/C06/C07/C08/C11 的归属/组合链；五个新退步单位由 009 单独补充归因，未改旧 ledger。cluster 和 stage 计数重叠，禁止求和冒充独立缺陷数。

C05 的 domain/owner 给 C04 候选谓词、C06 论元绑定、C07 edge admission 提供前提；这些再决定 C02 测试行为、C08 输出内容和 C11 条件组合是否完整。C03 的文件/成员限定身份能独立规范化，但进入义务仍须正确 owner；C09 引用和 C10 recipient 的唯一候选亦受此约束。C12 反映真实未闭合图的 slot accountability，不是应单独清除的症状。

建议按四个根抽象估计工作：R1 统一且实际消费的 owner/predicate-layer forest；R2 qualified typed identity/role；R3 明示 transfer/recipient；R4 消费前三者的组合一致性与反证认证。R1/R4 是高耦合任务，R2/R3 局部可分离；并不证明实现四块即可 9/9。

## 3. 两条错误 RESOLVED 的真实链

SWAI-006 的“不要 git add -A”主句有禁止，括号“会抓所有 untracked 残留”是解释。原候选把“抓”赋为 FORBIDDEN，经合法 PATIENT、Eligibility 生成 `p1:d5a9cec7e061d231e780c5d3`，进入 B。explicitModal 沿 NLP dependency chain 找到同句 modal；层级限制没有在全部 local-modal admission 路径统一消费。原 NLI 的角色假设得到 entailment 0.93408，但假设预装了错误 FORBIDDEN，既不能证明禁令归属，也不回流认证。诊断提供非当前解释层后，原下游删掉这一条错误事实，Gate 仍 PASS。

SWAI-010 的换行叙述“观察到笨模型翻车”被拆成行首“到”，并作为 EXPLICIT_DOCUMENT_IMPERATIVE/REQUIRED，事实 `p1:11d81173009ccaf0a6c32aae` 进入 A。NLI 为 neutral 0.72276，但位于 Canonical 之后，错误结果仍 RESOLVED。诊断提供完整段落 BACKGROUND 后，下游删除该事实。两条原结果均通过合同/签名 Gate；源 span 正确、ID 合法、类型匹配，不足以证明当前任务意图。

详见 SOUNDNESS-SOURCE-EVIDENCE.json 的完整 node → relation → Eligibility → fact → Canonical/NLI 链及代码行；不是只看显示文本。

## 4. 局部成功、复杂任务失败

283 个 required 单位有 79 个原比较 MATCH，204 个未 MATCH；既有单字段结果和短样本的局部成功共存。长度 1,961 的 SWAI-008 仍失败，不能把缺陷简单归为长文本。9 个都是结构化多段任务，没有简单原子控制组；浅层 document depth 也不代表语义组合深度。当前数据支持“独立叶子可命中但全任务组合未闭合”，不支持深度与准确率的因果统计或跨行业泛化结论。

## 5. Gold 与比较合同需要先澄清，但不能替 Parser 开脱

SWAI-004 的 ADR-0015 在 ref_charter 明示，SWAI-010 对 TASK-006 有 archive 要求，均属正确源要求。SWAI-009 的旧安装提示文件只有背景与不修改范围；是否因此成为当前 Input 需要 ADMIN 统一 source-role 合同。其余五项来源真实，但约束对象是未来输出内容；不能用 root V/B 自动代替 owned graph。此为一条源角色问题与五条比较层级问题，不删除、不改分、不否认有效 owned constraint。

比较器还把 UNLISTED_SOURCE_SUPPORTED 等非 MATCH 条目纳入 full equality 阻断，聚合人类条目与单 fact Canonical 的比较需要 scope/graph 合同。只读敏感性分析即使忽略 extras/status，required-only IOA 仍 0/9。因此源合同复审是下一步的前置裁定，不是本次 0/9 的主要解释。

## 6. 恢复路径的证据边界

CF01 正确 owner metadata 未产生行为组合；CF02/03 移除各一条错误边界；CF04 明示 recipient proposal 通过现有下游生成事实；CF05 不相关 owner metadata 未被 Gate 检查、也未影响 Canonical，不能夸成新错误边界被接受；CF06 悬空 endpoint 被拒绝。没有完整 STANDARD 闭合，没有实际模型 proposal 实验。Hybrid 是有待验证的方案，不能宣布 REQUIRED。v0.3 的条件、集合、PART_OF 或等价结构来源及 owned content 已能容纳这些例子，尚无规范级不表达反例。

结论是当前需要整体 owner/composition admission 能力，不是下一条 phrase patch。ADMIN 应先裁定小范围 source/scope/comparison 合同，然后才授权实现或受控 Hybrid 试验。
