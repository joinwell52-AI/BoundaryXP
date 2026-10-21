对。现在要把范围收死：

> **当前目标只有一个：把“自然语言 → 结构化语义 → Boundary IR → Canonical 7+1”的解析器做出来。**

BXP 协议继续作为上位定义，但**这阶段不做 Formal Boundary Model、Boundary Result、Admission、Host Enforcement**。仓库协议本身也明确把自然语言语义识别视为 Producer 技术，而 7+1 是标准语义承载层，这个边界是吻合的。

我建议从现在开始建立一个固定的 **Codex ↔ GitHub ↔ ChatGPT 审阅通道**。以后我给 Codex 的每个任务都按同一规则交付，这样我能直接看代码、报告、测试和 commit，不再让你搬文件。

把下面这份直接给 Codex。

---

# BoundaryXP 7+1 Parser 开发与 GitHub 交付基线任务

**Task ID：`7P-BOOTSTRAP-001`**

## 一、当前唯一开发目标

当前阶段只开发：

```text
Natural Language
→ Structure / Clause
→ NLP Signals + Typed Literals
→ Span / Semantic Nodes
→ Relations
→ Scope / Condition / Quantity
→ Eligibility
→ Boundary IR
→ Deterministic Canonical 7+1
```

目标：

```text
Text → Correct Canonical 7+1
```

当前**不开发**：

```text
Formal Boundary Model
Boundary Result
Admission
Host Enforcement
Agent execution
ROOT→WP
BXP 0.4 后续协议能力
```

不得因为当前 Parser 问题修改 BXP 7+1 定义。

---

# 二、代码永久位置

当前 7+1 Parser 属于 **Producer / Semantic Recognition**，不得混入：

```text
src/bxp/
```

`src/bxp/` 保留为 BXP 协议 Core / formal evaluation 相关实现。

从本任务开始，7+1 Parser 的 canonical source 固定为：

```text
src/producer/7plus1/
```

建议内部结构：

```text
src/producer/7plus1/
├─ index.mjs
├─ engine.mjs

├─ structure/
├─ nlp/
├─ literals/
├─ spans/
├─ semantic/
│  ├─ nodes/
│  ├─ relations/
│  ├─ modality/
│  └─ coreference/
├─ expressions/
│  ├─ scope/
│  ├─ condition/
│  └─ quantity/
├─ eligibility/
├─ boundary-ir/
├─ projection/
├─ coverage/
├─ proof/
└─ contracts/
```

**不要为了符合上述目录而机械重写已经工作的实现。**

首先核对本地当前实际 58618 Parser 的调用链。

允许：

```text
现有文件 → 无行为变化迁移/整理 → canonical path
```

禁止：

```text
一边迁移一边偷偷改语义
```

如果当前代码暂时无法安全迁入该目录：

1. 保留真实执行代码；
2. 在 `CODE-MAP.md` 明确真实路径；
3. 本任务不得复制两套会独立漂移的 Parser；
4. 后续单独做 canonicalization。

---

# 三、测试固定位置

7+1 Parser 专属测试统一放：

```text
src/__tests__/7plus1/
```

按照语义层划分，例如：

```text
src/__tests__/7plus1/
├─ structure/
├─ semantic/
├─ relations/
├─ conditions/
├─ quantities/
├─ eligibility/
├─ boundary-ir/
├─ projection/
├─ regression/
└─ golden/
```

测试不能通过 Txx 文件名、固定实体、完整原句硬编码。

---

# 四、标准样本库永久位置

Golden Reference 固定放：

```text
fixtures/7plus1/golden/
```

每个 Case：

```text
fixtures/7plus1/golden/
└─ REF-001/
   ├─ source.txt
   ├─ expected-semantic.json
   ├─ expected-boundary-ir.json
   ├─ expected-7plus1.json
   ├─ unresolved.json
   ├─ evidence.json
   └─ manifest.json
```

状态只能明确标记，例如：

```text
GOLDEN_CANDIDATE
GOLDEN_CONFIRMED
NEEDS_ADJUDICATION
REFERENCE_DEFECT
```

**Parser 输出不得反向修改 Golden。**

当前已经深审通过的会议纪要：

```text
REF-001
```

可作为第一个：

```text
GOLDEN_CONFIRMED
```

原 EXP01 50 Case 后续逐案迁入：

```text
REF-002...
```

但没有独立审定前只能：

```text
GOLDEN_CANDIDATE
```

---

# 五、GitHub 固定审阅分支

创建并长期维护：

```text
review/7plus1-parser
```

仓库：

```text
joinwell52-AI/BoundaryXP
```

这个分支以后是：

> **7+1 Parser 的人工 Review Mirror**

本地文件系统仍是开发工作区。

GitHub 在这里的职责仅为：

```text
代码审阅
证据交换
commit 对比
报告留档
```

不得承担 Runtime 状态机或自动调度。

本阶段：

```text
不得自动 merge main
不得 release
不得 tag
不得运行 GitHub 自动化
不得开启 GitHub Actions 作为本地验收替代
```

---

