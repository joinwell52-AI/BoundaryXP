# 7+1 Parser：008–014 失败复盘与后续开发纪律

## 1. 结论

7P-CLOSURE-008 到 7P-COMPOSITION-014 的主要价值，不是把长 STANDARD 做到了通过，而是排除了多条错误路线，并明确了后续不能再重复的开发方式。

最终事实是：

- REF-001 单流程会议任务可用；
- 复杂 9-case STANDARD 的 CASE_IOA_JOINT 始终为 0/9；
- STANDARD_PARSED 始终为 0/9；
- R1–R4 到 014 已全部通过；
- false-defined 从 9 降到 8；
- wrong-binding 从 11 降到 5；
- slot status mismatch 仍为 72；
- owned-content missing 仍为 22；
- 014 的确定性机制、回归、性能、反过拟合均通过，但完整 case 没有闭环。

因此 014 的正式结论 `SYSTEMIC_REPAIR_INSUFFICIENT` 必须作为架构止损点。

---

## 2. 第一条教训：测试通过不等于语义任务成功

008–014 中大量专项、non-Gold、retained、原 Parser 和全量测试均可以 PASS，但关键业务指标长期不动。

以后必须区分：

```text
mechanism correctness
≠
case-level semantic closure
```

测试数量只能证明实现没有破坏既有合同，不能代替：

- complete same-case I/O/A；
- complete Canonical 7+1；
- false-defined；
- wrong-binding；
- unresolved correctness；
- source/proof completeness。

后续每个任务必须先定义 **Primary Semantic Gate**，测试通过只能作为必要条件。

---

## 3. 第二条教训：不能在短任务能力未稳定前，用长 multi-WP 文档驱动 Parser 修复

现有 9-case STANDARD 大量包含：

- 多阶段；
- 多子任务；
- 中间产物；
- 跨段引用；
- 输出内容；
- 验收；
- 全局/局部禁止项；
- 多个决议；
- 多层作用域。

这些不是单一工作流。

而 REF-001 约 1000 字、单流程，已经证明当前 7+1 方法对短任务存在可行正例。

因此正确开发顺序必须是：

```text
Short single-flow
→ Medium 2–3 WP
→ Long multi-WP
```

不能反过来。

---

## 4. 第三条教训：长任务不能被当作一个扁平 7+1 直接一次求出

现有长 Gold 的最终 7+1 可以继续作为 Global Canonical 7+1，但它不是完整的中间语义 Gold。

长任务内部必须显式恢复：

- Block；
- WP；
- parent/child；
- O→I；
- C→Enable；
- Basis；
- intermediate/final output；
- global/local constraint；
- Dependency DAG。

因此长任务应先形成：

```text
M = Block × 7+1 Semantic Matrix
W = WP Tree
D = Dependency DAG
Γ = Constraint Set
```

再求全局一致解，并投影回一个最终 Canonical 7+1。

---

## 5. 第四条教训：局部确定性规则主要提高 precision，没有解决 semantic recall

008–014 修复了大量：

- owner；
- scope；
- condition；
- recipient；
- referent；
- qualified identity；
- distributive EACH；
- whole-frame certification。

结果是 false-defined / wrong-binding 明显改善，但 required missing、slot mismatch、owned-content missing 和 joint closure 基本不动。

说明主要问题不是“候选太多”，而是：

> **前端没有提出足够完整的高层语义候选。**

因此不能继续靠新增局部 phrase/rule 无限修补。

---

## 6. 第五条教训：模型放在解析末端只能检查已有候选，无法补回不存在的语义

014 之前的 BGE-M3、multilingual-E5、mDeBERTa NLI 主要用于已有 typed candidate 的 ranking / cross-check / validation。

如果正确 owner、relation、scope、frame 根本没有被提出，后置模型无法恢复。

所以 015 可以测试 upstream proposal，但仍必须遵守：

```text
Model proposes
Deterministic parser certifies
Canonical 7+1 is never written directly by model
```

---

## 7. 第六条教训：兼容测试不能冻结本应演化的内部实现

011 的 eligibility byte-lock 证明：

> 历史兼容测试如果把内部文件字节相等当成行为合同，会阻止被正式授权的语义架构演化。

