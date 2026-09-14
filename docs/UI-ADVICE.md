# 界痕：两个独立工具

017 源码新增：ADMIN 从中英动作关系投影 7+1，区分执行者、审批者、文件来源、产物、接收人及条件。可展开“查看提取关系：动作、角色与条件”。文件交接现在区分“缺少产出声明”和“只有带条件的产出声明”；[原理、案例与实测](SEMANTIC-CONTRACT-017.md)。

源码 1.2.1-preview.1；当前下载包仍为 1.2.0。源码目录运行 `npm run ui` 打开本地页面。无需 CodeFlowMu。

## 给 ADMIN 的任务建议

粘贴任务，点击“本地检查，给 ADMIN 建议”。新版入口通过本机 Node 服务调用本机 Python，不调用 AI、不需要密钥，也不启动 PM。需要按 [Python 安装说明](ADMIN-PYTHON-011.md) 安装依赖。

结果按“原文证据 → 七要素与独立 B → 计算结果与具体建议”呈现。B 在七字段表外单列；区间交集、名单重叠及具体建议直接可见。局部文法提取能确认的值，交给集合、区间或逻辑计算；遇到显式 WP 则逐包展示，并检查命名文件的声明来源。原句、分类与求解记录折叠；不再为每个任务重复七条通用填空。未识别不等于原文没有声明，工具不替 ADMIN 填造预算或授权。见 [实际案例、公式和支持限制](ADMIN-BOUNDARIES-016.md)。

完整建议任务可编辑复制。是否使用由 ADMIN 决定。技术映射可在折叠详情中查看；普通用户无需手动整理。

## 测试 PM 分工与建议

PM 有独立任务输入。可直接粘贴，也可显式复制 ADMIN 原文。无需先完成 ADMIN 检查。设置模型、测试连接变绿后，可以生成 PM 拟议分工。没有实际派单或产品操作。

每份派单单独展示风险原句和给 PM 的建议，PM 汇总与交付单独列出。已检出的依赖环用红色，范围/条件变化等待核对项用橙色，映射不完整用灰色；颜色旁均有文字标签。原始答复、分类、公式和逐条计算折叠在技术详情，不必阅读它们才能看到建议。

风险归属依据计算发现中的任务位置；依赖环关联涉及的任务。无法唯一归属时明确标记，不擅自归责。现有计算覆盖动作差异、映射缺口、整体完成条件及依赖结构，不能保证发现所有领域错误或证明每个子任务的语义符合业务意图。

## PM 收到建议后改了吗

点击发送逐任务建议。工具保存实际提醒和 PM 原始回应，提取新规划并比较同编号任务的负责人、动作、依赖、交付物、完成条件及原文。

- 尚未提醒：没有后续结果。
- 已回复但新规划未完成提取/计算：不能判断重分配。
- 同编号内容变化或未变：明确显示，提供前后原文。
- 编号消失或新出现：不能自动认定为同一任务的重分配。

文本或映射变化不等于采纳建议，观察数减少不等于风险解决。工具不作业务裁决。导出的记录与报告保留提醒、回应和前后派单；导入时重新验证计算，导入文本不是服务商调用来源的证明。

## 语言、等待与费用

右上角选择中文或 English，每次只显示所选语言。原文与证据引用保持原语言。切换不刷新页面；编辑的完整任务草稿按语言保留。

仅 PM 测试有关的模型调用可能计费。等待条区分模型提取、PM 生成、规划提取和本地计算，显示耗时；浏览器每步 185 秒兜底，超时或取消解除等待，不自动重试，已有结果保留。密钥只在当前页面内存中，不导出或自动读取项目 .env。

## English

ADMIN checks call the local Python process through the local Node server, with no model calls or credentials. Results show original evidence, seven fields with B displayed independently, then computed findings and specific advice. Rule matches are not full semantic understanding or authorization. See [current examples and limitations](ADMIN-BOUNDARIES-016.md).

PM testing is independent and uses your configured model. Each assignment shows highlighted observations, source quotes and recommendations. After a reminder, the tool records the reply and compares before/after assignments. Changed wording is not proof of acceptance or resolution; unmatched task IDs remain uncertain. Technical classification and calculations are optional disclosures. Choose one UI language; original evidence stays untranslated.


## 不能做什么：独立的禁止事项检查

ADMIN 本地检查除七参数外，独立检查“不能做什么”。已有明确禁项时突出显示原句及条件；未识别到或仅写待定/占位符时提示补充，并将候选条款加入完整建议任务。七参数数据协议不变。

工具不会把“没有禁止”当作禁止，也不会把“无需修复”当作禁止修复；只包含禁止操作的句子不会充当允许动作的映射。原文未禁止某操作不意味着授权。此项是有限文字规则识别，不是完整语义解析或对 PM 的执行裁决。

An independent prohibited-actions check complements the seven parameters. Existing restrictions are quoted with their conditions; absent or unclear restrictions receive editable candidate wording. No unmentioned ban is invented, and absence of a ban grants no authority. This is local lexical checking, not a complete compliance verdict.


数学参照：在同一任务、条件和授权版本下，令 P 为计划动作集合，A 为已明确允许集合，F 为明确禁止集合。P ∩ F 表示与禁项冲突的计划动作；P \ (A ∪ F) 表示还需核对授权的动作，而非自动认定的违规。A ∩ F 非空还可能表示条件未分清或授权记录冲突。

当前新增实现是 F 的原句检查与补充提醒，不声称已自动完成所有自然语言动作的集合归一化或执行拦截。禁止事项未写记为未明确；ADMIN 可显式声明“无额外禁止事项”，但这不扩大允许范围或取消其他已有规则。先让任务文本尽量完整，是为了避免 PM 根据缺口自造要求。
# 中英上下文规则

ADMIN 新增六类完整表达与局部定义检查，使用版本化规则包；不调用模型。原理、范围、案例和测试参见 [ADMIN-LOCAL-RULES.md](ADMIN-LOCAL-RULES.md)。