# 六、以后每一个开发任务怎么交

统一 Task ID：

```text
7P-YYYYMMDD-NNN
```

例如：

```text
7P-20261001-001
7P-20261001-002
```

每一个任务必须在仓库留下任务书：

```text
docs/tasks/7plus1/
  7P-20261001-001.md
```

---

# 七、以后每个任务报告放哪里

统一建立：

```text
docs/reports/7plus1/
```

每个任务独立目录：

```text
docs/reports/7plus1/7P-20261001-001/
├─ REPORT.md
├─ MANIFEST.json
├─ RESULTS.json
├─ FAILURES.json
├─ CHANGED-FILES.txt
└─ EVIDENCE/
```

`REPORT.md` 必须回答：

```text
1. 本任务要解决什么共性问题
2. first divergence 在哪一层
3. 根因是什么
4. 修改了什么通用机制
5. 没修改什么
6. 哪些样本改善
7. 哪些样本仍失败
8. 是否产生回归
9. 当前 Parser 状态
10. PRODUCTION_READY=false/true
```

目前一律：

```text
PRODUCTION_READY=false
```

除非 ADMIN 以后单独改变。

---

# 八、Trace 不要无限复制

禁止以后每一个小任务都向 Git 仓库重复提交几十份 1MB Trace，导致仓库膨胀。

每个任务只提交：

### 必须

```text
RESULTS.json
FAILURES.json
semantic diff
Boundary IR diff
7+1 diff
相关失败 Case 的必要 Trace
```

### 只有 ADMIN 要求时

提交全量 Trace。

Golden Case 的冻结 expected 结果例外，可以永久保留。

---

# 九、一次任务的标准开发流程

以后 Codex 每次收到我的开发任务，固定执行：

```text
1. git status
2. 记录 BASE_COMMIT
3. 读取任务书
4. 定位 first divergence
5. 找至少多个实例确认共性根因
6. 修改通用机制
7. 专项测试
8. Golden Regression
9. 当前开发回归集
10. 全量现有测试
11. 写 REPORT
12. 写机器结果
13. 计算 commit
14. push review/7plus1-parser
15. 停止等待 ADMIN Review
```

严禁：

```text
一个失败文本 → 一个句子特判
一个 Txx → 一个 if
测试失败 → 修改 Gold
无法解析 → 全部降 UNRESOLVED
删除错误输出来获得 PASS
只报测试数，不报语义结果
```

---

# 十、每次 Push 后 Codex 只需要给 ADMIN 这几个东西

完成后回复固定格式：

```text
TASK:
7P-xxxxxxxx-xxx

REPOSITORY:
joinwell52-AI/BoundaryXP

BRANCH:
review/7plus1-parser

BASE_COMMIT:
<sha>

HEAD_COMMIT:
<sha>

TASKBOOK:
docs/tasks/7plus1/<task-id>.md

REPORT:
docs/reports/7plus1/<task-id>/REPORT.md

CHANGED_CODE:
<paths>

TESTS:
<exact counts>

GOLDEN:
<pass/fail counts>

KNOWN_FAILURES:
<count + summary>

PARSER_MODIFIED:
true/false

BXP_PROTOCOL_MODIFIED:
false

MAIN_MERGED:
false

RELEASED:
false

STATUS:
WAITING_ADMIN_REVIEW
```

然后停止。

---

# 十一、本次 `7P-BOOTSTRAP-001` 要做什么

本任务**暂时不修 P3 的语义错误**。

只完成开发通道建设：

1. 创建 `review/7plus1-parser`。
2. 找到本地当前真实 7+1 Parser 的完整调用链。
3. 判断是否能够无行为变化地归位到 `src/producer/7plus1/`。
4. 如果能，迁移并证明输出不变。
5. 如果不能，本任务只建立 `CODE-MAP.md`，不要强迁。
6. 建立：
   - `docs/tasks/7plus1/`
   - `docs/reports/7plus1/`
   - `fixtures/7plus1/golden/`
   - `src/__tests__/7plus1/`
7. 把当前会议纪要作为 `REF-001` Golden Reference。
8. 收集 EXP01 原 50 Case 的位置，但本任务**不要擅自宣布全部 GOLDEN_CONFIRMED**。
9. 将当前 Parser 所需源代码、合同、测试同步到审阅分支。
10. 写：

```text
docs/reports/7plus1/7P-BOOTSTRAP-001/REPORT.md
```

11. Push：
   
```text
review/7plus1-parser
```

12. 报告 commit SHA 后停止。

---

## 一条最重要的边界

**我们现在不再同时开发“整个 BoundaryXP”。**

当前工程只有：

```text
自然语言
       ↓
结构化语义
       ↓
Boundary IR
       ↓
7+1
```

把这件事情做到可靠。

等 Parser 真正稳定之后，再回到 BXP 后面的 Formalization / Boundary Result / Admission。

这个安排以后我也比较好指挥：**我看固定分支，看固定代码目录，看固定 Golden，看每个 Task 的固定 REPORT，再按 commit 给 Codex 下一张任务书。**
