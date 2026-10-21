---
name: boundx-mathematical-model-fields
description: 为完整7+1语义解析提供未求值集合、逻辑、区间及图表达字段。
---

# mathematical_models字段的数学表达接口

你的任务是读取所有父子节点已生成的7+1，从其中的事实和关系构造可执行数学表达。没有预先列出的解析目标，也必须读完整输入；生成结构的对象名字、类型分法只是参考，不得因此漏掉跨属性的关系。不生成新的任务原文，不作业务裁决，不输出比较结果。

方法：定义目标量、事实量、集合或布尔变量；识别约束的方向；把完整7+1翻译成相应数学表达；引用支持关系的具体来源；保留单位、范围、模态及未明示事实。不要用属性名是否相同代替数学建模。

- 集合：区分允许范围约束与必须交付的覆盖约束。允许使用范围检查Selected⊆Allowed；必须具备的成员检查Required⊆Actual。模型只交付两个集合及包含表达式，由程序求差集，不提前给缺失项或结论。
- 逻辑：把具体执行、选择或状态事实写成布尔赋值约束，把父必要规则写成逻辑表达式。检查子事实是否蕴含父规则。与、或、非、蕴含允许嵌套；互斥要求恰有一个成立，不能只验证每个选项分别属于候选集合。需要计数或数值谓词时，必须接入实际量的运算，不能将相关阈值当成互不相干的新布尔变量。
- 数量和区间：区分边界与具体取值；将来源明示的计算关系写成运算，不预先算总值、比例或最终时刻。类型不相容、缺少事实或现有表达接口不能承接时，明确描述欠缺的表达式能力，不能假称原文缺事实。
- 前置关系：根据完整父子范围构造图，只表达来源明示的前置边、实际边或删除边，不按名字或角色级别猜测规则。

在统一解析输出的mathematical_models字段交付{"models":[{"formula":"未求值的数学关系","axes":["A"],"source_refs":[{"node_id":"...","clause_id":"..."}],"expression":{...}}],"unresolved":[{"reason":"具体事实或表达能力缺口","source_refs":[...]}]}。顶层仍同时保留patches及semantic_revisions；此字段接口不替换顶层格式。不返回status/verdict/result/findings或预先求值的真假、计数、差集。

expression 使用既有计算器的数学输入：

- 通用数学AST：`{kind:"mathematical_expression",expression:数学AST}`。组合算术、集合基数、数值谓词、区间及分段函数时使用；完整字段与算子见随本说明一并加载的 `mathematical-expression.md`，此接口补充下列基础输入。

- 布尔蕴含：{kind:"boolean_implication",variables:[变量身份],parent:父规则AST,child:子事实AST}。AST为true/false、{var:"身份"}、{all:[...]},{any:[...]},{not:...},{implies:[前,后]}。variables完整包含表达式中的变量，使用同一事实身份。
- 集合包含：{kind:"set_subset",parent:被包含的范围集合,child:需要包含的成员集合}。计算器执行child⊆parent。因此检查Required⊆Actual时，parent传Actual、child传Required；字段名称不改变包含方向。
- 数值区间：{kind:"interval_subset",dimension:"量身份",unit:"单位",parent:{lower:null或端点,upper:null或端点},child:{lower:null或端点,upper:null或端点}}，端点为{value:"已有精确数值字符串",inclusive:true/false}。只接受事实中已有精确值，不交付预先求出的合计。需要嵌套算术时使用通用数学AST或calculation_plans。
- 图：{kind:"dependency",edges:[{id:"唯一身份",kind:"prerequisite",from:"节点",to:"节点"}],required:[{from:"必要起点",to:"必要终点"}]}。

每个模型须给出支持其变量事实和约束关系的来源引用。不要沿用历史比较或假定的测试预期。所有比较、差集、真假与可达性由Core计算。

axes只定位表达式实际检验的父边界，不并集全部事实来源的维度。前件使用某交付内容或操作事实，不表示已对该事实的完成义务进行了验收。仍然适用且未被子方案改变的父义务由既有obligation保留，不为缺少执行完成观测追加unresolved，也不把义务写成已经发生的事实。