后续兼容测试优先验证：

- semantic behavior；
- public contract；
- typed IR；
- projection；
- proof；

而不是内部实现文件 byte equality。

封存 evidence 可以要求字节不变，但 active implementation 不应被无必要 byte pin 锁死。

---

## 8. 第七条教训：Gold 必须按任务复杂度分层

短任务：

```text
source
→ expected Canonical 7+1
```

即可。

长任务未来至少应增加：

```text
expected-blocks
expected-wp-tree
expected-local-7plus1
expected-dependencies
expected-semantic-matrix
expected-global-7plus1
```

这样失败可以定位到具体层，而不是只看到最终 0/9。

---

## 9. 第八条教训：先定义“可证伪假设”，再允许编码

以后任何 Parser 任务开始前必须写清：

1. 本轮唯一架构假设是什么；
2. 如果假设正确，哪个主语义指标必须变化；
3. 最小预期变化是多少；
4. 什么结果会证伪；
5. 证伪后禁止继续做什么。

例如：

```text
Hypothesis:
upstream semantic proposal can improve short single-WP semantic recall.

Expected:
same-case I/O/A closure and full 7+1 closure improve on frozen short benchmark.

Falsified if:
mechanism tests pass but full-case closure remains materially unchanged.

After falsification:
do not add another deterministic phrase/rule repair.
```

---

## 10. 第九条教训：必须设置止损规则

以后不得因为：

- 专项测试继续增加；
- full regression 仍为 0 FAIL；
- 某些局部 MATCH 增长；
- 某个新机制看起来“合理”；

就自动启动下一轮。

建议硬规则：

### 10.1 同一路线连续两轮主指标不改善

如果连续两轮：

```text
Primary Semantic Gate 无实质改善
```

则暂停该路线，必须先做 architecture review。

### 10.2 机制全部 PASS 但 case-level 不改善

直接判：

```text
SYSTEMIC_REPAIR_INSUFFICIENT
```

不得继续增加同类规则。

### 10.3 没有新的可检验假设

不创建新任务。

---

## 11. 第十条教训：阶段 Gate 必须按任务复杂度递增

### Stage 015 — Short single-flow

目标：

```text
Natural language
→ one complete Canonical 7+1
```

不拆 WP。

必须稳定生成 JSON + Markdown。

### Stage 016 — Medium 2–3 WP

目标：

```text
Blocks
→ local 7+1
→ WP Tree
→ O→I / C→Enable
```

### Stage 017 — Long multi-WP

目标：

```text
Semantic Matrix
+ WP Tree
+ Dependency DAG
+ Γ
→ Global Canonical 7+1
```

### Stage 018 — Formal solver

评估：

- graph propagation；
- fixed point；
- MILP；
- SMT；
- UNSAT / multi-solution / unresolved proof。

不得跳级。

---

## 12. 后续开发的强制纪律

后续 7+1 Parser 开发必须遵守：

1. **先冻结测试语料与人工语义答案，再开发。**
2. **先跑 control，再跑 candidate。**
3. **先看完整 case，再看局部 item。**
4. **短任务阶段不使用长 STANDARD 调参。**
5. **长任务阶段不得绕过 Block/WP/Matrix 中间层。**
6. **模型只能提出候选，不直接写最终 7+1。**
7. **数学/确定性约束只认证证据，不补造语义。**
8. **所有真实歧义允许 UNRESOLVED。**
9. **失败结果必须保存，不用后续修复覆盖首次失败。**
10. **任何任务结束后必须明确：继续、换架构、还是停止。**

---

## 13. 008–014 的最终价值

008–014 不是“无价值”，但它们已经完成了应该完成的排除工作：

- 证明 REF-001 路径存在；
- 证明 v0.3 暂无已确认表示缺口；
- 证明 Gold/contract 不是 0/9 的主要原因；
- 证明 R1–R4 局部确定性机制可以做得正确；
- 证明继续堆同类确定性规则无法带来复杂 case closure；
- 暴露了长任务必须分层、矩阵化的需要；
- 给 015 以后建立了明确的止损线。

因此这些结论必须冻结为后续工作的前提，而不是再次重复验证。
