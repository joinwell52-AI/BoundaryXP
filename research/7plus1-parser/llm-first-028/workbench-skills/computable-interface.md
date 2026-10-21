# 已有计算器输入接口（试验表达层）

这是workbench-formal/1的紧凑输入说明，不是新BXP协议。只使用任务需要的字段。expr的共同字段是type、key、axes；可加简短label。key用稳定对象身份及属性，可用中文。id、clause_ids、coverage及版本由程序机械生成。不得输出verdict、status、operation、result。

- quantity：role=LIMIT或VALUE；unit为明确单位（CNY/USD/minute/second/hour/count等）；lower/upper各为null或{value:"原数值字符串",inclusive:布尔值}。VALUE上下端点相同。instance表示同一费用/事件；combination=SINGLE/ADDITIVE/EXCLUSIVE/SERIAL/PARALLEL/UNKNOWN，表达原有组合含义，不计算总额。choice_model可为INDEPENDENT/UNKNOWN。缺省端点为null，缺省instance为key；combination与role必须明示。
- domain：mode=ALLOW/FORBID/SELECT；values为精确身份的字符串数组。ALLOW只用于有来源的封闭允许范围，SELECT是本任务选取的对象；同一集合的元素应属于同类同层次身份。提到的活动名称、实现步骤及效果不自动构成封闭动作集合，不因动词不同制造范围差异。活动范围通过有来源的义务、实际行为与效果条件表达；明确穷尽操作清单才用动作ALLOW。区分对象、动作、环境和版本的属性范围。
- condition：expression是必要条件的布尔结构。permission：expression是充分许可条件。结构可为true/false、{var:"事件身份"}、{all:[…]}、{any:[…]}、{not:…}、{implies:[前件,后件]}。key指向被约束事件。同一事件、条件变量的身份一致；不要枚举或求真假。
- obligation：mode=REQUIRED/CANCELLED/NOT_ASSIGNED；可带guard布尔结构及timing=ON_TRIGGER/WHILE_GUARD/EVENTUALLY。key保留责任主体、动作对象及接收者的必要区分。没有分配给某主体不等于取消另一主体义务。
- order：edges及removed均为[{from:"事件ID",to:"事件ID"}]；events可为[{id,start,end}]。保留前置、先后、开始与完成的原有关系，不计算可达性。
- conversion：from、to及factor，factor为原文系数字符串，不计算换算结果。
- selection：key指向相应数量；members为候选数量instance；min/max为原文允许选择个数的整数。
- unknown：key标识实际受影响的属性，reason说明确实缺少的原文信息。表达不了的明确结构使用条款UNSUPPORTED，不能伪装成原文缺失。

条款relations元素为{type:"PART_OF"|"SAME_AS"|"DISTINCT"|"SPECIALIZES",from:"对象/属性身份",to:"对象/属性身份"}，来源自动引用所属条款。不同费用实例用不同instance；同一笔转述沿用同一instance。分项与总量可以用PART_OF连接；主体不同本身不足以证明费用独立。

这是接口类型说明，不要求把任务凑成这些类型。若没有语义等价表达，保留具体UNSUPPORTED；不得为得到可判定结果补条件、补金额或添加执行方案。


表达以父对象的属性为参照；绑定只解释身份，不代替比较。只写义务不能替代对实际动作、接收者、环境或版本的选用表达：当父边界约束这些属性时，子选用应有对应的 domain SELECT。同一属性统一 key。仅在语义确实不同且有依据时声明 independent_of:[父key]；不能用不相关标记回避同一对象限制。

只对受约束属性定位 axes，不复制整条多轴标签；quantity 用 R，版本用 V，交付范围用 O。对真实缺少事实使用 unknown；未选背景、没有增加限制的说明用 CONTEXT，明确保留上级限制用 INHERITED。保留完整来源，不从岗位推权限，不计算是否越界。

DISTINCT声明不同对象身份，不能作为禁止或组成边；SPECIALIZES将同一集合属性的较小对象范围连接到较大范围，不进行求和。SAME_AS只用于同一对象同一属性。unknown的key应绑定实际受影响的边界属性，缺少的汇率、组合关系等写在reason中，不另造无法对齐父边界的未知对象。
