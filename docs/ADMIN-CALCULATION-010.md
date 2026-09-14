# ADMIN 纯计算：组合约束、具体槽位与分层建议

本文解释本地计算建议的设计。当前 ADMIN 经本机 Node 服务调用 Python，不使用模型；支持范围受词项与文法约束，未明确项保持未明确。

## 用户会看到什么

1. **先确认：任务含义与范围**。例如产物是明细还是汇总、清理指停用还是删除、授权者是全部还是任一、同一动作是否既必须又禁止。
2. **再补充：执行与交付细节**。例如时间范围、完成证据、数量与累计预算、失败处理。未命中说明只代表尚未确认；else 缺失作为可选澄清。
3. **按需完善：通用约束**。七参数中尚未确认的其他字段及已知禁止事项 B。不把所有建议当作必填门槛，不裁决、不阻断、不自动修改原文。

每项提供原句、具体槽位及可编辑建议。同字段已有专门槽位检查时，不再重复通用缺失提示。技术详情折叠，保留候选 AST、原文位置和未覆盖情况。完整任务建议保留原文并追加占位条款，由 ADMIN 确认。

## 实际运行的案例

输入：`把销售部的报表汇总一下。`

场景检查输出三个未确认槽位：`output`、`period`、`stop`。对应建议：

- 交付物为【明细表／分类汇总表／文字摘要，由 ADMIN 选择】。
- 时间范围为【起始日期】至【结束日期】。
- 完成约定汇总并提交【产物及位置】后结束；未能汇总的资料列明原因。

日期、目录不被填成模型猜测的值。UI 另按需展示其他七参数和 B 提醒。本例已在独立浏览器页面实际点击验证，并切换 English 验证标题与建议；原句不随语言切换翻译。

输入：`清理一下无用的临时测试账号。`

输出具体动作、租户/环境范围、筛选条件三个未确认槽位。清理不被直接映射为 DELETE；建议让 ADMIN 选择列出候选、停用、删除或归档，并定义字段、比较关系和值。

输入：`抓取对方网站价格，如果价格低于100元就自动下单采购。`

输出数量上限、累计预算、超时、失败处理、条件不满足时行为五项建议。100 元只是原文触发价格，不视为采购总预算；不推断 Agent 会静默退出；这些建议不构成下单授权。

输入：`必须修改配置；不得修改配置。`

输出两条原句及候选冲突见证：在相同执行者、任务和范围的假设下，同一个动作被要求且被禁止。提示 ADMIN 核对是否存在不同适用范围，或明确修改要求；不会自动撤销禁止项。

## 实际数学计算

### 1. 槽位差分

对已命中的场景模式 p，令 K(p) 是该场景建议核对的槽位集合，E(p,T) 是本句已找到候选说明的槽位：

$$\Delta(p,T)=K(p)\setminus E(p,T)$$

实现输出 `unconfirmed`，不是“已证明原文没有”。K 是版本化工程模式，不是所有任务必须满足的数学公理。E 来自本句显式锚点规则，跨句定义不自动借用。占位符不算候选值。这是有限覆盖的启发式证据提取，不能伪装为完备语义分析。

### 2. 并列组合推导

对授权者表达式采用以下文法：

```text
E := Authority | (E) | E AND E | E OR E
```

AND/OR 不预设优先级。区间组合枚举不同二叉划分；同种算子按结合律展开归一化，保留不同混合分组。`A AND B OR C` 返回 `(A AND B) OR C` 与 `A AND (B OR C)` 两个候选；显式括号约束解析。不是每种并列动作都可分配：`比较生产配置和测试配置` 保留整个谓词，不错误拆分为两个比较动作。

设 P(i,j) 是区间候选集，op(k) 是分割处算子：

$$P(i,j)=\bigcup_{k=i}^{j-1}\{Normalize(op_k(l,r)):l\in P(i,k),r\in P(k+1,j)\}$$

枚举可能组合爆炸，代码最多接受 6 个授权者原子和 31 个词项；超过上限返回未覆盖。不能把该算法宣称为任意长度 O(n²)。本轮未加载 CCG、UD 模型或通用解析库。

### 3. 条件与模态

```text
未经 A 授权，不得 X → NOT(Approval(A)) → FORBID(X)
经 A 授权，必须 X   → Approval(A) → REQUIRE(X)
不必 X             → NOT_REQUIRED(X)
```

`NOT_REQUIRED` 不转成 `FORBID` 或 `PERMIT`。条件提及授权不证明凭证存在；`actor`、`task`、`authorizationDecision` 保持 null。动作当前是完整原句的不透明原子，未完成实体级动作/客体分解，不猜测同义词等价。

### 4. 直接冲突候选

对同条件 g、同字面动作 a 的唯一候选，检测：

$$REQUIRE(g,a)\land FORBID(g,a)$$

在 g 生效且主体/事项相同的假设下，执行约束要求 a 与 ¬a。输出条件性见证及两句来源；不同条件、不同动作和多候选不强行合并。本轮是有限精确配对，没有调用 Z3，不提供一般 SMT 证明或最小 unsat core。

## API 与文件

```js
import {checkAdminText} from './ui/admin-check.mjs';
const result = checkAdminText('未经 A 和 B 或 C 授权，不得修改配置。');
// result.structure: 条件/模态/并列候选与未覆盖状态
// result.slots: 场景槽位候选证据及差分
// result.findings: 原句、UTF-16 [start,end)、中英文建议
```

- `ui/admin-operators.mjs`：声明式条件和模态表、括号组合、直接冲突候选。
- `ui/admin-slots.mjs`：三个场景的槽位模式、来源和补全模板。
- `ui/admin-check.mjs`：汇总新检查与已有六类规则、显式 glossary 定义绑定。
- `ui/advice.mjs`：三层建议、同字段去重、完整建议文本。
- `ui/app.js`：中文/English 页面及折叠技术详情。

正则仍用于有限词法及锚点识别。把规则改成配置不会自动提升泛化；此次新增的是可审查的组合计算和明确弃权，不是“已经摆脱规则的通用语言理解”。Python/Lark/Z3/GREW 等选型仍需证明适配收益，不因参考资料提及就引入全部依赖。

## 测试依据与未完成项

冻结 32 条算子案例，再依据用户新要求冻结 12 条场景槽位案例，共 44 条。旧 `checkAdminText` 在这些案例中无专门提醒；新检查输出 4 项结构提醒和 22 项槽位建议。32 条算子案例中 26 条生成候选，6 条明确未覆盖；6 条缺失槽位任务补全后对应专门提醒消失。

这不是“新增发现 26 个真实问题”，也不是精确率/召回率：这些是开发者构造的工程测试，没有独立人工金标。用户原始 FCoP 巡检任务在新算子语法中仍属未覆盖，继续由已有七参数与 B 检查提供建议，不能宣称其边界已经完整明确。

本项目的验证命令与范围见 [验证说明](VALIDATION.md)。PM 未重新试测；真实任务语料评估、跨句复杂定义归属、一般条件语言、数值约束求解未完成。没有发版，没有修改宿主权限。

## English summary

ADMIN remains model-free and local. Advice is grouped into meaning/scope, execution/delivery, and optional general constraints. The controlled grammar preserves modality distinctions and alternative approval groupings. Three task profiles provide concrete unconfirmed slots and editable templates. Definitions retain the previous explicit glossary mechanism. Source offsets use UTF-16 half-open intervals.

These are candidate interpretations, not verified intent, authorization, deadlock proofs or task-quality scores. Tests are developer-authored fixtures, not independent accuracy evidence. No Python NLP model, general SMT solver, release package or PM experiment was added in this iteration.
